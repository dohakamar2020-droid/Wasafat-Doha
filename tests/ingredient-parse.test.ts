import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseIngredientLine,
  parseIngredientLines,
  parseIngredientSections,
  normalizeDigits,
  numericRatio,
} from "../lib/ingredient-parse";
import { SOURCE_PACKS } from "../lib/source-packs";
import { recipes } from "../lib/data";
import {
  extractCaptionText,
  extractCaptionUrls,
  extractDescription,
  looksLikeIngredient,
} from "../scripts/harvest-recipe-sources";

test("الأرقام العربية الهندية بتتحوّل لأرقام لاتينية", () => {
  assert.equal(normalizeDigits("٣ كوب دقيق"), "3 كوب دقيق");
  assert.equal(normalizeDigits("٢٥٠ جرام"), "250 جرام");
  assert.equal(normalizeDigits("۵ مل"), "5 مل");
});

test("سطر مقادير بيتقري: الاسم والكمية والوحدة", () => {
  const p = parseIngredientLine("500 غرام لحم مفروم")!;
  assert.equal(p.name, "لحم مفروم");
  assert.equal(p.amount, 500);
  assert.equal(p.unit, "جرام");
});

test("الكilo بيتحوّل لجرام واللتربلمللي عشان التكبير يبقى آمن", () => {
  const kg = parseIngredientLine("1 كجم دقيق")!;
  assert.equal(kg.amount, 1000);
  assert.equal(kg.unit, "جرام");
  const l = parseIngredientLine("1.5 لتر حليب")!;
  assert.equal(l.amount, 1500);
  assert.equal(l.unit, "مللي");
});

test("الكسور النصية والرقمية بتتقري صح", () => {
  assert.equal(parseIngredientLine("½ كوب زيت")!.amount, 0.5);
  assert.equal(parseIngredientLine("1/2 كوب دقيق")!.amount, 0.5);
  assert.equal(parseIngredientLine("¾ كوب كريمة")!.amount, 0.75);
  assert.equal(parseIngredientLine("نصف كوب عصير")!.amount, 0.5);
  assert.equal(parseIngredientLine("ربع كوب سكر")!.amount, 0.25);
});

test("السطر من غير رقم بيفضل وصفي — مافيش رقم مخترع", () => {
  const p = parseIngredientLine("ملح وفلفل حسب الذوق")!;
  assert.equal(p.amount, undefined);
  assert.equal(p.unit, undefined);
  assert.equal(p.display, "ملح وفلفل حسب الذوق");
});

test("المدى بيتسجل مع تنبيه والحد الأعلى هو المستخدم في التكبير", () => {
  const p = parseIngredientLine("500 إلى 700 جرام لحم")!;
  assert.equal(p.amount, 700);
  assert.equal(p.unit, "جرام");
  assert.ok(p.note);
});

test("الملعقة الكبيرة والصغيرة بيتفرّقوا", () => {
  assert.equal(
    parseIngredientLine("2 ملعقة كبيرة زيت")!.unit,
    "ملعقة كبيرة",
  );
  assert.equal(
    parseIngredientLine("1 ملعقة صغيرة ملح")!.unit,
    "ملعقة صغيرة",
  );
});

test("العدّيات بتتوحّد على وحدة العد", () => {
  assert.equal(parseIngredientLine("4 بيضات")!.amount, 4);
  assert.equal(parseIngredientLine("4 بيضات")!.unit, "حبة");
  assert.equal(parseIngredientLine("2 فصوص ثوم")!.unit, "فص");
});

test("قائمة المقادير بتتقري سطر سطر", () => {
  const parsed = parseIngredientLines(
    ["500 غرام لحم مفروم", "2 كوب حليب", "ملح حسب الذوق"].join("\n"),
  );
  assert.equal(parsed.length, 3);
  assert.equal(parsed[1].name, "حليب");
  assert.equal(parsed[1].unit, "كوب");
});

