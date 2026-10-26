"use client";
import Link from "next/link";
import { useCatalog } from "@/components/CatalogProvider";
import { KitchenTabs } from "@/components/KitchenShell";
import { SyncBanner } from "@/components/KitchenShell";
import { useHidden } from "@/components/ui";
import FoodImage from "@/components/FoodImage";
import { creatorById, ytThumb } from "@/lib/data";

export default function HiddenPage() {
  const catalog = useCatalog();
  const hidden = useHidden();
  const list = catalog.filter((r) => hidden.list.includes(r.slug));
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>الوصفات المخفية</h1>
        <p>
          اللي علمت عليه «إخفاء» بيختفي من كروت القوائم عندك على الجهاز
          ده. تقدر ترجّع أي وصفة في أي وقت من هنا — الإخفاء مش حذف ولا
          بيأثر على حساب حد تاني.
        </p>
      </div>
      <KitchenTabs />
      <SyncBanner />
      {list.length ? (
        <div className="grid">
          {list.map((r) => (
            <article className="card" key={r.slug}>
              <div className="card-media">
                <Link href={`/recipes/${r.slug}`} aria-label={r.title}>
                  <FoodImage
                    src={ytThumb(r.sources[0].ytId)}
                    alt={r.title}
                    width={480}
                    height={360}
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="card-body">
                <Link href={`/recipes/${r.slug}`} className="card-title">
                  {r.title}
                </Link>
                <p className="card-meta">
                  {creatorById(r.creatorId)?.name || ""}
                </p>
                <button
                  type="button"
                  className="btn btn-olive btn-sm"
                  onClick={() => hidden.toggle(r.slug)}
                >
                  إظهار الوصفة تاني
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>مفيش وصفات مخفية</h2>
          <p>
            لما وصفة مش مناسبة ليك، دوس أيقونة الإخفاء على كارتها وهتلاقيها
            هنا لو حبيت ترجعها.
          </p>
          <Link className="btn btn-primary" href="/discover">
            اكتشف وصفات
          </Link>
        </div>
      )}
    </div>
  );
}
