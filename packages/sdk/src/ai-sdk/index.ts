/**
 * LLMTrust — Vercel AI SDK Integration
 *
 * Usage:
 *   import { llmtrust } from "llmtrust/ai-sdk";
 *
 *   const result = await streamText({
 *     model: openai("gpt-4o"),
 *     experimental_providerMetadata: {
 *       llmtrust: await llmtrust.score("openai", "gpt-4o")
 *     }
 *   });
 */

import { LLMTrustClient, getDefaultClient } from "../client";
import type { TrustScore, RecommendOptions } from "../types";

export interface LLMTrustProviderMetadata {
  llmtrust: TrustScore;
}

/**
 * Create a llmtrust object for use with Vercel AI SDK's providerMetadata.
 */
export function createLLMTrust(options?: { apiKey?: string; apiBase?: string }) {
  const client = options ? new LLMTrustClient(options) : getDefaultClient();

  return {
    /**
     * Get trust score for a model — use in experimental_providerMetadata
     */
    async score(provider: string, model: string): Promise<TrustScore> {
      return client.score(provider, model);
    },

    /**
     * Get model recommendations
     */
    async recommend(task?: string, options?: Omit<RecommendOptions, "task">) {
      return client.recommend({ task, ...options });
    },

    /**
     * Create middleware that adds trust scores to every response's providerMetadata.
     * Use with `experimental_wrapLanguageModel`.
     */
    withTrustScore() {
      return async ({ provider, model, ...rest }: any) => {
        const providerId = provider ?? "unknown";
        const modelId = model ?? "unknown";
        const trustScore = await client.score(providerId, modelId);
        return {
          ...rest,
          experimental_providerMetadata: {
            ...(rest.experimental_providerMetadata ?? {}),
            llmtrust: trustScore,
          },
        };
      };
    },

    /** Expose raw client */
    client,
  };
}

/** Default singleton */
export const llmtrust = createLLMTrust();

/** Re-export types */
export type { TrustScore } from "../types";
export { scoreToBand, BAND_COLORS, BAND_EMOJI } from "../types";
