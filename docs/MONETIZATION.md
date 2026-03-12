# LLM Trust — Monetization Specs

> **Author:** Atlas (Head of Product)
> **Date:** 2026-03-12
> **Status:** Ready for Engineering Review

---

## Table of Contents

1. [Pricing Tiers](#1-pricing-tiers)
2. [Stripe Integration Architecture](#2-stripe-integration-architecture)
3. [Usage-Based Pricing (Post-MVP)](#3-usage-based-pricing-post-mvp)
4. [Conversion Funnel](#4-conversion-funnel)
5. [Database Schema — Drizzle](#5-database-schema--drizzle)
6. [Implementation Roadmap](#6-implementation-roadmap)

---

## 1. Pricing Tiers

### 1.1 Free — $0/mo

| Feature | Limit |
|---------|-------|
| Model browsing & search | ✅ Unlimited |
| Community reviews (read + write) | ✅ Unlimited |
| CLI access (basic commands) | ✅ Yes |
| Download models (HuggingFace links) | Standard speed |
| Favorites & collections | ✅ Yes |
| Dashboard (basic stats) | ✅ Yes |
| API access | ❌ No |
| Cloud inference | ❌ No |
| Priority downloads | ❌ No |
| Advanced analytics | ❌ No |
| Priority support | ❌ No |
| Shared workspaces | ❌ No |
| SSO | ❌ No |

**Purpose:** Acquisition funnel. Frictionless entry, build community, collect reviews.

---

### 1.2 Pro — $19/mo ($190/yr — save $38, ~2 months free)

| Feature | Limit |
|---------|-------|
| Everything in Free | ✅ Unlimited |
| API access | 10,000 calls/month |
| Cloud inference (GPU time) | 500K tokens/month |
| Priority downloads | ✅ CDN-backed |
| Advanced analytics | Usage dashboards, benchmarks |
| Priority support | 24h response SLA |
| Custom model lists | ✅ |
| Export data (CSV, JSON) | ✅ |
| Ads-free experience | ✅ |

**Overage pricing (Post-MVP):**
- API calls: $0.001/call beyond 10K
- Cloud inference: $0.0001/token beyond 500K
- Overages billed monthly via Stripe Usage Records

**Target user:** Individual developers, researchers, power users.

---

### 1.3 Team — $49/mo ($490/yr — save $98, ~2 months free)

| Feature | Limit |
|---------|-------|
| Everything in Pro | ✅ |
| Seats | 5 included ($10/extra seat) |
| Shared workspaces | ✅ |
| Admin dashboard | User management, usage per seat |
| SSO (SAML/OIDC) | ✅ |
| SLA | 99.9% uptime guarantee |
| Dedicated support | Slack channel, 4h response |
| Audit logs | ✅ |
| Custom integrations | API webhooks |
| Volume discounts | Available for 50+ seats |

**Target user:** Startups, ML teams, agencies.

---

### 1.4 Enterprise — Custom Pricing (Post-MVP)

| Feature | Detail |
|---------|--------|
| Unlimited seats | Custom pricing |
| On-premise deployment | Self-hosted option |
| Custom SLA | 99.95%+ |
| Dedicated account manager | ✅ |
| Custom contracts & invoicing | ✅ |
| SOC2 / compliance reports | ✅ |
| API rate limits | Custom |
| Model fine-tuning pipeline | ✅ |

**Note:** Enterprise is roadmap Q3 2026. Not in initial launch.

---

### 1.5 Pricing Comparison Matrix

```
Feature               Free      Pro ($19)    Team ($49)    Enterprise
─────────────────────────────────────────────────────────────────────
Browsing              ∞         ∞            ∞             ∞
Reviews               ∞         ∞            ∞             ∞
CLI access            ✅        ✅           ✅            ✅
API calls             ❌        10K/mo       50K/mo        Custom
Cloud inference       ❌        500K tok     2M tok        Custom
Priority downloads    ❌        ✅           ✅            ✅
Analytics             Basic     Advanced     Advanced+     Custom
Support               Community 24h SLA     4h SLA        Dedicated
Seats                 1         1            5             Unlimited
Shared workspace      ❌        ❌           ✅            ✅
SSO                   ❌        ❌           ✅            ✅
SLA                   ❌        ❌           99.9%         99.95%+
Audit logs            ❌        ❌           ✅            ✅
─────────────────────────────────────────────────────────────────────
Monthly price         $0        $19          $49           Custom
Annual price          $0        $190         $490          Custom
```

---

## 2. Stripe Integration Architecture

### 2.1 Overview

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

### 2.2 Stripe Products & Prices Setup

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
  "api_quota": "10000" | "50000",
  "inference_tokens": "500000" | "2000000",
  "seats_included": "1" | "5"
}
```

### 2.3 Stripe Webhooks

**Endpoint:** `POST /api/webhooks/stripe`

**Events to handle:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create subscription record, activate plan |
| `invoice.paid` | Record payment, extend subscription period |
| `invoice.payment_failed` | Notify user, retry logic, grace period (3 days) |
| `customer.subscription.updated` | Sync tier changes, update quota |
| `customer.subscription.deleted` | Downgrade to Free, cleanup |
| `customer.subscription.trial_will_end` | Send reminder email (3 days before trial ends) |
| `payment_intent.succeeded` | Record one-time payment |
| `payment_intent.payment_failed` | Notify user |

**Webhook Security:**
- Verify `stripe-signature` header with `STRIPE_WEBHOOK_SECRET`
- Idempotency: check `event.id` against processed events log
- Return `200` within 30s or Stripe retries

**Implementation (`src/app/api/webhooks/stripe/route.ts`):**
```typescript
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "invoice.paid":
      await handleInvoicePaid(event.data.object);
      break;
    // ... other handlers
  }

  return new Response("OK", { status: 200 });
}
```

### 2.4 Customer Portal

**URL:** `POST /api/billing/portal`

Stripe's hosted Customer Portal for self-service:
- View current plan & billing history
- Update payment method
- Download invoices
- Upgrade/downgrade plan
- Cancel subscription
- Reactivate cancelled subscription

**Implementation:**
```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings`,
});
return { url: session.url };
```

### 2.5 Checkout Flow

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

**Upgrade (Pro → Team):**
```
1. User clicks "Upgrade to Team"
2. Create new checkout session with team price
3. Stripe prorates automatically
4. Webhook updates subscription record
```

### 2.6 Environment Variables

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

### 2.7 Grace Period & Failed Payments

- **Grace period:** 3 days after failed payment
- **During grace period:** Keep Pro features active, show banner "Payment failed — update payment method"
- **After grace period:** Downgrade to Free, preserve user data
- **Retry logic:** Stripe Smart Retries enabled (default)

---

## 3. Usage-Based Pricing (Post-MVP)

> **Note:** This section is for post-MVP planning. MVP uses hard quotas.

### 3.1 API Calls Overage

| Metric | Free | Pro | Team |
|--------|------|-----|------|
| Included API calls/mo | 0 | 10,000 | 50,000 |
| Overage price | N/A | $0.001/call | $0.0008/call |
| Hard cap option | N/A | ✅ User-configurable | ✅ |
| Overage alerts | N/A | 80%, 90%, 100% | 80%, 90%, 100% |

**Implementation approach:**
- Track API calls in `usage_tracking` table
- Stripe Usage Records for metered billing
- Daily aggregation cron job
- Real-time counter in Redis for rate limiting

### 3.2 Cloud Inference Overage

| Metric | Free | Pro | Team |
|--------|------|-----|------|
| Included tokens/mo | 0 | 500,000 | 2,000,000 |
| Overage price/token | N/A | $0.0001 | $0.00008 |
| Models available | N/A | Standard tier | Standard + Premium |

### 3.3 Storage

| Metric | Free | Pro | Team |
|--------|------|-----|------|
| Included storage | 0 | 5 GB | 25 GB |
| Overage price/GB/mo | N/A | $0.10 | $0.08 |
| Max file size | N/A | 500 MB | 2 GB |

**Decision:** Storage included in plan, paid only as overage. Simplifies messaging.

### 3.4 Usage Tracking Implementation

```typescript
// Usage record sent to Stripe daily
await stripe.subscriptionItems.createUsageRecord(
  subscriptionItemId,
  {
    quantity: apiCallsCount, // aggregated daily
    timestamp: 'now',
    action: 'increment',
  }
);
```

---

## 4. Conversion Funnel

### 4.1 CTA Placement Map

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
│  │ "Try Cloud  │  │ "API Access  │  │ Model detail   │  │
│  │  Inference" │  │  — Pro only" │  │ → gated feats  │  │
│  │  (Pro gate) │  │  (upgrade)   │  │                │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│                      DASHBOARD                            │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Usage bar   │  │ "Upgrade for │  │ Settings →     │  │
│  │ (quota %)   │  │  more" card  │  │ Billing page   │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│                      DOCS / API                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ API docs    │  │ "Get API Key │  │ CLI install    │  │
│  │ "Pro only"  │  │  — Upgrade"  │  │ → upgrade nudge│  │
│  │ badge       │  │              │  │                │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Specific CTA Locations

| Location | CTA Type | Copy | Target |
|----------|----------|------|--------|
| Homepage hero | Primary | "Start Free — No card required" | Sign up |
| Homepage pricing section | Secondary | "See plans" → anchor to pricing | Pricing |
| Model detail — API tab | Gate | "🔒 API Access — Upgrade to Pro" | Checkout |
| Model detail — Cloud Inference | Gate | "⚡ Try in Cloud — Pro feature" | Checkout |
| Dashboard — usage bar (80%+) | Inline | "You've used 80% of your API quota" | Upgrade |
| Dashboard — usage bar (100%) | Urgent | "Quota exceeded — Upgrade or wait for reset" | Upgrade |
| Docs — API reference | Badge | "Pro" badge next to API endpoints | Upgrade |
| Settings — Billing | Action | "Upgrade Plan" / "Manage Billing" | Checkout / Portal |
| Compare page | Inline | "Compare with cloud inference — Pro" | Upgrade |
| Blog — tutorial posts | Contextual | "Run this in cloud with Pro" | Checkout |

### 4.3 Free Trial Strategy

**Recommendation: 14-day free trial for Pro (no credit card required)**

**Rationale:**
- Lower friction than card-required trial
- Higher conversion from trial → paid (industry benchmark: 25-40% with no-card vs 40-60% with card, but MUCH higher volume)
- Aligns with developer audience (anti-card-gate culture)

**Trial Mechanics:**
- User signs up → automatically gets Pro trial
- 14 days countdown shown in dashboard
- Day 10, 12, 14: email reminders
- Day 14: auto-downgrade to Free (no charge)
- Post-trial: "Reactivate Pro" CTA prominent for 30 days

**Implementation:**
```typescript
// On signup
await db.insert(subscription).values({
  userId: user.id,
  tier: "pro",
  status: "trialing",
  trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
});

// Daily cron: expire trials
const expiredTrials = await db
  .select()
  .from(subscription)
  .where(
    and(
      eq(subscription.status, "trialing"),
      lt(subscription.trialEndsAt, new Date())
    )
  );

for (const trial of expiredTrials) {
  await db.update(subscription).set({ tier: "free", status: "active" })
    .where(eq(subscription.id, trial.id));
}
```

### 4.4 Annual Discount

**Offer:** 2 months free (pay for 10, get 12)

| Plan | Monthly | Annual | Savings | Discount % |
|------|---------|--------|---------|------------|
| Pro | $19/mo ($228/yr) | $190/yr | $38 | 16.7% |
| Team | $49/mo ($588/yr) | $490/yr | $98 | 16.7% |

**CTA placement:**
- Pricing page: toggle Monthly/Annual with savings badge
- Checkout page: "Save $38/yr with annual billing" upsell
- Upgrade flow: pre-select annual if user clicks annual link

### 4.5 Conversion Metrics to Track

| Metric | Target (Month 3) | Target (Month 6) |
|--------|-------------------|-------------------|
| Free → Trial signup | 15% | 20% |
| Trial → Paid conversion | 25% | 35% |
| Monthly → Annual upgrade | 20% | 30% |
| Pro → Team upgrade | 5% | 10% |
| Monthly churn (Pro) | <8% | <5% |
| Monthly churn (Team) | <5% | <3% |
| Trial → Paid (time to convert) | <7 days | <5 days |

---

## 5. Database Schema — Drizzle

### 5.1 Subscription Table

```typescript
export const subscription = pgTable(
  "subscription",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(), // One active subscription per user

    // Plan details
    tier: varchar("tier", { length: 20 }).notNull().default("free"), // free | pro | team
    status: varchar("status", { length: 20 }).notNull().default("active"),
    // active | trialing | past_due | canceled | unpaid | paused

    // Billing interval
    interval: varchar("interval", { length: 10 }), // monthly | annual | null for free

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

    // Grace period (failed payment)
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

### 5.2 Payment Table

```typescript
export const payment = pgTable(
  "payment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscription.id),

    // Stripe references
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    stripeInvoiceId: text("stripe_invoice_id").unique(),
    stripeChargeId: text("stripe_charge_id"),

    // Payment details
    amount: integer("amount").notNull(), // in cents (e.g., 1900 = $19.00)
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    status: varchar("status", { length: 20 }).notNull(),
    // succeeded | pending | failed | refunded | partially_refunded

    // Description
    description: text("description"),
    periodStart: timestamp("period_start"),
    periodEnd: timestamp("period_end"),

    // Refund
    refundedAmount: integer("refunded_amount").default(0), // in cents
    refundedAt: timestamp("refunded_at"),

    // Invoice PDF
    invoiceUrl: text("invoice_url"),
    invoicePdf: text("invoice_pdf"),

    // Timestamps
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("payment_user_idx").on(table.userId),
    index("payment_subscription_idx").on(table.subscriptionId),
    index("payment_stripe_intent_idx").on(table.stripePaymentIntentId),
    index("payment_stripe_invoice_idx").on(table.stripeInvoiceId),
    index("payment_status_idx").on(table.status),
    index("payment_created_idx").on(table.createdAt),
  ],
);
```

### 5.3 Usage Tracking Table

```typescript
export const usageTracking = pgTable(
  "usage_tracking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscription.id),

    // Usage type
    resourceType: varchar("resource_type", { length: 30 }).notNull(),
    // api_call | inference_tokens | storage_bytes | download

    // Usage amount
    quantity: integer("quantity").notNull().default(1),

    // Period tracking
    periodStart: timestamp("period_start").notNull(), // billing period start
    periodEnd: timestamp("period_end").notNull(),     // billing period end

    // Metadata (endpoint, model used, etc.)
    metadata: jsonb("metadata").$type<{
      endpoint?: string;
      model?: string;
      tokensInput?: number;
      tokensOutput?: number;
      latencyMs?: number;
      statusCode?: number;
    }>().default({}),

    // Aggregation helper (daily rollup)
    recordedAt: timestamp("recorded_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("usage_user_idx").on(table.userId),
    index("usage_subscription_idx").on(table.subscriptionId),
    index("usage_resource_type_idx").on(table.resourceType),
    index("usage_period_idx").on(table.periodStart, table.periodEnd),
    index("usage_recorded_idx").on(table.recordedAt),
    // Composite index for quota checks
    index("usage_user_resource_period_idx").on(
      table.userId,
      table.resourceType,
      table.periodStart,
    ),
  ],
);
```

### 5.4 Complete Schema File (Additions to `src/server/db/schema.ts`)

Add these imports at the top if not already present:
```typescript
import { numeric, uniqueIndex } from "drizzle-orm/pg-core";
```

Then append the three tables above after the existing schema. The full schema additions are shown in sections 5.1–5.3.

### 5.5 Tier Quota Constants

```typescript
// src/lib/quotas.ts

export const TIER_QUOTAS = {
  free: {
    apiCalls: 0,
    inferenceTokens: 0,
    storageBytes: 0,
    seats: 1,
    priorityDownloads: false,
    cloudInference: false,
  },
  pro: {
    apiCalls: 10_000,
    inferenceTokens: 500_000,
    storageBytes: 5 * 1024 * 1024 * 1024, // 5 GB
    seats: 1,
    priorityDownloads: true,
    cloudInference: true,
  },
  team: {
    apiCalls: 50_000,
    inferenceTokens: 2_000_000,
    storageBytes: 25 * 1024 * 1024 * 1024, // 25 GB
    seats: 5,
    priorityDownloads: true,
    cloudInference: true,
  },
} as const;

export type Tier = keyof typeof TIER_QUOTAS;

export function getQuota(tier: Tier, resource: keyof typeof TIER_QUOTAS.pro) {
  return TIER_QUOTAS[tier][resource];
}
```

### 5.6 Middleware: Gate Features by Tier

```typescript
// src/server/api/middleware/billing.ts

import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { TIER_QUOTAS } from "@/lib/quotas";

export const requirePro = middleware(async ({ ctx, next }) => {
  const sub = await getActiveSubscription(ctx.user.id);
  if (!sub || (sub.tier !== "pro" && sub.tier !== "team")) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Pro subscription required. Upgrade at /pricing",
    });
  }
  return next({ ctx: { ...ctx, subscription: sub } });
});

