# Monitoring & Observability — LLM Trust

## Overview

LLM Trust uses a multi-layer monitoring stack:

| Layer | Tool | Purpose |
|-------|------|---------|
| Performance | Vercel Analytics + Speed Insights | Page views, Web Vitals, route performance |
| Error Tracking | Sentry | Exception capture, stack traces, alerts |
| Logging | Custom structured logger (`src/lib/logger.ts`) | API logs, slow query detection, request correlation |
| Health | `/api/health` endpoint | Service status, DB connectivity, uptime |
| Infrastructure | Vercel Dashboard | Deploy status, function logs, edge metrics |

---

## 1. What to Monitor

### Critical (P0 — PagerDuty / Immediate)
- **API Error Rate** — > 5% of requests returning 5xx
- **Database Connectivity** — Health check returning `unhealthy`
- **Auth Failures Spike** — > 100 failed logins/min (possible attack)
- **Memory Usage** — Heap > 90% of allocated
- **Deploy Failures** — Vercel build or deploy failing

### Important (P1 — Slack Alert / < 15 min response)
- **API Latency** — p95 > 3s for any endpoint
- **Database Latency** — Query response > 1s
- **Error Rate** — > 1% of requests returning 5xx
- **Slow API Calls** — Any single request > 5s
- **Web Vitals Degradation** — LCP > 4s, CLS > 0.25

### Informational (P2 — Daily digest)
- **Traffic patterns** — Daily/weekly active users
- **Model page views** — Most popular models
- **Search queries** — What users look for
- **Uptime** — Target 99.9% monthly

---

## 2. Alert Thresholds

### Sentry Alerts (configure in Sentry Dashboard → Alerts)

| Alert | Condition | Severity |
|-------|-----------|----------|
| High Error Rate | > 10 errors in 5 min | Critical |
| New Error Type | First occurrence of new error | Warning |
| Slow Transaction | p95 > 3000ms | Warning |
| Crash Rate | > 1% of sessions | Critical |

### Custom Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| API Response Time (p50) | > 500ms | > 2000ms |
| API Response Time (p95) | > 2000ms | > 5000ms |
| DB Query Time | > 500ms | > 1000ms |
| Memory Heap Used | > 75% | > 90% |
| Health Check DB Latency | > 500ms | > 1000ms |

---

## 3. Health Check Endpoint

**URL:** `GET /api/health`

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400,
  "version": "abc1234",
  "environment": "production",
  "checks": {
    "app": { "status": "ok" },
    "database": { "status": "ok", "latency": 12 },
    "memory": { "status": "ok", "used": 85, "total": 512, "unit": "MB" }
  }
}
```

### Status Codes
- `200` — Healthy or degraded
- `503` — Unhealthy (DB down)

### External Monitoring
Configure UptimeRobot or BetterStack to ping `/api/health` every 60 seconds.

---

## 4. Sentry Setup

### Initial Setup
1. Create a Sentry project at [sentry.io](https://sentry.io) → Select "Next.js"
2. Copy the DSN from Settings → Client Keys (DSN)
3. Add to environment:
   ```
   SENTRY_DSN=https://xxx@sentry.io/yyy
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/yyy
   ```
4. Deploy — Sentry is already integrated in:
   - `sentry.server.config.ts` — Server-side error capture
   - `sentry.client.config.ts` — Client-side error capture
   - `sentry.edge.config.ts` — Edge runtime
   - `src/instrumentation.ts` — Next.js instrumentation hook
   - `src/app/global-error.tsx` — React error boundary

### Sentry Dashboard Alerts
Configure these in Sentry → Alerts → Create Alert Rule:

1. **New Issue Alert** — Triggers on first occurrence of any new error
2. **High Volume Alert** — > 100 events/hour for any single issue
3. **Performance Alert** — Transaction duration p95 > 3s
4. **Crash Free Rate** — Falls below 99%

### Source Maps
Source maps are automatically uploaded during Vercel builds via `@sentry/nextjs` webpack plugin. The `hideSourceMaps` option in `next.config.ts` ensures they're not exposed publicly.

---

## 5. Structured Logging

### Usage

```typescript
import { logger, perfTimer, generateRequestId } from "@/lib/logger";

