"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [devUrl, setDevUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "حصلت مشكلة.");
        return;
      }
      setMsg(data.message || "لو الإيميل مسجل هيوصلك رابط الاستعادة.");
      if (data.devResetUrl) setDevUrl(data.devResetUrl);
    } catch {
      setErr("تعذّر الاتصال. جرّب مرة تانية.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="wrap" style={{ maxWidth: 520 }}>
      <div className="page-head">
        <span className="eyebrow">🌙 وصفات قمر</span>
        <h1>نسيت كلمة السر؟</h1>
        <p>اكتب إيميل حسابك وهنبعتلك رابط لتعيين كلمة سر جديدة (صالح ساعة).</p>
      </div>
      <form className="surface admin-form" onSubmit={submit}>
        <label htmlFor="forgot-email">البريد الإلكتروني</label>
        <input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {err && <p className="notice">{err}</p>}
        {msg && <p className="notice">✔ {msg}</p>}
        {devUrl && (
          <p className="notice">
            (وضع التجربة) رابط الاستعادة:{" "}
            <a className="text-link" href={devUrl}>
              اضغط هنا لتعيين كلمة سر جديدة
            </a>
          </p>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "بيبعت…" : "ابعت رابط الاستعادة"}
        </button>
      </form>
      <p>
        فاكرها؟{" "}
        <Link className="text-link" href="/login">
          ارجع لتسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
