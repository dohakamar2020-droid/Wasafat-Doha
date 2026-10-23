"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
import { RecipeCard, SectionHead } from "@/components/ui";
import { ingredientKey, matchIngredients } from "@/lib/experience";
function Ingredients() {
  const catalog = useCatalog();
  const sp = useSearchParams();
  const [sel, setSel] = useState<string[]>(
      sp.get("ing") ? [sp.get("ing")!] : [],
    ),
    [custom, setCustom] = useState(""),
    [excluded, setExcluded] = useState("");
  const ingredients = useMemo(
    () =>
      [
        ...new Set(
          catalog
            .flatMap((r) =>
              r.detail
                ? r.detail.ingredients.flatMap((g) =>
                    g.items.map((i) => ingredientKey(i.name)),
                  )
                : r.mainIngredients,
            )
            .concat(["ملح", "زيت", "فلفل أسود"]),
        ),
      ].sort((a, b) => a.localeCompare(b, "ar")),
    [catalog],
  );
  const results = useMemo(
    () =>
      catalog
        .map((r) =>
          matchIngredients(
            r,
            sel,
            excluded
              .split(/[،,\n]/)
              .map((x) => x.trim())
              .filter(Boolean),
          ),
        )
        .filter((x) => !x.forbidden && x.have > 0)
        .sort((a, b) => a.missing.length - b.missing.length || b.have - a.have),
    [catalog, sel, excluded],
  );
  const toggle = (i: string) =>
    setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const full = results.filter((x) => x.complete && !x.missing.length),
    near = results.filter((x) => x.complete && x.missing.length),
    ideas = results.filter((x) => !x.complete);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>عندك إيه في البيت؟</h1>
        <p>
          زوّد المكونات الموجودة فعلًا، بما فيها أساسيات المطبخ. الوصفات
          المكتملة بتتقارن بالمقادير المكتوبة؛ الفيديوهات بنعرضها كأفكار
          بالمكوّن الأساسي.
        </p>
      </div>
      <div
        className="chip-row"
        role="group"
        aria-label="المكونات الموجودة عندك"
      >
        {[
          "بطاطس",
          "دجاج",
          "مكرونة",
          "دقيق",
          "حليب",
          "بيض",
          "أرز",
          "سكر",
          "زبدة",
          "زيت",
          "ملح",
          "ثوم",
        ].map((i) => (
          <button
            className={`ing-chip ${sel.includes(i) ? "on" : ""}`}
            aria-pressed={sel.includes(i)}
            onClick={() => toggle(i)}
            key={i}
          >
            {i}
          </button>
        ))}
      </div>
      <details className="surface details-menu">
        <summary>كل المكونات المتاحة ({ingredients.length})</summary>
        <div className="chip-row">
          {ingredients.map((i) => (
            <button
              type="button"
              key={i}
              className={`ing-chip ${sel.includes(i) ? "on" : ""}`}
              aria-pressed={sel.includes(i)}
              onClick={() => toggle(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </details>
      {sel.length > 0 && (
        <div className="chip-row">
          {sel.map((i) => (
            <button
              className="af-chip"
              key={i}
              onClick={() => toggle(i)}
              aria-label={`إزالة ${i}`}
            >
              {i} ×
            </button>
          ))}
        </div>
      )}
      <form
        className="shop-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (custom.trim()) {
            setSel((s) => [...new Set([...s, custom.trim()])]);
            setCustom("");
          }
        }}
      >
        <input
          aria-label="أضف مكون موجود"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="مكوّن مش في القائمة؟"
        />
        <button className="btn btn-olive">ضيف المكوّن</button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setSel([])}
        >
          امسح الاختيارات
        </button>
      </form>
      <div className="surface">
        <label htmlFor="exclude">استبعد مكونات — افصل بينها بفاصلة</label>
        <input
          className="text-in"
          id="exclude"
          value={excluded}
          onChange={(e) => setExcluded(e.target.value)}
          placeholder="مثال: جمبري، مشروم"
        />
        <p className="results-note">
          الاستبعاد للبحث في المكونات المسجلة، ومش ضمان لخلو الوصفة من مسببات
          الحساسية. راجع المقادير والمصدر بنفسك.
        </p>
      </div>
      {sel.length > 0 ? (
        <>
          <section className="block">
            <SectionHead
              title={`المقادير المطلوبة عندك (${full.length})`}
              sub="مطابقة لقائمة المقادير المكتوبة، مع استثناء الإضافات الاختيارية"
            />
            <div className="grid">
              {full.map(({ r }) => (
                <RecipeCard
                  key={r.slug}
                  r={r}
                  reason="كل المقادير الإلزامية مسجلة عندك"
                />
              ))}
            </div>
            {!full.length && <p>لسه مفيش تطابق كامل. شوف الناقص تحت.</p>}
          </section>
          <section className="block">
            <SectionHead
              title="قريبين من اللي عندك"
              sub="الناقص محسوب من المقادير الفعلية"
            />
            <div className="grid">
              {near.slice(0, 12).map(({ r, missing }) => (
                <RecipeCard
                  key={r.slug}
                  r={r}
                  reason={`ناقصك ${missing.length}: ${missing.map((i) => i.name).join("، ")}`}
                />
              ))}
            </div>
          </section>
          <section className="block">
            <SectionHead
              title="أفكار بالمكوّن الأساسي"
              sub="لسه مقاديرها مش مكتملة عندنا؛ عدد المكونات الناقصة غير معروف"
            />
            <div className="grid">
              {ideas.slice(0, 12).map(({ r }) => (
                <RecipeCard key={r.slug} r={r} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="empty">
          <h2>ابدأ بمكوّن عندك</h2>
          <p>كل ما تزود مكونات، المطابقة هتبقى أدق.</p>
        </div>
      )}
    </div>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<p>بنجهز المكونات…</p>}>
      <Ingredients />
    </Suspense>
  );
}
