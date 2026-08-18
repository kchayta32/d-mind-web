import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Earthquake, RainSensor, AirPollutionData, StormData, VolcanoData, BaseMapLayerType } from './types';
import { GISTDAHotspot } from './useGISTDAData';
import { RainViewerData } from './useRainViewerData';
import { MapLayers } from './map-components/MapLayers';
import { MapMarkers } from './map-components/MapMarkers';
import { BaseLayerSelector } from './map-components/BaseLayerSelector';
import { RadarPlayer } from './map-components/RadarPlayer';
import { ApiStatusBadge } from './ApiStatusBadge';
import { DisasterSummaryBanner } from './DisasterSummaryBanner';
import { MapOverlays } from './MapOverlays';
import { DisasterType } from './DisasterMap';
import 'leaflet/dist/leaflet.css';
import { FloodDataPoint } from './hooks/useOpenMeteoFloodData';
import { FloodFeature } from './hooks/useGISTDAFloodData';
import { OpenMeteoRainDataPoint } from './hooks/useOpenMeteoRainData';
import { SinkholeData } from '../../hooks/useSinkholeData';
import { UserLocationMarker } from './UserLocationMarker';
import { LocationControls } from './LocationControls';

interface MapViewProps {
  earthquakes?: Earthquake[];
  rainSensors?: RainSensor[];
  hotspots?: GISTDAHotspot[];
  airStations?: AirPollutionData[];
  rainData?: RainViewerData | null;
  gistdaFloodFeatures?: FloodFeature[];
  floodDataPoints?: FloodDataPoint[];
  openMeteoRainData?: OpenMeteoRainDataPoint[];
  storms?: StormData[];
  volcanoes?: VolcanoData[];
  sinkholes?: SinkholeData[];
  selectedType: DisasterType;
  magnitudeFilter?: number;
  humidityFilter?: number;
  pm25Filter?: number;
  droughtLayers?: string[];
  droughtMapMode?: import('@/services/gistdaService').DroughtMapProtocol;
  floodTimeFilter?: string;
  showFloodFrequency?: boolean;
  floodMapMode?: import('@/services/gistdaService').FloodMapProtocol;
  showWaterHyacinth?: boolean;
  wildfireTimeFilter?: string;
  showBurnFreq?: boolean;
  showBurnScar?: boolean;
  wildfireMapMode?: import('@/services/gistdaService').WildfireMapProtocol;
  isLoading?: boolean;
  onLocationSelect?: (lat: number, lon: number, name: string) => void;
  onRefreshAll?: () => void;
}

const baseLayerUrls: Record<BaseMapLayerType, { url: string; attribution: string; maxZoom?: number }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 17
  }
};

