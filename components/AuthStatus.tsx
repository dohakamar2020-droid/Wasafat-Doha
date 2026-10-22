"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { SafeUser } from "./SyncProvider";

export default function AuthStatus() {
  const [user, setUser] = useState<SafeUser | null>(() => { try { return JSON.parse(localStorage.getItem("wasafat-Doha:user") || "null"); } catch { return null; } });
  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      setUser(d.user || null);
      try { if (d.user) localStorage.setItem("wasafat-Doha:user", JSON.stringify(d.user)); else localStorage.removeItem("wasafat-Doha:user"); } catch {}
    }).catch(() => {});
  }, []);
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    try { localStorage.removeItem("wasafat-Doha:user"); } catch {}
    window.location.href = "/";
  };
  if (!user) return <Link href="/login" className="btn btn-ghost btn-sm">دخول / حساب جديد</Link>;
  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <Link href="/kitchen" className="btn btn-ghost btn-sm" title="مطبخك متزامن مع حسابك">👋 {user.name.split(" ")[0]}</Link>
      <button className="btn btn-ghost btn-sm" onClick={logout}>خروج</button>
    </span>
  );
}
