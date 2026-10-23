import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db: NeonHttpDatabase<typeof schema> | null = null;
let tried = false;

/** قاعدة البيانات اختيارية وقت البناء: لو مفيش DATABASE_URL الموقع بيشتغل بالseed المحلي. */
export function getDb(): NeonHttpDatabase<typeof schema> | null {
  if (tried) return db;
  tried = true;
  const url = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
  if (!url) return null;
  try {
    db = drizzle(neon(url), { schema });
  } catch {
    db = null;
  }
  return db;
}
export const dbConfigured = () =>
  !!(process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL);
