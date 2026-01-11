const CACHE_NAME = "espumin-cache-v1";
const FILES_TO_CACHE = [
  "/ESPUMIN-APP/",
  "/ESPUMIN-APP/index.html",
  "/ESPUMIN-APP/manifest.json",
  "/ESPUMIN-APP/icon-512.png"
];

// Instalar y guardar archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activar y limpiar caches viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
