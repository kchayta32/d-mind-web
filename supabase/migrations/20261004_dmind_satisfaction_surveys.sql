-- ============================================================================
-- D-MIND User Satisfaction Survey Database Migration for Supabase
-- Script สร้างตารางประเมินความพึงพอใจของผู้ใช้งานระบบ D-MIND (5 ด้าน 17 ข้อย่อย + ข้อเสนอแนะ 3 ข้อ)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- OPTION 1: สร้างตารางใหม่ dmind_satisfaction_surveys (แนะนำ - ครอบคลุม 17 ข้อย่อยสมบูรณ์แบบ)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.dmind_satisfaction_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- ========================================================================
    -- ส่วนที่ 1: การประเมินความพึงพอใจของผู้ใช้งาน (ระดับคะแนน 1 - 5)
    -- ========================================================================

    -- 1. ความสะดวกในการใช้งาน (Usability)
    usability_1_overall_ease SMALLINT CHECK (usability_1_overall_ease BETWEEN 1 AND 5), -- 1.1 ภาพรวมแอปพลิเคชันใช้งานง่าย
    usability_2_buttons_menus SMALLINT CHECK (usability_2_buttons_menus BETWEEN 1 AND 5), -- 1.2 ปุ่มและเมนูต่าง ๆ ใช้งานสะดวก
    usability_3_speed_response SMALLINT CHECK (usability_3_speed_response BETWEEN 1 AND 5), -- 1.3 การตอบสนองที่รวดเร็ว
    usability_4_search_features SMALLINT CHECK (usability_4_search_features BETWEEN 1 AND 5), -- 1.4 การค้นหาข้อมูลและฟีเจอร์ต่าง ๆ ทำได้ง่าย
    usability_5_stability SMALLINT CHECK (usability_5_stability BETWEEN 1 AND 5), -- 1.5 แอปพลิเคชันไม่ค้างหรือเกิดข้อผิดพลาดระหว่างใช้งาน

    -- 2. ส่วนติดต่อผู้ใช้ (User Interface)
    ui_1_map_clarity SMALLINT CHECK (ui_1_map_clarity BETWEEN 1 AND 5), -- 2.1 รูปแบบการแสดงผลบนแผนที่เข้าใจง่าย
    ui_2_font_color SMALLINT CHECK (ui_2_font_color BETWEEN 1 AND 5), -- 2.2 ขนาดตัวอักษรและสีเหมาะสม มองเห็นชัดเจน
    ui_3_layout SMALLINT CHECK (ui_3_layout BETWEEN 1 AND 5), -- 2.3 การจัดวางองค์ประกอบบนหน้าจอเหมาะสม
    ui_4_theme_beauty SMALLINT CHECK (ui_4_theme_beauty BETWEEN 1 AND 5), -- 2.4 ธีมและสีของแอปพลิเคชันมีความสวยงาม

    -- 3. ระบบแจ้งเตือน
    alert_1_clear_message SMALLINT CHECK (alert_1_clear_message BETWEEN 1 AND 5), -- 3.1 ข้อความแจ้งเตือนเข้าใจง่ายและชัดเจน
    alert_2_sound_style SMALLINT CHECK (alert_2_sound_style BETWEEN 1 AND 5), -- 3.2 เสียงและรูปแบบการแจ้งเตือน
    alert_3_customization SMALLINT CHECK (alert_3_customization BETWEEN 1 AND 5), -- 3.3 สามารถตั้งค่าการแจ้งเตือนได้ตามต้องการ

    -- 4. ระบบแชทบอท
    chatbot_1_clear_answers SMALLINT CHECK (chatbot_1_clear_answers BETWEEN 1 AND 5), -- 4.1 การตอบคำถามที่เข้าใจง่าย
    chatbot_2_speed SMALLINT CHECK (chatbot_2_speed BETWEEN 1 AND 5), -- 4.2 ระบบตอบคำถามได้รวดเร็ว
    chatbot_3_coverage SMALLINT CHECK (chatbot_3_coverage BETWEEN 1 AND 5), -- 4.3 สามารถสอบถามข้อมูลเกี่ยวกับภัยพิบัติได้ครอบคลุม
    chatbot_4_natural_language SMALLINT CHECK (chatbot_4_natural_language BETWEEN 1 AND 5), -- 4.4 ภาษาที่ใช้ในการสื่อสารเป็นธรรมชาติ

    -- 5. ความพึงพอใจโดยรวม
    overall_1_satisfaction SMALLINT CHECK (overall_1_satisfaction BETWEEN 1 AND 5), -- 5.1 ความพึงพอใจต่อระบบดี-มายด์โดยรวม

    -- ========================================================================
    -- สรุปคะแนนเฉลี่ยรายด้าน (Computed Means)
    -- ========================================================================
    avg_usability NUMERIC(3,2), -- เฉลี่ย 1.1 ความสะดวกในการใช้งาน
    avg_ui NUMERIC(3,2),        -- เฉลี่ย 1.2 ส่วนติดต่อผู้ใช้
    avg_alert NUMERIC(3,2),     -- เฉลี่ย 1.3 ระบบแจ้งเตือน
    avg_chatbot NUMERIC(3,2),   -- เฉลี่ย 1.4 ระบบแชทบอท
    avg_overall NUMERIC(3,2),   -- เฉลี่ย 1.5 ความพึงพอใจโดยรวม
    total_mean NUMERIC(3,2),    -- รวมทุกด้าน (Total Mean)

    -- ========================================================================
    -- ส่วนที่ 2: แบบสอบถามข้อเสนอแนะเพิ่มเติมของผู้ใช้งาน
    -- ========================================================================
    favorite_feature TEXT,      -- ข้อ 1: ฟีเจอร์ใดของแอปพลิเคชันที่ท่านชอบมากที่สุด?
    missing_features TEXT,      -- ข้อ 2: มีฟีเจอร์ใดที่ท่านคิดว่ายังขาดหายไปหรือควรมีเพิ่มเติม?
    general_suggestions TEXT,   -- ข้อ 3: มีข้อเสนอแนะหรือความคิดเห็นอื่นใดเพิ่มเติม?

    -- ฟิลด์ JSON สำหรับเก็บข้อมูลดิบสำรอง
    raw_ratings JSONB
);

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.dmind_satisfaction_surveys ENABLE ROW LEVEL SECURITY;

