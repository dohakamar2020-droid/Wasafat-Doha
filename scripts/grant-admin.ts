import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import { users } from "../lib/db/schema";
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email)
    throw new Error("Usage: npm run admin:grant -- owner@example.com");
  const db = getDb();
  if (!db) throw new Error("Set DATABASE_URL first.");
  const rows = await db
    .update(users)
    .set({ isAdmin: true })
    .where(eq(users.email, email))
    .returning({ id: users.id });
  if (!rows.length)
    throw new Error("Register the owner account before granting access.");
  console.log("Admin access granted to the explicitly selected account.");
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
