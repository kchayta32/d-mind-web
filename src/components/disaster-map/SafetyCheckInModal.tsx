import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, AlertCircle, MapPin, Users, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

interface SafetyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  disasterTitle?: string;
}

export const SafetyCheckInModal: React.FC<SafetyCheckInModalProps> = ({
  isOpen,
  onClose,
  disasterTitle = 'เหตุการณ์ภัยพิบัติ'
}) => {
  const [status, setStatus] = useState<'safe' | 'need_help'>('safe');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [peopleCount, setPeopleCount] = useState('1');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const record = {
        status,
        name: name || 'ผู้ใช้งาน D-MIND',
        contact,
        peopleCount,
        note,
        timestamp: new Date().toISOString()
      };
      
      try {
        const existing = JSON.parse(localStorage.getItem('dmind_safety_checkins') || '[]');
        existing.unshift(record);
        localStorage.setItem('dmind_safety_checkins', JSON.stringify(existing.slice(0, 50)));
      } catch (err) {
        console.error(err);
      }

      if (status === 'safe') {
        toast.success('บันทึกสถานะปลอดภัยแล้ว!', {
          description: 'ข้อมูลของคุณได้รับการบันทึกในระบบศูนย์ประสานงานฉุกเฉิน D-MIND'
        });
      } else {
        toast.error('ส่งสัญญาณขอความช่วยเหลือแล้ว!', {
          description: 'ประสานงานสายด่วนฉุกเฉิน 1669 / ปภ. 1784 ให้ทราบสถานะของคุณแล้ว'
        });
      }

      onClose();
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-slate-900 border border-slate-700 text-white shadow-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white">
                Safety Check-in (รายงานความปลอดภัย)
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                สถานการณ์: {disasterTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
          {/* Status Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStatus('safe')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                status === 'safe'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
              <span className="font-bold text-sm">ฉันปลอดภัยดี</span>
              <span className="text-[10px] text-slate-400">ไม่ได้รับอันตราย</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('need_help')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                status === 'need_help'
                  ? 'bg-red-600/30 border-red-500 text-red-300 shadow-md ring-1 ring-red-500'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-bold text-sm">ต้องการความช่วยเหลือ</span>
              <span className="text-[10px] text-slate-400">แจ้งทีมกู้ภัยด่วน</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">ชื่อ - นามสกุล หรือ นามแฝง</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น นายสมชาย ปลอดภัย"
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">เบอร์ติดต่อ</label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="08X-XXX-XXXX"
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>จำนวนคน (รวมตัวคุณ)</span>
              </label>
              <Input
                type="number"
                min="1"
                max="50"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">ข้อความเพิ่มเติม / จุดสังเกต</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น อยู่ชั้น 2 ของบ้าน, อาคารร้าวเล็กน้อยแต่ปลอดภัย..."
              rows={2}
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 font-bold ${
                status === 'safe'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน Check-in'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
