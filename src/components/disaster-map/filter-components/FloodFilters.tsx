import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Droplets, Layers, Map, Clock, AlertOctagon } from 'lucide-react';
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
}

export const FloodFilters: React.FC<FloodFiltersProps> = ({
  floodTimeFilter,
  onFloodTimeFilterChange,
  showFloodFrequency,
  onShowFloodFrequencyChange,
  floodMapMode = 'wmts',
  onFloodMapModeChange,
  showWaterHyacinth = false,
  onShowWaterHyacinthChange
}) => {
  return (
    <div className="space-y-3.5">
      {/* 1. Time Filter */}
      <div>
        <Label htmlFor="flood-time-filter" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>ช่วงเวลาตรวจวัดพื้นที่น้ำท่วม (GISTDA 2.0)</span>
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

      {/* 2. Map Protocol Selector */}
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

      {/* 3. Flood Frequency Layer Toggle */}
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

      {/* 4. Water Hyacinth Obstruction Layer Toggle */}
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
        <strong>Copernicus GloFAS:</strong> แสดงอัตราการไหลของน้ำในแม่น้ำสายสำคัญ พร้อมพยากรณ์ล่วงหน้า 30 วัน
      </div>
    </div>
  );
};

export default FloodFilters;
