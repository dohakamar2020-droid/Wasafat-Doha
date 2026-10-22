import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "قاعدة البيانات مش مهيأة على السيرفر ده لسه (DATABASE_URL)." }, { status: 503 });
  const { name, email, password } = await req.json().catch(() => ({}));
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || "") || (password || "").length < 6)
    return NextResponse.json({ error: "اكتب اسم وبريد صحيح وكلمة سر 6 حروف على الأقل." }, { status: 400 });
  const cleanEmail = String(email).trim().toLowerCase();
  const exists = await db.select({ id: users.id }).from(users).where(eq(users.email, cleanEmail)).limit(1);
  if (exists.length) return NextResponse.json({ error: "البريد ده مسجل قبل كده — جرّب تسجيل الدخول." }, { status: 409 });
  const rows = await db.insert(users).values({ name: String(name).trim(), email: cleanEmail, passwordHash: await hashPassword(password) }).returning({ id: users.id, name: users.name, email: users.email, isAdmin: users.isAdmin });
  await createSession(rows[0].id);
  return NextResponse.json({ user: rows[0] });
}
