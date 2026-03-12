# 🗺️ LLM Trust — Roadmap Produit Q2 2026

**Période :** Semaines 12–24 (16 mars → 7 juin 2026)
**Auteur :** Atlas (Head of Product)
**Dernière MAJ :** 12 mars 2026

---

## 📊 Vue d'ensemble

| Phase | Semaines | Objectif | KPI clé |
|-------|----------|----------|---------|
| **Phase 1** — MVP → Launch | S1–S4 (16 mars → 12 avril) | Produit fonctionnel, lancement public | 100 users inscrits, 0 bug critique |
| **Phase 2** — Growth | S5–S8 (13 avril → 10 mai) | Acquisition utilisateurs, engagement | 1 000 MAU, 50 reviews publiées |
| **Phase 3** — Monétisation | S9–S12 (11 mai → 7 juin) | Conversion paying users, revenue | $500 MRR, 10+ paid plans |

---

## 🔴 PHASE 1 — MVP COMPLET → LANCEMENT PUBLIC
_Semaines 1–4 (16 mars → 12 avril)_

### KPIs Phase 1
- 100 users inscrits
- 20 modèles seedés en DB
- 0 bug critique en production
- Lighthouse score ≥ 90 (perf + SEO)
- 8 articles blog publiés

---

### 📅 Semaine 1 (16–22 mars) — Auth & Connexion DB

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Pages Auth UI** (`/auth/sign-in`, `/auth/sign-up`) | Engineering | Better Auth déjà configuré | Formulaires fonctionnels, redirect post-login, forgot password |
| **Seed DB** — 20 modèles LLM réels (GPT-4, Claude 3, Llama 3, Mistral, etc.) | Engineering | Schema DB existant | Script `seed.ts` exécutable, données réalistes avec specs complètes |
| **Connexion /models → tRPC.models.list** | Engineering | Seed DB | Page affiche les modèles depuis la DB, filtres marchent |
| **Connexion /models/[slug] → tRPC.models.get** | Engineering | Seed DB | Page détail affiche données DB, pas mock |
| **Article Blog #1** : "Top 10 Open Source LLMs in 2026" | Marketing | Blog MDX live | Publié, optimisé SEO (mot-clé ciblé) |
| **Article Blog #2** : "How to Choose the Right LLM for Your Project" | Marketing | Blog MDX live | Publié, optimisé SEO |
| **Setup monitoring** (Vercel Analytics + Sentry) | DevOps | — | Erreurs trackées, alertes Slack configurées |

---

### 📅 Semaine 2 (23–29 mars) — Dashboard & Search

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Page Dashboard** (`/dashboard`) | Engineering | Auth UI | Vue user : modèles favoris, reviews récentes, stats perso |
| **Search fonctionnelle** (sidebar + page dédiée `/search`) | Engineering | Connexion tRPC | Recherche full-text sur modèles, résultats en < 200ms |
| **Connexion stats homepage → tRPC.stats** | Engineering | Seed DB | Stats dynamiques (nb modèles, downloads, etc.) |
| **Connexion categories homepage → tRPC.categories** | Engineering | Seed DB | Catégories avec comptes réels depuis DB |
| **Footer complet** | Engineering | — | Liens : About, Pricing, Blog, Docs, Contact, Privacy, Terms |
| **Article Blog #3** : "GPT-4 vs Claude 3: Comprehensive Comparison" | Marketing | — | Publié, optimisé SEO |
| **Article Blog #4** : "Understanding LLM Benchmarks" | Marketing | — | Publié, optimisé SEO |
| **Config email transactionnel** (Resend/Sendgrid) | DevOps | Auth UI | Emails de bienvenue, reset password fonctionnels |

---

