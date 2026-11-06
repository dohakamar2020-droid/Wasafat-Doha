import { normalizeAr, type Recipe } from "./data";
import { SWEET_CATEGORIES, noOven } from "./experience";

export type FivePreferences = {
  taste: "any" | "sweet" | "savory";
  category: string;
  method: "any" | "nooven";
  status: "any" | "reviewed";
  time: "any" | "15" | "45";
};

// مرادفات محدودة وآمنة فقط؛ البطاطا الحلوة غير البطاطس، وأنواع الحليب والدهون متميزة.
export function fiveIngredientKey(name: string): string {
  const n = normalizeAr(name.trim());
  const aliases: Record<string, string> = {
    "فراخ": "دجاج", "دجاج": "دجاج", "بندوره": "طماطم", "طماطم": "طماطم",
    "رز": "ارز", "ارز": "ارز", "طحين": "دقيق", "دقيق": "دقيق",
    "بسكوت": "بسكويت", "بسكويت": "بسكويت", "موتزاريلا": "موزاريلا",
    "لبن زبادي": "زبادي", "زبادي": "زبادي", "بطاطس": "بطاطس",
    "بطاطا حلوه": "بطاطا حلوه", "باستا": "مكرونه", "مكرونه": "مكرونه",
  };
  return aliases[n] || n;
}

export function recommendFive(catalog: Recipe[], available: string[], preferences: FivePreferences, excluded: string[] = []) {
  if (!available.length || available.length > 5) return [];
  const keys = new Set(available.map(fiveIngredientKey));
  return catalog
    .filter((r) => !excluded.includes(r.slug))
    .filter((r) => preferences.taste === "any" || (preferences.taste === "sweet" ? SWEET_CATEGORIES.includes(r.category) : !SWEET_CATEGORIES.includes(r.category)))
    .filter((r) => preferences.category === "any" || r.category === preferences.category)
    .filter((r) => preferences.method === "any" || noOven(r))
    .filter((r) => preferences.status === "any" || !!r.detail)
    .filter((r) => preferences.time === "any" || (r.totalMinutes != null && r.totalMinutes <= Number(preferences.time)))
    .map((r) => {
      const ingredients = r.detail
        ? r.detail.ingredients.flatMap((g) => g.items).filter((i) => !i.optional).map((i) => i.name)
        : r.mainIngredients;
      const unique = [...new Map(ingredients.map((name) => [fiveIngredientKey(name), name])).values()];
      const have = unique.filter((name) => keys.has(fiveIngredientKey(name)));
      const missing = unique.filter((name) => !keys.has(fiveIngredientKey(name)));
      return { r, have, missing, complete: !!r.detail };
    })
    .filter((result) => result.have.length > 0)
    .sort((a, b) =>
      Number(b.complete && b.missing.length === 0) - Number(a.complete && a.missing.length === 0) ||
      Number(b.complete) - Number(a.complete) ||
      b.have.length - a.have.length || a.missing.length - b.missing.length ||
      b.r.views - a.r.views || a.r.slug.localeCompare(b.r.slug),
    )
    .slice(0, 5);
}
