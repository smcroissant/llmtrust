# 🎯 LLM Trust — Audit MVP

**Date:** 12 mars 2026
**Auditeur:** Atlas (Product Manager)
**Scope:** Audit complet du site https://www.llmtrust.com pour identifier ce qui manque au MVP

---

## 1. AUDIT COMPLET — Ce qui est là vs ce qui manque

### ✅ Ce qui est en place (existant)

| Élément | État | Notes |
|---------|------|-------|
| **Homepage** | 🟡 Fonctionnelle mais statique | Hero, stats hardcodées, featured models en dur, catégories, CTA |
| **Page /models** | 🟡 Listing mais données mockées | 6 modèles hardcodés, pas de connexion DB, filtres client-side |
| **Page /models/[slug]** | 🟡 UI complète mais contenu mocké | Tabs (Overview, Specs, Usage, Reviews), données statiques, reviews vides |
| **Layout (Sidebar)** | 🟢 Fonctionnel | Sidebar avec navigation, catégories, user menu (Guest) |
| **Header** | 🟢 Fonctionnel | Liens vers Models, Categories, Compare, Sign In |
| **Footer** | 🟡 Minimal | Un seul paragraphe, pas de liens |
| **SEO basics** | 🟢 OK | Metadata, sitemap, robots.txt, JSON-LD |
| **DB Schema** | 🟢 Complet | user, session, account, verification, apiKey, model, like, review, favorite |
| **tRPC Routers** | 🟢 Backend prêt | models (list, get, download, metadata, categories, stats), user (favorites, toggleFavorite, apiKeys), reviews (list, create, update) |
| **Auth (Better Auth)** | 🟡 Configuré mais sans UI | Route API existante, pas de pages de login/register |
| **UI Components** | 🟢 Solide | shadcn/ui complet (button, card, badge, tabs, dialog, dropdown, input, sidebar, etc.) |
| **Providers** | 🟢 OK | tRPC provider, React Query, tooltip |

### 🔴 Ce qui manque (critique pour le MVP)

| Élément | Type | Impact |
|---------|------|--------|
| **Page /auth/sign-in** | Page | Impossible de se connecter |
| **Page /auth/sign-up** | Page | Impossible de créer un compte |
| **Page /dashboard** | Page | Pas de tableau de bord utilisateur |
| **Page /models/upload** | Page | Pas d'upload de modèle |
| **Page /compare/[a]-vs-[b]** | Page | Lien dans sidebar mais 404 |
| **Page /blog** | Page | Lien dans sidebar mais 404 |
| **Page /blog/[slug]** | Page | N'existe pas |
| **Page /about** | Page | N'existe pas |
| **Page /pricing** | Page | N'existe pas |
| **Page /docs** | Page | Lien dans CTA mais 404 |
| **Modèles seedés en DB** | Données | La DB est vide — les pages affichent des données hardcodées |
| **Connexion tRPC ↔ Pages** | Intégration | Les routers existent mais les pages ne les utilisent pas |
| **Search bar fonctionnelle** | Fonctionnalité | Le champ existe dans la sidebar mais n'est pas connecté |
| **Système de reviews** | Fonctionnalité | Router prêt, mais UI affiche "Coming soon" |
| **Système de likes/favoris** | Fonctionnalité | Router prêt, mais aucune UI |
| **Footer complet** | Composant | Footer minimal sans liens utiles |
| **Auth UI (forms)** | Fonctionnalité | Better Auth configuré mais aucune page UI |

### 🟡 Ce qui existe mais est dégradé

| Élément | Problème | Fix nécessaire |
|---------|----------|----------------|
| **Sidebar search** | Champ input visible mais sans handler | Connecter à la recherche de modèles |
| **Sidebar "Sign In"** | Lien vers /login qui 404 | Rediriger vers /auth/sign-in |
| **Header "Sign In"** | Lien vers /login qui 404 | Rediriger vers /auth/sign-in |
| **Stats sur homepage** | Hardcodées (200+ models, 500K+ downloads) | Remplacer par tRPC.stats |
| **Featured models** | Hardcodés dans page.tsx | Remplacer par tRPC query |
| **Catégories** | Comptes hardcodés (145, 89, etc.) | Remplacer par tRPC.categories |
| **Modèles /models** | 6 modèles mockés côté client | Remplacer par tRPC.models.list |
| **Model detail** | Données statiques | Remplacer par tRPC.models.get |
| **Reviews tab** | Hardcodé "4.5 stars, 100 reviews" | Connecter à tRPC.reviews.list |

---

## 2. PRIORISATION

### 🔴 P0 — Bloquant MVP (Sans ça, le site n'est pas fonctionnel)

