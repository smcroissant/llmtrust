import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { subscription } from "@/server/db/schema";
import {
  stripe,
  createCheckoutSession,
  createPortalSession,
  createStripeCustomer,
  getPlanPriceId,
  PLANS,
  type PlanKey,
  type BillingInterval,
} from "@/lib/stripe";
import { getUsage } from "@/lib/usage-metering";

export const billingRouter = createTRPCRouter({
  // ============================================
  // getSubscription — Get current user's subscription status
  // ============================================
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const [sub] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, ctx.userId))
      .limit(1);

    if (!sub) {
      return {
        tier: "free" as const,
        status: "active" as const,
        billingInterval: "monthly" as const,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
      };
    }

    return sub;
  }),

  // ============================================
  // getUsage — Get current usage stats
  // ============================================
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    return getUsage(ctx.userId);
  }),

  // ============================================
  // createCheckout — Create a Stripe Checkout session
  // ============================================
  createCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["pro", "team"]),
        interval: z.enum(["monthly", "annual"]).default("monthly"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const plan = PLANS[input.plan as PlanKey];
      if (!plan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid plan selected.",
        });
      }

      const priceId = getPlanPriceId(input.plan as PlanKey, input.interval as BillingInterval);

      // Get or create subscription record (with Stripe customer)
      const [existingSub] = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.userId))
        .limit(1);

      let customerId: string;

      if (existingSub?.stripeCustomerId) {
        customerId = existingSub.stripeCustomerId;
      } else {
        // Create Stripe customer — we need user info
        const { user: userTable } = await import("@/server/db/schema");
        const [userRecord] = await db
          .select()
          .from(userTable)
          .where(eq(userTable.id, ctx.userId))
          .limit(1);

        if (!userRecord) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        const customer = await createStripeCustomer({
          email: userRecord.email,
          name: userRecord.name,
          userId: ctx.userId,
        });

        customerId = customer.id;

        // Create subscription record
        await db.insert(subscription).values({
          userId: ctx.userId,
          stripeCustomerId: customerId,
          tier: "free",
          status: "active",
          billingInterval: "monthly",
        });
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      const checkoutSession = await createCheckoutSession({
        customerId,
        priceId,
        userId: ctx.userId,
        successUrl: `${appUrl}/dashboard/settings?checkout=success`,
        cancelUrl: `${appUrl}/pricing?checkout=canceled`,
      });

      return { url: checkoutSession.url };
    }),

  // ============================================
  // createPortal — Create a Stripe Customer Portal session
  // ============================================
  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    const [sub] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, ctx.userId))
      .limit(1);

    if (!sub?.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No Stripe customer found. Subscribe first.",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const portalSession = await createPortalSession({
      customerId: sub.stripeCustomerId,
      returnUrl: `${appUrl}/dashboard/settings`,
    });

    return { url: portalSession.url };
  }),

  // ============================================
  // switchInterval — Switch between monthly and annual billing
  // Stripe handles proration automatically
  // ============================================
  switchInterval: protectedProcedure
    .input(
      z.object({
        interval: z.enum(["monthly", "annual"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [sub] = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.userId))
        .limit(1);

      if (!sub?.stripeSubscriptionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active subscription found.",
        });
      }

      if (sub.tier === "free") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot switch billing interval on a free plan. Upgrade first.",
        });
      }

      const newInterval = input.interval as BillingInterval;
      if (sub.billingInterval === newInterval) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Already on ${newInterval} billing.`,
        });
      }

      // Get the new price ID
      const planKey = sub.tier as PlanKey;
      const priceId = getPlanPriceId(planKey, newInterval);

      // Update the Stripe subscription — proration is automatic
      const stripeSubscription = await stripe.subscriptions.retrieve(
        sub.stripeSubscriptionId,
      );

      await stripe.subscriptions.update(sub.stripeSubscriptionId, {
        items: [
          {
            id: stripeSubscription.items.data[0]!.id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations",
        metadata: {
          ...stripeSubscription.metadata,
          billingInterval: newInterval,
        },
      });

      // Update local record
      await db
        .update(subscription)
        .set({
          billingInterval: newInterval,
          updatedAt: new Date(),
        })
        .where(eq(subscription.userId, ctx.userId));

      return { success: true, interval: newInterval };
    }),
});
