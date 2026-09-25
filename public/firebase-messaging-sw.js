/**
 * D-MIND Web - Firebase Cloud Messaging Service Worker
 * Handles background push notifications when the website is closed or in background.
 */

// Import Firebase compat libraries inside Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// D-MIND Firebase Project Credentials (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyB14mzwqqDgifaySBF93DOC2yLDSDjyl58",
  authDomain: "d-mind-e11fc.firebaseapp.com",
  projectId: "d-mind-e11fc",
  storageBucket: "d-mind-e11fc.appspot.com",
  messagingSenderId: "167116374407",
  appId: "1:167116374407:web:342dd6206c57b5e0c71322"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Listen to background messages from Firebase FCM
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const title = payload.notification?.title || payload.data?.title || '⚠️ D-MIND แจ้งเตือนภัยฉุกเฉิน';
    const body = payload.notification?.body || payload.data?.body || 'มีเหตุเตือนภัยใหม่ในพื้นที่ โปรดตรวจสอบสถานการณ์';
    const icon = payload.notification?.icon || '/dmind-premium-icon.png';
    const image = payload.notification?.image || payload.data?.image || undefined;
    const clickUrl = payload.data?.url || '/disaster-map';

    const notificationOptions = {
      body,
      icon,
      badge: '/dmind-premium-icon.png',
      image,
      vibrate: [300, 100, 300, 100, 400],
      tag: payload.data?.tag || 'dmind-disaster-alert',
      requireInteraction: true,
      renotify: true,
      data: {
        url: clickUrl,
        ...payload.data
      },
      actions: [
        {
          action: 'open_map',
          title: '🗺️ เปิดแผนที่สด'
        },
        {
          action: 'dismiss',
          title: 'รับทราบ'
        }
      ]
    };

    return self.registration.showNotification(title, notificationOptions);
  });
} catch (err) {
  console.warn('[firebase-messaging-sw.js] Firebase compat init warning:', err);
}

// Fallback native push listener for standard Web Push & FCM v1 HTTP payloads
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    console.log('[firebase-messaging-sw.js] Native push event:', data);

    const title = data.notification?.title || data.title || '⚠️ D-MIND แจ้งเตือนภัยฉุกเฉิน';
    const body = data.notification?.body || data.body || 'มีรายงานภัยพิบัติใหม่ในระบบ';
    const icon = data.notification?.icon || '/dmind-premium-icon.png';
    const clickUrl = data.data?.url || data.url || '/disaster-map';

    const options = {
      body,
      icon,
      badge: '/dmind-premium-icon.png',
      image: data.notification?.image || data.image || undefined,
      vibrate: [300, 100, 300],
      tag: 'dmind-native-alert',
      data: {
        url: clickUrl,
        ...data.data
      },
      actions: [
        { action: 'open_map', title: '🗺️ เปิดแผนที่' },
        { action: 'dismiss', title: 'ปิด' }
      ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('D-MIND แจ้งเตือนภัย', {
        body: text,
        icon: '/dmind-premium-icon.png'
      })
    );
  }
});

// Handle click on native device notification banner
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/disaster-map';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
