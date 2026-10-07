import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Earthquake, RainSensor, AirPollutionData, StormData, VolcanoData, BaseMapLayerType, CrowdsourcedFloodReport, SelectedLocation } from './types';
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
import { SentinelFloodLegend } from './SentinelFloodLegend';
import { LocationBoundaryLayer } from './LocationBoundaryLayer';
import { DisasterMapHudCard } from './DisasterMapHudCard';
import { AqiScaleLegend } from './AqiScaleLegend';
import { SafetyCheckInModal } from './SafetyCheckInModal';
import { CleanRoomModal } from './CleanRoomModal';
import { EvacuationModal } from './EvacuationModal';
import { X, Sparkles } from 'lucide-react';

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
  crowdsourcedFloodReports?: CrowdsourcedFloodReport[];
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
  showRainRadarOnFlood?: boolean;
  showSentinel2TrueColor?: boolean;
  showSentinel1Sar?: boolean;
  wildfireTimeFilter?: string;
  showBurnFreq?: boolean;
  showBurnScar?: boolean;
  wildfireMapMode?: import('@/services/gistdaService').WildfireMapProtocol;
  isLoading?: boolean;
  onLocationSelect?: (lat: number, lon: number, name: string) => void;
  selectedLocation?: SelectedLocation | null;
  onClearSelectedLocation?: () => void;
  onRefreshAll?: () => void;
  onOpenCrowdsourceModal?: () => void;
  onOpenTyphoonModal?: () => void;
}

const JAWG_ACCESS_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_JAWG_ACCESS_TOKEN) || 'FTtoH6pBTHEDddbaGWyVP2EDCUBCVIdUP92MVIcbIx5H6jYNdDQca7404lHLL3Dc';

