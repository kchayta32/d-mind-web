
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "กลับมาออนไลน์แล้ว",
        description: "การเชื่อมต่ออินเทอร์เน็ตกลับมาปกติ",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "โหมดออฟไลน์",
        description: "คุณสามารถใช้งานข้อมูลที่บันทึกไว้ได้",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data from localStorage
    const cachedData = localStorage.getItem('dmind-offline-data');
    if (cachedData) {
      setOfflineData(JSON.parse(cachedData));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const cacheData = (key: string, data: any) => {
    const currentCache = JSON.parse(localStorage.getItem('dmind-offline-data') || '{}');
    currentCache[key] = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem('dmind-offline-data', JSON.stringify(currentCache));
    setOfflineData(currentCache);
  };

  const getCachedData = (key: string) => {
    if (!offlineData || !offlineData[key]) return null;
    
    const cached = offlineData[key];
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (Date.now() - cached.timestamp > maxAge) {
      return null;
    }
    
    return cached.data;
  };

  return {
    isOnline,
    offlineData,
    cacheData,
    getCachedData
  };
};
