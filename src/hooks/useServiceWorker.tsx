
import { useEffect, useCallback } from 'react';

export const useServiceWorker = () => {
  // Create a function to get toast when needed
  const getToast = useCallback(async () => {
    const { useToast } = await import('@/hooks/use-toast');
    return useToast();
  }, []);

  useEffect(() => {
    // Ensure this only runs in the browser and after component is mounted
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', async () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                const { toast } = await getToast();
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
              }
            });
          }
        });
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    };

    // Register service worker
    registerServiceWorker();
  }, [getToast]);

  useEffect(() => {
    // Handle install prompt
    const handleBeforeInstallPrompt = async (e: Event) => {
      e.preventDefault();
      const { toast } = await getToast();
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
    };

    if (typeof window !== 'undefined' && 'beforeinstallprompt' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, [getToast]);
};
