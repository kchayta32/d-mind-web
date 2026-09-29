import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { 
  BangkokFloodMap, 
  BangkokSeverity 
} from '@/components/bangkok-flood/BangkokFloodMap';
import { BangkokFloodControls } from '@/components/bangkok-flood/BangkokFloodControls';
import { BangkokFloodStats } from '@/components/bangkok-flood/BangkokFloodStats';
import { BangkokRoadDetailModal } from '@/components/bangkok-flood/BangkokRoadDetailModal';
import { BangkokFloodTyphoonConcierge } from '@/components/bangkok-flood/BangkokFloodTyphoonConcierge';
import { BangkokFloodReportModal } from '@/components/bangkok-flood/BangkokFloodReportModal';
import { 
  BangkokUserFloodReport, 
  bangkokFloodUserReportService 
} from '@/services/bangkokFloodUserReportService';
import { 
  fetchFullBangkokFloodTelemetry, 
  BangkokFloodTelemetryBundle 
} from '@/services/bangkokFloodRealTelemetryService';
import { 
  BANGKOK_ROAD_SEGMENTS, 
  BANGKOK_CANAL_STATIONS 
} from '@/data/bangkokRoadFloodData';
import { GoogleFloodHubSidebar } from '@/components/bangkok-flood/GoogleFloodHubSidebar';
import { MultiSourceFloodDashboard } from '@/components/bangkok-flood/MultiSourceFloodDashboard';
import { 
  FloodHubGaugeStation, 
  GOOGLE_FLOOD_HUB_STATIONS, 
  getFloodHubStationById 
} from '@/services/googleFloodHubService';
import { 
  BangkokZone, 
  FloodSeverity, 
  BangkokRoadSegment, 
  BangkokCanalStation 
} from '@/types/bangkokFlood';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Waves, 
  RotateCcw, 
  PhoneCall, 
  MapPin, 
  Navigation, 
  Clock, 
  ChevronRight,
  Info,
  Car,
  Activity,
  Layers,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  Radio,
  Sparkles,
  Megaphone,
  Globe,
  Users
} from 'lucide-react';
import { EMERGENCY_CONTACTS_DATA } from '@/pages/EmergencyContacts';

