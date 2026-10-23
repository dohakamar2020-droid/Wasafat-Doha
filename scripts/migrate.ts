import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
import { migrate } from "drizzle-orm/neon-http/migrator";
import { getDb } from "../lib/db";
async function main() {
  const db = getDb();
  if (!db) throw new Error("Set DATABASE_URL first.");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Database migrations completed.");
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
