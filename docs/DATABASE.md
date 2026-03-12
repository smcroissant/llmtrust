# Database — LLM Trust

## Stack

| Component | Technology |
|-----------|-----------|
| Database | [Neon Serverless Postgres](https://neon.tech) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) v0.45 |
| Migrations | drizzle-kit |
| Driver | `@neondatabase/serverless` (HTTP) |

## Architecture

```
┌──────────┐     HTTP      ┌──────────────────┐     ┌─────────────┐
│ Next.js  │ ───────────►  │ Neon Postgres    │     │ Drizzle Kit │
│ Server   │   (serverless)│ (us-east-1)      │◄────│ (migrations)│
│ Actions  │               │ Connection pooled │     └─────────────┘
└──────────┘               └──────────────────┘
```

- **Driver:** `neon()` HTTP driver — no TCP connections, no pool config needed
- **Connection pooling:** Handled automatically by Neon's serverless driver
- **Cold start:** Neon scales to zero; first query may have ~100ms latency
- **Schema:** `src/server/db/schema.ts` — single source of truth
- **Client:** `src/server/db/index.ts` — exports typed `db` instance

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate SQL migrations from schema changes |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:push` | Push schema directly (dev only, skips migrations) |
| `npm run db:seed` | Seed dev database with all models |
| `npm run db:seed:prod` | Seed production database (requires `CONFIRM_PROD_SEED=true`) |
| `npm run db:studio` | Open Drizzle Studio (web UI for browsing data) |
| `npm run db:reset` | Drop all tables and reset (dev only) |

---

## Migration Workflow

### 1. Modify Schema

Edit `src/server/db/schema.ts`:

```typescript
export const newTable = pgTable("new_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  // ...
});
```

### 2. Generate Migration

```bash
npm run db:generate
```

This creates a new SQL file in `drizzle/` (e.g., `0001_add_new_table.sql`).

### 3. Review Migration

Always review the generated SQL before applying:

```bash
cat drizzle/0001_add_new_table.sql
```

### 4. Apply Migration

```bash
# Local development
npm run db:push          # Quick apply (no migration file)

# Staging / Production
npm run db:migrate       # Apply via migration files (tracked)
```

### 5. Deploy

- **Staging (develop):** Migrations run automatically via Vercel build
- **Production (main):** Run `npm run db:migrate` as part of deployment, or use a migration step in CI

### Migration Best Practices

- **Never edit existing migration files** — create new ones
- **Always backup before migrating production**
- **Test migrations on staging first**
- **Use `db:push` only in local dev** — never in staging/prod
- **Review generated SQL** — drizzle-kit is smart but not infallible

---

## Database Schema

### Tables (9)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user` | User accounts (Better Auth) | id, email, name |
| `session` | Active sessions | id, userId, token, expiresAt |
| `account` | Auth provider accounts | userId, providerId, password |
| `verification` | Email verification tokens | identifier, value, expiresAt |
| `api_key` | Electron app API keys | userId, key (hashed), prefix |
| `model` | LLM models catalog | slug, name, status, downloadUrl |
| `review` | User reviews on models | modelId, userId, rating |
| `like` | Model likes | modelId, userId |
| `favorite` | User favorites (Electron sync) | userId, modelId |

### Indexes

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| `api_key_key_idx` | api_key | key | Fast API key lookup |
| `model_slug_idx` | model | slug | Slug-based routing |
| `model_category_idx` | model | category | Category filtering |
| `model_status_idx` | model | status | Draft/published filtering |
| `model_featured_idx` | model | isFeatured | Homepage featured query |
| `like_model_user_idx` | like | modelId, userId | Prevent duplicate likes |
| `favorite_user_model_idx` | favorite | userId, modelId | User favorites lookup |
| `review_model_idx` | review | modelId | Reviews per model |
| `review_user_model_idx` | review | userId, modelId | User's review on model |

### Relationships

```
user ──┬── session (1:N, cascade delete)
       ├── account (1:N, cascade delete)
       ├── api_key (1:N, cascade delete)
       ├── model (1:N, as author)
       ├── review (1:N, cascade delete)
       ├── like (1:N, cascade delete)
       └── favorite (1:N, cascade delete)

model ──┬── review (1:N, cascade delete)
        ├── like (1:N, cascade delete)
        └── favorite (1:N, cascade delete)
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon Postgres connection string | `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/db?sslmode=require` |

### Getting the Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **Connection Details**
4. Copy the **Pooled connection** string (recommended for serverless)
5. The string includes `?sslmode=require` automatically

### Branching (Neon Feature)

Neon supports database branching (like Git):

```bash
# Create a branch for a PR
neonctl branches create --name pr-123

