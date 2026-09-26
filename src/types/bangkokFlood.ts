/**
 * Bangkok Road Flood & Sentinel Telemetry Types
 * DMind Disaster Management Platform
 */

export type BangkokZone = 'all' | 'north' | 'central' | 'east' | 'thonburi';
export type BangkokZoneKey = 'north' | 'central' | 'east' | 'thonburi';

/**
 * Flood Severity classification according to BMA & DMind standards:
 * - 'critical': Red (หลีกเลี่ยง) - น้ำท่วมขังสูง รถเล็กผ่านไม่ได้
 * - 'warning': Orange (ขับช้า ระวัง) - น้ำท่วมผิวจราจรบางส่วน ช่องทางชิดขอบทาง
 * - 'normal': Green (ใช้ได้ตามปกติ) - ผิวจราจรแห้งหรือมีน้ำขังเล็กน้อยไม่กระทบการเดินรถ
 */
export type FloodSeverity = 'normal' | 'warning' | 'critical';

export interface VehiclePassability {
  smallCar: boolean;
  motorcycle: boolean;
  truck: boolean;
}

export interface BangkokRoadSegment {
  id: string;
  name: string;
  nameEn: string;
  zone: BangkokZoneKey;
  district: string;
  status: FloodSeverity;
  waterLevelCm: number;
  lanesAffected: number;
  passable: VehiclePassability;
  description: string;
  /** Polyline coordinates along actual road path [latitude, longitude] */
  coordinates: [number, number][];
  nearestCanal: string;
  drainageStatus: string;
  updatedAt: string;
  cctvCameraIds: string[];
}

export interface BangkokCanalStation {
  id: string;
  name: string;
  canalName: string;
  coordinates: [number, number];
  /** Water level relative to Mean Sea Level (MSL) in meters */
  waterLevelMsl: number;
  /** Critical warning threshold MSL in meters */
  criticalLevelMsl: number;
  status: 'normal' | 'warning' | 'critical';
  pumpsRunning: number;
  totalPumps: number;
  /** Discharge rate in cubic meters per second (m³/s) */
  flowRateM3s: number;
}

export interface BangkokFloodFilterState {
  searchRoad: string;
  selectedZone: BangkokZone;
  severityFilter: 'all' | FloodSeverity;
  showCctv: boolean;
  showCanals: boolean;
  showSentinelLayer: boolean;
}

export interface BangkokFloodSummary {
  totalRoads: number;
  criticalCount: number;
  warningCount: number;
  normalCount: number;
  avgWaterLevelCm: number;
  maxWaterLevelCm: number;
  affectedLanesTotal: number;
  impassableSmallCarCount: number;
  impassableMotorcycleCount: number;
  timestamp: string;
}

export interface SentinelFloodIndicator {
  id: string;
  satellite: 'Sentinel-1 SAR' | 'Sentinel-2 MSI' | 'GISTDA Sentinel Composite';
  observedAt: string;
  zone: BangkokZoneKey;
  corridorName: string;
  waterExtentSqKm: number;
  backscatterAnomalyDb: number;
  confidence: 'high' | 'medium' | 'low';
  riskLevel: FloodSeverity;
  centerCoordinates: [number, number];
  affectedRoadIds: string[];
  summaryTh: string;
}

export interface OpenMeteoBangkokRainCorrelation {
  currentPrecipitationMm: number;
  precipitationProbability: number;
  hourlyRainForecastMm: number[];
  hourlyLabels: string[];
  weatherCode: number;
  weatherDescription: string;
  temperatureC: number;
  soilMoistureIndex: number;
  floodRiskMultiplier: number;
  riskAssessmentTh: string;
  lastUpdated: string;
}

export interface BangkokCctvCamera {
  id: string;
  name: string;
  roadName: string;
  district: string;
  coordinates: [number, number];
  status: 'online' | 'offline';
  waterLevelStatus: FloodSeverity;
  snapshotUrl?: string;
  updatedAt: string;
}

