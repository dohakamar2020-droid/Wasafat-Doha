import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
export async function GET() {
  if (!dbConfigured()) return NextResponse.json({ configured: false, connected: false, note: "DATABASE_URL مش محطوط" });
  const db = getDb();
  if (!db) return NextResponse.json({ configured: true, connected: false });
  try { await db.execute(sql`select 1`); return NextResponse.json({ configured: true, connected: true }); }
  catch (e) { return NextResponse.json({ configured: true, connected: false, error: String((e as Error)?.message || e).slice(0, 200) }, { status: 502 }); }
}
