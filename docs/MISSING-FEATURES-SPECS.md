# Missing Features — Detailed Specs

**Author:** Atlas, Head of Product (CroissantLabs)
**Date:** 2026-03-13
**V2 — Aligned with Infrastructure + Trust + Convenience business model**
**Status:** Ready for estimation & sprint planning

---

## Table of Contents

1. [Cloud Inference (Core Monetization)](#1-cloud-inference-core-monetization)
2. [API Management & Keys](#2-api-management--keys)
3. [Advanced Benchmarks & Analytics](#3-advanced-benchmarks--analytics)
4. [New Model Alerts System](#4-new-model-alerts-system)
5. [Blog Complet (MDX)](#5-blog-complet-mdx)
6. [Gamification UI](#6-gamification-ui)
7. [Model Download (Web)](#7-model-download-web)
8. [Compare Amélioré](#8-compare-amélioré)

---

## 1. Cloud Inference (Core Monetization)

**Priority: P0** — This is THE paid feature. The #1 reason users upgrade to Pro. Without this, we have no revenue.

### Context
Models are free on HuggingFace. We don't sell models — we sell **compute infrastructure**. Cloud inference lets users run any model without needing a local GPU. This is our core value proposition for Pro and Team tiers.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 1.1 | Pro user | Run a model in the browser without installing anything | I can test models immediately |
| 1.2 | Pro user | See my token usage in real-time | I know how much of my monthly quota I've used |
| 1.3 | Pro user | Get a warning when approaching my inference quota | I can plan my usage or upgrade |
| 1.4 | Free user | See a "Run in Cloud" CTA that leads to upgrade | I understand what Pro offers |
| 1.5 | Team user | Pool inference tokens across my team | My team shares the compute budget |
| 1.6 | Developer | Send inference requests via API | I can integrate cloud inference into my apps |

### Acceptance Criteria

#### 1.1 Model Playground (`/models/[slug]/playground`)
- [ ] New tab on model detail page: "Playground"
- [ ] Text input area for prompts (multi-line, resizable)
- [ ] Model parameters sidebar: temperature, max tokens, top_p, stop sequences
- [ ] "Run" button that sends inference request to cloud backend
- [ ] Response displayed in real-time (streaming via SSE)
- [ ] Loading state with estimated time
- [ ] Token count displayed: input tokens, output tokens, total
- [ ] Copy response button
- [ ] History panel: last 10 prompts in current session
- [ ] Error handling: model unavailable, quota exceeded, timeout (30s)
- [ ] **Free tier gate:** Show "Upgrade to Pro to run models in cloud" with CTA
- [ ] **Pro tier:** Works with quota tracking
- [ ] **Team tier:** Works with pooled quota

#### 1.2 Quota Display
- [ ] Persistent quota bar in dashboard header: "234,500 / 500,000 tokens used"
- [ ] Progress bar with color coding: green (< 50%), yellow (50-80%), red (> 80%)
- [ ] Tooltip: "Resets on [date]" with billing cycle info
- [ ] At 80%: in-app banner "You've used 80% of your inference quota"
- [ ] At 100%: playground disabled, "Quota exceeded — upgrade or wait for reset"

#### 1.3 Cloud Inference API (`POST /api/inference`)
- [ ] Endpoint: `POST /api/inference`
- [ ] Auth: Bearer token (API key)
- [ ] Request body: `{ model: string, prompt: string, parameters?: object }`
- [ ] Response: `{ output: string, usage: { inputTokens, outputTokens, totalTokens } }`
- [ ] Streaming: SSE support for real-time output
- [ ] Rate limiting: 100 req/min for Pro, 500 req/min for Team
- [ ] Quota enforcement: reject with 429 when monthly token quota exceeded
- [ ] Error codes: 401 (unauthorized), 402 (quota exceeded), 404 (model not found), 429 (rate limited), 503 (model loading)

#### 1.4 Infrastructure Requirements
- [ ] GPU cloud provider integration (Modal, RunPod, or similar)
- [ ] Model loading queue: load models on-demand, cache hot models
- [ ] Cold start handling: show "Model loading..." with ETA
- [ ] Auto-scaling: scale GPU instances based on demand
- [ ] Cost monitoring: track GPU cost per user, ensure margin targets
- [ ] Model availability SLA: 95%+ uptime for popular models

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/models/[slug]/playground` | `InferencePlayground` | Main inference UI |
| `/dashboard` (update) | `QuotaCard` | Token usage + remaining |
| `/api/inference` | API endpoint | Cloud inference handler |
| `src/components/inference/PromptInput.tsx` | Text input with params |
| `src/components/inference/ResponseStream.tsx` | Streaming output display |
| `src/components/inference/QuotaBar.tsx` | Usage progress bar |
| `src/components/inference/ModelParams.tsx` | Parameter controls |
| `src/components/inference/InferenceHistory.tsx` | Session history |
| `src/server/services/inference.ts` | Inference orchestration service |
| `src/server/services/gpu-cloud.ts` | GPU provider integration |

### DB Schema Changes

```typescript
// Inference session tracking
inference_session = pgTable("inference_session", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  modelSlug: varchar("model_slug", { length: 255 }).notNull(),
  // Request
  prompt: text("prompt").notNull(),
  parameters: jsonb("parameters").$type<{
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stopSequences?: string[];
  }>(),
  // Response
  output: text("output"),
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  totalTokens: integer("total_tokens").default(0),
  // Status
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // pending | running | completed | failed | timeout
  errorMessage: text("error_message"),
  latencyMs: integer("latency_ms"),
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("inference_user_idx").on(table.userId),
  index("inference_model_idx").on(table.modelSlug),
  index("inference_created_idx").on(table.createdAt),
  index("inference_status_idx").on(table.status),
]);

// Monthly inference quota tracking (denormalized for fast reads)
user_inference_quota = pgTable("user_inference_quota", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id).unique(),
  tokensUsed: integer("tokens_used").notNull().default(0),
  tokensLimit: integer("tokens_limit").notNull().default(0),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (table) => [
  index("quota_user_idx").on(table.userId),
  index("quota_period_idx").on(table.periodStart, table.periodEnd),
]);
```

### Revenue Impact
- **Core monetization lever** — this is what makes Pro worth $19/mo
- Target: 500K tokens/month for Pro (enough for regular testing, not enough for production — drives overage or upgrade)
- Target: 2M tokens/month for Team (pooled, enough for team workflows)
- Overage pricing post-MVP: $0.0002/token

---

## 2. API Management & Keys

**Priority: P0** — API access is a key value prop for Pro ($19/mo = unlimited API). Must have clean key management.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 2.1 | Pro user | Generate API keys from my dashboard | I can use the API programmatically |
| 2.2 | Pro user | See my API usage stats | I can monitor my integration |
| 2.3 | Pro user | Revoke compromised keys | I can secure my account |
| 2.4 | Team admin | Create team API keys with per-seat limits | I can control team API spend |
| 2.5 | Developer | Read API documentation with code examples | I can integrate quickly |

### Acceptance Criteria

#### 2.1 API Key Management (`/dashboard/api-keys`)
- [ ] "Generate New Key" button
- [ ] Key name (user-provided, e.g., "My App Dev", "Production")
- [ ] Key displayed ONCE after creation (copy to clipboard)
- [ ] Key format: `llmtr_live_xxxxxxxxxxxxxxxxxxxx`
- [ ] List of existing keys: name, prefix (first 8 chars), created date, last used, status (active/revoked)
- [ ] Revoke key with confirmation dialog
- [ ] Maximum 5 active keys per user (Pro), 20 per team
- [ ] Key scopes (future): read-only, inference-only, full-access

#### 2.2 Rate Limiting by Tier

| Tier | API Rate Limit | Daily Limit |
|------|---------------|-------------|
| Free | 10 req/min | 100/day |
| Pro | 100 req/min | Unlimited (fair use) |
| Team | 500 req/min | Unlimited (fair use) |

- [ ] Rate limit headers on every API response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] 429 response when rate limited, with `Retry-After` header
- [ ] Free tier: daily counter resets at midnight UTC

#### 2.3 API Usage Dashboard
- [ ] Usage graph: API calls per day (last 30 days)
- [ ] Breakdown by endpoint
- [ ] Breakdown by API key
- [ ] Error rate chart
- [ ] Average latency chart
- [ ] Export usage data (CSV)

#### 2.4 API Documentation (`/docs/api`)
- [ ] OpenAPI/Swagger spec published
- [ ] Interactive API explorer (Swagger UI or similar)
- [ ] Code examples in Python, JavaScript, cURL
- [ ] Authentication guide
- [ ] Rate limiting guide
- [ ] Error codes reference
- [ ] Changelog / versioning

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard/api-keys` | `ApiKeyManagement` | Key CRUD |
| `/dashboard/api-usage` | `ApiUsageDashboard` | Usage stats |
| `/docs/api` | `ApiDocumentation` | API reference |
| `src/components/api/ApiKeyList.tsx` | Key list with actions |
| `src/components/api/GenerateKeyModal.tsx` | Key creation modal |
| `src/components/api/UsageChart.tsx` | Usage visualization |
| `src/server/api/middleware/api-key.ts` | API key auth middleware |
| `src/server/api/routers/api-keys.ts` | Key management router |

### DB Schema Changes

```typescript
api_key = pgTable("api_key", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  name: varchar("name", { length: 100 }).notNull(),
  keyHash: text("key_hash").notNull().unique(), // bcrypt hash
  keyPrefix: varchar("key_prefix", { length: 12 }).notNull(), // first 8 chars for display
  scopes: jsonb("scopes").$type<string[]>().default(["full"]),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  revokedAt: timestamp("revoked_at"),
}, (table) => [
  index("api_key_user_idx").on(table.userId),
  index("api_key_hash_idx").on(table.keyHash),
  index("api_key_prefix_idx").on(table.keyPrefix),
]);
```

---

## 3. Advanced Benchmarks & Analytics

**Priority: P1** — Key differentiator. Trust through data. This is what makes LLM Trust the go-to for model evaluation.

### Context
Free users see top 5 benchmarks per model. Pro users get the full picture: historical trends, detailed scoring breakdowns, custom comparisons, and analytics that help them make data-driven model selection decisions.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 3.1 | Pro user | See full benchmark suite for each model (20+ benchmarks) | I get complete performance picture |
| 3.2 | Pro user | View benchmark trends over time | I can see if models are improving |
| 3.3 | Pro user | Create custom benchmark comparisons | I can compare models on metrics I care about |
| 3.4 | Pro user | Export benchmark data | I can use it in my own analysis |
| 3.5 | Free user | See that advanced benchmarks exist but are gated | I understand Pro value |

### Acceptance Criteria

#### 3.1 Full Benchmark Display (Pro feature)
- [ ] Model detail page shows ALL available benchmarks (not just top 5)
- [ ] Benchmarks grouped by category: Reasoning, Coding, Math, Knowledge, Safety, Multilingual
- [ ] Each benchmark: score, percentile rank, test date, source link
- [ ] Comparison to category average shown inline
- [ ] **Free tier:** Show top 5 benchmarks with "🔒 Unlock 15+ more benchmarks — Pro" CTA
- [ ] **Pro/Team:** Full access

#### 3.2 Benchmark Trends (`/models/[slug]/benchmarks`)
- [ ] Historical benchmark scores plotted over time (line chart)
- [ ] Model version markers on timeline
- [ ] Zoom/pan on timeline
- [ ] Select specific benchmarks to track
- [ ] Compare with competitor models on same chart
- [ ] Data export: CSV, JSON

#### 3.3 Custom Comparison Builder (`/benchmarks/compare`)
- [ ] Select 2-5 models to compare
- [ ] Select which benchmarks to include
- [ ] Radar chart visualization
- [ ] Table view with sortable columns
- [ ] "Save comparison" to user's dashboard
- [ ] Share comparison via URL
- [ ] Embed widget code (for blogs/docs)

#### 3.4 Analytics Dashboard (`/dashboard/analytics`)
- [ ] Overview: models viewed, compared, run in cloud (last 30 days)
- [ ] Personal benchmark tracking: models I've tested, their scores
- [ ] Trending models: most viewed/compared this week
- [ ] Category insights: "Top coding models this month"
- [ ] Export all analytics data

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/models/[slug]/benchmarks` | `BenchmarkDetail` | Full benchmark suite |
| `/benchmarks/compare` | `BenchmarkCompare` | Custom comparison builder |
| `/dashboard/analytics` | `AnalyticsDashboard` | User analytics |
| `src/components/benchmarks/BenchmarkTable.tsx` | Full benchmark table |
| `src/components/benchmarks/BenchmarkTrend.tsx` | Historical trend chart |
| `src/components/benchmarks/RadarCompare.tsx` | Radar comparison chart |
| `src/components/benchmarks/BenchmarkGate.tsx` | Free/Pro gating UI |

### Tier Gating

| Benchmark Feature | Free | Pro | Team |
|-------------------|------|-----|------|
| Top 5 benchmarks per model | ✅ | ✅ | ✅ |
| Full benchmark suite (20+) | ❌ | ✅ | ✅ |
| Historical trends | ❌ | ✅ | ✅ |
| Custom comparisons | ❌ | ✅ | ✅ |
| Data export | ❌ | ✅ | ✅ |
| Analytics dashboard | Basic | Advanced | Advanced+ |

---

## 4. New Model Alerts System

**Priority: P1** — Convenience feature. Users want to know when new models drop in their area of interest. Drives engagement and retention.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 4.1 | Pro user | Get notified when new models are added | I stay up to date automatically |
| 4.2 | Pro user | Configure alert preferences (categories, size, etc.) | I only get relevant alerts |
| 4.3 | Pro user | Receive alerts via email and/or in-app | I choose my preferred channel |
| 4.4 | Free user | See "Get alerts for new models" upsell | I understand Pro value |

### Acceptance Criteria

#### 4.1 Alert Configuration (`/dashboard/alerts`)
- [ ] Enable/disable alerts toggle
- [ ] Category filters: Coding, Chat, Vision, Embedding, Multilingual, etc.
- [ ] Parameter filters: min/max parameter count, license type
- [ ] Notification channels: email, in-app, both
- [ ] Frequency: immediate, daily digest, weekly digest
- [ ] **Free tier:** Show "🔔 Get alerts when new models drop — Pro" CTA

#### 4.2 Alert Delivery
- [ ] **Email:** Beautiful template with model name, category, key benchmarks, link to model page
- [ ] **In-app:** Notification bell with unread count, notification list in `/notifications`
- [ ] Batch alerts: if multiple models in same category, group in one notification
- [ ] Unsubscribe link in every email

#### 4.3 Alert Triggers
- [ ] New model added to database → check all Pro/Team users' preferences → send alerts
- [ ] Model updated with new version → alert users who favorited that model
- [ ] Model reaches benchmark threshold → alert users tracking that benchmark

### Pages & Components

| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard/alerts` | `AlertPreferences` | Alert configuration |
| `/notifications` (update) | `NotificationList` | Alert history |
| `src/components/alerts/AlertConfig.tsx` | Preference form |
| `src/components/alerts/AlertCard.tsx` | Individual alert display |
| `src/server/services/alerts.ts` | Alert dispatch service |

### DB Schema Changes

```typescript
user_alert_preference = pgTable("user_alert_preference", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id).unique(),
  enabled: boolean("enabled").notNull().default(true),
  categories: jsonb("categories").$type<string[]>().default([]),
  minParams: varchar("min_params", { length: 20 }),
  maxParams: varchar("max_params", { length: 20 }),
  licenses: jsonb("licenses").$type<string[]>().default([]),
  channels: jsonb("channels").$type<("email" | "in_app")[]>().default(["email", "in_app"]),
  frequency: varchar("frequency", { length: 20 }).notNull().default("immediate"),
  // immediate | daily | weekly
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

notification = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  type: varchar("type", { length: 50 }).notNull(),
  // new_model | model_update | benchmark_alert | badge_earned | level_up | billing | system
  title: text("title").notNull(),
  body: text("body"),
  link: text("link"),
  metadata: jsonb("metadata"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("notification_user_idx").on(table.userId),
  index("notification_type_idx").on(table.type),
  index("notification_read_idx").on(table.readAt),
  index("notification_created_idx").on(table.createdAt),
]);
```

---

## 5. Blog Complet (MDX)

**Priority: P1** — Content marketing is a key SEO and acquisition lever.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 5.1 | Visitor | Browse blog posts with pagination | I can discover articles |
| 5.2 | Visitor | Read articles with table of contents | I can navigate long-form content |
| 5.3 | Visitor | Filter posts by category | I can find relevant content |
| 5.4 | Visitor | Search blog posts | I can find specific topics |
| 5.5 | Admin/Author | Write posts in MDX | I can use rich components in articles |

### Acceptance Criteria

#### Blog Listing (`/blog`)
- [ ] Paginated list (10 per page) with prev/next
- [ ] Cards: cover image, title, excerpt, category badge, reading time, date
- [ ] Category filter tabs
- [ ] Search bar (client-side, debounced 200ms)

#### Article Page (`/blog/[slug]`)
- [ ] Full MDX rendering with custom components
- [ ] Auto-generated TOC (sticky sidebar on desktop)
- [ ] Reading progress bar
- [ ] Author card, related posts, social share buttons
- [ ] SEO: structured data, OG image from frontmatter

#### MDX Content Pipeline
- [ ] Posts as `.mdx` files in `/content/blog/`
- [ ] Required frontmatter: `title`, `slug`, `date`, `category`, `excerpt`, `coverImage`
- [ ] Custom components: `<Callout>`, `<CodeBlock>`, `<ModelCard>`, `<ComparePreview>`

### Pages & Components

| Path | Component |
|------|-----------|
| `/blog` | `BlogListingPage` |
| `/blog/[slug]` | `BlogPostPage` |
| `/blog/category/[category]` | `BlogCategoryPage` |
| `src/components/blog/PostCard.tsx` | Post card |
| `src/components/blog/TableOfContents.tsx` | TOC sidebar |
| `src/components/blog/ReadingProgress.tsx` | Progress bar |
| `src/components/blog/BlogSearch.tsx` | Search input |
| `src/components/blog/RelatedPosts.tsx` | Related articles |
| `src/components/blog/ShareButtons.tsx` | Social sharing |
| `src/lib/blog.ts` | MDX parsing + frontmatter |

---

## 6. Gamification UI

**Priority: P1** — Backend schema exists. This spec covers the frontend to surface gamification.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 6.1 | User | See my badges on my profile | I can showcase contributions |
| 6.2 | User | View a leaderboard | I can see how I rank |
| 6.3 | User | See my points and level in dashboard | I can track progress |
| 6.4 | User | Get notified when I earn a badge | I feel rewarded |

### Acceptance Criteria

#### Badge Display (`/profile/[username]`)
- [ ] Grid of earned badges (icon + name), sorted by tier
- [ ] Hover tooltip: badge name, description, tier, date
- [ ] "New" badge glow (< 48h)
- [ ] Locked badges as greyed silhouettes with progress hint

#### Leaderboard (`/community/leaderboard`)
- [ ] Ranked table: position, avatar, username, level, points, badges
- [ ] Top 3 medal styling
- [ ] Time filters: All Time, This Month, This Week
- [ ] Current user highlighted if not in visible entries

#### Dashboard Integration
- [ ] Points + level card with progress bar
- [ ] Recent points activity (last 5 transactions)
- [ ] Last 4 earned badges with "View all" link

#### Notifications
- [ ] Toast on badge earned / level up
- [ ] Persisted in `/notifications` page

### Pages & Components

| Path | Component |
|------|-----------|
| `/community` | `CommunityPage` |
| `/community/leaderboard` | `LeaderboardPage` |
| `/profile/[username]` (update) | Badge grid section |
| `src/components/gamification/BadgeGrid.tsx` | Badge display |
| `src/components/gamification/BadgeCard.tsx` | Individual badge |
| `src/components/gamification/LevelProgress.tsx` | Points + level bar |
| `src/components/gamification/LeaderboardTable.tsx` | Ranked table |
| `src/components/gamification/PointsActivity.tsx` | Recent activity |

---

## 7. Model Download (Web)

**Priority: P1** — Models have `downloadUrl` but web UI doesn't expose download or tracking.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 7.1 | Visitor | Click download on model page | I get the model from source |
| 7.2 | Visitor | See download count | I gauge popularity |
| 7.3 | User | See my download history | I find previously downloaded models |

### Acceptance Criteria

#### Download Button (`/models/[slug]`)
- [ ] Prominent "Download" button
- [ ] Source icon (HuggingFace, GitHub, generic) based on URL domain
- [ ] Click opens `downloadUrl` in new tab (external redirect)
- [ ] Before redirect: fire-and-forget download counter increment
- [ ] "Copy Link" button next to download

#### Download Counter
- [ ] Display on model detail + model cards
- [ ] Formatted: "1.2K downloads"
- [ ] Sort by "Most Downloaded" option in listings

#### Download History (`/dashboard/downloads`)
- [ ] Chronological list: model name, date, source URL
- [ ] Pagination (20 per page)
- [ ] Empty state with "Browse models →" CTA

### DB Schema Changes

```typescript
model_download = pgTable("model_download", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelId: uuid("model_id").notNull().references(() => model.id),
  userId: text("user_id").references(() => user.id),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
  referrer: varchar("referrer", { length: 512 }),
}, (table) => [
  index("model_download_model_idx").on(table.modelId),
  index("model_download_user_idx").on(table.userId),
]);
```

---

## 8. Compare Amélioré

**Priority: P2** — Enhancement to existing compare feature.

### User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 8.1 | Visitor | Dynamic side-by-side comparison of any two models | I make informed decisions |
| 8.2 | Visitor | Visual benchmark charts | I quickly understand differences |
| 8.3 | Visitor | Share comparisons via URL | I can send to others |

### Acceptance Criteria

#### Dynamic Compare (`/compare/[a]/vs/[b]`)
- [ ] Any two model slugs as dynamic params
- [ ] Canonical URL: alphabetical order
- [ ] OG image: auto-generated comparison card
- [ ] JSON-LD structured data

#### Comparison Table
- [ ] Two-column: Model A | Model B
- [ ] Rows: Basic Info, Architecture, Performance, Community, Pricing
- [ ] Green/red highlight for better/worse values
- [ ] "Winner" badge per row
- [ ] Sticky header while scrolling

#### Benchmark Visualizations
- [ ] Radar chart (key benchmarks)
- [ ] Bar charts (parameters, context window)
- [ ] Responsive, hover tooltips

#### Related Comparisons
- [ ] "Related Comparisons" section (up to 4 cards)
- [ ] Relevance: same category, similar parameter range

### DB Schema (Optional, Post-MVP)

```typescript
comparison_cache = pgTable("comparison_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelASlug: varchar("model_a_slug", { length: 255 }).notNull(),
  modelBSlug: varchar("model_b_slug", { length: 255 }).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
}, (table) => ({
  pairIdx: unique("comparison_cache_pair_idx").on(table.modelASlug, table.modelBSlug),
}));
```

---

## Summary: Priority & Effort

| Feature | Priority | Effort | Tier Alignment | Revenue Impact |
|---------|----------|--------|---------------|----------------|
| **Cloud Inference** | **P0** | 5-7 days | Pro, Team | 🔴 Core revenue |
| **API Management** | **P0** | 3-4 days | Pro, Team | 🟡 Enabling feature |
| **Advanced Benchmarks** | **P1** | 3-4 days | Pro, Team | 🟡 Value justification |
| **Model Alerts** | **P1** | 2-3 days | Pro, Team | 🟢 Retention |
| **Blog (MDX)** | **P1** | 3-4 days | All (SEO) | 🟢 Acquisition |
| **Gamification UI** | **P1** | 4-5 days | All | 🟢 Engagement |
| **Model Download** | **P1** | 2-3 days | All | 🟢 Utility |
| **Compare Amélioré** | **P2** | 3-4 days | All | 🟢 Differentiation |

### Recommended Sprint Order

1. **Sprint 1 (P0):** Cloud Inference MVP + API Key Management — **this IS the product**
2. **Sprint 2 (P1):** Advanced Benchmarks + Model Alerts — **justify Pro price**
3. **Sprint 3 (P1):** Blog + Model Download — **acquisition & utility**
4. **Sprint 4 (P1-P2):** Gamification UI + Compare Enhancement — **engagement**

### Key Principle
> We don't sell models (they're free). We sell **the ability to run them** (cloud inference), **the data to choose them** (benchmarks), and **the tools to manage them** (API, alerts, workspaces). Infrastructure + Trust + Convenience.

---

*Specs written by Atlas — Head of Product, CroissantLabs 🥐*