export const BANGKOK_ZONE_CONFIG: Record<
  BangkokZoneKey,
  {
    nameTh: string;
    nameEn: string;
    description: string;
    center: [number, number];
    keyDistricts: string[];
  }
> = {
  north: {
    nameTh: 'กรุงเทพฯ เหนือ',
    nameEn: 'North Bangkok',
    description: 'จตุจักร, ดอนเมือง, บางเขน, หลักสี่, สายไหม, ลาดพร้าว (ตอนบน)',
    center: [13.8591, 100.5829],
    keyDistricts: ['จตุจักร', 'ดอนเมือง', 'บางเขน', 'หลักสี่', 'สายไหม']
  },
  central: {
    nameTh: 'กรุงเทพฯ ชั้นใน/กลาง',
    nameEn: 'Central Bangkok',
    description: 'ปทุมวัน, สาทร, บางรัก, วัฒนา, คลองเตย, ดินแดง, ห้วยขวาง, พญาไท',
    center: [13.7367, 100.5331],
    keyDistricts: ['ปทุมวัน', 'สาทร', 'บางรัก', 'วัฒนา', 'คลองเตย', 'ดินแดง', 'ห้วยขวาง', 'พญาไท']
  },
  east: {
    nameTh: 'กรุงเทพฯ ตะวันออก',
    nameEn: 'East Bangkok',
    description: 'บางกะปิ, รามคำแหง, สะพานสูง, มีนบุรี, สวนหลวง, ประเวศ, บางนา, หนองจอก',
    center: [13.7652, 100.6558],
    keyDistricts: ['บางกะปิ', 'สะพานสูง', 'มีนบุรี', 'สวนหลวง', 'ประเวศ', 'บางนา', 'บึงกุ่ม']
  },
  thonburi: {
    nameTh: 'ฝั่งธนบุรี',
    nameEn: 'Thonburi',
    description: 'ธนบุรี, คลองสาน, บางกอกน้อย, บางกอกใหญ่, ภาษีเจริญ, บางแค, หนองแขม, ตลิ่งชัน',
    center: [13.7225, 100.4632],
    keyDistricts: ['ธนบุรี', 'คลองสาน', 'บางกอกน้อย', 'บางกอกใหญ่', 'ภาษีเจริญ', 'บางแค', 'หนองแขม', 'ตลิ่งชัน']
  }
};

export const FLOOD_SEVERITY_META: Record<
  FloodSeverity,
  {
    labelTh: string;
    labelEn: string;
    colorHex: string;
    bgColor: string;
    borderColor: string;
    badgeVariant: 'destructive' | 'secondary' | 'default';
    recommendationTh: string;
  }
> = {
  critical: {
    labelTh: 'หลีกเลี่ยง (วิกฤต)',
    labelEn: 'Critical / Avoid',
    colorHex: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#dc2626',
    badgeVariant: 'destructive',
    recommendationTh: 'น้ำท่วมขังสูง โปรดหลีกเลี่ยงเส้นทาง หรือใช้ทางด่วน/เส้นทางเลี่ยง'
  },
  warning: {
    labelTh: 'ขับช้า ระวัง (เฝ้าระวัง)',
    labelEn: 'Warning / Caution',
    colorHex: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#ea580c',
    badgeVariant: 'secondary',
    recommendationTh: 'มีน้ำขังบางช่องทาง ขับช้า ระมัดระวังคลื่นน้ำซัดเข้าข้างทาง'
  },
  normal: {
    labelTh: 'ใช้ได้ตามปกติ',
    labelEn: 'Normal / Passable',
    colorHex: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: '#16a34a',
    badgeVariant: 'default',
    recommendationTh: 'สัญจรได้ตามปกติ ผิวจราจรแห้งหรือน้ำระบายหมดแล้ว'
  }
};
