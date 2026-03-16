/** LLMTrust Core Types */

export interface TrustScore {
  provider: string;
  model: string;
  score: number;       // 0-100
  band: TrustBand;
  breakdown: ScoreBreakdown;
  updatedAt: string;   // ISO timestamp
  cached?: boolean;
}

export type TrustBand = "platinum" | "gold" | "silver" | "bronze" | "red-flag";

export interface ScoreBreakdown {
  transparency: number;
  consistency: number;
  safety: number;
  performance: number;
  costEfficiency: number;
}

export interface RecommendOptions {
  task?: "coding" | "creative" | "analysis" | "chat" | "summarization" | string;
  budget?: "free" | "pro" | "enterprise";
  minScore?: number;
  limit?: number;
  provider?: string;
}

export interface ModelRecommendation {
  provider: string;
  model: string;
  score: number;
  band: TrustBand;
  reason: string;
}

export const TRUST_BAND_THRESHOLDS: Record<TrustBand, [number, number]> = {
  platinum: [90, 100],
  gold: [75, 89],
  silver: [60, 74],
  bronze: [40, 59],
  "red-flag": [0, 39],
};

export function scoreToBand(score: number): TrustBand {
  for (const [band, [min, max]] of Object.entries(TRUST_BAND_THRESHOLDS)) {
    if (score >= min && score <= max) return band as TrustBand;
  }
  return "red-flag";
}

export const BAND_COLORS: Record<TrustBand, string> = {
  platinum: "#E5E4E2",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  "red-flag": "#FF4136",
};

export const BAND_EMOJI: Record<TrustBand, string> = {
  platinum: "💎",
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
  "red-flag": "🚩",
};
