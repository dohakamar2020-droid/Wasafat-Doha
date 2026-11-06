"use client";
import { useCatalog } from "@/components/CatalogProvider";
import { discoverySort, orderDiscovery, type DiscoverySort } from "@/lib/discovery-order";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  creators,
  categories,
  allTextures,
  allNeeds,
  allIngredients,
  searchRecipes,
} from "@/lib/data";
import { MEAL_TYPES, mealTypesOf, type MealType } from "@/lib/meal-types";
import { RecipeCard } from "@/components/ui";


function DiscoverInner() {
  const recipes = useCatalog();
  const sp = useSearchParams();
  const q = sp.get("q") || "";
  const cat = sp.get("cat") || "";
  const creator = sp.get("creator") || "";
  const kind = sp.get("kind") || "";
  const texture = sp.get("texture") || "";
  const need = sp.get("need") || "";
  const ing = sp.get("ing") || "";
  const status = sp.get("status") || "";
  const meal = sp.get("meal") || "";
  const sort = discoverySort(sp.get("sort"), q);
  const update = (key: string, value: string, replace = false) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    window.history[replace ? "replaceState" : "pushState"](null, "", url);
    setShown(24);
  };
  const setQ = (v: string) => update("q", v, true);
  const setCat = (v: string) => update("cat", v);
  const setCreator = (v: string) => update("creator", v);
  const setKind = (v: string) => update("kind", v);
  const setTexture = (v: string) => update("texture", v);
  const setNeed = (v: string) => update("need", v);
  const setIng = (v: string) => update("ing", v);
  const setStatus = (v: string) => update("status", v);
  const setMeal = (v: string) => update("meal", v);
  const setSort = (v: DiscoverySort) => update("sort", v);
  const [shown, setShown] = useState(24);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = q.trim() ? searchRecipes(q, recipes) : [...recipes];
    if (cat) list = list.filter((r) => r.category === cat);
    if (creator) list = list.filter((r) => r.creatorId === creator);
    if (kind) list = list.filter((r) => r.sources.some((s) => s.kind === kind));
    if (texture) list = list.filter((r) => r.textures.includes(texture));
    if (need) list = list.filter((r) => r.needs.includes(need));
    if (ing) list = list.filter((r) => r.mainIngredients.includes(ing));
    if (status) list = list.filter((r) => r.status === status);
    if (meal) list = list.filter((r) => mealTypesOf(r).includes(meal as MealType));
    return orderDiscovery(list, sort, q);
  }, [q, cat, creator, kind, texture, need, ing, sort, status, meal, recipes]);

  const active: [string, () => void][] = [];
  if (q) active.push([`بحث: ${q}`, () => setQ("")]);
  if (cat) active.push([cat, () => setCat("")]);
  if (creator)
    active.push([
      creators.find((c) => c.id === creator)?.name || creator,
      () => setCreator(""),
    ]);
  if (kind)
    active.push([
      kind === "short" ? "شورتس" : "فيديوهات كاملة",
      () => setKind(""),
    ]);
  if (texture) active.push([texture, () => setTexture("")]);
  if (need) active.push([need, () => setNeed("")]);
  if (ing) active.push([ing, () => setIng("")]);
  if (meal) active.push([meal, () => setMeal("")]);
  if (status)
    active.push([
      status === "reviewed" ? "وصفات مكتملة" : "ترشيحات فيديو",
      () => setStatus(""),
    ]);
  const clearAll = () => {
    const url = new URL(window.location.href);
    ["q", "cat", "creator", "kind", "texture", "need", "ing", "status", "meal"].forEach(key => url.searchParams.delete(key));
    window.history.pushState(null, "", url);
    setShown(24);
  };

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>اكتشف وصفات قمر 🔍</h1>
        <p>
          مكتبة وصفات قمر كلها: دور بالعربي زي ما بتتكلم — «فراخ» هتلاقي الدجاج،
          و«غلاش» هتلاقي الجلاش.
        </p>
      </div>
      <form
        className="search-bar"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="بتدور على إيه؟ بطاطس، حلو بارد، عشاء سريع…"
          aria-label="ابحث في وصفات قمر"
        />
        {q && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setQ("")}
          >
            مسح
          </button>
        )}
      </form>

      <div className="quick-chips" role="group" aria-label="اختيارات سريعة">
        <button
          type="button"
          className={`qchip ${status === "reviewed" ? "on" : ""}`}
          aria-pressed={status === "reviewed"}
          onClick={() => setStatus(status === "reviewed" ? "" : "reviewed")}
        >
          ✓ وصفات مكتملة
        </button>
        <button
          type="button"
          className={`qchip ${kind === "short" ? "on" : ""}`}
          aria-pressed={kind === "short"}
          onClick={() => setKind(kind === "short" ? "" : "short")}
        >
          ⚡ شورتس
        </button>
        <button
          type="button"
          className={`qchip ${need === "بدون فرن" ? "on" : ""}`}
          aria-pressed={need === "بدون فرن"}
          onClick={() => setNeed(need === "بدون فرن" ? "" : "بدون فرن")}
        >
          🔥 بدون فرن
        </button>
        <button
          type="button"
          className={`qchip ${need === "مكونات قليلة" ? "on" : ""}`}
          aria-pressed={need === "مكونات قليلة"}
          onClick={() => setNeed(need === "مكونات قليلة" ? "" : "مكونات قليلة")}
        >
          🧺 مكونات قليلة
        </button>
        {MEAL_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            className={`qchip ${meal === t ? "on" : ""}`}
            aria-pressed={meal === t}
            onClick={() => setMeal(meal === t ? "" : t)}
          >
            🍽️ {t}
          </button>
        ))}
        <button
          type="button"
          className="qchip qchip-filters"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          ⚙️ الفلاتر{active.length ? ` (${active.length})` : ""}
        </button>
      </div>

      <div
        className={`filter-bar glass ${filtersOpen ? "open" : ""}`}
        role="group"
        aria-label="فلاتر الوصفات"
      >
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label="نوع الأكلة"
        >
          <option value="">كل الأنواع</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          aria-label="الشيف"
        >
          <option value="">كل الشيفات</option>
          {creators.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          aria-label="نوع الفيديو"
        >
          <option value="">فيديو أو شورت</option>
          <option value="video">فيديو كامل</option>
          <option value="short">شورت</option>
        </select>
        <select
          value={texture}
          onChange={(e) => setTexture(e.target.value)}
          aria-label="القوام"
        >
          <option value="">أي قوام</option>
          {allTextures.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          aria-label="الاحتياج"
        >
          <option value="">أي احتياج</option>
          {allNeeds.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <select
          value={ing}
          onChange={(e) => setIng(e.target.value)}
          aria-label="المكون الرئيسي"
        >
          <option value="">أي مكوّن</option>
          {allIngredients.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="حالة المراجعة"
        >
          <option value="">أي حالة مراجعة</option>
          <option value="reviewed">✓ وصفات مكتملة (مراجعة)</option>
          <option value="video">ترشيحات فيديو</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as DiscoverySort)}
          aria-label="ترتيب النتائج"
        >
          <option value="relevance">الأقرب للبحث</option>
          <option value="editor">اختيارات المحرر</option>
          <option value="views">الأكثر مشاهدة على يوتيوب</option>
          <option value="trend">🔥 الأكثر انتشارًا حديثًا</option>
          <option value="newest">الأحدث نشرًا</option>
          <option value="az">أبجدي</option>
        </select>
      </div>

      {active.length > 0 && (
        <div className="active-filters">
          {active.map(([label, clear]) => (
            <button
              key={label}
              className="af-chip"
              onClick={clear}
              aria-label={`إزالة فلتر ${label}`}
            >
              {label} ✕
            </button>
          ))}
          <button
            className="af-chip"
            style={{ background: "var(--orange)" }}
            onClick={clearAll}
          >
            خفف كل الفلاتر
          </button>
        </div>
      )}

      <p className="results-note" role="status" aria-live="polite">
        لقينا <b>{results.length}</b> وصفة{results.length !== 1 ? "" : ""} في
        وصفات قمر
        {sort === "views" ? " — مرتبة بمشاهدات يوتيوب وقت آخر مراجعة" : ""}
      </p>

      {results.length === 0 ? (
        <div className="empty">
          <h3>مش لاقيين نفس الطلب بالظبط 🤔</h3>
          <p>
            جرّب تخفف فلتر أو اتنين، أو دور بكلمة أبسط. دي وصفات شائعة
            ممكن تعجبك، مش نتائج مطابقة للبحث:
          </p>
          <button className="btn btn-primary" onClick={clearAll}>
            خفف الفلاتر وشوف الكل
          </button>
          <div className="grid" style={{ marginTop: 22, textAlign: "start" }}>
            {[...recipes]
              .sort((a, b) => b.views - a.views)
              .slice(0, 4)
              .map((r) => (
                <RecipeCard key={r.slug} r={r} />
              ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {results.slice(0, shown).map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </div>
          {shown < results.length && (
            <div style={{ textAlign: "center", margin: "28px 0" }}>
              <button
                className="btn btn-olive"
                onClick={() => setShown((s) => s + 24)}
              >
                حمّل وصفات أكتر ({results.length - shown} فاضلين)
              </button>
            </div>
          )}
        </>
      )}
      <p className="results-note" style={{ marginTop: 10 }}>
        محتار؟{" "}
        <Link className="text-link" href="/pick">
          خلّي «رشحلي 3» يختارلك ←
        </Link>
      </p>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap">
          <p style={{ padding: 40 }}>بنحمّل مكتبة وصفات قمر…</p>
        </div>
      }
    >
      <DiscoverInner />
    </Suspense>
  );
}
