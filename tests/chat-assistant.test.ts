import { test } from "node:test";
import assert from "node:assert/strict";
import { answerChat } from "../lib/chat-assistant";
import { recipes } from "../lib/data";

const reviewed = recipes.find(r => r.slug === "chicken-negrisco")!;
const video = recipes.find(r => !r.detail)!;

test("uses selected published recipe data for ingredients, quantities, steps and source link", () => {
  assert.ok(reviewed.detail);
  const answer = answerChat("ايه المقادير؟", recipes, reviewed.slug);
  const item = reviewed.detail!.ingredients[0].items[0];
  assert.equal(answer.recipeSlug, reviewed.slug);
  assert.ok(answer.text.includes(item.name) && answer.text.includes(item.display));
  assert.ok(answerChat("خطوات الوصفة", recipes, reviewed.slug).text.includes(reviewed.detail!.steps[0].body));
});

test("asks for recipe or suggests candidates rather than inventing an ambiguous answer", () => {
  assert.match(answerChat("المقادير", recipes).text, /اختار الوصفة/);
  const a = answerChat("مقادير البطاطس", recipes);
  assert.ok(a.recipeSlugs?.length);
  assert.equal(a.recipeSlug, undefined);
  assert.match(answerChat("مقادير xyzqnotfound123", recipes).text, /اختار الوصفة/);
});

test("does not invent ingredient list, missing ingredients or steps for video-only recipes", () => {
  assert.match(answerChat("المقادير", recipes, video.slug).text, /مش قائمة كاملة/);
  assert.match(answerChat("عندي دجاج وبصل", recipes, video.slug).text, /مش هقدر أحدد الناقص/);
  assert.match(answerChat("الخطوات", recipes, video.slug).text, /مش مكتوبة/);
});

test("missing comparison is conservative, includes quantities and warns that names are approximate", () => {
  const a = answerChat("عندي بصل، إيه الناقص؟", recipes, reviewed.slug).text;
  assert.match(a, /المقادير دي مش مؤكّد وجودها/);
  assert.match(a, /مطابقة تقريبية|المطابقة تقريبية/);
  assert.match(a, /مش ضمان للحساسية/);
  assert.match(answerChat("إيه الناقص؟", recipes, reviewed.slug).text, /اكتب الموجود عندك/);
});

test("substitutions are explicitly general, unknown substitutions are not invented, allergy questions are guarded", () => {
  assert.match(answerChat("بديل الحليب", recipes, reviewed.slug).text, /بدائل عامة/);
  assert.match(answerChat("ناقصني الحليب", recipes, reviewed.slug).text, /بدائل عامة/);
  assert.match(answerChat("بديل البصل", recipes, reviewed.slug).text, /مش بديل للبصل/);
  assert.match(answerChat("بديل المستكة", recipes, reviewed.slug).text, /مش لاقي بديل/);
  assert.match(answerChat("عندي حساسية من اللبن عايز بديل", recipes, reviewed.slug).text, /استشر مختصًا/);
});

test("recipe change by selection overrides a previous exact title and never reads out-of-catalog recipes", () => {
  const other = recipes.find(r => r.slug !== reviewed.slug)!;
  const a = answerChat(`مقادير ${reviewed.title}`, recipes, other.slug, true);
  assert.equal(a.recipeSlug, other.slug);
  assert.notEqual(answerChat("المقادير", [other], reviewed.slug).recipeSlug, reviewed.slug);
});
