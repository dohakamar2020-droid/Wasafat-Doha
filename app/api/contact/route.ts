import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { contactReports } from "@/lib/db/schema";
import { sameOrigin, jsonBody, error, allowRequest } from "@/lib/http";
const input = z.object({
  message: z.string().trim().min(10).max(4000),
  recipeSlug: z
    .string()
    .regex(/^[a-z0-9-]{1,100}$/)
    .optional(),
  website: z.string().max(0).optional(),
});
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const db = getDb();
  if (!db)
    return error(
      "استقبال الرسائل غير متاح دلوقتي. رسالتك لسه موجودة هنا؛ جرّب إرسالها لاحقًا.",
      503,
    );
  try {
    if (!(await allowRequest(req, "contact", 5, 60)))
      return error("وصلت لحد الرسائل. جرّب بعد ساعة.", 429);
    const p = input.safeParse(await jsonBody(req, 8000));
    if (!p.success) return error("اكتب رسالة من 10 إلى 4000 حرف.");
    const [r] = await db
      .insert(contactReports)
      .values({ message: p.data.message, recipeSlug: p.data.recipeSlug })
      .returning({ id: contactReports.id });
    return NextResponse.json({ id: r.id });
  } catch {
    return error("الرسالة لم تُرسل. جرّب مرة تانية.", 503);
  }
}
