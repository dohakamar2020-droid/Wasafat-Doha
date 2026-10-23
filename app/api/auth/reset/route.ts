import { createHash } from "node:crypto";
import { z } from "zod";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, passwordResets } from "@/lib/db/schema";
import { authConfigured, hashPassword } from "@/lib/auth";
import { sameOrigin, jsonBody, error, allowRequest } from "@/lib/http";
import { NextResponse } from "next/server";

const input = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  password: z.string().min(10).max(72),
});

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const db = getDb();
  if (!db || !authConfigured())
    return error("الحسابات غير متاحة مؤقتًا.", 503);
  try {
    if (!(await allowRequest(req, "reset", 8)))
      return error("محاولات كتير. جرّب بعد ربع ساعة.", 429);
    const parsed = input.safeParse(await jsonBody(req, 2000));
    if (!parsed.success)
      return error("الرابط غير صالح أو كلمة السر قصيرة (10 حروف على الأقل).");
    const tokenHash = createHash("sha256")
      .update(parsed.data.token)
      .digest("hex");
    const [row] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.tokenHash, tokenHash),
          isNull(passwordResets.usedAt),
          gt(passwordResets.expiresAt, new Date()),
        ),
      )
      .limit(1);
    if (!row)
      return error("الرابط انتهى أو اتستخدم قبل كده. اطلب رابط جديد.", 400);
    await db
      .update(users)
      .set({ passwordHash: await hashPassword(parsed.data.password) })
      .where(eq(users.id, row.userId));
    await db
      .update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.id, row.id));
    return NextResponse.json(
      { ok: true, message: "اتغيّرت كلمة السر. سجّل دخولك بيها." },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("حصلت مشكلة. جرّب مرة تانية.", 500);
  }
}
