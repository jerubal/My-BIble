// Ruth Bible App Service Worker (PWA Shell + Web Push Notification Handler)

const CACHE_NAME = 'ruth-bible-v1';
const PRECACHE_ASSETS = [
  '/',
  '/read/ruth/1',
  '/manifest.json',
  '/favicon.ico',
];

// Install: precache essential shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching error in Service Worker:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, cache fallback for navigation
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push: handle incoming Web Push notifications (FR-P1-07, FR-P1-08)
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Verse of the Day',
    body: 'Your daily scripture is ready to read.',
    url: '/read/ruth/1',
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: payload.url || '/read/ruth/1',
    },
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Notification click: open or focus reader window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/read/ruth/1';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
