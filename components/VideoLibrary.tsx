"use client";
import Link from "next/link";
import { useState } from "react";
import { creatorById, ytThumb, ytWatchUrl, type Recipe } from "@/lib/data";
import { useHidden, VideoEmbed, SaveButton } from "@/components/ui";
import FoodImage from "@/components/FoodImage";

export default function VideoLibrary({ recipes }: { recipes: Recipe[] }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const hidden = useHidden();
  const videos = recipes.filter(r => r.sources.some(s => s.kind === "video") && !hidden.has(r.slug));
  const categories = Array.from(new Set(videos.map(r => r.category))).sort();
  const results = videos.filter(r => (!category || r.category === category) && `${r.title} ${creatorById(r.creatorId)?.name} ${r.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const active = results.find(r => r.slug === selected);
  const source = active?.sources.find(s => s.kind === "video");
  return <div className="video-library wrap">
    <div className="page-head"><span className="eyebrow">🎬 مكتبة المشاهدة</span><h1>فيديوهات على مهلك</h1><p>شرح وأفكار من أصحابها على يوتيوب، كلها في مكان واحد.</p></div>
    <nav className="watch-tabs" aria-label="نوع المشاهدة"><Link href="/watch">الشورتس</Link><Link href="/videos" aria-current="page">الفيديوهات</Link><Link href="/kitchen/saved">♥ محفوظاتي</Link></nav>
    <label className="video-search">دور على فيديو أو شيف<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="مثلاً بطاطس أو اسم الشيف" /></label>
    <div className="feed-categories" aria-label="تصنيفات الفيديوهات"><button type="button" aria-pressed={!category} onClick={() => setCategory("")}>الكل</button>{categories.map(c => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {active && source && <section className="video-now" aria-label="الفيديو المختار" key={active.slug}><VideoEmbed ytId={source.ytId} title={active.title} embeddable={source.embeddable} /><div><h2>{active.title}</h2><p>{creatorById(active.creatorId)?.name} · {active.category}</p><div className="action-row"><SaveButton slug={active.slug} big title={active.title}/><Link className="btn btn-primary" href={`/recipes/${active.slug}`}>تفاصيل الوصفة</Link><a className="text-link" href={ytWatchUrl(source)} target="_blank" rel="noopener noreferrer">المصدر على يوتيوب ↗</a></div></div></section>}
    <p className="results-note">{results.length} فيديو · اختار فيديو للمشاهدة</p>
    <div className="video-grid">{results.map(r => { const s = r.sources.find(x => x.kind === "video")!; return <article className="video-card" key={r.slug}><button type="button" className="video-thumb" onClick={() => { setSelected(r.slug); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={`اختيار ${r.title}`}><FoodImage src={ytThumb(s.ytId)} alt="" width={480} height={270}/><span>▶</span></button><div><h2>{r.title}</h2><p>{creatorById(r.creatorId)?.name} · {r.category}</p><SaveButton slug={r.slug} title={r.title} /></div></article>; })}</div>
    {!results.length && <div className="empty">مفيش نتائج، جرّب كلمة أو تصنيف تاني.</div>}
  </div>;
}
