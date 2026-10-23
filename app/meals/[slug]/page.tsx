import { siteURL } from "@/lib/site";
import MealPlanner from "@/components/MealPlanner";
import GuestPlanner from "@/components/GuestPlanner";
import { guestDishes } from "@/lib/guest-plan";
import { getCatalog } from "@/lib/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { meals, mealBySlug, mealRecipes, mealAllReviewed } from "@/lib/meals";
import { RecipeCard } from "@/components/ui";
import ShareMeal from "./ShareMeal";

export async function generateStaticParams() {
  return meals.map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = mealBySlug(slug);
  return {
    alternates: { canonical: `${siteURL()}/meals/${slug}` },
    title: m ? `سفرة: ${m.title}` : "سفرة",
    description: m?.desc,
  };
}
export default async function MealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const recipes = await getCatalog();
  const { slug } = await params;
  const m = mealBySlug(slug);
  if (!m) notFound();
  const list = mealRecipes(m, recipes);
  const tools = [...new Set(list.flatMap((r) => r.detail?.tools || []))];
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">🍽️ سفرة مختارة من وصفات قمر</span>
        <h1>{m.title}</h1>
        <p>
          {m.desc} — {list.length} أطباق متجمعة عشان متحتارش. قائمة المشتريات
          بتجمع المقادير الرقمية المتوافقة مع توضيح المقادير الوصفية.
        </p>
        {mealAllReviewed(m, recipes) ? (
          <p>
            <span className="tag tag-need">
              ✓ كل أطباق السفرة دي وصفات مكتملة بمقادير وخطوات مراجعة
            </span>
          </p>
        ) : (
          <p>
            <span className="tag">
              بعض أطباقها لسه ترشيحات فيديو — مشترياتها مش كاملة لحد ما تكتمل
              مراجعتها
            </span>
          </p>
        )}
      </div>
      <div className="grid">
        {list.map((r) => (
          <div key={r.slug}>
            {m.roles[r.slug] && (
              <p style={{ margin: "0 0 6px" }}>
                <span className="tag tag-need">{m.roles[r.slug]}</span>
              </p>
            )}
            <RecipeCard r={r} />
          </div>
        ))}
      </div>
      <section className="surface">
        <h2>ترتيب التنفيذ المقترح</h2>
        <p>{m.prepNote}</p>
        <p style={{ color: "var(--muted)" }}>
          ملحوظة: الجدول الزمني الدقيق بيعتمد على أوقات الوصفات الموثقة بس؛
          الوصفات المراجعة يدويًا هي اللي أوقات خطواتها مؤكدة من فيديوهاتها،
          والباقي تابع توقيتات مصدره.
        </p>
        {tools.length > 0 && <p>الأدوات المطلوبة: {tools.join(" · ")}</p>}
        <ShareMeal title={m.title} />
      </section>
      <GuestPlanner dishes={guestDishes(list, m.roles).map((d) => ({ slug: d.r.slug, title: d.r.title, role: d.role, minutes: d.minutes, basis: d.basis, needsOven: d.needsOven, makeAhead: d.makeAhead }))} />
      <MealPlanner recipes={list} />
    </div>
  );
}
