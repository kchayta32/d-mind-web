// scripts/test-typhoon-disaster-ai.mjs
// Software & QE Test Suite: Typhoon AI Disaster Map Integration & Modern UX/UI Verification

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('====================================================');
console.log(' D-MIND Typhoon AI Disaster Map QE Test Suite');
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

// Test 1: Service exists with all algorithms and Typhoon model
test('Typhoon Disaster Service exists and contains core intelligence functions', () => {
  const filePath = path.join(rootDir, 'src/services/typhoonDisasterService.ts');
  assert(fs.existsSync(filePath), 'typhoonDisasterService.ts does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('typhoon-v2.5-30b-a3b-instruct'), 'Missing Typhoon-v2.5-30b model specification');
  assert(content.includes('export function calculateDisasterThreatScore'), 'Missing calculateDisasterThreatScore function');
  assert(content.includes('export async function generateTyphoonDisasterReport'), 'Missing generateTyphoonDisasterReport function');
  assert(content.includes('export async function askTyphoonDisasterChat'), 'Missing askTyphoonDisasterChat function');
  assert(content.includes('DISASTER_HOTLINES'), 'Missing disaster hotlines mapping');
});

// Test 2: Threat score algorithm verification
test('calculateDisasterThreatScore algorithm returns proper scores and levels', async () => {
  const { calculateDisasterThreatScore } = await import('../src/services/typhoonDisasterService.ts');
  
  // Critical earthquake
  const eqCritical = calculateDisasterThreatScore({ disasterType: 'earthquake', maxEarthquakeMagnitude: 7.2 });
  assert.strictEqual(eqCritical.level, 'critical', 'M7.2 earthquake should be critical');
  assert(eqCritical.score >= 80, 'Score should be >= 80');

  // Hazardous PM2.5
  const airCrit = calculateDisasterThreatScore({ disasterType: 'airpollution', maxPm25: 180 });
  assert.strictEqual(airCrit.level, 'critical', 'PM2.5 180 should be critical');

  // Moderate wildfire
  const fireMod = calculateDisasterThreatScore({ disasterType: 'wildfire', hotspotsCount: 35 });
  assert.strictEqual(fireMod.level, 'warning', '35 hotspots should be warning');
});

// Test 3: TyphoonDisasterModal component exists with dual tabs & Markdown renderer
test('TyphoonDisasterModal component exists with Situation Report and Live Q&A', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/TyphoonDisasterModal.tsx');
  assert(fs.existsSync(filePath), 'TyphoonDisasterModal.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('export const TyphoonDisasterModal'), 'TyphoonDisasterModal is not exported');
  assert(content.includes('TyphoonMarkdownRenderer'), 'Missing TyphoonMarkdownRenderer integration');
  assert(content.includes('รายงานสถานการณ์สด (AI Report)'), 'Missing Situation Report tab');
  assert(content.includes('ถาม-ตอบ Typhoon AI (Live Q&A)'), 'Missing Live Q&A tab');
  assert(content.includes('สิ่งที่ควรทำทันที (Actionable Do\'s)'), 'Missing DOs checklist');
  assert(content.includes('สิ่งที่ห้ามทำเด็ดขาด (Critical Don\'ts)'), 'Missing DONTs checklist');
  assert(content.includes('สายด่วนช่วยเหลือฉุกเฉินสำหรับเหตุการณ์นี้'), 'Missing emergency hotlines list');
  assert(content.includes('คำถามแนะนำ:'), 'Missing quick prompt chips');
});

// Test 4: DisasterTypeSelector modern features
test('DisasterTypeSelector includes Typhoon AI quick action and category filters', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterTypeSelector.tsx');
  assert(fs.existsSync(filePath), 'DisasterTypeSelector.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('Typhoon AI วิเคราะห์ด่วน'), 'Missing Typhoon AI quick action button');
  assert(content.includes('6 ภัยหลัก (วิทยานิพนธ์)'), 'Missing 6 core thesis filter tab');
  assert(content.includes('เรดาร์ & กทม.'), 'Missing radar & Bangkok filter tab');
  assert(content.includes('onToggleFullMapMode'), 'Missing full map mode toggle prop');
});

// Test 5: DisasterMapHudCard includes interactive Typhoon AI analysis button
test('DisasterMapHudCard integrates interactive Typhoon AI analysis', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterMapHudCard.tsx');
  assert(fs.existsSync(filePath), 'DisasterMapHudCard.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('onOpenTyphoonModal'), 'Missing onOpenTyphoonModal prop');
  assert(content.includes('เปิดบทวิเคราะห์ & ถาม-ตอบด้วย Typhoon AI'), 'Missing Typhoon AI button in HUD card');
});

// Test 6: DisasterSummaryBanner includes Typhoon AI quick action
test('DisasterSummaryBanner integrates Typhoon AI alert trigger', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterSummaryBanner.tsx');
  assert(fs.existsSync(filePath), 'DisasterSummaryBanner.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('onOpenTyphoonModal'), 'Missing onOpenTyphoonModal prop');
  assert(content.includes('Typhoon AI วิเคราะห์ด่วน'), 'Missing Typhoon AI button in Alert Banner');
});

// Test 7: MapView includes floating Typhoon AI button and mounts modals
test('MapView includes floating Typhoon AI trigger and passes callbacks', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/MapView.tsx');
  assert(fs.existsSync(filePath), 'MapView.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('onOpenTyphoonModal'), 'Missing onOpenTyphoonModal prop in MapView');
  assert(content.includes('Typhoon AI'), 'Missing floating Typhoon AI button');
  assert(content.includes('วิเคราะห์สด'), 'Missing live analysis indicator');
});

// Test 8: DisasterMapContent orchestrates full-screen mode and TyphoonDisasterModal
test('DisasterMapContent supports full-screen map mode and mounts TyphoonDisasterModal', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterMapContent.tsx');
  assert(fs.existsSync(filePath), 'DisasterMapContent.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('TyphoonDisasterModal'), 'TyphoonDisasterModal is not imported or mounted');
  assert(content.includes('liveTelemetry'), 'Missing live telemetry aggregation');
  assert(content.includes('isFullMapMode'), 'Missing isFullMapMode support');
  assert(content.includes('เปิดแถบข้อมูลสถิติ (Analytics Panel)'), 'Missing restore analytics button');
});

// Test 9: DisasterMapSidebar has Typhoon AI badge and dark mode compatibility
test('DisasterMapSidebar has Typhoon AI badge and dark theme tokens', () => {
  const filePath = path.join(rootDir, 'src/components/disaster-map/DisasterMapSidebar.tsx');
  assert(fs.existsSync(filePath), 'DisasterMapSidebar.tsx does not exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('Typhoon AI Intelligence'), 'Missing Typhoon AI badge in sidebar');
  assert(content.includes('dark:bg-slate-900'), 'Missing dark theme background');
});

console.log('----------------------------------------------------');
console.log(` Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
console.log('----------------------------------------------------\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TYPHOON DISASTER AI & MODERN UX/UI ASSERTIONS VERIFIED!\n');
}
