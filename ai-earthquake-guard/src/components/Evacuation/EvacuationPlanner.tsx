import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Compass, 
  HeartPulse, 
  Flame, 
  Lightbulb, 
  FileText, 
  AlertTriangle,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { EvacuationShelter } from '../../types/seismic';

interface ChecklistItem {
  id: string;
  category: 'medical' | 'survival' | 'food' | 'document' | 'gear';
  name: string;
  nameEn: string;
  description: string;
  essential: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'med_firstaid',
    category: 'medical',
    name: 'ชุดปฐมพยาบาลและยาประจำตัว',
    nameEn: 'First Aid Kit & Personal Medicine',
    description: 'ยาเบาหวาน ความดัน พลาสเตอร์ ยาฆ่าเชื้อ ผ้าพันแผล ยาแก้ปวด',
    essential: true,
  },
  {
    id: 'surv_water',
    category: 'food',
    name: 'น้ำดื่มสะอาดสำหรับ 3 วัน',
    nameEn: 'Bottled Water (3 Liters/person/day)',
    description: 'อย่างน้อย 3 ลิตรต่อคนต่อวัน สำหรับดื่มและสุขอนามัยจำเป็น',
    essential: true,
  },
  {
    id: 'surv_food',
    category: 'food',
    name: 'อาหารแห้งและอาหารพลังงานสูง',
    nameEn: 'Non-perishable Food & Energy Bars',
    description: 'อาหารกระป๋องแบบเปิดง่าย ขนมปังกรอบ โปรตีนบาร์ที่เก็บได้นาน',
    essential: true,
  },
  {
    id: 'surv_flashlight',
    category: 'survival',
    name: 'ไฟฉายส่องสว่างพร้อมถ่านสำรอง',
    nameEn: 'LED Flashlight & Spare Batteries',
    description: 'หลีกเลี่ยงการจุดเทียนหรือไม้ขีดไฟเพื่อป้องกันแก๊สระเบิด',
    essential: true,
  },
  {
    id: 'surv_whistle',
    category: 'survival',
    name: 'นกหวีดกู้ภัยฉุกเฉิน',
    nameEn: 'Emergency Rescue Whistle',
    description: 'ใช้เป่าส่งสัญญาณขอความช่วยเหลือ ประหยัดแรงกว่าการตะโกน',
    essential: true,
  },
  {
    id: 'surv_powerbank',
    category: 'survival',
    name: 'พาวเวอร์แบงค์ชาร์จมือถือและสายชาร์จ',
    nameEn: 'Power Bank & Mobile Cables',
    description: 'ความจุ 10,000-20,000 mAh ที่ชาร์จเต็มเสมอเพื่อการสื่อสาร',
    essential: true,
  },
  {
    id: 'surv_mask',
    category: 'gear',
    name: 'หน้ากากกันฝุ่น N95 หรือผ้าปิดจมูก',
    nameEn: 'N95 Respirator Masks',
    description: 'ป้องกันการสูดดมฝุ่นปูนและละอองสารเคมีจากซากปรักหักพัง',
    essential: true,
  },
  {
    id: 'surv_shoes',
    category: 'gear',
    name: 'รองเท้าหุ้มส้นพื้นหนาและถุงมือช่าง',
    nameEn: 'Heavy Duty Shoes & Work Gloves',
    description: 'ป้องกันเศษแก้ว โลหะ และเหล็กเส้นทิ่มแทงขณะอพยพ',
    essential: false,
  },
  {
    id: 'doc_waterproof',
    category: 'document',
    name: 'เอกสารสำคัญบรรจุซองกันน้ำ',
    nameEn: 'Important Documents in Waterproof Bag',
    description: 'บัตรประชาชน ทะเบียนบ้าน กรมธรรม์ประกัน สมุดบัญชีธนาคาร',
    essential: true,
  },
  {
    id: 'doc_cash',
    category: 'document',
    name: 'เงินสดสำรองธนบัตรย่อยและเหรียญ',
    nameEn: 'Emergency Cash in Small Bills',
    description: 'ตู้ ATM และระบบชำระเงินดิจิทัลอาจล่มเมื่อกระแสไฟฟ้าดับ',
    essential: false,
  },
];

const EMERGENCY_HOTLINES = [
  {
    number: '1784',
    title: 'กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)',
    subtitle: 'ศูนย์เตือนภัยพิบัติแห่งชาติ (DDPM National Disaster Center)',
    urgency: 'critical',
  },
  {
    number: '1669',
    title: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)',
    subtitle: 'บริการการแพทย์ฉุกเฉินและรถพยาบาลกู้ชีพ (EMS Ambulance)',
    urgency: 'critical',
  },
  {
    number: '1182',
    title: 'กองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา',
    subtitle: 'ตรวจสอบข้อมูลและขนาดแผ่นดินไหวทางการ (TMD Earthquake)',
    urgency: 'advisory',
  },
  {
    number: '191',
    title: 'เหตุด่วนเหตุร้าย ตำรวจนครบาล/ภูธร',
    subtitle: 'การระงับเหตุความปลอดภัยและการจราจร (Royal Thai Police)',
    urgency: 'warning',
  },
  {
    number: '199',
    title: 'ศูนย์วิทยุพระราม ดับเพลิงและกู้ภัย',
    subtitle: 'เหตุเพลิงไหม้ อาคารถล่ม และค้นหากู้ภัย (Fire & Rescue)',
    urgency: 'critical',
  },
  {
    number: '1567',
    title: 'ศูนย์ดำรงธรรม กระทรวงมหาดไทย',
    subtitle: 'ประสานงานช่วยเหลือผู้ประสบภัยระดับจังหวัด (Damrongdhama)',
    urgency: 'advisory',
  },
];

