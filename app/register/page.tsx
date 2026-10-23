"use client";
import { useSync } from "@/components/SyncProvider";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const { available, status } = useSync();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      if (!res.ok) {
        setErr(data.error || "حصلت مشكلة في إنشاء الحساب.");
        return;
      }

      window.location.href = "/kitchen";
    } catch {
      setBusy(false);
      setErr("تعذّر الاتصال. جرّب مرة تانية.");
    }
  };
  return (
    <div className="wrap" style={{ maxWidth: 520 }}>
      <div className="page-head">
        <span className="eyebrow">🌙 حساب جديد في وصفات قمر</span>
        <h1>اعمل حسابك</h1>
        <p>
          الحساب بينقل «مطبخي» معاك بين الأجهزة: الحفظ، الخطط، الملاحظات،
          المشتريات، وسجل تجاربك. بيانات الضيف منفصلة، وتقدر تختار دمجها من
          مطبخي بعد الدخول.
        </p>
      </div>
      {status !== "loading" && !available && (
        <p className="notice">
          الحسابات غير متاحة مؤقتًا.{" "}
          <Link className="text-link" href="/kitchen">
            كمّل كضيف واحفظ على جهازك
          </Link>
          .
        </p>
      )}
      <form className="surface admin-form" onSubmit={submit}>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          aria-label="اسمك"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          aria-label="البريد الإلكتروني"
          dir="ltr"
        />
        <input
          type="password"
          required
          minLength={10}
          maxLength={72}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر (10 حروف على الأقل)"
          aria-label="كلمة السر"
          dir="ltr"
        />
        {err && <div className="err-box">{err}</div>}
        <button className="btn btn-primary" disabled={busy || !available}>
          {busy ? "بيتعمل الحساب…" : "اعمل الحساب وابدأ المزامنة"}
        </button>
        <p style={{ margin: 0 }}>
          عندك حساب؟{" "}
          <Link className="text-link" href="/login">
            سجل دخول ←
          </Link>
        </p>
      </form>
    </div>
  );
}
