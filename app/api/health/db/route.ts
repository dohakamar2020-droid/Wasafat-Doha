import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { authConfigured } from "@/lib/auth";
export async function GET() {
  const configured = dbConfigured();
  let connected = false,
    schemaReady = false;
  try {
    const db = getDb();
    if (configured && db) {
      await db.execute(sql`select 1`);
      connected = true;
      await db.execute(sql`select 1 from recipes limit 1`);
      await db.execute(sql`select 1 from kitchen_documents limit 1`);
      await db.execute(sql`select 1 from contact_reports limit 1`);
      schemaReady = true;
    }
  } catch {}
  return NextResponse.json(
    {
      configured,
      connected,
      schemaReady,
      accounts: connected && schemaReady && authConfigured(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
