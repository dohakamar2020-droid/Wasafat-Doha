"use client";
export default function ShareMeal({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    try { if (navigator.share) { await navigator.share({ title: `سفرة ${title} — وصفات قمر`, url }); return; } throw new Error("no-share"); }
    catch { try { await navigator.clipboard.writeText(url); alert("اتنسخ رابط السفرة — ابعته للي هيشاركك القعدة 🌙"); } catch { alert(url); } }
  };
  return <button className="btn btn-primary" onClick={share}>🔗 شارك السفرة دي برابط</button>;
}
