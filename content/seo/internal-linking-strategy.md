# Internal Linking Strategy — LLM Trust

> A comprehensive plan for programmatic internal linking across all page types.
> Goal: maximize crawl efficiency, distribute PageRank, and help users discover related content.

---

## Link Architecture Overview

```
                        ┌─────────┐
                        │Homepage │
                        └────┬────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
        │  /models  │ │   /blog   │ │  /compare │
        │  (hub)    │ │  (hub)    │ │  (hub)    │
        └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
              │              │              │
    ┌─────────┼─────────┐    │         ┌────┴────┐
    │         │         │    │         │         │
┌───┴───┐ ┌──┴──┐ ┌────┴──┐ │    ┌────┴───┐ ┌──┴──┐
│Model  │ │Model│ │Categ- │ │    │Compare │ │Model│
│pages  │ │pages│ │ory    │ │    │A vs B  │ │B    │
│       │ │     │ │pages  │ │    │pages   │ │page │
└───┬───┘ └──┬──┘ └────┬──┘ │    └────┬───┘ └──┬──┘
    │        │         │    │         │         │
    └────────┴─────────┴────┴─────────┴─────────┘
                    Cross-linking
```

---

## Page Types & Link Rules

### 1. Model Pages (`/models/[slug]`)

**Every model page MUST contain:**

| Link Type | Target | Count | Placement |
|---|---|---|---|
| Category page | `/models/categories/[categorySlug]` | 1 | Breadcrumb + "Category" badge |
| Related models | `/models/[relatedSlug]` | 5 | "Related Models" section |
| Comparison page | `/compare/[slug]-vs-[altSlug]` | 1-3 | "Compare" section + inline CTA |
| Homepage | `/` | 1 | Logo (always) |
| Models hub | `/models` | 1 | Breadcrumb |
| Blog posts | `/blog/[relevantPost]` | 0-2 | "Learn more" links (if relevant posts exist) |

**Related model selection algorithm (5 links):**

```python
def get_related_models(model: Model, all_models: list[Model]) -> list[Model]:
    """
    Select 5 related models for internal linking.
    Priority:
    1. Same category, different creator (max 2) → variety within niche
    2. Same creator, different category (max 1) → creator ecosystem
    3. Similar param count ±50% (max 1) → peer models
    4. Most compared with this model (max 1) → data-driven
    5. Trending this month (max 1) → freshness signal
    """
    related = []
    
    # Rule 1: Same category, different creator
    same_cat = [m for m in all_models 
                if m.category == model.category 
                and m.creator != model.creator
                and m.slug != model.slug]
    related.extend(same_cat[:2])
    
    # Rule 2: Same creator, different category
    same_creator = [m for m in all_models 
                    if m.creator == model.creator 
                    and m.category != model.category
                    and m.slug not in [r.slug for r in related]]
    related.extend(same_creator[:1])
    
    # Rule 3: Similar param count
    param_range = (model.param_count * 0.5, model.param_count * 1.5)
    similar_size = [m for m in all_models 
                    if param_range[0] <= m.param_count <= param_range[1]
                    and m.slug not in [r.slug for r in related]]
    related.extend(similar_size[:1])
    
    # Rule 4: Most compared (from analytics)
    most_compared = get_most_compared(model.slug)
    for mc in most_compared:
        if mc.slug not in [r.slug for r in related]:
            related.append(mc)
            break
    
    # Rule 5: Trending
    trending = get_trending_models(period="30d")
    for t in trending:
        if t.slug not in [r.slug for r in related]:
            related.append(t)
            break
    
    return related[:5]
```

**Anchor text rules for model page links:**

```python
ANCHOR_TEXT_TEMPLATES = {
    "related_model": [
        "{model_name} — {tagline}",
        "{model_name} ({param_count} parameters)",
        "Compare with {model_name}",
        "{model_name} by {creator_name}",
    ],
    "comparison": [
        "{modelA} vs {modelB}",
        "Compare {modelA} and {modelB}",
        "{modelA} vs {modelB}: which is better?",
    ],
    "category": [
        "More {category_name} models",
        "All {category_name} LLMs",
        "Browse {category_name} models",
    ],
}
```

