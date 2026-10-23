import Link from "next/link";
import { meals } from "@/lib/meals";
export const metadata = { title: "من وصفة لسفرة" };
export default function Page() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>من وصفة لسفرة</h1>
        <p>اختيارات أطباق بتكمل بعض، مع ترتيب تجهيز وقائمة مشتريات.</p>
      </div>
      <div className="mood-grid">
        {meals.map((m) => (
          <Link className="mood" href={`/meals/${m.slug}`} key={m.slug}>
            <h2>{m.title}</h2>
            <p>{m.desc}</p>
            <span>افتح السفرة ←</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
