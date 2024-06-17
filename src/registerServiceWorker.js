/* eslint-disable no-console */

if (process.env.NODE_ENV === "production") {
  const CACHE_NAME = "image-cache-v1";

  self.addEventListener("install", (event) => {
    // Skip waiting to activate the new service worker immediately
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    // Claim clients immediately, so the service worker starts controlling the page
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener("fetch", (event) => {
    if (event.request.url.match(/\.(png|jpg|jpeg|svg)$/)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.open(CACHE_NAME).then((cache) => {
            return fetch(event.request).then((response) => {
              // Clone the response because it's a stream and can only be consumed once
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
              return response;
            });
          });
        })
      );
    } else {
      // Do not cache any other requests; just return the network response directly
      event.respondWith(fetch(event.request));
    }
  });
}
