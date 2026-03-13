import Stripe from "stripe";

// ============================================
// Stripe Client
// ============================================

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// ============================================
// Plan Pricing (hardcoded — update with real price IDs from Stripe Dashboard)
// ============================================

export const PLANS = {
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO ?? "price_pro_placeholder",
    price: 999, // $9.99/month in cents
    features: [
      "Unlimited model access",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
  },
  team: {
    name: "Team",
    priceId: process.env.STRIPE_PRICE_TEAM ?? "price_team_placeholder",
    price: 2999, // $29.99/month in cents
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

/**
 * Determine tier from Stripe price ID
 */
export function getTierFromPriceId(priceId: string): "pro" | "team" {
  if (priceId === PLANS.team.priceId) return "team";
  return "pro";
}
