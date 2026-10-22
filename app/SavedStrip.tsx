"use client";
import Link from "next/link";
import { recipes } from "@/lib/data";
import { useSaved } from "@/components/ui";
import { RecipeCard } from "@/components/ui";

export default function SavedStrip() {
  const { list } = useSaved();
  const saved = list.map((s) => recipes.find((r) => r.slug === s)).filter(Boolean).slice(0, 4) as typeof recipes;
  if (!saved.length) return null;
  return (
    <section className="block" aria-label="اللي كنت ناوي تجربه">
      <div className="section-head"><div><h2>اللي كنت ناوي تجربه 🌙</h2><p>اللقطات دي مستنياك من آخر مرة</p></div>
      <Link className="text-link" href="/kitchen/saved">محفوظاتي ←</Link></div>
      <div className="grid">{saved.map((r) => <RecipeCard key={r.slug} r={r} />)}</div>
    </section>
  );
}
