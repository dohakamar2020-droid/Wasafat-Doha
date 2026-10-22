import type { Metadata } from "next";
import Link from "next/link";
import { creators, recipes, formatViews } from "@/lib/data";
export const metadata: Metadata = { title: "الشيفات", description: "شيفات وصفات قمر: نادية السيد، هبة أبو الخير، عبير الصغير، شيف عمر، وأبو جوليا — وصفاتهم المنتقاة منسوبة لمصادرها الأصلية." };
export default function CreatorsPage() {
  return (
    <div className="wrap">
      <div className="page-head"><h1>الشيفات اللي بننتقي منهم 👩‍🍳</h1><p>دورنا في وصفات قمر الانتقاء والترتيب، والوصفة دايمًا منسوبة لصاحبها ومصدرها الأصلي على يوتيوب — من غير أي إيحاء بشراكة رسمية.</p></div>
      <div className="creator-grid">
        {creators.map((c) => {
          const list = recipes.filter((r) => r.creatorId === c.id);
          return (
            <Link key={c.id} className="creator-card" href={`/creators/${c.id}`}>
              <div className="creator-avatar">{c.name.slice(0, 1)}</div><h3>{c.name}</h3><p>{c.tagline}</p>
              <span className="tag tag-views">{list.length} وصفة · 👁 {formatViews(list.reduce((a, r) => a + r.views, 0))} مشاهدة</span>
              <p style={{ marginTop: 10 }}>{c.style}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
