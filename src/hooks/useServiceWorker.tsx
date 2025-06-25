
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useServiceWorker = () => {
  // Extra safe toast hook usage with comprehensive error handling
  let toast: any;
  let isToastReady = false;
  
  try {
    // Verify React context is available before using hooks
    if (typeof React !== 'undefined' && React && React.useContext) {
      const toastHook = useToast();
      toast = toastHook.toast;
      isToastReady = true;
      console.log('Toast hook successfully initialized');
    } else {
      console.warn('React context not available for toast hook');
      toast = () => {};
      return; // Exit early if React context isn't ready
    }
  } catch (error) {
    console.warn('Toast hook initialization failed:', error);
    toast = () => {}; // Safe fallback
    return; // Exit early to prevent further errors
  }

  useEffect(() => {
    // Only proceed if toast is ready and we have service worker support
    if (!isToastReady || !('serviceWorker' in navigator)) {
      console.log('ServiceWorker registration skipped - requirements not met');
      return;
    }

    console.log('Attempting ServiceWorker registration...');

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered successfully: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                try {
                  toast({
                    title: "อัปเดตใหม่พร้อมใช้งาน",
                    description: "รีเฟรชหน้าเพื่อใช้เวอร์ชันล่าสุด",
                    action: (
                      <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        รีเฟรช
                      </button>
                    )
                  });
                } catch (error) {
                  console.warn('Could not show update toast:', error);
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed: ', error);
      });
  }, [isToastReady, toast]);

  const installPrompt = () => {
    if (!isToastReady || !('beforeinstallprompt' in window)) {
      return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      try {
        toast({
          title: "ติดตั้งแอป D-MIND",
          description: "เพิ่มไปยังหน้าจอหลักเพื่อเข้าถึงได้ง่ายขึ้น",
          action: (
            <button 
              onClick={() => {
                (e as any).prompt();
              }}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              ติดตั้ง
            </button>
          )
        });
      } catch (error) {
        console.warn('Could not show install toast:', error);
      }
    });
  };

  useEffect(() => {
    if (isToastReady) {
      installPrompt();
    }
  }, [isToastReady, toast]);
};
