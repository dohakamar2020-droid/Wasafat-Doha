"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Play, CheckCircle2 } from "lucide-react";
import { type Recipe, creatorById, formatViews, ytThumb } from "@/lib/data";
import { useStored } from "./useStored";
import FoodImage from "./FoodImage";
export function useLocalList(key: string) {
  const [list, set] = useStored<string[]>(key, []);
  return {
    list,
    toggle: (id: string) =>
      set((old) =>
        old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
      ),
    has: (id: string) => list.includes(id),
  };
}
export const useSaved = () => useLocalList("wasafat-Doha:saved");
export const usePlanned = () => useLocalList("wasafat-Doha:planned");
export const useDone = () => useLocalList("wasafat-Doha:done");
export function SaveButton({
  slug,
  big,
  title,
}: {
  slug: string;
  big?: boolean;
  title?: string;
}) {
  const { has, toggle } = useSaved();
  const saved = has(slug);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? "إلغاء حفظ" : "حفظ"} ${title || "الوصفة"}`}
      className={`save-btn ${saved ? "is-saved" : ""} ${big ? "save-btn-big" : ""}`}
      onClick={() => toggle(slug)}
    >
      <Heart
        size={18}
        fill={saved ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {big && <span>{saved ? "محفوظة" : "عايز أجربها"}</span>}
    </button>
  );
}
export function RecipeCard({ r, reason }: { r: Recipe; reason?: string }) {
  const c = creatorById(r.creatorId);
  const s = r.sources[0];
  if (!s) return null;
  return (
    <article className="card">
      <div className="card-media">
        <Link href={`/recipes/${r.slug}`} aria-label={r.title}>
          <FoodImage
            src={ytThumb(s.ytId)}
            alt={r.title}
            loading="lazy"
            width={480}
            height={360}
          />
        </Link>
        <span className={`kind-badge ${s.kind === "short" ? "is-short" : ""}`}>
          {s.kind === "short" ? "شورت" : "فيديو"}
        </span>
        <span className={r.detail ? "reviewed-badge" : "video-badge"}>
          {r.detail ? "مقادير وخطوات" : "ترشيح فيديو"}
        </span>
        <SaveButton slug={r.slug} title={r.title} />
      </div>
      <div className="card-body">
        <Link href={`/recipes/${r.slug}`} className="card-title">
          {r.title}
        </Link>
        <div className="card-meta">
          <Link className="chef-link" href={`/creators/${c.id}`}>
            {c.name}
          </Link>
          <span>·</span>
          <span>{r.category}</span>
        </div>
        <div className="card-tags">
          <span className="tag tag-views">{formatViews(r.views)} مشاهدة</span>
          {r.totalMinutes && (
            <span className="tag tag-need">{r.totalMinutes} دقيقة</span>
          )}
          {r.mainIngredients.slice(0, 2).map((i) => (
            <span className="tag" key={i}>
              {i}
            </span>
          ))}
        </div>
        {(reason || r.editorsPick) && (
          <p className="card-why">{reason || r.why}</p>
        )}
        {r.testedNote && (
          <span className="tag tag-need">
            <CheckCircle2 size={12} aria-hidden="true" /> تجربة موثقة من الفريق
          </span>
        )}
      </div>
    </article>
  );
}
export function ShortCard({ r }: { r: Recipe }) {
  const s = r.sources.find((x) => x.kind === "short") || r.sources[0];
  if (!s) return null;
  return (
    <article className="short-card">
      <div className="short-media">
        <Link href={`/watch/${r.slug}`} aria-label={`شاهد ${r.title}`}>
          <FoodImage
            src={ytThumb(s.ytId)}
            alt={r.title}
            loading="lazy"
            width={270}
            height={480}
          />
          <span className="play-dot">
            <Play size={22} aria-hidden="true" />
          </span>
        </Link>
        <SaveButton slug={r.slug} title={r.title} />
      </div>
      <Link href={`/recipes/${r.slug}`} className="short-title">
        {r.title}
      </Link>
      <span className="short-meta">
        {creatorById(r.creatorId).name} · {formatViews(s.views)} مشاهدة
      </span>
    </article>
  );
}
export function VideoEmbed({
  ytId,
  title,
  vertical,
  embeddable = true,
}: {
  ytId: string;
  title: string;
  vertical?: boolean;
  embeddable?: boolean;
}) {
  const [play, setPlay] = useState(false);
  if (!embeddable)
    return (
      <div className="empty">
        <h3>الفيديو متاح عند صاحبه</h3>
        <p>المشاهدة داخل الموقع غير متاحة للمصدر ده.</p>
        <a
          className="btn btn-primary"
          href={`https://www.youtube.com/watch?v=${ytId}`}
          target="_blank"
          rel="noreferrer"
        >
          شاهد على يوتيوب
        </a>
      </div>
    );
  return (
    <div>
      <div
        className={play ? `embed-wrap ${vertical ? "is-vertical" : ""}` : ""}
      >
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={`embed-poster ${vertical ? "is-vertical" : ""}`}
            onClick={() => setPlay(true)}
            aria-label={`تشغيل: ${title}`}
          >
            <FoodImage
              src={ytThumb(ytId)}
              alt={title}
              width={vertical ? 270 : 640}
              height={vertical ? 480 : 360}
            />
            <span className="big-play">
              <Play size={30} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="embed-hint">شاهد شرح الشيف</span>
          </button>
        )}
      </div>
      {play && (
        <p className="results-note">
          لو الفيديو مش ظاهر،{" "}
          <a
            className="text-link"
            href={`https://www.youtube.com/watch?v=${ytId}`}
            target="_blank"
            rel="noreferrer"
          >
            افتح المصدر على يوتيوب
          </a>
          .
        </p>
      )}
    </div>
  );
}
export function SectionHead({
  title,
  sub,
  href,
  linkText,
}: {
  title: string;
  sub?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkText || "شوف الكل"} ←
        </Link>
      )}
    </div>
  );
}
