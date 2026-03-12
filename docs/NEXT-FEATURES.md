# LLM Trust — Next Features Specs
**Prepared by:** Atlas, Head of Product 🥐
**Date:** 2026-03-13
**Context:** Post Sprint 1 ✅ & Sprint 2 ✅ | 38 pages in prod

---

## Table of Contents
1. [Système de Notifications In-App](#1-système-de-notifications-in-app)
2. [Page de Profil Public](#2-page-de-profil-public)
3. [Programmatic SEO Scaling](#3-programmatic-seo-scaling)
4. [Cloud Inference (Post-MVP)](#4-cloud-inference-post-mvp)

---

## 1. Système de Notifications In-App

### Overview
Un système centralisé de notifications pour engager les utilisateurs et les ramener sur la plateforme. Couvre les événements métier clés et propose un digest hebdomadaire.

### User Stories

| # | User Story | Priority |
|---|-----------|----------|
| US-1.1 | En tant que **model owner**, je veux être notifié quand quelqu'un **review mon modèle** pour pouvoir répondre rapidement | P0 |
| US-1.2 | En tant que **model owner**, je veux être notifié quand mon modèle est **approuvé/rejeté** pour connaître le statut de ma soumission | P0 |
| US-1.3 | En tant que **user**, je veux être notifié quand un **nouveau modèle** est ajouté dans mes catégories favorites pour ne rien manquer | P1 |
| US-1.4 | En tant que **user**, je veux recevoir un **weekly digest** récapitulant l'activité de la semaine pour rester informé sans être spammé | P2 |
| US-1.5 | En tant que **user**, je veux pouvoir **gérer mes préférences** de notifications (opt-in/opt-out par type) | P1 |

### Acceptance Criteria

**AC-1.1 — Badge de notifications**
- [ ] Icône cloche visible dans la navbar (desktop & mobile)
- [ ] Badge rouge avec compteur pour les notifications non lues (ex: "3")
- [ ] Le compteur se met à jour en temps réel (polling ou WebSocket)
- [ ] Badge disparaît quand toutes les notifications sont lues

**AC-1.2 — Dropdown de notifications**
- [ ] Clic sur la cloche → dropdown avec les 5 dernières notifications
- [ ] Chaque notification affiche : icône type, message, timestamp relatif
- [ ] Clic sur une notification → navigation vers la page concernée + marquage lu
- [ ] Bouton "Voir tout" → page `/notifications`
- [ ] Bouton "Tout marquer comme lu"

**AC-1.3 — Page `/notifications`**
- [ ] Liste paginée de toutes les notifications
- [ ] Filtres par type (review, approval, new model, digest)
- [ ] Filtre lu / non lu
- [ ] Bulk actions : marquer tout lu, supprimer sélection

**AC-1.4 — Préférences**
- [ ] Section dans les settings user `/settings/notifications`
- [ ] Toggle par type de notification (email + in-app)
- [ ] Fréquence du digest : weekly / disabled

### Composants Nécessaires

| Composant | Type | Description |
|-----------|------|-------------|
| `NotificationBell` | Client Component | Icône cloche + badge compteur dans la navbar |
| `NotificationDropdown` | Client Component | Dropdown avec preview des dernières notifs |
| `NotificationItem` | Client Component | Une ligne de notification (icône + texte + temps) |
| `NotificationPage` | Server Component | Page `/notifications` avec liste paginée |
| `NotificationFilters` | Client Component | Filtres type / statut |
| `NotificationPreferences` | Client Component | Settings page avec toggles |
| `useNotifications` | Hook | Fetch, mark read, real-time updates |

### DB Schema Changes

```sql
-- Table principale des notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('review', 'approval', 'new_model', 'digest', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT, -- lien vers la ressource concernée
  metadata JSONB DEFAULT '{}', -- données additionnelles (model_id, review_id, etc.)
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Préférences de notifications par user
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_review BOOLEAN DEFAULT TRUE,
  email_approval BOOLEAN DEFAULT TRUE,
  email_new_model BOOLEAN DEFAULT FALSE,
  email_digest BOOLEAN DEFAULT TRUE,
  inapp_review BOOLEAN DEFAULT TRUE,
  inapp_approval BOOLEAN DEFAULT TRUE,
  inapp_new_model BOOLEAN DEFAULT TRUE,
  digest_frequency TEXT DEFAULT 'weekly' CHECK (digest_frequency IN ('weekly', 'disabled')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_user_type ON notifications(user_id, type, created_at DESC);
```

### Effort Estimé : **M** (Medium — ~1.5 sprint)
- Backend (API + triggers) : 3-4 jours
- Frontend (composants + page) : 3-4 jours
- Real-time (polling/SSE) : 1-2 jours
- Préférences + tests : 1-2 jours

---

## 2. Page de Profil Public

### Overview
Donner une identité publique aux utilisateurs. Le profil devient une vitrine de leur contribution à la communauté LLM Trust.

### User Stories

| # | User Story | Priority |
|---|-----------|----------|
| US-2.1 | En tant que **user**, je veux avoir une **page profil publique** avec mes informations pour que la communauté puisse me découvrir | P0 |
| US-2.2 | En tant que **user**, je veux pouvoir éditer ma **bio et mes infos** depuis mon dashboard | P0 |
| US-2.3 | En tant que **visiteur**, je veux cliquer sur le **nom d'un reviewer** dans une review pour voir son profil | P1 |
| US-2.4 | En tant que **user**, je veux voir mes **badges et achievements** sur mon profil pour être reconnu | P1 |
| US-2.5 | En tant que **user**, je veux voir la **liste de mes modèles uploadés** et mes reviews sur mon profil | P0 |

### Acceptance Criteria

**AC-2.1 — URL & Routing**
- [ ] Route `/profile/[username]` accessible publiquement (pas de login requis)
- [ ] Username unique, URL-safe, 3-30 caractères
- [ ] 404 propre si username inexistant

**AC-2.2 — Informations affichées**
- [ ] Avatar (gravatar ou upload)
- [ ] Nom d'affichage + username
- [ ] Bio (max 500 caractères)
- [ ] Date d'inscription ("Membre depuis Jan 2026")
- [ ] Lien(s) externe(s) optionnels (GitHub, Twitter, site perso)
- [ ] Stats : nombre de modèles, nombre de reviews, reputation score

**AC-2.3 — Sections du profil**
- [ ] "Mes Modèles" — grille des modèles uploadés avec score moyen
- [ ] "Mes Reviews" — liste des dernières reviews avec lien vers le modèle
- [ ] "Badges" — collection de badges/achievements
- [ ] Onglets ou scroll sections

**AC-2.4 — Badges**
- [ ] Système de badges : First Review, 10 Reviews, Model Creator, Top Rated, Verified
- [ ] Icône + label + description pour chaque badge
- [ ] Badges calculés automatiquement (pas de manuel)

**AC-2.5 — Intégration dans les reviews**
- [ ] Nom du reviewer dans chaque review est un lien vers `/profile/[username]`
- [ ] Avatar du reviewer cliquable

**AC-2.6 — Édition profil**
- [ ] Page `/settings/profile` pour éditer
- [ ] Upload avatar (max 2MB, jpg/png/webp)
- [ ] Validation username (unicité, format)

### Composants Nécessaires

| Composant | Type | Description |
|-----------|------|-------------|
| `ProfilePage` | Server Component | Page `/profile/[username]` |
| `ProfileHeader` | Server/Client | Avatar, nom, bio, stats, liens |
| `ProfileModels` | Server Component | Grille des modèles de l'utilisateur |
| `ProfileReviews` | Server Component | Liste des reviews de l'utilisateur |
| `ProfileBadges` | Client Component | Affichage des badges avec tooltips |
| `ProfileEditor` | Client Component | Formulaire d'édition dans settings |
| `AvatarUploader` | Client Component | Upload + crop d'avatar |
| `UserBadge` | Composant réutilisable | Badge individuel (icône + label) |
| `ReviewerLink` | Composant réutilisable | Lien vers profil dans les reviews |

### DB Schema Changes

```sql
-- Ajouts à la table users existante
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;

-- Table des badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'first_review', 'model_creator', etc.
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL, -- nom d'icône Lucide
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relation user ↔ badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Index
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
CREATE INDEX idx_models_owner ON models(owner_id, created_at DESC);

-- Contrainte username format
ALTER TABLE users ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,30}$');
```

### Effort Estimé : **M** (Medium — ~1 sprint)
- DB schema + migration : 0.5 jour
- API routes (GET profile, PATCH profile, badges) : 2 jours
- Frontend profil + settings : 3-4 jours
- Badges engine (calcul auto) : 1-2 jours
- Intégration reviews : 0.5 jour

---

## 3. Programmatic SEO Scaling

### Overview
Passer de 38 pages à 1000+ pages indexables via la génération programmatique de pages de comparaison et de landing pages thématiques. Objectif : capturer du trafic longue traîne sur les requêtes de comparaison de LLMs.

### User Stories

| # | User Story | Priority |
|---|-----------|----------|
| US-3.1 | En tant que **visiteur Google**, je veux trouver une page dédiée quand je cherche "GPT-4 vs Claude 3" pour obtenir une comparaison structurée | P0 |
| US-3.2 | En tant que **visiteur**, je veux des pages pour chaque combinaison modèle × catégorie (ex: "best coding LLMs") | P0 |
| US-3.3 | En tant que **SEO manager**, je veux des **OG images dynamiques** pour chaque page pour maximiser le CTR sur social | P1 |
| US-3.4 | En tant que **visiteur**, je veux que les pages de comparaison soient **performantes** (SSG/ISR) | P0 |

### Types de Pages Programmatiques

| Type | URL Pattern | Volume Estimé | Exemple |
|------|------------|---------------|---------|
| Comparaison 1v1 | `/compare/[model-a]-vs-[model-b]` | ~500 pages | `/compare/gpt-4-vs-claude-3-opus` |
| Catégorie | `/best/[category]-llms` | ~50 pages | `/best/coding-llms` |
| Provider | `/provider/[name]` | ~30 pages | `/provider/openai` |
| Modèle detail | `/model/[slug]` | ~200 pages (existant) | `/model/gpt-4-turbo` |
| Catégorie + Provider | `/best/[category]-from-[provider]` | ~150 pages | `/best/coding-llms-from-openai` |

**Total potentiel : 900+ pages**

### Acceptance Criteria

**AC-3.1 — Architecture des routes**
- [ ] Route catch-all `app/compare/[[...slug]]/page.tsx` pour les comparaisons
- [ ] Route `app/best/[category]/page.tsx` pour les catégories
- [ ] Route `app/provider/[name]/page.tsx` pour les providers
- [ ] Chaque page est SSG avec ISR (revalidate: 3600)
- [ ] `generateStaticParams()` pré-génère les top 100 pages (reste en ISR on-demand)

**AC-3.2 — Contenu des pages de comparaison**
- [ ] H1 : "[Model A] vs [Model B] — Which is Better?"
- [ ] Tableau comparatif : prix, context window, scores par catégorie
- [ ] Résumé IA : quand utiliser A vs B
- [ ] Verdict basé sur les reviews de la communauté
- [ ] CTA : "Read reviews" / "Submit a review"
- [ ] Related comparisons (3-5 liens internes)

**AC-3.3 — Dynamic OG Images**
- [ ] Génération via `next/og` (Satori) à la volée
- [ ] Template : nom des modèles, scores, logo LLM Trust
- [ ] Cache des images générées (CDN / edge)
- [ ] Chaque page a un `opengraph-image.tsx` dans son segment
- [ ] Dimensions : 1200×630

**AC-3.4 — SEO Technique**
- [ ] Sitemap auto-généré avec toutes les pages programmatiques
- [ ] Schema.org `Product` ou `Article` sur chaque page
- [ ] Canonical URLs corrects
- [ ] Hreflang si multi-langue futur
- [ ] Internal linking structure (every page links to 3-5 others)
- [ ] Meta descriptions uniques générées dynamiquement

**AC-3.5 — Performance**
- [ ] LCP < 2.5s sur toutes les pages
- [ ] CLS < 0.1
- [ ] Pas de client-side fetch pour le contenu principal (tout en RSC)

### Architecture Technique

```
app/
├── compare/
│   └── [[...slug]]/
│       ├── page.tsx          # Route catch-all comparaisons
│       └── opengraph-image.tsx # OG image dynamique
├── best/
│   └── [category]/
│       ├── page.tsx
│       └── opengraph-image.tsx
├── provider/
│   └── [name]/
│       ├── page.tsx
│       └── opengraph-image.tsx
└── sitemap.ts               # Sitemap programmatique

lib/
├── seo/
│   ├── generate-comparison-data.ts  # Logique de génération
│   ├── generate-og-image.tsx        # Template OG
│   └── static-params.ts             # generateStaticParams helpers
```

### DB Schema Changes

```sql
-- Pages SEO générées (pour tracking et CMS)
CREATE TABLE seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('comparison', 'category', 'provider')),
  title TEXT NOT NULL,
  meta_description TEXT,
  model_a_id UUID REFERENCES models(id),
  model_b_id UUID REFERENCES models(id),
  category TEXT,
  provider TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache des données de comparaison
CREATE TABLE comparison_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_a_id UUID NOT NULL REFERENCES models(id),
  model_b_id UUID NOT NULL REFERENCES models(id),
  data JSONB NOT NULL, -- scores, verdict, etc.
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  UNIQUE(model_a_id, model_b_id)
);

CREATE INDEX idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX idx_seo_pages_type ON seo_pages(type, is_published);
CREATE INDEX idx_comparison_cache_models ON comparison_cache(model_a_id, model_b_id);
```

### Effort Estimé : **L** (Large — ~2 sprints)
- Architecture routes catch-all + SSG/ISR : 2-3 jours
- Data generation logic (comparisons, categories) : 3-4 jours
- OG images system : 2-3 jours
- Page templates (comparison, category, provider) : 4-5 jours
- Sitemap + Schema.org + SEO plumbing : 2 jours
- Performance tuning + cache strategy : 2 jours
- Tests + monitoring : 1-2 jours

---

## 4. Cloud Inference (Post-MVP)

### Overview
Permettre aux utilisateurs de tester directement les modèles LLM depuis le browser, sans config locale. Feature différenciante mais complexe — post-MVP.

### User Stories

| # | User Story | Priority |
|---|-----------|----------|
| US-4.1 | En tant que **user**, je veux **tester un modèle** directement depuis sa page pour évaluer sa qualité avant de l'adopter | P0 |
| US-4.2 | En tant que **user**, je veux **comparer les outputs** de 2 modèles côte à côte avec le même prompt | P1 |
| US-4.3 | En tant que **user free**, je veux avoir un **quota limité** de tests gratuits pour essayer la feature | P0 |
| US-4.4 | En tant que **user pro**, je veux un **quota étendu** et accès aux modèles premium | P0 |
| US-4.5 | En tant que **plateforme**, je veux **monitorer les coûts** d'inférence pour rester profitable | P0 |

### Architecture Technique

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Browser    │────▶│  Next.js API │────▶│  Inference Queue │
│  Playground  │     │  /api/chat   │     │  (Vercel Queue   │
│              │◀────│              │◀────│   or BullMQ)     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                          ┌────────▼────────┐
                                          │  Model Gateway   │
                                          │  (model routing) │
                                          └────────┬────────┘
                                                   │
                              ┌─────────────────────┼──────────────────┐
                              │                     │                  │
                        ┌─────▼─────┐        ┌─────▼─────┐     ┌─────▼─────┐
                        │  OpenAI   │        │  Anthropic│     │  Mistral  │
                        │   API     │        │   API     │     │   API     │
                        └───────────┘        └───────────┘     └───────────┘
```

**Composants clés :**

| Composant | Rôle |
|-----------|------|
| **Playground UI** | Interface chat dans le browser, streaming SSE |
| **API Route `/api/inference`** | Auth, rate limiting, quota check |
| **Inference Queue** | Queue async pour gérer la charge, éviter les timeouts |
| **Model Gateway** | Router vers le bon provider API (OpenAI, Anthropic, etc.) |
| **Cost Tracker** | Calcule le coût de chaque request (tokens × prix) |
| **Quota Manager** | Vérifie et décrémente les quotas par user |

**Séquence d'une requête :**
1. User envoie un prompt dans le Playground
2. Frontend → `POST /api/inference` (avec model_id + prompt)
3. API vérifie auth + quota + rate limit
4. Requête mise en queue (si nécessaire)
5. Model Gateway route vers le bon provider
6. Stream de la réponse via SSE
7. Cost Tracker enregistre l'usage
8. Quota Manager décrémente le compteur

### Pricing Model

| Tier | Prix/mois | Quota mensuel | Modèles disponibles | Rate limit |
|------|-----------|---------------|-------------------|------------|
| **Free** | 0€ | 20 requêtes | Open source uniquement (Llama, Mistral) | 2/min |
| **Pro** | 19€ | 500 requêtes | Tous | 10/min |
| **Team** | 49€/seat | 2000 requêtes/seat | Tous + priorité queue | 30/min |
| **Enterprise** | Custom | Illimité | Tous + custom models | Custom |

**Overage :** 0.05€/requête au-delà du quota

**Unit Economics (estimation) :**
- Coût moyen par requête : ~$0.02-0.05 (selon modèle)
- Prix Pro : 19€/500 = 0.038€/req → marge ~40-60% si usage moyen
- Risque : power users qui épuisent le quota → nécessite rate limiting agressif

### Acceptance Criteria

**AC-4.1 — Playground UI**
- [ ] Interface chat sur la page `/model/[slug]` ou `/playground`
- [ ] Streaming des réponses (caractère par caractère)
- [ ] Sélecteur de modèle
- [ ] Paramètres : temperature, max tokens, system prompt
- [ ] Historique de conversation dans la session
- [ ] Bouton "Copy response"

**AC-4.2 — Quota & Auth**
- [ ] Compteur de requêtes restantes visible dans le UI
- [ ] Message clair quand le quota est épuisé
- [ ] CTA upgrade vers le tier supérieur
- [ ] Quota se reset le 1er du mois

**AC-4.3 — Cost Management**
- [ ] Dashboard admin avec coût total par jour/mois
- [ ] Coût par user, par modèle
- [ ] Alertes si coût quotidien dépasse un seuil
- [ ] Kill switch pour désactiver l'inférence

**AC-4.4 — Rate Limiting**
- [ ] Rate limit par tier (resp. 2/10/30 req/min)
- [ ] Response 429 avec Retry-After header
- [ ] Pas de comptage des requêtes rate-limitées dans le quota

**AC-4.5 — Performance**
- [ ] Time to first token (TTFT) < 2s pour les modèles rapides
- [ ] Streaming fluide sans buffering
- [ ] Timeout après 60s de génération
- [ ] Fallback message si le provider est down

### DB Schema Changes

```sql
-- Plans d'abonnement
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'free', 'pro', 'team', 'enterprise'
  name TEXT NOT NULL,
  price_monthly INTEGER, -- en centimes (1900 = 19€)
  quota_requests INTEGER NOT NULL,
  rate_limit_per_min INTEGER NOT NULL,
  allowed_models TEXT[] DEFAULT '{}', -- vide = tous
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abonnements des users
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  requests_used INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- un seul abonnement actif par user
);

-- Log des requêtes d'inférence (pour billing + analytics)
CREATE TABLE inference_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  model_slug TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'openai', 'anthropic', etc.
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  cost_cents INTEGER, -- coût en centimes
  latency_ms INTEGER,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'timeout', 'rate_limited')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, status);
CREATE INDEX idx_inference_user_date ON inference_requests(user_id, created_at DESC);
CREATE INDEX idx_inference_cost_date ON inference_requests(created_at, cost_cents);

-- Seed plans
INSERT INTO subscription_plans (slug, name, price_monthly, quota_requests, rate_limit_per_min) VALUES
  ('free', 'Free', 0, 20, 2),
  ('pro', 'Pro', 1900, 500, 10),
  ('team', 'Team', 4900, 2000, 30);
```

### Effort Estimé : **XL** (Extra Large — ~3-4 sprints)
- Playground UI : 5-7 jours
- API routes + auth + rate limiting : 3-4 jours
- Model Gateway (routing multi-provider) : 4-5 jours
- Queue system + streaming : 3-4 jours
- Quota + subscription management : 3-4 jours
- Stripe integration (paiements) : 3-4 jours
- Cost tracking + admin dashboard : 2-3 jours
- Tests + load testing + security : 3-4 jours

---

## Résumé & Priorisation

| Feature | Effort | Sprint Suggestion | Impact |
|---------|--------|-------------------|--------|
| 🔔 Notifications In-App | M | Sprint 3 | Engagement, rétention |
| 👤 Page Profil Public | M | Sprint 3 | Communauté, social proof |
| 📈 Programmatic SEO | L | Sprint 4-5 | Acquisition, trafic organique |
| ☁️ Cloud Inference | XL | Sprint 6-8 (Post-MVP) | Différenciation, revenue |

### Recommandation Sprint 3
Lancer **Notifications** + **Profil Public** en parallèle (M + M = ~1.5-2 sprints). Commencer la recherche technique sur Programmatic SEO en fond.

---

*Dernière mise à jour : 2026-03-13 — Atlas 🥐*