-- สร้างนโยบายความปลอดภัย (RLS Policies) ให้ทุกคนสามารถอ่านและส่งแบบประเมินได้
DROP POLICY IF EXISTS "Allow public read access on dmind_satisfaction_surveys" ON public.dmind_satisfaction_surveys;
CREATE POLICY "Allow public read access on dmind_satisfaction_surveys"
ON public.dmind_satisfaction_surveys
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public insert access on dmind_satisfaction_surveys" ON public.dmind_satisfaction_surveys;
CREATE POLICY "Allow public insert access on dmind_satisfaction_surveys"
ON public.dmind_satisfaction_surveys
FOR INSERT
TO public
WITH CHECK (true);

-- Indexes เพื่อความรวดเร็วในการประมวลผลสถิติ
CREATE INDEX IF NOT EXISTS idx_dmind_surveys_created_at ON public.dmind_satisfaction_surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dmind_surveys_total_mean ON public.dmind_satisfaction_surveys(total_mean);


-- ----------------------------------------------------------------------------
-- OPTION 2: กรณีต้องการอัปเกรดตาราง satisfaction_surveys เดิมที่มีอยู่แล้ว
-- ----------------------------------------------------------------------------
DO $$ 
BEGIN
    -- เพิ่มคอลัมน์รายละเอียด 17 ข้อในตาราง satisfaction_surveys เดิม (ถ้ายังไม่มี)
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS detailed_ratings JSONB;
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS favorite_feature TEXT;
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS missing_features TEXT;
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS general_suggestions TEXT;
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS avg_usability NUMERIC(3,2);
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS avg_ui NUMERIC(3,2);
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS avg_alert NUMERIC(3,2);
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS avg_chatbot NUMERIC(3,2);
    ALTER TABLE public.satisfaction_surveys ADD COLUMN IF NOT EXISTS total_mean NUMERIC(3,2);
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
