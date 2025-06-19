
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  MapPin, 
  Bell,
  BellOff,
  Locate
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertSettings {
  isEnabled: boolean;
  location: { lat: number; lng: number; address?: string } | null;
  alertTypes: string[];
  radius: number;
  minSeverity: number;
}

const QuickAlertSettings = () => {
  const [settings, setSettings] = useState<AlertSettings>({
    isEnabled: false,
    location: null,
    alertTypes: ['earthquake', 'flood', 'wildfire', 'storm', 'heavyrain'],
    radius: 50,
    minSeverity: 1
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dmind-alert-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dmind-alert-settings', JSON.stringify(settings));
  }, [settings]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "ไม่รองรับ",
        description: "เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSettings(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }
        }));
        setIsGettingLocation(false);
        toast({
          title: "สำเร็จ",
          description: "ได้รับตำแหน่งของคุณแล้ว",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "เกิดข้อผิดพลาด", 
          description: "ไม่สามารถระบุตำแหน่งได้",
          variant: "destructive",
        });
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const toggleAlerts = (checked: boolean) => {
    setSettings(prev => ({ ...prev, isEnabled: checked }));
    
    if (checked && !settings.location) {
      getCurrentLocation();
    }

    // Request notification permission if enabling alerts
    if (checked && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            toast({
              title: "เปิดการแจ้งเตือนแล้ว",
              description: "คุณจะได้รับการแจ้งเตือนภัยพิบัติในพื้นที่ของคุณ",
            });
          }
        });
      } else if (Notification.permission === 'granted') {
        toast({
          title: "เปิดการแจ้งเตือนแล้ว",
          description: "คุณจะได้รับการแจ้งเตือนภัยพิบัติในพื้นที่ของคุณ",
        });
      }
    }
  };

  const alertTypeNames: Record<string, string> = {
    earthquake: 'แผ่นดินไหว',
    flood: 'น้ำท่วม',
    wildfire: 'ไฟป่า',
    storm: 'พายุ',
    heavyrain: 'ฝนตกหนัก',
    drought: 'ภัยแล้ง',
    airpollution: 'มลพิษอากาศ'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          การตั้งค่าการแจ้งเตือนด่วน
        </CardTitle>
        <CardDescription>
          ตั้งค่าการแจ้งเตือนภัยพิบัติในพื้นที่ของคุณ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle Alert */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.isEnabled ? (
              <Bell className="h-4 w-4 text-green-500" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <Label htmlFor="alert-toggle">เปิดการแจ้งเตือน</Label>
          </div>
          <Switch
            id="alert-toggle"
            checked={settings.isEnabled}
            onCheckedChange={toggleAlerts}
          />
        </div>

        {/* Location Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <Label>ตำแหน่งของคุณ</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              <Locate className="h-3 w-3 mr-1" />
              {isGettingLocation ? 'กำลังระบุ...' : 'ระบุตำแหน่ง'}
            </Button>
          </div>
          {settings.location ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              📍 {settings.location.address}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              กรุณาระบุตำแหน่งเพื่อรับการแจ้งเตือน
            </div>
          )}
        </div>

        {/* Alert Types */}
        {settings.isEnabled && (
          <div className="space-y-2">
            <Label>ประเภทการแจ้งเตือน</Label>
            <div className="flex flex-wrap gap-1">
              {settings.alertTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {alertTypeNames[type] || type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">สถานะ:</span>
            <span className={settings.isEnabled && settings.location ? 'text-green-600 font-medium' : 'text-gray-500'}>
              {settings.isEnabled && settings.location ? '✅ พร้อมรับการแจ้งเตือน' : '⚠️ ยังไม่พร้อม'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAlertSettings;
