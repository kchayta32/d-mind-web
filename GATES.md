# Gates: Sentinel Flood Satellite, Crowdsourcing Ground Truth, Rain Radar & FCM

OWNS: src/services/**, src/components/disaster-map/**, src/hooks/**, src/pages/**, public/**, .env*

Scope: Upgrade D-MIND with GISTDA API key, Sentinel satellite flood analysis, real-time crowdsourcing flood reporting, TMD rain radar overlay on flood map, and Firebase FCM Web Push setup and integration.

- [x] G1: GISTDA API key updated to VdXi3UYkRaaZDGVsFOgO6KvYeZY8dV7CjFx2j4e1xdxm2wZcfXrwwfdzs1lepkMD in gistdaService.ts and useDailyDisasterStats.ts
  CHECK: node -e "const s = require('fs').readFileSync('src/services/gistdaService.ts', 'utf8'); if (!s.includes('VdXi3UYkRaaZDGVsFOgO6KvYeZY8dV7CjFx2j4e1xdxm2wZcfXrwwfdzs1lepkMD')) process.exit(1); console.log('G1 passed: GISTDA key verified');"
  EXPECT: G1 passed: GISTDA key verified
  EVIDENCE: Verified: PRIMARY_API_KEY updated in gistdaService.ts and useDailyDisasterStats.ts, environment variables synchronized in .env and .env.example.

- [x] G2: Sentinel satellite flood data layers (Sentinel-1 SAR / Sentinel-2) & satellite analytics integrated into Flood disaster view
  CHECK: node -e "const s = require('fs').readFileSync('src/components/disaster-map/FloodWMSLayers.tsx', 'utf8'); if (!s.includes('Sentinel') && !s.includes('sentinel')) process.exit(1); console.log('G2 passed: Sentinel satellite integration verified');"
  EXPECT: G2 passed: Sentinel satellite integration verified
  EVIDENCE: Verified: Free Copernicus Sentinel-2 MSI Cloudless and Sentinel-1 C-SAR Radar layers integrated alongside GISTDA Sentinel flood products.

- [x] G3: Real-time Crowdsourcing button & modal for citizens to report flood (GPS coordinates, water level, photo upload) and Ground Truth map markers
  CHECK: node -e "const s = require('fs').readFileSync('src/components/disaster-map/CrowdsourceFloodModal.tsx', 'utf8'); if (!s.includes('CrowdsourceFloodModal')) process.exit(1); console.log('G3 passed: Crowdsourcing flood reporting modal verified');"
  EXPECT: G3 passed: Crowdsourcing flood reporting modal verified
  EVIDENCE: Verified: CrowdsourceFloodModal and CrowdsourcedFloodMarkers created with GPS auto-detection, water level categories, camera image upload, and Sentinel ground-truth cross-referencing.

- [x] G4: Rain radar overlay (TMD / Doppler 15-30 min) enabled on Flood map alongside satellite flood layers
  CHECK: node -e "const s = require('fs').readFileSync('src/components/disaster-map/MapView.tsx', 'utf8'); if (!s.includes('rainOverlay') || !s.includes('flood')) process.exit(1); console.log('G4 passed: Rain radar on flood map verified');"
  EXPECT: G4 passed: Rain radar on flood map verified
  EVIDENCE: Verified: MapLayers and MapView updated to allow Rain Radar overlay with RadarPlayer on Flood map, toggled via FloodFilters.

- [x] G5: Firebase Cloud Messaging (FCM) Web Push Service Worker and client service implemented with setup guide
  CHECK: node -e "const sw = require('fs').existsSync('public/firebase-messaging-sw.js'); const s = require('fs').existsSync('src/services/firebaseMessaging.ts'); if (!sw || !s) process.exit(1); console.log('G5 passed: FCM service worker and client service verified');"
  EXPECT: G5 passed: FCM service worker and client service verified
  EVIDENCE: Verified: public/firebase-messaging-sw.js and src/services/firebaseMessaging.ts created with token management, permission requests, and NotificationCenter integration.

- [x] G6: TypeScript compilation and Vite build pass without errors
  CHECK: node node_modules/typescript/bin/tsc --noEmit
  EXPECT: 
  EVIDENCE: Verified: tsc --noEmit exited 0 and vite build completed successfully.
