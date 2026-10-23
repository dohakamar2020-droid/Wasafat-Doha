"use client";
import { useStored } from "./useStored";
import { shoppingLines, shoppingLabel } from "@/lib/experience";
import { useCatalog } from "./CatalogProvider";
import { storageSet } from "@/lib/storage";
import { readJSON } from "@/lib/local-kitchen";
import type { ReviewedDetail } from "@/lib/reviewed";
import { stepVideoUrl } from "@/lib/trend";

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

export default function ReviewedSection({
  detail,
  slug,
}: {
  detail: ReviewedDetail;
  slug: string;
}) {
  const [scale, setScale] = useStored<number>(`wasafat-Doha:scale:${slug}`, 1);
  const [checked, setChecked] = useStored<string[]>(
    `wasafat-Doha:ingcheck:${slug}`,
    [],
  );
  const [doneSteps, setDoneSteps] = useStored<number[]>(
    `wasafat-Doha:steps:${slug}`,
    [],
  );
  const r = useCatalog().find((r) => r.slug === slug);
  function toggle<T extends string | number>(
    key: T,
    list: T[],
    set: (v: T[]) => void,
    _storeKey: string,
  ) {
    set(list.includes(key) ? list.filter((x) => x !== key) : [...list, key]);
  }
  const addShopping = () => {
    if (!r) return;
    const remaining = {
      ...r,
      detail: r.detail
        ? {
            ...r.detail,
            ingredients: r.detail.ingredients.map((g) => ({
              ...g,
              items: g.items.filter(
                (i) => !checked.includes(`${g.group}:${i.name}`),
              ),
            })),
          }
        : undefined,
    };
    const lines = shoppingLines([remaining], scale);
    storageSet(
      "wasafat-Doha:shopping",
      JSON.stringify([
        ...new Set([
          ...readJSON<string[]>("shopping", []),
          ...lines.map(shoppingLabel),
        ]),
      ]),
    );
  };

  return (
    <>
      <section className="surface" aria-labelledby="ing-h">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <h2 id="ing-h">المقادير المراجعة 📝</h2>
          <div
            className="scaler"
            role="group"
            aria-label="تكبير المقادير للحصص"
          >
            <span style={{ fontWeight: 700, color: "var(--olive)" }}>
              الحصص:
            </span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={scale === n ? "on" : ""}
                onClick={() => setScale(n)}
                aria-pressed={scale === n}
              >
                ×{n}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-olive" onClick={addShopping}>
          ضيف المقادير اللي لسه ما جهزتهاش للمشتريات
        </button>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>
          {detail.servings} · التكبير بيحسب الكميات الرقمية بس
          (جرام/مللي/كوب/حبة) — اللي مكتوب وصفًا بيفضل زي ما هو. علّم على اللي
          جهزته.
        </p>
        {detail.servingsCount ? (
          <p style={{ marginTop: 0 }}>
            <span className="tag tag-need">
              تكفي {detail.servingsCount} أشخاص (من المصدر)
            </span>
          </p>
        ) : null}
        {detail.timing && (
          <div className="timing-box" role="note" aria-label="أوقات موثقة من المصدر">
            <b>⏱ أوقات موثقة من المصدر:</b>{" "}
            {[
              detail.timing.prepMinutes ? `تحضير ~${detail.timing.prepMinutes} د` : null,
              detail.timing.cookMinutes ? `طبخ ~${detail.timing.cookMinutes} د` : null,
              detail.timing.waitMinutes ? `انتظار/تبريد ~${detail.timing.waitMinutes} د` : null,
              detail.timing.totalMinutes ? `إجمالي مصرح به ~${detail.timing.totalMinutes} د` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "لا يوجد وقت كلي مصرح به"}
            <span style={{ color: "var(--muted)" }}>
              {" "}
              — {detail.timing.sourceNote}
            </span>
          </div>
        )}
        {detail.ingredients.map((g) => (
          <div className="ing-group" key={g.group}>
            <h4>{g.group}</h4>
            <ul className="check-list">
              {g.items.map((item) => {
                const key = `${g.group}:${item.name}`;
                const scaled =
                  item.amount != null && item.unit
                    ? `${fmt(item.amount * scale)} ${item.unit} — ${item.name}`
                    : null;
                return (
                  <li key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked.includes(key)}
                        onChange={() =>
                          toggle(
                            key,
                            checked,
                            setChecked,
                            `wasafat-Doha:ingcheck:${slug}`,
                          )
                        }
                      />
                      <span>
                        <b>{scaled || item.display}</b>
                        {scaled && (
                          <span style={{ color: "var(--muted)" }}>
                            {" "}
                            (الأصل: {item.display})
                          </span>
                        )}
                        {!scaled && item.name !== item.display && (
                          <span style={{ color: "var(--muted)" }}>
                            {" "}
                            — {item.name}
                          </span>
                        )}
                        {item.optional && (
                          <span
                            className="tag"
                            style={{ marginInlineStart: 6 }}
                          >
                            اختياري
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>
          الأدوات: {detail.tools.join(" · ")}
        </p>
      </section>

      <section className="surface" aria-labelledby="steps-h">
        <h2 id="steps-h">الخطوات بالترتيب 🍳</h2>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>
          ملخصة بصياغة وصفات قمر من شرح الفيديو — علّم على كل خطوة تخلصها، تقدمك
          بيتحفظ.
        </p>
        {detail.steps.map((st, i) => (
          <div
            key={i}
            className={`step-item ${doneSteps.includes(i) ? "done" : ""}`}
          >
            <span className="step-num">{i + 1}</span>
            <div>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={doneSteps.includes(i)}
                  onChange={() =>
                    toggle(
                      i,
                      doneSteps,
                      setDoneSteps,
                      `wasafat-Doha:steps:${slug}`,
                    )
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--orange)",
                  }}
                />
                <b>{st.title}</b>
                {st.minutes ? (
                  <span className="tag tag-views">
                    ⏱ ~{st.minutes} دقيقة (من الفيديو)
                  </span>
                ) : null}
              </label>
              <p style={{ margin: "4px 0 0" }}>{st.body}</p>
              {st.cue && <span className="cue">علامة النتيجة: {st.cue}</span>}
              {r && stepVideoUrl(r, i, detail.steps.length) && (
                <a
                  className="text-link step-video-link"
                  href={stepVideoUrl(r, i, detail.steps.length)!.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ ورّيني الخطوة دي في الفيديو (تقريبًا عند{" "}
                  {stepVideoUrl(r, i, detail.steps.length)!.minuteLabel})
                </a>
              )}
            </div>
          </div>
        ))}
        <div className="info-grid">
          <div className="info-cell">
            <span>النقطة اللي بتفرق</span>
            <b>{detail.successTips[0]}</b>
          </div>
          <div className="info-cell">
            <span>خلي بالك</span>
            <b>{detail.commonMistakes[0]}</b>
          </div>
        </div>
        <h3>نقط نجاح من الفيديو نفسه</h3>
        <ul>
          {detail.successTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3>أخطاء شائعة مرتبطة بالوصفة دي</h3>
        <ul>
          {detail.commonMistakes.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="notice">✔ {detail.reviewNote}</p>
      </section>
    </>
  );
}
