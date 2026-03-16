-- Migration: Enterprise Compliance Scoring Engine (#89)
-- Creates compliance_check, compliance_score, and compliance_report tables

CREATE TABLE IF NOT EXISTS "compliance_check" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"category" varchar(50) NOT NULL,
	"check_name" varchar(255) NOT NULL,
	"result" varchar(20) NOT NULL,
	"score" integer NOT NULL,
	"details" text,
	"evidence" jsonb DEFAULT '{}'::jsonb,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "compliance_check" ADD CONSTRAINT "compliance_check_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "compliance_check_model_idx" ON "compliance_check" USING btree ("model_id");
CREATE INDEX IF NOT EXISTS "compliance_check_category_idx" ON "compliance_check" USING btree ("category");
CREATE INDEX IF NOT EXISTS "compliance_check_model_category_idx" ON "compliance_check" USING btree ("model_id", "category");

CREATE TABLE IF NOT EXISTS "compliance_score" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"regulatory_score" integer DEFAULT 0 NOT NULL,
	"supply_chain_score" integer DEFAULT 0 NOT NULL,
	"data_governance_score" integer DEFAULT 0 NOT NULL,
	"operational_score" integer DEFAULT 0 NOT NULL,
	"ethical_score" integer DEFAULT 0 NOT NULL,
	"overall_score" integer NOT NULL,
	"badge" varchar(30) NOT NULL,
	"total_checks" integer NOT NULL,
	"passed_checks" integer DEFAULT 0 NOT NULL,
	"warned_checks" integer DEFAULT 0 NOT NULL,
	"failed_checks" integer DEFAULT 0 NOT NULL,
	"computed_at" timestamp DEFAULT now() NOT NULL,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "compliance_score_model_id_unique" UNIQUE("model_id")
);

ALTER TABLE "compliance_score" ADD CONSTRAINT "compliance_score_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "compliance_score_model_idx" ON "compliance_score" USING btree ("model_id");
CREATE INDEX IF NOT EXISTS "compliance_score_overall_idx" ON "compliance_score" USING btree ("overall_score");
CREATE INDEX IF NOT EXISTS "compliance_score_badge_idx" ON "compliance_score" USING btree ("badge");

CREATE TABLE IF NOT EXISTS "compliance_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"compliance_score_id" uuid NOT NULL,
	"format" varchar(10) DEFAULT 'pdf' NOT NULL,
	"file_path" text,
	"file_size" integer,
	"requested_by" text,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "compliance_report" ADD CONSTRAINT "compliance_report_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "compliance_report" ADD CONSTRAINT "compliance_report_compliance_score_id_compliance_score_id_fk" FOREIGN KEY ("compliance_score_id") REFERENCES "public"."compliance_score"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "compliance_report" ADD CONSTRAINT "compliance_report_requested_by_user_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "compliance_report_model_idx" ON "compliance_report" USING btree ("model_id");
CREATE INDEX IF NOT EXISTS "compliance_report_requested_idx" ON "compliance_report" USING btree ("requested_by");