### 📅 Semaine 3 (30 mars → 5 avril) — Reviews & Social Features

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Système Reviews** — UI complète (form + display) | Engineering | Auth UI, models en DB | User peut créer, éditer, supprimer sa review ; affichage étoiles + texte |
| **Système Likes** (bouton like sur models et reviews) | Engineering | Auth UI | Like/unlike toggle, compteur visible |
| **Système Favoris** — connexion UI ↔ tRPC.user.favorites | Engineering | Auth UI, Dashboard | Ajouter/retirer favoris depuis /models et /models/[slug] ; liste dans dashboard |
| **Page Compare** (`/compare/[a]-vs-[b]`) | Engineering | Models en DB | Tableau side-by-side (specs, scores, prix), sélection via UI |
| **Page About** (`/about`) | Product | — | Mission, équipe, contact |
| **Article Blog #5** : "Best LLMs for Code Generation" | Marketing | — | Publié, optimisé SEO |
| **Article Blog #6** : "LLM Pricing Comparison 2026" | Marketing | — | Publié, optimisé SEO |
| **Setup CI/CD pipeline** (lint, typecheck, build, preview deploys) | DevOps | — | PR → preview auto, main → prod auto |

---

### 📅 Semaine 4 (6–12 avril) — Polish & Launch

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Page Pricing** (`/pricing`) | Engineering | Monétization specs | 3 tiers affichés (Free/Pro/Team), CTA, FAQ |
| **SEO final pass** — metadata, structured data, sitemap, OG tags | Engineering | Toutes les pages | Lighthouse SEO ≥ 95, Google Search Console configuré |
| **Performance pass** — images optimisées, lazy loading, cache headers | DevOps | — | Lighthouse Perf ≥ 90, Core Web Vitals green |
| **QA complète** — test manuel + edge cases | Product | Toutes les features | Checklist QA signée, 0 bug P0/P1 |
| **Page Docs** (`/docs`) — getting started guide | Product | — | Guide utilisateur basique publié |
| **Article Blog #7** : "Getting Started with LLM Trust" | Marketing | — | Publié |
| **Article Blog #8** : "Why Transparency Matters in AI" | Marketing | — | Publié |
| **🚀 LANCEMENT PUBLIC** | Marketing/Product | QA passée | Post sur Twitter/LinkedIn, Product Hunt prep, email à waitlist |
| **Monitoring & alerting prod** | DevOps | — | Uptime monitoring (BetterStack/UptimeRobot), alertes on-call |

---

## 🟡 PHASE 2 — GROWTH → ACQUISITION UTILISATEURS
_Semaines 5–8 (13 avril → 10 mai)_

### KPIs Phase 2
- 1 000 MAU (Monthly Active Users)
- 50+ reviews publiées par la communauté
- 15 articles blog (SEO traffic)
- NPS ≥ 40
- Bounce rate < 50%

---

### 📅 Semaine 5 (13–19 avril) — Engagement & Retention

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Système de notifications** (in-app) | Engineering | Auth, reviews, likes | Bell icon + dropdown : nouvelle review sur modèle favori, réponse à review, etc. |
| **User Profile page** (`/profile/[username]`) | Engineering | Auth, reviews | Bio, avatar, reviews publiées, modèles favoris, stats activité |
| **Email digest hebdo** (modèles populaires, nouvelles reviews) | Engineering | Email config, notifications | Template email, envoi automatique le lundi |
| **Article Blog #9** : "Fine-Tuning vs RAG: When to Use What" | Marketing | — | Publié |
| **Article Blog #10** : "Mistral vs Llama 3: European AI Showdown" | Marketing | — | Publié |
| **Social media cadence** — 3 posts/semaine (Twitter + LinkedIn) | Marketing | Lancement fait | Calendrier éditorial, premiers posts publiés |

---

### 📅 Semaine 6 (20–26 avril) — Content & SEO Scale

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Model Categories pages** (`/categories/[slug]`) | Engineering | Categories tRPC | Page par catégorie avec listing filtré, description, SEO metadata |
| **Model Tags system** | Engineering | Models en DB | Tags sur modèles (multimodal, code, open-source, etc.), filtre par tag |
| **SEO : programmatic pages** — pages auto pour chaque catégorie + tag | Engineering | Categories & tags | Chaque combinaison = page indexable avec contenu unique |
| **Article Blog #11** : "How We Evaluate LLM Safety" | Marketing | — | Publié |
| **Article Blog #12** : "Top 5 LLMs for Enterprise in 2026" | Marketing | — | Publié |
| **Article Blog #13** : "Open Source AI: The Complete Guide" | Marketing | — | Publié |
| **Backlink outreach** — 10 emails à sites AI/tech | Marketing | Blog content suffisant | 3+ réponses positives, 1+ backlink acquis |

