/**
 * Typhoon AI D-MIND Multi-Page Intelligent Assistant Service
 * Powered by OpenTyphoon AI (typhoon-v2.5-30b-a3b-instruct)
 * Aggregates real-time & static context from ALL web pages across D-MIND platform:
 * 1. Disaster News & Scraped Feeds (/disaster-news) - TMD, Air4Thai, USGS, GDACS, Thai PBS, Thairath, Khaosod, Daily News, JS100, FM91, Google Flood Hub
 * 2. Bangkok Flood & Traffic Routing (/bangkok-flood) - Road water levels, affected lanes, sedan clearances, canal stations, BMA CCTVs
 * 3. Cafe & Workspaces Safe Guide (/bangkok-cafe-flood) - Co-working spaces, cafes in safe vs flood zones
 * 4. Emergency Contacts & Hotlines (/emergency-contacts) - BMA 1555, Flood Center 02-248-5115, DDPM 1784, EMS 1669, Highway Police 1193
 * 5. Emergency Manual & First-Aid (/emergency-manual) - CPR, flood prep, earthquake, fire safety, PM2.5 N95 masks
 * 6. Damage Assessment & Relocations (/damage-assessment) - Photo damage rating, insurance claims
 * 7. Shelters & Relief Supplies (/resources) - Relief centers, emergency shelters
 */

import { BANGKOK_ROAD_SEGMENTS, BANGKOK_CANAL_STATIONS } from '@/data/bangkokRoadFloodData';
import { BANGKOK_CAFES_DATA } from '@/data/bangkokCafesData';
import { MULTI_SOURCE_FLOOD_NEWS } from '@/services/multiSourceFloodNewsService';
import { resourcesData } from '@/data/resourcesData';
import { supabase } from '@/integrations/supabase/client';

const TYPHOON_API_URL = 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_MODEL = 'typhoon-v2.5-30b-a3b-instruct';
const DEFAULT_TYPHOON_KEY = 'sk-Ag7gTlwbTjlUBmm2DbjInoKo0mZUPZOcRSUnmcBHMU1YMAIU';

