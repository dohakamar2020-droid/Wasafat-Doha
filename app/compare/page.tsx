"use client";
import { useState } from "react";
import Link from "next/link";
import { recipes, creatorById, formatViews, type Recipe } from "@/lib/data";

export default function ComparePage() {
  const [slugs] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("wasafat-Doha:compare") || "[]"); } catch { return []; } });
  const [extra, setExtra] = useState("");
  const list: Recipe[] = [...new Set([...slugs, ...(extra ? [extra] : [])])].map((s) => recipes.find((r) => r.slug === s)!).filter(Boolean).slice(0, 3);
  const clear = () => { try { localStorage.removeItem("wasafat-Doha:compare"); } catch {} window.location.reload(); };
  const row = (label: string, fn: (r: Recipe) => string) => (
    <tr><th>{label}</th>{list.map((r) => <td key={r.slug}>{fn(r)}</td>)}</tr>
  );
  return (
    <div className="wrap">
      <div className="page-head"><h1>قارن وخلّص اختيارك ⚖️</h1><p>محتار بين وصفتين أو تلاتة؟ من صفحة أي وصفة دوس «قارنها» وهتتجمع هنا جنب بعض: النوع، المكونات، القوام، حالة المراجعة، والانتشار.</p></div>
      <div className="shop-add" style={{ maxWidth: 560 }}>
        <select value={extra} onChange={(e) => setExtra(e.target.value)} aria-label="ضيف وصفة للمقارنة" style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 999, padding: "10px 14px", fontFamily: "inherit", background: "#fff" }}>
          <option value="">+ ضيف وصفة للمقارنة…</option>
          {recipes.map((r) => <option key={r.slug} value={r.slug}>{r.title}</option>)}
        </select>
        {slugs.length > 0 && <button className="btn btn-ghost" onClick={clear}>امسح المقارنة</button>}
      </div>
      {list.length === 0 ? (
        <div className="empty" style={{ marginTop: 20 }}><h3>لسه مخترتش حاجة للمقارنة</h3><p>اختار من القائمة فوق، أو من زرار «قارنها» داخل أي وصفة.</p><Link className="btn btn-primary" href="/discover">اكتشف الوصفات</Link></div>
      ) : (
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table className="compare-table"><tbody>
            {row("الوصفة", (r) => r.title)}
            {row("الشيف", (r) => creatorById(r.creatorId).name)}
            {row("النوع", (r) => r.category)}
            {row("حالة المراجعة", (r) => (r.status === "reviewed" ? "✓ وصفة مكتملة (مقادير وخطوات)" : "ترشيح فيديو"))}
            {row("المكونات الرئيسية", (r) => (r.detail ? r.detail.ingredients.flatMap((g) => g.items.map((i) => i.name)).slice(0, 8).join("، ") : r.mainIngredients.join("، ")))}
            {row("القوام", (r) => r.textures.join("، ") || "—")}
            {row("مناسبة لو", (r) => r.needs.join("، ") || "—")}
            {row("الأدوات", (r) => r.detail?.tools.join("، ") || "حسب الفيديو")}
            {row("مشاهدات يوتيوب", (r) => formatViews(r.views))}
            {row("افتحها", (r) => "")}
            <tr><th></th>{list.map((r) => <td key={r.slug}><Link className="btn btn-primary btn-sm" href={`/recipes/${r.slug}`}>افتح الوصفة</Link></td>)}</tr>
          </tbody></table>
        </div>
      )}
    </div>
  );
}
