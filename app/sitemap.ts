import type { MetadataRoute } from "next";
import { recipes, collections, creators } from "@/lib/data";
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://wasafat-Doha.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/discover", "/pick", "/ingredients", "/collections", "/creators", "/about", "/privacy", "/contact"].map((p) => ({ url: `${BASE}${p}`, lastModified: now }));
  return [
    ...staticPages,
    ...recipes.map((r) => ({ url: `${BASE}/recipes/${r.slug}`, lastModified: now })),
    ...collections.map((c) => ({ url: `${BASE}/collections/${c.slug}`, lastModified: now })),
    ...creators.map((c) => ({ url: `${BASE}/creators/${c.id}`, lastModified: now })),
  ];
}
