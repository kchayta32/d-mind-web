import React, { useState, useMemo } from 'react';
import { MapView } from './MapView';
import FilterControls from './FilterControls';
import StatisticsPanel from './StatisticsPanel';
import WildfireCharts from './WildfireCharts';
import AirPollutionCharts from './AirPollutionCharts';
import DroughtCharts from './DroughtCharts';
import FloodCharts from './FloodCharts';
import { StormCharts } from './charts/StormCharts';
import { VolcanoCharts } from './charts/VolcanoCharts';
import SinkholeNews from './SinkholeNews';
import { DisasterType } from './DisasterMap';
import { useDisasterMapState } from './hooks/useDisasterMapState';
import { useDisasterMapData } from './hooks/useDisasterMapData';
import { useSinkholeData } from '../../hooks/useSinkholeData';
import { useCrowdsourcedFloodReports } from './hooks/useCrowdsourcedFloodReports';
import { CrowdsourceFloodModal } from './CrowdsourceFloodModal';
import { BangkokFloodMap } from '@/components/bangkok-flood/BangkokFloodMap';
import { BangkokFloodControls } from '@/components/bangkok-flood/BangkokFloodControls';
import { BangkokFloodStats } from '@/components/bangkok-flood/BangkokFloodStats';
import { BangkokRoadDetailModal } from '@/components/bangkok-flood/BangkokRoadDetailModal';
import { BANGKOK_ROAD_SEGMENTS, BANGKOK_CANAL_STATIONS } from '@/data/bangkokRoadFloodData';
import { BangkokZone, BangkokRoadSegment } from '@/types/bangkokFlood';
import { ExternalLink, BarChart2 } from 'lucide-react';
import { SelectedLocation } from './types';
import { TyphoonDisasterModal } from './TyphoonDisasterModal';
import { DisasterTelemetry } from '@/services/typhoonDisasterService';

interface DisasterMapContentProps {
  selectedType: DisasterType;
  onTypeChange: (type: DisasterType) => void;
  onLocationSelect: (lat: number, lon: number, name: string, locationData?: SelectedLocation) => void;
  selectedLocation?: SelectedLocation | null;
  onClearSelectedLocation?: () => void;
  isFullMapMode?: boolean;
  onToggleFullMapMode?: () => void;
  isTyphoonModalOpen?: boolean;
  onSetTyphoonModalOpen?: (open: boolean) => void;
}

