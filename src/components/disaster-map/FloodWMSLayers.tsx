import React from 'react';
import { WMSTileLayer, TileLayer } from 'react-leaflet';
import { 
  GISTDA_CONFIG, 
  FloodTimeFilter, 
  FloodMapProtocol, 
  getGistdaFloodWmsUrl, 
  getGistdaFloodWmtsUrl, 
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
  opacity = 0.75,
  mapProtocol = 'wmts',
  showSentinel2TrueColor = false,
  showSentinel1Sar = false
}) => {
  const safeTime: FloodTimeFilter = (timeFilter === '1day' || timeFilter === '3days' || timeFilter === '7days' || timeFilter === '30days')
    ? timeFilter
    : '3days';

  const apiKey = GISTDA_CONFIG.PRIMARY_API_KEY;

  return (
    <>
      {/* 0. Optional Copernicus Sentinel-2 True Color / Cloudless Base Imagery */}
      {showSentinel2TrueColor && (
        <WMSTileLayer
          key="sentinel2-cloudless-wms"
          url="https://tiles.maps.eox.at/wms"
          layers="s2cloudless-2020"
          format="image/jpeg"
          transparent={false}
          opacity={0.85}
          attribution="&copy; <a href='https://s2maps.eu' target='_blank'>Sentinel-2 cloudless</a> by EOX IT Services GmbH (Copernicus Sentinel data)"
          maxZoom={18}
        />
      )}

      {/* 0.1 Optional Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) Water Backscatter Layer */}
      {showSentinel1Sar && (
        <WMSTileLayer
          key="sentinel1-sar-wms"
          url="https://tiles.maps.eox.at/wms"
          layers="hydrography"
          format="image/png"
          transparent={true}
          opacity={0.7}
          attribution="&copy; Copernicus Sentinel-1 C-SAR Flood Detection"
          maxZoom={18}
        />
      )}

      {/* 1. Main Sentinel Satellite Flood Area Layer (Processed by GISTDA API 2.0 from Sentinel-1 SAR & Sentinel-2) */}
      {timeFilter && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key={`flood-sentinel-tms-${safeTime}`}
            url={getGistdaFloodTmsTileUrl('flood', safeTime, apiKey)}
            opacity={opacity}
            tms={true}
            attribution={`GISTDA & Sentinel-1/2 Satellite Flood (${safeTime}) TMS`}
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key={`flood-sentinel-wms-${safeTime}`}
            url={getGistdaFloodWmsUrl('flood', safeTime, apiKey)}
            layers="flood"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution={`GISTDA & Sentinel-1/2 Satellite Flood (${safeTime}) WMS`}
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key={`flood-sentinel-wmts-${safeTime}`}
            url={getGistdaFloodWmtsUrl('flood', safeTime, apiKey)}
            layers="flood"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution={`GISTDA & Sentinel-1/2 Satellite Flood (${safeTime}) WMTS`}
            maxZoom={18}
          />
        )
      )}

      {/* 2. Recurrent Flood Areas (พื้นที่น้ำท่วมซ้ำซาก สถิติจากดาวเทียมย้อนหลัง) */}
      {showFrequency && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="flood-freq-tms"
            url={getGistdaFloodTmsTileUrl('flood-freq', safeTime, apiKey)}
            opacity={opacity * 0.75}
            tms={true}
            attribution="GISTDA Sentinel Historical Flood Frequency TMS"
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key="flood-freq-wms"
            url={getGistdaFloodWmsUrl('flood-freq', safeTime, apiKey)}
            layers="flood-freq"
            format="image/png"
            transparent={true}
            opacity={opacity * 0.75}
            attribution="GISTDA Sentinel Historical Flood Frequency WMS"
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key="flood-freq-wmts"
            url={getGistdaFloodWmtsUrl('flood-freq', safeTime, apiKey)}
            layers="flood-freq"
            format="image/png"
            transparent={true}
            opacity={opacity * 0.75}
            attribution="GISTDA Sentinel Historical Flood Frequency WMTS"
            maxZoom={18}
          />
        )
      )}
    </>
  );
};

export default FloodWMSLayers;
