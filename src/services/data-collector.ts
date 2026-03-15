/**
 * Data Collector — Ingest OTel Proxy telemetry into llm_request table.
 *
 * The OTel proxy (#16) emits spans with LLM request metadata.
 * This service normalizes and stores them (PII-stripped).
 *
 * Usage:
 *   - POST /api/v1/telemetry  (from OTel proxy)
 *   - Direct import for batch ingestion
 */

import { createHash } from "crypto";
import { db } from "@/server/db";
import { llmRequest, model } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

// ─── Types ─────────────────────────────────────────────────────────────────

/**
 * Raw OTel span attributes from the proxy.
 * Matches the shape emitted by the OpenTelemetry LLM proxy (#16).
 */
export interface OTelSpan {
  /** Model identifier as reported by provider, e.g. "gpt-4o", "claude-3-opus" */
  "llm.model"?: string;
  /** Provider identifier, e.g. "openai", "anthropic", "together" */
  "llm.provider"?: string;
  /** Latency in milliseconds */
  "llm.latency_ms"?: number;
  /** HTTP status code from the provider */
  "llm.status_code"?: number;
  /** Input token count */
  "llm.tokens.input"?: number;
  /** Output token count */
  "llm.tokens.output"?: number;
  /** Cost in USD (if available from provider) */
  "llm.cost_usd"?: number;
  /** Quality signal: "success", "timeout", "rate_limited", "error" */
  "llm.quality_signal"?: string;
  /** Anonymized user identifier */
  "llm.user_hash"?: string;
  /** Raw user ID (will be hashed) */
  "llm.user_id"?: string;
  /** ISO timestamp of the request */
  timestamp?: string;
}

/**
 * Normalized record ready for DB insertion.
 */
export interface NormalizedRequest {
  modelId: string | null;
  modelSlug: string | null;
  providerId: string;
  latencyMs: number;
  statusCode: number;
  tokenCountIn: number;
  tokenCountOut: number;
  costUsd: number;
  qualitySignal: string | null;
  userHash: string | null;
  timestamp: Date;
}

// ─── Constants ──────────────────────────────────────────────────────────────

/**
 * Known model slug mappings from provider-specific identifiers.
 * Maps provider-reported names to our canonical slugs.
 */
const MODEL_SLUG_MAP: Record<string, Record<string, string>> = {
  openai: {
    "gpt-4o": "gpt-4o",
    "gpt-4o-mini": "gpt-4o-mini",
    "gpt-4-turbo": "gpt-4-turbo",
    "gpt-4": "gpt-4",
    "gpt-3.5-turbo": "gpt-3.5-turbo",
    "o1": "o1",
    "o1-mini": "o1-mini",
    "o1-preview": "o1-preview",
    "o3-mini": "o3-mini",
  },
  anthropic: {
    "claude-3-5-sonnet": "claude-3-5-sonnet",
    "claude-3-opus": "claude-3-opus",
    "claude-3-haiku": "claude-3-haiku",
    "claude-3-sonnet": "claude-3-sonnet",
    "claude-sonnet-4-20250514": "claude-4-sonnet",
    "claude-opus-4-20250514": "claude-4-opus",
  },
  together: {
    "meta-llama/Llama-3-70b-chat-hf": "llama-3-70b",
    "meta-llama/Llama-3-8b-chat-hf": "llama-3-8b",
    "mistralai/Mistral-7B-Instruct-v0.3": "mistral-7b",
  },
};

/**
 * Minimum sample threshold before a score is considered publishable.
 */
export const MIN_SAMPLE_THRESHOLD = 100;

// ─── Helper Functions ───────────────────────────────────────────────────────

/**
 * Hash a user ID for anonymized storage.
 * SHA-256 of the raw ID — deterministic but not reversible.
 */
export function hashUserId(rawUserId: string): string {
  return createHash("sha256").update(rawUserId).digest("hex");
}

/**
 * Resolve a provider-reported model name to our canonical slug.
 */
function resolveModelSlug(
  provider: string,
  providerModelName: string,
): string | null {
  const providerMap = MODEL_SLUG_MAP[provider.toLowerCase()];
  if (!providerMap) return null;

  // Direct lookup
  if (providerMap[providerModelName]) {
    return providerMap[providerModelName];
  }

  // Case-insensitive fallback
  const lowerName = providerModelName.toLowerCase();
  for (const [key, slug] of Object.entries(providerMap)) {
    if (key.toLowerCase() === lowerName) return slug;
  }

  return null;
}

/**
 * Look up model UUID from slug in the database.
 * Returns null if not found (model not yet in our DB).
 */
async function resolveModelId(slug: string): Promise<string | null> {
  const [found] = await db
    .select({ id: model.id })
    .from(model)
    .where(eq(model.slug, slug))
    .limit(1);

  return found?.id ?? null;
}

// ─── Core Functions ─────────────────────────────────────────────────────────

/**
 * Normalize a raw OTel span into a DB-ready record.
 */
