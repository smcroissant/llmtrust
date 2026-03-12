import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "../../db";
import {
  user as userTable,
  model,
  review,
  favorite,
} from "../../db/schema";
import { eq, and, desc, asc, sql, ilike, count, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// ============================================
// Admin-only procedure
// ============================================
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const [currentUser] = await db
    .select({ role: userTable.role })
    .from(userTable)
    .where(eq(userTable.id, ctx.userId))
    .limit(1);

  if (!currentUser || currentUser.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({ ctx });
});

export const adminRouter = createTRPCRouter({
  // ============================================
  // STATS — Global platform statistics
  // ============================================
  stats: adminProcedure.query(async () => {
    const [userCount] = await db
      .select({ count: count() })
      .from(userTable);

    const [modelCount] = await db
      .select({ count: count() })
      .from(model);

    const [downloadTotal] = await db
      .select({ total: sql<number>`COALESCE(SUM(${model.downloadCount}), 0)` })
      .from(model);

    const [reviewCount] = await db
      .select({ count: count() })
      .from(review);

    // New users this week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [newUsersThisWeek] = await db
      .select({ count: count() })
      .from(userTable)
      .where(gte(userTable.createdAt, oneWeekAgo));

    // Models pending approval (draft status)
    const [pendingModels] = await db
      .select({ count: count() })
      .from(model)
      .where(eq(model.status, "draft"));

    return {
      totalUsers: Number(userCount?.count ?? 0),
      totalModels: Number(modelCount?.count ?? 0),
      totalDownloads: Number(downloadTotal?.total ?? 0),
      totalReviews: Number(reviewCount?.count ?? 0),
      newUsersThisWeek: Number(newUsersThisWeek?.count ?? 0),
      pendingModels: Number(pendingModels?.count ?? 0),
    };
  }),

  // ============================================
  // RECENT ACTIVITY — Last actions on the platform
  // ============================================
  recentActivity: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      // Recent reviews
      const recentReviews = await db
        .select({
          id: review.id,
          type: sql<string>`'review'`,
          userId: review.userId,
          userName: userTable.name,
          modelName: model.name,
          modelSlug: model.slug,
          rating: review.rating,
          createdAt: review.createdAt,
        })
        .from(review)
        .innerJoin(userTable, eq(review.userId, userTable.id))
        .innerJoin(model, eq(review.modelId, model.id))
        .orderBy(desc(review.createdAt))
        .limit(input.limit);

      // Recent models
      const recentModels = await db
        .select({
          id: model.id,
          type: sql<string>`'model'`,
          userId: model.authorId,
          userName: userTable.name,
          modelName: model.name,
          modelSlug: model.slug,
          status: model.status,
          createdAt: model.createdAt,
        })
        .from(model)
        .leftJoin(userTable, eq(model.authorId, userTable.id))
        .orderBy(desc(model.createdAt))
        .limit(input.limit);

      return {
        reviews: recentReviews,
        models: recentModels,
      };
    }),

  // ============================================
  // MODELS — List all models with filters
  // ============================================
  models: adminProcedure
    .input(
      z.object({
        status: z.enum(["all", "draft", "published", "archived"]).default("all"),
        category: z.string().optional(),
        search: z.string().optional(),
        sort: z.enum(["newest", "oldest", "name", "downloads"]).default("newest"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.status !== "all") {
        conditions.push(eq(model.status, input.status));
      }
      if (input.category) {
        conditions.push(eq(model.category, input.category));
      }
      if (input.search) {
        conditions.push(ilike(model.name, `%${input.search}%`));
      }

      const orderBy =
        input.sort === "oldest"
          ? asc(model.createdAt)
          : input.sort === "name"
            ? asc(model.name)
            : input.sort === "downloads"
              ? desc(model.downloadCount)
              : desc(model.createdAt);

      const offset = (input.page - 1) * input.limit;

      const models = await db
        .select({
          id: model.id,
          slug: model.slug,
          name: model.name,
          description: model.description,
          category: model.category,
          architecture: model.architecture,
          parameterCount: model.parameterCount,
          status: model.status,
          isFeatured: model.isFeatured,
          downloadCount: model.downloadCount,
          authorId: model.authorId,
          authorName: userTable.name,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
        })
        .from(model)
        .leftJoin(userTable, eq(model.authorId, userTable.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(offset);

      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(model)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        models,
        total: Number(totalCount),
        page: input.page,
        totalPages: Math.ceil(Number(totalCount) / input.limit),
      };
    }),

  // ============================================
  // UPDATE MODEL STATUS — Approve / Reject / Archive
  // ============================================
  updateModelStatus: adminProcedure
    .input(
      z.object({
        modelId: z.string().uuid(),
        status: z.enum(["draft", "published", "archived"]),
        isFeatured: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(model)
        .set({
          status: input.status,
          ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
          updatedAt: new Date(),
        })
        .where(eq(model.id, input.modelId))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Model not found" });
      }

      return updated;
    }),

  // ============================================
  // USERS — List all users with stats
  // ============================================
  users: adminProcedure
    .input(
      z.object({
        role: z.enum(["all", "user", "moderator", "admin"]).default("all"),
        search: z.string().optional(),
        sort: z.enum(["newest", "oldest", "name", "reviews"]).default("newest"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.role !== "all") {
        conditions.push(eq(userTable.role, input.role));
      }
      if (input.search) {
        conditions.push(
          sql`(${ilike(userTable.name, `%${input.search}%`)} OR ${ilike(userTable.email, `%${input.search}%`)})`
        );
      }

      const offset = (input.page - 1) * input.limit;

      // Subquery for review counts
      const reviewCounts = db
        .select({
          userId: review.userId,
          reviewCount: count().as("review_count"),
        })
        .from(review)
        .groupBy(review.userId)
        .as("review_counts");

      // Subquery for favorite counts
      const favoriteCounts = db
        .select({
          userId: favorite.userId,
          favoriteCount: count().as("favorite_count"),
        })
        .from(favorite)
        .groupBy(favorite.userId)
        .as("favorite_counts");

      const users = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
          image: userTable.image,
          createdAt: userTable.createdAt,
          reviewCount: sql<number>`COALESCE(${reviewCounts.reviewCount}, 0)`,
          favoriteCount: sql<number>`COALESCE(${favoriteCounts.favoriteCount}, 0)`,
        })
        .from(userTable)
        .leftJoin(reviewCounts, eq(userTable.id, reviewCounts.userId))
        .leftJoin(favoriteCounts, eq(userTable.id, favoriteCounts.userId))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(
          input.sort === "oldest"
            ? asc(userTable.createdAt)
            : input.sort === "name"
              ? asc(userTable.name)
              : desc(userTable.createdAt)
        )
        .limit(input.limit)
        .offset(offset);

      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(userTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        users,
        total: Number(totalCount),
        page: input.page,
        totalPages: Math.ceil(Number(totalCount) / input.limit),
      };
    }),

  // ============================================
  // UPDATE USER ROLE
  // ============================================
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "moderator", "admin"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent self-demotion
      if (input.userId === ctx.userId && input.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot change your own role",
        });
      }

      const [updated] = await db
        .update(userTable)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, input.userId))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return updated;
    }),

  // ============================================
  // TOGGLE FEATURED — Toggle model featured status
  // ============================================
  toggleFeatured: adminProcedure
    .input(z.object({ modelId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select({ isFeatured: model.isFeatured })
        .from(model)
        .where(eq(model.id, input.modelId))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Model not found" });
      }

      const [updated] = await db
        .update(model)
        .set({ isFeatured: !existing.isFeatured, updatedAt: new Date() })
        .where(eq(model.id, input.modelId))
        .returning();

      return updated;
    }),

  // ============================================
  // IS ADMIN — Check if current user is admin
  // ============================================
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db
      .select({ role: userTable.role })
      .from(userTable)
      .where(eq(userTable.id, ctx.userId))
      .limit(1);

    return { isAdmin: user?.role === "admin" };
  }),
});
