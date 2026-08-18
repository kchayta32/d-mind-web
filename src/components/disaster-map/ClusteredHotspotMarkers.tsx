import React from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import HotspotMarker from './HotspotMarker';
import { GISTDAHotspot } from './useGISTDAData';
import 'leaflet/dist/leaflet.css';

interface ClusteredHotspotMarkersProps {
  hotspots: GISTDAHotspot[];
}

export const ClusteredHotspotMarkers: React.FC<ClusteredHotspotMarkersProps> = ({ hotspots }) => {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={45}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={true}
      iconCreateFunction={(cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = 'small';
        let bgStyle = 'background: radial-gradient(circle, #f97316 0%, #ea580c 100%);';

        if (count > 100) {
          sizeClass = 'large';
          bgStyle = 'background: radial-gradient(circle, #ef4444 0%, #b91c1c 100%);';
        } else if (count > 30) {
          sizeClass = 'medium';
          bgStyle = 'background: radial-gradient(circle, #f97316 0%, #dc2626 100%);';
        }

        return L.divIcon({
          html: `
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              ${bgStyle}
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 11px;
              border: 2px solid rgba(255,255,255,0.9);
              box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            ">
              <span>${count > 999 ? `${(count / 1000).toFixed(1)}k` : count}</span>
            </div>
          `,
          className: `hotspot-cluster-icon hotspot-cluster-${sizeClass}`,
          iconSize: L.point(36, 36, true),
        });
      }}
    >
      {hotspots.map((hotspot, idx) => {
        const lat = hotspot.geometry?.coordinates ? hotspot.geometry.coordinates[1] : hotspot.LATITUDE;
        const lng = hotspot.geometry?.coordinates ? hotspot.geometry.coordinates[0] : hotspot.LONGITUDE;
        const date = hotspot.properties?.acq_date || hotspot.ACQ_DATE || 'date';
        return (
          <HotspotMarker
            key={`hotspot-${lat}-${lng}-${date}-${idx}`}
            hotspot={hotspot}
          />
        );
      })}
    </MarkerClusterGroup>
  );
};

export default ClusteredHotspotMarkers;
