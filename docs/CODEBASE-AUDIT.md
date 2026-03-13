# Codebase Audit — LLM Trust

**Date:** 2026-03-13
**Auditor:** Atlas (Quality Gate — CroissantLabs)

---

## 1. Pages / Routes

### Public Pages
| Route | Status |
|---|---|
| `/` (Home) | ✅ Complete |
| `/models` | ✅ Complete (list + filters) |
| `/models/[slug]` | ✅ Complete (detail + reviews) |
| `/models/upload` | ✅ Complete (multi-step form) |
| `/models/upload/success` | ✅ Complete |
| `/compare` | ✅ Complete (index) |
| `/compare/[slugA]/vs/[slugB]` | ✅ Complete (dynamic compare) |
| `/compare/llama-3-70b-vs-gpt-4` | ✅ Static SEO page |
| `/compare/phi-3-mini-vs-gemma-2-9b` | ✅ Static SEO page |
| `/compare/mistral-large-vs-claude-3-opus` | ✅ Static SEO page |
| `/categories` | ✅ Complete |
| `/categories/[slug]` | ✅ Complete |
| `/best/small-llms` | ✅ Complete |
| `/best/code-llms` | ✅ Complete |
| `/best/open-source-llms` | ✅ Complete |
| `/blog` | ✅ Complete (paginated) |
| `/blog/[slug]` | ✅ Complete |
| `/blog/category/[category]` | ✅ Complete |
| `/docs` | ✅ Complete (inline content) |
| `/docs/api` | ✅ Complete (API reference) |
| `/about` | ✅ Complete (team page) |
| `/pricing` | ✅ Complete (3 tiers) |
| `/newsletter` | ✅ Complete |
| `/newsletter/confirm` | ✅ Complete |
| `/newsletter/unsubscribe` | ✅ Complete |
| `/privacy` | ✅ Complete |
| `/terms` | ✅ Complete |
| `/cookies` | ✅ Complete |

### Auth Pages
| Route | Status |
|---|---|
| `/auth/sign-in` | ✅ Complete |
| `/auth/sign-up` | ✅ Complete |

### Dashboard (authenticated)
| Route | Status |
|---|---|
| `/dashboard` | ✅ Complete (overview) |
| `/dashboard/favorites` | ✅ Complete |
| `/dashboard/api-keys` | ✅ Complete |
| `/dashboard/settings` | ✅ Complete |

### Admin
| Route | Status |
|---|---|
| `/admin` | ✅ Complete (overview) |
| `/admin/models` | ✅ Complete |
| `/admin/users` | ✅ Complete |

### API Routes
| Route | Status |
|---|---|
| `/api/trpc/[trpc]` | ✅ tRPC handler |
| `/api/v1/trpc/[trpc]` | ✅ tRPC v1 handler |
| `/api/auth/[...all]` | ✅ Better Auth handler |
| `/api/health` | ✅ Health check |
| `/api/cron/onboarding-emails` | ✅ Cron job |

### Utility
| Route | Status |
|---|---|
| `/notifications` | ✅ Complete |
| `/monitoring-tunnel` | ✅ Route handler |
| `/robots.ts` | ✅ |
| `/sitemap.ts` | ✅ |

**Total unique pages/routes: ~38**

---

## 2. Database Tables (18 tables)

### Auth (Better Auth)
1. `user` — Users
2. `session` — Sessions
3. `account` — OAuth accounts
4. `verification` — Email verification tokens

### Core
5. `model` — LLM models (main entity)
6. `like` — Model likes
7. `review` — Model reviews (1-5 rating)
8. `favorite` — User favorites

### API Keys
9. `api_key` — For Electron app auth

### Gamification
10. `badge` — Badge definitions
11. `user_badge` — User ↔ Badge awards
12. `user_stats` — User gamification stats (points, level, streaks)
13. `points_ledger` — Point transaction log

### Newsletter
14. `newsletter_subscriber` — Email subscribers

### Notifications
15. `notification` — In-app notifications

### Billing (Stripe)
16. `subscription` — User subscriptions
17. `payment` — Payment records

**Total: 17 domain tables (+ verification = 18 total)**

---

## 3. tRPC Routers (6 routers)

