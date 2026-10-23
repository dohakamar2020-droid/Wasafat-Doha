import { test } from "node:test";
import assert from "node:assert/strict";
import {
  storageGet,
  storageSet,
  setScope,
  clearAccountCache,
  migrateGuest,
} from "../lib/storage";
import { newId } from "../lib/id";
function memoryStorage() {
  const data: Record<string, string> = {};
  const api = {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      data[k] = String(v);
    },
    removeItem: (k: string) => {
      delete data[k];
    },
    clear: () => {
      for (const k of Object.keys(data)) delete data[k];
    },
    key: (n: number) => Object.keys(data)[n] ?? null,
    get length() {
      return Object.keys(data).length;
    },
  };
  return new Proxy(api, {
    ownKeys: () => Object.keys(data),
    getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
  }) as Storage;
}
test("guest and two users remain isolated, including after logout", () => {
  Object.defineProperty(globalThis, "localStorage", {
    value: memoryStorage(),
    configurable: true,
  });
  setScope(null);
  storageSet("wasafat-Doha:notes", "guest");
  setScope("alice");
  assert.equal(storageGet("wasafat-Doha:notes"), null);
  storageSet("wasafat-Doha:notes", "alice-private");
  setScope("bob");
  assert.equal(storageGet("wasafat-Doha:notes"), null);
  storageSet("wasafat-Doha:notes", "bob-private");
  clearAccountCache();
  assert.equal(storageGet("wasafat-Doha:notes"), "guest");
  setScope("bob");
  assert.equal(storageGet("wasafat-Doha:notes"), null);
  setScope("alice");
  assert.equal(storageGet("wasafat-Doha:notes"), "alice-private");
  setScope(null);
});
test("legacy account notes migrate into that account, never into guest data", () => {
  const storage = memoryStorage();
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
  const id = "00000000-0000-4000-8000-000000000001";
  storage.setItem("wasafat-Doha:user", JSON.stringify({ id }));
  storage.setItem("wasafat-Doha:note:recipe", "old private note");
  migrateGuest();
  setScope(null);
  assert.equal(storageGet("wasafat-Doha:notes"), null);
  setScope(id);
  assert.deepEqual(JSON.parse(storageGet("wasafat-Doha:notes")!), {
    recipe: "old private note",
  });
  assert.equal(storage.getItem("wasafat-Doha:note:recipe"), null);
  setScope(null);
});
test("record IDs work in local HTTP environments without crypto.randomUUID", () => {
  const original = globalThis.crypto;
  Object.defineProperty(globalThis, "crypto", {
    value: { getRandomValues: original.getRandomValues.bind(original) },
    configurable: true,
  });
  try {
    const a = newId(),
      b = newId();
    assert.match(
      a,
      /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/,
    );
    assert.notEqual(a, b);
  } finally {
    Object.defineProperty(globalThis, "crypto", {
      value: original,
      configurable: true,
    });
  }
});