# Get connection string for branch
neonctl connection-string pr-123
```

Use branches for:
- PR preview environments
- Testing migrations safely
- Load testing without affecting main DB

---

## Backup Strategy

### Neon Automatic Backups

Neon provides **Point-in-Time Recovery (PITR)** on paid plans:

| Plan | PITR Window | Snapshots |
|------|-------------|-----------|
| Free | 24 hours | None |
| Launch | 7 days | Daily |
| Scale | 14 days | Daily |
| Business | 30 days | Daily |

### Recommended Backup Schedule

| Type | Frequency | Method |
|------|-----------|--------|
| **PITR** | Automatic (paid plans) | Neon handles this |
| **Logical dump** | Daily | `pg_dump` via cron |
| **Schema dump** | On migration | `drizzle-kit generate` |
| **Full snapshot** | Before major migrations | Neon Console → Branch |

### Manual Backup

```bash
# Full database dump
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Schema only
pg_dump --schema-only $DATABASE_URL > schema-$(date +%Y%m%d).sql

# Data only (no DDL)
pg_dump --data-only $DATABASE_URL > data-$(date +%Y%m%d).sql
```

### Restore Procedure

```bash
# 1. Create a new Neon branch from the restore point
neonctl branches create --name restore-$(date +%Y%m%d) --restore-time "2024-01-15T10:30:00Z"

# 2. Get the new connection string
neonctl connection-string restore-20240115

# 3. Or restore from pg_dump
psql $NEW_DATABASE_URL < backup-20240115.sql

# 4. Verify data integrity
npm run db:studio  # Browse the restored data

# 5. Swap the connection string in production env
# Update DATABASE_URL in Vercel environment variables
```

### Emergency Runbook

**Data corruption detected:**
1. Immediately set app to read-only mode (or maintenance page)
2. Identify the last known good state
3. Create a Neon branch from PITR
4. Verify data on the branch
5. Update `DATABASE_URL` to point to the restored branch
6. Run any missing migrations
7. Clear caches if applicable

**Migration failed mid-way:**
1. Check the migration log for the failure point
2. Neon migrations within a transaction are auto-rolled back
3. Fix the migration SQL in `drizzle/`
4. Re-run `npm run db:migrate`

---

## Performance

### Current Index Coverage

The schema has good index coverage for expected query patterns:

- ✅ **Slug lookups** — `model_slug_idx` (primary routing)
- ✅ **Category filtering** — `model_category_idx` (browse by category)
- ✅ **Status filtering** — `model_status_idx` (draft vs published)
- ✅ **Featured query** — `model_featured_idx` (homepage)
- ✅ **API key auth** — `api_key_key_idx` (fast auth lookup)
- ✅ **User favorites** — `favorite_user_model_idx` (composite)
- ✅ **Reviews** — `review_model_idx`, `review_user_model_idx`

### Recommended Additional Indexes

Consider adding these as the app scales:

| Index | Table | When to Add |
|-------|-------|-------------|
| `user_email_idx` | user | If email lookups become frequent (already has UNIQUE constraint) |
| `session_token_idx` | session | If session validation is a bottleneck (already has UNIQUE) |
| `model_architecture_idx` | model | If filtering by architecture becomes common |
| `model_created_at_idx` | model | If sorting by "newest" becomes a default view |
| `review_created_at_idx` | review | If "recent reviews" feed is added |

### Query Optimization Tips

1. **Use `isFeatured` index** for homepage — avoid full table scans
2. **Paginate model listings** — use cursor-based pagination (UUID) for large datasets
3. **Select only needed columns** — avoid `SELECT *` in production queries
4. **Batch inserts in seed** — use `db.insert().values([...])` instead of loop

### Connection Pooling

Neon's HTTP driver (`@neondatabase/serverless`) handles connection pooling automatically:

- **No pool configuration needed** — the driver uses HTTP, not persistent TCP connections
- **Scales to zero** — no idle connections consuming resources
- **Concurrent requests** — Neon handles up to 10,000 concurrent queries per endpoint
- **Cold start** — ~100-200ms for first query after idle period

If you switch to the WebSocket driver (`@neondatabase/serverless` with `Pool`), configure:

```typescript
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,           // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
```

### Neon-Specific Optimizations

1. **Use pooled connection string** — includes `-pooler` in hostname
2. **Enable autoscaling** — Neon automatically scales compute based on load
3. **Read replicas** — for read-heavy workloads, create a read replica branch
4. **Connection caching** — Neon caches connections at the proxy layer

---

## Utilities

### Drizzle Studio

Browse and edit data visually:

```bash
npm run db:studio
```

Opens at `https://local.drizzle.studio`.

### Reset Dev Database

```bash
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Check Migration Status

```bash
npx drizzle-kit check
```

---

## Files

| File | Purpose |
|------|---------|
| `drizzle.config.ts` | Drizzle Kit configuration |
| `src/server/db/schema.ts` | Database schema (single source of truth) |
| `src/server/db/index.ts` | Database client instance |
| `src/server/db/seed.ts` | Development seed script (full dataset) |
| `scripts/seed-prod.ts` | Production seed script (curated subset) |
| `scripts/reset-db.ts` | Dev database reset utility |
| `drizzle/` | Generated SQL migrations |
| `docs/DATABASE.md` | This file |
