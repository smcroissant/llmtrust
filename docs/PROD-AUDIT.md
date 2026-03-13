# LLM Trust — Production Audit Report

**Date:** March 13, 2026  
**URL:** https://www.llmtrust.com  
**Auditor:** Atlas (Automated)  
**Build commit:** d4511a7 (production)

---

## Executive Summary

| Status | Count |
|--------|-------|
| ✅ Working | 18 |
| ⚠️ Partial | 4 |
| ❌ Issues | 3 |

**Overall Health: Good** — The site is live and functional. Most pages render correctly with proper SEO. A few client-side rendered pages have minimal server content, and some data discrepancies exist.

---

## 1. Homepage (`/`) — ✅ WORKING

| Element | Status | Notes |
|---------|--------|-------|
| Hero section | ✅ | Title, subtitle, CTA buttons render |
| Stats bar | ✅ | Shows 31+ Models, 100.0M+ Downloads, 100% Free & Open |
| Featured Models | ✅ | 6 models displayed (LLaMA 3.1 8B/70B/405B, Phi 3.5 Mini, LLaMA 3.2 3B, Qwen 2.5 72B) |
| How It Works | ✅ | 3 steps: Browse → Compare → Download |
| Blog preview | ✅ | 3 latest articles shown |
| Lab logos | ✅ | Meta, Mistral, Google, Microsoft, Alibaba, Stability AI, EleutherAI, BigScience |
| CTA section | ✅ | Final call-to-action with Neural Glow styling |
| Footer | ✅ | Copyright 2026, HuggingFace attribution |

**Issue:** Downloads count shows 100.0M+ which seems inflated/inconsistent with the `15672.3K` shown on individual model cards.

---

## 2. Models Page (`/models`) — ⚠️ PARTIAL

| Element | Status | Notes |
|---------|--------|-------|
| Page title | ✅ | "Browse Open-Source LLMs — Compare 200+ AI Models" |
| Server content | ⚠️ | **Very minimal content returned** — the page is almost entirely client-side rendered (CSR) |
| Filters | ❓ | Cannot verify without JS execution — likely CSR |
| Model grid | ❓ | Cannot verify without JS execution — likely CSR |

**Issue:** The `/models` page is essentially an empty shell without JavaScript. Readability extraction returns almost no text. This hurts SEO crawlers that don't execute JS.

---

## 3. Model Detail Pages (`/models/[slug]`) — ⚠️ PARTIAL

| Slug | Status | Notes |
|------|--------|-------|
| `/models/llama-3.1-8b` | ✅ | Title: "LLaMA 3.1 8B (8B) — Specs & Benchmarks" |
| `/models/llama-3-70b` | ❌ | Returns "Model Not Found" — **slug mismatch** |

**Issue:** There's a slug inconsistency. The homepage links to `/models/llama-3.1-70b` but the old slug `/models/llama-3-70b` doesn't redirect — it just shows "Model Not Found". Old links from external sources will 404 without a redirect.

**Issue:** Model detail pages are also heavily CSR — minimal server content extracted.

---

## 4. Blog (`/blog`) — ✅ WORKING

| Element | Status | Notes |
|---------|--------|-------|
| Blog listing | ✅ | 6 articles visible with titles, dates, categories |
| Articles | ✅ | Articles dated Mar 12-13, 2026 |
| Categories | ✅ | Guides, Comparisons, Technical, Getting Started, Tutorials |
| Article pages | ✅ | Individual blog posts accessible |

**Articles found:**
- Best Open Source LLMs for Coding in 2026 (Mar 13)
- How to Choose the Right LLM for Your Project (Mar 13)
- Llama 3 vs Mistral vs Qwen (Mar 13)
- Understanding LLM Quantization (Mar 13)
- Running LLMs Locally: Complete Guide (Mar 13)
- Ultimate Guide to Open Source LLMs in 2026 (Mar 12)
- How to Run Llama 3 Locally (Mar 12)

---

## 5. Static Pages — ✅ ALL WORKING

| Page | Status | Title |
|------|--------|-------|
| `/pricing` | ✅ | Free/Pro ($9.99)/Team ($29.99) plans |
| `/about` | ✅ | About CroissantLabs, team, timeline, values |
| `/newsletter` | ✅ | Weekly digest signup form |
| `/categories` | ✅ | Category listing (CSR) |
| `/compare` | ✅ | Side-by-side comparison tool |
| `/docs` | ✅ | Full documentation |
| `/cookies` | ✅ | Cookie policy |
| `/privacy` | ✅ | Privacy policy |
| `/terms` | ✅ | Terms of service |

---

## 6. Authentication (`/auth/*`) — ✅ WORKING

| Page | Status | Notes |
|------|--------|-------|
| `/auth/sign-in` | ✅ | Email + Password form, link to sign-up |
| `/auth/sign-up` | ✅ | Name + Email + Password form, link to sign-in |
| Links to ToS/Privacy | ✅ | Present on both forms |

**Cannot verify:** Form submission, OAuth flows, password reset — requires manual testing.

---

## 7. Dashboard (`/dashboard`) — ⚠️ PARTIAL

