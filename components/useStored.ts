"use client";
import { useCallback, useSyncExternalStore } from "react";
import { storageGet, storageSet } from "@/lib/storage";
function subscribe(cb: () => void) {
  window.addEventListener("wasafat-Doha:change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("wasafat-Doha:change", cb);
    window.removeEventListener("storage", cb);
  };
}
export function useStored<T>(
  key: string,
  fallback: T,
): [T, (v: T | ((old: T) => T)) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => storageGet(key),
    () => null,
  );
  let value = fallback;
  try {
    if (raw != null) value = JSON.parse(raw) as T;
  } catch {}
  const set = useCallback(
    (v: T | ((old: T) => T)) => {
      let old = fallback;
      try {
        const s = storageGet(key);
        if (s) old = JSON.parse(s) as T;
      } catch {}
      storageSet(
        key,
        JSON.stringify(typeof v === "function" ? (v as (o: T) => T)(old) : v),
      );
    },
    [key, fallback],
  );
  return [value, set];
}
