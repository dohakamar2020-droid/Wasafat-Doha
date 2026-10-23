// «جواز سفر المذاق»: مسارات تدرّج من وصفات مراجعة بس (مقاديرها وخطواتها
// معروفة، فالتدرّج سهل ← مختلف ← مناسبة حقيقي مش تخمين). الختم بييجي من
// تجارب اليوزر المسجلة أو تعليمه «عملتها» — مفيش ختم من غير فعل حقيقي.

export type TastePath = {
  slug: string;
  title: string;
  desc: string;
  steps: { slug: string; level: string }[];
};

export const TASTE_PATHS: TastePath[] = [
  {
    slug: "cold-desserts",
    title: "رحلة الحلويات الباردة",
    desc: "من أسرع حلو لكيكة شمواه تليق بضيوف",
    steps: [
      { slug: "milk-coffee-dessert", level: "بداية سهلة" },
      { slug: "cold-dessert-5-min", level: "تجربة مختلفة" },
      { slug: "french-chamois-cake", level: "طبق مناسبة" },
    ],
  },
  {
    slug: "egyptian-table",
    title: "أول سفرة مصرية",
    desc: "تغميسة، صينية فرن، وبعدين محشي العزومات",
    steps: [
      { slug: "tomato-qallaya", level: "بداية سهلة" },
      { slug: "potato-minced-meat-tray", level: "تجربة مختلفة" },
      { slug: "mahshi-pot-secrets", level: "طبق مناسبة" },
    ],
  },
  {
    slug: "from-scratch-baking",
    title: "مخبوزات من الصفر",
    desc: "عجينة سايلة في الطاسة لحد فطير محشي معجن",
    steps: [
      { slug: "summer-flour-water", level: "بداية سهلة" },
      { slug: "baked-donuts", level: "تجربة مختلفة" },
      { slug: "chicken-pie-puff", level: "طبق مناسبة" },
    ],
  },
  {
    slug: "chocolate-journey",
    title: "رحلة الشوكولاتة",
    desc: "آيس كريم بيتي، حلو قهوة سريع، وبعده التيراميسو الأصلي",
    steps: [
      { slug: "mango-ice-cream", level: "بداية سهلة" },
      { slug: "cold-dessert-5-min", level: "تجربة مختلفة" },
      { slug: "italian-tiramisu-nadia", level: "طبق مناسبة" },
    ],
  },
];

export type PathProgress = {
  path: TastePath;
  doneSlugs: string[];
  nextSlug: string | null;
  complete: boolean;
};

export function pathProgress(
  path: TastePath,
  cookedSlugs: string[],
): PathProgress {
  const done = path.steps
    .map((s) => s.slug)
    .filter((s) => cookedSlugs.includes(s));
  const next = path.steps.find((s) => !cookedSlugs.includes(s.slug));
  return {
    path,
    doneSlugs: done,
    nextSlug: next?.slug ?? null,
    complete: !next,
  };
}
