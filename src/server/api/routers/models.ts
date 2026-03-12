import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { model, like, favorite, review } from "../../db/schema";
import { eq, and, desc, asc, sql, ilike, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const modelsRouter = createTRPCRouter({
  // ============================================
  // LIST — Discovery endpoint
  // ============================================
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        tags: z.array(z.string()).optional(),
        architecture: z.string().optional(),
        sort: z
          .enum(["popular", "newest", "name", "downloads"])
          .default("popular"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        featured: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      const conditions = [eq(model.status, "published")];

      if (input.category) {
        conditions.push(eq(model.category, input.category));
      }
      if (input.search) {
        conditions.push(ilike(model.name, `%${input.search}%`));
      }
      if (input.architecture) {
        conditions.push(eq(model.architecture, input.architecture));
      }
      if (input.featured !== undefined) {
        conditions.push(eq(model.isFeatured, input.featured));
      }

      const orderBy =
        input.sort === "newest"
          ? desc(model.createdAt)
          : input.sort === "name"
            ? asc(model.name)
            : input.sort === "downloads"
              ? desc(model.downloadCount)
              : desc(model.isFeatured); // popular = featured first

      const offset = (input.page - 1) * input.limit;

      const models = await db
        .select()
        .from(model)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(model)
        .where(and(...conditions));

      return {
        models,
        total: Number(count),
        page: input.page,
        totalPages: Math.ceil(Number(count) / input.limit),
      };
    }),

  // ============================================
  // GET — Single model detail
  // ============================================
  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [modelData] = await db
        .select()
        .from(model)
        .where(and(eq(model.slug, input.slug), eq(model.status, "published")))
        .limit(1);

      if (!modelData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Model not found" });
      }

      // Get review stats
      const [stats] = await db
        .select({
          avgRating: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
          reviewCount: sql<number>`COUNT(${review.id})`,
        })
        .from(review)
        .where(eq(review.modelId, modelData.id));

      return {
        ...modelData,
        avgRating: Number(stats?.avgRating ?? 0),
        reviewCount: Number(stats?.reviewCount ?? 0),
      };
    }),

  // ============================================
  // DOWNLOAD-URL — For Electron app
  // Returns the HuggingFace download URL
  // ============================================
  downloadUrl: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        quantization: z.string().optional(), // e.g., "Q4_K_M"
      }),
    )
    .query(async ({ input }) => {
      const [modelData] = await db
        .select()
        .from(model)
        .where(and(eq(model.slug, input.slug), eq(model.status, "published")))
        .limit(1);

      if (!modelData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Model not found" });
      }

      // Increment download count
      await db
        .update(model)
        .set({ downloadCount: sql`${model.downloadCount} + 1` })
        .where(eq(model.id, modelData.id));

      // Build download URL (supports quantization suffix for HuggingFace)
      let downloadUrl = modelData.downloadUrl;
      if (input.quantization && modelData.localExecution?.quantizations) {
        // Append quantization file pattern for HuggingFace
        downloadUrl = `${downloadUrl}/resolve/main/*-${input.quantization}.gguf`;
      }

      return {
        url: downloadUrl,
        name: modelData.name,
        slug: modelData.slug,
        quantization: input.quantization ?? modelData.localExecution?.defaultQuantization,
      };
    }),

  // ============================================
  // METADATA — For Electron local execution
  // Returns all metadata needed to run the model locally
  // ============================================
  metadata: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [modelData] = await db
        .select({
          slug: model.slug,
          name: model.name,
          architecture: model.architecture,
          parameterCount: model.parameterCount,
          contextLength: model.contextLength,
          license: model.license,
          downloadUrl: model.downloadUrl,
          localExecution: model.localExecution,
        })
        .from(model)
        .where(and(eq(model.slug, input.slug), eq(model.status, "published")))
        .limit(1);

      if (!modelData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Model not found" });
      }

      return {
        slug: modelData.slug,
        name: modelData.name,
        architecture: modelData.architecture,
        parameterCount: modelData.parameterCount,
        contextLength: modelData.contextLength,
        license: modelData.license,
        downloadUrl: modelData.downloadUrl,
        // Local execution config
        format: modelData.localExecution?.format ?? "gguf",
        quantizations: modelData.localExecution?.quantizations ?? [],
        defaultQuantization: modelData.localExecution?.defaultQuantization,
        systemPrompt: modelData.localExecution?.systemPrompt,
        stopTokens: modelData.localExecution?.stopTokens,
        templateFormat: modelData.localExecution?.templateFormat,
        customTemplate: modelData.localExecution?.customTemplate,
        eosToken: modelData.localExecution?.eosToken,
        bosToken: modelData.localExecution?.bosToken,
        recommendedRam: modelData.localExecution?.recommendedRam,
        minRam: modelData.localExecution?.minRam,
      };
    }),

  // ============================================
  // CATEGORIES — List all categories with counts
  // ============================================
  categories: publicProcedure.query(async () => {
    const categories = await db
      .select({
        category: model.category,
        count: sql<number>`count(*)`,
      })
      .from(model)
      .where(eq(model.status, "published"))
      .groupBy(model.category)
      .orderBy(desc(sql`count(*)`));

    return categories.map((c) => ({
      name: c.category,
      slug: c.category?.toLowerCase().replace(/\s+/g, "-"),
      count: Number(c.count),
    }));
  }),

  // ============================================
  // STATS — Platform statistics
  // ============================================
  stats: publicProcedure.query(async () => {
    const [modelCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(model)
      .where(eq(model.status, "published"));

    const [downloadTotal] = await db
      .select({ total: sql<number>`COALESCE(SUM(${model.downloadCount}), 0)` })
      .from(model)
      .where(eq(model.status, "published"));

    return {
      totalModels: Number(modelCount?.count ?? 0),
      totalDownloads: Number(downloadTotal?.total ?? 0),
    };
  }),
});
