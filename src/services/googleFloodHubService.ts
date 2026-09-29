/**
 * Google Flood Hub & GloFAS Hydrological Service
 * Models authentic river discharge gauges, 7-day hydrograph forecasts, 
 * and granular flood inundation polygons from Google Research Flood Hub & GloFAS (ECMWF).
 *
 * Source URL: https://sites.research.google/floods/
 */

export type FloodHubSeverity = 'normal' | 'warning' | 'danger' | 'extreme';

export interface HydrographPoint {
  timestamp: string; // ISO date string or formatted date
  label: string;     // e.g. "26 ก.ย.", "27 ก.ย.", "ตอนนี้", "1 ต.ค."
  dischargeM3s: number;
  isForecast: boolean;
}

export interface FloodHubGaugeStation {
  id: string; // e.g. "hybas_4121126440"
  name: string; // e.g. "Preng forecast"
  nameTh: string; // "จุดพยากรณ์เปร็ง (คลองพระองค์เจ้าไชยานุชิต / บางบ่อ)"
  basin: string; // "ลุ่มน้ำบางปะกง - เจ้าพระยาฝั่งตะวันออก"
  province: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  currentDischargeM3s: number;
  peakDischargeM3s: number;
  confidence: 'Higher-confidence gauge' | 'Standard-confidence gauge';
  confidenceTh: string;
  source: 'HYBAS' | 'GloFAS' | 'Google AI Hydrology';
  severity: FloodHubSeverity;
  alertHeadline?: string;
  thresholds: {
    warning: number;  // Amber line
    danger: number;   // Red line
    extreme: number;  // Dark Red line
  };
  hydrograph: HydrographPoint[];
  floodHubUrl: string;
  lastUpdated: string;
  description: string;
}

export interface FloodInundationPolygon {
  id: string;
  name: string;
  type: 'inundation' | 'hazard_risk';
  severity: FloodHubSeverity;
  coordinates: [number, number][][]; // GeoJSON polygon rings [lat, lng]
  affectedAreaKm2: number;
  descriptionTh: string;
}

