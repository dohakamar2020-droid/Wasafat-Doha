// بذر قاعدة بيانات وصفات قمر من بيانات الريبو (lib/data.ts + lib/reviewed.ts)
// التشغيل: npm run db:seed  (بيانات الاتصال من .env.local)
import { config } from "dotenv";
config({ path: ".env.local" });
import { getDb } from "../lib/db";

import * as schema from "../lib/db/schema";
import { creators, recipes, collections } from "../lib/data";
import { REVIEWED } from "../lib/reviewed";

async function main() {
  const db = getDb();
  if (!db) throw new Error("Database is not configured");
  console.log("🌙 بذر وصفات قمر بيبدأ…");

  for (const c of creators) {
    await db
      .insert(schema.creators)
      .values(c)
      .onConflictDoUpdate({
        target: schema.creators.id,
        set: {
          name: c.name,
          tagline: c.tagline,
          style: c.style,
          channelHint: c.channelHint,
        },
      });
  }
  console.log(`✓ ${creators.length} شيفات`);

  let sources = 0,
    ings = 0,
    steps = 0;
  for (const r of recipes) {
    const detail = REVIEWED[r.slug];
    await db
      .insert(schema.recipes)
      .values({
        slug: r.slug,
        title: r.title,
        creatorId: r.creatorId,
        category: r.category,
        mainIngredients: r.mainIngredients,
        textures: r.textures,
        needs: r.needs,
        why: r.why,
        editorsPick: !!r.editorsPick,
        status: detail ? "reviewed" : "video",
        views: r.views,
        detail: detail || null,
        viewsUpdatedAt: new Date("2026-10-22T00:00:00Z"),
      })
      .onConflictDoNothing({ target: schema.recipes.slug });
    if (detail)
      await db
        .update(schema.recipes)
        .set({ detail })
        .where(
          and(
            eq(schema.recipes.slug, r.slug),
            eq(schema.recipes.version, 0),
            isNull(schema.recipes.detail),
          ),
        );

    for (const s of r.sources) {
      await db
        .insert(schema.videoSources)
        .values({
          recipeSlug: r.slug,
          ytId: s.ytId,
          kind: s.kind,
          published: s.published,
          views: s.views,
          sourceNo: s.sourceNo,
        })
        .onConflictDoUpdate({
          target: schema.videoSources.ytId,
          set: { views: s.views, published: s.published },
        });
      sources++;
    }
    if (detail) {
      await db.delete(schema.recipeIngredients).where(eqSlug(r.slug));
      let sort = 0;
      for (const g of detail.ingredients)
        for (const item of g.items) {
          await db
            .insert(schema.recipeIngredients)
            .values({
              recipeSlug: r.slug,
              groupName: g.group,
              name: item.name,
              display: item.display,
              amount: item.amount != null ? String(item.amount) : null,
              unit: item.unit || null,
              optional: !!item.optional,
              sort: sort++,
            });
          ings++;
        }
      await db.delete(schema.recipeSteps).where(eqSlugSteps(r.slug));
      for (let i = 0; i < detail.steps.length; i++) {
        const st = detail.steps[i];
        await db
          .insert(schema.recipeSteps)
          .values({
            recipeSlug: r.slug,
            title: st.title,
            body: st.body,
            cue: st.cue || null,
            minutes: st.minutes || null,
            sort: i,
          });
        steps++;
      }
      await db
        .insert(schema.recipeReviews)
        .values({
          recipeSlug: r.slug,
          servings: detail.servings,
          tools: detail.tools,
          successTips: detail.successTips,
          commonMistakes: detail.commonMistakes,
          reviewNote: detail.reviewNote,
        })
        .onConflictDoUpdate({
          target: schema.recipeReviews.recipeSlug,
          set: {
            servings: detail.servings,
            tools: detail.tools,
            successTips: detail.successTips,
            commonMistakes: detail.commonMistakes,
            reviewNote: detail.reviewNote,
          },
        });
    }
  }
  console.log(
    `✓ ${recipes.length} وصفة، ${sources} مصدر فيديو، ${ings} مكوّن، ${steps} خطوة (للمراجعة)`,
  );

  for (const col of collections) {
    await db
      .insert(schema.collections)
      .values({ slug: col.slug, title: col.title, description: col.desc })
      .onConflictDoUpdate({
        target: schema.collections.slug,
        set: { title: col.title, description: col.desc },
      });
    await db.delete(schema.collectionRecipes).where(eqCol(col.slug));
    for (let i = 0; i < col.recipeSlugs.length; i++) {
      await db
        .insert(schema.collectionRecipes)
        .values({
          collectionSlug: col.slug,
          recipeSlug: col.recipeSlugs[i],
          sort: i,
        })
        .onConflictDoNothing();
    }
  }
  console.log(`✓ ${collections.length} مجموعة`);
  console.log("🌙 البذر خلص بنجاح");
}
// helpers لتفادي استيراد eq في الأعلى بشكل دائري بسيط
import { eq, and, isNull } from "drizzle-orm";
const eqSlug = (slug: string) => eq(schema.recipeIngredients.recipeSlug, slug);
const eqSlugSteps = (slug: string) => eq(schema.recipeSteps.recipeSlug, slug);
const eqCol = (slug: string) =>
  eq(schema.collectionRecipes.collectionSlug, slug);
main().catch((e) => {
  console.error("❌ فشل البذر:", e?.message || e);
  process.exit(1);
});
