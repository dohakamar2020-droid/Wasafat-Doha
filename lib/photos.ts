import { newId } from "@/lib/id";
import { getScope } from "./storage";
async function photoDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("wq-private-photos", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("photos");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("المتصفح مش قادر يحفظ الصورة على الجهاز."));
  });
}
export async function saveLocalPhoto(blob: Blob) {
  const id = `local:${getScope()}:${newId()}`;
  const db = await photoDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").put(blob, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error("تعذّر حفظ الصورة."));
    });
    return id;
  } finally {
    db.close();
  }
}
export async function localPhoto(id: string) {
  const owner = id.startsWith("local:guest:")
    ? "guest"
    : id.startsWith("local:user:")
      ? id.split(":").slice(1, 3).join(":")
      : getScope();
  if (owner !== "guest" && owner !== getScope()) return undefined;
  const db = await photoDb();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const req = db.transaction("photos").objectStore("photos").get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}
