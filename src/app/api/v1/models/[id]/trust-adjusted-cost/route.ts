import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { tacScore, model } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /v1/models/{id}/trust-adjusted-cost
 *
 * Returns the Trust-Adjusted Cost for a specific model.
 * Query params:
 *   - provider: filter by provider ID (optional)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");

  try {
    // Resolve model by slug or UUID
    const [modelData] = await db
      .select({ id: model.id, name: model.name, slug: model.slug })
      .from(model)
      .where(eq(model.slug, id))
      .limit(1);

    if (!modelData) {
      // Try UUID
      const [byId] = await db
        .select({ id: model.id, name: model.name, slug: model.slug })
        .from(model)
        .where(eq(model.id, id))
        .limit(1);

      if (!byId) {
        return NextResponse.json(
          { error: "Model not found" },
          { status: 404 },
        );
      }
    }

    const resolvedModel = modelData;

    const conditions = [eq(tacScore.modelId, resolvedModel.id)];
    if (provider) {
      conditions.push(eq(tacScore.providerId, provider));
    }

    const scores = await db
      .select()
      .from(tacScore)
      .where(and(...conditions))
      .orderBy(tacScore.computedAt);

    if (scores.length === 0) {
      return NextResponse.json(
        { error: "No TAC data available for this model" },
        { status: 404 },
      );
    }

    // Return the most recent score per provider
    const latestByProvider = new Map<string, (typeof scores)[0]>();
    for (const score of scores) {
      latestByProvider.set(score.providerId, score);
    }

    const results = Array.from(latestByProvider.values()).map((score) => ({
      modelId: resolvedModel.id,
      modelSlug: resolvedModel.slug,
      modelName: resolvedModel.name,
      provider: score.providerId,
      nominalCost: {
        perMToken: parseFloat(score.nominalCostPerMToken),
        currency: "USD",
      },
      trustAdjustedCost: {
        perMToken: parseFloat(score.tacPerMToken),
        currency: "USD",
      },
      breakdown: {
        reliabilityScore: score.reliabilityScore,
        reliabilityMultiplier: parseFloat(score.reliabilityMultiplier),
        hallucinationRate: parseFloat(score.hallucinationRate),
        hallucinationOverhead: parseFloat(score.hallucinationOverhead),
        consistencyScore: score.consistencyScore,
        consistencyPenalty: parseFloat(score.consistencyPenalty),
        complianceScore: score.complianceScore,
        compliancePenalty: parseFloat(score.compliancePenalty),
      },
      sampleSize: score.sampleSize,
      lastUpdated: score.computedAt,
    }));

    return NextResponse.json({ data: results });
  } catch (err) {
    console.error("TAC API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
