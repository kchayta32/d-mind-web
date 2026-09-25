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
  showSentinel2TrueColor?: boolean;
  showSentinel1Sar?: boolean;
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
  showSentinel2TrueColor = false,
  showSentinel1Sar = false,
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

      {/* Sentinel satellite & GISTDA flood layers */}
      {selectedType === 'flood' && (
        <FloodWMSLayers
          timeFilter={floodTimeFilter as FloodTimeFilter}
          showFrequency={showFloodFrequency}
          opacity={0.75}
          mapProtocol={floodMapMode}
          showSentinel2TrueColor={showSentinel2TrueColor}
          showSentinel1Sar={showSentinel1Sar}
        />
      )}
      
      {/* Rain Doppler Radar overlay: active for heavyrain OR flood mode when user toggles radar */}
      {(selectedType === 'heavyrain' || selectedType === 'flood') && showRainOverlay && rainData && (
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

export default MapLayers;
