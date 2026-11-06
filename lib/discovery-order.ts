import { byTrend } from "./trend";
import type { Recipe } from "./data";

export type DiscoverySort = "relevance" | "editor" | "views" | "newest" | "az" | "trend";
const SORTS: DiscoverySort[] = ["relevance", "editor", "views", "newest", "az", "trend"];
export function discoverySort(value: string | null, query: string): DiscoverySort {
  return value && SORTS.includes(value as DiscoverySort)
    ? value as DiscoverySort
    : query.trim() ? "relevance" : "editor";
}
export function orderDiscovery(recipes: Recipe[], sort: DiscoverySort, query: string): Recipe[] {
  const list = [...recipes];
  const byDate = (r: Recipe) => Math.max(0, ...r.sources.map((s) => {
    const [m, y] = s.published.split("/");
    return Number(y) * 100 + Number(m);
  }));
  if (sort === "views") list.sort((a, b) => b.views - a.views);
  else if (sort === "trend") list.sort(byTrend);
  else if (sort === "newest") list.sort((a, b) => byDate(b) - byDate(a));
  else if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title, "ar"));
  else if (sort === "editor" || !query.trim()) list.sort((a, b) => Number(b.editorsPick || false) - Number(a.editorsPick || false) || b.views - a.views);
  return list;
}
