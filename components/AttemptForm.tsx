"use client";
import { useState } from "react";
import { addAttempt } from "@/lib/local-kitchen";
import { useSync } from "./SyncProvider";
import { storageGet } from "@/lib/storage";
import { saveLocalPhoto } from "@/lib/photos";
export default function AttemptForm({
  slug,
  onDone,
}: {
  slug: string;
  onDone?: () => void;
}) {
  const { user } = useSync();
  const [note, setNote] = useState(""),
    [actual, setActual] = useState(""),
    [hardest, setHardest] = useState(""),
    [verdict, setVerdict] = useState(""),
    [verdictFor, setVerdictFor] = useState(""),
    [rating, setRating] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [busy, setBusy] = useState(false),
    [err, setErr] = useState(""),
    [saved, setSaved] = useState(false),
    [share, setShare] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setSaved(false);
    try {
      let photo: string | undefined;
      if (file) {
        const bytes = await compressPhoto(file);
        if (user) {
          const res = await fetch("/api/attempt-photo", {
            method: "POST",
            headers: { "Content-Type": "image/jpeg" },
            body: bytes,
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error || "تعذّر رفع الصورة.");
          photo = d.path;
        } else photo = await saveLocalPhoto(bytes);
      }
      addAttempt(
        slug,
        note ||
          JSON.parse(storageGet("wasafat-Doha:notes") || "{}")[slug] ||
          "",
        rating ? Number(rating) : undefined,
        photo,
        share,
        {
          actualMinutes: actual ? Number(actual) : undefined,
          hardest: hardest.trim() || undefined,
          verdict: (verdict || undefined) as
            | "worth"
            | "tasty-slow"
            | "fixed"
            | "skip"
            | undefined,
          verdictFor: verdictFor.trim() || undefined,
        },
      );
      setNote("");
      setActual("");
      setHardest("");
      setVerdict("");
      setVerdictFor("");
      setFile(null);
      setSaved(true);
      onDone?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر تسجيل التجربة.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="surface admin-form" onSubmit={submit}>
      <h2>جرّبتها؟ سجّل تجربتك</h2>
      <p>
        كل مرة ليها تاريخ وتعديلات خاصة بيها. تجاربك شخصية افتراضيًا ومش
        بتتنشر — المشاركة اختيارية بالكامل من اختيارك تحت.
      </p>
      <label htmlFor={`attempt-note-${slug}`}>إيه اللي فرق معاك؟</label>
      <textarea
        className="notes"
        id={`attempt-note-${slug}`}
        value={note}
        maxLength={4000}
        onChange={(e) => setNote(e.target.value)}
        placeholder="التعديل اللي عملته، واللي هتغيّره المرة الجاية…"
      />
      <label htmlFor={`rating-${slug}`}>تقييمك للتجربة (اختياري)</label>
      <select
        id={`rating-${slug}`}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        <option value="">بدون تقييم</option>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} من 5
          </option>
        ))}
      </select>
      <fieldset className="trial-fields">
        <legend>بطاقة تجربتك في مطبخك (اختياري — دي «الترند تحت التجربة»)</legend>
        <div className="scale-row">
          <label>
            الوقت الفعلي اللي خدته (دقيقة)
            <input
              type="number"
              min="1"
              max="10080"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="مثال: 45"
            />
          </label>
          <label>
            حكمك عليها
            <select value={verdict} onChange={(e) => setVerdict(e.target.value)}>
              <option value="">من غير حكم</option>
              <option value="worth">تستاهل الضجة</option>
              <option value="tasty-slow">حلوة بس تجهيزها طويل</option>
              <option value="fixed">نجحت بعد تعديل</option>
              <option value="skip">مش هكررها</option>
            </select>
          </label>
        </div>
        <label htmlFor={`hardest-${slug}`}>أصعب نقطة قابلتك</label>
        <input
          className="text-in"
          id={`hardest-${slug}`}
          value={hardest}
          maxLength={300}
          onChange={(e) => setHardest(e.target.value)}
          placeholder="مثال: العجينة كانت بتلزق"
        />
        <label htmlFor={`vfor-${slug}`}>ترشحها لمين؟</label>
        <input
          className="text-in"
          id={`vfor-${slug}`}
          value={verdictFor}
          maxLength={200}
          onChange={(e) => setVerdictFor(e.target.value)}
          placeholder="مثال: اللي بيحب الحلويات الباردة السريعة"
        />
      </fieldset>
      <label className="share-toggle" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={share}
          onChange={(e) => setShare(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: "var(--orange)" }}
        />
        شارك تجربتي في قسم «تجارب اللي جرّبوا» على صفحة الوصفة (على الجهاز ده،
        وبين أجهزتك لو داخل بحسابك)
      </label>
      <label htmlFor={`photo-${slug}`}>صورة النتيجة (اختيارية)</label>
      <input
        id={`photo-${slug}`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <p className="results-note">
        {user ? "الصورة خاصة بحسابك." : "صورة الضيف محفوظة على الجهاز ده بس."}
      </p>
      {err && (
        <p className="err-box" role="alert">
          {err} تقدر تشيل الصورة وتسجّل الملاحظة لوحدها.
        </p>
      )}
      {saved && (
        <p className="ok-box" role="status">
          اتضافت تجربة جديدة لدفترك.
        </p>
      )}
      <button className="btn btn-primary" disabled={busy}>
        {busy ? "بنحفظ التجربة…" : "سجّل تجربة جديدة"}
      </button>
    </form>
  );
}
async function compressPhoto(file: File): Promise<Blob> {
  if (file.size > 8 * 1024 * 1024) throw new Error("اختار صورة أقل من 8 ميجا.");
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    const ratio = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.76),
    );
    if (!blob || blob.size > 800000)
      throw new Error("الصورة كبيرة. جرّب صورة أصغر.");
    return blob;
  } finally {
    bitmap.close();
  }
}
