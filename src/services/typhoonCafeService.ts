/**
 * Typhoon AI Cafe & Flood Weather Concierge Service
 * Powered by OpenTyphoon AI (typhoon-v2.5-30b-a3b-instruct)
 * Bilingual intelligent coffee, matcha, bar, and flood-safety recommendations
 */

import { CafeVenue, FilterState } from '@/types/cafeFlood';
import { BANGKOK_CAFES_DATA } from '@/data/bangkokCafesData';

const TYPHOON_API_URL = 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_MODEL = 'typhoon-v2.5-30b-a3b-instruct';
const DEFAULT_API_KEY = 'sk-Ag7gTlwbTjlUBmm2DbjInoKo0mZUPZOcRSUnmcBHMU1YMAIU';

interface TyphoonMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TyphoonChatRequest {
  model: string;
  messages: TyphoonMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface TyphoonChatChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface TyphoonChatResponse {
  id: string;
  choices: TyphoonChatChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function getApiKey(): string {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.VITE_TYPHOON_API_KEY) {
      return process.env.VITE_TYPHOON_API_KEY;
    }
  } catch {
    // Ignore
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TYPHOON_API_KEY) {
      return import.meta.env.VITE_TYPHOON_API_KEY;
    }
  } catch {
    // Ignore
  }
  return DEFAULT_API_KEY;
}

const SYSTEM_PROMPT = `
คุณคือ "Typhoon AI Barista & Flood Weather Concierge" ที่ปรึกษาผู้เชี่ยวชาญพิเศษด้านคาเฟ่ สเปเชียลตี้คอฟฟี่ มัทฉะบาร์ ค็อกเทลบาร์ โคเวิร์กกิ้งสเปซ และสภาพการจราจรน้ำท่วมในเขตกรุงเทพมหานครและปริมณฑล

คุณมีบุคลิกภาพ:
- สุภาพ อบอุ่น มีสไตล์ ชำนาญวงการกาแฟ/บาร์อย่างลึกซึ้ง และห่วงใยความปลอดภัยของผู้ใช้งาน
- สองภาษา (Bilingual): ตอบภาษาไทยเป็นหลัก หรือตอบภาษาอังกฤษหากผู้ใช้ถามเป็นภาษาอังกฤษ
- มีความเข้าใจลึกซึ้งเกี่ยวกับ:
  1. เขตและซอยในกรุงเทพฯ ทั้ง 4 โซน (กทม. ชั้นใน, ชั้นนอก, ฝั่งธนบุรี, และปริมณฑล)
  2. สภาพน้ำท่วมขังรอระบาย จุดลุ่มต่ำ และระบบระบายน้ำของ กทม.
  3. สภาพการเดินทางช่วงฝนตกหนัก: ทางเชื่อม BTS/MRT Skywalk, อาคารที่มีที่จอดรถในร่ม, ความปลอดภัยจากน้ำท่วม (Flood Risk: safe, moderate, risk)
  4. เวลาเปิด-ปิด ความพร้อมของปลั๊กและ Wi-Fi สำหรับการทำงาน (Work-friendly)
  5. เมนูกาแฟสเปเชียลตี้, เกรดมัทฉะ, คราฟต์ค็อกเทล

แนวทางการตอบ:
- แนะนำร้านที่ตรงกับความต้องการและบริบทสภาพอากาศ 2-3 แห่งเสมอ
- ให้ข้อมูลสำคัญอย่างกระชับ: ชื่อร้าน, โซน/ย่าน, จุดเด่นเมนู, สถานะน้ำท่วม/การระบายน้ำ, และเคล็ดลับการเดินทาง (เช่น เดินทางด้วย BTS หรือมีที่จอดรถในร่ม)
- ใช้การจัดรูปแบบ Markdown ที่สวยงาม อ่านง่าย (ตัวหนา, bullet points, emoji ที่เหมาะสม)
`.trim();

/**
 * Format a list of venues into concise context for Typhoon LLM prompt
 */
