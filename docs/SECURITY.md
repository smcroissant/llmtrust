# Security Policy & Documentation

## Overview

LLM Trust implements defense-in-depth security across all layers of the application. This document covers our security posture, vulnerability disclosure process, and incident response procedures.

---

## 1. Security Architecture

### 1.1 Rate Limiting

Rate limiting is enforced at the middleware layer (`src/middleware.ts`) with in-memory sliding window counters.

| Endpoint Pattern | Limit | Window | Scope |
|---|---|---|---|
| `/api/auth/*` | 10 requests | 1 minute | Per IP |
| `/api/*` (general) | 100 requests | 1 minute | Per IP |
| Upload endpoints | 5 requests | 1 hour | Per user |

- Returns HTTP 429 with `Retry-After` header when exceeded
- For production at scale: migrate to Vercel KV / Redis backend (`src/lib/rate-limit.ts`)

### 1.2 Authentication & Sessions

**Better Auth** with hardened configuration:

- **Password policy**: Minimum 8 characters, must contain uppercase, lowercase, and number
- **Session duration**: 7 days with 24-hour rolling refresh
- **Cookies**: `httpOnly`, `secure` (production), `sameSite=lax`, scoped to `/`
- **Cookie prefix**: `llmtrust_` to prevent cookie shadowing
- **CSRF protection**: Enabled via Better Auth defaults
- **API keys**: SHA-256 hashed storage, configurable expiration, prefix shown only at creation

### 1.3 Input Validation & Sanitization

- **tRPC + Zod**: All API inputs validated with strict Zod schemas (type, length, format)
- **XSS prevention**: User-generated content sanitized before storage (`src/lib/sanitize.ts`)
  - HTML tag stripping
  - Entity encoding for `<`, `>`, `&`, `'`, `"`
  - Null byte / control character removal
  - URL scheme validation (http/https only)
- **SQL injection**: Prevented by Drizzle ORM parameterized queries (no raw SQL)
- **File uploads**: Not currently implemented; when added, must enforce type/size limits

### 1.4 HTTP Security Headers

Applied via middleware to all responses:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Strict policy (see below) |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |

**CSP Directives:**
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sentry.io https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self' data:;
connect-src 'self' https://*.sentry.io https://vitals.vercel-insights.com wss: https:;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests
```

### 1.5 CORS Policy

- **Allowed origins**: `https://llmtrust.com`, `https://www.llmtrust.com`
- **Development**: Also allows `localhost:3000`, `localhost:3001`
- **Methods**: `GET`, `POST`, `OPTIONS`
- **Headers**: `Content-Type`, `Authorization`, `X-API-Key`
- Preflight (OPTIONS) requests handled; disallowed origins receive 403

### 1.6 Database Security

- All queries use Drizzle ORM with parameterized statements
- Foreign key constraints with cascade deletes
- Indexes on frequently queried columns
- No raw SQL queries in codebase

---

## 2. Dependency Security

### Current Audit Status (as of 2026-03-12)

```
5 moderate severity vulnerabilities
```

**Finding**: `esbuild <=0.24.2` via `drizzle-kit` (dev dependency)
- **Impact**: Development server only — allows any website to send requests to the dev server
- **Risk**: **ACCEPTED** — This is a dev dependency (`drizzle-kit`), not shipped to production
- **Action**: Monitor for `drizzle-kit` update that fixes the transitive dependency

### Running Audits

```bash
npm audit
npm audit fix           # Safe fixes only
npm audit fix --force   # Include breaking changes (use with caution)
```

---

## 3. Pre-Launch Security Checklist

### Infrastructure
- [x] Security headers configured (CSP, HSTS, X-Frame-Options, etc.)
- [x] CORS restricted to production domains
- [x] Rate limiting active on all API endpoints
- [x] HSTS with preload enabled

### Authentication
- [x] Password policy enforced (min 8 chars, complexity)
- [x] Session timeout configured (7 days)
- [x] Secure cookie configuration (httpOnly, secure, sameSite)
- [x] CSRF protection enabled
- [x] API key hashing (SHA-256)
- [x] API key expiration support

