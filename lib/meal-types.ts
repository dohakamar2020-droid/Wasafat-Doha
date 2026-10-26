import { normalizeAr, type Recipe } from "./data";

// «وصفات حسب نوع الوجبة»: التصنيف اشتقاق حتمي من تصنيف الوصفة المسجل
// وحاجاتها وعنوانها — من غير تخمين فردي. وصفة ممكن تنفع لوقتين
// (رئيسي = غداء وعشاء) وبنقول كده في الواجهة. الصوصات والإضافات
// مش وجبة أصلًا فمش بتتصنف.

export const MEAL_TYPES = [
  "فطار",
  "غداء",
  "عشاء",
  "خفيفة وسناكس",
  "حلويات ومشروبات",
] as const;
export type MealType = (typeof MEAL_TYPES)[number];

const SWEET_CATS = ["حلويات باردة", "كيك ومخبوزات", "مشروبات"];

// وسم تحريري صريح لوصفات بتنفع فطار بطبيعتها (سندوتشات بيض وجبنة
// وفطير جبنة بالطاسة) — المكتبة فقيرة في وصفات الفطار أصلًا وبنقول
// كده في الواجهة بدل ما نخترع تصنيفات لباقي الوصفات.
const BREAKFAST_EDITORIAL: Record<string, MealType[]> = {
  "lunchbox-sandwiches": ["فطار", "غداء"],
  "summer-flour-water": ["فطار", "خفيفة وسناكس"],
};

export function mealTypesOf(r: Recipe): MealType[] {
  if (BREAKFAST_EDITORIAL[r.slug]) return BREAKFAST_EDITORIAL[r.slug];
  if (r.category === "صوصات وإضافات") return [];
  if (SWEET_CATS.includes(r.category)) return ["حلويات ومشروبات"];
  const t = normalizeAr(`${r.title} ${r.needs.join(" ")}`);
  const out: MealType[] = [];
  if (/فطار|فطور|شكشوك|اومليت|بيض/.test(t)) out.push("فطار");
  if (r.category === "أطباق رئيسية") out.push("غداء", "عشاء");
  if (r.category === "عشاء وسندوتشات") out.push("عشاء", "غداء");
  if (r.category === "سناكس ومقبلات") out.push("خفيفة وسناكس");
  if (r.needs.includes("لانش بوكس")) out.push("غداء");
  return [...new Set(out)];
}

export function byMealType(catalog: Recipe[], type: MealType): Recipe[] {
  return catalog.filter((r) => mealTypesOf(r).includes(type));
}
