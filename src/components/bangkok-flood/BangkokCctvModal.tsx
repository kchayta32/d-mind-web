import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Compass, 
  Navigation, 
  Building, 
  ExternalLink, 
  PhoneCall, 
  Sparkles,
  Wrench,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  Radio,
  Clock
} from 'lucide-react';
import { BangkokCctvCamera } from '@/data/bangkokCctvData';

export interface BangkokCctvModalProps {
  cctv: BangkokCctvCamera | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRoadOnMap: (roadName: string, lat?: number, lng?: number) => void;
  onAskTyphoonAboutCctv?: (cctv: BangkokCctvCamera) => void;
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
  onViewRoadOnMap,
  onAskTyphoonAboutCctv
}) => {
  if (!cctv) return null;

  const [lat, lng] = cctv.coordinates;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!z-[9999] max-w-2xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold">
                {cctv.id.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {ZONE_LABELS[cctv.zone] || cctv.zone}
              </Badge>
              <Badge className="text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-white border-amber-600">
                <Wrench className="w-3 h-3 mr-1" />
                ปิดปรับปรุงระบบชั่วคราว (กำลังปรับปรุงแก้ไข)
              </Badge>
            </div>

            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 pt-1">
              <Camera className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span>{cctv.name}</span>
            </DialogTitle>

            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{cctv.road}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                ทิศทาง: {cctv.facingDirection}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {cctv.agency}
              </span>
            </DialogDescription>
          </div>
        </div>

        {/* Maintenance Screen Area */}
        <div className="relative aspect-video sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none border-y border-slate-800">
          
          {/* Subtle Cyber / CCTV Scanlines Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

          {/* OSD Telemetry Header at top-left */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/80 backdrop-blur-md text-[11px] font-mono text-amber-400 border border-amber-500/40 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              MAINTENANCE MODE • CCTV OFFLINE
            </span>
            <span className="hidden sm:inline-block px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-400 border border-white/10">
              {cctv.id}
            </span>
          </div>

          {/* Main Maintenance Graphic & Notice */}
          <div className="relative z-10 max-w-lg space-y-3.5">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Wrench className="w-8 h-8 animate-pulse text-amber-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[9px] font-bold text-slate-950">!</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                ระบบกล้องวงจรปิด (CCTV) กำลังอยู่ระหว่างการปรับปรุงแก้ไข
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ขออภัยในความไม่สะดวก ขณะนี้ระบบดึงสัญญาณภาพสตรีมสดและภาพตรวจวัดระดับน้ำ กำลังได้รับการบำรุงรักษาและปรับปรุงระบบการเชื่อมต่อโครงข่ายเพื่อความเสถียรสูงสุด
              </p>
            </div>

            {/* Camera Location Specification Info Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400">จุดติดตั้ง:</span>
                <span className="font-semibold text-white truncate">{cctv.road}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Compass className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-slate-400">มุมกล้อง:</span>
                <span className="font-semibold text-white">{cctv.facingDirection}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Building className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">หน่วยงาน:</span>
                <span className="font-semibold text-white truncate">{cctv.agency}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Radio className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-slate-400">พิกัด GPS:</span>
                <span className="font-semibold text-amber-300">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
              </div>
            </div>

          </div>

          {/* Bottom OSD Bar */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>STATUS: UNDER SCHEDULED MAINTENANCE</span>
          </div>

        </div>

        {/* Official BMA Traffic Portal Direct Link Bar */}
        <div className="px-5 py-3 bg-blue-50/80 dark:bg-blue-950/40 border-t border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200">
            <span className="font-bold flex items-center gap-1.5">
              🌐 ข้อมูลทางการ กทม.:
            </span>
            <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">
              สามารถติดตามภาพรวมการจราจรและระบบระบายน้ำผ่านพอร์ทัลหลักของ กทม.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://www.bmatraffic.com/index.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              พอร์ทัล BMA Traffic
            </a>
            <a
              href="https://dds.bangkok.go.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/60 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-semibold text-xs transition"
            >
              ศูนย์ระบายน้ำ (DDS)
            </a>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>ปิดระบบกล้องวงจรปิดเพื่อปรับปรุงแก้ไขประสิทธิภาพ</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onAskTyphoonAboutCctv && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onAskTyphoonAboutCctv(cctv);
                  onClose();
                }}
                className="text-xs h-9 border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                ถาม Typhoon AI
              </Button>
            )}

            <a
              href="tel:1555"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-bold transition"
              title="โทรแจ้งเหตุน้ำท่วมขัง สายด่วน กทม. 1555"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              แจ้ง กทม. 1555
            </a>

            <Button
              size="sm"
              onClick={() => {
                onViewRoadOnMap(cctv.road, lat, lng);
                onClose();
              }}
              className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
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