---

### 📅 Semaine 7 (27 avril → 3 mai) — Community & Gamification

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Système de badges/réputation** (gamification) | Engineering | Auth, reviews, likes | Badges : First Review, 10 Reviews, Top Contributor, Early Adopter |
| **Leaderboard** (`/leaderboard`) | Engineering | Gamification | Classement contributeurs par reviews, likes reçus |
| **Model versioning** — afficher historique des versions d'un modèle | Engineering | Models en DB | Tab "Versions" sur model detail, changelog |
| **Article Blog #14** : "Building Trust in AI: Our Mission" | Marketing | — | Publié |
| **Article Blog #15** : "Claude 3.5 Sonnet Deep Dive" | Marketing | — | Publié |
| **Partnership outreach** — 5 AI newsletters/blogs | Marketing | Content suffisant | 2+ mentions/cross-posts confirmées |

---

### 📅 Semaine 8 (4–10 mai) — API & Integrations

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Public API** (REST) — endpoints de lecture (models, reviews, categories) | Engineering | tRPC routers | Docs API publiées, rate limiting, API key generation dans dashboard |
| **API Documentation page** (`/docs/api`) | Engineering | Public API | OpenAPI spec, exemples curl, code snippets |
| **Embed widget** — "Model Card" embeddable | Engineering | Public API | Code snippet copiable, rendu dans iframe |
| **Webhook basics** — notifications sur nouveaux modèles/reviews | Engineering | Public API | Config dans dashboard, payload testable |
| **Article Blog #16** : "Introducing the LLM Trust API" | Marketing | Public API | Publié |
| **Article Blog #17** : "Community Spotlight: Top Reviewers" | Marketing | Gamification | Publié |
| **CDN & caching optimization** | DevOps | Public API | API response time < 100ms p95, cache hit rate > 80% |

---

## 🟢 PHASE 3 — MONÉTISATION → REVENUE
_Semaines 9–12 (11 mai → 7 juin)_

### KPIs Phase 3
- $500 MRR
- 10+ paid plans (Pro ou Team)
- < 2% payment failure rate
- 5+ API key actives (paying)
- Conversion rate Free→Pro ≥ 3%

---

### 📅 Semaine 9 (11–17 mai) — Stripe Integration

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Stripe integration** — checkout, webhooks, customer portal | Engineering | Pricing page | Paiement testable, subscription lifecycle complet |
| **Plan gating** — features locked par tier | Engineering | Stripe, Auth | Free : 5 reviews/mois, no API, no compare avancé ; Pro : unlimited ; Team : seats + API |
| **Usage tracking & limits** | Engineering | Plan gating | Compteurs visibles dans dashboard, alertes à 80% usage |
| **Migration Free users** — tous les users existants → Free plan | Engineering | Stripe | User existants gardent leur accès, étiquetés comme Free |
| **Article Blog #18** : "LLM Trust Pro: What You Get" | Marketing | — | Publié |
| **Article Blog #19** : "API Rate Limits Explained" | Marketing | — | Publié |
| **PCI compliance check** | DevOps | Stripe | Stripe Elements utilisé (pas de card data sur nos serveurs) |

---

### 📅 Semaine 10 (18–24 mai) — Team Features

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Team management** — create team, invite members, roles (admin/member) | Engineering | Stripe Team plan | CRUD team, invitation email, accept/decline |
| **Team dashboard** — shared favorites, shared reviews, usage overview | Engineering | Team management | Vue équipe dans dashboard, activity feed |
| **SSO / SAML** (basique — Google Workspace) | Engineering | Team plan | Login via Google pour teams |
| **Bulk API access** — higher rate limits for Team | Engineering | API, Team plan | Rate limit ×10 pour Team, dashboard affiche les limites |
| **Article Blog #20** : "Collaborative AI Evaluation for Teams" | Marketing | — | Publié |
| **Article Blog #21** : "Case Study: How [Company] Uses LLM Trust" | Marketing | — | Publié (avec user beta) |

---

