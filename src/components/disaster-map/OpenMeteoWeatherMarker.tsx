import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { OpenMeteoRainDataPoint } from './hooks/useOpenMeteoRainData';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudRain, Droplets, Wind, Thermometer } from 'lucide-react';

const getWeatherIcon = (code: number) => {
  if (code >= 61 && code <= 67) return <CloudRain className="w-4 h-4" />;
  if (code >= 51 && code <= 57) return <Droplets className="w-4 h-4" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-4 h-4" />;
  if (code >= 20 && code <= 30) return <Cloud className="w-4 h-4" />;
  return <Cloud className="w-4 h-4" />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'ท้องฟ้าแจ่มใส';
  if (code === 1) return 'เมฆบางส่วน';
  if (code === 2) return 'เมฆปานกลาง';
  if (code === 3) return 'เมฆมาก';
  if (code >= 45 && code <= 48) return 'หมอก';
  if (code >= 51 && code <= 57) return 'ฝนปรอยๆ';
  if (code >= 61 && code <= 67) return 'ฝนตก';
  if (code >= 80 && code <= 82) return 'ฝนฟ้าคะนอง';
  if (code >= 95 && code <= 99) return 'พายุฝนฟ้าคะนอง';
  return 'สภาพอากาศปกติ';
};

const createWeatherIcon = (dataPoint: OpenMeteoRainDataPoint) => {
  const current = dataPoint.weatherData?.current;
  const rain = current?.rain || 0;
  const precip = current?.precipitation || 0;
  const isRaining = rain > 0 || precip > 0;
  const isHeavyRain = rain > 5 || precip > 5;
  
  let color = '#3b82f6';
  if (isHeavyRain) color = '#ef4444';
  else if (isRaining) color = '#f59e0b';
  
  return L.divIcon({
    html: `
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
      ">
        ☁️
      </div>
    `,
    className: 'custom-weather-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};

interface OpenMeteoWeatherMarkerProps {
  dataPoint: OpenMeteoRainDataPoint;
}

export const OpenMeteoWeatherMarker: React.FC<OpenMeteoWeatherMarkerProps> = ({ dataPoint }) => {
  const { weatherData, locationName, lat, lon } = dataPoint;
  const current = weatherData?.current;
  const daily = weatherData?.daily;

  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    return null;
  }
  
  const todayRainSum = daily?.rainSum?.[0] ?? 0;
  const todayPrecipitationSum = daily?.precipitationSum?.[0] ?? 0;
  const todayPrecipitationProb = daily?.precipitationProbabilityMax?.[0] ?? 0;

  const formatTime = (timeVal?: any) => {
    if (!timeVal) return new Date().toLocaleTimeString('th-TH');
    if (timeVal instanceof Date) return timeVal.toLocaleTimeString('th-TH');
    try {
      const d = new Date(timeVal);
      return isNaN(d.getTime()) ? String(timeVal) : d.toLocaleTimeString('th-TH');
    } catch {
      return String(timeVal);
    }
  };

  return (
    <Marker position={[lat, lon]} icon={createWeatherIcon(dataPoint)}>
      <Popup className="min-w-[280px]">
        <div className="space-y-3 p-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base flex items-center gap-2">
              {getWeatherIcon(current?.weatherCode || 0)}
              {locationName}
            </h3>
            <Badge variant={(current?.rain || 0) > 0 ? "destructive" : "secondary"}>
              {getWeatherDescription(current?.weatherCode || 0)}
            </Badge>
          </div>
          
          {/* Current Conditions */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-orange-500" />
              <span>{Number(current?.temperature2m || 0).toFixed(1)}°C</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>{Number(current?.relativeHumidity2m || 0).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              <span>{Number(current?.precipitation || 0).toFixed(1)} mm</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-gray-500" />
              <span>{Number(current?.windSpeed10m || 0).toFixed(1)} km/h</span>
            </div>
          </div>

          {/* Today's Forecast */}
          <div className="border-t pt-2">
            <h4 className="font-medium text-xs mb-1.5 text-gray-700">พยากรณ์วันนี้:</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>ปริมาณฝนสะสม:</span>
                <span className="font-semibold">{Number(todayRainSum).toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between">
                <span>ปริมาณน้ำฝนรวม:</span>
                <span className="font-semibold">{Number(todayPrecipitationSum).toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between">
                <span>โอกาสฝนตกสูงสุด:</span>
                <span className="font-semibold text-blue-600">{Number(todayPrecipitationProb).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="text-[11px] text-gray-400 border-t pt-1.5 flex justify-between">
            <span>พิกัด: {lat.toFixed(3)}, {lon.toFixed(3)}</span>
            <span>อัปเดต: {formatTime(current?.time)}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
