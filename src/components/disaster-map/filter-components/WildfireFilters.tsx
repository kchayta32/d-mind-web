import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, Layers, Flame, Map } from 'lucide-react';
import { WildfireMapProtocol } from '@/services/gistdaService';

interface WildfireFiltersProps {
  wildfireTimeFilter: string;
  onWildfireTimeFilterChange: (value: string) => void;
  showBurnFreq: boolean;
  onShowBurnFreqChange: (value: boolean) => void;
  showBurnScar?: boolean;
  onShowBurnScarChange?: (value: boolean) => void;
  wildfireMapMode?: WildfireMapProtocol;
  onWildfireMapModeChange?: (value: WildfireMapProtocol) => void;
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
    </div>
  );
};

export default WildfireFilters;
