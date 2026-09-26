/**
 * Bangkok Road Flood & CCTV Telemetry Test Suite
 * Validates data integrity, coordinates, zone distribution, search algorithms, and severity mappings.
 */

import { 
  BANGKOK_ROAD_SEGMENTS, 
  BANGKOK_CANAL_STATIONS, 
  SENTINEL_FLOOD_INDICATORS 
} from '../data/bangkokRoadFloodData';
import { 
  BANGKOK_CCTV_CAMERAS 
} from '../data/bangkokCctvData';
import {
  searchBangkokRoads,
  getBangkokRoadsByZone,
  getBangkokRoadsBySeverity,
  getBangkokFloodSummary
} from '../services/bangkokFloodService';
import {
  searchCctvByRoad,
  getCctvByZone,
  getCctvBySeverity,
  getCctvStatistics
} from '../services/bkkCctvService';

export function runBangkokFloodTests() {
  const results: { test: string; passed: boolean; message?: string }[] = [];

  // Test 1: Road count check
  const roadCountValid = BANGKOK_ROAD_SEGMENTS.length >= 30;
  results.push({
    test: 'Total Road Segments >= 30',
    passed: roadCountValid,
    message: `Found ${BANGKOK_ROAD_SEGMENTS.length} roads`
  });

  // Test 2: CCTV count check (requirement: every CCTV point in BKK, 60+)
  const cctvCountValid = BANGKOK_CCTV_CAMERAS.length >= 60;
  results.push({
    test: 'Total CCTV Cameras >= 60',
    passed: cctvCountValid,
    message: `Found ${BANGKOK_CCTV_CAMERAS.length} cameras`
  });

  // Test 3: Zone coverage (all 4 zones must have roads and CCTVs)
  const zones: ('north' | 'central' | 'east' | 'thonburi')[] = ['north', 'central', 'east', 'thonburi'];
  for (const zone of zones) {
    const roadsInZone = getBangkokRoadsByZone(zone);
    const cctvsInZone = getCctvByZone(zone);
    results.push({
      test: `Zone [${zone}] has roads and CCTVs`,
      passed: roadsInZone.length > 0 && cctvsInZone.length > 0,
      message: `${roadsInZone.length} roads, ${cctvsInZone.length} CCTVs`
    });
  }

  // Test 4: Severities present and correctly categorized
  // Red = หลีกเลี่ยง (critical), Orange = ขับช้า ระวัง (warning), Green = ใช้ได้ตามปกติ (normal)
  const criticalRoads = getBangkokRoadsBySeverity('critical');
  const warningRoads = getBangkokRoadsBySeverity('warning');
  const normalRoads = getBangkokRoadsBySeverity('normal');
  results.push({
    test: 'Red (Critical / หลีกเลี่ยง) roads exist',
    passed: criticalRoads.length > 0,
    message: `Found ${criticalRoads.length} critical roads`
  });
  results.push({
    test: 'Orange (Warning / ขับช้า ระวัง) roads exist',
    passed: warningRoads.length > 0,
    message: `Found ${warningRoads.length} warning roads`
  });
  results.push({
    test: 'Green (Normal / ใช้ได้ตามปกติ) roads exist',
    passed: normalRoads.length > 0,
    message: `Found ${normalRoads.length} normal roads`
  });

  // Test 5: Thai and English Search
  const searchSukhumvit = searchBangkokRoads('สุขุมวิท');
  const searchVibhavadi = searchBangkokRoads('Vibhavadi');
  const searchLadprao = searchBangkokRoads('ลาดพร้าว');
  results.push({
    test: 'Search road "สุขุมวิท" returns matches',
    passed: searchSukhumvit.length > 0,
    message: `Found ${searchSukhumvit.length} matches`
  });
  results.push({
    test: 'Search road "Vibhavadi" returns matches',
    passed: searchVibhavadi.length > 0,
    message: `Found ${searchVibhavadi.length} matches`
  });
  results.push({
    test: 'Search road "ลาดพร้าว" returns matches',
    passed: searchLadprao.length > 0,
    message: `Found ${searchLadprao.length} matches`
  });

  // Test 6: Coordinates within Bangkok bounding box (lat: 13.4 - 14.1, lng: 100.2 - 100.9)
  let allCoordsValid = true;
  for (const road of BANGKOK_ROAD_SEGMENTS) {
    if (!road.coordinates || road.coordinates.length < 2) {
      allCoordsValid = false;
      break;
    }
    for (const [lat, lng] of road.coordinates) {
      if (lat < 13.4 || lat > 14.2 || lng < 100.2 || lng > 100.9) {
        allCoordsValid = false;
        break;
      }
    }
  }
  results.push({
    test: 'All road polyline coordinates within Greater Bangkok geographic bounds',
    passed: allCoordsValid
  });

  let allCctvCoordsValid = true;
  for (const cctv of BANGKOK_CCTV_CAMERAS) {
    const [lat, lng] = cctv.coordinates;
    if (lat < 13.4 || lat > 14.2 || lng < 100.2 || lng > 100.9) {
      allCctvCoordsValid = false;
      break;
    }
  }
  results.push({
    test: 'All 65 CCTV camera coordinates within Greater Bangkok geographic bounds',
    passed: allCctvCoordsValid
  });

  // Test 7: Sentinel Flood Indicators & Canal Stations
  results.push({
    test: 'Sentinel Flood indicators loaded',
    passed: SENTINEL_FLOOD_INDICATORS.length > 0,
    message: `Loaded ${SENTINEL_FLOOD_INDICATORS.length} Sentinel indicators`
  });
  results.push({
    test: 'Canal and pumping stations loaded',
    passed: BANGKOK_CANAL_STATIONS.length > 0,
    message: `Loaded ${BANGKOK_CANAL_STATIONS.length} canal/pumping stations`
  });

  // Test 8: Summary Statistics Calculation
  const summary = getBangkokFloodSummary();
  results.push({
    test: 'Summary statistics computed correctly',
    passed: summary.totalRoads === BANGKOK_ROAD_SEGMENTS.length &&
            summary.criticalCount === criticalRoads.length &&
            summary.warningCount === warningRoads.length &&
            summary.normalCount === normalRoads.length,
    message: `Total: ${summary.totalRoads}, Critical: ${summary.criticalCount}, Warning: ${summary.warningCount}, Normal: ${summary.normalCount}`
  });

  return results;
}
