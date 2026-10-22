"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(data.error || "حصلت مشكلة في إنشاء الحساب."); return; }
    try { localStorage.setItem("wasafat-Doha:user", JSON.stringify(data.user)); } catch {}
    window.location.href = "/kitchen";
  };
  return (
    <div className="wrap" style={{ maxWidth: 520 }}>
      <div className="page-head"><span className="eyebrow">🌙 حساب جديد في وصفات قمر</span><h1>اعمل حسابك</h1>
      <p>الحساب بينقل «مطبخي» معاك بين الأجهزة: الحفظ، الخطط، الملاحظات، المشتريات، وسجل تجاربك. أي حاجة حفظتها كضيف على الجهاز ده هتندمج في حسابك أول ما تدخل — من غير تكرار.</p></div>
      <form className="surface admin-form" onSubmit={submit}>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" aria-label="اسمك" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني" dir="ltr" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة السر (6 حروف على الأقل)" aria-label="كلمة السر" dir="ltr" />
        {err && <div className="err-box">{err}</div>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "بيتعمل الحساب…" : "اعمل الحساب وابدأ المزامنة"}</button>
        <p style={{ margin: 0 }}>عندك حساب؟ <Link className="text-link" href="/login">سجل دخول ←</Link></p>
      </form>
    </div>
  );
}
