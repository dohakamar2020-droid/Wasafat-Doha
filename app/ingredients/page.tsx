"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { recipes, allIngredients } from "@/lib/data";
import { RecipeCard } from "@/components/ui";

function IngInner() {
  const sp = useSearchParams();
  const [sel, setSel] = useState<string[]>(() => { const i = sp.get("ing"); return i ? [i] : []; });
  const [excluded, setExcluded] = useState("");
  const toggle = (i: string) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const { full, near } = useMemo(() => {
    if (!sel.length) return { full: [], near: [] };
    const ex = excluded.trim();
    const usable = recipes.filter((r) => !ex || !`${r.title} ${r.mainIngredients.join(" ")}`.includes(ex));
    const scored = usable.map((r) => {
      const have = r.mainIngredients.filter((i) => sel.includes(i));
      return { r, have: have.length, missing: r.mainIngredients.filter((i) => !sel.includes(i)) };
    }).filter((x) => x.have > 0);
    return {
      full: scored.filter((x) => x.missing.length === 0).sort((a, b) => b.r.views - a.r.views),
      near: scored.filter((x) => x.missing.length === 1).sort((a, b) => b.r.views - a.r.views),
    };
  }, [sel, excluded]);

  const popular = [...recipes].sort((a, b) => b.views - a.views).slice(0, 4);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>عندك إيه في البيت؟ 🧺</h1>
        <p>اختار المكونات الموجودة عندك فعلًا، ووصفات قمر هتقسم لك النتائج: اللي مكوناتها الأساسية عندك، واللي ناقصك فيها مكوّن واحد بس. المطابقة على المكونات الظاهرة من عناوين الوصفات المراجعة — والتفاصيل الكاملة في الفيديو.</p>
      </div>
      <div className="chip-row" role="group" aria-label="المكونات الموجودة عندك">
        {allIngredients.map((i) => <button key={i} className={`ing-chip ${sel.includes(i) ? "on" : ""}`} onClick={() => toggle(i)} aria-pressed={sel.includes(i)}>{sel.includes(i) ? "✓ " : ""}{i}</button>)}
      </div>
      <div className="shop-add" style={{ maxWidth: 520, marginTop: 18 }}>
        <input type="text" value={excluded} onChange={(e) => setExcluded(e.target.value)} placeholder="استبعد وصفات فيها… (مثال: جمبري)" aria-label="استبعاد مكوّن" />
        {sel.length > 0 && <button className="btn btn-ghost" onClick={() => setSel([])}>امسح الاختيارات</button>}
      </div>

      {sel.length === 0 ? (
        <section className="block"><div className="section-head"><div><h2>لسه مخترتش حاجة</h2><p>ابدأ بمكوّن واحد على الأقل — أو بص على الأكثر انتشارًا دلوقتي</p></div></div>
        <div className="grid">{popular.map((r) => <RecipeCard key={r.slug} r={r} />)}</div></section>
      ) : (
        <>
          <section className="block"><div className="section-head"><div><h2>مكوناتها الأساسية عندك ✅ ({full.length})</h2><p>بناءً على المكونات الظاهرة من العنوان والتصنيف</p></div></div>
            {full.length ? <div className="grid">{full.map(({ r }) => <RecipeCard key={r.slug} r={r} reason={`عندك: ${r.mainIngredients.join("، ")}`} />)}</div> : <div className="empty"><h3>مفيش وصفة مكوناتها كلها عندك بالاختيارات دي</h3><p>زوّد مكوّن أو جرّب اللي تحت — ناقصك فيهم حاجة واحدة بس.</p></div>}
          </section>
          <section className="block"><div className="section-head"><div><h2>ناقصك مكوّن أساسي واحد 🛒 ({near.length})</h2><p>قريبين جدًا — مكوّن واحد وتكمل</p></div></div>
            {near.length ? <div className="grid">{near.map(({ r, missing }) => <RecipeCard key={r.slug} r={r} reason={`ناقصك: ${missing.join("، ")}`} />)}</div> : <p className="results-note">لا يوجد — جرّب تزود أو تنقص مكون من اختياراتك.</p>}
          </section>
        </>
      )}
    </div>
  );
}
export default function IngredientsPage() {
  return <Suspense fallback={<div className="wrap"><p style={{ padding: 40 }}>بنجهز لك المطبخ…</p></div>}><IngInner /></Suspense>;
}
