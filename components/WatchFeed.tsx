"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Heart, Play, ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { creatorById, ytThumb, ytWatchUrl, type Recipe, type VideoSource } from "@/lib/data";
import { useSaved, useHidden } from "@/components/ui";
import FoodImage from "@/components/FoodImage";
import { shuffleShorts, spreadShortCreators } from "@/lib/shorts-order";

function ShortSlide({ recipe, source, index, total, categories, category, setCategory }: { recipe: Recipe; source: VideoSource; index: number; total: number; categories: string[]; category: string; setCategory: (category: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const lastTap = useRef(0);
  const player = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const { has, toggle } = useSaved();
  const saved = has(recipe.slug);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const update = () => {
      const active = visible && document.visibilityState === "visible";
      setPlaying(active);
      if (!active) setMuted(true);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.intersectionRatio >= 0.6; update(); }, { root: el.parentElement, threshold: [0, 0.6] });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  function toggleSound() {
    const target = player.current?.contentWindow;
    if (!target) return;
    const command = muted ? "unMute" : "mute";
    target.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "https://www.youtube-nocookie.com");
    if (muted) target.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "https://www.youtube-nocookie.com");
    setMuted(!muted);
  }
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
      {playing && source.embeddable !== false ? <iframe ref={player} src={`https://www.youtube-nocookie.com/embed/${source.ytId}?autoplay=1&mute=1&rel=0&playsinline=1&enablejsapi=1`} title={`شاهد ${recipe.title}`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <button className="feed-poster" type="button" onClick={() => source.embeddable !== false && setPlaying(true)} disabled={source.embeddable === false} aria-label={`تشغيل ${recipe.title}`}>
        <FoodImage src={ytThumb(source.ytId)} alt="" width={480} height={640} />
        {source.embeddable !== false && <span className="feed-play"><Play fill="currentColor" aria-hidden="true" /></span>}
      </button>}
    </div>
    {playing && source.embeddable !== false && <button type="button" className="feed-sound" onClick={toggleSound} aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"} aria-pressed={!muted}>{muted ? <VolumeX size={22} /> : <Volume2 size={22} />}<span>{muted ? "شغّل الصوت" : "كتم الصوت"}</span></button>}
    {index === 0 && <div className="feed-first-categories"><div className="feed-categories" aria-label="تصنيفات الشورتس"><button type="button" aria-pressed={!category} onClick={() => setCategory("")}>الكل</button>{categories.map(c => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div></div>}
    <div className="feed-swipe-rail feed-swipe-right" aria-hidden="true" />
    <div className="feed-swipe-rail feed-swipe-left" aria-hidden="true" />
    <div className="feed-info" onTouchEnd={doubleTap} onDoubleClick={() => { if (!saved) toggle(recipe.slug); }}>
      <span className="feed-category">{recipe.category} · {index + 1} / {total}</span>
      <h2>{recipe.title}</h2><p>{creatorById(recipe.creatorId)?.name} · اضغط مرتين هنا للحفظ ♥</p>
      <p className="feed-tip">اسحب من طرف الشاشة للتقليب · اضغط على زر الصوت لسماعه</p>
      <div className="feed-actions">
        <button type="button" onClick={() => toggle(recipe.slug)} aria-pressed={saved} aria-label={`${saved ? "إلغاء حفظ" : "حفظ"} ${recipe.title}`}><Heart size={19} fill={saved ? "currentColor" : "none"} /> {saved ? "محفوظة" : "أعجبني"}</button>
        <Link href={`/recipes/${recipe.slug}`}>الوصفة</Link>
        <a href={ytWatchUrl(source)} target="_blank" rel="noopener noreferrer">يوتيوب ↗</a>
      </div>
    </div>
    <div className="feed-arrows"><button type="button" disabled={index === 0} onClick={() => go(-1)} aria-label="المقطع السابق"><ChevronUp /></button><button type="button" disabled={index === total - 1} onClick={() => go(1)} aria-label="المقطع التالي"><ChevronDown /></button></div>
  </article>;
}

export default function WatchFeed({ recipes, initialCategory = "", initialStart = "" }: { recipes: Recipe[]; initialCategory?: string; initialStart?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [shuffled, setShuffled] = useState<Recipe[] | null>(null);
  useEffect(() => { setShuffled(shuffleShorts(recipes)); }, [recipes]);
  const hidden = useHidden();
  const shorts = recipes.filter(r => r.sources.some(s => s.kind === "short") && !hidden.has(r.slug));
  const categories = Array.from(new Set(shorts.map(r => r.category))).sort();
  const eligible = (shuffled || []).filter(r => r.sources.some(s => s.kind === "short") && !hidden.has(r.slug) && (!category || r.category === category));
  const filtered = spreadShortCreators(eligible, !category ? initialStart : undefined);
  return <section className="feed-shell" aria-label="الشورتس">
    <div className="feed-top"><Link href="/" aria-label="العودة للرئيسية">✕</Link><h1>الشورتس</h1><Link href="/videos">الفيديوهات</Link><Link href="/kitchen/saved">♥ محفوظاتي</Link></div>
    {!shuffled ? <div className="feed-empty" role="status">بنجهز الشورتس…</div> : filtered.length ? <div className="feed-scroll" key={category} aria-label="مقاطع الشورتس">{filtered.map((r, i) => <ShortSlide key={r.slug} recipe={r} source={r.sources.find(s => s.kind === "short")!} index={i} total={filtered.length} categories={categories} category={category} setCategory={setCategory} />)}</div> : <div className="feed-empty">مفيش شورتس في التصنيف ده حاليًا. <button type="button" onClick={() => setCategory("")}>اختار الكل</button></div>}
  </section>;
}
