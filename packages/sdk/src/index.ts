/**
 * LLMTrust — Core SDK
 *
 * Main entry point. Re-exports everything.
 */

export { LLMTrustClient, getDefaultClient } from "./client";
export type { TrustScore, TrustBand, ScoreBreakdown, RecommendOptions, ModelRecommendation } from "./types";
export { scoreToBand, TRUST_BAND_THRESHOLDS, BAND_COLORS, BAND_EMOJI } from "./types";
