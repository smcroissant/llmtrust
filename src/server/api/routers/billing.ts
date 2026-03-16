import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { subscription } from "@/server/db/schema";
import {
  createCheckoutSession,
  createPortalSession,
  createStripeCustomer,
  PLANS,
  type PlanKey,
} from "@/lib/stripe";

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
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
      };
    }

    return sub;
  }),

  // ============================================
  // createCheckout — Create a Stripe Checkout session
  // ============================================
  createCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["pro", "team"]),
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
        });
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      const checkoutSession = await createCheckoutSession({
        customerId,
        priceId: plan.priceId,
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
});