export const BangkokFloodMapPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<BangkokZone>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<BangkokSeverity>('all');

  // Layer Toggles
  const [showCanalPumpsLayer, setShowCanalPumpsLayer] = useState(true);
  const [showSentinelSarLayer, setShowSentinelSarLayer] = useState(true);
  const [showUserReportsLayer, setShowUserReportsLayer] = useState(true);
  const [showFloodHubLayer, setShowFloodHubLayer] = useState(true);
  const [showInundationPolygons, setShowInundationPolygons] = useState(true);
  const [showBangkokBoundary, setShowBangkokBoundary] = useState(true);

  // Google Flood Hub Active Station (defaulting to Preng forecast matching Image 2)
  const [selectedFloodHubStation, setSelectedFloodHubStation] = useState<FloodHubGaugeStation | null>(
    getFloodHubStationById('hybas_4121126440') || GOOGLE_FLOOD_HUB_STATIONS[0]
  );

  // Citizen Flood User Reports State
  const [userReports, setUserReports] = useState<BangkokUserFloodReport[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [modalInitialCoords, setModalInitialCoords] = useState<[number, number] | undefined>(undefined);
  const [modalInitialLocation, setModalInitialLocation] = useState<string | undefined>(undefined);
  const [modalInitialDistrict, setModalInitialDistrict] = useState<string | undefined>(undefined);

  // Real Telemetry State (ThaiWater + DDS Bangkok + Open-Meteo)
  const [realTelemetry, setRealTelemetry] = useState<BangkokFloodTelemetryBundle | null>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);

  // Selected Entity & Modal States
  const [selectedRoad, setSelectedRoad] = useState<BangkokRoadSegment | null>(null);
  const [isRoadModalOpen, setIsRoadModalOpen] = useState(false);

  // Emergency Hotlines Expansion & Copy State
  const [isHotlinesExpanded, setIsHotlinesExpanded] = useState(false);
  const [copiedHotlineId, setCopiedHotlineId] = useState<string | null>(null);

  // Map Target Focus
  const [focusTarget, setFocusTarget] = useState<[number, number] | null>(null);
  const [focusZoom, setFocusZoom] = useState<number>(14);

  // Typhoon AI Concierge Question State
  const [typhoonInitialQuestion, setTyphoonInitialQuestion] = useState<string>('');

  // Timestamp
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(
    new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  );

  const loadRealTelemetry = async () => {
    setIsLoadingTelemetry(true);
    try {
      const bundle = await fetchFullBangkokFloodTelemetry();
      setRealTelemetry(bundle);
    } catch (e) {
      console.warn('Failed to load real telemetry:', e);
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    // Ensure page always starts at top and never auto-scrolls down on load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    loadRealTelemetry();
    // Load citizen user reports
    bangkokFloodUserReportService.loadReports().then(reps => {
      setUserReports(reps);
    });
    const unsubscribeReports = bangkokFloodUserReportService.subscribeToReports((updated) => {
      setUserReports(updated);
    });
    return () => {
      unsubscribeReports();
    };
  }, []);

  // Filtered Roads Memo
  const filteredRoads = useMemo(() => {
    return BANGKOK_ROAD_SEGMENTS.filter(road => {
      // 1. Search Query filter (Thai name, English name, district, description)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = road.name.toLowerCase().includes(q) || road.nameEn.toLowerCase().includes(q);
        const matchDistrict = road.district.toLowerCase().includes(q);
        const matchDesc = road.description.toLowerCase().includes(q);
        if (!matchName && !matchDistrict && !matchDesc) return false;
      }

      // 2. Zone Filter
      if (selectedZone !== 'all' && road.zone !== selectedZone) {
        return false;
      }

      // 3. Severity Filter
      if (selectedSeverity !== 'all' && road.status !== selectedSeverity) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedZone, selectedSeverity]);

  // Active Water Stations: authentic ThaiWater real telemetry mapped stations, with fallback
  const activeWaterStations = useMemo(() => {
    if (realTelemetry?.canalStations && realTelemetry.canalStations.length > 0) {
      return realTelemetry.canalStations;
    }
    return BANGKOK_CANAL_STATIONS;
  }, [realTelemetry]);

  // Handlers
  const handleSelectRoad = (road: BangkokRoadSegment) => {
    setSelectedRoad(road);
    if (road.coordinates && road.coordinates.length > 0) {
      const center = road.coordinates[Math.floor(road.coordinates.length / 2)];
      setFocusTarget(center);
      setFocusZoom(14);
    }
    setIsRoadModalOpen(true);
  };

  const handleFocusRoadByName = (roadName: string) => {
    const found = BANGKOK_ROAD_SEGMENTS.find(r => 
      r.name.includes(roadName) || roadName.includes(r.name.split('(')[0].replace('ถนน', '').trim())
    );
    if (found && found.coordinates && found.coordinates.length > 0) {
      setSelectedRoad(found);
      setFocusTarget(found.coordinates[Math.floor(found.coordinates.length / 2)]);
      setFocusZoom(15);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedZone('all');
    setSelectedSeverity('all');
    setFocusTarget([13.7563, 100.5018]);
    setFocusZoom(11);
  };

  const handleRefreshData = () => {
    setLastRefreshedAt(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
    loadRealTelemetry();
    bangkokFloodUserReportService.loadReports().then(reps => setUserReports(reps));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Main Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          
          {/* 2. Live Announcement & Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 shadow-xl border border-white/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    เฝ้าระวังน้ำท่วมขัง กทม.
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-blue-100 flex items-center gap-1">
                    <Waves className="w-3.5 h-3.5 text-cyan-300" />
                    ข้อมูลจริงจาก สสน. ThaiWater & สำนักการระบายน้ำ กทม. DDS
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono text-sky-200">
                    🛰️ Sentinel-1 SAR Overpass
                  </span>
                  {realTelemetry?.weather && (
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/30 border border-sky-400/40 backdrop-blur-md text-xs font-medium text-sky-100 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      สภาพอากาศ: {realTelemetry.weather.weatherTextTh} ({realTelemetry.weather.temperatureC}°C) | ฝน {realTelemetry.weather.currentPrecipitationMm} มม.
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  ระบบติดตามน้ำท่วมขังและระดับน้ำ กรุงเทพมหานคร (Real-Time Telemetry & Reports)
                </h1>

                <p className="text-sm text-blue-100/90 max-w-3xl leading-relaxed">
                  ตรวจสอบระดับน้ำขังบนผิวจราจรเรียลไทม์ โทรมาตรวัดระดับน้ำและสถานีสูบน้ำจาก สสน. ThaiWater 
                  เรดาร์ตรวจสภาพอากาศ สำนักการระบายน้ำ กทม. (DDS) และรายงานสถานการณ์น้ำท่วมจริงจากภาคประชาชน
                </p>
              </div>

              {/* Quick Actions & Live Timestamp */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2.5 flex-shrink-0">
                <div className="text-right text-xs text-blue-200">
                  <span>ข้อมูลอัปเดตล่าสุด</span>
                  <div className="font-mono font-bold text-white text-sm">
                    {lastRefreshedAt} น. (สด)
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setModalInitialCoords(undefined);
                      setModalInitialLocation(undefined);
                      setModalInitialDistrict(undefined);
                      setIsReportModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-extrabold text-xs h-9 rounded-xl shadow-lg border border-teal-300/40 transition-all hover:scale-105"
                  >
                    <Megaphone className="w-3.5 h-3.5 mr-1 text-white" />
                    📢 รายงานสถานการณ์น้ำท่วม
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      document.getElementById('typhoon-ai-concierge')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs h-9 rounded-xl shadow-lg border border-amber-300/40 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-slate-950" />
                    ถาม Typhoon AI
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      document.getElementById('multi-source-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs h-9 rounded-xl shadow-lg border border-indigo-300/40 transition-all hover:scale-105"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1 text-white" />
                    ศูนย์ข่าวกรองทุกช่องทาง
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefreshData}
                    disabled={isLoadingTelemetry}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md text-xs font-semibold h-9 rounded-xl"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingTelemetry ? 'animate-spin' : ''}`} />
                    รีเฟรชข้อมูล
                  </Button>
                </div>
              </div>
            </div>

            {/* Background subtle water wave decoration */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
          </div>

          {/* 3. Real-time Status Stats Cards */}
          <BangkokFloodStats
            roads={BANGKOK_ROAD_SEGMENTS}
            waterStations={activeWaterStations}
            selectedSeverity={selectedSeverity}
            onSelectSeverityFilter={(sev) => setSelectedSeverity(sev)}
          />

          {/* 4. Controls & Filters (Search, Zones, Severity, Layer Toggles) */}
          <BangkokFloodControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            selectedSeverity={selectedSeverity}
            onSeverityChange={setSelectedSeverity}
            showCanalPumpsLayer={showCanalPumpsLayer}
            onToggleCanalPumps={setShowCanalPumpsLayer}
            showSentinelSarLayer={showSentinelSarLayer}
            onToggleSentinelSar={setShowSentinelSarLayer}
            showUserReportsLayer={showUserReportsLayer}
            onToggleUserReports={setShowUserReportsLayer}
            showFloodHubLayer={showFloodHubLayer}
            onToggleFloodHub={setShowFloodHubLayer}
            showInundationPolygons={showInundationPolygons}
            onToggleInundationPolygons={setShowInundationPolygons}
            showBangkokBoundary={showBangkokBoundary}
            onToggleBangkokBoundary={setShowBangkokBoundary}
            userReportsCount={userReports.length}
            totalRoadsCount={BANGKOK_ROAD_SEGMENTS.length}
            filteredRoadsCount={filteredRoads.length}
            onResetFilters={handleResetFilters}
          />

          {/* 5. Interactive Map & Road Feeds (Split Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Map Canvas (8 Columns on desktop) */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Navigation className="w-3.5 h-3.5 text-blue-500" />
                  แผนที่แสดงเส้นทางถนนและระดับน้ำขัง (คลิกที่เส้นถนนเพื่อดูรายละเอียด)
                </span>
                <span>พิกัดศูนย์กลาง กทม.</span>
              </div>

              <BangkokFloodMap
                roads={filteredRoads}
                waterStations={activeWaterStations}
                selectedRoadId={selectedRoad?.id}
                showCanalPumpsLayer={showCanalPumpsLayer}
                showSentinelSarLayer={showSentinelSarLayer}
                showUserReportsLayer={showUserReportsLayer}
                showFloodHubLayer={showFloodHubLayer}
                showInundationPolygons={showInundationPolygons}
                showBangkokBoundary={showBangkokBoundary}
                selectedFloodHubStationId={selectedFloodHubStation?.id}
                onSelectFloodHubStation={(st) => {
                  setSelectedFloodHubStation(st);
                  setFocusTarget(st.coordinates);
                  setFocusZoom(13);
                }}
                userReports={userReports}
                onSelectRoad={handleSelectRoad}
                onSelectStation={(station) => {
                  setFocusTarget(station.coordinates);
                  setFocusZoom(15);
                }}
                onSelectUserReport={(report) => {
                  setFocusTarget(report.coordinates);
                  setFocusZoom(15);
                }}
                focusTarget={focusTarget}
                focusZoom={focusZoom}
              />
            </div>

            {/* Right Side Road List / Condition Feed (4 Columns on desktop) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-500" />
                  รายการถนนที่ตรวจวัด ({filteredRoads.length})
                </h3>
                <span className="text-[11px] text-slate-500">เรียงตามระดับน้ำ</span>
              </div>

              {/* Scrollable Road Cards List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredRoads.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      ไม่พบถนนที่ตรงกับเงื่อนไขการค้นหา
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ลองเปลี่ยนคำค้นหา หรือกดรีเซ็ตตัวกรอง
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="mt-3 text-xs"
                    >
                      ล้างตัวกรองทั้งหมด
                    </Button>
                  </div>
                ) : (
                  filteredRoads.map(road => {
                    const isSelected = selectedRoad?.id === road.id;
                    const sevColor = {
                      critical: 'border-l-red-500 hover:border-red-400',
                      warning: 'border-l-amber-500 hover:border-amber-400',
                      normal: 'border-l-emerald-500 hover:border-emerald-400'
                    }[road.status];

                    return (
                      <div
                        key={road.id}
                        onClick={() => handleSelectRoad(road)}
                        className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 ${sevColor} shadow-sm hover:shadow transition-all cursor-pointer group ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                เขต{road.district}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                road.status === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                                road.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}>
                                {road.status === 'critical' ? '🔴 หลีกเลี่ยง' : road.status === 'warning' ? '🟠 ขับช้า' : '🟢 ปกติ'}
                              </span>
                            </div>

                            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {road.name}
                            </div>

                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {road.description}
                            </div>
                          </div>

                          {/* Water Depth Badge */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                              {road.waterLevelCm} <span className="text-[10px] font-normal text-slate-400">ซม.</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-0.5">
                              <span>ดูข้อมูล</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>

                        {/* Passability preview tags */}
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                          <span>รถเล็ก: <b className={!road.passable.smallCar ? 'text-red-600' : 'text-emerald-600'}>
                            {!road.passable.smallCar ? 'ห้ามผ่าน' : 'ผ่านได้'}
                          </b></span>
                          <span>คลองระบาย: <b>{road.nearestCanal || 'ท่อหลัก'}</b></span>
                          <span>ท่วม {road.lanesAffected} เลน</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* 6. Multi-Source Flood Intelligence Dashboard (News, Facebook & Google Flood Hub) */}
          <div id="multi-source-dashboard" className="scroll-mt-20">
            <MultiSourceFloodDashboard
              onSelectDistrict={(district) => {
                setSearchQuery(district);
                toast({
                  title: `กรองข้อมูลเขต: ${district}`,
                  description: 'ระบบกำลังแสดงเส้นทางถนนและสถานการณ์ในพื้นที่ดังกล่าว'
                });
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
            />
          </div>

          {/* 7. Typhoon AI Flood & Traffic Routing Concierge Flagship Section */}
          <div id="typhoon-ai-concierge" className="scroll-mt-20">
            <BangkokFloodTyphoonConcierge
              roads={BANGKOK_ROAD_SEGMENTS}
              initialQuestion={typhoonInitialQuestion}
              onSelectRoadByName={(roadName) => {
                handleFocusRoadByName(roadName);
              }}
            />
          </div>

          {/* 7. Emergency Contacts & Flood Hotlines Section */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4">
            
            {/* Header with User Quote */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-bold">
                  <Bookmark className="w-3.5 h-3.5" />
                  รวมเบอร์โทรฉุกเฉิน ช่วงน้ำท่วม
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  “เซฟเก็บไว้ติดเครื่องกันได้เลย! มีไว้อุ่นใจกว่า”
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  รวมสายด่วนน้ำท่วมขัง แจ้งเหตุด่วน กู้ชีพ กู้ภัย และอุบัติเหตุจราจรทั่วกรุงเทพฯ และปริมณฑล 24 ชม.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const text = `📌 รวมเบอร์โทรฉุกเฉิน ช่วงน้ำท่วม (เซฟเก็บไว้ติดเครื่องกันได้เลย! มีไว้อุ่นใจกว่า)\n\n` +
                      EMERGENCY_CONTACTS_DATA.map(c => `${c.phoneNumber} ${c.name} (${c.description})`).join('\n') +
                      `\n\nข้อมูลโดย D-MIND: https://d-mind-six.vercel.app/`;
                    navigator.clipboard.writeText(text);
                    toast({
                      title: 'คัดลอกเบอร์ฉุกเฉินทั้งหมดสำเร็จ! 📋',
                      description: 'สามารถนำข้อความไปเซฟไว้ใน Note หรือส่งต่อใน LINE ได้ทันที',
                    });
                  }}
                  className="text-xs h-9 rounded-xl border-slate-200 dark:border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  คัดลอกเบอร์ทั้งหมด
                </Button>

                <Button
                  size="sm"
                  onClick={() => navigate('/emergency-contacts')}
                  className="text-xs h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  เปิดหน้าเบอร์ฉุกเฉินเต็มรูปแบบ
                </Button>
              </div>
            </div>

            {/* Quick-Dial Hotlines Chips (Priority Flood Hotlines) */}
            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                <span>🚨 เบอร์สายด่วนสำคัญช่วงน้ำท่วม (กดโทรออกได้ทันที):</span>
                <button
                  onClick={() => setIsHotlinesExpanded(!isHotlinesExpanded)}
                  className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 hover:underline"
                >
                  {isHotlinesExpanded ? (
                    <>ย่อรายการ <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>ดูทั้งหมด {EMERGENCY_CONTACTS_DATA.length} เบอร์ <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <a
                  href="tel:1555"
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 hover:bg-red-100 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-red-600 dark:text-red-400">1555</span>
                    <PhoneCall className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">สายด่วน กทม.</div>
                  <div className="text-[10px] text-slate-500 truncate">น้ำท่วมขัง/ท่อตัน</div>
                </a>

                <a
                  href="tel:1669"
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400">1669</span>
                    <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">แพทย์ฉุกเฉิน</div>
                  <div className="text-[10px] text-slate-500 truncate">กู้ชีพนเรนทร 24 ชม.</div>
                </a>

                <a
                  href="tel:1646"
                  className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-orange-600 dark:text-orange-400">1646</span>
                    <Activity className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">ศูนย์เอราวัณ กทม.</div>
                  <div className="text-[10px] text-slate-500 truncate">กู้ชีพพื้นที่ กทม.</div>
                </a>

                <a
                  href="tel:1199"
                  className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 hover:bg-cyan-100 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">1199</span>
                    <Waves className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">กรมเจ้าท่า</div>
                  <div className="text-[10px] text-slate-500 truncate">อุบัติเหตุทางน้ำ/ริมน้ำ</div>
                </a>

                <a
                  href="tel:1137"
                  className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-100 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">1137</span>
                    <Radio className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">จส.100</div>
                  <div className="text-[10px] text-slate-500 truncate">แจ้งอุบัติเหตุ/รถติด</div>
                </a>

                <a
                  href="tel:1418"
                  className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">1418</span>
                    <PhoneCall className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">มูลนิธิป่อเต็กตึ๊ง</div>
                  <div className="text-[10px] text-slate-500 truncate">กู้ภัยอุทกภัย 24 ชม.</div>
                </a>
              </div>
            </div>

            {/* Expandable Full List of 16+ Hotlines */}
            {isHotlinesExpanded && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in-50 duration-300">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  รายชื่อเบอร์โทรฉุกเฉินทั้งหมด ({EMERGENCY_CONTACTS_DATA.length} สายด่วน):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {EMERGENCY_CONTACTS_DATA.map(c => {
                    const isCopied = copiedHotlineId === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 ${c.colorClass}`}
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-foreground">{c.phoneNumber}</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {c.categoryLabel}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-foreground truncate">{c.name}</div>
                          <div className="text-[10px] text-muted-foreground line-clamp-1">{c.description}</div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(c.phoneNumber.replace(/-/g, ''));
                              setCopiedHotlineId(c.id);
                              toast({
                                title: 'คัดลอกเบอร์สำเร็จ',
                                description: `เบอร์ ${c.phoneNumber} (${c.name})`,
                              });
                              setTimeout(() => setCopiedHotlineId(null), 2000);
                            }}
                            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700"
                            title="คัดลอกเบอร์"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <a
                            href={`tel:${c.phoneNumber.replace(/-/g, '')}`}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                          >
                            <PhoneCall className="w-3 h-3" />
                            โทร
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* 8. Modals */}
      {/* Road Detail Modal */}
      <BangkokRoadDetailModal
        road={selectedRoad}
        isOpen={isRoadModalOpen}
        onClose={() => setIsRoadModalOpen(false)}
        onFocusOnMap={(center, zoom) => {
          setFocusTarget(center);
          if (zoom) setFocusZoom(zoom);
        }}
        onAskTyphoonAboutRoad={(road) => {
          setTyphoonInitialQuestion(`ขอวิเคราะห์ถนน ${road.name} (เขต${road.district}) ระดับน้ำท่วมขัง ${road.waterLevelCm} ซม. ท่วม ${road.lanesAffected} เลน รถยนต์แต่ละประเภทผ่านได้ไหม และมีเส้นทางเลี่ยงไหนแนะนำบ้าง?`);
          setTimeout(() => {
            document.getElementById('typhoon-ai-concierge')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
      />

      {/* Citizen Flood Report Modal */}
      <BangkokFloodReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialCoordinates={modalInitialCoords}
        initialLocationName={modalInitialLocation}
        initialDistrict={modalInitialDistrict}
        onReportSubmitted={(newRep) => {
          setUserReports(prev => [newRep, ...prev.filter(r => r.id !== newRep.id)]);
          if (newRep.coordinates) {
            setFocusTarget(newRep.coordinates);
            setFocusZoom(15);
          }
        }}
      />

      {/* Google Flood Hub Left Sliding Sidebar (Image 2 & 3) */}
      {showFloodHubLayer && selectedFloodHubStation && (
        <GoogleFloodHubSidebar
          station={selectedFloodHubStation}
          onClose={() => setSelectedFloodHubStation(null)}
          onSelectStation={(st) => {
            setSelectedFloodHubStation(st);
            setFocusTarget(st.coordinates);
            setFocusZoom(13);
          }}
          allStations={GOOGLE_FLOOD_HUB_STATIONS}
        />
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        <Button
          onClick={() => {
            setModalInitialCoords(undefined);
            setModalInitialLocation(undefined);
            setModalInitialDistrict(undefined);
            setIsReportModalOpen(true);
          }}
          className="rounded-full shadow-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs h-11 px-4 border border-white/20 flex items-center gap-2 group hover:scale-105 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span>
          <Megaphone className="w-4 h-4 text-white" />
          <span>📢 รายงานสถานการณ์น้ำท่วม</span>
        </Button>

        <Button
          onClick={() => {
            document.getElementById('typhoon-ai-concierge')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="rounded-full shadow-2xl bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 hover:from-slate-800 hover:to-purple-800 text-white font-extrabold text-xs h-11 px-4 border border-white/20 hidden sm:flex items-center gap-2 group hover:scale-105 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-base">🌪️</span>
          <span>ปรึกษา Typhoon AI</span>
        </Button>
      </div>

    </div>
  );
};

export default BangkokFloodMapPage;
