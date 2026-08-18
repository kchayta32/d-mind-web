import React from 'react';
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

interface DisasterMapContentProps {
  selectedType: DisasterType;
  onTypeChange: (type: DisasterType) => void;
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export const DisasterMapContent: React.FC<DisasterMapContentProps> = ({
  selectedType,
  onTypeChange,
  onLocationSelect
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
    droughtLayers,
    setDroughtLayers,
    floodTimeFilter,
    setFloodTimeFilter,
    showFloodFrequency,
    setShowFloodFrequency,
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

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
      {/* Main Map Container (8 cols on desktop) */}
      <div className="lg:col-span-8 xl:col-span-9 h-[480px] sm:h-[560px] lg:h-[calc(100vh-175px)] min-h-[440px] rounded-xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-800 [&:has([data-state=open])]:pointer-events-none">
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
          selectedType={selectedType}
          magnitudeFilter={magnitudeFilter}
          humidityFilter={humidityFilter}
          pm25Filter={pm25Filter}
          droughtLayers={droughtLayers}
          floodTimeFilter={floodTimeFilter}
          showFloodFrequency={showFloodFrequency}
          wildfireTimeFilter={wildfireTimeFilter}
          showBurnFreq={showBurnFreq}
          isLoading={getCurrentLoading(selectedType)}
          onLocationSelect={onLocationSelect}
          onRefreshAll={refetchAll}
        />
      </div>
      
      {/* Right Sidebar for Analytics & Controls (4 cols on desktop) */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-3.5 max-h-none lg:max-h-[calc(100vh-175px)] overflow-y-auto pr-1 pb-4">
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
          droughtLayers={droughtLayers}
          onDroughtLayersChange={setDroughtLayers}
          floodTimeFilter={floodTimeFilter}
          onFloodTimeFilterChange={setFloodTimeFilter}
          showFloodFrequency={showFloodFrequency}
          onShowFloodFrequencyChange={setShowFloodFrequency}
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

        {/* Specific Charts for Flood */}
        {selectedType === 'flood' && (
          <FloodCharts 
            stats={floodStats}
          />
        )}

        {/* Sinkhole News Section */}
        {selectedType === 'sinkhole' && (
          <SinkholeNews />
        )}
      </div>
    </div>
  );
};