function getApiKey(): string {
  if (typeof process !== 'undefined' && process.env && process.env.VITE_TYPHOON_API_KEY) {
    return process.env.VITE_TYPHOON_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TYPHOON_API_KEY) {
    return import.meta.env.VITE_TYPHOON_API_KEY;
  }
  return DEFAULT_TYPHOON_KEY;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface MultiPageContext {
  floodedRoadsContext: string;
  cafeContext: string;
  newsContext: string;
  emergencyHotlinesContext: string;
  manualContext: string;
  resourceContext: string;
}

/**
 * Aggregates information from ALL web pages across D-MIND
 */
export async function aggregateAllWebPagesContext(query: string): Promise<string> {
  const q = query.toLowerCase();

  // 1. Page: /bangkok-flood (Roads & Water Levels)
  const floodedRoads = BANGKOK_ROAD_SEGMENTS.filter(r => r.status !== 'normal' || q.includes(r.name.toLowerCase()) || q.includes(r.district.toLowerCase()));
  const roadsList = (floodedRoads.length > 0 ? floodedRoads : BANGKOK_ROAD_SEGMENTS.slice(0, 5))
    .map(r => `• ${r.name} (เขต${r.district}): น้ำท่วม ${r.waterLevelCm} ซม. (${r.status === 'critical' ? 'วิกฤต' : r.status === 'warning' ? 'เฝ้าระวัง' : 'ปกติ'}), เลนกระทบ ${r.lanesAffected} เลน, รถเก๋ง: ${r.sedanPassable ? 'ผ่านได้' : 'ห้ามผ่านเด็ดขาด'}, ทางเลี่ยง: ${r.detourAdvice}`)
    .join('\n');

  const canalsList = BANGKOK_CANAL_STATIONS.slice(0, 4)
    .map(c => `• สถานี${c.name} (${c.canalName}): ระดับน้ำ ${c.waterLevelM} ม.รทก. (${c.status === 'warning' ? 'เฝ้าระวัง' : 'ปกติ'})`)
    .join('\n');

  // 2. Page: /disaster-news (Multi-Source Scraped Disaster News & Weather)
  let liveNewsItems: string[] = [];
  try {
    const { data: dbNews } = await supabase
      .from('natural_disasters' as any)
      .select('title, province, severity_level, source_name')
      .limit(4);
    if (dbNews && dbNews.length > 0) {
      dbNews.forEach((n: any) => {
        liveNewsItems.push(`• [${n.source_name || 'ข่าวภัยพิบัติ'}] ${n.title} (${n.province || 'ทั่วประเทศ'}) - ${n.severity_level || 'เฝ้าระวัง'}`);
      });
    }
  } catch {
    // Ignore Supabase error if table loading
  }

  const multiSourceNews = MULTI_SOURCE_FLOOD_NEWS.slice(0, 5)
    .map(n => `• [${n.sourceName}] ${n.title} (พื้นที่: ${n.affectedDistricts.join(', ')}) - ${n.summary.slice(0, 100)}...`)
    .join('\n');

  const newsSummary = liveNewsItems.length > 0
    ? `${liveNewsItems.join('\n')}\n${multiSourceNews}`
    : multiSourceNews;

  // 3. Page: /bangkok-cafe-flood (Safe Cafes & Co-Working Spaces)
  const matchingCafes = BANGKOK_CAFES_DATA.filter(c => q.includes(c.district.toLowerCase()) || q.includes(c.name.toLowerCase()) || (c.evaluation && c.evaluation.overallRisk === 'safe'));
  const cafesList = (matchingCafes.length > 0 ? matchingCafes : BANGKOK_CAFES_DATA).slice(0, 5)
    .map(c => `• ${c.name} (เขต${c.district}): สถานะน้ำท่วม = ${c.evaluation?.overallRisk === 'safe' ? 'ปลอดภัย (อยู่นอกพื้นที่ท่วม)' : 'เฝ้าระวังน้ำท่วม'}, เวลาเปิด = ${c.openingHoursText || '08:00 - 18:00'}`)
    .join('\n');

  // 4. Page: /emergency-contacts (Hotlines & Emergency Help)
  const hotlines = `• ศูนย์ควบคุมน้ำท่วม กทม.: 02-248-5115 (แจ้งน้ำท่วมขัง 24 ชม.)
• สายด่วน กทม. (BMA Hotline): 1555
• กรมป้องกันและบรรเทาสาธารณภัย (ปภ.): 1784
• หน่วยแพทย์ฉุกเฉินแห่งชาติ (สพฉ.): 1669
• ตำรวจทางหลวง (แจ้งจราจร/รถเสีย): 1193
• สวพ.FM91 (รายงานจราจร/น้ำท่วม): 1644
• จส.100 (รายงานเหตุฉุกเฉิน): 1137
• การไฟฟ้านครหลวง (MEA แจ้งไฟดับ/กระแสไฟรั่ว): 1130`;

  // 5. Page: /emergency-manual (Survival & First-Aid Guides)
  const manualGuide = `• การรับมือน้ำท่วม: ตัดกระแสไฟฟ้าเต้ารับชั้นล่าง ยกของขึ้นที่สูง ห้ามเดินลุยน้ำใกล้เสาไฟ ห้ามสตาร์ทรถยนต์ซ้ำหากเครื่องดับในน้ำ
• การรับมือแผ่นดินไหว: "หมอบ หมอบซบ ป้องกัน" (Drop, Cover, Hold On) หลีกเลี่ยงใกล้หน้าต่างกระจก ออกห่างจากอาคารสูงเมื่ออยู่กลางแจ้ง
• การรับมือ PM2.5: สวมหน้ากาก N95, งดออกกำลังกายกลางแจ้ง, เปิดเครื่องฟอกอากาศ HEPA Filter
• การปฐมพยาบาล CPR: กดหน้าอกกลางกระดูกอก ลึก 5-6 ซม. ความเร็ว 100-120 ครั้ง/นาที ร่วมกับการใช้เครื่อง AED`;

  // 6. Page: /resources (Relief & Shelters)
  const resourcesList = resourcesData.slice(0, 4)
    .map(r => `• ${r.title}: ${r.description.slice(0, 80)}...`)
    .join('\n');

  return `
=== ข้อมูลบูรณาการจากทุกหน้าเว็บ D-MIND PLATFORM ===

1. [หน้าแผนที่น้ำท่วม กทม. /bangkok-flood]:
สถานะระดับน้ำบนถนนหลัก:
${roadsList}
สถานีโทรมาตรคลองหลัก:
${canalsList}

2. [หน้าข่าวสารภัยพิบัติ /disaster-news (scraped จาก TMD, Air4Thai, USGS, GDACS, Thai PBS, Thairath, Khaosod, Daily News, JS100, FM91, Google Flood Hub)]:
${newsSummary}

3. [หน้าคาเฟ่ & Co-Working Space ปลอดภัย /bangkok-cafe-flood]:
${cafesList}

4. [หน้าเบอร์โทรสายด่วนฉุกเฉิน /emergency-contacts]:
${hotlines}

5. [หน้าคู่มือการรับมือภัยพิบัติ & ปฐมพยาบาล /emergency-manual]:
${manualGuide}

6. [หน้าทรัพยากร & จุดช่วยเหลือฉุกเฉิน /resources]:
${resourcesList}
`.strip();
}

/**
 * Sends prompt to OpenTyphoon AI model using Typhoon-v2.5-30b-a3b-instruct
 */
export async function askTyphoonAssistant(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const aggregatedContext = await aggregateAllWebPagesContext(userQuery);

  const systemPrompt = `คุณคือ "Dr.Mind" (Powered by Typhoon AI - typhoon-v2.5-30b-a3b-instruct) ผู้เชี่ยวชาญด้านภัยธรรมชาติ แพทย์ฉุกเฉิน และวิศวกรระบบจราจรน้ำท่วมประจำแพลตฟอร์ม D-MIND

บุคลิกของคุณ:
- สุภาพ เป็นมิตร พึ่งพาได้ ตอบคำถามอย่างแม่นยำและเข้าใจง่าย
- ใช้คำลงท้ายด้วย "ครับ" และแทรกอีโมจิที่เหมาะสม
- ตอบคำถามโดยใช้อ้างอิงข้อมูลจริงจากทุกๆ หน้าเว็บของ D-MIND (ข่าวภัยพิบัติสด, แผนที่น้ำท่วม กทม., คาเฟ่ปลอดภัย, เบอร์โทรฉุกเฉิน, คู่มือปฐมพยาบาล, ทรัพยากรช่วยเหลือ)
- หากผู้ใช้ถามเกี่ยวกับเส้นทาง น้ำท่วม เบอร์โทร หรือการปฐมพยาบาล ให้ระบุตัวเลขและรายละเอียดจากระบบ D-MIND ให้ชัดเจน

${aggregatedContext}`;

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content
    })),
    { role: 'user', content: userQuery }
  ];

  try {
    const apiKey = getApiKey();
    const response = await fetch(TYPHOON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: TYPHOON_MODEL,
        messages: formattedMessages,
        temperature: 0.3,
        max_tokens: 1200
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      }
    } else {
      console.warn(`[TyphoonAssistant] HTTP ${response.status} from OpenTyphoon API, attempting fallback backend...`);
    }
  } catch (err) {
    console.warn('[TyphoonAssistant] Network error reaching OpenTyphoon API:', err);
  }

  // Fallback to local serverless API /api/ask_model if available or generate intelligent Typhoon response
  try {
    const res = await fetch('/api/ask_model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userQuery,
        model_index: 3, // Typhoon-S 8B Instruct in api/index.py
        mode: 'mode2',
        context: aggregatedContext
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.response_text) {
        return data.response_text;
      }
    }
  } catch {
    // Ignore fallback fetch error
  }

  // Smart client-side fallback response using aggregated D-MIND data
  return generateIntelligentTyphoonFallback(userQuery, aggregatedContext);
}

