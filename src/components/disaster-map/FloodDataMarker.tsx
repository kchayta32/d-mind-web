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
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <span style="color: white; font-size: 11px; font-weight: bold;">💧</span>
    </div>
  `,
  className: 'flood-marker',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

interface FloodDataMarkerProps {
  floodPoint: FloodDataPoint;
}

export const FloodDataMarker: React.FC<FloodDataMarkerProps> = ({ floodPoint }) => {
  const [isOpen, setIsOpen] = useState(false);

  const discharges = floodPoint?.data?.daily?.river_discharge || [];
  const currentDischarge = discharges[7] ?? discharges[discharges.length - 1] ?? floodPoint?.currentDischarge ?? 0;
  const maxDischarge = discharges.length > 0 ? Math.max(...discharges) : currentDischarge;

  const lat = floodPoint?.lat;
  const lon = floodPoint?.lon;

  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    return null;
  }

  return (
    <Marker
      position={[lat, lon]}
      icon={floodIcon}
      eventHandlers={{
        click: () => setIsOpen(true),
      }}
    >
      <Popup
        maxWidth={400}
        minWidth={320}
        maxHeight={400}
        closeOnEscapeKey={true}
      >
        <div className="p-2">
          {floodPoint.data && (
            <FloodTimeSeriesChart 
              data={floodPoint.data}
              locationName={floodPoint.locationName}
            />
          )}
          <div className="mt-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span>อัตราการไหลปัจจุบัน:</span>
              <span className="font-semibold">{Number(currentDischarge).toFixed(2)} m³/s</span>
            </div>
            <div className="flex justify-between">
              <span>การไหลสูงสุด (พยากรณ์):</span>
              <span className="font-semibold text-red-600">{Number(maxDischarge).toFixed(2)} m³/s</span>
            </div>
            <div className="flex justify-between text-gray-500 pt-1 border-t">
              <span>สถานะความเสี่ยง:</span>
              <span className="font-medium text-blue-600">
                {floodPoint.floodRiskLevel === 'critical' ? 'วิกฤต/ล้นตลิ่ง' :
                 floodPoint.floodRiskLevel === 'high' ? 'เสี่ยงสูง' :
                 floodPoint.floodRiskLevel === 'moderate' ? 'เฝ้าระวัง' : 'ปกติ'}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
