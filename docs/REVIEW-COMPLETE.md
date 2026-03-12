# 🔍 LLM Trust — Review Complète (Sprint 2)

**Branche:** `develop`  
**Date:** 12 mars 2026  
**Reviewer:** Atlas (CroissantLabs 🥐)

---

## 1. Build Status

| Check | Statut |
|-------|--------|
| `npm run build` | ✅ Passé (Next.js 16.1.6, Turbopack) |
| TypeScript | ✅ 0 erreurs |
| Static pages générées | ✅ 37 pages |

**Note:** Warning sur le middleware (`middleware` → `proxy` convention). Non-bloquant mais à migrer.

---

## 2. Inventaire Complet des Pages

### Pages de l'application

| # | Route | Fichier | Statut | Source données |
|---|-------|---------|--------|----------------|
| 1 | `/` | `src/app/page.tsx` | ✅ | tRPC (serverCaller) |
| 2 | `/auth/sign-in` | `src/app/(auth)/auth/sign-in/page.tsx` | ✅ | Better Auth |
| 3 | `/auth/sign-up` | `src/app/(auth)/auth/sign-up/page.tsx` | ✅ | Better Auth |
| 4 | `/models` | `src/app/models/page.tsx` | ✅ | tRPC (client) |
| 5 | `/models/[slug]` | `src/app/models/[slug]/page.tsx` | ✅ | tRPC (serverCaller) |
| 6 | `/models/upload` | `src/app/models/upload/page.tsx` | ✅ | tRPC (mutation) |
| 7 | `/models/upload/success` | `src/app/models/upload/success/page.tsx` | ✅ | Search params |
| 8 | `/dashboard` | `src/app/dashboard/page.tsx` | ✅ | tRPC (client) |
| 9 | `/dashboard/favorites` | `src/app/dashboard/favorites/page.tsx` | ✅ | tRPC (client) |
| 10 | `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` | ✅ | tRPC (client) |
| 11 | `/admin` | `src/app/admin/page.tsx` | ✅ | tRPC (admin) |
| 12 | `/admin/models` | `src/app/admin/models/page.tsx` | ✅ | tRPC (admin) |
| 13 | `/admin/users` | `src/app/admin/users/page.tsx` | ✅ | tRPC (admin) |
| 14 | `/blog` | `src/app/blog/page.tsx` | ✅ | Markdown (lib/blog) |
| 15 | `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | ✅ | Markdown (lib/blog) |
| 16 | `/compare` | `src/app/compare/page.tsx` | ✅ | Statique (placeholder) |
| 17 | `/compare/[slugA]/vs/[slugB]` | `src/app/compare/[slugA]/vs/[slugB]/page.tsx` | ✅ | tRPC (client) |
| 18 | `/compare/llama-3-70b-vs-gpt-4` | `src/app/compare/llama-3-70b-vs-gpt-4/page.tsx` | ⚠️ | **Hardcodé** |
| 19 | `/compare/mistral-large-vs-claude-3-opus` | `src/app/compare/mistral-large-vs-claude-3-opus/page.tsx` | ⚠️ | **Hardcodé** |
| 20 | `/compare/phi-3-mini-vs-gemma-2-9b` | `src/app/compare/phi-3-mini-vs-gemma-2-9b/page.tsx` | ⚠️ | **Hardcodé** |
| 21 | `/categories` | `src/app/categories/page.tsx` | ✅ | tRPC (serverCaller) |
| 22 | `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | ✅ | tRPC (serverCaller) |
| 23 | `/best/code-llms` | `src/app/best/code-llms/page.tsx` | ⚠️ | **Hardcodé** |
| 24 | `/best/open-source-llms` | `src/app/best/open-source-llms/page.tsx` | ⚠️ | **Hardcodé** |
| 25 | `/best/small-llms` | `src/app/best/small-llms/page.tsx` | ⚠️ | **Hardcodé** |
| 26 | `/docs` | `src/app/docs/page.tsx` | ✅ | Statique (ok) |
| 27 | `/docs/api` | `src/app/docs/api/page.tsx` | ✅ | Statique (ok) |
| 28 | `/privacy` | `src/app/privacy/page.tsx` | ✅ | Statique (ok) |
| 29 | `/terms` | `src/app/terms/page.tsx` | ✅ | Statique (ok) |
| 30 | `/` (not-found) | Auto-généré | ✅ | — |

### API Routes

| Route | Statut |
|-------|--------|
| `/api/auth/[...all]` | ✅ Better Auth |
| `/api/health` | ✅ |
| `/api/trpc/[trpc]` | ✅ tRPC |
| `/api/v1/trpc/[trpc]` | ✅ tRPC v1 |