### 📅 Semaine 11 (25–31 mai) — Conversion & Optimization

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **A/B testing setup** (PostHog ou GrowthBook) | Engineering | — | Config outil, premier test lancé (CTA pricing) |
| **Upgrade prompts** — contextual upsell dans le produit | Engineering | Plan gating, Stripe | Prompt quand user atteint limite Free, "Upgrade to Pro" non-intrusif |
| **Annual billing** — option annuelle (2 mois off) | Engineering | Stripe | Checkout avec toggle monthly/annual, pricing mis à jour |
| **Onboarding flow amélioré** — quiz "quel LLM pour toi ?" | Product | — | 5 questions → recommandation personnalisée → signup |
| **Email sequences** — drip post-signup (jour 1, 3, 7, 14) | Marketing | Email config | 4 emails : bienvenue, découverte features, review prompt, upgrade |
| **Article Blog #22** : "ROI of Using the Right LLM" | Marketing | — | Publié |
| **Article Blog #23** : "Monthly LLM Performance Report — May 2026" | Marketing | — | Publié |

---

### 📅 Semaine 12 (1–7 juin) — Stabilization & Q3 Prep

| Item | Département | Dépendance | Done = |
|------|-------------|------------|--------|
| **Bug fix sprint** — backlog P2/P3 | Engineering | — | Tous les bugs P2 résolus, P3 triés |
| **Performance audit** — queries lentes, bundle size | DevOps | — | Toutes les queries < 200ms, JS bundle < 300KB gzippé |
| **Security audit** — OWASP top 10, rate limiting review | DevOps | — | Rapport sécurité signé, 0 vuln critique |
| **Data export** — user peut exporter ses données (GDPR) | Engineering | Auth | Export JSON depuis dashboard |
| **Q3 roadmap planning** | Product | — | Roadmap Q3 draftée et validée |
| **Article Blog #24** : "Q2 Recap: What We Built" | Marketing | — | Publié |
| **Article Blog #25** : "What's Coming in Q3" | Marketing | — | Publié |
| **📊 Revue mensuelle revenue** | Product | Stripe | Rapport MRR, churn, conversion, ajustements pricing |

---

## 📈 Tracking & Rituel

### Weekly
- **Lundi 10h** — Sprint planning (15 min) : priorités de la semaine
- **Vendredi 17h** — Retro (15 min) : ce qui a marché, ce qui bloque

### Monthly
- **1er du mois** — Revue KPIs vs targets
- **Ajustement roadmap** si nécessaire (features repriorisées)

---

## 🎯 KPIs Summary par Phase

| Metric | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|--------|---------------|---------------|---------------|
| Registered Users | 100 | 1,000 | 2,500 |
| MAU | 50 | 1,000 | 1,500 |
| Reviews Published | 5 | 50 | 150 |
| Blog Articles | 8 | 17 (cumul 25) | 25 (cumul) |
| MRR | $0 | $0 | $500 |
| Paid Subscribers | 0 | 0 | 10+ |
| API Keys Active | 0 | 20 | 50 |
| Lighthouse Score | ≥ 90 | ≥ 90 | ≥ 95 |
| Uptime | 99% | 99.5% | 99.9% |

---

## 🚧 Risques & Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Seed DB prend plus de temps (données réalistes) | Retard S1 | Utiliser dataset existant (HuggingFace) + enrichir progressivement |
| Stripe integration complexe | Retard S9 | Commencer le dev Stripe en S8, tests early |
| SEO ne décolle pas | Pas de trafic organique | Doubler output blog en S5-S6 si nécessaire |
| Faible conversion Free→Pro | Pas de revenue | A/B test pricing, ajouter features Pro attractives |
| Un seul dev = bottleneck | Tout ralentit | Prioriser ruthlessly, couper le scope Phase 2 si nécessaire |

---

## 📝 Notes

- **Un seul developer** : cette roadmap est ambitieuse. Si les semaines dérapent, couper dans Phase 2 (gamification, API) plutôt que Phase 1 ou 3.
- **Blog = investissement long terme** : les 25 articles doivent être publiés quoi qu'il arrive. C'est le moteur SEO.
- **Phase 3 peut commencer plus tôt** : si Phase 1 finit en avance, démarrer Stripe en S4.
- **Feedback loop** : après le lancement (S4), intégrer les retours users dans la planification des sprints suivants.

---

_Roadmap v1.0 — À réviser chaque lundi en sprint planning._
