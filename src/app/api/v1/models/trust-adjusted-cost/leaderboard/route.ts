import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { tacScore, model } from "@/server/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /v1/models/trust-adjusted-cost/leaderboard
 *
 * Query params:
 *   - limit: number of results (default 20, max 100)
 *   - provider: filter by provider ID
 *   - sortBy: "tac" | "nominal" | "penalty" (default "tac")
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const provider = searchParams.get("provider");
  const sortBy = searchParams.get("sortBy") ?? "tac";

  try {
    const conditions = provider
      ? eq(tacScore.providerId, provider)
      : undefined;

    const orderBy =
      sortBy === "nominal"
        ? desc(tacScore.nominalCostPerMToken)
        : sortBy === "penalty"
          ? desc(sql`${tacScore.tacPerMToken}::numeric - ${tacScore.nominalCostPerMToken}::numeric`)
          : desc(tacScore.tacPerMToken);

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
        sampleSize: tacScore.sampleSize,
        computedAt: tacScore.computedAt,
        modelName: model.name,
        modelSlug: model.slug,
      })
      .from(tacScore)
      .innerJoin(model, eq(tacScore.modelId, model.id))
      .where(conditions)
      .orderBy(orderBy)
      .limit(limit);

    const results = scores.map((score) => ({
      modelId: score.modelId,
      modelSlug: score.modelSlug,
      modelName: score.modelName,
      provider: score.providerId,
      nominalCost: {
        perMToken: parseFloat(score.nominalCostPerMToken),
        currency: "USD",
      },
      trustAdjustedCost: {
        perMToken: parseFloat(score.tacPerMToken),
        currency: "USD",
      },
      penalty: parseFloat(score.tacPerMToken) - parseFloat(score.nominalCostPerMToken),
      reliabilityScore: score.reliabilityScore,
      consistencyScore: score.consistencyScore,
      complianceScore: score.complianceScore,
      hallucinationRate: parseFloat(score.hallucinationRate),
      sampleSize: score.sampleSize,
      lastUpdated: score.computedAt,
    }));

    return NextResponse.json({ data: results, count: results.length });
  } catch (err) {
    console.error("TAC leaderboard API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
