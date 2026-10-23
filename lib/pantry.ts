import type { Recipe } from "./data";
import { ingredientKey, matchIngredients } from "./experience";

// «اشتري حاجة واحدة… وافتح وصفات أكتر»: الحساب من المقادير الفعلية المكتوبة
// للوصفات المراجعة بس (اللي نواقصها معروفة يقينًا). ترشيحات الفيديو مش
// بتدخل هنا لأن نواقصها الكاملة مش موثقة — ما ينفعش نوعد بيها.

export type UnlockSuggestion = {
  ingredient: string; // مفتاح المكوّن الناقص
  unlocks: Recipe[]; // وصفات هتكتمل بإضافته
  savedUnlocks: Recipe[]; // منها محفوظات اليوزر
  nearCount: number; // وصفات تانية هتقرب خطوة (ناقصها ده + حاجة كمان)
};

export function unlockSuggestions(
  catalog: Recipe[],
  available: string[],
  savedSlugs: string[] = [],
  limit = 6,
): UnlockSuggestion[] {
  const byIngredient = new Map<string, UnlockSuggestion>();
  for (const r of catalog) {
    if (!r.detail) continue; // يقين المقادير شرط الوعد
    const m = matchIngredients(r, available, []);
    if (!m.missing.length) continue;
    // المكوّن اللي لوحده بيكمل الوصفة
    if (m.missing.length === 1) {
      const key = ingredientKey(m.missing[0].name);
      const cur = byIngredient.get(key) || {
        ingredient: key,
        unlocks: [],
        savedUnlocks: [],
        nearCount: 0,
      };
      cur.unlocks.push(r);
      if (savedSlugs.includes(r.slug)) cur.savedUnlocks.push(r);
      byIngredient.set(key, cur);
    } else if (m.missing.length === 2) {
      for (const miss of m.missing) {
        const key = ingredientKey(miss.name);
        const cur = byIngredient.get(key) || {
          ingredient: key,
          unlocks: [],
          savedUnlocks: [],
          nearCount: 0,
        };
        cur.nearCount++;
        byIngredient.set(key, cur);
      }
    }
  }
  return [...byIngredient.values()]
    .filter((s) => s.unlocks.length > 0)
    .sort(
      (a, b) =>
        b.savedUnlocks.length - a.savedUnlocks.length ||
        b.unlocks.length - a.unlocks.length ||
        b.nearCount - a.nearCount,
    )
    .slice(0, limit);
}

// «طبخة النهارده تكمّل بكرة»: البواقي بمكوّناتها وحالتها (ني/مستوي).
// بنفرّق في التنبيه: وصفة أصلها ني وبواقيك مستوية → بتتزوّد في الآخر
// ووقتها بيقل، والعكس (بواقي نية لوصفة عاوزة مستوي) ما بنقترحهاش أصلًا.

export type Leftover = { name: string; state: "raw" | "cooked" };

export type LeftoverMatch = {
  r: Recipe;
  uses: string[]; // مكونات البواقي المستخدمة
  note: string | null; // تعديل عن الأصل بسبب حالة البواقي
};

const COOKED_HINT =
  "بواقيك مستوية والوصفة الأصلية بتبدأ بالمكوّن ني: زوّده في آخر خطوة وقلّل وقته على النار — دي ملحوظة تعديل من عندنا، مش من الفيديو.";

export function leftoverMatches(
  catalog: Recipe[],
  leftovers: Leftover[],
): LeftoverMatch[] {
  if (!leftovers.length) return [];
  const out: LeftoverMatch[] = [];
  for (const r of catalog) {
    const names = r.detail
      ? r.detail.ingredients.flatMap((g) => g.items.map((i) => i.name))
      : r.mainIngredients;
    const keys = new Set(
      names.flatMap((n) =>
        n.split(/\s+و(?=[\u0600-\u06ff])/).map((x) => ingredientKey(x)),
      ),
    );
    const used = leftovers.filter((l) => keys.has(ingredientKey(l.name)));
    if (!used.length) continue;
    out.push({
      r,
      uses: used.map((u) => u.name),
      note: used.some((u) => u.state === "cooked") ? COOKED_HINT : null,
    });
  }
  return out.sort(
    (a, b) => b.uses.length - a.uses.length || b.r.views - a.r.views,
  );
}
