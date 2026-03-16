import Stripe from "stripe";
import { env } from "~/env";

// ============================================
// Stripe Client
// ============================================

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// ============================================
// Placeholder Detection & Config Validation
// ============================================

const PLACEHOLDER_PATTERNS = ["placeholder", "price_pro_", "price_team_", "price_extra_"];

function isPlaceholderPriceId(priceId: string | undefined): boolean {
  if (!priceId) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => priceId.toLowerCase().includes(pattern));
}

/**
 * Validate that all required Stripe price IDs are configured.
 * Throws in production if placeholders are detected.
 * Call this at checkout time to fail fast with a clear error.
 */
export function validateStripeConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  const isProd = process.env.NODE_ENV === "production";

  if (isPlaceholderPriceId(process.env.STRIPE_PRICE_PRO_MONTHLY)) missing.push("STRIPE_PRICE_PRO_MONTHLY");
  if (isPlaceholderPriceId(process.env.STRIPE_PRICE_PRO_ANNUAL)) missing.push("STRIPE_PRICE_PRO_ANNUAL");
  if (isPlaceholderPriceId(process.env.STRIPE_PRICE_TEAM_MONTHLY)) missing.push("STRIPE_PRICE_TEAM_MONTHLY");
  if (isPlaceholderPriceId(process.env.STRIPE_PRICE_TEAM_ANNUAL)) missing.push("STRIPE_PRICE_TEAM_ANNUAL");

  if (isProd && missing.length > 0) {
    throw new Error(
      `[STRIPE CONFIG ERROR] Production missing real Stripe price IDs: ${missing.join(", ")}. ` +
      `Create products in Stripe Dashboard, set env vars. See docs/MONETIZATION.md §4.2.`
    );
  }

  return { valid: missing.length === 0, missing };
}

// ============================================
// Plan Pricing — Price IDs via env vars, amounts for display
// ============================================

export const PLANS = {
  pro: {
    name: "Pro",
    monthly: {
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? env.STRIPE_PRICE_PRO,
      price: 1900, // $19/month in cents
      interval: "month" as const,
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_PRO_ANNUAL ?? env.STRIPE_PRICE_PRO,
      price: 18200, // $182/year in cents ($15.17/mo effective, ~20% off)
      interval: "year" as const,
    },
    features: [
      "Everything in Free",
      "Cloud inference (run models without GPU)",
      "Unlimited API access",
      "Advanced benchmarks & analytics",
      "Priority support",
      "Custom watchlists",
    ],
  },
  team: {
    name: "Team",
    monthly: {
      priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? env.STRIPE_PRICE_TEAM,
      price: 4900, // $49/month in cents
      interval: "month" as const,
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? env.STRIPE_PRICE_TEAM,
      price: 47000, // $470/year in cents ($39.17/mo effective, ~20% off)
      interval: "year" as const,
    },
    features: [
      "Everything in Pro",
      "5 seats",
      "Shared workspaces",
      "Admin dashboard",
      "Usage analytics",
      "SSO",
      "API management",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingInterval = "month" | "year";

/**
 * Get the Stripe price ID for a plan + interval combination.
 * Throws if the price ID is a placeholder (safety check).
 */
export function getPriceId(plan: PlanKey, interval: BillingInterval): string {
  const priceId = PLANS[plan][interval === "year" ? "annual" : "monthly"].priceId;
  if (isPlaceholderPriceId(priceId)) {
    throw new Error(
      `Stripe price ID for ${plan}/${interval} is a placeholder. ` +
      `Set STRIPE_PRICE_${plan.toUpperCase()}_${interval === "year" ? "ANNUAL" : "MONTHLY"} env var. ` +
      `See docs/MONETIZATION.md §4.2.`
    );
  }
  return priceId;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get price ID for a plan + interval combination (alias for getPriceId with validation)
 */
export function getPlanPriceId(plan: PlanKey, interval: BillingInterval): string {
  return getPriceId(plan, interval);
}

/**
 * Get plan details for a given price ID
 */
export function getPlanFromPriceId(priceId: string): { plan: PlanKey; interval: BillingInterval } | null {
  for (const planKey of Object.keys(PLANS) as PlanKey[]) {
    const plan = PLANS[planKey];
    if (plan.monthly.priceId === priceId) {
      return { plan: planKey, interval: "month" };
    }
    if (plan.annual.priceId === priceId) {
      return { plan: planKey, interval: "year" };
    }
  }
  return null;
}

/**
 * Determine tier from Stripe price ID (monthly or annual)
 */
export function getTierFromPriceId(priceId: string): "pro" | "team" {
  if (
    priceId === PLANS.team.monthly.priceId ||
    priceId === PLANS.team.annual.priceId
  ) {
    return "team";
  }
  return "pro";
}

/**
 * Determine billing interval from Stripe price ID
 */
export function getIntervalFromPriceId(priceId: string): BillingInterval {
  if (
    priceId === PLANS.pro.annual.priceId ||
    priceId === PLANS.team.annual.priceId
  ) {
    return "year";
  }
  return "month";
}

/**
 * Get the annual savings percentage for display
 */
export function getAnnualSavings(planKey: PlanKey): number {
  const plan = PLANS[planKey];
  const monthlyTotal = plan.monthly.price * 12;
  const annualPrice = plan.annual.price;
  return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100);
}

/**
 * Create a Stripe Customer for a user
 */
export async function createStripeCustomer(params: {
  email: string;
  name?: string;
  userId: string;
}): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      userId: params.userId,
    },
  });
}

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
    },
    subscription_data: {
      metadata: {
        userId: params.userId,
      },
      // Enable proration for mid-cycle switches
      proration_behavior: "create_prorations",
    },
  });
}

/**
 * Update an existing subscription to a new price (mid-cycle switch)
 * Handles proration automatically
 */
export async function updateSubscriptionPrice(params: {
  subscriptionId: string;
  newPriceId: string;
}): Promise<Stripe.Subscription> {
  const sub = await stripe.subscriptions.retrieve(params.subscriptionId);
  const currentItem = sub.items.data[0];

  if (!currentItem) {
    throw new Error("No subscription item found");
  }

  return stripe.subscriptions.update(params.subscriptionId, {
    items: [
      {
        id: currentItem.id,
        price: params.newPriceId,
      },
    ],
    proration_behavior: "create_prorations",
  });
}

/**
 * Create a Stripe Customer Portal Session for managing subscriptions
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

/**
 * Retrieve a subscription by ID
 */
export async function getSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}
