import React from 'react';
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
  Car, 
  Bike, 
  Truck, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Waves, 
  Camera, 
  Navigation, 
  Clock, 
  MapPin, 
  Info,
  Activity,
  Layers
} from 'lucide-react';
import { BangkokRoadSegment } from '@/types/bangkokFlood';
import { BangkokCctvCamera } from '@/data/bangkokCctvData';

export interface BangkokRoadDetailModalProps {
  road: BangkokRoadSegment | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCctv: (cctvId: string) => void;
  cctvs?: BangkokCctvCamera[];
  onFocusOnMap?: (center: [number, number], zoom?: number) => void;
}

const ZONE_LABELS: Record<string, string> = {
  north: 'โซนเหนือ',
  central: 'โซนกลาง',
  east: 'โซนตะวันออก',
  thonburi: 'ฝั่งธนบุรี'
};

export const BangkokRoadDetailModal: React.FC<BangkokRoadDetailModalProps> = ({
  road,
  isOpen,
  onClose,
  onOpenCctv,
  cctvs = [],
  onFocusOnMap
}) => {
  if (!road) return null;

  // Filter linked CCTVs for this road (by matching cctvCameraIds or road name substring)
  const linkedCctvs = cctvs.filter(c => {
    if (road.cctvCameraIds && road.cctvCameraIds.includes(c.id)) return true;
    const roadBase = road.name.split('(')[0].replace('ถนน', '').trim();
    return c.road.includes(roadBase) || c.name.includes(roadBase);
  });

  // Severity UI configurations
  const severityConfig = {
    critical: {
      badge: 'bg-red-500 text-white border-red-600',
      icon: AlertOctagon,
      title: 'ระดับวิกฤต - ควรหลีกเลี่ยงเส้นทาง',
      bgBar: 'bg-red-500',
      textAlert: 'น้ำท่วมขังสูงเกินมาตรฐานความปลอดภัย รถยนต์ขนาดเล็กมีความเสี่ยงเครื่องยนต์ดับ'
    },
    warning: {
      badge: 'bg-amber-500 text-white border-amber-600',
      icon: AlertTriangle,
      title: 'เฝ้าระวัง - ชะลอความเร็วและระมัดระวัง',
      bgBar: 'bg-amber-500',
      textAlert: 'มีน้ำท่วมขังรอระบายบางช่องจราจร เลี่ยงใช้เลนซ้ายที่น้ำท่วมขัง'
    },
    normal: {
      badge: 'bg-emerald-600 text-white border-emerald-700',
      icon: CheckCircle2,
      title: 'สภาพปกติ - สัญจรได้ตามปกติ',
      bgBar: 'bg-emerald-500',
      textAlert: 'ผิวการจราจรแห้ง ไม่มีน้ำท่วมขัง สัญจรได้สะดวกทุกช่องทาง'
    }
  }[road.status];

  const StatusIcon = severityConfig.icon;

  // Gauge bar percentage (scaled to 40 cm maximum)
  const maxScaleCm = 40;
  const gaugePercent = Math.min(100, Math.round((road.waterLevelCm / maxScaleCm) * 100));

  // Compute road center from coordinates
  const roadCenter: [number, number] = road.coordinates && road.coordinates.length > 0
    ? road.coordinates[Math.floor(road.coordinates.length / 2)]
    : [13.7563, 100.5018];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        
        {/* Header Section */}
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  <MapPin className="w-3 h-3 mr-1" />
                  {ZONE_LABELS[road.zone] || road.zone} &bull; เขต{road.district}
                </Badge>
                <Badge className={`text-xs font-bold ${severityConfig.badge}`}>
                  <StatusIcon className="w-3.5 h-3.5 mr-1" />
                  {severityConfig.title}
                </Badge>
              </div>

              <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white pt-1">
                {road.name}
              </DialogTitle>

              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span>{road.nameEn}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3 h-3 text-slate-400" />
                  อัปเดต {road.updatedAt ? new Date(road.updatedAt).toLocaleTimeString('th-TH') : 'ล่าสุด'}
                </span>
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 text-sm">
          
          {/* 1. Water Gauge Bar Visualization */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-blue-500" />
                ระดับน้ำท่วมขังบนผิวจราจร (Water Depth)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {road.waterLevelCm}
                </span>
                <span className="text-xs font-semibold text-slate-500">เซนติเมตร (cm)</span>
              </div>
            </div>

            {/* Gauge Visual Bar */}
            <div className="space-y-1.5">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${severityConfig.bgBar}`}
                  style={{ width: `${Math.max(4, gaugePercent)}%` }}
                />
              </div>

              {/* Gauge reference ticks */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
                <span>0 ซม. (แห้ง)</span>
                <span>10 ซม. (ขอบยาง)</span>
                <span>20 ซม. (ระดับฟุตบาท)</span>
                <span>30+ ซม. (วิกฤต)</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{road.description}</span>
            </div>
          </div>

          {/* 2. Vehicle Passability Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-indigo-500" />
              การผ่านของยานพาหนะแต่ละประเภท (Vehicle Passability)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Small Cars / Eco-cars */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">รถเก๋ง / Eco-Car</div>
                    <div className="text-[10px] text-slate-500">ความสูงใต้ท้องน้อย</div>
                  </div>
                </div>
                <div>
                  {road.passable.smallCar ? (
                    road.waterLevelCm > 10 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5" /> ขับช้า ระวังคลื่นน้ำ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านได้ตามปกติ
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                      <AlertOctagon className="w-3.5 h-3.5" /> ห้ามผ่านเด็ดขาด
                    </span>
                  )}
                </div>
              </div>

              {/* Motorcycles */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">รถจักรยานยนต์</div>
                    <div className="text-[10px] text-slate-500">มอเตอร์ไซค์ทุกประเภท</div>
                  </div>
                </div>
                <div>
                  {road.passable.motorcycle ? (
                    road.waterLevelCm > 10 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5" /> วิ่งชิดขวา ระวังล้ม
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านได้ตามปกติ
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                      <AlertOctagon className="w-3.5 h-3.5" /> ห้ามผ่าน / หลีกเลี่ยง
                    </span>
                  )}
                </div>
              </div>

              {/* Trucks & Buses */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">รถกระบะ / รถใหญ่</div>
                    <div className="text-[10px] text-slate-500">รถบรรทุก / รถประจำทาง</div>
                  </div>
                </div>
                <div>
                  {road.passable.truck ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านได้ตามปกติ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                      <AlertOctagon className="w-3.5 h-3.5" /> ระวังน้ำท่วมสูง
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* 3. Lanes Flooded Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                ช่องจราจรที่ได้รับผลกระทบ:
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {road.lanesAffected > 0 ? `ท่วมขัง ${road.lanesAffected} ช่องจราจร` : 'ไม่มีน้ำท่วมขังบนผิวถนน'}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-medium">
              &bull; {road.lanesAffected > 0 ? `ท่วมขัง ${road.lanesAffected} ช่องทางฝั่งซ้ายชิดทางเท้า สัญจรชะลอตัว` : 'ผิวถนนแห้ง สัญจรได้คล่องตัวทุกช่องทาง'}
            </p>
          </div>

          {/* 4. Drainage Infrastructure Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Nearest Canal */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-blue-500" />
                  คลองระบายน้ำหลักใกล้เคียง
                </span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                  BMA Canal
                </span>
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                {road.nearestCanal}
              </div>
            </div>

            {/* Drainage Pump Status */}
            <div className="p-3.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 space-y-1.5">
              <div className="text-xs font-bold text-cyan-900 dark:text-cyan-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-500" />
                  การปฏิบัติการสูบน้ำระบายน้ำ
                </span>
                <span className="text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                  เดินเครื่อง
                </span>
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                {road.drainageStatus}
              </div>
            </div>

          </div>

          {/* 5. Linked CCTV Cameras on this Road */}
          {linkedCctvs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-500" />
                กล้อง CCTV สภาพจราจรบนถนนสายนี้ ({linkedCctvs.length} จุด)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {linkedCctvs.slice(0, 4).map(cam => (
                  <div
                    key={cam.id}
                    onClick={() => onOpenCctv(cam.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 bg-slate-50 dark:bg-slate-950/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {cam.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {cam.facingDirection}
                      </div>
                      <div className="text-[10px] text-blue-600 font-medium">
                        {cam.waterLevelCm ? `ระดับน้ำ: ${cam.waterLevelCm} ซม.` : 'สัญญาณปกติ'}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-blue-600 font-semibold">
                      ดูภาพสด &rarr;
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-slate-200 dark:border-slate-700"
          >
            ปิดหน้าต่าง
          </Button>

          {onFocusOnMap && (
            <Button
              size="sm"
              onClick={() => {
                onFocusOnMap(roadCenter, 14);
                onClose();
              }}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 mr-1.5" />
              เลื่อนไปดูจุดนี้บนแผนที่
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default BangkokRoadDetailModal;
