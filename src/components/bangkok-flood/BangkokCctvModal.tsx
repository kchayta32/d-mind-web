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
  Building
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

  // Setup current time and refresh interval
  useEffect(() => {
    if (isOpen && cctv) {
      const now = new Date();
      setLastRefreshedTime(now.toLocaleTimeString('th-TH'));
      setAutoRefreshCount(30);

      const interval = setInterval(() => {
        setAutoRefreshCount(prev => {
          if (prev <= 1) {
            setLastRefreshedTime(new Date().toLocaleTimeString('th-TH'));
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        
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
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
          <img
            src={`${cctv.snapshotUrl}&t=${imageTimestamp}`}
            alt={cctv.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = cctv.fallbackSnapshotUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* CCTV On-Screen Display (OSD) Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              LIVE FEED &bull; 1080p FHD
            </span>
            <span className="px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10">
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

          <div className="flex items-center gap-2">
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
