/**
 * Compute Trust Scores — Cron job for processing LLM request telemetry.
 *
 * Queries llm_requests for the last N days, groups by model+provider,
 * computes dimensional scores, and stores results in trust_scores + snapshots.
 *
 * Run via:
 *   npm run trust-scores:compute
 *   or via cron endpoint: /api/cron/compute-trust-scores
 *
 * Usage:
 *   npx tsx src/jobs/compute-trust-scores.ts [--days=7] [--dry-run]
 */

import { db } from "@/server/db";
import { llmRequest, trustScore, scoreSnapshot, model } from "@/server/db/schema";
import { eq, and, gte, sql, desc, isNotNull, inArray } from "drizzle-orm";
import { MIN_SAMPLE_THRESHOLD } from "@/services/data-collector";
import { logger } from "@/lib/logger";

// ─── Types ─────────────────────────────────────────────────────────────────

interface RequestStats {
  modelId: string;
  providerId: string;
  sampleSize: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  latencyStdDev: number;
  errorRate: number; // 0-1
  rateLimitRate: number; // 0-1
  avgTokensIn: number;
  avgTokensOut: number;
  avgCostMicroCents: number;
  uniqueUserHashes: number;
}

interface ComputedScores {
  modelId: string;
  providerId: string;
  overallScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  costEfficiencyScore: number;
  sampleSize: number;
  trend: "up" | "down" | "stable";
  previousOverallScore: number | null;
}

// ─── Score Computation ─────────────────────────────────────────────────────

/**
 * Compute reliability score (0-100).
 * Based on: error rate, rate-limit rate, HTTP status distribution.
 *
 * - 0 errors → 100
 * - Every 1% error rate → -5 points
 * - Every 1% rate limit rate → -3 points
 */
function computeReliabilityScore(stats: RequestStats): number {
  const errorPenalty = stats.errorRate * 100 * 5;
  const rateLimitPenalty = stats.rateLimitRate * 100 * 3;
  return Math.max(0, Math.min(100, Math.round(100 - errorPenalty - rateLimitPenalty)));
}

/**
 * Compute consistency score (0-100).
 * Based on: latency standard deviation relative to mean.
 *
 * - Coefficient of variation (CV) = stddev / mean
 * - CV < 0.2 → 90-100 (very consistent)
 * - CV 0.2-0.5 → 70-90 (moderate)
 * - CV 0.5-1.0 → 40-70 (variable)
 * - CV > 1.0 → 0-40 (unreliable)
 */
function computeConsistencyScore(stats: RequestStats): number {
  if (stats.avgLatencyMs === 0) return 50;

  const cv = stats.latencyStdDev / stats.avgLatencyMs;

  if (cv < 0.2) return Math.round(90 + (1 - cv / 0.2) * 10);
  if (cv < 0.5) return Math.round(70 + (1 - (cv - 0.2) / 0.3) * 20);
  if (cv < 1.0) return Math.round(40 + (1 - (cv - 0.5) / 0.5) * 30);
  return Math.max(0, Math.round(40 * (1 - Math.min(cv - 1.0, 2) / 2)));
}

/**
 * Compute cost efficiency score (0-100).
 * Based on: output tokens per dollar spent.
 *
 * We normalize across providers using a reference cost-per-1k-tokens.
 * Higher output-per-dollar → higher score.
 *
 * Note: This is relative — we'll compute percentiles across all models.
 * For now, use a heuristic baseline.
 */
function computeCostEfficiencyScore(stats: RequestStats): number {
  if (stats.avgCostMicroCents === 0) return 50; // no cost data

  const costInDollars = stats.avgCostMicroCents / 1_000_000;
  const tokensPerDollar = stats.avgTokensOut / Math.max(costInDollars, 0.000001);

  // Baseline: 100K tokens/dollar → 50 score, scale linearly
  // 1M tokens/dollar → ~95, 10K tokens/dollar → ~5
  const score = Math.min(100, Math.max(0, Math.round(10 + (tokensPerDollar / 200_000) * 90)));
  return score;
}