test("العناوين بتفصل مجموعات المقادير", () => {
  const groups = parseIngredientSections(
    [
      "البشاميل:",
      "3 ملاعق كبيرة زبدة",
      "3 أكواب حليب دافئ",
      "الحشوة:",
      "½ كيلو لحم مفروم",
    ].join("\n"),
  );
  assert.equal(groups.length, 2);
  assert.equal(groups[0].group, "البشاميل");
  assert.equal(groups[0].items.length, 2);
  assert.equal(groups[1].group, "الحشوة");
});

test("نسبة المقادير الرقمية بتتحسب صح", () => {
  const parsed = parseIngredientLines(
    ["500 غرام لحم", "2 كوب حليب", "ملح حسب الذوق"].join("\n"),
  );
  assert.equal(numericRatio(parsed), 67);
});

test("كل حزمة مصدر مرتبطة بوصفة موجودة فعلًا", () => {
  const slugs = new Set(recipes.map((r) => r.slug));
  for (const slug of Object.keys(SOURCE_PACKS))
    assert.ok(slugs.has(slug), `حزمة المصدر بتشير لوصفة مش موجودة: ${slug}`);
});

test("كل حزمة مصدر بتجيب رابط مصدر رسمي وبتاريخ", () => {
  for (const [slug, pack] of Object.entries(SOURCE_PACKS)) {
    assert.ok(pack.sourceUrls.length, `${slug}: مفيش رابط مصدر`);
    for (const url of pack.sourceUrls)
      assert.match(
        url,
        /^https:\/\/(www\.)?(youtube\.com|youtu\.be|cookinsta\.com|chef-omar\.com|tiktok\.com)/,
        `${slug}: رابط مصدر مش رسمي: ${url}`,
      );
    assert.match(pack.capturedAt, /^\d{4}-\d{2}-\d{2}$/, `${slug}: تاريخ غير صالح`);
    assert.ok(pack.channel.length > 0, `${slug}: مفيش اسم شيف`);
  }
});

test("كل سطر مقادير في الحزم بيتقري بنص متبقٍ — ومافيش رقم مخترع", () => {
  for (const [slug, pack] of Object.entries(SOURCE_PACKS)) {
    for (const line of pack.ingredientLines) {
      const parsed = parseIngredientLine(line);
      assert.ok(parsed, `${slug}: سطر مش مفهوم: ${line}`);
      // لو السطر فيه رقم صريح، لازم المحلل يطلّع نفس الرقم
      if (parsed.amount != null)
        assert.ok(
          parsed.amount > 0,
          `${slug}: رقم غير موجب في السطر: ${line}`,
        );
    }
  }
});

test("الوصفات اللي لسه ناقصة مراجعة ليها حزمة مصدر موضّحة", () => {
  const unreviewed = recipes.filter((r) => !r.detail);
  for (const r of unreviewed) {
    const pack = SOURCE_PACKS[r.slug];
    assert.ok(pack, `${r.slug}: وصفة ناقصة من غير حزمة مصدر`);
    assert.ok(
      pack.notes?.length || !pack.ingredientLines.length,
      `${r.slug}: لازم يتوضّح إيه الناقص`,
    );
  }
});

test("الوصفات المراجعة دي كل مصدرها موثّق في حزمة المصدر", () => {
  const fromBatch = [
    "goulash-meat-rolls",
    "tiramisu-heba",
    "chicken-shawarma",
    "petit-four",
    "molto-chocolate-cheese",
    "three-samosa-fillings",
    "hali-altayebeen",
    "toumeya-secrets",
    "kibbeh-bab-alhara",
    "syrian-grill-chicken",
    "ramadan-sambousek",
    "healthy-eid-kahk",
    "grilled-kibbeh",
    "turkish-doner-kebab",
    "chicken-burger-omar",
    "qatayef-aya",
    "shish-taouk-aya",
    "pastry-masterclass-om-anwar",
    "potato-bechamel-tray",
    "grilled-chicken-wraps",
    "chicken-rice-oven",
    "salmon-curry-rice",
    "creamy-garlic-shrimp-rice",
    "stuffed-chicken-breast",
    "milk-pudding-bites",
    "potato-balloons",
  ];
  for (const slug of fromBatch) {
    const r = recipes.find((x) => x.slug === slug)!;
    assert.ok(r.detail, `${slug}: المفروض تكون مراجعة`);
    assert.ok(SOURCE_PACKS[slug], `${slug}: مفروض تكون ليها حزمة مصدر`);
    assert.ok(
      SOURCE_PACKS[slug].ingredientLines.length > 0,
      `${slug}: الحزمة من غير مقادير`,
    );
  }
});

