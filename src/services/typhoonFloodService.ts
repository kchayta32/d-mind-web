/**
 * Typhoon AI Bangkok Flood & Traffic Routing Concierge Service
 * Powered by OpenTyphoon AI (typhoon-v2.5-30b-a3b-instruct)
 * Intelligently analyzes Bangkok road waterlogging, vehicle clearances,
 * canal drainage telemetry, and recommends real-time detours.
 */

import { BangkokRoadSegment, BangkokCanalStation } from '@/types/bangkokFlood';
import { BangkokCctvCamera } from '@/data/bangkokCctvData';
import { BANGKOK_ROAD_SEGMENTS, BANGKOK_CANAL_STATIONS } from '@/data/bangkokRoadFloodData';
import { BANGKOK_CCTV_CAMERAS } from '@/data/bangkokCctvData';

const TYPHOON_API_URL = 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_MODEL = 'typhoon-v2.5-30b-a3b-instruct';
const DEFAULT_API_KEY = 'sk-Ag7gTlwbTjlUBmm2DbjInoKo0mZUPZOcRSUnmcBHMU1YMAIU';

export type VehicleProfile = 'sedan' | 'suv' | 'motorcycle' | 'public_transit';

export interface VehicleClearanceInfo {
  type: VehicleProfile;
  nameTh: string;
  nameEn: string;
  safeDepthCm: number;
  warningDepthCm: number;
  criticalDepthCm: number;
  advisoryTh: string;
}

export const VEHICLE_PROFILES: Record<VehicleProfile, VehicleClearanceInfo> = {
  sedan: {
    type: 'sedan',
    nameTh: 'รถเก๋งขนาดเล็ก / Eco-Car / ซีดาน',
    nameEn: 'Small Sedan / Eco-Car',
    safeDepthCm: 10,
    warningDepthCm: 15,
    criticalDepthCm: 20,
    advisoryTh: 'ระดับน้ำเกิน 15 ซม. (ครึ่งล้อ) เสี่ยงน้ำเข้าท่อไอเสียและห้องเครื่องยนต์ แนะนำเลี่ยงเส้นทาง'
  },
  suv: {
    type: 'suv',
    nameTh: 'รถกระบะ / SUV / รถยกสูง',
    nameEn: 'Pickup / SUV / High Clearance',
    safeDepthCm: 20,
    warningDepthCm: 30,
    criticalDepthCm: 40,
    advisoryTh: 'ผ่านได้ถึงระดับ 25-30 ซม. ขับช้าๆ ใช้เกียร์ต่ำ ระวังคลื่นน้ำกระทบบ้านเรือนข้างทาง'
  },
  motorcycle: {
    type: 'motorcycle',
    nameTh: 'รถจักรยานยนต์ / บิ๊กไบค์',
    nameEn: 'Motorcycle / Scooter',
    safeDepthCm: 5,
    warningDepthCm: 10,
    criticalDepthCm: 15,
    advisoryTh: 'ระดับน้ำเกิน 10 ซม. เสี่ยงลื่นไถล ดับกลางน้ำ หรือตกท่อระบายน้ำ ห้ามลงอุโมงค์ทางลอดเด็ดขาด'
  },
  public_transit: {
    type: 'public_transit',
    nameTh: 'ขนส่งสาธารณะ / BTS & MRT Skywalk',
    nameEn: 'Public Transit / Skywalk',
    safeDepthCm: 999,
    warningDepthCm: 999,
    criticalDepthCm: 999,
    advisoryTh: 'แนะนำใช้รถไฟฟ้าสายสีเขียว/น้ำเงิน/เหลือง พร้อมเดินบนทางเดินยกระดับ Skywalk เลี่ยงผิวถนน'
  }
};

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

interface TyphoonChatResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
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
คุณคือ "Typhoon AI Bangkok Flood & Traffic Routing Concierge" ผู้เชี่ยวชาญปัญญาประดิษฐ์ด้านการวางแผนเส้นทางหลบน้ำท่วม การประเมินความปลอดภัยตามประเภทรถยนต์ และข้อมูลการระบายน้ำของกรุงเทพมหานครและปริมณฑล (พัฒนาโดย OpenTyphoon AI)

คุณมีความเชี่ยวชาญและบทบาท:
1. วิเคราะห์ระดับน้ำท่วมขังบนผิวจราจร (Road Flood Depth) จากข้อมูลเซ็นเซอร์ BMA และสถานีสูบน้ำคลองหลัก
2. ประเมินความสามารถในการผ่าน (Passability Clearance) ตามประเภทรถอย่างเคร่งครัดตามหลักความปลอดภัย:
   - รถเก๋ง / Eco-car: ระดับน้ำ > 15 ซม. แจ้ง "เสี่ยงสูง/ห้ามผ่าน"
   - รถกระบะ / SUV ยกสูง: ระดับน้ำ 25-30 ซม. แจ้ง "เฝ้าระวัง ใช้เกียร์ต่ำ" / > 35 ซม. แจ้ง "หลีกเลี่ยง"
   - รถมอเตอร์ไซค์: ระดับน้ำ > 10 ซม. แจ้ง "อันตรายมาก ห้ามลงอุโมงค์ทางลอด"
   - ขนส่งสาธารณะ: แนะนำทางเลือก BTS, MRT, เรือโดยสาร, Skywalk
