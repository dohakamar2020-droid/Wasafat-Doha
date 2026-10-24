/**
 * حصاد حزم المصادر الرسمية للوصفات اللي ناقصة مراجعة.
 *
 * التشغيل: npm run harvest:sources -- [slug ...]
 *   - بدون slug: بيحصّد كل الوصفات اللي ليها حزمة في `lib/source-packs.ts`.
 *   - مع slug: بيحصّد الوصفة دي بس.
 *
 * السكربت بيقرا من المصدر الرسمي فقط:
 *   1. وصف الفيديو على يوتيوب (أول رابط في الحزمة).
 *   2. ترانسكريبت الفيديو لو متاح (من العنصر المضمّن في صفحة يوتيوب).
 *   3. بطاقة وصفة الشيف على كوك إنستا (لو موجودة في الحزمة).
 *
 * ⚠ محتاج شبكة. لو الشبكة مش متاحة بيرجع بأمان من غير ما يكسر حاجة.
 * ⚠ مافيش أي رقم مخترع: اللي بيتقرا من الصفحة بيتكتب كما هو.
 * ⚠ الناتج بيتبعت في `data/source-harvest/` — ده خام ومAutomatic،
 *   والنسخة المعتمدةedited بتفضل في `lib/source-packs.ts` (مراجعة يدوية).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCE_PACKS, type SourcePack } from "../lib/source-packs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "data", "source-harvest");

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, "accept-language": "ar,en;q=0.8" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** استخراج وصف الفيديو الرسمي من صفحة المشاهدة. */
export function extractDescription(html: string): string | null {
  const m = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  try {
    return JSON.parse(`"${m[1]}"`) as string;
  } catch {
    return null;
  }
}

/** استخراج روابط الترجمة (caption tracks) من صفحة المشاهدة. */
export function extractCaptionUrls(html: string): string[] {
  const urls: string[] = [];
  const re = /"baseUrl":"((?:[^"\\]|\\.)*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const url = JSON.parse(`"${m[1]}"`) as string;
      if (url.includes("/api/timedtext")) urls.push(url);
    } catch {
      /* تجاهل */
    }
  }
  return [...new Set(urls)];
}

/** تحويل XML الترجمة (timedtext) لسطور نصية. */
export function extractCaptionText(xml: string): string[] {
  const out: string[] = [];
  const re = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const text = m[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    if (text) out.push(text);
  }
  return out;
}

/** سطر يشبه بند مقادير (بتبدأ برقم أو «½» إلخ). */
export function looksLikeIngredient(line: string): boolean {
  const t = line.trim();
  if (t.length < 3 || t.length > 140) return false;
  if (/^(https?:|@\S+)/i.test(t)) return false;
  return /^(\d+([.,]\d+)?|[½¼¾⅓⅔]|\d+\s*[\/\\]\s*\d+)/.test(t);
}

export type Harvest = {
  slug: string;
  ytId: string;
  harvestedAt: string;
  sourceUrl: string;
  descriptionLines: string[];
  descriptionIngredients: string[];
  transcriptLines: string[];
  recipePageIngredients: string[];
  errors: string[];
};

async function harvest(pack: SourcePack): Promise<Harvest> {
  const errors: string[] = [];
  let descriptionLines: string[] = [];
  let descriptionIngredients: string[] = [];
  let transcriptLines: string[] = [];
  const recipePageIngredients: string[] = [];
  const videoUrl =
    pack.sourceUrls.find((u) => u.includes("youtube.com")) || "";

  if (videoUrl) {
    const html = await fetchText(videoUrl);
    if (!html) {
      errors.push("تعذّر تحميل صفحة يوتيوب (شبكة أو حجب).");
    } else {
      const desc = extractDescription(html);
      if (desc) {
        descriptionLines = desc
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        descriptionIngredients = descriptionLines.filter(looksLikeIngredient);
      } else {
        errors.push("ما لقيناش وصف الفيديو في الصفحة.");
      }
      const capUrls = extractCaptionUrls(html);
      if (capUrls.length) {
        const xml = await fetchText(capUrls[0]);
        if (xml) transcriptLines = extractCaptionText(xml);
        else errors.push("ما قدرناش نجيب الترجمة.");
      } else {
        errors.push("الفيديو مفيهوش ترانسكريبت مضمّن في الصفحة.");
      }
    }
  }

  for (const url of pack.sourceUrls.filter(
    (u) => u.includes("cookinsta.com/recipe/") && !u.includes("youtube.com"),
  )) {
    const html = await fetchText(url);
    if (!html) {
      errors.push(`تعذّر تحميل بطاقة الوصفة: ${url}`);
      continue;
    }
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, "\n")
      .split(/\n+/)
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    recipePageIngredients.push(...text.filter(looksLikeIngredient));
  }

  return {
    slug: pack.slug,
    ytId: pack.ytId,
    harvestedAt: new Date().toISOString(),
    sourceUrl: videoUrl,
    descriptionLines,
    descriptionIngredients,
    transcriptLines,
    recipePageIngredients,
    errors,
  };
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const targets = args.length
    ? args.map((a) => SOURCE_PACKS[a]).filter(Boolean)
    : Object.values(SOURCE_PACKS);
  if (!targets.length) {
    console.log("مفيش حزم للحصاد.");
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });
  for (const pack of targets) {
    process.stdout.write(`⬇ ${pack.slug} … `);
    const result = await harvest(pack);
    await writeFile(
      join(OUT_DIR, `${pack.slug}.json`),
      JSON.stringify(result, null, 2),
      "utf8",
    );
    console.log(
      `وصف: ${result.descriptionIngredients.length} بند، ترانسكريبت: ${result.transcriptLines.length} سطر` +
        (result.errors.length ? ` — ${result.errors.length} تنبيه` : ""),
    );
    for (const e of result.errors) console.log(`   ⚠ ${e}`);
  }
  console.log(`\n✔ الخام اتحفظ في data/source-harvest/`);
}

// التشغيل بس لما السكربت يتنفذ مباشرة (مش لما يتستورد في اختبار)
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop()!))
  main().catch((e) => {
    console.error("❌ فشل الحصاد:", e?.message || e);
    process.exit(1);
  });
