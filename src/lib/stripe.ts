import Stripe from "stripe";

// ============================================
// Stripe Client
// ============================================

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// ============================================
// Plan Pricing — Price IDs via env vars, amounts from Stripe API
// ============================================

export type BillingInterval = "monthly" | "annual";

export const PLANS = {
  pro: {
    name: "Pro",
    monthly: {
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_pro_monthly_placeholder",
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "price_pro_annual_placeholder",
    },
    features: [
      "Unlimited model access",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
  },
  team: {
    name: "Team",
    monthly: {
      priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "price_team_monthly_placeholder",
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? "price_team_annual_placeholder",
    },
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Team management",
      "Custom integrations",
      "SSO",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/**
 * Get price ID for a plan + interval combination
 */
export function getPlanPriceId(plan: PlanKey, interval: BillingInterval): string {
  return PLANS[plan][interval].priceId;
}

/**
 * Get plan details for a given price ID
 */
export function getPlanFromPriceId(priceId: string): { plan: PlanKey; interval: BillingInterval } | null {
  for (const planKey of Object.keys(PLANS) as PlanKey[]) {
    const plan = PLANS[planKey];
    for (const interval of ["monthly", "annual"] as const) {
      if (plan[interval].priceId === priceId) {
        return { plan: planKey, interval };
      }
    }
  }
  return null;
}

/**
 * Get tier from Stripe price ID
 * @deprecated Use getPlanFromPriceId instead
 */
export function getTierFromPriceId(priceId: string): "pro" | "team" {
  const result = getPlanFromPriceId(priceId);
  return result?.plan ?? "pro";
}

// ============================================
// Helper Functions
// ============================================

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
    },
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
