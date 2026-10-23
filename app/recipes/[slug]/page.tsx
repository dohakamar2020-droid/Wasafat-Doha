import { getCatalog, getRecipe } from "@/lib/catalog";
import SosPanel from "@/components/SosPanel";
import CommunityAttempts from "@/components/CommunityAttempts";
import { related } from "@/lib/experience";
import { siteURL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { creatorById, formatViews, ytWatchUrl, collections } from "@/lib/data";
import { RecipeCard } from "@/components/ui";
import ReviewedSection from "@/components/ReviewedSection";
import MyVersion from "@/components/MyVersion";
import TrialCard from "@/components/TrialCard";
import RecipeInteractive from "./RecipeInteractive";

export async function generateStaticParams() {
  return (await getCatalog()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRecipe(slug);
  if (!r) return { title: "وصفة مش موجودة" };
  return {
    alternates: { canonical: `${siteURL()}/recipes/${r.slug}` },
    openGraph: {
      title: r.title,
      description: r.why,
      images: [`https://i.ytimg.com/vi/${r.sources[0].ytId}/hqdefault.jpg`],
    },
    title: `${r.title} — ${creatorById(r.creatorId).name}`,
    description: `${r.title} من ${creatorById(r.creatorId).name} على وصفات قمر. ${r.why}`,
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await getRecipe(slug);
  if (!r) notFound();
  const c = creatorById(r.creatorId);
  const relatedList = related(r, await getCatalog());
  const myCols = collections.filter((col) => col.recipeSlugs.includes(r.slug));
  const structured = r.detail
    ? {
        // بيانات Recipe المنظمة بتتضاف بس للوصفات المكتملة المراجعة فعلًا وظاهرة للمستخدم
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: `${r.title} — وصفات قمر`,
        description: r.why,
        image: [`https://i.ytimg.com/vi/${r.sources[0].ytId}/hqdefault.jpg`],
        author: { "@type": "Person", name: c.name },
        recipeYield: r.detail.servings,
        recipeIngredient: r.detail.ingredients.flatMap((g) =>
          g.items.map((i) => i.display),
        ),
        recipeInstructions: r.detail.steps.map((st) => ({
          "@type": "HowToStep",
          name: st.title,
          text: st.body,
        })),
        video: {
          "@type": "VideoObject",
          name: r.title,
          thumbnailUrl: [
            `https://i.ytimg.com/vi/${r.sources[0].ytId}/hqdefault.jpg`,
          ],
          embedUrl: `https://www.youtube-nocookie.com/embed/${r.sources[0].ytId}`,
          ...(r.sources[0].uploadedAt
            ? { uploadDate: r.sources[0].uploadedAt }
            : {}),
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${r.title} — وصفات قمر`,
        description: r.why,
        thumbnailUrl: [
          `https://i.ytimg.com/vi/${r.sources[0].ytId}/hqdefault.jpg`,
        ],
        embedUrl: `https://www.youtube-nocookie.com/embed/${r.sources[0].ytId}`,
        ...(r.sources[0].uploadedAt
          ? { uploadDate: r.sources[0].uploadedAt }
          : {}),
      };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <RecipeInteractive r={r} />
      {r.detail && <ReviewedSection detail={r.detail} slug={r.slug} />}
      <MyVersion r={r} />
      <TrialCard r={r} />
      <SosPanel />
      <CommunityAttempts slug={r.slug} />

      <section className="surface" aria-labelledby="src-h">
        <h2 id="src-h">المصدر الأصلي 📺</h2>
        <p style={{ color: "var(--muted)" }}>
          الوصفة من{" "}
          <Link className="chef-link" href={`/creators/${c.id}`}>
            {c.name}
          </Link>
          .
          {r.detail ? (
            <>
              حالة الوصفة هنا في وصفات قمر: <b>وصفة مكتملة ✓</b> — المقادير
              والخطوات اللي فوق مراجعة يدويًا من وصف القناة الرسمية وشرح الفيديو
              (شوف ملحوظة المراجعة تحت الخطوات)، والفيديو الأصلي هو المرجع الأول
              دايمًا.
            </>
          ) : (
            <>
              والمقادير والخطوات التفصيلية موجودة في الفيديو الأصلي على يوتيوب.
              حالة الوصفة هنا في وصفات قمر: <b>ترشيح فيديو</b> — يعني انتقيناها
              ورتبناها، ولسه مراجعة المقادير والخطوات المكتوبة قيد التحرير، عشان
              كده مش هنعرضلك أوقات طبخ أو مقادير متخيّلة.
            </>
          )}{" "}
          <a className="text-link" href={`/contact?recipe=${r.slug}`}>
            الإبلاغ عن مشكلة في المصدر ←
          </a>
        </p>
        <div className="info-grid">
          <div className="info-cell">
            <span>صاحب الوصفة</span>
            <b>{c.name}</b>
          </div>
          <div className="info-cell">
            <span>نوع الأكلة</span>
            <b>{r.category}</b>
          </div>
          <div className="info-cell">
            <span>المكونات الظاهرة</span>
            <b>{r.mainIngredients.join("، ")}</b>
          </div>
          <div className="info-cell">
            <span>مشاهدات يوتيوب (آخر مراجعة)</span>
            <b>👁 {formatViews(r.views)}</b>
          </div>
          {r.sources.map((s) => (
            <div className="info-cell" key={s.ytId}>
              <span>
                {s.kind === "short" ? "شورت" : "فيديو كامل"} · نشر {s.published}
              </span>
              <b>
                <a
                  className="text-link"
                  href={ytWatchUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  افتحه على يوتيوب ↗
                </a>
              </b>
            </div>
          ))}
        </div>
        {r.textures.length > 0 && (
          <p>
            القوام:{" "}
            {r.textures.map((t) => (
              <span className="tag" key={t} style={{ marginInlineEnd: 6 }}>
                {t}
              </span>
            ))}
          </p>
        )}
        {r.needs.length > 0 && (
          <p>
            مناسبة لو:{" "}
            {r.needs.map((n) => (
              <span
                className="tag tag-need"
                key={n}
                style={{ marginInlineEnd: 6 }}
              >
                {n}
              </span>
            ))}
          </p>
        )}
        {myCols.length > 0 && (
          <p>
            موجودة في مجموعات:{" "}
            {myCols.map((col) => (
              <Link
                key={col.slug}
                className="text-link"
                href={`/collections/${col.slug}`}
                style={{ marginInlineEnd: 10 }}
              >
                {col.title}
              </Link>
            ))}
          </p>
        )}
      </section>

      {relatedList.length > 0 && (
        <section className="block" aria-labelledby="rel-h">
          <div className="section-head">
            <div>
              <h2 id="rel-h">قريب منها… بطعم مختلف</h2>
              <p>اقتراحات لها علاقة واضحة باللي شفته</p>
            </div>
          </div>
          <div className="grid">
            {relatedList.map(({ recipe, reason }) => (
              <RecipeCard key={recipe.slug} r={recipe} reason={reason} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