const baseLayerUrls: Record<BaseMapLayerType, { url: string; attribution: string; maxZoom?: number; subdomains?: string[] }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c']
  },
  'google-hybrid': {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps (Satellite & Road Labels)',
    maxZoom: 20,
    subdomains: ['0', '1', '2', '3']
  },
  'google-satellite': {
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite',
    maxZoom: 20,
    subdomains: ['0', '1', '2', '3']
  },
  'google-streets': {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Streets',
    maxZoom: 20,
    subdomains: ['0', '1', '2', '3']
  },
  'google-terrain': {
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    maxZoom: 20,
    subdomains: ['0', '1', '2', '3']
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  dark: {
    url: `https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=${JAWG_ACCESS_TOKEN}`,
    attribution: '&copy; <a href="https://www.jawg.io" target="_blank">Jawg</a>Maps &copy; OpenStreetMap',
    maxZoom: 20,
    subdomains: ['a', 'b', 'c', 'd']
  },
  matrix: {
    url: `https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}.png?access-token=${JAWG_ACCESS_TOKEN}`,
    attribution: '&copy; <a href="https://www.jawg.io" target="_blank">Jawg</a>Maps &copy; OpenStreetMap',
    maxZoom: 20,
    subdomains: ['a', 'b', 'c', 'd']
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd']
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 17,
    subdomains: ['a', 'b', 'c']
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
  crowdsourcedFloodReports = [],
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
  showRainRadarOnFlood = true,
  showSentinel2TrueColor = false,
  showSentinel1Sar = false,
  wildfireTimeFilter = '1day',
  showBurnFreq = false,
  showBurnScar = false,
  wildfireMapMode = 'wmts',
  isLoading = false,
  onLocationSelect,
  selectedLocation = null,
  onClearSelectedLocation,
  onRefreshAll,
  onOpenCrowdsourceModal,
  onOpenTyphoonModal
}) => {
  const [baseLayer, setBaseLayer] = useState<BaseMapLayerType>('osm');
  const [rainOverlayType, setRainOverlayType] = useState<'radar' | 'satellite'>('radar');
  const [rainTimeType, setRainTimeType] = useState<'past' | 'future'>('past');
  const [showRainOverlay, setShowRainOverlay] = useState(true);
  const [rainFrameIndex, setRainFrameIndex] = useState(0);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [isSafetyCheckInOpen, setIsSafetyCheckInOpen] = useState(false);
  const [isCleanRoomOpen, setIsCleanRoomOpen] = useState(false);
  const [isEvacuationOpen, setIsEvacuationOpen] = useState(false);
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

  // Active radar overlay state based on selected view
  const isRadarActiveOnMap = selectedType === 'heavyrain' 
    ? showRainOverlay 
    : (selectedType === 'flood' ? (showRainRadarOnFlood && showRainOverlay) : false);

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
            subdomains={activeBaseConfig.subdomains || ['a', 'b', 'c']}
          />
          
          {/* User Location Marker */}
          <UserLocationMarker showLocation={showUserLocation} />

          {/* Selected Location Boundary & Marker (Google Maps Style Dashed Border) */}
          <LocationBoundaryLayer selectedLocation={selectedLocation} />
          
          {/* Map Layer Overlays (WMS, Radar Tiles, Drought, Sentinel Satellite) */}
          <MapLayers
            selectedType={selectedType}
            droughtLayers={droughtLayers}
            droughtMapMode={droughtMapMode}
            floodTimeFilter={floodTimeFilter}
            showFloodFrequency={showFloodFrequency}
            floodMapMode={floodMapMode}
            showSentinel2TrueColor={showSentinel2TrueColor}
            showSentinel1Sar={showSentinel1Sar}
            showRainOverlay={isRadarActiveOnMap}
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
              crowdsourcedFloodReports={crowdsourcedFloodReports}
            />
          )}
        </MapContainer>
        
        {/* Top Floating Badge for Selected Location Boundary */}
        {selectedLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center shadow-lg rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-300 dark:border-blue-800 px-3.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 transition-all animate-in fade-in slide-in-from-top-2">
            <button 
              type="button"
              className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => {
                if (mapRef.current) {
                  if (selectedLocation.boundingBox) {
                    const [south, north, west, east] = selectedLocation.boundingBox;
                    mapRef.current.flyToBounds(
                      [[south, west], [north, east]],
                      { padding: [40, 40], maxZoom: 13, duration: 1.5 }
                    );
                  } else {
                    mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lon], 13, { duration: 1.5 });
                  }
                }
              }}
              title="คลิกเพื่อซูมกลับไปยังขอบเขตนี้"
            >
              <span className="text-blue-600 dark:text-blue-400 font-bold">📍 ขอบเขต:</span>
              <span className="font-semibold max-w-[130px] sm:max-w-[240px] md:max-w-[340px] truncate">
                {selectedLocation.name}
              </span>
            </button>
            <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-2" />
            <button
              type="button"
              onClick={onClearSelectedLocation}
              className="flex items-center gap-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full px-2 py-0.5 transition-colors font-medium"
              title="ล้างขอบเขตพื้นที่ออกจากแผนที่"
            >
              <X className="w-3.5 h-3.5" />
              <span>ล้างขอบเขต</span>
            </button>
          </div>
        )}

        {/* Top-Left Floating Controls: API Status Badge & Typhoon AI Fast Trigger */}
        <div className="absolute top-4 left-14 z-[1000] flex items-center gap-2">
          <ApiStatusBadge onRefreshAll={onRefreshAll} isLoading={isLoading} />
          {onOpenTyphoonModal && (
            <button
              type="button"
              onClick={onOpenTyphoonModal}
              className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ring-1 ring-cyan-500/20"
              title="เปิดระบบวิเคราะห์สถานการณ์ด้วย Typhoon AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Typhoon AI</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded-full border border-cyan-700 font-medium">
                วิเคราะห์สด
              </span>
            </button>
          )}
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
        
        {/* AQI Scale Legend for PM2.5 */}
        {selectedType === 'airpollution' && (
          <div className="absolute top-16 right-4 z-[1000]">
            <AqiScaleLegend />
          </div>
        )}
        
        {/* Radar Player for Heavy Rain & Flood Radar overlay mode (TMD Radar) */}
        {((selectedType === 'heavyrain') || (selectedType === 'flood' && showRainRadarOnFlood)) && rainData && (
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000]">
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

        {/* Sentinel Satellite Flood Map Legend (Draggable & Positioned above RainViewer) */}
        {selectedType === 'flood' && (
          <SentinelFloodLegend isRadarActive={Boolean(showRainRadarOnFlood && rainData)} />
        )}

        {/* Modern Mobile-First Disaster Map HUD Card (Matches Designed Nano Banana UX/UI 100%) */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-[1000] max-w-[calc(100vw-1.5rem)] sm:max-w-md pointer-events-auto">
          <DisasterMapHudCard
            selectedType={selectedType}
            earthquakes={filteredEarthquakes}
            hotspots={safeHotspots}
            airStations={filteredAirStations}
            floodFeatures={gistdaFloodFeatures}
            floodPoints={safeFloodPoints}
            rainDataPoints={safeOpenMeteoRain}
            storms={safeStorms}
            onOpenCrowdsourceModal={onOpenCrowdsourceModal}
            onOpenSafetyCheckIn={() => setIsSafetyCheckInOpen(true)}
            onOpenCleanRoom={() => setIsCleanRoomOpen(true)}
            onOpenEvacuation={() => setIsEvacuationOpen(true)}
            onActivateRadar={() => setShowRainOverlay(true)}
            onOpenTyphoonModal={onOpenTyphoonModal}
          />
        </div>

        {/* Floating Quick Crowdsourcing Button for Citizens (Ground Truth) - shown if HUD minimized/custom */}
        <div className="hidden lg:flex absolute bottom-4 right-4 z-[999] flex-col items-end gap-2">
          {onOpenCrowdsourceModal && selectedType === 'flood' && !showRainRadarOnFlood && (
            <button
              type="button"
              onClick={onOpenCrowdsourceModal}
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-700 hover:to-indigo-800 text-white font-bold text-xs py-2 px-3.5 rounded-full shadow-xl flex items-center gap-2 border-2 border-white/90 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-base">📢</span>
              <span>รายงานน้ำท่วมด้วยตนเอง</span>
              <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                Ground Truth
              </span>
            </button>
          )}
        </div>
        
        {/* Overlays for loading */}
        <MapOverlays selectedType={selectedType} isLoading={isLoading} />
      </div>

      {/* Safety & Emergency Modals */}
      <SafetyCheckInModal
        isOpen={isSafetyCheckInOpen}
        onClose={() => setIsSafetyCheckInOpen(false)}
        disasterTitle={selectedType === 'earthquake' ? 'แผ่นดินไหว' : 'ภัยพิบัติ'}
      />
      <CleanRoomModal
        isOpen={isCleanRoomOpen}
        onClose={() => setIsCleanRoomOpen(false)}
      />
      <EvacuationModal
        isOpen={isEvacuationOpen}
        onClose={() => setIsEvacuationOpen(false)}
        disasterType={selectedType}
      />
    </div>
  );
};

export default MapView;
