import { currentUser, isAdminUser } from "./auth";
import { getDb } from "./db";
import { error } from "./http";
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) return { response: error("سجّل دخول بحساب الإدارة.", 401) };
  if (!isAdminUser(user))
    return { response: error("الصفحة دي متاحة للإدارة فقط.", 403) };
  const db = getDb();
  if (!db) return { response: error("قاعدة البيانات غير مهيأة.", 503) };
  return { db, user };
}
