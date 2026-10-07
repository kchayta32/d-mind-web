import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, Layers, Flame, Map, Satellite, Activity } from 'lucide-react';
import { WildfireMapProtocol } from '@/services/gistdaService';
import { FirmsSatelliteSource } from '@/services/nasaFirmsService';

interface WildfireFiltersProps {
  wildfireTimeFilter: string;
  onWildfireTimeFilterChange: (value: string) => void;
  showBurnFreq: boolean;
  onShowBurnFreqChange: (value: boolean) => void;
  showBurnScar?: boolean;
  onShowBurnScarChange?: (value: boolean) => void;
  wildfireMapMode?: WildfireMapProtocol;
  onWildfireMapModeChange?: (value: WildfireMapProtocol) => void;
  showFirmsLayer?: boolean;
  onShowFirmsLayerChange?: (value: boolean) => void;
  firmsSatellite?: FirmsSatelliteSource;
  onFirmsSatelliteChange?: (value: FirmsSatelliteSource) => void;
}

export const WildfireFilters: React.FC<WildfireFiltersProps> = ({
  wildfireTimeFilter,
  onWildfireTimeFilterChange,
  showBurnFreq,
  onShowBurnFreqChange,
  showBurnScar = false,
  onShowBurnScarChange,
  wildfireMapMode = 'wmts',
  onWildfireMapModeChange,
  showFirmsLayer = true,
  onShowFirmsLayerChange,
  firmsSatellite = 'ALL',
  onFirmsSatelliteChange,
}) => {
  return (
    <div className="space-y-3.5">
      {/* 1. Time Filter */}
      <div>
        <Label htmlFor="wildfire-time-filter" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>ช่วงเวลาจุดเกิดไฟป่า VIIRS (GISTDA 2.0)</span>
        </Label>
        <Select value={wildfireTimeFilter} onValueChange={onWildfireTimeFilterChange}>
          <SelectTrigger id="wildfire-time-filter" className="w-full mt-1.5 text-xs bg-slate-50 border-slate-200">
            <SelectValue placeholder="เลือกช่วงเวลา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1day" className="text-xs">จุดเกิดไฟป่าวันนี้ (ย้อนหลัง 1 วัน)</SelectItem>
            <SelectItem value="3days" className="text-xs">จุดเกิดไฟป่าในรอบ 3 วันล่าสุด</SelectItem>
            <SelectItem value="7days" className="text-xs">จุดเกิดไฟป่าในรอบ 7 วันล่าสุด</SelectItem>
            <SelectItem value="30days" className="text-xs">จุดเกิดไฟป่าในรอบ 30 วันล่าสุด</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 2. Map Protocol Selector */}
      {onWildfireMapModeChange && (
        <div>
          <Label htmlFor="wildfire-map-protocol" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-blue-500" />
            <span>โหมดการเรนเดอร์แผนที่ (Maps API)</span>
          </Label>
          <Select value={wildfireMapMode} onValueChange={(val) => onWildfireMapModeChange(val as WildfireMapProtocol)}>
            <SelectTrigger id="wildfire-map-protocol" className="w-full mt-1.5 text-xs bg-slate-50 border-slate-200">
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

      {/* 3. Burn Frequency Layer Toggle */}
      <div className="flex items-center justify-between p-2.5 bg-orange-50/60 dark:bg-slate-800/60 rounded-lg border border-orange-100 dark:border-slate-700">
        <div className="space-y-0.5">
          <Label htmlFor="burn-freq" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>ชั้นข้อมูลพื้นที่เผาไหม้ซ้ำซาก</span>
          </Label>
          <p className="text-[10px] text-slate-500">ข้อมูลสถิติพื้นที่เกิดไฟป่าซ้ำซากจาก GISTDA</p>
        </div>
        <Switch
          id="burn-freq"
          checked={showBurnFreq}
          onCheckedChange={onShowBurnFreqChange}
        />
      </div>

      {/* 4. Burn Scar Layer Toggle */}
      {onShowBurnScarChange && (
        <div className="flex items-center justify-between p-2.5 bg-red-50/60 dark:bg-slate-800/60 rounded-lg border border-red-100 dark:border-slate-700">
          <div className="space-y-0.5">
            <Label htmlFor="burn-scar" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>ชั้นข้อมูลพื้นที่ร่องรอยเผาไหม้</span>
            </Label>
            <p className="text-[10px] text-slate-500">ร่องรอยการเผาไหม้รายสัปดาห์ (Weekly Burn Scar)</p>
          </div>
          <Switch
            id="burn-scar"
            checked={showBurnScar}
            onCheckedChange={onShowBurnScarChange}
          />
        </div>
      )}

      {/* 5. NASA FIRMS Real-time Thermal Anomalies Web-GIS Layer Toggle */}
      {onShowFirmsLayerChange && (
        <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:bg-slate-800/80 rounded-lg border border-amber-300 dark:border-amber-700/60 shadow-xs">
          <div className="space-y-0.5 pr-2">
            <Label htmlFor="firms-layer" className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 cursor-pointer">
              <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>NASA FIRMS Thermal Anomalies (Web-GIS)</span>
            </Label>
            <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
              จุดความร้อน Near Real-Time (ภายใน 3 ชม.) จากดาวเทียม MODIS/VIIRS พร้อมวัดค่า FRP (MW)
            </p>
          </div>
          <Switch
            id="firms-layer"
            checked={showFirmsLayer}
            onCheckedChange={onShowFirmsLayerChange}
          />
        </div>
      )}

      {/* 6. NASA FIRMS Satellite Sensor Selector */}
      {showFirmsLayer && onFirmsSatelliteChange && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
          <Label htmlFor="firms-satellite" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-orange-500" />
            <span>เซนเซอร์ดาวเทียม NASA FIRMS</span>
          </Label>
          <Select value={firmsSatellite} onValueChange={(val) => onFirmsSatelliteChange(val as FirmsSatelliteSource)}>
            <SelectTrigger id="firms-satellite" className="w-full text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="เลือกดาวเทียม" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">VIIRS (375m) + MODIS (1km) ทุกระบบ</SelectItem>
              <SelectItem value="VIIRS_375M" className="text-xs">VIIRS 375m (Suomi NPP / NOAA-20 / NOAA-21)</SelectItem>
              <SelectItem value="MODIS_1KM" className="text-xs">MODIS 1km (Terra & Aqua ตรวจ 4 รอบ/วัน)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[9px] text-slate-500 dark:text-slate-400">
            *VIIRS 375m คมชัดกว่า 3 เท่า ตรวจจับไฟเริ่มแรกได้ดีกว่า | MODIS บันทึกสถิติต่อเนื่องยาวนาน
          </p>
        </div>
      )}
    </div>
  );
};

export default WildfireFilters;
