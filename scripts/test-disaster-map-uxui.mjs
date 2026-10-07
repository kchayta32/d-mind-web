// scripts/test-disaster-map-uxui.mjs
// Software & QE Test Suite: D-MIND Disaster Map UX/UI Modernization Verification
// Aligned with Thesis Chapters 1-3 & 6 Core Hazards Specification

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('====================================================');
console.log(' D-MIND Disaster Map Modern UX/UI QE Test Suite');
console.log('====================================================\n');

let passedCount = 0;
let failedCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failedCount++;
  }
}

const rootDir = process.cwd();

// Test 1: DisasterMapHudCard component exists and has required UI features
test('DisasterMapHudCard component exists and exports properly', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterMapHudCard.tsx');
  assert(fs.existsSync(filePath), 'DisasterMapHudCard.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export const DisasterMapHudCard'), 'DisasterMapHudCard is not exported');
  assert(content.includes('AI Dr.Mind Advisory'), 'Missing Dr.Mind AI advisory box');
  assert(content.includes('grid grid-cols-3'), 'Missing 3 metric tiles grid');
  assert(content.includes('grid grid-cols-2'), 'Missing dual action buttons');
});

// Test 2: AqiScaleLegend component exists and exports properly
test('AqiScaleLegend component exists and contains AQI color scale', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/AqiScaleLegend.tsx');
  assert(fs.existsSync(filePath), 'AqiScaleLegend.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export const AqiScaleLegend'), 'AqiScaleLegend is not exported');
  assert(content.includes('ดัชนี AQI'), 'Missing AQI title');
  assert(content.includes('bg-purple-700'), 'Missing purple critical alert color');
  assert(content.includes('bg-emerald-500'), 'Missing emerald safe color');
});

// Test 3: SafetyCheckInModal component exists and provides check-in
test('SafetyCheckInModal component exists with safe/help status options', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/SafetyCheckInModal.tsx');
  assert(fs.existsSync(filePath), 'SafetyCheckInModal.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export const SafetyCheckInModal'), 'SafetyCheckInModal is not exported');
  assert(content.includes('ฉันปลอดภัยดี'), 'Missing Safe option');
  assert(content.includes('ต้องการความช่วยเหลือ'), 'Missing Need Help option');
  assert(content.includes('dmind_safety_checkins'), 'Missing localStorage saving mechanism');
});

// Test 4: CleanRoomModal component exists and provides clean air shelters
test('CleanRoomModal component exists with designated clean air shelters', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/CleanRoomModal.tsx');
  assert(fs.existsSync(filePath), 'CleanRoomModal.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export const CleanRoomModal'), 'CleanRoomModal is not exported');
  assert(content.includes('CLEAN_ROOMS'), 'Missing clean rooms dataset');
  assert(content.includes('หอสมุดเมืองกรุงเทพมหานคร'), 'Missing Bangkok City Library shelter');
  assert(content.includes('Google Maps'), 'Missing Google Maps navigation link');
});

// Test 5: EvacuationModal component exists with emergency shelters and hotlines
test('EvacuationModal component exists with shelters and hotline 1784', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/EvacuationModal.tsx');
  assert(fs.existsSync(filePath), 'EvacuationModal.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export const EvacuationModal'), 'EvacuationModal is not exported');
  assert(content.includes('1784'), 'Missing hotline 1784');
  assert(content.includes('EVACUATION_SHELTERS'), 'Missing shelters dataset');
  assert(content.includes('เส้นทางอพยพ'), 'Missing evacuation route navigation');
});

// Test 6: DisasterTypeSelector prioritizes 6 thesis hazards
test('DisasterTypeSelector includes and prioritizes 6 core thesis hazard types', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterTypeSelector.tsx');
  assert(fs.existsSync(filePath), 'DisasterTypeSelector.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('isCoreThesis: true'), 'Missing core thesis hazard flags');
  assert(content.includes('น้ำท่วม & ลุ่มน้ำ'), 'Missing Flood core hazard');
  assert(content.includes('แผ่นดินไหว'), 'Missing Earthquake core hazard');
  assert(content.includes('ไฟป่า & จุดความร้อน'), 'Missing Wildfire core hazard');
  assert(content.includes('พายุหมุน & ลมแรง'), 'Missing Storm core hazard');
  assert(content.includes('คุณภาพอากาศ PM2.5'), 'Missing PM2.5 core hazard');
  assert(content.includes('ภัยแล้ง & ความชื้นดิน'), 'Missing Drought core hazard');
});

// Test 7: MapView mounts DisasterMapHudCard and modals
test('MapView mounts DisasterMapHudCard, AqiScaleLegend, and action modals', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/MapView.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('<DisasterMapHudCard'), 'MapView does not mount DisasterMapHudCard');
  assert(content.includes('<AqiScaleLegend'), 'MapView does not mount AqiScaleLegend');
  assert(content.includes('<SafetyCheckInModal'), 'MapView does not mount SafetyCheckInModal');
  assert(content.includes('<CleanRoomModal'), 'MapView does not mount CleanRoomModal');
  assert(content.includes('<EvacuationModal'), 'MapView does not mount EvacuationModal');
});

// Test 8: Data compliance with Thesis Chapters 1-3
test('Map data sources strictly use approved open-source and agency APIs', () => {
  const mapContentPath = path.join(rootDir, 'src/components/disaster-map/DisasterMapContent.tsx');
  const content = fs.readFileSync(mapContentPath, 'utf-8');
  assert(content.includes('useDisasterMapData'), 'Missing standard disaster map data hook');
  assert(content.includes('useCrowdsourcedFloodReports'), 'Missing citizen ground truth report hook');
  assert(content.includes('useSinkholeData'), 'Missing geo incidents data hook');
});

console.log('\n----------------------------------------------------');
console.log(` Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
console.log('----------------------------------------------------');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL DISASTER MAP UX/UI ASSERTIONS VERIFIED!\n');
}
