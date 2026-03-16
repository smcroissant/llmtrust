CREATE TABLE IF NOT EXISTS "tac_score" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"nominal_cost_per_mtoken" varchar(20) NOT NULL,
	"tac_per_mtoken" varchar(20) NOT NULL,
	"reliability_score" integer NOT NULL,
	"consistency_score" integer NOT NULL,
	"compliance_score" integer NOT NULL,
	"hallucination_rate" varchar(10) NOT NULL,
	"reliability_multiplier" varchar(10) NOT NULL,
	"hallucination_overhead" varchar(10) NOT NULL,
	"consistency_penalty" varchar(10) NOT NULL,
	"compliance_penalty" varchar(10) NOT NULL,
	"sample_size" integer DEFAULT 0 NOT NULL,
	"computed_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "tac_score" ADD CONSTRAINT "tac_score_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "tac_score_model_idx" ON "tac_score" USING btree ("model_id");
CREATE INDEX IF NOT EXISTS "tac_score_provider_idx" ON "tac_score" USING btree ("provider_id");
CREATE INDEX IF NOT EXISTS "tac_score_tac_idx" ON "tac_score" USING btree ("tac_per_mtoken");
CREATE UNIQUE INDEX IF NOT EXISTS "tac_score_unique_idx" ON "tac_score" USING btree ("model_id","provider_id");
CREATE INDEX IF NOT EXISTS "tac_score_computed_idx" ON "tac_score" USING btree ("computed_at");

CREATE TABLE IF NOT EXISTS "tac_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"nominal_cost_per_mtoken" varchar(20) NOT NULL,
	"tac_per_mtoken" varchar(20) NOT NULL,
	"reliability_score" integer NOT NULL,
	"hallucination_rate" varchar(10) NOT NULL,
	"consistency_score" integer NOT NULL,
	"compliance_score" integer NOT NULL,
	"snapshot_date" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "tac_history" ADD CONSTRAINT "tac_history_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "tac_history_model_idx" ON "tac_history" USING btree ("model_id");
CREATE INDEX IF NOT EXISTS "tac_history_date_idx" ON "tac_history" USING btree ("snapshot_date");
CREATE INDEX IF NOT EXISTS "tac_history_model_date_idx" ON "tac_history" USING btree ("model_id","provider_id","snapshot_date");
