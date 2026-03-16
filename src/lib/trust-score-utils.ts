/**
 * Score Bands & Trust Score Utilities
 *
 * Score bands: Excellent (80-100), Good (60-79), Fair (40-59), Caution (20-39), Unreliable (0-19)
 * Data coverage: badge when sample count < threshold
 */

// ─── Score Bands ───────────────────────────────────────────────────────────

export type ScoreBand = "excellent" | "good" | "fair" | "caution" | "unreliable";

export interface ScoreBandInfo {
  band: ScoreBand;
  label: string;
  color: string;      // hex color
  bgColor: string;    // bg class
  textColor: string;  // text class
  emoji: string;
}

const SCORE_BANDS: Record<ScoreBand, ScoreBandInfo> = {
  excellent: {
    band: "excellent",
    label: "Excellent",
    color: "#10b981",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    emoji: "🟢",
  },
  good: {
    band: "good",
    label: "Good",
    color: "#84cc16",
    bgColor: "bg-lime-500/10",
    textColor: "text-lime-600",
    emoji: "🟡",
  },
  fair: {
    band: "fair",
    label: "Fair",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    emoji: "🟠",
  },
  caution: {
    band: "caution",
    label: "Caution",
    color: "#f97316",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600",
    emoji: "🟠",
  },
  unreliable: {
    band: "unreliable",
    label: "Unreliable",
    color: "#ef4444",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
    emoji: "🔴",
  },
};

export function getScoreBand(score: number): ScoreBandInfo {
  if (score >= 80) return SCORE_BANDS.excellent;
  if (score >= 60) return SCORE_BANDS.good;
  if (score >= 40) return SCORE_BANDS.fair;
  if (score >= 20) return SCORE_BANDS.caution;
  return SCORE_BANDS.unreliable;
}

export function getScoreColor(score: number): string {
  return getScoreBand(score).color;
}

// ─── Data Coverage ─────────────────────────────────────────────────────────

export const MIN_SAMPLE_THRESHOLD = 100;

export interface DataCoverage {
  isSufficient: boolean;
  sampleSize: number;
  threshold: number;
  label: string;
}

export function getDataCoverage(sampleSize: number): DataCoverage {
  if (sampleSize >= MIN_SAMPLE_THRESHOLD) {
    return {
      isSufficient: true,
      sampleSize,
      threshold: MIN_SAMPLE_THRESHOLD,
      label: "High confidence",
    };
  }
  if (sampleSize >= 50) {
    return {
      isSufficient: false,
      sampleSize,
      threshold: MIN_SAMPLE_THRESHOLD,
      label: "Limited data",
    };
  }
  return {
    isSufficient: false,
    sampleSize,
    threshold: MIN_SAMPLE_THRESHOLD,
    label: "Insufficient data",
  };
}

// ─── Trust Signals (12 weighted dimensions from spec) ──────────────────────

export interface TrustSignal {
  name: string;
  key: string;
  weight: number; // 0-1
  description: string;
}

export const TRUST_SIGNALS: TrustSignal[] = [
  { name: "Error Rate", key: "errorRate", weight: 0.15, description: "HTTP 5xx response rate" },
  { name: "Latency P95", key: "latencyP95", weight: 0.10, description: "95th percentile response time" },
  { name: "Latency Consistency", key: "latencyConsistency", weight: 0.10, description: "Standard deviation of latency" },
  { name: "Rate Limit Rate", key: "rateLimitRate", weight: 0.08, description: "HTTP 429 response rate" },
  { name: "Token Throughput", key: "tokenThroughput", weight: 0.08, description: "Output tokens per second" },
  { name: "Cost per Token", key: "costPerToken", weight: 0.08, description: "Cost efficiency" },
  { name: "Uptime Score", key: "uptimeScore", weight: 0.10, description: "Service availability" },
  { name: "Output Quality", key: "outputQuality", weight: 0.10, description: "Quality signal distribution" },
  { name: "Unique Users", key: "uniqueUsers", weight: 0.05, description: "Distinct user count (deduped)" },
  { name: "Token Efficiency", key: "tokenEfficiency", weight: 0.06, description: "Output/input token ratio" },
  { name: "Response Completeness", key: "responseCompleteness", weight: 0.05, description: "Finished vs truncated responses" },
  { name: "Data Freshness", key: "dataFreshness", weight: 0.05, description: "Recency of telemetry data" },
];

// Weights for the composite score (must sum to 1.0)
export const SCORE_WEIGHTS = {
  reliability: 0.40,
  consistency: 0.30,
  costEfficiency: 0.30,
} as const;
