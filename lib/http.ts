import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { sql, lt } from "drizzle-orm";
import { getDb } from "./db";
import { rateLimits } from "./db/schema";
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return (
      new URL(origin).host ===
      (req.headers.get("host") || new URL(req.url).host)
    );
  } catch {
    return false;
  }
}
export async function jsonBody(req: Request, max = 150000) {
  if (Number(req.headers.get("content-length") || 0) > max)
    throw new Error("TOO_LARGE");
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > max) throw new Error("TOO_LARGE");
  return JSON.parse(raw);
}
export function error(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export async function allowRequest(
  req: Request,
  action: string,
  limit = 8,
  minutes = 15,
) {
  const db = getDb();
  if (!db) return false;
  const identity =
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local";
  await db
    .delete(rateLimits)
    .where(lt(rateLimits.resetsAt, new Date(Date.now() - 86400000)));
  const bucket = Math.floor(Date.now() / (minutes * 60000));
  const key = createHash("sha256")
    .update(`${action}:${identity}:${bucket}:${process.env.AUTH_SECRET || ""}`)
    .digest("hex");
  const rows = await db
    .insert(rateLimits)
    .values({
      key,
      count: 1,
      resetsAt: new Date((bucket + 1) * minutes * 60000),
    })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: { count: sql`${rateLimits.count}+1` },
      setWhere: sql`${rateLimits.count}<${limit}`,
    })
    .returning({ count: rateLimits.count });
  return !!rows.length;
}