3. แนะนำเส้นทางเลี่ยง (Alternative Detours):
   - ทางด่วนพิเศษ (ทางพิเศษศรีรัช, เฉลิมมหานคร, ฉลองรัช, ดอนเมืองโทลล์เวย์) ซึ่งปลอดภัยจากน้ำท่วมขังเสมอ
   - ทางคู่ขนานหรือถนนสายรองที่ไม่ได้รับผลกระทบ
4. การตอบคำถาม:
   - ใช้ภาษาไทยที่สุภาพ เข้าใจง่าย รวดเร็ว กระชับ มีสาระสำคัญเด่นชัด
   - ใช้สัญลักษณ์ Emoji และ Markdown (ตัวหนา, รายการ Bullet, ตาราง) ให้อ่านง่ายบนมือถือ
   - สรุปจุดวิกฤตที่ต้องเลี่ยง ระดับน้ำ และทางเลี่ยงอย่างชัดเจนเสมอ
`.trim();

/**
 * Format real-time Bangkok flood context for Typhoon prompt
 */
function buildFloodContext(roads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS, canals: BangkokCanalStation[] = BANGKOK_CANAL_STATIONS): string {
  const criticalRoads = roads.filter(r => r.status === 'critical');
  const warningRoads = roads.filter(r => r.status === 'warning');

  let text = `[ข้อมูลสภาพน้ำท่วม กทม. ล่าสุด]\n`;
  text += `- จำนวนถนนที่ตรวจวัดทั้งหมด: ${roads.length} สาย\n`;
  text += `- ถนนระดับวิกฤต (น้ำท่วมสูง หลีกเลี่ยง): ${criticalRoads.length} จุด\n`;
  criticalRoads.forEach(r => {
    text += `  • ${r.name} (เขต${r.district}): ระดับน้ำ ${r.waterLevelCm} ซม., ท่วม ${r.lanesAffected} เลน, รถเล็กผ่านได้: ${r.passable.smallCar ? 'ได้' : 'ไม่ได้'}\n`;
  });

  text += `- ถนนระดับเฝ้าระวัง (น้ำรอระบาย ขับช้า): ${warningRoads.slice(0, 8).length} จุด\n`;
  warningRoads.slice(0, 8).forEach(r => {
    text += `  • ${r.name} (เขต${r.district}): ระดับน้ำ ${r.waterLevelCm} ซม., ท่วม ${r.lanesAffected} เลน\n`;
  });

  text += `\n[สถานะคลองและการสูบน้ำ BMA DDS]:\n`;
  canals.slice(0, 4).forEach(c => {
    text += `  • ${c.name}: ระดับ ${c.waterLevel} (สถานะ: ${c.status === 'pumping' ? 'กำลังเร่งสูบน้ำ' : 'ปกติ'})\n`;
  });

  return text;
}

/**
 * Ask Typhoon AI Concierge a flood routing question
 */
export async function askTyphoonFloodConcierge(
  userQuestion: string,
  vehicleType: VehicleProfile = 'sedan',
  roadsContext: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS,
  cctvsContext: BangkokCctvCamera[] = BANGKOK_CCTV_CAMERAS
): Promise<string> {
  const vehicleInfo = VEHICLE_PROFILES[vehicleType];
  const floodContext = buildFloodContext(roadsContext);

  const prompt = `
${floodContext}

[ประเภทยานพาหนะของผู้ใช้]:
- ${vehicleInfo.nameTh}
- เกณฑ์ความปลอดภัย: น้ำปลอดภัยไม่เกิน ${vehicleInfo.safeDepthCm} ซม., วิกฤตตั้งแต่ ${vehicleInfo.criticalDepthCm} ซม. ขึ้นไป
- คำแนะนำทางเทคนิค: ${vehicleInfo.advisoryTh}

[คำถามหรือเส้นทางที่ต้องการเดินทาง]:
"${userQuestion}"

