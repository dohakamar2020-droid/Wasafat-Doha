"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { creators } from "@/lib/data";
type Item = {
  slug: string;
  title: string;
  stage: string;
  status: string;
  version: number;
};
type Report = {
  id: string;
  message: string;
  recipeSlug: string | null;
  status: string;
  createdAt: string;
};
const labels: Record<string, string> = {
  draft: "وارد",
  review: "قيد المراجعة",
  ready: "جاهز",
  published: "منشور",
  archived: "مؤرشف",
  new: "جديد",
  reviewing: "تحت المراجعة",
  resolved: "اتحل",
};
export default function AdminConsole() {
  const [items, setItems] = useState<Item[]>([]),
    [reports, setReports] = useState<Report[]>([]),
    [err, setErr] = useState(""),
    [ok, setOk] = useState(""),
    [busy, setBusy] = useState(false),
    [filter, setFilter] = useState(""),
    [url, setUrl] = useState(""),
    [title, setTitle] = useState(""),
    [creatorId, setCreatorId] = useState(""),
    [published, setPublished] = useState(""),
    [slug, setSlug] = useState("");
  const load = useCallback(async () => {
    try {
      const [r, s] = await Promise.all([
        fetch("/api/admin/sources"),
        fetch("/api/admin/reports"),
      ]);
      const a = await r.json(),
        b = await s.json();
      if (!r.ok) throw new Error(a.error);
      if (!s.ok) throw new Error(b.error);
      setItems(a.items);
      setReports(b.items);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر تحميل الإدارة.");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setOk("");
    try {
      let id = "";
      const u = new URL(url);
      if (
        ![
          "youtube.com",
          "www.youtube.com",
          "m.youtube.com",
          "youtu.be",
        ].includes(u.hostname)
      )
        throw new Error("حط رابط يوتيوب رسمي.");
      id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : u.pathname.startsWith("/shorts/")
            ? u.pathname.split("/")[2]
            : u.searchParams.get("v") || "";
      const r = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ytId: id,
          title,
          creatorId,
          kind: u.pathname.includes("/shorts/") ? "short" : "video",
          published,
          ...(slug ? { slug } : {}),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setOk(
        `المصدر اتسجل في الوصفة ${d.recipeSlug}. راجعه من زر التحرير قبل نشره.`,
      );
      setUrl("");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّرت الإضافة.");
    } finally {
      setBusy(false);
    }
  };
  const refresh = async () => {
    setBusy(true);
    setErr("");
    setOk("");
    try {
      const r = await fetch("/api/admin/refresh-views", { method: "POST" }),
        d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setOk(`اتحدثت مشاهدات ${d.updated} مصدر.`);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر التحديث.");
    } finally {
      setBusy(false);
    }
  };
  const reportStatus = async (id: string, status: string) => {
    try {
      const r = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok) throw new Error("الحالة لم تُحفظ.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر الحفظ.");
    }
  };
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>إدارة وصفات قمر</h1>
        <p>
          وارد ← قيد المراجعة ← جاهز ← منشور ← مؤرشف. المحتوى المنشور هو اللي
          بيظهر للزوار.
        </p>
      </div>
      {err && (
        <p className="err-box" role="alert">
          {err}
        </p>
      )}
      {ok && (
        <p className="ok-box" role="status">
          {ok}
        </p>
      )}
      <div className="kitchen-cards">
        {["draft", "review", "ready", "published", "archived"].map((s) => (
          <button
            className="mood"
            key={s}
            onClick={() => setFilter(filter === s ? "" : s)}
            aria-pressed={filter === s}
          >
            <b>{items.filter((i) => i.stage === s).length}</b>
            <span>{labels[s]}</span>
          </button>
        ))}
      </div>
      <section className="surface">
        <h2>إضافة مصدر</h2>
        <form className="admin-form" onSubmit={submit}>
          <label>
            رابط يوتيوب
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <label>
            اسم الوصفة
            <input
              required
              minLength={3}
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            الشيف
            <select
              required
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
            >
              <option value="">اختار صاحب الوصفة</option>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            شهر النشر الأصلي (MM/YYYY)
            <input
              placeholder="10/2026"
              required
              pattern="(0[1-9]|1[0-2])/20[0-9]{2}"
              value={published}
              onChange={(e) => setPublished(e.target.value)}
            />
          </label>
          <label>
            اربطه بوصفة موجودة (اختياري)
            <select value={slug} onChange={(e) => setSlug(e.target.value)}>
              <option value="">إنشاء وصفة واردة جديدة</option>
              {items.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.title}
                </option>
              ))}
            </select>
          </label>
          <button disabled={busy} className="btn btn-primary">
            افحص التكرار وضيف للمراجعة
          </button>
        </form>
      </section>
      <section className="surface">
        <div className="section-head">
          <h2>قائمة التحرير</h2>
          <button className="btn btn-ghost" disabled={busy} onClick={refresh}>
            حدّث مشاهدات يوتيوب
          </button>
        </div>
        <p>
          بيانات المقادير والخطوات تُراجع من المصدر. «تجربة موثقة» تتكتب بعد طبخ
          فعلي فقط.
        </p>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الوصفة</th>
                <th>الحالة</th>
                <th>المقادير</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((i) => !filter || i.stage === filter)
                .map((i) => (
                  <tr key={i.slug}>
                    <td>{i.title}</td>
                    <td>{labels[i.stage]}</td>
                    <td>
                      {i.status === "reviewed" ? "مكتملة" : "ترشيح فيديو"}
                    </td>
                    <td>
                      <Link
                        className="btn btn-ghost btn-sm"
                        href={`/admin/review/${i.slug}`}
                      >
                        تحرير ومعاينة
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="surface">
        <h2>بلاغات واقتراحات الزوار</h2>
        <div className="report-list">
          {reports.length ? (
            reports.map((r) => (
              <article className="report-item" key={r.id}>
                <p>{r.message}</p>
                {r.recipeSlug && (
                  <Link
                    className="text-link"
                    href={`/admin/review/${r.recipeSlug}`}
                  >
                    راجع الوصفة المقصودة
                  </Link>
                )}
                <p>{new Date(r.createdAt).toLocaleDateString("ar-EG")}</p>
                <label>
                  حالة البلاغ
                  <select
                    value={r.status}
                    onChange={(e) => void reportStatus(r.id, e.target.value)}
                  >
                    {["new", "reviewing", "resolved"].map((s) => (
                      <option key={s} value={s}>
                        {labels[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            ))
          ) : (
            <p>مفيش بلاغات لسه.</p>
          )}
        </div>
      </section>
    </div>
  );
}
