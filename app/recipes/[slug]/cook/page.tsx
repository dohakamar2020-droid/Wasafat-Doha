"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipeBySlug, creatorById } from "@/lib/data";
import { VideoEmbed, useDone } from "@/components/ui";

export default function CookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const r = recipeBySlug(slug);
  const done = useDone();
  const [secs, setSecs] = useState(0);
  const [label, setLabel] = useState("مؤقت الطبخ");
  const [endAt, setEndAt] = useState<number | null>(() => { try { const v = localStorage.getItem(`wasafat-Doha:timer:${slug}`); return v ? +v : null; } catch { return null; } });
  const [mins, setMins] = useState(10);
  const [note, setNote] = useState(() => { try { return localStorage.getItem(`wasafat-Doha:note:${slug}`) || ""; } catch { return ""; } });
  const wakeRef = useRef<unknown>(null);

  useEffect(() => {
    if (!endAt) { setSecs(0); return; }
    const tick = () => setSecs(Math.max(0, Math.round((endAt - Date.now()) / 1000)));
    tick(); const id = setInterval(tick, 500); return () => clearInterval(id);
  }, [endAt]);
  useEffect(() => { if (secs === 0 && endAt) { try { localStorage.removeItem(`wasafat-Doha:timer:${slug}`); } catch {} } }, [secs, endAt, slug]);

  if (!r) notFound();
  const s = r.sources[0];
  const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  const startTimer = () => { const e = Date.now() + mins * 60 * 1000; setEndAt(e); try { localStorage.setItem(`wasafat-Doha:timer:${slug}`, String(e)); } catch {} };
  const stopTimer = () => { setEndAt(null); try { localStorage.removeItem(`wasafat-Doha:timer:${slug}`); } catch {} };
  const keepAwake = async () => { try { wakeRef.current = await (navigator as Navigator & { wakeLock?: { request: (t: string) => Promise<unknown> } }).wakeLock?.request("screen"); alert("تمام، الشاشة هتفضل صاحية وانت بتطبخ 👌"); } catch { alert("المتصفح ده مش بيدعم إبقاء الشاشة صاحية هنا."); } };
  const prepItems = ["شفت الفيديو كامل مرة", `جهّزت: ${r.mainIngredients.join("، ")}`, "جهّزت الأدوات الظاهرة في الفيديو"];
  const [prep, setPrep] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(`wasafat-Doha:prep:${slug}`) || "[]"); } catch { return []; } });
  const togglePrep = (i: string) => { const n = prep.includes(i) ? prep.filter((x) => x !== i) : [...prep, i]; setPrep(n); try { localStorage.setItem(`wasafat-Doha:prep:${slug}`, JSON.stringify(n)); } catch {} };

  return (
    <div className="cook-shell">
      <Link className="text-link" href={`/recipes/${r.slug}`}>→ ارجع لصفحة الوصفة</Link>
      <span className="eyebrow" style={{ marginTop: 14 }}>🍳 وضع الطبخ — وصفات قمر</span>
      <h1>{r.title}</h1>
      <p style={{ color: "var(--muted)" }}>من {creatorById(r.creatorId).name} · شغّل الفيديو وافتح الخطوات منه خطوة خطوة — الشرح التفصيلي عند صاحب الوصفة بالصوت والصورة.</p>

      <div className="progress" aria-hidden="true"><i style={{ width: `${(prep.filter((p) => prepItems.includes(p)).length / prepItems.length) * 100}%` }} /></div>
      <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>تجهيزك: {prep.filter((p) => prepItems.includes(p)).length} من {prepItems.length}</p>
      <ul className="check-list">
        {prepItems.map((i) => <li key={i}><label><input type="checkbox" checked={prep.includes(i)} onChange={() => togglePrep(i)} /><span style={{ fontSize: "1.05rem" }}>{i}</span></label></li>)}
      </ul>

      <div style={{ marginTop: 22 }}><VideoEmbed ytId={s.ytId} title={r.title} vertical={s.kind === "short"} /></div>

      <div className="timer-box" role="group" aria-label="مؤقت الطبخ">
        <span>⏱️</span>
        <input aria-label="اسم المؤقت" value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: 130 }} />
        <span className="t-digits">{endAt ? fmt(secs) : "--:--"}</span>
        <input type="number" min={1} max={240} value={mins} onChange={(e) => setMins(+e.target.value)} aria-label="الدقائق" />
        <span>دقيقة</span>
        <button onClick={startTimer}>ابدأ «{label}»</button>
        <button className="alt" onClick={stopTimer}>إيقاف</button>
        <button className="alt" onClick={keepAwake}>خلي الشاشة صاحية</button>
      </div>
      <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>المؤقت بيتحسب من وقت النهاية المحفوظ، فهتلاقيه مظبوط حتى لو خرجت ورجعت. واختر مدته من توقيتات الفيديو نفسه.</p>

      <section className="surface">
        <h3>ملاحظاتك وانت بتطبخ ✍️</h3>
        <textarea className="notes" value={note} onChange={(e) => { setNote(e.target.value); try { localStorage.setItem(`wasafat-Doha:note:${slug}`, e.target.value); } catch {} }} placeholder="قللت الصوص، زوّدت دقيقة في الفرن…" />
        <div className="action-row">
          <button className={`btn ${done.has(r.slug) ? "btn-olive" : "btn-primary"}`} onClick={() => done.toggle(r.slug)}>{done.has(r.slug) ? "✓ اتسجلت في تجاربك" : "عملتها؟ سجّل ملاحظتك في تجاربك"}</button>
          <Link className="btn btn-ghost" href="/kitchen/attempts">تجاربي</Link>
        </div>
      </section>
    </div>
  );
}
