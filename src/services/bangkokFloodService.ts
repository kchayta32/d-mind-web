/**
 * Bangkok Road Flood Telemetry & Satellite Correlation Service
 * Handles Bangkok road network querying, BMA canal stations,
 * Sentinel-1 SAR satellite telemetry, and Open-Meteo rainfall correlation.
 */

import {
  BangkokZone,
  FloodSeverity,
  BangkokRoadSegment,
  BangkokCanalStation,
  BangkokFloodFilterState,
  BangkokFloodSummary,
  SentinelFloodIndicator,
  OpenMeteoBangkokRainCorrelation,
  BangkokCctvCamera,
} from '../types/bangkokFlood';
import {
  BANGKOK_ROAD_SEGMENTS,
  BANGKOK_CANAL_STATIONS,
  SENTINEL_FLOOD_INDICATORS,
  BANGKOK_CCTV_CAMERAS,
} from '../data/bangkokRoadFloodData';
import { GISTDA_CONFIG, getGistdaHeaders, getGistdaFeatureUrl } from './gistdaService';

/**
 * Normalizes text for case-insensitive and whitespace-tolerant matching (supports Thai & English)
 */
const normalizeSearchText = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip zero-width spaces
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Filter roads by Bangkok geographic zone
 */
export const getBangkokRoadsByZone = (
  zone: BangkokZone,
  sourceRoads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS
): BangkokRoadSegment[] => {
  if (zone === 'all') {
    return sourceRoads;
  }
  return sourceRoads.filter((road) => road.zone === zone);
};

/**
 * Filter roads by flood severity status
 */
export const getBangkokRoadsBySeverity = (
  severity: 'all' | FloodSeverity,
  sourceRoads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS
): BangkokRoadSegment[] => {
  if (severity === 'all') {
    return sourceRoads;
  }
  return sourceRoads.filter((road) => road.status === severity);
};

/**
 * Search roads by name, nameEn, district, or canal with case & Thai insensitive matching
 */
export const searchBangkokRoads = (
  query: string,
  sourceRoads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS
): BangkokRoadSegment[] => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return sourceRoads;
  }

  return sourceRoads.filter((road) => {
    const nameTh = normalizeSearchText(road.name);
    const nameEn = normalizeSearchText(road.nameEn);
    const district = normalizeSearchText(road.district);
    const canal = normalizeSearchText(road.nearestCanal);
    const desc = normalizeSearchText(road.description);

    return (
      nameTh.includes(normalizedQuery) ||
      nameEn.includes(normalizedQuery) ||
      district.includes(normalizedQuery) ||
      canal.includes(normalizedQuery) ||
      desc.includes(normalizedQuery)
    );
  });
};

/**
 * Unified filter function for Bangkok roads using complete filter state
 */
export const filterBangkokRoads = (
  filterState: BangkokFloodFilterState,
  sourceRoads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS
): BangkokRoadSegment[] => {
  let result = sourceRoads;

  // 1. Zone filter
  if (filterState.selectedZone !== 'all') {
    result = result.filter((r) => r.zone === filterState.selectedZone);
  }

  // 2. Severity filter
  if (filterState.severityFilter !== 'all') {
    result = result.filter((r) => r.status === filterState.severityFilter);
  }

  // 3. Search query
  if (filterState.searchRoad && filterState.searchRoad.trim() !== '') {
    result = searchBangkokRoads(filterState.searchRoad, result);
  }

  return result;
};

/**
 * Get a specific Bangkok road segment by ID
 */
export const getBangkokRoadById = (id: string): BangkokRoadSegment | undefined => {
  return BANGKOK_ROAD_SEGMENTS.find((road) => road.id === id);
};

/**
 * Calculate comprehensive summary statistics from road segments
 */
