import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { user as userTable, favorite, model, apiKey, review } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomBytes, createHash } from "crypto";
import { sanitize, sanitizeUrl } from "@/lib/sanitize";

export const userRouter = createTRPCRouter({
  // ============================================
  // ME — Current user profile + stats
  // ============================================
  me: protectedProcedure.query(async ({ ctx }) => {
    const [currentUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, ctx.userId))
      .limit(1);

    if (!currentUser) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    // Get stats
    const [favCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(favorite)
      .where(eq(favorite.userId, ctx.userId));

    const [reviewCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(review)
      .where(eq(review.userId, ctx.userId));

    return {
      ...currentUser,
      stats: {
        favorites: Number(favCount?.count ?? 0),
        reviews: Number(reviewCount?.count ?? 0),
        uploads: 0,
      },
    };
  }),

  // ============================================
  // UPDATE PROFILE — Update name, image, bio
  // ============================================
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Sanitize inputs
      const sanitizedName = input.name ? sanitize(input.name, 100) : undefined;
      const sanitizedImage = input.image !== undefined ? sanitizeUrl(input.image) : undefined;

      const [updated] = await db
        .update(userTable)
        .set({
          ...(sanitizedName && { name: sanitizedName }),
          ...(sanitizedImage !== undefined && { image: sanitizedImage }),
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, ctx.userId))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return updated;
    }),

  // ============================================
  // FAVORITES — List user's favorited models
  // ============================================
  favorites: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await db
      .select({
        id: favorite.id,
        createdAt: favorite.createdAt,
        model: {
          id: model.id,
          slug: model.slug,
          name: model.name,
          description: model.description,
          parameterCount: model.parameterCount,
          architecture: model.architecture,
          downloadCount: model.downloadCount,
        },
      })
      .from(favorite)
      .innerJoin(model, eq(favorite.modelId, model.id))
      .where(eq(favorite.userId, ctx.userId))
      .orderBy(desc(favorite.createdAt));

    return favorites;
  }),

  // ============================================
  // IS FAVORITE — Check if model is favorited
  // ============================================
  isFavorite: protectedProcedure
    .input(z.object({ modelId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(favorite)
        .where(
          and(
            eq(favorite.userId, ctx.userId),
            eq(favorite.modelId, input.modelId),
          ),
        )
        .limit(1);

      return { favorited: !!existing };
    }),

  // ============================================
  // TOGGLE FAVORITE — Add/remove from favorites
  // ============================================
  toggleFavorite: protectedProcedure
    .input(z.object({ modelId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(favorite)
        .where(
          and(
            eq(favorite.userId, ctx.userId),
            eq(favorite.modelId, input.modelId),
          ),
        )
        .limit(1);

      if (existing) {
        await db
          .delete(favorite)
          .where(eq(favorite.id, existing.id));
        return { favorited: false };
      } else {
        await db.insert(favorite).values({
          userId: ctx.userId,
          modelId: input.modelId,
        });
        return { favorited: true };
      }
    }),

  // ============================================
  // RECENT REVIEWS — Last 5 reviews by user
  // ============================================
  recentReviews: protectedProcedure.query(async ({ ctx }) => {
    const reviews = await db
      .select({
        id: review.id,
        rating: review.rating,
        content: review.content,
        createdAt: review.createdAt,
        model: {
          id: model.id,
          slug: model.slug,
          name: model.name,
        },
      })
      .from(review)
      .innerJoin(model, eq(review.modelId, model.id))
      .where(eq(review.userId, ctx.userId))
      .orderBy(desc(review.createdAt))
      .limit(5);

    return reviews;
  }),

  // ============================================
  // API KEYS — For Electron app authentication
  // ============================================
  apiKeys: protectedProcedure.query(async ({ ctx }) => {
    const keys = await db
      .select({
        id: apiKey.id,
        prefix: apiKey.prefix,
        name: apiKey.name,
        lastUsedAt: apiKey.lastUsedAt,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      })
      .from(apiKey)
      .where(eq(apiKey.userId, ctx.userId))
      .orderBy(desc(apiKey.createdAt));

    return keys;
  }),

  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).default("Default"),
        expiresInDays: z.number().min(1).max(365).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rawKey = `llmt_${randomBytes(32).toString("hex")}`;
      const hashedKey = createHash("sha256").update(rawKey).digest("hex");

      const expiresAt = input.expiresInDays
        ? new Date(Date.now() + input.expiresInDays * 86400000)
        : null;

      await db.insert(apiKey).values({
        id: randomBytes(16).toString("hex"),
        userId: ctx.userId,
        key: hashedKey,
        prefix: rawKey.slice(0, 10),
        name: input.name,
        expiresAt,
      });

      // Return the raw key ONLY at creation time
      return {
        key: rawKey,
        prefix: rawKey.slice(0, 10),
        name: input.name,
        expiresAt,
        message: "Store this key securely. It will not be shown again.",
      };
    }),

  revokeApiKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(apiKey)
        .where(and(eq(apiKey.id, input.id), eq(apiKey.userId, ctx.userId)));
      return { success: true };
    }),
});
