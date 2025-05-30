
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Earthquake } from './types';

// Custom icons for earthquake markers
const regularIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Larger icon for significant earthquakes
const significantIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -40],
  shadowSize: [48, 48]
});

interface EarthquakeMarkerProps {
  earthquake: Earthquake;
}

const EarthquakeMarker: React.FC<EarthquakeMarkerProps> = ({ earthquake }) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 6) return "destructive";
    if (magnitude >= 5) return "default"; // red
    if (magnitude >= 4) return "secondary"; // yellow
    return "outline"; // green or lower intensity
  };

  return (
    <Marker 
      key={earthquake.id} 
      position={[earthquake.latitude, earthquake.longitude]}
      icon={earthquake.isSignificant ? significantIcon : regularIcon}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-bold">
            {earthquake.location}
            {earthquake.isSignificant && (
              <Badge variant="destructive" className="ml-1">Significant</Badge>
            )}
          </div>
          <div>
            Magnitude: <Badge variant={getMagnitudeColor(earthquake.magnitude)}>
              {earthquake.magnitude}
            </Badge>
          </div>
          <div>Time: {formatTime(earthquake.time)}</div>
        </div>
      </Popup>
    </Marker>
  );
};

export default EarthquakeMarker;