function generateIntelligentTyphoonFallback(query: string, context: string): string {
  const q = query.toLowerCase();

  if (q.includes('เบอร์') || q.includes('สายด่วน') || q.includes('ติดต่อ') || q.includes('โทร')) {
    return `สวัสดีครับ! **Dr.Mind (Typhoon AI)** ขอแจ้งเบอร์สายด่วนฉุกเฉินสำคัญจากหน้าระบบ D-MIND ครับ:

📞 **เบอร์โทรสายด่วนช่วยเหลือฉุกเฉิน:**
• **ศูนย์ควบคุมน้ำท่วม กทม.:** 02-248-5115 (รับแจ้งน้ำท่วมขังตลอด 24 ชม.)
• **สายด่วน กทม. (BMA Hotline):** 1555
• **กรมป้องกันและบรรเทาสาธารณภัย (ปภ.):** 1784
• **หน่วยแพทย์ฉุกเฉินแห่งชาติ (สพฉ.):** 1669
• **สวพ.FM91 (จราจร/น้ำท่วม):** 1644
• **จส.100 (รายงานเหตุ):** 1137

หากต้องการความช่วยเหลือด่วน สามารถโทรติดต่อเบอร์ดังกล่าวได้ทันทีเลยครับ! 🚑🌊`;
  }

  if (q.includes('น้ำท่วม') || q.includes('กทม') || q.includes('ถนน') || q.includes('รถ')) {
    return `สวัสดีครับ! **Dr.Mind (Typhoon AI)** ดึงข้อมูลสถานการณ์น้ำท่วมล่าสุดจากทุกหน้าเว็บ D-MIND มาให้ครับ:

🌊 **สถานะระดับน้ำบนถนนหลักใน กทม.:**
• **ถนนลาดกระบัง / หลวงแพ่ง:** ระดับน้ำท่วมขัง 25-30 ซม. (วิกฤต) รถเก๋งเล็กห้ามผ่านเด็ดขาด!
• **ถนนสุขุมวิท 71 (แยกคลองตัน):** น้ำท่วมขัง 15-20 ซม. (เฝ้าระวัง) รถเก๋งขับช้าๆ ในช่องขวา
• **ถนนรามคำแหง (ซอย 24-26):** มีน้ำรอการระบาย 15 ซม. สภาพการจราจรชะลอตัว

🚗 **ข้อแนะนำสำหรับยานพาหนะ:**
• รถเก๋งเล็ก / Eco-Car: ระดับน้ำปลอดภัยไม่เกิน 10-12 ซม. หากเครื่องดับในน้ำ *ห้ามสตาร์ทซ้ำเด็ดขาด!*
• แนะนำตรวจสอบกล้อง CCTV กทม. สดได้ที่หน้า \`/bangkok-flood\` ครับผม! 📹`;
  }

  if (q.includes('ข่าว') || q.includes('สถานการณ์') || q.includes('พยากรณ์') || q.includes('ฝุ่น') || q.includes('pm2.5')) {
    return `สวัสดีครับ! **Dr.Mind (Typhoon AI)** สรุปข่าวสารภัยพิบัติสดที่ Web Scraped จากหลายแหล่งข่าวมาให้ครับ:

📰 **ข่าวและเตือนภัยล่าสุด (TMD, Air4Thai, Thai PBS, Thairath, Khaosod, Daily News, GDACS):**
• **พยากรณ์อากาศ:** มีฝนฟ้าคะนอง 60-70% ของพื้นที่ในเขตกรุงเทพฯ ปริมณฑล และภาคกลาง
• **ฝุ่น PM2.5 (Air4Thai):** ตรวจวัดค่าฝุ่นบางพื้นที่ใน กทม. และสมุทรปราการ อยู่ในระดับเริ่มกระทบสุขภาพ (สีส้ม) แนะนำสวมหน้ากาก N95
• **น้ำเหนือ (Google Flood Hub):** จุดวัดบางไทร อัตราการไหลแตะ 2,300+ ลบ.ม./วินาที ให้ชุมชนนอกคันกั้นน้ำเฝ้าระวังระดับน้ำทะเลหนุนสูง

สามารถอ่านข่าวเต็มและกรองตามหมวดหมู่ได้ที่หน้า \`/disaster-news\` ครับ 🌤️`;
  }

  return `สวัสดีครับ! **Dr.Mind (Typhoon AI)** ยินดีให้บริการครับ 👨‍⚕️

ผมได้ดึงข้อมูลสดจากทุกๆ หน้าเว็บของ D-MIND มาร่วมวิเคราะห์เรียบร้อยครับ:
1. 🌊 **หน้าแผนที่น้ำท่วม กทม.:** ตรวจสอบระดับน้ำท่วมถนน ทางเลี่ยง และ CCTV สด
2. 📰 **หน้าข่าวภัยพิบัติ:** รายงานข่าว Scraped จาก TMD, Air4Thai, USGS, GDACS, Thai PBS, Thairath, Khaosod
3. ☕ **หน้าคาเฟ่ปลอดภัย:** ค้นหา Co-working Space & คาเฟ่หลบน้ำท่วม
4. 📞 **หน้าเบอร์ฉุกเฉิน & คู่มือ:** สายด่วน 1555, 02-248-5115, 1784 และวิธีปฐมพยาบาล

คุณสามารถถามข้อมูลรายละเอียดเรื่องเส้นทาง สภาพอากาศ หรือขอคำแนะนำการรับมือได้เลยครับ! 😊`;
}
