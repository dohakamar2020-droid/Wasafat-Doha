import FoodImage from "@/components/FoodImage";
import { getCatalog } from "@/lib/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { collections, ytThumb } from "@/lib/data";
export const metadata: Metadata = {
  title: "المجموعات",
  description:
    "مجموعات وصفات قمر المنتقاة: البطاطس في حتة تانية، حلويات التلاجة، عشاء الطاسة الواحدة، وأكتر.",
};
export default async function CollectionsPage() {
  const recipes = await getCatalog();
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>مجموعات وصفات قمر 📚</h1>
        <p>
          مجموعات تحريرية لها شخصية وسبب — مش مجرد فلاتر. كل مجموعة باب لوصفات
          شبه بعض في المزاج أو الفكرة.
        </p>
      </div>
      <div className="col-grid">
        {collections.map((c) => {
          const first = recipes.find((r) => c.recipeSlugs.includes(r.slug));
          if (!first) return null;
          return (
            <Link
              key={c.slug}
              className="col-card"
              href={`/collections/${c.slug}`}
            >
              <FoodImage
                src={ytThumb(first.sources[0].ytId)}
                alt={c.title}
                loading="lazy"
              />
              <div>
                <span className="col-count">{c.recipeSlugs.length} وصفات</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
