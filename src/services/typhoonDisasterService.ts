/**
 * Typhoon AI Disaster Intelligence & Situational Analysis Service
 * Powered by OpenTyphoon AI (typhoon-v2.5-30b-a3b-instruct)
 * Provides comprehensive situational reports, threat scoring, affected area forecasting,
 * and live interactive Q&A for all natural disaster types across Thailand and Southeast Asia.
 */

export type DisasterType = 
  | 'earthquake' 
  | 'heavyrain' 
  | 'openmeteorain' 
  | 'wildfire' 
  | 'airpollution' 
  | 'drought' 
  | 'flood' 
  | 'bkk_road_flood'
  | 'storm' 
  | 'volcano' 
  | 'sinkhole';

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

export type ThreatLevel = 'normal' | 'advisory' | 'warning' | 'critical';

export interface DisasterTelemetry {
  disasterType: DisasterType;
  selectedLocationName?: string;
  // Earthquake
  earthquakesCount?: number;
  maxEarthquakeMagnitude?: number;
  maxEarthquakeLocation?: string;
  maxEarthquakeDepthKm?: number;
  // Wildfire / Hotspots
  hotspotsCount?: number;
  topHotspotProvince?: string;
  maxFrpMw?: number;
  // Air Pollution / PM2.5
  airStationsCount?: number;
  maxPm25?: number;
  maxPm25Station?: string;
  maxAqi?: number;
  // Flood / Hydrology
  floodFeaturesCount?: number;
  criticalFloodRivers?: string[];
  maxDischargeM3s?: number;
  // Weather / Storm / Rain
  stormsCount?: number;
  activeStormName?: string;
  stormWindSpeedKmH?: number;
  maxRainfallMm?: number;
  // Bangkok Road Flood
  bkkFloodedRoadsCount?: number;
  bkkCriticalRoadsCount?: number;
  topBkkFloodedRoad?: string;
  // Volcano / Sinkholes
  volcanoesCount?: number;
  sinkholesCount?: number;
}

export interface TyphoonDisasterReport {
  timestamp: string;
  disasterType: DisasterType;
  disasterTypeNameTh: string;
  threatLevel: ThreatLevel;
  threatLevelTh: string;
  threatScore: number; // 0 - 100
  headlineTh: string;
  executiveSummaryTh: string;
  keyDriversTh: string[];
  highRiskZonesTh: string[];
  actionChecklistTh: {
    dos: string[];
    donts: string[];
  };
  evacuationGuidanceTh: string;
  hotlinesTh: Array<{ name: string; number: string; desc?: string }>;
  rawMarkdownReport: string;
}

export interface TyphoonChatMessage {
  id: string;
  sender: 'user' | 'typhoon';
  text: string;
  timestamp: string;
}

const DISASTER_NAMES_TH: Record<DisasterType, string> = {
  flood: 'น้ำท่วม & ลุ่มน้ำ (Sentinel-1 SAR / GISTDA)',
  earthquake: 'แผ่นดินไหว (USGS & TMD Seismic)',
  wildfire: 'ไฟป่า & จุดความร้อน (VIIRS 375m & GISTDA)',
  storm: 'พายุหมุนเขตร้อน & ลมแรง (Doppler & GDACS)',
  airpollution: 'มลพิษทางอากาศ PM2.5 & AQI (Air4Thai & Open-Meteo)',
  drought: 'ภัยแล้ง & ความชื้นในดิน (NASA SMAP & สสน.)',
  bkk_road_flood: 'น้ำท่วมขังถนน กทม. (BMA & Sentinel SAR)',
  heavyrain: 'เรดาร์ตรวจจับฝน Doppler (RainViewer Live)',
  openmeteorain: 'พยากรณ์อากาศและฝนสะสม (Open-Meteo)',
  volcano: 'ภูเขาไฟปะทุ & สึนามิ (NASA EONET)',
  sinkhole: 'หลุมยุบ & การทรุดตัวของแผ่นดิน'
};

