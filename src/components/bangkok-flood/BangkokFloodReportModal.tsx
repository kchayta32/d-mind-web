import React, { useState, useEffect, useRef } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  MapPin,
  Navigation,
  Waves,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Compass,
  FileText,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import {
  BangkokUserFloodReport,
  WaterLevelCategory,
  WATER_LEVEL_PRESETS,
  bangkokFloodUserReportService
} from '@/services/bangkokFloodUserReportService';

export interface BangkokFloodReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: (report: BangkokUserFloodReport) => void;
  initialCoordinates?: [number, number];
  initialLocationName?: string;
  initialDistrict?: string;
}

// Common Bangkok districts for quick suggestions
const BANGKOK_DISTRICTS = [
  'จตุจักร', 'ดินแดง', 'ห้วยขวาง', 'บางซื่อ', 'ดอนเมือง', 'หลักสี่', 'สายไหม',
  'บางเขน', 'ลาดพร้าว', 'วังทองหลาง', 'คลองเตย', 'วัฒนา', 'สาทร', 'บางรัก',
  'ปทุมวัน', 'พญาไท', 'ราชเทวี', 'พระโขนง', 'บางนา', 'ประเวศ', 'สวนหลวง',
  'สะพานสูง', 'มีนบุรี', 'ลาดกระบัง', 'บึงกุ่ม', 'คันนายาว', 'คลองสามวา',
  'หนองจอก', 'ธนบุรี', 'คลองสาน', 'บางกอกใหญ่', 'บางกอกน้อย', 'บางพลัด',
  'ภาษีเจริญ', 'ตลิ่งชัน', 'ทวีวัฒนา', 'บางแค', 'หนองแขม', 'ราษฎร์บูรณะ',
  'ทุ่งครุ', 'ยานนาวา', 'บางคอแหลม', 'จอมทอง', 'บางขุนเทียน', 'พระนคร',
  'ป้อมปราบศัตรูพ่าย', 'สัมพันธวงศ์', 'ดุสิต'
];

