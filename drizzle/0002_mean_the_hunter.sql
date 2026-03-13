CREATE TABLE "newsletter_subscriber" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"confirm_token" text NOT NULL,
	"confirmed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "newsletter_email_idx" ON "newsletter_subscriber" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_token_idx" ON "newsletter_subscriber" USING btree ("confirm_token");