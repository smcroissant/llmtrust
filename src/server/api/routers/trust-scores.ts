import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";
import { trustScore, model, scoreSnapshot } from "../../db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export const trustScoresRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        periodDays: z.number().min(1).max(90).default(7),
        sort: z
          .enum(["overall", "reliability", "consistency", "cost_efficiency"])
          .default("overall"),
        provider: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const scores = await db
        .select({
          id: trustScore.id,
          modelId: trustScore.modelId,
          providerId: trustScore.providerId,
          overallScore: trustScore.overallScore,
          reliabilityScore: trustScore.reliabilityScore,
          consistencyScore: trustScore.consistencyScore,
          costEfficiencyScore: trustScore.costEfficiencyScore,
          sampleSize: trustScore.sampleSize,
          periodDays: trustScore.periodDays,
          previousOverallScore: trustScore.previousOverallScore,
          trend: trustScore.trend,
          computedAt: trustScore.computedAt,
          modelName: model.name,
          modelSlug: model.slug,
          modelArchitecture: model.architecture,
          modelParameterCount: model.parameterCount,
        })
        .from(trustScore)
        .innerJoin(model, eq(trustScore.modelId, model.id))
        .where(
          input.provider
            ? and(
                eq(trustScore.periodDays, input.periodDays),
                eq(trustScore.providerId, input.provider),
              )
            : eq(trustScore.periodDays, input.periodDays),
        )
        .orderBy(
          input.sort === "overall"
            ? desc(trustScore.overallScore)
            : input.sort === "reliability"
              ? desc(trustScore.reliabilityScore)
              : input.sort === "consistency"
                ? desc(trustScore.consistencyScore)
                : desc(trustScore.costEfficiencyScore),
        )
        .limit(input.limit);

      return { scores };
    }),

  byModelSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        periodDays: z.number().min(1).max(90).default(7),
      }),
    )
    .query(async ({ input }) => {
      const [modelData] = await db
        .select({ id: model.id })
        .from(model)
        .where(eq(model.slug, input.slug))
        .limit(1);

      if (!modelData) return null;

      const scores = await db
        .select()
        .from(trustScore)
        .where(
          sql`${trustScore.modelId} = ${modelData.id} AND ${trustScore.periodDays} = ${input.periodDays}`,
        )
        .orderBy(desc(trustScore.computedAt));

      return { scores };
    }),

  /**
   * Get historical score snapshots for a model (chart data).
   * Returns daily snapshots for score history visualization.
   */
  history: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        days: z.number().min(1).max(365).default(30),
        provider: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const [modelData] = await db
        .select({ id: model.id })
        .from(model)
        .where(eq(model.slug, input.slug))
        .limit(1);

      if (!modelData) return { snapshots: [] };

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - input.days);

      const conditions = [
        eq(scoreSnapshot.modelId, modelData.id),
        gte(scoreSnapshot.snapshotDate, cutoff),
      ];
      if (input.provider) {
        conditions.push(eq(scoreSnapshot.providerId, input.provider));
      }

      const snapshots = await db
        .select()
        .from(scoreSnapshot)
        .where(and(...conditions))
        .orderBy(scoreSnapshot.snapshotDate);

      return { snapshots };
    }),

  /**
   * List distinct providers that have trust scores.
   * Used for leaderboard filter dropdowns.
   */
  providers: publicProcedure.query(async () => {
    const rows = await db
      .selectDistinct({ providerId: trustScore.providerId })
      .from(trustScore)
      .orderBy(trustScore.providerId);

    return { providers: rows.map((r) => r.providerId) };
  }),
});
