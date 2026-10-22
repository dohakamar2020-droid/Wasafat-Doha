import { NextResponse } from "next/server";
import { eq, count } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { recipes as recipesT, videoSources, creators as creatorsT } from "@/lib/db/schema";
import { currentUser, isAdminUser } from "@/lib/auth";
import { creators, recipes } from "@/lib/data";

async function guard() {
  const user = await currentUser();
  if (!user) return { error: NextResponse.json({ error: "سجل دخول الأول." }, { status: 401 }) };
  if (!isAdminUser(user)) return { error: NextResponse.json({ error: "الصفحة دي للأدمن بس (ADMIN_EMAIL)." }, { status: 403 }) };
  const db = getDb();
  if (!db) return { error: NextResponse.json({ error: "قاعدة البيانات مش مهيأة." }, { status: 503 }) };
  return { db };
}

export async function GET() {
  const g = await guard(); if ("error" in g) return g.error;
  const db = g.db!;
  const [rc] = await db.select({ n: count() }).from(recipesT);
  const [sc] = await db.select({ n: count() }).from(videoSources);
  const [cc] = await db.select({ n: count() }).from(creatorsT);
  const rows = await db.select().from(videoSources).orderBy(videoSources.id);
  return NextResponse.json({ recipes: rc.n, sources: sc.n, creators: cc.n, items: rows.slice(-30).reverse() });
}

/** إضافة مصدر فيديو: بيكشف التكرار بالـ ytId، ويربطه بوصفة موجودة بنفس الـ slug أو ينشئ وصفة «وارد» جديدة. */
export async function POST(req: Request) {
  const g = await guard(); if ("error" in g) return g.error;
  const db = g.db!;
  const { ytId, title, creatorId, kind, slug } = await req.json().catch(() => ({}));
  if (!ytId || !/^[\w-]{6,}$/.test(String(ytId))) return NextResponse.json({ error: "معرف فيديو غير صحيح." }, { status: 400 });
  const dup = await db.select().from(videoSources).where(eq(videoSources.ytId, String(ytId))).limit(1);
  if (dup.length) {
    const r = await db.select().from(recipesT).where(eq(recipesT.slug, dup[0].recipeSlug)).limit(1);
    return NextResponse.json({ error: `الرابط ده موجود بالفعل — مرتبط بوصفة «${r[0]?.title || dup[0].recipeSlug}». التكرار اتكشف قبل أي إضافة.` }, { status: 409 });
  }
  const creator = creators.find((c) => c.id === creatorId) || creators[0];
  const recipeSlug = String(slug || `imported-${String(ytId).toLowerCase()}`).replace(/[^\w-]/g, "-");
  const existingRecipe = await db.select().from(recipesT).where(eq(recipesT.slug, recipeSlug)).limit(1);
  if (!existingRecipe.length) {
    const local = recipes.find((r) => r.slug === recipeSlug);
    await db.insert(recipesT).values({
      slug: recipeSlug, title: local?.title || String(title || "وصفة واردة — قيد المراجعة"),
      creatorId: creator.id, category: local?.category || "أطباق رئيسية",
      mainIngredients: local?.mainIngredients || [], textures: local?.textures || [], needs: local?.needs || [],
      why: local?.why || "أُضيفت من لوحة الإدارة وحالتها: وارد — قيد المراجعة التحريرية.",
      editorsPick: false, status: "video", views: 0,
    });
  }
  await db.insert(videoSources).values({ recipeSlug, ytId: String(ytId), kind: kind === "short" ? "short" : "video", published: new Date().toISOString().slice(0, 7).split("-").reverse().join("/"), views: 0 });
  return NextResponse.json({ ok: true, recipeSlug, stage: "وارد — قيد المراجعة" });
}
