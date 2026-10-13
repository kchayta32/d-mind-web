import React from 'react';
import { 
  Waves, 
  CloudRain, 
  ShieldCheck, 
  Coffee, 
  PhoneCall, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

export const LiveCrisisTicker: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const indicators = [
    {
      icon: <Waves className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />,
      label: isEn ? 'Chao Phraya River' : 'ระดับน้ำเจ้าพระยา',
      value: isEn ? 'Normal Level' : 'ปกติ (ต่ำกว่าคันกั้นน้ำ)',
      status: 'safe',
      route: '/bangkok-flood'
    },
    {
      icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" />,
      label: isEn ? 'Rain Radar' : 'เรดาร์กลุ่มฝน กทม.',
      value: isEn ? 'Moderate Monitoring' : 'เฝ้าระวังกลุ่มฝนบ่าย-ค่ำ',
      status: 'warning',
      route: '/disaster-map'
    },
    {
      icon: <Coffee className="w-3.5 h-3.5 text-amber-400" />,
      label: isEn ? 'Cafe Flood Radar' : 'เรดาร์คาเฟ่ & บาร์',
      value: isEn ? '67+ Venues Safe' : '67+ ร้านเปิดปลอดภัยจากน้ำท่วม',
      status: 'safe',
      route: '/cafe-flood-map'
    },
    {
      icon: <PhoneCall className="w-3.5 h-3.5 text-red-400" />,
      label: isEn ? 'BMA Hotline 1555' : 'สายด่วน กทม. 1555',
      value: isEn ? '24/7 Ready' : 'พร้อมรับแจ้งเหตุน้ำท่วม 24 ชม.',
      status: 'info',
      route: '/contacts'
    }
  ];

  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-950/95 border-b border-slate-800 text-slate-200 py-2 px-4 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Live Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {isEn ? 'LIVE SITUATION PULSE' : 'สถานะเฝ้าระวังเรียลไทม์'}
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
        </div>

        {/* Ticker Items */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-xs overflow-x-auto py-0.5">
          {indicators.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.route)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-blue-500/50 transition-all text-[11px] cursor-pointer group"
            >
              {item.icon}
              <span className="text-slate-400 group-hover:text-slate-300">{item.label}:</span>
              <span className="font-semibold text-white group-hover:text-blue-300">{item.value}</span>
            </button>
          ))}
        </div>

        {/* Quick Map Action */}
        <button
          onClick={() => navigate('/disaster-map')}
          className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors shrink-0 group"
        >
          <span>{isEn ? 'Explore Disaster GIS Map' : 'เปิดแผนที่ดาวเทียม GIS'}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default LiveCrisisTicker;
