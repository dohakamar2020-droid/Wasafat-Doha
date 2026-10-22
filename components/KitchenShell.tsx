"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { recipes } from "@/lib/data";
import { RecipeCard, useSaved, usePlanned, useDone, useLocalList } from "@/components/ui";

export function KitchenTabs() {
  const path = usePathname();
  const tabs = [["/kitchen", "دفتري"], ["/kitchen/saved", "محفوظاتي"], ["/kitchen/shopping", "مشترياتي"], ["/kitchen/attempts", "تجاربي"]];
  return <div className="tabs" role="navigation" aria-label="أقسام مطبخي">{tabs.map(([href, label]) => <Link key={href} href={href} className={path === href ? "on" : ""}>{label}</Link>)}</div>;
}
export function KitchenHome() {
  const saved = useSaved(); const planned = usePlanned(); const done = useDone();
  const shop = useLocalList("wasafat-Doha:shopping");
  const cards = [
    ["/kitchen/saved", saved.list.length, "وصفة محفوظة — عايز أجربها"],
    ["/kitchen/saved", planned.list.length, "وصفة ناوي تعملها قريب"],
    ["/kitchen/attempts", done.list.length, "وصفة عملتها وسجلتها"],
    ["/kitchen/shopping", shop.list.length, "حاجة ناقصاك في المشتريات"],
  ] as const;
  const recent = saved.list.map((s) => recipes.find((r) => r.slug === s)).filter(Boolean).slice(0, 4) as typeof recipes;
  return (
    <div className="wrap"><div className="page-head"><h1>مطبخي 🍳</h1><p>دفترك الخفيف في وصفات قمر: اللي عايز تجربه، واللي هتعمله قريب، واللي عملته، وناقصك إيه. كل ده بيتحفظ على جهازك من غير حساب — الحساب هيضيف المزامنة بين أجهزتك لاحقًا.</p></div>
      <KitchenTabs />
      <div className="kitchen-cards">{cards.map(([href, n, label], i) => <Link key={i} href={href}><b>{n}</b><span>{label}</span></Link>)}</div>
      {recent.length > 0 && <><div className="section-head"><div><h2>آخر اللي حفظته</h2></div><Link className="text-link" href="/kitchen/saved">كل محفوظاتي ←</Link></div><div className="grid">{recent.map((r) => <RecipeCard key={r.slug} r={r} />)}</div></>}
      {!recent.length && <div className="empty"><h3>دفترك فاضي لسه 🌙</h3><p>دوس «عايز أجربها» على أي وصفة وهتظهر هنا على طول.</p><Link className="btn btn-primary" href="/discover">اكتشف الوصفات</Link></div>}
    </div>
  );
}
export function SavedPage() {
  const saved = useSaved(); const planned = usePlanned();
  const savedList = saved.list.map((s) => recipes.find((r) => r.slug === s)).filter(Boolean) as typeof recipes;
  const plannedList = planned.list.map((s) => recipes.find((r) => r.slug === s)).filter(Boolean) as typeof recipes;
  return (
    <div className="wrap"><div className="page-head"><h1>محفوظاتي ♥</h1><p>اللقطات اللي مستنياك — محفوظة على جهازك وتفضل موجودة بعد تحديث الصفحة.</p></div><KitchenTabs />
      <div className="section-head"><div><h2>عايز أجرب ({savedList.length})</h2></div></div>
      {savedList.length ? <div className="grid">{savedList.map((r) => <RecipeCard key={r.slug} r={r} />)}</div> : <div className="empty"><h3>مفيش محفوظات لسه</h3><p>من أي كارت دوس «♡ عايز أجربها».</p><Link className="btn btn-primary" href="/pick">رشحلي 3 يختارولي</Link></div>}
      <div className="section-head" style={{ marginTop: 34 }}><div><h2>هعملها قريب 📌 ({plannedList.length})</h2></div></div>
      {plannedList.length ? <div className="grid">{plannedList.map((r) => <RecipeCard key={r.slug} r={r} />)}</div> : <p className="results-note">حدد من صفحة أي وصفة «هعملها قريب» وهتتجمع هنا.</p>}
    </div>
  );
}
export function AttemptsPage() {
  const done = useDone();
  const list = done.list.map((s) => recipes.find((r) => r.slug === s)).filter(Boolean) as typeof recipes;
  return (
    <div className="wrap"><div className="page-head"><h1>تجاربي 🍽️</h1><p>سجل الوصفات اللي عملتها فعلًا من وصفات قمر — ملاحظات تعديلاتك محفوظة داخل صفحة كل وصفة.</p></div><KitchenTabs />
      {list.length ? <div className="grid">{list.map((r) => <RecipeCard key={r.slug} r={r} reason="عملتها — افتحها وشوف ملاحظاتك أو عدّلها" />)}</div> : <div className="empty"><h3>لسه معملتش حاجة؟ أول طبخة قريبة 🌙</h3><p>افتح وصفة وادخل «وضع الطبخ»، وبعد ما تخلص سجّلها من هناك.</p><Link className="btn btn-primary" href="/discover">اختار أول وصفة</Link></div>}
    </div>
  );
}
export function ShoppingPage() {
  const shop = useLocalList("wasafat-Doha:shopping");
  const checked = useLocalList("wasafat-Doha:shopping-checked");
  const add = (v: string) => { if (v.trim() && !shop.list.includes(v.trim())) shop.toggle(v.trim()); };
  return <ShoppingInner items={shop.list} toggleItem={shop.toggle} checked={checked.list} toggleChecked={checked.toggle} add={add} />;
}
function ShoppingInner({ items, toggleItem, checked, toggleChecked, add }: { items: string[]; toggleItem: (s: string) => void; checked: string[]; toggleChecked: (s: string) => void; add: (v: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="wrap"><div className="page-head"><h1>مشترياتي 🛒</h1><p>المكونات الناقصة اللي ضفتها من صفحات الوصفات — متجمعة هنا وتفضل متاحة حتى من غير إنترنت على جهازك.</p></div><KitchenTabs />
      <div className="shop-add" style={{ maxWidth: 560 }}><input type="text" value={v} onChange={(e) => setV(e.target.value)} placeholder="ضيف حاجة ناقصاك…" aria-label="إضافة للمشتريات" onKeyDown={(e) => { if (e.key === "Enter") { add(v); setV(""); } }} /><button className="btn btn-primary" onClick={() => { add(v); setV(""); }}>+ إضافة</button></div>
      {items.length ? <ul className="check-list" style={{ maxWidth: 640, marginTop: 20 }}>{items.map((i) => <li key={i}><label><input type="checkbox" checked={checked.includes(i)} onChange={() => toggleChecked(i)} /><span style={checked.includes(i) ? { textDecoration: "line-through", opacity: .6 } : undefined}>{i}</span><button type="button" className="btn btn-ghost btn-sm" style={{ marginInlineStart: "auto" }} onClick={() => toggleItem(i)}>حذف</button></label></li>)}</ul>
      : <div className="empty" style={{ marginTop: 20 }}><h3>قائمة المشتريات فاضية</h3><p>من صفحة أي وصفة اكتب «ناقصك إيه؟» وهيتضاف هنا.</p></div>}
    </div>
  );
}
import { useState } from "react";