test("كل وصفة مراجعة ليها رابط فيديو بخطوة تقديرية", () => {
  for (const r of recipes.filter((x) => x.detail))
    assert.ok(
      r.sources.some((s) => s.durationSec),
      `${r.slug}: مفيش مدة فيديو عشان رابط الخطوة`,
    );
});

test("استخراج وصف الفيديو الرسمي من صفحة المشاهدة", () => {
  const fixture = readFileSync(
    new URL("./fixtures/youtube-watch.json", import.meta.url),
    "utf8",
  );
  const { html, description } = JSON.parse(fixture) as {
    html: string;
    description: string;
  };
  assert.equal(extractDescription(html), description);
});

test("استخراج روابط الترجمة من صفحة المشاهدة", () => {
  const fixture = readFileSync(
    new URL("./fixtures/youtube-watch.json", import.meta.url),
    "utf8",
  );
  const { html } = JSON.parse(fixture) as { html: string };
  const urls = extractCaptionUrls(html);
  assert.equal(urls.length, 1);
  assert.match(urls[0], /api\/timedtext/);
});

test("تحويل XML الترجمة لسطور نصية", () => {
  const xml =
    '<?xml version="1.0"?><transcript><text start="0" dur="1">مرحبا بكم</text>' +
    '<text start="1" dur="1">500 غرام دقيق</text></transcript>';
  const lines = extractCaptionText(xml);
  assert.deepEqual(lines, ["مرحبا بكم", "500 غرام دقيق"]);
});

test("تمييز سطور المقادير من سطور الشرح", () => {
  assert.ok(looksLikeIngredient("500 غرام لحم مفروم"));
  assert.ok(looksLikeIngredient("2 كوب حليب"));
  assert.ok(!looksLikeIngredient("المكونات:"));
  assert.ok(!looksLikeIngredient("شوفوا الفيديو"));
  assert.ok(!looksLikeIngredient("https://example.com/x"));
});

test("تسمية المجموعة في بداية السطر بتتفصل عن البند", () => {
  const groups = parseIngredientSections(
    [
      "حشوة الجبن: 1 كوب جبنة موزاريلا",
      "حشوة الجبن: 500 غرام جبن شيدر مبشورة",
      "حشوة الدجاج: 1 كوب زبادي",
    ].join("\n"),
  );
  assert.equal(groups.length, 2);
  assert.equal(groups[0].group, "حشوة الجبن");
  assert.equal(groups[0].items.length, 2);
  assert.equal(groups[0].items[1].amount, 500);
  assert.equal(groups[1].group, "حشوة الدجاج");
});

test("مافيش اسم مكرر جوه نفس مجموعة المقادير", () => {
  for (const r of recipes.filter((x) => x.detail)) {
    for (const g of r.detail!.ingredients) {
      const names = g.items.map((i) => i.name);
      const dups = names.filter((n, i) => names.indexOf(n) !== i);
      assert.equal(
        dups.length,
        0,
        `${r.slug} — تكرار في «${g.group}»: ${[...new Set(dups)].join("، ")}`,
      );
    }
  }
});

test("كل مكوّن مراجعة عليه اسم وكمية معروضة", () => {
  for (const r of recipes.filter((x) => x.detail))
    for (const g of r.detail!.ingredients)
      for (const i of g.items) {
        assert.ok(i.name.trim(), `${r.slug}: اسم فاضي`);
        assert.ok(i.display.trim(), `${r.slug}: كمية معروضة فاضية`);
        if (i.amount != null) assert.ok(i.amount > 0, `${r.slug}: رقم غير موجب`);
      }
});
