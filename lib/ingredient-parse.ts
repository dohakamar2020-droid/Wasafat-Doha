/**
 * محلّل المقادير: بيحوّل نص الوصفة الرسمي (وصف يوتيوب، كابشن تيك توك، أو
 * صفحة وصفة عند صاحبها) إلى بنية مقادير جاهزة للعرض والتكبير.
 *
 * قواعد ثابتة:
 * - مش بنخترع رقم: لو السطر مفيهوش رقم صريح، السطر بيفضل وصفي من غير amount.
 * - الوحدات بتتحوّل لاساسها الآمن (كجم→جرام، لتر→مللي) عشان التكبير يبقى صح.
 * - الكسر النصي (نصف، ربع، ½، 1/2…) بيتقري صح.
 * - الأرقام العربية الهندية (٠١٢٣) والعربية (۰۱۲۳) بتتحوّل لأرقام لاتينية.
 */

// أرقام عربية هندية + فارسية → لاتينية
const DIGIT_MAP: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

export function normalizeDigits(text: string): string {
  return text.replace(/[٠-٩۰-۹]/g, (d) => DIGIT_MAP[d] ?? d);
}

// كسور-ascii وكسورunicode وكلمات الكسر
const FRACTION_WORDS: Record<string, number> = {
  "نصف": 0.5,
  "نصفى": 0.5,
  "ربع": 0.25,
  "ثلث": 1 / 3,
  "ثلثين": 2 / 3,
  "ثلاثة أرباع": 0.75,
  "ربعين": 0.5,
};

const FRACTION_CHARS: Record<string, number> = {
  "½": 0.5,
  "¼": 0.25,
  "¾": 0.75,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "⅕": 0.2,
  "⅖": 0.4,
  "⅗": 0.6,
  "⅘": 0.8,
};

/** الوحدات المدعومة: كلمة/اختصار → الوحدة الأساسية + معامل التحويل. */
const UNITS: Record<string, { unit: string; factor: number }> = {
  // جرام
  "جرام": { unit: "جرام", factor: 1 },
  "غرام": { unit: "جرام", factor: 1 },
  "جم": { unit: "جرام", factor: 1 },
  "g": { unit: "جرام", factor: 1 },
  "gram": { unit: "جرام", factor: 1 },
  "grams": { unit: "جرام", factor: 1 },
  // كيلو
  "كيلو": { unit: "جرام", factor: 1000 },
  "كجم": { unit: "جرام", factor: 1000 },
  "كغ": { unit: "جرام", factor: 1000 },
  "kg": { unit: "جرام", factor: 1000 },
  "kilo": { unit: "جرام", factor: 1000 },
  "kilogram": { unit: "جرام", factor: 1000 },
  // مللي
  "مللي": { unit: "مللي", factor: 1 },
  "مل": { unit: "مللي", factor: 1 },
  "ملل": { unit: "مللي", factor: 1 },
  "ml": { unit: "مللي", factor: 1 },
  "milliliter": { unit: "مللي", factor: 1 },
  "milliliters": { unit: "مللي", factor: 1 },
  // لتر
  "لتر": { unit: "مللي", factor: 1000 },
  "ل": { unit: "مللي", factor: 1000 },
  "liter": { unit: "مللي", factor: 1000 },
  "liters": { unit: "مللي", factor: 1000 },
  "litre": { unit: "مللي", factor: 1000 },
  // كوب
  "كوب": { unit: "كوب", factor: 1 },
  "كاس": { unit: "كوب", factor: 1 },
  "كوباية": { unit: "كوب", factor: 1 },
  "cup": { unit: "كوب", factor: 1 },
  "cups": { unit: "كوب", factor: 1 },
  // ملعقة
  "ملعقة كبيرة": { unit: "ملعقة كبيرة", factor: 1 },
  "ملعقه كبيرة": { unit: "ملعقة كبيرة", factor: 1 },
  "tbsp": { unit: "ملعقة كبيرة", factor: 1 },
  "tablespoon": { unit: "ملعقة كبيرة", factor: 1 },
  "tablespoons": { unit: "ملعقة كبيرة", factor: 1 },
  "ملعقة صغيرة": { unit: "ملعقة صغيرة", factor: 1 },
  "ملعقه صغيره": { unit: "ملعقة صغيرة", factor: 1 },
  "tsp": { unit: "ملعقة صغيرة", factor: 1 },
  "teaspoon": { unit: "ملعقة صغيرة", factor: 1 },
  // عدّيات
  "حبة": { unit: "حبة", factor: 1 },
  "حبه": { unit: "حبة", factor: 1 },
  "بيضة": { unit: "حبة", factor: 1 },
  "بيضات": { unit: "حبة", factor: 1 },
  "بيض": { unit: "حبة", factor: 1 },
  "egg": { unit: "حبة", factor: 1 },
  "eggs": { unit: "حبة", factor: 1 },
  "فص": { unit: "فص", factor: 1 },
  "فصوص": { unit: "فص", factor: 1 },
  "clove": { unit: "فص", factor: 1 },
  "cloves": { unit: "فص", factor: 1 },
  "قطعة": { unit: "قطعة", factor: 1 },
  "قطع": { unit: "قطعة", factor: 1 },
  "باكيت": { unit: "باكيت", factor: 1 },
  "باكت": { unit: "باكيت", factor: 1 },
  "علبة": { unit: "باكيت", factor: 1 },
  "عبوة": { unit: "باكيت", factor: 1 },
  "pack": { unit: "باكيت", factor: 1 },
  "packs": { unit: "باكيت", factor: 1 },
  "قطن": { unit: "قرن", factor: 1 },
  "عود": { unit: "عود", factor: 1 },
  "شريحة": { unit: "شريحة", factor: 1 },
  "شرائح": { unit: "شريحة", factor: 1 },
  "slice": { unit: "شريحة", factor: 1 },
  "slices": { unit: "شريحة", factor: 1 },
  "ورقة": { unit: "ورقة", factor: 1 },
  "أوراق": { unit: "ورقة", factor: 1 },
  "رأس": { unit: "رأس", factor: 1 },
};

