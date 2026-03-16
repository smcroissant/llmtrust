/**
 * GET /v1/compliance-scores?model=<slug>
 * GET /v1/compliance-scores?badge=enterprise_ready&limit=20
 *
 * Returns compliance scores for models.
 */

import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { complianceScore, model } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { assignBadge, COMPLIANCE_BADGES } from "~/server/api/services/compliance";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelSlug = searchParams.get("model");
    const badgeFilter = searchParams.get("badge");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

    // Single model by slug
    if (modelSlug) {
      const [mdl] = await db
        .select()
        .from(model)
        .where(eq(model.slug, modelSlug))
        .limit(1);

      if (!mdl) {
        return NextResponse.json(
          { error: "Model not found" },
          { status: 404 },
        );
      }

      const [score] = await db
        .select()
        .from(complianceScore)
        .where(eq(complianceScore.modelId, mdl.id))
        .limit(1);

      return NextResponse.json({
        model: { id: mdl.id, slug: mdl.slug, name: mdl.name },
        compliance: score
          ? {
              ...score,
              badge: assignBadge(score.overallScore),
            }
          : null,
      });
    }

    // Leaderboard with optional badge filter
    const conditions = [];
    if (badgeFilter) {
      conditions.push(eq(complianceScore.badge, badgeFilter));
    }

    const scores = await db
      .select({
        modelId: complianceScore.modelId,
        modelName: model.name,
        modelSlug: model.slug,
        overallScore: complianceScore.overallScore,
        badge: complianceScore.badge,
        regulatoryScore: complianceScore.regulatoryScore,
        supplyChainScore: complianceScore.supplyChainScore,
        dataGovernanceScore: complianceScore.dataGovernanceScore,
        operationalScore: complianceScore.operationalScore,
        ethicalScore: complianceScore.ethicalScore,
        totalChecks: complianceScore.totalChecks,
        passedChecks: complianceScore.passedChecks,
        failedChecks: complianceScore.failedChecks,
        computedAt: complianceScore.computedAt,
      })
      .from(complianceScore)
      .innerJoin(model, eq(complianceScore.modelId, model.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(complianceScore.overallScore))
      .limit(limit);

    return NextResponse.json({
      scores,
      meta: {
        total: scores.length,
        badgeTypes: COMPLIANCE_BADGES.map((b) => ({
          tier: b.tier,
          label: b.label,
          minScore: b.minScore,
        })),
      },
    });
  } catch (error) {
    console.error("Compliance scores API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
