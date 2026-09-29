import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Waves, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FloodHubGaugeStation, 
  FloodHubSeverity,
  getSeverityColor 
} from '@/services/googleFloodHubService';

interface GoogleFloodHubSidebarProps {
  station: FloodHubGaugeStation | null;
  onClose: () => void;
  onSelectStation?: (station: FloodHubGaugeStation) => void;
  allStations?: FloodHubGaugeStation[];
}

export const GoogleFloodHubSidebar: React.FC<GoogleFloodHubSidebarProps> = ({
  station,
  onClose,
  onSelectStation,
  allStations = []
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!station) return null;

  const colors = getSeverityColor(station.severity);
  const hydrograph = station.hydrograph;

  // Hydrograph SVG calculation
  const width = 360;
  const height = 180;
  const padding = { top: 25, right: 20, bottom: 30, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Max Y value calculated from max discharge and thresholds
  const maxY = Math.max(
    station.peakDischargeM3s * 1.15,
    station.thresholds.extreme * 1.25,
    60
  );

  const getX = (index: number) => {
    return padding.left + (index / (hydrograph.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(val, maxY));
    return padding.top + graphHeight - (clamped / maxY) * graphHeight;
  };

  // Find index of "Now" (last non-forecast point)
  const nowIndex = hydrograph.findIndex(p => p.isForecast);
  const actualNowIndex = nowIndex === -1 ? hydrograph.length - 1 : Math.max(0, nowIndex - 1);

  // Split path for historical vs forecast
  const historicalPoints = hydrograph.slice(0, actualNowIndex + 1);
  const forecastPoints = hydrograph.slice(actualNowIndex);

  const makePath = (points: typeof hydrograph, startIndex: number) => {
    if (points.length === 0) return '';
    return points.reduce((acc, curr, i) => {
      const idx = startIndex + i;
      const x = getX(idx);
      const y = getY(curr.dischargeM3s);
      return `${acc} ${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  };

  const historicalPath = makePath(historicalPoints, 0);
  const forecastPath = makePath(forecastPoints, actualNowIndex);

  // Threshold Y positions
  const yExtreme = getY(station.thresholds.extreme);
  const yDanger = getY(station.thresholds.danger);
  const yWarning = getY(station.thresholds.warning);

  return (
    <div className={`fixed top-20 left-4 z-[1000] w-[380px] sm:w-[410px] max-w-[calc(100vw-2rem)] transition-all duration-300 font-sans shadow-2xl rounded-2xl border border-slate-700/80 bg-slate-950/95 backdrop-blur-xl text-slate-100 overflow-hidden flex flex-col ${
      isMinimized ? 'h-auto max-h-[80px]' : 'max-h-[calc(100vh-6.5rem)]'
    }`}>
      {/* Top Banner Alert (Matching Image 2: "Estimated highest river level in more than 40 years") */}
      {station.alertHeadline && !isMinimized && (
        <div className="bg-gradient-to-r from-purple-950 via-rose-950 to-amber-950 px-4 py-2.5 border-b border-purple-500/40 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs font-bold leading-snug text-purple-100">
            {station.alertHeadline}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-sky-500/10 text-sky-400">
              <Waves className="w-4 h-4" />
            </span>
            <h2 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              {station.name}
              <Badge variant="outline" className={`text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider ${colors.badge}`}>
                {station.severity}
              </Badge>
            </h2>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{station.nameTh}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'ขยาย' : 'ย่อ'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
            onClick={onClose}
            title="ปิด"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Body */}
      {!isMinimized && (
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          
          {/* Hydrograph Chart Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>อัตราการไหลระบายน้ำ (River Discharge)</span>
              </div>
              <span className="text-[11px] text-sky-400 font-bold bg-sky-950/70 border border-sky-800/80 px-2 py-0.5 rounded-full">
                m³/s
              </span>
            </div>

            {/* SVG Hydrograph matching Image 2 */}
            <div className="relative w-full overflow-hidden bg-slate-950/70 rounded-lg border border-slate-800/80 p-1">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
                <defs>
                  <linearGradient id="hydroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines & Labels */}
                {[0, Math.round(maxY * 0.33), Math.round(maxY * 0.66), Math.round(maxY)].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={width - padding.right}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="2, 4"
                        strokeWidth="0.8"
                      />
                      <text
                        x={padding.left - 6}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#94a3b8"
                        fontFamily="sans-serif"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Horizontal Threshold Lines (Extreme, Danger, Warning) */}
                {/* 1. Extreme */}
                <line
                  x1={padding.left}
                  y1={yExtreme}
                  x2={width - padding.right}
                  y2={yExtreme}
                  stroke="#be185d"
                  strokeWidth="1.5"
                  strokeDasharray="3, 3"
                />
                <text
                  x={width - padding.right}
                  y={yExtreme - 4}
                  textAnchor="end"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#f472b6"
                >
                  Extreme ({station.thresholds.extreme})
                </text>

                {/* 2. Danger */}
                <line
                  x1={padding.left}
                  y1={yDanger}
                  x2={width - padding.right}
                  y2={yDanger}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="3, 3"
                />
                <text
                  x={width - padding.right}
                  y={yDanger - 3}
                  textAnchor="end"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#f87171"
                >
                  Danger ({station.thresholds.danger})
                </text>

                {/* 3. Warning */}
                <line
                  x1={padding.left}
                  y1={yWarning}
                  x2={width - padding.right}
                  y2={yWarning}
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                  strokeDasharray="3, 3"
                />
                <text
                  x={width - padding.right}
                  y={yWarning - 3}
                  textAnchor="end"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#fbbf24"
                >
                  Warning ({station.thresholds.warning})
                </text>

                {/* Vertical "Now" Dashed Line */}
                {actualNowIndex >= 0 && (
                  <g>
                    <line
                      x1={getX(actualNowIndex)}
                      y1={padding.top}
                      x2={getX(actualNowIndex)}
                      y2={height - padding.bottom}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4, 3"
                    />
                    <rect
                      x={getX(actualNowIndex) - 18}
                      y={padding.top - 18}
                      width="36"
                      height="16"
                      rx="4"
                      fill="#0284c7"
                    />
                    <text
                      x={getX(actualNowIndex)}
                      y={padding.top - 7}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      Now
                    </text>
                  </g>
                )}

                {/* Historical discharge curve (Solid Blue) */}
                <path
                  d={historicalPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Forecast discharge curve (Dotted Blue) */}
                <path
                  d={forecastPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4, 4"
                  strokeLinecap="round"
                />

                {/* Interactive Points */}
                {hydrograph.map((pt, i) => {
                  const cx = getX(i);
                  const cy = getY(pt.dischargeM3s);
                  const isHovered = hoveredPointIndex === i;
                  return (
                    <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5.5 : (i === actualNowIndex ? 4 : 2.5)}
                        fill={i === actualNowIndex ? '#38bdf8' : (pt.isForecast ? '#93c5fd' : '#0284c7')}
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 2 : 1}
                      />
                      {/* X-axis date labels */}
                      {(i === 0 || i === actualNowIndex || i === hydrograph.length - 1 || i % 3 === 0) && (
                        <text
                          x={cx}
                          y={height - padding.bottom + 14}
                          textAnchor="middle"
                          fontSize="8"
                          fill={i === actualNowIndex ? '#38bdf8' : '#94a3b8'}
                          fontWeight={i === actualNowIndex ? 'bold' : 'normal'}
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredPointIndex !== null && hydrograph[hoveredPointIndex] && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-sky-500/50 px-2.5 py-1 rounded-md shadow-xl text-[11px] pointer-events-none flex items-center gap-2">
                  <span className="text-slate-300 font-semibold">{hydrograph[hoveredPointIndex].label}:</span>
                  <span className="text-sky-300 font-bold">{hydrograph[hoveredPointIndex].dischargeM3s} m³/s</span>
                  {hydrograph[hoveredPointIndex].isForecast ? (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-indigo-300 border-indigo-500/50">พยากรณ์</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-emerald-300 border-emerald-500/50">ตรวจวัดจริง</Badge>
                  )}
                </div>
              )}
            </div>

            {/* Current Value & Peak Summary */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">อัตราการไหล ณ ปัจจุบัน</span>
                <span className="text-base font-extrabold text-cyan-300">
                  {station.currentDischargeM3s} <span className="text-[10px] font-normal text-slate-400">m³/s</span>
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">คาดการณ์สูงสุด 7 วัน</span>
                <span className="text-base font-extrabold text-rose-400">
                  {station.peakDischargeM3s} <span className="text-[10px] font-normal text-slate-400">m³/s</span>
                </span>
              </div>
            </div>
          </div>

          {/* Gauge Metadata Section (Matching Image 2) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ข้อมูลสถานีตรวจวัดและแบบจำลอง (Gauge Details)</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 divide-y divide-slate-800/60">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">ระดับความเชื่อมั่น</span>
                <Badge variant="outline" className="bg-emerald-950/50 text-emerald-300 border-emerald-600/50 text-[10px]">
                  ✓ {station.confidence}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">รหัสสถานี (Station ID)</span>
                <code className="text-sky-300 font-mono text-[10px] bg-sky-950/40 px-1 rounded">{station.id}</code>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">แหล่งที่มาข้อมูล (Source)</span>
                <span className="font-semibold text-slate-200">{station.source} (ECMWF GloFAS)</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">พิกัดภูมิศาสตร์</span>
                <span className="font-mono text-slate-300">{station.coordinates[0].toFixed(5)}, {station.coordinates[1].toFixed(5)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">ลุ่มน้ำย่อย</span>
                <span className="text-slate-200">{station.basin}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">อัปเดตล่าสุด</span>
                <span className="text-slate-400">{station.lastUpdated}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
              "{station.description}"
            </p>
          </div>

          {/* Significant Flooding Event Alert (Matching Image 3) */}
          <div className="rounded-xl border border-rose-900/60 bg-gradient-to-br from-rose-950/30 to-purple-950/20 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Significant flooding event nearby may affect this area</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              แบบจำลองตรวจพบเหตุการณ์น้ำท่วมที่มีนัยสำคัญในรัศมีใกล้เคียง โดยเฉพาะการระบายน้ำจากทุ่งตะวันออกและระดับน้ำทะเลหนุนในอ่าวไทย แนะนำให้ประชาชนริมแนวคลองเตรียมพร้อมยกของขึ้นที่สูง
            </p>
          </div>

          {/* Quick Station Switcher */}
          {allStations.length > 1 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-500" />
                สถานีเกจอื่นๆ ในโครงข่าย Flood Hub:
              </span>
              <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto pr-1">
                {allStations.filter(s => s.id !== station.id).map(s => {
                  const sCol = getSeverityColor(s.severity);
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectStation && onSelectStation(s)}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 text-left transition-colors"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-slate-200 truncate">{s.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{s.province}</div>
                      </div>
                      <Badge variant="outline" className={`text-[9px] shrink-0 ${sCol.badge}`}>
                        {s.currentDischargeM3s} m³/s
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Direct Link to Google Flood Hub */}
          <div className="pt-1">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2 py-2.5 rounded-xl shadow-lg shadow-blue-900/30"
              onClick={() => window.open(station.floodHubUrl, '_blank', 'noopener,noreferrer')}
            >
              <span>เปิดดูบน Google Flood Hub โดยตรง</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <div className="text-[10px] text-center text-slate-500 mt-1.5">
              Flood Hub ขับเคลื่อนด้วยโมเดล GloFAS (ECMWF) และ Google Research AI Hydrology
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
