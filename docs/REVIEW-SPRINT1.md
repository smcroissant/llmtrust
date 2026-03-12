# 🏗️ Sprint 1 — Quality Gate Review

**Reviewer:** Atlas (Product Manager & Quality Gate)
**Date:** 2026-03-12
**Branch:** `develop`
**Build Status:** ❌ **FAILED** — TypeScript compilation error

---

## Feature 1: Seed Script (`src/server/db/seed.ts`)

### ✅ Validé (avec remarques)

**Positifs :**
- **33 modèles** réels livrés (plus que les 31 annoncés — bonus)
- Données complètes et structurées : slug, name, description, longDescription, architecture, parameterCount, contextLength, license, downloadUrl, category, tags, localExecution
- Tous les modèles ont un `localExecution` bien défini avec format, quantizations, defaultQuantization, recommendedRam, minRam
- Catégories variées : text-generation, code, vision, embedding
- Architecture familles complètes : LLaMA (3.1, 3.2), Mistral, Qwen, Gemma, DeepSeek, Phi, Yi, Command R, Falcon, LLaVA, BGE, WizardMath, Granite, SmolLM
- URLs HuggingFace au bon format (`https://huggingface.co/{org}/{model}`)
- Type-safe avec `ModelSeed` interface
- Seed script logique : delete all → insert one by one avec logs

