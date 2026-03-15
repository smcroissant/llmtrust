CREATE TABLE "llm_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid,
	"model_slug" varchar(255),
	"provider_id" varchar(100) NOT NULL,
	"latency_ms" integer NOT NULL,
	"status_code" integer NOT NULL,
	"token_count_in" integer DEFAULT 0 NOT NULL,
	"token_count_out" integer DEFAULT 0 NOT NULL,
	"quality_signal" varchar(50),
	"cost_usd" bigint DEFAULT 0,
	"user_hash" varchar(64),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trust_score" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"overall_score" integer NOT NULL,
	"reliability_score" integer NOT NULL,
	"consistency_score" integer NOT NULL,
	"cost_efficiency_score" integer NOT NULL,
	"sample_size" integer NOT NULL,
	"period_days" integer DEFAULT 7 NOT NULL,
	"previous_overall_score" integer,
	"trend" varchar(10),
	"computed_at" timestamp DEFAULT now() NOT NULL,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score_snapshot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"overall_score" integer NOT NULL,
	"reliability_score" integer NOT NULL,
	"consistency_score" integer NOT NULL,
	"cost_efficiency_score" integer NOT NULL,
	"sample_size" integer NOT NULL,
	"snapshot_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "llm_request" ADD CONSTRAINT "llm_request_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_score" ADD CONSTRAINT "trust_score_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_snapshot" ADD CONSTRAINT "score_snapshot_model_id_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."model"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "llm_request_model_idx" ON "llm_request" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "llm_request_provider_idx" ON "llm_request" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "llm_request_timestamp_idx" ON "llm_request" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "llm_request_status_idx" ON "llm_request" USING btree ("status_code");--> statement-breakpoint
CREATE INDEX "trust_score_model_idx" ON "trust_score" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "trust_score_provider_idx" ON "trust_score" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "trust_score_overall_idx" ON "trust_score" USING btree ("overall_score");--> statement-breakpoint
CREATE INDEX "trust_score_unique_idx" ON "trust_score" USING btree ("model_id","provider_id");--> statement-breakpoint
CREATE INDEX "snapshot_model_idx" ON "score_snapshot" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "snapshot_date_idx" ON "score_snapshot" USING btree ("snapshot_date");--> statement-breakpoint
CREATE INDEX "snapshot_model_date_idx" ON "score_snapshot" USING btree ("model_id","provider_id","snapshot_date");