export const BangkokFloodReportModal: React.FC<BangkokFloodReportModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
  initialCoordinates = [13.7563, 100.5018],
  initialLocationName = '',
  initialDistrict = ''
}) => {
  const { toast } = useToast();

  // Form State
  const [isFlooded, setIsFlooded] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<WaterLevelCategory | null>(null);
  const [waterLevelDescription, setWaterLevelDescription] = useState<string>('');
  const [locationName, setLocationName] = useState<string>(initialLocationName);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [coordinates, setCoordinates] = useState<[number, number]>(initialCoordinates);
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCoordinatePicker, setShowCoordinatePicker] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>(initialCoordinates[0].toFixed(5));
  const [customLng, setCustomLng] = useState<string>(initialCoordinates[1].toFixed(5));

  // Sync initial values on open
  useEffect(() => {
    if (isOpen) {
      if (initialCoordinates) {
        setCoordinates(initialCoordinates);
        setCustomLat(initialCoordinates[0].toFixed(5));
        setCustomLng(initialCoordinates[1].toFixed(5));
      }
      if (initialLocationName) {
        setLocationName(initialLocationName);
      }
      if (initialDistrict) {
        setDistrict(initialDistrict);
      }
    }
  }, [isOpen, initialCoordinates, initialLocationName, initialDistrict]);

  // Handle preset chip click
  const handlePresetClick = (preset: typeof WATER_LEVEL_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    // If textbox is empty or was previous preset, auto-fill; otherwise append
    setWaterLevelDescription(preset.label);
  };

  // GPS Auto-detect handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'อุปกรณ์ไม่รองรับ GPS',
        description: 'กรุณากรอกชื่อถนนหรือตำแหน่งด้วยตนเอง',
        variant: 'destructive'
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates([lat, lng]);
        setCustomLat(lat.toFixed(5));
        setCustomLng(lng.toFixed(5));

        // Attempt gentle reverse geocode using OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'th,en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const road = addr.road || addr.suburb || addr.neighbourhood || '';
            const detectedDistrict = addr.city_district || addr.district || addr.suburb || '';

            if (road && !locationName) {
              setLocationName(road);
            }
            if (detectedDistrict && !district) {
              // Clean "เขต" prefix if present
              const cleanDistrict = detectedDistrict.replace(/เขต|District/g, '').trim();
              setDistrict(cleanDistrict);
            }
          }
        } catch (e) {
          // Geocode is optional bonus, proceed without error
        }

        setIsLocating(false);
        toast({
          title: '📍 ระบุตำแหน่งพิกัดปัจจุบันสำเร็จ',
          description: `ละติจูด ${lat.toFixed(4)}, ลองจิจูด ${lng.toFixed(4)}`
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        toast({
          title: 'ไม่สามารถดึงตำแหน่งพิกัดได้',
          description: 'กรุณาอนุญาตการเข้าถึงตำแหน่ง หรือระบุชื่อถนนด้วยตนเอง',
          variant: 'destructive'
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Apply custom typed lat/lng
  const handleApplyCustomCoords = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= 13.0 && lat <= 14.5 && lng >= 100.0 && lng <= 101.2) {
      setCoordinates([lat, lng]);
      toast({
        title: 'อัปเดตพิกัดสำเร็จ',
        description: `พิกัด [${lat.toFixed(4)}, ${lng.toFixed(4)}]`
      });
    } else {
      toast({
        title: 'พิกัดไม่ถูกต้อง',
        description: 'กรุณากรอกพิกัดละติจูดและลองจิจูดในเขตกรุงเทพมหานครและปริมณฑล',
        variant: 'destructive'
      });
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationName.trim()) {
      toast({
        title: 'กรุณาระบุชื่อถนนหรือสถานที่',
        description: 'เพื่อความชัดเจนในการแจ้งเตือนแก่ผู้ร่วมใช้เส้นทาง',
        variant: 'destructive'
      });
      return;
    }

    if (isFlooded && !waterLevelDescription.trim()) {
      toast({
        title: 'กรุณาระบุระดับน้ำคร่าวๆ',
        description: 'สามารถคลิกเลือกปุ่มระดับน้ำ เช่น ตาตุ่ม, หัวเข่า, เอว หรือพิมพ์ระบุเอง',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newReport = await bangkokFloodUserReportService.addReport({
        isFlooded,
        waterLevelDescription: isFlooded ? waterLevelDescription.trim() : 'ถนนแห้ง/สัญจรได้ปกติ',
        waterLevelCategory: isFlooded ? (selectedPreset || 'custom') : undefined,
        locationName: locationName.trim(),
        district: district.trim() || undefined,
        coordinates,
        notes: notes.trim() || undefined
      });

      toast({
        title: '✅ ส่งรายงานสถานการณ์สำเร็จ!',
        description: isFlooded 
          ? `ขอบคุณที่ช่วยแจ้งเหตุน้ำท่วมขัง: ${locationName}` 
          : `ขอบคุณที่ช่วยยืนยันเส้นทางสัญจรได้ปกติ: ${locationName}`
      });

      if (onReportSubmitted) {
        onReportSubmitted(newReport);
      }

      // Reset form and close
      handleReset();
      onClose();
    } catch (err) {
      console.error('Failed to submit report:', err);
      toast({
        title: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        description: 'กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsFlooded(true);
    setSelectedPreset(null);
    setWaterLevelDescription('');
    setLocationName('');
    setDistrict('');
    setNotes('');
    setShowCoordinatePicker(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto z-[9999] p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        
        {/* Header with visual accent banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-5 text-white rounded-t-2xl relative">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-none text-[11px] font-semibold">
                📢 ประชาชนช่วยรายงาน (Crowdsource)
              </Badge>
              <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px]">
                สด 24 ชม.
              </Badge>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
              แจ้งสถานการณ์น้ำท่วม / สภาพถนน กทม.
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-xs sm:text-sm">
              ร่วมรายงานสภาพผิวจราจรเพื่อเป็นข้อมูลให้เพื่อนร่วมทางหลีกเลี่ยงจุดน้ำขังแบบเรียลไทม์
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Choice 1: สถานการณ์น้ำท่วม (Radio cards) */}
          <div className="space-y-2.5">
            <Label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500" />
              1. สถานการณ์น้ำท่วมในจุดที่คุณอยู่ <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option A: มีน้ำท่วมขัง */}
              <button
                type="button"
                onClick={() => {
                  setIsFlooded(true);
                  if (!waterLevelDescription && selectedPreset) {
                    const found = WATER_LEVEL_PRESETS.find(p => p.id === selectedPreset);
                    if (found) setWaterLevelDescription(found.label);
                  }
                }}
                className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-3 ${
                  isFlooded
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                  isFlooded ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  🌊
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    มีน้ำท่วมขัง
                    {isFlooded && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    มีน้ำขังบนผิวถนน/ฟุตบาท รถชะลอหรือผ่านไม่ได้
                  </div>
                </div>
              </button>

              {/* Option B: ไม่มีน้ำท่วม (ถนนแห้ง) */}
              <button
                type="button"
                onClick={() => {
                  setIsFlooded(false);
                  setSelectedPreset(null);
                  setWaterLevelDescription('');
                }}
                className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-3 ${
                  !isFlooded
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                  !isFlooded ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  ✅
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    ไม่มีน้ำท่วม (ถนนแห้ง)
                    {!isFlooded && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    ถนนแห้ง สัญจรได้ตามปกติ ไม่มีน้ำท่วมขัง
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Choice 2: IF isFlooded is selected, dynamically reveal depth presets & custom textbox */}
          {isFlooded && (
            <div className="space-y-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-blue-600" />
                  2. ระดับความสูงของน้ำท่วม <span className="text-red-500">*</span>
                </Label>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  คลิกเลือกเพื่อเติมข้อความอัตโนมัติ
                </span>
              </div>

              {/* Quick Depth Preset Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WATER_LEVEL_PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-2 group ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 dark:ring-blue-800'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/40'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        {preset.icon}
                      </span>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                          {preset.label}
                        </div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {preset.approxCm}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Level Textbox */}
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="water-level-input" className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  หรือพิมพ์ระบุระดับน้ำเอง (เช่น เอว, ขา, ตาตุ่ม, มิดหัว, ท่วมฟุตบาท, ครึ่งล้อรถ):
                </Label>
                <Input
                  id="water-level-input"
                  type="text"
                  placeholder="เช่น ท่วมระดับฟุตบาท ประมาณ 15 ซม., ครึ่งล้อรถเก๋ง, มิดหัว..."
                  value={waterLevelDescription}
                  onChange={(e) => {
                    setWaterLevelDescription(e.target.value);
                    setSelectedPreset('custom');
                  }}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 text-xs sm:text-sm rounded-xl focus-visible:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Location Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                3. ตำแหน่งสถานที่และพิกัด <span className="text-red-500">*</span>
              </Label>

              {/* Auto-detect GPS button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="h-8 text-xs font-semibold rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    กำลังค้นหา GPS...
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                    📍 ใช้พิกัดปัจจุบันของฉัน
                  </>
                )}
              </Button>
            </div>

            {/* Road / Location name input */}
            <div className="space-y-1">
              <Label htmlFor="road-name" className="text-xs text-slate-600 dark:text-slate-400">
                ชื่อถนน / ซอย / จุดสังเกต:
              </Label>
              <Input
                id="road-name"
                type="text"
                placeholder="เช่น ถนนวิภาวดีรังสิต ขาเข้า (หน้า รพ.วิภาวดี), ซอยสุขุมวิท 39..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-10 text-xs sm:text-sm rounded-xl focus-visible:ring-blue-500"
                required
              />
            </div>

            {/* District Selector / Input */}
            <div className="space-y-1">
              <Label htmlFor="district-input" className="text-xs text-slate-600 dark:text-slate-400">
                เขต กทม. (เลือกหรือพิมพ์):
              </Label>
              <div className="flex gap-2">
                <Input
                  id="district-input"
                  type="text"
                  list="bangkok-districts-list"
                  placeholder="เช่น จตุจักร, บางซื่อ, ดินแดง, พระโขนง..."
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-10 text-xs sm:text-sm rounded-xl focus-visible:ring-blue-500 flex-1"
                />
                <datalist id="bangkok-districts-list">
                  {BANGKOK_DISTRICTS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Coordinates Selector / Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCoordinatePicker(!showCoordinatePicker)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>
                  พิกัดปัจจุบัน: [{coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}]
                </span>
                {showCoordinatePicker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCoordinatePicker && (
                <div className="mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Info className="w-3 h-3 text-slate-400" />
                    ระบุพิกัดละติจูด/ลองจิจูดโดยตรง หรือกดปุ่ม &quot;ใช้พิกัดปัจจุบัน&quot; ด้านบน
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-slate-500">Latitude (ละติจูด)</Label>
                      <Input
                        type="text"
                        value={customLat}
                        onChange={(e) => setCustomLat(e.target.value)}
                        placeholder="13.7563"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-slate-500">Longitude (ลองจิจูด)</Label>
                      <Input
                        type="text"
                        value={customLng}
                        onChange={(e) => setCustomLng(e.target.value)}
                        placeholder="100.5018"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleApplyCustomCoords}
                    className="w-full text-xs h-7 rounded-lg"
                  >
                    อัปเดตพิกัด
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Notes / Remarks */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-500" />
              4. ข้อความเพิ่มเติม / สภาพการจราจร (ไม่บังคับ)
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="เช่น รถเก๋งเล็กห้ามผ่าน, เลนขวายังพอวิ่งได้, น้ำกำลังเพิ่มระดับขึ้นเรื่อยๆ, มีรถดับติดอยู่ 2 คัน..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs sm:text-sm rounded-xl focus-visible:ring-blue-500 resize-none"
            />
          </div>

          {/* Dialog Action Buttons */}
          <DialogFooter className="flex flex-col-reverse sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs h-10 rounded-xl"
            >
              ยกเลิก
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !locationName.trim() || (isFlooded && !waterLevelDescription.trim())}
              className="w-full sm:w-auto text-xs sm:text-sm h-10 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  กำลังส่งข้อมูล...
                </>
              ) : (
                <>
                  🚀 ส่งรายงานสถานการณ์
                </>
              )}
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
};

export default BangkokFloodReportModal;
