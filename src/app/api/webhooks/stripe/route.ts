import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { stripe, getTierFromPriceId } from "@/lib/stripe";
import { db } from "@/server/db";
import { subscription, payment } from "@/server/db/schema";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events:
 * - checkout.session.completed → create/update subscription
 * - customer.subscription.updated → update subscription status
 * - customer.subscription.deleted → cancel subscription
 * - invoice.payment_succeeded → log payment
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    logger.error("Stripe webhook signature verification failed", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  logger.info(`Stripe webhook received: ${event.type}`, {
    eventId: event.id,
    type: event.type,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice,
        );
        break;

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (err) {
    logger.error("Error processing Stripe webhook", {
      eventType: event.type,
      eventId: event.id,
      error: err instanceof Error ? err.message : "Unknown error",
    });
    // Return 200 to prevent Stripe from retrying
    // (we've logged the error for investigation)
  }

  return NextResponse.json({ received: true });
}

// ============================================
// Helpers
// ============================================

/** Extract current_period_end from a Stripe Subscription (uses items[0]) */
function getCurrentPeriodEnd(sub: Stripe.Subscription): Date | null {
  const end = sub.items.data[0]?.current_period_end;
  return end ? new Date(end * 1000) : null;
}

// ============================================
// Event Handlers
// ============================================

/**
 * checkout.session.completed
 * User completed checkout — create or update subscription
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.userId;
  if (!userId) {
    logger.error("checkout.session.completed: missing userId in metadata");
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Retrieve the full subscription to get price info
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : "pro";
  const currentPeriodEnd = getCurrentPeriodEnd(stripeSubscription);

  // Check if subscription record exists
  const [existingSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  if (existingSub) {
    // Update existing
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
    // Create new
    await db.insert(subscription).values({
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      tier,
      status: stripeSubscription.status,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    });
  }

  logger.info("Subscription created/updated from checkout", {
    userId,
    tier,
    subscriptionId,
  });
}

/**
 * customer.subscription.updated
 * Subscription changed (renewal, plan change, etc.)
 */
async function handleSubscriptionUpdated(
  stripeSubscription: Stripe.Subscription,
) {
  const userId = stripeSubscription.metadata?.userId;
  if (!userId) {
    logger.error("customer.subscription.updated: missing userId in metadata");
    return;
  }

  const priceId = stripeSubscription.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : "pro";
  const currentPeriodEnd = getCurrentPeriodEnd(stripeSubscription);

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
      updatedAt: new Date(),
    })
    .where(eq(subscription.userId, userId));

  logger.info("Subscription canceled", { userId });
}

/**
 * invoice.payment_succeeded
 * Successful payment — log it
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Access fields that may differ across API versions via index signature
  const invoiceRecord = invoice as unknown as Record<string, unknown>;
  const subscriptionDetails = invoiceRecord.subscription_details as { metadata?: Record<string, string> } | undefined;
  const paymentIntent = invoiceRecord.payment_intent as string | null | undefined;

  const userId =
    invoice.metadata?.userId ??
    subscriptionDetails?.metadata?.userId;

  let resolvedUserId = userId;

  if (!resolvedUserId) {
    // Try to find user by customer ID
    const customerId = invoice.customer as string;
    const [sub] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.stripeCustomerId, customerId))
      .limit(1);

    if (!sub) {
      logger.error("invoice.payment_succeeded: could not find user", {
        invoiceId: invoice.id,
        customerId,
      });
      return;
    }
    resolvedUserId = sub.userId;
  }

  await db.insert(payment).values({
    userId: resolvedUserId,
    stripePaymentIntentId: paymentIntent ?? null,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: "succeeded",
    description: `Invoice ${invoice.number ?? invoice.id}`,
  });

  logger.info("Payment logged", {
    userId: resolvedUserId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
  });
}
