import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, collectionBySlug, recipes } from "@/lib/data";
import { RecipeCard } from "@/components/ui";
export function generateStaticParams() { return collections.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const c = collectionBySlug(slug);
  return { title: c ? `${c.title}` : "مجموعة", description: c?.desc };
}
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = collectionBySlug(slug);
  if (!c) notFound();
  const list = c.recipeSlugs.map((s) => recipes.find((r) => r.slug === s)!).filter(Boolean);
  return (
    <div className="wrap">
      <div className="page-head"><span className="eyebrow">📚 مجموعة من وصفات قمر · {list.length} وصفات</span><h1>{c.title}</h1><p>{c.desc}</p></div>
      <div className="grid">{list.map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
    </div>
  );
}
