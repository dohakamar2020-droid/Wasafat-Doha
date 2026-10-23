import type { Recipe } from "./data";

// «الضيوف جايين الساعة ٨»: جدول تنفيذ بالعكس من وقت التقديم، مبني على
// الأوقات الموثقة في مراجعات الوصفات بس. طبق وقته مش موثق ما بيتحسبش —
// بيظهر في قايمة «راجع مصدره» من غير أي رقم مخترع.

export type GuestDish = {
  r: Recipe;
  role: string;
  minutes: number | null; // المدة المستخدمة في الحساب (موثقة فقط)
  basis: string; // جت منين: إجمالي مصرح / مجموع تحضير+طبخ+انتظار
  needsOven: boolean;
  makeAhead: boolean; // حلو/انتظار طويل: يتعمل بدري أو قبلها بيوم
};

export function dishMinutes(r: Recipe): {
  minutes: number | null;
  basis: string;
} {
  const t = r.detail?.timing;
  if (!t) return { minutes: null, basis: "" };
  if (t.totalMinutes)
    return { minutes: t.totalMinutes, basis: "وقت كلي مصرح به من المصدر" };
  const parts = [t.prepMinutes, t.cookMinutes, t.waitMinutes].filter(
    (x): x is number => x != null,
  );
  if (!parts.length) return { minutes: null, basis: "" };
  return {
    minutes: parts.reduce((a, b) => a + b, 0),
    basis: "مجموع التحضير والطبخ والانتظار الموثقة (مفيش وقت كلي مصرح به)",
  };
}

export function guestDishes(recipes: Recipe[], roles: Record<string, string>): GuestDish[] {
  return recipes.map((r) => {
    const { minutes, basis } = dishMinutes(r);
    const role = roles[r.slug] || "";
    const tools = (r.detail?.tools || []).join(" ");
    return {
      r,
      role,
      minutes,
      basis,
      needsOven: /فرن/.test(tools) || (r.detail?.steps || []).some((s) => /فرن/.test(s.body)),
      makeAhead:
        /حلو/.test(role) || (r.detail?.timing?.waitMinutes || 0) >= 120,
    };
  });
}

export type ScheduleRow = {
  dish: GuestDish;
  start: number | null; // دقائق من منتصف الليل
  finish: number | null;
};

export function fmtClock(mins: number) {
  const m = ((mins % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const period = h24 < 12 ? "ص" : "م";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${mm} ${period}`;
}

/**
 * الجدول بالعكس: الحلو والمجهز بدري يخلص قبل التقديم بساعة على الأقل،
 * وأقصر طبخ (آخر لحظة) يبدأ أقرب للتقديم. الفرن الواحد بيترتب عليه
 * تنبيه تعارض لو طبقين فرن بيتداخلوا زمنيًا.
 */
export function planGuestSchedule(
  dishes: GuestDish[],
  servingMinutes: number,
  ovens: number,
): { rows: ScheduleRow[]; undated: GuestDish[]; ovenWarnings: string[] } {
  const dated = dishes.filter((d) => d.minutes != null);
  const undated = dishes.filter((d) => d.minutes == null);
  const rows: ScheduleRow[] = dated
    .map((dish) => {
      // الحلو/المجهز بدري: يخلص قبل التقديم بساعة (يستنى في التلاجة/بره)
      // آخر لحظة (≤30د من غير انتظار): يخلص عند التقديم بالظبط
      const buffer = dish.makeAhead ? 60 : 0;
      const finish = servingMinutes - buffer;
      return { dish, start: finish - dish.minutes!, finish };
    })
    .sort((a, b) => a.start! - b.start!);
  const ovenWarnings: string[] = [];
  if (ovens <= 1) {
    const ovenRows = rows.filter((x) => x.dish.needsOven);
    for (let i = 0; i < ovenRows.length; i++)
      for (let j = i + 1; j < ovenRows.length; j++) {
        const a = ovenRows[i],
          b = ovenRows[j];
        if (a.start! < b.finish! && b.start! < a.finish!)
          ovenWarnings.push(
            `«${a.dish.r.title}» و«${b.dish.r.title}» محتاجين الفرن في وقت متداخل — بفرن واحد بدّل بينهم أو قدّم واحد فيهم.`,
          );
      }
  }
  return { rows, undated, ovenWarnings };
}
