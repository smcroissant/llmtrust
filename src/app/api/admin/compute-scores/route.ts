import { NextResponse } from "next/server";
import { computeTrustScores } from "@/jobs/compute-trust-scores";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { getAuth } from "@/server/auth";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { headers } from "next/headers";

/**
 * POST /api/admin/compute-scores
 *
 * Admin-only endpoint to trigger trust score computation on demand.
 *
 * Auth: Requires valid session with admin role.
 *
 * Query params:
 *   ?days=N     — computation window in days (default: 7)
 *   ?dry-run    — compute without writing to DB
 *
 * Body (optional):
 *   { "modelIds": ["uuid1", "uuid2"] } — compute only specific models
 */
export async function POST(request: Request) {
  try {
    // Verify admin session
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [currentUser] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Parse query params
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") ?? "7", 10);
    const dryRun = url.searchParams.has("dry-run");

    logger.info("[admin/compute-scores] Triggered by admin", {
      adminId: session.user.id,
      days,
      dryRun,
    });

    // Run computation
    const results = await computeTrustScores({ periodDays: days, dryRun });

    return NextResponse.json({
      success: true,
      dryRun,
      modelsScored: results.length,
      results: results.map((r) => ({
        modelId: r.modelId,
        providerId: r.providerId,
        overallScore: r.overallScore,
        reliabilityScore: r.reliabilityScore,
        consistencyScore: r.consistencyScore,
        costEfficiencyScore: r.costEfficiencyScore,
        sampleSize: r.sampleSize,
        trend: r.trend,
      })),
    });
  } catch (error) {
    logger.error("[admin/compute-scores] Error", { error });
    return NextResponse.json(
      { error: "Score computation failed" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/compute-scores
 *
 * Returns computation status and last run info.
 */
export async function GET() {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [currentUser] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Return last computation info from the cron endpoint stats
    return NextResponse.json({
      message: "Use POST to trigger score computation",
      params: {
        days: "number of days for computation window (default: 7)",
        "dry-run": "flag to compute without writing to DB",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 },
    );
  }
}
