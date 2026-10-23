import type { ReviewedDetail, RIngredient } from "./reviewed";

// «الوصفة على قد اللي عندي»: كل الحسابات هنا مبنية على المقادير الرقمية
// الموثقة بس. ممنوع منعًا باتًا:
// - تحويل أكواب لجرامات (بيختلف حسب المكوّن) — التحويل الآمن بس بين
//   جرام/كيلو ومللي/لتر وملعقة صغيرة/كبيرة.
// - ادعاء ناتج أو عدد أفراد مش مستنتج من رقم المصدر نفسه.
// المكونات الوصفية (من غير رقم) بتفضل زي ما هي وبنعلّمها إنها ما اتحسبتش.

const COUNT_UNITS = new Set([
  "حبة",
  "فص",
  "قرن",
  "عود",
  "قطعة",
  "حزمة",
  "صدر",
  "تمرة",
  "باكيت",
  "عبوة",
  "شريحة",
  "صفار",
  "فرخة",
  "بيضة",
]);

/** تحويلات آمنة بس، وكلها لنفس العيلة. بيرجع null لو التحويل مش آمن. */
const CONVERT: Record<string, { to: string; factor: number }> = {
  "كيلو جرام": { to: "جرام", factor: 1000 },
  كجم: { to: "جرام", factor: 1000 },
  كيلو: { to: "جرام", factor: 1000 },
  لتر: { to: "مللي", factor: 1000 },
  "ملعقة كبيرة": { to: "ملعقة صغيرة", factor: 3 },
};

export function isCountUnit(unit?: string) {
  return !!unit && COUNT_UNITS.has(unit);
}

/** بيحوّل (قيمة، وحدة) لوحدة الهدف لو التحويل آمن، وإلا null */
export function convertAmount(
  amount: number,
  fromUnit: string,
  toUnit: string,
): number | null {
  if (fromUnit === toUnit) return amount;
  const c = CONVERT[fromUnit];
  if (c && c.to === toUnit) return amount * c.factor;
  const back = CONVERT[toUnit];
  if (back && back.to === fromUnit) return amount / back.factor;
  return null;
}

/**
 * تنسيق كمية محسوبة بصدق: الكبار بتتقرب لأقرب 5، والعدّيات (بيض/فصوص)
 * لأقرب نصف، وبنرجع علامة «تقريبي» لما يحصل تقريب يغيّر القيمة.
 */
export function fmtAmount(
  n: number,
  unit?: string,
): { text: string; rounded: boolean } {
  if (!Number.isFinite(n) || n <= 0) return { text: "0", rounded: false };
  if (isCountUnit(unit)) {
    const r = Math.max(0.5, Math.round(n * 2) / 2);
    return { text: trimNum(r), rounded: Math.abs(r - n) > 0.001 };
  }
  if (n >= 100) {
    const r = Math.round(n / 5) * 5;
    return { text: String(r), rounded: Math.abs(r - n) > 0.001 };
  }
  if (n >= 10) {
    const r = Math.round(n * 10) / 10;
    return { text: trimNum(r), rounded: Math.abs(r - n) > 0.001 };
  }
  const r = Math.round(n * 100) / 100;
  return { text: trimNum(r), rounded: Math.abs(r - n) > 0.001 };
}
function trimNum(n: number) {
  return Number.isInteger(n)
    ? String(n)
    : String(Math.round(n * 100) / 100).replace(/\.?0+$/, "");
}

export type ScaledItem = {
  item: RIngredient;
  scaledText: string | null; // null = مكوّن وصفي ما بيتحسبش
  rounded: boolean;
};
export type ScaledRecipe = {
  factor: number;
  groups: { group: string; items: ScaledItem[] }[];
  estimatedServings: number | null;
  warnings: string[];
};

export function parseServingsCount(detail: ReviewedDetail): number | null {
  if (detail.servingsCount) return detail.servingsCount;
  const m = detail.servings.match(/(\d+)\s*(?:أشخاص|أفراد|حد|شخص)/);
  return m ? Number(m[1]) : null;
}

/** مقاس الصينية/القالب الأصلي بالسنتيمتر لو مذكور في وصف الحصص أو الأدوات */
export function parsePanCm(detail: ReviewedDetail): number | null {
  const text = `${detail.servings} ${detail.tools.join(" ")}`;
  const m = text.match(/(?:صينية|قالب|طاجن|بايركس)[^0-9]{0,14}?(\d{2})/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 15 && n <= 45 ? n : null;
}

export function scaleRecipe(
  detail: ReviewedDetail,
  factor: number,
): ScaledRecipe {
  const warnings: string[] = [];
  let anyRounded = false;
  const groups = detail.ingredients.map((g) => ({
    group: g.group,
    items: g.items.map((item) => {
      if (item.amount == null || !item.unit)
        return { item, scaledText: null, rounded: false };
      const f = fmtAmount(item.amount * factor, item.unit);
      if (f.rounded) anyRounded = true;
      return {
        item,
        scaledText: `${f.text} ${item.unit} — ${item.name}`,
        rounded: f.rounded,
      };
    }),
  }));
  if (anyRounded)
    warnings.push(
      "بعض الكميات اتقربت لأقرب قيمة عملية (العدّيات لأقرب نصف) — الأصل مكتوب جنب كل مكوّن.",
    );
  if (groups.some((g) => g.items.some((i) => i.scaledText === null)))
    warnings.push("المقادير المكتوبة وصفًا (من غير رقم) فضلت زي ما هي — ظبّطها بنفس النسبة بإيدك.");
  const base = parseServingsCount(detail);
  return {
    factor,
    groups,
    estimatedServings: base ? Math.round(base * factor * 10) / 10 : null,
    warnings,
  };
}

/** معامل التكبير من عدد الأفراد — بيرجع null لو المصدر مش محدد عدد أفراد */
export function factorForServings(
  detail: ReviewedDetail,
  people: number,
): number | null {
  const base = parseServingsCount(detail);
  if (!base || people <= 0) return null;
  return people / base;
}

/**
 * معامل التكبير من مكوّن محدود عند اليوزر: «عندي 250 جرام فراخ بس».
 * لازم نفس الوحدة أو تحويل آمن، والمكوّن لازم يكون رقمي في الوصفة.
 */
export function factorForIngredient(
  detail: ReviewedDetail,
  itemName: string,
  available: number,
  unit: string,
): { factor: number; item: RIngredient } | null {
  if (available <= 0) return null;
  for (const g of detail.ingredients)
    for (const item of g.items) {
      if (item.name !== itemName || item.amount == null || !item.unit)
        continue;
      const inRecipeUnit = convertAmount(available, unit, item.unit);
      if (inRecipeUnit == null) return null;
      return { factor: inRecipeUnit / item.amount, item };
    }
  return null;
}

/** معامل التكبير من مقاس صينية اليوزر (مساحة دائرية تقريبية) */
export function factorForPan(
  detail: ReviewedDetail,
  myCm: number,
): { factor: number; originalCm: number } | null {
  const orig = parsePanCm(detail);
  if (!orig || myCm <= 0) return null;
  return { factor: (myCm / orig) ** 2, originalCm: orig };
}

/** المكونات الرقمية القابلة لأنها تبقى «المكوّن المحدود» */
export function scalableIngredients(detail: ReviewedDetail): RIngredient[] {
  return detail.ingredients
    .flatMap((g) => g.items)
    .filter((i) => i.amount != null && i.unit);
}
