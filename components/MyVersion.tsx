"use client";
import { useState } from "react";
import type { Recipe } from "@/lib/data";
import { useStored } from "./useStored";

// «دي نسختي»: تعديلات اليوزر المنظمة على الوصفة، محفوظة محليًا (وبتتزامن
// مع حسابه لو سجّل دخول، زي باقي بيانات مطبخه). النسخ بتتراكم بتاريخها
// عشان يقدر يقارن آخر تجربتين ويشوف طريقته بتتطور إزاي.

export type MyVersionData = {
  at: string;
  adjustments: { name: string; mine: string }[];
  pan: string;
  oven: string;
  note: string;
};

export default function MyVersion({ r }: { r: Recipe }) {
  const [versions, setVersions] = useStored<MyVersionData[]>(
    `wasafat-Doha:myversions:${r.slug}`,
    [],
  );
  const [adj, setAdj] = useState<{ name: string; mine: string }[]>([
    { name: "", mine: "" },
  ]);
  const [pan, setPan] = useState(""),
    [oven, setOven] = useState(""),
    [note, setNote] = useState(""),
    [saved, setSaved] = useState(false);
  const latest = versions[0];
  const prev = versions[1];
  const originalItems = new Map(
    (r.detail?.ingredients || []).flatMap((g) =>
      g.items.map((i) => [i.name, i.display] as const),
    ),
  );
  const save = () => {
    const clean = adj.filter((a) => a.name.trim() && a.mine.trim());
    if (!clean.length && !pan && !oven && !note.trim()) return;
    setVersions((old) =>
      [
        {
          at: new Date().toISOString(),
          adjustments: clean,
          pan,
          oven,
          note: note.trim(),
        },
        ...old,
      ].slice(0, 10),
    );
    setSaved(true);
  };
  return (
    <section className="surface" aria-labelledby="myversion-h">
      <h2 id="myversion-h">دي نسختي ✍️</h2>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        وصفة الشيف هي الأصل، ودي تعديلاتك انت — كمية السكر، نوع الجبنة، مقاس
        صينيتك، وقت فرنك. احفظها وهتلاقيها هنا كل مرة تفتح الوصفة، وتقدر
        تقارن بين آخر تجربتين.
      </p>
      {latest && (
        <div className="ok-box">
          <b>
            نسختي الأخيرة —{" "}
            {new Date(latest.at).toLocaleDateString("ar-EG")}
          </b>
          {latest.adjustments.length > 0 && (
            <ul>
              {latest.adjustments.map((a, i) => (
                <li key={i}>
                  {a.name}: نسختي «{a.mine}»
                  {originalItems.get(a.name) && (
                    <span style={{ color: "var(--muted)" }}>
                      {" "}
                      (الأصل: {originalItems.get(a.name)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {latest.pan && <p>مقاس صينيتي: {latest.pan}</p>}
          {latest.oven && <p>فرني: {latest.oven}</p>}
          {latest.note && <p>{latest.note}</p>}
          {prev && (
            <p style={{ color: "var(--muted)" }}>
              النسخة اللي قبلها (
              {new Date(prev.at).toLocaleDateString("ar-EG")}):{" "}
              {prev.adjustments.map((a) => `${a.name} «${a.mine}»`).join(" · ") ||
                prev.note ||
                "من غير تعديلات مقادير"}
            </p>
          )}
        </div>
      )}
      <div className="admin-form">
        {adj.map((a, i) => (
          <div className="scale-row" key={i} style={{ marginBottom: 8 }}>
            <label>
              المكوّن
              <input
                value={a.name}
                maxLength={60}
                onChange={(e) =>
                  setAdj((old) =>
                    old.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                  )
                }
                placeholder="مثال: سكر"
                list={r.detail ? `ings-${r.slug}` : undefined}
              />
            </label>
            <label>
              في نسختي
              <input
                value={a.mine}
                maxLength={80}
                onChange={(e) =>
                  setAdj((old) =>
                    old.map((x, j) => (j === i ? { ...x, mine: e.target.value } : x)),
                  )
                }
                placeholder="مثال: ربع كوب بس"
              />
            </label>
            {i === adj.length - 1 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setAdj((old) => [...old, { name: "", mine: "" }])}
              >
                + تعديل تاني
              </button>
            )}
          </div>
        ))}
        {r.detail && (
          <datalist id={`ings-${r.slug}`}>
            {[...originalItems.keys()].map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        )}
        <div className="scale-row">
          <label>
            مقاس صينيتي
            <input
              value={pan}
              maxLength={40}
              onChange={(e) => setPan(e.target.value)}
              placeholder="مثال: 26 سم"
            />
          </label>
          <label>
            فرني (حرارة/وقت)
            <input
              value={oven}
              maxLength={60}
              onChange={(e) => setOven(e.target.value)}
              placeholder="مثال: 180 لمدة 25 دقيقة"
            />
          </label>
        </div>
        <label htmlFor={`mv-note-${r.slug}`}>ملاحظة عامة عن نسختي</label>
        <textarea
          className="notes"
          id={`mv-note-${r.slug}`}
          value={note}
          maxLength={500}
          onChange={(e) => setNote(e.target.value)}
          placeholder="اللي هعمله المرة الجاية…"
        />
        <button type="button" className="btn btn-primary" onClick={save}>
          احفظ نسختي
        </button>
        {saved && (
          <span role="status" style={{ marginInlineStart: 10 }}>
            اتحفظت ✓ هتظهر هنا المرة الجاية
          </span>
        )}
      </div>
    </section>
  );
}
