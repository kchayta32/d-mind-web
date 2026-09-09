/**
 * SeismoGuard AI - Wave Physics Engine
 * High-precision seismic wave propagation, travel-time calculations, and early warning countdown.
 *
 * Physical Constants:
 * - P-wave velocity (Vp) = 6.0 km/s (Crustal compressional primary wave)
 * - S-wave velocity (Vs) = 3.5 km/s (Shear secondary wave - destructive ground shaking)
 * - Earth Mean Radius (R) = 6371.0 km
 */

import { EarlyWarningInfo, EarthquakeEvent } from '../types/seismic';
import { calculatePga, getThaiIntensityInfo } from './aiMagnitudePredictor';

export const VP_KM_S = 6.0; // P-wave velocity in km/s
export const VS_KM_S = 3.5; // S-wave velocity in km/s
export const EARTH_RADIUS_KM = 6371.0;

export class WavePhysicsEngine {
  public static readonly VP = VP_KM_S;
  public static readonly VS = VS_KM_S;

  public static haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    return calculateHaversineDistance(lat1, lon1, lat2, lon2);
  }

  public static hypocentralDistanceKm(epicentralDistKm: number, depthKm: number = 10): number {
    return calculateHypocentralDistance(epicentralDistKm, depthKm);
  }

  public static pWaveTravelTimeSec(hypocentralDistKm: number): number {
    return Math.max(0.1, hypocentralDistKm / VP_KM_S);
  }

  public static sWaveTravelTimeSec(hypocentralDistKm: number): number {
    return Math.max(0.1, hypocentralDistKm / VS_KM_S);
  }

  public static calculateEarlyWarning(
    eventId: string,
    epicenterName: string,
    magnitude: number,
    depthKm: number,
    targetLat: number,
    targetLng: number,
    epicenterLat: number,
    epicenterLng: number,
    elapsedSecondsSinceOrigin: number = 0,
    soilAmplification: number = 1.0
  ): EarlyWarningInfo {
    const distKm = calculateHaversineDistance(targetLat, targetLng, epicenterLat, epicenterLng);
    const hypoDistKm = calculateHypocentralDistance(distKm, depthKm);
    const gold = calculateGoldenSeconds(Date.now() - (elapsedSecondsSinceOrigin * 1000), distKm, depthKm);
    const pga = calculatePga(magnitude, hypoDistKm, soilAmplification);
    const intensity = getThaiIntensityInfo(pga);

    return {
      eventId,
      epicenterName,
      magnitude,
      depthKm,
      distanceKm: distKm,
      pWaveArrivalSec: gold.pWaveArrivalSec,
      sWaveArrivalSec: gold.sWaveArrivalSec,
      countdownSeconds: gold.countdownSeconds,
      totalLeadTimeSec: gold.totalLeadTimeSec,
      intensityLevel: `${intensity.mmiRoman} (${intensity.thaiTitle})`,
      expectedPga: pga,
      recommendedAction: getRecommendedAction(pga, gold.countdownSeconds, gold.hasArrived),
      isUrgent: gold.countdownSeconds > 0 && gold.countdownSeconds <= 30 && magnitude >= 4.5,
      hasArrived: gold.hasArrived,
    };
  }
}

export interface TravelTimes {
  epicentralDistanceKm: number;
  hypocentralDistanceKm: number;
  pWaveTravelTimeSec: number;
  sWaveTravelTimeSec: number;
  leadTimeSec: number; // S-wave arrival minus P-wave arrival (S - P interval)
}

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates Great-Circle surface distance between two points using the Haversine formula.
 * Accurately handles antipodal and close distances.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;

  const radLat1 = (lat1 * Math.PI) / 180.0;
  const radLat2 = (lat2 * Math.PI) / 180.0;

  const a =
    Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);

  const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1.0 - a)));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Calculates 3D Hypocentral slant distance considering earthquake focal depth.
 * R_hypo = sqrt(d_epi^2 + depth^2)
 */
