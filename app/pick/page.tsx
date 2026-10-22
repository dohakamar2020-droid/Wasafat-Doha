"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { recipes, type Recipe } from "@/lib/data";
import { RecipeCard } from "@/components/ui";

const SWEET = ["حلويات باردة", "كيك ومخبوزات", "مشروبات"];
export default function PickPage() {
  const [taste, setTaste] = useState(""); const [time, setTime] = useState(""); const [priority, setPriority] = useState("");
  const [swapped, setSwapped] = useState<Record<number, string>>({});

  const ready = taste && time && priority;
  const pool = useMemo(() => {
    if (!ready) return [];
    let list = [...recipes];
    if (taste === "sweet") list = list.filter((r) => SWEET.includes(r.category));
    if (taste === "savory") list = list.filter((r) => !SWEET.includes(r.category));
    if (priority === "few") list = list.filter((r) => r.needs.includes("مكونات قليلة") || r.mainIngredients.length <= 2).concat(list.filter((r) => !(r.needs.includes("مكونات قليلة") || r.mainIngredients.length <= 2)));
    if (priority === "nooven") list = list.filter((r) => r.needs.includes("بدون فرن")).concat(list.filter((r) => !r.needs.includes("بدون فرن")));
    if (priority === "quick") list = list.filter((r) => r.needs.includes("وقت قليل") || r.sources.some((s) => s.kind === "short")).concat(list.filter((r) => !(r.needs.includes("وقت قليل") || r.sources.some((s) => s.kind === "short"))));
    if (priority === "wow") list = list.filter((r) => r.needs.includes("مناسبة للعزومات")).concat(list.filter((r) => !r.needs.includes("مناسبة للعزومات")));
    if (priority === "different") list = list.filter((r) => !!r.editorsPick).concat(list.filter((r) => !r.editorsPick));
    if (time === "15") list = list.filter((r) => r.needs.includes("وقت قليل") || r.sources.some((s) => s.kind === "short")).concat(list.filter((r) => !(r.needs.includes("وقت قليل") || r.sources.some((s) => s.kind === "short"))));
    return list.sort((a, b) => b.views - a.views);
  }, [ready, taste, time, priority]);

  const base: { r: Recipe; reason: string }[] = useMemo(() => {
    if (!pool.length) return [];
    const used = new Set<string>(); const out: { r: Recipe; reason: string }[] = [];
    const pick = (pred: (r: Recipe) => boolean, reason: string) => {
      const c = pool.find((r) => !used.has(r.slug) && pred(r)) || pool.find((r) => !used.has(r.slug));
      if (c) { used.add(c.slug); out.push({ r: c, reason }); }
    };
    pick(() => true, "الأقرب لطلبك — والأكثر انتشارًا بين اللي يناسبوك");
    pick((r) => r.mainIngredients.length <= 2 || r.needs.includes("مكونات قليلة"), "أبسط اختيار متاح بمكونات قليلة");
    pick((r) => !out.find((o) => o.r.category === r.category), "اختيار مختلف شوية، عشان التجربة ما تبقاش مكررة");
    return out;
  }, [pool]);

  const finalPicks = base.map((p, i) => {
    const altSlug = swapped[i];
    const alt = altSlug ? pool.find((r) => r.slug === altSlug) : undefined;
    return alt ? { r: alt, reason: "بدّلناه باختيار تاني من نفس مزاجك" } : p;
  });
  const swap = (i: number) => {
    const current = new Set(finalPicks.map((p) => p.r.slug));
    const alt = pool.find((r) => !current.has(r.slug));
    if (alt) setSwapped((s) => ({ ...s, [i]: alt.slug }));
  };
  const reset = () => { setTaste(""); setTime(""); setPriority(""); setSwapped({}); };

  const Step = ({ n, title, sub, value, set, opts }: { n: number; title: string; sub: string; value: string; set: (v: string) => void; opts: [string, string][] }) => (
    <div className="wiz-step">
      <h2>{n}. {title}</h2><p>{sub}</p>
      <div className="opt-grid">{opts.map(([v, label]) => <button key={v} className={`opt ${value === v ? "on" : ""}`} onClick={() => set(v)} aria-pressed={value === v}>{label}</button>)}</div>
    </div>
  );

  return (
    <div className="wrap">
      <div className="page-head" style={{ textAlign: "center" }}>
        <span className="eyebrow">✨ الميزة المميزة في وصفات قمر</span>
        <h1>رشحلي 3</h1>
        <p style={{ marginInline: "auto" }}>محتار تعمل إيه؟ جاوب على 3 أسئلة، وهنرشحلك 3 وصفات بس — مش خمسين.</p>
      </div>
      <div className="wizard">
        <Step n={1} title="نفسك في إيه؟" sub="حدد الاتجاه العام" value={taste} set={setTaste} opts={[["sweet", "🍮 حلو"], ["savory", "🍗 حادق"], ["any", "🤷 مش فارقة"]]} />
        <Step n={2} title="عندك وقت قد إيه؟" sub="هنقرّبك من الاختيارات الأسرع لو مستعجل (مدة الشورت مش وقت الطبخ — دي ترشيحات بداية)" value={time} set={setTime} opts={[["15", "⏱️ مستعجل جدًا"], ["45", "🕐 وقت معقول"], ["any", "🌙 على مهلي"]]} />
        <Step n={3} title="أهم حاجة عندك؟" sub="إيه اللي يفرق معاك أكتر؟" value={priority} set={setPriority} opts={[["few", "🧺 مكونات قليلة"], ["nooven", "🚫 بدون فرن"], ["filling", "💪 يشبّع"], ["wow", "🎉 شكل مميز"], ["different", "🧪 تجربة مختلفة"]]} />

        {ready ? (
          <section aria-label="ترشيحاتك الثلاثة">
            <div className="section-head"><div><h2>دول الـ3 بتوعك 🌙</h2><p>تحت كل واحدة سبب ترشيحها — ولو واحدة مش عاجباك بدّلها لوحدها</p></div>
            <button className="btn btn-ghost btn-sm" onClick={reset}>ابدأ من الأول</button></div>
            <div className="grid">
              {finalPicks.map((p, i) => (
                <div key={p.r.slug}>
                  <RecipeCard r={p.r} reason={p.reason} />
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => swap(i)}>🔄 بدّل الاختيار ده</button>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 22 }}>عجبتك واحدة؟ افتحها ودوس <b>«يلا نطبخ»</b> — أو احفظها من الكارت على طول. <Link className="text-link" href="/ingredients">عندك مكونات معينة؟ جرّب «عندك إيه؟» ←</Link></p>
          </section>
        ) : (
          <p style={{ textAlign: "center", color: "var(--muted)" }}>كمّل الـ3 أسئلة وهنطلعلك ترشيحاتك على طول 👆</p>
        )}
      </div>
    </div>
  );
}
