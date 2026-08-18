import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { RainViewerData } from './useRainViewerData';

interface RainOverlayProps {
  rainData: RainViewerData | null;
  overlayType: 'radar' | 'satellite';
  timeType: 'past' | 'future';
  frameIndex?: number;
}

const RainOverlay: React.FC<RainOverlayProps> = ({ 
  rainData, 
  overlayType, 
  timeType,
  frameIndex: controlledFrameIndex 
}) => {
  const map = useMap();
  const [currentLayer, setCurrentLayer] = useState<L.TileLayer | null>(null);
  const [internalFrameIndex, setInternalFrameIndex] = useState(0);

  const activeIndex = controlledFrameIndex !== undefined ? controlledFrameIndex : internalFrameIndex;

  useEffect(() => {
    if (!rainData || !map) return;

    // Remove existing layer
    if (currentLayer) {
      map.removeLayer(currentLayer);
      setCurrentLayer(null);
    }

    let frames: any[] = [];
    
    if (overlayType === 'radar') {
      frames = timeType === 'past' ? rainData.radar?.past || [] : rainData.radar?.nowcast || [];
    } else {
      frames = rainData.satellite?.infrared || [];
    }

    if (frames.length === 0) return;

    // Use the requested frame
    const idx = Math.max(0, Math.min(activeIndex, frames.length - 1));
    const frame = frames[idx];
    
    if (!frame) return;

    const tileUrl = `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    
    const layer = L.tileLayer(tileUrl, {
      opacity: 0.65,
      zIndex: 400,
      attribution: '&copy; <a href="https://www.rainviewer.com/">RainViewer</a>'
    });

    layer.addTo(map);
    setCurrentLayer(layer);

    return () => {
      if (layer && map) {
        map.removeLayer(layer);
      }
    };
  }, [rainData, overlayType, timeType, activeIndex, map]);

  return null;
};

export default RainOverlay;
