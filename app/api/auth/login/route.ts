import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "قاعدة البيانات مش مهيأة على السيرفر ده لسه (DATABASE_URL)." }, { status: 503 });
  const { email, password } = await req.json().catch(() => ({}));
  const cleanEmail = String(email || "").trim().toLowerCase();
  const rows = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
  if (!rows.length || !(await verifyPassword(password || "", rows[0].passwordHash)))
    return NextResponse.json({ error: "البريد أو كلمة السر مش مظبوطين." }, { status: 401 });
  await createSession(rows[0].id);
  const { passwordHash: _ph, ...user } = rows[0];
  return NextResponse.json({ user });
}
