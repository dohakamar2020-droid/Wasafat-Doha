const CACHE = "wq-public-v3";
const PUBLIC =
  /^\/(?:$|discover$|pick$|ingredients$|same-ingredient$|weekly$|about$|collections(?:\/[^/]+)?$|creators(?:\/[^/]+)?$|meals(?:\/[^/]+)?$|recipes\/[^/]+(?:\/cook)?$)/;
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) =>
        c.addAll([
          "/offline.html",
          "/offline-kitchen.html",
          "/recipe-fallback.svg",
          "/icon.svg",
        ]),
      ),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (k) =>
                k !== CACHE &&
                (k.startsWith("wasafat-Doha") || k.startsWith("wq-")),
            )
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
async function store(request, response) {
  if (!response.ok) return;
  const c = await caches.open(CACHE);
  await c.put(request, response.clone());
  const keys = await c.keys();
  if (keys.length > 180)
    for (const key of keys.slice(0, keys.length - 180)) await c.delete(key);
}
self.addEventListener("fetch", (e) => {
  const req = e.request,
    u = new URL(req.url);
  if (req.method !== "GET" || u.origin !== self.location.origin) return;
  // Never cache auth, APIs, admin, kitchen, image uploads, RSC responses or private pages.
  if (
    u.pathname.startsWith("/api/") ||
    req.headers.get("RSC") ||
    u.searchParams.has("_rsc")
  )
    return;
  if (req.mode === "navigate" && /^\/kitchen(?:\/|$)/.test(u.pathname)) {
    e.respondWith(
      fetch(req).catch(() => caches.match("/offline-kitchen.html")),
    );
    return;
  }
  if (req.mode === "navigate") {
    if (!PUBLIC.test(u.pathname)) return;
    e.respondWith(
      fetch(req)
        .then(async (r) => {
          if (r.ok && r.headers.get("content-type")?.includes("text/html"))
            await store(req, r);
          return r;
        })
        .catch(
          async () =>
            (await caches.match(req)) || (await caches.match("/offline.html")),
        ),
    );
    return;
  }
  if (
    u.pathname.startsWith("/_next/static/") ||
    ["/recipe-fallback.svg", "/icon.svg"].includes(u.pathname)
  )
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then(async (r) => {
            await store(req, r);
            return r;
          }),
      ),
    );
});
