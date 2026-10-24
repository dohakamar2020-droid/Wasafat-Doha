"use client";
import { useEffect, useState } from "react";
import type { ParsedIngredient } from "@/lib/ingredient-parse";

type Pack = {
  slug: string;
  ytId: string;
  channel: string;
  kinds: string[];
  sourceUrls: string[];
  capturedAt: string;
  ingredientLines: string[];
  methodLines?: string[];
  notes?: string[];
};

type Payload = {
  pack: Pack;
  parsed: ParsedIngredient[];
  numericRatio: number;
  missing: boolean;
};

const KIND_LABEL: Record<string, string> = {
  "youtube-description": "وصف الفيديو الرسمي",
  "youtube-transcript": "ترانسكريبت الشيف",
  "creator-recipe-page": "بطاقة وصفة الشيف",
  "creator-caption": "كابشن الشيف الرسمي",
};

export default function SourcePackPanel({
  slug,
  onIngredients,
}: {
  slug: string;
  onIngredients: (
    groups: { group: string; items: { name: string; display: string; amount?: number; unit?: string }[] }[],
  ) => void;
}) {
  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState("");
  const [picked, setPicked] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setErr("");
    setPicked(new Set());
    fetch(`/api/admin/source-pack?slug=${encodeURIComponent(slug)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        if (!cancelled) setData(d);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "تعذّر التحميل."));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (err)
    return (
      <section className="surface">
        <h2>حزمة المصدر الرسمي</h2>
        <p role="status">{err}</p>
      </section>
    );
  if (!data)
    return (
      <section className="surface">
        <h2>حزمة المصدر الرسمي</h2>
        <p role="status">بنحمّل حزمة المصدر…</p>
      </section>
    );

  const { pack, parsed, numericRatio, missing } = data;
  const toggle = (i: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const apply = () => {
    const chosen = parsed.filter((_, i) => picked.has(i));
    if (!chosen.length) return;
    onIngredients([
      {
        group: "من المصدر الرسمي",
        items: chosen.map((p) => ({
          name: p.name,
          display: p.display,
          ...(p.amount != null ? { amount: p.amount } : {}),
          ...(p.unit ? { unit: p.unit } : {}),
        })),
      },
    ]);
  };

  return (
    <section className="surface" aria-labelledby="pack-h">
      <h2 id="pack-h">حزمة المصدر الرسمي 📦</h2>
      <p style={{ color: "var(--muted)" }}>
        المصدر: {pack.channel} · {pack.kinds.map((k) => KIND_LABEL[k] || k).join(" + ")}
        {" · "}أُخذ في {pack.capturedAt}
      </p>
      <ul style={{ paddingInlineStart: 20 }}>
        {pack.sourceUrls.map((u) => (
          <li key={u}>
            <a className="text-link" href={u} target="_blank" rel="noreferrer">
              افتح المصدر
            </a>
          </li>
        ))}
      </ul>
      {pack.notes?.length ? (
        <ul className="results-note">
          {pack.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}

      {missing ? (
        <p className="results-note">
          ⚠ المصدر المنشور مفيهوش مقادير مكتوبة. لازم تتقرا من الفيديو نفسه
          قبل الاعتماد — ومينفعش نخمّن أرقام.
        </p>
      ) : (
        <>
          <p style={{ color: "var(--muted)" }}>
            {parsed.length} سطر · {numericRatio}% منهم عليه رقم صريح.
          </p>
          <ul className="check-list">
            {parsed.map((p, i) => (
              <li key={`${p.raw}-${i}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={picked.has(i)}
                    onChange={() => toggle(i)}
                  />
                  <span>
                    <b>{p.name}</b> — {p.display}
                    {p.amount != null && p.unit ? (
                      <span style={{ color: "var(--muted)" }}>
                        {" "}
                        (رقمي: {p.amount} {p.unit})
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>
                        {" "}
                        (بدون رقم — زي ما ورد)
                      </span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-olive"
            onClick={apply}
            disabled={!picked.size}
          >
            حوّل المحدد لمقادير ({picked.size})
          </button>
        </>
      )}

      {pack.methodLines?.length ? (
        <>
          <h3>من شرح الشيف (خطوات ومعلومات)</h3>
          <ul>
            {pack.methodLines.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
