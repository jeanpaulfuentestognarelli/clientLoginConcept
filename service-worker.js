const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/login.html",
  "/app/app.js",
  "/app/views/homeView.js",
  "/app/views/loginView.js",
  "/app/controllers/HomeController.js",
  "/app/controllers/LoginController.js",
  "/app/services/Llama.js",
  "/css/ditto.css",
  "/css/login.css",
  "/css/util.css",
  "/img/favicon.png",
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.url.includes('/client/')) {
    console.log('[Service Worker] Fetch (data)', evt.request.url);
    evt.respondWith(
        caches.open(DATA_CACHE_NAME).then((cache) => {
          return fetch(evt.request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(evt.request.url, response.clone());
                }
                return response;
              }).catch((err) => {
                return cache.match(evt.request);
              });
        }));
    return;
  }
  evt.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request)
            .then((response) => {
              return response || fetch(evt.request);
            });
      })
  );
});