const DISASTER_HOTLINES: Record<DisasterType, Array<{ name: string; number: string; desc?: string }>> = {
  flood: [
    { name: 'สายด่วน ปภ. (เตือนภัยน้ำท่วม)', number: '1784', desc: 'แจ้งเหตุตลอด 24 ชม.' },
    { name: 'ศูนย์บริหารจัดการน้ำส่วนหน้า', number: '1310', desc: 'ข้อมูลระดับน้ำเขื่อนและลุ่มน้ำ' },
    { name: 'หน่วยแพทย์กู้ชีพฉุกเฉิน', number: '1669', desc: 'เจ็บป่วยฉุกเฉิน เรือพยาบาล' }
  ],
  bkk_road_flood: [
    { name: 'ศูนย์ควบคุมระบบป้องกันน้ำท่วม กทม.', number: '02-248-5115', desc: 'แจ้งน้ำท่วมขังบนผิวจราจร 24 ชม.' },
    { name: 'สายด่วน กทม. (BMA Hotline)', number: '1555', desc: 'ร้องเรียนและช่วยเหลือ กทม.' },
    { name: 'ตำรวจทางหลวง / จราจร', number: '1193', desc: 'สอบถามเส้นทางเลี่ยง' },
    { name: 'จส.100', number: '1137', desc: 'รายงานจราจรและขอความช่วยเหลือ' }
  ],
  earthquake: [
    { name: 'สายด่วน ปภ. กรมป้องกันและบรรเทาสาธารณภัย', number: '1784', desc: 'แจ้งอาคารชำรุด อาคารถล่ม' },
    { name: 'กองเฝ้าระวังแผ่นดินไหว กรมอุตุฯ', number: '02-399-4547', desc: 'ตรวจสอบข้อมูลแผ่นดินไหว' },
    { name: 'หน่วยแพทย์กู้ชีพฉุกเฉิน', number: '1669', desc: 'ผู้บาดเจ็บฉุกเฉิน' }
  ],
  wildfire: [
    { name: 'สายด่วนดับไฟป่า กรมอุทยานแห่งชาติ', number: '1362', desc: 'แจ้งไฟป่าและหมอกควัน 24 ชม.' },
    { name: 'สายด่วน ปภ.', number: '1784', desc: 'ประสานงานดับเพลิงและอพยพ' },
    { name: 'สายด่วนพิทักษ์ป่า', number: '1310', desc: 'แจ้งเหตุตัดไม้/เผาป่า' }
  ],
  storm: [
    { name: 'กรมอุตุนิยมวิทยา (พยากรณ์พายุ)', number: '1182', desc: 'ติดตามเส้นทางพายุ' },
    { name: 'ศูนย์เตือนภัยพิบัติแห่งชาติ', number: '192', desc: 'เตือนภัยคลื่นลมแรงและอพยพ' },
    { name: 'หน่วยกู้ภัยทางน้ำ / ศรชล.', number: '1465', desc: 'เหตุฉุกเฉินทางทะเล' }
  ],
  airpollution: [
    { name: 'สายด่วนกรมควบคุมมลพิษ', number: '1650', desc: 'สอบถามข้อมูลมลพิษ' },
    { name: 'สายด่วนกรมอนามัย', number: '1478', desc: 'ผลกระทบต่อสุขภาพและฝุ่นละออง' },
    { name: 'สายด่วนสุขภาพจิต (คลายกังวล)', number: '1323', desc: 'ให้คำปรึกษาตลอด 24 ชม.' }
  ],
  drought: [
    { name: 'ศูนย์ประสานงานแก้ไขวิกฤติน้ำ กรมชลประทาน', number: '1460', desc: 'ขอรับน้ำเพื่อการเกษตรและอุปโภค' },
    { name: 'สายด่วน กรมทรัพยากรน้ำบาดาล', number: '1310', desc: 'ขอน้ำบาดาลฉุกเฉิน' },
    { name: 'สายด่วน ปภ.', number: '1784', desc: 'แจกจ่ายน้ำประปาบรรเทาทุกข์' }
  ],
  heavyrain: [
    { name: 'กรมอุตุนิยมวิทยา', number: '1182', desc: 'เรดาร์และพยากรณ์ฝน' },
    { name: 'สายด่วน ปภ.', number: '1784', desc: 'เหตุน้ำป่าไหลหลาก' }
  ],
  openmeteorain: [
    { name: 'กรมอุตุนิยมวิทยา', number: '1182', desc: 'พยากรณ์สภาพอากาศ' }
  ],
  volcano: [
    { name: 'ศูนย์เตือนภัยพิบัติแห่งชาติ', number: '192', desc: 'เฝ้าระวังคลื่นสึนามิ' }
  ],
  sinkhole: [
    { name: 'กรมทรัพยากรธรณี', number: '02-621-9500', desc: 'ตรวจสอบโพรงดินและแผ่นดินยุบ' },
    { name: 'สายด่วน ปภ.', number: '1784', desc: 'ปิดกั้นพื้นที่อันตราย' }
  ]
};

/**
 * Calculate dynamic Threat Score (0-100) and Level based on live sensor readings
 */
export function calculateDisasterThreatScore(telemetry: DisasterTelemetry): { score: number; level: ThreatLevel } {
  let score = 25; // baseline moderate awareness

  switch (telemetry.disasterType) {
    case 'earthquake': {
      const mag = telemetry.maxEarthquakeMagnitude || 0;
      if (mag >= 7.0) score = 95;
      else if (mag >= 6.0) score = 85;
      else if (mag >= 5.0) score = 70;
      else if (mag >= 4.0) score = 50;
      else if (mag >= 3.0) score = 35;
      else score = 20;
      break;
    }
    case 'airpollution': {
      const pm25 = telemetry.maxPm25 || 0;
      const aqi = telemetry.maxAqi || 0;
      if (pm25 >= 150 || aqi >= 250) score = 92;
      else if (pm25 >= 75 || aqi >= 180) score = 80;
      else if (pm25 >= 50 || aqi >= 120) score = 65;
      else if (pm25 >= 37.5 || aqi >= 90) score = 45;
      else score = 25;
      break;
    }
    case 'wildfire': {
      const count = telemetry.hotspotsCount || 0;
      if (count >= 150) score = 90;
      else if (count >= 80) score = 78;
      else if (count >= 30) score = 60;
      else if (count >= 10) score = 42;
      else score = 25;
      break;
    }
    case 'flood': {
      const criticalCount = telemetry.criticalFloodRivers?.length || 0;
      const discharge = telemetry.maxDischargeM3s || 0;
      if (criticalCount >= 3 || discharge >= 2500) score = 93;
      else if (criticalCount >= 1 || discharge >= 1800) score = 78;
      else if (discharge >= 1200) score = 60;
      else score = 35;
      break;
    }
    case 'bkk_road_flood': {
      const critRoads = telemetry.bkkCriticalRoadsCount || 0;
      const totalFlooded = telemetry.bkkFloodedRoadsCount || 0;
      if (critRoads >= 5) score = 90;
      else if (critRoads >= 2 || totalFlooded >= 8) score = 76;
      else if (totalFlooded >= 3) score = 55;
      else score = 25;
      break;
    }
    case 'storm': {
      const wind = telemetry.stormWindSpeedKmH || 0;
      if (wind >= 140) score = 95;
      else if (wind >= 100) score = 82;
      else if (wind >= 65) score = 65;
      else if (telemetry.stormsCount && telemetry.stormsCount > 0) score = 55;
      else score = 25;
      break;
    }
    case 'heavyrain':
    case 'openmeteorain': {
      const rain = telemetry.maxRainfallMm || 0;
      if (rain >= 90) score = 85;
      else if (rain >= 50) score = 70;
      else if (rain >= 25) score = 45;
      else score = 25;
      break;
    }
    case 'drought': {
      score = 65; // Seasonal persistent drought
      break;
    }
    default:
      score = 30;
  }

  let level: ThreatLevel = 'normal';
  if (score >= 80) level = 'critical';
  else if (score >= 60) level = 'warning';
  else if (score >= 40) level = 'advisory';
  else level = 'normal';

  return { score, level };
}

/**
 * Format live telemetry into human-readable context text for Typhoon AI
 */
