import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  jsonb,
  varchar,
  uuid,
  index,
} from "drizzle-orm/pg-core";

// ============================================
// BETTER AUTH TABLES
// ============================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"), // user | admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// API KEYS — For Electron app authentication
// ============================================

export const apiKey = pgTable(
  "api_key",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    key: text("key").notNull().unique(), // hashed key
    prefix: varchar("prefix", { length: 10 }).notNull(), // llmt_...
    name: varchar("name", { length: 100 }).notNull().default("Default"),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("api_key_key_idx").on(table.key)],
);

// ============================================
// MODELS — The core entity
// ============================================

export const model = pgTable(
  "model",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Identity
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    authorId: text("author_id").references(() => user.id),

    // Content
    description: text("description").notNull(),
    longDescription: text("long_description"),

    // Technical specs
    architecture: varchar("architecture", { length: 100 }), // e.g., "llama", "mistral", "gpt"
    parameterCount: varchar("parameter_count", { length: 50 }), // e.g., "7B", "70B"
    contextLength: integer("context_length"), // max tokens
    license: varchar("license", { length: 100 }),

    // Download — links to HuggingFace (no hosting)
    downloadUrl: text("download_url").notNull(), // HuggingFace URL
    downloadCount: integer("download_count").notNull().default(0),

    // Categorization
    tags: jsonb("tags").$type<string[]>().default([]),
    category: varchar("category", { length: 100 }), // e.g., "text-generation", "code", "vision"

    // Status
    status: varchar("status", { length: 20 }).notNull().default("draft"), // draft | published | archived
    isFeatured: boolean("is_featured").notNull().default(false),

    // SEO
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),

    // Electron / Local execution metadata
    // These fields help the Electron app know how to run the model locally
    localExecution: jsonb("local_execution").$type<{
      format?: "gguf" | "safetensors" | "pytorch" | "onnx";
      quantizations?: string[]; // ["Q4_K_M", "Q5_K_M", "Q8_0"]
      defaultQuantization?: string;
      systemPrompt?: string;
      stopTokens?: string[];
      templateFormat?: "chatml" | "llama" | "mistral" | "alpaca" | "custom";
      customTemplate?: string;
      eosToken?: string;
      bosToken?: string;
      recommendedRam?: number; // in GB
      minRam?: number; // in GB
    }>(),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("model_slug_idx").on(table.slug),
    index("model_category_idx").on(table.category),
    index("model_status_idx").on(table.status),
    index("model_featured_idx").on(table.isFeatured),
  ],
);

// ============================================
// LIKES
// ============================================

export const like = pgTable(
  "like",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    modelId: uuid("model_id")
      .notNull()
      .references(() => model.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("like_model_user_idx").on(table.modelId, table.userId),
  ],
);

// ============================================
// REVIEWS
// ============================================

export const review = pgTable(
  "review",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    modelId: uuid("model_id")
      .notNull()
      .references(() => model.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // 1-5
    content: text("content"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("review_model_idx").on(table.modelId),
    index("review_user_model_idx").on(table.userId, table.modelId),
  ],
);

// ============================================
// USER FAVORITES — For Electron sync
// ============================================

export const favorite = pgTable(
  "favorite",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    modelId: uuid("model_id")
      .notNull()
      .references(() => model.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("favorite_user_model_idx").on(table.userId, table.modelId),
  ],
);

// ============================================
// BADGES — Gamification system
// ============================================

export const badge = pgTable(
  "badge",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(), // e.g. "first_review"
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 50 }).notNull(), // emoji or lucide icon name
    category: varchar("category", { length: 50 }).notNull(), // review | upload | download | community | streak
    tier: integer("tier").notNull().default(1), // 1=bronze, 2=silver, 3=gold, 4=platinum
    pointsReward: integer("points_reward").notNull().default(0),
    criteria: jsonb("criteria").$type<{
      type: string;
      threshold?: number;
      description: string;
    }>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("badge_slug_idx").on(table.slug),
    index("badge_category_idx").on(table.category),
  ],
);

