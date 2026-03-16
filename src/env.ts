/**
 * Environment Variable Validation
 *
 * All env vars are validated at import time using Zod.
 * If any required variable is missing, the app fails fast with a clear error.
 *
 * Usage:
 *   import { env } from "@/env";
 *   const dbUrl = env.DATABASE_URL;
 */

import { z } from "zod";

// ── Server-side schema ──────────────────────────────────────────────────────
const serverSchema = z.object({
  // Database
  DATABASE_URL: z.url().describe("Neon Postgres connection string"),

  // Better Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.url().describe("Base URL of the application"),

  // Stripe (required for production, optional in dev)
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "STRIPE_WEBHOOK_SECRET is required"),
  STRIPE_PRICE_PRO_MONTHLY: z
    .string()
    .min(1, "STRIPE_PRICE_PRO_MONTHLY is required"),
  STRIPE_PRICE_PRO_ANNUAL: z
    .string()
    .min(1, "STRIPE_PRICE_PRO_ANNUAL is required"),
  STRIPE_PRICE_TEAM_MONTHLY: z
    .string()
    .min(1, "STRIPE_PRICE_TEAM_MONTHLY is required"),
  STRIPE_PRICE_TEAM_ANNUAL: z
    .string()
    .min(1, "STRIPE_PRICE_TEAM_ANNUAL is required"),

  // Optional server-side
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  ADMIN_SECRET: z.string().optional(),
  TELEMETRY_API_KEY: z.string().optional(),
  API_KEY_PREFIX: z.string().default("llmt_"),
  CLERK_SECRET_KEY: z.string().optional(),
  UPLOADTHING_TOKEN: z.string().optional(),
  API_URL: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Vercel-provided (always present on Vercel, absent locally)
  VERCEL_ENV: z
    .enum(["production", "preview", "development"])
    .optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  VERCEL_URL: z.string().optional(),
});

// ── Client-side schema (NEXT_PUBLIC_*) ──────────────────────────────────────
const clientSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
});

// ── Validation helpers ──────────────────────────────────────────────────────

function parseEnv<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  source: Record<string, string | undefined>,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ✗ ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `[${label}] Environment validation failed:\n${issues}\n\n` +
        `Check your .env file or see .env.example for required variables.`,
    );
  }
  return result.data;
}

// ── Export validated env ────────────────────────────────────────────────────

// Server vars (only validated on server)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const isServer = typeof window === "undefined";

export const serverEnv = isServer
  ? parseEnv(serverSchema, process.env, "Server Env")
  : ({} as z.infer<typeof serverSchema>);

// Client vars (validated everywhere, but only NEXT_PUBLIC_* are available)
export const clientEnv = parseEnv(clientSchema, {
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
}, "Client Env");

// ── Convenience: merged env object ─────────────────────────────────────────

export const env = {
  ...serverEnv,
  ...clientEnv,
};

// ── Type export ─────────────────────────────────────────────────────────────
export type Env = typeof env;
