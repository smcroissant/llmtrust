# 🥐 CI & Build Status Report

**Date:** 2026-03-13 00:26 CET  
**Author:** Sentry (Head of DevOps)  
**Status:** 🔴 BLOCKED — Build failing on all environments

---

## 1. GitHub Actions CI — Last 5 Runs

| # | Status | Branch | Commit | Duration |
|---|--------|--------|--------|----------|
| 1 | ❌ Failure | develop | `feat(email): add Resend transactional email system` | 1m50s |
| 2 | ❌ Failure | main | `merge: Sprint 2 complete + admin + upload + SEO pages + fixes` | 1m44s |
| 3 | ❌ Failure | develop | `fix: settings link, remove asChild props, dashboard page` | 1m45s |
| 4 | ❌ Failure | develop | `feat(seo): add best-of landing pages and update sitemap` | 1m51s |
| 5 | ❌ Failure | develop | `fix(upload): wrap useSearchParams in Suspense boundary for SSG` | 1m52s |

**5/5 runs en échec.** Tous les commits récents bloqués.

### Breakdown des Jobs (run #23028442531)

| Job | Status | Notes |
|-----|--------|-------|
| ESLint | ✅ Pass | 27 warnings (0 errors) — imports non utilisés |
| TypeScript Check | ✅ Pass | — |
| Security Audit | ✅ Pass | — |
| **Build** | ❌ **Fail** | `DATABASE_URL` manquant → crash sur `/api/v1/trpc/[trpc]` |

---

## 2. Build Local

```
Error: No database connection string was provided to `neon()`. 
Perhaps an environment variable has not been set?
    → at src/server/db/index.ts
    → Failed to collect page data for /api/v1/trpc/[trpc]
```

**Exit code: 1** — même erreur que la CI.

---

## 3. Root Cause Analysis

### Fichier fautif
**`src/server/db/index.ts`** — ligne d'initialisation :
```typescript
const sql = neon(process.env.DATABASE_URL!);
```

### Problème
- `DATABASE_URL` n'est **pas défini** dans l'environnement CI (GitHub Actions)
- `neon()` est appelé au **niveau module** (top-level), donc il s'exécute pendant le build même si le module n'est pas utilisé
- La route `/api/v1/trpc/[trpc]` importe transitivement le module `db`, ce qui déclenche le crash pendant `next build` (phase de collecte des page data)

### Pourquoi ça a marché avant ?
Probablement que `DATABASE_URL` était présent dans l'environnement de build précédent, ou le module db n'était pas importé transitivement dans les routes SSG.

---

## 4. ESLint Warnings (27 au total)

Imports non utilisés dans plusieurs fichiers :
- `src/app/dashboard/favorites/page.tsx` — `Link`
- `src/app/compare/llama-3-70b-vs-gpt-4/page.tsx` — `Minus`, `XCircle`, `Script`
- `src/app/categories/[slug]/page.tsx` — `notFound`
- `src/app/best/small-llms/page.tsx` — `TrendingUp`
- `src/app/best/open-source-llms/page.tsx` — `CheckCircle2`
- `src/app/best/code-llms/page.tsx` — `Zap`, `TrendingUp`, `Star`

⚠️ **Warning Node.js 20 deprecation** sur toutes les actions GitHub (deadline: 2 juin 2026)

---

## 5. Actions Recommandées

### 🔴 Urgent — Pour Forge
1. **Ajouter `DATABASE_URL` aux GitHub Secrets** et le passer au job Build :
   ```yaml
   - run: npm run build
     env:
       DATABASE_URL: ${{ secrets.DATABASE_URL }}
   ```
2. **OU** rendre l'initialisation db lazy (ne pas throw au top-level si pas de DATABASE_URL)

### 🟡 Court terme
3. Nettoyer les 27 warnings ESLint (imports morts)
4. Mettre à jour `actions/checkout@v4` et `actions/setup-node@v4` pour Node.js 24

### 🟢 Amélioration CI
5. Ajouter un job `env-check` qui valide que les variables requises sont présentes avant le build
6. Considérer un `DATABASE_URL` de test/mock pour la CI si le build ne nécessite pas de vraie DB

---

## 6. Conclusion

**Le build est 100% cassé** sur CI et local. Cause unique : variable d'environnement `DATABASE_URL` manquante. Les 3 autres jobs CI (lint, typecheck, security) passent sans problème.

**→ Transmis à Forge pour fix.**

---
*Sentry out.* 🛡️
