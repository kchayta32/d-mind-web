import json
import random
from datetime import datetime, timezone, timedelta

random.seed(20261007)

# Start timestamp specified by user
START_TIMESTAMP_STR = "2026-10-04 07:53:00.143756+00"
start_dt = datetime.fromisoformat("2026-10-04T07:53:00.143756+00:00")
# Current local time 2026-10-07 09:35:53+07:00 -> UTC 2026-10-07 02:35:53+00:00
current_dt = datetime.fromisoformat("2026-10-07T02:35:53.000000+00:00")
total_seconds = (current_dt - start_dt).total_seconds()

# Generate 40 unique, strictly ascending ratios between 0.005 and 0.992
raw_ratios = []
step = 0.985 / 40.0
for i in range(40):
    r_val = 0.008 + i * step + random.uniform(0.001, step * 0.8)
    raw_ratios.append(round(r_val, 4))
ratios = sorted(raw_ratios)

provinces = (
    ['เชียงราย'] * 7 +
    ['เชียงใหม่'] * 7 +
    ['กรุงเทพมหานคร'] * 7 +
    ['นครปฐม'] * 7 +
    ['นนทบุรี'] * 6 +
    ['สมุทรปราการ'] * 6
)
random.shuffle(provinces)

genders = (
    ['ชาย'] * 19 +
    ['หญิง'] * 19 +
    ['ทางเลือกอื่น / ไม่ระบุ'] * 2
)
random.shuffle(genders)

favorite_features = [
    "แผนที่แสดงระดับน้ำและจุดเสี่ยงภัยแบบเรียลไทม์ ชัดเจนและเข้าใจง่ายมาก",
    "ระบบแชทบอท AI Dr.Mind ตอบคำถามเรื่องพยากรณ์น้ำท่วมและข้อมูลฉุกเฉินได้ทันท่วงที",
    "การแจ้งเตือนภัยล่วงหน้าตามพิกัด GPS ของผู้ใช้งาน แม่นยำดีมาก",
    "แผนผังเรดาร์ปริมาณน้ำฝนและระดับน้ำในแม่น้ำเจ้าพระยา ละเอียดครบถ้วน",
    "หน้าแดชบอร์ดสรุปภาพรวมสถานการณ์น้ำ ดูง่าย สวยงาม ไม่ซับซ้อน",
    "ระบบค้นหาจุดปลอดภัยและศูนย์พักพิงใกล้เคียง มีประโยชน์มากในยามฉุกเฉิน",
    "กราฟสถิติและการคาดการณ์ปริมาณน้ำฝนย้อนหลังและล่วงหน้า ใช้งานสะดวก",
    "UI สวยงาม ทันสมัย โทนสีสบายตา เหมาะกับการเปิดดูบนสมาร์ทโฟนระหว่างเดินทาง",
    "ระบบแผนที่ GIS ผสานจุดตรวจวัดน้ำโทรมาตร กทม. มีประโยชน์กับการวางแผนเดินทางมาก",
    "ฟีเจอร์คำนวณระยะห่างจากจุดเสี่ยงภัยน้ำท่วมไปยังตำแหน่งปัจจุบัน แม่นยำมาก",
    "การสรุปภาพรวมระดับน้ำรายชั่วโมงและการแจ้งเตือนเมื่อน้ำถึงระดับวิกฤต",
    "การแสดงผลข้อมูลสภาพอากาศร่วมกับภาพถ่ายดาวเทียม เข้าใจง่ายไม่ซับซ้อน"
]

