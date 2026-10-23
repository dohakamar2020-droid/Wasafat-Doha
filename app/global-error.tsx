"use client";
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          padding: 32,
          fontFamily: "system-ui",
          background: "#F8F5EE",
          color: "#34483D",
          lineHeight: 1.8,
        }}
      >
        <main style={{ maxWidth: 600, marginInline: "auto" }}>
          <h1>وصفات قمر</h1>
          <h2>المكتبة غير متاحة مؤقتًا</h2>
          <p>تعذّر تحميل المحتوى دلوقتي. جرّب مرة تانية بعد شوية.</p>
          <button
            onClick={reset}
            style={{
              padding: "12px 22px",
              border: 0,
              borderRadius: 24,
              background: "#34483D",
              color: "white",
              font: "inherit",
            }}
          >
            جرّب تاني
          </button>
        </main>
      </body>
    </html>
  );
}
