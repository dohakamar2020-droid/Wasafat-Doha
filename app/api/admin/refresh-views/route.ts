import { revalidateTag, revalidatePath } from "next/cache";
import { sameOrigin, error } from "@/lib/http";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { videoSources, recipes as recipesT } from "@/lib/db/schema";
import { currentUser, isAdminUser } from "@/lib/auth";

/** تحديث مشاهدات يوتيوب من الـ API الرسمي (محتاج YOUTUBE_API_KEY) — بيحفظ تاريخ آخر تحديث. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const user = await currentUser();
  if (!user || !isAdminUser(user))
    return NextResponse.json({ error: "للأدمن بس." }, { status: 403 });
  const key = process.env.YOUTUBE_API_KEY;
  if (!key)
    return NextResponse.json(
      {
        error:
          "حط YOUTUBE_API_KEY في إعدادات السيرفر عشان تحديث المشاهدات يشتغل. لحد دلوقتي الأرقام المعروضة هي أرقام المراجعة اليدوية مع تاريخ نشرها.",
      },
      { status: 501 },
    );
  const db = getDb();
  if (!db)
    return NextResponse.json(
      { error: "قاعدة البيانات مش مهيأة." },
      { status: 503 },
    );
  const rows = await db.select().from(videoSources);
  let updated = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,status&id=${chunk.map((r) => r.ytId).join(",")}&key=${key}`,
    );
    if (!res.ok)
      return NextResponse.json(
        { error: `YouTube API رد بـ ${res.status}` },
        { status: 502 },
      );
    const data = await res.json();
    const returned = new Set(
      (data.items || []).map((item: { id: string }) => item.id),
    );
    for (const missing of chunk.filter((s) => !returned.has(s.ytId)))
      await db
        .update(videoSources)
        .set({ embeddable: false })
        .where(eq(videoSources.ytId, missing.ytId));
    for (const item of data.items || []) {
      const views = Number(item.statistics?.viewCount || 0);
      await db
        .update(videoSources)
        .set({ views, embeddable: item.status?.embeddable !== false })
        .where(eq(videoSources.ytId, item.id));
      updated++;
    }
  }
  // إعادة تجميع إجمالي كل وصفة + ختم وقت التحديث
  const all = await db.select().from(videoSources);
  const bySlug = new Map<string, number>();
  all.forEach((s) =>
    bySlug.set(s.recipeSlug, (bySlug.get(s.recipeSlug) || 0) + s.views),
  );
  for (const [slug, views] of bySlug) {
    const [row] = await db
      .select()
      .from(recipesT)
      .where(eq(recipesT.slug, slug));
    const sourceData = row.sourceData?.map((s) => {
      const latest = all.find((x) => x.ytId === s.ytId);
      return latest
        ? { ...s, views: latest.views, embeddable: latest.embeddable }
        : s;
    });
    await db
      .update(recipesT)
      .set({
        views,
        viewsUpdatedAt: new Date(),
        ...(sourceData ? { sourceData } : {}),
        version: row.version + 1,
      })
      .where(and(eq(recipesT.slug, slug), eq(recipesT.version, row.version)));
  }
  revalidateTag("catalog");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, updated, at: new Date().toISOString() });
}
