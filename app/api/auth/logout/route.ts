import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { sameOrigin, error } from "@/lib/http";
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  await destroySession();
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
