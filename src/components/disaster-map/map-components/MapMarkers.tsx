
import React, { memo } from 'react';
import EarthquakeMarker from '../EarthquakeMarker';
import RainSensorMarker from '../RainSensorMarker';
import HotspotMarker from '../HotspotMarker';
import AirStationMarker from '../AirStationMarker';
import { FloodDataMarker } from '../FloodDataMarker';
import { OpenMeteoWeatherMarker } from '../OpenMeteoWeatherMarker';
import { Earthquake, RainSensor, AirPollutionData } from '../types';
import { GISTDAHotspot } from '../useGISTDAData';
import { FloodDataPoint } from '../hooks/useOpenMeteoFloodData';
import { OpenMeteoRainDataPoint } from '../hooks/useOpenMeteoRainData';
import { DisasterType } from '../DisasterMap';

interface MapMarkersProps {
  selectedType: DisasterType;
  filteredEarthquakes: Earthquake[];
  filteredRainSensors: RainSensor[];
  hotspots: GISTDAHotspot[];
  filteredAirStations: AirPollutionData[];
  floodDataPoints?: FloodDataPoint[];
  openMeteoRainData?: OpenMeteoRainDataPoint[];
}

// Memoized individual marker components to prevent unnecessary re-renders
const MemoizedEarthquakeMarker = memo(EarthquakeMarker);
const MemoizedRainSensorMarker = memo(RainSensorMarker);
const MemoizedHotspotMarker = memo(HotspotMarker);
const MemoizedAirStationMarker = memo(AirStationMarker);
const MemoizedFloodDataMarker = memo(FloodDataMarker);
const MemoizedOpenMeteoWeatherMarker = memo(OpenMeteoWeatherMarker);

export const MapMarkers: React.FC<MapMarkersProps> = memo(({
  selectedType,
  filteredEarthquakes,
  filteredRainSensors,
  hotspots,
  filteredAirStations,
  floodDataPoints = [],
  openMeteoRainData = []
}) => {
  return (
    <>
      {/* Earthquake markers */}
      {selectedType === 'earthquake' && filteredEarthquakes.map((earthquake) => (
        <MemoizedEarthquakeMarker key={earthquake.id} earthquake={earthquake} />
      ))}

      {/* Rain sensor markers */}
      {selectedType === 'heavyrain' && filteredRainSensors.map((sensor) => (
        <MemoizedRainSensorMarker key={sensor.id} sensor={sensor} />
      ))}

      {/* Open-Meteo rain data markers */}
      {selectedType === 'openmeteorain' && openMeteoRainData.map((dataPoint, index) => (
        <MemoizedOpenMeteoWeatherMarker key={`openmeteo-${index}`} dataPoint={dataPoint} />
      ))}

      {/* Wildfire hotspot markers */}
      {selectedType === 'wildfire' && hotspots.map((hotspot) => (
        <MemoizedHotspotMarker key={`${hotspot.geometry?.coordinates?.[1]}-${hotspot.geometry?.coordinates?.[0]}-${hotspot.ACQ_DATE}`} hotspot={hotspot} />
      ))}

      {/* Air pollution station markers */}
      {selectedType === 'airpollution' && filteredAirStations.map((station) => (
        <MemoizedAirStationMarker key={station.id} station={station} />
      ))}

      {/* Flood data markers */}
      {selectedType === 'flood' && floodDataPoints.map((floodPoint, index) => (
        <MemoizedFloodDataMarker key={`flood-${index}`} floodPoint={floodPoint} />
      ))}
    </>
  );
});

MapMarkers.displayName = 'MapMarkers';
