import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Radio, 
  AlertTriangle, 
  Waves, 
  MapPin,
  Flame
} from 'lucide-react';

export interface MapLegendProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({ 
  className = '', 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div 
      className={`bg-slate-900/92 backdrop-blur-md border border-slate-800/90 text-slate-200 rounded-xl shadow-2xl transition-all duration-300 pointer-events-auto select-none ${
        isExpanded ? 'w-80 md:w-88' : 'w-auto'
      } ${className}`}
    >
      {/* Legend Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-slate-800/50 rounded-xl transition-colors text-left"
        aria-expanded={isExpanded}
        aria-label="Toggle map legend"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-100 uppercase block font-mono">
              สัญลักษณ์แผนที่
            </span>
            <span className="text-[10px] text-slate-400 font-sans block">
              Cartographic Legend & Wavefronts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200">
          <span className="text-[11px] font-mono hidden sm:inline-block">
            {isExpanded ? 'ย่อ' : 'ขยาย'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-3.5 pt-1 space-y-4 max-h-[75vh] overflow-y-auto border-t border-slate-800/80 text-xs">
          
          {/* Section 1: Dynamic Shockwave Rings */}
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Waves className="w-3.5 h-3.5" />
              <span>การแพร่กระจายคลื่น (Shockwave Dynamics)</span>
            </div>
            <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
              <div className="flex items-start gap-2.5">
                <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-400/20 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-300">P-Wavefront (ปฐมภูมิ)</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                      ~6.0 km/s
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">
                    คลื่นอัดตัวความเร็วสูง เดินทางถึงสถานีตรวจวัดก่อน ใช้ประมวลผลระบบ Early Warning
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-rose-500/30 shrink-0 mt-0.5 animate-ping" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-500" />
                      S-Wavefront (ทุติยภูมิ)
                    </span>
                    <span className="text-[10px] text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                      ~3.5 km/s
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">
                    คลื่นเฉือนทำลายล้างสูง ก่อให้เกิดการสั่นสะเทือนรุนแรงและสร้างความเสียหายหลักแก่อาคาร
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-dashed border-amber-400 bg-amber-400/10 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-300">Felt Intensity Boundary</span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                      MMI ≥ II
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">
                    ขอบเขตประเมินรัศมีการรับรู้แรงสั่นสะเทือนของมนุษย์
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Thailand Active Faults */}
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>แนวรอยเลื่อนมีพลังในไทย (Active Faults)</span>
            </div>
            <div className="space-y-1.5 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  <span className="text-slate-200 text-[11px]">ความเสี่ยงสูง (High Risk)</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400">ศักยภาพ M ≥ 6.5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span className="text-slate-200 text-[11px]">ความเสี่ยงปานกลาง (Moderate)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">ศักยภาพ M 6.0 - 6.4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-slate-200 text-[11px]">เฝ้าระวัง (Low / Monitored)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">ศักยภาพ M &lt; 6.0</span>
              </div>
            </div>
          </div>

          {/* Section 3: Seismic Stations Network */}
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5" />
              <span>สถานีตรวจวัดคลื่นไหวสะเทือน (Seismic Stations)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                <span className="text-slate-300">Online ปกติ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                <span className="text-slate-300">Warning เฝ้าระวัง</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-rose-400 font-semibold">Triggered สั่นไหว</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="text-slate-400">Offline ขาดการเชื่อมต่อ</span>
              </div>
            </div>
          </div>

          {/* Section 4: Epicenter & User Location */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>จุดศูนย์กลาง & ตำแหน่งผู้ใช้ (Targets)</span>
            </div>
            <div className="space-y-1.5 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 text-[11px]">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                  ★
                </div>
                <div className="flex-1">
                  <span className="text-slate-200 font-semibold">ศูนย์กลางแผ่นดินไหว (Epicenter)</span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    ระบุระดับแมกนิจูด (M) และความลึกรอยเลื่อน
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white flex items-center justify-center text-slate-950">
                  <MapPin className="w-2.5 h-2.5 text-slate-950" />
                </div>
                <div className="flex-1">
                  <span className="text-cyan-300 font-semibold">ตำแหน่งของคุณ (User Location)</span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    แสดงระยะห่าง Geodesic, เวลาเตือนภัยล่วงหน้า (Lead Time), และรัศมีปลอดภัย
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default MapLegend;
