import React, { useState } from 'react';
import { Flame, Satellite, ChevronDown, ChevronUp, Zap, Info, ShieldAlert } from 'lucide-react';
import { FRP_CLASSIFICATIONS, calculateHotspotFirmsStats } from '@/services/nasaFirmsService';
import { GISTDAHotspot } from './useGISTDAData';

interface FirmsFrpLegendProps {
  hotspots?: GISTDAHotspot[];
  className?: string;
}

export const FirmsFrpLegend: React.FC<FirmsFrpLegendProps> = ({
  hotspots = [],
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const stats = calculateHotspotFirmsStats(hotspots);

  return (
    <div className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-orange-200 dark:border-orange-950/80 shadow-xl overflow-hidden transition-all duration-300 pointer-events-auto max-w-[320px] text-xs ${className}`}>
      
      {/* Header bar */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-3.5 py-2.5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 border-b border-orange-100 dark:border-orange-950 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-[12px] text-slate-900 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
              <span>NASA FIRMS</span>
              <span className="text-[9px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800 px-1 py-0.2 rounded font-mono font-bold">
                NRT ≤ 3h
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              ความผิดปกติทางความร้อน (Thermal Anomalies)
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label={isCollapsed ? 'ขยายคำอธิบาย' : 'ย่อคำอธิบาย'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-3 space-y-2.5">
          {/* Key Concept: Fire Radiative Power (FRP) Definition */}
          <div className="bg-orange-50/80 dark:bg-orange-950/40 p-2 rounded-xl border border-orange-200/70 dark:border-orange-900/50 space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-900 dark:text-orange-300">
              <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Fire Radiative Power (FRP)</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
              ค่าพลังงานความร้อนที่ปล่อยออกมาจากกองไฟโดยตรง มีหน่วยวัดเป็น <b>เมกะวัตต์ (MW)</b> เพื่อประเมินความรุนแรงและอัตราการเผาไหม้
            </p>
          </div>

          {/* FRP Color Scale */}
          <div>
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>เฉดสีระดับพลังงานความร้อน (FRP)</span>
              <span>หน่วย MW</span>
            </div>
            <div className="space-y-1.5">
              {/* Extreme */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-950/10 dark:bg-red-950/40 border border-red-900/20 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#7f1d1d] ring-2 ring-red-400 shadow-xs flex-shrink-0 animate-ping opacity-75"></span>
                  <span className="font-bold text-red-950 dark:text-red-300">≥ 100 MW</span>
                </div>
                <span className="text-[10px] text-red-800 dark:text-red-300 font-semibold">วิกฤตจัด (ไฟยอดไม้)</span>
              </div>

              {/* High */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/50 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#dc2626] shadow-xs flex-shrink-0"></span>
                  <span className="font-bold text-red-700 dark:text-red-400">50 - 99 MW</span>
                </div>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">รุนแรงสูง (ไฟลุกลาม)</span>
              </div>

              {/* Moderate */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ea580c] shadow-xs flex-shrink-0"></span>
                  <span className="font-bold text-orange-700 dark:text-orange-400">20 - 49 MW</span>
                </div>
                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">ปานกลาง</span>
              </div>

              {/* Low */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#eab308] shadow-xs flex-shrink-0"></span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">&lt; 20 MW</span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">เริ่มต้น / ไฟคุกรุ่น</span>
              </div>
            </div>
          </div>

          {/* Sensor Satellite Symbols */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ดาวเทียมตรวจจับ (Sensors)
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 border border-white"></span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">VIIRS 375m</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white"></span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">MODIS 1km</span>
              </div>
            </div>
          </div>

          {/* Live Summary telemetry if available */}
          {stats.totalHotspots > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg">
                <div className="text-slate-400">พลังงานรวม (Total FRP)</div>
                <div className="font-bold text-orange-600 dark:text-orange-400 text-xs">
                  {stats.totalFrpMw.toLocaleString()} MW
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg">
                <div className="text-slate-400">จุดสูงสุด (Peak FRP)</div>
                <div className="font-bold text-red-600 dark:text-red-400 text-xs">
                  {stats.maxFrpMw} MW
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default FirmsFrpLegend;
