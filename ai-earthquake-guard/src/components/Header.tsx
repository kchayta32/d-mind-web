import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Volume2, 
  VolumeX, 
  Award, 
  Sparkles,
  Wifi,
  Clock,
  Zap,
  Globe
} from 'lucide-react';
import { AlertLevel } from '../types/seismic';
import { audioAlertSystem } from '../services/audioAlertSystem';

interface HeaderProps {
  currentAlertLevel: AlertLevel;
  activeQuakeCount: number;
  onOpenNRCTShowcase: () => void;
  onOpenSimulator: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentAlertLevel,
  activeQuakeCount,
  onOpenNRCTShowcase,
  onOpenSimulator,
  isSimulating
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [utcTimeStr, setUtcTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(audioAlertSystem.getMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('th-TH', { hour12: false }));
      setUtcTimeStr(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioAlertSystem.setMuted(next);
  };

  const getAlertBadge = () => {
    switch (currentAlertLevel) {
      case 'critical':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 animate-pulse font-mono text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>CRITICAL THREAT</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 font-mono text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>WARNING</span>
          </div>
        );
      case 'advisory':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500 text-cyan-400 font-mono text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>ADVISORY</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-mono text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NORMAL MONITORING</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e17]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 sm:px-6 py-2.5 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent font-mono">
                SeismoGuard AI
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Award className="w-2.5 h-2.5 text-amber-400" />
                วช. NRCT INNOVATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ระบบวิเคราะห์คลื่นไหวสะเทือนและแจ้งเตือนแผ่นดินไหวล่วงหน้าด้วยปัญญาประดิษฐ์แบบเรียลไทม์
            </p>
          </div>
        </div>

        {/* Center: System Threat Status & Dual Clock */}
        <div className="hidden lg:flex items-center gap-4">
          {getAlertBadge()}

          <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-semibold">{timeStr || '--:--:--'}</span>
              <span className="text-[10px] text-slate-500">ICT</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="text-slate-400 text-[11px]">
              {utcTimeStr || '--:--:-- UTC'}
            </div>
          </div>
        </div>

        {/* Right Actions: Audio Siren Toggle, Simulator Trigger, NRCT Showcase */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Threat Badge */}
          <div className="lg:hidden">
            {getAlertBadge()}
          </div>

          {/* Simulator quick button */}
          <button
            onClick={onOpenSimulator}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="ทดสอบจำลองการเกิดแผ่นดินไหว"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">จำลองสถานการณ์</span>
            <span className="sm:hidden">จำลอง</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
            }`}
            title={isMuted ? 'เปิดเสียงไซเรนเตือนภัย' : 'ปิดเสียงไซเรนเตือนภัย'}
            aria-label="Toggle Siren Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* NRCT Innovation Showcase Modal Trigger */}
          <button
            onClick={onOpenNRCTShowcase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span className="hidden md:inline">ผลงานประกวด วช.</span>
            <span className="md:hidden">วช.</span>
          </button>
        </div>
      </div>
    </header>
  );
};