missing_features = [
    "อยากให้เพิ่มระบบแจ้งเตือนผ่าน SMS หรือ LINE Official Account เมื่อมีเหตุวิกฤต",
    "อยากให้มีระบบนำทางเลี่ยงเส้นทางน้ำท่วมขัง (Turn-by-turn navigation)",
    "ต้องการให้เชื่อมโยงภาพกล้อง CCTV สภาพการจราจรและระดับน้ำสดๆ ตามแยกสำคัญ",
    "อยากให้มีปุ่มขอความช่วยเหลือฉุกเฉิน (SOS Emergency) ส่งพิกัดให้หน่วยกู้ภัยโดยตรง",
    "อยากให้เพิ่มข้อมูลคุณภาพอากาศและดัชนีความร้อนควบคู่กับข้อมูลน้ำท่วม",
    "อยากให้มีระบบแจ้งเตือนระดับน้ำล้นตลิ่งสำหรับพื้นที่ริมคลองในเขตปริมณฑล",
    "อยากให้มีวิดเจ็ต (Widget) สรุปสถานการณ์น้ำสำหรับหน้าจอล็อคสมาร์ทโฟน",
    "อยากให้รองรับการแจ้งเตือนเสียงไซเรนฉุกเฉินระดับสูงสำหรับภัยพิบัติรุนแรง",
    "อยากให้สามารถบันทึกและปักหมุดจุดน้ำท่วมขังเพื่อแชร์ให้ผู้ใช้คนอื่นเห็นได้",
    None,
    None
]

general_suggestions = [
    "ระบบตอบสนองได้รวดเร็วมาก ไม่มีอาการค้างหรือกระตุก เหมาะกับนักศึกษาใช้เช็คเส้นทางก่อนไปเรียน",
    "อยากให้ประชาสัมพันธ์ระบบนี้ไปยังมหาวิทยาลัยและโรงเรียนในพื้นที่เสี่ยงน้ำท่วม",
    "การจัดวางหน้าตาแอปพลิเคชันทำได้ยอดเยี่ยม เป็นกำลังใจให้ทีมพัฒนาครับ",
    "ข้อมูลอัปเดตต่อเนื่อง มีประโยชน์อย่างยิ่งสำหรับประชาชนและนักเรียนนักศึกษาในฤดูมรสุม",
    "ขนาดตัวอักษรและสีสันอ่านง่าย ใช้งานสะดวกมากทั้งบนมือถือและคอมพิวเตอร์",
    "ภาพรวมดีมากครับ ใช้งานง่ายและโหลดข้อมูลได้รวดเร็วแม้สัญญาณอินเทอร์เน็ตจะช้า",
    "ระบบ AI แชทบอทให้คำแนะนำที่เป็นประโยชน์และตอบภาษาไทยได้เป็นธรรมชาติมาก",
    "อยากให้เปิดให้ดาวน์โหลดเป็นแอปพลิเคชันบนมือถือผ่าน App Store / Play Store ในอนาคต",
    "แอปออกแบบได้ตอบโจทย์การใช้งานจริงในพื้นที่เสี่ยงภัยมาก ขอบคุณทีมงานครับ",
    None,
    None
]

score_pool = [5, 5, 5, 5, 5, 5, 4, 4, 4, 3]

def get_score():
    return random.choice(score_pool)

sql_lines = []
sql_lines.append("-- ============================================================================")
sql_lines.append("-- D-MIND Satisfaction Surveys: Seed Data Script (40 Sample Respondents)")
sql_lines.append("-- ช่วงเวลา timestamptz: คละตั้งแต่ 2026-10-04 07:53:00.143756+00 ถึงปัจจุบัน (NOW()) ทุกคน")
sql_lines.append("-- รายละเอียดกลุ่มตัวอย่าง:")
sql_lines.append("-- - เพศ: คละเพศ (ชาย 19 คน, หญิง 19 คน, ทางเลือกอื่น / ไม่ระบุ 2 คน)")
sql_lines.append("-- - ช่วงอายุ: '20 - 30 ปี' (40 คน)")
sql_lines.append("-- - อาชีพ: 'นักเรียน / นักศึกษา' (40 คน)")
sql_lines.append("-- - จังหวัด: คละ 6 จังหวัด (เชียงราย 7, เชียงใหม่ 7, กรุงเทพมหานคร 7, นครปฐม 7, นนทบุรี 6, สมุทรปราการ 6 รวม 40 คน)")
sql_lines.append("-- - ความยินยอม PDPA: true (ยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล)")
sql_lines.append("-- - คะแนนประเมิน: สุ่มตามเกณฑ์มาตรฐาน Likert Scale (1-5) ครบทั้ง 17 ข้อย่อย")
sql_lines.append("--   พร้อมคำนวณคะแนนเฉลี่ยรายด้าน (avg) และคะแนนเฉลี่ยรวม (total_mean) แม่นยำตรงตามโมเดลระบบ")
sql_lines.append("-- ============================================================================\n")

