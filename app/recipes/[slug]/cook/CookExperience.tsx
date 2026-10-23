"use client";
import { newId } from "@/lib/id";
import { stepVideoUrl } from "@/lib/trend";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/lib/data";
import { VideoEmbed } from "@/components/ui";
import { useStored } from "@/components/useStored";
import { storageSet, storageRemove } from "@/lib/storage";
import { stepIngredients } from "@/lib/experience";
import AttemptForm from "@/components/AttemptForm";
type Timer = { id: string; label: string; endAt: number };
export default function CookExperience({ r }: { r: Recipe }) {
  const [idx, setIdx] = useStored<number>(`wasafat-Doha:cookstep:${r.slug}`, 0),
    [scale] = useStored<number>(`wasafat-Doha:scale:${r.slug}`, 1),
    [prep, setPrep] = useStored<string[]>(`wasafat-Doha:prep:${r.slug}`, []),
    [notes, setNotes] = useStored<Record<string, string>>(
      "wasafat-Doha:notes",
      {},
    ),
    [timers, setTimers] = useStored<Timer[]>(
      `wasafat-Doha:timers:${r.slug}`,
      [],
    );
  const [now, setNow] = useState(() => Date.now()),
    [mins, setMins] = useState(10),
    [label, setLabel] = useState("مؤقت الطبخ"),
    [awake, setAwake] = useState(false),
    [message, setMessage] = useState(""),
    [finished, setFinished] = useState(false);
  const audio = useRef<AudioContext | null>(null),
    beeped = useRef(new Set<string>()),
    wake = useRef<WakeLockSentinel | null>(null);
  const steps = r.detail?.steps || [];
  const stepIndex = Math.max(0, Math.min(idx, Math.max(0, steps.length - 1)));
  const step = steps[stepIndex];
  const ingredients =
    r.detail?.ingredients.flatMap((g) =>
      g.items.map((i) => ({ ...i, group: g.group })),
    ) || [];
  const activeIngredients = step ? stepIngredients(step, ingredients) : [];
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    storageSet(
      "wasafat-Doha:last-cook",
      JSON.stringify({ slug: r.slug, step: stepIndex }),
    );
  }, [r.slug, stepIndex]);
  useEffect(() => {
    for (const t of timers) {
      if (t.endAt <= now && !beeped.current.has(t.id)) {
        beeped.current.add(t.id);
        setMessage(`مؤقت «${t.label}» خلص. راجع نتيجة الطبخة.`);
        try {
          const ctx = audio.current;
          if (ctx) {
            for (let i = 0; i < 3; i++) {
              const oscillator = ctx.createOscillator(),
                gain = ctx.createGain();
              oscillator.connect(gain);
              gain.connect(ctx.destination);
              gain.gain.value = 0.1;
              oscillator.frequency.value = 660;
              oscillator.start(ctx.currentTime + i * 0.3);
              oscillator.stop(ctx.currentTime + i * 0.3 + 0.15);
            }
          }
        } catch {}
      }
    }
  }, [timers, now]);
  useEffect(
    () => () => {
      void wake.current?.release();
      void audio.current?.close();
    },
    [],
  );
  const startTimer = (minutes: number, title: string) => {
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 10080) {
      setMessage("اختار مدة بين دقيقة وأسبوع.");
      return;
    }
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume();
    } catch {}
    setTimers((old) =>
      [
        { id: newId(), label: title, endAt: Date.now() + minutes * 60000 },
        ...old,
      ].slice(0, 10),
    );
  };
  const keepAwake = async () => {
    if (!("wakeLock" in navigator)) {
      setMessage("المتصفح مش بيدعم إبقاء الشاشة صاحية.");
      return;
    }
    try {
      if (awake) {
        await wake.current?.release();
        setAwake(false);
        return;
      }
      wake.current = await navigator.wakeLock.request("screen");
      wake.current.addEventListener("release", () => setAwake(false));
      setAwake(true);
    } catch {
      setMessage("تعذّر إبقاء الشاشة صاحية. جرّب والمتصفح مفتوح قدامك.");
    }
  };
  const next = (n: number) => {
    setIdx(Math.max(0, Math.min(n, steps.length - 1)));
    setFinished(false);
  };
  const prepItems = [
    ["watched", "شفت شرح الوصفة مرة"],
    ["ingredients", "جهّزت المقادير المطلوبة"],
    ["tools", "جهّزت الأدوات"],
  ];
  return (
    <div className="cook-shell">
      <Link className="text-link" href={`/recipes/${r.slug}`}>
        ارجع لصفحة الوصفة
      </Link>
      <div className="page-head">
        <span className="eyebrow">مساحة الطبخ</span>
        <h1>{r.title}</h1>
      </div>
      <details className="surface details-menu">
        <summary>تجهيزي قبل البداية ({prep.length}/3)</summary>
        <ul className="check-list">
          {prepItems.map(([id, text]) => (
            <li key={id}>
              <label>
                <input
                  type="checkbox"
                  checked={prep.includes(id)}
                  onChange={() =>
                    setPrep((old) =>
                      old.includes(id)
                        ? old.filter((x) => x !== id)
                        : [...old, id],
                    )
                  }
                />
                <span>{text}</span>
              </label>
            </li>
          ))}
        </ul>
      </details>
      {step ? (
        <section
          className="surface cook-progress"
          aria-label="خطوة الطبخ الحالية"
        >
          <p>
            الخطوة {stepIndex + 1} من {steps.length}
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-label="تقدم الطبخ"
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={finished ? steps.length : stepIndex}
          >
            <i
              style={{
                width: `${(finished ? 1 : stepIndex / steps.length) * 100}%`,
              }}
            />
          </div>
          <h2>{step.title}</h2>
          <p className="cook-step-body">{step.body}</p>
          {step.cue && <p className="cue">علامة النتيجة: {step.cue}</p>}
          {stepVideoUrl(r, stepIndex, steps.length) && (
            <a
              className="btn btn-ghost step-video-btn"
              href={stepVideoUrl(r, stepIndex, steps.length)!.url}
              target="_blank"
              rel="noreferrer"
            >
              ▶ ورّيني الخطوة دي في الفيديو (تقريبًا عند{" "}
              {stepVideoUrl(r, stepIndex, steps.length)!.minuteLabel})
            </a>
          )}
          <details className="details-menu step-ingredients-panel">
            <summary>
              🧺 مقادير الخطوة دي
              {activeIngredients.length
                ? ` (${activeIngredients.length})`
                : " — شوف كل المقادير تحت"}
            </summary>
            {activeIngredients.length > 0 ? (
              <>
                <p className="results-note">
                  الكميات إجمالية للوصفة؛ استخدم الجزء المذكور في شرح الخطوة لو
                  المكوّن بيتقسم على مراحل.
                </p>
                <ul>
                  {activeIngredients.map((i) => (
                    <li key={i.name}>
                      {i.amount != null && i.unit
                        ? `${Math.round(i.amount * scale * 100) / 100} ${i.unit}`
                        : i.display}{" "}
                      — {i.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="results-note">
                مرجع مقادير الخطوة دي مش مربوط لسه — افتح «كل المقادير» اللي
                تحت واشتغل منها.
              </p>
            )}
          </details>
          <div className="action-row">
            <button
              className="btn btn-ghost"
              disabled={stepIndex === 0}
              onClick={() => next(stepIndex - 1)}
            >
              الخطوة اللي قبلها
            </button>
            {stepIndex < steps.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => next(stepIndex + 1)}
              >
                الخطوة اللي بعدها
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFinished(true);
                  storageRemove("wasafat-Doha:last-cook");
                }}
              >
                خلصت الطبخة
              </button>
            )}
            {step.minutes && (
              <button
                className="btn btn-olive"
                onClick={() => startTimer(step.minutes!, step.title)}
              >
                مؤقت {step.minutes} دقيقة
              </button>
            )}
          </div>
          <details className="details-menu">
            <summary>كل المقادير — ×{scale}</summary>
            <ul>
              {ingredients.map((i, n) => (
                <li key={`${i.name}-${n}`}>
                  {i.amount != null && i.unit
                    ? `${Math.round(i.amount * scale * 100) / 100} ${i.unit}`
                    : i.display}{" "}
                  — {i.name}
                  {i.optional ? " (اختياري)" : ""}
                </li>
              ))}
            </ul>
          </details>
        </section>
      ) : (
        <div className="notice">
          <h2>مصدر الوصفة هو الفيديو</h2>
          <p>
            الخطوات المكتوبة لسه قيد المراجعة. جهّز من شرح الشيف، واستخدم المؤقت
            والملاحظات هنا.
          </p>
        </div>
      )}
      {step && (
        <nav className="cook-nav" aria-label="التنقل بين الخطوات">
          <button
            className="btn btn-ghost"
            disabled={stepIndex === 0}
            onClick={() => next(stepIndex - 1)}
          >
            → السابق
          </button>
          <span className="cook-nav-count">
            {stepIndex + 1} / {steps.length}
          </span>
          {step.minutes ? (
            <button
              className="btn btn-olive"
              onClick={() => startTimer(step.minutes!, step.title)}
            >
              ⏱ {step.minutes}د
            </button>
          ) : null}
          {stepIndex < steps.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => next(stepIndex + 1)}
            >
              التالي ←
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                setFinished(true);
                storageRemove("wasafat-Doha:last-cook");
              }}
            >
              خلصت ✓
            </button>
          )}
        </nav>
      )}
      {finished && (
        <div className="ok-box" role="status">
          بالهنا! سجّل النتيجة والتعديلات في دفتر تجاربك.
        </div>
      )}
      <section className="surface">
        <h2>مؤقتات الطبخ</h2>
        <div className="timer-box">
          <label>
            اسم المؤقت
            <input
              aria-label="اسم المؤقت"
              value={label}
              maxLength={100}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <label>
            دقيقة
            <input
              type="number"
              aria-label="الدقائق"
              min={1}
              max={10080}
              value={mins}
              onChange={(e) => setMins(Number(e.target.value))}
            />
          </label>
          <button onClick={() => startTimer(mins, label)}>ابدأ المؤقت</button>
          <button className="alt" aria-pressed={awake} onClick={keepAwake}>
            {awake ? "اسمح للشاشة تقفل" : "خلي الشاشة صاحية"}
          </button>
        </div>
        <p role="status" aria-live="polite">
          {message}
        </p>
        {timers.map((t) => {
          const seconds = Math.max(0, Math.ceil((t.endAt - now) / 1000));
          return (
            <div
              className={`surface ${seconds === 0 ? "timer-finished" : ""}`}
              key={t.id}
            >
              <b>{t.label}</b>
              <p className="timer-number" dir="ltr">
                {seconds
                  ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
                  : "خلص الوقت ✓"}
              </p>
              <button
                className="btn btn-ghost"
                onClick={() =>
                  setTimers((old) => old.filter((x) => x.id !== t.id))
                }
              >
                إزالة المؤقت
              </button>
            </div>
          );
        })}
        <p className="results-note">
          المؤقت بيحسب وقت النهاية حتى بعد الرجوع للصفحة. التنبيه الصوتي محتاج
          الصفحة مفتوحة والصوت متاح في المتصفح.
        </p>
      </section>
      <details className="surface details-menu">
        <summary>شاهد شرح الشيف</summary>
        <VideoEmbed
          ytId={r.sources[0].ytId}
          title={r.title}
          vertical={r.sources[0].kind === "short"}
          embeddable={r.sources[0].embeddable}
        />
      </details>
      <section className="surface">
        <label htmlFor="cook-note">ملاحظتي أثناء الطبخ</label>
        <textarea
          id="cook-note"
          className="notes"
          value={notes[r.slug] || ""}
          maxLength={4000}
          onChange={(e) =>
            setNotes((old) => ({ ...old, [r.slug]: e.target.value }))
          }
        />
      </section>
      <AttemptForm slug={r.slug} />
    </div>
  );
}