export const userBadge = pgTable(
  "user_badge",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badge.id, { onDelete: "cascade" }),
    awardedAt: timestamp("awarded_at").notNull().defaultNow(),
    isNew: boolean("is_new").notNull().default(true), // for "new badge" notification
  },
  (table) => [
    index("user_badge_user_idx").on(table.userId),
    index("user_badge_badge_idx").on(table.badgeId),
    index("user_badge_unique_idx").on(table.userId, table.badgeId), // one badge per user
  ],
);

// ============================================
// USER PROFILE — Gamification stats & levels
// ============================================

export const userStats = pgTable(
  "user_stats",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    // Counts
    reviewCount: integer("review_count").notNull().default(0),
    uploadCount: integer("upload_count").notNull().default(0),
    totalDownloads: integer("total_downloads").notNull().default(0),
    likesReceived: integer("likes_received").notNull().default(0),
    // Points & Level
    totalPoints: integer("total_points").notNull().default(0),
    level: varchar("level", { length: 30 }).notNull().default("newcomer"),
    // Streaks
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastActivityAt: timestamp("last_activity_at"),
    // Ambassador
    isAmbassador: boolean("is_ambassador").notNull().default(false),
    ambassadorSince: timestamp("ambassador_since"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("user_stats_points_idx").on(table.totalPoints),
    index("user_stats_level_idx").on(table.level),
    index("user_stats_ambassador_idx").on(table.isAmbassador),
  ],
);

// ============================================
// NEWSLETTER SUBSCRIBERS
// ============================================

export const newsletterSubscriber = pgTable(
  "newsletter_subscriber",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    confirmToken: text("confirm_token").notNull(),
    confirmed: boolean("confirmed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("newsletter_email_idx").on(table.email),
    index("newsletter_token_idx").on(table.confirmToken),
  ],
);

// ============================================
// NOTIFICATIONS — In-app notification system
// ============================================

export const notificationType = [
  "model_approved",
  "model_rejected",
  "new_review",
  "system",
] as const;

export type NotificationType = (typeof notificationType)[number];

export const notification = pgTable(
  "notification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(), // model_approved | model_rejected | new_review | system
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    link: text("link"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notification_user_idx").on(table.userId),
    index("notification_read_idx").on(table.userId, table.read),
    index("notification_created_idx").on(table.createdAt),
  ],
);

// ============================================
// SUBSCRIPTIONS — Stripe billing
// ============================================

export const subscriptionTier = ["free", "pro", "team"] as const;
export type SubscriptionTier = (typeof subscriptionTier)[number];

export const subscriptionStatus = [
  "active",
  "canceled",
  "past_due",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "trialing",
] as const;
export type SubscriptionStatus = (typeof subscriptionStatus)[number];

export const subscription = pgTable(
  "subscription",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    tier: varchar("tier", { length: 20 }).notNull().default("free"),
    status: varchar("status", { length: 30 }).notNull().default("active"),
    currentPeriodEnd: timestamp("current_period_end"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("subscription_user_idx").on(table.userId),
    index("subscription_stripe_customer_idx").on(table.stripeCustomerId),
    index("subscription_stripe_sub_idx").on(table.stripeSubscriptionId),
  ],
);

// ============================================
// PAYMENTS — Stripe payment records
// ============================================

export const paymentStatus = [
  "succeeded",
  "pending",
  "failed",
  "canceled",
  "refunded",
] as const;
export type PaymentStatus = (typeof paymentStatus)[number];

export const payment = pgTable(
  "payment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    amount: integer("amount").notNull(), // in cents
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("payment_user_idx").on(table.userId),
    index("payment_stripe_intent_idx").on(table.stripePaymentIntentId),
  ],
);

// ============================================
// POINTS LEDGER — Track point transactions
// ============================================

export const pointsLedger = pgTable(
  "points_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    points: integer("points").notNull(), // positive or negative
    reason: varchar("reason", { length: 100 }).notNull(), // review_created, upload_published, badge_earned, streak_bonus, etc.
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("points_ledger_user_idx").on(table.userId),
    index("points_ledger_created_idx").on(table.createdAt),
  ],
);

