"use client";
import Link from "next/link";
import { useState } from "react";
import { type Recipe, creatorById } from "@/lib/data";
import {
  VideoEmbed,
  SaveButton,
  usePlanned,
  useLocalList,
} from "@/components/ui";
import { useStored } from "@/components/useStored";
import { storageSet } from "@/lib/storage";
import AttemptForm from "@/components/AttemptForm";
import { CAPTURED_AT } from "@/lib/experience";
export default function RecipeInteractive({ r }: { r: Recipe }) {
  const [srcIdx, setSrcIdx] = useState(0),
    [attempt, setAttempt] = useState(false);
  const planned = usePlanned(),
    compare = useLocalList("wasafat-Doha:compare");
  const [prep, setPrep] = useStored<string[]>(
    `wasafat-Doha:prep:${r.slug}`,
    [],
  );
  const [notes, setNotes] = useStored<Record<string, string>>(
    "wasafat-Doha:notes",
    {},
  );
  const s = r.sources[srcIdx] || r.sources[0];
  const prepItems = [
    ["watched", "شفت شرح الوصفة مرة"],
    ["ingredients", "جهّزت المقادير المطلوبة"],
    ["tools", "جهّزت الأدوات"],
  ];
  return (
    <>
      <div className="recipe-hero">
        <div>
          <VideoEmbed
            key={s.ytId}
            ytId={s.ytId}
            title={r.title}
            vertical={s.kind === "short"}
            embeddable={s.embeddable}
          />
          {r.sources.length > 1 && (
            <div
              className="source-switch"
              role="group"
              aria-label="نسخة المشاهدة"
            >
              {r.sources.map((x, i) => (
                <button
                  type="button"
                  key={x.ytId}
                  className={i === srcIdx ? "on" : ""}
                  aria-pressed={i === srcIdx}
                  onClick={() => setSrcIdx(i)}
                >
                  {x.kind === "short" ? "شورت" : "الشرح الكامل"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="recipe-info">
          <span className="eyebrow">
            {r.detail ? "مقادير وخطوات مكتملة" : "ترشيح فيديو"} · {r.category}
          </span>
          <h1>{r.title}</h1>
          <p>
            من{" "}
            <Link className="chef-link" href={`/creators/${r.creatorId}`}>
              {creatorById(r.creatorId).name}
            </Link>
          </p>
          <div className="why-box">
            <b>ليه اخترناها؟</b>
            <p>{r.why}</p>
          </div>
          {r.totalMinutes ? (
            <p>{r.totalMinutes} دقيقة — وقت الطبخ الكامل الموثّق</p>
          ) : (
            <p className="results-note">
              وقت الطبخ الكامل لم يُوثّق بعد. مدة الفيديو مش وقت الطبخ.
            </p>
          )}
          <div className="action-row">
            <Link className="btn btn-primary" href={`/recipes/${r.slug}/cook`}>
              {r.detail ? "يلا نطبخ خطوة بخطوة" : "افتح مساحة الطبخ والفيديو"}
            </Link>
            <SaveButton slug={r.slug} big />
          </div>
          <div className="secondary-actions">
            <button
              className="btn btn-ghost"
              aria-pressed={planned.has(r.slug)}
              onClick={() => planned.toggle(r.slug)}
            >
              {planned.has(r.slug) ? "في خطتي ✓" : "هعملها قريب"}
            </button>
            <button
              className="btn btn-ghost"
              aria-pressed={compare.has(r.slug)}
              onClick={() => {
                if (!compare.has(r.slug) && compare.list.length >= 3) {
                  storageSet(
                    "wasafat-Doha:compare",
                    JSON.stringify([...compare.list.slice(1), r.slug]),
                  );
                } else compare.toggle(r.slug);
              }}
            >
              {compare.has(r.slug) ? "في المقارنة ✓" : "قارنها"}
            </button>
            {compare.has(r.slug) && (
              <Link className="btn btn-ghost" href="/compare">
                افتح المقارنة
              </Link>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => setAttempt((v) => !v)}
            >
              سجّل تجربة
            </button>
          </div>
          {r.testedNote && (
            <div className="ok-box">
              <b>تجربة موثقة من الفريق</b>
              <p>{r.testedNote}</p>
            </div>
          )}
          <p className="results-note">
            رصد المشاهدات: {(r.viewsUpdatedAt || CAPTURED_AT).slice(0, 10)}
          </p>
        </div>
      </div>
      {attempt && <AttemptForm slug={r.slug} />}
      <details className="surface details-menu">
        <summary>التجهيز وملاحظاتي الشخصية</summary>
        <ul className="check-list">
          {prepItems.map(([id, label]) => (
            <li key={id}>
              <label>
                <input
                  type="checkbox"
                  checked={prep.includes(id)}
                  onChange={() =>
                    setPrep((old) =>
                      old.includes(id)
                        ? old.filter((x) => x !== id)
                        : [...old, id],
                    )
                  }
                />
                <span>{label}</span>
              </label>
            </li>
          ))}
        </ul>
        <label htmlFor="recipe-note">ملحوظة للمرة الجاية</label>
        <textarea
          id="recipe-note"
          className="notes"
          maxLength={4000}
          value={notes[r.slug] || ""}
          onChange={(e) =>
            setNotes((old) => ({ ...old, [r.slug]: e.target.value }))
          }
          placeholder="التعديلات اللي عايز تفتكرها…"
        />
      </details>
    </>
  );
}
