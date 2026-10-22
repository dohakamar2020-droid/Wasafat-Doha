"use client";
import { useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/lib/data";
import { creatorById } from "@/lib/data";
import { VideoEmbed, SaveButton, usePlanned, useDone } from "@/components/ui";

export default function RecipeInteractive({ r }: { r: Recipe }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const planned = usePlanned(); const done = useDone();
  const s = r.sources[srcIdx] || r.sources[0];
  const c = creatorById(r.creatorId);
  const [missing, setMissing] = useState("");
  const [shop, setShop] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("wasafat-Doha:shopping") || "[]"); } catch { return []; } });
  const [prep, setPrep] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(`wasafat-Doha:prep:${r.slug}`) || "[]"); } catch { return []; } });
  const [note, setNote] = useState(() => { try { return localStorage.getItem(`wasafat-Doha:note:${r.slug}`) || ""; } catch { return ""; } });

  const togglePrep = (item: string) => {
    const next = prep.includes(item) ? prep.filter((x) => x !== item) : [...prep, item];
    setPrep(next); try { localStorage.setItem(`wasafat-Doha:prep:${r.slug}`, JSON.stringify(next)); } catch {}
  };
  const addMissing = () => {
    const v = missing.trim(); if (!v) return;
    const item = `${v} — لـ«${r.title}»`;
    if (!shop.includes(item)) { const next = [...shop, item]; setShop(next); try { localStorage.setItem("wasafat-Doha:shopping", JSON.stringify(next)); window.dispatchEvent(new Event("wasafat-Doha:change")); } catch {} }
    setMissing("");
  };
  const saveNote = (v: string) => { setNote(v); try { localStorage.setItem(`wasafat-Doha:note:${r.slug}`, v); } catch {} };
  const prepItems = [
    "شفت الفيديو كامل مرة قبل ما أبدأ",
    `جهّزت المكونات الأساسية: ${r.mainIngredients.join("، ")}`,
    "جهّزت الأدوات اللي ظهرت في الفيديو",
    "قررت هقدّم معاها إيه (جانبي / صوص / مشروب)",
  ];

  return (
    <>
      <div className="recipe-hero">
        <div>
          <VideoEmbed ytId={s.ytId} title={r.title} vertical={s.kind === "short"} />
          {r.sources.length > 1 && (
            <div className="source-switch" role="group" aria-label="اختيار نسخة المشاهدة">
              {r.sources.map((x, i) => (
                <button key={x.ytId} className={i === srcIdx ? "on" : ""} onClick={() => setSrcIdx(i)}>
                  {x.kind === "short" ? "▶ النسخة القصيرة (شورت)" : "▶ الشرح الكامل"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="recipe-info">
          <span className="eyebrow">{r.category} · {c.name}</span>
          <h1>{r.title}</h1>
          <p style={{ color: "var(--muted)", margin: "6px 0 0" }}>
            من <Link className="chef-link" href={`/creators/${c.id}`}>{c.name}</Link>
            {r.editorsPick && <> · <span className="tag tag-views">✦ اختيار المحرر في وصفات قمر</span></>}
          </p>
          <div className="why-box"><b>ليه اخترناها؟ 🌙</b><br />{r.why}</div>
          <div className="action-row">
            <Link className="btn btn-primary" href={`/recipes/${r.slug}/cook`}>🍳 يلا نطبخ (وضع الطبخ)</Link>
            <SaveButton slug={r.slug} big />
            <button className={`btn ${planned.has(r.slug) ? "btn-olive" : "btn-ghost"}`} onClick={() => planned.toggle(r.slug)}>
              {planned.has(r.slug) ? "✓ في خطة قريب" : "📌 هعملها قريب"}
            </button>
            <button className={`btn ${done.has(r.slug) ? "btn-olive" : "btn-ghost"}`} onClick={() => done.toggle(r.slug)}>
              {done.has(r.slug) ? "✓ عملتها" : "عملتها؟ سجّلها"}
            </button>
          </div>
          <div className="notice">⏱️ مدة الفيديو مش هي وقت الطبخ. وقت الشغل الفعلي والتسوية هيتضاف هنا أول ما نراجع الوصفة تحريريًا — لحد دلوقتي تابع التوقيتات من الفيديو نفسه.</div>
        </div>
      </div>

      <section className="surface" aria-labelledby="prep-h">
        <h2 id="prep-h">جهّز دول الأول ✅</h2>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>علّم على اللي خلصته قبل ما تشغّل وضع الطبخ — تقدمك بيتحفظ على جهازك.</p>
        <ul className="check-list">
          {prepItems.map((item) => (
            <li key={item}><label><input type="checkbox" checked={prep.includes(item)} onChange={() => togglePrep(item)} /><span>{item}</span></label></li>
          ))}
        </ul>
        <h3 style={{ marginTop: 22 }}>ناقصك إيه؟ 🛒</h3>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>اكتب المكون الناقص وهنضيفه لقائمة مشترياتك في «مطبخي» — من غير ما نخمّن مقادير بالنيابة عنك.</p>
        <div className="shop-add">
          <input type="text" value={missing} onChange={(e) => setMissing(e.target.value)} placeholder="مثال: جبنة موزاريلا" aria-label="مكوّن ناقص" onKeyDown={(e) => e.key === "Enter" && addMissing()} />
          <button className="btn btn-olive" onClick={addMissing}>+ ضيف الناقص للمشتريات</button>
          <Link className="btn btn-ghost" href="/kitchen/shopping">مشترياتي</Link>
        </div>
        <h3 style={{ marginTop: 22 }}>ملاحظاتي الشخصية ✍️</h3>
        <textarea className="notes" value={note} onChange={(e) => saveNote(e.target.value)} placeholder="أعملها يوم الجمعة، وأقلل كمية الصوص…" aria-label="ملاحظاتي على الوصفة" />
      </section>
    </>
  );
}
