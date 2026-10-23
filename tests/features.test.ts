import { test } from "node:test";
import assert from "node:assert/strict";
import { recipes } from "../lib/data";
import {
  convertAmount,
  factorForIngredient,
  factorForPan,
  factorForServings,
  fmtAmount,
  parsePanCm,
  parseServingsCount,
  scaleRecipe,
  scalableIngredients,
} from "../lib/scaling";
import { unlockSuggestions, leftoverMatches } from "../lib/pantry";
import { planGuestSchedule, guestDishes, dishMinutes } from "../lib/guest-plan";
import { TASTE_PATHS, pathProgress } from "../lib/passport";

const reviewed = recipes.filter((r) => r.detail);

test("حساب الكميات: التحويلات الآمنة بس — مفيش أكواب لجرامات", () => {
  assert.equal(convertAmount(1, "كيلو جرام", "جرام"), 1000);
  assert.equal(convertAmount(500, "جرام", "كيلو جرام"), 0.5);
  assert.equal(convertAmount(1, "ملعقة كبيرة", "ملعقة صغيرة"), 3);
  assert.equal(convertAmount(1, "كوب", "جرام"), null);
  assert.equal(convertAmount(1, "لتر", "كوب"), null);
});

test("حساب الكميات: العدّيات بتتقرب لنصف والكبار لأقرب 5 بعلامة تقريب", () => {
  assert.deepEqual(fmtAmount(2.3, "حبة"), { text: "2.5", rounded: true });
  assert.deepEqual(fmtAmount(503, "جرام"), { text: "505", rounded: true });
  assert.deepEqual(fmtAmount(500, "جرام"), { text: "500", rounded: false });
  assert.deepEqual(fmtAmount(0.33, "كوب"), { text: "0.33", rounded: false });
});

test("«على قد اللي عندي»: معامل من مكوّن محدود بيحسب الكل بنفس النسبة", () => {
  // بندور على وصفة فيها مكوّن جرامات رقمي وبنصغّرها على قده
  let checked = false;
  for (const r of reviewed) {
    const ing = scalableIngredients(r.detail!).find(
      (i) => i.unit === "جرام" && (i.amount || 0) >= 200,
    );
    if (!ing) continue;
    const got = factorForIngredient(r.detail!, ing.name, ing.amount! / 2, "جرام");
    assert.ok(got);
    assert.ok(Math.abs(got.factor - 0.5) < 1e-9);
    const scaled = scaleRecipe(r.detail!, got.factor);
    const si = scaled.groups
      .flatMap((g) => g.items)
      .find((x) => x.item.name === ing.name);
    assert.ok(si?.scaledText?.startsWith(`${ing.amount! / 2} جرام`));
    // الوصفي ما بيتحسبش
    assert.ok(
      scaled.groups
        .flatMap((g) => g.items)
        .filter((x) => x.item.amount == null)
        .every((x) => x.scaledText === null),
    );
    checked = true;
    break;
  }
  assert.ok(checked, "لازم نلاقي وصفة تتجرب");
});

test("عدد الأفراد ومقاس الصينية: من أرقام المصدر بس", () => {
  const withServings = reviewed.find((r) => parseServingsCount(r.detail!));
  if (withServings) {
    const base = parseServingsCount(withServings.detail!)!;
    const f = factorForServings(withServings.detail!, base * 2);
    assert.ok(f && Math.abs(f - 2) < 1e-9);
    assert.equal(
      scaleRecipe(withServings.detail!, 2).estimatedServings,
      base * 2,
    );
  }
  const withPan = reviewed.find((r) => parsePanCm(r.detail!));
  if (withPan) {
    const cm = parsePanCm(withPan.detail!)!;
    const got = factorForPan(withPan.detail!, cm);
    assert.ok(got && Math.abs(got.factor - 1) < 1e-9);
    const bigger = factorForPan(withPan.detail!, cm * 1.5);
    assert.ok(bigger && Math.abs(bigger.factor - 2.25) < 1e-9);
  }
  // وصفة من غير عدد أفراد موثق: مفيش معامل ولا تخمين
  const noServ = reviewed.find((r) => !parseServingsCount(r.detail!));
  if (noServ) assert.equal(factorForServings(noServ.detail!, 4), null);
});

