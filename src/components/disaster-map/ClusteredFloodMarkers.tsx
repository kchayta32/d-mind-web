import React from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { FloodMarker } from './FloodMarker';
import { FloodFeature, getFloodCenter } from './hooks/useGISTDAFloodData';

interface ClusteredFloodMarkersProps {
  features: FloodFeature[];
}

export const ClusteredFloodMarkers: React.FC<ClusteredFloodMarkersProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

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
        let bgStyle = 'background: radial-gradient(circle, #0284c7 0%, #0369a1 100%);';

        if (count > 100) {
          sizeClass = 'large';
          bgStyle = 'background: radial-gradient(circle, #1d4ed8 0%, #1e40af 100%);';
        } else if (count > 30) {
          sizeClass = 'medium';
          bgStyle = 'background: radial-gradient(circle, #0284c7 0%, #1d4ed8 100%);';
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
              <span>🌊 ${count > 999 ? `${(count / 1000).toFixed(1)}k` : count}</span>
            </div>
          `,
          className: `flood-cluster-icon flood-cluster-${sizeClass}`,
          iconSize: L.point(36, 36, true),
        });
      }}
    >
      {features.map((feature, index) => {
        const center = getFloodCenter(feature);
        return (
          <FloodMarker
            key={`gistda-flood-${feature.id || feature.properties?._id || index}-${index}`}
            feature={feature}
            center={center}
          />
        );
      })}
    </MarkerClusterGroup>
  );
};

export default ClusteredFloodMarkers;