### Input/Output
- [x] All tRPC inputs validated with Zod
- [x] User content sanitized before storage
- [x] SQL injection prevented via ORM
- [x] XSS prevention via sanitization + React escaping

### Monitoring
- [x] Sentry error tracking configured
- [x] Vercel Analytics & Speed Insights
- [ ] Rate limit breach alerting (TODO: add monitoring)
- [ ] Failed auth attempt logging (TODO: add logging)

### Before Deploy
- [ ] Set `BETTER_AUTH_SECRET` to a strong random value (min 32 chars)
- [ ] Set `BETTER_AUTH_URL` to production URL
- [ ] Set `NODE_ENV=production`
- [ ] Verify `NEXT_PUBLIC_APP_URL` matches production domain
- [ ] Run `npm audit` and review findings
- [ ] Verify no `.env` files committed to repo
- [ ] Run `npm run build` and verify no errors

---

## 4. Vulnerability Disclosure

### Reporting a Vulnerability

If you discover a security vulnerability in LLM Trust:

1. **Do NOT** open a public GitHub issue
2. Email: security@llmtrust.com (or contact the team directly)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

### Response Timeline

| Phase | Timeline |
|---|---|
| Acknowledgment | Within 24 hours |
| Initial assessment | Within 72 hours |
| Fix timeline | Depends on severity (see below) |
| Public disclosure | After fix deployed (coordinated) |

### Severity Levels

| Level | Description | Fix Target |
|---|---|---|
| **Critical** | Remote code execution, auth bypass, data breach | < 24 hours |
| **High** | Privilege escalation, significant data exposure | < 72 hours |
| **Medium** | Limited data exposure, DoS potential | < 1 week |
| **Low** | Information disclosure, minor issues | Next release |

---

## 5. Incident Response Plan

### 5.1 Detection

- Sentry alerts for application errors
- Rate limit breach monitoring
- Unusual authentication patterns
- User reports

### 5.2 Response Steps

1. **Identify**: Determine scope and severity of the incident
2. **Contain**:
   - Revoke compromised credentials/API keys
   - Block malicious IPs at middleware level
   - Disable affected features if necessary
3. **Eradicate**: Deploy fix to production
4. **Recover**: Verify system integrity, restore normal operations
5. **Review**: Post-incident analysis within 48 hours

### 5.3 Communication

- Internal: Immediate notification to team
- Users: Within 24 hours if user data is affected
- Public: After resolution, if significant

### 5.4 Key Contacts

| Role | Responsibility |
|---|---|
| DevOps (Sentry) | Infrastructure, deployment, monitoring |
| Engineering (Forge) | Code fixes, patches |
| CEO (Solomon) | External communication, decisions |

---

## 6. Security Configuration Reference

### Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `BETTER_AUTH_SECRET` | Session encryption key | Yes |
| `BETTER_AUTH_URL` | Auth base URL | Yes |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Yes |
| `DATABASE_URL` | PostgreSQL connection | Yes |
| `SENTRY_DSN` | Error tracking | No |

### File Locations

| File | Purpose |
|---|---|
| `src/middleware.ts` | Rate limiting, CORS, CSP, security headers |
| `src/lib/rate-limit.ts` | Rate limit logic and configs |
| `src/lib/sanitize.ts` | Input sanitization utilities |
| `src/server/auth.ts` | Better Auth configuration |
| `src/server/api/trpc.ts` | tRPC context with auth |
| `next.config.ts` | Next.js configuration |

---

## 7. Regular Security Maintenance

### Weekly
- Review Sentry error reports for security-related issues
- Check rate limit metrics (if monitoring is in place)

### Monthly
- Run `npm audit` and review findings
- Review access logs for anomalies
- Update dependencies with security patches

### Quarterly
- Full security review of authentication flows
- Review and update CSP directives
- Test rate limiting effectiveness
- Review incident response procedures

---

*Document maintained by Sentry (DevOps). Last updated: 2026-03-12*
