import { z } from "zod";
import { createTRPCRouter, publicProcedure, usageEnforcedProcedure } from "../trpc";
import { db } from "../../db";
import { review, user, model } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sanitize } from "@/lib/sanitize";
import { notifyNewReview } from "@/lib/notifications";

export const reviewsRouter = createTRPCRouter({
  // ============================================
  // LIST — Get reviews for a model
  // ============================================
  list: publicProcedure
    .input(
      z.object({
        modelId: z.string().uuid(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;

      const reviews = await db
        .select({
          id: review.id,
          rating: review.rating,
          content: review.content,
          createdAt: review.createdAt,
          author: {
            name: user.name,
            image: user.image,
          },
        })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .where(eq(review.modelId, input.modelId))
        .orderBy(desc(review.createdAt))
        .limit(input.limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(review)
        .where(eq(review.modelId, input.modelId));

      return {
        reviews,
        total: Number(count),
        page: input.page,
        totalPages: Math.ceil(Number(count) / input.limit),
      };
    }),

  // ============================================
  // CREATE — Submit a review
  // ============================================
  create: usageEnforcedProcedure
    .input(
      z.object({
        modelId: z.string().uuid(),
        rating: z.number().min(1).max(5),
        content: z.string().min(1).max(5000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already reviewed this model
      const [existing] = await db
        .select()
        .from(review)
        .where(
          and(
            eq(review.modelId, input.modelId),
            eq(review.userId, ctx.userId),
          ),
        )
        .limit(1);

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this model",
        });
      }

      // Sanitize review content before storage
      const sanitizedContent = input.content ? sanitize(input.content, 5000) : null;

      const [newReview] = await db
        .insert(review)
        .values({
          modelId: input.modelId,
          userId: ctx.userId,
          rating: input.rating,
          content: sanitizedContent,
        })
        .returning();

      // Notify model author about the new review
      const [modelData] = await db
        .select({
          authorId: model.authorId,
          name: model.name,
          slug: model.slug,
        })
        .from(model)
        .where(eq(model.id, input.modelId))
        .limit(1);

      const [reviewer] = await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, ctx.userId))
        .limit(1);

      if (modelData?.authorId && modelData.authorId !== ctx.userId) {
        notifyNewReview(
          modelData.authorId,
          modelData.name,
          modelData.slug,
          reviewer?.name ?? "Someone",
          input.rating
        ).catch(console.error);
      }

      return newReview;
    }),

  // ============================================
  // UPDATE — Edit a review
  // ============================================
  update: usageEnforcedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        rating: z.number().min(1).max(5).optional(),
        content: z.string().min(1).max(5000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Sanitize review content before storage
      const sanitizedContent = input.content ? sanitize(input.content, 5000) : undefined;

      const [updated] = await db
        .update(review)
        .set({
          rating: input.rating,
          ...(sanitizedContent !== undefined && { content: sanitizedContent }),
          updatedAt: new Date(),
        })
        .where(and(eq(review.id, input.id), eq(review.userId, ctx.userId)))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return updated;
    }),
});
