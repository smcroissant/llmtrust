/**
 * Usage Metering Module
 *
 * Tracks API calls per user per day and enforces tier limits.
 * Uses atomic upserts to avoid race conditions.
 *
 * Tier limits:
 * - Free: 100 API calls/day
 * - Pro/Team: Unlimited
 */

import { db } from "@/server/db";
import { apiUsage, subscription } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

// ============================================
// Tier Limits (calls per day)
// ============================================

const TIER_LIMITS: Record<string, number> = {
  free: 100,
  pro: Infinity,
  team: Infinity,
} as const;

export interface UsageCheckResult {
  allowed: boolean;
  count: number;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp (midnight UTC of next day)
}

/**
 * Get today's date string in YYYY-MM-DD format (UTC)
 */
function getTodayUtc(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Get midnight UTC of the next day (for Retry-After)
 */
function getNextMidnightUtc(): number {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return Math.floor(tomorrow.getTime() / 1000);
}

/**
 * Check usage and increment count atomically.
 *
 * Uses INSERT ... ON CONFLICT DO UPDATE for atomic increment + check.
 * Returns whether the request is allowed and remaining quota.
 *
 * FAIL-OPEN: If metering errors, allows the request through.
 * Blocking users on system failure is worse than slight overage.
 */
export async function checkAndIncrementUsage(
  userId: string,
): Promise<UsageCheckResult> {
  const today = getTodayUtc();
  const limit = await getUserTierLimit(userId);
  const nextMidnight = getNextMidnightUtc();

  try {
    // Atomic upsert: insert or increment, return the new count
    const result = await db
      .insert(apiUsage)
      .values({
        userId,
        date: today,
        callCount: 1,
      })
      .onConflictDoUpdate({
        target: [apiUsage.userId, apiUsage.date],
        set: {
          callCount: sql`${apiUsage.callCount} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({ callCount: apiUsage.callCount });

    const count = result[0]?.callCount ?? 1;
    const allowed = count <= limit;

    return {
      allowed,
      count,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt: nextMidnight,
    };
  } catch (err) {
    console.error("[Usage Metering] Error:", err);
    // Fail-open: allow the request
    return {
      allowed: true,
      count: 0,
      limit,
      remaining: limit,
      resetAt: nextMidnight,
    };
  }
}

/**
 * Check current usage without incrementing (for display purposes)
 */
export async function getUsage(userId: string): Promise<UsageCheckResult> {
  const today = getTodayUtc();
  const limit = await getUserTierLimit(userId);
  const nextMidnight = getNextMidnightUtc();

  try {
    const [record] = await db
      .select()
      .from(apiUsage)
      .where(and(eq(apiUsage.userId, userId), eq(apiUsage.date, today)))
      .limit(1);

    const count = record?.callCount ?? 0;

    return {
      allowed: count < limit,
      count,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt: nextMidnight,
    };
  } catch (err) {
    console.error("[Usage Metering] Error reading usage:", err);
    return {
      allowed: true,
      count: 0,
      limit,
      remaining: limit,
      resetAt: nextMidnight,
    };
  }
}

/**
 * Get the daily API call limit for a user based on their subscription tier
 */
async function getUserTierLimit(userId: string): Promise<number> {
  try {
    const [sub] = await db
      .select({ tier: subscription.tier })
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    const tier = sub?.tier ?? "free";
    return TIER_LIMITS[tier] ?? TIER_LIMITS.free;
  } catch (err) {
    console.error("[Usage Metering] Error fetching tier:", err);
    return TIER_LIMITS.free; // Fail to free tier limit
  }
}
