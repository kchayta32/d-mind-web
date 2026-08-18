import React from 'react';
import { Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { StormData } from '../types';
import { Badge } from '@/components/ui/badge';
import { Wind, Navigation, AlertTriangle, ShieldAlert, Globe2 } from 'lucide-react';

interface StormMarkerProps {
  storm: StormData;
}

const createStormIcon = (category: StormData['category'], alertLevel: StormData['alertLevel']) => {
  const isHighAlert = alertLevel === 'Red';
  const bgColor = isHighAlert ? '#ef4444' : alertLevel === 'Orange' ? '#f97316' : '#3b82f6';
  const pulseClass = isHighAlert ? 'animate-ping' : '';

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-10 h-10 rounded-full ${pulseClass}" style="background-color: ${bgColor}; opacity: 0.35;"></div>
      <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs border-2 border-white" style="background-color: ${bgColor};">
        <svg class="w-5 h-5 animate-spin" style="animation-duration: 4s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'storm-custom-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export const StormMarker: React.FC<StormMarkerProps> = ({ storm }) => {
  const lat = storm.latitude ?? storm.lat;
  const lng = storm.longitude ?? storm.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  const icon = createStormIcon(storm.category, storm.alertLevel);
  const trackCoords: [number, number][] = (storm.trackHistory || [])
    .map(p => [Number(p.latitude), Number(p.longitude)] as [number, number])
    .filter(([tlat, tlng]) => typeof tlat === 'number' && typeof tlng === 'number' && !isNaN(tlat) && !isNaN(tlng));

  const windSpeed = Number(storm.windSpeedKmH || 65);
  const radius = Math.min(250000, Math.max(80000, windSpeed * 1200));

  return (
    <>
      {/* Historical track path line if available */}
      {trackCoords.length > 1 && (
        <Polyline
          positions={trackCoords}
          pathOptions={{
            color: storm.alertLevel === 'Red' ? '#dc2626' : '#ea580c',
            weight: 3,
            dashArray: '6, 6',
            opacity: 0.75
          }}
        />
      )}

      {/* Wind danger radius circle */}
      <Circle
        center={[lat, lng]}
        radius={radius}
        pathOptions={{
          color: storm.alertLevel === 'Red' ? '#ef4444' : '#f97316',
          fillColor: storm.alertLevel === 'Red' ? '#ef4444' : '#f97316',
          fillOpacity: 0.12,
          weight: 1.5
        }}
      />

      <Marker position={[lat, lng]} icon={icon}>
        <Popup className="storm-popup" maxWidth={320}>
          <div className="p-1 space-y-2 text-gray-800">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">พายุหมุนเขตร้อน</span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">{storm.name}</h3>
              </div>
              <Badge
                variant={storm.alertLevel === 'Red' ? 'destructive' : 'secondary'}
                className={storm.alertLevel === 'Orange' ? 'bg-orange-500 text-white' : ''}
              >
                {storm.category}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-md text-xs">
              <div className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-gray-500">ความเร็วลม</div>
                  <div className="font-bold text-gray-900">{windSpeed} กม./ชม.</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div>
                  <div className="text-gray-500">ความกดอากาศ</div>
                  <div className="font-bold text-gray-900">{storm.pressureHPa || 995} hPa</div>
                </div>
              </div>
            </div>

            {storm.movementDirection && (
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <span>ทิศทางการเคลื่อนที่:</span>
                <span className="font-semibold text-gray-800">{storm.movementDirection} ({storm.movementSpeedKmH || 15} กม./ชม.)</span>
              </div>
            )}

            {storm.affectedCountries && storm.affectedCountries.length > 0 && (
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-700">พื้นที่เสี่ยงผลกระทบ: </span>
                <span>{storm.affectedCountries.join(', ')}</span>
              </div>
            )}

            {storm.affectedPopulation && storm.affectedPopulation > 0 && (
              <div className="text-xs text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ประชากรในพื้นที่เสี่ยง ~{storm.affectedPopulation.toLocaleString()} คน</span>
              </div>
            )}

            <div className="border-t pt-2 mt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-blue-500" />
                แหล่งข้อมูล: {storm.source}
              </span>
              <span>{new Date(storm.updatedAt || Date.now()).toLocaleDateString('th-TH')}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-1.5 text-[11px] text-amber-800 flex items-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>คำแนะนำ: ติดตามประกาศเตือนภัยฝนตกหนัก คลื่นลมแรง และเตรียมพร้อมรับมือภัยพิบัติ</span>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
