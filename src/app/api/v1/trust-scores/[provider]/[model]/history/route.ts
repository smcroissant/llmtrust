import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { trustScore, scoreSnapshot, model } from "@/server/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";

/**
 * GET /api/v1/trust-scores/[provider]/[model]/history
 *
 * Returns historical trend data for a specific model+provider.
 *
 * Query params:
 *   days=30  — number of days of history (max 90)
 *
 * Response:
 *   { model: { name, slug }, provider, currentScore: {...}, snapshots: [...] }
 */

const MAX_DAYS = 90;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string; model: string }> },
) {
  try {
    const { provider, model: modelSlug } = await params;
    const { searchParams } = new URL(request.url);
    const days = Math.min(
      MAX_DAYS,
      Math.max(1, parseInt(searchParams.get("days") ?? "30", 10)),
    );

    // Get model
    const [modelData] = await db
      .select({
        id: model.id,
        name: model.name,
        slug: model.slug,
        description: model.description,
        parameterCount: model.parameterCount,
        architecture: model.architecture,
      })
      .from(model)
      .where(eq(model.slug, modelSlug))
      .limit(1);

    if (!modelData) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Get current score
    const [currentScore] = await db
      .select()
      .from(trustScore)
      .where(
        and(
          eq(trustScore.modelId, modelData.id),
          eq(trustScore.providerId, provider),
        ),
      )
      .orderBy(desc(trustScore.computedAt))
      .limit(1);

    if (!currentScore) {
      return NextResponse.json(
        { error: "No trust scores found for this model+provider" },
        { status: 404 },
      );
    }

    // Get history snapshots
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const snapshots = await db
      .select({
        overallScore: scoreSnapshot.overallScore,
        reliabilityScore: scoreSnapshot.reliabilityScore,
        consistencyScore: scoreSnapshot.consistencyScore,
        costEfficiencyScore: scoreSnapshot.costEfficiencyScore,
        sampleSize: scoreSnapshot.sampleSize,
        snapshotDate: scoreSnapshot.snapshotDate,
      })
      .from(scoreSnapshot)
      .where(
        and(
          eq(scoreSnapshot.modelId, modelData.id),
          eq(scoreSnapshot.providerId, provider),
          gte(scoreSnapshot.snapshotDate, cutoff),
        ),
      )
      .orderBy(scoreSnapshot.snapshotDate);

    return NextResponse.json({
      model: {
        name: modelData.name,
        slug: modelData.slug,
        parameterCount: modelData.parameterCount,
        architecture: modelData.architecture,
      },
      provider,
      currentScore: {
        overallScore: currentScore.overallScore,
        reliabilityScore: currentScore.reliabilityScore,
        consistencyScore: currentScore.consistencyScore,
        costEfficiencyScore: currentScore.costEfficiencyScore,
        sampleSize: currentScore.sampleSize,
        periodDays: currentScore.periodDays,
        trend: currentScore.trend,
        computedAt: currentScore.computedAt.toISOString(),
      },
      snapshots: snapshots.map((s) => ({
        ...s,
        snapshotDate: s.snapshotDate.toISOString(),
      })),
      window: { days, from: cutoff.toISOString(), to: new Date().toISOString() },
    });
  } catch (err) {
    console.error("[api/v1/trust-scores/history] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
