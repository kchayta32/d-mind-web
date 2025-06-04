
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { RainViewerData } from './useRainViewerData';

interface RainOverlayProps {
  rainData: RainViewerData | null;
  overlayType: 'radar' | 'satellite';
  timeType: 'past' | 'future';
}

const RainOverlay: React.FC<RainOverlayProps> = ({ rainData, overlayType, timeType }) => {
  const map = useMap();
  const [currentLayer, setCurrentLayer] = useState<L.TileLayer | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

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

    // Use the latest frame or current frame index
    const frameIndex = Math.min(currentFrameIndex, frames.length - 1);
    const frame = frames[frameIndex];
    
    if (!frame) return;

    const tileUrl = `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    
    const layer = L.tileLayer(tileUrl, {
      opacity: 0.6,
      attribution: 'RainViewer'
    });

    layer.addTo(map);
    setCurrentLayer(layer);

    return () => {
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [rainData, overlayType, timeType, currentFrameIndex, map]);

  // Auto-animate through frames for past radar data
  useEffect(() => {
    if (!rainData || overlayType !== 'radar' || timeType !== 'past') return;

    const frames = rainData.radar?.past || [];
    if (frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => (prev + 1) % frames.length);
    }, 500); // Change frame every 500ms

    return () => clearInterval(interval);
  }, [rainData, overlayType, timeType]);

  return null;
};

export default RainOverlay;
