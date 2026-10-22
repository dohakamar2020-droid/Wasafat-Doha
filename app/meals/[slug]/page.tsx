import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { meals, mealBySlug, mealRecipes } from "@/lib/meals";
import { RecipeCard } from "@/components/ui";
import ShareMeal from "./ShareMeal";

export function generateStaticParams() { return meals.map((m) => ({ slug: m.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const m = mealBySlug(slug);
  return { title: m ? `سفرة: ${m.title}` : "سفرة", description: m?.desc };
}
export default async function MealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const m = mealBySlug(slug);
  if (!m) notFound();
  const list = mealRecipes(m);
  const shopping = new Map<string, string>();
  list.forEach((r) => {
    if (r.detail) r.detail.ingredients.flatMap((g) => g.items).forEach((i) => { if (!shopping.has(i.name)) shopping.set(i.name, `${i.display} — لـ«${r.title}»`); });
    else r.mainIngredients.forEach((i) => { if (!shopping.has(i)) shopping.set(i, `${i} — لـ«${r.title}» (التفاصيل في الفيديو)`); });
  });
  const tools = [...new Set(list.flatMap((r) => r.detail?.tools || []))];
  return (
    <div className="wrap">
      <div className="page-head"><span className="eyebrow">🍽️ سفرة مختارة من وصفات قمر</span><h1>{m.title}</h1><p>{m.desc} — {list.length} أطباق متجمعة عشان متحتارش. قائمة المشتريات تحت متجمعة من غير دمج وحدات مختلفة غلط: كل بند مكتوب قدامه مصدره.</p></div>
      <div className="grid">{list.map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
      <section className="surface"><h2>ترتيب التنفيذ المقترح</h2><p>{m.prepNote}</p>
      <p style={{ color: "var(--muted)" }}>ملحوظة: الجدول الزمني الدقيق بيعتمد على أوقات الوصفات الموثقة بس؛ الوصفات المراجعة يدويًا هي اللي أوقات خطواتها مؤكدة من فيديوهاتها، والباقي تابع توقيتات مصدره.</p>
      {tools.length > 0 && <p>الأدوات المشتركة: {tools.join(" · ")}</p>}
      <ShareMeal title={m.title} /></section>
      <section className="surface"><h2>قائمة مشتريات السفرة 🛒 ({shopping.size})</h2>
        <ul>{[...shopping.values()].map((v) => <li key={v}>{v}</li>)}</ul>
        <p style={{ color: "var(--muted)" }}>افتح أي وصفة وضيف الناقص فعليًا من «ناقصك إيه؟» عشان يروح لقائمة مشترياتك الشخصية في مطبخي.</p>
        <Link className="btn btn-olive" href="/kitchen/shopping">مشترياتي في مطبخي</Link>
      </section>
    </div>
  );
}
