const CACHE_NAME = "Cache_v2";

const self = this;

// -> Install
self.addEventListener("install", (e) => {
  console.log("Service Worker: installed");
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
    fetch(e.request).then((res) => {
      // -> Make a copy of the response that comes from the server.
      const resClone = res.clone();
      // -> Open a cache
      caches.open(CACHE_NAME).then((cache) => {
        // -> Add response to the cache
        cache.put(e.request, resClone);
      });

      return res;
    }).catch((err) => {
      caches.match(e.request).then((res) => res);
    })
  )
});