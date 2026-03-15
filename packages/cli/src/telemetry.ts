/**
 * Anonymous telemetry for LLMTrust CLI.
 * 
 * Opt-out via:
 *   - Flag: --no-telemetry
 *   - Env: LLMTRUST_NO_TELEMETRY=1
 * 
 * Collects only: hashed model comparison pairs + timestamp.
 * NO PII, NO model prompts, NO user data.
 */

import { createHash } from "crypto";

const TELEMETRY_ENDPOINT = "https://llmtrust.com/api/cli/telemetry";

interface TelemetryEvent {
  event: string;
  models?: string[];
  timestamp: string;
  cliVersion: string;
  os: string;
  nodeVersion: string;
}

function hashModelId(id: string): string {
  return createHash("sha256").update(id).digest("hex").slice(0, 8);
}

function isTelemetryDisabled(): boolean {
  if (process.env.LLMTRUST_NO_TELEMETRY === "1") return true;
  if (process.env.LLMTRUST_NO_TELEMETRY === "true") return true;
  return false;
}

export async function trackComparison(models: string[], disabled: boolean): Promise<void> {
  if (disabled || isTelemetryDisabled()) return;

  const event: TelemetryEvent = {
    event: "compare",
    models: models.map(hashModelId),
    timestamp: new Date().toISOString(),
    cliVersion: process.env.npm_package_version || "0.1.0",
    os: process.platform,
    nodeVersion: process.version,
  };

  // Fire-and-forget — don't block CLI output
  try {
    await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(2000), // 2s max
    });
  } catch {
    // Silently fail — telemetry should never break the CLI
  }
}

export async function trackCommand(command: string, disabled: boolean): Promise<void> {
  if (disabled || isTelemetryDisabled()) return;

  const event: TelemetryEvent = {
    event: command,
    timestamp: new Date().toISOString(),
    cliVersion: process.env.npm_package_version || "0.1.0",
    os: process.platform,
    nodeVersion: process.version,
  };

  try {
    await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Silently fail
  }
}
