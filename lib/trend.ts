import type { Recipe } from "./data";

// مؤشر الانتشار: بيعتمد على مشاهدات يوتيوب الموثقة عندنا + حداثة النشر (uploadedAt لما معروف).
// «ترند حديث» = نُشر قريب ووصل انتشار حقيقي. من غير تاريخ نشر بنعرض المشاهدات بس من غير شارة ترند.
const DAY = 86400000;

export type TrendInfo = {
  isTrending: boolean;
  isNew: boolean;
  uploadedAt?: string;
  daysAgo?: number;
  label?: string;
};

export function trendInfo(r: Recipe, now = new Date()): TrendInfo {
  const up = r.sources[0]?.uploadedAt;
  if (!up) return { isTrending: false, isNew: false };
  const t = Date.parse(up + "T00:00:00Z");
  if (Number.isNaN(t)) return { isTrending: false, isNew: false, uploadedAt: up };
  const daysAgo = Math.max(0, Math.floor((now.getTime() - t) / DAY));
  const isNew = daysAgo <= 120;
  const isTrending =
    (daysAgo <= 400 && r.views >= 150_000) ||
    (daysAgo <= 90 && r.views >= 80_000);
  const label = !isTrending
    ? undefined
    : daysAgo <= 120
      ? "🔥 ترند حديث"
      : "🔥 منتشر دلوقتي";
  return { isTrending, isNew, uploadedAt: up, daysAgo, label };
}

/** ترتيب «الأكثر انتشارًا حديثًا»: الترند الأحدث والأعلى مشاهدة الأول، وبعده الأعلى مشاهدة عمومًا. */
export function byTrend(a: Recipe, b: Recipe, now = new Date()): number {
  const ta = trendInfo(a, now);
  const tb = trendInfo(b, now);
  if (ta.isTrending !== tb.isTrending) return ta.isTrending ? -1 : 1;
  if (ta.isTrending && tb.isTrending) {
    const da = ta.daysAgo ?? 9999;
    const db = tb.daysAgo ?? 9999;
    if (da !== db) return da - db;
  }
  return b.views - a.views;
}

export function trendingNow(catalog: Recipe[], now = new Date(), limit = 8): Recipe[] {
  return catalog
    .filter((r) => trendInfo(r, now).isTrending)
    .sort((a, b) => byTrend(a, b, now))
    .slice(0, limit);
}

/**
 * «ورّيني الخطوة دي في الفيديو»: بنقدّر موضع الخطوة داخل الفيديو تناسبيًا
 * (الخطوة رقم i من n على مدة الفيديو الموثقة) ونرجع رابط يوتيوب بوقت بداية تقريبي.
 * التقدير تناسبي فقط وليس فهرسة زمنية من صاحب الفيديو — الواجهة بتوضح ده للمستخدم.
 */
export function stepVideoUrl(
  r: Recipe,
  stepIndex: number,
  stepCount: number,
): { url: string; minuteLabel: string } | null {
  const s = r.sources[0];
  if (!s || !s.durationSec || stepCount < 1) return null;
  const sec = Math.floor(((stepIndex + 0.5) / stepCount) * s.durationSec);
  if (sec <= 0) return null;
  const m = Math.floor(sec / 60);
  const rest = sec % 60;
  return {
    url: `https://www.youtube.com/watch?v=${s.ytId}&t=${sec}s`,
    minuteLabel: rest ? `${m}:${String(rest).padStart(2, "0")}` : `${m}:00`,
  };
}