Ces éléments empêchent toute interaction utilisateur authentique.

1. **Auth UI (Sign In + Sign Up pages)** — Sans ça, personne ne peut créer de compte ou se connecter
2. **Seed de la DB** — Sans modèles en base, le site est vide (tout est hardcodé)
3. **Connexion pages ↔ tRPC** — Les routers existent, il faut que les pages les appellent
4. **Search fonctionnelle** — La sidebar a un champ, il doit marcher

### 🟡 P1 — Important (Le MVP est fonctionnel mais incomplet)

Ces éléments rendent le produit utilisable et complet.

5. **Dashboard utilisateur** — Pour voir son profil, ses favoris, ses uploads
6. **Système de reviews** — Le backend est prêt, il faut l'UI
7. **Système de favoris/likes** — Le backend est prêt, il faut l'UI
8. **Page /compare** — Lien dans la sidebar, doit marcher
9. **Footer complet** — Navigation, liens utiles, legal
10. **Filtres avancés sur /models** — Par licence, taille de paramètres, RAM requise

### 🟢 P2 — Nice to have (Améliorent l'expérience)

11. **Page /blog + articles** — SEO content
12. **Page /about** — Crédibilité
13. **Page /pricing** — Même si gratuit
14. **Page /docs** — Documentation
15. **Upload de modèle** — Feature avancée
16. **Page /models/upload** — Formulaire d'upload
17. **Dashboard sous-pages** — /dashboard/uploads, /dashboard/favorites, /dashboard/settings
18. **API Keys management UI** — Le router existe

---

## 3. USER STORIES

### P0 — Auth

**US-AUTH-01: Sign Up**
> En tant que visiteur, je veux créer un compte avec email/password pour pouvoir interagir avec la plateforme.

- **Acceptance:** Page /auth/sign-in avec formulaire email + password. Lien vers sign-up. Redirection vers /dashboard après connexion. Gestion des erreurs (wrong password, user not found).

**US-AUTH-02: Sign Up**
> En tant que visiteur, je veux m'inscrire avec nom, email et password pour rejoindre la plateforme.

- **Acceptance:** Page /auth/sign-up avec formulaire name + email + password + confirm password. Validation (email unique, password min 8 chars). Redirection vers /auth/sign-in après inscription.

### P0 — Données

**US-DATA-01: Voir des vrais modèles**
> En tant que visiteur, je veux voir des modèles LLM réels avec leurs vraies specs pour découvrir ce qui existe.

- **Acceptance:** 20+ modèles seedés en DB (Llama 3, Mistral, Phi-3, Gemma, Qwen, DeepSeek, Command R, Stable Diffusion, etc.) avec vraies specs, vraies URLs HuggingFace.

**US-DATA-02: Données dynamiques sur homepage**
> En tant que visiteur, je veux voir les vraies stats de la plateforme (nombre de modèles, téléchargements).

- **Acceptance:** Stats affichées via tRPC.models.stats, pas de valeurs hardcodées.

### P0 — Intégration

**US-INT-01: Recherche de modèles**
> En tant que visiteur, je veux chercher un modèle par nom dans la sidebar pour le trouver rapidement.

- **Acceptance:** Le champ "Search models..." dans la sidebar recherche en temps réel dans la DB et affiche des résultats cliquables.

**US-INT-02: Listing dynamique**
> En tant que visiteur, je veux voir la liste des modèles depuis la DB, pas des données mockées.

- **Acceptance:** Page /models utilise tRPC.models.list avec pagination, filtres par catégorie et architecture fonctionnels.

**US-INT-03: Détail dynamique**
> En tant que visiteur, je veux voir les vraies infos d'un modèle quand je clique dessus.

- **Acceptance:** Page /models/[slug] utilise tRPC.models.get pour afficher les vraies données.

### P1 — Dashboard

**US-DASH-01: Tableau de bord**
> En tant qu'utilisateur connecté, je veux voir un dashboard avec un résumé de mon activité.

- **Acceptance:** Page /dashboard accessible uniquement connecté. Affiche : nombre de favoris, reviews écrites, profil utilisateur.

**US-DASH-02: Mes favoris**
> En tant qu'utilisateur connecté, je veux voir la liste de mes modèles favoris.

- **Acceptance:** Page /dashboard/favorites ou section dans le dashboard. Utilise tRPC.user.favorites.

**US-DASH-03: Mes paramètres**
> En tant qu'utilisateur connecté, je veux modifier mon profil (nom, email, mot de passe).

- **Acceptance:** Page /dashboard/settings avec formulaire de modification de profil.

### P1 — Reviews & Likes

