
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useOfflineMode = () => {
  // Safety check for React readiness
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    try {
      return navigator?.onLine ?? true;
    } catch {
      return true;
    }
  });
  const [offlineData, setOfflineData] = useState<any>(null);
  
  // Safe toast hook usage
  let toast: any;
  try {
    const toastHook = useToast();
    toast = toastHook.toast;
  } catch (error) {
    console.warn('Toast hook not available yet:', error);
    toast = () => {}; // Fallback
  }

  useEffect(() => {
    // Wait a bit to ensure everything is ready
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const handleOnline = () => {
      setIsOnline(true);
      try {
        toast({
          title: "กลับมาออนไลน์แล้ว",
          description: "การเชื่อมต่ออินเทอร์เน็ตกลับมาปกติ",
          duration: 3000,
        });
      } catch (error) {
        console.warn('Could not show online toast:', error);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      try {
        toast({
          title: "โหมดออฟไลน์",
          description: "คุณสามารถใช้งานข้อมูลที่บันทึกไว้ได้",
          duration: 5000,
        });
      } catch (error) {
        console.warn('Could not show offline toast:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data from localStorage
    try {
      const cachedData = localStorage.getItem('dmind-offline-data');
      if (cachedData) {
        setOfflineData(JSON.parse(cachedData));
      }
    } catch (error) {
      console.warn('Could not load cached data:', error);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isReady, toast]);

  const cacheData = (key: string, data: any) => {
    try {
      const currentCache = JSON.parse(localStorage.getItem('dmind-offline-data') || '{}');
      currentCache[key] = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('dmind-offline-data', JSON.stringify(currentCache));
      setOfflineData(currentCache);
    } catch (error) {
      console.warn('Could not cache data:', error);
    }
  };

  const getCachedData = (key: string) => {
    try {
      if (!offlineData || !offlineData[key]) return null;
      
      const cached = offlineData[key];
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (Date.now() - cached.timestamp > maxAge) {
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.warn('Could not get cached data:', error);
      return null;
    }
  };

  return {
    isOnline,
    offlineData,
    cacheData,
    getCachedData
  };
};
