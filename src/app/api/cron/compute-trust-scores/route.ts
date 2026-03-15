import { NextResponse } from "next/server";
import { computeTrustScores } from "@/jobs/compute-trust-scores";
import { logger } from "@/lib/logger";

/**
 * POST/GET /api/cron/compute-trust-scores
 *
 * Cron endpoint for computing trust scores from LLM request telemetry.
 *
 * Triggered daily via Vercel Cron or external scheduler.
 *
 * Vercel Cron config (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/compute-trust-scores",
 *     "schedule": "0 3 * * *"
 *   }]
 * }
 *
 * Security: Requires CRON_SECRET in Authorization header.
 *
 * Query params:
 *   ?days=N     — computation window in days (default: 7)
 *   ?dry-run    — compute without writing to DB
 */
const CRON_SECRET = process.env.CRON_SECRET;

async function handler(request: Request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get("days") ?? "7", 10);
  const dryRun = url.searchParams.has("dry-run");

  try {
    const results = await computeTrustScores({ periodDays: days, dryRun });

    const summary = results.map((r) => ({
      modelId: r.modelId.slice(0, 8),
      providerId: r.providerId,
      overall: r.overallScore,
      reliability: r.reliabilityScore,
      consistency: r.consistencyScore,
      costEfficiency: r.costEfficiencyScore,
      samples: r.sampleSize,
      trend: r.trend,
    }));

    logger.info("[cron] Trust scores computed", {
      count: results.length,
      dryRun,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      modelsScored: results.length,
      dryRun,
      periodDays: days,
      scores: summary,
    });
  } catch (err) {
    logger.error("[cron] Trust score computation failed", { error: err });
    return NextResponse.json(
      { error: "Computation failed", details: String(err) },
      { status: 500 },
    );
  }
}

export const GET = handler;
export const POST = handler;
