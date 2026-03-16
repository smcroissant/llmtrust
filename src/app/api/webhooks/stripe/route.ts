import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, getPlanFromPriceId } from "@/lib/stripe";
import { db } from "@/server/db";
import { subscription, webhookEvent } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs"; // Need Node.js runtime for Stripe signature verification

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events with:
 * - Signature verification
 * - Idempotency (skip duplicate events)
 * - Out-of-order handling (compare timestamps)
 */
export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  // Read raw body for signature verification (must be before any parsing)
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  // Verify webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  // Idempotency check — skip if we've already processed this event
  const [existingEvent] = await db
    .select()
    .from(webhookEvent)
    .where(eq(webhookEvent.id, event.id))
    .limit(1);

  if (existingEvent) {
    console.log(`[Stripe Webhook] Skipping duplicate event: ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Log the event for idempotency
  await db.insert(webhookEvent).values({
    id: event.id,
    type: event.type,
  });

  console.log(`[Stripe Webhook] Processing: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Mark as processed
    await db
      .update(webhookEvent)
      .set({ processedAt: new Date() })
      .where(eq(webhookEvent.id, event.id));

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, err);
    // Return 200 to prevent Stripe retries for errors we can't recover from
    // Log the error for investigation
    return NextResponse.json(
      { received: true, error: "Processing error (logged)" },
      { status: 200 },
    );
  }
}

// ============================================
// Event Handlers
// ============================================

/**
 * checkout.session.completed — New subscription created via checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("[Webhook] checkout.session.completed missing userId in metadata");
    return;
  }

  const subscriptionId = session.subscription as string;
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = session.customer as string;

  // Determine tier and interval from the price
  const priceId = stripeSubscription.items.data[0]?.price.id;
  if (!priceId) return;

  const planInfo = getPlanFromPriceId(priceId);
  const tier = planInfo?.plan ?? "pro";
  const billingInterval = planInfo?.interval ?? "monthly";

  const currentPeriodEnd = new Date(
    (stripeSubscription.items.data[0]?.current_period_end ?? 0) * 1000,
  );

  // Upsert subscription record
  const [existingSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  if (existingSub) {
    await db
      .update(subscription)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        tier,
        status: stripeSubscription.status,
        stripeCurrentPeriodEnd: currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscription.userId, userId));
  } else {
    await db.insert(subscription).values({
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      tier,
      status: stripeSubscription.status,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    });
  }

  console.log(`[Webhook] Subscription activated: user=${userId}, tier=${tier}, interval=${billingInterval}`);
}

/**
 * customer.subscription.updated — Plan change, renewal, etc.
 */
async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  const userId = stripeSubscription.metadata?.userId;
  if (!userId) {
    // Try to find by customer ID
    const customerId = stripeSubscription.customer as string;
    const [existingSub] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.stripeCustomerId, customerId))
      .limit(1);

    if (!existingSub) {
      console.error("[Webhook] subscription.updated: cannot find user");
      return;
    }
    return updateSubscriptionRecord(existingSub.userId, stripeSubscription);
  }

  return updateSubscriptionRecord(userId, stripeSubscription);
}

/**
 * customer.subscription.deleted — Cancellation
 */
async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const customerId = stripeSubscription.customer as string;

  const [existingSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeCustomerId, customerId))
    .limit(1);

  if (!existingSub) {
    console.error("[Webhook] subscription.deleted: cannot find subscription for customer", customerId);
    return;
  }

  const priceId = stripeSubscription.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : "pro";
  const currentPeriodEnd = getCurrentPeriodEnd(stripeSubscription);

  // Check if we have a newer subscription update (out-of-order handling)
  const eventTimestamp = new Date(stripeSubscription.created * 1000);
  const existingSub = await db.query.subscription.findFirst({
    where: eq(subscription.userId, userId),
  });
  if (existingSub?.updatedAt && existingSub.updatedAt > eventTimestamp) {
    logger.info("subscription.updated: skipping — newer update exists");
    return;
  }

  await db
    .update(subscription)
    .set({
      tier,
      status: stripeSubscription.status,
      stripeCurrentPeriodEnd: currentPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, userId));

  logger.info("Subscription updated", {
    userId,
    tier,
    status: stripeSubscription.status,
  });
}

/**
 * customer.subscription.deleted
 * Subscription canceled/expired
 */
async function handleSubscriptionDeleted(
  stripeSubscription: Stripe.Subscription,
) {
  const userId = stripeSubscription.metadata?.userId;
  if (!userId) {
    logger.error("customer.subscription.deleted: missing userId in metadata");
    return;
  }

  await db
    .update(subscription)
    .set({
      tier: "free",
      status: "canceled",
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,

      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, existingSub.userId));

  console.log(`[Webhook] Subscription canceled: user=${existingSub.userId}`);
}

/**
 * invoice.payment_failed — Failed payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId =
    "subscription" in invoice && typeof invoice.subscription === "string"
      ? invoice.subscription
      : null;

  if (!subscriptionId) return;

  const [existingSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeCustomerId, customerId))
    .limit(1);

  if (!existingSub) {
    console.error("[Webhook] invoice.payment_failed: cannot find subscription");
    return;
  }

  await db
    .update(subscription)
    .set({
      status: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, existingSub.userId));

  console.log(`[Webhook] Payment failed: user=${existingSub.userId}, status=past_due`);
}

// ============================================
// Helpers
// ============================================

/**
 * Update subscription record from Stripe subscription object
 */
async function updateSubscriptionRecord(
  userId: string,
  stripeSubscription: Stripe.Subscription,
) {
  const priceId = stripeSubscription.items.data[0]?.price.id;
  if (!priceId) return;

  const planInfo = getPlanFromPriceId(priceId);
  const tier = planInfo?.plan ?? "pro";
  const billingInterval = planInfo?.interval ?? "monthly";

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    active: "active",
    canceled: "canceled",
    past_due: "past_due",
    unpaid: "unpaid",
    incomplete: "incomplete",
    incomplete_expired: "incomplete_expired",
    trialing: "trialing",
  };
  const status = statusMap[stripeSubscription.status] ?? "active";

  const currentPeriodEnd = new Date(
    (stripeSubscription.items.data[0]?.current_period_end ?? 0) * 1000,
  );

  await db
    .update(subscription)
    .set({
      tier,
      status,
      interval: billingInterval,

      stripeCurrentPeriodEnd: currentPeriodEnd,

      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, userId));

  console.log(`[Webhook] Subscription updated: user=${userId}, tier=${tier}, status=${status}, interval=${billingInterval}`);
}
