self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("agenda-cache").then((cache) =>
      cache.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).then((res) => {
            cache.put(event.request, res.clone());
            return res;
          })
      )
    )
  );
});
