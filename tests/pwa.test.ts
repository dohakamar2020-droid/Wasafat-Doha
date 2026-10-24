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

test("ثبّت التطبيق: الزرار بيستخدم واجهة التثبيت الحقيقية ويكبر لما يتداس عليه", () => {
  const src = readFileSync("components/InstallApp.tsx", "utf8");
  assert.match(src, /beforeinstallprompt/);
  assert.match(src, /appinstalled/);
  assert.match(src, /display-mode: standalone/);
  // يبدأ مطويًا (صغير) ويكبر بالضغط مع إمكانية التصغير
  assert.match(src, /const \[expanded, setExpanded\] = useState\(false\)/);
  assert.match(src, /className="install-fab"/);
  assert.match(src, /onClick=\{\(\) => setExpanded\(true\)\}/);
  assert.match(src, /onClick=\{\(\) => setExpanded\(false\)\}/);
  // آيفون مالوش تثبيت برمجي — لازم تعليمات شير مش وعد كاذب
  assert.match(src, /أضف\s*\n?\s*إلى الشاشة الرئيسية/);
  assert.match(src, /ثبّت تطبيق وصفات قمر/);
});

test("ثبّت التطبيق: عائم ومش ثابت جوه الصفحات وفوق الناف بار السفلي بدون تداخل", () => {
  const pageSrc = readFileSync("app/page.tsx", "utf8");
  const featSrc = readFileSync("app/features/page.tsx", "utf8");
  const layoutSrc = readFileSync("app/layout.tsx", "utf8");
  const cssSrc = readFileSync("app/globals.css", "utf8");

  // مش موجود بشكل ثابت جوه الصفحات أو الفوتر
  assert.doesNotMatch(pageSrc, /InstallApp/);
  assert.doesNotMatch(featSrc, /InstallApp/);
  assert.doesNotMatch(layoutSrc, /<footer[\s\S]*?<InstallApp[\s\S]*?<\/footer>/);

  // متوصل مرة واحدة كزرار عائم على مستوى اللآي أوت
  assert.match(layoutSrc, /<InstallApp \/>/);

  // CSS: عائم (fixed)، صغير في الحالة المطوية، ومرفوع فوق الـ bottombar عالـموبايل (104px > ارتفاع الـ bottombar)
  assert.match(cssSrc, /\.install-float\s*\{[\s\S]*?position:\s*fixed/);
  assert.match(cssSrc, /\.install-fab\s*\{[\s\S]*?width:\s*48px;\s*height:\s*48px/);
  assert.match(
    cssSrc,
    /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?\.install-float[\s\S]*?bottom:\s*calc\(104px\s*\+\s*env\(safe-area-inset-bottom,\s*0px\)\)/,
  );
});
