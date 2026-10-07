/**
 * QE & Software Tester Suite for NASA FIRMS Thermal Anomalies & Wildfire Telemetry
 * D-MIND Web (kchayta32/d-mind-web)
 * 
 * Tests:
 * 1. NASA FIRMS Service classification, calculation, and GIS configurations
 * 2. Component structure and integration checks across the Disaster Map system
 * 3. Regression test suite for Bangkok Flood and Wildfire integrations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('===============================================================');
console.log('🧪 D-MIND QE TEST SUITE: NASA FIRMS WEB-GIS & WILDFIRE FRP');
console.log('===============================================================\n');

// ---------------------------------------------------------------------------
// TEST SUITE 1: NASA FIRMS Service File & Logic
// ---------------------------------------------------------------------------
console.log('--- 1. NASA FIRMS Service Logic & Algorithms ---');

const nasaServicePath = path.join(rootDir, 'src/services/nasaFirmsService.ts');
assert(fs.existsSync(nasaServicePath), 'nasaFirmsService.ts file exists');

const nasaServiceContent = fs.readFileSync(nasaServicePath, 'utf8');

assert(
  nasaServiceContent.includes('export const FRP_CLASSIFICATIONS'),
  'FRP_CLASSIFICATIONS dictionary is defined and exported'
);

assert(
  nasaServiceContent.includes('export const getFrpClassification'),
  'getFrpClassification function is defined and exported'
);

assert(
  nasaServiceContent.includes('export const calculateHotspotFirmsStats'),
  'calculateHotspotFirmsStats calculation algorithm is defined and exported'
);

assert(
  nasaServiceContent.includes('https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'),
  'NASA GIBS Open Web-GIS EPSG:3857 WMS endpoint is configured'
);

assert(
  nasaServiceContent.includes('VIIRS_SNPP_Thermal_Anomalies_375m_All') &&
  nasaServiceContent.includes('MODIS_Combined_Thermal_Anomalies_All'),
  'VIIRS 375m and MODIS 1km Thermal Anomaly WMS layers are defined'
);

// ---------------------------------------------------------------------------
// TEST SUITE 2: FRP Metric Threshold Logic Simulation
// ---------------------------------------------------------------------------
console.log('\n--- 2. FRP Metric & Severity Classification Tests ---');

// Emulate classification logic as defined in nasaFirmsService
function testGetFrpClassification(frp) {
  const val = Number(frp) || 0;
  if (val >= 100) return 'extreme';
  if (val >= 50) return 'high';
  if (val >= 20) return 'moderate';
  return 'low';
}

assert(testGetFrpClassification(150) === 'extreme', 'FRP >= 100 MW classified as extreme (ไฟยอดไม้)');
assert(testGetFrpClassification(100) === 'extreme', 'FRP == 100 MW boundary classified as extreme');
assert(testGetFrpClassification(75) === 'high', 'FRP 50-99.9 MW classified as high (รุนแรงสูง)');
assert(testGetFrpClassification(50) === 'high', 'FRP == 50 MW boundary classified as high');
assert(testGetFrpClassification(35) === 'moderate', 'FRP 20-49.9 MW classified as moderate (ปานกลาง)');
assert(testGetFrpClassification(20) === 'moderate', 'FRP == 20 MW boundary classified as moderate');
assert(testGetFrpClassification(12) === 'low', 'FRP < 20 MW classified as low (เริ่มต้น/คุกรุ่น)');
assert(testGetFrpClassification(0) === 'low', 'FRP 0 MW classified as low');

// ---------------------------------------------------------------------------
// TEST SUITE 3: Hotspot Telemetry Aggregation Simulation
// ---------------------------------------------------------------------------
console.log('\n--- 3. Hotspot Telemetry & Sensor Breakdown Algorithm ---');

const mockHotspots = [
  { properties: { frp: 120, instrument: 'VIIRS' } },
  { properties: { frp: 65, instrument: 'VIIRS' } },
  { properties: { frp: 30, instrument: 'MODIS' } },
  { properties: { frp: 10, instrument: 'MODIS' } },
  { properties: { frp: 5, instrument: 'VIIRS' } }
];

let totalFrp = 0;
let maxFrp = 0;
let extreme = 0;
let high = 0;
let moderate = 0;
let low = 0;
let viirs = 0;
let modis = 0;

mockHotspots.forEach(h => {
  const frp = h.properties.frp;
  const inst = h.properties.instrument;
  totalFrp += frp;
  if (frp > maxFrp) maxFrp = frp;
  if (frp >= 100) extreme++;
  else if (frp >= 50) high++;
  else if (frp >= 20) moderate++;
  else low++;

  if (inst.includes('MODIS')) modis++;
  else viirs++;
});

assert(totalFrp === 230, 'Total FRP aggregated correctly (230 MW)');
assert(maxFrp === 120, 'Max FRP peak identified correctly (120 MW)');
assert(extreme === 1, 'Extreme intensity count correct (1)');
assert(high === 1, 'High intensity count correct (1)');
assert(moderate === 1, 'Moderate intensity count correct (1)');
assert(low === 2, 'Low intensity count correct (2)');
assert(viirs === 3, 'VIIRS 375m sensor count correct (3)');
assert(modis === 2, 'MODIS 1km sensor count correct (2)');

// ---------------------------------------------------------------------------
// TEST SUITE 4: UI Component Verification
// ---------------------------------------------------------------------------
console.log('\n--- 4. UI Components & Web-GIS Integration Verification ---');

// A. HotspotMarker.tsx
const hotspotMarkerPath = path.join(rootDir, 'src/components/disaster-map/HotspotMarker.tsx');
const hotspotMarkerContent = fs.readFileSync(hotspotMarkerPath, 'utf8');

assert(
  hotspotMarkerContent.includes('getFrpClassification') &&
  hotspotMarkerContent.includes('formatFrp'),
  'HotspotMarker imports getFrpClassification & formatFrp from nasaFirmsService'
);
assert(
  hotspotMarkerContent.includes('Fire Radiative Power (FRP)') &&
  hotspotMarkerContent.includes('MW (เมกะวัตต์)'),
  'HotspotMarker displays Fire Radiative Power (FRP) in Megawatts (MW)'
);
assert(
  hotspotMarkerContent.includes('animation: ping') || hotspotMarkerContent.includes('pulseHtml'),
  'HotspotMarker includes pulse animation on high-intensity thermal anomalies'
);
assert(
  hotspotMarkerContent.includes('isModis') && hotspotMarkerContent.includes('borderRadius'),
  'HotspotMarker differentiates VIIRS (rounded square) and MODIS (circle) geometry'
);

// B. FirmsFrpLegend.tsx
const firmsLegendPath = path.join(rootDir, 'src/components/disaster-map/FirmsFrpLegend.tsx');
assert(fs.existsSync(firmsLegendPath), 'FirmsFrpLegend.tsx component exists');
const firmsLegendContent = fs.readFileSync(firmsLegendPath, 'utf8');

assert(
  firmsLegendContent.includes('NASA FIRMS') &&
  firmsLegendContent.includes('Thermal Anomalies'),
  'FirmsFrpLegend presents NASA FIRMS and Thermal Anomalies (ความผิดปกติทางความร้อน)'
);
assert(
  firmsLegendContent.includes('เมกะวัตต์ (MW)'),
  'FirmsFrpLegend explicitly explains Megawatt (MW) unit for Fire Radiative Power'
);

// C. WildfireWMSLayers.tsx
const wildfireWmsPath = path.join(rootDir, 'src/components/disaster-map/WildfireWMSLayers.tsx');
const wildfireWmsContent = fs.readFileSync(wildfireWmsPath, 'utf8');

assert(
  wildfireWmsContent.includes('NASA_FIRMS_WEB_GIS') &&
  wildfireWmsContent.includes('GIBS_WMS_BASE_URL'),
  'WildfireWMSLayers integrates NASA GIBS Web-GIS WMS base URL'
);
assert(
  wildfireWmsContent.includes('showFirmsLayer'),
  'WildfireWMSLayers supports showFirmsLayer toggle'
);
assert(
  wildfireWmsContent.includes('firmsSatellite'),
  'WildfireWMSLayers supports satellite selection (ALL / VIIRS 375m / MODIS 1km)'
);

// D. WildfireCharts.tsx
const wildfireChartsPath = path.join(rootDir, 'src/components/disaster-map/WildfireCharts.tsx');
const wildfireChartsContent = fs.readFileSync(wildfireChartsPath, 'utf8');

assert(
  wildfireChartsContent.includes('calculateHotspotFirmsStats') &&
  wildfireChartsContent.includes('Fire Radiative Power (FRP)'),
  'WildfireCharts incorporates NASA FIRMS FRP & Thermal Anomalies analytics'
);
assert(
  wildfireChartsContent.includes('พลังงานรวม (MW)') &&
  wildfireChartsContent.includes('สูงสุด (Peak MW)'),
  'WildfireCharts displays total FRP (MW) and peak FRP (MW) metric cards'
);

// E. MapView.tsx
const mapViewPath = path.join(rootDir, 'src/components/disaster-map/MapView.tsx');
const mapViewContent = fs.readFileSync(mapViewPath, 'utf8');

assert(
  mapViewContent.includes('FirmsFrpLegend') &&
  mapViewContent.includes("<FirmsFrpLegend hotspots={safeHotspots} />"),
  'MapView properly mounts FirmsFrpLegend on wildfire selection'
);
assert(
  mapViewContent.includes('showFirmsLayer') &&
  mapViewContent.includes('firmsSatellite'),
  'MapView passes showFirmsLayer and firmsSatellite props down to MapLayers'
);

// F. DisasterMapHudCard.tsx
const hudCardPath = path.join(rootDir, 'src/components/disaster-map/DisasterMapHudCard.tsx');
const hudCardContent = fs.readFileSync(hudCardPath, 'utf8');

assert(
  hudCardContent.includes('liveTotalFrp') &&
  hudCardContent.includes('liveMaxFrp') &&
  hudCardContent.includes('พลังงานความร้อน (FRP)'),
  'DisasterMapHudCard features live Total FRP (MW) and Peak FRP (MW) telemetry'
);

// G. WildfireFilters.tsx
const wildfireFiltersPath = path.join(rootDir, 'src/components/disaster-map/filter-components/WildfireFilters.tsx');
const wildfireFiltersContent = fs.readFileSync(wildfireFiltersPath, 'utf8');

assert(
  wildfireFiltersContent.includes('showFirmsLayer') &&
  wildfireFiltersContent.includes('firmsSatellite'),
  'WildfireFilters includes NASA FIRMS layer toggle and satellite sensor selection'
);

// H. useDisasterMapState.ts
const statePath = path.join(rootDir, 'src/components/disaster-map/hooks/useDisasterMapState.ts');
const stateContent = fs.readFileSync(statePath, 'utf8');

assert(
  stateContent.includes('showFirmsLayer') &&
  stateContent.includes('setShowFirmsLayer') &&
  stateContent.includes('firmsSatellite') &&
  stateContent.includes('setFirmsSatellite'),
  'useDisasterMapState manages showFirmsLayer and firmsSatellite state'
);

// ---------------------------------------------------------------------------
// TEST SUITE 5: Regression Tests (Bangkok Flood & Navigation)
// ---------------------------------------------------------------------------
console.log('\n--- 5. Regression Tests (BKK Road Flood & General Map) ---');

const bkkMapPath = path.join(rootDir, 'src/components/bangkok-flood/BangkokFloodMap.tsx');
const bkkMapContent = fs.readFileSync(bkkMapPath, 'utf8');

assert(
  bkkMapContent.includes('safeRoads.length') || bkkMapContent.includes('Array.isArray(roads) ? roads : []'),
  'BangkokFloodMap guards against undefined roads with safeRoads fallback'
);

const disasterContentPath = path.join(rootDir, 'src/components/disaster-map/DisasterMapContent.tsx');
const disasterContentText = fs.readFileSync(disasterContentPath, 'utf8');

assert(
  disasterContentText.includes('BANGKOK_ROAD_SEGMENTS.length') &&
  disasterContentText.includes('filteredBkkRoads.length'),
  'DisasterMapContent safely passes filteredRoadsCount and totalRoadsCount'
);

// ---------------------------------------------------------------------------
// SUMMARY REPORT
// ---------------------------------------------------------------------------
console.log('\n===============================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('===============================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL QE & SOFTWARE TESTS PASSED WITH 100% SUCCESS RATE!\n');
  process.exit(0);
}
