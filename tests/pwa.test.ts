import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync("public/manifest.webmanifest", "utf8"),
);

test("ثبّت التطبيق: المانيفست بهوية وصفات قمر وأيقونات PNG حقيقية", () => {
  assert.equal(manifest.name, "وصفات قمر");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.dir, "rtl");
  assert.equal(manifest.theme_color, "#34483D");
  assert.equal(manifest.background_color, "#F8F5EE");
  const pngs = manifest.icons.filter(
    (i: { type: string }) => i.type === "image/png",
  );
  assert.ok(pngs.some((i: { sizes: string }) => i.sizes === "192x192"));
  assert.ok(pngs.some((i: { sizes: string }) => i.sizes === "512x512"));
  assert.ok(
    pngs.some((i: { purpose: string }) => i.purpose === "maskable"),
    "لازم أيقونة maskable لأندرويد",
  );
  for (const icon of pngs) {
    const path = `public${icon.src}`;
    assert.ok(existsSync(path), `${path} لازم تكون مولّدة وموجودة`);
    const buf = readFileSync(path);
    // توقيع PNG + الأبعاد من IHDR
    assert.equal(buf.subarray(1, 4).toString(), "PNG");
    const w = buf.readUInt32BE(16),
      h = buf.readUInt32BE(20);
    const [ew, eh] = icon.sizes.split("x").map(Number);
    assert.equal(w, ew, `${icon.src} العرض`);
    assert.equal(h, eh, `${icon.src} الارتفاع`);
  }
  assert.ok(existsSync("public/icons/apple-touch-icon.png"));
});

test("ثبّت التطبيق: الزرار بيستخدم واجهة التثبيت الحقيقية وبدائل صادقة", () => {
  const src = readFileSync("components/InstallApp.tsx", "utf8");
  assert.match(src, /beforeinstallprompt/);
  assert.match(src, /appinstalled/);
  assert.match(src, /display-mode: standalone/);
  // آيفون مالوش تثبيت برمجي — لازم تعليمات شير مش وعد كاذب
  assert.match(src, /أضف\s*\n?\s*إلى الشاشة الرئيسية/);
  assert.match(src, /ثبّت تطبيق وصفات قمر/);
});

test("ثبّت التطبيق: متوصل في أماكن ظاهرة (رئيسية/مزايا/فوتر)", () => {
  assert.match(readFileSync("app/page.tsx", "utf8"), /<InstallApp \/>/);
  assert.match(
    readFileSync("app/features/page.tsx", "utf8"),
    /<InstallApp \/>/,
  );
  assert.match(
    readFileSync("app/layout.tsx", "utf8"),
    /<InstallApp variant="slim" \/>/,
  );
});
