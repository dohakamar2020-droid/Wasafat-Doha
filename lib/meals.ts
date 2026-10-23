import { recipes, type Recipe } from "./data";
export type Meal = {
  slug: string;
  title: string;
  desc: string;
  recipeSlugs: string[];
  // دور كل طبق في السفرة (رئيسي/جانبي/مقبلات/حلو) — التركيبة لازم تبقى واضحة
  roles: Record<string, string>;
  prepNote: string;
};
// السفرات اللي كل أطباقها «وصفات مكتملة» بتتقدم الأول؛ الباقي بيتوسم صراحة إنه لسه فيه ترشيحات فيديو.
export const meals: Meal[] = [
  {
    slug: "reviewed-night",
    title: "ليلة الوصفات المكتملة",
    desc: "سفرة كل أطباقها مراجعة يدويًا بمقادير وخطوات",
    recipeSlugs: [
      "chicken-negrisco",
      "alexandria-liver",
      "italian-tiramisu-nadia",
    ],
    roles: {
      "chicken-negrisco": "رئيسي",
      "alexandria-liver": "جانبي/مقبلات ساخنة",
      "italian-tiramisu-nadia": "حلو (يتعمل قبلها بيوم)",
    },
    prepNote:
      "التيراميسو لازم يتعمل قبلها بـ 8 ساعات على الأقل، وبعده النجرسكو، والكبدة تتعمل آخر حاجة قبل التقديم.",
  },
  {
    slug: "family-lunch",
    title: "غداء عائلي",
    desc: "رئيسي + جانبي + حلو — وكلها وصفات مكتملة المراجعة",
    recipeSlugs: ["elham-kabsa", "tomato-qallaya", "italian-tiramisu-nadia"],
    roles: {
      "elham-kabsa": "رئيسي",
      "tomato-qallaya": "جانبي (تتاكل بالتغميس)",
      "italian-tiramisu-nadia": "حلو اختياري (قبلها بيوم)",
    },
    prepNote:
      "ابدأ بالتيراميسو من قبلها بيوم لو هتقدمه، وبعده الكبسة، والقلاية آخر حاجة عشان تتاكل دافية وزيتها سخن.",
  },
  {
    slug: "weekend-gathering",
    title: "قعدة آخر الأسبوع",
    desc: "سندوتشات وسناكس وحلو سريع — وكلها وصفات مكتملة المراجعة",
    recipeSlugs: [
      "crispy-chicken-strips",
      "crispy-cauliflower",
      "mango-ice-cream",
    ],
    roles: {
      "crispy-chicken-strips": "رئيسي (راب سندوتشات)",
      "crispy-cauliflower": "سناك/مقبلات",
      "mango-ice-cream": "حلو (فريزر 2-3 ساعات)",
    },
    prepNote:
      "الآيس كريم يدخل الفريزر الأول، والدجاج يتتبل ساعتين، وبعده القرنبيط يتقلى وقت القعدة عشان يفضل مقرمش.",
  },
  {
    slug: "simple-feast",
    title: "عزومة بسيطة",
    desc: "رئيسي وجانبي وحلو لتجميعة واحدة — وكلها وصفات مكتملة المراجعة",
    recipeSlugs: [
      "caramelized-onion-chicken-rice",
      "goulash-from-freezer",
      "kunafa-cream",
    ],
    roles: {
      "caramelized-onion-chicken-rice": "رئيسي",
      "goulash-from-freezer": "مقبلات",
      "kunafa-cream": "حلو",
    },
    prepNote:
      "شربات الكنافة يتعمل أولًا ويبرد تمامًا، وأصابع الجلاش تتجهز وتتجمد، والدجاج بالبصل المكرمل آخر تجهيز قبل الفرن.",
  },
  {
    slug: "oriental-night",
    title: "ليلة شامية على قد ما اكتمل",
    desc: "قلاية ودبس برتقال وكركديه — مكتملة، وبتستنى الكبة والتومية تكتمل عشان تبقى سفرة شامية كاملة",
    recipeSlugs: [
      "chicken-orange-molasses-tray",
      "tomato-qallaya",
      "hibiscus-juice",
    ],
    roles: {
      "chicken-orange-molasses-tray": "رئيسي",
      "tomato-qallaya": "جانبي",
      "hibiscus-juice": "مشروب (مركز يتخفف على التلج)",
    },
    prepNote:
      "مركز الكركدية يتعمل الأول ويبرد، ودبس البرتقال بيتصنع والفراخ في الفرن، والقلاية آخر 10 دقائق.",
  },
];
export const mealBySlug = (s: string) => meals.find((m) => m.slug === s);
export const mealRecipes = (m: Meal, catalog: Recipe[] = recipes): Recipe[] =>
  m.recipeSlugs.map((s) => catalog.find((r) => r.slug === s)!).filter(Boolean);
export const mealAllReviewed = (m: Meal, catalog: Recipe[] = recipes): boolean =>
  mealRecipes(m, catalog).every((r) => r.status === "reviewed");
