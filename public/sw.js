const CACHE_NAME = 'dmind-v1.3.0';
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/dmind-premium-icon.png',
  '/manifest.webmanifest'
];

// Install event - cache core shell resources safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          urlsToCache.map((url) => cache.add(url).catch((err) => console.warn('[SW] Cache add skipped for:', url, err)))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first with stale-while-revalidate for critical resilience
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip external tile/API requests that shouldn't be full cached
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip caching non-http/https or chrome-extension schemes
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  let notificationData = {};
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'D-MIND Alert 🚨',
        body: event.data.text() || 'การแจ้งเตือนภัยพิบัติใหม่จากระบบ D-MIND'
      };
    }
  }

  const options = {
    body: notificationData.body,
    icon: '/dmind-premium-icon.png',
    badge: '/dmind-premium-icon.png',
    vibrate: [200, 100, 200],
    tag: 'disaster-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'ดูรายละเอียด'
      },
      {
        action: 'close',
        title: 'ปิด'
      }
    ],
    ...notificationData
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'D-MIND Alert 🚨',
      options
    )
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
