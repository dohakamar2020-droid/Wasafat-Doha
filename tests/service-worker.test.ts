import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
test("service worker excludes APIs, administration, authentication and RSC payloads", () => {
  const handlers: Record<string, (e: unknown) => void> = {};
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    URL,
    Response,
    self: {
      location: { origin: "https://example.test" },
      addEventListener: (name: string, fn: (e: unknown) => void) => {
        handlers[name] = fn;
      },
    },
    caches: {},
    fetch: () => Promise.resolve(new Response("ok")),
  });
  for (const pathname of [
    "/api/kitchen",
    "/api/auth/me",
    "/admin",
    "/admin/review/dish",
    "/login",
    "/register",
  ]) {
    let intercepted = false;
    handlers.fetch({
      request: {
        method: "GET",
        url: `https://example.test${pathname}`,
        headers: new Headers(),
        mode: "navigate",
      },
      respondWith: () => {
        intercepted = true;
      },
    });
    assert.equal(intercepted, false, pathname);
  }
  let intercepted = false;
  handlers.fetch({
    request: {
      method: "GET",
      url: "https://example.test/recipes/dish?_rsc=abc",
      headers: new Headers({ RSC: "1" }),
      mode: "cors",
    },
    respondWith: () => {
      intercepted = true;
    },
  });
  assert.equal(intercepted, false);
});
