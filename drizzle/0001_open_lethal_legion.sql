CREATE TABLE "badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"tier" integer DEFAULT 1 NOT NULL,
	"points_reward" integer DEFAULT 0 NOT NULL,
	"criteria" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "badge_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "points_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"points" integer NOT NULL,
	"reason" varchar(100) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_badge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" uuid NOT NULL,
	"awarded_at" timestamp DEFAULT now() NOT NULL,
	"is_new" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"user_id" text PRIMARY KEY NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"upload_count" integer DEFAULT 0 NOT NULL,
	"total_downloads" integer DEFAULT 0 NOT NULL,
	"likes_received" integer DEFAULT 0 NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"level" varchar(30) DEFAULT 'newcomer' NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp,
	"is_ambassador" boolean DEFAULT false NOT NULL,
	"ambassador_since" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_badge_id_badge_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "badge_slug_idx" ON "badge" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "badge_category_idx" ON "badge" USING btree ("category");--> statement-breakpoint
CREATE INDEX "points_ledger_user_idx" ON "points_ledger" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "points_ledger_created_idx" ON "points_ledger" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_badge_user_idx" ON "user_badge" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_badge_badge_idx" ON "user_badge" USING btree ("badge_id");--> statement-breakpoint
CREATE INDEX "user_badge_unique_idx" ON "user_badge" USING btree ("user_id","badge_id");--> statement-breakpoint
CREATE INDEX "user_stats_points_idx" ON "user_stats" USING btree ("total_points");--> statement-breakpoint
CREATE INDEX "user_stats_level_idx" ON "user_stats" USING btree ("level");--> statement-breakpoint
CREATE INDEX "user_stats_ambassador_idx" ON "user_stats" USING btree ("is_ambassador");