test("اشتري حاجة واحدة: الاقتراح بيكمل وصفات فعلًا من مقاديرها", () => {
  const r = reviewed.find((x) => {
    if (!x.detail) return false;
    const names = [
      ...new Set(
        x.detail.ingredients
          .flatMap((g) => g.items)
          .filter((i) => !i.optional)
          .map((i) => i.name),
      ),
    ];
    return names.length >= 3;
  })!;
  const names = [
    ...new Set(
      r.detail!.ingredients
        .flatMap((g) => g.items)
        .filter((i) => !i.optional)
        .map((i) => i.name),
    ),
  ];
  const pantry = names.slice(0, -1);
  const suggestions = unlockSuggestions(recipes, pantry, [r.slug], 10);
  assert.ok(suggestions.length >= 1);
  const top = suggestions.find((s) => s.unlocks.some((u) => u.slug === r.slug));
  assert.ok(top, "المكوّن الأخير لازم يكون مقترح لأنه بيكمل الوصفة");
  assert.ok(top!.savedUnlocks.some((u) => u.slug === r.slug));
  // اللي عنده كل حاجة ما بيجيلوش اقتراحات شرا للوصفة دي
  const none = unlockSuggestions(recipes, names, [], 10);
  assert.ok(!none.some((s) => s.unlocks.some((u) => u.slug === r.slug)));
});

test("البواقي: بنفرق بين الني والمستوي في التنبيه", () => {
  const chicken = recipes.filter((r) =>
    (r.detail
      ? r.detail.ingredients.flatMap((g) => g.items.map((i) => i.name))
      : r.mainIngredients
    ).some((n) => /دجاج|فراخ/.test(n)),
  );
  assert.ok(chicken.length > 0);
  const cooked = leftoverMatches(recipes, [{ name: "دجاج", state: "cooked" }]);
  assert.ok(cooked.length > 0);
  assert.ok(cooked.every((m) => m.note && /مستوية/.test(m.note)));
  const raw = leftoverMatches(recipes, [{ name: "دجاج", state: "raw" }]);
  assert.ok(raw.every((m) => m.note === null));
});

test("الضيوف جايين: جدول بالعكس من أوقات موثقة بس", () => {
  const dishes = guestDishes(reviewed.slice(0, 8), {});
  const { rows, undated } = planGuestSchedule(dishes, 20 * 60, 1);
  const dated = dishes.filter((d) => d.minutes != null);
  assert.equal(rows.length + undated.length, dishes.length);
  for (const row of rows) {
    assert.equal(row.finish! - row.start!, row.dish.minutes);
    assert.ok(row.finish! <= 20 * 60, "مفيش طبق يخلص بعد التقديم");
    if (row.dish.makeAhead)
      assert.ok(row.finish! <= 19 * 60, "الحلو يخلص قبلها بساعة");
  }
  // أي طبق اتحسب، أساسه موثق
  for (const d of dated) assert.ok(dishMinutes(d.r).basis.length > 0);
});

test("جواز المذاق: كل خطواته وصفات مراجعة والتقدم من فعل اليوزر", () => {
  for (const p of TASTE_PATHS) {
    assert.equal(p.steps.length, 3);
    for (const s of p.steps) {
      const r = recipes.find((x) => x.slug === s.slug);
      assert.ok(r?.detail, `${s.slug} لازم تكون مراجعة`);
    }
  }
  const p0 = TASTE_PATHS[0];
  const prog = pathProgress(p0, [p0.steps[0].slug]);
  assert.equal(prog.doneSlugs.length, 1);
  assert.equal(prog.nextSlug, p0.steps[1].slug);
  assert.ok(!prog.complete);
  assert.ok(pathProgress(p0, p0.steps.map((s) => s.slug)).complete);
});
