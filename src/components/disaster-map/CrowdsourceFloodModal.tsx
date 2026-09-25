import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  MapPin, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Waves, 
  Loader2, 
  X,
  Phone,
  User,
  ShieldAlert
} from 'lucide-react';
import { CrowdsourcedFloodReport } from './types';

interface CrowdsourceFloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (
    report: Omit<CrowdsourcedFloodReport, 'id' | 'createdAt' | 'verifiedBySatellite' | 'satelliteDistanceMeters'>
  ) => Promise<CrowdsourcedFloodReport>;
  onNavigateToLocation?: (lat: number, lng: number) => void;
  defaultLocation?: { lat: number; lng: number };
}

export const CrowdsourceFloodModal: React.FC<CrowdsourceFloodModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  onNavigateToLocation,
  defaultLocation
}) => {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lat, setLat] = useState<number | null>(defaultLocation?.lat ?? null);
  const [lng, setLng] = useState<number | null>(defaultLocation?.lng ?? null);
  const [locationName, setLocationName] = useState('');
  const [waterLevel, setWaterLevel] = useState<CrowdsourcedFloodReport['waterLevel']>('knee');
  const [waterLevelCm, setWaterLevelCm] = useState<number>(40);
  const [waterFlow, setWaterFlow] = useState<CrowdsourcedFloodReport['waterFlow']>('flowing');
  const [situation, setSituation] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Request high-accuracy GPS from user's device
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'อุปกรณ์ไม่รองรับ GPS',
        description: 'กรุณากรอกชื่อสถานที่หรือพิกัดด้วยตนเอง',
        variant: 'destructive'
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setLat(latitude);
        setLng(longitude);

        // Attempt reverse geocoding via OpenStreetMap Nominatim for convenience
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const desc = [
              addr.village || addr.suburb || addr.neighbourhood,
              addr.subdistrict || addr.district || addr.city_district,
              addr.city || addr.county || addr.province || addr.state
            ]
              .filter(Boolean)
              .join(' ');
            if (desc) setLocationName(desc);
          }
        } catch (e) {
          console.warn('Reverse geocoding failed:', e);
        }

        setIsLocating(false);
        toast({
          title: 'ระบุพิกัดสำเร็จ 📍',
          description: `พิกัดปัจจุบัน: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        });
      },
      (err) => {
        setIsLocating(false);
        console.error('GPS Error:', err);
        toast({
          title: 'ไม่สามารถดึงพิกัด GPS ได้',
          description: 'กรุณาอนุญาตการเข้าถึงตำแหน่ง หรือกรอกชื่อสถานที่ด้วยตนเอง',
          variant: 'destructive'
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Photo selection/Camera capture
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast({
        title: 'ไฟล์รูปภาพใหญ่เกินไป',
        description: 'กรุณาเลือกรูปภาพขนาดไม่เกิน 8 MB',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationName.trim()) {
      toast({
        title: 'กรุณาระบุสถานที่',
        description: 'โปรดกรอกชื่อตำบล อำเภอ หรือจุดสังเกตบริเวณที่น้ำท่วม',
        variant: 'destructive'
      });
      return;
    }

    const submitLat = lat ?? 13.7563;
    const submitLng = lng ?? 100.5018;

    setIsSubmitting(true);
    try {
      const created = await onSubmitReport({
        lat: submitLat,
        lng: submitLng,
        locationName: locationName.trim(),
        waterLevel,
        waterLevelCm,
        waterFlow,
        situation: situation.trim() || 'รายงานสถานการณ์น้ำท่วมโดยประชาชนในพื้นที่',
        imageUrl: photoPreview || undefined,
        reporterName: reporterName.trim() || undefined,
        reporterPhone: reporterPhone.trim() || undefined
      });

      toast({
        title: 'บันทึกรายงานน้ำท่วมสำเร็จ! 🎉',
        description: created.verifiedBySatellite
          ? 'ข้อมูลตรงกับดาวเทียม Sentinel (Ground Truth Verified) ระบบได้อัปเดตหมุดบนแผนที่แล้ว'
          : 'ขอบคุณที่ช่วยรายงาน! หมุดของคุณจะแสดงบนแผนที่สด 24 ชม. ทันที'
      });

      // Pan map to report location
      onNavigateToLocation?.(submitLat, submitLng);

      // Reset form
      setLocationName('');
      setSituation('');
      setPhotoPreview(null);
      setReporterName('');
      setReporterPhone('');
      onClose();
    } catch (err: any) {
      console.error('Submit report error:', err);
      toast({
        title: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
        description: err.message || 'โปรดลองใหม่อีกครั้ง',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="space-y-1.5 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
              📢
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                รายงานน้ำท่วมด้วยตนเอง (Crowdsourcing)
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                ข้อมูลสดจากพื้นที่จริง (Ground Truth 24 ชม.) ช่วยยืนยันความถูกต้องของดาวเทียม Sentinel
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* 1. Location and GPS */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>ตำแหน่งที่เกิดน้ำท่วม <span className="text-red-500">*</span></span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="h-7 text-[11px] px-2.5 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    กำลังค้นหา GPS...
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 mr-1 text-red-500" />
                    ใช้พิกัดปัจจุบันของฉัน
                  </>
                )}
              </Button>
            </Label>

            <Input
              placeholder="เช่น ต.หัวเวียง อ.เสนา จ.พระนครศรีอยุธยา หรือชื่อซอย/หมู่บ้าน"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="text-xs"
              required
            />

            {lat && lng && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 p-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>พิกัด GPS: {lat.toFixed(5)}, {lng.toFixed(5)}</span>
              </p>
            )}
          </div>

          {/* 2. Water Level Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-500" />
              <span>ระดับน้ำท่วมขัง <span className="text-red-500">*</span></span>
            </Label>

            <RadioGroup
              value={waterLevel}
              onValueChange={(val) => {
                const lvl = val as CrowdsourcedFloodReport['waterLevel'];
                setWaterLevel(lvl);
                if (lvl === 'ankle') setWaterLevelCm(20);
                else if (lvl === 'knee') setWaterLevelCm(45);
                else if (lvl === 'waist') setWaterLevelCm(75);
                else if (lvl === 'chest') setWaterLevelCm(95);
                else if (lvl === 'critical') setWaterLevelCm(150);
              }}
              className="grid grid-cols-2 gap-2"
            >
              <div className={`flex items-center space-x-2 border rounded-lg p-2.5 cursor-pointer transition-colors ${waterLevel === 'ankle' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200'}`}>
                <RadioGroupItem value="ankle" id="level-ankle" />
                <Label htmlFor="level-ankle" className="text-xs cursor-pointer">
                  <span className="font-semibold block text-blue-700 dark:text-blue-400">ระดับข้อเท้า</span>
                  <span className="text-[10px] text-slate-500">10 - 30 ซม. (รถเล็กผ่านได้ช้าๆ)</span>
                </Label>
              </div>

              <div className={`flex items-center space-x-2 border rounded-lg p-2.5 cursor-pointer transition-colors ${waterLevel === 'knee' ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30' : 'border-slate-200'}`}>
                <RadioGroupItem value="knee" id="level-knee" />
                <Label htmlFor="level-knee" className="text-xs cursor-pointer">
                  <span className="font-semibold block text-yellow-700 dark:text-yellow-400">ระดับหัวเข่า</span>
                  <span className="text-[10px] text-slate-500">30 - 60 ซม. (รถเล็กไม่ควรผ่าน)</span>
                </Label>
              </div>

              <div className={`flex items-center space-x-2 border rounded-lg p-2.5 cursor-pointer transition-colors ${waterLevel === 'waist' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30' : 'border-slate-200'}`}>
                <RadioGroupItem value="waist" id="level-waist" />
                <Label htmlFor="level-waist" className="text-xs cursor-pointer">
                  <span className="font-semibold block text-amber-700 dark:text-amber-400">ระดับเอว</span>
                  <span className="text-[10px] text-slate-500">60 - 90 ซม. (ต้องใช้เรือ/รถยกสูง)</span>
                </Label>
              </div>

              <div className={`flex items-center space-x-2 border rounded-lg p-2.5 cursor-pointer transition-colors ${waterLevel === 'critical' ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200'}`}>
                <RadioGroupItem value="critical" id="level-critical" />
                <Label htmlFor="level-critical" className="text-xs cursor-pointer">
                  <span className="font-semibold block text-red-700 dark:text-red-400">วิกฤติ มิดหัว/หลังคา</span>
                  <span className="text-[10px] text-slate-500">&gt; 100 ซม. (ต้องอพยพด่วน)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 3. Water Current / Flow */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              ลักษณะกระแสน้ำ
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWaterFlow('calm')}
                className={`py-1.5 px-2 text-xs rounded-lg border transition-all text-center ${waterFlow === 'calm' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                ⚪ น้ำท่วมขังนิ่ง
              </button>
              <button
                type="button"
                onClick={() => setWaterFlow('flowing')}
                className={`py-1.5 px-2 text-xs rounded-lg border transition-all text-center ${waterFlow === 'flowing' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                💧 น้ำไหลต่อเนื่อง
              </button>
              <button
                type="button"
                onClick={() => setWaterFlow('torrential')}
                className={`py-1.5 px-2 text-xs rounded-lg border transition-all text-center ${waterFlow === 'torrential' ? 'bg-red-600 text-white border-red-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                🌊 ไหลเชี่ยวกราก
              </button>
            </div>
          </div>

          {/* 4. Photo Upload / Camera Capture */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-500" />
                <span>ถ่ายรูปภาพน้ำท่วมในพื้นที่ (Ground Truth)</span>
              </span>
              <span className="text-[10px] text-slate-500">ช่วยยืนยันระดับน้ำจริง</span>
            </Label>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-48">
                <img
                  src={photoPreview}
                  alt="ตัวอย่างรูปภาพน้ำท่วม"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    แตะที่นี่เพื่อถ่ายภาพหรือเลือกรูป
                  </span>
                  <span className="text-[10px] text-slate-400">
                    รองรับกล้องมือถือโดยตรง (JPEG, PNG, WebP)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 5. Situation description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              รายละเอียดสถานการณ์ / ความต้องการช่วยเหลือ
            </Label>
            <Textarea
              placeholder="เช่น ถนนสายหลักตัดขาด, ไฟฟ้าดับ, ต้องการเรือรับ-ส่งผู้ป่วยติดเตียง..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          {/* 6. Reporter Info (Optional) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>ชื่อผู้รายงาน (ไม่บังคับ)</span>
              </Label>
              <Input
                placeholder="ชื่อหรือหน่วยงาน"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>เบอร์ติดต่อ (ไม่บังคับ)</span>
              </Label>
              <Input
                placeholder="08X-XXX-XXXX"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="text-xs mt-1"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  กำลังส่งข้อมูล...
                </>
              ) : (
                'ส่งรายงานน้ำท่วมทันที 🚀'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrowdsourceFloodModal;
