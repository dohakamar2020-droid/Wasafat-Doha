"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="wrap">
      <div className="empty">
        <h1>المكتبة غير متاحة مؤقتًا</h1>
        <p>تعذّر تحميل المحتوى. جرّب مرة تانية بعد شوية.</p>
        <button className="btn btn-primary" onClick={reset}>
          جرّب تاني
        </button>
      </div>
    </div>
  );
}
