"use client";
import Link from "next/link";
import { useCatalog } from "./CatalogProvider";
import { useStored } from "./useStored";
export default function ResumeCooking() {
  const [last] = useStored<{ slug: string; step: number } | null>(
    "wasafat-Doha:last-cook",
    null,
  );
  const r = useCatalog().find((r) => r.slug === last?.slug);
  return r && last ? (
    <aside className="surface resume-panel" aria-label="كمّل طبختك">
      <div>
        <span className="eyebrow">طبختك مستنياك</span>
        <h2>{r.title}</h2>
        <p>كمّل من الخطوة {last.step + 1} — تقدمك ومؤقتك محفوظين.</p>
      </div>
      <Link className="btn btn-primary" href={`/recipes/${r.slug}/cook`}>
        كمّل الطبخة
      </Link>
    </aside>
  ) : null;
}
