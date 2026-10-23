import { NextResponse } from "next/server";
import { currentUser, authConfigured } from "@/lib/auth";
import { getDb } from "@/lib/db";
export async function GET() {
  return NextResponse.json(
    { user: await currentUser(), available: !!getDb() && authConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