### Pages SEO

| Route | Statut |
|-------|--------|
| `/robots.txt` | ✅ |
| `/sitemap.xml` | ✅ |

---

## 3. Analyse Sidebar & Header

### Sidebar (`app-sidebar.tsx`)

| Lien | Destination | Statut |
|------|-------------|--------|
| Logo/Brand | `/` | ✅ |
| Home | `/` | ✅ |
| Models | `/models` | ✅ |
| Compare | `/compare` | ✅ |
| Blog | `/blog` | ✅ |
| Dashboard | `/dashboard` | ✅ |
| Categories | (dynamique DB) | ✅ tRPC |
| Search | tRPC + `/models?search=` | ✅ |
| Settings (footer) | **`/settings`** | ❌ **BROKEN** |
| Sign In (footer) | `/auth/sign-in` | ✅ |

### Header (`header.tsx`)

| Lien | Destination | Statut |
|------|-------------|--------|
| Logo | `/` | ✅ |
| Models | `/models` | ✅ |
| Categories | `/categories` | ✅ |
| Compare | `/compare` | ✅ |
| Blog | `/blog` | ✅ |
| Sign In | `/auth/sign-in` | ✅ |
| Get Started | `/auth/sign-up` | ✅ |

### 🔴 PROBLÈME CRITIQUE — Sidebar Settings Link

```tsx
// app-sidebar.tsx ligne ~260
<DropdownMenuItem render={<Link href="/settings" />}>
```

**Le lien pointe vers `/settings` mais la page existe à `/dashboard/settings`.**  
→ Résultat: **404** quand un utilisateur clique sur Settings dans le sidebar.

**Fix requis:** Changer en `<Link href="/dashboard/settings" />`

---

## 4. Analyse des Données — Hardcodé vs tRPC

### ✅ Pages correctement basées sur tRPC/DB

- `/` — serverCaller pour models featured, categories, stats
- `/models` — tRPC client (`trpc.models.list`)
- `/models/[slug]` — serverCaller pour chaque model
- `/models/upload` — tRPC mutation (`trpc.models.create`)
- `/dashboard/*` — tRPC client (`trpc.user.me`, `trpc.user.favorites`)
- `/admin/*` — tRPC admin procedures (`trpc.admin.stats`, etc.)
- `/categories` — serverCaller pour liste catégories
- `/categories/[slug]` — serverCaller pour models par catégorie
- `/compare/[slugA]/vs/[slugB]` — tRPC client (`trpc.models.get`)

### ⚠️ Pages avec données hardcodées (SEO/content pages)

| Page | Type données hardcodées | Justification |
|------|------------------------|---------------|
| `/compare/llama-3-70b-vs-gpt-4` | Benchmarks, specs, verdicts | Page SEO statique — acceptable |
| `/compare/mistral-large-vs-claude-3-opus` | Idem | Idem |
| `/compare/phi-3-mini-vs-gemma-2-9b` | Idem | Idem |
| `/best/code-llms` | Rankings, scores HumanEval/MBPP | Page SEO statique — acceptable |
| `/best/open-source-llms` | Idem | Idem |
| `/best/small-llms` | Idem | Idem |

**Verdict:** Les pages "best" et "compare" statiques sont des pages de **contenu SEO**. Les données hardcodées sont un choix délibéré pour le référencement. Leur contenu pointe vers les vraies pages models via `/models/[slug]`.

**Mais attention :** Ces pages ne se mettront pas à jour automatiquement si les modèles changent dans la DB. Recommandation de les régénérer périodiquement ou d'ajouter un système de "last updated" visible.

---

## 5. Sécurité — Admin Router

✅ **Admin protection correctement implémentée :**

```typescript
// src/server/api/routers/admin.ts
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const [currentUser] = await db
    .select({ role: userTable.role })
    .from(userTable)
    .where(eq(userTable.id, ctx.userId))
    .limit(1);

  if (!currentUser || currentUser.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});
```

Toutes les routes admin (`stats`, `recentActivity`, `models`, `updateModelStatus`, `toggleFeatured`, `users`, `updateUserRole`) utilisent `adminProcedure`. ✅

**⚠️ Note :** Il n'y a pas de protection au niveau du layout `/admin`. Un utilisateur non-admin peut accéder aux pages admin côté client, mais les appels tRPC échoueront avec `FORBIDDEN`. Recommandation : ajouter un middleware ou un check dans le layout admin pour rediriger.

---

## 6. SEO & Structured Data

✅ **Excellent :**

