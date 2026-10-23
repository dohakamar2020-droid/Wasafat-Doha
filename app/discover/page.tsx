"use client";
import { useCatalog } from "@/components/CatalogProvider";
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
import { RecipeCard } from "@/components/ui";

type Sort = "editor" | "views" | "newest" | "az";

function DiscoverInner() {
  const recipes = useCatalog();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [cat, setCat] = useState(sp.get("cat") || "");
  const [creator, setCreator] = useState(sp.get("creator") || "");
  const [kind, setKind] = useState(sp.get("kind") || "");
  const [texture, setTexture] = useState(sp.get("texture") || "");
  const [need, setNeed] = useState(sp.get("need") || "");
  const [ing, setIng] = useState(sp.get("ing") || "");
  const [sort, setSort] = useState<Sort>("editor");
  const [status, setStatus] = useState(sp.get("status") || "");
  const [shown, setShown] = useState(24);

  const results = useMemo(() => {
    let list = q.trim() ? searchRecipes(q, recipes) : [...recipes];
    if (cat) list = list.filter((r) => r.category === cat);
    if (creator) list = list.filter((r) => r.creatorId === creator);
    if (kind) list = list.filter((r) => r.sources.some((s) => s.kind === kind));
    if (texture) list = list.filter((r) => r.textures.includes(texture));
    if (need) list = list.filter((r) => r.needs.includes(need));
    if (ing) list = list.filter((r) => r.mainIngredients.includes(ing));
    if (status) list = list.filter((r) => r.status === status);
    const byDate = (r: (typeof recipes)[0]) =>
      Math.max(
        0,
        ...r.sources.map((s) => {
          const [m, y] = s.published.split("/");
          return Number(y) * 100 + Number(m);
        }),
      );
    if (sort === "views") list.sort((a, b) => b.views - a.views);
    else if (sort === "newest") list.sort((a, b) => byDate(b) - byDate(a));
    else if (sort === "az")
      list.sort((a, b) => a.title.localeCompare(b.title, "ar"));
    else
      list.sort(
        (a, b) =>
          Number(b.editorsPick || false) - Number(a.editorsPick || false) ||
          b.views - a.views,
      );
    return list;
  }, [q, cat, creator, kind, texture, need, ing, sort, status, recipes]);

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
  if (status)
    active.push([
      status === "reviewed" ? "وصفات مكتملة" : "ترشيحات فيديو",
      () => setStatus(""),
    ]);
  const clearAll = () => {
    setQ("");
    setCat("");
    setCreator("");
    setKind("");
    setTexture("");
    setNeed("");
    setIng("");
    setStatus("");
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

      <div className="filter-bar glass" role="group" aria-label="فلاتر الوصفات">
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
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="ترتيب النتائج"
        >
          <option value="editor">اختيارات المحرر</option>
          <option value="views">الأكثر مشاهدة على يوتيوب</option>
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

      <p className="results-note">
        لقينا <b>{results.length}</b> وصفة{results.length !== 1 ? "" : ""} في
        وصفات قمر
        {sort === "views" ? " — مرتبة بمشاهدات يوتيوب وقت آخر مراجعة" : ""}
      </p>

      {results.length === 0 ? (
        <div className="empty">
          <h3>مش لاقيين نفس الطلب بالظبط 🤔</h3>
          <p>
            جرّب تخفف فلتر أو اتنين، أو دور بكلمة أبسط — ودول أقرب اختيارات
            متاحة:
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
