import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users } from "./db/schema";
export const SESSION_COOKIE = "wq_session";
export const authConfigured = () =>
  !!process.env.AUTH_SECRET &&
  process.env.AUTH_SECRET.length >= 32 &&
  !/change-me|dev-secret/i.test(process.env.AUTH_SECRET);
function secret() {
  if (!authConfigured())
    throw new Error(
      "AUTH_SECRET must be a random secret of at least 32 characters",
    );
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}
export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}
export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("wasafat-qamar")
    .setAudience("kitchen")
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 2592000,
    secure: process.env.NODE_ENV === "production",
  });
}
export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};
export async function currentUser(): Promise<SafeUser | null> {
  const db = getDb();
  if (!db || !authConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
      issuer: "wasafat-qamar",
      audience: "kitchen",
    });
    if (!payload.sub) return null;
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);
    return rows[0] || null;
  } catch {
    return null;
  }
}
// Admin rights are assigned explicitly by the owner, never by an unverified email address.
export const isAdminUser = (u: SafeUser | null) => !!u?.isAdmin;
