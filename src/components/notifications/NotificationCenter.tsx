import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Settings, Volume2, VolumeX, MapPin, Smartphone, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  requestFCMPermission, 
  triggerLocalTestNotification, 
  DEFAULT_FCM_CONFIG, 
  isNotificationSupported 
} from '@/services/firebaseMessaging';

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  volume: number;
  emergencyOnly: boolean;
  areas: string[];
  types: string[];
}

const NotificationCenter: React.FC = () => {
  const { permission, requestPermission, sendNotification } = useNotifications();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    sound: true,
    volume: 80,
    emergencyOnly: false,
    areas: [],
    types: ['earthquake', 'flood', 'wildfire', 'storm']
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('dmind_fcm_device_token') : null;
  });
  const [isRequestingFCM, setIsRequestingFCM] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('dmind-notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dmind-notification-settings', JSON.stringify(newSettings));
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      saveSettings({ ...settings, enabled: true });
      toast({
        title: "การแจ้งเตือนเปิดใช้งานแล้ว",
        description: "คุณจะได้รับการแจ้งเตือนเมื่อมีเหตุการณ์ภัยพิบัติ",
      });
    }
  };

  const handleDisableNotifications = () => {
    saveSettings({ ...settings, enabled: false });
    toast({
      title: "การแจ้งเตือนปิดใช้งานแล้ว",
      description: "คุณจะไม่ได้รับการแจ้งเตือนอีกต่อไป",
      variant: "destructive",
    });
  };

  const handleEnableFCM = async () => {
    setIsRequestingFCM(true);
    const res = await requestFCMPermission();
    setIsRequestingFCM(false);
    if (res.success && res.token) {
      setFcmToken(res.token);
      saveSettings({ ...settings, enabled: true });
      toast({
        title: "เชื่อมต่อ FCM Web Push สำเร็จ! 🎉",
        description: "อุปกรณ์ของคุณพร้อมรับการแจ้งเตือนภัยผ่านแถบแจ้งเตือนของระบบแล้ว",
      });
    } else {
      toast({
        title: "ไม่สามารถเปิด FCM ได้",
        description: res.error || "โปรดตรวจสอบสิทธิ์การแจ้งเตือนในเบราว์เซอร์",
        variant: "destructive"
      });
    }
  };

  const handleTestFCMNotification = async () => {
    const ok = await triggerLocalTestNotification(
      '🚨 D-MIND แจ้งเตือนภัยฉุกเฉิน (FCM Web Push)',
      'ระดับน้ำแม่น้ำยม/เจ้าพระยาเริ่มเอ่อล้นตลิ่งในเขตเทศบาล - ทดสอบแจ้งเตือนระดับระบบ'
    );
    if (ok) {
      toast({
        title: "ส่งการแจ้งเตือนเข้าอุปกรณ์แล้ว 📱",
        description: "ตรวจสอบแถบแจ้งเตือน (Notification Drawer / Action Center) ของอุปกรณ์คุณ",
      });
    } else {
      toast({
        title: "ไม่สามารถส่งการแจ้งเตือนได้",
        description: "โปรดตรวจสอบว่าได้อนุญาตการแจ้งเตือนในเบราว์เซอร์แล้วหรือไม่",
        variant: "destructive"
      });
    }
  };

  const testNotification = () => {
    if (settings.enabled) {
      sendNotification("🚨 ทดสอบการแจ้งเตือน", {
        body: "ระบบแจ้งเตือนทำงานปกติ - D-MIND",
        icon: "/dmind-premium-icon.png",
        badge: "/dmind-premium-icon.png",
        tag: "test-notification",
        requireInteraction: true,
      });
    }
  };

  const emergencySound = () => {
    if (settings.sound) {
      // Create emergency sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(settings.volume / 100, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* 1. Standard In-App Notification Center */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            ระบบแจ้งเตือนภัยพิบัติ
          </CardTitle>
          <CardDescription>
            รับแจ้งเตือนแบบเรียลไทม์เมื่อมีเหตุการณ์ภัยพิบัติ
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {permission === 'granted' ? (
                <Bell className="h-4 w-4 text-green-500" />
              ) : (
                <BellOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                สถานะ: {permission === 'granted' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </span>
            </div>
            <Badge variant={permission === 'granted' ? 'default' : 'destructive'}>
              {permission === 'granted' ? 'ใช้งานได้' : 'ไม่ได้รับอนุญาต'}
            </Badge>
          </div>

          {/* Main Controls */}
          <div className="space-y-3">
            {permission !== 'granted' ? (
              <Button onClick={handleEnableNotifications} className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                เปิดใช้งานการแจ้งเตือน
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={settings.enabled ? "destructive" : "default"}
                  onClick={settings.enabled ? handleDisableNotifications : handleEnableNotifications}
                  className="flex-1"
                >
                  {settings.enabled ? (
                    <>
                      <BellOff className="mr-2 h-4 w-4" />
                      ปิดการแจ้งเตือน
                    </>
                  ) : (
                    <>
                      <Bell className="mr-2 h-4 w-4" />
                      เปิดการแจ้งเตือน
                    </>
                  )}
                </Button>

                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>ตั้งค่าการแจ้งเตือน</DialogTitle>
                      <DialogDescription>
                        ปรับแต่งการแจ้งเตือนตามความต้องการ
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Sound Settings */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-toggle" className="flex items-center gap-2">
                            {settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            เสียงแจ้งเตือน
                          </Label>
                          <Switch
                            id="sound-toggle"
                            checked={settings.sound}
                            onCheckedChange={(checked) =>
                              saveSettings({ ...settings, sound: checked })
                            }
                          />
                        </div>

                        {settings.sound && (
                          <div className="space-y-2">
                            <Label>ระดับเสียง ({settings.volume}%)</Label>
                            <Slider
                              value={[settings.volume]}
                              onValueChange={([value]) =>
                                saveSettings({ ...settings, volume: value })
                              }
                              max={100}
                              step={10}
                            />
                          </div>
                        )}
                      </div>

                      {/* Emergency Only */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emergency-toggle">
                          เฉพาะเหตุฉุกเฉินระดับวิกฤติ
                        </Label>
                        <Switch
                          id="emergency-toggle"
                          checked={settings.emergencyOnly}
                          onCheckedChange={(checked) =>
                            saveSettings({ ...settings, emergencyOnly: checked })
                          }
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Test Buttons */}
            {settings.enabled && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={testNotification} className="flex-1 text-xs">
                  ทดสอบในแอป
                </Button>
                <Button variant="outline" onClick={emergencySound} className="flex-1 text-xs">
                  ทดสอบเสียง
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Firebase Cloud Messaging (FCM Web Push) Native Device Banner Card */}
      <Card className="w-full border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-950 dark:text-blue-100">
              <Smartphone className="h-4 w-4 text-blue-600" />
              Firebase Cloud Messaging (FCM Web Push)
            </CardTitle>
            <Badge className="bg-blue-600 text-white text-[10px]">
              ระดับระบบ (OS-Level)
            </Badge>
          </div>
          <CardDescription className="text-xs">
            รับการแจ้งเตือนเด้งขึ้นบนแถบสถานะ (Notification Bar) ของมือถือและคอมพิวเตอร์ แม้จะปิดเว็บอยู่
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Firebase Project:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{DEFAULT_FCM_CONFIG.projectId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Service Worker:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                /firebase-messaging-sw.js
              </span>
            </div>
            {fcmToken && (
              <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 block">Device Registration Token:</span>
                <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300 truncate bg-slate-50 dark:bg-slate-900 p-1 rounded mt-0.5">
                  {fcmToken}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleEnableFCM}
              disabled={isRequestingFCM}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {fcmToken ? 'อัปเดตสิทธิ์ FCM Web Push' : 'ขอสิทธิ์รับการแจ้งเตือนระดับอุปกรณ์ (FCM)'}
            </Button>

            <Button
              variant="outline"
              onClick={handleTestFCMNotification}
              className="w-full text-xs h-9 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              ยิงทดสอบเข้าแถบแจ้งเตือนอุปกรณ์ (OS Banner)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
