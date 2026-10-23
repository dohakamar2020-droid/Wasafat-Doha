import { getCatalog, getRecipe } from "@/lib/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { creatorById, formatViews, ytWatchUrl } from "@/lib/data";
import { VideoEmbed, SaveButton } from "@/components/ui";

export async function generateStaticParams() {
  return (await getCatalog())
    .filter((r) => r.sources.some((s) => s.kind === "short"))
    .map((r) => ({ id: r.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const r = await getRecipe(id);
  return { title: r ? `شاهد: ${r.title}` : "المشاهدة" };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const recipes = await getCatalog();
  const { id } = await params;
  const r = await getRecipe(id);
  if (!r || !r.sources.some((s) => s.kind === "short")) notFound();
  const shorts = recipes
    .filter((x) => x.sources.some((s) => s.kind === "short"))
    .sort((a, b) => b.views - a.views);
  const idx = shorts.findIndex((x) => x.slug === r.slug);
  const prev = shorts[(idx - 1 + shorts.length) % shorts.length];
  const next = shorts[(idx + 1) % shorts.length];
  const s = r.sources.find((x) => x.kind === "short") || r.sources[0];
  const full = r.sources.find((x) => x.kind === "video");

  return (
    <div className="watch-shell">
      <span className="eyebrow">📱 شوف الفكرة في دقيقة — وصفات قمر</span>
      <h1 style={{ fontSize: "1.45rem", color: "var(--olive-2)" }}>
        {r.title}
      </h1>
      <p style={{ color: "var(--muted)", margin: "4px 0 14px" }}>
        {creatorById(r.creatorId).name} · 👁 {formatViews(s.views)} مشاهدة · نشر{" "}
        {s.published}
      </p>
      <VideoEmbed
        ytId={s.ytId}
        title={r.title}
        vertical
        embeddable={s.embeddable}
      />
      <div className="action-row" style={{ justifyContent: "center" }}>
        <SaveButton slug={r.slug} big />
        <Link className="btn btn-primary" href={`/recipes/${r.slug}`}>
          افتح تفاصيل الوصفة
        </Link>
        {full && (
          <span className="tag tag-need" style={{ alignSelf: "center" }}>
            لها شرح كامل في صفحة الوصفة
          </span>
        )}
      </div>
      <p>
        <a
          className="text-link"
          href={ytWatchUrl(s)}
          target="_blank"
          rel="noopener noreferrer"
        >
          أو شوفها على يوتيوب ↗
        </a>
      </p>
      <div className="watch-nav">
        <Link className="btn btn-ghost" href={`/watch/${prev.slug}`}>
          → اللي قبله
        </Link>
        <Link className="btn btn-olive" href={`/watch/${next.slug}`}>
          المقطع اللي بعده ←
        </Link>
      </div>
    </div>
  );
}
