import React from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import EarthquakeMarker from './EarthquakeMarker';
import { Earthquake } from './types';
import 'leaflet/dist/leaflet.css';

interface ClusteredEarthquakeMarkersProps {
  earthquakes: Earthquake[];
}

const ClusteredEarthquakeMarkers: React.FC<ClusteredEarthquakeMarkersProps> = ({ earthquakes }) => {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={true}
      iconCreateFunction={(cluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        
        if (count > 100) {
          size = 'large';
        } else if (count > 50) {
          size = 'medium';
        }
        
        return L.divIcon({
          html: `<div class="earthquake-cluster-${size}"><span>${count}</span></div>`,
          className: 'custom-marker-cluster',
          iconSize: L.point(40, 40, true),
        });
      }}
    >
      {earthquakes.map((earthquake) => (
        <EarthquakeMarker key={earthquake.id} earthquake={earthquake} />
      ))}
    </MarkerClusterGroup>
  );
};

export default ClusteredEarthquakeMarkers;
