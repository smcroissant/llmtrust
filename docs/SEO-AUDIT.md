# 🔍 SEO Audit — LLM Trust

**Date:** 2026-03-13  
**Branch:** develop  
**Site:** https://llmtrust.com

---

## 1. Structured Data (JSON-LD)

### Homepage (`/`)
| Type | Status | Notes |
|------|--------|-------|
| WebSite | ✅ | `WebsiteJsonLd` component — includes SearchAction |
| Organization | ❌ | **MANQUANT** — Pas de JSON-LD Organization sur la homepage |

### Models (`/models/[slug]`)
| Type | Status | Notes |
|------|--------|-------|
| SoftwareApplication | ✅ | Avec offers, aggregateRating, author |
| BreadcrumbList | ✅ | Home → Models → [Model Name] |
| FAQPage | ✅ | 4 FAQ auto-générées par modèle |

### Blog (`/blog/[slug]`)
| Type | Status | Notes |
|------|--------|-------|
| Article | ✅ | Avec publisher, author, mainEntityOfPage |
| BreadcrumbList | ✅ | Home → Blog → [Post Title] |

### Categories (`/categories`)
| Type | Status | Notes |
|------|--------|-------|
| ItemList | ✅ | Liste dynamique de toutes les catégories |

### Categories (`/categories/[slug]`)
| Type | Status | Notes |
|------|--------|-------|
| ItemList | ✅ | Liste des modèles dans la catégorie |
| BreadcrumbList | ✅ | Home → Categories → [Category Name] |

### Blog List (`/blog`)
| Type | Status | Notes |
|------|--------|-------|
| ItemList | ✅ | Tous les articles listés |
| BreadcrumbList | ✅ | Home → Blog |

### Blog Category (`/blog/category/[category]`)
| Type | Status | Notes |
|------|--------|-------|
| ItemList | ✅ | Articles de la catégorie |
| BreadcrumbList | ✅ | Home → Blog → [Category] |

### Best Pages (`/best/*`)
| Type | Status | Notes |
|------|--------|-------|
| ItemList | ✅ | Inline JSON-LD avec ranking (position) |
| BreadcrumbList | ❌ | **MANQUANT** sur `/best/open-source-llms`, `/best/code-llms`, `/best/small-llms` |

### Compare Pages (`/compare/[slugA]/vs/[slugB]`)
| Type | Status | Notes |
|------|--------|-------|
| Article | ❌ | **MANQUANT** — Pas de JSON-LD sur les pages compare |
| BreadcrumbList | ❌ | **MANQUANT** — Pas de BreadcrumbList |

### Compare Index (`/compare`)
| Type | Status | Notes |
|------|--------|-------|
| ItemList | ❌ | **MANQUANT** — Pas de liste des comparaisons disponibles |

### Newsletter (`/newsletter`)
| Type | Status | Notes |
|------|--------|-------|
| WebPage | ❌ | **MANQUANT** — Client component, pas de JSON-LD |

---

## 2. Meta Descriptions & Title Tags

### ✅ Bon — Toutes les pages ont :

| Page | Title | Description | Canonical |
|------|-------|-------------|-----------|
| Homepage | ✅ 54 chars | ✅ 149 chars | ✅ |
| `/models` | ✅ 50 chars | ✅ 155 chars | ✅ |
| `/models/[slug]` | ✅ Dynamic | ✅ Dynamic | ✅ |
| `/blog` | ✅ 48 chars | ✅ 149 chars | ✅ |
| `/blog/[slug]` | ✅ meta_title | ✅ meta_description | ✅ |
| `/categories` | ✅ 25 chars | ✅ 138 chars | ✅ |
| `/categories/[slug]` | ✅ Dynamic | ✅ Dynamic | ✅ |
| `/compare` | ✅ 38 chars | ✅ 147 chars | ✅ |
| `/compare/[slugA]/vs/[slugB]` | ✅ Dynamic | ✅ Dynamic | ✅ |
| `/best/open-source-llms` | ✅ 38 chars | ✅ 156 chars | ✅ |
| `/best/code-llms` | ✅ 50 chars | ✅ 157 chars | ✅ |
| `/best/small-llms` | ✅ 50 chars | ✅ 155 chars | ✅ |
| `/docs` | ✅ 28 chars | ✅ 96 chars | ✅ |
| `/docs/api` | ✅ 36 chars | ✅ 132 chars | ✅ |
| `/blog/category/[category]` | ✅ Dynamic | ✅ Dynamic | ✅ |
| `/privacy` | ✅ Via layout template | ✅ Via layout | ✅ |
| `/terms` | ✅ Via layout template | ✅ Via layout | ✅ |

### ⚠️ Améliorations possibles :

- `/docs` — Description (96 chars) est un peu courte. Recommandé : 150-160 chars.
- `/newsletter` — **Pas de metadata Next.js** (client component). Le title/description hérite du layout par défaut.

---

