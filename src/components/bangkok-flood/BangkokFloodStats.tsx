import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Waves, 
  TrendingUp, 
  ArrowUpRight
} from 'lucide-react';
import { 
  BangkokRoadSegment, 
  BangkokCctvCamera, 
  BangkokCanalStation, 
  BangkokSeverity 
} from './BangkokFloodMap';

export interface BangkokFloodStatsProps {
  roads: BangkokRoadSegment[];
  cctvs: BangkokCctvCamera[];
  waterStations: BangkokCanalStation[];
  selectedSeverity?: BangkokSeverity;
  onSelectSeverityFilter?: (severity: BangkokSeverity) => void;
  className?: string;
}

export const BangkokFloodStats: React.FC<BangkokFloodStatsProps> = ({
  roads = [],
  cctvs = [],
  waterStations = [],
  selectedSeverity = 'all',
  onSelectSeverityFilter,
  className = ''
}) => {
  // Aggregate real-time metrics
  const criticalRoads = roads.filter(r => r.status === 'critical');
  const warningRoads = roads.filter(r => r.status === 'warning');
  const normalRoads = roads.filter(r => r.status === 'normal');

  const onlineCctvs = cctvs.filter(c => c.status === 'online');
  
  // Calculate canal status & pumps capacity
  const totalPumpsActive = waterStations.reduce((sum, s) => sum + (s.pumpsRunning || 0), 0);
  const totalPumpsCapacity = waterStations.reduce((sum, s) => sum + (s.totalPumps || 0), 0);
  const highWaterCanals = waterStations.filter(s => s.status === 'critical');

  const maxWaterLevelCm = roads.length > 0 ? Math.max(...roads.map(r => r.waterLevelCm)) : 0;

  return (
    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 ${className}`}>
      
      {/* 1. Critical Flooded Roads (แดง - หลีกเลี่ยง) */}
      <div 
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(selectedSeverity === 'critical' ? 'all' : 'critical')}
        className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
          selectedSeverity === 'critical'
            ? 'ring-2 ring-red-500 bg-red-500/10 border-red-500 shadow-lg shadow-red-500/10'
            : 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-950 hover:border-red-300 dark:hover:border-red-800 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            ท่วมวิกฤต (หลีกเลี่ยง)
          </span>
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {criticalRoads.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">เส้นทาง</span>
          </div>
          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
            สูงสุด {maxWaterLevelCm} ซม.
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>รถเล็กห้ามผ่านเด็ดขาด</span>
          <span className="text-red-500 font-medium flex items-center gap-0.5">
            คลิกเพื่อกรอง <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 2. Warning Flooded Roads (ส้ม - ขับช้า ระวัง) */}
      <div 
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(selectedSeverity === 'warning' ? 'all' : 'warning')}
        className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
          selectedSeverity === 'warning'
            ? 'ring-2 ring-amber-500 bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
            : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-950 hover:border-amber-300 dark:hover:border-amber-800 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            เฝ้าระวัง (ขับช้า ระวัง)
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {warningRoads.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">เส้นทาง</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
            ท่วมเลนซ้าย
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>ระดับน้ำขัง 10-20 ซม.</span>
          <span className="text-amber-500 font-medium flex items-center gap-0.5">
            คลิกเพื่อกรอง <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 3. Normal Roads (เขียว - ใช้ได้ตามปกติ) */}
      <div 
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(selectedSeverity === 'normal' ? 'all' : 'normal')}
        className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
          selectedSeverity === 'normal'
            ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
            : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-950 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            สภาพการจราจรปกติ
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {normalRoads.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">เส้นทาง</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
            ผิวทางแห้ง
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>สัญจรได้คล่องตัวทุกคัน</span>
          <span className="text-emerald-500 font-medium flex items-center gap-0.5">
            คลิกเพื่อกรอง <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* 4. Ready CCTV Cameras */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            กล้อง CCTV พร้อมใช้งาน
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {onlineCctvs.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/{cctvs.length} จุด</span>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
            ออนไลน์ {Math.round((onlineCctvs.length / Math.max(1, cctvs.length)) * 100)}%
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>สตรีมสด/ภาพนิ่งจราจร</span>
          <span className="text-blue-500 font-medium">BMA Surveillance</span>
        </div>
      </div>

      {/* 5. Main Canal Water Gauge & Pumps */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            ระดับน้ำคลอง & สูบน้ำ
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Waves className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalPumpsActive}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/{totalPumpsCapacity} เครื่อง</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            highWaterCanals.length > 0
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
              : 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-900'
          }`}>
            {highWaterCanals.length > 0 ? `คลองวิกฤต ${highWaterCanals.length} แห่ง` : 'ระดับน้ำปกติ'}
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>สูบระบายลงสู่เจ้าพระยา</span>
          <span className="text-cyan-600 font-medium">
            {totalPumpsCapacity > 0 ? `เดินเครื่อง ${Math.round((totalPumpsActive / totalPumpsCapacity) * 100)}%` : 'เดินเครื่อง'}
          </span>
        </div>
      </div>

    </div>
  );
};

export default BangkokFloodStats;
