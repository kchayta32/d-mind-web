import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Earthquake } from './types';

interface EarthquakeMarkerProps {
  earthquake: Earthquake;
}

const createEarthquakeIcon = (magnitude: number) => {
  let color = '#22c55e'; // green for low magnitude
  let size = 12;
  
  if (magnitude >= 7.0) {
    color = '#dc2626'; // red for very high
    size = 24;
  } else if (magnitude >= 6.0) {
    color = '#ea580c'; // orange for high
    size = 20;
  } else if (magnitude >= 5.0) {
    color = '#eab308'; // yellow for moderate
    size = 16;
  } else if (magnitude >= 4.0) {
    color = '#65a30d'; // light green for low-moderate
    size = 14;
  }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(8, size * 0.45)}px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      ">
        ${magnitude.toFixed(1)}
      </div>
    `,
    className: 'earthquake-marker',
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
    popupAnchor: [0, -(size + 4) / 2]
  });
};

const EarthquakeMarker: React.FC<EarthquakeMarkerProps> = ({ earthquake }) => {
  const getMagnitudeDescription = (magnitude: number) => {
    if (magnitude < 3.0) return 'แผ่นดินไหวเล็กน้อย';
    if (magnitude < 4.0) return 'แผ่นดินไหวเล็ก';
    if (magnitude < 5.0) return 'แผ่นดินไหวปานกลาง';
    if (magnitude < 6.0) return 'แผ่นดินไหวแรง';
    if (magnitude < 7.0) return 'แผ่นดินไหวรุนแรง';
    return 'แผ่นดินไหวรุนแรงมาก';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString('th-TH');
    } catch {
      return dateString;
    }
  };

  const lat = earthquake.latitude ?? earthquake.lat;
  const lng = earthquake.longitude ?? earthquake.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  return (
    <Marker
      position={[lat, lng]}
      icon={createEarthquakeIcon(earthquake.magnitude)}
    >
      <Popup className="earthquake-popup">
        <div className="p-2 min-w-64">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-gray-800">
              {earthquake.location || earthquake.place || 'จุดเกิดแผ่นดินไหว'}
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
              earthquake.magnitude >= 6 ? 'bg-red-600' :
              earthquake.magnitude >= 5 ? 'bg-orange-500' : 'bg-green-600'
            }`}>
              M {earthquake.magnitude.toFixed(1)}
            </span>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <div><strong>ระดับ:</strong> {getMagnitudeDescription(earthquake.magnitude)}</div>
            <div><strong>ความลึก:</strong> {earthquake.depth ? `${earthquake.depth.toFixed(1)} กม.` : 'ไม่ระบุ'}</div>
            <div><strong>เวลา:</strong> {formatDate(earthquake.time || earthquake.updated_at)}</div>
            <div><strong>พิกัด:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}</div>
            {earthquake.tsunamiAlert && (
              <div className="text-red-600 font-bold mt-1">⚠️ มีการแจ้งเตือนสึนามิ</div>
            )}
            <div className="text-[10px] text-gray-400 mt-2 pt-1 border-t">
              แหล่งข้อมูล: {earthquake.source || 'USGS'}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default EarthquakeMarker;
