"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SafeUser } from "@/lib/auth";
import { applyKitchen, localKitchen } from "@/lib/local-kitchen";
import { mergeGuest, syncDecision } from "@/lib/kitchen-state";
import {
  getScope,
  setScope,
  storageGet,
  storageSet,
  migrateGuest,
} from "@/lib/storage";
export type { SafeUser };
type Status = "guest" | "loading" | "saved" | "saving" | "offline" | "conflict";
type Sync = {
  user: SafeUser | null;
  available: boolean;
  status: Status;
  importGuest: () => void;
  retry: () => void;
  resolve: (source: "cloud" | "device") => Promise<void>;
  flush: () => Promise<boolean>;
};
const Context = createContext<Sync>({
  user: null,
  available: false,
  status: "loading",
  importGuest: () => {},
  retry: () => {},
  resolve: async () => {},
  flush: async () => true,
});
export const useSync = () => useContext(Context);
export default function SyncProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null),
    [available, setAvailable] = useState(false),
    [status, setStatus] = useState<Status>("loading");
  const userRef = useRef<SafeUser | null>(null),
    revision = useRef(0),
    applying = useRef(false),
    dirty = useRef(false),
    blocked = useRef(false),
    hydrated = useRef(false),
    inflight = useRef<Promise<boolean> | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushRef = useRef<() => Promise<boolean>>(async () => true),
    loadRef = useRef<() => Promise<void>>(async () => {});
  const writeMeta = (key: string, value: string) => {
    applying.current = true;
    storageSet(`wasafat-Doha:${key}`, value);
    applying.current = false;
  };
  const flush = async (): Promise<boolean> => {
    if (inflight.current) return inflight.current;
    if (!userRef.current) return true;
    if (!hydrated.current)
      return !dirty.current && storageGet("wasafat-Doha:sync-dirty") !== "1";
    if (blocked.current) return false;
    const task = (async () => {
      while (dirty.current) {
        dirty.current = false;
        setStatus("saving");
        const state = localKitchen();
        try {
          const res = await fetch("/api/kitchen", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state, revision: revision.current }),
          });
          if (res.status === 409) {
            dirty.current = true;
            blocked.current = true;
            setStatus("conflict");
            return false;
          }
          if (!res.ok) throw new Error("sync");
          const data = await res.json();
          revision.current = data.revision;
          writeMeta("sync-revision", String(data.revision));
        } catch {
          dirty.current = true;
          setStatus("offline");
          return false;
        }
      }
      writeMeta("sync-dirty", "0");
      setStatus("saved");
      return true;
    })();
    inflight.current = task;
    try {
      return await task;
    } finally {
      inflight.current = null;
    }
  };
  flushRef.current = flush;
  loadRef.current = async () => {
    if (!userRef.current) return;
    try {
      const res = await fetch("/api/kitchen", { cache: "no-store" });
      if (!res.ok) throw new Error("load");
      const data = await res.json();
      revision.current = data.revision;
      hydrated.current = true;
      const cachedRevision = storageGet("wasafat-Doha:sync-revision");
      const pending = storageGet("wasafat-Doha:sync-dirty") === "1";
      const decision = syncDecision(
        cachedRevision == null ? null : Number(cachedRevision),
        data.revision,
        pending,
      );
      if (decision === "conflict") {
        dirty.current = true;
        blocked.current = true;
        setStatus("conflict");
        return;
      }
      blocked.current = false;
      if (decision === "push") {
        dirty.current = true;
        await flushRef.current();
        return;
      }
      applying.current = true;
      applyKitchen(data.state);
      applying.current = false;
      writeMeta("sync-revision", String(data.revision));
      dirty.current = false;
      setStatus("saved");
    } catch {
      setStatus("offline");
    }
  };
  useEffect(() => {
    let cancelled = false;
    migrateGuest();
    setScope(null);
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("me");
        const me = await res.json();
        if (cancelled) return;
        setAvailable(!!me.available);
        if (!me.user) {
          setStatus("guest");
          return;
        }
        userRef.current = me.user;
        setUser(me.user);
        // The verified identity selects its own cache even if loading the cloud fails.
        applying.current = true;
        setScope(me.user.id);
        applying.current = false;
        await loadRef.current();
      } catch {
        if (!cancelled) setStatus("guest");
      }
    })();
    const changed = () => {
      if (
        !userRef.current ||
        applying.current ||
        getScope() !== `user:${userRef.current.id}`
      )
        return;
      dirty.current = true;
      applying.current = true;
      storageSet("wasafat-Doha:sync-dirty", "1");
      applying.current = false;
      if (!hydrated.current || blocked.current) return;
      setStatus("saving");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flushRef.current(), 500);
    };
    const online = () => {
      if (!hydrated.current) void loadRef.current();
      else void flushRef.current();
    };
    window.addEventListener("wasafat-Doha:change", changed);
    window.addEventListener("online", online);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("wasafat-Doha:change", changed);
      window.removeEventListener("online", online);
    };
  }, []);
  const resolve = async (source: "cloud" | "device") => {
    try {
      const res = await fetch("/api/kitchen", { cache: "no-store" });
      if (!res.ok) throw new Error("load");
      const data = await res.json();
      revision.current = data.revision;
      hydrated.current = true;
      blocked.current = false;
      if (source === "cloud") {
        applying.current = true;
        applyKitchen(data.state);
        applying.current = false;
        writeMeta("sync-dirty", "0");
        writeMeta("sync-revision", String(data.revision));
        dirty.current = false;
        setStatus("saved");
      } else {
        dirty.current = true;
        await flushRef.current();
      }
    } catch {
      setStatus("offline");
    }
  };
  const importGuest = () => {
    if (!userRef.current || !hydrated.current || blocked.current) return;
    const id = userRef.current.id;
    applying.current = true;
    setScope(null);
    const guest = localKitchen();
    setScope(id);
    applyKitchen(mergeGuest(guest, localKitchen()));
    applying.current = false;
    dirty.current = true;
    writeMeta("sync-dirty", "1");
    void flushRef.current();
  };
  return (
    <Context.Provider
      value={{
        user,
        available,
        status,
        importGuest,
        retry: () => {
          if (!hydrated.current) void loadRef.current();
          else void flushRef.current();
        },
        resolve,
        flush,
      }}
    >
      {children}
    </Context.Provider>
  );
}
