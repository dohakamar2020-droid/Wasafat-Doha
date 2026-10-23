"use client";
import { useMemo, useState } from "react";
import { useCatalog } from "./CatalogProvider";
import { RecipeCard } from "./ui";
import { useStored } from "./useStored";
import { leftoverMatches, type Leftover } from "@/lib/pantry";

// «طبخة النهارده تكمّل بكرة»: بعد التجربة، إيه اللي فضل؟ بنقترح وصفات
// تستخدم البواقي، وبنفرّق بين الني والمستوي في التنبيه على التعديل.

export default function LeftoversPanel() {
  const catalog = useCatalog();
  const [leftovers, setLeftovers] = useStored<Leftover[]>(
    "wasafat-Doha:leftovers",
    [],
  );
  const [name, setName] = useState(""),
    [state, setState] = useState<"raw" | "cooked">("cooked");
  const matches = useMemo(
    () => leftoverMatches(catalog, leftovers),
    [catalog, leftovers],
  );
  const add = () => {
    const n = name.trim();
    if (!n) return;
    setLeftovers((old) =>
      old.some((l) => l.name === n && l.state === state)
        ? old
        : [{ name: n, state }, ...old].slice(0, 20),
    );
    setName("");
  };
  return (
    <section className="surface" aria-labelledby="leftovers-h">
      <h2 id="leftovers-h">طبخة النهارده تكمّل بكرة ♻️</h2>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        فضل منك إيه من طبخة إمبارح؟ سجّله بحالته (ني ولا مستوي) وهنقترحلك
        وصفات تستخدمه — والمستوي بيفرق، فهننبهك لو الوصفة أصلها ني.
      </p>
      <form
        className="shop-add"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          aria-label="مكوّن فاضل عندك"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: دجاج، حشو لحمة، صوص بشاميل…"
        />
        <select
          aria-label="حالة المكوّن"
          value={state}
          onChange={(e) => setState(e.target.value as "raw" | "cooked")}
        >
          <option value="cooked">مستوي جاهز</option>
          <option value="raw">ني</option>
        </select>
        <button className="btn btn-olive" type="submit">
          سجّله
        </button>
      </form>
      {leftovers.length > 0 && (
        <div className="chip-row" style={{ marginTop: 10 }}>
          {leftovers.map((l) => (
            <button
              key={`${l.name}:${l.state}`}
              className="af-chip"
              onClick={() =>
                setLeftovers((old) =>
                  old.filter((x) => !(x.name === l.name && x.state === l.state)),
                )
              }
              aria-label={`إزالة ${l.name}`}
            >
              {l.name} ({l.state === "cooked" ? "مستوي" : "ني"}) ×
            </button>
          ))}
        </div>
      )}
      {leftovers.length > 0 && (
        <>
          <h3>وصفات تنفع ببواقيك ({matches.length})</h3>
          <div className="grid">
            {matches.slice(0, 6).map((m) => (
              <div key={m.r.slug} className="near-card">
                <RecipeCard
                  r={m.r}
                  reason={`بتستخدم من بواقيك: ${m.uses.join("، ")}`}
                />
                {m.note && <p className="results-note">⚠ {m.note}</p>}
              </div>
            ))}
          </div>
          {!matches.length && (
            <p>مفيش وصفات عندنا بتستخدم المكونات دي في مقاديرها المسجلة.</p>
          )}
        </>
      )}
    </section>
  );
}
