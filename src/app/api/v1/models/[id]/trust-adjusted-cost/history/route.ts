import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { tacHistory, model } from "@/server/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /v1/models/{id}/trust-adjusted-cost/history
 *
 * Query params:
 *   - provider: provider ID (required)
 *   - days: number of days (default 90, max 365)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");
  const days = Math.min(365, Math.max(1, parseInt(searchParams.get("days") ?? "90")));

  if (!provider) {
    return NextResponse.json(
      { error: "Missing required query param: provider" },
      { status: 400 },
    );
  }

  try {
    // Resolve model by slug or UUID
    const [modelData] = await db
      .select({ id: model.id, name: model.name, slug: model.slug })
      .from(model)
      .where(eq(model.slug, id))
      .limit(1);

    if (!modelData) {
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
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const history = await db
      .select()
      .from(tacHistory)
      .where(
        and(
          eq(tacHistory.modelId, resolvedModel.id),
          eq(tacHistory.providerId, provider),
          gte(tacHistory.snapshotDate, cutoff),
        ),
      )
      .orderBy(tacHistory.snapshotDate);

    const results = history.map((h) => ({
      date: h.snapshotDate,
      nominalCost: {
        perMToken: parseFloat(h.nominalCostPerMToken),
        currency: "USD",
      },
      trustAdjustedCost: {
        perMToken: parseFloat(h.tacPerMToken),
        currency: "USD",
      },
      reliabilityScore: h.reliabilityScore,
      consistencyScore: h.consistencyScore,
      complianceScore: h.complianceScore,
      hallucinationRate: parseFloat(h.hallucinationRate),
    }));

    return NextResponse.json({
      data: results,
      model: { id: resolvedModel.id, name: resolvedModel.name, slug: resolvedModel.slug },
      provider,
      days,
      count: results.length,
    });
  } catch (err) {
    console.error("TAC history API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
