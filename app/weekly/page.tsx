import { getCatalog } from "@/lib/catalog";
import { weeklySelection, CAPTURED_AT } from "@/lib/experience";
import { RecipeCard } from "@/components/ui";
export const metadata = {
  title: "اختيارات الأسبوع",
  description: "مجموعة صغيرة متجددة من الوصفات المميزة، مع سبب اختيار كل وصفة.",
};
export default async function Page() {
  const w = weeklySelection(await getCatalog());
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">دورة أسبوعية · {w.date}</span>
        <h1>اختيارات الأسبوع</h1>
        <p>
          بنغيّر المجموعة كل أسبوع من مكتبتنا المنتقاة. الاختيارات التحريرية غير
          وصفة مجرّبة فعليًا؛ تجربة الفريق بتظهر بتوثيقها لو موجودة.
        </p>
      </div>
      <div className="grid">
        {w.recipes.map((r) => (
          <RecipeCard
            key={r.slug}
            r={r}
            reason={r.detail?.successTips[0] || r.why}
          />
        ))}
      </div>
      <p className="results-note">
        أرقام الانتشار مشاهدات يوتيوب وليست زيارات الموقع. آخر رصد للدفعة
        الأولى: {CAPTURED_AT}؛ التحديثات التالية يظهر تاريخها في المصدر.
      </p>
    </div>
  );
}
