import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { recipes as seed, type Recipe } from "./data";
import { getDb, dbConfigured } from "./db";
import * as schema from "./db/schema";
import { detailSchema } from "./content-schema";

export async function readCatalog(db = getDb()): Promise<Recipe[]> {
  if (!db) {
    if (dbConfigured())
      throw new Error("Catalog database is configured but unavailable");
    return seed;
  }
  const [rows, sources, ingredients, steps, reviews] = await Promise.all([
    db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.stage, "published")),
    db.select().from(schema.videoSources),
    db
      .select()
      .from(schema.recipeIngredients)
      .orderBy(asc(schema.recipeIngredients.sort)),
    db.select().from(schema.recipeSteps).orderBy(asc(schema.recipeSteps.sort)),
    db.select().from(schema.recipeReviews),
  ]);
  return rows.flatMap((row) => {
    const videos =
      row.sourceData ||
      sources
        .filter((s) => s.recipeSlug === row.slug)
        .map((s) => ({
          ytId: s.ytId,
          kind: s.kind as "short" | "video",
          published: s.published,
          views: s.views,
          sourceNo: s.sourceNo || 0,
          embeddable: s.embeddable,
        }));
    if (!videos.length) return [];
    const review = reviews.find((r) => r.recipeSlug === row.slug);
    let detail = row.detail;
    if (!detail && review && row.status === "reviewed") {
      const groups = new Map<string, import("./reviewed").RIngredient[]>();
      for (const i of ingredients.filter((i) => i.recipeSlug === row.slug))
        groups.set(i.groupName, [
          ...(groups.get(i.groupName) || []),
          {
            name: i.name,
            display: i.display,
            ...(i.amount ? { amount: Number(i.amount) } : {}),
            ...(i.unit ? { unit: i.unit } : {}),
            optional: i.optional,
          },
        ]);
      detail = {
        servings: review.servings,
        tools: review.tools,
        successTips: review.successTips,
        commonMistakes: review.commonMistakes,
        reviewNote: review.reviewNote,
        ingredients: [...groups].map(([group, items]) => ({ group, items })),
        steps: steps
          .filter((s) => s.recipeSlug === row.slug)
          .map((s) => ({
            title: s.title,
            body: s.body,
            ...(s.cue ? { cue: s.cue } : {}),
            ...(s.minutes ? { minutes: s.minutes } : {}),
          })),
      };
    }
    const checked = detailSchema.safeParse(detail);
    return [
      {
        slug: row.slug,
        title: row.title,
        creatorId: row.creatorId,
        category: row.category,
        mainIngredients: row.mainIngredients,
        textures: row.textures,
        needs: row.needs,
        why: row.why,
        editorsPick: row.editorsPick,
        views: videos.reduce((n, s) => n + s.views, 0),
        sources: videos,
        status: checked.success ? "reviewed" : "video",
        ...(checked.success ? { detail: checked.data } : {}),
        ...(row.totalMinutes ? { totalMinutes: row.totalMinutes } : {}),
        viewsUpdatedAt: row.viewsUpdatedAt?.toISOString(),
        testedNote: row.testedNote || undefined,
      } as Recipe,
    ];
  });
}
const cached = unstable_cache(() => readCatalog(), ["published-catalog-v2"], {
  tags: ["catalog"],
  revalidate: 300,
});
export const getCatalog = cache(cached);
export async function getRecipe(slug: string) {
  return (await getCatalog()).find((r) => r.slug === slug);
}
