import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";
import { tacScore, tacHistory, model, trustScore } from "../../db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { computeTAC } from "../../../lib/tac";

export const tacRouter = createTRPCRouter({
  /**
   * Get TAC leaderboard — all models sorted by trust-adjusted cost
   */
  leaderboard: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        provider: z.string().optional(),
        sortBy: z.enum(["tac", "nominal", "penalty"]).default("tac"),
      }),
    )
    .query(async ({ input }) => {
      const scores = await db
        .select({
          id: tacScore.id,
          modelId: tacScore.modelId,
          providerId: tacScore.providerId,
          nominalCostPerMToken: tacScore.nominalCostPerMToken,
          tacPerMToken: tacScore.tacPerMToken,
          reliabilityScore: tacScore.reliabilityScore,
          consistencyScore: tacScore.consistencyScore,
          complianceScore: tacScore.complianceScore,
          hallucinationRate: tacScore.hallucinationRate,
          reliabilityMultiplier: tacScore.reliabilityMultiplier,
          hallucinationOverhead: tacScore.hallucinationOverhead,
          consistencyPenalty: tacScore.consistencyPenalty,
          compliancePenalty: tacScore.compliancePenalty,
          sampleSize: tacScore.sampleSize,
          computedAt: tacScore.computedAt,
          modelName: model.name,
          modelSlug: model.slug,
        })
        .from(tacScore)
        .innerJoin(model, eq(tacScore.modelId, model.id))
        .where(
          input.provider
            ? eq(tacScore.providerId, input.provider)
            : undefined,
        )
        .orderBy(
          input.sortBy === "tac"
            ? desc(tacScore.tacPerMToken)
            : input.sortBy === "nominal"
              ? desc(tacScore.nominalCostPerMToken)
              : desc(sql`${tacScore.tacPerMToken}::numeric - ${tacScore.nominalCostPerMToken}::numeric`),
        )
        .limit(input.limit);

      return { scores };
    }),

  /**
   * Get TAC for a specific model by slug
   */
  byModelSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [modelData] = await db
        .select({ id: model.id, name: model.name, slug: model.slug })
        .from(model)
        .where(eq(model.slug, input.slug))
        .limit(1);

      if (!modelData) return null;

      const scores = await db
        .select()
        .from(tacScore)
        .where(eq(tacScore.modelId, modelData.id))
        .orderBy(desc(tacScore.computedAt));

      return { model: modelData, scores };
    }),

  /**
   * Get TAC history for trend charts (30/60/90 days)
   */
  history: publicProcedure
    .input(
      z.object({
        modelId: z.string().uuid(),
        providerId: z.string(),
        days: z.number().min(1).max(365).default(90),
      }),
    )
    .query(async ({ input }) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - input.days);

      const history = await db
        .select()
        .from(tacHistory)
        .where(
          and(
            eq(tacHistory.modelId, input.modelId),
            eq(tacHistory.providerId, input.providerId),
            gte(tacHistory.snapshotDate, cutoff),
          ),
        )
        .orderBy(tacHistory.snapshotDate);

      return { history };
    }),

  /**
   * Compare TAC for multiple models (up to 4)
   */
  compare: publicProcedure
    .input(
      z.object({
        slugs: z.array(z.string()).min(1).max(4),
      }),
    )
    .query(async ({ input }) => {
      const modelsData = await db
        .select({ id: model.id, name: model.name, slug: model.slug })
        .from(model)
        .where(sql`${model.slug} IN (${input.slugs.map((s) => `'${s}'`).join(",")})`);

      if (modelsData.length === 0) return { models: [] };

      const modelIds = modelsData.map((m) => m.id);

      const scores = await db
        .select()
        .from(tacScore)
        .where(
          sql`${tacScore.modelId} IN (${modelIds.map((id) => `'${id}'`).join(",")})`,
        )
        .orderBy(desc(tacScore.computedAt));

      // Group by model
      const result = modelsData.map((m) => ({
        model: m,
        tacScores: scores.filter((s) => s.modelId === m.id),
      }));

      return { models: result };
    }),

  /**
   * Get available providers for filtering
   */
  providers: publicProcedure.query(async () => {
    const providers = await db
      .selectDistinct({ providerId: tacScore.providerId })
      .from(tacScore);

    return providers.map((p) => p.providerId);
  }),

  /**
   * Compute TAC on-the-fly from trust scores (for models without pre-computed TAC)
   * This bridges the gap until the cron job populates tac_scores
   */
  computeFromTrustScores: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ input }) => {
      // Get trust scores with model data
      const scores = await db
        .select({
          modelId: trustScore.modelId,
          providerId: trustScore.providerId,
          reliabilityScore: trustScore.reliabilityScore,
          consistencyScore: trustScore.consistencyScore,
          costEfficiencyScore: trustScore.costEfficiencyScore,
          overallScore: trustScore.overallScore,
          sampleSize: trustScore.sampleSize,
          modelName: model.name,
          modelSlug: model.slug,
        })
        .from(trustScore)
        .innerJoin(model, eq(trustScore.modelId, model.id))
        .orderBy(desc(trustScore.overallScore))
        .limit(input.limit);

      // Compute TAC from trust scores
      // We approximate hallucination rate from overall score:
      // Higher trust score = lower hallucination rate
      // complianceScore approximated from reliability (until we have real compliance data)
      const results = scores.map((s) => {
        // Approximate nominal cost (in real system this comes from pricing data)
        const nominalCost = estimateNominalCost(s.providerId);

        // Approximate hallucination rate from overall score
        // 100 overall → ~2% hallucination, 50 overall → ~15% hallucination
        const hallucinationRate = Math.max(
          0.02,
          0.2 - (s.overallScore / 100) * 0.18,
        );

        const tac = computeTAC({
          nominalCostPerMToken: nominalCost,
          reliabilityScore: s.reliabilityScore,
          hallucinationRate,
          consistencyScore: s.consistencyScore,
          complianceScore: s.reliabilityScore, // proxy until real compliance data
        });

        return {
          modelId: s.modelId,
          providerId: s.providerId,
          modelName: s.modelName,
          modelSlug: s.modelSlug,
          ...tac,
          sampleSize: s.sampleSize,
        };
      });

      return { scores: results };
    }),
});

/**
 * Estimate nominal cost per million tokens based on provider.
 * In production, this comes from a pricing table.
 */
function estimateNominalCost(providerId: string): number {
  const costs: Record<string, number> = {
    openai: 15.0,
    anthropic: 18.0,
    google: 7.0,
    meta: 2.0,
    mistral: 4.0,
    cohere: 6.0,
    deepseek: 1.5,
  };
  return costs[providerId.toLowerCase()] ?? 10.0;
}
