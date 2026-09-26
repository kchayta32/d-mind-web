import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  ArrowLeft, 
  ShieldAlert, 
  Heart, 
  Flame, 
  Activity, 
  Radio, 
  Car, 
  Waves, 
  LifeBuoy, 
  Users, 
  Truck, 
  Compass, 
  Smile, 
  Copy, 
  Check, 
  Search, 
  Bookmark, 
  Share2,
  PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

export type ContactCategory = 'all' | 'flood' | 'medical' | 'police' | 'traffic' | 'social';

export interface EmergencyContactItem {
  id: string;
  phoneNumber: string;
  name: string;
  nameEn: string;
  description: string;
  category: ContactCategory;
  categoryLabel: string;
  icon: React.ReactNode;
  colorClass: string;
  iconBgClass: string;
  badgeClass: string;
  isFloodPriority?: boolean;
}

export const EMERGENCY_CONTACTS_DATA: EmergencyContactItem[] = [
  // 1. ตำรวจ & ป้องกันเหตุร้าย
  {
    id: 'police-191',
    phoneNumber: '191',
    name: 'แจ้งเหตุด่วน-เหตุร้าย',
    nameEn: 'Police Emergency Dispatch',
    description: 'ศูนย์วิทยุตำรวจ 191 แจ้งเหตุด่วนเหตุร้าย ปล้น ชิงทรัพย์ เหตุฉุกเฉินตลอด 24 ชม.',
    category: 'police',
    categoryLabel: 'ตำรวจ & ความปลอดภัย',
    icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
    colorClass: 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40',
    iconBgClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
  },
  {
    id: 'fire-199',
    phoneNumber: '199',
    name: 'แจ้งเหตุไฟไหม้/ดับเพลิง',
    nameEn: 'Fire & Rescue Hotline',
    description: 'ศูนย์วิทยุพระราม สถานีดับเพลิงและกู้ภัย แจ้งเหตุเพลิงไหม้ จับสัตว์มีพิษ ช่วยเหลืออุบัติภัย',
    category: 'flood',
    categoryLabel: 'กู้ภัย & ดับเพลิง',
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    colorClass: 'bg-orange-50/70 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40',
    iconBgClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
  },
  {
    id: 'js100-1137',
    phoneNumber: '1137',
    name: 'จส.100 แจ้งอุบัติเหตุ',
    nameEn: 'JS100 Radio Accident & Traffic',
    description: 'สถานีวิทยุ จส.100 ประสานงานอุบัติเหตุ รายงานสภาพน้ำท่วมขัง และการจราจรแบบเรียลไทม์',
    category: 'traffic',
    categoryLabel: 'จราจร & อุบัติเหตุ',
    icon: <Radio className="w-6 h-6 text-indigo-500" />,
    colorClass: 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40',
    iconBgClass: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    isFloodPriority: true
  },
  {
    id: 'car-theft-1192',
    phoneNumber: '1192',
    name: 'แจ้งเหตุรถหาย/ถูกขโมย',
    nameEn: 'Stolen Vehicle Prevention Center',
    description: 'ศูนย์ปราบปรามการโจรกรรมรถยนต์ รถจักรยานยนต์ สตช. รับแจ้งเหตุรถหาย สกัดจับทั่วประเทศ',
    category: 'police',
    categoryLabel: 'ตำรวจ & ความปลอดภัย',
    icon: <Car className="w-6 h-6 text-slate-600 dark:text-slate-300" />,
    colorClass: 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
    iconBgClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    badgeClass: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  },
  {
    id: 'highway-police-1193',
    phoneNumber: '1193',
    name: 'ตำรวจทางหลวง',
    nameEn: 'Highway Police Hotline',
    description: 'แจ้งอุบัติเหตุ ขอความช่วยเหลือรถเสีย น้ำท่วมผิวทางหลวง และสอบถามเส้นทางทั่วประเทศ',
    category: 'traffic',
    categoryLabel: 'จราจร & ทางหลวง',
    icon: <Truck className="w-6 h-6 text-blue-600" />,
    colorClass: 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    isFloodPriority: true
  },
  {
    id: 'crime-suppression-1195',
    phoneNumber: '1195',
    name: 'กองปราบปราม',
    nameEn: 'Crime Suppression Division',
    description: 'กองบังคับการปราบปราม แจ้งเบาะแสอาชญากรรม คดีอุกฉกรรจ์ ภัยคุกคามประชาชน',
    category: 'police',
    categoryLabel: 'ตำรวจ & ความปลอดภัย',
    icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
    colorClass: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40',
    iconBgClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
  },
  {
    id: 'marine-1199',
    phoneNumber: '1199',
    name: 'กรมเจ้าท่า',
    nameEn: 'Marine Department Water Rescue',
    description: 'ศูนย์ปลอดภัยทางน้ำ กรมเจ้าท่า แจ้งเหตุอุบัติเหตุทางน้ำ น้ำท่วมริมแม่น้ำเจ้าพระยา และเรือล่ม',
    category: 'flood',
    categoryLabel: 'น้ำท่วม & ทางน้ำ',
    icon: <Waves className="w-6 h-6 text-cyan-600" />,
    colorClass: 'bg-cyan-50/70 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/40',
    iconBgClass: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    badgeClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    isFloodPriority: true
  },
  {
    id: 'social-1300',
    phoneNumber: '1300',
    name: 'ศูนย์ประชาบดี',
    nameEn: 'Social Assistance Center (MSDHS)',
    description: 'กระทรวงการพัฒนาสังคมฯ ขอความช่วยเหลือผู้ประสบภัย ผู้สูงอายุ เด็ก คนพิการ ที่ติดค้างน้ำท่วม',
    category: 'social',
    categoryLabel: 'สังคม & ผู้ประสบภัย',
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    colorClass: 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40',
    iconBgClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
  },
  {
    id: 'pohtecktung-1418',
    phoneNumber: '1418',
    name: 'มูลนิธิป่อเต็กตึ๊ง',
    nameEn: 'Poh Teck Tung Rescue Foundation',
    description: 'หน่วยกู้ชีพ กู้ภัย ช่วยเหลือผู้ประสบอุทกภัย อพยพ นำส่งโรงพยาบาล และอุบัติเหตุตลอด 24 ชม.',
    category: 'flood',
    categoryLabel: 'กู้ภัย & บรรเทาภัย',
    icon: <LifeBuoy className="w-6 h-6 text-red-600" />,
    colorClass: 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40',
    iconBgClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    isFloodPriority: true
  },
  {
    id: 'rural-road-1543',
    phoneNumber: '1543',
    name: 'กรมทางหลวงชนบท / ทางพิเศษ',
    nameEn: 'EXAT Expressway & Rural Roads',
    description: 'ศูนย์บริการข้อมูลทางพิเศษ (กทพ.) / ทางหลวงชนบท สอบถามน้ำท่วมทางด่วน และช่วยเหลือรถเสีย',
    category: 'traffic',
    categoryLabel: 'จราจร & ทางหลวง',
    icon: <Compass className="w-6 h-6 text-teal-600" />,
    colorClass: 'bg-teal-50/70 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40',
    iconBgClass: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    badgeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    isFloodPriority: true
  },
  {
    id: 'bma-1555',
    phoneNumber: '1555',
    name: 'สายด่วน กทม.',
    nameEn: 'BMA Bangkok Metropolitan Hotline',
    description: 'ศูนย์กทม. 1555 รับแจ้งเหตุน้ำท่วมขังถนน ท่อระบายน้ำอุดตัน ต้นไม้หักโค่น และร้องเรียน กทม. 24 ชม.',
    category: 'flood',
    categoryLabel: 'กทม. & น้ำท่วมขัง',
    icon: <Waves className="w-6 h-6 text-blue-600" />,
    colorClass: 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    isFloodPriority: true
  },
  {
    id: 'transport-1584',
    phoneNumber: '1584',
    name: 'กรมการขนส่งทางบก',
    nameEn: 'Department of Land Transport',
    description: 'ศูนย์คุ้มครองผู้โดยสารรถสาธารณะ แจ้งรถสาธารณะปฏิเสธผู้โดยสาร หรือประสบเหตุฉุกเฉิน',
    category: 'traffic',
    categoryLabel: 'จราจร & ขนส่ง',
    icon: <Car className="w-6 h-6 text-purple-600" />,
    colorClass: 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40',
    iconBgClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
  },
  {
    id: 'ems-1669',
    phoneNumber: '1669',
    name: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)',
    nameEn: 'National Emergency Medical Services (EMS)',
    description: 'ศูนย์นเรนทร เจ็บป่วยฉุกเฉิน วิกฤต หมดสติ จมน้ำ ประสบอุบัติเหตุ รถพยาบาลกู้ชีพ 24 ชม.',
    category: 'medical',
    categoryLabel: 'กู้ชีพ & การแพทย์',
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    colorClass: 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40',
    iconBgClass: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    isFloodPriority: true
  },
  {
    id: 'erawan-1646',
    phoneNumber: '1646',
    name: 'ศูนย์เอราวัณ กทม.',
    nameEn: 'Erawan EMS Bangkok Center',
    description: 'ศูนย์บริการการแพทย์ฉุกเฉินกรุงเทพมหานคร รถกู้ชีพพื้นที่ กทม. ประสานงานรพ.ในสังกัด กทม.',
    category: 'medical',
    categoryLabel: 'กู้ชีพ & การแพทย์ กทม.',
    icon: <Activity className="w-6 h-6 text-red-600" />,
    colorClass: 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40',
    iconBgClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    isFloodPriority: true
  },
  {
    id: 'mental-1667',
    phoneNumber: '1667',
    name: 'สายด่วนสุขภาพจิต',
    nameEn: 'Mental Health Crisis Hotline',
    description: 'กรมสุขภาพจิต ให้คำปรึกษาภาวะเครียด วิตกกังวล ซึมเศร้า หรือความเครียดจากภัยพิบัติน้ำท่วม',
    category: 'social',
    categoryLabel: 'สุขภาพจิต & สังคม',
    icon: <Smile className="w-6 h-6 text-amber-500" />,
    colorClass: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40',
    iconBgClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
  },
  // เบอร์เสริมสำคัญด้านภัยพิบัติ
  {
    id: 'ddpm-1784',
    phoneNumber: '1784',
    name: 'กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)',
    nameEn: 'DDPM Disaster Hotline',
    description: 'ศูนย์เตือนภัยพิบัติแห่งชาติ แจ้งภัยน้ำท่วม ดินถล่ม พายุ อุทกภัย และขอรับการอพยพช่วยเหลือ',
    category: 'flood',
    categoryLabel: 'ภัยพิบัติ & ปภ.',
    icon: <Activity className="w-6 h-6 text-blue-600" />,
    colorClass: 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    isFloodPriority: true
  },
  {
    id: 'bma-flood-022485115',
    phoneNumber: '02-248-5115',
    name: 'ศูนย์ควบคุมน้ำท่วม กทม.',
    nameEn: 'BMA Flood Control Center',
    description: 'สำนักการระบายน้ำ กทม. รายงานสถานการณ์น้ำท่วมขัง ระดับน้ำในคลอง และอุโมงค์ระบายน้ำ',
    category: 'flood',
    categoryLabel: 'สำนักการระบายน้ำ',
    icon: <Waves className="w-6 h-6 text-sky-600" />,
    colorClass: 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/40',
    iconBgClass: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    isFloodPriority: true
  },
  {
    id: 'traffic-police-1197',
    phoneNumber: '1197',
    name: 'สายด่วนจราจร บก.02',
    nameEn: 'Traffic Police Information Center',
    description: 'กองบังคับการตำรวจจราจร สอบถามเส้นทางเลี่ยงน้ำท่วม ปิดการจราจร และอุบัติเหตุใน กทม.',
    category: 'traffic',
    categoryLabel: 'จราจร & ทางหลวง',
    icon: <Car className="w-6 h-6 text-blue-700" />,
    colorClass: 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    isFloodPriority: true
  }
];

