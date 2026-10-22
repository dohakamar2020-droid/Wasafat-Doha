"use client";
import { useEffect, useRef } from "react";

export type SafeUser = { id: string; name: string; email: string; isAdmin: boolean };

const read = (k: string, fb: string[]): string[] => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as string[]) : fb; } catch { return fb; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function localState() {
  return {
    saved: read("wasafat-Doha:saved", []),
    planned: read("wasafat-Doha:planned", []),
    done: read("wasafat-Doha:done", []),
    shopping: read("wasafat-Doha:shopping", []),
    shoppingChecked: read("wasafat-Doha:shopping-checked", []),
    notes: collectNotes(),
  };
}
function collectNotes(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("wasafat-Doha:note:")) { const v = localStorage.getItem(k); if (v?.trim()) out[k.slice("wasafat-Doha:note:".length)] = v; }
    }
  } catch {}
  return out;
}
const union = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])];

/** مزامنة مطبخي: الضيف على الجهاز، وبمجرد تسجيل الدخول بتتدمج حالة الجهاز مع الحساب وتتزامن تلقائيًا. */
export default function SyncProvider() {
  const userRef = useRef<SafeUser | null>(null);
  const applyingRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await (await fetch("/api/auth/me")).json();
        if (cancelled || !me.user) return;
        userRef.current = me.user;
        write("wasafat-Doha:user", me.user);
        const res = await fetch("/api/kitchen");
        if (!res.ok) return;
        const { state } = await res.json();
        const local = localState();
        const merged = {
          saved: union(local.saved, state.saved),
          planned: union(local.planned, state.planned),
          done: union(local.done, state.done),
          shopping: union(local.shopping, state.shopping),
          shoppingChecked: union(local.shoppingChecked, state.shoppingChecked),
          notes: { ...local.notes, ...state.notes },
        };
        applyingRef.current = true;
        write("wasafat-Doha:saved", merged.saved); write("wasafat-Doha:planned", merged.planned); write("wasafat-Doha:done", merged.done);
        write("wasafat-Doha:shopping", merged.shopping); write("wasafat-Doha:shopping-checked", merged.shoppingChecked);
        Object.entries(merged.notes as Record<string, string>).forEach(([slug, note]) => { try { localStorage.setItem(`wasafat-Doha:note:${slug}`, note); } catch {} });
        window.dispatchEvent(new Event("wasafat-Doha:change"));
        applyingRef.current = false;
        await fetch("/api/kitchen", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(merged) });
      } catch {}
    })();

    const onChange = () => {
      if (!userRef.current || applyingRef.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fetch("/api/kitchen", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(localState()) }).catch(() => {});
      }, 700);
    };
    window.addEventListener("wasafat-Doha:change", onChange);
    return () => { cancelled = true; window.removeEventListener("wasafat-Doha:change", onChange); };
  }, []);
  return null;
}
