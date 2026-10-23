"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
function ContactInner() {
  const sp = useSearchParams();
  const r = useCatalog().find((r) => r.slug === sp.get("recipe"));
  const [msg, setMsg] = useState(""),
    [website, setWebsite] = useState(""),
    [ticket, setTicket] = useState(""),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          ...(r ? { recipeSlug: r.slug } : {}),
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذّر الإرسال.");
      setTicket(data.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "الرسالة لم تُرسل.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="wrap" style={{ maxWidth: 700 }}>
      <div className="page-head">
        <h1>تواصل معانا</h1>
        <p>
          اقتراح وصفة، تصحيح مقادير، أو فيديو مش شغال؟ ابعتلنا التفاصيل وهتدخل
          قائمة المراجعة.
        </p>
        {r && (
          <p>
            بخصوص: <b>{r.title}</b>
          </p>
        )}
      </div>
      {ticket ? (
        <div className="ok-box" role="status">
          رسالتك اتسجلت للمراجعة. رقم البلاغ:{" "}
          <b dir="ltr">{ticket.slice(0, 8)}</b>
        </div>
      ) : (
        <form className="surface admin-form" onSubmit={submit}>
          <label htmlFor="message">رسالتك</label>
          <textarea
            id="message"
            className="notes"
            minLength={10}
            maxLength={4000}
            required
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="قولنا المشكلة والوصفة المقصودة…"
          />
          <input
            type="text"
            className="honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          {err && (
            <p className="err-box" role="alert">
              {err}
            </p>
          )}
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "جاري الإرسال…" : "ابعث الرسالة"}
          </button>
          <p className="results-note">
            مش بنطلب بيانات شخصية. ما تكتبش كلمات سر أو معلومات خاصة في الرسالة.
          </p>
        </form>
      )}
    </div>
  );
}
export default function ContactPage() {
  return (
    <Suspense fallback={<p>بنجهز الصفحة…</p>}>
      <ContactInner />
    </Suspense>
  );
}