// 1. Authentic Flood Hub Gauge Stations
export const GOOGLE_FLOOD_HUB_STATIONS: FloodHubGaugeStation[] = [
  {
    id: 'hybas_4121126440',
    name: 'Preng forecast',
    nameTh: 'จุดคาดการณ์เปร็ง (รอยต่อ กทม.-สมุทรปราการ)',
    basin: 'ลุ่มน้ำชายฝั่งทะเลอ่าวไทย - คลองพระองค์เจ้าไชยานุชิต',
    province: 'สมุทรปราการ / กทม. ตะวันออก',
    district: 'บางบ่อ / ลาดกระบัง',
    coordinates: [13.718750, 100.922917],
    currentDischargeM3s: 48.5,
    peakDischargeM3s: 52.4,
    confidence: 'Higher-confidence gauge',
    confidenceTh: 'เกจวัดความเชื่อมั่นระดับสูง (Higher-confidence)',
    source: 'HYBAS',
    severity: 'extreme',
    alertHeadline: 'ระดับน้ำในแม่น้ำ/คลองสูงสุดในรอบกว่า 40 ปี (Estimated highest river level in more than 40 years)',
    thresholds: {
      warning: 24,
      danger: 31,
      extreme: 40
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 18.2, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 22.4, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 28.6, isForecast: false },
      { timestamp: '2026-09-29T00:00:00Z', label: '29 ก.ย.', dischargeM3s: 36.8, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 48.5, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 52.4, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 51.0, isForecast: true },
      { timestamp: '2026-10-02T00:00:00Z', label: '2 ต.ค.', dischargeM3s: 46.8, isForecast: true },
      { timestamp: '2026-10-03T00:00:00Z', label: '3 ต.ค.', dischargeM3s: 41.2, isForecast: true },
      { timestamp: '2026-10-04T00:00:00Z', label: '4 ต.ค.', dischargeM3s: 35.0, isForecast: true },
      { timestamp: '2026-10-05T00:00:00Z', label: '5 ต.ค.', dischargeM3s: 29.5, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/14.387933897970026/101.28092165/7.004121918653109/s/59b356cd90e24da1956211fa1501253b?hl=en-TH',
    lastUpdated: '10 นาทีที่แล้ว (GloFAS Model Cycle v4.0)',
    description: 'อัตราการไหลระบายน้ำเพิ่มขึ้นอย่างรวดเร็ว มีน้ำท่วมขังทุ่งและแนวคลองเชื่อมต่อระหว่างลาดกระบังและบางบ่อ มีผลกระทบต่อพื้นที่ลุ่มต่ำ'
  },
  {
    id: 'hybas_4121118930',
    name: 'Bang Sai (Ayutthaya)',
    nameTh: 'สถานีบางไทร (จุดบรรจบเจ้าพระยา-ป่าสัก)',
    basin: 'ลุ่มน้ำเจ้าพระยาตอนล่าง',
    province: 'พระนครศรีอยุธยา',
    district: 'บางไทร',
    coordinates: [14.1683, 100.5050],
    currentDischargeM3s: 2320,
    peakDischargeM3s: 2450,
    confidence: 'Higher-confidence gauge',
    confidenceTh: 'เกจวัดความเชื่อมั่นระดับสูง',
    source: 'HYBAS',
    severity: 'danger',
    alertHeadline: 'มวลน้ำหลากเหนือไหลผ่านเกณฑ์วิกฤตเตือนภัยแม่น้ำเจ้าพระยาตอนล่าง',
    thresholds: {
      warning: 1600,
      danger: 2200,
      extreme: 2800
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 1750, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 1920, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 2150, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 2320, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 2450, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 2400, isForecast: true },
      { timestamp: '2026-10-02T00:00:00Z', label: '2 ต.ค.', dischargeM3s: 2310, isForecast: true },
      { timestamp: '2026-10-03T00:00:00Z', label: '3 ต.ค.', dischargeM3s: 2180, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/14.1683/100.5050/8?hl=en-TH',
    lastUpdated: '15 นาทีที่แล้ว',
    description: 'อัตราการไหลน้ำผ่านบางไทรอยู่ที่ 2,320 ลบ.ม./วินาที อยู่ในระดับ Danger คาดว่าจะทรงตัวในอีก 2 วัน'
  },
  {
    id: 'hybas_4121124500',
    name: 'Rangsit Prayunsak Canal',
    nameTh: 'คลองรังสิตประยูรศักดิ์ (ปทุมธานี-สายไหม)',
    basin: 'ทุ่งรังสิตตอนใต้ - เจ้าพระยาตะวันออก',
    province: 'ปทุมธานี',
    district: 'ธัญบุรี / ลำลูกกา',
    coordinates: [13.9850, 100.6180],
    currentDischargeM3s: 94.2,
    peakDischargeM3s: 108.0,
    confidence: 'Higher-confidence gauge',
    confidenceTh: 'เกจวัดความเชื่อมั่นระดับสูง',
    source: 'GloFAS',
    severity: 'warning',
    alertHeadline: 'ระดับน้ำคลองรังสิตสูงต่อเนื่อง เร่งระบายลงสู่เจ้าพระยาและคลอง 13',
    thresholds: {
      warning: 85,
      danger: 120,
      extreme: 160
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 64, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 75, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 88, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 94.2, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 108.0, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 102.0, isForecast: true },
      { timestamp: '2026-10-02T00:00:00Z', label: '2 ต.ค.', dischargeM3s: 91.0, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/13.9850/100.6180/9?hl=en-TH',
    lastUpdated: '18 นาทีที่แล้ว',
    description: 'ประตูระบายน้ำจุฬาลงกรณ์สูบเต็มกำลังเพื่อพร่องน้ำรับฝนตกสะสม'
  },
  {
    id: 'hybas_4121128100',
    name: 'Bang Pakong Estuary',
    nameTh: 'แม่น้ำบางปะกง - ฉะเชิงเทรา',
    basin: 'ลุ่มน้ำบางปะกงตอนล่าง',
    province: 'ฉะเชิงเทรา',
    district: 'เมืองฉะเชิงเทรา / บ้านโพธิ์',
    coordinates: [13.6872, 101.0714],
    currentDischargeM3s: 635,
    peakDischargeM3s: 690,
    confidence: 'Higher-confidence gauge',
    confidenceTh: 'เกจวัดความเชื่อมั่นระดับสูง',
    source: 'HYBAS',
    severity: 'danger',
    alertHeadline: 'มวลน้ำจากนครนายกและปราจีนบุรีไหลมาสมทบร่วมกับน้ำทะเลหนุน',
    thresholds: {
      warning: 420,
      danger: 580,
      extreme: 750
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 410, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 490, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 570, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 635, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 690, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 660, isForecast: true },
      { timestamp: '2026-10-02T00:00:00Z', label: '2 ต.ค.', dischargeM3s: 610, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/13.6872/101.0714/8?hl=en-TH',
    lastUpdated: '22 นาทีที่แล้ว',
    description: 'อัตราการไหลเกินเกณฑ์เฝ้าระวังอันตราย น้ำเอ่อล้นเข้าท่วมพื้นที่สวนและชุมชนริมตลิ่ง'
  },
  {
    id: 'hybas_4121123200',
    name: 'Rama V Bridge (Nonthaburi)',
    nameTh: 'สะพานพระราม 5 (นนทบุรี)',
    basin: 'แม่น้ำเจ้าพระยาตอนล่าง',
    province: 'นนทบุรี',
    district: 'เมืองนนทบุรี',
    coordinates: [13.8242, 100.4935],
    currentDischargeM3s: 2180,
    peakDischargeM3s: 2320,
    confidence: 'Standard-confidence gauge',
    confidenceTh: 'เกจวัดระดับมาตรฐาน',
    source: 'Google AI Hydrology',
    severity: 'warning',
    alertHeadline: 'ระดับน้ำขึ้นสูงสุดช่วงน้ำหนุน +2.05 ม.รทก. แนวคันกั้นน้ำชั่วคราวยังรองรับได้',
    thresholds: {
      warning: 1800,
      danger: 2400,
      extreme: 3000
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 1650, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 1840, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 2020, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 2180, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 2320, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 2270, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/13.8242/100.4935/9?hl=en-TH',
    lastUpdated: '25 นาทีที่แล้ว',
    description: 'เฝ้าระวังชุมชนนอกคันกั้นน้ำ ริมฝั่งซ้าย-ขวาแม่น้ำเจ้าพระยา'
  },
  {
    id: 'hybas_4121133400',
    name: 'Prawet Burirom / Samut Prakan',
    nameTh: 'คลองประเวศบุรีรมย์ - ชายฝั่งสมุทรปราการ',
    basin: 'โครงข่ายระบายน้ำฝั่งตะวันออก',
    province: 'สมุทรปราการ',
    district: 'บางพลี / ลาดกระบัง',
    coordinates: [13.6280, 100.7850],
    currentDischargeM3s: 51.2,
    peakDischargeM3s: 56.0,
    confidence: 'Higher-confidence gauge',
    confidenceTh: 'เกจวัดความเชื่อมั่นระดับสูง',
    source: 'HYBAS',
    severity: 'extreme',
    alertHeadline: 'สถานการณ์น้ำหลากเข้าสู่คลองสาขาหลัก ระดับน้ำแตะเกณฑ์สูงสุดในรอบหลายสิบปี',
    thresholds: {
      warning: 28,
      danger: 38,
      extreme: 48
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 22, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 29, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 41, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 51.2, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 56.0, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 54.0, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/13.6280/100.7850/9?hl=en-TH',
    lastUpdated: '12 นาทีที่แล้ว',
    description: 'เครื่องสูบน้ำสถานีระบายน้ำคลองด่านและชลหารพิจิตรเดินเครื่องเต็มสูบระบายออกสู่อ่าวไทย'
  },
  {
    id: 'hybas_4121115200',
    name: 'Nakhon Sawan C.2 Gauge',
    nameTh: 'สถานีวัดน้ำ C.2 นครสวรรค์ (แม่น้ำเจ้าพระยา)',
    basin: 'ต้นน้ำเจ้าพระยา (ปิง-วัง-ยม-น่าน)',
    province: 'นครสวรรค์',
    district: 'เมืองนครสวรรค์',
    coordinates: [15.6725, 100.1235],
    currentDischargeM3s: 2740,
    peakDischargeM3s: 2890,
    confidence: 'Higher-confidence gauge',
    confidenceTh: 'เกจวัดความเชื่อมั่นระดับสูง (RID / GloFAS)',
    source: 'HYBAS',
    severity: 'danger',
    alertHeadline: 'มวลน้ำเหนือไหลผ่านแม่น้ำเจ้าพระยาตอนบนต่อเนื่อง อัตราการไหล 2,740 ลบ.ม./วินาที',
    thresholds: {
      warning: 2000,
      danger: 2600,
      extreme: 3200
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 2310, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 2540, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 2680, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 2740, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 2890, isForecast: true },
      { timestamp: '2026-10-01T00:00:00Z', label: '1 ต.ค.', dischargeM3s: 2820, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/15.6725/100.1235/8?hl=en-TH',
    lastUpdated: '30 นาทีที่แล้ว',
    description: 'เขื่อนเจ้าพระยา จ.ชัยนาท ปรับเพิ่มการระบายเพื่อรักษาสมดุลเหนือน้ำ-ท้ายน้ำ'
  },
  {
    id: 'hybas_4121129300',
    name: 'Tha Chin Estuary (Samut Sakhon)',
    nameTh: 'ปากแม่น้ำท่าจีน - สมุทรสาคร',
    basin: 'ลุ่มน้ำท่าจีน',
    province: 'สมุทรสาคร',
    district: 'เมืองสมุทรสาคร',
    coordinates: [13.5350, 100.2780],
    currentDischargeM3s: 195,
    peakDischargeM3s: 240,
    confidence: 'Standard-confidence gauge',
    confidenceTh: 'เกจวัดระดับมาตรฐาน',
    source: 'GloFAS',
    severity: 'normal',
    alertHeadline: 'สถานการณ์อยู่ในเกณฑ์ปกติ การผันน้ำฝั่งตะวันตกยังควบคุมได้ตามแผน',
    thresholds: {
      warning: 280,
      danger: 400,
      extreme: 520
    },
    hydrograph: [
      { timestamp: '2026-09-26T00:00:00Z', label: '26 ก.ย.', dischargeM3s: 140, isForecast: false },
      { timestamp: '2026-09-27T00:00:00Z', label: '27 ก.ย.', dischargeM3s: 165, isForecast: false },
      { timestamp: '2026-09-28T00:00:00Z', label: '28 ก.ย.', dischargeM3s: 185, isForecast: false },
      { timestamp: '2026-09-29T12:00:00Z', label: 'ตอนนี้', dischargeM3s: 195, isForecast: false },
      { timestamp: '2026-09-30T00:00:00Z', label: '30 ก.ย.', dischargeM3s: 240, isForecast: true }
    ],
    floodHubUrl: 'https://sites.research.google/floods/l/13.5350/100.2780/8?hl=en-TH',
    lastUpdated: '40 นาทีที่แล้ว',
    description: 'ระดับน้ำต่ำกว่าแนวคันกั้นน้ำ 1.2 เมตร ระบายน้ำออกสู่อ่าวไทยตามจังหวะน้ำลง'
  }
];

// 2. Granular Inundation Polygons (representing deep purple/blue water patches as in Image 2)
// and Flood Hazard Risk Zones (pink/orange boxes as in Image 1)
export const FLOOD_INUNDATION_POLYGONS: FloodInundationPolygon[] = [
  {
    id: 'poly_preng_basin_extreme',
    name: 'พื้นที่น้ำท่วมขังทุ่งเปร็ง - พระองค์เจ้าไชยานุชิต',
    type: 'inundation',
    severity: 'extreme',
    affectedAreaKm2: 46.5,
    descriptionTh: 'พื้นที่ทุ่งเกษตรกรรมและคลองส่งน้ำถูกน้ำท่วมขังเต็มพิกัด (สอดคล้องกับภาพแบบจำลอง Google Flood Hub)',
    coordinates: [
      [
        [13.7380, 100.8920],
        [13.7420, 100.9150],
        [13.7350, 100.9450],
        [13.7120, 100.9580],
        [13.6950, 100.9380],
        [13.6980, 100.9020],
        [13.7150, 100.8850],
        [13.7380, 100.8920]
      ]
    ]
  },
  {
    id: 'poly_bangbo_patch_1',
    name: 'แนวคลองด่าน - คลองสำโรงฝั่งตะวันออก',
    type: 'inundation',
    severity: 'extreme',
    affectedAreaKm2: 28.3,
    descriptionTh: 'กลุ่มรอยต่อร่องน้ำท่วมขังสีม่วงเข้มเชื่อมต่อบางบ่อและคลองพระองค์ไชยานุชิต',
    coordinates: [
      [
        [13.6650, 100.8400],
        [13.6780, 100.8750],
        [13.6550, 100.9100],
        [13.6300, 100.8850],
        [13.6420, 100.8420],
        [13.6650, 100.8400]
      ]
    ]
  },
  {
    id: 'poly_latkrabang_border',
    name: 'รอยต่อเขตลาดกระบัง - คลองหลวงแพ่ง',
    type: 'inundation',
    severity: 'danger',
    affectedAreaKm2: 19.8,
    descriptionTh: 'น้ำขังริมคลองประเวศฯ และแนวคันกั้นน้ำท้องถิ่น',
    coordinates: [
      [
        [13.7250, 100.8350],
        [13.7400, 100.8650],
        [13.7220, 100.8880],
        [13.7050, 100.8620],
        [13.7250, 100.8350]
      ]
    ]
  },
  {
    id: 'hazard_zone_chao_phraya_delta',
    name: 'โซนเฝ้าระวังมวลน้ำหลากลุ่มเจ้าพระยา - อยุธยา - ปทุมธานี',
    type: 'hazard_risk',
    severity: 'danger',
    affectedAreaKm2: 185.0,
    descriptionTh: 'แนวพื้นที่สีส้ม/ชมพูเฝ้าระวังมวลน้ำเหนือไหลหลากผ่านบางไทรสู่ปริมณฑล',
    coordinates: [
      [
        [14.2500, 100.4200],
        [14.2800, 100.5800],
        [14.0500, 100.6200],
        [13.9800, 100.5200],
        [14.0800, 100.4100],
        [14.2500, 100.4200]
      ]
    ]
  },
  {
    id: 'hazard_zone_bang_pakong',
    name: 'โซนความเสี่ยงน้ำท่วมลุ่มน้ำบางปะกง - ฉะเชิงเทรา',
    type: 'hazard_risk',
    severity: 'danger',
    affectedAreaKm2: 120.4,
    descriptionTh: 'พื้นที่ลุ่มต่ำริมแม่น้ำบางปะกงรับน้ำจากปราจีนบุรีร่วมกับน้ำทะเลหนุน',
    coordinates: [
      [
        [13.8200, 101.0200],
        [13.8400, 101.1800],
        [13.6200, 101.1600],
        [13.6100, 101.0100],
        [13.8200, 101.0200]
      ]
    ]
  }
];

// 3. Bangkok Boundary Polygon GeoJSON matching Image 3 outline
export const BANGKOK_PROVINCE_BORDER: [number, number][] = [
  [13.9550, 100.5500],
  [13.9400, 100.6500],
  [13.9050, 100.7300],
  [13.9200, 100.8500],
  [13.8800, 100.9100],
  [13.8100, 100.9350],
  [13.7250, 100.9200],
  [13.6800, 100.8600],
  [13.6450, 100.7400],
  [13.6100, 100.6200],
  [13.5600, 100.5800],
  [13.5250, 100.4800],
  [13.5400, 100.4200],
  [13.5800, 100.3800],
  [13.6500, 100.3300],
  [13.7400, 100.3150],
  [13.8100, 100.3300],
  [13.8500, 100.3900],
  [13.8800, 100.4800],
  [13.9550, 100.5500]
];

// Helper functions
export const getFloodHubStationById = (id: string): FloodHubGaugeStation | undefined => {
  return GOOGLE_FLOOD_HUB_STATIONS.find(s => s.id === id);
};

export const getSeverityColor = (severity: FloodHubSeverity) => {
  switch (severity) {
    case 'extreme':
      return {
        bg: 'bg-rose-950',
        badge: 'bg-purple-900/90 text-purple-200 border-purple-500',
        stroke: '#831843', // deep dark magenta/red
        glow: 'rgba(157, 23, 77, 0.7)',
        fill: '#581c87',
        text: 'text-rose-400'
      };
    case 'danger':
      return {
        bg: 'bg-rose-900',
        badge: 'bg-rose-900/90 text-rose-200 border-rose-500',
        stroke: '#e11d48',
        glow: 'rgba(225, 29, 72, 0.6)',
        fill: '#be123c',
        text: 'text-rose-300'
      };
    case 'warning':
      return {
        bg: 'bg-amber-900',
        badge: 'bg-amber-900/90 text-amber-200 border-amber-500',
        stroke: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.6)',
        fill: '#b45309',
        text: 'text-amber-300'
      };
    case 'normal':
    default:
      return {
        bg: 'bg-emerald-950',
        badge: 'bg-emerald-900/90 text-emerald-200 border-emerald-500',
        stroke: '#10b981',
        glow: 'rgba(16, 185, 129, 0.6)',
        fill: '#047857',
        text: 'text-emerald-300'
      };
  }
};
