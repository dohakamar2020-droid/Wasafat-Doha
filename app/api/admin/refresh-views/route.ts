import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { videoSources, recipes as recipesT } from "@/lib/db/schema";
import { currentUser, isAdminUser } from "@/lib/auth";

/** تحديث مشاهدات يوتيوب من الـ API الرسمي (محتاج YOUTUBE_API_KEY) — بيحفظ تاريخ آخر تحديث. */
export async function POST() {
  const user = await currentUser();
  if (!user || !isAdminUser(user)) return NextResponse.json({ error: "للأدمن بس." }, { status: 403 });
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return NextResponse.json({ error: "حط YOUTUBE_API_KEY في إعدادات السيرفر عشان تحديث المشاهدات يشتغل. لحد دلوقتي الأرقام المعروضة هي أرقام المراجعة اليدوية مع تاريخ نشرها." }, { status: 501 });
  const db = getDb(); if (!db) return NextResponse.json({ error: "قاعدة البيانات مش مهيأة." }, { status: 503 });
  const rows = await db.select().from(videoSources);
  let updated = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${chunk.map((r) => r.ytId).join(",")}&key=${key}`);
    if (!res.ok) return NextResponse.json({ error: `YouTube API رد بـ ${res.status}` }, { status: 502 });
    const data = await res.json();
    for (const item of data.items || []) {
      const views = Number(item.statistics?.viewCount || 0);
      await db.update(videoSources).set({ views }).where(eq(videoSources.ytId, item.id));
      updated++;
    }
  }
  // إعادة تجميع إجمالي كل وصفة + ختم وقت التحديث
  const all = await db.select().from(videoSources);
  const bySlug = new Map<string, number>();
  all.forEach((s) => bySlug.set(s.recipeSlug, (bySlug.get(s.recipeSlug) || 0) + s.views));
  for (const [slug, views] of bySlug) await db.update(recipesT).set({ views, viewsUpdatedAt: new Date() }).where(eq(recipesT.slug, slug));
  return NextResponse.json({ ok: true, updated, at: new Date().toISOString() });
}
