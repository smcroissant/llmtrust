import { TrustScore, scoreToBand, RecommendOptions, ModelRecommendation } from "./types";

const DEFAULT_API_BASE = "https://api.llmtrust.io";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  score: TrustScore;
  timestamp: number;
}

export class LLMTrustClient {
  private apiKey: string;
  private apiBase: string;
  private cache: Map<string, CacheEntry> = new Map();

  constructor(options?: { apiKey?: string; apiBase?: string }) {
    this.apiKey = options?.apiKey ?? process.env.LLMTRUST_API_KEY ?? "";
    this.apiBase = options?.apiBase ?? process.env.LLMTRUST_API_URL ?? DEFAULT_API_BASE;
  }

  private cacheKey(provider: string, model: string): string {
    return `${provider}:${model}`;
  }

  async score(provider: string, model: string): Promise<TrustScore> {
    const key = this.cacheKey(provider, model);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { ...cached.score, cached: true };
    }

    try {
      const res = await fetch(
        `${this.apiBase}/v1/scores/${encodeURIComponent(provider)}/${encodeURIComponent(model)}`,
        {
          headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        }
      );

      if (!res.ok) {
        return this.fallbackScore(provider, model);
      }

      const data = await res.json();
      const score: TrustScore = {
        provider,
        model,
        score: data.score ?? 0,
        band: data.band ?? scoreToBand(data.score ?? 0),
        breakdown: data.breakdown ?? {
          transparency: 0,
          consistency: 0,
          safety: 0,
          performance: 0,
          costEfficiency: 0,
        },
        updatedAt: data.updatedAt ?? new Date().toISOString(),
      };

      this.cache.set(key, { score, timestamp: Date.now() });
      return score;
    } catch {
      return this.fallbackScore(provider, model);
    }
  }

  async recommend(options: RecommendOptions = {}): Promise<ModelRecommendation[]> {
    try {
      const params = new URLSearchParams();
      if (options.task) params.set("task", options.task);
      if (options.budget) params.set("budget", options.budget);
      if (options.minScore) params.set("minScore", String(options.minScore));
      if (options.limit) params.set("limit", String(options.limit));
      if (options.provider) params.set("provider", options.provider);

      const res = await fetch(`${this.apiBase}/v1/recommend?${params}`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      });

      if (!res.ok) return [];

      const data = await res.json() as { models?: Array<{ provider: string; model: string; score: number; band?: string; reason?: string }> };
      return (data.models ?? []).map((m) => ({
        provider: m.provider,
        model: m.model,
        score: m.score,
        band: m.band ?? scoreToBand(m.score),
        reason: m.reason ?? "",
      }));
    } catch {
      return [];
    }
  }

  private fallbackScore(provider: string, model: string): TrustScore {
    return {
      provider,
      model,
      score: 50,
      band: "silver",
      breakdown: { transparency: 50, consistency: 50, safety: 50, performance: 50, costEfficiency: 50 },
      updatedAt: new Date().toISOString(),
    };
  }

  /** Clear the score cache */
  clearCache(): void {
    this.cache.clear();
  }
}

/** Default singleton client */
let defaultClient: LLMTrustClient | null = null;

export function getDefaultClient(): LLMTrustClient {
  if (!defaultClient) defaultClient = new LLMTrustClient();
  return defaultClient;
}
