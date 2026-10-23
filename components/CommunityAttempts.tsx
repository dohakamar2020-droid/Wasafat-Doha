"use client";
import { useStored } from "./useStored";
import type { Attempt } from "@/lib/kitchen-state";

// «تجارب اللي جرّبوا»: مشاركة اختيارية. التجربة بتتسجل على جهاز صاحبها،
// ولا تظهر هنا إلا لو علّم «شارك تجربتي» بنفسه. النشر العام بين الأجهزة
// يحتاج حسابًا وقاعدة بيانات مهيأة — الواجهة ما بتوعدش بغير اللي بيحصل فعلًا.
export default function CommunityAttempts({ slug }: { slug: string }) {
  const [attempts] = useStored<Attempt[]>("wasafat-Doha:attempts", []);
  const mine = attempts.filter((a) => a.slug === slug && a.public);
  return (
    <section className="surface" aria-labelledby="attempts-h">
      <h2 id="attempts-h">تجارب اللي جرّبوا 🍽️</h2>
      {mine.length ? (
        <div className="attempt-list">
          {mine.map((a) => (
            <article key={a.id} className="attempt-card">
              <p>{a.note || "جرّبتها!"}</p>
              <span style={{ color: "var(--muted)" }}>
                {a.rating ? `تقييمي: ${"⭐".repeat(a.rating)} · ` : ""}
                {new Date(a.at).toLocaleDateString("ar-EG")} · تجربة مشتركة من
                جهازك
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--muted)" }}>
          لسه مفيش تجارب مشتركة للوصفة دي على الجهاز ده. جرّبها وسجّل تجربتك من
          «مطبخي» أو من زرار التجربة، وعلّم «شارك تجربتي» لو حابب تظهر هنا.
          المشاركة اختيارية تمامًا، والنشر بين الأجهزة بيحتاج حسابًا مسجلًا.
        </p>
      )}
    </section>
  );
}
