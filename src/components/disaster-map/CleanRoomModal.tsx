import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wind, MapPin, Navigation, CheckCircle2, Shield, Search } from 'lucide-react';

interface CleanRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLEAN_ROOMS = [
  {
    id: 1,
    name: 'ศูนย์บริการสาธารณสุข 4 ลุมพินี',
    district: 'เขตปทุมวัน กรุงเทพฯ',
    address: 'ซอยปลูกจิต แขวงลุมพินี',
    indoorPm25: '12.4 µg/m³ (ปลอดภัยมาก)',
    purifierCount: 8,
    status: 'เปิดให้บริการ',
    lat: 13.7289,
    lng: 100.5489
  },
  {
    id: 2,
    name: 'หอสมุดเมืองกรุงเทพมหานคร (Bangkok City Library)',
    district: 'เขตพระนคร กรุงเทพฯ',
    address: 'สี่แยกคอกวัว ถนนราชดำเนินกลาง',
    indoorPm25: '14.8 µg/m³ (ปลอดภัยมาก)',
    purifierCount: 15,
    status: 'เปิดให้บริการ (08:00 - 21:00)',
    lat: 13.7570,
    lng: 100.4998
  },
  {
    id: 3,
    name: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย (อาคารภูมิสิริมังคลานุสรณ์)',
    district: 'เขตปทุมวัน กรุงเทพฯ',
    address: 'ถนนพระราม 4 แขวงปทุมวัน',
    indoorPm25: '8.2 µg/m³ (มาตรฐานการแพทย์)',
    purifierCount: 30,
    status: 'เปิดตลอด 24 ชั่วโมง',
    lat: 13.7314,
    lng: 100.5342
  },
  {
    id: 4,
    name: 'ศูนย์การเรียนรู้สุขภาวะ (สสส.)',
    district: 'เขตสาทร กรุงเทพฯ',
    address: 'ซอยงามดูพลี แขวงทุ่งมหาเมฆ',
    indoorPm25: '15.0 µg/m³ (ปลอดภัย)',
    purifierCount: 10,
    status: 'เปิดให้บริการ',
    lat: 13.7206,
    lng: 100.5471
  },
  {
    id: 5,
    name: 'ศูนย์เยาวชนกรุงเทพมหานคร (ไทย-ญี่ปุ่น ดินแดง)',
    district: 'เขตดินแดง กรุงเทพฯ',
    address: 'ถนนมิตรไมตรี แขวงดินแดง',
    indoorPm25: '16.5 µg/m³ (ปลอดภัย)',
    purifierCount: 12,
    status: 'เปิดให้บริการ',
    lat: 13.7663,
    lng: 100.5539
  }
];

export const CleanRoomModal: React.FC<CleanRoomModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = CLEAN_ROOMS.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xl p-6 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                ห้องปลอดฝุ่น Clean Air Room
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                จุดหลบฝุ่นพิษ PM2.5 ที่มีระบบฟอกอากาศมาตรฐาน ปลอดภัยสำหรับเด็ก ผู้สูงอายุ และประชาชน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามชื่อ หรือ เขต..."
            className="pl-9 bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
          {filtered.map((room) => (
            <div
              key={room.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-teal-500/50 transition-all flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span>{room.name}</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{room.district} • {room.address}</span>
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30 font-semibold whitespace-nowrap">
                  {room.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">PM2.5 ภายในห้อง:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{room.indoorPm25}</span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                  ฟอกอากาศ {room.purifierCount} เครื่อง
                </span>
              </div>

              <div className="flex justify-end pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${room.lat},${room.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 font-semibold bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 transition"
                >
                  <Navigation className="w-3 h-3" />
                  <span>นำทางด้วย Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            ปิดหน้าต่าง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
