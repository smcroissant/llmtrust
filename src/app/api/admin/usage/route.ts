import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { apiUsage, user } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * GET /api/admin/usage?userId=...
 *
 * Admin endpoint for debugging usage data.
 * Requires admin role or valid API key.
 */
export async function GET(req: NextRequest) {
  // Simple auth check — in production, use proper admin auth
  const authHeader = req.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    // Return usage for all users (last 7 days)
    const usage = await db
      .select({
        userId: apiUsage.userId,
        userName: user.name,
        userEmail: user.email,
        date: apiUsage.date,
        callCount: apiUsage.callCount,
      })
      .from(apiUsage)
      .leftJoin(user, eq(apiUsage.userId, user.id))
      .orderBy(desc(apiUsage.date))
      .limit(500);

    return NextResponse.json({ usage });
  }

  // Return usage for specific user
  const usage = await db
    .select()
    .from(apiUsage)
    .where(eq(apiUsage.userId, userId))
    .orderBy(desc(apiUsage.date))
    .limit(30);

  return NextResponse.json({ userId, usage });
}
