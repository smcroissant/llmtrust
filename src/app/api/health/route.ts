import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

const startTime = Date.now();

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    app: { status: string };
    database: { status: string; latency?: number; error?: string };
    memory: { status: string; used: number; total: number; unit: string };
  };
}

export async function GET() {
  const checks: HealthStatus["checks"] = {
    app: { status: "ok" },
    database: { status: "unknown" },
    memory: { status: "unknown", used: 0, total: 0, unit: "MB" },
  };

  // Database check
  const dbStart = performance.now();
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const sql = neon(databaseUrl);
      await sql`SELECT 1`;
      const dbLatency = Math.round(performance.now() - dbStart);
      checks.database = { status: "ok", latency: dbLatency };
    } else {
      checks.database = { status: "error", error: "DATABASE_URL not configured" };
    }
  } catch (error) {
    checks.database = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }

  // Memory check
  try {
    const memUsage = process.memoryUsage();
    checks.memory = {
      status: "ok",
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      unit: "MB",
    };
  } catch {
    checks.memory = { status: "error", used: 0, total: 0, unit: "MB" };
  }

  // Determine overall status
  let status: HealthStatus["status"] = "healthy";
  if (checks.database.status === "error") {
    status = "unhealthy";
  } else if (checks.database.latency && checks.database.latency > 1000) {
    status = "degraded";
  }

  const body: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    uptime: Math.round((Date.now() - startTime) / 1000),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    checks,
  };

  return NextResponse.json(body, {
    status: status === "unhealthy" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
