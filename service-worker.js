const CACHE_NAME = "espumin-cache-v3";

const FILES_TO_CACHE = [
  "/ESPUMIN-APP/index.html",
  "/ESPUMIN-APP/manifest.json",
  "/ESPUMIN-APP/service-worker.js",
  "/ESPUMIN-APP/icon-512.png",
  "/ESPUMIN-APP/logo.png"
];

// Instalar y guardar archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activar y limpiar caches viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
