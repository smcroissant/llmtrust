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
    const cookies = req.headers.get("cookie") ?? "";
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