---

### 2. Category Pages (`/models/categories/[slug]`)

**Every category page MUST contain:**

| Link Type | Target | Count | Placement |
|---|---|---|---|
| All models in category | `/models/[slug]` | ALL | Ranked list (primary content) |
| Related categories | `/models/categories/[otherSlug]` | 3-5 | "Explore Other Categories" section |
| Models hub | `/models` | 1 | Breadcrumb |
| Homepage | `/` | 1 | Logo |
| Best comparison per model | `/compare/[slug]-vs-[altSlug]` | 1 per model | "Compare" link in model card |

**Related category selection:**

```python
RELATED_CATEGORIES = {
    "chat": ["text-generation", "reasoning", "tool-use"],
    "code-generation": ["reasoning", "tool-use", "chat"],
    "reasoning": ["code-generation", "chat", "math"],
    "text-generation": ["chat", "summarization", "creative-writing"],
    "summarization": ["text-generation", "translation", "chat"],
    "translation": ["summarization", "text-generation", "chat"],
    "embedding": ["search", "rag", "multimodal"],
    "image-generation": ["multimodal", "creative-writing"],
    "multimodal": ["image-generation", "chat", "embedding"],
    "tool-use": ["code-generation", "chat", "reasoning"],
}
```

---

### 3. Compare Pages (`/compare/[modelA]-vs-[modelB]`)

**Every compare page MUST contain:**

| Link Type | Target | Count | Placement |
|---|---|---|---|
| Model A page | `/models/[slugA]` | 1+ | Throughout (header, specs, verdict) |
| Model B page | `/models/[slugB]` | 1+ | Throughout (header, specs, verdict) |
| Other comparisons (model A) | `/compare/[slugA]-vs-[other]` | 3-5 | "More Comparisons" section |
| Other comparisons (model B) | `/compare/[slugB]-vs-[other]` | 3-5 | "More Comparisons" section |
| Category pages | `/models/categories/[cat]` | 1-2 | Breadcrumb + context |
| Homepage | `/` | 1 | Logo |
| Models hub | `/models` | 1 | Breadcrumb |

**Comparison link selection:**

```python
def get_comparison_links(model: Model, all_models: list[Model], max_links: int = 5) -> list[Model]:
    """Get models to link to for 'More Comparisons' section."""
    candidates = []
    
    # 1. Same category, different creator (most relevant comparisons)
    same_cat = [m for m in all_models 
                if m.category == model.category and m.creator != model.creator]
    candidates.extend(same_cat[:3])
    
    # 2. Most popular models overall (catch-all)
    popular = get_most_viewed_models(limit=10)
    for p in popular:
        if p.slug not in [c.slug for c in candidates]:
            candidates.append(p)
            if len(candidates) >= max_links:
                break
    
    return candidates[:max_links]
```

**Anchor text for comparison links:**

- Use exact format: `"{ModelA} vs {ModelB}"` (consistent, keyword-rich)
- Always link to canonical URL (alphabetical slug order)

---

### 4. Blog Posts (`/blog/[slug]`)

**Every blog post MUST contain:**

| Link Type | Target | Count | Placement |
|---|---|---|---|
| Model pages | `/models/[slug]` | 3-5 | In-text (contextual) |
| Compare pages | `/compare/[a]-vs-[b]` | 0-2 | When discussing alternatives |
| Category pages | `/models/categories/[slug]` | 1-2 | When discussing a category |
| Homepage | `/` | 1 | Logo |
| Other blog posts | `/blog/[otherSlug]` | 1-2 | "Related articles" section |
| CTA to signup | `/signup` | 1 | End of article |

**Automatic link insertion rules:**