- `WebsiteJsonLd` sur le layout racine
- `SoftwareApplicationJsonLd` sur `/models/[slug]`
- `BreadcrumbJsonLd` sur les pages imbriquées
- `FaqPageJsonLd` sur `/models/[slug]`
- `ArticleJsonLd` sur les posts blog et comparaisons
- `ItemListJsonLd` sur `/categories` et `/blog`
- `generateMetadata` dynamique sur les pages models et blog
- `canonicalUrl` sur toutes les pages
- `robots.txt` et `sitemap.xml` générés

---

## 7. Performance & Architecture

| Aspect | Statut | Notes |
|--------|--------|-------|
| Turbopack | ✅ | Build rapide (6.4s) |
| Static generation | ✅ | SSG pour models, blog, categories |
| Dynamic routes | ✅ | Proxy pour compare/[slugA]/vs/[slugB] |
| Server Components | ✅ | Pages principales en RSC |
| Client Components | ✅ | Interactivité dashboard, admin, upload |
| Vercel Analytics | ✅ | Intégré |
| Speed Insights | ✅ | Intégré |
| Image optimization | ⚠️ | Pas d'images de modèles visibles |
| Caching | ⚠️ | Pas de revalidate/ISR visible |

---

## 8. Résumé des Problèmes

### 🔴 Critique (Casse une fonctionnalité)

| # | Problème | Fichier | Impact |
|---|----------|---------|--------|
| 1 | **Lien Settings cassé** (`/settings` au lieu de `/dashboard/settings`) | `app-sidebar.tsx` | 404 quand on clique Settings dans le sidebar |

### 🟡 Moyen (Dette technique / Amélioration)

| # | Problème | Fichier | Impact |
|---|----------|---------|--------|
| 2 | **Pas de guard layout admin** | `src/app/admin/layout.tsx` | Non-admin voit les pages admin (même si tRPC bloque) |
| 3 | **Pages "best" avec données hardcodées** | `best/*.tsx` | Pas de mise à jour auto quand la DB change |
| 4 | **Pages compare statiques hardcodées** | `compare/llama-3-70b-vs-gpt-4/page.tsx` etc. | Benchmarks potentiellement obsolètes |
| 5 | **Warning middleware deprecated** | `middleware.ts` | Migration vers `proxy` recommandée par Next.js 16 |

### 🟢 Mineur (Cosmétique / Nice-to-have)

| # | Problème | Impact |
|---|----------|--------|
| 6 | Pas de protection rate-limit sur upload | Abus possible |
| 7 | Pas de pagination sur `/blog` | Tous les posts affichés d'un coup |
| 8 | Header non utilisé dans le layout principal | Le header existe mais le sidebar remplace son rôle |
| 9 | Docs pages très légères (pas de contenu réel) | Pages vides — placeholder |
| 10 | `/best` n'a pas de page index (pas de `/best/page.tsx`) | Accès uniquement via liens directs |

---

## 9. Recommandations

### Priorité P0 (À faire avant merge)

1. **Fix le lien Settings** dans `app-sidebar.tsx` → `/dashboard/settings`

### Priorité P1 (Sprint suivant)

2. **Ajouter un admin guard** sur le layout admin (redirection si non-admin)
3. **Créer une page `/best/page.tsx`** comme index des guides "Best Of"
4. **Rendre les docs dynamiques** ou au moins ajouter du contenu réel
5. **Migration middleware → proxy** (Next.js 16)

### Priorité P2 (Backlog)

6. Système de mise à jour des pages SEO statiques quand la DB change
7. Rate limiting sur les mutations (upload, reviews)
8. Pagination du blog
9. Cache strategy (ISR/Revalidation) pour les pages SSG
10. Images/OG images par défaut pour les modèles

---

## 10. Verdict Final

| Critère | Score |
|---------|-------|
| Build | ✅ Pass |
| Pages fonctionnelles | ✅ 29/29 existent |
| Données dynamiques (tRPC) | ✅ 17/17 pages critiques |
| Sécurité admin | ✅ Backend OK, frontend à améliorer |
| SEO | ✅ Excellent |
| Liens internes | ⚠️ 1 lien cassé (Settings) |
| Hardcodé acceptable ? | ⚠️ 6 pages SEO hardcodées (choix architectural) |

### 🟢 GO pour merge, après fix du lien Settings

Le projet est dans un excellent état. L'architecture est solide, le SEO est top-notch, et toutes les fonctionnalités critiques sont basées sur tRPC/DB. Le seul blocker réel est le lien Settings cassé dans le sidebar.

---

*Review générée par Atlas — CroissantLabs 🥐*
