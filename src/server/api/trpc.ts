import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type NextRequest } from "next/server";

// Context for web (session-based) and Electron (API key-based)
export type CreateContextOptions = {
  req?: NextRequest;
  userId?: string;
  isApiKeyAuth?: boolean;
};

export async function createTRPCContext(opts: {
  req: NextRequest;
}): Promise<CreateContextOptions> {
  const { req } = opts;

  // Try API key auth first (for Electron)
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const userId = await validateApiKey(apiKey);
    if (userId) {
      return { req, userId, isApiKeyAuth: true };
    }
  }

  // Fall back to session auth (for web)
  const session = await getSessionFromRequest(req);
  if (session?.user?.id) {
    return { req, userId: session.user.id, isApiKeyAuth: false };
  }

  return { req };
}

const t = initTRPC.context<CreateContextOptions>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Protected procedure — requires authentication (web session or API key)
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// Metered procedure — protected + usage metering (enforces tier limits)
// Applies to API-key-authenticated requests (Electron app, API consumers)
// Web session requests are not metered (they use the web UI, not the API)
export const meteredProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    // Only meter API key auth (Electron/API consumers)
    // Web users with session auth are not subject to API rate limits
    if (!ctx.isApiKeyAuth) {
      return next({ ctx });
    }

    const { checkAndIncrementUsage } = await import("@/lib/usage-metering");
    const usage = await checkAndIncrementUsage(ctx.userId);

    if (!usage.allowed) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `API limit exceeded. ${usage.limit} calls/day on your plan. Resets at midnight UTC.`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        usage,
      },
    });
  },
);

// ============================================
// Usage Enforcement — #69
// ============================================

/** Tier-based daily API call limits */
const TIER_DAILY_LIMITS: Record<string, number> = {
  free: 100,
  pro: 10_000,
  team: 50_000,
};

/** Get user's subscription tier from DB */
async function getUserTier(userId: string): Promise<string> {
  try {
    const { db } = await import("@/server/db");
    const { subscription } = await import("@/server/db/schema");
    const { eq } = await import("drizzle-orm");

    const [sub] = await db
      .select({ tier: subscription.tier })
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    return sub?.tier ?? "free";
  } catch {
    return "free";
  }
}

/** Get today's usage count for a user */
async function getTodayUsage(userId: string): Promise<number> {
  try {
    const { db } = await import("@/server/db");
    const { usageTracking } = await import("@/server/db/schema");
    const { eq, and, gte, sql } = await import("drizzle-orm");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [result] = await db
      .select({ total: sql<number>`COALESCE(SUM(${usageTracking.quantity}), 0)` })
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, userId),
          eq(usageTracking.resourceType, "api_call"),
          gte(usageTracking.periodStart, today),
        ),
      );

    return Number(result?.total ?? 0);
  } catch {
    return 0;
  }
}

/** Record an API call in usage tracking */
async function recordUsage(
  userId: string,
  endpoint: string,
): Promise<void> {
  try {
    const { db } = await import("@/server/db");
    const { usageTracking } = await import("@/server/db/schema");

    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(23, 59, 59, 999);

    await db.insert(usageTracking).values({
      userId,
      resourceType: "api_call",
      quantity: 1,
      periodStart: dayStart,
      periodEnd: dayEnd,
      metadata: { endpoint },
      recordedAt: now,
    });
  } catch {
    // Non-critical: don't block the request if tracking fails
  }
}

/**
 * Usage-enforced procedure — requires auth, tracks API calls, enforces tier limits.
 * Returns 429 with upgrade CTA when daily limit exceeded.
 */
export const usageEnforcedProcedure = protectedProcedure.use(
  async ({ ctx, next, path }) => {
    const tier = await getUserTier(ctx.userId);
    const limit = TIER_DAILY_LIMITS[tier] ?? TIER_DAILY_LIMITS.free!;
    const usage = await getTodayUsage(ctx.userId);

    if (usage >= limit) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Daily API limit reached (${limit}/${limit} for ${tier} tier). Upgrade at /billing for higher limits.`,
      });
    }

    // Record this call
    await recordUsage(ctx.userId, path);

    return next({
      ctx: {
        ...ctx,
        userId: ctx.userId,
        tier,
        usageRemaining: limit - usage - 1,
      },
    });
  },
);

/**
 * Require Pro tier or higher. Gates features behind subscription.
 */
export const requireProProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const tier = await getUserTier(ctx.userId);
    if (tier === "free") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires a Pro subscription. Upgrade at /billing.",
      });
    }
    return next({ ctx: { ...ctx, tier } });
  },
);

/**
 * Require Team tier. Gates enterprise features.
 */
export const requireTeamProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const tier = await getUserTier(ctx.userId);
    if (tier !== "team") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires a Team subscription. Upgrade at /billing.",
      });
    }
    return next({ ctx: { ...ctx, tier } });
  },
);

// ============================================
// Auth helpers
// ============================================

async function validateApiKey(key: string): Promise<string | null> {
  try {
    const { db } = await import("@/server/db");
    const { apiKey: apiKeyTable } = await import("@/server/db/schema");
    const { eq, and, gt, or, isNull } = await import("drizzle-orm");
    const crypto = await import("crypto");

    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");

    const [keyRecord] = await db
      .select()
      .from(apiKeyTable)
      .where(
        and(
          eq(apiKeyTable.key, hashedKey),
          or(
            isNull(apiKeyTable.expiresAt),
            gt(apiKeyTable.expiresAt, new Date()),
          ),
        ),
      )
      .limit(1);

    if (!keyRecord) return null;

    // Update last used
    await db
      .update(apiKeyTable)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeyTable.id, keyRecord.id));

    return keyRecord.userId;
  } catch {
    return null;
  }
}

async function getSessionFromRequest(
  req: NextRequest,
): Promise<{ user: { id: string } } | null> {
  try {
    const { auth } = await import("@/server/auth");
    // Better Auth handles session validation internally
    // For tRPC context, we extract session from cookies
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    return session as { user: { id: string } } | null;
  } catch {
    return null;
  }
}
