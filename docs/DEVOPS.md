# LLM Trust — DevOps Documentation

## Architecture

- **Framework:** Next.js 16 (App Router)
- **Database:** Neon Serverless Postgres (Drizzle ORM)
- **Auth:** Better Auth (email/password)
- **API:** tRPC v11
- **Deploy:** Vercel (auto-deploy from GitHub)
- **Branches:** `main` (production) / `develop` (staging)

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

Runs on every push to `main`/`develop` and every PR:

| Job | Description |
|-----|-------------|
| **lint** | ESLint check |
| **typecheck** | TypeScript strict check (`tsc --noEmit`) |
| **build** | Full Next.js build (runs after lint + typecheck) |
| **security** | `npm audit --audit-level=high` |

### Deployment

Vercel auto-deploys:
- `main` → Production (`www.llmtrust.com`)
- `develop` → Preview/staging

## Pre-Push Hooks

A Husky pre-push hook runs `tsc --noEmit` + `npm run build` before each `git push`.
Install Husky after cloning:

```bash
npm install
npx husky init
cp .husky/pre-push .husky/_/pre-push  # or link accordingly
```

## Environment Variables

See `.env.example` for the full list. Required variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | ✅ |
| `BETTER_AUTH_SECRET` | Session encryption key (32+ chars) | ✅ |
| `BETTER_AUTH_URL` | App base URL | ✅ |
| `API_KEY_PREFIX` | Prefix for generated API keys | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key | Optional |
| `SIGNING_SECRET` | Stripe webhook secret | Optional |
| `UPLOADTHING_TOKEN` | File upload token | Optional |
| `CLERK_SECRET_KEY` | Clerk auth (legacy) | Optional |

## Security Posture

### ✅ What's Good

1. **No secrets in source code** — No hardcoded API keys/tokens in `src/`
2. **`.env*` gitignored** — All env files excluded from git
3. **Parameterized DB queries** — Drizzle ORM prevents SQL injection
4. **API key hashing** — Keys are hashed before storage
5. **Auth enforcement** — tRPC context validates session or API key on every request
6. **Image optimization** — Next.js configured for AVIF/WebP
7. **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

### ⚠️ Action Required

1. **npm audit vulnerabilities** — 5 moderate (esbuild via drizzle-kit/better-auth). Wait for upstream fix or consider `npm audit fix --force` (breaking change).
2. **HSTS** — Uncomment `Strict-Transport-Security` header once HTTPS is verified in production.
3. **CSP** — Add a Content-Security-Policy header once the app's external dependencies are finalized.
4. **CORS** — No explicit CORS config found. If API is consumed by external clients, configure CORS properly.
5. **Rate limiting** — No rate limiting detected on API routes. Consider adding for public endpoints.
6. **Better Auth secret** — Ensure `BETTER_AUTH_SECRET` is 32+ chars and different between environments.

### 🟡 Recommendations

- Enable Vercel's built-in Web Application Firewall (WAF)
- Set up Vercel Environment Variable encryption
- Add `npm audit` to CI (already done ✅)
- Consider adding integration/E2E tests
- Set up error monitoring (Sentry — ironic but useful)

## Performance

- **React Compiler** enabled (`next.config.ts`) ✅
- **Image formats** configured for AVIF + WebP ✅
- **Incremental TypeScript** enabled ✅
- **Bundle analysis:** Run `ANALYZE=true npm run build` with `@next/bundle-analyzer` to check size

## Adding New Environment Variables

1. Add to `.env` for local dev
2. Add to `.env.example` with description
3. Add to Vercel project settings (Settings → Environment Variables)
4. Document in `docs/DEVOPS.md`

---

*Last updated: 2026-03-12 — by Sentry 🛡️*
