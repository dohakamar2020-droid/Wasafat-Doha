"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Play, ChevronDown, ChevronUp } from "lucide-react";
import { creatorById, ytThumb, ytWatchUrl, type Recipe, type VideoSource } from "@/lib/data";
import { useSaved, useHidden } from "@/components/ui";
import FoodImage from "@/components/FoodImage";

function ShortSlide({ recipe, source, index, total }: { recipe: Recipe; source: VideoSource; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const lastTap = useRef(0);
  const [playing, setPlaying] = useState(false);
  const { has, toggle } = useSaved();
  const saved = has(recipe.slug);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) setPlaying(false); }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  function doubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (!saved) toggle(recipe.slug);
      lastTap.current = 0;
    } else lastTap.current = now;
  }
  function go(offset: number) {
    ref.current?.parentElement?.children[index + offset]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return <article className="feed-slide" ref={ref}>
    <div className="feed-player">
      {playing && source.embeddable !== false ? <iframe src={`https://www.youtube-nocookie.com/embed/${source.ytId}?autoplay=1&rel=0&playsinline=1`} title={`شاهد ${recipe.title}`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <button className="feed-poster" type="button" onClick={() => source.embeddable !== false && setPlaying(true)} disabled={source.embeddable === false} aria-label={`تشغيل ${recipe.title}`}>
        <FoodImage src={ytThumb(source.ytId)} alt="" width={480} height={640} />
        {source.embeddable !== false && <span className="feed-play"><Play fill="currentColor" aria-hidden="true" /></span>}
      </button>}
    </div>
    <div className="feed-info" onTouchEnd={doubleTap} onDoubleClick={() => { if (!saved) toggle(recipe.slug); }}>
      <span className="feed-category">{recipe.category} · {index + 1} / {total}</span>
      <h2>{recipe.title}</h2><p>{creatorById(recipe.creatorId)?.name} · اضغط مرتين هنا للحفظ ♥</p>
      <div className="feed-actions">
        <button type="button" onClick={() => toggle(recipe.slug)} aria-pressed={saved} aria-label={`${saved ? "إلغاء حفظ" : "حفظ"} ${recipe.title}`}><Heart size={19} fill={saved ? "currentColor" : "none"} /> {saved ? "محفوظة" : "أعجبني"}</button>
        <Link href={`/recipes/${recipe.slug}`}>الوصفة</Link>
        <a href={ytWatchUrl(source)} target="_blank" rel="noopener noreferrer">يوتيوب ↗</a>
      </div>
    </div>
    <div className="feed-arrows"><button type="button" disabled={index === 0} onClick={() => go(-1)} aria-label="المقطع السابق"><ChevronUp /></button><button type="button" disabled={index === total - 1} onClick={() => go(1)} aria-label="المقطع التالي"><ChevronDown /></button></div>
  </article>;
}

export default function WatchFeed({ recipes, initialCategory = "" }: { recipes: Recipe[]; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const hidden = useHidden();
  const shorts = recipes.filter(r => r.sources.some(s => s.kind === "short") && !hidden.has(r.slug));
  const categories = Array.from(new Set(shorts.map(r => r.category))).sort();
  const filtered = shorts.filter(r => !category || r.category === category);
  return <section className="feed-shell">
    <div className="feed-heading"><div><span>وصفات قمر / اتفرج</span><h1>شورتس على مزاجك</h1><p>اسحب لفوق أو لتحت، واضغط مرتين على وصف المقطع لحفظه.</p></div><Link href="/kitchen/saved">♥ قائمة الإعجابات</Link></div>
    <nav className="watch-tabs" aria-label="نوع المشاهدة"><Link href="/watch" aria-current="page">الشورتس</Link><Link href="/videos">الفيديوهات</Link></nav>
    <div className="feed-categories" aria-label="تصنيفات الشورتس"><button type="button" aria-pressed={!category} onClick={() => setCategory("")}>الكل</button>{categories.map(c => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {filtered.length ? <div className="feed-scroll" key={category} aria-label="مقاطع الشورتس">{filtered.map((r, i) => <ShortSlide key={r.slug} recipe={r} source={r.sources.find(s => s.kind === "short")!} index={i} total={filtered.length} />)}</div> : <div className="feed-empty">مفيش شورتس في التصنيف ده حاليًا. اختار الكل.</div>}
    <p className="feed-note">التشغيل من يوتيوب؛ بعض الفيديوهات قد لا تسمح بالتضمين. اللايك هنا بيحفظ الوصفة في قائمتك، مش لايك على يوتيوب.</p>
  </section>;
}