กรุณาให้คำตอบและการวิเคราะห์เส้นทางอย่างละเอียด:
1. การประเมินความปลอดภัยของยานพาหนะประเภทนี้ในจุดที่เกี่ยวข้อง
2. จุดเสี่ยงน้ำท่วมที่ห้ามผ่าน (ถ้ามี)
3. เส้นทางเลี่ยงแนะนำ (Safe Detour Route) หรือทางด่วนยกระดับ
4. สรุปคำแนะนำสั้นๆ ทันที
`.trim();

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
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 900
      } as TyphoonChatRequest)
    });

    if (!response.ok) {
      console.warn(`Typhoon API error: ${response.status} ${response.statusText}`);
      return generateRuleBasedFloodAdvice(userQuestion, vehicleType, roadsContext, cctvsContext);
    }

    const data: TyphoonChatResponse = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
      return data.choices[0].message.content.trim();
    }

    return generateRuleBasedFloodAdvice(userQuestion, vehicleType, roadsContext, cctvsContext);
  } catch (error) {
    console.error('Failed to query Typhoon Flood Concierge:', error);
    return generateRuleBasedFloodAdvice(userQuestion, vehicleType, roadsContext, cctvsContext);
  }
}

/**
 * Get instant Typhoon AI analysis for a specific road
 */
export async function getRoadFloodAiAnalysis(
  road: BangkokRoadSegment,
  vehicleType: VehicleProfile = 'sedan'
): Promise<string> {
  const vehicleInfo = VEHICLE_PROFILES[vehicleType];
  const question = `วิเคราะห์ถนน ${road.name} (เขต${road.district}) ระดับน้ำปัจจุบัน ${road.waterLevelCm} ซม. ท่วม ${road.lanesAffected} เลน ${vehicleInfo.nameTh} จะผ่านได้ไหม และควรใช้เส้นทางไหนทดแทน?`;
  return askTyphoonFloodConcierge(question, vehicleType, [road]);
}

/**
 * Intelligent rule-based fallback advice ensuring 100% availability
 */
export function generateRuleBasedFloodAdvice(
  question: string,
  vehicleType: VehicleProfile,
  roads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS,
  cctvs: BangkokCctvCamera[] = BANGKOK_CCTV_CAMERAS
): string {
  const vehicleInfo = VEHICLE_PROFILES[vehicleType];
  const q = question.toLowerCase();

  // Find mentioned roads in query
  const matchedRoads = roads.filter(r => 
    q.includes(r.name.toLowerCase().replace('ถนน', '').split('(')[0].trim()) ||
    q.includes(r.district.toLowerCase())
  );

  const criticalRoads = roads.filter(r => r.status === 'critical');
  const warningRoads = roads.filter(r => r.status === 'warning');

  let output = `### 🌪️ สรุปคำแนะนำเส้นทางหลบน้ำท่วมโดย Typhoon AI\n\n`;
  output += `🚗 **ประเภทยานพาหนะ:** ${vehicleInfo.nameTh}\n`;
  output += `🛡️ **เกณฑ์ปลอดภัย:** ระดับน้ำไม่เกิน **${vehicleInfo.safeDepthCm} ซม.** (${vehicleInfo.advisoryTh})\n\n`;

  if (matchedRoads.length > 0) {
    output += `#### 📍 การประเมินถนนที่คุณสอบถาม:\n`;
    matchedRoads.forEach(r => {
      const isPassable = vehicleType === 'suv' 
        ? r.waterLevelCm <= vehicleInfo.criticalDepthCm 
        : vehicleType === 'sedan' 
        ? r.passable.smallCar 
        : vehicleType === 'motorcycle'
        ? r.passable.motorcycle
        : true;

      output += `- **${r.name} (เขต${r.district}):** ระดับน้ำขัง **${r.waterLevelCm} ซม.** (ท่วม ${r.lanesAffected} เลน)\n`;
      output += `  - สถานะ: ${isPassable ? '🟢 **ผ่านได้แต่ควรระวัง**' : '🔴 **ห้ามผ่าน / เสี่ยงเครื่องยนต์ดับสูง**'}\n`;
      output += `  - จุดเฝ้าระวัง: ${r.description}\n`;
    });
    output += `\n`;
  }

  output += `#### ⚠️ 5 จุดถนนน้ำท่วมวิกฤตที่ต้องเลี่ยงเด็ดขาดขณะนี้:\n`;
  criticalRoads.slice(0, 5).forEach((r, idx) => {
    output += `${idx + 1}. **${r.name} (เขต${r.district})** — น้ำท่วมขัง **${r.waterLevelCm} ซม.** (${!r.passable.smallCar ? 'รถเล็กห้ามผ่าน' : 'ระวังช่องทางซ้าย'})\n`;
  });

  output += `\n#### 🛣️ เส้นทางเลี่ยงแนะนำ (Safe Detour Routes):\n`;
  output += `1. **ใช้โครงข่ายทางด่วนพิเศษยกระดับ:** ทางพิเศษศรีรัช, ทางพิเศษเฉลิมมหานคร และดอนเมืองโทลล์เวย์ ซึ่งอยู่สูงกว่าระดับน้ำท่วมขัง 100%\n`;
  output += `2. **เลี่ยงอุโมงค์ทางลอด:** ทางลอดรัชวิภา, ทางลอดดินแดง, ทางลอดห้าแยกลาดพร้าว ในช่วงฝนตกหนักมีน้ำระบายไม่ทัน\n`;
  output += `3. **การเดินทางระบบราง:** รถไฟฟ้า BTS และ MRT เดินทางได้ตามปกติทุกสถานี แนะนำใช้ทางเดินเชื่อม Skywalk เข้าอาคาร\n\n`;

  output += `💡 *หมายเหตุ: หากพบเหตุน้ำท่วมขังฉุกเฉินหรือต้องการความช่วยเหลือ สามารถโทร **สายด่วน กทม. 1555** หรือ **1669** ได้ตลอด 24 ชั่วโมง*`;

  return output;
}
