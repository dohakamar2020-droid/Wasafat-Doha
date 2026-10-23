"use client";
import Link from "next/link";
import { useCatalog } from "./CatalogProvider";
import { useStored } from "./useStored";
import { localKitchen } from "@/lib/local-kitchen";
import { shoppingLines, shoppingLabel } from "@/lib/experience";
import { storageSet } from "@/lib/storage";
import { useState } from "react";

// «أسبوعي أنا»: خطة 7 أيام بيبنيها المستخدم من محفوظاته، وبتتحفظ على جهازه
// (وبتتزامن مع حسابه ضمن حالة المطبخ لو دخل). التسوق بيتبني من الوصفات المكتملة بس.
export const DAYS = ["السبت", "الأحد", "الاتنين", "التلات", "الأربع", "الخميس", "الجمعة"];
export const MY_WEEK_KEY = "wasafat-Doha:my-week";

export default function MyWeek() {
  const catalog = useCatalog();
  const [week, setWeek] = useStored<Record<string, string>>(MY_WEEK_KEY, {});
  const [saved] = useStored<string[]>("wasafat-Doha:saved", []);
  const [msg, setMsg] = useState("");
  const byId = (slug?: string) => catalog.find((r) => r.slug === slug);
  const plannedRecipes = DAYS.map((d) => byId(week[d])).filter(
    (r): r is NonNullable<typeof r> => !!r,
  );

  const autoFill = () => {
    const pool = saved
      .map(byId)
      .filter((r): r is NonNullable<typeof r> => !!r);
    const source = pool.length >= 3 ? pool : catalog.filter((r) => r.detail);
    const next: Record<string, string> = {};
    DAYS.forEach((d, i) => {
      const r = source[i % source.length];
      if (r) next[d] = r.slug;
    });
    setWeek(next);
    setMsg(
      pool.length >= 3
        ? "اتملت الأسبوع من محفوظاتك — عدّل أي يوم من القايمة."
        : "محفوظاتك لسه قليلة، فملينا الأسبوع من الوصفات المكتملة. احفظ وصفات أكتر وهنبني منها.",
    );
  };

  const addShopping = () => {
    const reviewable = plannedRecipes.filter((r) => r.detail);
    if (!reviewable.length) {
      setMsg("خطتك الحالية كلها ترشيحات فيديو — مشترياتها التفصيلية في الفيديو الأصلي.");
      return;
    }
    const lines = shoppingLines(reviewable).map(shoppingLabel);
    const cur = localKitchen();
    const merged = [...new Set([...cur.shopping, ...lines])];
    storageSet("wasafat-Doha:shopping", JSON.stringify(merged));
    setMsg(`اتضافت مشتريات ${reviewable.length} وصفة مكتملة لقايمة مشترياتك في مطبخي.`);
  };

  return (
    <section className="surface" aria-labelledby="myweek-h">
      <h2 id="myweek-h">أسبوعي أنا 🗓️</h2>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        رتّب 7 أيام على مزاجك من محفوظاتك. الخطة بتتحفظ على جهازك، ولو داخل
        بحسابك هتتزامن مع مطبخك.
      </p>
      <div className="action-row" style={{ margin: "10px 0" }}>
        <button type="button" className="btn btn-primary" onClick={autoFill}>
          املأ الأسبوع من محفوظاتي
        </button>
        <button type="button" className="btn btn-ghost" onClick={addShopping}>
          🧺 حوّل الخطة لمشتريات
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setWeek({});
            setMsg("اتمسحت الخطة.");
          }}
        >
          امسح الخطة
        </button>
      </div>
      {msg && <p className="notice">{msg}</p>}
      <div className="week-grid">
        {DAYS.map((d) => {
          const r = byId(week[d]);
          return (
            <div key={d} className="week-day">
              <b>{d}</b>
              {r ? (
                <Link className="text-link" href={`/recipes/${r.slug}`}>
                  {r.title}
                </Link>
              ) : (
                <span style={{ color: "var(--muted)" }}>لسه فاضي</span>
              )}
              <select
                aria-label={`اختار وصفة ${d}`}
                value={week[d] || ""}
                onChange={(e) =>
                  setWeek({ ...week, [d]: e.target.value })
                }
              >
                <option value="">— اختار وصفة —</option>
                {saved.length > 0 && (
                  <optgroup label="من محفوظاتي">
                    {saved.map((s) => {
                      const sr = byId(s);
                      return sr ? (
                        <option key={s} value={s}>
                          {sr.title}
                        </option>
                      ) : null;
                    })}
                  </optgroup>
                )}
                <optgroup label="وصفات مكتملة">
                  {catalog
                    .filter((x) => x.detail)
                    .map((x) => (
                      <option key={x.slug} value={x.slug}>
                        {x.title}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="كل الوصفات">
                  {catalog.map((x) => (
                    <option key={x.slug} value={x.slug}>
                      {x.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          );
        })}
      </div>
      <p className="results-note">
        «حوّل الخطة لمشتريات» بيجمع مقادير الوصفات المكتملة المراجعة بس؛ ترشيحات
        الفيديو مقاديرها في الفيديو الأصلي ومش هتتخمن هنا.
      </p>
    </section>
  );
}
