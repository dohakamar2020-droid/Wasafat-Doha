CREATE TABLE "contact_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_slug" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kitchen_documents" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"state" jsonb NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"resets_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "detail" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "total_minutes" integer;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source_data" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "tested_note" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "stage" text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "kitchen_documents" ADD CONSTRAINT "kitchen_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;