export const getBangkokFloodSummary = (
  roads: BangkokRoadSegment[] = BANGKOK_ROAD_SEGMENTS
): BangkokFloodSummary => {
  const totalRoads = roads.length;
  let criticalCount = 0;
  let warningCount = 0;
  let normalCount = 0;
  let totalWaterLevel = 0;
  let maxWaterLevel = 0;
  let affectedLanesTotal = 0;
  let impassableSmallCarCount = 0;
  let impassableMotorcycleCount = 0;

  for (const road of roads) {
    if (road.status === 'critical') criticalCount++;
    else if (road.status === 'warning') warningCount++;
    else normalCount++;

    totalWaterLevel += road.waterLevelCm;
    if (road.waterLevelCm > maxWaterLevel) {
      maxWaterLevel = road.waterLevelCm;
    }
    affectedLanesTotal += road.lanesAffected;

    if (!road.passable.smallCar) impassableSmallCarCount++;
    if (!road.passable.motorcycle) impassableMotorcycleCount++;
  }

  const avgWaterLevelCm = totalRoads > 0 ? Math.round((totalWaterLevel / totalRoads) * 10) / 10 : 0;

  return {
    totalRoads,
    criticalCount,
    warningCount,
    normalCount,
    avgWaterLevelCm,
    maxWaterLevelCm: maxWaterLevel,
    affectedLanesTotal,
    impassableSmallCarCount,
    impassableMotorcycleCount,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Get all Bangkok drainage canal stations
 */
export const getBangkokCanalStations = (): BangkokCanalStation[] => {
  return BANGKOK_CANAL_STATIONS;
};

/**
 * Get canal stations filtered by operational status
 */
export const getCanalStationsByStatus = (
  status: 'normal' | 'warning' | 'critical'
): BangkokCanalStation[] => {
  return BANGKOK_CANAL_STATIONS.filter((station) => station.status === status);
};

/**
 * Get canal station by ID
 */
export const getBangkokCanalStationById = (id: string): BangkokCanalStation | undefined => {
  return BANGKOK_CANAL_STATIONS.find((station) => station.id === id);
};

/**
 * Get all BMA CCTV cameras for Bangkok roads
 */
export const getBangkokCctvCameras = (): BangkokCctvCamera[] => {
  return BANGKOK_CCTV_CAMERAS;
};

/**
 * Get CCTV cameras linked to a specific road segment
 */
export const getCctvCamerasForRoad = (road: BangkokRoadSegment): BangkokCctvCamera[] => {
  if (!road.cctvCameraIds || road.cctvCameraIds.length === 0) {
    return [];
  }
  return BANGKOK_CCTV_CAMERAS.filter((cam) => road.cctvCameraIds.includes(cam.id));
};

/**
 * Get Sentinel satellite flood indicators for Bangkok
 */
export const getSentinelFloodIndicators = (): SentinelFloodIndicator[] => {
  return SENTINEL_FLOOD_INDICATORS;
};

/**
 * Get Sentinel satellite indicators by zone
 */
export const getSentinelIndicatorsByZone = (
  zone: BangkokZone
): SentinelFloodIndicator[] => {
  if (zone === 'all') {
    return SENTINEL_FLOOD_INDICATORS;
  }
  return SENTINEL_FLOOD_INDICATORS.filter((item) => item.zone === zone);
};

/**
 * Correlate a road segment with Sentinel satellite flood indicators
 */
export const correlateRoadWithSentinel = (
  road: BangkokRoadSegment
): {
  matchedIndicator?: SentinelFloodIndicator;
  satelliteRiskConfirmed: boolean;
  confidence: 'high' | 'medium' | 'low' | 'none';
  satelliteNoteTh: string;
} => {
  const matched = SENTINEL_FLOOD_INDICATORS.find(
    (ind) => ind.affectedRoadIds.includes(road.id) || ind.zone === road.zone && road.status === 'critical'
  );

  if (!matched) {
    return {
      satelliteRiskConfirmed: false,
      confidence: 'none',
      satelliteNoteTh: 'ไม่พบสัญญาณน้ำท่วมขังรุนแรงจากวงโคจรดาวเทียม Sentinel ล่าสุด',
    };
  }

  return {
    matchedIndicator: matched,
    satelliteRiskConfirmed: matched.riskLevel === 'critical' || matched.riskLevel === 'warning',
    confidence: matched.confidence,
    satelliteNoteTh: `${matched.satellite} (${matched.corridorName}): ตรวจพบค่าความชื้นผิวดินสะท้อนสูงผิดปกติ ${matched.waterExtentSqKm} ตร.กม.`,
  };
};

/**
 * Live Open-Meteo precipitation correlation for Bangkok
 * Fetches real-time rainfall data and computes dynamic flood risk multiplier
 */
export const fetchBangkokRainCorrelation = async (): Promise<OpenMeteoBangkokRainCorrelation> => {
  const bkkLat = 13.7563;
  const bkkLon = 100.5018;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${bkkLat}&longitude=${bkkLon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,weather_code,wind_speed_10m&hourly=precipitation_probability,precipitation,rain&forecast_days=1&timezone=Asia%2FBangkok`;
    const response = await fetch(url, { headers: { accept: 'application/json' } });

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status: ${response.status}`);
    }

    const data = await response.json();
    const currentPrecipitationMm = Number(data.current?.precipitation ?? 0);
    const weatherCode = Number(data.current?.weather_code ?? 0);
    const temperatureC = Number(data.current?.temperature_2m ?? 31.0);

    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyPrecip: number[] = (data.hourly?.precipitation || []).slice(0, 12);
    const hourlyProb: number[] = (data.hourly?.precipitation_probability || []).slice(0, 12);

    const hourlyLabels = hourlyTimes.slice(0, 12).map((t) => {
      const parts = t.split('T');
      return parts[1] ? parts[1].slice(0, 5) : t;
    });

    const maxProb = hourlyProb.length > 0 ? Math.max(...hourlyProb) : 30;

    // Calculate flood risk multiplier according to BMA drainage capacity (>60 mm/hr overwhelms gravity drainage)
    let floodRiskMultiplier = 1.0;
    let riskAssessmentTh = 'สภาวะฝนปกติ ระบบระบายน้ำกรุงเทพฯ สามารถรองรับได้ตามเกณฑ์มาตรฐาน';

    if (currentPrecipitationMm > 50) {
      floodRiskMultiplier = 2.2;
      riskAssessmentTh = 'วิกฤตฝนตกหนักมาก (>50 มม./ชม.) เกินขีดความสามารถการระบายน้ำตามธรรมชาติ เสี่ยงน้ำท่วมขังฉับพลันทุกจุดลุ่มต่ำ';
    } else if (currentPrecipitationMm > 25) {
      floodRiskMultiplier = 1.6;
      riskAssessmentTh = 'ฝนตกหนัก (25-50 มม./ชม.) คาดมีน้ำรอระบายตามแนวถนนสายหลัก 15-30 นาทีหลังฝนตก';
    } else if (currentPrecipitationMm > 10) {
      floodRiskMultiplier = 1.3;
      riskAssessmentTh = 'ฝนปานกลาง (10-25 มม./ชม.) ชะลอความเร็วระวังจุดกลับรถและแอ่งน้ำขังขอบทาง';
    } else if (currentPrecipitationMm > 0.5) {
      floodRiskMultiplier = 1.1;
      riskAssessmentTh = 'ฝนตกเล็กน้อย ผิวจราจรเปียกลื่น ขับขี่ด้วยความระมัดระวัง';
    } else if (maxProb > 70) {
      floodRiskMultiplier = 1.15;
      riskAssessmentTh = 'โอกาสเกิดฝนตกหนักในพื้นที่ กทม. สูงกว่า 70% ภายใน 6 ชั่วโมงข้างหน้า เฝ้าระวังจุดลุ่มต่ำ';
    }

    return {
      currentPrecipitationMm,
      precipitationProbability: maxProb,
      hourlyRainForecastMm: hourlyPrecip,
      hourlyLabels,
      weatherCode,
      weatherDescription: getWeatherCodeDescription(weatherCode),
      temperatureC,
      soilMoistureIndex: Math.min(1.0, 0.4 + currentPrecipitationMm * 0.03),
      floodRiskMultiplier,
      riskAssessmentTh,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    // Robust fallback simulation when network is offline or throttled
    return getFallbackRainCorrelation();
  }
};

/**
 * Open-Meteo WMO Weather interpretation code
 */
const getWeatherCodeDescription = (code: number): string => {
  switch (code) {
    case 0:
      return 'ท้องฟ้าแจ่มใส (Clear Sky)';
    case 1:
    case 2:
    case 3:
      return 'มีเมฆเป็นส่วนมาก (Partly Cloudy)';
    case 45:
    case 48:
      return 'มีหมอก (Fog)';
    case 51:
    case 53:
    case 55:
      return 'ฝนละอองปรอยๆ (Drizzle)';
    case 61:
    case 63:
      return 'ฝนตกปานกลาง (Moderate Rain)';
    case 65:
      return 'ฝนตกหนัก (Heavy Rain)';
    case 80:
    case 81:
    case 82:
      return 'ฝนฟ้าคะนองกระจาย (Rain Showers)';
    case 95:
    case 96:
    case 99:
      return 'พายุฝนฟ้าคะนองรุนแรง (Thunderstorm)';
    default:
      return 'มีเมฆฝนฟ้าคะนองเป็นแห่งๆ';
  }
};

/**
 * Fallback correlation data for offline situations
 */
export const getFallbackRainCorrelation = (): OpenMeteoBangkokRainCorrelation => {
  return {
    currentPrecipitationMm: 14.5,
    precipitationProbability: 80,
    hourlyRainForecastMm: [14.5, 18.2, 22.0, 15.0, 8.5, 4.0, 2.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    hourlyLabels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00'],
    weatherCode: 81,
    weatherDescription: 'ฝนฟ้าคะนองกระจาย (Rain Showers)',
    temperatureC: 30.5,
    soilMoistureIndex: 0.75,
    floodRiskMultiplier: 1.45,
    riskAssessmentTh: 'สภาวะกลุ่มเมฆฝนเคลื่อนตัวปกคลุมกรุงเทพฯ ชั้นในและตะวันออก เฝ้าระวังน้ำรอระบายถนนสายหลัก',
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Fetches GISTDA Sentinel Flood status features for Bangkok area if available
 */
export const fetchGistdaBangkokSentinelFeatures = async () => {
  try {
    const url = getGistdaFeatureUrl(GISTDA_CONFIG.ENDPOINTS.FEATURES.FLOOD_1DAY, 100, 0, true);
    const headers = getGistdaHeaders();

    const response = await fetch(url, { headers });
    if (!response.ok) {
      return { success: false, data: [] };
    }
    const data = await response.json();
    return { success: true, data: data.features || [] };
  } catch (err) {
    return { success: false, data: [] };
  }
};
