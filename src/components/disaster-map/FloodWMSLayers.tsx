import React from 'react';
import { TileLayer } from 'react-leaflet';
import { 
  GISTDA_CONFIG, 
  FloodTimeFilter, 
  FloodMapProtocol, 
  getGistdaFloodTmsTileUrl 
} from '@/services/gistdaService';

interface FloodWMSLayersProps {
  timeFilter: '1day' | '3days' | '7days' | '30days';
  showFrequency: boolean;
  opacity?: number;
  mapProtocol?: FloodMapProtocol;
  showSentinel2TrueColor?: boolean;
  showSentinel1Sar?: boolean;
}

export const FloodWMSLayers: React.FC<FloodWMSLayersProps> = ({ 
  timeFilter = '3days', 
  showFrequency = true, 
  opacity = 0.85,
  showSentinel2TrueColor = false,
  showSentinel1Sar = false
}) => {
  const safeTime: FloodTimeFilter = (timeFilter === '1day' || timeFilter === '3days' || timeFilter === '7days' || timeFilter === '30days')
    ? timeFilter
    : '3days';

  const apiKey = GISTDA_CONFIG.PRIMARY_API_KEY;

  return (
    <>
      {/* 0. Copernicus Sentinel-2 True Color / Cloudless Base Imagery (10m Resolution via EOX WMTS) */}
      {showSentinel2TrueColor && (
        <TileLayer
          key="sentinel2-cloudless-wmts"
          url="https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg"
          opacity={0.9}
          attribution="&copy; <a href='https://s2maps.eu' target='_blank'>Sentinel-2 cloudless</a> by EOX IT Services GmbH (Copernicus Sentinel data)"
          maxZoom={18}
        />
      )}

      {/* 0.1 Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) Water Backscatter / Hydrography Layer */}
      {showSentinel1Sar && (
        <TileLayer
          key="sentinel1-sar-wmts"
          url="https://tiles.maps.eox.at/wmts/1.0.0/hydrography_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.png"
          opacity={0.75}
          attribution="&copy; Copernicus Sentinel-1 C-SAR Flood & Water Surface Backscatter"
          maxZoom={18}
        />
      )}

      {/* 1. Main Sentinel Satellite Flood Area Layer (Processed by GISTDA API 2.0 from Sentinel-1 SAR & Sentinel-2) */}
      {timeFilter && (
        <TileLayer
          key={`flood-sentinel-xyz-${safeTime}`}
          url={getGistdaFloodTmsTileUrl('flood', safeTime, apiKey)}
          opacity={opacity}
          tms={false} // GISTDA uses standard XYZ tiling; tms=false ensures valid y-coordinate
          attribution={`GISTDA Sentinel-1/2 Satellite Flood Inspection (${safeTime})`}
          maxZoom={18}
        />
      )}

      {/* 2. Recurrent Flood Areas (พื้นที่น้ำท่วมซ้ำซาก สถิติจากดาวเทียมย้อนหลัง) */}
      {showFrequency && (
        <TileLayer
          key="flood-freq-xyz"
          url={getGistdaFloodTmsTileUrl('flood-freq', safeTime, apiKey)}
          opacity={opacity * 0.75}
          tms={false}
          attribution="GISTDA Sentinel Historical Flood Frequency TMS"
          maxZoom={18}
        />
      )}
    </>
  );
};

export default FloodWMSLayers;
