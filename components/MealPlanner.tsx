"use client";
import { useMemo, useState } from "react";
import type { Recipe } from "@/lib/data";
import { shoppingLines, shoppingLabel } from "@/lib/experience";
import { useStored } from "./useStored";
export default function MealPlanner({ recipes }: { recipes: Recipe[] }) {
  const [scale, setScale] = useState(1),
    [added, setAdded] = useState(false);
  const [shopping, setShopping] = useStored<string[]>(
    "wasafat-Doha:shopping",
    [],
  );
  const lines = useMemo(() => shoppingLines(recipes, scale), [recipes, scale]);
  return (
    <section className="surface">
      <h2>قائمة مشتريات السفرة</h2>
      <div className="scaler" role="group" aria-label="تكبير مقادير السفرة">
        <span>كميات السفرة:</span>
        {[1, 2, 3].map((n) => (
          <button
            type="button"
            aria-pressed={scale === n}
            className={scale === n ? "on" : ""}
            key={n}
            onClick={() => {
              setScale(n);
              setAdded(false);
            }}
          >
            ×{n}
          </button>
        ))}
      </div>
      <p className="results-note">
        بنجمع الكميات الرقمية لنفس المكوّن والوحدة فقط. الكميات الوصفية محفوظة
        بمصدرها؛ راجعها عند التكبير. أطباق الفيديو مقاديرها الكاملة لسه غير
        معروفة.
      </p>
      <ul>
        {lines.map((l) => (
          <li key={l.key}>
            {shoppingLabel(l)}
            {l.amount != null && l.recipes.length > 1 && (
              <small> — مشتركة بين {l.recipes.length} أطباق</small>
            )}
          </li>
        ))}
      </ul>
      <button
        className="btn btn-olive"
        onClick={() => {
          setShopping([
            ...new Set([
              ...shopping,
              ...lines.filter((l) => !l.optional).map(shoppingLabel),
            ]),
          ]);
          setAdded(true);
        }}
      >
        ضيف المقادير الأساسية لمشترياتي
      </button>
      {added && (
        <p className="ok-box" role="status">
          اتضافت. راجع الموجود عندك وعلّم عليه في مشترياتك.
        </p>
      )}
    </section>
  );
}