```python
def insert_contextual_links(content: str, models_db: ModelsDB) -> str:
    """
    Insert contextual links in blog content.
    Rules:
    1. First mention of a model name → link to model page
    2. Subsequent mentions → no link (avoid over-linking)
    3. "X vs Y" mentions → link to comparison page
    4. Category mentions (e.g., "code generation models") → link to category
    5. Max 1 link per paragraph
    6. No more than 5 model links per article
    """
    link_count = 0
    max_links = 5
    linked_models = set()
    
    for paragraph in content.split("\n\n"):
        for model in models_db.all():
            if model.name in paragraph and model.slug not in linked_models:
                if link_count >= max_links:
                    break
                paragraph = paragraph.replace(
                    model.name,
                    f"[{model.name}](/models/{model.slug})",
                    1  # Only first occurrence
                )
                linked_models.add(model.slug)
                link_count += 1
        
        # Check for "X vs Y" patterns
        for match in re.finditer(r"(\w[\w-]+) vs (\w[\w-]+)", paragraph):
            model_a = models_db.find(match.group(1))
            model_b = models_db.find(match.group(2))
            if model_a and model_b:
                paragraph = paragraph.replace(
                    match.group(0),
                    f"[{match.group(0)}](/compare/{model_a.slug}-vs-{model_b.slug})"
                )
    
    return content
```

---

### 5. Footer Links (Global)

**Footer on every page:**

```
┌─────────────────────────────────────────────────────────────┐
│  LLM Trust                                    © 2026        │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  Models      │  Categories  │  Resources   │  Company      │
│  All Models  │  Chat        │  Blog        │  About        │
│  New Models  │  Code Gen    │  Benchmarks  │  Contact      │
│  Top Rated   │  Reasoning   │  API Docs    │  Privacy      │
│  Open Source │  Multimodal  │  Changelog   │  Terms        │
│  Compare     │  Embeddings  │  FAQ         │  Careers      │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

**Footer link targets (all pages):**

```yaml
footer:
  columns:
    - title: "Models"
      links:
        - { text: "All Models", url: "/models" }
        - { text: "New Releases", url: "/models?sort=release_date" }
        - { text: "Top Rated", url: "/models?sort=rating" }
        - { text: "Open Source", url: "/models?filter=open_source" }
        - { text: "Compare Models", url: "/compare" }
    
    - title: "Categories"
      links:
        - { text: "Chat & Conversation", url: "/models/categories/chat" }
        - { text: "Code Generation", url: "/models/categories/code-generation" }
        - { text: "Reasoning", url: "/models/categories/reasoning" }
        - { text: "Multimodal", url: "/models/categories/multimodal" }
        - { text: "Embeddings", url: "/models/categories/embedding" }
    
    - title: "Resources"
      links:
        - { text: "Blog", url: "/blog" }
        - { text: "Benchmarks", url: "/benchmarks" }
        - { text: "API Documentation", url: "/docs" }
        - { text: "Changelog", url: "/changelog" }
    
    - title: "Company"
      links:
        - { text: "About", url: "/about" }
        - { text: "Contact", url: "/contact" }
        - { text: "Privacy Policy", url: "/privacy" }
        - { text: "Terms of Service", url: "/terms" }
```

---

## Link Equity Distribution

### Priority Ranking (by link depth from homepage)

```
Depth 0 (1 link):    Homepage
Depth 1 (2 links):   /models, /blog, /compare
Depth 2 (3 links):   Category pages, popular model pages
Depth 3 (4 links):   Individual model pages, compare pages
Depth 4 (5 links):   Blog posts, less popular model pages
```

**Target: No page should be more than 3 clicks from the homepage.**

### PageRank Distribution Rules

1. **Homepage** → Links to: models hub, blog hub, compare hub, top 5 models
2. **Models hub** → Links to: all categories, featured models (top 10)
3. **Category page** → Links to: all models in category (strong signal), related categories
4. **Model page** → Links to: category, 5 related models, 1-3 comparisons
5. **Compare page** → Links to: both model pages, 3-5 other comparisons
6. **Blog post** → Links to: 3-5 model pages, 1-2 category pages

### Orphan Prevention

```python
def check_orphans(all_pages: list[Page]) -> list[Page]:
    """Find pages with no inbound internal links."""
    all_slugs = {p.slug for p in all_pages}
    linked_slugs = set()
    
    for page in all_pages:
        for link in page.outbound_links:
            linked_slugs.add(link.target_slug)
    
    orphans = all_slugs - linked_slugs
    return [p for p in all_pages if p.slug in orphans]

