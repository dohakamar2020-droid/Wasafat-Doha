import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { authConfigured, hashPassword, createSession } from "@/lib/auth";
import { sameOrigin, jsonBody, error, allowRequest } from "@/lib/http";
const input = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(10).max(72),
});
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const db = getDb();
  if (!db || !authConfigured())
    return error("الحسابات غير متاحة مؤقتًا. تقدر تكمل وتحفظ على جهازك.", 503);
  try {
    if (!(await allowRequest(req, "register", 5)))
      return error("محاولات كتير. جرّب بعد ربع ساعة.", 429);
    const parsed = input.safeParse(await jsonBody(req, 4000));
    if (!parsed.success)
      return error("راجع الاسم والبريد، واختار كلمة سر من 10 إلى 72 حرف.");
    const { name, email, password } = parsed.data;
    const rows = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: await hashPassword(password),
        isAdmin: false,
      })
      .onConflictDoNothing({ target: users.email })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin,
      });
    if (!rows.length)
      return error("البريد مستخدم بالفعل. جرّب تسجيل الدخول.", 409);
    await createSession(rows[0].id);
    return NextResponse.json(
      { user: rows[0] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("تعذّر إنشاء الحساب دلوقتي. جرّب تاني.", 503);
  }
}