sql_lines.append("-- 1. ตรวจสอบและเพิ่มคอลัมน์ข้อมูลทั่วไปและ PDPA (หากยังไม่มีในตาราง)")
sql_lines.append("ALTER TABLE public.dmind_satisfaction_surveys")
sql_lines.append("ADD COLUMN IF NOT EXISTS gender VARCHAR(50),")
sql_lines.append("ADD COLUMN IF NOT EXISTS age VARCHAR(50),")
sql_lines.append("ADD COLUMN IF NOT EXISTS occupation VARCHAR(100),")
sql_lines.append("ADD COLUMN IF NOT EXISTS province VARCHAR(100),")
sql_lines.append("ADD COLUMN IF NOT EXISTS pdpa_consent BOOLEAN DEFAULT TRUE;\n")

sql_lines.append("-- 2. เพิ่มข้อมูลตัวอย่าง 40 แถวลงในตาราง dmind_satisfaction_surveys")
sql_lines.append("INSERT INTO public.dmind_satisfaction_surveys (")
sql_lines.append("    id,")
sql_lines.append("    created_at,")
sql_lines.append("    updated_at,")
sql_lines.append("    gender,")
sql_lines.append("    age,")
sql_lines.append("    occupation,")
sql_lines.append("    province,")
sql_lines.append("    pdpa_consent,")
sql_lines.append("    usability_1_overall_ease,")
sql_lines.append("    usability_2_buttons_menus,")
sql_lines.append("    usability_3_speed_response,")
sql_lines.append("    usability_4_search_features,")
sql_lines.append("    usability_5_stability,")
sql_lines.append("    ui_1_map_clarity,")
sql_lines.append("    ui_2_font_color,")
sql_lines.append("    ui_3_layout,")
sql_lines.append("    ui_4_theme_beauty,")
sql_lines.append("    alert_1_clear_message,")
sql_lines.append("    alert_2_sound_style,")
sql_lines.append("    alert_3_customization,")
sql_lines.append("    chatbot_1_clear_answers,")
sql_lines.append("    chatbot_2_speed,")
sql_lines.append("    chatbot_3_coverage,")
sql_lines.append("    chatbot_4_natural_language,")
sql_lines.append("    overall_1_satisfaction,")
sql_lines.append("    avg_usability,")
sql_lines.append("    avg_ui,")
sql_lines.append("    avg_alert,")
sql_lines.append("    avg_chatbot,")
sql_lines.append("    avg_overall,")
sql_lines.append("    total_mean,")
sql_lines.append("    favorite_feature,")
sql_lines.append("    missing_features,")
sql_lines.append("    general_suggestions,")
sql_lines.append("    raw_ratings")
sql_lines.append(") VALUES")

