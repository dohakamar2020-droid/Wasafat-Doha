import { newId } from "@/lib/id";
import {
  emptyKitchen,
  kitchenSchema,
  type KitchenState,
} from "./kitchen-state";
import { storageGet, storageSet, notifyStorage } from "./storage";
export function readJSON<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(storageGet(`wasafat-Doha:${key}`) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export function localKitchen(): KitchenState {
  const fb = emptyKitchen();
  const state = {
    ...fb,
    ...Object.fromEntries(
      ["saved", "planned", "done", "shopping", "attempts"].map((k) => [
        k,
        readJSON(k, []),
      ]),
    ),
    shoppingChecked: readJSON("shopping-checked", []),
    notes: readJSON("notes", {}),
  };
  return kitchenSchema.safeParse(state).success ? state : fb;
}
export function applyKitchen(s: KitchenState) {
  for (const k of ["saved", "planned", "done", "shopping", "attempts"] as const)
    storageSet(`wasafat-Doha:${k}`, JSON.stringify(s[k]));
  storageSet(
    "wasafat-Doha:shopping-checked",
    JSON.stringify(s.shoppingChecked),
  );
  storageSet("wasafat-Doha:notes", JSON.stringify(s.notes));
  notifyStorage();
}
export function saveNote(slug: string, note: string) {
  const notes = readJSON<Record<string, string>>("notes", {});
  notes[slug] = note;
  storageSet("wasafat-Doha:notes", JSON.stringify(notes));
}
export function addAttempt(
  slug: string,
  note: string,
  rating?: number,
  photo?: string,
) {
  const attempts = readJSON<import("./kitchen-state").Attempt[]>(
    "attempts",
    [],
  );
  const a = {
    id: newId(),
    slug,
    at: new Date().toISOString(),
    note,
    ...(rating ? { rating } : {}),
    ...(photo ? { photo } : {}),
  };
  storageSet("wasafat-Doha:attempts", JSON.stringify([a, ...attempts]));
  const done = readJSON<string[]>("done", []);
  storageSet(
    "wasafat-Doha:done",
    JSON.stringify([...new Set([...done, slug])]),
  );
  return a;
}
