import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import {
  kitchenDocuments,
  savedRecipes,
  recipeNotes,
  shoppingItems,
  cookAttempts,
} from "@/lib/db/schema";
import { currentUser } from "@/lib/auth";
import { emptyKitchen, kitchenSchema } from "@/lib/kitchen-state";
import { sameOrigin, jsonBody, error } from "@/lib/http";
async function documentFor(userId: string) {
  const db = getDb()!;
  let [row] = await db
    .select()
    .from(kitchenDocuments)
    .where(eq(kitchenDocuments.userId, userId));
  if (row) return row;
  const [saved, notes, shopping, attempts] = await Promise.all([
    db.select().from(savedRecipes).where(eq(savedRecipes.userId, userId)),
    db.select().from(recipeNotes).where(eq(recipeNotes.userId, userId)),
    db.select().from(shoppingItems).where(eq(shoppingItems.userId, userId)),
    db.select().from(cookAttempts).where(eq(cookAttempts.userId, userId)),
  ]);
  const state = {
    ...emptyKitchen(),
    saved: saved.filter((r) => r.kind === "saved").map((r) => r.recipeSlug),
    planned: saved.filter((r) => r.kind === "planned").map((r) => r.recipeSlug),
    done: [...new Set(attempts.map((a) => a.recipeSlug))],
    shopping: shopping.map((r) => r.label),
    shoppingChecked: shopping.filter((r) => r.checked).map((r) => r.label),
    notes: Object.fromEntries(notes.map((r) => [r.recipeSlug, r.note])),
    attempts: attempts.map((a) => ({
      id: crypto.randomUUID(),
      slug: a.recipeSlug,
      note: a.note || "",
      at: a.createdAt.toISOString(),
    })),
  };
  await db
    .insert(kitchenDocuments)
    .values({ userId, state, revision: 0 })
    .onConflictDoNothing();
  [row] = await db
    .select()
    .from(kitchenDocuments)
    .where(eq(kitchenDocuments.userId, userId));
  return row;
}
export async function GET() {
  const user = await currentUser();
  if (!user) return error("سجّل دخول الأول.", 401);
  try {
    const d = await documentFor(user.id);
    return NextResponse.json(
      { state: d.state, revision: d.revision },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("تعذّر تحميل مطبخك. بيانات الجهاز لسه محفوظة.", 503);
  }
}
export async function PUT(req: Request) {
  if (!sameOrigin(req)) return error("الطلب غير مسموح.", 403);
  const user = await currentUser();
  if (!user) return error("سجّل دخول الأول.", 401);
  try {
    const p = z
      .object({
        state: kitchenSchema,
        revision: z.number().int().nonnegative(),
      })
      .safeParse(await jsonBody(req, 1000000));
    if (!p.success) return error("بيانات غير صحيحة.");
    await documentFor(user.id);
    const rows = await getDb()!
      .update(kitchenDocuments)
      .set({
        state: p.data.state,
        revision: p.data.revision + 1,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(kitchenDocuments.userId, user.id),
          eq(kitchenDocuments.revision, p.data.revision),
        ),
      )
      .returning({ revision: kitchenDocuments.revision });
    if (!rows.length)
      return error(
        "مطبخك اتعدل من جهاز تاني. اختار النسخة اللي تحب تحتفظ بيها.",
        409,
      );
    return NextResponse.json(
      { revision: rows[0].revision },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("الحفظ السحابي تعذّر. تغييراتك محفوظة على الجهاز.", 503);
  }
}
