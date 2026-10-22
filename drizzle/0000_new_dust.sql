CREATE TABLE "collection_recipes" (
	"collection_slug" text NOT NULL,
	"recipe_slug" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "collection_recipes_collection_slug_recipe_slug_pk" PRIMARY KEY("collection_slug","recipe_slug")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cook_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"recipe_slug" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creators" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"style" text NOT NULL,
	"channel_hint" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_slug" text NOT NULL,
	"group_name" text NOT NULL,
	"name" text NOT NULL,
	"display" text NOT NULL,
	"amount" numeric,
	"unit" text,
	"optional" boolean DEFAULT false NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_notes" (
	"user_id" uuid NOT NULL,
	"recipe_slug" text NOT NULL,
	"note" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_notes_user_id_recipe_slug_pk" PRIMARY KEY("user_id","recipe_slug")
);
--> statement-breakpoint
CREATE TABLE "recipe_reviews" (
	"recipe_slug" text PRIMARY KEY NOT NULL,
	"servings" text NOT NULL,
	"tools" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"success_tips" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"common_mistakes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"review_note" text NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_slug" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"cue" text,
	"minutes" integer,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"creator_id" text NOT NULL,
	"category" text NOT NULL,
	"main_ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"textures" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"needs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"why" text NOT NULL,
	"editors_pick" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'video' NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"views_updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_recipes" (
	"user_id" uuid NOT NULL,
	"recipe_slug" text NOT NULL,
	"kind" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_recipes_user_id_recipe_slug_kind_pk" PRIMARY KEY("user_id","recipe_slug","kind")
);
--> statement-breakpoint
CREATE TABLE "shopping_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text NOT NULL,
	"checked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "video_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_slug" text NOT NULL,
	"yt_id" text NOT NULL,
	"kind" text NOT NULL,
	"published" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"source_no" integer,
	"embeddable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "video_sources_yt_id_unique" UNIQUE("yt_id")
);
--> statement-breakpoint
ALTER TABLE "collection_recipes" ADD CONSTRAINT "collection_recipes_collection_slug_collections_slug_fk" FOREIGN KEY ("collection_slug") REFERENCES "public"."collections"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_recipes" ADD CONSTRAINT "collection_recipes_recipe_slug_recipes_slug_fk" FOREIGN KEY ("recipe_slug") REFERENCES "public"."recipes"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cook_attempts" ADD CONSTRAINT "cook_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_slug_recipes_slug_fk" FOREIGN KEY ("recipe_slug") REFERENCES "public"."recipes"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_notes" ADD CONSTRAINT "recipe_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_reviews" ADD CONSTRAINT "recipe_reviews_recipe_slug_recipes_slug_fk" FOREIGN KEY ("recipe_slug") REFERENCES "public"."recipes"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_slug_recipes_slug_fk" FOREIGN KEY ("recipe_slug") REFERENCES "public"."recipes"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recipes" ADD CONSTRAINT "saved_recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_items" ADD CONSTRAINT "shopping_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_sources" ADD CONSTRAINT "video_sources_recipe_slug_recipes_slug_fk" FOREIGN KEY ("recipe_slug") REFERENCES "public"."recipes"("slug") ON DELETE no action ON UPDATE no action;