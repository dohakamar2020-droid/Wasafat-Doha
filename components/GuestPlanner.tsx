"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  fmtClock,
  planGuestSchedule,
  type GuestDish,
} from "@/lib/guest-plan";

// «الضيوف جايين الساعة ٨»: جدول تنفيذ بالعكس من الأوقات الموثقة بس.
// طبق وقته مش موثق بيظهر تحت الجدول من غير أي رقم — يراجع مصدره.

type DishDTO = Omit<GuestDish, "r"> & { slug: string; title: string };

export default function GuestPlanner({ dishes }: { dishes: DishDTO[] }) {
  const [time, setTime] = useState("20:00");
  const [ovens, setOvens] = useState(1);
  const serving = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    return (h || 20) * 60 + (m || 0);
  }, [time]);
  const full = useMemo(
    () =>
      dishes.map((d) => ({
        ...d,
        r: { slug: d.slug, title: d.title } as GuestDish["r"],
      })),
    [dishes],
  );
  const { rows, undated, ovenWarnings } = useMemo(
    () => planGuestSchedule(full, serving, ovens),
    [full, serving, ovens],
  );
  return (
    <section className="surface" aria-labelledby="guest-h">
      <h2 id="guest-h">الضيوف جايين إمتى؟ 🕗</h2>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>
        اختار وقت التقديم وهنرتبلك التنفيذ بالعكس: الحلو والحاجات اللي
        بتستنى تتعمل الأول، وآخر طبق يتعمل قريب من التقديم. الجدول محسوب
        من أوقات موثقة في مراجعات الأطباق بس.
      </p>
      <div className="scale-row">
        <label>
          وقت التقديم
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <label>
          الفرن المتاح
          <select value={ovens} onChange={(e) => setOvens(Number(e.target.value))}>
            <option value={1}>فرن واحد</option>
            <option value={2}>فرنين / فرن + إير فراير</option>
          </select>
        </label>
      </div>
      {rows.length > 0 && (
        <ol className="guest-timeline">
          {rows.map(({ dish, start, finish }) => (
            <li key={dish.r.slug}>
              <b dir="ltr">{fmtClock(start!)}</b> ابدأ{" "}
              <Link className="text-link" href={`/recipes/${dish.r.slug}`}>
                {dish.r.title}
              </Link>{" "}
              <span style={{ color: "var(--muted)" }}>
                (تخلص ~{fmtClock(finish!)} · {dish.minutes} د — {dish.basis})
                {dish.role ? ` · دورها: ${dish.role}` : ""}
                {dish.makeAhead ? " · بتستنى عادي لحد التقديم" : ""}
              </span>
            </li>
          ))}
          <li>
            <b dir="ltr">{fmtClock(serving)}</b> التقديم 🍽️
          </li>
        </ol>
      )}
      {ovenWarnings.map((w) => (
        <p className="results-note" role="alert" key={w}>
          ⚠ {w}
        </p>
      ))}
      {undated.length > 0 && (
        <p className="results-note">
          أطباق وقتها مش موثق عندنا فمش داخلة في الحساب:{" "}
          {undated.map((d) => d.r.title).join("، ")} — راجع فيديو كل واحدة
          وحطها في الجدول بنفسك.
        </p>
      )}
    </section>
  );
}