function formatVenuesForContext(venues: CafeVenue[], maxVenues = 12): string {
  const slice = venues.slice(0, maxVenues);
  return slice
    .map((v, i) => {
      const plugs = v.hasPlugs ? 'มีปลั๊ก' : 'ไม่มีปลั๊ก';
      const wifi = v.hasWifi ? 'มี Wi-Fi' : 'ไม่มี Wi-Fi';
      const parking = v.hasParking ? 'มีที่จอดรถ' : 'ไม่มีที่จอดรถ';
      const riskTh = v.floodRisk === 'safe' ? 'ปลอดภัย' : v.floodRisk === 'moderate' ? 'เฝ้าระวัง' : 'จุดเสี่ยงน้ำท่วม';

      return `${i + 1}. [${v.name}] (${v.nameEn})
   - หมวดหมู่: ${v.category} | โซน: ${v.zone} | ย่าน: ${v.district}
   - เรตติ้ง: ${v.rating}⭐ | ราคา: ${v.priceLevel} | เวลา: ${v.openingHoursText}
   - สถานะน้ำท่วม: ${riskTh} (${v.floodNote})
   - ความสะดวก: ${v.indoorSeating ? 'มีที่นั่งในร่ม' : 'ไม่มี'}, ${parking}, ${plugs}, ${wifi}
   - แท็ก: ${v.tags.join(', ')}`;
    })
    .join('\n\n');
}

/**
 * Ask Typhoon AI Barista & Flood Weather Concierge for personalized recommendations
 */
