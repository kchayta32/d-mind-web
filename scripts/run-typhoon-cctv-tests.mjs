import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log(' D-MIND Bangkok CCTV Live Stream & Typhoon AI Suite');
console.log('====================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Verify CCTV Data & Live Streams
const cctvDataFile = fs.readFileSync('src/data/bangkokCctvData.ts', 'utf8');
assert(cctvDataFile.includes('youtubeVideoId?: string'), 'BangkokCctvCamera interface has youtubeVideoId');
assert(cctvDataFile.includes('officialPortalUrl?: string'), 'BangkokCctvCamera interface has officialPortalUrl');
assert(!cctvDataFile.includes('photo-1545459720-aac8509eb02c'), 'SNAPSHOT_PRESETS does not contain parking lot photo');
assert(cctvDataFile.includes('https://images.unsplash.com/photo-1508009603885-50cf7c579365'), 'SNAPSHOT_PRESETS includes authentic Sukhumvit traffic photo');

// 2. Verify data.go.th service
const dataGoThFile = fs.readFileSync('src/services/dataGoThService.ts', 'utf8');
assert(!dataGoThFile.includes('photo-1545459720-aac8509eb02c'), 'ROAD_SNAPSHOT_POOL does not contain parking lot photo');
assert(dataGoThFile.includes('BMA_STREAM_IDS'), 'data.go.th service assigns live stream IDs');

// 3. Verify BangkokCctvModal
const cctvModalFile = fs.readFileSync('src/components/bangkok-flood/BangkokCctvModal.tsx', 'utf8');
assert(cctvModalFile.includes('iframe'), 'BangkokCctvModal renders iframe for live video');
assert(cctvModalFile.includes('BANGKOK_LIVE_CHANNELS'), 'BangkokCctvModal has Bangkok live webcam channels');
assert(cctvModalFile.includes('activeTab'), 'BangkokCctvModal supports switching between stream and snapshot');
assert(cctvModalFile.includes('GIhc9Fm1OJU'), 'BangkokCctvModal includes Asoke 24/7 Live Stream channel');
assert(cctvModalFile.includes('onAskTyphoonAboutCctv'), 'BangkokCctvModal connects to Typhoon AI concierge');
assert(cctvModalFile.includes('http://www.bmatraffic.com/index.aspx'), 'BangkokCctvModal links to official BMA traffic portal');

// 4. Verify Typhoon Flood AI Service
const typhoonFloodFile = fs.readFileSync('src/services/typhoonFloodService.ts', 'utf8');
assert(typhoonFloodFile.includes('typhoon-v2.5-30b-a3b-instruct'), 'Typhoon flood service uses v2.5-30b model');
assert(typhoonFloodFile.includes('VEHICLE_PROFILES'), 'Typhoon flood service defines vehicle profiles with clearances');
assert(typhoonFloodFile.includes('askTyphoonFloodConcierge'), 'askTyphoonFloodConcierge function exported');
assert(typhoonFloodFile.includes('getRoadFloodAiAnalysis'), 'getRoadFloodAiAnalysis function exported');
assert(typhoonFloodFile.includes('generateRuleBasedFloodAdvice'), 'Robust fallback flood advice generator present');

// 5. Verify BangkokFloodTyphoonConcierge Component
const conciergeFile = fs.readFileSync('src/components/bangkok-flood/BangkokFloodTyphoonConcierge.tsx', 'utf8');
assert(conciergeFile.includes('QUICK_PROMPT_CHIPS'), 'Typhoon Concierge defines 1-click quick prompt chips');
assert(conciergeFile.includes('selectedVehicle'), 'Typhoon Concierge allows selecting vehicle profile');
assert(conciergeFile.includes('askTyphoonFloodConcierge'), 'Typhoon Concierge calls Typhoon service');

// 6. Verify BangkokFloodMapPage Integration
const floodPageFile = fs.readFileSync('src/pages/BangkokFloodMapPage.tsx', 'utf8');
assert(floodPageFile.includes('BangkokFloodTyphoonConcierge'), 'BangkokFloodMapPage imports Typhoon Concierge');
assert(floodPageFile.includes('typhoon-ai-concierge'), 'BangkokFloodMapPage renders Typhoon Concierge section');
assert(floodPageFile.includes('onAskTyphoonAboutRoad'), 'BangkokFloodMapPage wires road detail modal to Typhoon AI');
assert(floodPageFile.includes('onAskTyphoonAboutCctv'), 'BangkokFloodMapPage wires CCTV modal to Typhoon AI');

// 7. Verify Index CSS Tooltip & Popup Contrast Overrides
const cssFile = fs.readFileSync('src/index.css', 'utf8');
assert(cssFile.includes('.leaflet-dark-tooltip'), 'index.css defines .leaflet-dark-tooltip high contrast rules');
assert(cssFile.includes('.leaflet-tooltip'), 'index.css overrides default .leaflet-tooltip');

console.log('----------------------------------------------------');
console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BANGKOK CCTV & TYPHOON AI TESTS PASSED PERFECTLY!\n');
}
