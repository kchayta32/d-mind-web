import React from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Filter, 
  Camera, 
  Waves, 
  Satellite, 
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BangkokZone, BangkokSeverity } from './BangkokFloodMap';

export interface BangkokFloodControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedZone: BangkokZone;
  onZoneChange: (zone: BangkokZone) => void;
  selectedSeverity: BangkokSeverity;
  onSeverityChange: (severity: BangkokSeverity) => void;
  showCctvLayer: boolean;
  onToggleCctv: (val: boolean) => void;
  showCanalPumpsLayer: boolean;
  onToggleCanalPumps: (val: boolean) => void;
  showSentinelSarLayer: boolean;
  onToggleSentinelSar: (val: boolean) => void;
  totalRoadsCount?: number;
  filteredRoadsCount?: number;
  onResetFilters?: () => void;
  className?: string;
}

const ZONES_CONFIG: { id: BangkokZone; label: string; subtext: string }[] = [
  { id: 'all', label: 'ทุกโซน', subtext: 'กทม. ทั้งหมด' },
  { id: 'north', label: 'โซนเหนือ', subtext: 'วิภาวดี/ลาดพร้าว/ดอนเมือง' },
  { id: 'central', label: 'โซนกลาง', subtext: 'สุขุมวิท/พระราม 4/เพชรบุรี' },
  { id: 'east', label: 'โซนตะวันออก', subtext: 'ศรีนครินทร์/บางนา/ประเวศ' },
  { id: 'thonburi', label: 'ฝั่งธนบุรี', subtext: 'จรัญฯ/เพชรเกษม/ราชพฤกษ์' },
];

const SEVERITY_CONFIG: { id: BangkokSeverity; label: string; icon: any; colorClass: string; activeClass: string }[] = [
  { 
    id: 'all', 
    label: 'ทั้งหมด', 
    icon: SlidersHorizontal, 
    colorClass: 'text-slate-600 dark:text-slate-300',
    activeClass: 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-800 dark:border-slate-100'
  },
  { 
    id: 'critical', 
    label: '🔴 หลีกเลี่ยง (วิกฤต)', 
    icon: AlertOctagon, 
    colorClass: 'text-red-600 dark:text-red-400',
    activeClass: 'bg-red-500 text-white border-red-600 shadow-sm shadow-red-200 dark:shadow-red-900/30'
  },
  { 
    id: 'warning', 
    label: '🟠 ขับช้า ระวัง', 
    icon: AlertTriangle, 
    colorClass: 'text-amber-600 dark:text-amber-400',
    activeClass: 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200 dark:shadow-amber-900/30'
  },
  { 
    id: 'normal', 
    label: '🟢 ใช้ได้ตามปกติ', 
    icon: CheckCircle2, 
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30'
  },
];

export const BangkokFloodControls: React.FC<BangkokFloodControlsProps> = ({
  searchQuery,
  onSearchChange,
  selectedZone,
  onZoneChange,
  selectedSeverity,
  onSeverityChange,
  showCctvLayer,
  onToggleCctv,
  showCanalPumpsLayer,
  onToggleCanalPumps,
  showSentinelSarLayer,
  onToggleSentinelSar,
  totalRoadsCount = 0,
  filteredRoadsCount = 0,
  onResetFilters,
  className = ''
}) => {
  const isFiltered = searchQuery !== '' || selectedZone !== 'all' || selectedSeverity !== 'all';

  return (
    <div className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4 ${className}`}>
      
      {/* 1. Search Bar & Status Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with clear button */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="พิมพ์ชื่อถนนที่ต้องการค้นหา เช่น สุขุมวิท, วิภาวดี, ลาดพร้าว, พระราม 4..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 rounded-xl text-sm focus-visible:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              title="ล้างข้อความค้นหา"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Reset Button */}
        {isFiltered && onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-11 px-3 border-dashed border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            รีเซ็ตตัวกรอง ({filteredRoadsCount}/{totalRoadsCount} เส้นทาง)
          </Button>
        )}
      </div>

      {/* 2. Zone Selection Buttons / Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            เลือกพื้นที่โซน กทม.
          </Label>
          <span className="text-[11px] text-slate-400">
            แสดงผล {filteredRoadsCount} จากทั้งหมด {totalRoadsCount} ถนน
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ZONES_CONFIG.map(zone => {
            const isActive = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => onZoneChange(zone.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs font-bold">{zone.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                  {zone.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Status / Severity Filter Chips */}
      <div>
        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-2">
          <Filter className="w-3.5 h-3.5 text-amber-500" />
          ระดับความรุนแรง / สภาพการจราจร
        </Label>
        <div className="flex flex-wrap items-center gap-2">
          {SEVERITY_CONFIG.map(sev => {
            const isActive = selectedSeverity === sev.id;
            return (
              <button
                key={sev.id}
                onClick={() => onSeverityChange(sev.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? sev.activeClass
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{sev.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Layer Toggles */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            เปิด-ปิดชั้นข้อมูลบนแผนที่:
          </span>

          <div className="flex flex-wrap items-center gap-4">
            {/* CCTV Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Switch
                id="toggle-cctv"
                checked={showCctvLayer}
                onCheckedChange={onToggleCctv}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="toggle-cctv" className="text-xs cursor-pointer flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <Camera className="w-3.5 h-3.5 text-blue-500" />
                กล้อง CCTV จราจร
              </Label>
            </div>

            {/* Canal & Pumps Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Switch
                id="toggle-canal"
                checked={showCanalPumpsLayer}
                onCheckedChange={onToggleCanalPumps}
                className="data-[state=checked]:bg-cyan-600"
              />
              <Label htmlFor="toggle-canal" className="text-xs cursor-pointer flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <Waves className="w-3.5 h-3.5 text-cyan-500" />
                คลอง & สถานีสูบน้ำ
              </Label>
            </div>

            {/* Sentinel-1 SAR Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Switch
                id="toggle-sentinel"
                checked={showSentinelSarLayer}
                onCheckedChange={onToggleSentinelSar}
                className="data-[state=checked]:bg-sky-600"
              />
              <Label htmlFor="toggle-sentinel" className="text-xs cursor-pointer flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <Satellite className="w-3.5 h-3.5 text-sky-500" />
                ดาวเทียม Sentinel-1 SAR
              </Label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BangkokFloodControls;