const MOCK_SHELTERS: EvacuationShelter[] = [
  {
    id: 'sh-01',
    name: 'สนามกีฬาเฉลิมพระเกียรติ 80 พรรษา (จุดรวมพลกลาง)',
    type: 'stadium',
    lat: 18.795,
    lng: 98.98,
    capacity: 12000,
    distanceKm: 1.8,
    suppliesAvailable: true,
    address: 'ต.สุเทพ อ.เมือง จ.เชียงใหม่ (พื้นที่เปิดโล่งห่างไกลเสาไฟฟ้าแรงสูง)',
  },
  {
    id: 'sh-02',
    name: 'สวนสาธารณะหนองบวกหาด (Safe Open Park)',
    type: 'park',
    lat: 18.781,
    lng: 98.982,
    capacity: 4500,
    distanceKm: 2.4,
    suppliesAvailable: true,
    address: 'ต.พระสิงห์ อ.เมือง จ.เชียงใหม่ (ลานหญ้ากว้าง ปลอดโครงสร้างอาคารสูง)',
  },
  {
    id: 'sh-03',
    name: 'ศูนย์ประชุมและแสดงสินค้านานาชาติ เชียงใหม่',
    type: 'open_ground',
    lat: 18.825,
    lng: 98.965,
    capacity: 25000,
    distanceKm: 5.1,
    suppliesAvailable: true,
    address: 'ถ.เลียบคลองชลประทาน ต.ช้างเผือก อ.เมือง จ.เชียงใหม่ (จุดบัญชาการหลัก)',
  },
  {
    id: 'sh-04',
    name: 'สวนลุมพินี กรุงเทพมหานคร (Bangkok Lumpini Safe Zone)',
    type: 'park',
    lat: 13.7314,
    lng: 100.5414,
    capacity: 35000,
    distanceKm: 12.0,
    suppliesAvailable: true,
    address: 'ถ.พระรามที่ 4 แขวงลุมพินี เขตปทุมวัน กทม. (จุดรวมพลเปิดโล่งใจกลางเมือง)',
  },
];

