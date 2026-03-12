import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { user, model, favorite, review } from "@/server/db/schema";
import { sendDay3Reminder, sendDay7DiscoverComparisons } from "@/lib/email";
import { eq, and, lt, gt, sql } from "drizzle-orm";

/**
 * Onboarding Email Cron Endpoint
 *
 * Triggered daily via Vercel Cron or external scheduler.
 * Sends follow-up emails to users at key onboarding milestones:
 * - Day 3: Reminder + featured models (if not activated)
 * - Day 7: Discover comparisons (re-engagement)
 *
 * Vercel Cron config (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/onboarding-emails",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 *
 * Security: Requires CRON_SECRET in Authorization header.
 */

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const threeDaysAgoEnd = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysAgoEnd = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

  const results = {
    day3: { attempted: 0, sent: 0, skipped: 0, errors: 0 },
    day7: { attempted: 0, sent: 0, skipped: 0, errors: 0 },
  };

  // ─── Day 3: Reminder + Featured Models ─────────────────────────────────

  try {
    // Users who signed up 3 days ago
    const day3Users = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(
        and(
          gt(user.createdAt, threeDaysAgo),
          lt(user.createdAt, threeDaysAgoEnd),
        ),
      );

    results.day3.attempted = day3Users.length;

    // Get featured models for the email
    const featuredModels = await db
      .select({
        name: model.name,
        slug: model.slug,
        description: model.description,
      })
      .from(model)
      .where(eq(model.isFeatured, true))
      .limit(3);

    for (const u of day3Users) {
      try {
        // Check if user is activated (has saved a model or left a review)
        const [favCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(favorite)
          .where(eq(favorite.userId, u.id));

        const [revCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(review)
          .where(eq(review.userId, u.id));

        const isActivated =
          Number(favCount?.count ?? 0) > 0 || Number(revCount?.count ?? 0) > 0;

        if (isActivated) {
          results.day3.skipped++;
          continue;
        }

        await sendDay3Reminder({
          email: u.email,
          name: u.name,
          featuredModels: featuredModels.length > 0 ? featuredModels : undefined,
        });
        results.day3.sent++;
      } catch (err) {
        console.error(`[cron] Day 3 email failed for ${u.email}:`, err);
        results.day3.errors++;
      }
    }
  } catch (err) {
    console.error("[cron] Day 3 batch failed:", err);
  }

  // ─── Day 7: Discover Comparisons ───────────────────────────────────────

  try {
    const day7Users = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(
        and(
          gt(user.createdAt, sevenDaysAgo),
          lt(user.createdAt, sevenDaysAgoEnd),
        ),
      );

    results.day7.attempted = day7Users.length;

    for (const u of day7Users) {
      try {
        await sendDay7DiscoverComparisons({
          email: u.email,
          name: u.name,
        });
        results.day7.sent++;
      } catch (err) {
        console.error(`[cron] Day 7 email failed for ${u.email}:`, err);
        results.day7.errors++;
      }
    }
  } catch (err) {
    console.error("[cron] Day 7 batch failed:", err);
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    results,
  });
}
