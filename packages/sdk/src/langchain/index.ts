/**
 * LLMTrust — LangChain Integration
 *
 * Usage:
 *   import { LLMTrustCallback } from "llmtrust/langchain";
 *
 *   const chain = new LLMChain({ llm, prompt });
 *   const result = await chain.invoke(
 *     { input: "Hello" },
 *     { callbacks: [new LLMTrustCallback()] }
 *   );
 */

import { getDefaultClient } from "../client";
import type { TrustScore, RecommendOptions, ModelRecommendation } from "../types";

/* ── LLMTrustCallback ───────────────────────────────────── */

export interface LLMTrustCallbackOptions {
  /** Log scores to console. Default: true */
  logToConsole?: boolean;
  /** Custom callback when score is fetched */
  onScore?: (score: TrustScore) => void;
  /** Minimum score threshold. If below, call onBelowThreshold */
  threshold?: number;
  /** Called when trust score drops below threshold */
  onBelowThreshold?: (score: TrustScore) => void;
}

export class LLMTrustCallback {
  private options: LLMTrustCallbackOptions;

  constructor(options: LLMTrustCallbackOptions = {}) {
    this.options = {
      logToConsole: true,
      ...options,
    };
  }

  get name(): string {
    return "llmtrust_callback";
  }

  async handleLLMEnd(output: { llmOutput?: { provider?: string; model?: string; model_name?: string } }): Promise<void> {
    const llmOutput = output.llmOutput;
    const provider = llmOutput?.provider ?? llmOutput?.model_name?.split("/")?.[0] ?? "unknown";
    const model = llmOutput?.model ?? llmOutput?.model_name ?? "unknown";

    const client = getDefaultClient();
    const score = await client.score(provider, model);

    if (this.options.logToConsole) {
      const emoji = score.band === "platinum" ? "💎" : score.band === "gold" ? "🥇" : score.band === "silver" ? "🥈" : score.band === "bronze" ? "🥉" : "🚩";
      console.log(`[LLMTrust] ${emoji} ${provider}/${model} → ${score.score}/100 (${score.band})`);
    }

    this.options.onScore?.(score);

    if (this.options.threshold && score.score < this.options.threshold) {
      this.options.onBelowThreshold?.(score);
    }
  }
}

/* ── Trust-Aware Router ─────────────────────────────────── */

/** Generic LLM instance — pass any LangChain LLM */
type LangChainLLM = unknown;

export interface TrustRouterOptions {
  /** Primary LLM to try first */
  primary: { provider: string; model: string; llm: LangChainLLM };
  /** Fallback LLMs, tried in order */
  fallbacks: Array<{ provider: string; model: string; llm: LangChainLLM }>;
  /** Minimum trust score to accept primary. Default: 60 */
  minScore?: number;
  /** If true, always log routing decisions */
  verbose?: boolean;
}

/**
 * Auto-switch to fallback model if primary model's trust score drops below threshold.
 */
export async function trustAwareRoute<T>(
  options: TrustRouterOptions,
  invoke: (llm: LangChainLLM) => Promise<T>
): Promise<{ result: T; usedProvider: string; usedModel: string; trustScore: TrustScore }> {
  const client = getDefaultClient();
  const threshold = options.minScore ?? 60;

  // Check primary
  const primaryScore = await client.score(options.primary.provider, options.primary.model);

  if (primaryScore.score >= threshold) {
    if (options.verbose) {
      console.log(`[LLMTrust] ✅ Using primary: ${options.primary.provider}/${options.primary.model} (${primaryScore.score}/100)`);
    }
    const result = await invoke(options.primary.llm);
    return {
      result,
      usedProvider: options.primary.provider,
      usedModel: options.primary.model,
      trustScore: primaryScore,
    };
  }

  // Primary below threshold — try fallbacks
  if (options.verbose) {
    console.log(`[LLMTrust] ⚠️ Primary below threshold (${primaryScore.score}/100 < ${threshold}). Trying fallbacks...`);
  }

  for (const fb of options.fallbacks) {
    const fbScore = await client.score(fb.provider, fb.model);
    if (fbScore.score >= threshold) {
      if (options.verbose) {
        console.log(`[LLMTrust] 🔄 Routing to: ${fb.provider}/${fb.model} (${fbScore.score}/100)`);
      }
      const result = await invoke(fb.llm);
      return { result, usedProvider: fb.provider, usedModel: fb.model, trustScore: fbScore };
    }
  }

  // All below threshold — use primary anyway with warning
  console.warn(`[LLMTrust] 🚩 All models below threshold ${threshold}. Using primary anyway.`);
  const result = await invoke(options.primary.llm);
  return { result, usedProvider: options.primary.provider, usedModel: options.primary.model, trustScore: primaryScore };
}

/* ── Model Recommendation Helper ────────────────────────── */

export async function recommend(options: RecommendOptions = {}): Promise<ModelRecommendation[]> {
  const client = getDefaultClient();
  return client.recommend(options);
}

/* Re-export */
export type { TrustScore, ModelRecommendation, RecommendOptions } from "../types";
export { scoreToBand, BAND_COLORS, BAND_EMOJI } from "../types";