values_sql = []
for i in range(40):
    gender = genders[i]
    age = '20 - 30 ปี'
    occupation = 'นักเรียน / นักศึกษา'
    province = provinces[i]
    ratio = ratios[i]
    
    # 17 questions
    u1 = get_score()
    u2 = get_score()
    u3 = get_score()
    u4 = get_score()
    u5 = get_score()
    
    ui1 = get_score()
    ui2 = get_score()
    ui3 = get_score()
    ui4 = get_score()
    
    a1 = get_score()
    a2 = get_score()
    a3 = get_score()
    
    c1 = get_score()
    c2 = get_score()
    c3 = get_score()
    c4 = get_score()
    
    o1 = get_score()
    
    avg_u = round((u1 + u2 + u3 + u4 + u5) / 5.0, 2)
    avg_ui = round((ui1 + ui2 + ui3 + ui4) / 4.0, 2)
    avg_alert = round((a1 + a2 + a3) / 3.0, 2)
    avg_chatbot = round((c1 + c2 + c3 + c4) / 4.0, 2)
    avg_overall = round(o1 * 1.0, 2)
    total_m = round((avg_u + avg_ui + avg_alert + avg_chatbot + avg_overall) / 5.0, 2)
    
    raw_ratings = {
        "usability_1": u1, "usability_2": u2, "usability_3": u3, "usability_4": u4, "usability_5": u5,
        "ui_1": ui1, "ui_2": ui2, "ui_3": ui3, "ui_4": ui4,
        "alert_1": a1, "alert_2": a2, "alert_3": a3,
        "chatbot_1": c1, "chatbot_2": c2, "chatbot_3": c3, "chatbot_4": c4,
        "overall_1": o1
    }
    
    fav = random.choice(favorite_features)
    missing = random.choice(missing_features)
    sugg = random.choice(general_suggestions)
    
    def esc_sql(val):
        if val is None:
            return "NULL"
        val_clean = str(val).replace("'", "''")
        return f"'{val_clean}'"
    
    # Exact dynamic expression ensuring interpolation from 2026-10-04 07:53:00.143756+00 to NOW()
    # Also show calculated approximate time as SQL comment for readability
    approx_time = start_dt + timedelta(seconds=total_seconds * ratio)
    approx_time_str = approx_time.strftime("%Y-%m-%d %H:%M:%S UTC")
    
    ts_expr = f"'2026-10-04 07:53:00.143756+00'::timestamptz + ((NOW() - '2026-10-04 07:53:00.143756+00'::timestamptz) * {ratio:.4f})"
    
    row_str = f"""(
    gen_random_uuid(),
    {ts_expr}, -- #{i+1:02d} ~ {approx_time_str}
    {ts_expr},
    '{gender}',
    '{age}',
    '{occupation}',
    '{province}',
    TRUE,
    {u1}, {u2}, {u3}, {u4}, {u5},
    {ui1}, {ui2}, {ui3}, {ui4},
    {a1}, {a2}, {a3},
    {c1}, {c2}, {c3}, {c4},
    {o1},
    {avg_u:.2f},
    {avg_ui:.2f},
    {avg_alert:.2f},
    {avg_chatbot:.2f},
    {avg_overall:.2f},
    {total_m:.2f},
    {esc_sql(fav)},
    {esc_sql(missing)},
    {esc_sql(sugg)},
    '{json.dumps(raw_ratings, ensure_ascii=False)}'::jsonb
)"""
    values_sql.append(row_str)

sql_lines.append(",\n".join(values_sql) + ";\n")

sql_lines.append("""-- 3. ตรวจสอบผลลัพธ์การบันทึกข้อมูลและช่วงเวลา timestamptz
SELECT 
    COUNT(*) AS total_respondents,
    MIN(created_at) AS earliest_submission,
    MAX(created_at) AS latest_submission,
    ROUND(AVG(avg_usability), 2) AS mean_usability,
    ROUND(AVG(avg_ui), 2) AS mean_ui,
    ROUND(AVG(avg_alert), 2) AS mean_alert,
    ROUND(AVG(avg_chatbot), 2) AS mean_chatbot,
    ROUND(AVG(avg_overall), 2) AS mean_overall,
    ROUND(AVG(total_mean), 2) AS overall_total_mean
FROM public.dmind_satisfaction_surveys;

-- 4. ตรวจสอบการกระจายตัวของประชากรศาสตร์ (Demographics)
SELECT province, COUNT(*) AS count FROM public.dmind_satisfaction_surveys GROUP BY province ORDER BY count DESC;
SELECT gender, COUNT(*) AS count FROM public.dmind_satisfaction_surveys GROUP BY gender ORDER BY count DESC;
SELECT age, COUNT(*) AS count FROM public.dmind_satisfaction_surveys GROUP BY age;
SELECT occupation, COUNT(*) AS count FROM public.dmind_satisfaction_surveys GROUP BY occupation;

-- 5. ตรวจสอบรายชื่อเวลาส่งแบบประเมิน เรียงตาม timestamptz
SELECT id, created_at, gender, age, occupation, province, total_mean 
FROM public.dmind_satisfaction_surveys 
ORDER BY created_at ASC;
""")

output_sql = "\n".join(sql_lines)
with open("supabase/migrations/20261007_seed_dmind_satisfaction_surveys_40_users.sql", "w", encoding="utf-8") as f:
    f.write(output_sql)

print("Generated seed SQL with timestamptz successfully!")
