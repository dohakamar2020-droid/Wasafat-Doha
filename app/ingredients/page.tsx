"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
import {
  RecipeCard,
  SectionHead,
  useLocalList,
  useSaved,
} from "@/components/ui";
import {
  ingredientKey,
  matchIngredients,
  parsePantryText,
} from "@/lib/experience";
import { unlockSuggestions } from "@/lib/pantry";

function Ingredients() {
  const catalog = useCatalog();
  const sp = useSearchParams();
  const shop = useLocalList("wasafat-Doha:shopping");
  const saved = useSaved();
  const [unlockOpen, setUnlockOpen] = useState("");
  const [sel, setSel] = useState<string[]>(
      sp.get("ing")
        ? sp
            .get("ing")!
            .split(/[،,]/)
            .map((x) => x.trim())
            .filter(Boolean)
        : [],
    ),
    [draft, setDraft] = useState(""),
    [note, setNote] = useState(""),
    [excluded, setExcluded] = useState(""),
    [shopped, setShopped] = useState<string[]>([]);
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
        .sort(
          (a, b) =>
            a.missing.length - b.missing.length ||
            b.have - a.have ||
            b.r.views - a.r.views,
        ),
    [catalog, sel, excluded],
  );
  const toggle = (i: string) =>
    setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const applyDraft = () => {
    const parsed = parsePantryText(draft, ingredients);
    if (!parsed.length) {
      setNote("مقدرناش نطلع مكونات من اللي كتبته — جرّب تفصل بينهم بفواصل.");
      return;
    }
    setSel((s) => [...new Set([...s, ...parsed])]);
    setNote(
      `ضفنا ${parsed.length} مكوّن: ${parsed.join("، ")} — شيل أي حاجة مش عندك بدوسة عليها.`,
    );
    setDraft("");
  };
  const addMissingToShopping = (
    slug: string,
    names: string[],
  ) => {
    for (const n of names) if (!shop.has(n)) shop.toggle(n);
    setShopped((s) => (s.includes(slug) ? s : [...s, slug]));
  };
  const unlocks = useMemo(
    () => (sel.length ? unlockSuggestions(catalog, sel, saved.list, 6) : []),
    [catalog, sel, saved.list],
  );
  const full = results.filter((x) => x.complete && !x.missing.length),
    near = results.filter((x) => x.complete && x.missing.length),
    ideas = results.filter((x) => !x.complete);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>عندك إيه في البيت؟</h1>
        <p>
          اكتب المقادير اللي عندك زي ما بتتكلم، وهنرشحلك وصفات وفيديوهات
          تنفع بيها. ولو وصفة عجبتك وناقصها حاجة، هنقولك الناقص بالظبط —
          دوس عليه لو بقى عندك، أو زوّده لقايمة مشترياتك وكمّل عليها.
        </p>
      </div>
      <div className="surface pantry-box">
        <label htmlFor="pantry-text">اكتب اللي عندك</label>
        <textarea
          id="pantry-text"
          className="text-in pantry-text"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="مثال: عندي بطاطس وفراخ وبصل وطماطم، وبيض وحليب"
        />
        <div className="pantry-actions">
          <button className="btn btn-primary" type="button" onClick={applyDraft}>
            رشّحلي على أساسهم
          </button>
          <span className="results-note">
            بنفهم المرادفات (فراخ = دجاج، بطاطا = بطاطس) وبنطابق على المقادير
            المكتوبة للوصفات المراجعة.
          </span>
        </div>
        {note && (
          <p className="results-note" role="status">
            {note}
          </p>
        )}
      </div>
      <div
        className="chip-row"
        role="group"
        aria-label="مكونات سريعة"
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
        <div className="chip-row" aria-label="اللي عندك دلوقتي">
          <strong>اللي عندك ({sel.length}):</strong>
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
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setSel([])}
          >
            امسح الكل
          </button>
        </div>
      )}
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
      {sel.length > 0 && unlocks.length > 0 && (
        <section className="block unlock-box">
          <SectionHead
            title="اشتري حاجة واحدة… وافتح وصفات أكتر 🛒"
            sub="محسوبة من المقادير المكتوبة فعليًا: المكوّن ده لوحده بيكمّل الوصفات دي على اللي عندك"
          />
          <div className="unlock-list">
            {unlocks.map((u) => (
              <div className="unlock-item" key={u.ingredient}>
                <p>
                  <b>زوّد «{u.ingredient}»</b> — هيكمّلك {u.unlocks.length}{" "}
                  {u.unlocks.length === 1 ? "وصفة" : "وصفات"}
                  {u.savedUnlocks.length > 0 &&
                    ` (منها ${u.savedUnlocks.length} من محفوظاتك)`}
                  {u.nearCount > 0 &&
                    `، ويقرّبك خطوة في ${u.nearCount} تانية`}
                </p>
                <div className="pantry-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-expanded={unlockOpen === u.ingredient}
                    onClick={() =>
                      setUnlockOpen((k) => (k === u.ingredient ? "" : u.ingredient))
                    }
                  >
                    {unlockOpen === u.ingredient ? "اخفي الوصفات" : "شوف الوصفات"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-olive btn-sm"
                    disabled={shop.has(u.ingredient)}
                    onClick={() => !shop.has(u.ingredient) && shop.toggle(u.ingredient)}
                  >
                    {shop.has(u.ingredient)
                      ? "في مشترياتك ✓"
                      : `ضيف ${u.ingredient} للمشتريات`}
                  </button>
                </div>
                {unlockOpen === u.ingredient && (
                  <div className="grid" style={{ marginTop: 12 }}>
                    {u.unlocks.map((r) => (
                      <RecipeCard
                        key={r.slug}
                        r={r}
                        reason={`بتكتمل عندك بزيادة ${u.ingredient}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {sel.length > 0 ? (
        <>
          <section className="block">
            <SectionHead
              title={`جاهزة باللي عندك (${full.length})`}
              sub="كل المقادير الإلزامية المكتوبة موجودة عندك — الإضافات الاختيارية مش محسوبة"
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
              title="قريبة — ناقصها حاجة بسيطة"
              sub="الناقص محسوب من المقادير المكتوبة. دوس على مكوّن ناقص لو بقى عندك وهنعيد الترشيح، أو زوّد الناقص للمشتريات"
            />
            <div className="grid">
              {near.slice(0, 12).map(({ r, missing }) => (
                <div key={r.slug} className="near-card">
                  <RecipeCard
                    r={r}
                    reason={`عندك أغلبها — ناقصك ${missing.length} بس`}
                  />
                  <div
                    className="missing-row"
                    aria-label={`الناقص لـ${r.title}`}
                  >
                    <span>ناقصك:</span>
                    {missing.map((i) => (
                      <button
                        type="button"
                        key={i.name}
                        className="missing-chip"
                        title="دوس لو بقى عندك"
                        onClick={() => toggle(i.name)}
                      >
                        {i.name} +
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-olive btn-sm"
                    disabled={shopped.includes(r.slug)}
                    onClick={() =>
                      addMissingToShopping(
                        r.slug,
                        missing.map((i) => i.name),
                      )
                    }
                  >
                    {shopped.includes(r.slug)
                      ? "اتضاف الناقص لمشترياتك ✓"
                      : "زوّد الناقص لقايمة المشتريات"}
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="block">
            <SectionHead
              title="ترشيحات فيديو بنفس مكوناتك"
              sub="لسه مقاديرها الكاملة مش مكتوبة عندنا، فبنرشحها بمكوّناتها الأساسية المسجلة — المقادير والنواقص الدقيقة في الفيديو نفسه"
            />
            <div className="grid">
              {ideas.slice(0, 12).map(({ r }) => (
                <RecipeCard
                  key={r.slug}
                  r={r}
                  reason="ترشيح فيديو — اتأكد من مقاديره في المصدر"
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="empty">
          <h2>اكتب اللي عندك أو اختار مكوّن</h2>
          <p>كل ما تزود مكونات، الترشيحات هتبقى أدق والنواقص أوضح.</p>
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
