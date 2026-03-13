# LLM Trust — Monetization Specs

> **Author:** Atlas (Head of Product)
> **Date:** 2026-03-13
> **Status:** V2 — Revised Business Model (Infrastructure + Trust + Convenience)

---

## Table of Contents

1. [Strategic Pivot](#1-strategic-pivot)
2. [Pricing Tiers](#2-pricing-tiers)
3. [Value Proposition by Tier](#3-value-proposition-by-tier)
4. [Stripe Integration Architecture](#4-stripe-integration-architecture)
5. [Conversion Funnel](#5-conversion-funnel)
6. [Database Schema — Drizzle](#6-database-schema--drizzle)
7. [Implementation Roadmap](#7-implementation-roadmap)

---

## 1. Strategic Pivot

### 1.1 Why We Changed

**Old model (rejected):** Charge for model downloads. ❌
**Problem:** Models are open-source and free on HuggingFace. You cannot charge for what is free elsewhere. This creates zero value and 100% friction.

**New model:** We don't sell models. We sell **infrastructure, trust, and convenience** around models.

### 1.2 What LLM Trust Actually Sells

| Value Layer | What it means | Who pays |
|-------------|---------------|----------|
| **Trust** | Curated benchmarks, verified reviews, community signal — helping you pick the *right* model | Everyone (free) gets basic; Pro gets advanced |
| **Convenience** | One place to browse, compare, discover — no juggling HuggingFace, Papers With Code, Reddit | Everyone (free) |
| **Infrastructure** | Run models in the cloud without a GPU — we provide the compute | Pro & Team (core revenue) |
| **Collaboration** | Shared workspaces, admin tools, SSO — for teams that need governance | Team |

### 1.3 Competitive Positioning

| Competitor | What they sell | LLM Trust advantage |
|-----------|---------------|---------------------|
| HuggingFace | Hosting + community | We provide better curation, benchmarks, and cloud inference without HF's complexity |
| Replicate | Pay-per-inference | We offer predictable subscription pricing + discovery layer |
| OpenRouter | API routing | We add trust layer (reviews, benchmarks) on top of API access |
| Together.ai | Cloud inference | We combine inference with discovery + community trust |

**LLM Trust = Discovery + Trust + Inference in one place.**

---

## 2. Pricing Tiers

### 2.1 Free — $0/mo (Acquisition & Trust Building)

| Feature | Limit | Rationale |
|---------|-------|-----------|
| Browse & search models | ✅ Unlimited | Core discovery — drives traffic |
| Compare models (side-by-side) | ✅ Unlimited | Trust through transparency |
| Download models (HuggingFace links) | ✅ Unlimited | We redirect to source — no markup |
| Community reviews (read + write) | ✅ Unlimited | Trust layer — community signal |
| Favorites & collections | ✅ Unlimited | Personalization — retention |
| Basic API access | 100 calls/day | Teaser for developers — show value |
| Basic benchmarks view | ✅ Top 5 benchmarks | Build trust — show we're legit |
| Dashboard (basic stats) | ✅ Yes | Engagement |
| Cloud inference | ❌ | Core paid feature |
| Advanced benchmarks & analytics | ❌ | Paid feature |
| Priority support | ❌ | Community only |
| Alerts (new models) | ❌ | Paid feature |
| Shared workspaces | ❌ | Team feature |
| SSO | ❌ | Team feature |

**Purpose:** Acquisition funnel. Frictionless entry. Build trust through transparency. Let developers experience the platform. Convert through infrastructure (cloud inference) and advanced features.

---

### 2.2 Pro — $19/mo ($190/yr — save $38, ~2 months free)

| Feature | Limit | Rationale |
|---------|-------|-----------|
| Everything in Free | ✅ | Base layer |
| **Cloud inference** | 500K tokens/month | **Core value prop** — run models without local GPU |
| **Unlimited API access** | ✅ No daily cap | Power users & automation |
| **Advanced benchmarks & analytics** | ✅ Full benchmark suite, historical trends, model scoring | Trust through data |
| **Priority support** | 24h response SLA | Convenience |
| **Alerts — new models** | ✅ Email + in-app notifications | Stay ahead — convenience |
| **Export data** | CSV, JSON, API | Integration — convenience |
| Custom model lists | ✅ | Personalization |
| Ads-free experience | ✅ | Quality |

**Overage pricing (Post-MVP):**
- Cloud inference: $0.0002/token beyond 500K
- API calls beyond "unlimited" fair use: rate-limited at 1000/min (hard cap for abuse prevention)

**Target user:** Individual developers, ML researchers, power users, indie hackers.

---

### 2.3 Team — $49/mo ($490/yr — save $98, ~2 months free)

| Feature | Limit | Rationale |
|---------|-------|-----------|
| Everything in Pro | ✅ | Base layer |
| **Seats** | 5 included ($10/extra seat) | Collaboration |
| **Shared workspaces** | ✅ Teams can curate model lists, share benchmarks | Collaboration value |
| **Admin dashboard** | User management, usage per seat, spend tracking | Governance |
| **SSO (SAML/OIDC)** | ✅ | Enterprise readiness |
| **API management** | Team API keys, rate limits per seat, usage analytics | Operational control |
| **Cloud inference** | 2M tokens/month (pooled across team) | Infrastructure value |
| **SLA** | 99.9% uptime guarantee | Reliability |
| **Dedicated support** | Slack channel, 4h response | Premium convenience |
| **Audit logs** | ✅ | Compliance |
| **Custom integrations** | API webhooks | Extensibility |
| Volume discounts | Available for 50+ seats | Enterprise pipeline |

**Target user:** Startups, ML teams, agencies, small companies.

---

### 2.4 Enterprise — Custom Pricing (Post-MVP — Q3 2026)

| Feature | Detail |
|---------|--------|
| Unlimited seats | Custom pricing |
| On-premise deployment | Self-hosted option |
| Custom SLA | 99.95%+ |
| Dedicated account manager | ✅ |
| Custom contracts & invoicing | ✅ |
| SOC2 / compliance reports | ✅ |
| Custom API rate limits | ✅ |
| Private model registry | Internal models + HF models |
| Model fine-tuning pipeline | ✅ |
| Custom benchmark suite | Run your own evals |

---

### 2.5 Pricing Comparison Matrix

```
Feature                  Free       Pro ($19)     Team ($49)     Enterprise
──────────────────────────────────────────────────────────────────────────────
Browse & Compare          ∞          ∞             ∞              ∞
Community Reviews         ∞          ∞             ∞              ∞
Downloads (HF links)      ✅         ✅            ✅             ✅
API Access                100/day    Unlimited     Unlimited      Custom
Cloud Inference           ❌         500K tok/mo   2M tok/mo      Custom
Benchmarks & Analytics    Basic      Advanced      Advanced+      Custom
New Model Alerts          ❌         ✅            ✅             ✅
Support                   Community  24h SLA       4h SLA         Dedicated
Seats                     1          1             5              Unlimited
Shared Workspaces         ❌         ❌            ✅             ✅
SSO                       ❌         ❌            ✅             ✅
API Management            ❌         ❌            ✅             ✅
SLA                       ❌         ❌            99.9%          99.95%+
Audit Logs                ❌         ❌            ✅             ✅
──────────────────────────────────────────────────────────────────────────────
Monthly Price             $0         $19           $49            Custom
Annual Price              $0         $190          $490           Custom
```

---

## 3. Value Proposition by Tier

### 3.1 Free — "Discover & Trust"
**User promise:** "Find the best open-source model for your use case — free, forever."

- Browse 1000+ models with powerful search and filters
- Compare models side-by-side with real benchmark data
- Read community reviews from real users
- Download directly from HuggingFace (we add value through curation, not paywall)
- Basic API to test the waters

**Conversion trigger:** User hits API limit (100/day) OR wants to run a model without setting up local GPU.

### 3.2 Pro — "Run & Analyze"
**User promise:** "Run any model in the cloud. Get the data you need to make the right choice."

- **Cloud inference** is the hero feature — no GPU, no setup, just run models
- **Unlimited API** for building on top of LLM Trust
- **Advanced benchmarks** — historical trends, detailed scoring, custom comparisons
- **Alerts** — never miss a new model release in your domain

**Conversion trigger:** "I want to try this model NOW but don't have a GPU."

### 3.3 Team — "Collaborate & Govern"
**User promise:** "Your whole team on the same page, with the tools to manage AI model selection."

- **Shared workspaces** — curate model lists as a team
- **Admin dashboard** — see who's using what, control costs
- **SSO** — integrate with your identity provider
- **API management** — team keys, per-seat limits, usage visibility

**Conversion trigger:** "My team needs to coordinate model selection and control API spend."

---

## 4. Stripe Integration Architecture

### 4.1 Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend   │────▶│  tRPC Router │────▶│  PostgreSQL │
│  (Next.js)   │     │  (Billing)   │     │  (Drizzle)  │
└──────┬───────┘     └──────┬───────┘     └─────────────┘
       │                    │
       │ Checkout           │ Webhooks
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│   Stripe     │     │  Stripe      │
│   Checkout   │     │  Webhooks    │
│   Session    │     │  Endpoint    │
└─────────────┘     └──────────────┘
```

### 4.2 Stripe Products & Prices Setup

**Products to create in Stripe Dashboard:**

| Product Name | Price ID (Monthly) | Price ID (Annual) |
|-------------|-------------------|-------------------|
| LLM Trust Pro | price_pro_monthly_19 | price_pro_annual_190 |
| LLM Trust Team | price_team_monthly_49 | price_team_annual_490 |
| Extra Seat (Team) | price_extra_seat_10 | N/A (billed monthly) |

**Metadata on Stripe Products:**
```json
{
  "tier": "pro" | "team",
  "api_access": "unlimited",
  "inference_tokens": "500000" | "2000000",
  "seats_included": "1" | "5"
}
```

### 4.3 Stripe Webhooks

**Endpoint:** `POST /api/webhooks/stripe`

**Events to handle:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create subscription record, activate plan |
| `invoice.paid` | Record payment, extend subscription period |
| `invoice.payment_failed` | Notify user, retry logic, grace period (3 days) |
| `customer.subscription.updated` | Sync tier changes, update feature access |
| `customer.subscription.deleted` | Downgrade to Free, cleanup |
| `customer.subscription.trial_will_end` | Send reminder email (3 days before trial ends) |
| `payment_intent.succeeded` | Record one-time payment |
| `payment_intent.payment_failed` | Notify user |

**Webhook Security:**
- Verify `stripe-signature` header with `STRIPE_WEBHOOK_SECRET`
- Idempotency: check `event.id` against processed events log
- Return `200` within 30s or Stripe retries

### 4.4 Customer Portal

**URL:** `POST /api/billing/portal`

Stripe's hosted Customer Portal for self-service:
- View current plan & billing history
- Update payment method
- Download invoices
- Upgrade/downgrade plan
- Cancel subscription
- Reactivate cancelled subscription

### 4.5 Checkout Flow

**Upgrade to Pro:**
```
1. User clicks "Upgrade to Pro"
2. Frontend calls tRPC: billing.createCheckoutSession({ tier: "pro", interval: "monthly" })
3. Backend:
   a. If user.stripeCustomerId exists → use it, else create customer
   b. Create Stripe Checkout Session with:
      - price_id from env/config
      - mode: "subscription"
      - success_url: /dashboard/settings?upgraded=true
      - cancel_url: /pricing
      - metadata: { userId, tier }
   c. Return session URL
4. Frontend redirects to Stripe Checkout
5. User completes payment
6. Stripe redirects back to success_url
7. Webhook "checkout.session.completed" fires → activates subscription
```

**Downgrade/Cancel Flow:**
```
1. User clicks "Manage Plan" → opens Customer Portal
2. User selects "Cancel subscription"
3. Stripe sets cancel_at_period_end = true
4. User retains Pro access until billing period ends
5. Webhook "customer.subscription.deleted" fires → downgrade to Free
6. Send confirmation email
```

### 4.6 Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_TEAM_MONTHLY=price_...
STRIPE_PRICE_TEAM_ANNUAL=price_...
STRIPE_PRICE_EXTRA_SEAT=price_...
```

### 4.7 Grace Period & Failed Payments

- **Grace period:** 3 days after failed payment
- **During grace period:** Keep Pro features active, show banner "Payment failed — update payment method"
- **After grace period:** Downgrade to Free, preserve user data
- **Retry logic:** Stripe Smart Retries enabled (default)

---

## 5. Conversion Funnel

### 5.1 CTA Placement Map

```
┌──────────────────────────────────────────────────────────┐
│                      HOMEPAGE                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Hero CTA    │  │ Pricing      │  │ Social proof   │  │
│  │ "Start Free │  │ comparison   │  │ "Join 10K+     │  │
│  │  → Upgrade" │  │ section      │  │  developers"   │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│                      MODEL PAGES                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ "Run in     │  │ "API Access  │  │ Model detail   │  │
│  │  Cloud ⚡"   │  │  — Pro only" │  │ → benchmarks   │  │
│  │  (Pro gate) │  │  (upgrade)   │  │   (free/basic) │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│                      DASHBOARD                            │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ API usage   │  │ "Unlock      │  │ Settings →     │  │
│  │ bar (100/d) │  │  unlimited"  │  │ Billing page   │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│                      DOCS / API                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ API docs    │  │ "Get API Key │  │ Cloud inference│  │
│  │ "100/day    │  │  — Upgrade"  │  │ quickstart     │  │
│  │  Free"      │  │              │  │ → upgrade nudge│  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Free Trial Strategy

**14-day free trial for Pro (no credit card required)**

**Trial Mechanics:**
- User signs up → automatically gets Pro trial
- 14 days countdown shown in dashboard
- Day 10, 12, 14: email reminders
- Day 14: auto-downgrade to Free (no charge)
- Post-trial: "Reactivate Pro" CTA prominent for 30 days

### 5.3 Conversion Metrics to Track

| Metric | Target (Month 3) | Target (Month 6) |
|--------|-------------------|-------------------|
| Free → Trial signup | 15% | 20% |
| Trial → Paid conversion | 25% | 35% |
| Monthly → Annual upgrade | 20% | 30% |
| Pro → Team upgrade | 5% | 10% |
| Monthly churn (Pro) | <8% | <5% |
| Monthly churn (Team) | <5% | <3% |

---

## 6. Database Schema — Drizzle

### 6.1 Subscription Table

```typescript
export const subscription = pgTable(
  "subscription",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),

    // Plan details
    tier: varchar("tier", { length: 20 }).notNull().default("free"),
    status: varchar("status", { length: 20 }).notNull().default("active"),

    // Billing interval
    interval: varchar("interval", { length: 10 }),

    // Stripe references
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripePriceId: text("stripe_price_id"),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),

    // Team specifics
    seatsIncluded: integer("seats_included").notNull().default(1),
    seatsUsed: integer("seats_used").notNull().default(1),

    // Trial
    trialEndsAt: timestamp("trial_ends_at"),
    trialConvertedAt: timestamp("trial_converted_at"),

    // Cancellation
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at"),
    cancellationReason: text("cancellation_reason"),

    // Grace period
    gracePeriodEndsAt: timestamp("grace_period_ends_at"),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("subscription_user_idx").on(table.userId),
    index("subscription_stripe_customer_idx").on(table.stripeCustomerId),
    index("subscription_stripe_sub_idx").on(table.stripeSubscriptionId),
    index("subscription_status_idx").on(table.status),
    index("subscription_tier_idx").on(table.tier),
  ],
);
```

### 6.2 Usage Tracking Table

```typescript
export const usageTracking = pgTable(
  "usage_tracking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscription.id),

    resourceType: varchar("resource_type", { length: 30 }).notNull(),
    // api_call | inference_tokens | storage_bytes

    quantity: integer("quantity").notNull().default(1),

    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),

    metadata: jsonb("metadata").$type<{
      endpoint?: string;
      model?: string;
      tokensInput?: number;
      tokensOutput?: number;
      latencyMs?: number;
      statusCode?: number;
    }>().default({}),

    recordedAt: timestamp("recorded_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("usage_user_idx").on(table.userId),
    index("usage_resource_type_idx").on(table.resourceType),
    index("usage_period_idx").on(table.periodStart, table.periodEnd),
    index("usage_user_resource_period_idx").on(
      table.userId,
      table.resourceType,
      table.periodStart,
    ),
  ],
);
```

### 6.3 Tier Quota Constants

```typescript
// src/lib/quotas.ts

export const TIER_QUOTAS = {
  free: {
    apiCallsPerDay: 100,
    inferenceTokens: 0,
    cloudInference: false,
    advancedBenchmarks: false,
    alerts: false,
    seats: 1,
  },
  pro: {
    apiCallsPerDay: Infinity, // unlimited
    inferenceTokens: 500_000,
    cloudInference: true,
    advancedBenchmarks: true,
    alerts: true,
    seats: 1,
  },
  team: {
    apiCallsPerDay: Infinity,
    inferenceTokens: 2_000_000,
    cloudInference: true,
    advancedBenchmarks: true,
    alerts: true,
    seats: 5,
  },
} as const;
```

---

## 7. Implementation Roadmap

### Phase 1: MVP (Sprint 2-3)
- [ ] Stripe products & prices created
- [ ] `subscription` + `usage_tracking` tables in schema
- [ ] Drizzle migration
- [ ] Webhook endpoint with signature verification
- [ ] Checkout session + customer portal tRPC routes
- [ ] Pricing page with Monthly/Annual toggle
- [ ] Feature gating middleware (`requirePro`, `requireTeam`)
- [ ] 14-day trial flow (no card)
- [ ] Basic API rate limiting (100/day for Free)

### Phase 2: Core Value (Sprint 4-5)
- [ ] Cloud inference MVP (run models in browser via GPU cloud)
- [ ] API key management system
- [ ] Usage dashboard (API calls, inference tokens)
- [ ] Advanced benchmarks & analytics page
- [ ] New model alert system (email + in-app)

### Phase 3: Team Features (Sprint 6-7)
- [ ] Shared workspaces
- [ ] Admin dashboard (user management, per-seat usage)
- [ ] SSO integration (SAML/OIDC)
- [ ] Team API key management
- [ ] Audit logs

### Phase 4: Post-MVP (Q3 2026)
- [ ] Usage-based overage billing
- [ ] Enterprise tier
- [ ] Volume discounts
- [ ] Affiliate/referral program

---

*This spec is the source of truth for LLM Trust monetization. Engineering references this doc for all billing-related implementation. Questions → Atlas.*

**V2 Changelog:**
- Removed download-based pricing (models are free on HuggingFace)
- Added Basic API (100 calls/day) to Free tier
- Changed Pro API from 10K/mo to unlimited (daily fair-use rate limit)
- Elevated cloud inference as core value prop for Pro
- Added advanced benchmarks & alerts as Pro features
- Added API management to Team tier
- Updated messaging: value = infrastructure + trust + convenience
