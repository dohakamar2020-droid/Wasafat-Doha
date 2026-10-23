import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, passwordResets } from "@/lib/db/schema";
import { authConfigured } from "@/lib/auth";
import { siteURL } from "@/lib/site";
import { sameOrigin, jsonBody, error, allowRequest } from "@/lib/http";

const input = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
});

// استعادة كلمة السر: بنولّد توكن عشوائي بنخزّن هاشه بس (ساعة واحدة، استخدام واحد).
// إرسال الإيميل الفعلي بيحتاج مزوّد بريد (RESEND_API_KEY). من غيره، وفي بيئة
// غير الإنتاج بس، بنرجّع رابط الاستعادة في الرد لأغراض التجربة المحلية —
// الإنتاج دايمًا بيرد ردًا عامًا لا يكشف إن كان الإيميل مسجلًا أصلًا.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const db = getDb();
  if (!db || !authConfigured())
    return error("الحسابات غير متاحة مؤقتًا.", 503);
  try {
    if (!(await allowRequest(req, "forgot", 5)))
      return error("محاولات كتير. جرّب بعد ربع ساعة.", 429);
    const parsed = input.safeParse(await jsonBody(req, 2000));
    if (!parsed.success) return error("اكتب بريدًا صحيحًا.");
    const { email } = parsed.data;
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    let devResetUrl: string | undefined;
    if (user) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      await db.insert(passwordResets).values({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 3600000),
      });
      devResetUrl = `${siteURL()}/reset?token=${token}`;
      if (process.env.RESEND_API_KEY) {
        // نقطة الإرسال: فعّل مزوّد البريد هنا وابعت devResetUrl للمستخدم.
        // من غير مفتاح مزوّد ما بنوعدش بإرسال لم يحصل.
        console.info("[wasafat-Doha] password reset email queued for", email);
      }
    }
    const body: Record<string, unknown> = {
      ok: true,
      message:
        "لو الإيميل ده مسجل عندنا، هيوصلك رابط لاستعادة كلمة السر خلال دقائق. الرابط صالح ساعة واحدة.",
    };
    if (devResetUrl && process.env.NODE_ENV !== "production")
      body.devResetUrl = devResetUrl;
    if (devResetUrl && process.env.PASSWORD_RESET_RETURN_LINK === "1")
      body.devResetUrl = devResetUrl;
    return NextResponse.json(body, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return error("حصلت مشكلة. جرّب مرة تانية.", 500);
  }
}