export const DisasterMapContent: React.FC<DisasterMapContentProps> = ({
  selectedType,
  onTypeChange,
  onLocationSelect,
  selectedLocation = null,
  onClearSelectedLocation,
  isFullMapMode = false,
  onToggleFullMapMode,
  isTyphoonModalOpen,
  onSetTyphoonModalOpen
}) => {
  const {
    magnitudeFilter,
    setMagnitudeFilter,
    humidityFilter,
    setHumidityFilter,
    rainTimeFilter,
    setRainTimeFilter,
    pm25Filter,
    setPm25Filter,
    wildfireTimeFilter,
    setWildfireTimeFilter,
    showBurnFreq,
    setShowBurnFreq,
    showBurnScar,
    setShowBurnScar,
    wildfireMapMode,
    setWildfireMapMode,
    droughtLayers,
    setDroughtLayers,
    droughtMapMode,
    setDroughtMapMode,
    floodTimeFilter,
    setFloodTimeFilter,
    showFloodFrequency,
    setShowFloodFrequency,
    showWaterHyacinth,
    setShowWaterHyacinth,
    floodMapMode,
    setFloodMapMode,
    showRainRadarOnFlood,
    setShowRainRadarOnFlood,
    showSentinel2TrueColor,
    setShowSentinel2TrueColor,
    showSentinel1Sar,
    setShowSentinel1Sar,
    isCrowdsourceModalOpen,
    setIsCrowdsourceModalOpen
  } = useDisasterMapState();

  const {
    earthquakes,
    rainSensors,
    hotspots,
    airStations,
    rainData,
    gistdaFloodFeatures,
    floodDataPoints,
    openMeteoRainData,
    storms,
    volcanoes,
    wildfireStats,
    airStats,
    droughtStats,
    floodStats,
    stormStats,
    volcanoStats,
    getCurrentStats,
    getCurrentLoading,
    refetchAll
  } = useDisasterMapData(rainTimeFilter, wildfireTimeFilter, floodTimeFilter);

  const { sinkholes, stats: sinkholeStats } = useSinkholeData();
  const { reports: crowdsourcedReports, addReport } = useCrowdsourcedFloodReports(gistdaFloodFeatures);

  // Bangkok Road Flood dedicated state
  const [bkkSearch, setBkkSearch] = useState('');
  const [bkkZone, setBkkZone] = useState<BangkokZone>('all');
  const [bkkSeverity, setBkkSeverity] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [bkkShowCanals, setBkkShowCanals] = useState(true);
  const [bkkShowSentinel, setBkkShowSentinel] = useState(true);
  const [bkkSelectedRoad, setBkkSelectedRoad] = useState<BangkokRoadSegment | null>(null);
  const [bkkRoadModalOpen, setBkkRoadModalOpen] = useState(false);
  const [bkkFocusTarget, setBkkFocusTarget] = useState<[number, number] | null>(null);

  const filteredBkkRoads = useMemo(() => {
    return BANGKOK_ROAD_SEGMENTS.filter(road => {
      if (bkkSearch.trim()) {
        const q = bkkSearch.toLowerCase().trim();
        const match = road.name.toLowerCase().includes(q) || 
                      road.nameEn.toLowerCase().includes(q) || 
                      road.district.toLowerCase().includes(q) ||
                      road.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (bkkZone !== 'all' && road.zone !== bkkZone) return false;
      if (bkkSeverity !== 'all' && road.status !== bkkSeverity) return false;
      return true;
    });
  }, [bkkSearch, bkkZone, bkkSeverity]);

  // Internal state if parent doesn't control Typhoon Modal
  const [internalTyphoonOpen, setInternalTyphoonOpen] = useState(false);
  const isTyphoonOpen = isTyphoonModalOpen !== undefined ? isTyphoonModalOpen : internalTyphoonOpen;
  const setTyphoonOpen = onSetTyphoonModalOpen || setInternalTyphoonOpen;

  // Aggregate live telemetry for Typhoon AI
  const liveMaxEarthquake = useMemo(() => {
    if (!earthquakes || earthquakes.length === 0) return null;
    return [...earthquakes].sort((a, b) => (b.magnitude || 0) - (a.magnitude || 0))[0];
  }, [earthquakes]);

  const liveMaxPm25 = useMemo(() => {
    if (!airStations || airStations.length === 0) return null;
    return [...airStations].sort((a, b) => (b.pm25 || 0) - (a.pm25 || 0))[0];
  }, [airStations]);

  const liveTopHotspot = useMemo(() => {
    if (!hotspots || hotspots.length === 0) return null;
    return hotspots[0]?.province || null;
  }, [hotspots]);

  const liveTelemetry: DisasterTelemetry = useMemo(() => {
    return {
      disasterType: selectedType,
      selectedLocationName: selectedLocation?.name || selectedLocation?.displayName,
      earthquakesCount: earthquakes.length,
      maxEarthquakeMagnitude: liveMaxEarthquake?.magnitude,
      maxEarthquakeLocation: liveMaxEarthquake?.place || liveMaxEarthquake?.location,
      maxEarthquakeDepthKm: liveMaxEarthquake?.depth,
      hotspotsCount: hotspots.length,
      topHotspotProvince: liveTopHotspot || undefined,
      airStationsCount: airStations.length,
      maxPm25: liveMaxPm25?.pm25,
      maxPm25Station: liveMaxPm25?.stationName || liveMaxPm25?.province,
      maxAqi: liveMaxPm25?.usAqi,
      floodFeaturesCount: gistdaFloodFeatures.length,
      maxDischargeM3s: floodDataPoints.find(f => f.floodRiskLevel === 'critical' || f.floodRiskLevel === 'high')?.currentDischarge,
      criticalFloodRivers: floodDataPoints.filter(f => f.floodRiskLevel === 'critical').map(f => f.locationName),
      stormsCount: storms.length,
      activeStormName: storms[0]?.name,
      stormWindSpeedKmH: storms[0]?.windSpeedKmH,
      bkkFloodedRoadsCount: BANGKOK_ROAD_SEGMENTS.filter(r => r.status !== 'normal').length,
      bkkCriticalRoadsCount: BANGKOK_ROAD_SEGMENTS.filter(r => r.status === 'critical').length,
      topBkkFloodedRoad: BANGKOK_ROAD_SEGMENTS.find(r => r.status === 'critical')?.name,
      volcanoesCount: volcanoes.length,
      sinkholesCount: sinkholes.length
    };
  }, [
    selectedType,
    selectedLocation,
    earthquakes,
    liveMaxEarthquake,
    hotspots,
    liveTopHotspot,
    airStations,
    liveMaxPm25,
    gistdaFloodFeatures,
    floodDataPoints,
    storms,
    volcanoes,
    sinkholes
  ]);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0 relative">
      {/* Main Map Container (Full width in fullscreen mode, 8-9 cols in split mode) */}
      <div className={`${isFullMapMode ? 'lg:col-span-12 xl:col-span-12' : 'lg:col-span-8 xl:col-span-9'} h-[480px] sm:h-[560px] lg:h-[calc(100vh-175px)] min-h-[440px] rounded-xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-800 transition-all [&:has([data-state=open])]:pointer-events-none`}>
        {selectedType === 'bkk_road_flood' ? (
          <BangkokFloodMap
            roads={filteredBkkRoads}
            waterStations={BANGKOK_CANAL_STATIONS}
            selectedRoadId={bkkSelectedRoad?.id}
            showCanalPumpsLayer={bkkShowCanals}
            showSentinelSarLayer={bkkShowSentinel}
            onSelectRoad={(road) => {
              setBkkSelectedRoad(road);
              setBkkRoadModalOpen(true);
            }}
            focusTarget={bkkFocusTarget}
          />
        ) : (
          <MapView
            earthquakes={earthquakes}
            rainSensors={rainSensors}
            hotspots={hotspots}
            airStations={airStations}
            rainData={rainData}
            gistdaFloodFeatures={gistdaFloodFeatures}
            floodDataPoints={floodDataPoints}
            openMeteoRainData={openMeteoRainData}
            storms={storms}
            volcanoes={volcanoes}
            sinkholes={sinkholes}
            crowdsourcedFloodReports={crowdsourcedReports}
            selectedType={selectedType}
            magnitudeFilter={magnitudeFilter}
            humidityFilter={humidityFilter}
            pm25Filter={pm25Filter}
            droughtLayers={droughtLayers}
            droughtMapMode={droughtMapMode}
            floodTimeFilter={floodTimeFilter}
            showFloodFrequency={showFloodFrequency}
            floodMapMode={floodMapMode}
            showWaterHyacinth={showWaterHyacinth}
            showRainRadarOnFlood={showRainRadarOnFlood}
            showSentinel2TrueColor={showSentinel2TrueColor}
            showSentinel1Sar={showSentinel1Sar}
            wildfireTimeFilter={wildfireTimeFilter}
            showBurnFreq={showBurnFreq}
            showBurnScar={showBurnScar}
            wildfireMapMode={wildfireMapMode}
            isLoading={getCurrentLoading(selectedType)}
            onLocationSelect={onLocationSelect}
            selectedLocation={selectedLocation}
            onClearSelectedLocation={onClearSelectedLocation}
            onRefreshAll={refetchAll}
            onOpenCrowdsourceModal={() => setIsCrowdsourceModalOpen(true)}
            onOpenTyphoonModal={() => setTyphoonOpen(true)}
          />
        )}
      </div>
      
      {/* Right Sidebar for Analytics & Controls (4 cols on desktop, hidden when isFullMapMode) */}
      <div className={`${isFullMapMode ? 'hidden' : 'lg:col-span-4 xl:col-span-3'} space-y-3.5 max-h-none lg:max-h-[calc(100vh-175px)] overflow-y-auto pr-1 pb-4 transition-all`}>
        {selectedType === 'bkk_road_flood' ? (
          <>
            <button
              type="button"
              onClick={() => setTyphoonOpen(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white shadow-md hover:from-cyan-500 hover:to-indigo-600 transition font-bold text-xs"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span>Typhoon AI วิเคราะห์น้ำท่วม กทม.</span>
              </span>
              <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded font-mono font-medium">
                Live AI
              </span>
            </button>

            <a
              href="/bangkok-flood"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition font-bold text-xs shadow-xs"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">🌊</span>
                <span>เปิดหน้าจอเต็มระบบ กทม. (Full Portal)</span>
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <BangkokFloodControls
              searchQuery={bkkSearch}
              onSearchChange={setBkkSearch}
              selectedZone={bkkZone}
              onZoneChange={setBkkZone}
              selectedSeverity={bkkSeverity}
              onSeverityChange={setBkkSeverity}
              showCanalPumpsLayer={bkkShowCanals}
              onToggleCanalPumps={setBkkShowCanals}
              showSentinelSarLayer={bkkShowSentinel}
              onToggleSentinelSar={setBkkShowSentinel}
              totalRoadsCount={BANGKOK_ROAD_SEGMENTS.length}
              filteredRoadsCount={filteredBkkRoads.length}
              onResetFilters={() => {
                setBkkSearch('');
                setBkkZone('all');
                setBkkSeverity('all');
              }}
            />

            <BangkokFloodStats
              roads={BANGKOK_ROAD_SEGMENTS}
              waterStations={BANGKOK_CANAL_STATIONS}
              selectedSeverity={bkkSeverity}
              onSelectSeverityFilter={setBkkSeverity}
            />
          </>
        ) : (
          <>
            {/* Typhoon AI Quick Intelligence Card in Sidebar */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 border border-cyan-500/30 shadow-lg flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 flex-shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-white">Typhoon AI</span>
                    <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1 py-0.2 rounded font-mono">
                      v2.5
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    วิเคราะห์สถานการณ์ & ประเมินความเสี่ยงสด
                  </p>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => setTyphoonOpen(true)}
                className="h-7 text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg px-2.5 shadow-md flex-shrink-0"
              >
                เปิดบทวิเคราะห์
              </Button>
            </div>

            {/* Filter Controls */}
            <FilterControls
              selectedType={selectedType}
              magnitudeFilter={magnitudeFilter}
              onMagnitudeChange={setMagnitudeFilter}
              humidityFilter={humidityFilter}
              onHumidityChange={setHumidityFilter}
              rainTimeFilter={rainTimeFilter}
              onRainTimeFilterChange={setRainTimeFilter}
              pm25Filter={pm25Filter}
              onPm25Change={setPm25Filter}
              wildfireTimeFilter={wildfireTimeFilter}
              onWildfireTimeFilterChange={setWildfireTimeFilter}
              showBurnFreq={showBurnFreq}
              onShowBurnFreqChange={setShowBurnFreq}
              showBurnScar={showBurnScar}
              onShowBurnScarChange={setShowBurnScar}
              wildfireMapMode={wildfireMapMode}
              onWildfireMapModeChange={setWildfireMapMode}
              droughtLayers={droughtLayers}
              onDroughtLayersChange={setDroughtLayers}
              droughtMapMode={droughtMapMode}
              onDroughtMapModeChange={setDroughtMapMode}
              floodTimeFilter={floodTimeFilter}
              onFloodTimeFilterChange={setFloodTimeFilter}
              showFloodFrequency={showFloodFrequency}
              onShowFloodFrequencyChange={setShowFloodFrequency}
              showWaterHyacinth={showWaterHyacinth}
              onShowWaterHyacinthChange={setShowWaterHyacinth}
              floodMapMode={floodMapMode}
              onFloodMapModeChange={setFloodMapMode}
              showRainRadarOnFlood={showRainRadarOnFlood}
              onShowRainRadarOnFloodChange={setShowRainRadarOnFlood}
              showSentinel2TrueColor={showSentinel2TrueColor}
              onShowSentinel2TrueColorChange={setShowSentinel2TrueColor}
              showSentinel1Sar={showSentinel1Sar}
              onShowSentinel1SarChange={setShowSentinel1Sar}
              onOpenCrowdsourceModal={() => setIsCrowdsourceModalOpen(true)}
            />
            
            {/* Statistics Panel */}
            <StatisticsPanel
              stats={selectedType === 'sinkhole' ? sinkholeStats : getCurrentStats(selectedType)}
              isLoading={getCurrentLoading(selectedType)}
              disasterType={selectedType}
            />

            {/* Specific Charts for Storms */}
            {selectedType === 'storm' && (
              <StormCharts
                storms={storms}
                stats={stormStats}
              />
            )}

            {/* Specific Charts for Volcanoes */}
            {selectedType === 'volcano' && (
              <VolcanoCharts
                volcanoes={volcanoes}
                stats={volcanoStats}
              />
            )}
            
            {/* Specific Charts for Wildfire */}
            {selectedType === 'wildfire' && (
              <WildfireCharts 
                hotspots={hotspots}
                stats={wildfireStats}
              />
            )}
            
            {/* Specific Charts for Air Pollution */}
            {selectedType === 'airpollution' && (
              <AirPollutionCharts 
                stations={airStations}
                stats={airStats}
              />
            )}

            {/* Specific Charts for Drought */}
            {selectedType === 'drought' && (
              <DroughtCharts 
                stats={droughtStats}
              />
            )}

            {/* Specific Charts for Flood (Enhanced with Sentinel & Crowdsource stats) */}
            {selectedType === 'flood' && (
              <FloodCharts 
                stats={floodStats}
              />
            )}

            {/* Sinkhole News Section */}
            {selectedType === 'sinkhole' && (
              <SinkholeNews />
            )}
          </>
        )}
      </div>

      {/* Citizen Crowdsourcing Flood Report Dialog */}
      <CrowdsourceFloodModal
        isOpen={isCrowdsourceModalOpen}
        onClose={() => setIsCrowdsourceModalOpen(false)}
        onSubmitReport={addReport}
        onNavigateToLocation={(lat, lng) => onLocationSelect(lat, lng, 'รายงานประชาชน')}
      />

      {/* Bangkok Flood Modals */}
      {bkkSelectedRoad && (
        <BangkokRoadDetailModal
          isOpen={bkkRoadModalOpen}
          onClose={() => setBkkRoadModalOpen(false)}
          road={bkkSelectedRoad}
        />
      )}

      {/* Typhoon AI Disaster Intelligence Modal */}
      <TyphoonDisasterModal
        isOpen={isTyphoonOpen}
        onClose={() => setTyphoonOpen(false)}
        telemetry={liveTelemetry}
        onOpenCrowdsource={() => {
          setTyphoonOpen(false);
          setIsCrowdsourceModalOpen(true);
        }}
      />

      {/* Floating Restore Analytics Panel Button when in Full Map Mode */}
      {isFullMapMode && onToggleFullMapMode && (
        <button
          type="button"
          onClick={onToggleFullMapMode}
          className="fixed bottom-5 right-5 z-[1001] bg-slate-900/95 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/50 shadow-2xl rounded-full py-2.5 px-4 flex items-center gap-2 font-bold text-xs backdrop-blur-md transition-all hover:scale-105 active:scale-95 ring-2 ring-cyan-500/30"
          title="สลับกลับไปดูแถบสถิติและตัวกรอง"
        >
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span>เปิดแถบข้อมูลสถิติ (Analytics Panel)</span>
        </button>
      )}
    </div>
  );
};

export default DisasterMapContent;