export function calculateHypocentralDistance(
  epicentralDistanceKm: number,
  depthKm = 10.0
): number {
  const depth = Math.max(0, depthKm);
  const hypo = Math.sqrt(epicentralDistanceKm * epicentralDistanceKm + depth * depth);
  return Math.round(hypo * 10) / 10;
}

/**
 * Calculates P-wave and S-wave travel times and lead time from hypocenter.
 */
export function calculateWaveTravelTimes(
  distanceKm: number,
  depthKm = 10.0,
  vp = VP_KM_S,
  vs = VS_KM_S
): TravelTimes {
  const hypoDistance = calculateHypocentralDistance(distanceKm, depthKm);

  const pTime = hypoDistance / vp;
  const sTime = hypoDistance / vs;
  const leadTime = sTime - pTime;

  return {
    epicentralDistanceKm: Math.round(distanceKm * 10) / 10,
    hypocentralDistanceKm: Math.round(hypoDistance * 10) / 10,
    pWaveTravelTimeSec: Math.round(pTime * 10) / 10,
    sWaveTravelTimeSec: Math.round(sTime * 10) / 10,
    leadTimeSec: Math.round(leadTime * 10) / 10,
  };
}

/**
 * Calculates remaining "Golden Seconds" countdown until destructive S-wave reaches user location.
 * @param originTimeMs Epoch timestamp (ms) when rupture initiated at hypocenter
 * @param distanceKm Epicentral distance to user location (km)
 * @param depthKm Focal depth (km)
 * @param currentTimeMs Optional current timestamp (defaults to Date.now())
 */
export function calculateGoldenSeconds(
  originTimeMs: number,
  distanceKm: number,
  depthKm = 10.0,
  currentTimeMs: number = Date.now()
): {
  countdownSeconds: number;
  totalLeadTimeSec: number;
  sWaveArrivalSec: number;
  pWaveArrivalSec: number;
  hasArrived: boolean;
} {
  const times = calculateWaveTravelTimes(distanceKm, depthKm);
  const sArrivalEpochMs = originTimeMs + times.sWaveTravelTimeSec * 1000.0;
  const remainingMs = sArrivalEpochMs - currentTimeMs;
  const remainingSec = Math.max(0, Math.round((remainingMs / 1000.0) * 10) / 10);

  return {
    countdownSeconds: remainingSec,
    totalLeadTimeSec: times.leadTimeSec,
    sWaveArrivalSec: times.sWaveTravelTimeSec,
    pWaveArrivalSec: times.pWaveTravelTimeSec,
    hasArrived: remainingMs <= 0,
  };
}

/**
 * Generates recommended safety action based on expected ground motion, intensity, and remaining countdown.
 */
export function getRecommendedAction(
  pgaGal: number,
  countdownSeconds: number,
  hasArrived: boolean
): string {
  if (hasArrived) {
    if (pgaGal >= 34.0) {
      return 'คลื่นแผ่นดินไหวมาถึงแล้ว! หมอบใต้โต๊ะกำบัง ป้องกันศีรษะ อย่าเพิ่งวิ่งออกนอกอาคารจนกว่าการสั่นสะเทือนจะสงบ';
    }
    return 'คลื่นแผ่นดินไหวผ่านพ้นแล้ว ตรวจสอบแก๊ส สายไฟ และสิ่งของชำรุด ติดตามประกาศจากทางราชการ';
  }

  if (pgaGal >= 65.0) {
    if (countdownSeconds <= 5) {
      return `ฉุกเฉินระดับวิกฤต! เหลือ ${countdownSeconds} วินาที! หมอบ ป้อง กำบัง ทันที! อยู่ห่างจากหน้าต่างและเสาอาคาร`;
    }
    return `แผ่นดินไหวรุนแรงมาก! มีเวลา ${countdownSeconds} วินาที: ปิดวาล์วแก๊ส ปลดสวิตช์ไฟหลัก หมอบใต้โต๊ะแข็งแรง ทันที!`;
  }

  if (pgaGal >= 18.0) {
    if (countdownSeconds <= 5) {
      return `เหลือเวลา ${countdownSeconds} วินาที: หมอบใต้โต๊ะหรือกำบังบริเวณเสาหลักของบ้าน`;
    }
    return `การสั่นไหวระดับรุนแรง (เหลือ ${countdownSeconds} วินาที): ออกห่างจากตู้กระจกและของแขวน เตรียมพร้อมรับแรงสั่นสะเทือน`;
  }

  if (pgaGal >= 3.9) {
    return `รู้สึกสั่นไหวปานกลาง (เหลือ ${countdownSeconds} วินาที): ระวังของตกหล่น อยู่ในที่ปลอดภัย ไม่ต้องตื่นตระหนก`;
  }

  return `แรงสั่นสะเทือนเล็กน้อย (เหลือ ${countdownSeconds} วินาที): สังเกตการณ์อย่างปลอดภัย ไม่จำเป็นต้องอพยพ`;
}

