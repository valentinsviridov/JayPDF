// JayPDF Service Worker - 100% Client-Side & Privacy-First Offline Caching
const CACHE_VERSION = 'jaypdf-v3';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/apple-touch-icon.png',
  '/pdf.worker.min.js',
  '/images/jaypdf-logo.png',
  '/images/jaypdf-logo@2x.png',
  '/images/jaypdf-favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('Precache failed during install:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_VERSION) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Only cache same-origin requests to preserve privacy and local-only mandate
  if (url.origin !== self.location.origin) {
    return;
  }

  // 1. Navigation requests (HTML pages) - Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
              cache.put(url.pathname, response.clone());
            });
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          const cachedResponse =
            (await cache.match(request)) ||
            (await cache.match(url.pathname));
          if (cachedResponse) {
            return cachedResponse;
          }

          const pathname = url.pathname;
          const altPath = pathname.endsWith('/') ? pathname.slice(0, -1) : `${pathname}/`;
          const altMatch =
            (await cache.match(altPath)) ||
            (await cache.match(new Request(altPath)));
          if (altMatch) {
            return altMatch;
          }

          const homeMatch = (await cache.match('/')) || (await cache.match('/index.html'));
          if (homeMatch) {
            return homeMatch;
          }

          return new Response('Offline: Page not available in cache.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  // 2. Static assets (JS chunks, CSS, fonts, workers, images, cmaps, standard fonts) - Cache-first with network fallback
  const isStaticAsset =
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/cmaps/') ||
    url.pathname.startsWith('/standard_fonts/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.bcmap') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.endsWith('.json');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Background revalidation
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_VERSION).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {
              // Ignore background fetch error when offline
            });
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, responseClone);
                cache.put(url.pathname, responseClone.clone());
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            const cache = await caches.open(CACHE_VERSION);
            const fallback =
              (await cache.match(request, { ignoreSearch: true })) ||
              (await cache.match(url.pathname, { ignoreSearch: true }));
            if (fallback) {
              return fallback;
            }
            throw new Error(`Failed to fetch static asset: ${request.url}`);
          });
      })
    );
    return;
  }

  // 3. All other requests - Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseClone);
            cache.put(url.pathname, responseClone.clone());
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_VERSION);
        return (
          (await cache.match(request)) ||
          (await cache.match(url.pathname)) ||
          (await cache.match(request, { ignoreSearch: true }))
        );
      })
  );
});
