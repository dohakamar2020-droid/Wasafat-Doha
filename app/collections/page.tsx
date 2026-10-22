import type { Metadata } from "next";
import Link from "next/link";
import { collections, recipes, ytThumb } from "@/lib/data";
export const metadata: Metadata = { title: "المجموعات", description: "مجموعات وصفات قمر المنتقاة: البطاطس في حتة تانية، حلويات التلاجة، عشاء الطاسة الواحدة، وأكتر." };
export default function CollectionsPage() {
  return (
    <div className="wrap">
      <div className="page-head"><h1>مجموعات وصفات قمر 📚</h1><p>مجموعات تحريرية لها شخصية وسبب — مش مجرد فلاتر. كل مجموعة باب لوصفات شبه بعض في المزاج أو الفكرة.</p></div>
      <div className="col-grid">
        {collections.map((c) => {
          const first = recipes.find((r) => r.slug === c.recipeSlugs[0])!;
          return (
            <Link key={c.slug} className="col-card" href={`/collections/${c.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ytThumb(first.sources[0].ytId)} alt={c.title} loading="lazy" />
              <div><span className="col-count">{c.recipeSlugs.length} وصفات</span><h3>{c.title}</h3><p>{c.desc}</p></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
