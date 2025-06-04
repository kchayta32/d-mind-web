
import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Earthquake, RainSensor } from './types';
import { GISTDAHotspot } from './useGISTDAData';
import { RainViewerData } from './useRainViewerData';
import EarthquakeMarker from './EarthquakeMarker';
import RainSensorMarker from './RainSensorMarker';
import HotspotMarker from './HotspotMarker';
import RainOverlay from './RainOverlay';
import { MapControls } from './MapControls';
import { MapOverlays } from './MapOverlays';
import { DebugInfo } from './DebugInfo';
import { DisasterType } from './DisasterMap';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  earthquakes: Earthquake[];
  rainSensors: RainSensor[];
  hotspots: GISTDAHotspot[];
  rainData: RainViewerData | null;
  selectedType: DisasterType;
  magnitudeFilter: number;
  humidityFilter: number;
  isLoading: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ 
  earthquakes, 
  rainSensors,
  hotspots,
  rainData,
  selectedType,
  magnitudeFilter,
  humidityFilter,
  isLoading 
}) => {
  const [rainOverlayType, setRainOverlayType] = useState<'radar' | 'satellite'>('radar');
  const [rainTimeType, setRainTimeType] = useState<'past' | 'future'>('past');
  const [showRainOverlay, setShowRainOverlay] = useState(false);

  console.log('MapView props:', { 
    earthquakes: earthquakes.length, 
    rainSensors: rainSensors.length,
    hotspots: hotspots.length,
    rainData: rainData ? 'loaded' : 'null',
    selectedType, 
    isLoading 
  });

  // Filter data based on current filters
  const filteredEarthquakes = earthquakes.filter(eq => eq.magnitude >= magnitudeFilter);
  const filteredRainSensors = rainSensors.filter(sensor => 
    (sensor.humidity || 0) >= humidityFilter
  );

  console.log('Filtered data:', { 
    filteredEarthquakes: filteredEarthquakes.length, 
    filteredRainSensors: filteredRainSensors.length,
    hotspots: hotspots.length
  });

  // Thailand center coordinates
  const center: [number, number] = [13.7563, 100.5018];

  const renderMarkers = () => {
    switch (selectedType) {
      case 'earthquake':
        console.log('Rendering earthquake markers:', filteredEarthquakes.length);
        return filteredEarthquakes.map((earthquake) => (
          <EarthquakeMarker key={earthquake.id} earthquake={earthquake} />
        ));
      
      case 'heavyrain':
        console.log('Rendering rain sensor markers:', filteredRainSensors.length);
        return filteredRainSensors.map((sensor) => (
          <RainSensorMarker key={`rain-sensor-${sensor.id}`} sensor={sensor} />
        ));
      
      case 'wildfire':
        console.log('Rendering hotspot markers:', hotspots.length);
        return hotspots.map((hotspot, index) => (
          <HotspotMarker key={`hotspot-${index}`} hotspot={hotspot} />
        ));
      
      default:
        return null;
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Rain overlay for heavy rain type */}
        {selectedType === 'heavyrain' && showRainOverlay && rainData && (
          <RainOverlay 
            rainData={rainData}
            overlayType={rainOverlayType}
            timeType={rainTimeType}
          />
        )}
        
        {!isLoading && renderMarkers()}
      </MapContainer>
      
      {/* Rain controls for heavy rain type */}
      {selectedType === 'heavyrain' && (
        <MapControls
          rainData={rainData}
          showRainOverlay={showRainOverlay}
          setShowRainOverlay={setShowRainOverlay}
          rainOverlayType={rainOverlayType}
          setRainOverlayType={setRainOverlayType}
          rainTimeType={rainTimeType}
          setRainTimeType={setRainTimeType}
        />
      )}
      
      {/* Overlays for loading and coming soon */}
      <MapOverlays selectedType={selectedType} isLoading={isLoading} />
      
      {/* Debug information */}
      <DebugInfo
        selectedType={selectedType}
        isLoading={isLoading}
        rainSensors={rainSensors}
        filteredRainSensors={filteredRainSensors}
        humidityFilter={humidityFilter}
        rainData={rainData}
        hotspots={hotspots}
      />
    </div>
  );
};