export const requireTeam = middleware(async ({ ctx, next }) => {
  const sub = await getActiveSubscription(ctx.user.id);
  if (!sub || sub.tier !== "team") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Team subscription required. Upgrade at /pricing",
    });
  }
  return next({ ctx: { ...ctx, subscription: sub } });
});

export const checkQuota = (resource: string) =>
  middleware(async ({ ctx, next }) => {
    const sub = await getActiveSubscription(ctx.user.id);
    const tier = sub?.tier ?? "free";
    const quota = TIER_QUOTAS[tier];

    const used = await getUsageInPeriod(ctx.user.id, resource);
    if (used >= quota[resource]) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Quota exceeded for ${resource}. Upgrade for more.`,
      });
    }
    return next();
  });
```

---

## 6. Implementation Roadmap

### Phase 1: MVP (Sprint 2-3)
- [ ] Stripe products & prices created in Dashboard
- [ ] `subscription`, `payment`, `usage_tracking` tables added to schema
- [ ] Drizzle migration generated & run
- [ ] `POST /api/webhooks/stripe` endpoint with signature verification
- [ ] `checkout.session.completed` and `invoice.paid` handlers
- [ ] `billing.createCheckoutSession` tRPC mutation
- [ ] `billing.getPortalUrl` tRPC mutation
- [ ] Pricing page with Monthly/Annual toggle
- [ ] Dashboard billing section
- [ ] Feature gating middleware (`requirePro`, `requireTeam`)
- [ ] 14-day trial flow (no card)
- [ ] Usage quota display in dashboard

### Phase 2: Polish (Sprint 4)
- [ ] Over-usage alerts (email + in-app at 80%, 90%, 100%)
- [ ] Failed payment grace period + retry emails
- [ ] Cancellation flow with reason survey
- [ ] Annual plan upsell in checkout
- [ ] Invoice history in billing settings
- [ ] Admin dashboard: revenue metrics

### Phase 3: Post-MVP (Q3 2026)
- [ ] Usage-based metered billing (API calls, inference tokens)
- [ ] Stripe Usage Records integration
- [ ] Daily usage aggregation cron
- [ ] Self-serve seat management for Team
- [ ] Enterprise tier with custom contracts
- [ ] Volume discounts
- [ ] Affiliate/referral program

---

## Appendix

### A. Pricing Psychology Notes

- **$19 vs $20:** $19 uses left-digit effect. Feels significantly cheaper.
- **Annual = 2 months free:** Standard SaaS convention. Easy to communicate.
- **Team at $49:** 2.5x Pro price, but 5x seats. Clear value for teams.
- **Free trial without card:** Higher volume, filter by engagement not wallet.

### B. Competitive Benchmarks

| Product | Free | Pro | Team |
|---------|------|-----|------|
| HuggingFace | ✅ | $9/mo (Pro) | Enterprise |
| Replicate | ✅ (limited) | Pay-per-use | Enterprise |
| OpenRouter | ✅ | Pay-per-use | N/A |
| **LLM Trust** | **✅** | **$19/mo** | **$49/mo** |

Positioning: LLM Trust Pro includes browsing + API + cloud inference + analytics. Competitors charge separately for each.

### C. Revenue Projections (Conservative)

| Month | Free Users | Pro Subs | Team Subs | MRR |
|-------|-----------|----------|-----------|-----|
| 1 | 1,000 | 20 | 2 | $478 |
| 3 | 5,000 | 100 | 10 | $2,390 |
| 6 | 15,000 | 350 | 35 | $8,365 |
| 12 | 50,000 | 1,200 | 100 | $27,700 |

Assumptions: 2% free→paid conversion, 15% annual, 5% monthly churn.

---

*This spec is the source of truth for monetization. Engineering should reference this doc for all billing-related implementation. Questions → Atlas.*
