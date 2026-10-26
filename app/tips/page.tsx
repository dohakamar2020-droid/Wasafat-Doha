import Link from "next/link";
import { TIP_GROUPS } from "@/lib/tips";

export default function TipsPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">🧂 من مطبخ وصفات قمر</span>
        <h1>أسرار نجاح الأكل</h1>
        <p>
          نصايح مطبخ عامة مجرّبة في مطابخ عادية، مرتبة حسب الموقف اللي
          بيقابلك: عجين، بشاميل، قلي وقرمشة، تتبيلات، أرز ومكرونة، حلويات،
          وتخزين آمن. دي معرفة تحريرية عامة من عندنا — مش من أي فيديو،
          ووصفة الشيف هي الأصل دايمًا في مقاديرها وطريقتها.
        </p>
      </div>
      <div className="chip-row" aria-label="أقسام النصايح">
        {TIP_GROUPS.map((g) => (
          <a key={g.slug} className="ing-chip" href={`#tips-${g.slug}`}>
            {g.emoji} {g.title}
          </a>
        ))}
      </div>
      {TIP_GROUPS.map((g) => (
        <section
          className="surface"
          key={g.slug}
          id={`tips-${g.slug}`}
          aria-labelledby={`tips-h-${g.slug}`}
          style={{ marginTop: 18 }}
        >
          <h2 id={`tips-h-${g.slug}`}>
            {g.emoji} {g.title}
          </h2>
          <ul className="tips-list">
            {g.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      ))}
      <section className="surface">
        <h2>محتاج سر لوصفة بعينها؟</h2>
        <p>
          كل وصفة مكتملة عندها قسم «نقط نجاح من الفيديو نفسه» وأخطاء شائعة
          خاصة بيها —{" "}
          <Link className="text-link" href="/discover?status=reviewed">
            افتح وصفة مكتملة
          </Link>{" "}
          وهتلاقيهم تحت خطواتها.
        </p>
      </section>
    </div>
  );
}
