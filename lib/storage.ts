// Account scopes are selected only after /auth/me verifies the cookie. Guest data stays separate.
const PREFIX = "wq:v2:";
let scope = "guest";
const UI_EVENT = "wasafat-Doha:change";
export function notifyStorage() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(UI_EVENT));
}
export function setScope(id: string | null) {
  scope = id ? `user:${id}` : "guest";
  notifyStorage();
}
export function getScope() {
  return scope;
}
function key(k: string) {
  return `${PREFIX}${scope}:${k.replace("wasafat-Doha:", "")}`;
}
export function storageGet(k: string) {
  try {
    return localStorage.getItem(key(k));
  } catch {
    return null;
  }
}
export function storageSet(k: string, v: string) {
  try {
    localStorage.setItem(key(k), v);
    notifyStorage();
    return true;
  } catch {
    return false;
  }
}
export function storageRemove(k: string) {
  try {
    localStorage.removeItem(key(k));
    notifyStorage();
  } catch {}
}
export function clearAccountCache() {
  try {
    const p = `${PREFIX}${scope}:`;
    if (scope !== "guest")
      Object.keys(localStorage)
        .filter((k) => k.startsWith(p))
        .forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("wasafat-Doha:user");
  } catch {}
  scope = "guest";
  notifyStorage();
}
export function migrateGuest() {
  try {
    if (localStorage.getItem(`${PREFIX}migrated`)) return;
    let target = "guest";
    try {
      const previous = JSON.parse(
        localStorage.getItem("wasafat-Doha:user") || "null",
      );
      if (/^[a-f0-9-]{36}$/i.test(previous?.id)) target = `user:${previous.id}`;
    } catch {}
    const notes: Record<string, string> = {};
    const legacy = Object.keys(localStorage).filter((k) =>
      k.startsWith("wasafat-Doha:"),
    );
    for (const k of legacy) {
      const value = localStorage.getItem(k)!;
      if (k.startsWith("wasafat-Doha:note:"))
        notes[k.slice("wasafat-Doha:note:".length)] = value;
      else if (
        k !== "wasafat-Doha:user" &&
        !k.includes("admin-") &&
        !k.includes("messages")
      )
        localStorage.setItem(
          `${PREFIX}${target}:${k.slice("wasafat-Doha:".length)}`,
          value,
        );
    }
    localStorage.setItem(`${PREFIX}${target}:notes`, JSON.stringify(notes));
    localStorage.setItem(`${PREFIX}migrated`, "1");
    legacy.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
