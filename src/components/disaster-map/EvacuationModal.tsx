import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Compass, Phone, ShieldAlert, CheckCircle, Navigation, MapPin } from 'lucide-react';

interface EvacuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  disasterType?: string;
}

const EVACUATION_SHELTERS = [
  {
    name: 'ศูนย์พักพิงชั่วคราว วัดพนัญเชิงวรวิหาร (พื้นที่ดอนน้ำไม่ท่วม)',
    province: 'จ.พระนครศรีอยุธยา',
    capacity: 'รองรับได้ 500 คน',
    contact: '035-241-700',
    facilities: 'อาหาร น้ำดื่ม หน่วยปฐมพยาบาล',
    lat: 14.3444,
    lng: 100.5794
  },
  {
    name: 'ศูนย์อพยพผู้ประสบอุทกภัย โรงเรียนสิงห์บุรี',
    province: 'จ.สิงห์บุรี',
    capacity: 'รองรับได้ 800 คน',
    contact: '036-511-041',
    facilities: 'จุดชาร์จไฟ ที่นอน สัตวแพทย์ดูแลสัตว์เลี้ยง',
    lat: 14.8872,
    lng: 100.4047
  },
  {
    name: 'ศูนย์บัญชาการเหตุการณ์ ปภ. เขต 1 (ปทุมธานี)',
    province: 'จ.ปทุมธานี',
    capacity: 'รองรับได้ 1,200 คน',
    contact: '02-567-2700',
    facilities: 'เรือท้องแบน รถยกสูง แพทย์สนาม',
    lat: 14.0208,
    lng: 100.5250
  },
  {
    name: 'หอประชุมอำเภอแม่สาย (ศูนย์พักพิงน้ำหลาก/ดินถล่ม)',
    province: 'จ.เชียงราย',
    capacity: 'รองรับได้ 600 คน',
    contact: '053-731-008',
    facilities: 'โรงครัวพระราชทาน จุดตรวจสุขภาพ',
    lat: 20.4333,
    lng: 99.8833
  }
];

export const EvacuationModal: React.FC<EvacuationModalProps> = ({
  isOpen,
  onClose,
  disasterType = 'อุทกภัย'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-slate-900 border border-slate-700 text-white shadow-2xl p-6 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">
                เส้นทางอพยพ & ศูนย์พักพิงชั่วคราว
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                ข้อมูลจุดปลอดภัย ศูนย์อพยพฉุกเฉิน และสายด่วนกู้ภัย ปภ. 1784
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Hotlines */}
        <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-3 flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-400 animate-bounce" />
            <div>
              <p className="font-bold text-xs text-red-200">สายด่วนขอความช่วยเหลือเร่งด่วน</p>
              <p className="text-[10px] text-slate-300">ปภ. รับแจ้งเหตุ 1784 • กู้ชีพ 1669 • สายด่วน กทม. 1555</p>
            </div>
          </div>
          <a
            href="tel:1784"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            โทร 1784
          </a>
        </div>

        {/* Shelters List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>ศูนย์พักพิงและจุดรวมพลปลอดภัย</span>
          </h4>

          {EVACUATION_SHELTERS.map((shelter, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-red-500/50 transition-all flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{shelter.name}</span>
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {shelter.province} • {shelter.capacity}
                  </p>
                </div>
                <a
                  href={`tel:${shelter.contact.replace(/-/g, '')}`}
                  className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded-md font-mono flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>{shelter.contact}</span>
                </a>
              </div>

              <div className="text-[10px] text-slate-300 bg-slate-900/60 p-2 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span>สิ่งอำนวยความสะดวก: {shelter.facilities}</span>
              </div>

              <div className="flex justify-end pt-0.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold bg-sky-950/60 hover:bg-sky-900/60 px-3 py-1.5 rounded-lg border border-sky-800 transition"
                >
                  <Navigation className="w-3 h-3" />
                  <span>นำทางเส้นทางอพยพ</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
          >
            ปิดหน้าต่าง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