export async function normalizeSpan(span: OTelSpan): Promise<NormalizedRequest> {
  const provider = span["llm.provider"] ?? "unknown";
  const modelName = span["llm.model"] ?? "unknown";

  const slug = resolveModelSlug(provider, modelName);
  const modelId = slug ? await resolveModelId(slug) : null;

  // Anonymize user ID
  let userHash: string | null = null;
  if (span["llm.user_hash"]) {
    userHash = span["llm.user_hash"];
  } else if (span["llm.user_id"]) {
    userHash = hashUserId(span["llm.user_id"]);
  }

  return {
    modelId,
    modelSlug: slug ?? modelName,
    providerId: provider.toLowerCase(),
    latencyMs: span["llm.latency_ms"] ?? 0,
    statusCode: span["llm.status_code"] ?? 200,
    tokenCountIn: span["llm.tokens.input"] ?? 0,
    tokenCountOut: span["llm.tokens.output"] ?? 0,
    costUsd: Math.round((span["llm.cost_usd"] ?? 0) * 1_000_000), // convert to microcents
    qualitySignal: span["llm.quality_signal"] ?? null,
    userHash,
    timestamp: span.timestamp ? new Date(span.timestamp) : new Date(),
  };
}

/**
 * Ingest a single OTel span into the database.
 */
export async function ingestSpan(span: OTelSpan): Promise<void> {
  const normalized = await normalizeSpan(span);

  await db.insert(llmRequest).values({
    modelId: normalized.modelId,
    modelSlug: normalized.modelSlug,
    providerId: normalized.providerId,
    latencyMs: normalized.latencyMs,
    statusCode: normalized.statusCode,
    tokenCountIn: normalized.tokenCountIn,
    tokenCountOut: normalized.tokenCountOut,
    costUsd: normalized.costUsd,
    qualitySignal: normalized.qualitySignal,
    userHash: normalized.userHash,
    timestamp: normalized.timestamp,
  });

  logger.info("[data-collector] Ingested span", {
    modelSlug: normalized.modelSlug,
    providerId: normalized.providerId,
    latencyMs: normalized.latencyMs,
  });
}

/**
 * Batch ingest multiple spans. More efficient for bulk imports.
 */
export async function ingestSpansBatch(spans: OTelSpan[]): Promise<number> {
  if (spans.length === 0) return 0;

  const normalized = await Promise.all(spans.map(normalizeSpan));

  const records = normalized.map((n) => ({
    modelId: n.modelId,
    modelSlug: n.modelSlug,
    providerId: n.providerId,
    latencyMs: n.latencyMs,
    statusCode: n.statusCode,
    tokenCountIn: n.tokenCountIn,
    tokenCountOut: n.tokenCountOut,
    costUsd: n.costUsd,
    qualitySignal: n.qualitySignal,
    userHash: n.userHash,
    timestamp: n.timestamp,
  }));

  // Insert in chunks of 500 to avoid query size limits
  const CHUNK_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    await db.insert(llmRequest).values(chunk);
    inserted += chunk.length;
  }

  logger.info("[data-collector] Batch ingested spans", {
    count: inserted,
  });

  return inserted;
}

/**
 * Seed mock data for development / demo.
 * Generates realistic LLM request telemetry.
 */
export async function seedMockData(
  count: number = 10_000,
  providers: string[] = ["openai", "anthropic", "together"],
): Promise<number> {
  logger.info("[data-collector] Seeding mock data", { count, providers });

  const modelsByProvider: Record<string, string[]> = {
    openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1", "o3-mini"],
    anthropic: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku", "claude-4-sonnet"],
    together: ["llama-3-70b", "llama-3-8b", "mistral-7b"],
  };

  const qualitySignals = ["success", "success", "success", "success", "success", "success", "success", "timeout", "rate_limited", "error"];
  const statusCodes = [200, 200, 200, 200, 200, 200, 200, 429, 500, 503];

  const spans: OTelSpan[] = [];

  for (let i = 0; i < count; i++) {
    const provider = providers[Math.floor(Math.random() * providers.length)]!;
    const modelNames = modelsByProvider[provider]!;
    const modelName = modelNames[Math.floor(Math.random() * modelNames.length)]!;

    const qualityIdx = Math.floor(Math.random() * qualitySignals.length);
    const isSuccess = qualityIdx < 7;

    // Realistic latency distribution (log-normal-ish)
    const baseLatency = provider === "anthropic" ? 800 : provider === "openai" ? 600 : 1200;
    const latencyMs = Math.round(
      baseLatency + (Math.random() - 0.5) * baseLatency * 0.8 + (isSuccess ? 0 : 5000),
    );

    // Token counts
    const tokensIn = Math.round(200 + Math.random() * 2000);
    const tokensOut = isSuccess ? Math.round(100 + Math.random() * 1500) : 0;

    // Cost estimation (rough per-provider)
    const costPer1kTokens = provider === "openai" ? 0.005 : provider === "anthropic" ? 0.008 : 0.001;
    const costUsd = ((tokensIn + tokensOut) / 1000) * costPer1kTokens;

    // Spread timestamps over the last 30 days
    const daysAgo = Math.random() * 30;
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    spans.push({
      "llm.model": modelName,
      "llm.provider": provider,
      "llm.latency_ms": latencyMs,
      "llm.status_code": statusCodes[qualityIdx],
      "llm.tokens.input": tokensIn,
      "llm.tokens.output": tokensOut,
      "llm.cost_usd": costUsd,
      "llm.quality_signal": qualitySignals[qualityIdx],
      "llm.user_hash": hashUserId(`user-${Math.floor(Math.random() * 500)}`),
      timestamp: timestamp.toISOString(),
    });
  }

  return ingestSpansBatch(spans);
}