const EmergencyContacts: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ContactCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter contacts by search & category
  const filteredContacts = useMemo(() => {
    return EMERGENCY_CONTACTS_DATA.filter(contact => {
      // Category filter
      if (selectedCategory !== 'all' && contact.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = contact.phoneNumber.includes(q);
        const matchName = contact.name.toLowerCase().includes(q) || contact.nameEn.toLowerCase().includes(q);
        const matchDesc = contact.description.toLowerCase().includes(q);
        const matchCat = contact.categoryLabel.toLowerCase().includes(q);
        if (!matchNumber && !matchName && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleCallClick = (name: string, phoneNumber: string) => {
    toast({
      title: `กำลังต่อสายหา ${name}`,
      description: `หมายเลขโทรศัพท์: ${phoneNumber}`,
    });
    window.location.href = `tel:${phoneNumber.replace(/-/g, '')}`;
  };

  const handleCopyNumber = (contact: EmergencyContactItem) => {
    navigator.clipboard.writeText(contact.phoneNumber.replace(/-/g, ''));
    setCopiedId(contact.id);
    toast({
      title: 'คัดลอกเบอร์สำเร็จ',
      description: `บันทึกเบอร์ ${contact.phoneNumber} (${contact.name}) ลงคลิปบอร์ดแล้ว`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllContacts = () => {
    const textToCopy = `📌 รวมเบอร์โทรฉุกเฉิน ช่วงน้ำท่วม (เซฟเก็บไว้ติดเครื่องกันได้เลย! มีไว้อุ่นใจกว่า)\n\n` +
      EMERGENCY_CONTACTS_DATA.map(c => `${c.phoneNumber} ${c.name} (${c.description})`).join('\n') +
      `\n\nข้อมูลโดย D-MIND: https://d-mind-six.vercel.app/`;

    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'คัดลอกเบอร์ฉุกเฉินทั้งหมดสำเร็จ! 📋',
      description: 'สามารถนำข้อความไปเซฟไว้ใน Note หรือส่งต่อใน LINE ได้ทันที',
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          
          {/* Top Back Navigation & Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-full w-10 h-10 p-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                  <PhoneCall className="w-7 h-7 text-red-500" />
                  รวมเบอร์โทรฉุกเฉินสำคัญ
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                  แจ้งเหตุฉุกเฉิน น้ำท่วม อุบัติเหตุ และขอความช่วยเหลือ 24 ชั่วโมง
                </p>
              </div>
            </div>

            <Button
              onClick={handleCopyAllContacts}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-md flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              คัดลอกเบอร์ทั้งหมดไว้ติดเครื่อง
            </Button>
          </div>

          {/* Highlight Banner with User Requested Quote */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 shadow-xl border border-white/20">
            <div className="relative z-10 space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                <Bookmark className="w-3.5 h-3.5" />
                เบอร์สำคัญช่วงภัยพิบัติ & น้ำท่วม
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                “เซฟเก็บไว้ติดเครื่องกันได้เลย! มีไว้อุ่นใจกว่า”
              </h2>
              
              <p className="text-sm sm:text-base text-red-50 leading-relaxed">
                เตรียมพร้อมรับมือทุกสถานการณ์ ทั้งเหตุน้ำท่วมขังผิวทาง ดับเพลิง กู้ชีพ-กู้ภัย 
                อุบัติเหตุทางถนน และความปลอดภัยในชีวิตและทรัพย์สิน กดโทรออกได้ทันทีใน 1 คลิก
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-white/90">สายด่วนยอดนิยม:</span>
                <button 
                  onClick={() => handleCallClick('สายด่วน กทม.', '1555')}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-mono font-bold"
                >
                  1555 (กทม.)
                </button>
                <button 
                  onClick={() => handleCallClick('แพทย์ฉุกเฉิน', '1669')}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-mono font-bold"
                >
                  1669 (กู้ชีพ)
                </button>
                <button 
                  onClick={() => handleCallClick('ตำรวจ', '191')}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-mono font-bold"
                >
                  191 (เหตุด่วน)
                </button>
                <button 
                  onClick={() => handleCallClick('จส.100', '1137')}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-mono font-bold"
                >
                  1137 (จส.100)
                </button>
                <button 
                  onClick={() => handleCallClick('ป่อเต็กตึ๊ง', '1418')}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm font-mono font-bold"
                >
                  1418 (ป่อเต็กตึ๊ง)
                </button>
              </div>
            </div>

            {/* Background design circle */}
            <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="ค้นหาเบอร์โทร เช่น 191, 1555, หรือพิมพ์ 'น้ำท่วม', 'ตำรวจ', 'กู้ชีพ'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm shadow-sm"
                />
              </div>

              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-xs h-10 px-3 text-slate-500"
                >
                  ล้างคำค้น
                </Button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด ({EMERGENCY_CONTACTS_DATA.length})
              </button>

              <button
                onClick={() => setSelectedCategory('flood')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'flood'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Waves className="w-3.5 h-3.5 text-cyan-500" />
                น้ำท่วม & กู้ภัยฉุกเฉิน
              </button>

              <button
                onClick={() => setSelectedCategory('medical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'medical'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                การแพทย์ & กู้ชีพ
              </button>

              <button
                onClick={() => setSelectedCategory('police')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'police'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                ตำรวจ & ความปลอดภัย
              </button>

              <button
                onClick={() => setSelectedCategory('traffic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'traffic'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-indigo-500" />
                จราจร & ทางหลวง
              </button>

              <button
                onClick={() => setSelectedCategory('social')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'social'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                สังคม & สุขภาพจิต
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredContacts.map((contact) => {
              const isCopied = copiedId === contact.id;

              return (
                <Card
                  key={contact.id}
                  className={`border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group rounded-2xl flex flex-col justify-between ${contact.colorClass}`}
                >
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    
                    {/* Top Row: Icon, Badge, and Quick Copy */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl shadow-sm group-hover:scale-105 transition-transform ${contact.iconBgClass}`}>
                          {contact.icon}
                        </div>
                        <div>
                          <Badge variant="outline" className={`text-[10px] font-semibold border-none ${contact.badgeClass}`}>
                            {contact.categoryLabel}
                          </Badge>
                          <div className="text-2xl font-black text-foreground tracking-tight pt-0.5">
                            {contact.phoneNumber}
                          </div>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
                        onClick={() => handleCopyNumber(contact)}
                        title="คัดลอกเบอร์โทร"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Middle: Name & Description */}
                    <div className="space-y-1 flex-1">
                      <h3 className="font-bold text-foreground text-base leading-snug">
                        {contact.name}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {contact.description}
                      </p>
                    </div>

                    {/* Bottom: Big Call Button */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">โทรฟรี / 24 ชั่วโมง</span>
                      
                      <Button
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 shadow-md font-bold text-xs h-9 px-4 flex items-center gap-1.5"
                        onClick={() => handleCallClick(contact.name, contact.phoneNumber)}
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        โทรออก ({contact.phoneNumber})
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">ไม่พบหมายเลขฉุกเฉินที่ค้นหา</h3>
              <p className="text-xs text-slate-500">ลองค้นหาด้วยคำค้นอื่น หรือคลิกดูเบอร์ทั้งหมด</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs"
              >
                ล้างการค้นหา
              </Button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencyContacts;
