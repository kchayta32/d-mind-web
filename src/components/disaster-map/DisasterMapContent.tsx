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
import { ExternalLink } from 'lucide-react';
import { SelectedLocation } from './types';

interface DisasterMapContentProps {
  selectedType: DisasterType;
  onTypeChange: (type: DisasterType) => void;
  onLocationSelect: (lat: number, lon: number, name: string, locationData?: SelectedLocation) => void;
  selectedLocation?: SelectedLocation | null;
  onClearSelectedLocation?: () => void;
}

export const DisasterMapContent: React.FC<DisasterMapContentProps> = ({
  selectedType,
  onTypeChange,
  onLocationSelect,
  selectedLocation = null,
  onClearSelectedLocation
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

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
      {/* Main Map Container (8 cols on desktop) */}
      <div className="lg:col-span-8 xl:col-span-9 h-[480px] sm:h-[560px] lg:h-[calc(100vh-175px)] min-h-[440px] rounded-xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-800 [&:has([data-state=open])]:pointer-events-none">
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
          />
        )}
      </div>
      
      {/* Right Sidebar for Analytics & Controls (4 cols on desktop) */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-3.5 max-h-none lg:max-h-[calc(100vh-175px)] overflow-y-auto pr-1 pb-4">
        {selectedType === 'bkk_road_flood' ? (
          <>
            <a
              href="/bangkok-flood"
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-md hover:from-sky-700 hover:to-indigo-800 transition font-bold text-xs"
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
    </div>
  );
};

export default DisasterMapContent;
