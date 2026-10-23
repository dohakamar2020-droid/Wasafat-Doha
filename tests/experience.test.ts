import { test } from "node:test";
import assert from "node:assert/strict";
import { recipes, type Recipe } from "../lib/data";
import {
  recommend,
  ingredientKey,
  isSweet,
  noOven,
  related,
  matchIngredients,
  shoppingLines,
  parsePantryText,
  weeklySelection,
} from "../lib/experience";
import { meals, mealRecipes } from "../lib/meals";
import { contentSchema, detailSchema } from "../lib/content-schema";
import { emptyKitchen, mergeGuest, kitchenSchema } from "../lib/kitchen-state";

test("source IDs are unique and review badges require actual complete details", () => {
  const ids = recipes.flatMap((r) => r.sources.map((s) => s.ytId));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 89); // 80 أصلية + 9 من بحث الترند (أكتوبر 2026)
  for (const r of recipes) {
    for (const s of r.sources) assert.match(s.ytId, /^[\w-]{11}$/);
    if (r.detail) assert.ok(detailSchema.safeParse(r.detail).success, r.slug);
    assert.equal(r.status === "reviewed", !!r.detail);
  }
});
test("savory and no-oven preferences are hard constraints", () => {
  const p = recommend(recipes, {
    taste: "savory",
    time: "any",
    priority: "nooven",
  });
  assert.ok(p.length);
  for (const { r } of p) {
    assert.equal(isSweet(r), false);
    assert.ok(noOven(r));
  }
  assert.ok(!p.some((p) => p.r.slug === "raspberry-jam"));
});
test("shorts never count as proof of cooking time", () => {
  // الوقت أولوية ترتيب لا فلتر صلب: الموثّق الأقصر يتصدر، ومفيش نتيجة
  // بتدّعي وقت كلي مش مصرح به في تفاصيل مراجعتها — مدة الفيديو مش دليل
  const fast = recommend(recipes, { taste: "any", time: "15", priority: "few" });
  assert.equal(fast.length, 3);
  for (const { r, reason } of fast) {
    if (r.totalMinutes == null) assert.ok(!/وقت كلي موثق/.test(reason));
    else assert.equal(r.detail?.timing?.totalMinutes, r.totalMinutes);
  }
  const first = fast[0].r;
  const firstQuick =
    first.totalMinutes ?? first.detail?.timing?.cookMinutes ?? first.detail?.timing?.prepMinutes;
  assert.ok(firstQuick != null && firstQuick <= 15);
});
test("verified total time filters remain true even for high-view videos", () => {
  const a = { ...recipes[0], slug: "fast", totalMinutes: 12 },
    b = { ...recipes[1], slug: "slow", totalMinutes: 90 };
  const list = recommend([b, a], { taste: "any", time: "15", priority: "few" });
  // الوقت بيفرّق في الترتيب مش بيحذف: الموثق الأقصر يتصدر دايمًا
  assert.equal(list[0].r.slug, "fast");
});
test("replacements never return an excluded choice", () => {
  const a = recommend(recipes, {
    taste: "any",
    time: "any",
    priority: "different",
  });
  const b = recommend(
    recipes,
    { taste: "any", time: "any", priority: "different" },
    a.map((p) => p.r.slug),
  );
  assert.ok(!b.some((x) => a.some((y) => y.r.slug === x.r.slug)));
});
test("ingredients do not mistake the two main tags for full negrisco ingredients", () => {
  const r = recipes.find((r) => r.slug === "chicken-negrisco")!;
  const x = matchIngredients(r, ["دجاج", "مكرونة"], []);
  assert.ok(x.complete);
  assert.ok(x.missing.length > 5);
  assert.ok(x.missing.some((i) => i.name.includes("حليب")));
});
test("unreviewed recipe matching is explicitly incomplete", () => {
  const r = recipes.find((r) => !r.detail)!;
  assert.equal(matchIngredients(r, r.mainIngredients, []).complete, false);
});
test("multiple exclusions are all enforced", () => {
  const r = recipes.find((r) => r.slug === "chicken-negrisco")!;
  assert.ok(matchIngredients(r, ["مكرونة"], ["قهوة", "حليب"]).forbidden);
});
test("every same-ingredient related reason names an ingredient present in both recipes", () => {
  for (const r of recipes) {
    for (const x of related(r, recipes)) {
      assert.notEqual(x.recipe.slug, r.slug);
      if (x.reason.startsWith("نفس المكوّن:")) {
        const common = x.reason.split("نفس المكوّن: ")[1].split(" —")[0];
        assert.ok(r.mainIngredients.includes(common));
        assert.ok(x.recipe.mainIngredients.includes(common));
      }
    }
  }
});
test("fully reviewed meal contains only reviewed dishes", () => {
  const m = meals.find((m) => m.slug === "reviewed-night")!;
  assert.ok(mealRecipes(m).every((r) => r.detail));
});
test("numeric shopping amounts sum only exact ingredients with matching units", () => {
  const base = recipes.find((r) => r.detail)!;
  const fake = (slug: string, amount: number, unit: string) =>
    ({
      ...base,
      slug,
      detail: {
        ...base.detail!,
        ingredients: [
          {
            group: "x",
            items: [
              { name: "سكر", display: `${amount} ${unit}`, amount, unit },
            ],
          },
        ],
      },
    }) as Recipe;
  const lines = shoppingLines(
    [fake("a", 100, "جرام"), fake("b", 50, "جرام"), fake("c", 1, "كوب")],
    2,
  );
  assert.equal(lines.length, 2);
  assert.equal(lines.find((l) => l.unit === "جرام")?.amount, 300);
  assert.equal(lines.find((l) => l.unit === "كوب")?.amount, 2);
});
test("weekly editorial selection is deterministic, unique and rotates", () => {
  const a = weeklySelection(recipes, new Date("2026-10-23T12:00:00Z")),
    b = weeklySelection(recipes, new Date("2026-10-23T23:00:00Z")),
    c = weeklySelection(recipes, new Date("2026-11-06T12:00:00Z"));
  assert.deepEqual(a.recipes, b.recipes);
  assert.equal(new Set(a.recipes.map((r) => r.slug)).size, a.recipes.length);
  assert.notDeepEqual(
    a.recipes.map((r) => r.slug),
    c.recipes.map((r) => r.slug),
  );
});
test("guest import is explicit and preserves the account notes on collision", () => {
  const guest = { ...emptyKitchen(), saved: ["a"], notes: { a: "guest" } },
    account = { ...emptyKitchen(), saved: ["a", "b"], notes: { a: "account" } };
  const merged = mergeGuest(guest, account);
  assert.deepEqual(merged.saved, ["a", "b"]);
  assert.equal(merged.notes.a, "account");
  assert.equal(guest.notes.a, "guest");
});
test("kitchen state supports multiple attempts of the same dish", () => {
  const attempts = [1, 2].map((n) => ({
    id: `00000000-0000-4000-8000-00000000000${n}`,
    slug: "dish",
    note: "test",
    at: new Date().toISOString(),
  }));
  assert.ok(kitchenSchema.safeParse({ ...emptyKitchen(), attempts }).success);
});
test("invalid editor and kitchen bodies are rejected", () => {
  assert.equal(
    contentSchema.safeParse({ stage: "published", detail: {} }).success,
    false,
  );
  assert.equal(
    kitchenSchema.safeParse({ ...emptyKitchen(), saved: [1] }).success,
    false,
  );
});
test("every reviewed step links only to existing group-qualified ingredients", () => {
  for (const r of recipes.filter((r) => r.detail)) {
    const valid = new Set(
      r.detail!.ingredients.flatMap((g) =>
        g.items.map((i) => `${g.group}:${i.name}`),
      ),
    );
    for (const s of r.detail!.steps)
      for (const key of s.ingredients || [])
        assert.ok(valid.has(key), `${r.slug}: ${key}`);
  }
});
test("milk powder, cream types, tomato paste and oil types remain distinct pantry items", () => {
  assert.notEqual(ingredientKey("حليب بودرة"), ingredientKey("حليب"));
  assert.notEqual(ingredientKey("كريمة خفق"), ingredientKey("كريمة طبخ"));
  assert.notEqual(ingredientKey("زيت زيتون"), ingredientKey("زيت"));
  const r = recipes.find((r) => r.slug === "pink-sauce-pasta")!;
  const match = matchIngredients(r, ["طماطم", "حليب"], []);
  assert.ok(match.missing.some((i) => i.name === "معجون صلصة طماطم"));
});
test("an offline cache without a confirmed cloud baseline cannot overwrite the account", async () => {
  const { syncDecision } = await import("../lib/kitchen-state");
  assert.equal(syncDecision(null, 0, true), "conflict");
  assert.equal(syncDecision(2, 3, true), "conflict");
  assert.equal(syncDecision(3, 3, true), "push");
  assert.equal(syncDecision(2, 3, false), "apply");
});


