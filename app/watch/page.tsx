import { getCatalog } from "@/lib/catalog";
import { ShortCard } from "@/components/ui";

export const metadata = {
  title: "الشورتس — شوف الفكرة بسرعة",
  description:
    "كل شورتس وصفات قمر في صفحة واحدة: أفكار سريعة للفرجة، ومدة الفيديو ليست وقت الطبخ.",
};

export default async function WatchIndexPage() {
  const catalog = await getCatalog();
  const shorts = catalog
    .filter((r) => r.sources.some((s) => s.kind === "short"))
    .sort((a, b) => b.views - a.views);
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">🎬 اتفرج الأول</span>
        <h1>الشورتس — شوف الفكرة بسرعة</h1>
        <p>
          {shorts.length} وصفة لها شورت: فرجة سريعة تلهمك، وبعدها افتح الوصفة
          للمقادير والخطوات لو مكتملة. مدة الشورت مدة فيديو مش وقت طبخ، وأرقام
          المشاهدات مشاهدات يوتيوب وقت آخر رصد.
        </p>
      </div>
      <div className="shorts-row shorts-grid">
        {shorts.map((r) => (
          <ShortCard key={r.slug} r={r} />
        ))}
      </div>
    </div>
  );
}
