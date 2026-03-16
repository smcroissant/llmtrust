import chalk from "chalk";
import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { createHash, randomBytes } from "crypto";

const CONFIG_DIR = join(homedir(), ".llmtrust");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const CREDENTIALS_FILE = join(CONFIG_DIR, "credentials");

export interface AuthConfig {
  apiKey?: string;
  email?: string;
  plan?: "free" | "pro" | "team";
  usage?: {
    callsToday: number;
    callsTotal: number;
    resetAt: string;
  };
}

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): AuthConfig {
  ensureConfigDir();
  if (!existsSync(CONFIG_FILE)) {
    return { plan: "free" };
  }
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as AuthConfig;
  } catch {
    return { plan: "free" };
  }
}

export function saveConfig(config: AuthConfig): void {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getApiKey(): string | undefined {
  // Check env var first
  if (process.env.LLMTRUST_API_KEY) {
    return process.env.LLMTRUST_API_KEY;
  }
  const config = loadConfig();
  return config.apiKey;
}

export function isLoggedIn(): boolean {
  return !!getApiKey();
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "..." + key.slice(-4);
}

export function renderAuthStatus(): void {
  const config = loadConfig();
  const apiKey = getApiKey();

  console.log();
  console.log(chalk.bold("  LLMTrust CLI — Authentication Status\n"));

  if (!apiKey) {
    console.log(chalk.yellow("  ⚠ Not authenticated"));
    console.log();
    console.log(chalk.dim("  You're using the free tier with local model data only."));
    console.log(chalk.dim("  For live trust scores and API access, sign up at:"));
    console.log();
    console.log(chalk.cyan("    → https://llmtrust.com/signup"));
    console.log();
    console.log(chalk.dim("  Then authenticate:"));
    console.log(chalk.dim("    llmtrust auth login --api-key <your-key>"));
    console.log();
    return;
  }

  console.log(chalk.green("  ✓ Authenticated"));
  console.log();
  console.log(chalk.bold("  API Key:   ") + chalk.dim(maskApiKey(apiKey)));
  console.log(chalk.bold("  Plan:      ") + chalk.cyan(config.plan ?? "free"));
  console.log(chalk.bold("  Email:     ") + chalk.dim(config.email ?? "N/A"));

  if (config.usage) {
    console.log();
    console.log(chalk.bold("  Usage Today:  ") + `${config.usage.callsToday} calls`);
    console.log(chalk.bold("  Total Calls:  ") + `${config.usage.callsTotal}`);
    console.log(chalk.bold("  Resets At:    ") + chalk.dim(config.usage.resetAt));
  }

  console.log();
}

export function login(apiKey: string, email?: string): void {
  // Validate API key format (basic check)
  if (apiKey.length < 16) {
    console.error(chalk.red("\n  ✗ Invalid API key format.\n"));
    process.exit(1);
  }

  const config = loadConfig();
  config.apiKey = apiKey;
  if (email) config.email = email;

  // Determine plan from key prefix (simplified)
  if (apiKey.startsWith("llm_pro_")) {
    config.plan = "pro";
  } else if (apiKey.startsWith("llm_team_")) {
    config.plan = "team";
  } else {
    config.plan = "free";
  }

  saveConfig(config);

  console.log();
  console.log(chalk.green("  ✓ Authenticated successfully!"));
  console.log(chalk.dim(`  Plan: ${config.plan}`));
  console.log();
  console.log(chalk.dim("  You now have access to:"));
  console.log(chalk.dim("  • Live trust scores from production data"));
  console.log(chalk.dim("  • API access for programmatic queries"));
  console.log(chalk.dim("  • Higher rate limits"));
  console.log();
}

export function logout(): void {
  const config = loadConfig();
  delete config.apiKey;
  delete config.email;
  config.plan = "free";
  delete config.usage;
  saveConfig(config);

  console.log();
  console.log(chalk.green("  ✓ Logged out successfully."));
  console.log(chalk.dim("  Local model data is still available."));
  console.log();
}

// Record API usage for rate limiting
export function recordUsage(): void {
  const config = loadConfig();
  if (!config.apiKey) return;

  if (!config.usage) {
    config.usage = { callsToday: 0, callsTotal: 0, resetAt: "" };
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const resetDate = config.usage.resetAt?.split("T")[0];

  if (resetDate !== today) {
    config.usage.callsToday = 0;
    config.usage.resetAt = now.toISOString();
  }

  config.usage.callsToday++;
  config.usage.callsTotal++;
  saveConfig(config);
}

// Check if user has hit rate limit
export function checkRateLimit(): { allowed: boolean; remaining: number; limit: number } {
  const config = loadConfig();
  const limit = config.plan === "pro" ? 10000 : config.plan === "team" ? 50000 : 100;
  const used = config.usage?.callsToday ?? 0;

  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
    limit,
  };
}