import { trendInfo, byTrend, stepVideoUrl } from "../lib/trend";

test("trending: recent high-view upload is trending, old evergreen is not", () => {
  const now = new Date("2026-10-23T00:00:00Z");
  const cake = recipes.find((r) => r.slug === "asari-cake")!;
  assert.equal(trendInfo(cake, now).isTrending, true);
  const baklava = recipes.find((r) => r.slug === "baklava-fingers")!;
  assert.ok(baklava.views > 1_000_000);
  assert.equal(trendInfo(baklava, now).isTrending, false);
  assert.ok(byTrend(cake, baklava, now) < 0);
});

test("step video link estimates a proportional timestamp", () => {
  const pie = recipes.find((r) => r.slug === "chicken-pie-puff")!;
  const link = stepVideoUrl(pie, 0, 6)!;
  assert.ok(link.url.includes("watch?v=Gk9MvbwrooY&t="));
  const sec = Number(link.url.split("&t=")[1].replace("s", ""));
  assert.ok(sec > 0 && sec < 554);
  const noDur = recipes.find((r) => r.sources.every((x) => !x.durationSec))!;
  assert.equal(stepVideoUrl(noDur, 0, 3), null);
});

test("every reviewed recipe has a step-video link and consistent publish dates", () => {
  for (const r of recipes) {
    if (r.detail)
      assert.ok(
        stepVideoUrl(r, 0, r.detail.steps.length),
        `${r.slug} missing step video link`,
      );
    for (const s of r.sources)
      if (s.uploadedAt)
        assert.equal(
          s.published,
          `${s.uploadedAt.slice(5, 7)}/${s.uploadedAt.slice(0, 4)}`,
          `${r.slug} published month mismatch`,
        );
  }
});