export async function askTyphoonCafeConcierge(
  userPrompt: string,
  venuesContext: CafeVenue[],
  filterState?: FilterState
): Promise<string> {
  const apiKey = getApiKey();
  const venuesToUse = venuesContext && venuesContext.length > 0 ? venuesContext : BANGKOK_CAFES_DATA;
  const contextSummary = formatVenuesForContext(venuesToUse);

  let filterDetails = '';
  if (filterState) {
    filterDetails = `
ข้อมูลตัวกรองปัจจุบันของผู้ใช้:
- หมวดหมู่ที่เลือก: ${filterState.category}
- โซนที่เลือก: ${filterState.zone}
- วันที่เลือก: ${filterState.selectedDay}
- ช่วงเวลาที่เลือก: ${filterState.selectedTime}
- เฉพาะร้านที่น้ำไม่ท่วม (Flood Safe Only): ${filterState.floodSafeOnly ? 'ใช่' : 'ไม่'}
- เหมาะสำหรับนั่งทำงาน (Work Friendly): ${filterState.workFriendlyOnly ? 'ใช่' : 'ไม่'}
- คำค้นหา: "${filterState.searchQuery || '-'}"
`.trim();
  }

  const promptContent = `
${filterDetails}

รายชื่อร้านคาเฟ่และบาร์ในฐานข้อมูลที่เกี่ยวข้อง:
${contextSummary}

คำถามหรือความต้องการของผู้ใช้:
"${userPrompt}"

กรุณาให้คำแนะนำในฐานะ Typhoon AI Barista & Flood Weather Concierge อย่างละเอียด กระชับ น่าเชื่อถือ และให้ความสำคัญกับความปลอดภัยจากน้ำท่วมและการเดินทางที่สะดวกสบาย
`.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18 seconds timeout

    const requestBody: TyphoonChatRequest = {
      model: TYPHOON_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: promptContent },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch(TYPHOON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[TyphoonAPI] Error HTTP ${response.status}:`, errText);
      return generateFallbackResponse(userPrompt, venuesToUse, filterState);
    }

    const data: TyphoonChatResponse = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (assistantMessage && assistantMessage.trim().length > 0) {
      return assistantMessage.trim();
    }

    return generateFallbackResponse(userPrompt, venuesToUse, filterState);
  } catch (err) {
    console.warn('[TyphoonService] Network or inference failure, activating intelligent fallback:', err);
    return generateFallbackResponse(userPrompt, venuesToUse, filterState);
  }
}

/**
 * Get a fast one-shot Typhoon recommendation based on category, zone, and rain status
 */
export async function getQuickTyphoonRecommendation(
  category: string,
  zone: string,
  isRaining: boolean
): Promise<string> {
  const apiKey = getApiKey();
  const weatherStatus = isRaining
    ? 'ขณะนี้มีฝนตกในเขตกรุงเทพฯ ถนนหลายสายมีน้ำท่วมขังผิวจราจร ต้องการร้านที่น้ำไม่ท่วม เดินทางด้วยรถไฟฟ้าได้ หรือมีที่จอดรถในร่ม'
    : 'สภาพอากาศแจ่มใส การจราจรปกติ';

  const promptContent = `
กรุณาแนะนำคาเฟ่/บาร์ 1-2 ร้านสั้นๆ สำหรับ:
- หมวดหมู่: ${category}
- โซน: ${zone}
- สภาพอากาศปัจจุบัน: ${weatherStatus}

โปรดระบุ: ชื่อร้าน, จุดเด่นของเครื่องดื่ม, และความปลอดภัยจากสภาพน้ำท่วมหรือการเดินทาง (ความยาว 2-3 ประโยค สุภาพและเป็นกันเอง)
`.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const requestBody: TyphoonChatRequest = {
      model: TYPHOON_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: promptContent },
      ],
      temperature: 0.7,
      max_tokens: 350,
    };

    const response = await fetch(TYPHOON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: TyphoonChatResponse = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim().length > 0) {
        return content.trim();
      }
    }
  } catch (err) {
    console.warn('[TyphoonService] Quick recommendation fallback:', err);
  }

  // Graceful fallback
  const safeVenues = BANGKOK_CAFES_DATA.filter((v) => {
    if (zone !== 'all' && v.zone !== zone) return false;
    if (category !== 'all' && v.category !== category) return false;
    if (isRaining && v.floodRisk !== 'safe') return false;
    return true;
  });

  const pick = safeVenues[0] || BANGKOK_CAFES_DATA[0];
  if (isRaining) {
    return `☕ **คำแนะนำช่วงฝนตก**: ขอแนะนำ **${pick.name}** (${pick.district}) จัดอยู่ในระดับ **ปลอดภัย น้ำไม่ท่วม** มีที่นั่งในร่มสะดวกสบาย และเดินทางง่าย เหมาะกับการหลบฝนพร้อมจิบเครื่องดื่มแก้วโปรดครับ`;
  }
  return `✨ **คำแนะนำวันนี้**: สภาพอากาศเป็นใจ แนะนำไปสัมผัสบรรยากาศที่ **${pick.name}** (${pick.district}) โดดเด่นด้วย ${pick.tags.slice(0, 2).join(' และ ')} เปิดบริการถึง ${pick.openingHoursText} ครับ`;
}

/**
 * Intelligent client-side fallback response generator when Typhoon API is offline
 */
function generateFallbackResponse(
  userPrompt: string,
  venues: CafeVenue[],
  filterState?: FilterState
): string {
  // Filter best venues for user
  const safeVenues = venues.filter((v) => {
    if (filterState?.floodSafeOnly && v.floodRisk !== 'safe') return false;
    if (filterState?.workFriendlyOnly && (!v.hasWifi || !v.hasPlugs)) return false;
    return true;
  });

  const candidates = safeVenues.length > 0 ? safeVenues : venues;
  const topRecommendations = candidates.slice(0, 3);

  const listItems = topRecommendations
    .map(
      (v) => `### 📍 **${v.name}** (${v.nameEn})
- **ย่าน/โซน:** ${v.district} (${v.zone.toUpperCase()})
- **เรตติ้ง:** ${v.rating} ⭐ | **ระดับราคา:** ${v.priceLevel}
- **สถานะน้ำท่วม:** ${v.floodRisk === 'safe' ? '🟢 ปลอดภัย น้ำไม่ท่วม' : v.floodRisk === 'moderate' ? '🟡 เฝ้าระวัง' : '🔴 จุดเสี่ยง'}
- **ข้อมูลการระบายน้ำ:** ${v.floodNote}
- **เวลาเปิด-ปิด:** ${v.openingHoursText}
- **สิ่งอำนวยความสะดวก:** ${v.hasParking ? '🚗 มีที่จอดรถ' : '🚶 เดินทางด้วยรถไฟฟ้าสะดวก'}, ${v.hasWifi ? '📶 Free Wi-Fi' : ''} ${v.hasPlugs ? '🔌 มีปลั๊ก' : ''}`
    )
    .join('\n\n');

  return `สวัสดีครับ! **Typhoon AI Barista & Flood Weather Concierge** พร้อมดูแลคุณครับ

จากคำถามของคุณ *" ${userPrompt} "* และข้อมูลสภาพแวดล้อมปัจจุบัน ผมขอแนะนำร้านคุณภาพสูงที่ตอบโจทย์ความปลอดภัยจากน้ำท่วมและความสะดวกสบายในการเดินทาง ดังนี้ครับ:

${listItems}

💡 **คำแนะนำการเดินทาง:**
- ตรวจสอบสถานะเรดาร์ฝนและระดับน้ำท่วมบนแผนที่ก่อนออกเดินทาง
- หากมีฝนตกหนัก แนะนำให้เลือกเดินทางด้วยรถไฟฟ้า BTS/MRT หรือเลือกร้านที่มีทางเดินสกายวอล์กเชื่อมตรงเพื่อความปลอดภัยสูงสุดครับ ☕✨`;
}
