import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Scale, Database, Lock, CheckCircle2 } from 'lucide-react';

export interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'disclaimer' | 'pdpa' | 'attribution';
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'disclaimer',
}) => {
  const [activeTab, setActiveTab] = React.useState<'disclaimer' | 'pdpa' | 'attribution'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-800 text-slate-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                ข้อกำหนด เงื่อนไข และการคุ้มครองข้อมูล (D-MIND)
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Disaster Intelligence Legal, PDPA Privacy & Open Data Terms
              </DialogDescription>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4 pt-2">
            <button
              onClick={() => setActiveTab('disclaimer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'disclaimer'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ข้อสงวนสิทธิ์ความปลอดภัย</span>
            </button>
            <button
              onClick={() => setActiveTab('pdpa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'pdpa'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>นโยบายความเป็นส่วนตัว (PDPA)</span>
            </button>
            <button
              onClick={() => setActiveTab('attribution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'attribution'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>แหล่งข้อมูล & ลิขสิทธิ์</span>
            </button>
          </div>
        </DialogHeader>

        {/* Tab 1: Life-Safety Disaster Disclaimer */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-4 py-4 text-sm text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>คำเตือนสำคัญด้านความปลอดภัยในชีวิตและทรัพย์สิน</span>
              </div>
              <p className="text-xs text-amber-100/90">
                ข้อมูลและการวิเคราะห์สภาพน้ำท่วม ดัชนีความเสี่ยง และคำแนะนำจาก Typhoon AI ในแพลตฟอร์ม D-MIND จัดทำขึ้นเพื่อเป็นข้อมูลสนับสนุนการตัดสินใจเบื้องต้นของประชาชนและนักวิจัยเท่านั้น
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <p>
                1. <strong>ไม่ใช่คำสั่งราชการ:</strong> แพลตฟอร์มนี้ไม่สามารถทดแทนประกาศเตือนภัย คำสั่งอพยพ หรือแนวทางปฏิบัติอย่างเป็นทางการของ <strong>กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)</strong>, <strong>กรุงเทพมหานคร</strong>, หรือ <strong>กรมอุตุนิยมวิทยา</strong> ได้
              </p>
              <p>
                2. <strong>กรณีวิกฤตฉุกเฉิน:</strong> หากเกิดเหตุอุทกภัยฉุกเฉิน มีผู้ติดค้าง หรือต้องการความช่วยเหลือด้านการกู้ชีพ โปรดติดต่อสายด่วนภาครัฐโดยตรงทันที:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 font-medium text-xs">
                <li>สายด่วนนิรภัย ปภ. <strong>1784</strong> (ตลอด 24 ชั่วโมง)</li>
                <li>ศูนย์เตือนน้ำท่วมและรับแจ้งเหตุกรุงเทพมหานคร <strong>1555</strong></li>
                <li>หน่วยแพทย์ฉุกเฉิน / กู้ชีพกู้ภัย <strong>1669</strong></li>
                <li>ศูนย์ควบคุมและสั่งการจราจร บก.02 <strong>1197</strong></li>
              </ul>
              <p>
                3. <strong>ข้อจำกัดด้านความถูกต้อง:</strong> สภาพน้ำท่วมขังบนถนน การระบายน้ำ และการเปิด-ปิดร้านค้า อาจเปลี่ยนแปลงได้รวดเร็วตามความแปรปรวนของสภาพอากาศ โปรดใช้ดุลยพินิจและความระมัดระวังสูงสุดในการเดินทาง
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: PDPA Compliance */}
        {activeTab === 'pdpa' && (
          <div className="space-y-4 py-4 text-sm text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>การคุ้มครองข้อมูลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</span>
              </div>
              D-MIND ปฏิบัติตามมาตรฐานการปกป้องข้อมูลส่วนบุคคล และไม่มีนโยบายการจำหน่ายข้อมูลผู้ใช้แก่บุคคลที่สาม
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <p>
                1. <strong>ข้อมูลตำแหน่งทางภูมิศาสตร์ (GPS):</strong> การขอเข้าถึงตำแหน่งพิกัดใช้เฉพาะเจาะจงเพื่อแสดงผลตำแหน่งของคุณบนแผนที่เรดาร์ และสำหรับการปักหมุดรายงานน้ำท่วมภาคประชาชน ข้อมูลนี้ไม่ได้จัดเก็บเพื่อการติดตามตัวบุคคลต่อเนื่อง
              </p>
              <p>
                2. <strong>รายงานน้ำท่วมภาคประชาชน:</strong> รายงานที่ส่งเข้ามาจะถูกนำไปสังเคราะห์ระดับน้ำท่วมขังเพื่อประโยชน์สาธารณะ โดยไม่แสดงชื่อหรือข้อมูลระบุตัวตนของผู้รายงานต่อสาธารณะ
              </p>
              <p>
                3. <strong>แบบสำรวจความพึงพอใจ:</strong> บันทึกในรูปแบบนิรนาม (Anonymized) เพื่อใช้ในการพัฒนาและปรับปรุงคุณภาพระบบตามหลักการวิจัย
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Data Attribution */}
        {activeTab === 'attribution' && (
          <div className="space-y-3 py-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p className="text-slate-200 font-semibold mb-2">
              D-MIND บูรณาการและเชื่อมโยงชุดข้อมูลสาธารณะจากหน่วยงานและพันธมิตร:
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5">
                <span className="text-base">🗺️</span>
                <div>
                  <h4 className="font-bold text-white text-xs">OpenStreetMap & Overpass Turbo</h4>
                  <p className="text-[11px] text-slate-400">ข้อมูลแผนที่ เส้นทาง และร้านคาเฟ่/บาร์ ภายใต้ลิขสิทธิ์ Open Database License (ODbL) โดย © OpenStreetMap contributors</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5">
                <span className="text-base">🌊</span>
                <div>
                  <h4 className="font-bold text-white text-xs">สสน. (ThaiWater HII) & กทม.</h4>
                  <p className="text-[11px] text-slate-400">โทรมาตรระดับน้ำแม่น้ำเจ้าพระยา ประตูระบายน้ำ และสถานีสูบน้ำ โดยสถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) และสำนักการระบายน้ำ กทม.</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5">
                <span className="text-base">🛰️</span>
                <div>
                  <h4 className="font-bold text-white text-xs">GISTDA & Copernicus Sentinel-1</h4>
                  <p className="text-[11px] text-slate-400">ภาพถ่ายดาวเทียมตรวจจับพื้นที่น้ำท่วมขังและจุดความร้อน โดย GISTDA และ European Space Agency (ESA)</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-2.5">
                <span className="text-base">🤖</span>
                <div>
                  <h4 className="font-bold text-white text-xs">OpenTyphoon AI (SCB 10X)</h4>
                  <p className="text-[11px] text-slate-400">โมเดลภาษาไทยอัจฉริยะ Typhoon v2.5 สำหรับประมวลผลคำแนะนำด้านสภาพอากาศและการเดินทาง</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 px-4 rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            เข้าใจและรับทราบ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