**US-REV-01: Lire les reviews**
> En tant que visiteur, je veux lire les avis de la communauté sur un modèle.

- **Acceptance:** Section Reviews dans /models/[slug] utilise tRPC.reviews.list. Affiche note moyenne, liste des reviews avec auteur, date, contenu.

**US-REV-02: Écrire une review**
> En tant qu'utilisateur connecté, je veux laisser un avis sur un modèle (note 1-5 + commentaire).

- **Acceptance:** Formulaire de review dans la section Reviews. Utilise tRPC.reviews.create. Une seule review par utilisateur par modèle.

**US-LIKE-01: Favoriser un modèle**
> En tant qu'utilisateur connecté, je veux ajouter/retirer un modèle de mes favoris.

- **Acceptance:** Bouton cœur/étoile sur la carte modèle et la page détail. Utilise tRPC.user.toggleFavorite. État visuel (plein/vide).

### P1 — Compare

**US-COMP-01: Comparer deux modèles**
> En tant que visiteur, je veux comparer les specs de deux modèles côte à côte.

- **Acceptance:** Page /compare/[slug-a]-vs-[slug-b]. Affiche specs des deux modèles en parallèle. Lien "Compare" dans sidebar fonctionnel.

### P1 — Footer

**US-FOOT-01: Navigation footer**
> En tant que visiteur, je veux accéder aux pages importantes depuis le footer.

- **Acceptance:** Footer avec colonnes : Platform (Home, Models, Compare, Blog), Company (About, Pricing), Legal (Privacy, Terms), Social links.

### P2 — Blog & Pages statiques

**US-BLOG-01: Listing blog**
> En tant que visiteur, je veux lire des articles sur les LLMs pour m'informer.

- **Acceptance:** Page /blog avec listing d'articles. Chaque article a titre, résumé, date, auteur.

**US-ABOUT-01: À propos**
> En tant que visiteur, je veux en savoir plus sur LLM Trust et sa mission.

- **Acceptance:** Page /about avec mission, équipe (placeholder), valeurs.

### P2 — Upload

**US-UPLOAD-01: Proposer un modèle**
> En tant qu'utilisateur connecté, je veux soumettre un modèle à la plateforme.

- **Acceptance:** Page /models/upload avec formulaire (nom, description, URL HuggingFace, catégorie, tags, licence). Statut "draft" par défaut, nécessite validation admin.

---

## 4. SPECS DÉTAILLÉES PAR PAGE

### /auth/sign-in — Page de connexion

**Contenu:**
- Logo/brand LLM Trust en haut
- Titre "Sign In"
- Formulaire : email (input), password (input avec toggle visibilité), "Remember me" (checkbox)
- Bouton "Sign In" (primary)
- Lien "Don't have an account? Sign Up"
- Optionnel : "Continue with GitHub" / "Continue with Google" (OAuth)
- Lien "Forgot password?"

**Composants:** Card, Input, Button, Label, Separator
**Interactions:** Validation côté client, appel Better Auth, redirection vers /dashboard ou page précédente, toast d'erreur

---

### /auth/sign-up — Page d'inscription

**Contenu:**
- Logo/brand LLM Trust
- Titre "Create Account"
- Formulaire : name (input), email (input), password (input), confirm password (input)
- Bouton "Create Account" (primary)
- Lien "Already have an account? Sign In"
- Texte légal "By signing up, you agree to our Terms and Privacy Policy"

**Composants:** Card, Input, Button, Label
**Interactions:** Validation (password match, min 8 chars, email format), appel Better Auth, toast succès, redirection vers /auth/sign-in

---

### /dashboard — Tableau de bord

**Contenu:**
- Titre "Welcome back, {name}"
- Stats cards : Favorites count, Reviews count, Models uploaded
- Section "Recent Favorites" — 3 derniers modèles favoris avec lien "View all"
- Section "Recent Activity" — dernières actions (reviews écrites, favoris ajoutés)
- Sidebar : Dashboard, Favorites, Settings, API Keys

**Composants:** Card, Badge, Avatar, Skeleton (loading)
**Interactions:** tRPC.user.favorites, tRPC.reviews.list (mes reviews), protégé (redirect si non connecté)

---

### /dashboard/favorites — Mes favoris

**Contenu:**
- Titre "My Favorites"
- Grid de ModelCard (mêmes composants que /models)
- Empty state si aucun favori ("You haven't favorited any models yet. Browse models to get started.")
- Bouton "Browse Models"

**Composants:** ModelCardEnhanced, EmptyState
**Interactions:** tRPC.user.favorites, tRPC.user.toggleFavorite (depuis la carte), protégé

---

### /dashboard/settings — Paramètres

