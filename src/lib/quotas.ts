// src/lib/quotas.ts
// Tier quota definitions per MONETIZATION.md §6.3

export const TIER_QUOTAS = {
  free: {
    apiCallsPerDay: 100,
    inferenceTokens: 0,
    cloudInference: false,
    advancedBenchmarks: false,
    alerts: false,
    seats: 1,
  },
  pro: {
    apiCallsPerDay: Infinity, // unlimited (fair-use rate limit at 1000/min)
    inferenceTokens: 500_000,
    cloudInference: true,
    advancedBenchmarks: true,
    alerts: true,
    seats: 1,
  },
  team: {
    apiCallsPerDay: Infinity,
    inferenceTokens: 2_000_000,
    cloudInference: true,
    advancedBenchmarks: true,
    alerts: true,
    seats: 5,
  },
} as const;

export type Tier = keyof typeof TIER_QUOTAS;

/**
 * Check if a user has access to a given feature based on tier.
 */
export function hasFeature(
  tier: Tier,
  feature: "cloudInference" | "advancedBenchmarks" | "alerts",
): boolean {
  return TIER_QUOTAS[tier][feature];
}

/**
 * Get the daily API call limit for a tier.
 * Returns Infinity for unlimited tiers.
 */
export function getApiCallLimit(tier: Tier): number {
  return TIER_QUOTAS[tier].apiCallsPerDay;
}

/**
 * Get the monthly inference token quota for a tier.
 */
export function getInferenceTokenQuota(tier: Tier): number {
  return TIER_QUOTAS[tier].inferenceTokens;
}