| Page | Status | Notes |
|------|--------|-------|
| `/dashboard` | ⚠️ | Returns 200 but content is CSR-only (likely requires auth) |
| `/dashboard/favorites` | ❓ | Not tested |
| `/dashboard/settings` | ❓ | Not tested |
| `/dashboard/api-keys` | ❓ | Not tested |

**Issue:** The dashboard is behind authentication. Unauthenticated users get the CSR shell with no redirect to login. Consider adding an auth redirect for better UX.

---

## 8. SEO Analysis — ✅ GOOD

### Meta Tags (Homepage)

| Tag | Value | Status |
|-----|-------|--------|
| `<title>` | LLM Trust — Discover & Compare Open-Source LLMs | ✅ |
| `meta description` | Compare 200+ open-source LLMs with real benchmarks... | ✅ |
| `meta keywords` | LLM, large language models, open source AI... | ✅ |
| `robots` | index, follow | ✅ |
| `googlebot` | index, follow, max-video-preview:-1, max-image-preview:large | ✅ |
| `canonical` | https://llmtrust.com | ✅ |

### Open Graph

| Tag | Value | Status |
|-----|-------|--------|
| `og:title` | LLM Trust — Discover & Compare Open-Source LLMs | ✅ |
| `og:description` | Compare 200+ open-source LLMs... | ✅ |
| `og:image` | https://llmtrust.com/og-default.svg | ✅ |
| `og:type` | website | ✅ |
| `og:locale` | en_US | ✅ |

### Twitter Card

| Tag | Value | Status |
|-----|-------|--------|
| `twitter:card` | summary_large_image | ✅ |
| `twitter:image` | https://llmtrust.com/og-default.svg | ✅ |

### JSON-LD Structured Data

**WebSite schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LLM Trust",
  "url": "https://llmtrust.com",
  "potentialAction": {
    "@type": "SearchAction",
    "urlTemplate": "https://llmtrust.com/models?search={search_term_string}"
  }
}
```
✅ Valid, includes sitelinks search box.

**Organization schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LLM Trust",
  "url": "https://llmtrust.com",
  "logo": "https://llmtrust.com/logo.png",
  "foundingDate": "2026-01",
  "sameAs": ["https://github.com/smcroissant/llmtrust"]
}
```
⚠️ **Issue:** `logo` points to `logo.png` which may not exist — the homepage uses `og-default.svg`.

### Sitemap & Robots

| File | Status |
|------|--------|
| `/sitemap.xml` | ✅ (exists per build output) |
| `/robots.txt` | ✅ (exists per build output) |

---

## 9. Infrastructure — ✅ HEALTHY

**API Health Check (`/api/health`):**
```json
{
  "status": "healthy",
  "version": "d4511a7",
  "environment": "production",
  "checks": {
    "app": { "status": "ok" },
    "database": { "status": "ok", "latency": 309ms },
    "memory": { "status": "ok", "used": 35MB / 44MB }
  }
}
```

| Metric | Value | Status |
|--------|-------|--------|
| App status | ok | ✅ |
| Database | ok, 309ms latency | ✅ |
| Memory | 35/44 MB (79%) | ✅ |
| Version | d4511a7 | ✅ |
| Environment | production | ✅ |

**Note:** `uptime: 0` suggests the instance just restarted or this metric isn't tracked properly.

---

## 10. Design & UX — ✅ EXCELLENT

| Aspect | Status | Notes |
|--------|--------|-------|
| Neural Glow theme | ✅ | Consistent across all pages |
| Sidebar navigation | ✅ | Collapsible, search, categories from DB |
| Responsive design | ✅ | Mobile-friendly classes present |
| Animations | ✅ | Glow pulse, fade-up, scale-in effects |
| Dark mode default | ✅ | Theme defaults to dark |
| Vercel Analytics | ✅ | Loaded |
| Speed Insights | ✅ | Loaded |

---

## Issues Summary

### 🔴 Critical
1. **Slug mismatch on model detail pages** — `/models/llama-3-70b` returns 404. The actual slug is `llama-3.1-70b`. Old URLs should redirect.

### 🟡 Medium
2. **CSR-heavy pages hurt SEO** — `/models`, `/models/[slug]`, `/dashboard`, `/categories` return minimal HTML. Consider SSR/SSG for these pages.
3. **Dashboard UX** — No auth redirect for unauthenticated users; just shows empty shell.
4. **Downloads stat inconsistency** — Homepage claims "100.0M+" but individual cards show `15.6M` for the most downloaded model.
5. **JSON-LD logo mismatch** — Organization schema references `logo.png` but actual OG image is `og-default.svg`.

### 🟢 Minor
6. **Blog dates** — All blog articles are dated Mar 12-13, 2026. Content appears freshly seeded.
7. **`uptime: 0`** in health check — metric not properly tracked.

---

## Recommendations

1. **Add redirects** for old model slugs (`llama-3-70b` → `llama-3.1-70b`)
2. **Implement SSR** for model pages (use `generateMetadata` and server components)
3. **Fix downloads counter** — either update the hardcoded "100.0M+" or calculate dynamically
4. **Add auth guard** on dashboard with redirect to sign-in
5. **Fix JSON-LD logo** URL to match actual OG image
6. **Add uptime tracking** to health endpoint

---

*Audit completed at 01:56 CET on March 13, 2026*
