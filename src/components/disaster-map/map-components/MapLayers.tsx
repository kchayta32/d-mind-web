import React from 'react';
import { WildfireWMSLayers } from '../WildfireWMSLayers';
import DroughtWMSLayers from '../DroughtWMSLayers';
import FloodWMSLayers from '../FloodWMSLayers';
import RainOverlay from '../RainOverlay';
import { DisasterType } from '../DisasterMap';
import { RainViewerData } from '../useRainViewerData';
import { WildfireMapProtocol, FloodMapProtocol, DroughtMapProtocol, FloodTimeFilter } from '@/services/gistdaService';

interface MapLayersProps {
  selectedType: DisasterType;
  droughtLayers: string[];
  droughtMapMode?: DroughtMapProtocol;
  floodTimeFilter: string;
  showFloodFrequency: boolean;
  floodMapMode?: FloodMapProtocol;
  showRainOverlay: boolean;
  rainData: RainViewerData | null;
  rainOverlayType: 'radar' | 'satellite';
  rainTimeType: 'past' | 'future';
  wildfireTimeFilter: string;
  showBurnFreq: boolean;
  showBurnScar?: boolean;
  wildfireMapMode?: WildfireMapProtocol;
  rainFrameIndex?: number;
}

export const MapLayers: React.FC<MapLayersProps> = ({
  selectedType,
  droughtLayers,
  droughtMapMode = 'wmts',
  floodTimeFilter,
  showFloodFrequency,
  floodMapMode = 'wmts',
  showRainOverlay,
  rainData,
  rainOverlayType,
  rainTimeType,
  wildfireTimeFilter,
  showBurnFreq,
  showBurnScar = false,
  wildfireMapMode = 'wmts',
  rainFrameIndex
}) => {
  return (
    <>
      {/* WMS / WMTS / TMS layers for wildfire */}
      {selectedType === 'wildfire' && (
        <WildfireWMSLayers
          timeFilter={wildfireTimeFilter}
          showBurnFreq={showBurnFreq}
          showBurnScar={showBurnScar}
          mapProtocol={wildfireMapMode}
        />
      )}

      {/* WMS / WMTS / TMS layers for drought */}
      {selectedType === 'drought' && (
        <DroughtWMSLayers
          selectedLayers={droughtLayers}
          opacity={0.7}
          mapProtocol={droughtMapMode}
        />
      )}

      {/* WMS / WMTS / TMS layers for flood */}
      {selectedType === 'flood' && (
        <FloodWMSLayers
          timeFilter={floodTimeFilter as FloodTimeFilter}
          showFrequency={showFloodFrequency}
          opacity={0.7}
          mapProtocol={floodMapMode}
        />
      )}
      
      {/* Rain overlay for heavy rain type */}
      {selectedType === 'heavyrain' && showRainOverlay && rainData && (
        <RainOverlay 
          rainData={rainData}
          overlayType={rainOverlayType}
          timeType={rainTimeType}
          frameIndex={rainFrameIndex}
        />
      )}
    </>
  );
};