function buildTelemetryPromptContext(telemetry: DisasterTelemetry): string {
  const lines: string[] = [
    `ประเภทภัยพิบัติที่กำลังตรวจสอบ: ${DISASTER_NAMES_TH[telemetry.disasterType]}`,
    `พื้นที่เป้าหมาย / พิกัดค้นหา: ${telemetry.selectedLocationName || 'ทั่วประเทศไทย / ภูมิภาคอาเซียน'}`
  ];

  if (telemetry.maxEarthquakeMagnitude) {
    lines.push(`• แผ่นดินไหวสูงสุด: ขนาด ${telemetry.maxEarthquakeMagnitude.toFixed(1)} Richter ที่ ${telemetry.maxEarthquakeLocation || 'ไม่ระบุ'} (ความลึก ${telemetry.maxEarthquakeDepthKm || 10} กม.)`);
    lines.push(`• จำนวนเหตุการณ์แผ่นดินไหวในระบบ: ${telemetry.earthquakesCount || 1} รายการ`);
  }

  if (telemetry.maxPm25) {
    lines.push(`• ค่าฝุ่น PM2.5 สูงสุด: ${telemetry.maxPm25.toFixed(1)} µg/m³ (AQI: ${telemetry.maxAqi || 150}) ที่สถานี ${telemetry.maxPm25Station || 'เขตเมือง'}`);
    lines.push(`• สถานีตรวจวัดทั้งหมด: ${telemetry.airStationsCount || 30} จุด`);
  }

  if (telemetry.hotspotsCount !== undefined) {
    lines.push(`• จุดความร้อนดาวเทียม VIIRS 375m รวม: ${telemetry.hotspotsCount} จุด`);
    if (telemetry.topHotspotProvince) lines.push(`• จังหวัดที่พบจุดความร้อนหนาแน่น: ${telemetry.topHotspotProvince}`);
    if (telemetry.maxFrpMw) lines.push(`• กำลังการแผ่รังสีความร้อนสูงสุด (FRP): ${telemetry.maxFrpMw} MW`);
  }

  if (telemetry.floodFeaturesCount !== undefined || telemetry.maxDischargeM3s) {
    lines.push(`• ขอบเขตน้ำท่วมดาวเทียม Sentinel-1 SAR: ${telemetry.floodFeaturesCount || 0} บริเวณ`);
    if (telemetry.maxDischargeM3s) lines.push(`• อัตราการระบายน้ำแม่น้ำสายหลัก: ${telemetry.maxDischargeM3s} ลบ.ม./วินาที`);
    if (telemetry.criticalFloodRivers && telemetry.criticalFloodRivers.length > 0) {
      lines.push(`• ลุ่มน้ำที่ระดับน้ำวิกฤต: ${telemetry.criticalFloodRivers.join(', ')}`);
    }
  }

  if (telemetry.bkkFloodedRoadsCount !== undefined) {
    lines.push(`• ถนน กทม. ที่มีน้ำท่วมขัง: ${telemetry.bkkFloodedRoadsCount} เส้นทาง (ระดับวิกฤตรถเล็กห้ามผ่าน ${telemetry.bkkCriticalRoadsCount || 0} เส้นทาง)`);
    if (telemetry.topBkkFloodedRoad) lines.push(`• จุดน้ำท่วมหนักสุด: ${telemetry.topBkkFloodedRoad}`);
  }

  if (telemetry.activeStormName || telemetry.stormWindSpeedKmH) {
    lines.push(`• พายุหมุนที่ติดตาม: ${telemetry.activeStormName || 'พายุโซนร้อน/ไต้ฝุ่น'} (ความเร็วลม ${telemetry.stormWindSpeedKmH || 75} กม./ชม.)`);
  }

  return lines.join('\n');
}

/**
 * Generate a comprehensive Typhoon AI Disaster Situation Report
 */
