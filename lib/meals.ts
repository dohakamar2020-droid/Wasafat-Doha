import { recipes, type Recipe } from "./data";
export type Meal = {
  slug: string;
  title: string;
  desc: string;
  recipeSlugs: string[];
  prepNote: string;
};
export const meals: Meal[] = [
  {
    slug: "family-lunch",
    title: "غداء عائلي",
    desc: "رئيسي + جانبي + حلو اختياري",
    recipeSlugs: ["potato-bechamel-tray", "tomato-qallaya", "mango-cheesecake"],
    prepNote:
      "ابدأ بالحلو لو محتاج تبريد، وبعده الرئيسي، والجانبي آخر حاجة عشان يفضل سخن.",
  },
  {
    slug: "weekend-gathering",
    title: "قعدة آخر الأسبوع",
    desc: "سندوتشات وسناكس وحلو سريع",
    recipeSlugs: [
      "steak-tortilla",
      "potato-balloons",
      "chocolate-truffles-2-ing",
    ],
    prepNote:
      "الحلو يتعمل الأول ويتساب يتماسك، وبعده السناكس، والسندوتشات تتجمع وقت التقديم.",
  },
  {
    slug: "simple-feast",
    title: "عزومة بسيطة",
    desc: "رئيسي وجانبي وحلو لتجميعة واحدة",
    recipeSlugs: ["shrimp-maqluba", "goulash-meat-rolls", "kunafa-cream"],
    prepNote:
      "الكنافة (مكتملة المراجعة) شرباتها يتعمل أولًا ويبرد، وبعدين الصواني، والتقديم يبدأ بالمقبلات.",
  },
  {
    slug: "reviewed-night",
    title: "ليلة الوصفات المكتملة",
    desc: "سفرة كل أطباقها مراجعة يدويًا بمقادير وخطوات",
    recipeSlugs: [
      "chicken-negrisco",
      "italian-tiramisu-nadia",
      "alexandria-liver",
    ],
    prepNote:
      "التيراميسو لازم يتعمل قبلها بـ 8 ساعات على الأقل، وبعده النجرسكو، والكبدة تتعمل آخر حاجة قبل التقديم.",
  },
];
export const mealBySlug = (s: string) => meals.find((m) => m.slug === s);
export const mealRecipes = (m: Meal, catalog: Recipe[] = recipes): Recipe[] =>
  m.recipeSlugs.map((s) => catalog.find((r) => r.slug === s)!).filter(Boolean);
