import { NextResponse } from "next/server";
import { count, desc, eq, sql, and, isNull } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { sameOrigin, jsonBody, error } from "@/lib/http";
import { recipes, videoSources } from "@/lib/db/schema";
const input = z.object({
  ytId: z.string().regex(/^[\w-]{11}$/),
  title: z.string().trim().min(3).max(200),
  creatorId: z.enum(["nadia", "heba", "abeer", "omar", "abujulia"]),
  kind: z.enum(["video", "short"]),
  published: z.string().regex(/^(0[1-9]|1[0-2])\/20\d{2}$/),
  slug: z
    .string()
    .regex(/^[a-z0-9-]{1,100}$/)
    .optional(),
});
export async function GET() {
  const g = await requireAdmin();
  if (g.response) return g.response;
  try {
    const [[rc], [sc], items] = await Promise.all([
      g.db!.select({ n: count() }).from(recipes),
      g.db!.select({ n: count() }).from(videoSources),
      g.db!.select().from(recipes).orderBy(desc(recipes.createdAt)),
    ]);
    return NextResponse.json(
      { recipes: rc.n, sources: sc.n, items },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error(
      "تعذّر تحميل المكتبة. تأكد إن ترحيلات قاعدة البيانات اتطبقت.",
      503,
    );
  }
}
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const g = await requireAdmin();
  if (g.response) return g.response;
  try {
    const p = input.safeParse(await jsonBody(req, 8000));
    if (!p.success) return error("راجع الرابط، الشيف، العنوان وشهر النشر.");
    const v = p.data;
    const [dup] = await g
      .db!.select()
      .from(videoSources)
      .where(eq(videoSources.ytId, v.ytId));
    if (dup) return error(`الفيديو موجود في وصفة ${dup.recipeSlug}.`, 409);
    const slug =
      v.slug || `imported-${v.ytId.toLowerCase().replace(/_/g, "-")}`;
    const [existing] = await g
      .db!.select()
      .from(recipes)
      .where(eq(recipes.slug, slug));
    if (existing) {
      if (existing.creatorId !== v.creatorId)
        return error("الشيف لا يطابق صاحب الوصفة الحالية.");
      if (!existing.sourceData) {
        const old = await g
          .db!.select()
          .from(videoSources)
          .where(eq(videoSources.recipeSlug, slug));
        await g
          .db!.update(recipes)
          .set({
            sourceData: old.map((s) => ({
              ytId: s.ytId,
              kind: s.kind as "short" | "video",
              published: s.published,
              views: s.views,
              sourceNo: s.sourceNo || 0,
              embeddable: s.embeddable,
            })),
          })
          .where(and(eq(recipes.slug, slug), isNull(recipes.sourceData)));
      }
    } else {
      await g
        .db!.insert(recipes)
        .values({
          slug,
          title: v.title,
          creatorId: v.creatorId,
          category: "أطباق رئيسية",
          why: "مصدر وارد — يحتاج مراجعة السبب التحريري والمقادير قبل النشر.",
          stage: "draft",
        })
        .onConflictDoNothing();
    }
    const inserted = await g
      .db!.insert(videoSources)
      .values({
        recipeSlug: slug,
        ytId: v.ytId,
        kind: v.kind,
        published: v.published,
        views: 0,
        embeddable: true,
      })
      .onConflictDoNothing()
      .returning({ id: videoSources.id });
    if (!inserted.length)
      return error("الفيديو اتضاف بالفعل. حدّث القائمة.", 409);
    await g
      .db!.update(recipes)
      .set({ version: sql`${recipes.version}+1` })
      .where(eq(recipes.slug, slug));
    revalidateTag("catalog");
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, recipeSlug: slug });
  } catch {
    return error("تعذّرت الإضافة. راجع البيانات والاتصال.", 503);
  }
}
