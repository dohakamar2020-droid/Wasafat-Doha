"use client";
import { useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { RecipeCard } from "@/components/ui";
import { diverse } from "@/lib/experience";
export default function Page() {
  const recipes = useCatalog();
  const [ingredient, setIngredient] = useState("بطاطس");
  const options = [...new Set(recipes.flatMap((r) => r.mainIngredients))];
  const pool = recipes.filter((r) => r.mainIngredients.includes(ingredient));
  const chosen = diverse(
    [...pool].sort(
      (a, b) => Number(!!b.detail) - Number(!!a.detail) || b.views - a.views,
    ),
    3,
  );
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">غيّر الفكرة بالموجود</span>
        <h1>نفس المكوّن، 3 تجارب</h1>
        <p>مكوّن واحد ممكن يبقى طبق رئيسي، سناك، أو تجربة بقوام مختلف.</p>
      </div>
      <label htmlFor="same-ing">اختار المكوّن</label>
      <select
        id="same-ing"
        className="text-in"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
      >
        {options.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
      <section className="block">
        <div className="grid">
          {chosen.map((r) => (
            <RecipeCard
              key={r.slug}
              r={r}
              reason={`${ingredient} · ${r.category} · ${r.textures.join("، ") || "فكرة تقديم مختلفة"}`}
            />
          ))}
        </div>
        {chosen.length < 3 && (
          <p>
            المتاح للمكوّن ده {chosen.length} وصفة؛ هنضيف تجارب تانية بعد
            المراجعة.
          </p>
        )}
      </section>
    </div>
  );
}
