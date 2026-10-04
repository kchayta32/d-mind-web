import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Wrench, 
  Layout, 
  Bell, 
  Bot, 
  HeartHandshake,
  MessageSquareHeart,
  HelpCircle,
  ShieldCheck,
  Lock,
  Unlock,
  User,
  Calendar,
  Briefcase,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { SURVEY_CATEGORIES, DetailedSurveySubmission } from '@/types/survey';
import { submitCompleteSurvey } from '@/services/surveyService';
import { toast } from 'sonner';

interface SurveyFormNewProps {
  onSuccessSubmit?: () => void;
}

export const THAI_PROVINCES = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 
  'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 
  'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 
  'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 
  'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 
  'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พังงา', 'พัทลุง', 
  'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 
  'พะเยา', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 
  'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 
  'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 
  'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 
  'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 
  'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 
  'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 
  'อุทัยธานี', 'อุบลราชธานี'
];

export const AGE_OPTIONS = [
  'ต่ำกว่า 20 ปี',
  '20 - 30 ปี',
  '31 - 40 ปี',
  '41 - 50 ปี',
  '51 - 60 ปี',
  'มากกว่า 60 ปี'
];

export const OCCUPATION_OPTIONS = [
  'นักเรียน / นักศึกษา',
  'ข้าราชการ / บุคลากรทางการศึกษา / รัฐวิสาหกิจ',
  'พนักงานบริษัทเอกชน',
  'เจ้าของธุรกิจ / ค้าขาย / อาชีพอิสระ',
  'เกษตรกร / ประมง',
  'บุคลากรทางการแพทย์ / สาธารณสุข',
  'ประชาชนทั่วไป / อื่น ๆ'
];

export const GENDER_OPTIONS = [
  'ชาย',
  'หญิง',
  'ทางเลือกอื่น / ไม่ระบุ'
];

const getCategoryIcon = (key: string) => {
  switch (key) {
    case 'usability': return Wrench;
    case 'ui': return Layout;
    case 'alert': return Bell;
    case 'chatbot': return Bot;
    default: return HeartHandshake;
  }
};

