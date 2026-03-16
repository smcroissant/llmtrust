import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { trustScore, model } from "@/server/db/schema";
import { eq, desc, and, sql, ilike } from "drizzle-orm";

/**
 * GET /api/v1/trust-scores
 *
 * Returns paginated trust scores with optional filtering.
 *
 * Query params:
 *   limit=20        — results per page (max 100)
 *   offset=0        — pagination offset
 *   provider=       — filter by provider ID
 *   model=          — filter by model name/slug (fuzzy)
 *   sort=overall    — sort field: overall, reliability, consistency, cost_efficiency
 *   period=7        — computation window in days
 *   band=           — filter by score band: excellent, good, fair, caution, unreliable
 *
 * Response:
 *   { scores: [...], total: N, limit: N, offset: N }
 */

const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
    );
    const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));
    const provider = searchParams.get("provider");
    const modelFilter = searchParams.get("model");
    const sort = searchParams.get("sort") ?? "overall";
    const period = parseInt(searchParams.get("period") ?? "7", 10);
    const band = searchParams.get("band");

    // Build conditions
    const conditions = [eq(trustScore.periodDays, period)];

    if (provider) {
      conditions.push(eq(trustScore.providerId, provider));
    }

    if (modelFilter) {
      conditions.push(ilike(model.name, `%${modelFilter}%`));
    }

    if (band) {
      const bandRanges: Record<string, [number, number]> = {
        excellent: [80, 100],
        good: [60, 79],
        fair: [40, 59],
        caution: [20, 39],
        unreliable: [0, 19],
      };
      const range = bandRanges[band];
      if (range) {
        conditions.push(
          sql`${trustScore.overallScore} >= ${range[0]} AND ${trustScore.overallScore} <= ${range[1]}`,
        );
      }
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Sort mapping
    const sortColumn =
      sort === "reliability"
        ? trustScore.reliabilityScore
        : sort === "consistency"
          ? trustScore.consistencyScore
          : sort === "cost_efficiency"
            ? trustScore.costEfficiencyScore
            : trustScore.overallScore;

    // Query
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
        modelParameterCount: model.parameterCount,
        modelArchitecture: model.architecture,
      })
      .from(trustScore)
      .innerJoin(model, eq(trustScore.modelId, model.id))
      .where(whereClause)
      .orderBy(desc(sortColumn))
      .limit(limit)
      .offset(offset);

    // Add score bands to response
    const scoresWithBands = scores.map((s) => ({
      ...s,
      band: getBandFromScore(s.overallScore),
      dataCoverage:
        s.sampleSize >= 100
          ? "high"
          : s.sampleSize >= 50
            ? "limited"
            : "insufficient",
    }));

    return NextResponse.json({
      scores: scoresWithBands,
      total: scores.length,
      limit,
      offset,
      period,
    });
  } catch (err) {
    console.error("[api/v1/trust-scores] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function getBandFromScore(score: number): string {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  if (score >= 20) return "caution";
  return "unreliable";
}
