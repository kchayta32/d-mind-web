import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Flame, Clock, Layers } from 'lucide-react';

interface WildfireFiltersProps {
  wildfireTimeFilter: string;
  onWildfireTimeFilterChange: (value: string) => void;
  showBurnFreq: boolean;
  onShowBurnFreqChange: (value: boolean) => void;
}

export const WildfireFilters: React.FC<WildfireFiltersProps> = ({
  wildfireTimeFilter,
  onWildfireTimeFilterChange,
  showBurnFreq,
  onShowBurnFreqChange
}) => {
  return (
    <div className="space-y-3.5">
      <div>
        <Label htmlFor="wildfire-time-filter" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>ช่วงเวลาตรวจจับจุดความร้อน (VIIRS / MODIS)</span>
        </Label>
        <Select value={wildfireTimeFilter} onValueChange={onWildfireTimeFilterChange}>
          <SelectTrigger id="wildfire-time-filter" className="w-full mt-1.5 text-xs bg-slate-50 border-slate-200">
            <SelectValue placeholder="เลือกช่วงเวลา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1day" className="text-xs">24 ชั่วโมงล่าสุด (1 วัน)</SelectItem>
            <SelectItem value="3days" className="text-xs">3 วันล่าสุด</SelectItem>
            <SelectItem value="7days" className="text-xs">7 วันล่าสุด</SelectItem>
            <SelectItem value="30days" className="text-xs">30 วันล่าสุด (1 เดือน)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between p-2.5 bg-orange-50/60 dark:bg-slate-800/60 rounded-lg border border-orange-100 dark:border-slate-700">
        <div className="space-y-0.5">
          <Label htmlFor="burn-freq" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>ชั้นข้อมูลพื้นที่เผาไหม้ซ้ำซาก (WMS)</span>
          </Label>
          <p className="text-[10px] text-slate-500">วิเคราะห์พื้นที่เสี่ยงไฟป่าซ้ำซากจาก GISTDA</p>
        </div>
        <Switch
          id="burn-freq"
          checked={showBurnFreq}
          onCheckedChange={onShowBurnFreqChange}
        />
      </div>
    </div>
  );
};

export default WildfireFilters;
