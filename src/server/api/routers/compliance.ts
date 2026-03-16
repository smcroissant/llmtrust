/**
 * Compliance tRPC Router (#89)
 *
 * Endpoints:
 * - getScore — Get compliance score for a model
 * - getChecks — Get individual checks for a model
 * - scoreModel — Trigger scoring for a model (admin)
 * - batchScore — Score all models (admin)
 * - getReport — Generate/download compliance report
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { complianceCheck, complianceScore, complianceReport, model, user as userTable } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { scoreAndPersist, batchScoreAll, assignBadge, COMPLIANCE_BADGES } from "~/server/api/services/compliance";

// Admin-only procedure (same pattern as admin.ts)
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

export const complianceRouter = createTRPCRouter({
  /**
   * Get compliance score for a model by slug.
   */
  getScore: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [mdl] = await db
        .select()
        .from(model)
        .where(eq(model.slug, input.slug))
        .limit(1);

      if (!mdl) throw new Error("Model not found");

      const [score] = await db
        .select()
        .from(complianceScore)
        .where(eq(complianceScore.modelId, mdl.id))
        .limit(1);

      return {
        model: { id: mdl.id, slug: mdl.slug, name: mdl.name },
        score: score ?? null,
        badge: score ? assignBadge(score.overallScore) : null,
        availableBadges: COMPLIANCE_BADGES,
      };
    }),

  /**
   * Get individual compliance checks for a model.
   */
  getChecks: publicProcedure
    .input(z.object({ slug: z.string(), category: z.string().optional() }))
    .query(async ({ input }) => {
      const [mdl] = await db
        .select()
        .from(model)
        .where(eq(model.slug, input.slug))
        .limit(1);

      if (!mdl) throw new Error("Model not found");

      const conditions = [eq(complianceCheck.modelId, mdl.id)];
      if (input.category) {
        conditions.push(eq(complianceCheck.category, input.category));
      }

      const checks = await db
        .select()
        .from(complianceCheck)
        .where(and(...conditions))
        .orderBy(desc(complianceCheck.checkedAt));

      return { checks, model: { id: mdl.id, slug: mdl.slug, name: mdl.name } };
    }),

  /**
   * Trigger compliance scoring for a single model (admin only).
   */
  scoreModel: adminProcedure
    .input(z.object({ modelId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await scoreAndPersist(input.modelId);
      return {
        modelId: input.modelId,
        checksRun: result.checks.length,
        overallScore: result.score.overallScore,
        badge: result.score.badge,
      };
    }),

  /**
   * Batch score all published models (admin only).
   */
  batchScore: adminProcedure.mutation(async () => {
    const result = await batchScoreAll();
    return result;
  }),

  /**
   * Get compliance leaderboard — models ranked by compliance score.
   */
  leaderboard: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ input }) => {
      const scores = await db
        .select({
          modelId: complianceScore.modelId,
          overallScore: complianceScore.overallScore,
          badge: complianceScore.badge,
          regulatoryScore: complianceScore.regulatoryScore,
          supplyChainScore: complianceScore.supplyChainScore,
          dataGovernanceScore: complianceScore.dataGovernanceScore,
          operationalScore: complianceScore.operationalScore,
          ethicalScore: complianceScore.ethicalScore,
          computedAt: complianceScore.computedAt,
          modelName: model.name,
          modelSlug: model.slug,
        })
        .from(complianceScore)
        .innerJoin(model, eq(complianceScore.modelId, model.id))
        .orderBy(desc(complianceScore.overallScore))
        .limit(input.limit);

      return scores;
    }),

  /**
   * List compliance reports for a model.
   */
  listReports: protectedProcedure
    .input(z.object({ modelId: z.string().uuid() }))
    .query(async ({ input }) => {
      const reports = await db
        .select()
        .from(complianceReport)
        .where(eq(complianceReport.modelId, input.modelId))
        .orderBy(desc(complianceReport.generatedAt));

      return reports;
    }),
});