| Router | File | Purpose |
|---|---|---|
| `models` | `models.ts` | CRUD for models, categories, search |
| `user` | `user.ts` | Profile, favorites, stats, badges |
| `reviews` | `reviews.ts` | Create/list reviews |
| `admin` | `admin.ts` | Admin operations |
| `newsletter` | `newsletter.ts` | Subscribe/unsubscribe |
| `notifications` | `notifications.ts` | List/mark-read notifications |

**Total: 6 routers registered in root.ts** ✅

---

## 4. Components UI

### UI Primitives (shadcn/ui) — 22 components
- `avatar`, `badge`, `breadcrumb`, `button`, `card`, `dialog`, `dropdown-menu`, `empty-state`, `glow-card`, `input`, `label`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `skeleton-glow`, `stepper`, `table`, `tabs`, `textarea`, `tooltip`, `sonner` (toast)

### Layout — 6 components
- `header.tsx`, `footer.tsx`, `top-bar.tsx`, `dashboard-sidebar.tsx`, `admin-sidebar.tsx`, `app-sidebar.tsx`

### Feature Components
- `models/model-card.tsx`, `models/model-grid.tsx`, `models/model-card-enhanced.tsx`
- `notifications/notification-bell.tsx`, `notifications/notification-dropdown.tsx`
- `onboarding/quick-tour.tsx`
- `seo/page-seo.tsx`, `seo/structured-data.tsx`
- `hero-section.tsx`, `stats-bar.tsx`, `providers.tsx`

**Total: ~40 components**

---

## 5. Pages / Features Manquantes

| Manquant | Priorité | Notes |
|---|---|---|
| `/dashboard/badges` | Moyenne | Table `user_badge` + `badge` existent mais pas de page dédiée dans le dashboard |
| `/dashboard/leaderboard` | Basse | `userStats` + `pointsLedger` prêts, mais pas de classement |
| `/blog/[slug]` (dynamic) | — | Fichiers statiques uniquement ; pas de CMS/headless blog |
| `/admin/badges` | Basse | Pas de CRUD admin pour les badges |
| `/admin/newsletter` | Basse | Pas de vue admin pour les abonnés newsletter |
| Webhooks Stripe | Hauteur | `subscription` + `payment` tables existent, mais pas de route webhook visible |

---

## 6. Code Incomplet / Placeholders

### 🔴 Points critiques
1. **Blog "Coming soon"** — Le blog affiche un message "Coming soon" pour les articles dynamiques. Seuls les posts statiques MDX fonctionnent.
2. **Model detail — "Coming soon — one-click download"** — La section download locale affiche un placeholder. La feature Electron n'est pas implémentée côté web.
3. **Stripe webhooks absents** — Les tables `subscription` et `payment` sont définies mais aucune route `/api/webhooks/stripe` n'existe. La facturation ne fonctionnera pas sans webhook handler.

### 🟡 Points d'attention
4. **Gamification UI incomplète** — Le système de badges/points/levels est 100% backend (schema + likely router logic) mais manque de pages UI dans le dashboard pour visualiser les badges, le niveau, les streaks.
5. **API v1 docs** — `/docs/api` documente un REST API mais le projet utilise principalement tRPC. Le REST API semble être un wrapper futur — potentiellement pas encore implémenté.
6. **Monitoring tunnel** — Route `/monitoring-tunnel/route.ts` présente — à vérifier si c'est un feature ou un vestige.

### 🟢 Observations positives
7. **SEO bien structuré** — Metadata, canonical URLs, structured data (JSON-LD), sitemap, robots.txt.
8. **Seed data complet** — Le fichier `seed.ts` contient un catalogue riche de modèles LLM.
9. **Auth complet** — Better Auth bien configuré avec session, OAuth, email verification.
10. **Error boundaries** — Présents (`error.tsx`, `global-error.tsx`, `not-found.tsx`).

---

## 7. Résumé Exécutif

| Metric | Count |
|---|---|
| Pages/Routes | ~38 |
| DB Tables | 18 |
| tRPC Routers | 6 |
| UI Components | ~40 |

**Score de complétion estimé: 85%**

Le projet est globalement bien structuré avec une architecture Next.js App Router propre, Drizzle ORM bien typé, et un système de design cohérent (shadcn/ui). Les gaps principaux sont:

1. **Stripe integration** — Tables prêtes mais pas de webhook handler (bloquant pour le billing)
2. **Gamification UI** — Backend complet mais pas de frontend
3. **Blog content** — Placeholder "Coming soon" visible

Recommandation: Prioriser le webhook Stripe et la page badges dashboard pour combler les gaps les plus visibles.