// ============================================
// TRUST SCORE PIPELINE — Real production data
// ============================================

/**
 * Raw LLM request telemetry ingested from OTel proxy.
 * PII-stripped: userIds are hashed, prompts not stored.
 */
export const llmRequest = pgTable(
  "llm_request",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Model identification
    modelId: uuid("model_id").references(() => model.id, {
      onDelete: "set null",
    }),
    modelSlug: varchar("model_slug", { length: 255 }), // fallback if no DB match
    providerId: varchar("provider_id", { length: 100 }).notNull(), // e.g. "openai", "anthropic", "together"

    // Telemetry
    latencyMs: integer("latency_ms").notNull(),
    statusCode: integer("status_code").notNull(), // HTTP status from provider
    tokenCountIn: integer("token_count_in").notNull().default(0),
    tokenCountOut: integer("token_count_out").notNull().default(0),
    qualitySignal: varchar("quality_signal", { length: 50 }), // optional: "success", "timeout", "rate_limited", "error"

    // Derived metrics
    costUsd: bigint("cost_usd", { mode: "number" }).default(0), // in microcents (1e-6 USD) for precision

    // Anonymized user tracking
    userHash: varchar("user_hash", { length: 64 }), // SHA-256 of userId — for dedup, not PII

    // Timestamp
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (table) => [
    index("llm_request_model_idx").on(table.modelId),
    index("llm_request_provider_idx").on(table.providerId),
    index("llm_request_timestamp_idx").on(table.timestamp),
    index("llm_request_status_idx").on(table.statusCode),
  ],
);

/**
 * Computed trust scores per model+provider.
 * Recomputed periodically by the cron job.
 */
export const trustScore = pgTable(
  "trust_score",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    modelId: uuid("model_id")
      .notNull()
      .references(() => model.id, { onDelete: "cascade" }),
    providerId: varchar("provider_id", { length: 100 }).notNull(),

    // Dimensional scores (0-100)
    overallScore: integer("overall_score").notNull(), // weighted composite
    reliabilityScore: integer("reliability_score").notNull(), // uptime, error rate
    consistencyScore: integer("consistency_score").notNull(), // latency variance, output stability
    costEfficiencyScore: integer("cost_efficiency_score").notNull(), // quality per dollar

    // Metadata
    sampleSize: integer("sample_size").notNull(), // number of requests used
    periodDays: integer("period_days").notNull().default(7), // computation window

    // Trend
    previousOverallScore: integer("previous_overall_score"), // for trend arrows
    trend: varchar("trend", { length: 10 }), // "up", "down", "stable"

    // Computation metadata
    computedAt: timestamp("computed_at").notNull().defaultNow(),
    validUntil: timestamp("valid_until"), // score decay after this if no new data

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("trust_score_model_idx").on(table.modelId),
    index("trust_score_provider_idx").on(table.providerId),
    index("trust_score_overall_idx").on(table.overallScore),
    index("trust_score_unique_idx").on(table.modelId, table.providerId), // one score per model+provider
  ],
);

/**
 * Historical snapshots for trend charts.
 * One snapshot per model+provider per day (or per computation run).
 */
export const scoreSnapshot = pgTable(
  "score_snapshot",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    modelId: uuid("model_id")
      .notNull()
      .references(() => model.id, { onDelete: "cascade" }),
    providerId: varchar("provider_id", { length: 100 }).notNull(),

    overallScore: integer("overall_score").notNull(),
    reliabilityScore: integer("reliability_score").notNull(),
    consistencyScore: integer("consistency_score").notNull(),
    costEfficiencyScore: integer("cost_efficiency_score").notNull(),
    sampleSize: integer("sample_size").notNull(),

    snapshotDate: timestamp("snapshot_date").notNull().defaultNow(),
  },
  (table) => [
    index("snapshot_model_idx").on(table.modelId),
    index("snapshot_date_idx").on(table.snapshotDate),
    index("snapshot_model_date_idx").on(table.modelId, table.providerId, table.snapshotDate),
  ],
);
