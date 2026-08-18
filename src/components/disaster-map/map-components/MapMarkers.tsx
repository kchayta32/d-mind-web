import React from 'react';
import ClusteredEarthquakeMarkers from '../ClusteredEarthquakeMarkers';
import ClusteredHotspotMarkers from '../ClusteredHotspotMarkers';
import RainSensorMarker from '../RainSensorMarker';
import AirStationMarker from '../AirStationMarker';
import { FloodDataMarker } from '../FloodDataMarker';
import { FloodMarker } from '../FloodMarker';
import { OpenMeteoWeatherMarker } from '../OpenMeteoWeatherMarker';
import SinkholeMarker from '../SinkholeMarker';
import { StormMarker } from './StormMarker';
import { VolcanoMarker } from './VolcanoMarker';
import { Earthquake, RainSensor, AirPollutionData, StormData, VolcanoData } from '../types';
import { GISTDAHotspot } from '../useGISTDAData';
import { FloodDataPoint } from '../hooks/useOpenMeteoFloodData';
import { FloodFeature, getFloodCenter } from '../hooks/useGISTDAFloodData';
import { OpenMeteoRainDataPoint } from '../hooks/useOpenMeteoRainData';
import { SinkholeData } from '../../../hooks/useSinkholeData';
import { DisasterType } from '../DisasterMap';

interface MapMarkersProps {
  selectedType: DisasterType;
  filteredEarthquakes: Earthquake[];
  filteredRainSensors: RainSensor[];
  hotspots: GISTDAHotspot[];
  filteredAirStations: AirPollutionData[];
  floodDataPoints?: FloodDataPoint[];
  gistdaFloodFeatures?: FloodFeature[];
  openMeteoRainData?: OpenMeteoRainDataPoint[];
  storms?: StormData[];
  volcanoes?: VolcanoData[];
  sinkholes: SinkholeData[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({
  selectedType,
  filteredEarthquakes,
  filteredRainSensors,
  hotspots,
  filteredAirStations,
  floodDataPoints = [],
  gistdaFloodFeatures = [],
  openMeteoRainData = [],
  storms = [],
  volcanoes = [],
  sinkholes
}) => {
  return (
    <>
      {/* Earthquake markers with clustering */}
      {selectedType === 'earthquake' && (
        <ClusteredEarthquakeMarkers earthquakes={filteredEarthquakes} />
      )}

      {/* Storm & Tropical Cyclone markers */}
      {selectedType === 'storm' && storms.map((storm) => (
        <StormMarker key={storm.id} storm={storm} />
      ))}

      {/* Volcano markers */}
      {selectedType === 'volcano' && volcanoes.map((volcano) => (
        <VolcanoMarker key={volcano.id} volcano={volcano} />
      ))}

      {/* Rain sensor markers */}
      {selectedType === 'heavyrain' && filteredRainSensors.map((sensor) => (
        <RainSensorMarker key={sensor.id} sensor={sensor} />
      ))}

      {/* Open-Meteo rain and weather data markers */}
      {selectedType === 'openmeteorain' && openMeteoRainData.map((dataPoint, index) => (
        <OpenMeteoWeatherMarker 
          key={`openmeteo-${dataPoint.locationName}-${index}`} 
          dataPoint={dataPoint} 
        />
      ))}

      {/* Wildfire hotspot markers with clustering for high performance */}
      {selectedType === 'wildfire' && (
        <ClusteredHotspotMarkers hotspots={hotspots} />
      )}

      {/* Air pollution station markers */}
      {selectedType === 'airpollution' && filteredAirStations.map((station) => (
        <AirStationMarker key={station.id} station={station} />
      ))}

      {/* GISTDA Flood markers */}
      {selectedType === 'flood' && gistdaFloodFeatures.map((feature, index) => {
        const center = getFloodCenter(feature);
        return (
          <FloodMarker key={`gistda-flood-${feature.id}-${index}`} feature={feature} center={center} />
        );
      })}

      {/* Open-Meteo Flood data markers (river discharge) */}
      {selectedType === 'flood' && floodDataPoints.map((floodPoint, index) => (
        <FloodDataMarker key={`flood-river-${index}`} floodPoint={floodPoint} />
      ))}

      {/* Sinkhole markers */}
      {selectedType === 'sinkhole' && sinkholes.map((sinkhole) => (
        <SinkholeMarker key={sinkhole.id} sinkhole={sinkhole} />
      ))}
    </>
  );
};
