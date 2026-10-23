"use client";
import type { Recipe } from "@/lib/data";
import type { Attempt } from "@/lib/kitchen-state";
import { trendInfo } from "@/lib/trend";
import { useStored } from "./useStored";

export const VERDICT_LABELS: Record<string, string> = {
  worth: "تستاهل الضجة",
  "tasty-slow": "حلوة بس تجهيزها طويل",
  fixed: "نجحت بعد تعديل",
  skip: "مش هكررها",
};

// «الترند تحت التجربة»: البطاقة بتتملى من تجارب بيوت حقيقية مسجلة هنا
// بس — تجاربك انت على الجهاز ده (أو حسابك). مفيش أحكام جاهزة من عندنا:
// لو محدش جربها، بنقول كده صراحة.
export default function TrialCard({ r }: { r: Recipe }) {
  const [attempts] = useStored<Attempt[]>("wasafat-Doha:attempts", []);
  const mine = attempts.filter((a) => a.slug === r.slug);
  const trend = trendInfo(r);
  if (!trend.isTrending && !mine.length) return null;
  const latest = mine[0];
  return (
    <section className="surface trial-card" aria-labelledby="trial-h">
      <h2 id="trial-h">الترند تحت التجربة 🔬</h2>
      {latest ? (
        <>
          <p style={{ marginTop: 4 }}>
            آخر تجربة بيتية متسجلة عندك (
            {new Date(latest.at).toLocaleDateString("ar-EG")}
            {mine.length > 1 ? ` — من ${mine.length} تجارب` : ""}):
          </p>
          <div className="info-grid">
            {latest.actualMinutes ? (
              <div className="info-cell">
                <span>الوقت الفعلي في مطبخك</span>
                <b>
                  {latest.actualMinutes} دقيقة
                  {r.totalMinutes
                    ? ` (الموثق من المصدر ${r.totalMinutes})`
                    : ""}
                </b>
              </div>
            ) : null}
            {latest.verdict ? (
              <div className="info-cell">
                <span>حكم التجربة</span>
                <b>{VERDICT_LABELS[latest.verdict] || latest.verdict}</b>
              </div>
            ) : null}
            {latest.hardest ? (
              <div className="info-cell">
                <span>أصعب نقطة</span>
                <b>{latest.hardest}</b>
              </div>
            ) : null}
            {latest.verdictFor ? (
              <div className="info-cell">
                <span>تترشح لمين</span>
                <b>{latest.verdictFor}</b>
              </div>
            ) : null}
          </div>
          {latest.note && <p>{latest.note}</p>}
          <p className="results-note">
            دي شهادة مطبخك انت — سجّل تجربة جديدة من «سجّل تجربة» فوق
            وحدّث الحكم بعد كل مرة.
          </p>
        </>
      ) : (
        <p>
          الوصفة دي منتشرة ({trend.label})، بس لسه محدش سجّل لها تجربة
          بيتية هنا. كن أول واحد يحكم عليها من مطبخ عادي: جرّبها وسجّل
          وقتك الفعلي وأصعب نقطة وحكمك من «سجّل تجربة».
        </p>
      )}
    </section>
  );
}
