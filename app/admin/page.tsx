"use client";
import { useMemo, useState } from "react";
import { recipes, creators, allSourcesCount } from "@/lib/data";

type LocalItem = { title: string; ytId: string; creator: string; kind: string };
function parseYt(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : null;
}
function DbPanel() {
  const [stats, setStats] = useState<null | { recipes: number; sources: number; creators: number; items: { id: number; ytId: string; kind: string; recipeSlug: string }[] }>(null);
  const [err, setErr] = useState("");
  const [url, setUrl] = useState(""); const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const res = await fetch("/api/admin/sources");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(data.error || "قاعدة البيانات مش متاحة هنا."); setStats(null); return; }
    setErr(""); setStats(data);
  };
  const parse = (u: string) => u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/)?.[1] || null;
  const add = async () => {
    const ytId = parse(url.trim());
    if (!ytId) { setErr("حط رابط يوتيوب صحيح الأول."); return; }
    setBusy(true);
    const res = await fetch("/api/admin/sources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ytId, title, kind: url.includes("/shorts/") ? "short" : "video" }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setErr(res.ok ? `✓ اتضافت في قاعدة البيانات بحالة «${data.stage}» لوصفة ${data.recipeSlug}` : (data.error || "فشلت الإضافة."));
    if (res.ok) { setUrl(""); setTitle(""); load(); }
  };
  const refresh = async () => {
    setBusy(true);
    const res = await fetch("/api/admin/refresh-views", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy(false); setErr(res.ok ? `✓ اتحدثت مشاهدات ${data.updated} مصدر (${data.at})` : (data.error || "فشل التحديث."));
  };
  return (
    <section className="surface"><h2>قاعدة البيانات (Neon) 🗄️</h2>
      <p style={{ color: "var(--muted)" }}>إضافة المصادر والتكرار والتحديث على قاعدة البيانات الفعلية — متاحة للأدمن المسجل دخوله (ADMIN_EMAIL) بس. المراحل: وارد ← قيد المراجعة ← جاهز كترشيح ← وصفة مكتملة ← منشور ← مؤرشف.</p>
      <div className="action-row">
        <button className="btn btn-olive" onClick={load}>حمّل حالة قاعدة البيانات</button>
        <button className="btn btn-ghost" onClick={refresh} disabled={busy}>🔄 تحديث مشاهدات يوتيوب</button>
      </div>
      {stats && <p>في قاعدة البيانات: <b>{stats.recipes}</b> وصفة · <b>{stats.sources}</b> مصدر · <b>{stats.creators}</b> شيفات. آخر المصادر: {stats.items.slice(0, 5).map((i) => i.ytId).join("، ") || "—"}</p>}
      <div className="admin-form">
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="رابط يوتيوب (فيديو أو شورت)" aria-label="رابط يوتيوب لقاعدة البيانات" />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اسم تحريري (لو وصفة جديدة)" aria-label="اسم الوصفة" />
        <button className="btn btn-primary" onClick={add} disabled={busy}>افحص التكرار وضيف لقاعدة البيانات</button>
      </div>
      {err && <div className={err.startsWith("✓") ? "ok-box" : "err-box"} style={{ marginTop: 12 }}>{err}</div>}
    </section>
  );
}

export default function AdminPage() {
  const [url, setUrl] = useState(""); const [title, setTitle] = useState(""); const [creator, setCreator] = useState("nadia");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [local, setLocal] = useState<LocalItem[]>(() => { try { return JSON.parse(localStorage.getItem("wasafat-Doha:admin-added") || "[]"); } catch { return []; } });
  const knownIds = useMemo(() => new Set(recipes.flatMap((r) => r.sources.map((s) => s.ytId))), []);
  const add = () => {
    const id = parseYt(url.trim());
    if (!id) { setMsg({ ok: false, text: "الرابط مش باين عليه رابط يوتيوب صحيح (فيديو أو شورت)." }); return; }
    if (knownIds.has(id) || local.some((x) => x.ytId === id)) {
      const existing = recipes.find((r) => r.sources.some((s) => s.ytId === id));
      setMsg({ ok: false, text: `الرابط ده موجود بالفعل ${existing ? `— مرتبط بوصفة «${existing.title}»` : "في قائمة الانتظار المحلية"}. الاستيراد بيكشف التكرار قبل أي إضافة.` });
      return;
    }
    const item = { title: title.trim() || "وصفة بدون عنوان (قيد المراجعة)", ytId: id, creator, kind: url.includes("/shorts/") ? "short" : "video" };
    const next = [...local, item]; setLocal(next);
    try { localStorage.setItem("wasafat-Doha:admin-added", JSON.stringify(next)); } catch {}
    setMsg({ ok: true, text: `اتضافت «${item.title}» لحالة «وارد» — الخطوة الجاية: مراجعة بيانات المصدر وربطها بوصفة موجودة أو إنشاء وصفة جديدة.` });
    setUrl(""); setTitle("");
  };
  return (
    <div className="wrap">
      <div className="page-head"><h1>إدارة محتوى وصفات قمر 🛠️</h1><p>لوحة إدارة عملية: إضافة رابط فيديو، كشف التكرار، ومراحل المحتوى من «وارد» لحد «منشور». النسخة دي محلية تجريبية — الإضافات بتتحفظ على الجهاز ده بس لحد ما تتوصل بقاعدة البيانات.</p></div>
      <div className="info-grid">
        <div className="info-cell"><span>وصفات منشورة</span><b>{recipes.length}</b></div>
        <div className="info-cell"><span>مصادر فيديو</span><b>{allSourcesCount}</b></div>
        <div className="info-cell"><span>شيفات</span><b>{creators.length}</b></div>
        <div className="info-cell"><span>في الانتظار (محلي)</span><b>{local.length}</b></div>
      </div>
      <section className="surface"><h2>إضافة رابط فيديو</h2>
        <p style={{ color: "var(--muted)" }}>مراحل المحتوى: وارد ← قيد المراجعة ← جاهز كترشيح ← وصفة مكتملة ← منشور ← مؤرشف. وجود فيديو مشهور لا يعني أن المقادير اتراجعت.</p>
        <div className="admin-form">
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=… أو /shorts/…" aria-label="رابط يوتيوب" />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="الاسم التحريري المقترح للوصفة" aria-label="اسم الوصفة" />
          <select value={creator} onChange={(e) => setCreator(e.target.value)} aria-label="الشيف">{creators.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <button className="btn btn-primary" onClick={add}>افحص الرابط وضيفه كـ«وارد»</button>
          {msg && <div className={msg.ok ? "ok-box" : "err-box"} role="status">{msg.text}</div>}
        </div>
        {local.length > 0 && <table className="admin-table"><thead><tr><th>الوصفة</th><th>النوع</th><th>المعرف</th><th>الحالة</th></tr></thead><tbody>{local.map((x) => <tr key={x.ytId}><td>{x.title}</td><td>{x.kind === "short" ? "شورت" : "فيديو"}</td><td dir="ltr">{x.ytId}</td><td>وارد — قيد المراجعة</td></tr>)}</tbody></table>}
      </section>
      <DbPanel />
      <section className="surface"><h2>مراجعة سريعة للمكتبة الحالية</h2>
        <table className="admin-table"><thead><tr><th>الشيف</th><th>وصفات</th><th>مصادر</th></tr></thead>
        <tbody>{creators.map((c) => { const l = recipes.filter((r) => r.creatorId === c.id); return <tr key={c.id}><td>{c.name}</td><td>{l.length}</td><td>{l.reduce((a, r) => a + r.sources.length, 0)}</td></tr>; })}</tbody></table>
      </section>
    </div>
  );
}
