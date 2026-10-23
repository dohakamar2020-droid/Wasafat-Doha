import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { readCatalog } from "@/lib/catalog";
import { contentSchema } from "@/lib/content-schema";
import { sameOrigin, jsonBody, error } from "@/lib/http";
import { recipes, videoSources } from "@/lib/db/schema";
export async function GET(req: Request) {
  const g = await requireAdmin();
  if (g.response) return g.response;
  const slug = new URL(req.url).searchParams.get("slug") || "";
  try {
    const [r] = await g
      .db!.select()
      .from(recipes)
      .where(eq(recipes.slug, slug));
    if (!r) return error("الوصفة غير موجودة.", 404);
    const sources = await g
      .db!.select()
      .from(videoSources)
      .where(eq(videoSources.recipeSlug, slug));
    const stored = r.sourceData || [];
    return NextResponse.json(
      {
        ...r,
        sources: [
          ...stored,
          ...sources
            .filter((s) => !stored.some((x) => x.ytId === s.ytId))
            .map((s) => ({
              ytId: s.ytId,
              kind: s.kind,
              published: s.published,
              views: s.views,
              sourceNo: s.sourceNo || 0,
              embeddable: s.embeddable,
            })),
        ],
        detail:
          r.detail ||
          (r.status === "reviewed"
            ? (await readCatalog(g.db)).find((x) => x.slug === slug)?.detail
            : null) ||
          null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("تعذّر تحميل الوصفة.", 503);
  }
}
export async function PUT(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const g = await requireAdmin();
  if (g.response) return g.response;
  try {
    const p = contentSchema.safeParse(await jsonBody(req, 150000));
    if (!p.success)
      return error(
        `راجع بيانات المحتوى: ${p.error.issues
          .slice(0, 3)
          .map((i) => i.path.join("."))
          .join("، ")}`,
      );
    const v = p.data;
    const claims = await g
      .db!.select()
      .from(videoSources)
      .where(eq(videoSources.recipeSlug, v.slug));
    if (v.sources.some((s) => !claims.some((c) => c.ytId === s.ytId)))
      return error("ضيف أي فيديو جديد من نموذج المصادر أولًا قبل نشره.");
    if (
      v.stage === "published" &&
      (!v.mainIngredients.length || v.why.includes("مصدر وارد"))
    )
      return error("أكمل المكونات الأساسية وسبب الاختيار قبل النشر.");
    const total = v.sources.reduce((n, s) => n + s.views, 0);
    if (total > 2147483647)
      return error("إجمالي المشاهدات أكبر من الحد المدعوم.");
    const rows = await g
      .db!.update(recipes)
      .set({
        title: v.title,
        creatorId: v.creatorId,
        category: v.category,
        mainIngredients: v.mainIngredients,
        textures: v.textures,
        needs: v.needs,
        why: v.why,
        editorsPick: v.editorsPick,
        stage: v.stage,
        detail: v.detail,
        sourceData: v.sources,
        totalMinutes: v.totalMinutes,
        testedNote: v.testedNote,
        status: v.detail ? "reviewed" : "video",
        views: total,
        version: v.version + 1,
      })
      .where(and(eq(recipes.slug, v.slug), eq(recipes.version, v.version)))
      .returning({ version: recipes.version });
    if (!rows.length)
      return error(
        "المحتوى اتعدل في نافذة تانية. حمّل أحدث نسخة قبل الحفظ.",
        409,
      );
    revalidateTag("catalog");
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, version: rows[0].version });
  } catch {
    return error("لم يتم حفظ التغييرات. جرّب تاني.", 503);
  }
}
