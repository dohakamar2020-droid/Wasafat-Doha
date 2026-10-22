import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users } from "./db/schema";

export const SESSION_COOKIE = "wq_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "wasafat-Doha-dev-secret");

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10); }
export async function verifyPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(secret());
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "production" });
}
export async function destroySession() { const store = await cookies(); store.delete(SESSION_COOKIE); }

export type SafeUser = { id: string; name: string; email: string; isAdmin: boolean };
export async function currentUser(): Promise<SafeUser | null> {
  const db = getDb(); if (!db) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value; if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const rows = await db.select({ id: users.id, name: users.name, email: users.email, isAdmin: users.isAdmin }).from(users).where(eq(users.id, payload.sub)).limit(1);
    return rows[0] || null;
  } catch { return null; }
}
export const isAdminUser = (u: SafeUser | null) => !!u && (u.isAdmin || (!!process.env.ADMIN_EMAIL && u.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()));
