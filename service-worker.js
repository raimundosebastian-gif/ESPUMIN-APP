const CACHE_NAME = "espumin-cache-v5";

const BASE = "/ESPUMIN-APP/refs/heads/main/";

const FILES_TO_CACHE = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "service-worker.js",
  BASE + "icon-512.png",
  BASE + "logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
