import Stripe from "stripe";

// ============================================
// Stripe Client
// ============================================

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// ============================================
// Plan Pricing — Price IDs via env vars, amounts for display
// ============================================

export type BillingInterval = "month" | "year";

export const PLANS = {
  pro: {
    name: "Pro",
    monthly: {
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_pro_monthly_placeholder",
      price: 1900, // $19/month in cents
      interval: "month" as const,
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "price_pro_annual_placeholder",
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
      priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "price_team_monthly_placeholder",
      price: 4900, // $49/month in cents
      interval: "month" as const,
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? "price_team_annual_placeholder",
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
export type BillingInterval = "monthly" | "annual";

/**
 * Get the Stripe price ID for a plan + interval combination
 */
export function getPriceId(plan: PlanKey, interval: BillingInterval): string {
  return PLANS[plan][interval].priceId;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get price ID for a plan + interval combination
 */
export function getPlanPriceId(plan: PlanKey, interval: BillingInterval): string {
  return PLANS[plan][interval === "year" ? "annual" : "monthly"].priceId;
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