export const SurveyFormNew: React.FC<SurveyFormNewProps> = ({ onSuccessSubmit }) => {
  // PDPA & Demographics
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [province, setProvince] = useState('');

  // Ratings & Feedback
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [favoriteFeature, setFavoriteFeature] = useState('');
  const [missingFeatures, setMissingFeatures] = useState('');
  const [generalSuggestions, setGeneralSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Total questions count = 17 items in Part 1
  const totalQuestions = SURVEY_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const answeredCount = Object.keys(ratings).filter(k => ratings[k] > 0).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleRatingSelect = (itemId: string, score: number) => {
    if (!pdpaConsent) {
      toast.error('กรุณาทำเครื่องหมายยินยอมตามข้อตกลง PDPA ด้านบนก่อน');
      return;
    }
    setRatings(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  const handleAutofillHigh = () => {
    setPdpaConsent(true);
    setGender('ชาย');
    setAge('20 - 30 ปี');
    setOccupation('ข้าราชการ / บุคลากรทางการศึกษา / รัฐวิสาหกิจ');
    setProvince('กรุงเทพมหานคร');

    const filled: Record<string, number> = {};
    SURVEY_CATEGORIES.forEach(cat => {
      cat.items.forEach((item, idx) => {
        // Random high scores (4 or 5)
        filled[item.id] = (idx % 3 === 0) ? 4 : 5;
      });
    });
    setRatings(filled);
    setFavoriteFeature('แผนที่เรดาร์สภาพอากาศสด และฟีเจอร์ AI Dr.Mind ที่ช่วยเหลือในสถานการณ์ฉุกเฉิน');
    setMissingFeatures('ระบบแจ้งเตือนผ่าน SMS เพิ่มเติมกรณีไม่มีสัญญาณอินเทอร์เน็ต');
    setGeneralSuggestions('แอปพลิเคชันทำงานได้รวดเร็ว ออกแบบสวยงาม ตอบโจทย์การใช้งานมากครับ');
    toast.info('ใส่ข้อมูลตัวอย่างระดับสูงและยินยอม PDPA เรียบร้อยแล้ว');
  };

  const handleReset = () => {
    setPdpaConsent(false);
    setGender('');
    setAge('');
    setOccupation('');
    setProvince('');
    setRatings({});
    setFavoriteFeature('');
    setMissingFeatures('');
    setGeneralSuggestions('');
    setIsSubmittedSuccess(false);
    toast('ล้างข้อมูลฟอร์มเรียบร้อย');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdpaConsent) {
      toast.error('ท่านต้องทำเครื่องหมายยินยอมข้อตกลง PDPA ก่อนจึงจะสามารถส่งแบบประเมินได้');
      return;
    }

    if (!gender || !age || !occupation || !province) {
      toast.warning('กรุณาระบุข้อมูลส่วนบุคคลในส่วนแรก (เพศ, อายุ, อาชีพ, จังหวัด) ให้ครบถ้วน');
      return;
    }

    if (answeredCount < totalQuestions) {
      toast.warning(`กรุณาตอบคำถามในส่วนที่ 1 ให้ครบทุกข้อ (ตอบแล้ว ${answeredCount}/${totalQuestions} ข้อ)`);
      return;
    }

    setIsSubmitting(true);
    try {
      const submission: DetailedSurveySubmission = {
        id: `submission-${Date.now()}`,
        created_at: new Date().toISOString(),
        gender,
        age,
        occupation,
        province,
        pdpaConsent,
        ratings,
        favoriteFeature,
        missingFeatures,
        generalSuggestions,
      };

      const res = await submitCompleteSurvey(submission);
      if (res.success) {
        setIsSubmittedSuccess(true);
        toast.success('บันทึกผลการประเมินความพึงพอใจสำเร็จ ขอบคุณสำหรับความคิดเห็นครับ!');
        if (onSuccessSubmit) {
          onSuccessSubmit();
        }
      } else {
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error(err);
      toast.error('ไม่สามารถส่งแบบประเมินได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmittedSuccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 md:p-12 text-center shadow-lg animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
          ส่งแบบประเมินความพึงพอใจเรียบร้อยแล้ว
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
          ขอบพระคุณเป็นอย่างยิ่งที่ท่านได้สละเวลาประเมินระบบ D-MIND ข้อมูลของท่านถูกบันทึกและนำไปประมวลผลในรายงานสรุปผลการประเมินความพึงพอใจของระบบเรียบร้อยแล้ว
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => {
              setIsSubmittedSuccess(false);
              handleReset();
            }}
            variant="outline"
            className="rounded-xl border-slate-300 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            ทำแบบประเมินอีกครั้ง
          </Button>
          {onSuccessSubmit && (
            <Button
              onClick={onSuccessSubmit}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
            >
              ดูผลการประเมิน & กราฟสถิติ
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. ส่วนแรก: ความยินยอม PDPA และข้อมูลทั่วไปของผู้ประเมิน */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mb-2">
            ส่วนแรก: ข้อมูลทั่วไป & ความยินยอม PDPA
          </Badge>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>ข้อมูลทั่วไปของผู้ประเมิน และข้อตกลงความเป็นส่วนตัว</span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            โปรดให้ความยินยอมตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อเริ่มต้นทำแบบประเมิน
          </p>
        </div>

        {/* PDPA Agreement Box */}
        <Card className={`border-2 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm ${
          pdpaConsent 
            ? 'border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-emerald-500/5' 
            : 'border-amber-400/90 bg-amber-50/40 dark:bg-amber-950/20'
        }`}>
          <CardHeader className="py-4 px-5 border-b border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  pdpaConsent 
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600' 
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    ความยินยอมตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    ข้อกำหนดการจัดเก็บ ประมวลผล และรักษาความมั่นคงปลอดภัยของข้อมูล
                  </CardDescription>
                </div>
              </div>
              <Badge className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
                pdpaConsent 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-amber-500 text-white animate-pulse'
              }`}>
                {pdpaConsent ? '✓ ยินยอมแล้ว' : '⚠️ จำเป็นต้องยินยอม'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <p>
                <strong>วัตถุประสงค์การเก็บรวบรวมข้อมูล:</strong> ระบบ D-MIND ขอความยินยอมจากท่านในการจัดเก็บและประมวลผลข้อมูลส่วนบุคคลทั่วไป (เพศ, ช่วงอายุ, อาชีพ, จังหวัด) และข้อมูลผลการประเมินความพึงพอใจ เพื่อนำไปใช้ในการศึกษาวิจัย วิเคราะห์เชิงสถิติ และการพัฒนาปรับปรุงระบบสารสนเทศและการเตือนภัยพิบัติให้มีประสิทธิภาพสูงสุด
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                ข้อมูลทั้งหมดจะได้รับการเก็บรักษาตามมาตรฐานความปลอดภัย และจะไม่นำไปใช้ในเชิงพาณิชย์หรือเปิดเผยต่อบุคคลภายนอกโดยไม่ได้รับอนุญาต
              </p>
            </div>

            {/* Checkbox item */}
            <div 
              onClick={() => setPdpaConsent(!pdpaConsent)}
              className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                pdpaConsent 
                  ? 'bg-emerald-100/60 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100' 
                  : 'bg-white dark:bg-slate-800/80 border-amber-300 hover:border-amber-400 text-slate-800 dark:text-slate-200 shadow-xs'
              }`}
            >
              <Checkbox 
                id="pdpa-consent-checkbox"
                checked={pdpaConsent}
                onCheckedChange={(val) => setPdpaConsent(!!val)}
                className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label htmlFor="pdpa-consent-checkbox" className="text-xs sm:text-sm font-semibold cursor-pointer leading-snug">
                ข้าพเจ้ายินยอมให้ระบบ D-MIND จัดเก็บและประมวลผลข้อมูลส่วนบุคคลและการประเมินความพึงพอใจตามข้อตกลง PDPA ดังกล่าวข้างต้น
                <span className="text-rose-500 ml-1 font-bold">*</span>
              </Label>
            </div>

            {!pdpaConsent && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>หากไม่ทำเครื่องหมายถูกยินยอมข้อตกลง PDPA จะไม่สามารถกรอกข้อมูลและทำแบบประเมินได้</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lock / Unlock Alert Notification */}
        {!pdpaConsent ? (
          <div className="bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm">แบบฟอร์มถูกล็อค (ต้องยินยอม PDPA ก่อน)</h4>
                <p className="text-xs text-amber-700/90 dark:text-amber-300/80">
                  กรุณาติ๊กถูกในช่องอนุญาต PDPA ด้านบน เพื่อปลดล็อคให้สามารถตอบแบบฟอร์มได้
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setPdpaConsent(true)}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              กดยินยอม PDPA ทันที
            </Button>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 px-4 flex items-center justify-between gap-2 text-emerald-800 dark:text-emerald-200 text-xs font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ปลดล็อคแบบฟอร์มเรียบร้อยแล้ว: ท่านสามารถระบุข้อมูลทั่วไปและทำแบบประเมินได้</span>
            </div>
            <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-[11px] bg-white/70">
              พร้อมตอบแบบฟอร์ม
            </Badge>
          </div>
        )}

        {/* Demographic Fields Card */}
        <div className={`transition-all duration-300 ${!pdpaConsent ? 'opacity-40 pointer-events-none select-none filter blur-[0.4px]' : ''}`}>
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-5 md:p-6 bg-card space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <User className="w-4 h-4 text-blue-600" />
                <span>ข้อมูลทั่วไปของผู้ประเมิน</span>
              </div>
              <span className="text-xs text-rose-500 font-medium">* จำเป็นต้องระบุทุกข้อ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* 1. เพศ */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4 text-blue-500" />
                  <span>เพศ</span>
                  <span className="text-rose-500 font-bold">*</span>
                </Label>
                <Select value={gender} onValueChange={setGender} disabled={!pdpaConsent}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                    <SelectValue placeholder="-- เลือกเพศ --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-64">
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs sm:text-sm rounded-lg">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. อายุ */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>อายุ</span>
                  <span className="text-rose-500 font-bold">*</span>
                </Label>
                <Select value={age} onValueChange={setAge} disabled={!pdpaConsent}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                    <SelectValue placeholder="-- เลือกช่วงอายุ --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-64">
                    {AGE_OPTIONS.map((a) => (
                      <SelectItem key={a} value={a} className="text-xs sm:text-sm rounded-lg">
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. อาชีพ */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span>อาชีพ</span>
                  <span className="text-rose-500 font-bold">*</span>
                </Label>
                <Select value={occupation} onValueChange={setOccupation} disabled={!pdpaConsent}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                    <SelectValue placeholder="-- เลือกอาชีพ --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-64">
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <SelectItem key={occ} value={occ} className="text-xs sm:text-sm rounded-lg">
                        {occ}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 4. จังหวัด */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>จังหวัด</span>
                  <span className="text-rose-500 font-bold">*</span>
                </Label>
                <Select value={province} onValueChange={setProvince} disabled={!pdpaConsent}>
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                    <SelectValue placeholder="-- เลือกจังหวัดที่คุณอาศัยอยู่ --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-64">
                    {THAI_PROVINCES.map((prov) => (
                      <SelectItem key={prov} value={prov} className="text-xs sm:text-sm rounded-lg">
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Progress & Quick Actions Bar */}
      <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 sticky top-20 z-20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${!pdpaConsent ? 'opacity-40 pointer-events-none select-none filter blur-[0.4px]' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            <span>ความคืบหน้าการตอบแบบประเมิน ({answeredCount}/{totalQuestions} ข้อ)</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutofillHigh}
            className="text-xs rounded-xl border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300"
            title="กรอกตัวอย่างคะแนนระดับสูงเพื่อทดสอบ"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
            ใส่ข้อมูลตัวอย่าง
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs rounded-xl text-slate-500 hover:text-slate-700"
            title="ล้างข้อมูลทั้งหมด"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            ล้างฟอร์ม
          </Button>
        </div>
      </div>

      {/* Rating Scale Legend Card */}
      <div className={`bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 md:p-5 transition-all duration-300 ${!pdpaConsent ? 'opacity-40 pointer-events-none select-none filter blur-[0.4px]' : ''}`}>
        <div className="flex items-center gap-2 mb-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>ระดับคะแนนการประเมิน (Rating Scale 1 - 5):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { score: 1, label: '1 = ไม่พอใจมาก', desc: 'ต้องปรับปรุงเร่งด่วน' },
            { score: 2, label: '2 = ไม่พอใจ', desc: 'ควรปรับปรุง' },
            { score: 3, label: '3 = ปานกลาง', desc: 'พอใช้ได้' },
            { score: 4, label: '4 = พอใจ', desc: 'อยู่ในเกณฑ์ดี' },
            { score: 5, label: '5 = พอใจมาก', desc: 'ดีเยี่ยม / ประทับใจ' },
          ].map(lvl => (
            <div key={lvl.score} className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 block">{lvl.label}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{lvl.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ส่วนที่ 1: การประเมินความพึงพอใจของผู้ใช้งาน */}
      {/* ========================================================================= */}
      <div className={`space-y-6 transition-all duration-300 ${!pdpaConsent ? 'opacity-40 pointer-events-none select-none filter blur-[0.4px]' : ''}`}>
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2">
            ส่วนที่ 1
          </Badge>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
            การประเมินความพึงพอใจของผู้ใช้งาน
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            โปรดเลือกคะแนน 1 ถึง 5 ตามระดับความพึงพอใจจริงของท่านในแต่ละหัวข้อ
          </p>
        </div>

        {SURVEY_CATEGORIES.map((category) => {
          const CategoryIcon = getCategoryIcon(category.key);
          const categoryAnswered = category.items.filter(it => ratings[it.id] > 0).length;

          return (
            <Card key={category.key} className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-card">
              <CardHeader className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 py-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                        {category.code} {category.titleTh}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {category.titleEn}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs px-2.5 py-0.5 rounded-full ${
                    categoryAnswered === category.items.length 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/40' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {categoryAnswered}/{category.items.length} ข้อ
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-6 divide-y divide-slate-100 dark:divide-slate-800/60">
                {category.items.map((item) => {
                  const currentScore = ratings[item.id] || 0;
                  return (
                    <div key={item.id} className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="min-w-0 md:max-w-[55%]">
                        <div className="flex items-start gap-2.5">
                          <span className="font-bold text-sm text-blue-600 dark:text-blue-400 whitespace-nowrap mt-0.5">
                            {item.code}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                              {item.textTh}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                              {item.textEn}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 1-5 Rating Selectors */}
                      <div className="flex items-center gap-1.5 sm:gap-2 self-start md:self-auto">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const isSelected = currentScore === score;
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleRatingSelect(item.id, score)}
                              disabled={!pdpaConsent}
                              className={`
                                flex flex-col items-center justify-center w-11 h-12 sm:w-12 sm:h-13 rounded-xl border transition-all duration-200
                                ${isSelected 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105 font-bold' 
                                  : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                                }
                              `}
                              title={`${score} คะแนน`}
                            >
                              <span className="text-sm font-bold">{score}</span>
                              <Star className={`w-3 h-3 ${isSelected ? 'fill-yellow-300 text-yellow-300' : 'text-slate-400 fill-transparent'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ส่วนที่ 2: แบบสอบถามข้อเสนอแนะเพิ่มเติมของผู้ใช้งาน */}
      {/* ========================================================================= */}
      <div className={`space-y-6 pt-4 transition-all duration-300 ${!pdpaConsent ? 'opacity-40 pointer-events-none select-none filter blur-[0.4px]' : ''}`}>
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded-full mb-2">
            ส่วนที่ 2
          </Badge>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
            แบบสอบถามข้อเสนอแนะเพิ่มเติมของผู้ใช้งาน
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาและยกระดับแอปพลิเคชัน D-MIND
          </p>
        </div>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-5 md:p-6 bg-card space-y-6">
          {/* Question 1 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">1</span>
              <span>ฟีเจอร์ใดของแอปพลิเคชันที่ท่านชอบมากที่สุด?</span>
            </label>
            <Textarea
              value={favoriteFeature}
              onChange={(e) => setFavoriteFeature(e.target.value)}
              disabled={!pdpaConsent}
              placeholder="ระบุฟีเจอร์ที่ประทับใจ เช่น แผนที่ภัยพิบัติ GIS, โทรมาตรวัดน้ำ กทม., เรดาร์คาเฟ่ปลอดภัยจากน้ำท่วม, AI Dr.Mind..."
              className="rounded-xl border-slate-200 dark:border-slate-700 min-h-[75px] text-sm"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">2</span>
              <span>มีฟีเจอร์ใดที่ท่านคิดว่ายังขาดหายไปหรือควรมีเพิ่มเติม?</span>
            </label>
            <Textarea
              value={missingFeatures}
              onChange={(e) => setMissingFeatures(e.target.value)}
              disabled={!pdpaConsent}
              placeholder="ระบุสิ่งที่ต้องการให้มีเพิ่มเติม เช่น การแจ้งเตือนผ่าน SMS, เส้นทางหนีภัยแบบเลี่ยงน้ำท่วม, กล้องวงจรปิดเรียลไทม์..."
              className="rounded-xl border-slate-200 dark:border-slate-700 min-h-[75px] text-sm"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">3</span>
              <span>มีข้อเสนอแนะหรือความคิดเห็นอื่นใดเพิ่มเติม?</span>
            </label>
            <Textarea
              value={generalSuggestions}
              onChange={(e) => setGeneralSuggestions(e.target.value)}
              disabled={!pdpaConsent}
              placeholder="ข้อเสนอแนะทั่วไป ข้อคิดเห็นเพื่อการปรับปรุง หรือคำติชม..."
              className="rounded-xl border-slate-200 dark:border-slate-700 min-h-[85px] text-sm"
            />
          </div>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !pdpaConsent}
          className={`w-full h-14 text-white text-base md:text-lg font-bold rounded-2xl shadow-lg transition-all duration-200 ${
            pdpaConsent 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl' 
              : 'bg-slate-400 cursor-not-allowed opacity-60'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>กำลังส่งข้อมูลแบบประเมิน...</span>
            </div>
          ) : !pdpaConsent ? (
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>กรุณายินยอมข้อตกลง PDPA ด้านบน เพื่อเปิดการส่งแบบประเมิน</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              <span>บันทึกและส่งแบบประเมินความพึงพอใจ</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
