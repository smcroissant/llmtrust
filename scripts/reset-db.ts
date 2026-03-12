/**
 * scripts/reset-db.ts
 * 
 * Drops all tables and re-runs migrations + seed.
 * FOR DEVELOPMENT ONLY — never run against production.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as schema from "../src/server/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Export it before running this script.");
  process.exit(1);
}

// Safety check: refuse to run against production
if (DATABASE_URL.includes("prod") || DATABASE_URL.includes("main") || process.env.NODE_ENV === "production") {
  console.error("🚫 Refusing to reset — this looks like a production database.");
  console.error("   If you really want to do this, set FORCE_RESET=true");
  if (process.env.FORCE_RESET !== "true") process.exit(1);
}

const neonSql = neon(DATABASE_URL);
const db = drizzle(neonSql, { schema });

async function resetDb() {
  console.log("⚠️  Resetting development database...");

  // Drop all tables in dependency order using drizzle sql helper
  await db.execute(sql`DROP TABLE IF EXISTS "favorite" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "like" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "review" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "api_key" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "account" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "session" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "verification" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "model" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);
  console.log("  ✓ All tables dropped");

  console.log("\n🏗️  Next steps:");
  console.log("   1. Run: npm run db:migrate");
  console.log("   2. Run: npm run db:seed");
  console.log("\n✅ Database reset complete!");
}

resetDb()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  });