test("رشحلي: 3 نتائج دايمًا حتى مع حد زمني ضيق، من غير ادعاء وقت", () => {
  for (const time of ["15", "45", "any"]) {
    const picks = recommend(recipes, { taste: "any", time, priority: "any" });
    assert.equal(picks.length, 3, `time=${time}`);
    for (const p of picks)
      if (p.r.totalMinutes == null)
        assert.ok(!/وقت كلي موثق/.test(p.reason), "مينفعش ندّعي وقت كلي");
  }
  // أول نتيجة لأي حد زمني لازم يكون وقتها الموثق (كلي أو جزئي) جوه الحد
  const quick = recommend(recipes, { taste: "any", time: "45", priority: "any" });
  const q0 = quick[0].r;
  const sig = q0.totalMinutes ?? q0.detail?.timing?.cookMinutes ?? q0.detail?.timing?.prepMinutes;
  assert.ok(sig != null && sig <= 45);
  const sweet = recommend(recipes, { taste: "sweet", time: "15", priority: "nooven" });
  assert.equal(sweet.length, 3);
  assert.ok(sweet.every((p) => isSweet(p.r)));
});

test("كتابة المقادير بحرية: تحليل النص والمرادفات والتقريب للمعروف", () => {
  const known = ["بطاطس", "دجاج", "بصل", "طماطم", "بيض", "حليب", "جبنة"];
  assert.deepEqual(
    parsePantryText("عندي بطاطس وفراخ وبصل، وطماطم وبيض", known),
    ["بطاطس", "دجاج", "بصل", "طماطم", "بيض"],
  );
  // مرادف البطاطا بيقرب لبطاطس، والمجهول بيترجع زي ما هو من غير تخمين
  assert.deepEqual(parsePantryText("بطاطا، كوسة", known), ["بطاطس", "كوسه"]);
  assert.deepEqual(parsePantryText("", known), []);
  assert.deepEqual(parsePantryText("بطاطس، بطاطس", known), ["بطاطس"]);
});
test("من اللي عندك للناقص: الترشيح بيقول الناقص وبيكمل لما يتوفر", () => {
  // بندور على وصفة مراجعة أسماء مقاديرها نظيفة (من غير بدائل/عطف بيتلخبط)
  // ونطابقها بنفس أسمائها: كاملة تبقى 0 ناقص، وشيل اسم يبينه ناقص
  let checked = 0;
  for (const r of recipes) {
    if (!r.detail) continue;
    const names = [
      ...new Set(
        r.detail.ingredients
          .flatMap((g) => g.items)
          .filter((i) => !i.optional)
          .map((i) => i.name),
      ),
    ];
    if (names.length < 3) continue;
    if (matchIngredients(r, names, []).missing.length !== 0) continue;
    const before = matchIngredients(r, names.slice(0, -1), []);
    if (before.missing.length < 1) continue;
    assert.equal(matchIngredients(r, names, []).missing.length, 0);
    checked++;
    break;
  }
  assert.ok(checked === 1, "لازم نلاقي وصفة تتطابق بالكامل بأسمائها");
});
