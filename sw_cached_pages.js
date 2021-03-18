const CACHE_NAME = "Cache_v1";
const CACHE_ASSETS = [ "index.html", "about.html", "/css/style.css", "/js/main.js" ];

const self = this;

// -> Install
self.addEventListener("install", (e) => {
  console.log("Service Worker: installed");
  
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// -> Activate
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  // -> Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cacheName);
          }
        })
      )
    }))
  );
});

// -> Fetch event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching event");
  e.respondWith(
    // -> If the request fails (e.g. no network), the cache
    //    will try to load a file corresponding to what the request was.
    fetch(e.request).catch(() => {
      console.log("Service Worker: Offline Cache Read");
      caches.match(e.request);
    })
  )
});