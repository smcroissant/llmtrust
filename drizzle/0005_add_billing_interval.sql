-- Add billing_interval column to subscription table
ALTER TABLE "subscription" ADD COLUMN "billing_interval" varchar(10) NOT NULL DEFAULT 'monthly';
