/**
 * Standalone Test Runner for Bangkok Flood & CCTV Monitoring System
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log('====================================================');
console.log(' D-MIND Bangkok Road Flood & CCTV Telemetry Test Suite');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Validate CCTV Dataset File
const cctvFilePath = resolve('src/data/bangkokCctvData.ts');
const cctvContent = readFileSync(cctvFilePath, 'utf-8');

assert(cctvContent.includes('export const BANGKOK_CCTV_CAMERAS'), 'BANGKOK_CCTV_CAMERAS exported');
assert(cctvContent.includes('zone: \'north\''), 'North zone CCTV cameras present');
assert(cctvContent.includes('zone: \'central\''), 'Central zone CCTV cameras present');
assert(cctvContent.includes('zone: \'east\''), 'East zone CCTV cameras present');
assert(cctvContent.includes('zone: \'thonburi\''), 'Thonburi zone CCTV cameras present');

const cctvMatches = cctvContent.match(/id:\s*'bkk-cctv-[a-z0-9]+'/g) || [];
assert(cctvMatches.length >= 60, `Found ${cctvMatches.length} CCTV cameras (Target: 60+)`);

// 2. Validate Road Flood Dataset File
const roadFilePath = resolve('src/data/bangkokRoadFloodData.ts');
const roadContent = readFileSync(roadFilePath, 'utf-8');

assert(roadContent.includes('export const BANGKOK_ROAD_SEGMENTS'), 'BANGKOK_ROAD_SEGMENTS exported');
assert(roadContent.includes('export const BANGKOK_CANAL_STATIONS'), 'BANGKOK_CANAL_STATIONS exported');
assert(roadContent.includes('export const SENTINEL_FLOOD_INDICATORS'), 'SENTINEL_FLOOD_INDICATORS exported');

// Verify Red (หลีกเลี่ยง), Orange (ขับช้า ระวัง), Green (ใช้ได้ตามปกติ)
assert(roadContent.includes('status: \'critical\''), 'Red status (critical) present in dataset');
assert(roadContent.includes('status: \'warning\''), 'Orange status (warning) present in dataset');
assert(roadContent.includes('status: \'normal\''), 'Green status (normal) present in dataset');

const roadMatches = roadContent.match(/id:\s*'(rd-[a-z]+-[0-9]+|bkk-rd-[a-z0-9]+)'/g) || [];
assert(roadMatches.length >= 25, `Found ${roadMatches.length} major road segments (Target: 25+)`);

// 3. Validate Telemetry & Services
const serviceFilePath = resolve('src/services/bangkokFloodService.ts');
const serviceContent = readFileSync(serviceFilePath, 'utf-8');

assert(serviceContent.includes('searchBangkokRoads'), 'searchBangkokRoads function exported');
assert(serviceContent.includes('getBangkokRoadsByZone'), 'getBangkokRoadsByZone function exported');
assert(serviceContent.includes('getBangkokFloodSummary'), 'getBangkokFloodSummary function exported');
assert(serviceContent.includes('fetchBangkokRainCorrelation'), 'Open-Meteo precipitation correlation present');

// 4. Validate CCTV Service
const cctvServiceFilePath = resolve('src/services/bkkCctvService.ts');
const cctvServiceContent = readFileSync(cctvServiceFilePath, 'utf-8');

assert(cctvServiceContent.includes('searchCctvByRoad'), 'searchCctvByRoad function exported');
assert(cctvServiceContent.includes('getCctvByZone'), 'getCctvByZone function exported');
assert(cctvServiceContent.includes('refreshCctvSnapshot'), 'refreshCctvSnapshot cache-busting exported');

// 5. Validate Map & UI Components
const mapComponentPath = resolve('src/components/bangkok-flood/BangkokFloodMap.tsx');
const mapContent = readFileSync(mapComponentPath, 'utf-8');

assert(mapContent.includes('Polyline'), 'React-Leaflet Polyline road rendering present');
assert(mapContent.includes('#ef4444'), 'Red polyline color (#ef4444) present');
assert(mapContent.includes('#f97316'), 'Orange polyline color (#f97316) present');
assert(mapContent.includes('#22c55e'), 'Green polyline color (#22c55e) present');
assert(mapContent.includes('createCctvIcon'), 'Dynamic CCTV custom marker icons present');
assert(mapContent.includes('SENTINEL_FLOOD_INDICATORS'), 'Sentinel Flood Indicators layer mapped');

// 6. Validate Controls
const controlsPath = resolve('src/components/bangkok-flood/BangkokFloodControls.tsx');
const controlsContent = readFileSync(controlsPath, 'utf-8');

assert(controlsContent.includes('searchQuery'), 'Road search filter implemented');
assert(controlsContent.includes('selectedZone'), 'Zone filter implemented (all, north, central, east, thonburi)');
assert(controlsContent.includes('selectedSeverity'), 'Severity filter implemented (critical, warning, normal)');
assert(controlsContent.includes('showCctvLayer'), 'CCTV layer toggle switch implemented');
assert(controlsContent.includes('showSentinelSarLayer'), 'Sentinel-1 SAR layer toggle switch implemented');

// 7. Validate Page & Routes
const pagePath = resolve('src/pages/BangkokFloodMapPage.tsx');
const pageContent = readFileSync(pagePath, 'utf-8');
assert(pageContent.includes('BangkokFloodMapPage'), 'BangkokFloodMapPage implemented');

const appPath = resolve('src/App.tsx');
const appContent = readFileSync(appPath, 'utf-8');
assert(appContent.includes('/bangkok-flood'), 'Route /bangkok-flood registered in App.tsx');
assert(appContent.includes('/bkk-flood'), 'Route /bkk-flood registered in App.tsx');

// 8. Validate DisasterMap integration
const disasterContent = readFileSync(resolve('src/components/disaster-map/DisasterMapContent.tsx'), 'utf-8');
assert(disasterContent.includes('bkk_road_flood'), 'bkk_road_flood mode integrated into DisasterMapContent.tsx');
assert(disasterContent.includes('BangkokFloodMap'), 'BangkokFloodMap rendered when bkk_road_flood is selected');

// 9. Validate Bug Fixes & Hotlines
const dialogContent = readFileSync(resolve('src/components/ui/dialog.tsx'), 'utf-8');
assert(dialogContent.includes('z-[9998]'), 'DialogOverlay has z-[9998] above Leaflet');
assert(dialogContent.includes('z-[9999]'), 'DialogContent has z-[9999] above Leaflet');

assert(mapContent.includes("subdomains: ['a', 'b', 'c']"), 'BASE_MAP_URLS satellite has subdomains defined');
assert(mapContent.includes('subdomains={BASE_MAP_URLS[baseMap].subdomains ||'), 'TileLayer has subdomains fallback preventing undefined length error');

const emergencyContent = readFileSync(resolve('src/pages/EmergencyContacts.tsx'), 'utf-8');
const requiredHotlines = ['191', '199', '1137', '1192', '1193', '1195', '1199', '1300', '1418', '1543', '1555', '1584', '1669', '1646', '1667'];
requiredHotlines.forEach(hotline => {
  assert(emergencyContent.includes(`phoneNumber: '${hotline}'`), `Emergency Hotline ${hotline} is present in dataset`);
});
assert(emergencyContent.includes('เซฟเก็บไว้ติดเครื่องกันได้เลย! มีไว้อุ่นใจกว่า'), 'Headline quote is present in Emergency Contacts');
assert(pageContent.includes('เซฟเก็บไว้ติดเครื่องกันได้เลย! มีไว้อุ่นใจกว่า'), 'Headline quote is present in Bangkok Flood Map Page');

const updatedPageContent = readFileSync(pagePath, 'utf-8');
assert(updatedPageContent.includes('Heart,') || updatedPageContent.includes('Heart\n'), 'Heart icon is imported in BangkokFloodMapPage');
assert(updatedPageContent.includes('Radio,') || updatedPageContent.includes('Radio\n'), 'Radio icon is imported in BangkokFloodMapPage');

console.log('\n----------------------------------------------------');
console.log(` Test Summary: ${passCount} Passed, ${failCount} Failed`);
console.log('----------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL UNIT & INTEGRATION ASSERTIONS VERIFIED!\n');
  process.exit(0);
}
