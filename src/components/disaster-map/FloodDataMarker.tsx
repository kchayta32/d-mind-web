
import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FloodDataPoint } from './hooks/useOpenMeteoFloodData';
import { FloodTimeSeriesChart } from './charts/FloodTimeSeriesChart';

// Create custom flood marker icon
const floodIcon = new L.DivIcon({
  html: `
    <div style="
      background-color: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <span style="color: white; font-size: 10px; font-weight: bold;">💧</span>
    </div>
  `,
  className: 'flood-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

interface FloodDataMarkerProps {
  floodPoint: FloodDataPoint;
}

export const FloodDataMarker: React.FC<FloodDataMarkerProps> = ({ floodPoint }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentDischarge = floodPoint.data.daily.river_discharge[7]; // Current day (index 7 in past_days=7)
  const maxDischarge = Math.max(...floodPoint.data.daily.river_discharge);

  return (
    <Marker
      position={[floodPoint.lat, floodPoint.lon]}
      icon={floodIcon}
      eventHandlers={{
        click: () => setIsOpen(true),
      }}
    >
      <Popup
        maxWidth={400}
        minWidth={350}
        maxHeight={400}
        closeOnEscapeKey={true}
      >
        <div className="p-2">
          <FloodTimeSeriesChart 
            data={floodPoint.data}
            locationName={floodPoint.locationName}
          />
          <div className="mt-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>การไหลปัจจุบัน:</span>
              <span className="font-semibold">{currentDischarge?.toFixed(2)} m³/s</span>
            </div>
            <div className="flex justify-between">
              <span>การไหลสูงสุด (7 เดือน):</span>
              <span className="font-semibold text-red-600">{maxDischarge?.toFixed(2)} m³/s</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