export const MapView: React.FC<MapViewProps> = ({ 
  earthquakes = [],
  rainSensors = [],
  hotspots = [],
  airStations = [],
  rainData = null,
  gistdaFloodFeatures = [],
  floodDataPoints = [],
  openMeteoRainData = [],
  storms = [],
  volcanoes = [],
  sinkholes = [],
  selectedType,
  magnitudeFilter = 0,
  humidityFilter = 0,
  pm25Filter = 0,
  droughtLayers = [],
  droughtMapMode = 'wmts',
  floodTimeFilter = '3days',
  showFloodFrequency = false,
  floodMapMode = 'wmts',
  showWaterHyacinth = false,
  wildfireTimeFilter = '1day',
  showBurnFreq = false,
  showBurnScar = false,
  wildfireMapMode = 'wmts',
  isLoading = false,
  onLocationSelect,
  onRefreshAll
}) => {
  const [baseLayer, setBaseLayer] = useState<BaseMapLayerType>('osm');
  const [rainOverlayType, setRainOverlayType] = useState<'radar' | 'satellite'>('radar');
  const [rainTimeType, setRainTimeType] = useState<'past' | 'future'>('past');
  const [showRainOverlay, setShowRainOverlay] = useState(true);
  const [rainFrameIndex, setRainFrameIndex] = useState(0);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const mapRef = useRef<any>(null);

  const safeEarthquakes = Array.isArray(earthquakes) ? earthquakes : [];
  const safeRainSensors = Array.isArray(rainSensors) ? rainSensors : [];
  const safeAirStations = Array.isArray(airStations) ? airStations : [];
  const safeHotspots = Array.isArray(hotspots) ? hotspots : [];
  const safeFloodPoints = Array.isArray(floodDataPoints) ? floodDataPoints : [];
  const safeOpenMeteoRain = Array.isArray(openMeteoRainData) ? openMeteoRainData : [];
  const safeStorms = Array.isArray(storms) ? storms : [];
  const safeVolcanoes = Array.isArray(volcanoes) ? volcanoes : [];
  const safeSinkholes = Array.isArray(sinkholes) ? sinkholes : [];

  // Filter data safely based on current filters
  const filteredEarthquakes = safeEarthquakes.filter(eq => (eq?.magnitude ?? 0) >= magnitudeFilter);
  const filteredRainSensors = safeRainSensors.filter(sensor => (sensor?.humidity ?? 0) >= humidityFilter);
  const filteredAirStations = safeAirStations.filter(station => (station?.pm25 ?? 0) >= pm25Filter);

  const handleNavigateTo = (lat: number, lng: number, zoom: number = 8) => {
    if (mapRef.current && typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
      mapRef.current.setView([lat, lng], zoom, { animate: true });
    }
  };

  // Thailand center coordinates
  const center: [number, number] = [13.7563, 100.5018];
  const activeBaseConfig = baseLayerUrls[baseLayer] || baseLayerUrls.osm;

  return (
    <div className="relative h-full w-full z-0 flex flex-col">
      {/* Real-time Disaster Urgent Alert Banner */}
      <DisasterSummaryBanner
        storms={safeStorms}
        earthquakes={safeEarthquakes}
        airStations={safeAirStations}
        floodPoints={safeFloodPoints}
        onNavigateTo={handleNavigateTo}
      />

      <div className="relative flex-1 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer
          ref={mapRef}
          center={center}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl z-0"
        >
          {/* Dynamic Base Layer */}
          <TileLayer
            key={baseLayer}
            attribution={activeBaseConfig.attribution}
            url={activeBaseConfig.url}
            maxZoom={activeBaseConfig.maxZoom || 18}
          />
          
          {/* User Location Marker */}
          <UserLocationMarker showLocation={showUserLocation} />
          
          {/* Map Layer Overlays (WMS, Radar Tiles, Drought) */}
          <MapLayers
            selectedType={selectedType}
            droughtLayers={droughtLayers}
            droughtMapMode={droughtMapMode}
            floodTimeFilter={floodTimeFilter}
            showFloodFrequency={showFloodFrequency}
            floodMapMode={floodMapMode}
            showRainOverlay={showRainOverlay}
            rainData={rainData}
            rainOverlayType={rainOverlayType}
            rainTimeType={rainTimeType}
            wildfireTimeFilter={wildfireTimeFilter}
            showBurnFreq={showBurnFreq}
            showBurnScar={showBurnScar}
            wildfireMapMode={wildfireMapMode}
            rainFrameIndex={rainFrameIndex}
          />
          
          {/* Disaster Data Markers */}
          {!isLoading && (
            <MapMarkers
              selectedType={selectedType}
              filteredEarthquakes={filteredEarthquakes}
              filteredRainSensors={filteredRainSensors}
              hotspots={safeHotspots}
              filteredAirStations={filteredAirStations}
              gistdaFloodFeatures={gistdaFloodFeatures}
              floodDataPoints={safeFloodPoints}
              openMeteoRainData={safeOpenMeteoRain}
              storms={safeStorms}
              volcanoes={safeVolcanoes}
              sinkholes={safeSinkholes}
            />
          )}
        </MapContainer>
        
        {/* Top-Left Floating Controls: API Status Badge */}
        <div className="absolute top-4 left-14 z-[1000] flex items-center gap-2">
          <ApiStatusBadge onRefreshAll={onRefreshAll} isLoading={isLoading} />
        </div>

        {/* Top-Right Floating Controls: Base Layer Selector & Location */}
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
          <BaseLayerSelector
            currentLayer={baseLayer}
            onLayerChange={setBaseLayer}
          />
          <LocationControls
            showUserLocation={showUserLocation}
            onToggleLocation={setShowUserLocation}
          />
        </div>
        
        {/* Radar Player for Heavy Rain & Radar mode */}
        {selectedType === 'heavyrain' && rainData && (
          <div className="absolute bottom-6 left-4 z-[1000]">
            <RadarPlayer
              rainData={rainData}
              showOverlay={showRainOverlay}
              onToggleOverlay={setShowRainOverlay}
              overlayType={rainOverlayType}
              onOverlayTypeChange={setRainOverlayType}
              timeType={rainTimeType}
              onTimeTypeChange={setRainTimeType}
              currentFrameIndex={rainFrameIndex}
              onFrameIndexChange={setRainFrameIndex}
            />
          </div>
        )}
        
        {/* Overlays for loading */}
        <MapOverlays selectedType={selectedType} isLoading={isLoading} />
      </div>
    </div>
  );
};