/**
 * Calculates the Earthquake Early Warning "Blind Zone" radius (km).
 * The blind zone is the epicentral area where S-waves arrive before an alert can be processed and broadcast.
 * @param detectionTimeSec Time taken from rupture initiation to detection & processing (typically 3 - 5 sec)
 */
export function calculateBlindZoneRadius(detectionTimeSec = 3.5, vs = VS_KM_S): number {
  const radius = vs * detectionTimeSec;
  return Math.round(radius * 10) / 10; // e.g. 3.5 * 3.5 = 12.2 km
}

/**
 * Comprehensive Early Warning Information generator for an earthquake event relative to a target location.
 */
export function computeEarlyWarningInfo(
  event: EarthquakeEvent,
  targetLat: number,
  targetLng: number,
  currentTimeMs: number = Date.now()
): EarlyWarningInfo {
  const depth = event.depthKm ?? event.depth ?? 10.0;
  const distanceKm = calculateHaversineDistance(
    event.latitude,
    event.longitude,
    targetLat,
    targetLng
  );

  const hypoDistance = calculateHypocentralDistance(distanceKm, depth);
  const timing = calculateGoldenSeconds(event.time, distanceKm, depth, currentTimeMs);

  // Expected PGA at the target site using GMPE
  const expectedPga = calculatePga(event.magnitude, hypoDistance, depth);
  const intensity = getThaiIntensityInfo(expectedPga);

  const recommendedAction = getRecommendedAction(
    expectedPga,
    timing.countdownSeconds,
    timing.hasArrived
  );

  const isUrgent = !timing.hasArrived && timing.countdownSeconds > 0 && expectedPga >= 9.2;

  const intensityLevel = `${intensity.mmiRoman} - ${intensity.thaiTitle}`;

  return {
    eventId: event.id,
    epicenterName: event.epicenter || event.title,
    magnitude: event.magnitude,
    depthKm: depth,
    distanceKm,
    pWaveArrivalSec: timing.pWaveArrivalSec,
    sWaveArrivalSec: timing.sWaveArrivalSec,
    countdownSeconds: timing.countdownSeconds,
    totalLeadTimeSec: timing.totalLeadTimeSec,
    intensityLevel,
    expectedPga,
    recommendedAction,
    isUrgent,
    hasArrived: timing.hasArrived,
  };
}

/**
 * Generates wave propagation wavefront rings at elapsed time T for map rendering.
 */
export function calculateWavefrontRadii(
  elapsedSec: number,
  vp = VP_KM_S,
  vs = VS_KM_S
): { pWaveRadiusKm: number; sWaveRadiusKm: number } {
  const safeT = Math.max(0, elapsedSec);
  return {
    pWaveRadiusKm: Math.round(vp * safeT * 10) / 10,
    sWaveRadiusKm: Math.round(vs * safeT * 10) / 10,
  };
}
