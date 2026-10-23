// وصفات قمر — مخطط قاعدة البيانات (Neon Postgres + Drizzle)
// نموذج البيانات من وثيقة المشروع: الوصفة غير مصدر الفيديو.
// المحتوى (creators/recipes/sources/ingredients/steps/collections) بيتبذر من lib/data.ts
// وبيانات المستخدم (حفظ/ملاحظات/مشتريات/تجارب) منفصلة تمامًا لكل حساب.
import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  serial,
  uuid,
  primaryKey,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const creators = pgTable("creators", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  style: text("style").notNull(),
  channelHint: text("channel_hint").notNull(),
});

export const recipes = pgTable("recipes", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => creators.id),
  category: text("category").notNull(),
  mainIngredients: jsonb("main_ingredients")
    .$type<string[]>()
    .notNull()
    .default([]),
  textures: jsonb("textures").$type<string[]>().notNull().default([]),
  needs: jsonb("needs").$type<string[]>().notNull().default([]),
  why: text("why").notNull(),
  editorsPick: boolean("editors_pick").notNull().default(false),
  status: text("status").notNull().default("video"), // video = ترشيح فيديو | reviewed = وصفة مكتملة
  views: integer("views").notNull().default(0),
  viewsUpdatedAt: timestamp("views_updated_at"),
  detail: jsonb("detail").$type<import("../reviewed").ReviewedDetail>(),
  totalMinutes: integer("total_minutes"),
  sourceData: jsonb("source_data").$type<import("../data").VideoSource[]>(),
  testedNote: text("tested_note"),
  stage: text("stage").notNull().default("published"),
  version: integer("version").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const videoSources = pgTable("video_sources", {
  id: serial("id").primaryKey(),
  recipeSlug: text("recipe_slug")
    .notNull()
    .references(() => recipes.slug),
  ytId: text("yt_id").notNull().unique(),
  kind: text("kind").notNull(), // video | short
  published: text("published").notNull(),
  views: integer("views").notNull().default(0),
  sourceNo: integer("source_no"),
  embeddable: boolean("embeddable").notNull().default(true),
});

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeSlug: text("recipe_slug")
    .notNull()
    .references(() => recipes.slug),
  groupName: text("group_name").notNull(),
  name: text("name").notNull(),
  display: text("display").notNull(),
  amount: numeric("amount"),
  unit: text("unit"),
  optional: boolean("optional").notNull().default(false),
  sort: integer("sort").notNull().default(0),
});

export const recipeSteps = pgTable("recipe_steps", {
  id: serial("id").primaryKey(),
  recipeSlug: text("recipe_slug")
    .notNull()
    .references(() => recipes.slug),
  title: text("title").notNull(),
  body: text("body").notNull(),
  cue: text("cue"),
  minutes: integer("minutes"),
  sort: integer("sort").notNull().default(0),
});

export const recipeReviews = pgTable("recipe_reviews", {
  recipeSlug: text("recipe_slug")
    .primaryKey()
    .references(() => recipes.slug),
  servings: text("servings").notNull(),
  tools: jsonb("tools").$type<string[]>().notNull().default([]),
  successTips: jsonb("success_tips").$type<string[]>().notNull().default([]),
  commonMistakes: jsonb("common_mistakes")
    .$type<string[]>()
    .notNull()
    .default([]),
  reviewNote: text("review_note").notNull(),
  reviewedAt: timestamp("reviewed_at").notNull().defaultNow(),
});

export const collections = pgTable("collections", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

export const collectionRecipes = pgTable(
  "collection_recipes",
  {
    collectionSlug: text("collection_slug")
      .notNull()
      .references(() => collections.slug),
    recipeSlug: text("recipe_slug")
      .notNull()
      .references(() => recipes.slug),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.collectionSlug, t.recipeSlug] })],
);

// ---- بيانات المستخدم ----
export const savedRecipes = pgTable(
  "saved_recipes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    recipeSlug: text("recipe_slug").notNull(),
    kind: text("kind").notNull(), // saved | planned
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.recipeSlug, t.kind] })],
);

export const recipeNotes = pgTable(
  "recipe_notes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    recipeSlug: text("recipe_slug").notNull(),
    note: text("note").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.recipeSlug] })],
);

export const shoppingItems = pgTable("shopping_items", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  label: text("label").notNull(),
  checked: boolean("checked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cookAttempts = pgTable("cook_attempts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  recipeSlug: text("recipe_slug").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const kitchenDocuments = pgTable("kitchen_documents", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  state: jsonb("state")
    .$type<import("../kitchen-state").KitchenState>()
    .notNull(),
  revision: integer("revision").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const contactReports = pgTable("contact_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeSlug: text("recipe_slug"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  resetsAt: timestamp("resets_at").notNull(),
});

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