**Contenu:**
- Titre "Settings"
- Tabs : Profile, Account, API Keys
- **Profile tab:** name (input), image (upload/url), bio (textarea), bouton Save
- **Account tab:** email (readonly), change password (current + new + confirm), delete account (danger zone)
- **API Keys tab:** liste des clés (name, prefix, created, last used, expires), bouton "Create Key", bouton revoke

**Composants:** Tabs, Input, Button, Table, Dialog (create key), Badge
**Interactions:** tRPC.user.apiKeys, tRPC.user.createApiKey, tRPC.user.revokeApiKey, protégé

---

### /models/upload — Upload de modèle

**Contenu:**
- Titre "Submit a Model"
- Formulaire multi-étapes ou sections :
  1. **Basic Info:** name, slug (auto-généré), description, long description (textarea)
  2. **Technical:** architecture (select), parameterCount, contextLength, license (select), category (select)
  3. **Links:** HuggingFace URL (input avec validation URL)
  4. **Details:** tags (multi-select), format (select: GGUF/Safetensors), quantizations (multi-select)
  5. **Preview:** aperçu de la carte modèle avant soumission
- Bouton "Submit for Review"

**Composants:** Form, Input, Textarea, Select, Badge (tags), Card
**Interactions:** Validation complète, création en DB avec status="draft", protégé, redirection vers confirmation

---

### /compare/[slug-a]-vs-[slug-b] — Comparaison

**Contenu:**
- Header avec les deux noms de modèles
- Tableau comparatif côte à côte :
  - Architecture, Parameters, Context Length, License, Downloads, Rating
  - Tags, Format, Quantizations, Recommended RAM
- Verdict / résumé (optionnel)
- Liens vers chaque page détail

**Composants:** Table, Badge, Card
**Interactions:** tRPC.models.get (x2), params depuis l'URL

---

### /blog — Listing articles

**Contenu:**
- Titre "Blog"
- Sous-titre "Insights, tutorials, and news about open-source AI"
- Grid d'articles : image, titre, résumé, date, auteur, catégorie
- Pagination
- Sidebar : catégories, articles populaires

**Composants:** Card, Badge, Pagination
**Interactions:** Requête DB blog posts (schema à créer ou CMS), ISR/SSG

---

### /blog/[slug] — Article

**Contenu:**
- Titre, auteur, date, catégorie
- Image hero (optionnel)
- Contenu markdown/MDX rendu
- Table of contents (sidebar)
- Articles liés en bas

**Composants:** MDX renderer, TOC, Card (related)
**Interactions:** SSG avec generateStaticParams

---

### /about — À propos

**Contenu:**
- Hero "About LLM Trust"
- Mission statement
- Valeurs (Open Source, Privacy-First, Community-Driven)
- Équipe (placeholder cards)
- Timeline / milestones (optionnel)

**Composants:** Statique, GlowCard
**Interactions:** Aucune (page statique)

---

### /pricing — Tarifs

**Contenu:**
- Titre "Simple, Transparent Pricing"
- 2-3 cartes : Free (actuel), Pro (futur), Enterprise (futur)
- Free : unlimited browsing, community reviews, CLI access
- Pro : API access, priority support, advanced analytics
- Enterprise : custom, SLA, dedicated support
- FAQ section

**Composants:** Card, Badge, Button, Accordion (FAQ)
**Interactions:** Aucune pour l'instant (tous les plans affichent "Free" ou "Coming Soon")

---

### Footer complet

**Structure:**
```
[Logo + tagline]    [Platform]     [Company]     [Legal]
                    Home           About          Privacy Policy
                    Models         Pricing        Terms of Service
                    Compare        Blog           Cookie Policy
                    Docs           Contact
                    CLI

[Social: GitHub, Twitter/X, Discord]
© 2026 LLM Trust · Built with ❤️ for the open-source community
```

**Composants:** Grid, Links, Separator

---

## 5. PLAN D'ACTION — Ordre d'implémentation

### Sprint 1 — Fondations (P0) ~3-5 jours

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Seed DB avec 20+ modèles réels                           │
│    → Script de seed (Drizzle) avec vrais modèles HF         │
│    → Llama 3, Mistral, Phi-3, Gemma 2, Qwen 2.5,          │
│      DeepSeek, Command R, Stable Diffusion XL, etc.        │
├─────────────────────────────────────────────────────────────┤
│ 2. Pages Auth (/auth/sign-in + /auth/sign-up)               │
│    → Formulaires connectés à Better Auth                    │
│    → Validation, erreurs, redirections                      │
├─────────────────────────────────────────────────────────────┤
│ 3. Connecter pages ↔ tRPC                                   │
│