**Remarques mineures :**
- Les URLs HuggingFace pointent vers des repos réels et connus — valides
- Le seed fait un `db.delete(schema.model)` sans vérifier si des FK existent (likes, reviews, favorites). En prod avec des données utilisateur, casserait les FK. Pour le seed initial, c'est acceptable.
- Pas de vérification de `DATABASE_URL` avant exécution (plantera avec une erreur cryptique si la var n'est pas set)

**Verdict :** ✅ **APPROUVÉ**

---

## Feature 2: Pages Auth (`/auth/sign-in`, `/auth/sign-up`)

### ❌ Rejeté — Problème de build bloquant

**Positifs :**
- Design Neural Glow cohérent : `card-glow`, `text-gradient-brand`, glow orbs décoratifs
- AuthForm réutilisé entre sign-in et sign-up avec prop `mode`
- Validation : `required` sur tous les champs, `minLength={8}` sur password
- Loading state avec spinner SVG animé
- Error handling avec affichage inline + `result.error.message`
- Redirect et `router.refresh()` après succès
- Layout auth dédié avec `min-h-screen` centering
- Liens Terms/Privacy/footer corrects
- Cross-links sign-in ↔ sign-up
- `robots: { index: false, follow: false }` sur le layout auth (bon SEO)

**Problèmes :**
1. **Pas de validation email côté client** — `type="email"` donne la validation HTML native, mais pas de regex ou zod schema client-side
2. **Pas de confirmation password** sur le sign-up — risque de typos
3. **Pas de `card-glow` relative positioning** sur le sign-in card (le sign-up a `relative overflow-hidden`, le sign-in non) — les glow orbs décoratifs pourraient déborder

**Verdict :** ❌ **REJETÉ** — bloqué par le build failure global (voir ci-dessous). Le code auth en soi est fonctionnel mais ne peut pas être validé runtime.

---

## Feature 3: Pages ↔ tRPC (`/models`, `/models/[slug]`, Homepage)

### ✅ Validé (avec remarques)

**Positifs :**
- `/models` : `ModelsPageClient` utilise `trpc.models.list.useQuery` avec filtres (category, search, sort, pagination)
- Loading state avec `Loader2` spinner
- Error state avec message d'erreur affiché
- Pagination complète (Previous/Next avec page count)
- Category badges interactives
- Sort dropdown fonctionnel
- `/models/[slug]` : Server Component qui utilise `serverCaller.models.get()` — **pas de données hardcodées**
- `generateMetadata` dynamique depuis la DB
- `generateStaticParams` pour SSG
- Structured data JSON-LD (SoftwareApplication, Breadcrumb)
- Model detail avec tabs (Overview, Specs, Usage, Reviews)
- Homepage : `serverCaller` pour featured models, categories, stats
- `LatestModels` component client avec tRPC pour newest models
- Données catégories dynamiques depuis la DB (avec icônes mapping)

**Remarques :**
- **StatsBar et HeroSection ont des stats hardcodées** (`"200+"`, `"500K+"`, `"15+"`, `"100%"`). Le homepage fait bien un `serverCaller.models.stats()` mais ne l'utilise pas dans HeroSection/StatsBar. Ces components prennent des props optionnelles mais la page ne les passe pas.
- Model detail tab "Reviews" affiche `4.5` et `100 reviews` en dur — pas connecté aux vraies données de la DB
- Model detail tab "Specs" a des valeurs hardcodées (`"GGUF (recommended), Safetensors"`, `"Q4_K_M, Q5_K_M, Q8_0"`, `"ChatML"`) alors que `localExecution` contient ces données
- `parseInt(model.parameterCount)` dans les specs ne marche pas pour `"405B"`, `"671B"`, `"335M"` — retournera `NaN`
- Le model detail page passe `author: "Community"` en dur au lieu de fetch le vrai auteur

**Verdict :** ✅ **APPROUVÉ** — La data flow DB → tRPC → UI fonctionne. Les hardcodés dans le detail sont des P1 à corriger dans le prochain sprint.

---

## Feature 4: Search fonctionnelle (Sidebar)

### ✅ Validé

**Positifs :**
- Search bar dans le sidebar header
- tRPC `models.list.useQuery` avec `enabled: searchQuery.length >= 2` (lazy loading)
- Dropdown avec résultats : nom, architecture, parameterCount, category badge
- Loading spinner pendant la recherche
- "No models found" state
- "View all X results" link si plus de 5 résultats
- Enter → navigate to `/models?search=...`
- Escape → close dropdown
- Click outside → close (via `onBlur` avec 200ms timeout)
- Categories dans sidebar aussi fetchées depuis la DB via `trpc.models.categories.useQuery()`

**Verdict :** ✅ **APPROUVÉ**

---

## Feature 5: Liens et Pages Statiques

### ❌ Rejeté — Liens cassés identifiés

**Pages créées :**
- `/docs` ✅ — Page docs avec Getting Started, Browse Models, Run Locally, API Reference
- `/docs/api` ✅ — API reference page
- `/terms` ✅ — Terms of Service
- `/privacy` ✅ — Privacy Policy

**Liens dans Header :**
- `/models` ✅
- `/models` (Categories) ⚠️ — Même lien que Models, pas une page séparée
- `/compare` ❌ — **Page n'existe pas** (`src/app/compare/` absent)
- `/auth/sign-in` ✅
- `/auth/sign-up` ✅

**Liens dans Sidebar :**
- `/` ✅
- `/models` ✅
- `/compare` ❌ — **Page n'existe pas**
- `/blog` ❌ — **Page n'existe pas** (`src/app/blog/` absent)
- `/dashboard` ❌ — **Page n'existe pas** (existe `favorites` mais pas `dashboard`)
- `/settings` ✅ — existe
- `/auth/sign-in` ✅

**Verdict :** ❌ **REJETÉ** — 3 liens cassés (`/compare`, `/blog`, `/dashboard`). Ces pages devraient être soit créées soit les liens retirés/mis en "coming soon".

---

## Build Status

### ❌ BUILD FAILED

**Erreur :** `next.config.ts:35` — La clé `sentry` n'existe pas dans le type `NextConfig` de Next.js 16.

```typescript
// next.config.ts:35
sentry: {
  hideSourceMaps: true,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring-tunnel",
},
```

**Cause :** Next.js 16 a retiré le support natif de la config Sentry inline. La configuration Sentry doit être gérée via `withSentryConfig()` wrapper ou le fichier `sentry.client.config.ts` / `sentry.server.config.ts`.

**Correction nécessaire :**
1. Supprimer le bloc `sentry: { ... }` de `next.config.ts`
2. Utiliser `withSentryConfig()` wrapper si nécessaire, ou s'appuyer sur les fichiers de config Sentry séparés

---

## Résumé des Corrections Nécessaires

### 🔴 Bloquant (doit être corrigé avant merge)

| # | Issue | Fichier | Priorité |
|---|-------|---------|----------|
| 1 | Build failure — config Sentry invalide | `next.config.ts:35` | **P0** |
| 2 | Liens cassés `/compare`, `/blog`, `/dashboard` | `app-sidebar.tsx`, `header.tsx` | **P0** |

### 🟡 Important (prochain sprint)

| # | Issue | Fichier | Priorité |
|---|-------|---------|----------|
| 3 | Stats hardcodées dans HeroSection/StatsBar | `hero-section.tsx`, `stats-bar.tsx` | P1 |
| 4 | Reviews hardcodés (4.5, 100 reviews) dans model detail | `model-detail-client.tsx` | P1 |
| 5 | Specs hardcodées dans model detail (format, quantizations, template) | `model-detail-client.tsx` | P1 |
| 6 | `parseInt()` ne marche pas pour "405B", "671B" | `model-detail-client.tsx` | P1 |
| 7 | Author hardcodé "Community" | `models/[slug]/page.tsx` | P1 |
| 8 | Pas de confirmation password sur sign-up | `auth-forms.tsx` | P1 |

### 🟢 Nice to have

| # | Issue | Priorité |
|---|-------|----------|
| 9 | Validation email côté client (zod) | P2 |
| 10 | `DATABASE_URL` check dans seed script | P2 |

---

## Verdict Global

### ❌ **PAS PRÊT À MERGER EN PROD**

**Raisons :**
1. **Build ne passe pas** — bloquant absolu. Le code ne compile pas à cause de la config Sentry.
2. **3 liens cassés** dans la navigation — l'utilisateur cliquera sur des 404.
3. Plusieurs données hardcodées dans le model detail qui devraient venir de la DB.

**Ce qui est bon :**
- Architecture technique solide (tRPC, Drizzle, Better Auth, server components)
- Seed data riche et bien structurée (33 modèles)
- Search fonctionnelle avec UX soignée
- Auth flow complet avec bon design Neural Glow
- Code TypeScript propre, pas de `any` visible
- Pages statiques (docs, terms, privacy) correctement implémentées

**Plan de correction recommandé :**
1. **Immédiat** : Fix `next.config.ts` (supprimer bloc sentry) → build passe
2. **Immédiat** : Créer des placeholder pages pour `/compare`, `/blog`, `/dashboard` OU retirer les liens du sidebar
3. **Sprint 2** : Connecter les stats/author/specs/reviews aux vraies données DB
4. **Sprint 2** : Ajouter confirmation password + validation zod

---

*Rapport généré par Atlas — Product Manager & Quality Gate*
