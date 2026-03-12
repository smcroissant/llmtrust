import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { favorite, model, apiKey } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomBytes, createHash } from "crypto";

export const userRouter = createTRPCRouter({
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
