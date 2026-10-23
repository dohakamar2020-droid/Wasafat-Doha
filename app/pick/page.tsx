"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useCatalog } from "@/components/CatalogProvider";
import { RecipeCard } from "@/components/ui";
import { recommend } from "@/lib/experience";
function Step({
  title,
  value,
  onChange,
  options,
}: {
  title: string;
  value: string;
  onChange: (s: string) => void;
  options: [string, string][];
}) {
  return (
    <fieldset className="wiz-step">
      <legend>{title}</legend>
      <div className="opt-grid">
        {options.map(([v, label]) => (
          <button
            type="button"
            key={v}
            className={`opt ${value === v ? "on" : ""}`}
            aria-pressed={value === v}
            onClick={() => onChange(v)}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export default function PickPage() {
  const catalog = useCatalog();
  const [taste, setTaste] = useState(""),
    [time, setTime] = useState(""),
    [priority, setPriority] = useState(""),
    [excluded, setExcluded] = useState<string[]>([]);
  const ready = taste && time && priority;
  const picks = useMemo(
    () =>
      ready ? recommend(catalog, { taste, time, priority }, excluded) : [],
    [catalog, taste, time, priority, excluded, ready],
  );
  const change = (set: (s: string) => void) => (s: string) => {
    set(s);
    setExcluded([]);
  };
  return (
    <div className="wrap">
      <div className="page-head">
        <span className="eyebrow">اختيارات على مقاس طلبك</span>
        <h1>رشحلي 3</h1>
        <p>
          حدد مزاجك ووقتك. الشروط اللي تختارها هتتطبق، حتى لو النتيجة أقل من 3
          وصفات.
        </p>
      </div>
      <div className="wizard">
        <Step
          title="1. نفسك في إيه؟"
          value={taste}
          onChange={change(setTaste)}
          options={[
            ["sweet", "حلو"],
            ["savory", "حادق"],
            ["any", "مش فارقة"],
          ]}
        />
        <Step
          title="2. وقتك قد إيه؟"
          value={time}
          onChange={change(setTime)}
          options={[
            ["15", "15 دقيقة بحد أقصى"],
            ["45", "45 دقيقة بحد أقصى"],
            ["any", "مش محدد وقت"],
          ]}
        />
        <p className="results-note">
          الحد الزمني بيستخدم وقت الطبخ الكامل الموثّق فقط. مدة الفيديو والشورت
          مش مقياس. حاليًا عندنا{" "}
          <b>{catalog.filter((r) => r.totalMinutes != null).length}</b> وصفات
          بوقت كلي مصرح به من مصدرها من أصل {catalog.length} — عشان كده اختيار
          وقت ضيق ممكن يطلع نتائج قليلة أو فاضية لحد ما نوثق أوقات باقي
          الوصفات، ومش هنخمّن وقت لوصفة مش موثقة.
        </p>
        <Step
          title="3. أهم حاجة عندك؟"
          value={priority}
          onChange={change(setPriority)}
          options={[
            ["few", "مكونات أقل"],
            ["nooven", "بدون فرن"],
            ["filling", "طبق يشبع"],
            ["wow", "ينفع للعزومة"],
            ["different", "تجربة مختلفة"],
          ]}
        />
        {ready ? (
          <section aria-live="polite">
            <div className="section-head">
              <h2>
                {picks.length
                  ? `لقينا ${picks.length} يناسبوا طلبك`
                  : "لسه بنجهز الترشيحات…"}
              </h2>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setTaste("");
                  setTime("");
                  setPriority("");
                  setExcluded([]);
                }}
              >
                ابدأ من الأول
              </button>
            </div>
            {picks.length ? (
              <div className="grid">
                {picks.map((p) => (
                  <div key={p.r.slug}>
                    <RecipeCard r={p.r} reason={p.reason} />
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: 10 }}
                      onClick={() => setExcluded((x) => [...x, p.r.slug])}
                    >
                      بدّل الاختيار ده
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <p>
                  مش هنخمّن وقت طبخ. تقدر تلغي شرط الوقت مع الاحتفاظ بباقي طلبك،
                  أو تختار من الوصفات المكتملة.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => change(setTime)("any")}
                >
                  شوف نفس الطلب بدون حد زمني
                </button>
                <Link
                  className="btn btn-ghost"
                  href="/discover?status=reviewed"
                >
                  الوصفات المكتملة
                </Link>
              </div>
            )}
          </section>
        ) : (
          <p>كمّل الأسئلة عشان نرشحلك.</p>
        )}
      </div>
    </div>
  );
}
