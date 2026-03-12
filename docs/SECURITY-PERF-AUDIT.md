# 🔒 Security & Performance Audit — LLM Trust

**Date:** 2026-03-13
**Auditor:** Sentry (Head of DevOps, CroissantLabs 🥐)
**Branch:** `develop`
**Next.js:** 16.1.6 | **React:** 19.2.3

---

## Executive Summary

The LLM Trust platform is **mostly production-ready** with good security foundations. One **critical bug** was found and fixed during this audit (Edge runtime crash in rate limiter). Several improvements are recommended before launch.

| Area | Status | Risk |
|------|--------|------|
| Security Headers | ✅ Good | Low |
| Rate Limiting | ✅ Fixed | Low |
| CSP | ⚠️ Needs tightening | Medium |
| CI Pipeline | ✅ Good | Low |
| Secrets Management | ⚠️ Review needed | Medium |
| Edge Runtime Compat | ✅ Fixed | — |
| npm Dependencies | ⚠️ 5 moderate vulns | Low |

---

## 1. Performance Audit (Code Analysis)

### Pages Analyzed
- **Homepage** (`/`) — Server component with DB fetch via tRPC, ISR/SSG
- **Models** (`/models`) — Client-side interactive with server metadata
- **Model Detail** (`/models/[slug]`) — SSG with `generateStaticParams`, structured data
- **Blog** (`/blog`) — Static content with MDX

### Performance Strengths
- ✅ **Static generation** for models, blog posts, categories (SSG/ISR)
- ✅ **React Compiler** enabled (`reactCompiler: true` in next.config.ts)
- ✅ **Image optimization** — AVIF + WebP formats configured
- ✅ **`display: "swap"`** on Inter font loading
- ✅ **`staleTime: 60s`** on React Query to reduce refetches
- ✅ **Structured data / JSON-LD** for SEO (SoftwareApplication, Breadcrumb, FAQ)
- ✅ **`@vercel/speed-insights`** and **`@vercel/analytics`** integrated
- ✅ **Sitemap** and **robots.txt** properly configured
- ✅ **Canonical URLs** on all pages

### Performance Concerns
- ⚠️ **Homepage fetches 3 DB queries in parallel** (featured, categories, stats) — good pattern, but no caching headers visible. Consider `unstable_cache` or `revalidate` tags.
- ⚠️ **No explicit `revalidate` export** on dynamic pages — defaults to on-demand or per-request. For `/models` list, consider `revalidate = 300` (5min) to reduce DB load.
- ⚠️ **No `loading.tsx`** for `/blog` page — could cause layout shift during navigation.
- ℹ️ **No webmanifest** — consider adding for PWA/mobile experience (not critical for launch).

### Estimated Scores (Code-Based)
| Metric | Est. Score | Notes |
|--------|-----------|-------|
| Performance | 85-92 | Good SSG coverage, React Compiler |
| Accessibility | 90-95 | No empty alts, semantic HTML, aria labels |
| SEO | 95-100 | Excellent metadata, sitemap, robots, structured data |
| Best Practices | 90-95 | Security headers, HTTPS, modern stack |

---

## 2. Security Headers

### Current Implementation (`src/middleware.ts`)

All headers are properly set via middleware:

| Header | Value | Status |
|--------|-------|--------|
| `Content-Security-Policy` | Configured | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `X-XSS-Protection` | `1; mode=block` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | ✅ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | ✅ |

### CORS Configuration
- ✅ Whitelist-based: `llmtrust.com`, `www.llmtrust.com`, localhost (dev only)
- ✅ Preflight handled (OPTIONS)
- ✅ Credentials allowed only for whitelisted origins

