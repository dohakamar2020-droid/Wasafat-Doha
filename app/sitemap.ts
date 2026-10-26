import type { MetadataRoute } from "next";
import { collections, creators } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";
import { meals } from "@/lib/meals";
import { siteURL } from "@/lib/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteURL();
  const recipes = await getCatalog();
  return [
    ...[
      "",
      "/discover",
      "/pick",
      "/ingredients",
      "/same-ingredient",
      "/features",
      "/passport",
      "/tips",
      "/weekly",
      "/collections",
      "/creators",
      "/meals",
      "/about",
      "/privacy",
      "/contact",
    ].map((p) => ({ url: `${base}${p}` })),
    ...recipes.map((r) => ({ url: `${base}/recipes/${r.slug}` })),
    ...collections.map((c) => ({ url: `${base}/collections/${c.slug}` })),
    ...creators.map((c) => ({ url: `${base}/creators/${c.id}` })),
    ...meals.map((m) => ({ url: `${base}/meals/${m.slug}` })),
  ];
}
