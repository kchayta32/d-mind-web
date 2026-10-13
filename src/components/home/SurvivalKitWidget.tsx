import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Share2, 
  RotateCcw, 
  Sparkles, 
  BatteryCharging, 
  Droplet, 
  Pill, 
  Flashlight, 
  FileCheck, 
  BellRing, 
  Utensils, 
  LifeBuoy 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageProvider';

interface KitItem {
  id: string;
  labelTh: string;
  labelEn: string;
  category: 'water' | 'food' | 'medical' | 'tools' | 'docs';
  descTh: string;
  descEn: string;
  icon: string;
}

const KIT_ITEMS: KitItem[] = [
  {
    id: 'water',
    labelTh: 'น้ำดื่มสะอาด (อย่างน้อย 3 ลิตร/คน/วัน)',
    labelEn: 'Drinking water (min 3L/person/day)',
    category: 'water',
    descTh: 'บรรจุขวดมิดชิด สำหรับดื่มและบริโภคฉุกเฉิน 3 วัน',
    descEn: 'Sealed bottles for 3-day emergency consumption',
    icon: '💧'
  },
  {
    id: 'food',
    labelTh: 'อาหารแห้ง / อาหารสำเร็จรูปพร้อมทาน',
    labelEn: 'Non-perishable food / MREs',
    category: 'food',
    descTh: 'ปลากระป๋อง ข้าวซอง บาร์พลังงาน ที่ไม่ต้องปรุง',
    descEn: 'Canned food, ready-to-eat meals, energy bars',
    icon: '🥫'
  },
  {
    id: 'meds',
    labelTh: 'ยาประจำตัว & ชุดปฐมพยาบาลเบื้องต้น',
    labelEn: 'Personal meds & First aid kit',
    category: 'medical',
    descTh: 'พาราเซตามอล ยาแก้แพ้ ผงเกลือแร่ ยาประจำตัวอย่างน้อย 7 วัน',
    descEn: 'Essential meds, bandages, antiseptic, min 7-day supply',
    icon: '💊'
  },
  {
    id: 'light',
    labelTh: 'ไฟฉายสว่างสูง & ถ่านสำรอง',
    labelEn: 'High-power flashlight & spare batteries',
    category: 'tools',
    descTh: 'จำเป็นอย่างยิ่งเมื่อไฟฟ้าดับช่วงพายุหรือน้ำท่วมฉับพลัน',
    descEn: 'Crucial during power blackouts in storm/flood',
    icon: '🔦'
  },
  {
    id: 'powerbank',
    labelTh: 'พาวเวอร์แบงค์ชาร์จเต็ม & สายชาร์จ',
    labelEn: 'Fully charged power bank & cables',
    category: 'tools',
    descTh: 'ความจุอย่างน้อย 20,000 mAh เพื่อติดต่อสื่อสารและเช็กข่าว',
    descEn: 'Min 20,000 mAh to maintain emergency comms',
    icon: '🔋'
  },
  {
    id: 'docs',
    labelTh: 'สำเนาเอกสารสำคัญในซองกันน้ำ',
    labelEn: 'Important documents in waterproof pouch',
    category: 'docs',
    descTh: 'บัตรประชาชน ทะเบียนบ้าน กรมธรรม์ สมุดบัญชีธนาคาร',
    descEn: 'ID card, passport, insurance policy, bank books',
    icon: '📄'
  },
  {
    id: 'whistle',
    labelTh: 'นกหวีดขอความช่วยเหลือ',
    labelEn: 'Emergency whistle',
    category: 'tools',
    descTh: 'ส่งสัญญาณเสียงได้ไกลโดยไม่ต้องตะโกน ประหยัดพลังงาน',
    descEn: 'Audible distress signaling without voice exhaustion',
    icon: '📢'
  },
  {
    id: 'cash',
    labelTh: 'เงินสดฉุกเฉิน (ธนบัตรย่อย)',
    labelEn: 'Emergency cash (small bills)',
    category: 'docs',
    descTh: 'ใช้เมื่อตู้ ATM หรือระบบสแกนชำระเงินขัดข้อง',
    descEn: 'Useful when power or payment systems are offline',
    icon: '💵'
  }
];

const STORAGE_KEY = 'dmind_survival_kit_checked';

