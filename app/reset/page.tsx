"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "حصلت مشكلة.");
        return;
      }
      setMsg(data.message || "اتغيّرت كلمة السر.");
    } catch {
      setErr("تعذّر الاتصال. جرّب مرة تانية.");
    } finally {
      setBusy(false);
    }
  };
  if (!token)
    return (
      <p className="notice">
        الرابط ناقص. اطلب رابط استعادة جديد من{" "}
        <Link className="text-link" href="/forgot">
          صفحة نسيت كلمة السر
        </Link>
        .
      </p>
    );
  return (
    <form className="surface admin-form" onSubmit={submit}>
      <label htmlFor="reset-password">كلمة السر الجديدة (10 حروف على الأقل)</label>
      <input
        id="reset-password"
        type="password"
        required
        minLength={10}
        maxLength={72}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      {err && <p className="notice">{err}</p>}
      {msg ? (
        <p className="notice">
          ✔ {msg}{" "}
          <Link className="text-link" href="/login">
            سجّل الدخول
          </Link>
        </p>
      ) : (
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "بيحفظ…" : "عيّن كلمة السر"}
        </button>
      )}
    </form>
  );
}

export default function ResetPage() {
  return (
    <div className="wrap" style={{ maxWidth: 520 }}>
      <div className="page-head">
        <span className="eyebrow">🌙 وصفات قمر</span>
        <h1>تعيين كلمة سر جديدة</h1>
      </div>
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