// Simple logging
logger.info("User signed up", { userId: "usr_123", requestId });
logger.error("Payment failed", { userId, requestId }, error);

// Performance tracking
const timer = perfTimer("db.query.models", 500); // warn if > 500ms
const models = await db.select().from(modelsTable);
timer.end({ requestId, route: "/api/trpc/models" });
```

### Log Levels
- `debug` — Verbose, development only
- `info` — Normal operations (default)
- `warn` — Slow operations, recoverable issues
- `error` — Failures requiring attention

Set `LOG_LEVEL=debug` in `.env.local` for verbose logging.

### Request ID Correlation
Every API request should generate a unique request ID:
```typescript
const requestId = generateRequestId();
// Pass through to all logger calls for traceability
```

---

## 6. Incident Runbook

### 🔴 Service Down (5xx errors, health check failing)

1. **Check Vercel Dashboard** → Deployments → Latest deploy status
2. **Check Health Endpoint**: `curl https://llmtrust.com/api/health`
3. **Check Sentry**: Any new critical errors?
4. **If DB issue**: Check Neon dashboard → Database status
5. **Rollback if needed**: Vercel → Deployments → Promote previous working deploy
6. **Communication**: Update status page / Slack

### 🟡 Slow Performance (high latency, timeouts)

1. **Vercel Analytics** → Speed Insights → Check Web Vitals
2. **Check Sentry Performance** → Slow transactions
3. **DB Check**: Health endpoint shows `database.latency`
4. **Neon Dashboard**: Check query performance, connection pool
5. **If specific route**: Check for N+1 queries, missing indexes

### 🟠 Error Spike

1. **Sentry Dashboard** → Issues → Sort by frequency
2. **Identify root cause** from stack trace
3. **Check if correlated** with recent deploy (Vercel deployments)
4. **If user-facing**: Consider feature flag to disable affected feature
5. **Fix & deploy hotfix**

### 🟡 Auth Issues (login failures)

1. **Check Better Auth logs** in Vercel function logs
2. **Verify BETTER_AUTH_SECRET** is set correctly
3. **Check Neon DB** — users/sessions tables accessible?
4. **If Stripe-related**: Check Stripe webhook delivery

---

## 7. Recommended Dashboards

### Vercel Dashboard
- **Analytics tab**: Page views, top pages, demographics
- **Speed Insights tab**: Core Web Vitals per route
- **Deployments tab**: Build times, deploy frequency

### Sentry Dashboard
- **Issues**: Error frequency, affected users
- **Performance**: Transaction breakdown, slow queries
- **Replays**: Session recordings on errors (if enabled)

### Neon Dashboard
- **Query Performance**: Slow query log
- **Connection Pool**: Active connections, pool saturation
- **Compute**: CPU/memory usage

### Recommended External Tools
- **UptimeRobot** — External uptime monitoring (free tier: 50 monitors)
- **BetterStack** — Status page + incident management
- **Grafana Cloud** — Custom metrics dashboards (if scaling)

---

## 8. Key Metrics Targets (SLO)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Availability | 99.9% monthly | Uptime monitoring |
| API Latency p50 | < 200ms | Vercel Analytics |
| API Latency p95 | < 1000ms | Vercel Analytics |
| Error Rate | < 0.1% | Sentry |
| LCP | < 2.5s | Speed Insights |
| FID | < 100ms | Speed Insights |
| CLS | < 0.1 | Speed Insights |
| DB Query p95 | < 500ms | Health check / custom |

---

## 9. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SENTRY_DSN` | Optional | Sentry DSN for server-side |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry DSN for client-side |
| `LOG_LEVEL` | Optional | Logging verbosity (default: `info`) |
| `VERCEL_ENV` | Auto | Set by Vercel (`production`, `preview`, `development`) |
| `VERCEL_GIT_COMMIT_SHA` | Auto | Current deploy commit SHA |
