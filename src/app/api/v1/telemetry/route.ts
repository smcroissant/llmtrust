import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ingestSpan, ingestSpansBatch } from "@/services/data-collector";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/v1/telemetry
 *
 * Ingest OTel proxy span data. Accepts a single span or batch.
 *
 * Auth: Bearer token via API key.
 *
 * Body (single):
 *   { "llm.model": "gpt-4o", "llm.provider": "openai", ... }
 *
 * Body (batch):
 *   [{ "llm.model": "gpt-4o", ... }, { "llm.model": "claude-3-opus", ... }]
 */

// ─── Validation Schema ─────────────────────────────────────────────────────

const OTelSpanSchema = z
  .object({
    "llm.model": z.string().max(255).optional(),
    "llm.provider": z.string().max(100).optional(),
    "llm.latency_ms": z.number().int().nonnegative().optional(),
    "llm.status_code": z.number().int().min(100).max(599).optional(),
    "llm.tokens.input": z.number().int().nonnegative().optional(),
    "llm.tokens.output": z.number().int().nonnegative().optional(),
    "llm.cost_usd": z.number().nonnegative().max(1000).optional(), // cap at $1000 per request
    "llm.quality_signal": z
      .enum(["success", "timeout", "rate_limited", "error"])
      .optional(),
    "llm.user_hash": z.string().max(64).optional(),
    "llm.user_id": z.string().max(255).optional(),
    timestamp: z.string().datetime().optional(),
  })
  .strict();

const TelemetryBodySchema = z.union([
  OTelSpanSchema,
  z.array(OTelSpanSchema).min(1).max(500), // batch limit
]);

// ─── Rate Limiting ─────────────────────────────────────────────────────────

const TELEMETRY_RATE_LIMIT = {
  maxRequests: 60, // 60 requests per minute per API key
  windowMs: 60_000,
};

const MAX_BATCH_SIZE = 500;

export async function POST(request: NextRequest) {
  try {
    // Auth check — reject by default if TELEMETRY_API_KEY is not configured
    const apiKey = process.env.TELEMETRY_API_KEY;
    if (!apiKey) {
      logger.error("[telemetry-api] TELEMETRY_API_KEY not configured — rejecting request");
      return NextResponse.json(
        { error: "Server misconfigured: TELEMETRY_API_KEY not set" },
        { status: 500 },
      );
    }
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting — per API key
    const rateLimitKey = `telemetry:${authHeader}`;
    const rateLimit = checkRateLimit(rateLimitKey, TELEMETRY_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rateLimit.retryAfter },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter ?? 60),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
          },
        },
      );
    }

    const rawBody = await request.json();

    // Input validation with zod
    const parseResult = TelemetryBodySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const body = parseResult.data;

    // Determine if single span or batch
    if (Array.isArray(body)) {
      const spans = body;
      const count = await ingestSpansBatch(spans);

      return NextResponse.json(
        {
          success: true,
          ingested: count,
        },
        {
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
          },
        },
      );
    } else {
      const span = body;
      await ingestSpan(span);

      return NextResponse.json(
        {
          success: true,
          ingested: 1,
        },
        {
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
          },
        },
      );
    }
  } catch (err) {
    logger.error("[telemetry-api] Ingestion failed", { error: err });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/v1/telemetry/health
 *
 * Health check endpoint for the telemetry pipeline.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    pipeline: "otel-telemetry",
    timestamp: new Date().toISOString(),
  });
}
