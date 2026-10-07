import React from 'react';
import { WMSTileLayer, TileLayer } from 'react-leaflet';
import { 
  GISTDA_CONFIG, 
  ViirsTimeFilter, 
  WildfireMapProtocol,
  getGistdaWmsUrl, 
  getGistdaWmtsUrl, 
  getGistdaTmsTileUrl 
} from '@/services/gistdaService';
import { NASA_FIRMS_WEB_GIS, FirmsSatelliteSource } from '@/services/nasaFirmsService';

interface WildfireWMSLayersProps {
  timeFilter: string;
  showBurnFreq?: boolean;
  showBurnScar?: boolean;
  mapProtocol?: WildfireMapProtocol;
  showFirmsLayer?: boolean;
  firmsSatellite?: FirmsSatelliteSource;
}

export const WildfireWMSLayers: React.FC<WildfireWMSLayersProps> = ({
  timeFilter = '3days',
  showBurnFreq = false,
  showBurnScar = false,
  mapProtocol = 'wmts',
  showFirmsLayer = true,
  firmsSatellite = 'ALL'
}) => {
  const safeTime = (timeFilter === '1day' || timeFilter === '3days' || timeFilter === '7days' || timeFilter === '30days') 
    ? (timeFilter as ViirsTimeFilter) 
    : '3days';

  const apiKey = GISTDA_CONFIG.PRIMARY_API_KEY;

  // Compute NASA GIBS layer name based on satellite selection
  const gibsLayers = firmsSatellite === 'VIIRS_375M'
    ? NASA_FIRMS_WEB_GIS.LAYERS.VIIRS_SNPP_375M
    : firmsSatellite === 'MODIS_1KM'
    ? NASA_FIRMS_WEB_GIS.LAYERS.MODIS_COMBINED_1KM
    : `${NASA_FIRMS_WEB_GIS.LAYERS.VIIRS_SNPP_375M},${NASA_FIRMS_WEB_GIS.LAYERS.MODIS_COMBINED_1KM}`;

  return (
    <>
      {/* 1. NASA FIRMS Global Web-GIS WMS Thermal Anomalies Layer (Free & NRT 3-hour) */}
      {showFirmsLayer && (
        <WMSTileLayer
          key={`nasa-firms-gibs-${firmsSatellite}`}
          url={NASA_FIRMS_WEB_GIS.GIBS_WMS_BASE_URL}
          layers={gibsLayers}
          format="image/png"
          transparent={true}
          opacity={0.80}
          attribution={NASA_FIRMS_WEB_GIS.ATTRIBUTION}
          maxZoom={18}
          zIndex={450}
        />
      )}

      {/* 2. VIIRS Hotspots Map Layer (Regional/GISTDA) */}
      {timeFilter && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key={`viirs-tms-${safeTime}`}
            url={getGistdaTmsTileUrl('viirs', safeTime, apiKey)}
            opacity={0.8}
            tms={true}
            attribution={`GISTDA VIIRS (${safeTime}) TMS`}
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key={`viirs-wms-${safeTime}`}
            url={getGistdaWmsUrl('viirs', safeTime, apiKey)}
            layers="viirs"
            format="image/png"
            transparent={true}
            opacity={0.75}
            attribution={`GISTDA VIIRS (${safeTime}) WMS`}
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key={`viirs-wmts-${safeTime}`}
            url={getGistdaWmtsUrl('viirs', safeTime, apiKey)}
            layers="viirs"
            format="image/png"
            transparent={true}
            opacity={0.75}
            attribution={`GISTDA VIIRS (${safeTime}) WMTS`}
            maxZoom={18}
          />
        )
      )}
      
      {/* 3. Burn Frequency Map Layer (พื้นที่เผาไหม้ซ้ำซาก) */}
      {showBurnFreq && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="burn-freq-tms"
            url={getGistdaTmsTileUrl('burn-freq', safeTime, apiKey)}
            opacity={0.65}
            tms={true}
            attribution="GISTDA Burn Frequency TMS"
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key="burn-freq-wms"
            url={getGistdaWmsUrl('burn-freq', safeTime, apiKey)}
            layers="burn-freq"
            format="image/png"
            transparent={true}
            opacity={0.65}
            attribution="GISTDA Burn Frequency WMS"
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key="burn-freq-wmts"
            url={getGistdaWmtsUrl('burn-freq', safeTime, apiKey)}
            layers="burn-freq"
            format="image/png"
            transparent={true}
            opacity={0.65}
            attribution="GISTDA Burn Frequency WMTS"
            maxZoom={18}
          />
        )
      )}

      {/* 4. Burn Scar Map Layer (พื้นที่ร่องรอยเผาไหม้ รายสัปดาห์) */}
      {showBurnScar && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="burn-scar-tms"
            url={getGistdaTmsTileUrl('burn-scar', safeTime, apiKey)}
            opacity={0.7}
            tms={true}
            attribution="GISTDA Weekly Burn Scar TMS"
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key="burn-scar-wms"
            url={getGistdaWmsUrl('burn-scar', safeTime, apiKey)}
            layers="burn-scar"
            format="image/png"
            transparent={true}
            opacity={0.7}
            attribution="GISTDA Weekly Burn Scar WMS"
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key="burn-scar-wmts"
            url={getGistdaWmtsUrl('burn-scar', safeTime, apiKey)}
            layers="burn-scar"
            format="image/png"
            transparent={true}
            opacity={0.7}
            attribution="GISTDA Weekly Burn Scar WMTS"
            maxZoom={18}
          />
        )
      )}
    </>
  );
};

export default WildfireWMSLayers;