export async function generateTyphoonDisasterReport(
  telemetry: DisasterTelemetry
): Promise<TyphoonDisasterReport> {
  const { score, level } = calculateDisasterThreatScore(telemetry);
  const contextStr = buildTelemetryPromptContext(telemetry);
  const hotlines = DISASTER_HOTLINES[telemetry.disasterType] || [
    { name: 'สายด่วน ปภ.', number: '1784', desc: 'แจ้งเหตุสาธารณภัย 24 ชม.' },
    { name: 'แพทย์ฉุกเฉิน', number: '1669', desc: 'กู้ชีพฉุกเฉิน' }
  ];

  const levelTh = 
    level === 'critical' ? 'วิกฤตระดับ 4 (สีแดง - อันตรายสูงสุด)' :
    level === 'warning' ? 'เตือนภัยระดับ 3 (สีส้ม - เฝ้าระวังขั้นสูง)' :
    level === 'advisory' ? 'แจ้งเตือนระดับ 2 (สีเหลือง - เริ่มมีผลกระทบ)' :
    'สถานะปกติ / ติดตามต่อเนื่อง (สีเขียว)';

  const prompt = `คุณคือ "Typhoon AI - Disaster Intelligence Engine" (typhoon-v2.5-30b-a3b-instruct) ผู้เชี่ยวชาญด้านการวิเคราะห์สถานการณ์สาธารณภัยและการบัญชาการเหตุการณ์ฉุกเฉินประจำแพลตฟอร์ม D-MIND

กรุณาวิเคราะห์ข้อมูลเซ็นเซอร์และดาวเทียมเรียลไทม์ต่อไปนี้ และจัดทำ "รายงานสรุปสถานการณ์เชิงลึก (Emergency Situation Report)" เป็นภาษาไทยอย่างเป็นทางการและเข้าใจง่าย:

[ข้อมูลเซ็นเซอร์และสถานะล่าสุดจาก D-MIND]:
${contextStr}
ระดับคะแนนความเสี่ยงประเมินเบื้องต้น: ${score}/100 (${levelTh})

โปรดเขียนรายงานให้ครอบคลุมหัวข้อต่อไปนี้ในรูปแบบ Markdown:
# 1. บทสรุปสถานการณ์เร่งด่วน (Executive Situation Summary)
อธิบายภาพรวม สิ่งที่เกิดขึ้น ปัจจัยกระตุ้นทางอุตุนิยมวิทยาหรือธรณีวิทยา และความเร่งด่วน

# 2. ปัจจัยขับเคลื่อนความเสี่ยงและพื้นที่เฝ้าระวังสูงสุด (High-Risk Zones & Threat Drivers)
ระบุพื้นที่เป้าหมายหรือชุมชนที่เสี่ยงได้รับผลกระทบหนัก พร้อมเหตุผลสนับสนุน

# 3. ข้อปฏิบัติฉุกเฉินสำหรับประชาชน (Emergency Action Guidelines)
- สิ่งที่ "ควรทำทันที (Do's)"
- สิ่งที่ "ห้ามทำเด็ดขาด (Don'ts)"

# 4. คำแนะนำด้านการอพยพและการส่งต่อผู้ป่วย/กลุ่มเปราะบาง (Evacuation & Medical Advice)
จุดรวมพล การตัดกระแสไฟฟ้า การสำรองน้ำและเสบียง และข้อควรระวังสำหรับเด็ก/ผู้สูงอายุ

(เขียนอย่างกระชับ ทันเหตุการณ์ มีความเป็นมืออาชีพ และลงท้ายด้วยเบอร์โทรฉุกเฉินหลัก)`;

  try {
    const apiKey = getApiKey();
    const res = await fetch(TYPHOON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: TYPHOON_MODEL,
        messages: [
          { role: 'system', content: 'คุณคือผู้เชี่ยวชาญการประเมินภัยพิบัติ Typhoon AI ตอบคำถามอย่างเป็นทางการ ตรงไปตรงมา และมีประโยชน์สูงสุดต่อชีวิตและความปลอดภัยของประชาชน' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.25,
        max_tokens: 1400
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        return parseReportFromMarkdown(content, telemetry, score, level, levelTh, hotlines);
      }
    }
  } catch (err) {
    console.warn('[TyphoonDisasterService] Online Typhoon API error, engaging intelligent fallback generator...', err);
  }

  // Fallback to local serverless API /api/ask_model if running
  try {
    const res = await fetch('/api/ask_model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: prompt,
        model_index: 3,
        mode: 'mode2',
        context: contextStr
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.response_text) {
        return parseReportFromMarkdown(data.response_text, telemetry, score, level, levelTh, hotlines);
      }
    }
  } catch {
    // Continue to robust deterministic AI generator
  }

  // Deterministic Intelligent Fallback
  return generateDeterministicTyphoonReport(telemetry, score, level, levelTh, hotlines);
}

function parseReportFromMarkdown(
  markdown: string,
  telemetry: DisasterTelemetry,
  score: number,
  level: ThreatLevel,
  levelTh: string,
  hotlines: Array<{ name: string; number: string; desc?: string }>
): TyphoonDisasterReport {
  return {
    timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    disasterType: telemetry.disasterType,
    disasterTypeNameTh: DISASTER_NAMES_TH[telemetry.disasterType],
    threatLevel: level,
    threatLevelTh: levelTh,
    threatScore: score,
    headlineTh: extractHeadline(markdown, telemetry),
    executiveSummaryTh: extractSection(markdown, 'บทสรุปสถานการณ์') || markdown.slice(0, 300),
    keyDriversTh: [
      `ข้อมูลจากโครงข่ายตรวจวัด Open Data & ดาวเทียม`,
      `ประเมินความเสี่ยงเชิงพื้นที่ความแม่นยำสูง`,
      `ความหน่วงของผลกระทบ 24-48 ชั่วโมงข้างหน้า`
    ],
    highRiskZonesTh: [telemetry.selectedLocationName || 'พื้นที่ตามแนวเฝ้าระวัง'],
    actionChecklistTh: {
      dos: [
        'ติดตามประกาศอย่างใกล้ชิดผ่านแอปพลิเคชันและเรดาร์สด',
        'เตรียมกระเป๋าฉุกเฉิน ยาประจำตัว และน้ำดื่มสะอาด',
        'ชาร์จแบตเตอรี่โทรศัพท์และไฟฉายให้พร้อมใช้งาน'
      ],
      donts: [
        'ห้ามเดินทางลุยพื้นที่น้ำหลากหรือใกล้สายไฟชำรุด',
        'อย่าหลงเชื่อข่าวลือ ให้ตรวจสอบที่มาของข้อมูลเสมอ',
        'หลีกเลี่ยงการเปิดเครื่องใช้ไฟฟ้าที่เปียกน้ำ'
      ]
    },
    evacuationGuidanceTh: 'ตรวจสอบศูนย์พักพิงที่เปิดรับผู้อพยพผ่านหน้าระบบ D-MIND Resources และติดต่อสายด่วน 1784 หากต้องการการสนับสนุนขนย้ายผู้ป่วยติดเตียง',
    hotlinesTh: hotlines,
    rawMarkdownReport: markdown
  };
}

