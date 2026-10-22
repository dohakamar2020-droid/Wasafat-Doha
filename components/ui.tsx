"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Recipe, creatorById, formatViews, ytThumb } from "@/lib/data";

/* ---------- localStorage helpers ---------- */
function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} window.dispatchEvent(new Event("wasafat-Doha:change")); }
export function useLocalList(key: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const load = () => setList(read<string[]>(key, []));
    load(); window.addEventListener("wasafat-Doha:change", load); window.addEventListener("storage", load);
    return () => { window.removeEventListener("wasafat-Doha:change", load); window.removeEventListener("storage", load); };
  }, [key]);
  const toggle = (id: string) => write(key, list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  return { list, toggle, has: (id: string) => list.includes(id) };
}
export const useSaved = () => useLocalList("wasafat-Doha:saved");
export const usePlanned = () => useLocalList("wasafat-Doha:planned");
export const useDone = () => useLocalList("wasafat-Doha:done");

/* ---------- Save button ---------- */
export function SaveButton({ slug, big }: { slug: string; big?: boolean }) {
  const { has, toggle } = useSaved();
  const saved = has(slug);
  return (
    <button type="button" aria-pressed={saved} className={`save-btn ${saved ? "is-saved" : ""} ${big ? "save-btn-big" : ""}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}>
      {saved ? "♥ محفوظة" : "♡ عايز أجربها"}
    </button>
  );
}

/* ---------- Recipe card ---------- */
export function RecipeCard({ r, reason }: { r: Recipe; reason?: string }) {
  const c = creatorById(r.creatorId);
  const s = r.sources[0];
  return (
    <article className="card">
      <Link href={`/recipes/${r.slug}`} className="card-media" aria-label={r.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ytThumb(s.ytId)} alt={r.title} loading="lazy" width={480} height={360} />
        <span className={`kind-badge ${s.kind === "short" ? "is-short" : ""}`}>{s.kind === "short" ? "▶ شورت" : "▶ فيديو"}</span>
        {r.sources.length > 1 && <span className="multi-badge">شرح كامل + شورت</span>}
        {r.status === "reviewed" ? <span className="reviewed-badge">✓ وصفة مكتملة</span> : <span className="video-badge">ترشيح فيديو</span>}
        <SaveButton slug={r.slug} />
      </Link>
      <div className="card-body">
        <Link href={`/recipes/${r.slug}`} className="card-title">{r.title}</Link>
        <div className="card-meta">
          <Link href={`/creators/${c.id}`} className="chef-link">{c.name}</Link>
          <span>·</span><span>{r.category}</span>
        </div>
        <div className="card-tags">
          <span className="tag tag-views">👁 {formatViews(r.views)} مشاهدة</span>
          {r.mainIngredients.slice(0, 2).map((i) => <span className="tag" key={i}>{i}</span>)}
          {r.needs.slice(0, 1).map((n) => <span className="tag tag-need" key={n}>{n}</span>)}
        </div>
        {(reason || r.editorsPick) && <p className="card-why">✦ {reason || r.why}</p>}
      </div>
    </article>
  );
}

/* ---------- Short card (vertical) ---------- */
export function ShortCard({ r }: { r: Recipe }) {
  const s = r.sources.find((x) => x.kind === "short") || r.sources[0];
  return (
    <article className="short-card">
      <Link href={`/watch/${r.slug}`} className="short-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ytThumb(s.ytId)} alt={r.title} loading="lazy" width={270} height={480} />
        <span className="play-dot">▶</span>
        <SaveButton slug={r.slug} />
      </Link>
      <Link href={`/recipes/${r.slug}`} className="short-title">{r.title}</Link>
      <span className="short-meta">{creatorById(r.creatorId).name} · 👁 {formatViews(s.views)}</span>
    </article>
  );
}

/* ---------- Video embed (loads on click) ---------- */
export function VideoEmbed({ ytId, title, vertical }: { ytId: string; title: string; vertical?: boolean }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className={`embed-wrap ${vertical ? "is-vertical" : ""}`}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&autoplay=1`} title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  return (
    <button type="button" className={`embed-poster ${vertical ? "is-vertical" : ""}`} onClick={() => setPlay(true)} aria-label={`تشغيل: ${title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ytThumb(ytId)} alt={title} width={vertical ? 270 : 640} height={vertical ? 480 : 360} />
      <span className="big-play">▶</span>
      <span className="embed-hint">شغّل الفيديو من يوتيوب هنا</span>
    </button>
  );
}

/* ---------- Section heading ---------- */
export function SectionHead({ title, sub, href, linkText }: { title: string; sub?: string; href?: string; linkText?: string }) {
  return (
    <div className="section-head">
      <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
      {href && <Link className="text-link" href={href}>{linkText || "شوف الكل"} ←</Link>}
    </div>
  );
}
