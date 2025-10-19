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

interface BoothSurveyData {
  gender: string;
  age: string;
  status: string;
  knew_before: string;
  booth_ratings: {
    decoration: number;
    clarity: number;
    demo_understanding: number;
    technology_interest: number;
    service: number;
    feasibility: number;
    overall_satisfaction: number;
  };
  most_liked: string;
  improvements: string;
  follow_interest: string;
  consent: boolean;
}

interface BoothSurveyFormProps {
  onSubmit?: () => void;
}

const BoothSurveyForm: React.FC<BoothSurveyFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BoothSurveyData>({
    gender: '',
    age: '',
    status: '',
    knew_before: '',
    booth_ratings: {
      decoration: 0,
      clarity: 0,
      demo_understanding: 0,
      technology_interest: 0,
      service: 0,
      feasibility: 0,
      overall_satisfaction: 0,
    },
    most_liked: '',
    improvements: '',
    follow_interest: '',
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

  const handleRatingChange = (field: keyof BoothSurveyData['booth_ratings'], rating: number) => {
    setFormData(prev => ({
      ...prev,
      booth_ratings: { ...prev.booth_ratings, [field]: rating }
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.gender || !formData.age || !formData.status || !formData.knew_before) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "โปรดระบุข้อมูลทั่วไปให้ครบทุกช่อง",
        variant: "destructive",
      });
      return;
    }

    const allRatingsGiven = Object.values(formData.booth_ratings).every(rating => rating > 0);
    if (!allRatingsGiven) {
      toast({
        title: "กรุณาให้คะแนนทุกหัวข้อ",
        description: "โปรดให้คะแนนความพึงพอใจต่อบูธให้ครบทุกหัวข้อ",
        variant: "destructive",
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: "กรุณายินยอมให้ใช้ข้อมูล",
        description: "โปรดยินยอมให้ใช้ข้อมูลเพื่อการปรับปรุงผลงาน",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('booth_surveys').insert([{
        gender: formData.gender,
        age: formData.age,
        status: formData.status,
        knew_before: formData.knew_before,
        booth_ratings: formData.booth_ratings,
        most_liked: formData.most_liked,
        improvements: formData.improvements,
        follow_interest: formData.follow_interest,
        consent: formData.consent,
      }]);

      if (error) throw error;

      toast({
        title: "ขอบคุณสำหรับการประเมิน! 🙏",
        description: "ความคิดเห็นของคุณจะช่วยให้เราพัฒนาผลงานให้ดีขึ้น",
        duration: 5000,
      });

      // Reset form
      setFormData({
        gender: '',
        age: '',
        status: '',
        knew_before: '',
        booth_ratings: {
          decoration: 0,
          clarity: 0,
          demo_understanding: 0,
          technology_interest: 0,
          service: 0,
          feasibility: 0,
          overall_satisfaction: 0,
        },
        most_liked: '',
        improvements: '',
        follow_interest: '',
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

  const boothRatingFields = [
    { key: 'decoration' as const, label: 'ความสวยงามและการจัดตกแต่งบูธ' },
    { key: 'clarity' as const, label: 'ความชัดเจนของป้าย แผนที่ และข้อมูลนำเสนอ' },
    { key: 'demo_understanding' as const, label: 'ความเข้าใจง่ายของการสาธิต / อธิบายระบบ D-MIND' },
    { key: 'technology_interest' as const, label: 'ความน่าสนใจของเทคโนโลยีและนวัตกรรม' },
    { key: 'service' as const, label: 'การให้บริการและการต้อนรับของทีมงาน' },
    { key: 'feasibility' as const, label: 'ความเป็นไปได้ในการนำ D-MIND ไปใช้จริง' },
    { key: 'overall_satisfaction' as const, label: 'ความพึงพอใจโดยรวมต่อบูธ D-MIND' },
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
                <RadioGroupItem value="male" id="booth_male" />
                <Label htmlFor="booth_male" className="font-normal cursor-pointer">ชาย</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="booth_female" />
                <Label htmlFor="booth_female" className="font-normal cursor-pointer">หญิง</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="booth_other" />
                <Label htmlFor="booth_other" className="font-normal cursor-pointer">อื่น ๆ</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>อายุ *</Label>
            <RadioGroup value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="under18" id="booth_under18" />
                <Label htmlFor="booth_under18" className="font-normal cursor-pointer">ต่ำกว่า 18 ปี</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="18-25" id="booth_18-25" />
                <Label htmlFor="booth_18-25" className="font-normal cursor-pointer">18–25 ปี</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="26-35" id="booth_26-35" />
                <Label htmlFor="booth_26-35" className="font-normal cursor-pointer">26–35 ปี</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="36plus" id="booth_36plus" />
                <Label htmlFor="booth_36plus" className="font-normal cursor-pointer">36 ปีขึ้นไป</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>สถานะ *</Label>
            <RadioGroup value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="booth_student" />
                <Label htmlFor="booth_student" className="font-normal cursor-pointer">นักเรียน / นักศึกษา</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="booth_teacher" />
                <Label htmlFor="booth_teacher" className="font-normal cursor-pointer">อาจารย์</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="booth_general" />
                <Label htmlFor="booth_general" className="font-normal cursor-pointer">บุคคลทั่วไป</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organization" id="booth_organization" />
                <Label htmlFor="booth_organization" className="font-normal cursor-pointer">หน่วยงานภาครัฐ / เอกชน</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>เคยได้ยินหรือรู้จักโครงการ D-MIND มาก่อนหรือไม่? *</Label>
            <RadioGroup value={formData.knew_before} onValueChange={(value) => setFormData(prev => ({ ...prev, knew_before: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="knew_yes" />
                <Label htmlFor="knew_yes" className="font-normal cursor-pointer">เคย</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="knew_no" />
                <Label htmlFor="knew_no" className="font-normal cursor-pointer">ไม่เคย</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 1: ความพึงพอใจต่อบูธ */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 1: ความพึงพอใจต่อบูธแสดงผลงาน</h3>
          <p className="text-sm text-muted-foreground">โปรดให้คะแนน 1–5 : 1 = น้อยที่สุด 5 = มากที่สุด</p>
          
          <div className="space-y-6">
            {boothRatingFields.map((field) => (
              <StarRating
                key={field.key}
                rating={formData.booth_ratings[field.key]}
                onRating={(rating) => handleRatingChange(field.key, rating)}
                label={field.label}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 2: ความเห็นและข้อเสนอแนะ */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 2: ความเห็นและข้อเสนอแนะเพิ่มเติม</h3>
          
          <div className="space-y-2">
            <Label>สิ่งที่คุณชอบมากที่สุดในบูธนี้คืออะไร?</Label>
            <Textarea
              value={formData.most_liked}
              onChange={(e) => setFormData(prev => ({ ...prev, most_liked: e.target.value }))}
              placeholder="แบ่งปันความคิดเห็นของคุณ..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>สิ่งที่อยากให้ปรับปรุง / พัฒนาคืออะไร?</Label>
            <Textarea
              value={formData.improvements}
              onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
              placeholder="ข้อเสนอแนะของคุณ..."
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>คุณสนใจติดตามหรือทดลองใช้งานระบบ D-MIND หรือไม่?</Label>
            <RadioGroup value={formData.follow_interest} onValueChange={(value) => setFormData(prev => ({ ...prev, follow_interest: value }))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="interested" id="interested" />
                <Label htmlFor="interested" className="font-normal cursor-pointer">สนใจ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="booth_unsure" />
                <Label htmlFor="booth_unsure" className="font-normal cursor-pointer">ไม่แน่ใจ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_interested" id="booth_not_interested" />
                <Label htmlFor="booth_not_interested" className="font-normal cursor-pointer">ไม่สนใจ</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* ส่วนที่ 3: การยินยอม */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">ส่วนที่ 3: การยินยอมให้ใช้ข้อมูล</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="booth_consent"
              checked={formData.consent}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked as boolean }))}
            />
            <Label htmlFor="booth_consent" className="font-normal cursor-pointer">
              ข้อมูลที่ให้จะถูกนำไปใช้เพื่อการปรับปรุงผลงานเท่านั้น (ยินยอม) *
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

export default BoothSurveyForm;
