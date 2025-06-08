
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface DroughtWMSLayersProps {
  selectedLayers: string[];
  opacity: number;
}

const DroughtWMSLayers: React.FC<DroughtWMSLayersProps> = ({ selectedLayers, opacity }) => {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];

    // DRI (Drought Risk Index) Layer with enhanced styling
    if (selectedLayers.includes('dri')) {
      const driLayer = L.tileLayer('https://vallaris.dragonfly.gistda.or.th/core/api/maps/1.0-beta/maps/dri_7days/wmts/{z}/{x}/{y}.png?api_key=p8MB6HQYNFiJMbBigdrXVVC6mvwuj0EkVpXNxI17eogPueG7ed3UvdUDGMvdSLPM', {
        attribution: 'GISTDA - DRI 7 days',
        opacity,
        maxZoom: 18,
      });
      
      driLayer.addTo(map);
      layers.push(driLayer);
    }

    // NDWI (Normalized Difference Water Index) Layer with enhanced styling
    if (selectedLayers.includes('ndwi')) {
      const ndwiLayer = L.tileLayer('https://vallaris.dragonfly.gistda.or.th/core/api/maps/1.0-beta/maps/ndwi_7days/wmts/{z}/{x}/{y}.png?api_key=p8MB6HQYNFiJMbBigdrXVVC6mvwuj0EkVpXNxI17eogPueG7ed3UvdUDGMvdSLPM', {
        attribution: 'GISTDA - NDWI 7 days',
        opacity,
        maxZoom: 18,
      });
      
      ndwiLayer.addTo(map);
      layers.push(ndwiLayer);
    }

    // SMAP (Soil Moisture Active Passive) Layer with enhanced styling
    if (selectedLayers.includes('smap')) {
      const smapLayer = L.tileLayer('https://vallaris.dragonfly.gistda.or.th/core/api/maps/1.0-beta/maps/smap_7days/wmts/{z}/{x}/{y}.png?api_key=p8MB6HQYNFiJMbBigdrXVVC6mvwuj0EkVpXNxI17eogPueG7ed3UvdUDGMvdSLPM', {
        attribution: 'GISTDA - SMAP 7 days',
        opacity,
        maxZoom: 18,
      });
      
      smapLayer.addTo(map);
      layers.push(smapLayer);
    }

    // Add legend for drought layers
    if (selectedLayers.length > 0) {
      const legend = new L.Control({ position: 'bottomright' });
      
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'drought-legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        div.style.fontSize = '12px';
        div.style.lineHeight = '1.4';
        
        let legendContent = '<h4 style="margin: 0 0 8px 0; font-size: 14px;">ตำนานสี - ภัยแล้ง</h4>';
        
        if (selectedLayers.includes('dri')) {
          legendContent += `
            <div style="margin-bottom: 6px;">
              <strong>DRI (ดัชนีพื้นที่เสี่ยงภัยแล้ง)</strong><br>
              <span style="background: #8B0000; color: white; padding: 2px 6px; margin-right: 4px;">สูงมาก</span>
              <span style="background: #FF4500; color: white; padding: 2px 6px; margin-right: 4px;">สูง</span>
              <span style="background: #FFA500; color: black; padding: 2px 6px; margin-right: 4px;">ปานกลาง</span>
              <span style="background: #FFFF00; color: black; padding: 2px 6px; margin-right: 4px;">ต่ำ</span>
              <span style="background: #90EE90; color: black; padding: 2px 6px;">ปกติ</span>
            </div>`;
        }
        
        if (selectedLayers.includes('ndwi')) {
          legendContent += `
            <div style="margin-bottom: 6px;">
              <strong>NDWI (ดัชนีความแตกต่างความชื้น)</strong><br>
              <span style="background: #000080; color: white; padding: 2px 6px; margin-right: 4px;">น้ำ</span>
              <span style="background: #4169E1; color: white; padding: 2px 6px; margin-right: 4px;">ชื้นสูง</span>
              <span style="background: #87CEEB; color: black; padding: 2px 6px; margin-right: 4px;">ชื้นปกติ</span>
              <span style="background: #F5DEB3; color: black; padding: 2px 6px; margin-right: 4px;">แห้ง</span>
              <span style="background: #8B4513; color: white; padding: 2px 6px;">แห้งมาก</span>
            </div>`;
        }
        
        if (selectedLayers.includes('smap')) {
          legendContent += `
            <div>
              <strong>SMAP (ความชื้นดิน)</strong><br>
              <span style="background: #006400; color: white; padding: 2px 6px; margin-right: 4px;">สูงมาก</span>
              <span style="background: #32CD32; color: black; padding: 2px 6px; margin-right: 4px;">สูง</span>
              <span style="background: #FFFF00; color: black; padding: 2px 6px; margin-right: 4px;">ปานกลาง</span>
              <span style="background: #FF8C00; color: black; padding: 2px 6px; margin-right: 4px;">ต่ำ</span>
              <span style="background: #8B0000; color: white; padding: 2px 6px;">ต่ำมาก</span>
            </div>`;
        }
        
        div.innerHTML = legendContent;
        return div;
      };
      
      legend.addTo(map);
      layers.push(legend as any);
    }

    return () => {
      layers.forEach(layer => {
        map.removeLayer(layer);
      });
    };
  }, [map, selectedLayers, opacity]);

  return null;
};

export default DroughtWMSLayers;
