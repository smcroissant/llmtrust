/**
 * Trust-Adjusted Cost (TAC) Formula
 *
 * TAC = nominalCost * (1 / reliabilityScore) * (1 + hallucinationRate * costMultiplier)
 *
 * This gives the TRUE cost of using a model when you factor in:
 * - Reliability: unreliable models need retries = higher effective cost
 * - Hallucination: hallucinated outputs need human review = labor cost
 * - Consistency: inconsistent models waste tokens on re-prompts
 * - Compliance: non-compliant models carry regulatory risk cost
 */

export interface TACInput {
  /** Nominal cost per million tokens (USD) */
  nominalCostPerMToken: number;
  /** Reliability score 0-100 (uptime, error rate) */
  reliabilityScore: number;
  /** Hallucination rate 0-1 (proportion of outputs with hallucinations) */
  hallucinationRate: number;
  /** Consistency score 0-100 (latency variance, output stability) */
  consistencyScore: number;
  /** Compliance score 0-100 (EU AI Act, SOC2, etc.) */
  complianceScore: number;
}

export interface TACBreakdown {
  nominalCostPerMToken: number;
  tacPerMToken: number;
  reliabilityMultiplier: number;
  hallucinationOverhead: number;
  consistencyPenalty: number;
  compliancePenalty: number;
  savingsOrPenalty: number; // positive = penalty, negative = savings vs naive comparison
}

/**
 * Default cost multiplier for hallucination overhead.
 * A hallucinated output costs ~3x the original output to fix
 * (human review + re-generation + QA).
 */
const DEFAULT_HALLUCINATION_COST_MULTIPLIER = 3;

/**
 * Penalty factor for consistency issues.
 * Each point below 100 adds 0.5% to effective cost.
 */
const CONSISTENCY_PENALTY_FACTOR = 0.005;

/**
 * Penalty factor for compliance gaps.
 * Each point below 100 adds 0.3% to effective cost.
 */
const COMPLIANCE_PENALTY_FACTOR = 0.003;

export function computeTAC(input: TACInput): TACBreakdown {
  const {
    nominalCostPerMToken,
    reliabilityScore,
    hallucinationRate,
    consistencyScore,
    complianceScore,
  } = input;

  // Clamp inputs
  const reliability = Math.max(1, Math.min(100, reliabilityScore)) / 100;
  const hallucination = Math.max(0, Math.min(1, hallucinationRate));
  const consistency = Math.max(0, Math.min(100, consistencyScore));
  const compliance = Math.max(0, Math.min(100, complianceScore));

  // Reliability multiplier: unreliable models need retries
  // If reliability is 95%, you need ~1.05x the requests
  const reliabilityMultiplier = 1 / reliability;

  // Hallucination overhead: hallucinated outputs need human review
  const hallucinationOverhead =
    1 + hallucination * DEFAULT_HALLUCINATION_COST_MULTIPLIER;

  // Consistency penalty: inconsistent models waste tokens
  const consistencyPenalty =
    1 + (100 - consistency) * CONSISTENCY_PENALTY_FACTOR;

  // Compliance penalty: non-compliant models carry risk cost
  const compliancePenalty =
    1 + (100 - compliance) * COMPLIANCE_PENALTY_FACTOR;

  // TAC = nominal * reliability_mult * hallucination_overhead * consistency * compliance
  const tacPerMToken =
    nominalCostPerMToken *
    reliabilityMultiplier *
    hallucinationOverhead *
    consistencyPenalty *
    compliancePenalty;

  // How much more (or less) you're actually paying vs nominal
  const savingsOrPenalty = tacPerMToken - nominalCostPerMToken;

  return {
    nominalCostPerMToken,
    tacPerMToken: Math.round(tacPerMToken * 100) / 100,
    reliabilityMultiplier: Math.round(reliabilityMultiplier * 1000) / 1000,
    hallucinationOverhead: Math.round(hallucinationOverhead * 1000) / 1000,
    consistencyPenalty: Math.round(consistencyPenalty * 1000) / 1000,
    compliancePenalty: Math.round(compliancePenalty * 1000) / 1000,
    savingsOrPenalty: Math.round(savingsOrPenalty * 100) / 100,
  };
}

/**
 * Compute TAC for multiple models, returning them sorted by TAC (lowest first).
 */
export function computeTACLeaderboard(
  models: Array<TACInput & { modelId: string; provider: string }>,
): Array<TACBreakdown & { modelId: string; provider: string }> {
  return models
    .map((m) => ({
      modelId: m.modelId,
      provider: m.provider,
      ...computeTAC(m),
    }))
    .sort((a, b) => a.tacPerMToken - b.tacPerMToken);
}

/**
 * Format TAC for display
 */
export function formatTAC(tac: number): string {
  if (tac < 0.01) return `$${tac.toFixed(4)}`;
  if (tac < 1) return `$${tac.toFixed(2)}`;
  if (tac < 100) return `$${tac.toFixed(2)}`;
  return `$${Math.round(tac).toLocaleString()}`;
}

/**
 * Get a grade based on TAC vs nominal cost ratio
 */
export function getTACGrade(ratio: number): {
  grade: string;
  color: string;
  description: string;
} {
  if (ratio <= 1.1)
    return { grade: "A+", color: "emerald", description: "Excellent value" };
  if (ratio <= 1.3)
    return { grade: "A", color: "green", description: "Great value" };
  if (ratio <= 1.5)
    return { grade: "B+", color: "lime", description: "Good value" };
  if (ratio <= 2.0)
    return { grade: "B", color: "yellow", description: "Fair value" };
  if (ratio <= 3.0)
    return { grade: "C", color: "orange", description: "Below average" };
  return { grade: "D", color: "red", description: "Poor value" };
}