# Fix: Ensure every page is linked from at least:
# - Its parent hub page
# - Its category page (if applicable)
# - The sitemap
```

---

## Anchor Text Guidelines

### Do ✅

| Context | Example Anchor |
|---|---|
| Model reference | `GPT-4o` |
| Comparison link | `GPT-4o vs Claude 3.5` |
| Category link | `code generation models` |
| Descriptive | `open-source LLMs under 10B parameters` |
| Action-oriented | `compare these models` |

### Don't ❌

| Bad Practice | Example |
|---|---|
| Generic "click here" | `[click here](/models/gpt-4o)` |
| Over-optimized | `[best LLM model AI GPT-4 OpenAI](/models/gpt-4o)` |
| URL as anchor | `[https://llmtrust.com/models/gpt-4o]` |
| Too long | `[GPT-4o which is OpenAI's latest multimodal large language model released in May 2024](/models/gpt-4o)` |
| Duplicate anchors on same page | Two links both with anchor "Claude 3.5" pointing to different targets |

---

## Sitemap Strategy

### XML Sitemap Structure

```xml
<!-- sitemap-index.xml -->
<sitemapindex>
  <sitemap>
    <loc>https://www.llmtrust.com/sitemap-models.xml</loc>
    <lastmod>{{buildDate}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.llmtrust.com/sitemap-categories.xml</loc>
    <lastmod>{{buildDate}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.llmtrust.com/sitemap-compare.xml</loc>
    <lastmod>{{buildDate}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.llmtrust.com/sitemap-blog.xml</loc>
    <lastmod>{{buildDate}}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.llmtrust.com/sitemap-static.xml</loc>
    <lastmod>{{buildDate}}</lastmod>
  </sitemap>
</sitemapindex>
```

**Sitemap priority and frequency:**

| Page Type | Priority | Changefreq |
|---|---|---|
| Homepage | 1.0 | daily |
| Models hub | 0.9 | daily |
| Category pages | 0.8 | weekly |
| Model pages | 0.8 | weekly |
| Compare pages | 0.7 | weekly |
| Blog posts (new) | 0.7 | monthly |
| Blog posts (old) | 0.5 | yearly |
| Static pages | 0.3 | monthly |

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Footer links on all pages (global nav)
- [ ] Breadcrumbs on all sub-pages
- [ ] XML sitemaps generated and submitted to GSC
- [ ] robots.txt allows crawling of all page types

### Phase 2: Model Pages
- [ ] Related models section (5 links per page)
- [ ] Category breadcrumb link
- [ ] Comparison link (1 per page minimum)
- [ ] "See all models" link

### Phase 3: Category Pages
- [ ] All models in category listed and linked
- [ ] Related categories section (3-5 links)
- [ ] Comparison links within model cards

### Phase 4: Compare Pages
- [ ] Links to both model pages (repeated naturally)
- [ ] "More comparisons" section (3-5 per model)
- [ ] Category breadcrumb

### Phase 5: Blog
- [ ] Auto-insert model links on first mention
- [ ] Related articles section
- [ ] Category links where relevant

### Phase 6: Monitoring
- [ ] Track internal link counts per page (target: 15-30)
- [ ] Monitor orphan pages weekly
- [ ] Check crawl stats in Google Search Console
- [ ] Track pages-per-session metric (target: >2.5)
- [ ] Monitor time-to-index for new pages (target: <48h)

---

## Link Count Targets per Page

| Page Type | Min Links | Max Links | Optimal |
|---|---|---|---|
| Homepage | 20 | 50 | 30 |
| Models hub | 15 | 40 | 25 |
| Category page | 15 | 50 | 20 |
| Model page | 10 | 25 | 15 |
| Compare page | 10 | 30 | 18 |
| Blog post | 8 | 20 | 12 |

---

## Monitoring & KPIs

| Metric | Target | Tool |
|---|---|---|
| Avg internal links per page | 15+ | Screaming Frog |
| Orphan pages | 0 | Screaming Frog |
| Crawl depth (max clicks from homepage) | ≤ 3 | Screaming Frog |
| Pages crawled per day | Increasing | GSC |
| Internal link CTR | >5% | GA4 |
| Pages per session | >2.5 | GA4 |
| Index coverage | >95% | GSC |
| New page time-to-index | <48h | GSC |
