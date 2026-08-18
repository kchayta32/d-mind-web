import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { StormData, Earthquake, AirPollutionData } from './types';
import { FloodDataPoint } from './hooks/useOpenMeteoFloodData';

interface DisasterSummaryBannerProps {
  storms?: StormData[];
  earthquakes?: Earthquake[];
  airStations?: AirPollutionData[];
  floodPoints?: FloodDataPoint[];
  onNavigateTo?: (lat: number, lng: number, zoom?: number) => void;
}

export const DisasterSummaryBanner: React.FC<DisasterSummaryBannerProps> = ({
  storms = [],
  earthquakes = [],
  airStations = [],
  floodPoints = [],
  onNavigateTo
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  const safeStorms = Array.isArray(storms) ? storms : [];
  const safeEarthquakes = Array.isArray(earthquakes) ? earthquakes : [];
  const safeAirStations = Array.isArray(airStations) ? airStations : [];
  const safeFloodPoints = Array.isArray(floodPoints) ? floodPoints : [];

  // Critical alerts detection
  const redStorm = safeStorms.find(s => s?.alertLevel === 'Red' || s?.category?.includes('Cat 4') || s?.category?.includes('Cat 5') || (s?.windSpeedKmH || 0) >= 150);
  const majorEarthquake = safeEarthquakes.find(e => (e?.magnitude || 0) >= 6.0 && (Date.now() - new Date(e?.time || Date.now()).getTime()) < 48 * 3600000);
  const hazardousAir = safeAirStations.find(a => (a?.pm25 || 0) >= 75 || (a?.usAqi || 0) >= 200);
  const criticalRiver = safeFloodPoints.find(f => f?.floodRiskLevel === 'critical' || f?.floodRiskLevel === 'high');

  if (dismissed) return null;
  if (!redStorm && !majorEarthquake && !hazardousAir && !criticalRiver) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center justify-between text-xs sm:text-sm animate-pulse mb-3">
      <div className="flex items-center gap-2 flex-1 overflow-hidden pr-2">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-200" />
        <div className="truncate">
          <span className="font-bold bg-black/25 px-1.5 py-0.5 rounded text-xs mr-1.5 uppercase">
            เตือนภัยด่วน
          </span>
          {redStorm && (
            <span
              onClick={() => onNavigateTo?.(redStorm.lat ?? redStorm.latitude ?? 13.7, redStorm.lng ?? redStorm.longitude ?? 100.5, 7)}
              className="cursor-pointer underline font-medium hover:text-yellow-100"
            >
              ไต้ฝุ่น/พายุหมุน {redStorm.name} ({redStorm.windSpeedKmH} กม./ชม.) กำลังเคลื่อนตัว
            </span>
          )}
          {!redStorm && majorEarthquake && (
            <span
              onClick={() => onNavigateTo?.(majorEarthquake.lat ?? majorEarthquake.latitude ?? 13.7, majorEarthquake.lng ?? majorEarthquake.longitude ?? 100.5, 7)}
              className="cursor-pointer underline font-medium hover:text-yellow-100"
            >
              แผ่นดินไหวขนาดใหญ่ M{majorEarthquake.magnitude} ที่ {majorEarthquake.location || majorEarthquake.place || ''}
            </span>
          )}
          {!redStorm && !majorEarthquake && hazardousAir && (
            <span
              onClick={() => onNavigateTo?.(hazardousAir.lat ?? hazardousAir.latitude ?? 13.7, hazardousAir.lng ?? hazardousAir.longitude ?? 100.5, 10)}
              className="cursor-pointer underline font-medium hover:text-yellow-100"
            >
              คุณภาพอากาศระดับวิกฤต: {hazardousAir.province} (PM2.5 {hazardousAir.pm25} µg/m³)
            </span>
          )}
          {!redStorm && !majorEarthquake && !hazardousAir && criticalRiver && (
            <span
              onClick={() => onNavigateTo?.(criticalRiver.lat ?? 13.7, criticalRiver.lon ?? 100.5, 9)}
              className="cursor-pointer underline font-medium hover:text-yellow-100"
            >
              ระดับน้ำล้นตลิ่ง/วิกฤต: {criticalRiver.locationName} ({criticalRiver.currentDischarge} m³/s)
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition"
        title="ปิดการแจ้งเตือน"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
