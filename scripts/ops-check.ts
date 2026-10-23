/**
 * فحص جاهزية التشغيل السحابي — آمن للتشغيل في أي بيئة.
 * لا يطبع أي قيمة سرية: يطبع الحالة والأطوال فقط.
 * التشغيل: npm run ops:check  (بيقرأ .env.local لو موجود)
 * ملحوظة: من بيئة ما بتوصلش لنيون شبكيًا هتلاقي الاتصال فشل رغم سلامة الإعدادات —
 * شغّله من جهازك أو من Vercel للتأكد النهائي.
 */
import { sql } from "drizzle-orm";
import { getDb, dbConfigured } from "../lib/db";
import { authConfigured } from "../lib/auth";

const ok = (b: boolean) => (b ? "✓" : "✗");
let failures = 0;
const line = (label: string, good: boolean, extra = "") => {
  if (!good) failures++;
  console.log(`${ok(good)} ${label}${extra ? ` — ${extra}` : ""}`);
};

console.log("== متغيرات البيئة (الحالة فقط، من غير قيم) ==");
const dbUrl = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
line(
  "DATABASE_URL / DATABASE_URL_POOLED",
  dbConfigured(),
  dbUrl
    ? `موجود (${/^postgres(ql)?:\/\//.test(dbUrl) ? "صيغة postgres" : "صيغة غير متوقعة!"})`
    : "مش موجود — الحسابات والإدارة هتفضل مقفولة",
);
line(
  "AUTH_SECRET قوي (32+ حرف ومش قيمة تجريبية)",
  authConfigured(),
  `الطول الحالي: ${(process.env.AUTH_SECRET || "").length}`,
);
line(
  "NEXT_PUBLIC_SITE_URL",
  !!process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_SITE_URL ? "موجود" : "اختياري محليًا، مطلوب للإنتاج",
);
line(
  "BLOB_READ_WRITE_TOKEN (صور تجارب الحسابات)",
  !!process.env.BLOB_READ_WRITE_TOKEN,
  process.env.BLOB_READ_WRITE_TOKEN ? "موجود" : "اختياري — من غيره صور الحساب مش هتترفع",
);
line(
  "YOUTUBE_API_KEY (تحديث المشاهدات من لوحة الإدارة)",
  !!process.env.YOUTUBE_API_KEY,
  process.env.YOUTUBE_API_KEY ? "موجود" : "اختياري — من غيره تحديث الأرقام مش هيشتغل",
);

async function main() {
  console.log("\n== الاتصال بقاعدة البيانات ==");
  const db = getDb();
if (!db) {
  line("إنشاء عميل قاعدة البيانات", false, "مفيش رابط قاعدة صالح");
} else {
  try {
    await db.execute(sql`select 1`);
    line("الاتصال بـ Neon", true);
    for (const t of ["recipes", "users", "kitchen_documents", "contact_reports", "recipe_reviews"]) {
      try {
        await db.execute(sql.raw(`select 1 from ${t} limit 1`));
        line(`جدول ${t}`, true);
      } catch {
        line(`جدول ${t}`, false, "مش موجود — شغّل npm run db:migrate");
      }
    }
    try {
      const rows = await db.execute(sql`select count(*)::int as n from recipes`);
      const n = (rows as unknown as { n: number }[])[0]?.n ?? 0;
      line("بيانات أولية مزروعة (recipes > 0)", n > 0, `عدد الصفوف: ${n} — لو صفر شغّل npm run db:seed`);
    } catch {
      line("قراءة عدد الوصفات", false);
    }
  } catch {
    line(
      "الاتصال بـ Neon",
      false,
      "فشل الاتصال: راجع الرابط أو الشبكة (الفحص ده لازم يتعمل من بيئة بتوصل لنيون)",
    );
  }
}

console.log(
  failures
    ? `\nالنتيجة: ${failures} نقطة محتاجة تصليح قبل ما الحسابات تفتح للعامة.`
    : "\nالنتيجة: كل الفحوصات عدّت — جرّب حساب فعلي وبلاغ من الموقع المنشور.",
);
process.exit(failures ? 1 : 0);
}
void main();
