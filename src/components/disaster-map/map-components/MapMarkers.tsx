
import React from 'react';
import { EarthquakeMarker } from '../EarthquakeMarker';
import { RainSensorMarker } from '../RainSensorMarker';
import { HotspotMarker } from '../HotspotMarker';
import { AirStationMarker } from '../AirStationMarker';
import { FloodDataMarker } from '../FloodDataMarker';
import { Earthquake, RainSensor, AirPollutionData } from '../types';
import { GISTDAHotspot } from '../useGISTDAData';
import { FloodDataPoint } from '../hooks/useOpenMeteoFloodData';
import { DisasterType } from '../DisasterMap';

interface MapMarkersProps {
  selectedType: DisasterType;
  filteredEarthquakes: Earthquake[];
  filteredRainSensors: RainSensor[];
  hotspots: GISTDAHotspot[];
  filteredAirStations: AirPollutionData[];
  floodDataPoints?: FloodDataPoint[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({
  selectedType,
  filteredEarthquakes,
  filteredRainSensors,
  hotspots,
  filteredAirStations,
  floodDataPoints = []
}) => {
  return (
    <>
      {/* Earthquake markers */}
      {selectedType === 'earthquake' && filteredEarthquakes.map((earthquake) => (
        <EarthquakeMarker key={earthquake.id} earthquake={earthquake} />
      ))}

      {/* Rain sensor markers */}
      {selectedType === 'heavyrain' && filteredRainSensors.map((sensor) => (
        <RainSensorMarker key={sensor.id} sensor={sensor} />
      ))}

      {/* Wildfire hotspot markers */}
      {selectedType === 'wildfire' && hotspots.map((hotspot) => (
        <HotspotMarker key={`${hotspot.lat}-${hotspot.lon}-${hotspot.acq_date}`} hotspot={hotspot} />
      ))}

      {/* Air pollution station markers */}
      {selectedType === 'airpollution' && filteredAirStations.map((station) => (
        <AirStationMarker key={station.id} station={station} />
      ))}

      {/* Flood data markers */}
      {selectedType === 'flood' && floodDataPoints.map((floodPoint, index) => (
        <FloodDataMarker key={`flood-${index}`} floodPoint={floodPoint} />
      ))}
    </>
  );
};
