import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { VolcanoData } from '../types';
import { Badge } from '@/components/ui/badge';
import { Mountain, Globe2, ShieldAlert } from 'lucide-react';

interface VolcanoMarkerProps {
  volcano: VolcanoData;
}

const createVolcanoIcon = (status: VolcanoData['status'], alertLevel: VolcanoData['alertLevel']) => {
  const isErupting = status === 'Erupting' || alertLevel === 'Red';
  const bgColor = isErupting ? '#dc2626' : alertLevel === 'Orange' ? '#ea580c' : '#d97706';
  const pulseClass = isErupting ? 'animate-ping' : '';

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-9 h-9 rounded-full ${pulseClass}" style="background-color: ${bgColor}; opacity: 0.35;"></div>
      <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs border-2 border-white" style="background-color: ${bgColor};">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
          <path d="M11 10h2v4h-2zm0 6h2v2h-2z" fill="#fff"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'volcano-custom-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

export const VolcanoMarker: React.FC<VolcanoMarkerProps> = ({ volcano }) => {
  const lat = volcano.latitude ?? volcano.lat;
  const lng = volcano.longitude ?? volcano.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  const icon = createVolcanoIcon(volcano.status, volcano.alertLevel);

  return (
    <>
      {/* Exclusion / Ash danger zone (approx 25km radius) */}
      <Circle
        center={[lat, lng]}
        radius={25000}
        pathOptions={{
          color: volcano.status === 'Erupting' ? '#ef4444' : '#f59e0b',
          fillColor: volcano.status === 'Erupting' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.1,
          weight: 1
        }}
      />

      <Marker position={[lat, lng]} icon={icon}>
        <Popup maxWidth={300}>
          <div className="p-1 space-y-2 text-gray-800">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase">ภูเขาไฟ</span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">{volcano.name}</h3>
              </div>
              <Badge
                variant={volcano.status === 'Erupting' ? 'destructive' : 'secondary'}
                className={volcano.alertLevel === 'Orange' ? 'bg-orange-500 text-white' : ''}
              >
                {volcano.status === 'Erupting' ? 'กำลังปะทุ' : 'เฝ้าระวัง'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ประเทศ/ภูมิภาค:</span>
                <span className="font-semibold text-gray-800">{volcano.country}</span>
              </div>
              {volcano.elevationMeters && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-amber-600" /> ความสูงยอดเขา:
                  </span>
                  <span className="font-semibold text-gray-800">{volcano.elevationMeters.toLocaleString()} เมตร</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ระดับการเตือนภัย:</span>
                <span className="font-semibold text-red-600">{volcano.alertLevel} Alert</span>
              </div>
            </div>

            {volcano.description && (
              <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                {volcano.description}
              </p>
            )}

            <div className="border-t pt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-blue-500" />
                แหล่งข้อมูล: {volcano.source}
              </span>
              <span>{new Date(volcano.lastEruptionDate || Date.now()).toLocaleDateString('th-TH')}</span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-1.5 text-[11px] text-red-800 flex items-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>ระวังเถ้าถ่านภูเขาไฟในชั้นบรรยากาศและการสัญจรทางอากาศ</span>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
