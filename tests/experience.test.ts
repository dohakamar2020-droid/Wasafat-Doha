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
  weeklySelection,
} from "../lib/experience";
import { meals, mealRecipes } from "../lib/meals";
import { contentSchema, detailSchema } from "../lib/content-schema";
import { emptyKitchen, mergeGuest, kitchenSchema } from "../lib/kitchen-state";

test("source IDs are unique and review badges require actual complete details", () => {
  const ids = recipes.flatMap((r) => r.sources.map((s) => s.ytId));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 80);
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
  // بس الوصفات اللي مصدرها صرّح بوقت كلي هي اللي تعدي فلتر الوقت —
  // ومدة الشورت أو الفيديو نفسها مش دليل طبخ أبدًا
  const fast = recommend(recipes, { taste: "any", time: "15", priority: "few" });
  for (const { r } of fast) {
    assert.ok(r.totalMinutes != null && r.totalMinutes <= 15);
    // الوقت الكلي لازم يكون مصرحًا به في تفاصيل المراجعة نفسها — مش مستنتج من مدة أي فيديو
    assert.equal(r.detail?.timing?.totalMinutes, r.totalMinutes);
  }
  assert.deepEqual(
    fast.map(({ r }) => r.slug),
    ["milk-coffee-dessert"],
  );
});
test("verified total time filters remain true even for high-view videos", () => {
  const a = { ...recipes[0], slug: "fast", totalMinutes: 12 },
    b = { ...recipes[1], slug: "slow", totalMinutes: 90 };
  const list = recommend([b, a], { taste: "any", time: "15", priority: "few" });
  assert.deepEqual(
    list.map((p) => p.r.slug),
    ["fast"],
  );
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
