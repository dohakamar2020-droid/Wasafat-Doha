import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { recipes } from "../lib/data";
import { MEAL_TYPES, mealTypesOf, byMealType } from "../lib/meal-types";
import { substituteFor, SUBSTITUTE_DISCLAIMER } from "../lib/substitutes";
import { TIP_GROUPS } from "../lib/tips";

test("أنواع الوجبات: اشتقاق حتمي من التصنيف — الصوصات مش وجبة", () => {
  for (const r of recipes) {
    const types = mealTypesOf(r);
    for (const t of types) assert.ok(MEAL_TYPES.includes(t), t);
    if (r.category === "صوصات وإضافات") assert.deepEqual(types, []);
    if (["حلويات باردة", "كيك ومخبوزات", "مشروبات"].includes(r.category))
      assert.deepEqual(types, ["حلويات ومشروبات"]);
    if (r.category === "أطباق رئيسية") {
      assert.ok(types.includes("غداء") && types.includes("عشاء"));
    }
  }
  // تغطية: كل نوع وجبة له وصفات فعلًا
  for (const t of MEAL_TYPES)
    assert.ok(byMealType(recipes, t).length > 0, `${t} فاضي`);
  // لانش بوكس المدرسة فطار وغداء بالوسم التحريري، وحلو المانجو مش فطار أبدًا
  const lunchbox = recipes.find((r) => r.slug === "lunchbox-sandwiches")!;
  assert.ok(mealTypesOf(lunchbox).includes("غداء"));
  assert.ok(mealTypesOf(lunchbox).includes("فطار"));
  // مفيش وصفة حلوة بتتسرب للفطار من كلمة «بيض» في «بدون بيض»
  assert.ok(
    byMealType(recipes, "فطار").every(
      (r) => !["حلويات باردة", "كيك ومخبوزات"].includes(r.category),
    ),
  );
  const mango = recipes.find((r) => r.slug === "mango-ice-cream")!;
  assert.deepEqual(mealTypesOf(mango), ["حلويات ومشروبات"]);
});

test("بدائل المكونات: بالمرادفات، ومفيش بديل مخترع لأي حاجة", () => {
  assert.ok(substituteFor("زبدة"));
  assert.ok(substituteFor("ثوم")?.alt.includes("بودرة ثوم"));
  // مكونات مالهاش بديل عندنا بترجع null — الصمت أحسن من التخمين
  assert.equal(substituteFor("لحم مفروم"), null);
  assert.equal(substituteFor("بطاطس"), null);
  assert.match(SUBSTITUTE_DISCLAIMER, /مش من فيديو الوصفة/);
});

test("وضع الطبخ: فيه إتمام فعلي للخطوة وانتقال تلقائي", () => {
  const src = readFileSync(
    "app/recipes/[slug]/cook/CookExperience.tsx",
    "utf8",
  );
  assert.match(src, /cookdone/);
  assert.match(src, /completeStep/);
  assert.match(src, /خلّصت الخطوة دي/);
  assert.match(src, /next\(stepIndex \+ 1\)/);
});

test("إخفاء الوصفات: زرار على الكارت وصفحة مخفيات موجودة", () => {
  const ui = readFileSync("components/ui.tsx", "utf8");
  assert.match(ui, /useHidden/);
  assert.match(ui, /hidden\.has\(r\.slug\)/);
  assert.ok(existsSync("app/kitchen/hidden/page.tsx"));
  assert.match(readFileSync("components/KitchenShell.tsx", "utf8"), /المخفيات/);
});

test("أسرار النجاح: محتوى عام موسوم ومتوصل", () => {
  assert.ok(TIP_GROUPS.length >= 6);
  for (const g of TIP_GROUPS) assert.ok(g.tips.length >= 4, g.title);
  assert.ok(existsSync("app/tips/page.tsx"));
  assert.match(readFileSync("app/tips/page.tsx", "utf8"), /مش من أي فيديو/);
});
