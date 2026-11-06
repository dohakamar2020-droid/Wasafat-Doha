"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useCatalog } from "@/components/CatalogProvider";
import { RecipeCard, useHidden } from "@/components/ui";
import { fiveIngredientKey, recommendFive, type FivePreferences } from "@/lib/pick-five";

const initial: FivePreferences = { taste: "any", category: "any", method: "any", status: "any", time: "any" };
const quick = ["دجاج", "بيض", "بطاطس", "مكرونة", "أرز", "دقيق", "حليب", "بسكويت", "شوكولاتة", "زبادي", "جبنة", "تمر"];

export default function PickFivePage() {
  const catalog = useCatalog();
  const hidden = useHidden();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [preferences, setPreferences] = useState<FivePreferences>(initial);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("");
  const ingredients = useMemo(() => {
    const names = catalog.flatMap((r) => [
      ...r.mainIngredients,
      ...(r.detail?.ingredients.flatMap((g) => g.items.map((i) => i.name)) || []),
    ]);
    return [...new Map(names.map((name) => [fiveIngredientKey(name), name])).values()]
      .filter((name) => fiveIngredientKey(name).includes(fiveIngredientKey(search)))
      .sort((a, b) => a.localeCompare(b, "ar"));
  }, [catalog, search]);
  const picks = useMemo(() => recommendFive(catalog, selected, preferences, [...excluded, ...hidden.list]), [catalog, selected, preferences, excluded, hidden.list]);
  const has = (name: string) => selected.some((item) => fiveIngredientKey(item) === fiveIngredientKey(name));
  function toggle(name: string) {
    if (has(name)) setSelected((old) => old.filter((item) => fiveIngredientKey(item) !== fiveIngredientKey(name)));
    else if (selected.length < 5) setSelected((old) => [...old, name]);
    else { setMessage("اخترت ٥ مكونات بالفعل؛ شيل واحد قبل ما تضيف غيره."); return; }
    setMessage(""); setExcluded([]);
  }
  function update<K extends keyof FivePreferences>(key: K, value: FivePreferences[K]) {
    setPreferences((old) => ({ ...old, [key]: value })); setExcluded([]);
  }
  const reset = () => { setSelected([]); setSearch(""); setPreferences(initial); setExcluded([]); setStarted(false); setMessage(""); };
  return (
    <div className="wrap pick-five">
      <div className="page-head">
        <span className="eyebrow">اختيارات أذكى من اللي عندك</span>
        <h1>رشحلي ٥ بـ٥ مكونات</h1>
        <p>اختار لحد ٥ مكونات من مطبخك، وحدد تفضيلاتك، ونرشحلك لحد ٥ وصفات تناسبها. لو في حاجة ناقصة هنقولك عليها.</p>
        <Link href="/pick" className="text-link">عايز الاختيار السريع؟ جرّب رشحلي ٣ ←</Link>
      </div>
      <div className="five-layout">
        <section className="surface five-ingredients" aria-labelledby="five-ing-heading">
          <div className="five-heading"><div><span className="eyebrow">الخطوة الأولى</span><h2 id="five-ing-heading">إيه الموجود عندك؟</h2></div><strong className="five-counter">{selected.length} / ٥</strong></div>
          <p className="results-note">اختار من واحد لخمسة. الخمسة دول مكونات عندك، مش وعد إن كل وصفة مقاديرها خمسة بس.</p>
          {selected.length > 0 && <div className="five-selected" aria-label="المكونات المختارة">{selected.map((item) => <button key={item} type="button" onClick={() => toggle(item)} aria-label={`إزالة ${item}`}>{item} <span aria-hidden="true">×</span></button>)}</div>}
          <label htmlFor="five-search">دوّر على مكوّن</label>
          <input id="five-search" className="text-in five-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="مثال: فراخ، مكرونة، زبادي" />
          <div className="chip-row five-chips" role="group" aria-label={search ? "نتائج البحث عن المكونات" : "مكونات مقترحة"}>
            {(search ? ingredients.slice(0, 40) : quick).map((item) => <button type="button" className={`ing-chip ${has(item) ? "on" : ""}`} aria-pressed={has(item)} onClick={() => toggle(item)} key={item}>{item}</button>)}
          </div>
          {search && !ingredients.length && <p className="results-note">مش لاقيين المكوّن بالاسم ده. جرّب اسم تاني من المكونات الموجودة في المكتبة.</p>}
          {!search && <details className="five-more"><summary>كل المكونات في المكتبة</summary><div className="chip-row five-all">{ingredients.map((item) => <button type="button" key={item} className={`ing-chip ${has(item) ? "on" : ""}`} aria-pressed={has(item)} onClick={() => toggle(item)}>{item}</button>)}</div></details>}
          <p role="status" className="results-note">{message}</p>
        </section>
        <section className="surface five-preferences" aria-labelledby="five-pref-heading">
          <span className="eyebrow">الخطوة التانية · اختياري</span><h2 id="five-pref-heading">ظبّطها على مزاجك</h2>
          <p className="results-note">الفلاتر لا تُخفّف تلقائيًا؛ المذاق حسب تصنيف الوصفة، وممكن تلاقي أقل من ٥ نتائج.</p>
          <div className="five-fields">
            <label>المذاق<select value={preferences.taste} onChange={(e) => update("taste", e.target.value as FivePreferences["taste"])}><option value="any">أي مذاق</option><option value="sweet">حلو</option><option value="savory">حادق</option></select></label>
            <label>نوع الأكلة<select value={preferences.category} onChange={(e) => update("category", e.target.value)}><option value="any">كل الأنواع</option>{[...new Set(catalog.map((r) => r.category))].sort((a,b) => a.localeCompare(b,"ar")).map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select></label>
            <label>طريقة التحضير<select value={preferences.method} onChange={(e) => update("method", e.target.value as FivePreferences["method"])}><option value="any">أي طريقة</option><option value="nooven">بدون فرن</option></select></label>
            <label>تفاصيل الوصفة<select value={preferences.status} onChange={(e) => update("status", e.target.value as FivePreferences["status"])}><option value="any">كل الوصفات والفيديوهات</option><option value="reviewed">مقادير وخطوات مراجعة فقط</option></select></label>
            <label>الوقت الكلي الموثّق<select value={preferences.time} onChange={(e) => update("time", e.target.value as FivePreferences["time"])}><option value="any">مش محدد</option><option value="15">١٥ دقيقة أو أقل</option><option value="45">٤٥ دقيقة أو أقل</option></select></label>
          </div>
          <p className="results-note">الوقت الكلي الموثّق قليل في المكتبة؛ اختيار وقت يستبعد الوصفات اللي وقتها غير معروف، مش مدة الفيديو.</p>
          <div className="five-actions"><button className="btn btn-primary" type="button" disabled={!selected.length} onClick={() => setStarted(true)}>رشحلي ٥ وصفات ←</button><button className="btn btn-ghost" type="button" onClick={reset}>ابدأ من الأول</button></div>
        </section>
      </div>
      {started && <section className="five-results" aria-live="polite">
        <div className="section-head"><div><span className="eyebrow">على حسب اختيارك</span><h2>{picks.length ? `${picks.length} ترشيحات ليك` : "مفيش نتائج بالشروط دي"}</h2></div></div>
        <p className="results-note">المطابقة بالاسم تقريبية؛ راجع الوصفة والمصدر، خصوصًا للحساسية. ترشيحات الفيديو مطابقة للمكونات الظاهرة فقط، مش كل المقادير.</p>
        {picks.length ? <div className="grid">{picks.map(({ r, have, missing, complete }) => <div key={r.slug} className="five-result"><RecipeCard r={r} reason={`عندك: ${have.join("، ")}`} /><div className="five-match">{complete ? <p>{missing.length ? `ناقص من المقادير المكتوبة: ${missing.map((i) => i).join("، ")}` : "المقادير المطلوبة المكتوبة موجودة بالاسم — راجع الكميات والمصدر."}</p> : <p>المكونات الظاهرة {missing.length ? `الناقصة: ${missing.join("، ")} — ` : "كلها عندك — "}باقي المقادير غير مراجع؛ راجع الفيديو.</p>}<button type="button" className="btn btn-ghost btn-sm" onClick={() => setExcluded((old) => [...old, r.slug])}>بدّل الوصفة دي</button></div></div>)}</div> : <div className="empty"><p>جرّب مكونات تانية، أو وسّع نوع الأكلة أو الوقت. مش هنضيف وصفات تخالف شروطك عشان نكمّل العدد.</p><button className="btn btn-ghost" type="button" onClick={() => { setPreferences(initial); setExcluded([]); }}>امسح التفضيلات</button>{excluded.length > 0 && <button className="btn btn-ghost" type="button" onClick={() => setExcluded([])}>رجّع الاختيارات المستبعدة</button>}</div>}
      </section>}
    </div>
  );
}
