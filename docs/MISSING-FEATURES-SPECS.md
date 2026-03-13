# Missing Features — Detailed Specs

**Author:** Atlas, Head of Product (CroissantLabs)
**Date:** 2026-03-13
**Status:** Ready for estimation & sprint planning

---

## Table of Contents

1. [Blog Complet (MDX)](#1-blog-complet-mdx)
2. [Gamification UI](#2-gamification-ui)
3. [Model Download (Web)](#3-model-download-web)
4. [Compare Amélioré](#4-compare-amélioré)

---

## 1. Blog Complet (MDX)

**Priority: P1** — Content marketing is a key SEO and acquisition lever. Blog pages already exist in the audit but need full MDX integration.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 1.1 | Visitor | Browse blog posts with pagination | I can discover articles progressively |
| 1.2 | Visitor | Read an article with a table of contents | I can navigate long-form content easily |
| 1.3 | Visitor | Filter posts by category | I can find content relevant to my interests |
| 1.4 | Visitor | Search blog posts | I can find specific topics quickly |
| 1.5 | Admin/Author | Write posts in MDX | I can use rich components (code blocks, charts, callouts) in articles |
| 1.6 | Admin/Author | Define metadata (title, category, tags, cover image, SEO) via frontmatter | Posts are optimized for search and social sharing |

### Acceptance Criteria

#### 1.1 Blog Listing (`/blog`)
- [ ] Paginated list (10 posts per page) with prev/next navigation
- [ ] Each card shows: cover image, title, excerpt (first 150 chars), category badge, reading time, date
- [ ] URL pattern: `/blog?page=2`
- [ ] `rel="prev"` / `rel="next"` link tags for SEO
- [ ] Empty state when no posts exist

#### 1.2 Article Page (`/blog/[slug]`)
- [ ] Full MDX rendering with all custom components (Callout, CodeBlock, ModelCard embed, ComparisonTable)
- [ ] Auto-generated TOC from h2/h3 headings, sticky sidebar on desktop, collapsible on mobile
- [ ] Active TOC highlighting based on scroll position (IntersectionObserver)
- [ ] Reading progress bar at top
- [ ] Author card with avatar, name, role
- [ ] Related posts section (3 posts, same category or shared tags)
- [ ] Social share buttons (Twitter/X, LinkedIn, copy link)
- [ ] SEO: structured data (Article schema), OG image from frontmatter
- [ ] 404 page for non-existent slugs

#### 1.3 Category Page (`/blog/category/[category]`)
- [ ] Filtered post list for the given category
- [ ] Category description and post count
- [ ] Same pagination as main listing
- [ ] Breadcrumb: Blog > [Category]

#### 1.4 Blog Search
- [ ] Client-side search across title, excerpt, tags (Fuse.js or similar)
- [ ] Search bar on `/blog` listing page
- [ ] Results update as user types (debounced 200ms)
- [ ] Highlight matching terms in results
- [ ] "No results" state with suggestion to browse categories

#### 1.5 MDX Content Pipeline
- [ ] Posts stored as `.mdx` files in `/content/blog/` directory
- [ ] Required frontmatter: `title`, `slug`, `date`, `category`, `excerpt`, `coverImage`
- [ ] Optional frontmatter: `tags[]`, `author`, `readingTime` (auto-calculated if absent)
- [ ] Build-time validation: fail build if frontmatter is missing required fields or slug is duplicated
- [ ] Custom MDX components available: `<Callout>`, `<CodeBlock>`, `<ModelCard>`, `<ComparePreview>`, `<Tip>`

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/blog` | `BlogListingPage` | Paginated post grid |
| `/blog/[slug]` | `BlogPostPage` | Full article with TOC |
| `/blog/category/[category]` | `BlogCategoryPage` | Category-filtered listing |
| `src/components/blog/PostCard.tsx` | Post card for listings |
| `src/components/blog/TableOfContents.tsx` | Sticky TOC sidebar |
| `src/components/blog/ReadingProgress.tsx` | Progress bar |
| `src/components/blog/BlogSearch.tsx` | Search input + results |
| `src/components/blog/RelatedPosts.tsx` | Related articles section |
| `src/components/blog/ShareButtons.tsx` | Social sharing |
| `src/components/blog/mdx/` | Custom MDX components (Callout, CodeBlock, etc.) |
| `src/lib/blog.ts` | MDX parsing, frontmatter extraction, search index |
| `content/blog/*.mdx` | Blog post files |

### DB Schema Changes

**None required.** Blog content is file-based (MDX). No database tables needed for v1. If we later want a CMS or analytics, we could add:

```typescript
// Future (not in scope):
// blog_view — slug, viewedAt, referrer (for analytics)
```

---

## 2. Gamification UI

**Priority: P1** — The backend schema (badge, user_badge, user_stats, points_ledger) is already defined in GAMIFICATION.md. This spec covers the **frontend UI** to surface gamification to users.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 2.1 | User | See my badges on my profile | I can showcase my contributions |
| 2.2 | User | View a leaderboard | I can see how I rank vs other contributors |
| 2.3 | User | See my points and level in my dashboard | I can track my progress |
| 2.4 | User | Get notified when I earn a badge or level up | I feel rewarded for engagement |
| 2.5 | Visitor | See top contributors on the community page | I can discover trusted reviewers |

### Acceptance Criteria

#### 2.1 Badge Display on Profile (`/profile/[username]`)
- [ ] Grid layout of earned badges (icon + name), sorted by tier (Platinum → Gold → Silver → Bronze) then by earned date
- [ ] Hover tooltip: badge name, description, tier, date earned
- [ ] "New" badge glow animation (earned < 48h ago)
- [ ] Summary line: "🏆 12 Badges · ⭐ Gold Reviewer · Level 7"
- [ ] Locked badges shown as greyed-out silhouettes with progress hint ("15/50 reviews")
- [ ] Badge count per tier shown in a mini summary bar

#### 2.2 Leaderboard Page (`/community/leaderboard`)
- [ ] Ranked table: position, avatar, username, level, total points, badge count
- [ ] Top 3 get special styling (🥇🥈🥉 medals, highlighted rows)
- [ ] Time filter tabs: All Time, This Month, This Week
- [ ] Current user's row highlighted if they're not in top visible entries (with rank number)
- [ ] Pagination (50 per page) for beyond top entries
- [ ] Loading skeleton state
- [ ] SEO metadata, canonical URL

#### 2.3 Points & Level in Dashboard (`/dashboard`)
- [ ] Points summary card on dashboard overview: total points, current level, progress bar to next level
- [ ] Level name + icon displayed prominently
- [ ] "Points needed for next level: 230" with progress bar percentage
- [ ] Link to full gamification detail page or leaderboard
- [ ] Recent points activity (last 5 transactions from points_ledger): "+25 pts — Review on GPT-4"
- [ ] Badge showcase: last 4 earned badges with "View all" link

#### 2.4 Level-Up & Badge Notifications
- [ ] Toast notification (in-app) when user earns a badge: icon, badge name, points earned
- [ ] Toast notification on level up: new level name, celebratory animation
- [ ] Badge notification persisted in `/notifications` page with link to badge detail
- [ ] Notification includes: badge icon, name, date, "View on profile" CTA
- [ ] Notification marked as read when clicked/seen
- [ ] Optional: email notification for major milestones (Gold+ badges, level 5+)

#### 2.5 Community Page Enhancement (`/community`)
- [ ] New `/community` index page with sections: Leaderboard preview (top 5), Recent badges earned (activity feed), Stats (total users, reviews, models)
- [ ] Activity feed: "UserX earned 'Critic Elite' 🏆" with timestamp
- [ ] CTA to full leaderboard

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/community` | `CommunityPage` | Community hub with leaderboard preview + activity |
| `/community/leaderboard` | `LeaderboardPage` | Full ranked leaderboard |
| `/dashboard` (update) | `DashboardOverview` | Add points/level card + badge showcase |
| `/profile/[username]` (update) | `ProfilePage` | Add badge grid section |
| `/notifications` (update) | `NotificationsPage` | Add badge/level notification types |
| `src/components/gamification/BadgeGrid.tsx` | Badge display grid |
| `src/components/gamification/BadgeCard.tsx` | Individual badge (earned + locked) |
| `src/components/gamification/LevelProgress.tsx` | Points + level progress bar |
| `src/components/gamification/LeaderboardTable.tsx` | Ranked user table |
| `src/components/gamification/PointsActivity.tsx` | Recent points transactions |
| `src/components/gamification/LevelUpToast.tsx` | Celebration notification |
| `src/components/gamification/BadgeToast.tsx` | Badge earned notification |

### DB Schema Changes

**Already defined** in GAMIFICATION.md and schema. Verify these tables exist and have the right columns:

```typescript
// Already in schema or to be added:
badge              // slug, name, icon, category, tier, points, criteria, description
user_badge         // userId, badgeId, earnedAt
user_stats         // userId, totalPoints, level, currentStreak, longestStreak, reviewsCount, uploadsCount, totalDownloads, totalLikes, isAmbassador
points_ledger      // id, userId, points, reason, referenceId, createdAt
```

**New additions needed:**

```typescript
// Notification type extension
// Add "badge_earned" and "level_up" to notification type enum

// Index additions
// user_stats_total_points_idx — for leaderboard sorting
// user_badge_user_earned_idx — for profile badge query
// points_ledger_user_date_idx — for recent activity
```

---

## 3. Model Download (Web)

**Priority: P1** — Models have `downloadUrl` fields but the web UI doesn't expose download functionality or tracking.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 3.1 | Visitor | Click a download button on a model page | I can get the model from its source (HuggingFace, etc.) |
| 3.2 | Visitor | See download count on a model | I can gauge popularity |
| 3.3 | User | See my download history in my dashboard | I can find models I previously downloaded |
| 3.4 | Model Owner | See download stats for my models | I can track my models' adoption |
| 3.5 | Platform | Track download events | We can surface trending models and compute gamification points |

### Acceptance Criteria

#### 3.1 Download Button (`/models/[slug]`)
- [ ] Prominent "Download" button on model detail page
- [ ] Button shows source icon (HuggingFace logo, GitHub logo, generic link icon) based on `downloadUrl` domain
- [ ] Click opens `downloadUrl` in new tab (external redirect to source)
- [ ] Before redirect: increment download counter via API call (fire-and-forget, non-blocking)
- [ ] If `downloadUrl` is null/empty: button is disabled with "No download available" tooltip
- [ ] Button variant: primary CTA, positioned near model name/header area
- [ ] Secondary "Copy Link" button next to download

#### 3.2 Download Counter
- [ ] Display total download count on model detail page (formatted: "1.2K downloads", "45.3K downloads")
- [ ] Display on model cards in listings (small icon + count)
- [ ] Counter updates optimistically (increment locally, reconcile on next page load)
- [ ] Sort models by "Most Downloaded" option in `/models` listing

#### 3.3 Download Tracking API
- [ ] `POST /api/models/[slug]/download` endpoint
- [ ] Accepts: model slug, optional user ID (if authenticated)
- [ ] Records: modelId, userId (nullable), timestamp, referrer, user agent
- [ ] Rate limiting: max 1 count per user per model per hour (prevent spam)
- [ ] Anonymous downloads tracked (userId = null)
- [ ] Response: `{ success: true, totalDownloads: 1234 }`
- [ ] Idempotent: same user+model within window returns current count without incrementing

#### 3.4 Download History in Dashboard (`/dashboard/downloads`)
- [ ] New dashboard tab/page: "My Downloads"
- [ ] Chronological list of downloaded models: model name, slug, download date, source URL
- [ ] Each entry links to the model detail page
- [ ] Pagination: 20 per page
- [ ] Empty state: "No downloads yet. [Browse models →]"
- [ ] Only available to authenticated users

#### 3.5 Model Owner Download Stats
- [ ] On model detail page (for the uploader): show download chart (last 30 days sparkline)
- [ ] In admin panel: download count per model, sortable
- [ ] In dashboard: "Your Models" section shows download counts

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/models/[slug]` (update) | `ModelDetailPage` | Add download button + counter |
| `/models` (update) | `ModelsListingPage` | Add download count on cards + sort option |
| `/dashboard/downloads` | `DownloadHistoryPage` | User's download history |
| `src/components/models/DownloadButton.tsx` | Download CTA with source detection |
| `src/components/models/DownloadCounter.tsx` | Formatted download count |
| `src/components/models/DownloadHistoryList.tsx` | History list for dashboard |
| `src/server/api/routers/download.ts` | tRPC router for download tracking |

### DB Schema Changes

```typescript
// New table
model_download = pgTable("model_download", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelId: uuid("model_id").notNull().references(() => model.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
  referrer: varchar("referrer", { length: 512 }),
  userAgent: varchar("user_agent", { length: 512 }),
}, (table) => ({
  modelIdx: index("model_download_model_idx").on(table.modelId),
  userIdx: index("model_download_user_idx").on(table.userId),
  dateIdx: index("model_download_date_idx").on(table.downloadedAt),
  userModelDateIdx: index("model_download_user_model_date_idx").on(table.userId, table.modelId, table.downloadedAt),
}));

// Add column to model table (denormalized counter for fast reads)
// model.totalDownloads: integer("total_downloads").default(0).notNull()
```

**Note:** We maintain a denormalized `totalDownloads` counter on the `model` table for fast reads (avoiding COUNT queries on every model listing). The `model_download` table provides the detailed history and analytics.

---

## 4. Compare Amélioré

**Priority: P2** — Basic compare exists. This spec covers enhancements for a richer comparison experience.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 4.1 | Visitor | View a dynamic side-by-side comparison of any two models | I can make informed decisions |
| 4.2 | Visitor | See visual benchmark charts | I can quickly understand performance differences |
| 4.3 | Visitor | Discover related comparisons | I can explore other relevant pairings |
| 4.4 | Visitor | Share a comparison via URL | I can send it to others |
| 4.5 | Visitor | Navigate from a model page to comparisons involving it | I can discover how it stacks up |

### Acceptance Criteria

#### 4.1 Dynamic Compare Page (`/compare/[a]/vs/[b]`)
- [ ] Accepts any two model slugs as dynamic route params
- [ ] Validates both slugs exist; shows 404 or "Model not found" for invalid slugs
- [ ] Canonical URL: alphabetical order (redirect `/compare/gpt-4/vs/llama-3` → `/compare/gpt-4/vs/llama-3` if already ordered, else swap)
- [ ] Page title: "[Model A] vs [Model B] — Comparison | LLM Trust"
- [ ] OG image: auto-generated comparison card (model A on left, B on right)
- [ ] JSON-LD structured data for comparison

#### 4.2 Side-by-Side Comparison Table
- [ ] Two-column layout: Model A | Model B
- [ ] Comparison rows:
  - **Basic Info:** Name, Publisher, Release Date, License, Category
  - **Architecture:** Parameters, Context Window, Architecture Type, Quantization options
  - **Performance:** MMLU, HumanEval, HellaSwag, ARC, TruthfulQA (if available)
  - **Community:** Rating (avg), Review Count, Likes, Downloads
  - **Pricing:** Free/Paid, API Cost per 1M tokens (if available)
- [ ] Visual indicators: green highlight for better value, red for worse (where applicable)
- [ ] "Winner" badge per row when one model clearly leads
- [ ] "N/A" display for missing data (not blank)
- [ ] Sticky header with model names visible while scrolling

#### 4.3 Benchmark Visualizations
- [ ] Radar chart comparing key benchmarks (MMLU, HumanEval, HellaSwag, ARC, TruthfulQA)
- [ ] Bar chart for parameter count comparison
- [ ] Bar chart for context window comparison
- [ ] Color-coded: Model A = primary brand color, Model B = secondary color
- [ ] Responsive: charts resize for mobile
- [ ] Hover tooltips on chart data points showing exact values
- [ ] Fallback: if no benchmark data available for either model, show "No benchmark data" message instead of empty charts

#### 4.4 Related Comparisons
- [ ] "Related Comparisons" section at bottom of page
- [ ] Show up to 4 related comparison cards
- [ ] Relevance logic: same category models, same parameter range, or popular comparisons
- [ ] Each card: Model A name vs Model B name, avg ratings, "View Comparison →" link
- [ ] If neither model has related comparisons: show "Popular Comparisons" fallback

#### 4.5 Navigation & Discovery
- [ ] On `/models/[slug]`: "Compare with..." section showing quick links to compare with top models in same category
- [ ] Compare page has "Swap models" button (A ↔ B) that reloads with swapped URL
- [ ] Search/autocomplete on compare page to change one of the models
- [ ] Breadcrumb: Compare > [Model A] vs [Model B]

#### 4.6 SEO Static Pages
- [ ] Keep existing static comparison pages for high-value pairs
- [ ] Add `<link rel="canonical">` on dynamic pages pointing to canonical (alphabetical) URL
- [ ] Sitemap includes all comparison pages (static + top dynamic pairs)

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/compare/[a]/vs/[b]` | `CompareDynamicPage` | Main comparison page |
| `/compare` (update) | `CompareIndexPage` | Add search + popular comparisons |
| `/models/[slug]` (update) | `ModelDetailPage` | Add "Compare with" section |
| `src/components/compare/ComparisonTable.tsx` | Side-by-side data table |
| `src/components/compare/BenchmarkRadar.tsx` | Radar chart (Recharts/Chart.js) |
| `src/components/compare/BenchmarkBar.tsx` | Bar chart for specific metrics |
| `src/components/compare/RelatedComparisons.tsx` | Related comparison cards |
| `src/components/compare/ModelSwapButton.tsx` | Swap A ↔ B |
| `src/components/compare/CompareSearch.tsx` | Model search/autocomplete |
| `src/lib/compare.ts` | Comparison data fetching, ranking logic |

### DB Schema Changes

```typescript
// Optional: cache popular comparisons for performance
comparison_cache = pgTable("comparison_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelASlug: varchar("model_a_slug", { length: 255 }).notNull(),
  modelBSlug: varchar("model_b_slug", { length: 255 }).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  lastViewedAt: timestamp("last_viewed_at"),
}, (table) => ({
  pairIdx: unique("comparison_cache_pair_idx").on(table.modelASlug, table.modelBSlug),
  viewsIdx: index("comparison_cache_views_idx").on(table.viewCount),
}));

// Tracking comparison views (analytics)
comparison_view = pgTable("comparison_view", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelASlug: varchar("model_a_slug", { length: 255 }).notNull(),
  modelBSlug: varchar("model_b_slug", { length: 255 }).notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
});
```

**Note:** The comparison data itself comes from the existing `model` table — no new model fields needed. The tables above are for analytics and caching only. Can be added in a later phase if needed.

---

## Summary: Priority & Effort

| Feature | Priority | Estimated Effort | Dependencies |
|---------|----------|-----------------|--------------|
| Blog (MDX) | **P1** | 3-4 days | None |
| Gamification UI | **P1** | 4-5 days | Gamification backend (GAMIFICATION.md) |
| Model Download (Web) | **P1** | 2-3 days | None |
| Compare Amélioré | **P2** | 3-4 days | Chart library (Recharts) |

**Recommended Sprint Order:**
1. **Sprint A:** Model Download (small, high value) + Blog (content marketing)
2. **Sprint B:** Gamification UI (depends on backend)
3. **Sprint C:** Compare Amélioré (enhancement, P2)

---

*Specs written by Atlas — Head of Product, CroissantLabs 🥐*
