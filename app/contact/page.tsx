"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { recipes, creatorById } from "@/lib/data";

function ContactInner() {
  const sp = useSearchParams();
  const slug = sp.get("recipe") || "";
  const r = recipes.find((x) => x.slug === slug);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState(r ? `في مشكلة في مصدر وصفة «${r.title}» (${creatorById(r.creatorId).name}): ` : "");
  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div className="page-head"><h1>تواصل معانا ✉️</h1><p>سؤال، اقتراح وصفة، أو إبلاغ عن مشكلة في مصدر (فيديو اتحذف أو تضمينه اتمنع)؟ اكتب هنا وهنراجع ونحدث حالة المصدر واقتراحات بديلة.</p></div>
      {sent ? <div className="ok-box">وصلتنا رسالتك 🌙 هنرد ونراجع المصدر لو فيه مشكلة. (النموذج ده بيحفظ الرسالة على جهازك في النسخة التجريبية — للإبلاغ السريع استخدم صفحة الوصفة ورابط مصدرها الأصلي.)</div> : (
        <form className="surface admin-form" onSubmit={(e) => { e.preventDefault(); try { const k = "wasafat-Doha:messages"; const arr = JSON.parse(localStorage.getItem(k) || "[]"); arr.push({ msg, at: new Date().toISOString() }); localStorage.setItem(k, JSON.stringify(arr)); } catch {} setSent(true); }}>
          <textarea className="notes" required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="اكتب رسالتك…" aria-label="رسالتك" />
          <button className="btn btn-primary">ابعث</button>
        </form>
      )}
      {r && <p style={{ marginTop: 14 }}>الوصفة المقصودة: <b>{r.title}</b> — {creatorById(r.creatorId).name}</p>}
    </div>
  );
}
export default function ContactPage() { return <Suspense fallback={<div className="wrap"><p style={{ padding: 40 }}>…</p></div>}><ContactInner /></Suspense>; }
