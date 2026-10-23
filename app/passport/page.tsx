"use client";
import Link from "next/link";
import { useCatalog } from "@/components/CatalogProvider";
import { RecipeCard } from "@/components/ui";
import { useStored } from "@/components/useStored";
import type { Attempt } from "@/lib/kitchen-state";
import { TASTE_PATHS, pathProgress } from "@/lib/passport";

// «جواز سفر المذاق»: كل ختم = وصفة جرّبها اليوزر فعلًا (تجربة مسجلة
// بتاريخها أو تعليم «عملتها»). المسارات من وصفات مراجعة بس عشان
// التدرّج يبقى حقيقي: بداية سهلة ← تجربة مختلفة ← طبق مناسبة.

export default function PassportPage() {
  const catalog = useCatalog();
  const [attempts] = useStored<Attempt[]>("wasafat-Doha:attempts", []);
  const [done] = useStored<string[]>("wasafat-Doha:done", []);
  const cooked = [...new Set([...done, ...attempts.map((a) => a.slug)])];
  const attemptAt = (slug: string) =>
    attempts.find((a) => a.slug === slug)?.at;
  const totalStamps = TASTE_PATHS.reduce(
    (n, p) =>
      n + p.steps.filter((s) => cooked.includes(s.slug)).length,
    0,
  );
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">🛂 جواز سفر المذاق</span>
        <h1>رحلة طبخك بتتكوّن</h1>
        <p>
          كل مسار 3 وصفات مراجعة بتدرّج واضح: بداية سهلة، تجربة مختلفة،
          وبعده طبق مناسبة. كل وصفة تجرّبها وتسجلها بتتختم في جوازك
          بتاريخها — عندك {totalStamps} ختم لحد دلوقتي.
        </p>
      </div>
      {TASTE_PATHS.map((path) => {
        const prog = pathProgress(path, cooked);
        return (
          <section className="surface passport-path" key={path.slug}>
            <h2>
              {path.title}{" "}
              <span className="tag tag-need">
                {prog.doneSlugs.length}/3
                {prog.complete ? " — المسار اكتمل 🎉" : ""}
              </span>
            </h2>
            <p style={{ color: "var(--muted)" }}>{path.desc}</p>
            <ol className="passport-steps">
              {path.steps.map((s, i) => {
                const got = cooked.includes(s.slug);
                const at = attemptAt(s.slug);
                const r = catalog.find((x) => x.slug === s.slug);
                return (
                  <li key={s.slug} className={got ? "stamped" : ""}>
                    <span className="stamp-mark" aria-hidden="true">
                      {got ? "✓" : i + 1}
                    </span>
                    <div>
                      <b>{s.level}</b> —{" "}
                      <Link className="text-link" href={`/recipes/${s.slug}`}>
                        {r?.title || s.slug}
                      </Link>
                      {got && (
                        <span className="results-note">
                          {" "}
                          · اتختمت
                          {at
                            ? ` في ${new Date(at).toLocaleDateString("ar-EG")}`
                            : ""}
                        </span>
                      )}
                      {!got && prog.nextSlug === s.slug && (
                        <span className="tag" style={{ marginInlineStart: 8 }}>
                          محطتك الجاية
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {!prog.complete && prog.nextSlug && (
              <div style={{ marginTop: 12 }}>
                {(() => {
                  const next = catalog.find((x) => x.slug === prog.nextSlug);
                  return next ? (
                    <div className="grid">
                      <RecipeCard
                        r={next}
                        reason="المحطة الجاية في مسارك — جرّبها واختمها"
                      />
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </section>
        );
      })}
      <p className="results-note">
        الأختام من تجاربك المسجلة في «دفتر تجربتي» — سجّل تجربة لأي وصفة
        من صفحتها وهتلاقي ختمها هنا تلقائيًا.
      </p>
    </div>
  );
}
