import { test } from "node:test";
import assert from "node:assert/strict";
import { recipes } from "../lib/data";
import { recommendFive, fiveIngredientKey, type FivePreferences } from "../lib/pick-five";
import { noOven, SWEET_CATEGORIES } from "../lib/experience";

const any: FivePreferences = { taste: "any", category: "any", method: "any", status: "any", time: "any" };
test("خمسة مكونات وحد أقصى خمسة اقتراحات، مع استبعاد صريح", () => {
  assert.equal(recommendFive(recipes, [], any).length, 0);
  assert.equal(recommendFive(recipes, ["بيض", "دجاج", "أرز", "دقيق", "سكر", "ملح"], any).length, 0);
  const results = recommendFive(recipes, ["بيض", "دجاج", "أرز", "دقيق", "سكر"], any);
  assert.ok(results.length > 0 && results.length <= 5);
  assert.ok(results.every((r) => r.have.length));
  const replaced = recommendFive(recipes, ["بيض", "دجاج", "أرز", "دقيق", "سكر"], any, [results[0].r.slug]);
  assert.ok(replaced.every((r) => r.r.slug !== results[0].r.slug));
});
test("التفضيلات لا تتراخى، والوقت غير المعروف لا يُحسب", () => {
  const opts: FivePreferences = { taste: "sweet", category: "حلويات باردة", method: "nooven", status: "reviewed", time: "45" };
  const found = recommendFive(recipes, ["سكر", "بسكويت", "حليب", "كريمة", "جبنة"], opts);
  assert.ok(found.every(({ r }) => SWEET_CATEGORIES.includes(r.category) && r.category === opts.category && noOven(r) && !!r.detail && r.totalMinutes != null && r.totalMinutes <= 45));
  assert.equal(recommendFive(recipes, ["سكر"], { ...any, category: "تصنيف غير موجود" }).length, 0);
});
test("الفيديو لا يُعامل كمقادير كاملة، والمرادفات لا تخلط البطاطا بالبطاطس", () => {
  const video = recommendFive(recipes, ["ورق أرز"], any).find((x) => x.r.slug === "rice-paper-fruit-mochi");
  assert.ok(video && !video.complete && video.have.includes("ورق أرز"));
  assert.ok(video.missing.includes("زبادي"));
  assert.notEqual(fiveIngredientKey("بطاطا حلوة"), fiveIngredientKey("بطاطس"));
  assert.equal(fiveIngredientKey("أرز"), fiveIngredientKey("رز"));
});
