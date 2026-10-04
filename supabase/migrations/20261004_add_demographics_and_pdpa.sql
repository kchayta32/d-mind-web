-- ============================================================================
-- D-MIND Satisfaction Survey: Add Demographics & PDPA Consent Columns
-- Script สำหรับอัปเดตตาราง dmind_satisfaction_surveys ใน Supabase SQL Editor
-- ============================================================================

-- 1. เพิ่มคอลัมน์ข้อมูลทั่วไป (เพศ, อายุ, อาชีพ, จังหวัด) และสถานะความยินยอม PDPA
ALTER TABLE public.dmind_satisfaction_surveys
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS age VARCHAR(50),
ADD COLUMN IF NOT EXISTS occupation VARCHAR(100),
ADD COLUMN IF NOT EXISTS province VARCHAR(100),
ADD COLUMN IF NOT EXISTS pdpa_consent BOOLEAN DEFAULT TRUE;

-- 2. สร้าง Index เพื่อเพิ่มความเร็วในการกรองข้อมูลประชากรศาสตร์
CREATE INDEX IF NOT EXISTS idx_dmind_surveys_province ON public.dmind_satisfaction_surveys(province);
CREATE INDEX IF NOT EXISTS idx_dmind_surveys_gender ON public.dmind_satisfaction_surveys(gender);
CREATE INDEX IF NOT EXISTS idx_dmind_surveys_age ON public.dmind_satisfaction_surveys(age);
CREATE INDEX IF NOT EXISTS idx_dmind_surveys_occupation ON public.dmind_satisfaction_surveys(occupation);

-- 3. เพิ่มคำอธิบายคอลัมน์ (Comments)
COMMENT ON COLUMN public.dmind_satisfaction_surveys.gender IS 'เพศของผู้ประเมิน (ชาย, หญิง, ทางเลือกอื่น / ไม่ประสงค์ระบุ)';
COMMENT ON COLUMN public.dmind_satisfaction_surveys.age IS 'ช่วงอายุของผู้ประเมิน';
COMMENT ON COLUMN public.dmind_satisfaction_surveys.occupation IS 'อาชีพของผู้ประเมิน';
COMMENT ON COLUMN public.dmind_satisfaction_surveys.province IS 'จังหวัดที่อยู่อาศัยของผู้ประเมิน';
COMMENT ON COLUMN public.dmind_satisfaction_surveys.pdpa_consent IS 'สถานะการยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)';
