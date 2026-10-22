import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipes, recipeBySlug, creatorById, formatViews, ytWatchUrl, collections, relatedRecipes } from "@/lib/data";
import { RecipeCard } from "@/components/ui";
import RecipeInteractive from "./RecipeInteractive";

export function generateStaticParams() { return recipes.map((r) => ({ slug: r.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) return { title: "وصفة مش موجودة" };
  return {
    title: `${r.title} — ${creatorById(r.creatorId).name}`,
    description: `${r.title} من ${creatorById(r.creatorId).name} على وصفات قمر. ${r.why}`,
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = recipeBySlug(slug);
  if (!r) notFound();
  const c = creatorById(r.creatorId);
  const related = relatedRecipes(r);
  const myCols = collections.filter((col) => col.recipeSlugs.includes(r.slug));
  const structured = {
    "@context": "https://schema.org", "@type": "VideoObject",
    name: `${r.title} — وصفات قمر`, description: r.why,
    thumbnailUrl: [`https://i.ytimg.com/vi/${r.sources[0].ytId}/hqdefault.jpg`],
    contentUrl: ytWatchUrl(r.sources[0]),
  };

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <RecipeInteractive r={r} />

      <section className="surface" aria-labelledby="src-h">
        <h2 id="src-h">المصدر الأصلي 📺</h2>
        <p style={{ color: "var(--muted)" }}>
          الوصفة من <Link className="chef-link" href={`/creators/${c.id}`}>{c.name}</Link>، والمقادير والخطوات التفصيلية موجودة في الفيديو الأصلي على يوتيوب.
          حالة الوصفة هنا في وصفات قمر: <b>ترشيح فيديو</b> — يعني انتقيناها ورتبناها، ولسه مراجعة المقادير والخطوات المكتوبة قيد التحرير،
          عشان كده مش هنعرضلك أوقات طبخ أو مقادير متخيّلة.
        </p>
        <div className="info-grid">
          <div className="info-cell"><span>صاحب الوصفة</span><b>{c.name}</b></div>
          <div className="info-cell"><span>نوع الأكلة</span><b>{r.category}</b></div>
          <div className="info-cell"><span>المكونات الظاهرة</span><b>{r.mainIngredients.join("، ")}</b></div>
          <div className="info-cell"><span>مشاهدات يوتيوب (آخر مراجعة)</span><b>👁 {formatViews(r.views)}</b></div>
          {r.sources.map((s) => (
            <div className="info-cell" key={s.ytId}><span>{s.kind === "short" ? "شورت" : "فيديو كامل"} · نشر {s.published}</span>
              <b><a className="text-link" href={ytWatchUrl(s)} target="_blank" rel="noopener noreferrer">افتحه على يوتيوب ↗</a></b></div>
          ))}
        </div>
        {r.textures.length > 0 && <p>القوام: {r.textures.map((t) => <span className="tag" key={t} style={{ marginInlineEnd: 6 }}>{t}</span>)}</p>}
        {r.needs.length > 0 && <p>مناسبة لو: {r.needs.map((n) => <span className="tag tag-need" key={n} style={{ marginInlineEnd: 6 }}>{n}</span>)}</p>}
        {myCols.length > 0 && <p>موجودة في مجموعات: {myCols.map((col) => <Link key={col.slug} className="text-link" href={`/collections/${col.slug}`} style={{ marginInlineEnd: 10 }}>{col.title}</Link>)}</p>}
      </section>

      {related.length > 0 && (
        <section className="block" aria-labelledby="rel-h">
          <div className="section-head"><div><h2 id="rel-h">قريب منها… بطعم مختلف</h2><p>اقتراحات لها علاقة واضحة باللي شفته</p></div></div>
          <div className="grid">{related.map(({ recipe, reason }) => <RecipeCard key={recipe.slug} r={recipe} reason={reason} />)}</div>
        </section>
      )}
    </div>
  );
}
