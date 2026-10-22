"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(data.error || "حصلت مشكلة في الدخول."); return; }
    try { localStorage.setItem("wasafat-Doha:user", JSON.stringify(data.user)); } catch {}
    window.location.href = "/kitchen";
  };
  return (
    <div className="wrap" style={{ maxWidth: 520 }}>
      <div className="page-head"><span className="eyebrow">🌙 حسابك في وصفات قمر</span><h1>تسجيل الدخول</h1>
      <p>دخولك بيفتح المزامنة: محفوظاتك وملاحظاتك ومشترياتك وتجاربك هتتلاقى على أي جهاز تدخل منه. الضيف يقدر يكمل من غير حساب — الحفظ بيبقى على جهازه بس.</p></div>
      <form className="surface admin-form" onSubmit={submit}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني" dir="ltr" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة السر" aria-label="كلمة السر" dir="ltr" />
        {err && <div className="err-box">{err}</div>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "بيتم الدخول…" : "ادخل وزامن مطبخي"}</button>
        <p style={{ margin: 0 }}>معندكش حساب؟ <Link className="text-link" href="/register">اعمل حساب جديد ←</Link></p>
      </form>
    </div>
  );
}
