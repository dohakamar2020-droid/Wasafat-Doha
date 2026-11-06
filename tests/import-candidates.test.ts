import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { recipes, creators, collections } from "../lib/data";
import { IMPORT_CANDIDATES, IMPORT_CREATORS } from "../lib/import-candidates";

test("ملف الاستيراد يضيف فيديوهات فقط دون اعتماد مقادير أو أوقات غير مراجعة", () => {
  assert.equal(IMPORT_CANDIDATES.length, 96);
  assert.equal(new Set(IMPORT_CREATORS.map((c) => c.id)).size, IMPORT_CREATORS.length);
  for (const r of IMPORT_CANDIDATES) {
    const published = recipes.find((item) => item.slug === r.slug);
    assert.ok(published && published.status === "video" && !published.detail && !published.totalMinutes, r.slug);
    assert.ok(creators.some((c) => c.id === r.creatorId), r.slug);
    assert.equal(r.sources.length, 1);
    assert.match(r.sources[0].ytId, /^[\w-]{11}$/);
  }
});
test("المجموعات الجديدة وسجل كل صفوف الملف متصلان", () => {
  for (const slug of ["new-dubai-sweets", "new-world-bakes", "new-breakfast-ideas"]) {
    const collection = collections.find((c) => c.slug === slug);
    assert.ok(collection && collection.recipeSlugs.length);
    assert.ok(collection.recipeSlugs.every((id) => recipes.some((r) => r.slug === id)));
  }
  const audit = readFileSync("docs/import-2026-audit.md", "utf8");
  assert.equal((audit.match(/^\| \d+ \|/gm) || []).length, 106);
  assert.equal((audit.match(/بحاجة لمصدر يوتيوب مناسب ومراجعة/g) || []).length, 2);
});


test("مصادر المعلقات الأقرب تحفظ اختلافاتها ولا تدعي تفاصيل غير مثبتة", () => {
  const expected = [
    ["pickle-brined-chicken-rice", "z1BRFIFTBXM"],
    ["iced-spanish-saffron-latte", "D78yS7LERqo"],
    ["halloumi-date-beet-salad", "V3YUbFOlKOg"],
    ["chicken-chashu-yakiniku", "nuReAXUFLmw"],
  ];
  for (const [slug, video] of expected) {
    const r = IMPORT_CANDIDATES.find((item) => item.slug === slug);
    assert.ok(r && r.sources[0].ytId === video && r.why.includes("ترشيح فيديو"), slug);
  }
});
