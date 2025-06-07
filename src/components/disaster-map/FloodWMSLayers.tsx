
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface FloodWMSLayersProps {
  timeFilter: '1day' | '3days' | '7days' | '30days';
  showFrequency: boolean;
  opacity: number;
}

const FloodWMSLayers: React.FC<FloodWMSLayersProps> = ({ timeFilter, showFrequency, opacity }) => {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];

    // Current flood areas
    if (timeFilter) {
      const floodLayer = L.tileLayer(`https://vallaris.dragonfly.gistda.or.th/core/api/maps/1.0-beta/maps/flood_${timeFilter}/wmts/{z}/{x}/{y}.png?api_key=p8MB6HQYNFiJMbBigdrXVVC6mvwuj0EkVpXNxI17eogPueG7ed3UvdUDGMvdSLPM`, {
        attribution: `GISTDA - Flood ${timeFilter}`,
        opacity,
        maxZoom: 18,
      });
      
      floodLayer.addTo(map);
      layers.push(floodLayer);
    }

    // Recurrent flood areas
    if (showFrequency) {
      const freqLayer = L.tileLayer('https://vallaris.dragonfly.gistda.or.th/core/api/maps/1.0-beta/maps/flood_freq/wmts/{z}/{x}/{y}.png?api_key=p8MB6HQYNFiJMbBigdrXVVC6mvwuj0EkVpXNxI17eogPueG7ed3UvdUDGMvdSLPM', {
        attribution: 'GISTDA - Recurrent Flood Areas',
        opacity: opacity * 0.7,
        maxZoom: 18,
      });
      
      freqLayer.addTo(map);
      layers.push(freqLayer);
    }

    return () => {
      layers.forEach(layer => {
        map.removeLayer(layer);
      });
    };
  }, [map, timeFilter, showFrequency, opacity]);

  return null;
};

export default FloodWMSLayers;
