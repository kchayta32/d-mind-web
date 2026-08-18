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
}

export const FloodWMSLayers: React.FC<FloodWMSLayersProps> = ({ 
  timeFilter = '3days', 
  showFrequency = true, 
  opacity = 0.7,
  mapProtocol = 'wmts'
}) => {
  const safeTime: FloodTimeFilter = (timeFilter === '1day' || timeFilter === '3days' || timeFilter === '7days' || timeFilter === '30days')
    ? timeFilter
    : '3days';

  const apiKey = GISTDA_CONFIG.PRIMARY_API_KEY;

  return (
    <>
      {/* 1. Main Flood Area Map Layer */}
      {timeFilter && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key={`flood-tms-${safeTime}`}
            url={getGistdaFloodTmsTileUrl('flood', safeTime, apiKey)}
            opacity={opacity}
            tms={true}
            attribution={`GISTDA Flood (${safeTime}) TMS`}
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key={`flood-wms-${safeTime}`}
            url={getGistdaFloodWmsUrl('flood', safeTime, apiKey)}
            layers="flood"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution={`GISTDA Flood (${safeTime}) WMS`}
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key={`flood-wmts-${safeTime}`}
            url={getGistdaFloodWmtsUrl('flood', safeTime, apiKey)}
            layers="flood"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution={`GISTDA Flood (${safeTime}) WMTS`}
            maxZoom={18}
          />
        )
      )}

      {/* 2. Recurrent Flood Areas (พื้นที่น้ำท่วมซ้ำซาก) */}
      {showFrequency && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="flood-freq-tms"
            url={getGistdaFloodTmsTileUrl('flood-freq', safeTime, apiKey)}
            opacity={opacity * 0.75}
            tms={true}
            attribution="GISTDA Flood Frequency TMS"
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
            attribution="GISTDA Flood Frequency WMS"
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
            attribution="GISTDA Flood Frequency WMTS"
            maxZoom={18}
          />
        )
      )}
    </>
  );
};

export default FloodWMSLayers;
