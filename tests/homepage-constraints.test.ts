import { test } from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
const { createElement } = React;
// The test runner transpiles JSX in preserve mode; Next supplies this at build time.
Object.assign(globalThis, { React });
import { renderToStaticMarkup } from "react-dom/server";
import { RecipeCard, ShortCard } from "../components/ui";
import { creators, recipes } from "../lib/data";
import { discoverySort, orderDiscovery } from "../lib/discovery-order";
import { byTrend, trendingNow } from "../lib/trend";
import { recipeCardReason } from "../lib/recipe-card-copy";

const stale = recipes.find(r => r.slug === "date-oat-energy-balls")!;

test("reviewed card never displays the known outdated video-only disclaimer", () => {
  assert.ok(stale.detail);
  assert.match(stale.why, /ترشيح فيديو/);
  assert.doesNotMatch(recipeCardReason(stale, stale.why)!, /ترشيح فيديو/);
  assert.match(recipeCardReason(stale, stale.why)!, /ثلاث نكهات/);
  const html = renderToStaticMarkup(createElement(RecipeCard, { r: stale, reason: stale.why }));
  assert.match(html, /مقادير وخطوات/);
  assert.doesNotMatch(html, /ترشيح فيديو/);
  const video = { ...stale, detail: undefined };
  assert.equal(recipeCardReason(video, video.why), video.why);
  assert.match(renderToStaticMarkup(createElement(RecipeCard, { r: video, reason: video.why })), /ترشيح فيديو/);
  assert.equal(recipeCardReason(stale, "سبب تحريري مستقل"), "سبب تحريري مستقل");
});

test("trending deep link selects trend comparator and agrees with homepage trend ordering", () => {
  assert.equal(discoverySort("trend", ""), "trend");
  const ordered = orderDiscovery(recipes, discoverySort("trend", ""), "");
  assert.deepEqual(ordered.map(r => r.slug), [...recipes].sort(byTrend).map(r => r.slug));
  assert.deepEqual(ordered.slice(0, trendingNow(recipes).length).map(r => r.slug), trendingNow(recipes).map(r => r.slug));
});

test("rendered card image, title and creator links have distinct intended destinations", () => {
  const r = recipes.find(r => r.sources.some(s => s.kind === "short"))!;
  const html = renderToStaticMarkup(createElement(RecipeCard, { r }));
  assert.match(html, new RegExp(`<a aria-label="[^"]+" href="/recipes/${r.slug}"><img`));
  assert.match(html, new RegExp(`<a class="card-title" href="/recipes/${r.slug}">`));
  assert.match(html, new RegExp(`<a class="chef-link" href="/creators/${r.creatorId}">`));
  assert.ok(creators.some(c => c.id === r.creatorId));
  assert.match(html, /<button[^>]+aria-label="حفظ/);
  assert.match(html, /<button[^>]+aria-label="إخفاء/);
  const short = renderToStaticMarkup(createElement(ShortCard, { r }));
  assert.match(short, new RegExp(`<a aria-label="[^"]+" href="/watch\\?start=${encodeURIComponent(r.slug)}"><img`));
  assert.match(short, new RegExp(`<a class="short-title" href="/recipes/${r.slug}">`));
});
