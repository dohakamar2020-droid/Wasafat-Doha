import { test } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { readFile, readdir } from "node:fs/promises";
import { and, eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { emptyKitchen } from "../lib/kitchen-state";

test("Postgres migrations, published catalog, atomic kitchen revision and private report storage", async () => {
  const pg = new PGlite();
  const db = drizzle(pg, { schema });
  try {
    for (const file of (await readdir("drizzle"))
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      const text = await readFile(`drizzle/${file}`, "utf8");
      for (const statement of text.split("--> statement-breakpoint"))
        if (statement.trim()) await pg.exec(statement);
    }
    await db
      .insert(schema.creators)
      .values({
        id: "nadia",
        name: "نادية السيد",
        style: "x",
        tagline: "x",
        channelHint: "x",
      });
    await db
      .insert(schema.recipes)
      .values({
        slug: "draft",
        title: "draft",
        creatorId: "nadia",
        category: "x",
        why: "x",
        stage: "draft",
      });
    await db
      .insert(schema.recipes)
      .values({
        slug: "public",
        title: "public",
        creatorId: "nadia",
        category: "x",
        why: "x",
        stage: "published",
      });
    const publicRows = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.stage, "published"));
    assert.equal(publicRows.length, 1);
    assert.equal(publicRows[0].slug, "public");
    const [u] = await db
      .insert(schema.users)
      .values({
        name: "QA",
        email: "qa@example.test",
        passwordHash: "not-a-password",
      })
      .returning();
    assert.equal(u.isAdmin, false);
    await db
      .insert(schema.kitchenDocuments)
      .values({ userId: u.id, state: emptyKitchen(), revision: 0 });
    const state = { ...emptyKitchen(), saved: ["public"] };
    const saved = await db
      .update(schema.kitchenDocuments)
      .set({ state, revision: 1 })
      .where(
        and(
          eq(schema.kitchenDocuments.userId, u.id),
          eq(schema.kitchenDocuments.revision, 0),
        ),
      )
      .returning();
    assert.equal(saved.length, 1);
    const stale = await db
      .update(schema.kitchenDocuments)
      .set({ state: emptyKitchen(), revision: 2 })
      .where(
        and(
          eq(schema.kitchenDocuments.userId, u.id),
          eq(schema.kitchenDocuments.revision, 0),
        ),
      )
      .returning();
    assert.equal(stale.length, 0);
    const [current] = await db.select().from(schema.kitchenDocuments);
    assert.deepEqual(current.state.saved, ["public"]);
    await db
      .insert(schema.contactReports)
      .values({ message: "مصدر الوصفة لا يعمل" });
    const [report] = await db.select().from(schema.contactReports);
    assert.equal(report.status, "new");
    await db
      .update(schema.contactReports)
      .set({ status: "resolved" })
      .where(eq(schema.contactReports.id, report.id));
    assert.equal(
      (await db.select().from(schema.contactReports))[0].status,
      "resolved",
    );
    await db
      .insert(schema.rateLimits)
      .values({
        key: "hash",
        count: 1,
        resetsAt: new Date(Date.now() + 10000),
      });
    assert.equal((await db.select().from(schema.rateLimits)).length, 1);
  } finally {
    await pg.close();
  }
});
