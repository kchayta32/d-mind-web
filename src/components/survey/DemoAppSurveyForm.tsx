import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DemoAppSurveyData {
  gender: string;
  age: string;
  occupation: string;
  device: string;
  ux_ratings: {
    accessibility: number;
    menu_clarity: number;
    map_display: number;
    report_clarity: number;
    data_accuracy: number;
    system_speed: number;
    graph_display: number;
    overall_satisfaction: number;
  };
  useful_features: string[];
  likes: string;
  improvements: string;
  mobile_app_interest: string;
  consent: boolean;
}

interface DemoAppSurveyFormProps {
  onSubmit?: () => void;
}

const DemoAppSurveyForm: React.FC<DemoAppSurveyFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<DemoAppSurveyData>({
    gender: '',
    age: '',
    occupation: '',
    device: '',
    ux_ratings: {
      accessibility: 0,
      menu_clarity: 0,
      map_display: 0,
      report_clarity: 0,
      data_accuracy: 0,
      system_speed: 0,
      graph_display: 0,
      overall_satisfaction: 0,
    },
    useful_features: [],
    likes: '',
    improvements: '',
    mobile_app_interest: '',
    consent: false,
  });

  const StarRating = ({ rating, onRating, label }: { rating: number; onRating: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  const handleRatingChange = (field: keyof DemoAppSurveyData['ux_ratings'], rating: number) => {
    setFormData(prev => ({
      ...prev,
      ux_ratings: { ...prev.ux_ratings, [field]: rating }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      useful_features: prev.useful_features.includes(feature)
        ? prev.useful_features.filter(f => f !== feature)
        : [...prev.useful_features, feature]
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.gender || !formData.age || !formData.occupation || !formData.device) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "โปรดระบุข้อมูลทั่วไปให้ครบทุกช่อง",
        variant: "destructive",
      });
      return;
    }

    const allRatingsGiven = Object.values(formData.ux_ratings).every(rating => rating > 0);
    if (!allRatingsGiven) {
      toast({
        title: "กรุณาให้คะแนนทุกหัวข้อ",
        description: "โปรดให้คะแนนประสบการณ์การใช้งานให้ครบทุกหัวข้อ",
        variant: "destructive",
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: "กรุณายินยอมให้ใช้ข้อมูล",
        description: "โปรดยินยอมให้ใช้ข้อมูลเพื่อการปรับปรุงระบบ",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('demo_app_surveys').insert([{
        gender: formData.gender,
        age: formData.age,
        occupation: formData.occupation,
        device: formData.device,
        ux_ratings: formData.ux_ratings,
        useful_features: formData.useful_features,
        likes: formData.likes,
        improvements: formData.improvements,
        mobile_app_interest: formData.mobile_app_interest,
        consent: formData.consent,
      }]);

      if (error) throw error;

      toast({
        title: "ขอบคุณสำหรับการประเมิน! 🙏",
        description: "ความคิดเห็นของคุณจะช่วยให้เราปรับปรุงแอพให้ดีขึ้น",
        duration: 5000,
      });

      // Reset form
      setFormData({
        gender: '',
        age: '',
        occupation: '',
        device: '',
        ux_ratings: {
          accessibility: 0,
          menu_clarity: 0,
          map_display: 0,
          report_clarity: 0,
          data_accuracy: 0,
          system_speed: 0,
          graph_display: 0,
          overall_satisfaction: 0,
        },
        useful_features: [],
        likes: '',
        improvements: '',
        mobile_app_interest: '',
        consent: false,
      });

      onSubmit?.();
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const uxRatingFields = [
    { key: 'accessibility' as const, label: 'ความสะดวกในการเข้าถึงเว็บแอป (เช่น โหลดเร็ว ใช้งานได้ทุกอุปกรณ์)' },
    { key: 'menu_clarity' as const, label: 'ความชัดเจนของเมนู เช่น "Home", "Emergency", "Evaluate", "Research"' },
    { key: 'map_display' as const, label: 'การแสดงผลของแผนที่และข้อมูลเรียลไทม์' },
    { key: 'report_clarity' as const, label: 'ความเข้าใจง่ายของหน้ารายงานเหตุการณ์ภัยพิบัติ' },
    { key: 'data_accuracy' as const, label: 'ความถูกต้องของข้อมูลและความน่าเชื่อถือ' },
    { key: 'system_speed' as const, label: 'ความรวดเร็วของระบบเมื่อคลิกดูข้อมูลหรือสถิติ' },
    { key: 'graph_display' as const, label: 'การแสดงผลกราฟและแดชบอร์ดสถิติภัยพิบัติ' },
    { key: 'overall_satisfaction' as const, label: 'ความพึงพอใจโดยรวมต่อการใช้งานเว็บแอป D-MIND' },
  ];

  const featureOptions = [
    'Home – แผนที่และสถิติภัยพิบัติ',
    'Emergency Call – โทรติดต่อหน่วยงานฉุกเฉิน',
    'Evaluate – แบบประเมินความพึงพอใจพร้อมกราฟสรุปผล',
    'Research – บทความ / คู่มือ / งานวิจัย',
    'Dr.Mind Chatbot – ผู้ช่วยตอบคำถามภัยพิบัติ',
    'ระบบแจ้งเตือนภัยอัจฉริยะแบบเรียลไทม์',
  ];

  return (
    <div className="space-y-6">
      {/* ข้อมูลทั่วไป */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ข้อมูลทั่วไปของผู้ตอบแบบสอบถาม</h3>
          
          <div className="space-y-3">
            <Label>เพศ *</Label>
            <RadioGroup value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">ชาย</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">หญิง</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">อื่น ๆ</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>อายุ *</Label>
            <RadioGroup value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="under18" id="under18" />
                <Label htmlFor="under18" className="font-normal cursor-pointer">ต่ำกว่า 18 ปี</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="18-25" id="18-25" />
                <Label htmlFor="18-25" className="font-normal cursor-pointer">18–25 ปี</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="26-35" id="26-35" />
                <Label htmlFor="26-35" className="font-normal cursor-pointer">26–35 ปี</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="36plus" id="36plus" />
                <Label htmlFor="36plus" className="font-normal cursor-pointer">36 ปีขึ้นไป</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>อาชีพ / สถานะ *</Label>
            <RadioGroup value={formData.occupation} onValueChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="font-normal cursor-pointer">นักเรียน / นักศึกษา</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher" className="font-normal cursor-pointer">อาจารย์</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="font-normal cursor-pointer">บุคคลทั่วไป</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization" className="font-normal cursor-pointer">หน่วยงานภาครัฐ / เอกชน</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>อุปกรณ์ที่ใช้ทดสอบเว็บแอป D-MIND *</Label>
            <RadioGroup value={formData.device} onValueChange={(value) => setFormData(prev => ({ ...prev, device: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile" className="font-normal cursor-pointer">โทรศัพท์มือถือ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tablet" id="tablet" />
                <Label htmlFor="tablet" className="font-normal cursor-pointer">แท็บเล็ต</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="computer" id="computer" />
                <Label htmlFor="computer" className="font-normal cursor-pointer">คอมพิวเตอร์ / โน้ตบุ๊ก</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 1: ประสบการณ์การใช้งาน */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 1: ประสบการณ์การใช้งาน (User Experience)</h3>
          <p className="text-sm text-muted-foreground">โปรดให้คะแนน 1–5 : 1 = น้อยที่สุด 5 = มากที่สุด</p>
          
          <div className="space-y-6">
            {uxRatingFields.map((field) => (
              <StarRating
                key={field.key}
                rating={formData.ux_ratings[field.key]}
                onRating={(rating) => handleRatingChange(field.key, rating)}
                label={field.label}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 2: ฟังก์ชันที่มีประโยชน์ */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 2: ความคิดเห็นต่อฟังก์ชันหลัก</h3>
          <Label>คุณคิดว่าฟังก์ชันใด มีประโยชน์มากที่สุด (เลือกได้มากกว่า 1 ข้อ)</Label>
          
          <div className="space-y-3">
            {featureOptions.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={formData.useful_features.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label htmlFor={feature} className="font-normal cursor-pointer">{feature}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 3: ความคิดเห็นและข้อเสนอแนะ */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 3: ความคิดเห็นและข้อเสนอแนะ</h3>
          
          <div className="space-y-2">
            <Label>สิ่งที่คุณชอบ หรือประทับใจ ในเว็บแอป D-MIND</Label>
            <Textarea
              value={formData.likes}
              onChange={(e) => setFormData(prev => ({ ...prev, likes: e.target.value }))}
              placeholder="แบ่งปันความคิดเห็นของคุณ..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>สิ่งที่คุณอยากให้ทีม D-MIND ปรับปรุงหรือเพิ่มเติม</Label>
            <Textarea
              value={formData.improvements}
              onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
              placeholder="ข้อเสนอแนะของคุณ..."
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>คุณสนใจให้มีเวอร์ชัน Mobile App / LINE OA แจ้งเตือนภัย หรือไม่?</Label>
            <RadioGroup value={formData.mobile_app_interest} onValueChange={(value) => setFormData(prev => ({ ...prev, mobile_app_interest: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_interested" id="very_interested" />
                <Label htmlFor="very_interested" className="font-normal cursor-pointer">สนใจมาก</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderately_interested" id="moderately_interested" />
                <Label htmlFor="moderately_interested" className="font-normal cursor-pointer">สนใจปานกลาง</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="unsure" />
                <Label htmlFor="unsure" className="font-normal cursor-pointer">ไม่แน่ใจ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_interested" id="not_interested" />
                <Label htmlFor="not_interested" className="font-normal cursor-pointer">ไม่สนใจ</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 4: การยินยอม */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 4: การยินยอมให้ใช้ข้อมูล</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked as boolean }))}
            />
            <Label htmlFor="consent" className="font-normal cursor-pointer">
              ข้อมูลที่ให้จะถูกนำไปใช้เพื่อการปรับปรุงระบบเท่านั้น (ยินยอม) *
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full"
        size="lg"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            กำลังส่งข้อมูล...
          </>
        ) : (
          'ส่งแบบประเมิน'
        )}
      </Button>
    </div>
  );
};

export default DemoAppSurveyForm;
