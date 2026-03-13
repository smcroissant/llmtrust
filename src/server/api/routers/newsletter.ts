import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";
import { newsletterSubscriber } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { sendNewsletterConfirmation } from "@/lib/email";

export const newsletterRouter = createTRPCRouter({
  // ============================================
  // SUBSCRIBE — Double opt-in newsletter signup
  // ============================================
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      }),
    )
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();

      // Check if already subscribed
      const [existing] = await db
        .select()
        .from(newsletterSubscriber)
        .where(eq(newsletterSubscriber.email, email))
        .limit(1);

      if (existing) {
        if (existing.confirmed) {
          return {
            success: true,
            alreadySubscribed: true,
            message: "You're already subscribed to our newsletter!",
          };
        }
        // Re-send confirmation
        await sendNewsletterConfirmation(email, existing.confirmToken);
        return {
          success: true,
          alreadySubscribed: false,
          message: "Confirmation email re-sent. Check your inbox!",
        };
      }

      // Generate confirmation token
      const confirmToken = randomBytes(32).toString("hex");

      await db.insert(newsletterSubscriber).values({
        email,
        confirmToken,
      });

      // Send confirmation email
      await sendNewsletterConfirmation(email, confirmToken);

      return {
        success: true,
        alreadySubscribed: false,
        message: "Check your inbox to confirm your subscription!",
      };
    }),

  // ============================================
  // CONFIRM — Confirm subscription via token
  // ============================================
  confirm: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const [subscriber] = await db
        .select()
        .from(newsletterSubscriber)
        .where(eq(newsletterSubscriber.confirmToken, input.token))
        .limit(1);

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid confirmation link.",
        });
      }

      if (subscriber.confirmed) {
        return {
          success: true,
          message: "Your subscription is already confirmed!",
        };
      }

      await db
        .update(newsletterSubscriber)
        .set({ confirmed: true })
        .where(eq(newsletterSubscriber.id, subscriber.id));

      return {
        success: true,
        message: "Your newsletter subscription is confirmed! 🎉",
      };
    }),

  // ============================================
  // UNSUBSCRIBE — Unsubscribe via token
  // ============================================
  unsubscribe: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const [subscriber] = await db
        .select()
        .from(newsletterSubscriber)
        .where(eq(newsletterSubscriber.confirmToken, input.token))
        .limit(1);

      if (!subscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid unsubscribe link.",
        });
      }

      await db
        .delete(newsletterSubscriber)
        .where(eq(newsletterSubscriber.id, subscriber.id));

      return {
        success: true,
        message: "You've been unsubscribed. We're sorry to see you go!",
      };
    }),
});
