import { type NextRequest, NextResponse } from "next/server";
import { ingestSpan, ingestSpansBatch, type OTelSpan } from "@/services/data-collector";
import { logger } from "@/lib/logger";

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
export async function POST(request: NextRequest) {
  try {
    // Auth check — require API key
    const authHeader = request.headers.get("authorization");
    const apiKey = process.env.TELEMETRY_API_KEY;

    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Determine if single span or batch
    if (Array.isArray(body)) {
      const spans = body as OTelSpan[];
      const count = await ingestSpansBatch(spans);

      return NextResponse.json({
        success: true,
        ingested: count,
      });
    } else {
      const span = body as OTelSpan;
      await ingestSpan(span);

      return NextResponse.json({
        success: true,
        ingested: 1,
      });
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
