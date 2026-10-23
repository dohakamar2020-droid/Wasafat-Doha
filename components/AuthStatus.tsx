"use client";
import { useState } from "react";
import Link from "next/link";
import { useSync } from "./SyncProvider";
import { clearAccountCache } from "@/lib/storage";
export default function AuthStatus() {
  const { user, status, flush } = useSync();
  const [err, setErr] = useState(""),
    [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    setErr("");
    if (!(await flush())) {
      setErr("في تغييرات لسه ما اتزامنتش. افتح مطبخي وراجع الحفظ قبل الخروج.");
      setBusy(false);
      return;
    }
    try {
      const r = await fetch("/api/auth/logout", { method: "POST" });
      if (!r.ok) throw new Error("logout");
      clearAccountCache();
      window.location.href = "/";
    } catch {
      setErr("تعذّر تسجيل الخروج. جرّب تاني.");
      setBusy(false);
    }
  };
  if (!user)
    return (
      <Link href="/login" className="btn btn-ghost btn-sm">
        دخول / حساب جديد
      </Link>
    );
  return (
    <div className="auth-status">
      <Link href="/kitchen" className="btn btn-ghost btn-sm">
        {user.name.split(" ")[0]}
        {status === "saved" ? " ✓" : ""}
      </Link>
      {user.isAdmin && (
        <Link className="btn btn-ghost btn-sm" href="/admin">
          الإدارة
        </Link>
      )}
      <button className="btn btn-ghost btn-sm" onClick={logout} disabled={busy}>
        خروج
      </button>
      {err && <span role="alert">{err}</span>}
    </div>
  );
}