/**
 * Compute overall weighted score.
 * Weights: reliability 40%, consistency 30%, cost efficiency 30%.
 */
function computeOverallScore(
  reliability: number,
  consistency: number,
  costEfficiency: number,
): number {
  return Math.round(
    reliability * 0.4 + consistency * 0.3 + costEfficiency * 0.3,
  );
}

/**
 * Determine trend based on current vs previous score.
 */
function determineTrend(
  current: number,
  previous: number | null,
): "up" | "down" | "stable" {
  if (previous === null) return "stable";
  const diff = current - previous;
  if (diff > 3) return "up";
  if (diff < -3) return "down";
  return "stable";
}

// ─── Main Pipeline ─────────────────────────────────────────────────────────

export interface ComputeOptions {
  periodDays?: number;
  minSamples?: number;
  dryRun?: boolean;
}

export async function computeTrustScores(
  options: ComputeOptions = {},
): Promise<ComputedScores[]> {
  const {
    periodDays = 7,
    minSamples = MIN_SAMPLE_THRESHOLD,
    dryRun = false,
  } = options;

  const cutoff = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

  logger.info("[trust-scores] Starting computation", { periodDays, minSamples, dryRun });

  // Step 1: Aggregate request stats by model+provider
  const aggregatedStats = await db
    .select({
      modelId: llmRequest.modelId,
      providerId: llmRequest.providerId,
      sampleSize: sql<number>`count(*)::int`,
      avgLatencyMs: sql<number>`avg(${llmRequest.latencyMs})::int`,
      latencyStdDev: sql<number>`stddev(${llmRequest.latencyMs})::int`,
      errorRate: sql<number>`avg(case when ${llmRequest.statusCode} >= 500 then 1.0 else 0.0 end)`,
      rateLimitRate: sql<number>`avg(case when ${llmRequest.statusCode} = 429 then 1.0 else 0.0 end)`,
      avgTokensIn: sql<number>`avg(${llmRequest.tokenCountIn})::int`,
      avgTokensOut: sql<number>`avg(${llmRequest.tokenCountOut})::int`,
      avgCostMicroCents: sql<number>`avg(${llmRequest.costUsd})::int`,
      uniqueUserHashes: sql<number>`count(distinct ${llmRequest.userHash})::int`,
    })
    .from(llmRequest)
    .where(
      and(
        gte(llmRequest.timestamp, cutoff),
        isNotNull(llmRequest.modelId), // only requests we can map to a model
      ),
    )
    .groupBy(llmRequest.modelId, llmRequest.providerId)
    .having(sql`count(*) >= ${minSamples}`);

  logger.info("[trust-scores] Aggregated stats", {
    modelProviderPairs: aggregatedStats.length,
  });

  if (aggregatedStats.length === 0) {
    logger.info("[trust-scores] No models meet minimum sample threshold", { minSamples });
    return [];
  }

  // Step 2: Get previous scores for trend computation
  const modelIds = aggregatedStats
    .map((s) => s.modelId)
    .filter((id): id is string => id !== null);

  const previousScores = await db
    .select({
      modelId: trustScore.modelId,
      providerId: trustScore.providerId,
      overallScore: trustScore.overallScore,
    })
    .from(trustScore)
    .where(inArray(trustScore.modelId, modelIds));

  const prevScoreMap = new Map(
    previousScores.map((s) => [`${s.modelId}:${s.providerId}`, s.overallScore]),
  );

  // Step 3: Compute scores
  const results: ComputedScores[] = [];

  for (const stats of aggregatedStats) {
    if (!stats.modelId) continue;

    const requestStats: RequestStats = {
      modelId: stats.modelId,
      providerId: stats.providerId,
      sampleSize: Number(stats.sampleSize),
      avgLatencyMs: Number(stats.avgLatencyMs),
      p95LatencyMs: Number(stats.avgLatencyMs) * 1.5, // approximation
      latencyStdDev: Number(stats.latencyStdDev) || 0,
      errorRate: Number(stats.errorRate),
      rateLimitRate: Number(stats.rateLimitRate),
      avgTokensIn: Number(stats.avgTokensIn),
      avgTokensOut: Number(stats.avgTokensOut),
      avgCostMicroCents: Number(stats.avgCostMicroCents),
      uniqueUserHashes: Number(stats.uniqueUserHashes),
    };

    const reliabilityScore = computeReliabilityScore(requestStats);
    const consistencyScore = computeConsistencyScore(requestStats);
    const costEfficiencyScore = computeCostEfficiencyScore(requestStats);
    const overallScore = computeOverallScore(
      reliabilityScore,
      consistencyScore,
      costEfficiencyScore,
    );

    const key = `${stats.modelId}:${stats.providerId}`;
    const previousOverallScore = prevScoreMap.get(key) ?? null;
    const trend = determineTrend(overallScore, previousOverallScore);

    const computed: ComputedScores = {
      modelId: stats.modelId,
      providerId: stats.providerId,
      overallScore,
      reliabilityScore,
      consistencyScore,
      costEfficiencyScore,
      sampleSize: requestStats.sampleSize,
      trend,
      previousOverallScore,
    };

    results.push(computed);

    if (!dryRun) {
      // Upsert trust_score
      await db
        .insert(trustScore)
        .values({
          modelId: computed.modelId,
          providerId: computed.providerId,
          overallScore: computed.overallScore,
          reliabilityScore: computed.reliabilityScore,
          consistencyScore: computed.consistencyScore,
          costEfficiencyScore: computed.costEfficiencyScore,
          sampleSize: computed.sampleSize,
          periodDays,
          previousOverallScore: computed.previousOverallScore,
          trend: computed.trend,
          computedAt: new Date(),
          validUntil: new Date(Date.now() + periodDays * 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [trustScore.modelId, trustScore.providerId],
          set: {
            overallScore: computed.overallScore,
            reliabilityScore: computed.reliabilityScore,
            consistencyScore: computed.consistencyScore,
            costEfficiencyScore: computed.costEfficiencyScore,
            sampleSize: computed.sampleSize,
            periodDays,
            previousOverallScore: computed.previousOverallScore,
            trend: computed.trend,
            computedAt: new Date(),
            validUntil: new Date(Date.now() + periodDays * 2 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          },
        });

      // Insert snapshot for trend history
      await db.insert(scoreSnapshot).values({
        modelId: computed.modelId,
        providerId: computed.providerId,
        overallScore: computed.overallScore,
        reliabilityScore: computed.reliabilityScore,
        consistencyScore: computed.consistencyScore,
        costEfficiencyScore: computed.costEfficiencyScore,
        sampleSize: computed.sampleSize,
        snapshotDate: new Date(),
      });
    }
  }

  logger.info("[trust-scores] Computation complete", {
    modelsScored: results.length,
    dryRun,
  });

  // Sort by overall score descending
  return results.sort((a, b) => b.overallScore - a.overallScore);
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

// Run directly if executed as a script
const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1] &&
  process.argv[1].includes("compute-trust-scores");

if (isDirectRun) {
  const args = process.argv.slice(2);
  const daysArg = args.find((a) => a.startsWith("--days="));
  const dryRun = args.includes("--dry-run");

  const periodDays = daysArg ? parseInt(daysArg.split("=")[1] ?? "7", 10) : 7;

  computeTrustScores({ periodDays, dryRun })
    .then((results) => {
      console.log(`\n✅ Computed trust scores for ${results.length} model+provider pairs\n`);
      for (const r of results) {
        const trendIcon = r.trend === "up" ? "↑" : r.trend === "down" ? "↓" : "→";
        console.log(
          `  ${r.overallScore.toString().padStart(3)} ${trendIcon}  ` +
            `R:${r.reliabilityScore} C:${r.consistencyScore} $:${r.costEfficiencyScore}  ` +
            `(${r.sampleSize} samples)  ${r.modelId.slice(0, 8)}…@${r.providerId}`,
        );
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Trust score computation failed:", err);
      process.exit(1);
    });
}
