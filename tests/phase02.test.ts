import { test } from "node:test";
import assert from "node:assert/strict";
import { recipes, searchRecipes } from "../lib/data";
import { discoverySort, orderDiscovery } from "../lib/discovery-order";
import { uniqueIngredientOptions } from "../lib/ingredient-options";
import { matchIngredients } from "../lib/experience";
import { TASTE_PATHS } from "../lib/passport";

test("exact Arabic recipe ranking is preserved unless another sort is chosen", () => {
  const found = searchRecipes("شاورما الدجاج");
  assert.equal(discoverySort(null, "شاورما الدجاج"), "relevance");
  assert.equal(orderDiscovery(found, "relevance", "شاورما الدجاج")[0].slug, "chicken-shawarma");
  assert.equal(searchRecipes("شاور")[0].slug, "chicken-shawarma");
  assert.ok(searchRecipes("فراخ").some(r => r.title.includes("دجاج")));
  assert.ok(searchRecipes("غلاش").some(r => r.title.includes("جلاش")));
  assert.deepEqual(searchRecipes("  فراخ  ").map(r => r.slug), searchRecipes("فراخ").map(r => r.slug));
  assert.equal(searchRecipes("xyzqnotfound123").length, 0);
});

test("sort URL values are validated and explicit choices override query default", () => {
  assert.equal(discoverySort("trend", ""), "trend");
  assert.equal(discoverySort("views", "دجاج"), "views");
  assert.equal(discoverySort("not-a-sort", ""), "editor");
  assert.equal(discoverySort("not-a-sort", "دجاج"), "relevance");
  const results = searchRecipes("شاورما الدجاج");
  assert.ok(orderDiscovery(results, "views", "شاورما الدجاج")[0].views >= results[0].views);
});

test("ingredient display merges spelling variants without merging distinct milk or oils", () => {
  const options = uniqueIngredientOptions(["جبنه", "جبنة", "جبنه قريش", "جبنة قريش", "قرفة", "قرفه", "حليب", "حليب بودرة", "زيت", "زيت زيتون"]);
  assert.deepEqual(options.filter(x => x.startsWith("جبن")), ["جبنة", "جبنة قريش"]);
  for (const x of ["حليب", "حليب بودرة", "زيت", "زيت زيتون"]) assert.ok(options.includes(x));
  const r = recipes.find(r => r.slug === "chicken-negrisco")!;
  assert.equal(matchIngredients(r, ["جبنة"], []).have, matchIngredients(r, ["جبنه"], []).have);
});

test("passport correction preserves path identity and reviewed entries", () => {
  const path = TASTE_PATHS.find(p => p.slug === "chocolate-journey")!;
  assert.equal(path.title, "رحلة الحلويات المنزلية");
  assert.equal(path.steps[0].slug, "mango-ice-cream");
  assert.ok(path.steps.every(step => recipes.find(r => r.slug === step.slug)?.detail));
});
