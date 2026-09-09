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
  Flame,
  Droplets,
  Mountain,
  Wind
} from 'lucide-react';
import { DisasterType } from '../../types/disaster';

export interface MapLegendProps {
  className?: string;
  defaultExpanded?: boolean;
  activeDisaster?: DisasterType;
}

export const MapLegend: React.FC<MapLegendProps> = ({ 
  className = '', 
  defaultExpanded = false,
  activeDisaster = 'earthquake'
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
          
          {/* If Disaster is TSUNAMI */}
          {activeDisaster === 'tsunami' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <Waves className="w-3.5 h-3.5" />
                <span>ทุ่นและหอเตือนภัยสึนามิ (Tsunami Network)</span>
              </div>
              <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-white shadow-[0_0_8px_#3b82f6] shrink-0" />
                  <div>
                    <span className="font-semibold text-blue-300">ทุ่นน้ำลึก DART (23401, 23461)</span>
                    <p className="text-[10px] text-slate-400 font-sans">ตรวจจับการเปลี่ยนระดับผิวน้ำทะเลเชื่อมต่อดาวเทียม</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-cyan-300">หอเตือนภัยชายฝั่ง (Siren Towers)</span>
                    <p className="text-[10px] text-slate-400 font-sans">กระจายเสียง 5 ภาษา พร้อมไฟสัญญาณและเส้นทางอพยพ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full border border-blue-400/50 bg-blue-500/20 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-300">รัศมีเฝ้าระวังคลื่นซัดฝั่ง</span>
                    <p className="text-[10px] text-slate-400 font-sans">ขอบเขตพื้นที่ลุ่มต่ำชายฝั่งทะเลอันดามัน 6 จังหวัด</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Disaster is FLOOD */}
          {activeDisaster === 'flood' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <Droplets className="w-3.5 h-3.5" />
                <span>โทรมาตรลุ่มน้ำและจุดเสี่ยงน้ำท่วม (Flood Network)</span>
              </div>
              <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-[0_0_8px_#f59e0b] shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-300">เขื่อนหลัก / จุดควบคุมน้ำ (C.13)</span>
                    <p className="text-[10px] text-slate-400 font-sans">อัตราการระบายน้ำและการแจ้งเตือนท้ายเขื่อน</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-sky-500 border border-slate-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-sky-300">สถานีวัดระดับน้ำแม่น้ำ (P.1, M.7, N.1)</span>
                    <p className="text-[10px] text-slate-400 font-sans">เปรียบเทียบระดับน้ำจริงกับขอบตลิ่งวิกฤต</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full border border-sky-400/50 bg-sky-500/20 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-300">รัศมีเสี่ยงน้ำท่วมฉับพลัน</span>
                    <p className="text-[10px] text-slate-400 font-sans">พื้นที่ลุ่มต่ำที่ต้องยกของขึ้นที่สูง</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Disaster is LANDSLIDE */}
          {activeDisaster === 'landslide' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <Mountain className="w-3.5 h-3.5" />
                <span>จุดเฝ้าระวังดินโคลนถล่ม (Landslide Risk)</span>
              </div>
              <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white shadow-[0_0_8px_#ef4444] shrink-0 animate-ping" />
                  <div>
                    <span className="font-semibold text-rose-400">จุดวิกฤตดินสไลด์ (ดอยแม่สลอง)</span>
                    <p className="text-[10px] text-slate-400 font-sans">ฝนสะสมเกิน 150 มม. ความอิ่มตัวในดิน &gt; 90%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-slate-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-300">จุดเฝ้าระวังลาดเชิงเขา (ดอยสุเทพ, เขาค้อ)</span>
                    <p className="text-[10px] text-slate-400 font-sans">พื้นที่ลาดชันสูงตามแนวรอยเลื่อนและลำห้วย</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Disaster is STORM */}
          {activeDisaster === 'storm' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <Wind className="w-3.5 h-3.5" />
                <span>พายุหมุนและเรดาร์ตรวจอากาศ (Storm Tracking)</span>
              </div>
              <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-white shadow-[0_0_10px_#a855f7] shrink-0 animate-pulse" />
                  <div>
                    <span className="font-semibold text-purple-300">ศูนย์กลางพายุหมุน (Depression 02W)</span>
                    <p className="text-[10px] text-slate-400 font-sans">ความเร็วลม 55-65 กม./ชม. พร้อมเส้นทางเคลื่อนที่</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-400 border border-slate-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-indigo-300">สถานีเรดาร์ตรวจอากาศ (สัตหีบ, ภูเก็ต)</span>
                    <p className="text-[10px] text-slate-400 font-sans">ตรวจจับการก่อตัวของกลุ่มฝนลมกระโชกแรง</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Disaster is WILDFIRE */}
          {activeDisaster === 'wildfire' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-orange-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>จุดความร้อนและไฟป่า (Hotspots VIIRS/MODIS)</span>
              </div>
              <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border border-white shadow-[0_0_10px_#f97316] shrink-0 animate-pulse" />
                  <div>
                    <span className="font-semibold text-orange-400">จุดความร้อนวิกฤต (อมก๋อย, ปาย)</span>
                    <p className="text-[10px] text-slate-400 font-sans">ไฟป่าสะสมต่อเนื่อง &gt; 15 จุด และ PM2.5 สูงเกินเกณฑ์</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-slate-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-300">แนวเฝ้าระวังไฟป่า (ดอยภูคา, ไทรโยค)</span>
                    <p className="text-[10px] text-slate-400 font-sans">การสร้างแนวกันไฟและตรวจการณ์ดาวเทียม</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Disaster is VOLCANO */}
          {activeDisaster === 'volcano' && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ภูเขาไฟและเถ้าถ่านในอาเซียน (Volcanic Alert)</span>
              </div>
              <div className="space-y-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white shadow-[0_0_10px_#e11d48] shrink-0 animate-ping" />
                  <div>
                    <span className="font-semibold text-rose-300">ภูเขาไฟปะทุรุนแรง (มารูปี สุมาตรา)</span>
                    <p className="text-[10px] text-slate-400 font-sans">สถานะ Siaga (Level III) กลุ่มเถ้าถ่านสูง &gt; 3,000 ม.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-slate-900 shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-300">ภูเขาไฟเฝ้าระวัง (ซีนาบุง, อานัก กรากะตัว)</span>
                    <p className="text-[10px] text-slate-400 font-sans">แจ้งเตือนภัยการบิน (VONA) และความเสี่ยงคลื่นยักษ์</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Default: EARTHQUAKE */}
          {activeDisaster === 'earthquake' && (
            <>
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
            </>
          )}

          {/* Epicenter & User Location (Common to all modes) */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>พิกัดอ้างอิง (GIS References)</span>
            </div>
            <div className="space-y-1.5 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 text-[11px]">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white flex items-center justify-center text-slate-950">
                  <MapPin className="w-2.5 h-2.5 text-slate-950" />
                </div>
                <div className="flex-1">
                  <span className="text-cyan-300 font-semibold">ตำแหน่งของคุณ (User Location)</span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    แสดงระยะห่าง Geodesic และรัศมีความปลอดภัย
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
