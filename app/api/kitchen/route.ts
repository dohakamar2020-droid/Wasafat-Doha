import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { savedRecipes, recipeNotes, shoppingItems, cookAttempts } from "@/lib/db/schema";
import { currentUser } from "@/lib/auth";

export type KitchenState = {
  saved: string[]; planned: string[]; done: string[];
  shopping: string[]; shoppingChecked: string[];
  notes: Record<string, string>;
};

async function loadState(userId: string): Promise<KitchenState> {
  const db = getDb()!;
  const savedRows = await db.select().from(savedRecipes).where(eq(savedRecipes.userId, userId));
  const noteRows = await db.select().from(recipeNotes).where(eq(recipeNotes.userId, userId));
  const shopRows = await db.select().from(shoppingItems).where(eq(shoppingItems.userId, userId)).orderBy(shoppingItems.id);
  const attemptRows = await db.select().from(cookAttempts).where(eq(cookAttempts.userId, userId)).orderBy(desc(cookAttempts.createdAt));
  return {
    saved: savedRows.filter((r) => r.kind === "saved").map((r) => r.recipeSlug),
    planned: savedRows.filter((r) => r.kind === "planned").map((r) => r.recipeSlug),
    done: [...new Set(attemptRows.map((r) => r.recipeSlug))],
    shopping: shopRows.map((r) => r.label),
    shoppingChecked: shopRows.filter((r) => r.checked).map((r) => r.label),
    notes: Object.fromEntries(noteRows.filter((r) => r.note.trim()).map((r) => [r.recipeSlug, r.note])),
  };
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول." }, { status: 401 });
  if (!getDb()) return NextResponse.json({ error: "قاعدة البيانات مش مهيأة." }, { status: 503 });
  return NextResponse.json({ state: await loadState(user.id) });
}

/** حفظ حالة مطبخي كاملة (الحفظ/الخطط/المشتريات/الملاحظات/التجارب) — بتستبدل حالة الحساب. */
export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "قاعدة البيانات مش مهيأة." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as KitchenState | null;
  if (!body) return NextResponse.json({ error: "بيانات غير صحيحة." }, { status: 400 });

  await db.delete(savedRecipes).where(eq(savedRecipes.userId, user.id));
  const savedRows = [
    ...(body.saved || []).map((recipeSlug) => ({ userId: user.id, recipeSlug, kind: "saved" })),
    ...(body.planned || []).map((recipeSlug) => ({ userId: user.id, recipeSlug, kind: "planned" })),
  ];
  if (savedRows.length) await db.insert(savedRecipes).values(savedRows).onConflictDoNothing();

  await db.delete(recipeNotes).where(eq(recipeNotes.userId, user.id));
  const noteRows = Object.entries(body.notes || {}).filter(([, v]) => v?.trim()).map(([recipeSlug, note]) => ({ userId: user.id, recipeSlug, note }));
  if (noteRows.length) await db.insert(recipeNotes).values(noteRows);

  const checkedSet = new Set(body.shoppingChecked || []);
  await db.delete(shoppingItems).where(eq(shoppingItems.userId, user.id));
  const shopRows = [...new Set(body.shopping || [])].map((label) => ({ userId: user.id, label, checked: checkedSet.has(label) }));
  if (shopRows.length) await db.insert(shoppingItems).values(shopRows);

  // التجارب: بنحتفظ بسجل محاولات — الجديد بس هو اللي يضاف (من غير تكرار الموجود في نفس اليوم)
  const existing = await db.select().from(cookAttempts).where(eq(cookAttempts.userId, user.id));
  const existingSlugs = new Set(existing.map((r) => r.recipeSlug));
  for (const slug of body.done || []) {
    if (!existingSlugs.has(slug)) await db.insert(cookAttempts).values({ userId: user.id, recipeSlug: slug, note: body.notes?.[slug] || null });
  }
  return NextResponse.json({ state: await loadState(user.id) });
}
