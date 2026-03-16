/**
 * Environment Variable Validation with Zod
 *
 * Validates ALL env vars at import time — fails fast on missing/invalid config.
 * Import from this module instead of accessing process.env directly.
 *
 * Usage:
 *   import { env } from "~/env";
 *   const key = env.STRIPE_SECRET_KEY;
 */

import { z } from "zod";

// ─── Schema ────────────────────────────────────────────────────────────────

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Better Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),

  // Stripe
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, "STRIPE_SECRET_KEY is required")
    .refine(
      (v) => !v.includes("placeholder"),
      "STRIPE_SECRET_KEY contains placeholder — set a real key",
    ),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "STRIPE_WEBHOOK_SECRET is required")
    .refine(
      (v) => !v.includes("placeholder"),
      "STRIPE_WEBHOOK_SECRET contains placeholder — set a real key",
    ),
  STRIPE_PRICE_PRO: z
    .string()
    .min(1, "STRIPE_PRICE_PRO is required")
    .refine(
      (v) => !v.includes("placeholder"),
      "STRIPE_PRICE_PRO contains placeholder — set a real price ID",
    ),
  STRIPE_PRICE_TEAM: z
    .string()
    .min(1, "STRIPE_PRICE_TEAM is required")
    .refine(
      (v) => !v.includes("placeholder"),
      "STRIPE_PRICE_TEAM contains placeholder — set a real price ID",
    ),

  // App
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),

  // API
  API_KEY_PREFIX: z.string().default("llmt_"),
  API_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),

  // Cron
  CRON_SECRET: z.string().optional(),

  // Telemetry
  TELEMETRY_API_KEY: z.string().optional(),

  // Sentry
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Logging
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // Upload
  UPLOADTHING_TOKEN: z.string().optional(),

  // Legacy Clerk (migration)
  CLERK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),

  // Node
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Vercel (auto-set)
  VERCEL_ENV: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
});

// ─── Client Schema (only NEXT_PUBLIC_ vars) ────────────────────────────────

const clientSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required")
    .refine(
      (v) => !v.includes("placeholder"),
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY contains placeholder — set a real key",
    ),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

// ─── Validation ────────────────────────────────────────────────────────────

function validateEnv() {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const parsed = serverSchema.safeParse(process.env);

    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((i) => `  ❌ ${i.path.join(".")}: ${i.message}`)
        .join("\n");

      console.error(
        `\n🚨 Environment Variable Validation Failed:\n${errors}\n\n` +
          `📋 Copy .env.example → .env.local and fill in the values.\n`,
      );

      throw new Error(
        `Invalid environment variables. Check the console for details.`,
      );
    }

    return { ...parsed.data, ...clientSchema.parse(process.env) };
  }

  // Client-side — only validate NEXT_PUBLIC_ vars
  const clientEnv: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      clientEnv[key] = value;
    }
  }

  return clientSchema.parse(clientEnv);
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const env = validateEnv();

export type Env = z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
