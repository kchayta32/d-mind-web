import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AirPollutionData } from './types';

interface AirStationMarkerProps {
  station: AirPollutionData;
}

const createAirStationIcon = (pm25?: number) => {
  let color = '#22c55e'; // green for good
  
  if (pm25) {
    if (pm25 > 150) color = '#dc2626'; // red for hazardous
    else if (pm25 > 100) color = '#7c2d12'; // dark red for very unhealthy
    else if (pm25 > 75) color = '#ea580c'; // orange for unhealthy
    else if (pm25 > 50) color = '#eab308'; // yellow for moderate
    else if (pm25 > 25) color = '#65a30d'; // light green for fair
  }

  return L.divIcon({
    html: `
      <div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'air-station-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const AirStationMarker: React.FC<AirStationMarkerProps> = ({ station }) => {
  const getPM25Status = (pm25?: number) => {
    if (!pm25 && pm25 !== 0) return 'ไม่มีข้อมูล';
    if (pm25 <= 25) return 'ดีมาก';
    if (pm25 <= 50) return 'ดี';
    if (pm25 <= 75) return 'ปานกลาง';
    if (pm25 <= 100) return 'เริ่มมีผลกระทบต่อสุขภาพ';
    if (pm25 <= 150) return 'มีผลกระทบต่อสุขภาพ';
    return 'อันตรายต่อสุขภาพ';
  };

  const formatValue = (value?: number, unit: string = '') => {
    return typeof value === 'number' && !isNaN(value) ? `${value.toFixed(1)} ${unit}` : 'ไม่มีข้อมูล';
  };

  const lat = station.lat ?? station.latitude;
  const lng = station.lng ?? station.longitude;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  return (
    <Marker
      position={[lat, lng]}
      icon={createAirStationIcon(station.pm25)}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-sm mb-1 text-gray-800">
            {station.province || station.name || 'สถานีตรวจวัดคุณภาพอากาศ'}
          </h3>
          <div className="space-y-1 text-xs">
            <div><strong>PM2.5:</strong> {formatValue(station.pm25, 'μg/m³')}</div>
            {station.pm10 && <div><strong>PM10:</strong> {formatValue(station.pm10, 'μg/m³')}</div>}
            {station.usAqi && <div><strong>US AQI:</strong> <span className="font-bold text-blue-600">{station.usAqi}</span></div>}
            <div><strong>สถานะ:</strong> <span className={`font-semibold ${
              station.pm25 && station.pm25 > 75 ? 'text-red-600' : 
              station.pm25 && station.pm25 > 50 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {getPM25Status(station.pm25)}
            </span></div>
            
            <div className="text-[11px] text-gray-400 border-t pt-1.5 mt-1.5 flex justify-between">
              <span>พิกัด: {lat.toFixed(3)}, {lng.toFixed(3)}</span>
              <span>Open-Meteo</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default AirStationMarker;
