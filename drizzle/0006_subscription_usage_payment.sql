-- Migration: Subscription, Payment & Usage Tracking Tables (#70)
-- Creates subscription, payment, and usage_tracking tables per MONETIZATION.md §6

CREATE TABLE IF NOT EXISTS "subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"tier" varchar(20) DEFAULT 'free' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"interval" varchar(10),
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"stripe_current_period_end" timestamp,
	"seats_included" integer DEFAULT 1 NOT NULL,
	"seats_used" integer DEFAULT 1 NOT NULL,
	"trial_ends_at" timestamp,
	"trial_converted_at" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp,
	"cancellation_reason" text,
	"grace_period_ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscription_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "subscription_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);

ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "subscription_user_idx" ON "subscription" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "subscription_stripe_customer_idx" ON "subscription" USING btree ("stripe_customer_id");
CREATE INDEX IF NOT EXISTS "subscription_stripe_sub_idx" ON "subscription" USING btree ("stripe_subscription_id");
CREATE INDEX IF NOT EXISTS "subscription_status_idx" ON "subscription" USING btree ("status");
CREATE INDEX IF NOT EXISTS "subscription_tier_idx" ON "subscription" USING btree ("tier");

CREATE TABLE IF NOT EXISTS "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" uuid,
	"stripe_payment_intent_id" text,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'usd' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);

ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "payment_user_idx" ON "payment" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "payment_stripe_intent_idx" ON "payment" USING btree ("stripe_payment_intent_id");
CREATE INDEX IF NOT EXISTS "payment_subscription_idx" ON "payment" USING btree ("subscription_id");

CREATE TABLE IF NOT EXISTS "usage_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" uuid,
	"resource_type" varchar(30) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "usage_user_idx" ON "usage_tracking" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "usage_resource_type_idx" ON "usage_tracking" USING btree ("resource_type");
CREATE INDEX IF NOT EXISTS "usage_period_idx" ON "usage_tracking" USING btree ("period_start","period_end");
CREATE INDEX IF NOT EXISTS "usage_user_resource_period_idx" ON "usage_tracking" USING btree ("user_id","resource_type","period_start");