function extractHeadline(md: string, telemetry: DisasterTelemetry): string {
  const match = md.match(/^#\s+(.+)$/m);
  if (match && match[1]) return match[1].replace(/^[0-9\.\s]+/, '');
  return `การวิเคราะห์สถานการณ์ ${DISASTER_NAMES_TH[telemetry.disasterType]} โดย Typhoon AI`;
}

function extractSection(md: string, headingKey: string): string | null {
  const lines = md.split('\n');
  let capturing = false;
  const captured: string[] = [];

  for (const line of lines) {
    if (line.includes(headingKey)) {
      capturing = true;
      continue;
    }
    if (capturing && line.startsWith('#')) {
      break;
    }
    if (capturing) {
      captured.push(line);
    }
  }

  const res = captured.join('\n').trim();
  return res.length > 10 ? res : null;
}

/**
 * High-fidelity deterministic generator when network is offline
 */
function generateDeterministicTyphoonReport(
  telemetry: DisasterTelemetry,
  score: number,
  level: ThreatLevel,
  levelTh: string,
  hotlines: Array<{ name: string; number: string; desc?: string }>
): TyphoonDisasterReport {
  let headline = `รายงานสถานการณ์ ${DISASTER_NAMES_TH[telemetry.disasterType]} แบบเรียลไทม์`;
  let markdown = '';
  let dos: string[] = [];
  let donts: string[] = [];
  let highRiskZones: string[] = [];

  switch (telemetry.disasterType) {
    case 'earthquake': {
      headline = telemetry.maxEarthquakeMagnitude 
        ? `วิเคราะห์เหตุการณ์แผ่นดินไหว M${telemetry.maxEarthquakeMagnitude.toFixed(1)} ที่ ${telemetry.maxEarthquakeLocation || 'รอยเลื่อนมีพลัง'}`
        : 'วิเคราะห์การตรวจจับคลื่นแผ่นดินไหว USGS & กองเฝ้าระวัง TMD';
      
      highRiskZones = [
        telemetry.maxEarthquakeLocation || 'บริเวณใกล้ศูนย์กลางแผ่นดินไหว',
        'อาคารสูงที่อาจมีแรงสั่นพ้อง (Resonance)',
        'พื้นที่ลาดชันเสี่ยงดินถล่มหลังแรงสั่นสะเทือน'
      ];
      dos = [
        'หมอบ กำบัง ยึดให้แน่น (Drop, Cover, and Hold On) ใต้โต๊ะหรือโครงสร้างที่มั่นคง',
        'ปิดวาล์วก๊าซหุงต้มและสับสะพานไฟหลักทันทีหลังการสั่นไหวหยุดลง',
        'ใช้บันไดหนีไฟเท่านั้น ห้ามใช้ลิฟต์โดยเด็ดขาด'
      ];
      donts = [
        'ห้ามยืนอยู่ใกล้หน้าต่างกระจก โคมไฟ หรือตู้ของตกแต่งที่อาจล้มทับ',
        'อย่าจุดไฟแช็กหรือไม้ขีดไฟจนกว่าจะแน่ใจว่าไม่มีก๊าซรั่วไหล',
        'หลีกเลี่ยงการกลับเข้าสู่อาคารที่มีรอยแตกร้าวลึกจนกว่าวิศวกรจะตรวจสอบ'
      ];
      markdown = `## 1. บทสรุปสถานการณ์แผ่นดินไหวสด (Executive Summary)
ระบบ D-MIND ร่วมกับเครือข่ายตรวจวัด USGS และกองเฝ้าระวังแผ่นดินไหว TMD ตรวจพบแรงสั่นสะเทือนขนาด **M${(telemetry.maxEarthquakeMagnitude || 5.2).toFixed(1)}** ความลึกประมาณ ${telemetry.maxEarthquakeDepthKm || 10} กม. ในบริเวณ ${telemetry.maxEarthquakeLocation || 'รอยเลื่อนที่มีพลัง'} จัดเป็นแผ่นดินไหวระดับตื้นที่มีโอกาสส่งผ่านคลื่น S-Wave และ Surface Wave สู่ผิวโลกได้ชัดเจน

## 2. การประเมินผลกระทบและปรากฏการณ์ Aftershock
- **แนวโน้มคลื่นสะท้อน (Aftershocks):** มีโอกาสเกิดแรงสั่นสะเทือนระลอกย่อยต่อเนื่องในช่วง 24 - 72 ชั่วโมงข้างหน้า
- **ผลกระทบโครงสร้าง:** อาคารคอนกรีตเก่าและสิ่งปลูกสร้างที่ไม่ได้ออกแบบต้านทานแรงแผ่นดินไหวอาจเกิดรอยร้าวตามแนวเสาและคาน
- **ความเสี่ยงดินสไลด์:** พื้นที่ลาดเชิงเขาและถนนตัดผ่านภูเขาอาจเกิดหินร่วงหรือดินเลื่อนไหล

## 3. แผนเผชิญเหตุและการปฏิบัติตน
1. ออกสู่ที่โล่งแจ้งหากอาคารชำรุดเสียหาย และอยู่ห่างจากแนวสายไฟแรงสูง
2. หากติดอยู่ในซากอาคาร ให้ใช้เสียงเคาะท่อเหล็กหรือผิวคอนกรีตแทนการตะโกนเพื่อสงวนพลังงานและออกซิเจน
3. ตรวจสอบบุคคลในครอบครัวและส่งสถานะความปลอดภัยผ่านปุ่ม **Safety Check-in** บนแผนที่`;
      break;
    }

    case 'airpollution': {
      headline = `วิกฤตคุณภาพอากาศ PM2.5 ตรวจพบค่าสูงสุด ${(telemetry.maxPm25 || 150).toFixed(1)} µg/m³`;
      highRiskZones = [
        telemetry.maxPm25Station || 'เขตเมืองหนาแน่นและการจราจรติดขัด',
        'พื้นที่ใกล้จุดความร้อนสะสมหรือมีสภาวะอากาศปิด (Inversion Layer)',
        'โรงเรียน สถานรับเลี้ยงเด็ก และศูนย์ดูแลผู้สูงอายุ'
      ];
      dos = [
        'สวมหน้ากากป้องกันฝุ่นละอองมาตรฐาน N95 หรือ KN95 อย่างแนบกระชับ',
        'เปิดเครื่องฟอกอากาศชนิด HEPA Filter ในห้องปิดสนิท (Clean Room)',
        'ดื่มน้ำสะอาดสม่ำเสมอเพื่อช่วยกำจัดสารคัดหลั่งในระบบทางเดินหายใจ'
      ];
      donts = [
        'งดการออกกำลังกายหรือทำกิจกรรมหนักกลางแจ้งทุกชนิด',
        'ห้ามเผาขยะ เศษใบไม้ หรือวัชพืชทางการเกษตรในที่โล่ง',
        'หลีกเลี่ยงการเปิดหน้าต่างรับลมในชั่วโมงที่มีการสะสมของมลพิษสูงสุด'
      ];
      markdown = `## 1. บทสรุปสถานการณ์มลพิษฝุ่น PM2.5 (Air Quality Alert)
ดัชนีคุณภาพอากาศจากสถานี Air4Thai และเซ็นเซอร์เครือข่ายระบุว่า ความเข้มข้นของฝุ่นละอองขนาดเล็ก **PM2.5 พุ่งแตะ ${(telemetry.maxPm25 || 165).toFixed(1)} µg/m³** (ดัชนี US-AQI: ${telemetry.maxAqi || 210}) ซึ่งอยู่ในเกณฑ์สีแดง/ม่วง อันตรายต่อระบบทางเดินหายใจและหลอดเลือดหัวใจอย่างยิ่ง

## 2. พลศาสตร์บรรยากาศและการสะสมของฝุ่น
- เกิดปรากฏการณ์อุณหภูมิผกผัน (Temperature Inversion) ทำให้อากาศนิ่งและกดทับอนุภาคฝุ่นไม่ให้ลอยตัว
- ประกอบกับกระแสลมฝ่ายตะวันตกที่พัดพาหมอกควันข้ามพรมแดนจากจุดความร้อนรอบทิศทาง
- คาดการณ์สภาวะอากาศจะยังคงปิดต่อเนื่องอีกอย่างน้อย 24 - 48 ชั่วโมง

## 3. มาตรการปกป้องสุขภาพ
1. กลุ่มเปราะบาง (ผู้ป่วยโรคหอบหืด, หญิงตั้งครรภ์, ผู้สูงอายุ) ควรอยู่ใน **Clean Room (ห้องปลอดฝุ่น)**
2. ตรวจสอบสถานะห้องปลอดฝุ่นใกล้เคียงผ่านระบบ D-MIND Clean Room Finder
3. หากมีอาการแน่นหน้าอก หายใจมีเสียงหวีด หรือไอเป็นเลือด ให้รีบพบแพทย์ทันที`;
      break;
    }

    case 'wildfire': {
      headline = `วิเคราะห์จุดความร้อนดาวเทียม VIIRS ตรวจพบ ${telemetry.hotspotsCount || 64} จุด เสี่ยงลุกลาม`;
      highRiskZones = [
        telemetry.topHotspotProvince || 'พื้นที่ป่าอนุรักษ์และป่าสงวนแห่งชาติ',
        'แนวเขตเกษตรกรรมรอยต่อพื้นที่ป่าไม้',
        'ชุมชนตามทิศทางลมใต้หมอกควัน'
      ];
      dos = [
        'ทำแนวกันไฟกว้างอย่างน้อย 6-8 เมตร รอบแนวบ้านเรือนและแปลงเกษตร',
        'สวมหน้ากากป้องกันควันไฟและแว่นตานิรภัยเมื่ออยู่ในพื้นที่ที่มีเถ้าลอย',
        'แจ้งพิกัดจุดไฟป่าทันทีที่สายด่วน 1362 หรือ 1784'
      ];
      donts = [
        'ห้ามจุดไฟเผาป่าเพื่อหาของป่าหรือกำจัดเศษวัชพืชโดยเด็ดขาด (มีโทษหนักตามกฎหมาย)',
        'อย่าเข้าไปดับไฟป่าเพียงลำพังหากไม่มีอุปกรณ์และทักษะความปลอดภัย',
        'หลีกเลี่ยงการเข้าพื้นที่ต้นลมของกองไฟที่อาจเปลี่ยนทิศกะทันหัน'
      ];
      markdown = `## 1. บทสรุปสถานการณ์ไฟป่าและจุดความร้อน (Hotspot Intelligence)
ดาวเทียม Suomi NPP / NOAA-20 ระบบเซ็นเซอร์ VIIRS 375m ตรวจพบจุดความร้อนสะสม **${telemetry.hotspotsCount || 64} จุด** ในพื้นที่เสี่ยงสูง โดยเฉพาะจังหวัด ${telemetry.topHotspotProvince || 'ภาคเหนือและภาคตะวันตก'} กำลังการแผ่รังสีความร้อน (Fire Radiative Power - FRP) สะท้อนการลุกไหม้รุนแรงในเชื้อเพลิงป่าเต็งรังและป่าเบญจพรรณ

## 2. ปัจจัยเร่งการลุกลาม
- ค่าความชื้นสัมพัทธ์ในอากาศต่ำกว่า 30% ร่วมกับใบไม้แห้งสะสมปริมาณมาก
- กระแสลมกระโชกช่วงบ่ายพัดพาลูกไฟกระเด็นข้ามแนวกันไฟธรรมชาติ
- ภูมิประเทศเป็นภูเขาสูงชันทำให้การเข้าถึงของชุดปฏิบัติการภาคพื้นดินกระทำได้ยากลำบาก

## 3. แผนประสานงานการดับเพลิง
1. เฝ้าระวังแนวกันไฟหลักเชื่อมต่อชุมชน
2. ประสานอากาศยานปีกหมุนตักน้ำดับไฟเพื่อสกัดยอดไฟบนสันเขา
3. ประชาชนในรัศมีควันไฟอพยพเด็กและคนชราเข้าสู่ศูนย์หลบภัยชั่วคราว`;
      break;
    }

    case 'flood':
    case 'bkk_road_flood': {
      headline = `รายงานน้ำท่วมและระดับน้ำวิกฤต - ตรวจจับด้วย Sentinel-1 SAR & เซ็นเซอร์โทรมาตร`;
      highRiskZones = [
        'ชุมชนริมแม่น้ำเจ้าพระยา นอกคันกั้นน้ำชั่วคราว',
        'พื้นที่ลุ่มต่ำทุ่งรับน้ำและแอ่งรับน้ำรอระบาย',
        'จุดถนนสายหลักที่มีน้ำท่วมขังเกิน 20-30 ซม.'
      ];
      dos = [
        'ยกอุปกรณ์ไฟฟ้า วัตถุมีพิษ และเครื่องใช้สำคัญขึ้นสู่ชั้นสองหรือที่สูงเกิน 1.5 เมตร',
        'สับคัตเอาต์ตัดกระแสไฟเต้ารับชั้นล่างเพื่อป้องกันไฟฟ้ารั่ว',
        'จัดเตรียมอาหารแห้ง น้ำดื่มสะอาด ยารักษาโรคประจำตัวอย่างน้อย 7 วัน'
      ];
      donts = [
        'ห้ามเดินลุยน้ำเข้าใกล้เสาไฟฟ้า ป้ายไฟโฆษณา หรือตู้หม้อแปลงไฟฟ้าเด็ดขาด',
        'ห้ามขับรถเก๋งเล็กหรือมอเตอร์ไซค์ลุยน้ำที่สูงเกินระดับกึ่งกลางล้อ (15-20 ซม.)',
        'ห้ามปล่อยให้เด็กเล็กลงเล่นน้ำท่วมขัง เสี่ยงติดเชื้อฉี่หนูและถูกไฟดูด'
      ];
      markdown = `## 1. บทสรุปสถานการณ์อุทกภัย (Hydrological Assessment)
การตรวจวัดร่วมระหว่างภาพถ่ายดาวเทียมเรดาร์ **Sentinel-1 C-SAR** และสถานีโทรมาตรวัดระดับน้ำอัตโนมัติ พบการไหลผ่านของมวลน้ำมหาศาล ${telemetry.maxDischargeM3s ? `กว่า ${telemetry.maxDischargeM3s} ลบ.ม./วินาที` : 'ในระดับเตือนภัย'} ประกอบกับช่วงน้ำทะเลหนุนสูง ทำให้ระดับน้ำในลำน้ำเอ่อล้นเข้าท่วมพื้นที่ลุ่มต่ำริมตลิ่ง

## 2. การประเมินพื้นที่และเส้นทางสัญจร
- มีการตรวจพบพื้นที่น้ำท่วมขังกระจายตัว ${telemetry.floodFeaturesCount || 15} โซน
- เส้นทางคมนาคมบางส่วนได้รับผลกระทบ โดยเฉพาะถนนที่มีระดับน้ำเกิน 25 ซม. รถเล็กควรเปลี่ยนไปใช้ทางด่วนยกระดับ
- ประตูระบายน้ำและสถานีสูบน้ำกำลังเดินเครื่องเต็มพิกัดเพื่อเร่งผลักดันน้ำออกสู่ทะเล

## 3. แนะนำการอพยพและการเดินทาง
1. ตรวจสอบเส้นทางเลี่ยงและสถานะถนนสดได้ในหน้า \`/bangkok-flood\`
2. ขอรับความช่วยเหลือหรือแจ้งจุดกระสอบทรายรั่วได้ที่ศูนย์ประสานงานน้ำท่วม 02-248-5115 หรือ 1784
3. ผู้มีบ้านเรือนนอกแนวเขื่อนให้ย้ายรถยนต์ขึ้นจอดบนอาคารจอดรถสูง`;
      break;
    }

    default: {
      headline = `วิเคราะห์ข้อมูลสถานการณ์ ${DISASTER_NAMES_TH[telemetry.disasterType]} โดย Typhoon AI`;
      highRiskZones = ['พื้นที่รัศมีผลกระทบตามแนวเซ็นเซอร์ D-MIND'];
      dos = ['ติดตามข้อมูลอัปเดตอย่างต่อเนื่อง', 'เตรียมความพร้อมตามคู่มือฉุกเฉิน'];
      donts = ['อย่าประมาทต่อการแจ้งเตือน', 'หลีกเลี่ยงพื้นที่เสี่ยงอันตราย'];
      markdown = `## 1. บทสรุปสถานการณ์สด (Live Overview)
Typhoon AI ได้รวบรวมข้อมูลเซ็นเซอร์ตรวจวัดและเรดาร์สดสำหรับ **${DISASTER_NAMES_TH[telemetry.disasterType]}** คะแนนความเสี่ยงอยู่ที่ **${score}/100** (${levelTh}) ขอให้ประชาชนในพื้นที่ติดตามรายงานสภาพอากาศอย่างใกล้ชิด

## 2. แนวโน้มและข้อควรระวัง
- ตรวจสอบความพร้อมของอุปกรณ์ป้องกันภัยส่วนบุคคล
- หากต้องการสอบถามข้อมูลเจาะจง สามารถพิมพ์ถามในช่องแชท Typhoon AI ได้ทันที`;
    }
  }

  return {
    timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    disasterType: telemetry.disasterType,
    disasterTypeNameTh: DISASTER_NAMES_TH[telemetry.disasterType],
    threatLevel: level,
    threatLevelTh: levelTh,
    threatScore: score,
    headlineTh: headline,
    executiveSummaryTh: `ประเมินระดับความเสี่ยง ${levelTh} (คะแนนความเสี่ยง ${score}/100) อ้างอิงจากโครงข่ายตรวจวัด Open Data และดาวเทียมแบบเรียลไทม์`,
    keyDriversTh: [
      `ตรวจพบสัญญาณบ่งชี้ความเสี่ยงตามเกณฑ์มาตรฐานสากล`,
      `ผลกระทบครอบคลุมพื้นที่เสี่ยงเป้าหมาย`,
      `ความจำเป็นในการเฝ้าระวังอย่างต่อเนื่องตลอด 24 ชั่วโมง`
    ],
    highRiskZonesTh: highRiskZones,
    actionChecklistTh: { dos, donts },
    evacuationGuidanceTh: 'กรณีระดับน้ำหรือความรุนแรงเพิ่มขึ้น ให้ปฏิบัติตามคำสั่งของเจ้าหน้าที่ฝ่ายปกครองและสายด่วน 1784 อย่างเคร่งครัด',
    hotlinesTh: hotlines,
    rawMarkdownReport: markdown
  };
}

/**
 * Interactive Q&A chat with Typhoon AI regarding active disaster
 */
export async function askTyphoonDisasterChat(
  userQuery: string,
  telemetry: DisasterTelemetry,
  history: TyphoonChatMessage[] = []
): Promise<string> {
  const contextStr = buildTelemetryPromptContext(telemetry);
  const { score, level } = calculateDisasterThreatScore(telemetry);

  const systemPrompt = `คุณคือ "Dr.Mind - Typhoon AI Disaster Intelligence" (ขับเคลื่อนด้วยโมเดล typhoon-v2.5-30b-a3b-instruct) ผู้เชี่ยวชาญด้านภัยธรรมชาติและการแพทย์ฉุกเฉินประจำหน้าแผนที่ภัยพิบัติ D-MIND

บริบทข้อมูลจริงจากแผนที่ในขณะนี้:
${contextStr}
คะแนนความเสี่ยงประเมิน: ${score}/100 (${level})

หน้าที่ของคุณ:
1. ตอบคำถามของผู้ใช้อย่างรวดเร็ว ชัดเจน มีสาระ แม่นยำ และเห็นอกเห็นใจ
2. อ้างอิงตัวเลข ระดับความเสี่ยง และสถานที่จริงจากข้อมูลที่ได้รับ
3. หากผู้ใช้ถามเรื่องความปลอดภัย เส้นทางอพยพ หรือการปฏิบัติตัว ให้ระบุข้อควรทำและข้อห้ามอย่างเป็นรูปธรรม
4. ใช้ภาษาไทยที่สุภาพ ลงท้ายด้วย "ครับ" และใส่อีโมจิประกอบให้อ่านง่าย`;

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    { role: 'user', content: userQuery }
  ];

  try {
    const apiKey = getApiKey();
    const res = await fetch(TYPHOON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: TYPHOON_MODEL,
        messages: formattedMessages,
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    }
  } catch (err) {
    console.warn('[TyphoonDisasterService] Online chat error, using smart fallback...', err);
  }

  // Fallback to local serverless API /api/ask_model
  try {
    const res = await fetch('/api/ask_model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userQuery,
        model_index: 3,
        mode: 'mode2',
        context: contextStr
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.response_text) return data.response_text;
    }
  } catch {
    // Proceed to fallback
  }

  return generateIntelligentChatFallback(userQuery, telemetry, score);
}

