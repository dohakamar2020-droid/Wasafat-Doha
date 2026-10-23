import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const runtime = "nodejs";
export const alt = "وصفات قمر — وصفات تستاهل التجربة";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const font = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/alexandria/files/alexandria-arabic-700-normal.woff",
    ),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#F8F5EE",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        border: "24px solid #34483D",
        fontFamily: "Alexandria",
      }}
    >
      <div
        style={{
          fontSize: 94,
          color: "#34483D",
          display: "flex",
          flexDirection: "row-reverse",
          gap: 26,
        }}
      >
        <span>وصفات</span>
        <span>قمر</span>
      </div>
      <div
        style={{
          fontSize: 42,
          color: "#C9653F",
          display: "flex",
          flexDirection: "row-reverse",
          gap: 18,
          marginTop: 26,
        }}
      >
        <span>وصفات</span>
        <span>تستاهل</span>
        <span>التجربة</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Alexandria", data: font, weight: 700, style: "normal" }],
    },
  );
}