// كلمات بتتمسح قبل اسم المكوّن
const LEADING_NOISE = [
  "من",
  "حوالي",
  "حساب",
  "ما يقارب",
  "أو",
  "و",
];

export type ParsedIngredient = {
  /** السطر الأصلي كما ورد في المصدر */
  raw: string;
  /** اسم المكوّن بعد التنظيف */
  name: string;
  /** تسمية المجموعة لو السطر جه，在她 (مثل «حشوة الجبن: 1 كوب …») */
  groupHint?: string;
  /** الكمية كما قالها صاحب الوصفة */
  display: string;
  /** رقم قابل للتكبير (undefined = مفيش رقم صريح في المصدر) */
  amount?: number;
  /** وحدة الأساس (undefined = الكمية وصفية) */
  unit?: string;
  /** تحذير: السطر فيه أكتر من رقم أو رقم مش واضح */
  note?: string;
};

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** رقم من نص عربي/لاتيني: عدد، كسر، أو كلمة كسر. */
function readNumber(text: string): number | null {
  const t = normalizeDigits(text).trim();
  if (!t) return null;

  // كسر بلغة fraction unicode
  for (const [ch, val] of Object.entries(FRACTION_CHARS))
    if (t.includes(ch)) return val;

  // كسر نصي: 1/2 أو 1\2
  const slash = t.match(/^(\d+)\s*[\/\\]\s*(\d+)/);
  if (slash) {
    const den = Number(slash[2]);
    if (den) return Number(slash[1]) / den;
  }

  // عدد صحيح أو عشري
  const num = t.match(/^(\d+(?:[.,]\d+)?)/);
  if (num) {
    const v = Number(num[1].replace(",", "."));
    if (Number.isFinite(v)) return v;
  }

  // كلمة كسر
  const lower = t.toLowerCase();
  for (const [word, val] of Object.entries(FRACTION_WORDS))
    if (lower.startsWith(word)) return val;

  return null;
}

/**
 * يطابق أقرب وحدة معروفة في بداية النص.
 * بيرجع الوحدة الأساسية ومعامل التحويل وطول الجزء المت consume.
 */
function matchUnit(text: string): {
  unit?: { unit: string; factor: number };
  consumed: number;
} {
  const t = text.trim();
  // «ملعقه كبيره» كلمتين: بنطابقها قبل الكلمة المفردة
  const spoon = t.match(
    /^(ملعقه|ملعقة)\s+(كبيرة|صغيرة|صغیره)\s*/,
  );
  if (spoon) {
    const key = `${spoon[1]} ${spoon[2]}`;
    const unit = UNITS[key];
    if (unit) return { unit, consumed: spoon[0].length };
  }
  // كلمة وحدة معرّفة
  const word = t.match(/^([^\s،,()]+)\s*/);
  if (!word) return { consumed: 0 };
  const unit = UNITS[word[1].toLowerCase()];
  if (unit) return { unit, consumed: word[0].length };
  return { consumed: 0 };
}

/** هل النص ده كمية (رقم + وحدة) ولا مجرد اسم؟ */
function splitAmountAndUnit(text: string): {
  amount: number | null;
  unit?: string;
  rest: string;
  hadRange: boolean;
} {
  const t = normalizeDigits(text).trim();
  const rangeMatch = t.match(
    /^(\d+(?:[.,]\d+)?)\s*(?:إلى|-|–|—|to)\s*(\d+(?:[.,]\d+)?)\s*/,
  );
  if (rangeMatch) {
    // المدى: بناخد الحد الأعلى عشان التكبير يبقى آمن (زي المراجعة اليدوية)
    const hi = Number(rangeMatch[2].replace(",", "."));
    const after = t.slice(rangeMatch[0].length);
    const { unit, consumed } = matchUnit(after);
    const rest = after.slice(consumed).trim();
    return {
      amount: unit ? round(hi * unit.factor) : round(hi),
      unit: unit?.unit,
      rest,
      hadRange: true,
    };
  }

  const num = readNumber(t);
  if (num == null) return { amount: null, rest: t, hadRange: false };

  // نسيب الرقم الأول
  const numMatch = t.match(
    /^(?:\d+(?:[.,]\d+)?\s*[\/\\]\s*\d+|[½¼¾⅓⅔⅕⅖⅗⅘]|\d+(?:[.,]\d+)?|نصفى?|نصف|ربعين?|ربع|ثلاثة أرباع|ثلثين|ثلث)/,
  );
  const after = t.slice(numMatch ? numMatch[0].length : 0).trim();
  const { unit, consumed } = matchUnit(after);
  const rest = after.slice(consumed).trim();
  return {
    amount: unit ? round(num * unit.factor) : round(num),
    unit: unit?.unit,
    rest,
    hadRange: false,
  };
}

