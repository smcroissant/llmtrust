import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";
import { trustScore, model } from "../../db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const trustScoresRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        periodDays: z.number().min(1).max(90).default(7),
        sort: z
          .enum(["overall", "reliability", "consistency", "cost_efficiency"])
          .default("overall"),
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
        .where(eq(trustScore.periodDays, input.periodDays))
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
});