## 3. Sitemap (`/sitemap.ts`)

### ✅ Bon :
- Toutes les pages statiques présentes
- Modèles dynamiques depuis la DB (limit: 100)
- Catégories dynamiques depuis la DB
- Blog posts depuis les fichiers Markdown
- Priorités cohérentes (1.0 homepage, 0.9 models, etc.)
- `changeFrequency` approprié par type de page

### ⚠️ Points d'attention :
- **`limit: 100`** sur les modèles — si plus de 100 modèles, les excédents seront absents du sitemap
- Pas de `/newsletter` dans le sitemap
- Pas de `/best/*` pages — non, elles y sont ✅

### ❌ Manque :
- `/newsletter` absent du sitemap
- `/cookies` absent du sitemap
- `/models/upload` absent du sitemap

---

## 4. Images OG (`og:image`)

### ✅ Bon :
- **Default OG image** : `/og-default.svg` existe (1200×630)
- **Blog posts** : utilisent `post.frontmatter.image` si disponible
- **Layout global** : définit `/og-default.svg` pour toutes les pages sans image custom
- **`generatePageMetadata`** : utilise automatiquement `og-default.svg` comme fallback

### ⚠️ Améliorations possibles :
- **SVG comme OG image** — Certains réseaux sociaux (LinkedIn notamment) supportent mal les SVG pour og:image. **Recommandation : créer un PNG 1200×630** (`og-default.png`)
- **Modèles** : Pas d'image OG dynamique par modèle (ex: screenshot de la model card). Serait un bon + pour le partage social.
- **Best pages** : Pas d'image OG spécifique

---

## 5. Robots.txt

### ✅ Bon :
- Allow: `/` pour tous les bots
- Disallow: `/api/`, `/admin/`, `/dashboard/`, `/_next/`
- Sitemap URL correcte : `https://llmtrust.com/sitemap.xml`

---

## 6. Autres observations SEO

### ✅ Bon :
- `metadataBase` configuré à `https://llmtrust.com`
- `lang="en"` sur `<html>`
- `robots` config avec `max-image-preview: large`, `max-snippet: -1`
- Canonical URLs sur toutes les pages
- Twitter cards (`summary_large_image`) configurées
- OpenGraph `type`, `locale`, `siteName` corrects
- Vercel Analytics + Speed Insights installés
- Inter font avec `display: "swap"` (bon pour CLS)

### ❌ Problèmes :
1. **`/newsletter`** — Page client component sans metadata SEO ni JSON-LD. Hérite seulement du layout.
2. **Compare pages** — Pas de JSON-LD structuré (Article ou BreadcrumbList)
3. **No `Organization` JSON-LD** — Manque sur la homepage. Google utilise ça pour le Knowledge Panel.

---

## 📋 Résumé & Priorités de correction

### 🔴 Critique (corriger en priorité)

1. **Ajouter `Organization` JSON-LD** sur la homepage
   - Créer un composant `OrganizationJsonLd` dans `src/components/seo/structured-data.tsx`
   - L'ajouter dans `src/app/layout.tsx` ou `src/app/page.tsx`
   - Infos : name, url, logo, sameAs (social links), contactPoint

2. **OG Image PNG** — Remplacer `/og-default.svg` par un PNG 1200×630
   - LinkedIn et certains scrapers ne supportent pas le SVG pour og:image

### 🟡 Important

3. **BreadcrumbList sur `/best/*`** — Ajouter BreadcrumbJsonLd aux 3 pages best
4. **JSON-LD sur compare pages** — Ajouter Article + BreadcrumbList
5. **Newsletter metadata** — Rendre la page SEO-friendly (metadata export ou wrapper server component)

### 🟢 Améliorations

6. **Sitemap** — Augmenter la limite de 100 modèles ou paginer
7. **Sitemap** — Ajouter `/newsletter`, `/cookies` au sitemap
8. **Description `/docs`** — Allonger à 150+ chars
9. **Dynamic OG images** — Générer des og:image par modèle (Vercel OG / @vercel/og)

---

## Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `src/components/seo/structured-data.tsx` | Ajouter `OrganizationJsonLd` |
| `src/app/layout.tsx` | Ajouter `OrganizationJsonLd` |
| `src/app/best/open-source-llms/page.tsx` | Ajouter `BreadcrumbJsonLd` |
| `src/app/best/code-llms/page.tsx` | Ajouter `BreadcrumbJsonLd` |
| `src/app/best/small-llms/page.tsx` | Ajouter `BreadcrumbJsonLd` |
| `src/app/compare/[slugA]/vs/[slugB]/page.tsx` | Ajouter `ArticleJsonLd` + `BreadcrumbJsonLd` |
| `src/app/sitemap.ts` | Augmenter limit, ajouter pages manquantes |
| `public/og-default.png` | Créer PNG 1200×630 |
| `src/app/newsletter/page.tsx` | Wrapper pour metadata/SEO |
