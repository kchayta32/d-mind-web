import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  MapPin, 
  CheckCircle2, 
  Radio,
  Flame,
  Zap,
  ArrowRight
} from 'lucide-react';
import { audioAlertSystem } from '../../services/audioAlertSystem';

interface EmergencyHUDProps {
  isOpen: boolean;
  countdownSeconds: number;
  totalLeadTimeSec?: number;
  magnitude: number;
  depthKm: number;
  distanceKm: number;
  epicenterName: string;
  intensityLevel?: string;
  expectedPga?: number;
  onAcknowledge?: () => void;
  onClose?: () => void;
}

export const EmergencyHUD: React.FC<EmergencyHUDProps> = ({
  isOpen,
  countdownSeconds,
  totalLeadTimeSec = 20,
  magnitude,
  depthKm,
  distanceKm,
  epicenterName,
  intensityLevel = 'MMI VII (รุนแรงมาก - Very Strong)',
  expectedPga = 148.5,
  onAcknowledge,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(audioAlertSystem.getMuted());
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isDrillAck, setIsDrillAck] = useState<boolean>(false);

  // Sync mute state
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioAlertSystem.setMuted(nextMute);
  };

  // Play audio siren when modal opens if not acknowledged
  useEffect(() => {
    if (isOpen && countdownSeconds > 0 && !isDrillAck) {
      audioAlertSystem.startSiren('critical');
    } else if (!isOpen || isDrillAck) {
      audioAlertSystem.stopSiren();
    }
    return () => {
      audioAlertSystem.stopSiren();
    };
  }, [isOpen, countdownSeconds, isDrillAck]);

  if (!isOpen) return null;

  // Percentage for circular countdown progress
  const safeTotal = Math.max(1, totalLeadTimeSec);
  const safeCurrent = Math.max(0, countdownSeconds);
  const progressRatio = Math.min(1, safeCurrent / safeTotal);
  const strokeRadius = 88;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Urgency color scheme based on countdown seconds remaining
  const isImminent = safeCurrent <= 5;
  const isMedium = safeCurrent <= 12;
  const countdownColor = isImminent ? '#f43f5e' : isMedium ? '#f59e0b' : '#06b6d4';

  const handleDismiss = () => {
    setIsDrillAck(true);
    audioAlertSystem.stopSiren();
    audioAlertSystem.playAllClear();
    if (onAcknowledge) onAcknowledge();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Tactical Emergency HUD Card */}
      <div className={`relative w-full max-w-4xl bg-[#0d1322] border-2 ${isImminent ? 'border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.45)]' : 'border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.35)]'} rounded-2xl overflow-hidden text-slate-100 flex flex-col max-h-[95vh]`}>
        
        {/* Flashing Top Alert Banner */}
        <div className={`px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors ${isImminent ? 'bg-rose-600/90 text-white animate-pulse' : 'bg-amber-600/90 text-black font-semibold'}`}>
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 animate-spin" />
            <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider uppercase">
              EARTHQUAKE EARLY WARNING (EEW) // การแจ้งเตือนภัยพิบัติฉุกเฉินระดับชาติ
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
              title={isMuted ? 'เปิดเสียงไซเรน' : 'ปิดเสียงไซเรน'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white/70" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1 rounded-md bg-black/30 hover:bg-black/50 text-xs font-mono tracking-wider transition-colors"
            >
              ปิด (ESC)
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Hero: Countdown Timer + Core Seismic Vectors */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Giant Circular Countdown (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800 relative">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={strokeRadius}
                    className="stroke-slate-800"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Active Dynamic Progress */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={strokeRadius}
                    stroke={countdownColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Inner Digital Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
                    GOLDEN SECONDS
                  </span>
                  <span 
                    className="font-mono text-5xl sm:text-6xl font-black tracking-tight my-1"
                    style={{ color: countdownColor }}
                  >
                    {safeCurrent > 0 ? safeCurrent.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                    {safeCurrent > 0 ? 'วินาทีก่อนคลื่น S มาถึง' : '⚡ คลื่นทำลายล้างมาถึงแล้ว'}
                  </span>
                </div>
              </div>

              {/* Status Footer under dial */}
              <div className="mt-3 text-center">
                <span className="text-xs text-slate-400">
                  {safeCurrent > 0 
                    ? 'เวลาทองในการหาที่กำบังและตัดระบบพลังงาน' 
                    : 'หมอบต่ำ ยึดโครงสร้างแน่นหนาจนกว่าการสั่นสะเทือนจะสงบลง'}
                </span>
              </div>
            </div>

            {/* Seismic Event Telemetry (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
              {/* Primary Epicenter Banner */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> ศูนย์กลางการเกิดแผ่นดินไหว
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                    CRITICAL SEISMIC TRIGGER
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {epicenterName}
                </h2>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ขนาด (MAGNITUDE)</span>
                    <span className="text-rose-400 font-black text-base sm:text-lg">M {magnitude.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ความลึก (DEPTH)</span>
                    <span className="text-amber-400 font-bold text-base sm:text-lg">{depthKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ระยะห่าง (DISTANCE)</span>
                    <span className="text-cyan-400 font-bold text-base sm:text-lg">{distanceKm} km</span>
                  </div>
                </div>
              </div>

              {/* Intensity & Ground Acceleration Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                    <Gauge className="w-4 h-4" /> ระดับความรุนแรง MMI
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-100 mt-1">
                    {intensityLevel}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    อาคารสั่นสะเทือนรุนแรง ข้าวของตกหล่น
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
                    <Zap className="w-4 h-4" /> ความเร่งพื้นดินสูงสุด (PGA)
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black text-rose-400 mt-1">
                    {expectedPga.toFixed(1)} <span className="text-xs font-normal text-slate-400">Gal (cm/s²)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    เสี่ยงต่อโครงสร้างอาคารที่ไม่ได้รองรับ
                  </span>
                </div>
              </div>

              {/* Urgent SCADA Alert Strip */}
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 flex items-center justify-between text-xs text-rose-200">
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  คำสั่งตัดระบบอัตโนมัติ: ปิดวาล์วแก๊สธรรมชาติ / ลิฟต์หยุดชั้นใกล้สุด
                </span>
                <span className="font-mono text-[10px] bg-rose-900/70 px-2 py-0.5 rounded text-white">
                  AUTONOMOUS IOT TRIGGERED
                </span>
              </div>
            </div>
          </div>

          {/* Survival Protocol: DROP - COVER - HOLD ON (หมอบ - กำบัง - ยึด) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>คู่มือการปฏิบัติตนเพื่อเอาชีวิตรอดฉับพลัน: "หมอบ - กำบัง - ยึด"</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">DROP • COVER • HOLD ON</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Step 1: DROP (หมอบ) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-cyan-400 transition-all">
                <div className="absolute top-2 left-2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                  STEP 1
                </div>
                
                {/* SVG Illustration: Drop */}
                <div className="w-20 h-20 my-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 fill-none stroke-current stroke-2">
                    {/* Floor line */}
                    <line x1="10" y1="85" x2="90" y2="85" strokeWidth="3" stroke="#475569" />
                    {/* Head */}
                    <circle cx="35" cy="45" r="10" fill="#06b6d4" fillOpacity="0.2" />
                    {/* Body crouching down */}
                    <path d="M 45 45 C 55 50, 65 60, 68 75" strokeWidth="3" strokeLinecap="round" />
                    {/* Arms on floor */}
                    <path d="M 42 50 L 30 70 L 25 85" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Legs bent */}
                    <path d="M 68 75 L 80 85 L 60 85" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <h4 className="font-bold text-cyan-300 text-lg">หมอบ (DROP)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  ทิ้งตัวลงคุกเข่ากับพื้นทันที ป้องกันการเหวี่ยงล้มกระแทกจากแรงสั่นสะเทือนของคลื่น S
                </p>
              </div>

              {/* Step 2: COVER (กำบัง) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-amber-400 transition-all">
                <div className="absolute top-2 left-2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  STEP 2
                </div>

                {/* SVG Illustration: Cover under sturdy desk */}
                <div className="w-20 h-20 my-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 fill-none stroke-current stroke-2">
                    {/* Floor line */}
                    <line x1="10" y1="85" x2="90" y2="85" strokeWidth="3" stroke="#475569" />
                    {/* Sturdy Table */}
                    <path d="M 15 45 L 85 45 M 25 45 L 25 85 M 75 45 L 75 85" strokeWidth="3" stroke="#f59e0b" />
                    {/* Person curled under table */}
                    <circle cx="45" cy="62" r="7" fill="#f59e0b" fillOpacity="0.2" />
                    <path d="M 50 65 Q 60 70 58 82" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 45 68 L 40 76 L 35 84" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <h4 className="font-bold text-amber-300 text-lg">กำบัง (COVER)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  มุดเข้าใต้โต๊ะหรือโครงสร้างที่แข็งแรง ก้มศีรษะและใช้แขนปกป้องศีรษะกับลำคอจากของตกหล่น
                </p>
              </div>

              {/* Step 3: HOLD ON (ยึด) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-emerald-400 transition-all">
                <div className="absolute top-2 left-2 text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  STEP 3
                </div>

                {/* SVG Illustration: Hold on to desk leg */}
                <div className="w-20 h-20 my-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400 fill-none stroke-current stroke-2">
                    {/* Floor line */}
                    <line x1="10" y1="85" x2="90" y2="85" strokeWidth="3" stroke="#475569" />
                    {/* Table leg */}
                    <line x1="30" y1="35" x2="30" y2="85" strokeWidth="4" stroke="#10b981" />
                    <path d="M 20 35 L 80 35" strokeWidth="3" stroke="#10b981" />
                    {/* Hands firmly gripping table leg */}
                    <circle cx="48" cy="60" r="7" fill="#10b981" fillOpacity="0.2" />
                    <path d="M 46 64 L 30 68" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 47 67 L 30 73" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 52 64 Q 62 70 56 83" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <h4 className="font-bold text-emerald-300 text-lg">ยึด (HOLD ON)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  ยึดขาโต๊ะไว้แน่น หากโต๊ะเลื่อนให้ขยับตามไปพร้อมกับโต๊ะจนกระทั่งการสั่นสะเทือนหยุดสนิท
                </p>
              </div>

            </div>

            {/* Cautionary Safety Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕ ห้าม:</span>
                <span>ห้ามใช้ลิฟต์โดยเด็ดขาด, หลีกเลี่ยงหน้าต่างกระจก, เสาไฟฟ้า, และป้ายโฆษณา</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓ ควร:</span>
                <span>เตรียมอพยพทางบันไดหนีไฟเมื่อการสั่นหยุด พกกระเป๋าเป้ยังชีพและตรวจเช็คคนในครอบครัว</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => audioAlertSystem.testSiren()}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>ทดสอบเสียงไซเรน / เสียงพูด</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              สอดคล้องกับมาตรฐานการเตือนภัยแผ่นดินไหว JMA / USGS EEW
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDismiss}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>รับทราบข้อปฏิบัติ / เข้าใจแล้ว</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyHUD;