function cleanName(text: string): string {
  let name = normalizeDigits(text)
    .replace(/^\s*[-–—•*·]+/, "")
    .replace(/[،,؛;]+$/, "")
    .replace(/\.$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  // رقم في آخر الاسم (وزن تقريبي) بيتشال من الاسم
  name = name.replace(/\s*\(?\b\d+(?:[.,]\d+)?\s*(?:جم|غرام|جرام|مللي|مل|كوب|ملعقة|tsp|tbsp)?\)?\s*$/u, "").trim();
  for (const noise of LEADING_NOISE) {
    if (name.startsWith(`${noise} `)) name = name.slice(noise.length).trim();
  }
  return name.replace(/^ال/, "");
}

/** يحلّل سطر واحد من قائمة مقادير. */
export function parseIngredientLine(line: string): ParsedIngredient | null {
  const raw = line.trim();
  if (!raw) return null;
  // ترقيم القائمة (1. / 2)) بيتشال — بس لازم يكون بعده مسافة، عشان
  // الأرقام العشرية (1.5 كوب) ما تتلف
  const withoutBullet = raw
    .replace(/^[-–—•*·]+\s*/, "")
    .replace(/^\(?\d{1,2}[.)]\s+(?=\S)/, "");
  if (!withoutBullet.trim()) return null;

  // «حشوة الجبن: 1 كوب جبنة» — التسمية بتتفصل قبل بند المقادير
  let groupHint: string | undefined;
  let body = withoutBullet;
  const prefixed = withoutBullet.match(/^([^:：]{1,48})[:：]\s*(.+)$/);
  if (prefixed && /^(?:\d|[½¼¾⅓⅔]|نصف|ربع|ثلث)/.test(prefixed[2].trim())) {
    groupHint = prefixed[1].trim();
    body = prefixed[2].trim();
  }

  const { amount, unit, rest, hadRange } = splitAmountAndUnit(body);
  const name = cleanName(rest || body);
  if (!name) return null;

  const parsed: ParsedIngredient = {
    raw,
    name,
    display: body.replace(/\s+/g, " ").trim(),
  };
  if (groupHint) parsed.groupHint = groupHint;
  if (amount != null) parsed.amount = amount;
  if (unit) parsed.unit = unit;
  if (hadRange) parsed.note = "المصدر مذكور فيه مدى — التكبير بيستخدم الحد الأعلى";
  return parsed;
}

/** يحلّل قائمة مقادير كاملة (سطر لكل بند). */
export function parseIngredientLines(text: string): ParsedIngredient[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => parseIngredientLine(l))
    .filter((x): x is ParsedIngredient => !!x);
}

export type ParsedGroup = { group: string; items: ParsedIngredient[] };

/**
 * يقسم نص المصدر لمجموعات مقادير: العناوين (سطر بينتهي بـ «:») بتفصل المجموعات،
 * والأسطر التانية بند مقادير.
 */
export function parseIngredientSections(text: string): ParsedGroup[] {
  const groups: ParsedGroup[] = [];
  let current: ParsedGroup | null = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/[:：]$/.test(line) && line.length <= 60) {
      current = {
        group: line.replace(/[:：]$/, "").replace(/^[-–—•*·\s]+/, "").trim(),
        items: [],
      };
      groups.push(current);
      continue;
    }
    const parsed = parseIngredientLine(line);
    if (!parsed) continue;
    if (parsed.groupHint) {
      const found = groups.find((g) => g.group === parsed.groupHint);
      if (found) {
        found.items.push(parsed);
        continue;
      }
      current = { group: parsed.groupHint, items: [parsed] };
      groups.push(current);
      continue;
    }
    if (!current) {
      current = { group: "المقادير", items: [] };
      groups.push(current);
    }
    current.items.push(parsed);
  }
  return groups.filter((g) => g.items.length > 0);
}

/** نسبة المكوّنات اللي فيها رقم صريح (للتقرير في الإدارة). */
export function numericRatio(items: ParsedIngredient[]): number {
  if (!items.length) return 0;
  const n = items.filter((i) => i.amount != null).length;
  return Math.round((n / items.length) * 100);
}
