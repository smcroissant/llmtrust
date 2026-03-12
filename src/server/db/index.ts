import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set. Cannot initialize database.");
    }
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

/** @deprecated Use getDb() instead */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const actual = getDb();
    return Reflect.get(actual, prop, receiver);
  },
});
