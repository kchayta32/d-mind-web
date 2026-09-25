import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Droplets, Layers, Map, Clock, AlertOctagon, CloudRain, Satellite, Radio, PlusCircle } from 'lucide-react';
import { FloodMapProtocol } from '@/services/gistdaService';

interface FloodFiltersProps {
  floodTimeFilter: string;
  onFloodTimeFilterChange: (value: string) => void;
  showFloodFrequency: boolean;
  onShowFloodFrequencyChange: (show: boolean) => void;
  floodMapMode?: FloodMapProtocol;
  onFloodMapModeChange?: (value: FloodMapProtocol) => void;
  showWaterHyacinth?: boolean;
  onShowWaterHyacinthChange?: (show: boolean) => void;
  // Radar Overlay on Flood Map
  showRainRadar?: boolean;
  onShowRainRadarChange?: (show: boolean) => void;
  // Sentinel Satellite Layers
  showSentinel2TrueColor?: boolean;
  onShowSentinel2TrueColorChange?: (show: boolean) => void;
  showSentinel1Sar?: boolean;
  onShowSentinel1SarChange?: (show: boolean) => void;
  // Crowdsourcing Trigger
  onOpenCrowdsourceModal?: () => void;
}

export const FloodFilters: React.FC<FloodFiltersProps> = ({
  floodTimeFilter,
  onFloodTimeFilterChange,
  showFloodFrequency,
  onShowFloodFrequencyChange,
  floodMapMode = 'wmts',
  onFloodMapModeChange,
  showWaterHyacinth = false,
  onShowWaterHyacinthChange,
  showRainRadar = true,
  onShowRainRadarChange,
  showSentinel2TrueColor = false,
  onShowSentinel2TrueColorChange,
  showSentinel1Sar = false,
  onShowSentinel1SarChange,
  onOpenCrowdsourceModal
}) => {
  return (
    <div className="space-y-3.5">
      {/* 0. Primary Action: Crowdsource Citizen Flood Report Button */}
      {onOpenCrowdsourceModal && (
        <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <span>📢</span>
              <span>แจ้งเตือนภัยภาคประชาชน (Ground Truth)</span>
            </span>
            <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
              Real-time 24 ชม.
            </span>
          </div>
          <p className="text-[11px] text-blue-100 leading-tight">
            ดาวเทียมอัปเดตรอบละหลายวัน ร่วมรายงานระดับน้ำจริงพร้อมรูปถ่ายเพื่อยืนยันดาวเทียม (Ground Truth)
          </p>
          <Button
            type="button"
            size="sm"
            onClick={onOpenCrowdsourceModal}
            className="w-full bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs h-8 shadow-xs border-0 flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>กดรายงานน้ำท่วมด้วยตัวเอง</span>
          </Button>
        </div>
      )}

      {/* 1. Time Filter */}
      <div>
        <Label htmlFor="flood-time-filter" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>ช่วงเวลาตรวจวัดพื้นที่น้ำท่วม (GISTDA 2.0 & Sentinel)</span>
        </Label>
        <Select value={floodTimeFilter} onValueChange={onFloodTimeFilterChange}>
          <SelectTrigger id="flood-time-filter" className="w-full mt-1.5 text-xs bg-slate-50 border-slate-200">
            <SelectValue placeholder="เลือกช่วงเวลา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1day" className="text-xs">พื้นที่น้ำท่วม 1 วัน (ย้อนหลัง 1 วัน)</SelectItem>
            <SelectItem value="3days" className="text-xs">พื้นที่น้ำท่วมในรอบ 3 วันล่าสุด</SelectItem>
            <SelectItem value="7days" className="text-xs">พื้นที่น้ำท่วมในรอบ 7 วันล่าสุด</SelectItem>
            <SelectItem value="30days" className="text-xs">พื้นที่น้ำท่วมในรอบ 30 วันล่าสุด</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 2. TMD / Rain Doppler Radar Overlay Toggle (User Mission #2) */}
      {onShowRainRadarChange && (
        <div className="flex items-center justify-between p-2.5 bg-sky-50/80 dark:bg-slate-800/80 rounded-lg border border-sky-200 dark:border-slate-700">
          <div className="space-y-0.5">
            <Label htmlFor="rain-radar-overlay" className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5 cursor-pointer">
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              <span>ซ้อนทับเรดาร์น้ำฝนสด (TMD Radar)</span>
            </Label>
            <p className="text-[10px] text-slate-500 leading-tight">
              อัปเดตทุก 10-15 นาที ดูกลุ่มฝนปัจจุบันควบคู่พื้นที่น้ำท่วมขัง
            </p>
          </div>
          <Switch
            id="rain-radar-overlay"
            checked={showRainRadar}
            onCheckedChange={onShowRainRadarChange}
          />
        </div>
      )}

      {/* 3. Sentinel-1 & Sentinel-2 Satellite Layers Toggle */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5 text-indigo-500" />
          <span>ชั้นภาพถ่ายดาวเทียม Sentinel แบบฟรี (Copernicus)</span>
        </span>

        {/* Sentinel-2 True Color */}
        {onShowSentinel2TrueColorChange && (
          <div className="flex items-center justify-between pt-1">
            <Label htmlFor="sentinel2-layer" className="text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer">
              Sentinel-2 MSI Cloudless (ภาพสีจริง 10m)
            </Label>
            <Switch
              id="sentinel2-layer"
              checked={showSentinel2TrueColor}
              onCheckedChange={onShowSentinel2TrueColorChange}
            />
          </div>
        )}

        {/* Sentinel-1 C-SAR */}
        {onShowSentinel1SarChange && (
          <div className="flex items-center justify-between pt-1">
            <Label htmlFor="sentinel1-layer" className="text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer">
              Sentinel-1 C-SAR (เรดาร์ทะลุเมฆผิวน้ำ)
            </Label>
            <Switch
              id="sentinel1-layer"
              checked={showSentinel1Sar}
              onCheckedChange={onShowSentinel1SarChange}
            />
          </div>
        )}
      </div>

      {/* 4. Map Protocol Selector */}
      {onFloodMapModeChange && (
        <div>
          <Label htmlFor="flood-map-protocol" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-blue-500" />
            <span>โหมดการเรนเดอร์แผนที่ (Maps API)</span>
          </Label>
          <Select value={floodMapMode} onValueChange={(val) => onFloodMapModeChange(val as FloodMapProtocol)}>
            <SelectTrigger id="flood-map-protocol" className="w-full mt-1.5 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="เลือกรูปแบบแผนที่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wmts" className="text-xs">WMTS (Web Map Tile Service - แนะนำ)</SelectItem>
              <SelectItem value="tms" className="text-xs">TMS (Tile Map Service - Slippy Tiles)</SelectItem>
              <SelectItem value="wms" className="text-xs">WMS (Web Map Service - มาตรฐาน OGC)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 5. Flood Frequency Layer Toggle */}
      <div className="flex items-center justify-between p-2.5 bg-blue-50/60 dark:bg-slate-800/60 rounded-lg border border-blue-100 dark:border-slate-700">
        <div className="space-y-0.5">
          <Label htmlFor="flood-freq" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>ชั้นข้อมูลพื้นที่น้ำท่วมซ้ำซาก</span>
          </Label>
          <p className="text-[10px] text-slate-500">สรุปข้อมูลพื้นที่เกิดน้ำท่วมซ้ำซากจาก GISTDA</p>
        </div>
        <Switch
          id="flood-freq"
          checked={showFloodFrequency}
          onCheckedChange={onShowFloodFrequencyChange}
        />
      </div>

      {/* 6. Water Hyacinth Obstruction Layer Toggle */}
      {onShowWaterHyacinthChange && (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 dark:bg-slate-800/60 rounded-lg border border-emerald-100 dark:border-slate-700">
          <div className="space-y-0.5">
            <Label htmlFor="water-hyacinth" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
              <AlertOctagon className="w-3.5 h-3.5 text-emerald-600" />
              <span>สิ่งกีดขวางทางน้ำ (ผักตบชวา)</span>
            </Label>
            <p className="text-[10px] text-slate-500">ข้อมูลการสะสมของผักตบชวากีดขวางทางน้ำ</p>
          </div>
          <Switch
            id="water-hyacinth"
            checked={showWaterHyacinth}
            onCheckedChange={onShowWaterHyacinthChange}
          />
        </div>
      )}

      <div className="text-[11px] text-slate-500 p-2 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-700">
        <strong>Copernicus GloFAS & Sentinel:</strong> ตรวจวัดพื้นที่น้ำท่วมขังด้วยดาวเทียม Sentinel-1/2 ร่วมกับพยากรณ์อัตราการไหลของน้ำในแม่น้ำ 30 วัน
      </div>
    </div>
  );
};

export default FloodFilters;
