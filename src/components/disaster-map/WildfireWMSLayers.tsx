
import React from 'react';
import { WMSTileLayer } from 'react-leaflet';

interface WildfireWMSLayersProps {
  showModis: boolean;
  showViirs: boolean;
  showBurnScar: boolean;
}

export const WildfireWMSLayers: React.FC<WildfireWMSLayersProps> = ({
  showModis,
  showViirs,
  showBurnScar
}) => {
  const API_KEY = 'JMGZneff56qsmjWKbyYdYBUbTx8zHHOChXTD1Ogl8jmrEgnHbXiH3H5QvQwN3yg1';
  const baseUrl = 'https://disaster.gistda.or.th/api/1.0/documents/fire';

  return (
    <>
      {showModis && (
        <WMSTileLayer
          url={`${baseUrl}/hotspot/modis/3days/wms?api_key=${API_KEY}`}
          layers="6359f6be39c0f34eb9a98387"
          format="image/png"
          transparent={true}
          opacity={0.7}
          attribution="GISTDA MODIS Hotspots"
        />
      )}
      
      {showViirs && (
        <WMSTileLayer
          url={`${baseUrl}/hotspot/viirs/3days/wms?api_key=${API_KEY}`}
          layers="viirs"
          format="image/png"
          transparent={true}
          opacity={0.7}
          attribution="GISTDA VIIRS Hotspots"
        />
      )}
      
      {showBurnScar && (
        <WMSTileLayer
          url={`${baseUrl}/burn-scar/wms?api_key=${API_KEY}`}
          layers="635a0e19f6827ec70ee68e8a"
          format="image/png"
          transparent={true}
          opacity={0.6}
          attribution="GISTDA Burn Scar"
        />
      )}
    </>
  );
};
