import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  RefreshCw, 
  MapPin, 
  Compass, 
  Radio, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation,
  Clock,
  Waves,
  Building,
  ExternalLink,
  PhoneCall,
  Video,
  Ruler,
  Maximize2
} from 'lucide-react';
import { BangkokCctvCamera, FloodSeverity } from '@/data/bangkokCctvData';

export interface BangkokCctvModalProps {
  cctv: BangkokCctvCamera | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRoadOnMap: (roadName: string, lat?: number, lng?: number) => void;
}

const ZONE_LABELS: Record<string, string> = {
  north: 'โซนเหนือ',
  central: 'โซนกลาง',
  east: 'โซนตะวันออก',
  thonburi: 'ฝั่งธนบุรี'
};

export const BangkokCctvModal: React.FC<BangkokCctvModalProps> = ({
  cctv,
  isOpen,
  onClose,
  onViewRoadOnMap
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');
  const [autoRefreshCount, setAutoRefreshCount] = useState<number>(30);
  const [imageTimestamp, setImageTimestamp] = useState<number>(Date.now());
  const [showRulerGrid, setShowRulerGrid] = useState(false);
  const [isLiveStreamMode, setIsLiveStreamMode] = useState(false);

  // Setup current time and refresh interval
  useEffect(() => {
    if (isOpen && cctv) {
      const updateClock = () => {
        const now = new Date();
        setLastRefreshedTime(now.toLocaleTimeString('th-TH'));
      };
      updateClock();
      setAutoRefreshCount(30);

      const interval = setInterval(() => {
        setAutoRefreshCount(prev => {
          if (prev <= 1) {
            updateClock();
            setImageTimestamp(Date.now());
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, cctv]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setImageTimestamp(Date.now());
      setLastRefreshedTime(new Date().toLocaleTimeString('th-TH'));
      setAutoRefreshCount(30);
      setIsRefreshing(false);
    }, 600);
  };

  if (!cctv) return null;

  // Severity styling
  const severityConfig = {
    critical: {
      badge: 'bg-red-500 text-white border-red-600',
      icon: AlertOctagon,
      label: '🔴 น้ำท่วมขังวิกฤต (หลีกเลี่ยง)',
      border: 'border-red-500/30'
    },
    warning: {
      badge: 'bg-amber-500 text-white border-amber-600',
      icon: AlertTriangle,
      label: '🟠 เฝ้าระวังน้ำท่วมขัง (ขับช้า ระวัง)',
      border: 'border-amber-500/30'
    },
    normal: {
      badge: 'bg-emerald-600 text-white border-emerald-700',
      icon: CheckCircle2,
      label: '🟢 สภาพผิวถนนปกติ (ใช้ได้ตามปกติ)',
      border: 'border-emerald-500/30'
    }
  }[cctv.floodSeverity] || {
    badge: 'bg-emerald-600 text-white border-emerald-700',
    icon: CheckCircle2,
    label: '🟢 สภาพผิวถนนปกติ (ใช้ได้ตามปกติ)',
    border: 'border-emerald-500/30'
  };

  const StatusIcon = severityConfig.icon;
  const [lat, lng] = cctv.coordinates;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!z-[9999] max-w-2xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  {cctv.id.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {ZONE_LABELS[cctv.zone] || cctv.zone}
                </Badge>
                <Badge className={`text-[11px] font-semibold ${severityConfig.badge}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {severityConfig.label}
                </Badge>
              </div>

              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pt-1">
                <Camera className="w-5 h-5 text-blue-500" />
                {cctv.name}
              </DialogTitle>

              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">{cctv.road}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  {cctv.facingDirection}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {cctv.agency}
                </span>
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Video / Snapshot Display */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group select-none">
          <img
            src={`${cctv.snapshotUrl}&t=${imageTimestamp}`}
            alt={cctv.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLiveStreamMode ? 'filter contrast-[1.05] brightness-95' : ''}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = cctv.fallbackSnapshotUrl || 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Simulated scanlines & noise in live stream mode */}
          {isLiveStreamMode && (
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40"></div>
          )}

          {/* Water Depth Gauge Grid Overlay (Optional Toggle) */}
          {showRulerGrid && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 border border-cyan-400/40">
              <div className="h-32 w-16 border-l-2 border-b-2 border-cyan-400 bg-cyan-950/40 backdrop-blur-sm p-1 text-[10px] text-cyan-300 font-mono flex flex-col justify-between">
                <span>30cm</span>
                <span>20cm</span>
                <span>10cm</span>
                <span className="text-emerald-400">0cm(ผิวทาง)</span>
              </div>
            </div>
          )}

          {/* CCTV On-Screen Display (OSD) Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {isLiveStreamMode ? 'LIVE STREAM • 30 FPS' : 'LIVE FEED • 1080p FHD'}
            </span>
            <span className="px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10">
              {cctv.id}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <div className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-slate-200 border border-white/10 flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{lastRefreshedTime || '14:05:32'} (ICT)</span>
              <span>&bull;</span>
              <span className="text-cyan-300">{cctv.agency}</span>
            </div>
          </div>

          {/* Water level indicator on camera snapshot */}
          <div className="absolute bottom-3 right-3 z-10">
            <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-right">
              <div className="text-[10px] text-slate-300 flex items-center justify-end gap-1">
                <Waves className="w-3 h-3 text-blue-400" />
                ระดับน้ำตรวจวัด
              </div>
              <div className="text-base font-extrabold text-white">
                {cctv.waterLevelCm !== undefined ? cctv.waterLevelCm : 0} <span className="text-xs font-normal text-slate-300">ซม.</span>
              </div>
            </div>
          </div>

          {/* Quick Overlay Controls on top right of video */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              onClick={() => setShowRulerGrid(!showRulerGrid)}
              title="เปิด/ปิดเส้นวัดระดับน้ำ"
              className={`p-1.5 rounded-md backdrop-blur-md text-xs font-mono border transition ${
                showRulerGrid 
                  ? 'bg-cyan-500 text-white border-cyan-400' 
                  : 'bg-black/60 text-slate-300 border-white/20 hover:bg-black/80'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsLiveStreamMode(!isLiveStreamMode)}
              title="สลับโหมดจำลองสตรีมมิ่งสด"
              className={`p-1.5 rounded-md backdrop-blur-md text-xs font-mono border transition ${
                isLiveStreamMode 
                  ? 'bg-red-600 text-white border-red-500' 
                  : 'bg-black/60 text-slate-300 border-white/20 hover:bg-black/80'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh Overlay Animation */}
          {isRefreshing && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex items-center gap-2 bg-slate-900/90 text-white px-4 py-2 rounded-xl border border-slate-700 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                กำลังดึงภาพสดล่าสุดจากกล้อง...
              </div>
            </div>
          )}
        </div>

        {/* Official BMA Traffic Portal Direct Link Bar */}
        <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-t border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
            <span className="font-semibold flex items-center gap-1">
              🌐 กล้องสดทางการ กทม.:
            </span>
            <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">
              สตรีมมิ่งระบบเครือข่าย BMA Traffic สำนักการจราจรและขนส่ง
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://www.bmatraffic.com/index.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              เปิดพอร์ทัลกล้องสด กทม. (BMA Traffic)
            </a>
            <a
              href="https://dds.bangkok.go.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/60 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-medium text-xs transition"
            >
              ศูนย์ระบายน้ำ (DDS)
            </a>
          </div>
        </div>

        {/* Status & Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>สถานะ: <b>{cctv.status === 'online' ? 'เชื่อมต่อออนไลน์' : 'ปรับปรุงสัญญาณ'}</b></span>
            </div>
            <span>&bull;</span>
            <div className="text-[11px] text-slate-500">
              อัปเดตอัตโนมัติใน <b>{autoRefreshCount}s</b>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:1555"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-semibold transition"
              title="โทรแจ้งเหตุน้ำท่วมขัง สายด่วน กทม. 1555"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              แจ้ง กทม. 1555
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-xs h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              รีเฟรชภาพสด
            </Button>

            <Button
              size="sm"
              onClick={() => {
                onViewRoadOnMap(cctv.road, lat, lng);
                onClose();
              }}
              className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 mr-1.5" />
              ดูเส้นทางถนนนี้บนแผนที่
            </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default BangkokCctvModal;