export const EvacuationPlanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'highrise' | 'house' | 'outdoor'>('highrise');

  // Load checklist state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('seismoguard_evac_checklist');
      if (stored) {
        setCheckedItems(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Toggle item
  const toggleItem = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem('seismoguard_evac_checklist', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleResetChecklist = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem('seismoguard_evac_checklist');
    } catch (e) {}
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    DEFAULT_CHECKLIST.forEach((item) => {
      allChecked[item.id] = true;
    });
    setCheckedItems(allChecked);
    try {
      localStorage.setItem('seismoguard_evac_checklist', JSON.stringify(allChecked));
    } catch (e) {}
  };

  const totalItems = DEFAULT_CHECKLIST.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const handleCopyPhone = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className={`bg-seismic-card border border-seismic-border rounded-xl p-4 sm:p-6 shadow-2xl space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-seismic-border/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              72-Hour Survival & Evacuation Planner
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              คู่มือแผนอพยพ กระเป๋าเป้ยังชีพ 72 ชั่วโมง และทำเนียบสายด่วนกู้ภัยฉุกเฉินระดับประเทศ
            </p>
          </div>
        </div>

        {/* Preparedness Score Progress */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">ความพร้อมยังชีพ</span>
            <span className="font-mono text-sm font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-20 sm:w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Hotlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Checklist: 72-Hour Go-Bag (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                กระเป๋าเป้ยังชีพ 72 ชั่วโมง (Emergency Go-Bag)
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={handleCheckAll}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                เลือกทั้งหมด
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={handleResetChecklist}
                className="text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> ล้าง
              </button>
            </div>
          </div>

          {/* Checklist Items Container */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {DEFAULT_CHECKLIST.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {item.name}
                      </span>
                      {item.essential && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
                          สำคัญมาก
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Hotline Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              ศูนย์รับแจ้งเหตุฉุกเฉินระดับชาติ (National Hotlines)
            </h3>
          </div>

          <div className="space-y-2.5">
            {EMERGENCY_HOTLINES.map((hotline) => {
              const isCopied = copiedNumber === hotline.number;
              return (
                <div
                  key={hotline.number}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-black text-rose-400">
                        {hotline.number}
                      </span>
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {hotline.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {hotline.subtitle}
                    </p>
                  </div>

                  {/* Actions: Dial & Copy */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyPhone(hotline.number)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="คัดลอกเบอร์โทร"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`tel:${hotline.number}`}
                      className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1 text-xs font-mono font-bold"
                      title="โทรออกทันที"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Survival Guide by Building Typology */}
      <div className="space-y-3 pt-3 border-t border-seismic-border/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <Compass className="w-4 h-4 text-cyan-400" />
            แนวทางปฏิบัติตามประเภทสิ่งปลูกสร้าง (Structural Typology Guide)
          </h3>

          {/* Guide Subtabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveGuideTab('highrise')}
              className={`px-3 py-1 rounded transition-colors ${activeGuideTab === 'highrise' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              อาคารสูง / คอนโด
            </button>
            <button
              onClick={() => setActiveGuideTab('house')}
              className={`px-3 py-1 rounded transition-colors ${activeGuideTab === 'house' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              บ้านพัก / ทาวน์โฮม
            </button>
            <button
              onClick={() => setActiveGuideTab('outdoor')}
              className={`px-3 py-1 rounded transition-colors ${activeGuideTab === 'outdoor' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              ที่โล่งแจ้ง / ถนน
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        {activeGuideTab === 'highrise' && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p><strong className="text-cyan-300">1. ห้ามใช้ลิฟต์โดยเด็ดขาด:</strong> การสั่นสะเทือนจะทำให้ระบบรอกและรางบิดเบี้ยว รวมถึงระบบไฟฟ้าอาจตัดอัตโนมัติ ทำให้ติดค้างในปล่องลิฟต์</p>
            <p><strong className="text-cyan-300">2. อาคารสูงถูกออกแบบให้แกว่งไกว (Swaying):</strong> อย่าตื่นตระหนกหากอาคารโยกไปมา ให้หมอบกำบังใต้โต๊ะแน่นหนา ห่างจากผนังกระจกและชั้นวางของสูง</p>
            <p><strong className="text-cyan-300">3. รอการสั่นหยุดสนิท:</strong> จึงเริ่มอพยพลงทางบันไดหนีไฟอย่างเป็นระเบียบ สวมรองเท้าพื้นหนาและพกกระเป๋าเป้ยังชีพ</p>
          </div>
        )}

        {activeGuideTab === 'house' && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p><strong className="text-amber-300">1. ตัดแก๊สและไฟฟ้าทันที:</strong> ปิดวาล์วถังก๊าซหุงต้มและสับคัตเอาต์ไฟเมนหลัก ป้องกันเพลิงไหม้จากแก๊สรั่วและไฟฟ้าลัดวงจร</p>
            <p><strong className="text-amber-300">2. เปิดประตูทางออกให้อ้าไว้:</strong> แรงสั่นสะเทือนอาจทำให้กรอบประตูบิดเบี้ยวจนเปิดไม่ออก ขังผู้อยู่อาศัยไว้ด้านใน</p>
            <p><strong className="text-amber-300">3. หมอบใต้เสาหรือคานโครงสร้างหลัก:</strong> หากไม่มีโต๊ะ ให้หมอบชิดมุมเสาด้านในอาคาร ปกป้องศีรษะ</p>
          </div>
        )}

        {activeGuideTab === 'outdoor' && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p><strong className="text-emerald-300">1. วิ่งเข้าหาพื้นที่เปิดโล่ง (Open Space):</strong> สนามหญ้า ลานจอดรถกว้าง สวนสาธารณะ</p>
            <p><strong className="text-emerald-300">2. ระวังอันตรายตกจากที่สูง:</strong> ป้ายโฆษณา กระจกอาคาร เสาไฟฟ้าแรงสูง และหม้อแปลงไฟฟ้า</p>
            <p><strong className="text-emerald-300">3. หากกำลังขับรถ:</strong> ให้เปิดไฟฉุกเฉิน ค่อยๆ ชะลอรถเข้าจอดข้างทางในที่ปลอดภัย ห้ามจอดใต้สะพานหรือทางยกระดับ</p>
          </div>
        )}
      </div>

      {/* Designated Safe Zones & Evacuation Shelters */}
      <div className="space-y-3 pt-3 border-t border-seismic-border/70">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <MapPin className="w-4 h-4 text-emerald-400" />
            ศูนย์พักพิงและจุดรวมพลปลอดภัยตัวอย่าง (Designated Safe Shelters)
          </h3>
          <span className="text-xs text-slate-400 font-mono">พิกัดรับรองโดย ปภ.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_SHELTERS.map((shelter) => (
            <div
              key={shelter.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-1">
                    {shelter.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold shrink-0">
                    ความจุ {shelter.capacity.toLocaleString()} คน
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {shelter.address}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Navigation className="w-3 h-3" /> ระยะห่าง {shelter.distanceKm} km
                </span>
                <span className="text-emerald-400">
                  ✓ มีน้ำ/เวชภัณฑ์สำรอง
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvacuationPlanner;
