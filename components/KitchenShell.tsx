"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCatalog } from "./CatalogProvider";
import { RecipeCard, useSaved, usePlanned, useDone, useLocalList } from "./ui";
import { useStored } from "./useStored";
import { useSync } from "./SyncProvider";
import ResumeCooking from "./ResumeCooking";
import AttemptPhoto from "./AttemptPhoto";
import AuthStatus from "./AuthStatus";
import type { Attempt } from "@/lib/kitchen-state";
export function KitchenTabs() {
  const path = usePathname();
  return (
    <nav className="tabs" aria-label="أقسام مطبخي">
      {[
        ["/kitchen", "دفتري"],
        ["/kitchen/saved", "محفوظاتي"],
        ["/kitchen/shopping", "مشترياتي"],
        ["/kitchen/attempts", "تجاربي"],
      ].map(([href, t]) => (
        <Link
          key={href}
          href={href}
          className={path === href ? "on" : ""}
          aria-current={path === href ? "page" : undefined}
        >
          {t}
        </Link>
      ))}
    </nav>
  );
}
export function SyncBanner() {
  const { user, available, status, importGuest, retry, resolve } = useSync();
  const [imported, setImported] = useState(false);
  return (
    <aside className="surface sync-state" aria-live="polite">
      {!user ? (
        <p>
          وضع الضيف: بياناتك محفوظة على الجهاز ده.{" "}
          {available ? (
            <Link className="text-link" href="/login">
              ادخل لمزامنة مطبخك
            </Link>
          ) : (
            "المزامنة السحابية غير متاحة مؤقتًا."
          )}
        </p>
      ) : (
        <>
          <p>
            أهلًا {user.name} ·{" "}
            {status === "saved"
              ? "آخر تغييراتك متزامنة"
              : status === "saving"
                ? "جاري الحفظ…"
                : status === "conflict"
                  ? "في تعديل من جهاز تاني"
                  : status === "loading"
                    ? "جاري تحميل حسابك…"
                    : "الحفظ السحابي تعذّر؛ تغييراتك على الجهاز"}
          </p>
          {status === "conflict" ? (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => void resolve("cloud")}
              >
                استخدم نسخة الحساب
              </button>
              <button
                className="btn btn-olive"
                onClick={() => void resolve("device")}
              >
                احتفظ بتغييرات الجهاز
              </button>
            </>
          ) : (
            status === "offline" && (
              <button className="btn btn-ghost" onClick={retry}>
                جرّب المزامنة تاني
              </button>
            )
          )}
          <AuthStatus />
          <details>
            <summary>نقل محفوظات الضيف للحساب</summary>
            <p>
              بيانات الحساب والضيف منفصلين. انقل بيانات الضيف فقط لو الجهاز شخصي
              والبيانات دي تخصك.
            </p>
            <button
              className="btn btn-ghost"
              disabled={imported || status !== "saved"}
              onClick={() => {
                importGuest();
                setImported(true);
              }}
            >
              {imported ? "تم طلب الدمج" : "ادمج بيانات الضيف في حسابي"}
            </button>
          </details>
          {user.isAdmin && (
            <Link className="text-link" href="/admin">
              إدارة المحتوى
            </Link>
          )}
        </>
      )}
    </aside>
  );
}
export function KitchenHome() {
  const recipes = useCatalog(),
    saved = useSaved(),
    planned = usePlanned(),
    done = useDone(),
    shop = useLocalList("wasafat-Doha:shopping");
  const recent = saved.list
    .slice()
    .reverse()
    .map((s) => recipes.find((r) => r.slug === s))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .slice(0, 4);
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>مطبخي</h1>
        <p>اختياراتك وخطتك وتجاربك، في دفتر واحد.</p>
      </div>
      <KitchenTabs />
      <SyncBanner />
      <ResumeCooking />
      <div className="kitchen-cards">
        {[
          ["/kitchen/saved", saved.list.length, "وصفة محفوظة"],
          ["/kitchen/saved", planned.list.length, "في خطة قريب"],
          ["/kitchen/attempts", done.list.length, "وصفة جرّبتها"],
          ["/kitchen/shopping", shop.list.length, "بند مشتريات"],
        ].map(([href, n, t]) => (
          <Link key={t} href={String(href)}>
            <b>{n}</b>
            <span>{t}</span>
          </Link>
        ))}
      </div>
      {recent.length ? (
        <>
          <h2>آخر اختياراتك</h2>
          <div className="grid">
            {recent.map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </div>
        </>
      ) : (
        <div className="empty">
          <h2>أول طبخة تبدأ باختيار</h2>
          <p>احفظ وصفة أو خلّي «رشحلي 3» يساعدك.</p>
          <Link className="btn btn-primary" href="/pick">
            رشحلي 3
          </Link>
        </div>
      )}
    </div>
  );
}
export function SavedPage() {
  const recipes = useCatalog(),
    saved = useSaved(),
    planned = usePlanned();
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>محفوظاتي</h1>
        <p>اللي نفسك تجربه واللي ناوي تعمله قريب.</p>
      </div>
      <KitchenTabs />
      <SyncBanner />
      {[
        [saved.list, "عايز أجرب"],
        [planned.list, "هعملها قريب"],
      ].map(([ids, title]) => (
        <section className="block" key={String(title)}>
          <h2>{title}</h2>
          <div className="grid">
            {(ids as string[]).map((slug) => {
              const r = recipes.find((r) => r.slug === slug);
              return r ? <RecipeCard key={slug} r={r} /> : null;
            })}
          </div>
          {!(ids as string[]).length && (
            <p>
              لسه مفيش وصفات في القسم ده.{" "}
              <Link className="text-link" href="/discover">
                اكتشف وصفة
              </Link>
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
export function AttemptsPage() {
  const recipes = useCatalog();
  const [attempts, setAttempts] = useStored<Attempt[]>(
      "wasafat-Doha:attempts",
      [],
    ),
    [done] = useStored<string[]>("wasafat-Doha:done", []);
  const legacy = done.filter((slug) => !attempts.some((a) => a.slug === slug));
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>دفتر تجربتي</h1>
        <p>
          كل مرة بتاريخها وصورتها وتعديلاتها. سجّل تجربة جديدة من صفحة الوصفة أو
          وضع الطبخ.
        </p>
      </div>
      <KitchenTabs />
      <SyncBanner />
      {attempts.map((a) => {
        const r = recipes.find((r) => r.slug === a.slug);
        return (
          <article className="attempt-item" key={a.id}>
            <Link className="text-link" href={`/recipes/${a.slug}`}>
              <h2>{r?.title || a.slug}</h2>
            </Link>
            <p>
              {new Date(a.at).toLocaleString("ar-EG")}
              {a.rating ? ` · تقييمك ${a.rating}/5` : ""}
            </p>
            {a.photo && <AttemptPhoto path={a.photo} />}
            <label htmlFor={`note-${a.id}`}>ملاحظتي في التجربة دي</label>
            <textarea
              className="notes"
              id={`note-${a.id}`}
              value={a.note}
              maxLength={4000}
              onChange={(e) =>
                setAttempts((old) =>
                  old.map((x) =>
                    x.id === a.id ? { ...x, note: e.target.value } : x,
                  ),
                )
              }
            />
            <p className="results-note">
              {attempts.filter((x) => x.slug === a.slug).length} تجربة للوصفة دي
            </p>
          </article>
        );
      })}
      {legacy.map((slug) => (
        <div className="surface" key={slug}>
          <Link href={`/recipes/${slug}`}>
            {recipes.find((r) => r.slug === slug)?.title || slug}
          </Link>
          <p>متسجلة من النسخة السابقة — بدون تاريخ موثّق.</p>
        </div>
      ))}
      {!attempts.length && !legacy.length && (
        <div className="empty">
          <h2>دفترك مستني أول تجربة</h2>
          <Link className="btn btn-primary" href="/discover?status=reviewed">
            ابدأ بوصفة مكتملة
          </Link>
        </div>
      )}
    </div>
  );
}
export function ShoppingPage() {
  const shop = useLocalList("wasafat-Doha:shopping"),
    checked = useLocalList("wasafat-Doha:shopping-checked");
  const [v, setV] = useState("");
  const add = () => {
    const s = v.trim();
    if (s && !shop.has(s)) shop.toggle(s);
    setV("");
  };
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>مشترياتي</h1>
        <p>مقادير الوصفات والسفرات، مع اللي ضفته بنفسك.</p>
      </div>
      <KitchenTabs />
      <SyncBanner />
      <form
        className="shop-add"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          aria-label="إضافة للمشتريات"
          value={v}
          maxLength={500}
          onChange={(e) => setV(e.target.value)}
          placeholder="ضيف حاجة ناقصاك…"
        />
        <button className="btn btn-primary">إضافة</button>
      </form>
      <ul className="shopping-list">
        {shop.list.map((i) => (
          <li className="shopping-row" key={i}>
            <label>
              <input
                type="checkbox"
                checked={checked.has(i)}
                onChange={() => checked.toggle(i)}
              />
              <span
                style={
                  checked.has(i)
                    ? { textDecoration: "line-through" }
                    : undefined
                }
              >
                {i}
              </span>
            </label>
            <button
              className="btn btn-ghost btn-sm"
              aria-label={`حذف ${i}`}
              onClick={() => {
                shop.toggle(i);
                if (checked.has(i)) checked.toggle(i);
              }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
      {!shop.list.length && (
        <div className="empty">
          <p>
            ضيف المقادير من أي وصفة مكتملة أو سفرة، وعلّم على اللي موجود عندك.
          </p>
        </div>
      )}
    </div>
  );
}
