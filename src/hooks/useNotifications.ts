
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "ไม่รองรับการแจ้งเตือน",
        description: "เบราว์เซอร์ของคุณไม่รองรับการแจ้งเตือน",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast({
          title: "เปิดการแจ้งเตือนสำเร็จ",
          description: "คุณจะได้รับการแจ้งเตือนเมื่อมีข้อมูลภัยพิบัติใหม่",
        });
        return true;
      } else {
        toast({
          title: "ไม่ได้รับอนุญาต",
          description: "การแจ้งเตือนถูกปิดใช้งาน",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted' || !isSupported) {
      return;
    }

    const notification = new Notification(title, {
      icon: '/dmind-premium-icon.png',
      badge: '/dmind-premium-icon.png',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification
  };
};