export const SurvivalKitWidget: React.FC = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [checkedItems, setCheckedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['water', 'powerbank'];
    } catch {
      return ['water', 'powerbank'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
    } catch (e) {
      // ignore
    }
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const score = useMemo(() => {
    return Math.round((checkedItems.length / KIT_ITEMS.length) * 100);
  }, [checkedItems]);

  const readinessStatus = useMemo(() => {
    if (score === 100) return { label: isEn ? 'Fully Prepared (100%)' : 'พร้อมรบเต็มพิกัด (100%)', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (score >= 75) return { label: isEn ? 'Good Readiness (75%+)' : 'ความพร้อมระดับดีเยี่ยม', color: 'text-teal-400', bg: 'bg-teal-500/20' };
    if (score >= 50) return { label: isEn ? 'Moderate (50%+)' : 'ความพร้อมระดับปานกลาง', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { label: isEn ? 'Needs Immediate Prep (<50%)' : 'ควรจัดเตรียมเพิ่มเติมด่วน', color: 'text-red-400', bg: 'bg-red-500/20' };
  }, [score, isEn]);

  const handleShare = async () => {
    const shareText = isEn
      ? `🎒 My 72-Hour Disaster Survival Kit is ${score}% prepared on D-MIND! Check your readiness score here: https://d-mind-six.vercel.app/`
      : `🎒 กระเป๋าฉุกเฉิน 72 ชั่วโมงของฉันมีความพร้อม ${score}% บนระบบ D-MIND! มาตรวจเช็กความพร้อมรับมือน้ำท่วมและภัยพิบัติกันได้ที่: https://d-mind-six.vercel.app/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'D-MIND 72-Hour Survival Kit',
          text: shareText,
          url: 'https://d-mind-six.vercel.app/',
        });
        toast({
          title: 'แชร์สำเร็จ!',
          description: 'แบ่งปันเช็กลิสต์ความพร้อมเรียบร้อยแล้ว',
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'คัดลอกข้อความสำเร็จ! 📋',
        description: 'นำข้อความไปแชร์ใน LINE หรือ Social Media ได้ทันที',
      });
    } catch {
      window.open(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleReset = () => {
    setCheckedItems([]);
  };

  return (
    <section className="py-12 bg-slate-900/90 dark:bg-slate-950/90 text-white border-y border-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/90 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-2">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>{isEn ? 'CITIZEN DISASTER READINESS' : 'เครื่องมือเตรียมพร้อมภาคประชาชน'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isEn ? '72-Hour Emergency Survival Bag Checklist' : '🎒 เช็กลิสต์ "กระเป๋าฉุกเฉิน 72 ชั่วโมง" (Go-Bag)'}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                {isEn 
                  ? 'Check essential items needed to survive autonomously for 72 hours during floods or storms before help arrives.'
                  : 'ตรวจสอบสิ่งของจำเป็นที่ต้องมีติดบ้านหรือพร้อมหยิบหนีภัย เพื่อดำรงชีพได้ด้วยตนเองอย่างน้อย 72 ชั่วโมงยามเกิดวิกฤต'}
              </p>
            </div>

            {/* Score Pill */}
            <div className="flex flex-col items-start md:items-end shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white">{score}%</span>
                <span className="text-xs text-slate-400 font-semibold">{isEn ? 'Ready' : 'ความพร้อม'}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${readinessStatus.bg} ${readinessStatus.color} mt-1`}>
                {readinessStatus.label}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>{checkedItems.length} จาก {KIT_ITEMS.length} รายการ</span>
              <span>เป้าหมาย: 100% ครบทุกรายการ</span>
            </div>
            <Progress value={score} className="h-2.5 bg-slate-800" />
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {KIT_ITEMS.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-950/30'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="text-xl pt-0.5">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                      {isEn ? item.labelEn : item.labelTh}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {isEn ? item.descEn : item.descTh}
                    </p>
                  </div>
                  <div className="pt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>{isEn ? 'Reset Checklist' : 'รีเซ็ตเช็กลิสต์'}</span>
            </Button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                onClick={handleShare}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-xs h-10 px-5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>{isEn ? 'Share My Readiness Score' : 'แชร์คะแนนความพร้อมให้เพื่อน'}</span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SurvivalKitWidget;
