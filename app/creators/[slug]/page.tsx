import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { creators, creatorById, recipes, formatViews, ytWatchUrl } from "@/lib/data";
import { RecipeCard } from "@/components/ui";
export function generateStaticParams() { return creators.map((c) => ({ slug: c.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const c = creators.find((x) => x.id === slug);
  return { title: c ? `${c.name}` : "شيف", description: c ? `وصفات ${c.name} المنتقاة في وصفات قمر. ${c.tagline}` : undefined };
}
export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!creators.find((x) => x.id === slug)) notFound();
  const c = creatorById(slug);
  const list = recipes.filter((r) => r.creatorId === c.id).sort((a, b) => b.views - a.views);
  const cats = [...new Set(list.map((r) => r.category))];
  return (
    <div className="wrap">
      <div className="page-head" style={{ textAlign: "center" }}>
        <div className="creator-avatar" style={{ width: 96, height: 96, fontSize: "2.1rem" }}>{c.name.slice(0, 1)}</div>
        <h1>{c.name}</h1><p style={{ marginInline: "auto" }}>{c.tagline}. {c.style}.</p>
        <p><span className="tag tag-views">{list.length} وصفة منتقاة · 👁 {formatViews(list.reduce((a, r) => a + r.views, 0))} مشاهدة إجمالًا</span></p>
        <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>المصدر الأصلي: {c.channelHint} — افتح أي وصفة وهتلاقي رابط فيديوها الأصلي. {list[0] && <a className="text-link" href={ytWatchUrl(list[0].sources[0])} target="_blank" rel="noopener noreferrer">مثال: أشهر وصفة ↗</a>}</p>
        <div className="chip-row" style={{ justifyContent: "center" }}>{cats.map((cat) => <Link key={cat} className="ing-chip" href={`/discover?creator=${c.id}&cat=${encodeURIComponent(cat)}`}>{cat} من {c.name}</Link>)}</div>
      </div>
      <div className="grid">{list.map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
    </div>
  );
}
