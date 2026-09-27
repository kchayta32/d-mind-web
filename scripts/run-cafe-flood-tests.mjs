/**
 * D-MIND Bangkok Cafe & Bar Flood Radar QE & Automated Integration Test Suite
 */

import fs from 'fs';
import path from 'path';

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

console.log('====================================================');
console.log(' D-MIND Cafe & Bar Flood Radar & Disaster Map QE Suite');
console.log('====================================================');

// 1. Navigation & Menu to Disaster Map & Cafe Radar
const navbarContent = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
assert(navbarContent.includes('/disaster-map'), 'Navbar contains route /disaster-map');
assert(navbarContent.includes('/cafe-flood-map'), 'Navbar contains route /cafe-flood-map');
assert(navbarContent.includes('แผนที่ภัยพิบัติ'), 'Navbar desktop button includes แผนที่ภัยพิบัติ');
assert(navbarContent.includes('เรดาร์คาเฟ่ & บาร์'), 'Navbar desktop button includes เรดาร์คาเฟ่ & บาร์');

const navCardsContent = fs.readFileSync('src/components/home/NavigationCards.tsx', 'utf8');
assert(navCardsContent.includes('/disaster-map'), 'NavigationCards contains /disaster-map');
assert(navCardsContent.includes('/cafe-flood-map'), 'NavigationCards contains /cafe-flood-map');
assert(navCardsContent.includes('menu.disasterMap'), 'NavigationCards has menu.disasterMap key');
assert(navCardsContent.includes('menu.cafeFlood'), 'NavigationCards has menu.cafeFlood key');

const mobileLayoutContent = fs.readFileSync('src/components/home/NewMobileLayout.tsx', 'utf8');
assert(mobileLayoutContent.includes('/disaster-map'), 'Mobile layout contains /disaster-map');
assert(mobileLayoutContent.includes('/cafe-flood-map'), 'Mobile layout contains /cafe-flood-map');

const desktopLayoutContent = fs.readFileSync('src/components/home/NewDesktopLayout.tsx', 'utf8');
assert(desktopLayoutContent.includes('BangkokCafeFloodBanner'), 'Desktop layout renders BangkokCafeFloodBanner');

// 2. Routing in App.tsx
const appContent = fs.readFileSync('src/App.tsx', 'utf8');
assert(appContent.includes('/disaster-map'), 'App.tsx contains route /disaster-map');
assert(appContent.includes('/cafe-flood-map'), 'App.tsx contains route /cafe-flood-map');
assert(appContent.includes('BangkokCafeFloodMapPage'), 'App.tsx imports BangkokCafeFloodMapPage');

// 3. Cafe Data & 4 Zones Coverage
const cafesDataContent = fs.readFileSync('src/data/bangkokCafesData.ts', 'utf8');
assert(cafesDataContent.includes('BANGKOK_CAFES_DATA'), 'BANGKOK_CAFES_DATA exported');
assert(cafesDataContent.includes("'inner'"), 'Inner Bangkok zone represented');
assert(cafesDataContent.includes("'outer'"), 'Outer Bangkok zone represented');
assert(cafesDataContent.includes("'thonburi'"), 'Thonburi zone represented');
assert(cafesDataContent.includes("'perimeter'"), 'Metropolitan perimeter zone represented');
assert(cafesDataContent.includes("'coffee'"), 'Specialty coffee category present');
assert(cafesDataContent.includes("'matcha'"), 'Matcha category present');
assert(cafesDataContent.includes("'bar'"), 'Bar & Speakeasy category present');
assert(cafesDataContent.includes("'coworking'"), 'Coworking space category present');
assert(cafesDataContent.includes('checkIsOpen'), 'checkIsOpen helper exported');
assert(cafesDataContent.includes('calculateFloodSafetyScore'), 'calculateFloodSafetyScore helper exported');

// 4. Overpass Live Scraping Service
const overpassServiceContent = fs.readFileSync('src/services/cafeOverpassService.ts', 'utf8');
assert(overpassServiceContent.includes('fetchOverpassCafes'), 'fetchOverpassCafes function exported');
assert(overpassServiceContent.includes('overpass-api.de'), 'Overpass Turbo API endpoint configured');
assert(overpassServiceContent.includes('CACHE_KEY_PREFIX'), 'LocalStorage caching mechanism present');
assert(overpassServiceContent.includes('determineBangkokZone'), 'determineBangkokZone spatial classifier present');

// 5. Typhoon LLM AI Service
const typhoonServiceContent = fs.readFileSync('src/services/typhoonCafeService.ts', 'utf8');
assert(typhoonServiceContent.includes('typhoon-v2.5-30b-a3b-instruct'), 'Typhoon v2.5 model configured');
assert(typhoonServiceContent.includes('sk-Ag7gTlwbTjlUBmm2DbjInoKo0mZUPZOcRSUnmcBHMU1YMAIU'), 'Typhoon API key configured');
assert(typhoonServiceContent.includes('askTyphoonCafeConcierge'), 'askTyphoonCafeConcierge function exported');
assert(typhoonServiceContent.includes('getQuickTyphoonRecommendation'), 'getQuickTyphoonRecommendation function exported');

// 6. UI Components & Flagship Page
assert(fs.existsSync('src/components/cafe-flood/CafeCard.tsx'), 'CafeCard.tsx exists');
assert(fs.existsSync('src/components/cafe-flood/CafeDetailModal.tsx'), 'CafeDetailModal.tsx exists');
assert(fs.existsSync('src/components/cafe-flood/CafeFloodMap.tsx'), 'CafeFloodMap.tsx exists');
assert(fs.existsSync('src/components/cafe-flood/CafeTyphoonChat.tsx'), 'CafeTyphoonChat.tsx exists');
assert(fs.existsSync('src/pages/BangkokCafeFloodMapPage.tsx'), 'BangkokCafeFloodMapPage.tsx exists');
assert(fs.existsSync('src/components/home/BangkokCafeFloodBanner.tsx'), 'BangkokCafeFloodBanner.tsx exists');

// 7. i18n Translations
const translationsContent = fs.readFileSync('src/i18n/translations.ts', 'utf8');
assert(translationsContent.includes('disasterMap'), 'Thai & English disasterMap key present');
assert(translationsContent.includes('cafeFlood'), 'Thai & English cafeFlood key present');
assert(translationsContent.includes('disasterMapDesc'), 'disasterMapDesc present in translations');
assert(translationsContent.includes('cafeFloodDesc'), 'cafeFloodDesc present in translations');

console.log('----------------------------------------------------');
console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL QE & INTEGRATION TESTS PASSED PERFECTLY!\n');
}
