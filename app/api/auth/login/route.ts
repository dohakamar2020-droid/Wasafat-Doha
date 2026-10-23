import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { authConfigured, verifyPassword, createSession } from "@/lib/auth";
import { sameOrigin, jsonBody, error, allowRequest } from "@/lib/http";
const input = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(72),
});
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const db = getDb();
  if (!db || !authConfigured())
    return error("الحسابات غير متاحة مؤقتًا. تقدر تكمل كضيف.", 503);
  try {
    if (!(await allowRequest(req, "login", 10)))
      return error("محاولات كتير. جرّب بعد ربع ساعة.", 429);
    const parsed = input.safeParse(await jsonBody(req, 4000));
    if (!parsed.success) return error("البريد أو كلمة السر مش مظبوطين.", 401);
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);
    const fallback =
      "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW";
    const valid = await verifyPassword(
      parsed.data.password,
      rows[0]?.passwordHash || fallback,
    );
    if (!rows.length || !valid)
      return error("البريد أو كلمة السر مش مظبوطين.", 401);
    const r = rows[0];
    await createSession(r.id);
    return NextResponse.json(
      { user: { id: r.id, name: r.name, email: r.email, isAdmin: r.isAdmin } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("تعذّر تسجيل الدخول دلوقتي.", 503);
  }
}
