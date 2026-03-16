-- Migration: Usage Metering & Stripe Webhook Handler (#42)
-- Adds: webhook_event table, api_usage table, billing_interval column to subscription

-- Add billing_interval column to subscription table
ALTER TABLE "subscription" ADD COLUMN "billing_interval" varchar(10) DEFAULT 'monthly';

-- Create webhook_event table for idempotency tracking
CREATE TABLE IF NOT EXISTS "webhook_event" (
  "id" text PRIMARY KEY NOT NULL,
  "type" varchar(100) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "processed_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "webhook_event_type_idx" ON "webhook_event" ("type");

-- Create api_usage table for daily API call tracking
CREATE TABLE IF NOT EXISTS "api_usage" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "date" varchar(10) NOT NULL,
  "call_count" integer DEFAULT 0 NOT NULL,
  "endpoint" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "api_usage_user_date_idx" ON "api_usage" ("user_id", "date");
CREATE INDEX IF NOT EXISTS "api_usage_date_idx" ON "api_usage" ("date");
