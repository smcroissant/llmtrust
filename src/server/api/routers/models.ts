import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { model, like, favorite, review } from "../../db/schema";
import { eq, and, desc, asc, sql, ilike, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

// Size range helpers for parameter count filtering
function parseParamSize(paramCount: string | null): number | null {
  if (!paramCount) return null;
  const match = paramCount.match(/([\d.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (paramCount.toLowerCase().includes("t")) return num * 1000; // trillion
  if (paramCount.toLowerCase().includes("b")) return num; // billion
  if (paramCount.toLowerCase().includes("m")) return num / 1000; // million
  if (paramCount.toLowerCase().includes("k")) return num / 1_000_000; // thousand
  return num;
}

export const modelsRouter = createTRPCRouter({
  // ============================================
  // LIST — Discovery endpoint with advanced filters
  // ============================================
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        tags: z.array(z.string()).optional(),
        architecture: z.string().optional(),
        license: z.string().optional(),
        size: z.enum(["lt1b", "1b-10b", "10b-70b", "70bplus"]).optional(),
        sort: z
          .enum(["popular", "newest", "name", "downloads", "parameters"])
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
        // Search in name, description, and architecture
        conditions.push(
          or(
            ilike(model.name, `%${input.search}%`),
            ilike(model.description, `%${input.search}%`),
            ilike(model.architecture, `%${input.search}%`),
          )!
        );
      }
      if (input.architecture) {
        conditions.push(eq(model.architecture, input.architecture));
      }
      if (input.license) {
        conditions.push(ilike(model.license, `%${input.license}%`));
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
              : input.sort === "parameters"
                ? desc(model.parameterCount)
                : desc(model.downloadCount); // popular = downloads

      const offset = (input.page - 1) * input.limit;

      let models = await db
        .select()
        .from(model)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(offset);

      // Apply size filter in memory (parameterCount is a string like "7B", "70B")
      if (input.size) {
        models = models.filter((m) => {
          const sizeInB = parseParamSize(m.parameterCount);
          if (sizeInB === null) return input.size === "lt1b"; // null goes to smallest
          switch (input.size) {
            case "lt1b":
              return sizeInB < 1;
            case "1b-10b":
              return sizeInB >= 1 && sizeInB < 10;
            case "10b-70b":
              return sizeInB >= 10 && sizeInB < 70;
            case "70bplus":
              return sizeInB >= 70;
            default:
              return true;
          }
        });
      }

      // Get total count (without size filter for accuracy, or with it)
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
  // FILTERS — Available filter options
  // ============================================
  filters: publicProcedure.query(async () => {
    const allModels = await db
      .select({
        category: model.category,
        architecture: model.architecture,
        license: model.license,
      })
      .from(model)
      .where(eq(model.status, "published"));

    const categories = [
      ...new Set(allModels.map((m) => m.category).filter(Boolean)),
    ].sort();
    const architectures = [
      ...new Set(allModels.map((m) => m.architecture).filter(Boolean)),
    ].sort();
    const licenses = [
      ...new Set(allModels.map((m) => m.license).filter(Boolean)),
    ].sort();

    return { categories, architectures, licenses };
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

  // ============================================
  // CREATE — Upload a new model (protected)
  // ============================================
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z
          .string()
          .min(1)
          .max(255)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
        description: z.string().min(1),
        longDescription: z.string().optional(),
        architecture: z.string().max(100).optional(),
        parameterCount: z.string().max(50).optional(),
        contextLength: z.number().int().positive().optional(),
        license: z.string().max(100).optional(),
        category: z.string().max(100).optional(),
        downloadUrl: z.string().url("Must be a valid URL"),
        tags: z.array(z.string()).default([]),
        format: z.enum(["gguf", "safetensors", "pytorch", "onnx"]).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check slug uniqueness
      const [existing] = await db
        .select({ id: model.id })
        .from(model)
        .where(eq(model.slug, input.slug))
        .limit(1);

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A model with this slug already exists",
        });
      }

      const [newModel] = await db
        .insert(model)
        .values({
          name: input.name,
          slug: input.slug,
          authorId: ctx.userId,
          description: input.description,
          longDescription: input.longDescription ?? null,
          architecture: input.architecture ?? null,
          parameterCount: input.parameterCount ?? null,
          contextLength: input.contextLength ?? null,
          license: input.license ?? null,
          category: input.category ?? null,
          downloadUrl: input.downloadUrl,
          tags: input.tags,
          status: "pending",
          localExecution: input.format ? { format: input.format } : null,
        })
        .returning({ id: model.id, slug: model.slug });

      return newModel;
    }),
});
