import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Navigation, 
  ActiveTab 
} from './components/Navigation';
import { 
  Footer 
} from './components/Footer';
import { 
  SeismicMap 
} from './components/Map/SeismicMap';
import { 
  StationListModal 
} from './components/Map/StationListModal';
import { 
  LiveSeismogram 
} from './components/Telemetry/LiveSeismogram';
import { 
  EmergencyHUD 
} from './components/Alert/EmergencyHUD';
import { 
  EarthquakeSimulator 
} from './components/Simulator/EarthquakeSimulator';
import { 
  InnovationShowcase 
} from './components/NRCT/InnovationShowcase';
import { 
  EvacuationPlanner 
} from './components/Evacuation/EvacuationPlanner';

import { 
  EarthquakeEvent, 
  SeismicStation, 
  AlertLevel, 
  EarlyWarningInfo,
  SimulationScenario,
  TriggerResult
} from './types/seismic';

import { THAI_SEISMIC_STATIONS, THAI_ACTIVE_FAULTS } from './services/thaiFaultData';
import { LiveSeismicFeedService } from './services/liveSeismicFeed';
import { WavePhysicsEngine } from './services/wavePhysicsEngine';
import { audioAlertSystem } from './services/audioAlertSystem';

import { 
  Activity, 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Clock, 
  Gauge, 
  Zap, 
  Award, 
  RefreshCw, 
  ListFilter,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [isFullscreenMap, setIsFullscreenMap] = useState<boolean>(false);

  // Core Seismic Data
  const [events, setEvents] = useState<EarthquakeEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<EarthquakeEvent | null>(null);
  const [stations, setStations] = useState<SeismicStation[]>(THAI_SEISMIC_STATIONS);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
  const [selectedStation, setSelectedStation] = useState<SeismicStation | null>(null);

  // User Target Location (Default: Bangkok City Center)
  const [userLocation, setUserLocation] = useState<[number, number]>([13.7563, 100.5018]);
  const [userLocationName, setUserLocationName] = useState<string>('กรุงเทพมหานคร (Bangkok Command Center)');

  // Simulation & Early Warning Engine State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationElapsedSec, setSimulationElapsedSec] = useState<number>(0);
  const [earlyWarning, setEarlyWarning] = useState<EarlyWarningInfo | null>(null);
  const [isHUDOpen, setIsHUDOpen] = useState<boolean>(false);
  const [isNRCTShowcaseOpen, setIsNRCTShowcaseOpen] = useState<boolean>(false);
  const [isStationListOpen, setIsStationListOpen] = useState<boolean>(false);

  // Waveform state
  const [pgaReading, setPgaReading] = useState<number>(0.003);
  const [pWaveArrived, setPWaveArrived] = useState<boolean>(false);
  const [sWaveArrived, setSWaveArrived] = useState<boolean>(false);

  // Simulation interval reference
  const simTimerRef = useRef<number | null>(null);

  // Current system-wide alert level
  const currentAlertLevel: AlertLevel = isSimulating 
    ? (activeEvent?.alertLevel || 'critical') 
    : (activeEvent?.alertLevel || 'normal');

  // Load initial earthquake feed
  const loadFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const fetched = await LiveSeismicFeedService.fetchLiveEarthquakes();
      setEvents(fetched);
      if (fetched.length > 0 && !activeEvent) {
        setActiveEvent(fetched[0]);
      }
    } catch (err) {
      console.error('Failed to load seismic feed:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  }, [activeEvent]);

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 1000 * 60 * 3); // Poll every 3 minutes
    return () => clearInterval(interval);
  }, [loadFeed]);

  // Request browser geolocation if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setUserLocationName('ตำแหน่งของคุณ (My Live Geolocation)');
        },
        () => {
          // Keep default Bangkok location
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Compute early warning info whenever active event or simulation time changes
  useEffect(() => {
    if (!activeEvent) {
      setEarlyWarning(null);
      return;
    }

    const warning = WavePhysicsEngine.calculateEarlyWarning(
      activeEvent.id,
      activeEvent.epicenter,
      activeEvent.magnitude,
      activeEvent.depthKm,
      userLocation[0],
      userLocation[1],
      activeEvent.latitude,
      activeEvent.longitude,
      simulationElapsedSec,
      1.6 // Bangkok soft soil resonance factor
    );

    setEarlyWarning(warning);

    // Update waveform arrivals
    const distToUser = warning.distanceKm;
    const pTravel = warning.pWaveArrivalSec;
    const sTravel = warning.sWaveArrivalSec;

    if (simulationElapsedSec >= pTravel) {
      setPWaveArrived(true);
    }
    if (simulationElapsedSec >= sTravel) {
      setSWaveArrived(true);
      setPgaReading(warning.expectedPga);
    }
  }, [activeEvent, userLocation, simulationElapsedSec]);

  // Simulation loop ticker
  useEffect(() => {
    if (isSimulating) {
      const startTime = Date.now() - (simulationElapsedSec * 1000);
      simTimerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setSimulationElapsedSec(elapsed);

        // Update station trigger states dynamically as P-wavefront reaches them
        if (activeEvent) {
          const currentPRadiusKm = elapsed * WavePhysicsEngine.VP;
          setStations(prev => prev.map(station => {
            const dist = WavePhysicsEngine.haversineDistanceKm(
              activeEvent.latitude,
              activeEvent.longitude,
              station.lat,
              station.lng
            );
            if (dist <= currentPRadiusKm) {
              const pga = Math.min(180, Math.round((1200 / Math.max(10, dist)) * 100) / 100);
              return {
                ...station,
                status: 'triggered',
                pga
              };
            }
            return station;
          }));
        }

        // Auto-stop simulation after 65 seconds
        if (elapsed >= 65) {
          setIsSimulating(false);
          if (simTimerRef.current) clearInterval(simTimerRef.current);
        }
      }, 100);
    } else {
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
    }

    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isSimulating, activeEvent]);

  // Handler: Start Simulation Drill
  const handleStartSimulation = useCallback((
    scenario: SimulationScenario,
    _leadTimeSec: number,
    expectedPga: number,
    _mmiString: string
  ) => {
    const simEvent = LiveSeismicFeedService.createSimulatedEvent(
      `[การจำลอง วช.] ${scenario.name} (M ${scenario.magnitude})`,
      scenario.locationName,
      'พื้นที่เสี่ยงภัยจำลอง',
      scenario.lat,
      scenario.lng,
      scenario.magnitude,
      scenario.depthKm
    );

    setActiveEvent(simEvent);
    setSimulationElapsedSec(0);
    setPWaveArrived(false);
    setSWaveArrived(false);
    setPgaReading(expectedPga);
    setIsSimulating(true);
    setIsHUDOpen(true);

    // Trigger audio siren if high magnitude
    if (scenario.magnitude >= 5.0) {
      audioAlertSystem.startSiren('critical');
      audioAlertSystem.announceEmergency(
        Math.round(WavePhysicsEngine.sWaveTravelTimeSec(WavePhysicsEngine.haversineDistanceKm(userLocation[0], userLocation[1], scenario.lat, scenario.lng))),
        'th'
      );
    }
  }, [userLocation]);

  // Handler: Reset Simulation
  const handleResetSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulationElapsedSec(0);
    setPWaveArrived(false);
    setSWaveArrived(false);
    setPgaReading(0.002);
    setIsHUDOpen(false);
    audioAlertSystem.stopSiren();
    setStations(THAI_SEISMIC_STATIONS);
    if (events.length > 0) {
      setActiveEvent(events[0]);
    }
  }, [events]);

  // Handler: Select Event
  const handleSelectEvent = (evt: EarthquakeEvent) => {
    setActiveEvent(evt);
    setSimulationElapsedSec(0);
    setPWaveArrived(false);
    setSWaveArrived(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Tactical Header */}
      <Header 
        currentAlertLevel={currentAlertLevel}
        activeQuakeCount={events.length}
        onOpenNRCTShowcase={() => setIsNRCTShowcaseOpen(true)}
        onOpenSimulator={() => setActiveTab('simulator')}
        isSimulating={isSimulating}
      />

      {/* Navigation Sub-Bar (Desktop Top / Mobile Bottom) */}
      <Navigation 
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'map') setIsFullscreenMap(false);
        }}
        isTriggered={isSimulating || currentAlertLevel === 'critical' || currentAlertLevel === 'warning'}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 space-y-4">

        {/* Tactical Banner / Early Warning Notification Bar */}
        {earlyWarning && (
          <div className={`rounded-xl p-3.5 sm:p-4 border transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            earlyWarning.isUrgent
              ? 'bg-rose-950/40 border-rose-500 text-rose-100 animate-pulse-fast'
              : earlyWarning.hasArrived
              ? 'bg-slate-900/90 border-slate-700 text-slate-200'
              : 'bg-cyan-950/30 border-cyan-500/50 text-cyan-100'
          }`}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2 rounded-xl flex-shrink-0 ${
                earlyWarning.isUrgent ? 'bg-rose-500 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}>
                {earlyWarning.isUrgent ? <ShieldAlert className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm sm:text-base font-mono">
                    {earlyWarning.hasArrived 
                      ? 'คลื่น S-Wave เดินทางถึงพื้นที่เป้าหมายแล้ว' 
                      : `การแจ้งเตือนภัยล่วงหน้า (AI Early Warning): ${earlyWarning.countdownSeconds} วินาที`}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 border border-slate-700 font-mono">
                    ระยะห่าง {earlyWarning.distanceKm} กม.
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong className="text-cyan-300">{earlyWarning.epicenterName}</strong> (M {earlyWarning.magnitude}) | คำแนะนำ: {earlyWarning.recommendedAction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              {isSimulating && (
                <button
                  onClick={handleResetSimulation}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
                >
                  หยุดจำลอง
                </button>
              )}
              <button
                onClick={() => setIsHUDOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>เปิด HUD ฉุกเฉิน</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Tactical GIS Map View */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            {/* Top Toolbar for Map */}
            <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-mono text-slate-300">
                  กำลังเฝ้าระวังแผ่นดินไหวแบบเรียลไทม์ ({events.length} เหตุการณ์ในระบบ)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStationListOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>เครือข่ายสถานี ({stations.length})</span>
                </button>

                <button
                  onClick={loadFeed}
                  disabled={isLoadingFeed}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
                  title="รีเฟรชข้อมูล USGS"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingFeed ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">ดึงข้อมูลสด</span>
                </button>
              </div>
            </div>

            {/* Split Screen / Grid on Desktop, Stacked on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Map Panel (8 cols on desktop) */}
              <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 relative min-h-[460px] md:min-h-[580px]">
                <SeismicMap 
                  events={events}
                  activeEvent={activeEvent}
                  stations={stations}
                  userLocation={{ lat: userLocation[0], lng: userLocation[1], name: userLocationName }}
                  onSelectEvent={handleSelectEvent}
                  onSelectStation={(s) => setSelectedStation(s)}
                  isSimulating={isSimulating}
                  simulationElapsedSec={simulationElapsedSec}
                  className="w-full h-full min-h-[460px] md:min-h-[580px]"
                />
              </div>

              {/* Right Sidebar: Active Event Telemetry & Recent Quakes List (4 cols on desktop) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Active Event Card */}
                {activeEvent ? (
                  <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        ข้อมูลเหตุการณ์ที่เลือก
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        activeEvent.alertLevel === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' :
                        activeEvent.alertLevel === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {activeEvent.source}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-100 leading-snug">
                        {activeEvent.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{activeEvent.epicenter}</span>
                      </p>
                    </div>

                    {/* Magnitude & Depth Matrix */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-2">
                      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block">MAGNITUDE</span>
                        <span className="text-lg font-bold font-mono text-amber-400">
                          M {activeEvent.magnitude}
                        </span>
                      </div>
                      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block">DEPTH</span>
                        <span className="text-lg font-bold font-mono text-cyan-400">
                          {activeEvent.depthKm} <span className="text-xs font-normal">km</span>
                        </span>
                      </div>
                      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block">EST. PGA</span>
                        <span className="text-lg font-bold font-mono text-rose-400">
                          {activeEvent.pga} <span className="text-xs font-normal">Gal</span>
                        </span>
                      </div>
                    </div>

                    {/* Coordinates & Time */}
                    <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-slate-950/40 p-2.5 rounded-lg">
                      <div className="flex justify-between">
                        <span>พิกัดศูนย์กลาง:</span>
                        <span className="text-slate-200">{activeEvent.latitude.toFixed(3)}°N, {activeEvent.longitude.toFixed(3)}°E</span>
                      </div>
                      <div className="flex justify-between">
                        <span>เวลาตรวจวัด:</span>
                        <span className="text-slate-200">{new Date(activeEvent.time).toLocaleTimeString('th-TH')} ICT</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Recent Earthquakes List */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-semibold uppercase text-slate-300">
                      รายการแผ่นดินไหวล่าสุด ({events.length})
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">LIVE FEED</span>
                  </div>

                  <div className="max-h-[280px] overflow-y-auto space-y-1.5 pr-1">
                    {events.map((evt) => {
                      const isSelected = activeEvent?.id === evt.id;
                      return (
                        <button
                          key={evt.id}
                          onClick={() => handleSelectEvent(evt)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-500/50 shadow-sm'
                              : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                                evt.magnitude >= 6.5 ? 'bg-rose-500 text-white' :
                                evt.magnitude >= 5.0 ? 'bg-amber-500 text-slate-950' :
                                'bg-cyan-500/20 text-cyan-300'
                              }`}>
                                M {evt.magnitude}
                              </span>
                              <span className="text-xs font-medium text-slate-200 truncate">
                                {evt.epicenter}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {new Date(evt.time).toLocaleTimeString('th-TH')} | ลึก {evt.depthKm} กม.
                            </span>
                          </div>

                          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live 3-Axis Seismogram */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <LiveSeismogram 
              stationCode="CHMO-01"
              stationName="สถานีตรวจวัดคลื่นไหวสะเทือนเชียงใหม่-ดอยสุเทพ (TMD National Station)"
              samplingRate={100}
              isExternalTrigger={isSimulating}
              pWaveArrived={pWaveArrived}
              sWaveArrived={sWaveArrived}
              pgaValue={pgaReading}
              onTriggerDetected={(res: TriggerResult) => {
                console.log('Waveform trigger detected:', res);
              }}
            />
          </div>
        )}

        {/* Tab 3: NRCT Drill Simulator Bench */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <EarthquakeSimulator 
              onStartSimulation={handleStartSimulation}
              onReset={handleResetSimulation}
            />
          </div>
        )}

        {/* Tab 4: Evacuation & Emergency Planner */}
        {activeTab === 'evacuation' && (
          <div className="space-y-4">
            <EvacuationPlanner />
          </div>
        )}

        {/* Tab 5: NRCT National Innovation Showcase */}
        {activeTab === 'nrct' && (
          <div className="space-y-4">
            <InnovationShowcase 
              isOpen={true}
              onClose={() => setActiveTab('map')}
            />
          </div>
        )}

      </main>

      {/* Global Modals */}
      
      {/* Emergency HUD Modal (Golden Seconds Countdown) */}
      <EmergencyHUD 
        isOpen={isHUDOpen}
        countdownSeconds={earlyWarning ? earlyWarning.countdownSeconds : 15}
        totalLeadTimeSec={earlyWarning ? earlyWarning.totalLeadTimeSec : 25}
        magnitude={activeEvent ? activeEvent.magnitude : 6.5}
        depthKm={activeEvent ? activeEvent.depthKm : 10}
        distanceKm={earlyWarning ? earlyWarning.distanceKm : 45}
        epicenterName={activeEvent ? activeEvent.epicenter : 'รอยเลื่อนแม่ทา เชียงใหม่'}
        intensityLevel={earlyWarning ? earlyWarning.intensityLevel : 'MMI VII'}
        expectedPga={earlyWarning ? earlyWarning.expectedPga : 48.5}
        onClose={() => setIsHUDOpen(false)}
        onAcknowledge={() => {
          setIsHUDOpen(false);
          audioAlertSystem.stopSiren();
        }}
      />

      {/* Station List Modal */}
      <StationListModal 
        isOpen={isStationListOpen}
        onClose={() => setIsStationListOpen(false)}
        stations={stations}
        selectedStationId={selectedStation?.id}
        onSelectStation={(st) => {
          setSelectedStation(st);
          setIsStationListOpen(false);
          setActiveTab('map');
        }}
      />

      {/* NRCT Innovation Showcase Modal (when launched via Header Award Button) */}
      {isNRCTShowcaseOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNRCTShowcaseOpen(false);
          }}
        >
          <div className="relative w-full max-w-5xl my-auto animate-in fade-in zoom-in-95 duration-200">
            <InnovationShowcase 
              isOpen={true}
              onClose={() => setIsNRCTShowcaseOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
