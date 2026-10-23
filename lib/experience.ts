import { normalizeAr, type Recipe } from "./data";
import type { RIngredient, RStep } from "./reviewed";

export const CAPTURED_AT = "2026-10-22";
export const SWEET_CATEGORIES = ["حلويات باردة", "كيك ومخبوزات", "مشروبات"];
export function isSweet(r: Recipe) {
  return (
    SWEET_CATEGORIES.includes(r.category) ||
    /مربى|مربي|عسل|شوكولات|حلو|كراميل/.test(r.title)
  );
}
export function noOven(r: Recipe) {
  const method = normalizeAr(
    [
      ...(r.detail?.tools || []),
      ...(r.detail?.steps.map((s) => s.body) || []),
    ].join(" "),
  );
  if (/فرن|خبز/.test(method)) return false;
  return (
    r.needs.includes("بدون فرن") ||
    (!!r.detail && /طاسه|حله|كسرول|مقلاه/.test(method))
  );
}
export function recipeMinutes(r: Recipe): number | undefined {
  return r.totalMinutes;
}
export function diverse(
  list: Recipe[],
  count: number,
  excluded: string[] = [],
) {
  const rest = list.filter((r) => !excluded.includes(r.slug));
  const selected: Recipe[] = [];
  while (rest.length && selected.length < count) {
    const idx = rest.findIndex(
      (r) => !selected.some((s) => s.creatorId === r.creatorId),
    );
    selected.push(rest.splice(idx < 0 ? 0 : idx, 1)[0]);
  }
  return selected;
}
export type PickOptions = { taste: string; time: string; priority: string };
export function recommend(
  catalog: Recipe[],
  o: PickOptions,
  excluded: string[] = [],
) {
  let pool = catalog.filter((r) => !excluded.includes(r.slug));
  if (o.taste === "sweet") pool = pool.filter(isSweet);
  if (o.taste === "savory") pool = pool.filter((r) => !isSweet(r));
  if (o.priority === "nooven") pool = pool.filter(noOven);
  if (o.time === "15" || o.time === "45")
    pool = pool.filter(
      (r) => r.totalMinutes != null && r.totalMinutes <= Number(o.time),
    );
  const score = (r: Recipe) => {
    let n = r.detail ? 20 : 0;
    if (o.priority === "few" && r.detail)
      n += Math.max(
        0,
        30 -
          r.detail.ingredients
            .flatMap((g) => g.items)
            .filter((i) => !i.optional).length *
            2,
      );
    if (o.priority === "filling" && r.category === "أطباق رئيسية") n += 35;
    if (o.priority === "wow" && r.needs.includes("مناسبة للعزومات")) n += 35;
    if (o.priority === "different" && r.editorsPick) n += 35;
    return n;
  };
  pool.sort((a, b) => score(b) - score(a) || b.views - a.views);
  return diverse(pool, 3).map((r) => ({
    r,
    reason: [
      o.priority === "nooven"
        ? "مصنّفة بدون فرن"
        : r.detail
          ? "بمقادير وخطوات مكتوبة"
          : "فيديو منتقى — المقادير في المصدر",
      r.totalMinutes
        ? `${r.totalMinutes} دقيقة موثقة`
        : "وقت الطبخ لم يُوثّق بعد",
      o.priority === "filling" && r.category === "أطباق رئيسية"
        ? "طبق رئيسي"
        : "",
    ]
      .filter(Boolean)
      .join(" · "),
  }));
}
const ALIASES: [RegExp, string][] = [
  [/حليب.*بودره/, "حليب بودرة"],
  [/حليب.*مكثف/, "حليب مكثف"],
  [/حليب.*مبخر/, "حليب مبخر"],
  [/كريمه.*خفق/, "كريمة خفق"],
  [/كريمه.*طبخ/, "كريمة طبخ"],
  [/قشطه/, "قشطة"],
  [/زيت.*زيتون/, "زيت زيتون"],
  [/بودره.*بصل|بصل.*بودره/, "بودرة بصل"],
  [/بودره.*ثوم|ثوم.*بودره/, "بودرة ثوم"],
  [/معجون.*طماطم|صلصه.*طماطم/, "معجون طماطم"],
  [/سكر.*بودره/, "سكر بودرة"],
  [/سكر.*بني/, "سكر بني"],
  [/لبن.*زبادي|زبادي/, "زبادي"],

  [/دجاج|فراخ/, "دجاج"],
  [/مكرون|باستا|سباغيتي|فيتوتشيني/, "مكرونة"],
  [/حليب|لبن(?!اني)/, "حليب"],
  [/كريمه|قشطه/, "كريمة"],
  [/بسكوت|بسكويت|ليدي فنجر/, "بسكويت"],
  [/ماسكربوني/, "ماسكربوني"],
  [/موزاريلا|موتزاريلا/, "موزاريلا"],
  [/دقيق|طحين/, "دقيق"],
  [/طماطم|بندور/, "طماطم"],
  [/بصل/, "بصل"],
  [/ثوم/, "ثوم"],
  [/بيض/, "بيض"],
  [/بطاطس|بطاطا/, "بطاطس"],
  [/ارز|رز/, "أرز"],
  [/سكر/, "سكر"],
  [/سمنه|سمن/, "سمن"],
  [/زبده/, "زبدة"],
  [/زيت/, "زيت"],
  [/ملح/, "ملح"],
  [/فلفل اسود/, "فلفل أسود"],
  [/كاكاو/, "كاكاو"],
  [/قهوه|اسبريسو/, "قهوة"],
  [/كبده/, "كبدة"],
  [/ليمون/, "ليمون"],
  [/كنافه/, "كنافة"],
];
export function ingredientKey(name: string) {
  const n = normalizeAr(name.split(/\(?أو\s*/)[0].replace(/[()]/g, ""));
  return (
    ALIASES.find(([re]) => re.test(n))?.[1] ||
    n.replace(/مفروم|شرائح|مكعبات|طازج|خام|كبير|صغير/g, "").trim()
  );
}
export function matchIngredients(
  r: Recipe,
  available: string[],
  excluded: string[],
) {
  const availableKeys = new Set(available.map(ingredientKey));
  const allItems = r.detail
    ? r.detail.ingredients.flatMap((g) => g.items)
    : r.mainIngredients.map((name) => ({ name, display: name }));
  const items = allItems
    .filter((i) => !("optional" in i && i.optional))
    .flatMap((i) =>
      i.name.split(/\s+و(?=[\u0600-\u06ff])/).map((name) => ({ ...i, name })),
    );
  const required = [
    ...new Map(items.map((i) => [ingredientKey(i.name), i])).values(),
  ];
  const forbidden = excluded.some((ex) =>
    allItems.some(
      (i) =>
        normalizeAr(i.name).includes(normalizeAr(ex)) ||
        ingredientKey(i.name) === ingredientKey(ex),
    ),
  );
  const missing = required.filter(
    (i) =>
      !i.name
        .split(/\(?أو\s*/)
        .some((name) =>
          availableKeys.has(ingredientKey(name.replace(/[()]/g, ""))),
        ),
  );

  return {
    r,
    forbidden,
    missing,
    have: required.length - missing.length,
    complete: !!r.detail,
  };
}
export type ShoppingLine = {
  key: string;
  name: string;
  amount?: number;
  unit?: string;
  displays: string[];
  recipes: string[];
  optional: boolean;
};
export function shoppingLines(list: Recipe[], scale = 1): ShoppingLine[] {
  const result = new Map<string, ShoppingLine>();
  for (const r of list)
    for (const item of r.detail?.ingredients.flatMap((g) => g.items) ||
      r.mainIngredients.map(
        (name) => ({ name, display: "الكمية في الفيديو" }) as RIngredient,
      )) {
      // Preserve each textual quantity; only aggregate exact ingredient names and identical units.
      const numeric = item.amount != null && !!item.unit;
      const key = `${normalizeAr(item.name)}:${numeric ? item.unit : "text"}:${!!item.optional}`;
      const old = result.get(key);
      if (old) {
        if (numeric) old.amount = (old.amount || 0) + item.amount! * scale;
        old.displays.push(`${item.display} — ${r.title}`);
        old.recipes.push(r.slug);
      } else
        result.set(key, {
          key,
          name: item.name,
          amount: numeric ? item.amount! * scale : undefined,
          unit: item.unit,
          displays: [`${item.display} — ${r.title}`],
          recipes: [r.slug],
          optional: !!item.optional,
        });
    }
  return [...result.values()];
}
export function shoppingLabel(line: ShoppingLine) {
  return `${line.amount != null ? `${Math.round(line.amount * 100) / 100} ${line.unit} — ` : ""}${line.name}${line.optional ? " (اختياري)" : ""}${line.amount == null ? ": " + line.displays.join("؛ ") : ""}`;
}
export function related(r: Recipe, catalog: Recipe[]) {
  const other = catalog.filter((x) => x.slug !== r.slug);
  const out: { recipe: Recipe; reason: string }[] = [];
  const add = (candidate: Recipe | undefined, reason: string) => {
    if (candidate && !out.some((o) => o.recipe.slug === candidate.slug))
      out.push({ recipe: candidate, reason });
  };
  for (const x of [...other].sort(
    (a, b) => Number(!!b.detail) - Number(!!a.detail) || b.views - a.views,
  )) {
    const common = x.mainIngredients.find((i) => r.mainIngredients.includes(i));
    if (common)
      add(
        x,
        `نفس المكوّن: ${common} — ${x.category === r.category ? "بطريقة مختلفة" : "في طبق مختلف"}`,
      );
    if (out.length === 2) break;
  }
  add(
    other.find(
      (x) =>
        x.category === r.category &&
        x.textures.some((t) => r.textures.includes(t)),
    ),
    `نفس النوع والقوام`,
  );
  const sweet = isSweet(r);
  if (!sweet)
    add(
      other.find(
        (x) =>
          !isSweet(x) &&
          x.category === "سناكس ومقبلات" &&
          x.mainIngredients.some((i) => r.mainIngredients.includes(i)),
      ),
      "طبق جانبي يشترك في مكوّن مع الوصفة",
    );
  return out.slice(0, 4);
}
export function stepIngredients(
  step: RStep,
  items: (RIngredient & { group?: string })[],
) {
  if (step.ingredients)
    return items.filter(
      (i) =>
        step.ingredients!.includes(`${i.group}:${i.name}`) ||
        step.ingredients!.includes(i.name),
    );
  // New editorial content without explicit links uses the full drawer, rather than guessing quantities.
  return [];
}

export function weeklySelection(catalog: Recipe[], date = new Date()) {
  const week = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      (7 * 86400000),
  );
  const pool = diverse(
    catalog.filter((r) => r.editorsPick || r.detail),
    catalog.length,
  );
  return {
    week,
    date: date.toISOString().slice(0, 10),
    recipes: pool.length
      ? Array.from(
          { length: Math.min(4, pool.length) },
          (_, i) => pool[(week + i) % pool.length],
        )
      : [],
  };
}
