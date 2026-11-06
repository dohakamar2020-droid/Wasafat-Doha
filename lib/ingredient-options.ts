import { normalizeAr } from "./data";
/** Deduplicate spelling variants only, without merging distinct ingredients. */
export function uniqueIngredientOptions(names: string[]): string[] {
  const unique = new Map<string, string>();
  for (const name of names) {
    const key = normalizeAr(name).replace(/\s+/g, " ");
    const existing = unique.get(key);
    // Prefer the conventional Arabic spelling when the same key has variants.
    if (!existing || (name.includes("ة") && !existing.includes("ة"))) unique.set(key, name);
  }
  return [...unique.values()].sort((a, b) => a.localeCompare(b, "ar"));
}
