import React from 'react';
import { WMSTileLayer, TileLayer } from 'react-leaflet';
import { 
  GISTDA_CONFIG, 
  DroughtLayerType, 
  DroughtMapProtocol,
  getGistdaDroughtWmsUrl, 
  getGistdaDroughtWmtsUrl, 
  getGistdaDroughtTmsTileUrl 
} from '@/services/gistdaService';

interface DroughtWMSLayersProps {
  selectedLayers: string[];
  opacity?: number;
  mapProtocol?: DroughtMapProtocol;
}

export const DroughtWMSLayers: React.FC<DroughtWMSLayersProps> = ({ 
  selectedLayers = ['dri'], 
  opacity = 0.7,
  mapProtocol = 'wmts'
}) => {
  const apiKey = GISTDA_CONFIG.PRIMARY_API_KEY;

  return (
    <>
      {/* 1. DRI (Drought Risk Index / DRIPlus) Layer */}
      {selectedLayers.includes('dri') && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="dri-tms"
            url={getGistdaDroughtTmsTileUrl('dri', apiKey)}
            opacity={opacity}
            tms={true}
            attribution="GISTDA DRIPlus 7 days TMS"
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key="dri-wms"
            url={getGistdaDroughtWmsUrl('dri', apiKey)}
            layers="dri"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution="GISTDA DRIPlus 7 days WMS"
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key="dri-wmts"
            url={getGistdaDroughtWmtsUrl('dri', apiKey)}
            layers="dri"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution="GISTDA DRIPlus 7 days WMTS"
            maxZoom={18}
          />
        )
      )}

      {/* 2. NDWI (Normalized Difference Water Index / ความชื้นพืชพรรณ) Layer */}
      {selectedLayers.includes('ndwi') && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="ndwi-tms"
            url={getGistdaDroughtTmsTileUrl('ndwi', apiKey)}
            opacity={opacity}
            tms={true}
            attribution="GISTDA NDWI 7 days TMS"
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key="ndwi-wms"
            url={getGistdaDroughtWmsUrl('ndwi', apiKey)}
            layers="ndwi"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution="GISTDA NDWI 7 days WMS"
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key="ndwi-wmts"
            url={getGistdaDroughtWmtsUrl('ndwi', apiKey)}
            layers="ndwi"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution="GISTDA NDWI 7 days WMTS"
            maxZoom={18}
          />
        )
      )}

      {/* 3. SMAP (Soil Moisture Active Passive / ความชื้นในดิน) Layer */}
      {selectedLayers.includes('smap') && (
        mapProtocol === 'tms' ? (
          <TileLayer
            key="smap-tms"
            url={getGistdaDroughtTmsTileUrl('smap', apiKey)}
            opacity={opacity}
            tms={true}
            attribution="GISTDA SMAP 7 days TMS"
            maxZoom={18}
          />
        ) : mapProtocol === 'wms' ? (
          <WMSTileLayer
            key="smap-wms"
            url={getGistdaDroughtWmsUrl('smap', apiKey)}
            layers="smap"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution="GISTDA SMAP 7 days WMS"
            maxZoom={18}
          />
        ) : (
          <WMSTileLayer
            key="smap-wmts"
            url={getGistdaDroughtWmtsUrl('smap', apiKey)}
            layers="smap"
            format="image/png"
            transparent={true}
            opacity={opacity}
            attribution="GISTDA SMAP 7 days WMTS"
            maxZoom={18}
          />
        )
      )}
    </>
  );
};

export default DroughtWMSLayers;