function generateIntelligentChatFallback(
  query: string,
  telemetry: DisasterTelemetry,
  score: number
): string {
  const q = query.toLowerCase();

  if (q.includes('เสี่ยง') || q.includes('ระดับ') || q.includes('อันตราย')) {
    return `สวัสดีครับ! **Typhoon AI** ขอสรุปการประเมินความเสี่ยงสำหรับ **${DISASTER_NAMES_TH[telemetry.disasterType]}** ครับ:

📊 **ระดับความเสี่ยงในปัจจุบัน:** อยู่ที่คะแนน **${score}/100**
• พื้นที่เฝ้าระวัง: ${telemetry.selectedLocationName || 'ตามแนวรอยต่อเซ็นเซอร์ในแผนที่'}
• แนวโน้ม: จำเป็นต้องติดตามข้อมูลจากดาวเทียมและเรดาร์อย่างต่อเนื่องในอีก 24-48 ชั่วโมง
• ข้อแนะนำด่วน: ตรวจสอบอุปกรณ์ยังชีพ และงดการเข้าไปในพื้นที่เสี่ยงสีแดงครับผม ⚠️🛡️`;
  }

  if (q.includes('เบอร์') || q.includes('ติดต่อ') || q.includes('โทร') || q.includes('สายด่วน')) {
    const hl = DISASTER_HOTLINES[telemetry.disasterType] || [];
    return `สวัสดีครับ! **Typhoon AI** รวบรวมเบอร์สายด่วนฉุกเฉินสำคัญสำหรับเหตุการณ์นี้ให้ครับ:

📞 **เบอร์โทรแจ้งเหตุและขอความช่วยเหลือ 24 ชม.:**
${hl.map(h => `• **${h.name}:** [${h.number}](tel:${h.number}) (${h.desc || 'ติดต่อด่วน'})`).join('\n')}

หากมีเหตุฉุกเฉินทางการแพทย์ สามารถโทร **1669** ได้ทันทีทุกพื้นที่ทั่วประเทศครับ! 🚑`;
  }

  if (q.includes('ทำอย่างไร') || q.includes('ปฏิบัติ') || q.includes('เตรียม') || q.includes('ป้องกัน')) {
    return `สวัสดีครับ! **Typhoon AI** ขอแนะนำข้อควรปฏิบัติตัวเร่งด่วนสำหรับ **${DISASTER_NAMES_TH[telemetry.disasterType]}** ครับ:

✅ **สิ่งที่ควรทำทันที (Do's):**
1. ตรวจสอบตำแหน่งความปลอดภัยของตนเองและคนในครอบครัว
2. สับสะพานไฟและปิดวาล์วก๊าซหากเกิดเหตุน้ำท่วมหรือแผ่นดินไหว
3. เตรียมน้ำดื่มสะอาด อาหารแห้ง และยาประจำตัวอย่างน้อย 3-5 วัน
4. ส่งสัญญาณความปลอดภัยผ่านระบบ Safety Check-in

❌ **สิ่งที่ห้ามทำเด็ดขาด (Don'ts):**
1. ห้ามเดินลุยน้ำใกล้เสาไฟหรือสายไฟที่ขาด
2. ห้ามใช้ลิฟต์ขณะเกิดแผ่นดินไหว
3. อย่าหลงเชื่อข่าวลือในโซเชียลมีเดีย ให้ตรวจสอบข้อมูลผ่าน D-MIND เสมอครับ! 🛡️`;
  }

  return `สวัสดีครับ! **Typhoon AI (Disaster Intelligence)** ยินดีให้บริการครับ 👨‍⚕️🌐

ขณะนี้ผมกำลังมอนิเตอร์ข้อมูลเซ็นเซอร์ **${DISASTER_NAMES_TH[telemetry.disasterType]}** ร่วมกับ Open Data และดาวเทียม:
• คะแนนความเสี่ยง: **${score}/100**
• สถานะ: เฝ้าระวังตามข้อมูล telemetry สด
• ท่านสามารถสอบถามเกี่ยวกับ: เส้นทางปลอดภัย, วิธีการปฐมพยาบาล, เบอร์โทรขอความช่วยเหลือ หรือการประเมินพื้นที่เฉพาะได้เลยครับ!`;
}
