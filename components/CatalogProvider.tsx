"use client";
import { createContext, useContext } from "react";
import type { Recipe } from "@/lib/data";
const Context = createContext<Recipe[]>([]);
export default function CatalogProvider({
  recipes,
  children,
}: {
  recipes: Recipe[];
  children: React.ReactNode;
}) {
  return <Context.Provider value={recipes}>{children}</Context.Provider>;
}
export function useCatalog() {
  return useContext(Context);
}
