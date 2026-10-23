import { put, get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { sameOrigin, error, allowRequest } from "@/lib/http";
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const u = await currentUser();
  if (!u) return error("سجّل دخول الأول.", 401);
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return error(
      "حفظ الصور في الحساب غير متاح دلوقتي. جرّب تسجيل التجربة بدون صورة.",
      503,
    );
  try {
    if (!(await allowRequest(req, `photo:${u.id}`, 20, 60)))
      return error("وصلت لحد الصور اليومي المؤقت. جرّب لاحقًا.", 429);
    if (
      req.headers.get("content-type") !== "image/jpeg" ||
      Number(req.headers.get("content-length") || 0) > 800000
    )
      return error("صيغة الصورة أو حجمها غير مناسب.");
    const bytes = Buffer.from(await req.arrayBuffer());
    if (
      bytes.length > 800000 ||
      bytes[0] !== 255 ||
      bytes[1] !== 216 ||
      bytes[2] !== 255
    )
      return error("الصورة غير صالحة.");
    const path = `attempts/${u.id}/${crypto.randomUUID()}.jpg`;
    await put(path, bytes, {
      access: "private",
      contentType: "image/jpeg",
      addRandomSuffix: false,
    });
    return NextResponse.json({ path });
  } catch {
    return error("تعذّر حفظ الصورة. جرّب تاني.", 503);
  }
}
export async function GET(req: Request) {
  const u = await currentUser();
  if (!u) return error("غير مسموح.", 401);
  const path = new URL(req.url).searchParams.get("path") || "";
  if (!new RegExp(`^attempts/${u.id}/[a-f0-9-]{36}\\.jpg$`).test(path))
    return error("الصورة غير موجودة.", 404);
  try {
    const blob = await get(path, { access: "private", useCache: false });
    if (!blob || blob.statusCode !== 200)
      return error("الصورة غير موجودة.", 404);
    return new Response(blob.stream, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return error("الصورة غير متاحة مؤقتًا.", 503);
  }
}
