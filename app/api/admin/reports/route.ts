import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { contactReports } from "@/lib/db/schema";
import { sameOrigin, jsonBody, error } from "@/lib/http";
export async function GET() {
  const g = await requireAdmin();
  if (g.response) return g.response;
  try {
    return NextResponse.json(
      {
        items: await g
          .db!.select()
          .from(contactReports)
          .orderBy(desc(contactReports.createdAt))
          .limit(100),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("تعذّر تحميل البلاغات.", 503);
  }
}
export async function PATCH(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const g = await requireAdmin();
  if (g.response) return g.response;
  try {
    const p = z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewing", "resolved"]),
      })
      .safeParse(await jsonBody(req, 1000));
    if (!p.success) return error("حالة غير صحيحة.");
    await g
      .db!.update(contactReports)
      .set({ status: p.data.status })
      .where(eq(contactReports.id, p.data.id));
    return NextResponse.json({ ok: true });
  } catch {
    return error("تعذّر تحديث البلاغ.", 503);
  }
}