### CSP Analysis
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sentry.io https://va.vercel-scripts.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: https: blob:
font-src 'self' data:
connect-src 'self' https://*.sentry.io https://vitals.vercel-insights.com wss: https:
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
object-src 'none'
upgrade-insecure-requests
```

**Recommendations:**
- ⚠️ `'unsafe-eval'` in `script-src` — Required for Next.js dev mode and React Compiler, but tighten for production (use nonces if possible)
- ⚠️ `'unsafe-inline'` in `script-src` — Required for Next.js inline scripts; consider nonce-based CSP for production
- ⚠️ `https:` in `connect-src` — Very permissive; narrow to specific API domains for production
- ⚠️ `https:` in `img-src` — Allows any HTTPS image; consider narrowing

---

## 3. Rate Limiting

### Implementation (`src/lib/rate-limit.ts` + `src/middleware.ts`)

| Endpoint | Limit | Window | Status |
|----------|-------|--------|--------|
| `/api/auth/*` | 10 req | 1 min | ✅ |
| `/api/trpc/*` | 100 req | 1 min | ✅ |
| `/api/v1/trpc/*` | 100 req | 1 min | ✅ |
| General `/api/*` | 100 req | 1 min | ✅ |

### Features
- ✅ Sliding window counter via in-memory Map
- ✅ Auto-cleanup of expired entries (every 5 min)
- ✅ Returns `Retry-After` header on 429
- ✅ IP extraction via `X-Forwarded-For` / `X-Real-IP`
- ✅ Auth endpoints have stricter limits (10/min vs 100/min)

### Known Limitations
- ⚠️ **In-memory storage** — Rate limits reset on server restart and are per-instance. For production at scale, migrate to **Vercel KV / Redis**. This is documented in the code.
- ℹ️ The `UPLOAD_RATE_LIMIT` (5/hour) config exists but is not currently enforced in middleware.

### Bug Fixed During Audit
- 🔴 **CRITICAL: Edge Runtime Crash** — `setInterval(...).unref()` was not guarded, causing `TypeError` in Next.js Edge runtime middleware. **Fixed** with a `typeof` guard.

---

## 4. Environment Variables

### `.env.example` Completeness

All required variables are documented in `.env.example`:

| Variable | Documented | Used In Code |
|----------|-----------|--------------|
| `DATABASE_URL` | ✅ | ✅ |
| `BETTER_AUTH_SECRET` | ✅ | ✅ |
| `BETTER_AUTH_URL` | ✅ | ✅ |
| `API_KEY_PREFIX` | ✅ | ✅ |
| `STRIPE_SECRET_KEY` | ✅ | ✅ |
| `SIGNING_SECRET` | ✅ | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | ✅ | ✅ |
| `CLERK_SECRET_KEY` | ✅ | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | ✅ |
| `UPLOADTHING_TOKEN` | ✅ | ✅ |
| `NEXT_PUBLIC_APP_URL` | ✅ | ✅ |
| `NEXT_PUBLIC_API_URL` | ✅ | ✅ |
| `API_URL` | ✅ | ✅ |
| `PRODUCT_ID` | ✅ | ✅ |
| `SENTRY_DSN` | ✅ | ✅ |
| `NEXT_PUBLIC_SENTRY_DSN` | ✅ | ✅ |
| `LOG_LEVEL` | ✅ | ✅ |
| `RESEND_API_KEY` | ✅ | ✅ |

### Secrets Management
- ✅ `.env*` files are in `.gitignore`
- ✅ Only `.env.example` is tracked in git
- ✅ No hardcoded secrets found in source code
- ⚠️ **`.env.local` exists with production keys** (`sk_live_`, `pk_live_`, `whsec_`) — This file was created by Vercel CLI and is NOT tracked in git (good), but ensure it's never committed.

### Hardcode Check
- ✅ No API keys, passwords, or secrets hardcoded in `src/`
- ✅ All sensitive values come from `process.env`
- ✅ Base URLs properly use env vars with fallbacks

---

## 5. CI Pipeline

### Current Workflow (`.github/workflows/ci.yml`)

| Job | Status |
|-----|--------|
| ESLint | ✅ |
| TypeScript Check (`tsc --noEmit`) | ✅ |
| Build | ✅ (depends on lint + typecheck) |
| Security Audit (`npm audit --audit-level=high`) | ✅ |

Triggers: Push to `main`/`develop`, PRs to `main`/`develop`.

### Recommendations for CI Enhancement

**Add Lighthouse CI:**
```yaml
lighthouse:
  name: Lighthouse CI
  runs-on: ubuntu-latest
  needs: [build]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
    - run: npm ci
    - run: npm run build
    - run: npx @lhci/cli autorun --collect.url=http://localhost:3000 --collect.url=http://localhost:3000/models
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

---

## 6. Dependency Audit

### npm audit Results
- **5 moderate severity vulnerabilities**
- All from `drizzle-kit` → `@esbuild-kit/esm-loader` → `esbuild` chain
- Only affects devDependencies (drizzle-kit), not production code
- Fix available via `npm audit fix --force` (breaking change to drizzle-kit 0.18.1)

**Recommendation:** Monitor for drizzle-kit updates. Not blocking for production since it's a devDependency.

---

## 7. Additional Findings

### ✅ Good Practices
- **Auth:** Better Auth with email/password, email verification, password reset flows
- **Password validation:** Min 8 chars, uppercase, lowercase, number requirements
- **API key auth:** SHA-256 hashed keys for Electron app
- **Structured logging:** JSON in production, formatted in dev
- **Error handling:** Global error boundary (`error.tsx`, `global-error.tsx`)
- **Sentry:** Integrated for client, server, and edge error tracking
- **SEO:** Comprehensive metadata, OpenGraph, Twitter cards, structured data

### ⚠️ Recommendations
1. **CSP tightening** — Move to nonce-based CSP for production to eliminate `'unsafe-inline'` and `'unsafe-eval'`
2. **Rate limit backend** — Migrate to Redis/Vercel KV for distributed rate limiting
3. **Add Lighthouse CI** — Automated performance regression detection
4. **Add `revalidate` exports** — Cache frequently-accessed pages (models list, categories)
5. **Monitor npm audit** — Track drizzle-kit esbuild vulnerability resolution
6. **Clerk migration** — `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are in `.env.example` but Better Auth is the active auth system. Remove Clerk references if migration is complete.

---

## Action Items

| Priority | Item | Owner |
|----------|------|-------|
| 🔴 Done | Fix Edge runtime crash in rate-limit.ts | Sentry ✅ |
| 🟡 High | Tighten CSP for production (nonces) | Forge |
| 🟡 High | Add revalidate exports to cacheable pages | Forge |
| 🟢 Medium | Add Lighthouse CI to GitHub Actions | Sentry |
| 🟢 Medium | Migrate rate limiting to Redis/KV | Sentry |
| 🟢 Medium | Remove Clerk env vars if unused | Forge |
| ℹ️ Low | Add webmanifest for PWA | Forge |
| ℹ️ Low | Monitor drizzle-kit vulnerability | Sentry |

---

*Audit completed by Sentry 🥐 | CroissantLabs DevOps*
*Next audit scheduled: Before production launch*
