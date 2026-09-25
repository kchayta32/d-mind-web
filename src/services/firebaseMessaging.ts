/**
 * D-MIND Web - Firebase Cloud Messaging (FCM) Client Service
 * Handles notification permissions, device registration tokens, and foreground message dispatch.
 */

export interface FCMConfig {
  apiKey: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  vapidKey?: string;
}

export const DEFAULT_FCM_CONFIG: FCMConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || "AIzaSyB14mzwqqDgifaySBF93DOC2yLDSDjyl58",
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || "d-mind-e11fc",
  messagingSenderId: "167116374407",
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || "1:167116374407:web:342dd6206c57b5e0c71322",
  vapidKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_VAPID_KEY) || "BF2vUq0J_zMHeaSQrxDJIEnSpKMcrhqmJVd_m3ueWM9rwl2sZygWXXPqZlXbjPgh-uUssKGBDQxc_Dq8ar8K33k",
};

const FCM_TOKEN_STORAGE_KEY = 'dmind_fcm_device_token';

/**
 * Checks if the current browser environment supports Push Notifications & Service Workers
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Gets the current notification permission state
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};

/**
 * Registers the dedicated FCM service worker
 */
export const registerFCMServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isNotificationSupported()) {
    console.warn('[FCM] ServiceWorker or Notification is not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    console.log('[FCM] Service Worker registered successfully:', registration.scope);
    return registration;
  } catch (err) {
    console.error('[FCM] Failed to register Service Worker:', err);
    return null;
  }
};

/**
 * Requests browser notification permission and retrieves device registration token.
 */
export const requestFCMPermission = async (
  vapidKey: string = DEFAULT_FCM_CONFIG.vapidKey || ''
): Promise<{ success: boolean; token: string | null; permission: NotificationPermission; error?: string }> => {
  if (!isNotificationSupported()) {
    return {
      success: false,
      token: null,
      permission: 'denied',
      error: 'เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน Web Push Notification'
    };
  }

  try {
    // 1. Request permission from user
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        token: null,
        permission,
        error: 'ผู้ใช้ปฏิเสธการอนุญาตแจ้งเตือน (Permission Denied)'
      };
    }

    // 2. Register Service Worker
    const registration = await registerFCMServiceWorker();
    if (!registration) {
      return {
        success: false,
        token: null,
        permission,
        error: 'ไม่สามารถลงทะเบียน Service Worker ได้'
      };
    }

    // Wait until Service Worker is ready
    await navigator.serviceWorker.ready;

    // 3. Attempt token acquisition via Web Push / FCM
    let deviceToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

    // If VAPID key is provided, subscribe to push manager
    if (registration.pushManager && vapidKey) {
      try {
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
        const subJson = subscription.toJSON();
        deviceToken = JSON.stringify(subJson);
        console.log('[FCM] Web Push Subscription acquired:', subJson);
      } catch (pushErr) {
        console.warn('[FCM] PushManager subscribe warning (using client token fallback):', pushErr);
      }
    }

    // Generate fallback persistent client device ID if no remote VAPID token yet
    if (!deviceToken) {
      deviceToken = `dmind_device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, deviceToken);

    return {
      success: true,
      token: deviceToken,
      permission: 'granted'
    };
  } catch (err: any) {
    console.error('[FCM] Error requesting notification permission:', err);
    return {
      success: false,
      token: null,
      permission: getNotificationPermission(),
      error: err.message || 'เกิดข้อผิดพลาดในการขอสิทธิ์แจ้งเตือน'
    };
  }
};

/**
 * Triggers an immediate local test notification banner on the device
 */
export const triggerLocalTestNotification = async (
  title: string = '⚠️ ทดสอบการแจ้งเตือน D-MIND',
  body: string = 'ระบบเตือนภัยฉุกเฉิน D-MIND เชื่อมต่อกับอุปกรณ์ของคุณสำเร็จแล้ว!'
): Promise<boolean> => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    const res = await requestFCMPermission();
    if (!res.success) return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration && registration.showNotification) {
      await registration.showNotification(title, {
        body,
        icon: '/dmind-premium-icon.png',
        badge: '/dmind-premium-icon.png',
        vibrate: [200, 100, 200],
        tag: 'dmind-test-alert',
        data: {
          url: '/disaster-map'
        }
      });
      return true;
    } else {
      new Notification(title, {
        body,
        icon: '/dmind-premium-icon.png'
      });
      return true;
    }
  } catch (e) {
    console.error('[FCM] Failed to show local notification:', e);
    return false;
  }
};

/**
 * Helper to convert Base64 URL to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
