import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { RainSensor } from './types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Calendar, Gauge } from 'lucide-react';

interface RainSensorMarkerProps {
  sensor: RainSensor;
}

const RainSensorMarker: React.FC<RainSensorMarkerProps> = ({ sensor }) => {
  const createRainIcon = (isRaining: boolean | null, humidity: number | null) => {
    const humidityValue = humidity || 0;
    let color = '#10b981'; // Green
    
    if (isRaining) {
      color = '#3b82f6'; // Blue
    } else if (humidityValue > 80) {
      color = '#eab308'; // Yellow
    }
    
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
          🌧️
        </div>
      `,
      className: 'custom-rain-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -11]
    });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleString('th-TH');
    } catch {
      return dateString;
    }
  };

  const getStatusLabel = () => {
    if (sensor.is_raining === true) return 'กำลังฝนตก';
    if (sensor.humidity && sensor.humidity > 80) return 'ความชื้นสูง';
    return 'ปกติ';
  };

  const getStatusColor = () => {
    if (sensor.is_raining === true) return 'bg-blue-100 text-blue-800';
    if (sensor.humidity && sensor.humidity > 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Ensure coordinates exist and are valid
  let lat = sensor.latitude;
  let lng = sensor.longitude;

  if ((!lat || !lng) && sensor.coordinates && Array.isArray(sensor.coordinates) && sensor.coordinates.length === 2) {
    lat = Number(sensor.coordinates[0]);
    lng = Number(sensor.coordinates[1]);
  }

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  return (
    <Marker
      position={[lat, lng]}
      icon={createRainIcon(sensor.is_raining, sensor.humidity)}
    >
      <Popup maxWidth={300}>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-blue-500" />
                เซ็นเซอร์ฝน #{sensor.id}
              </CardTitle>
              <Badge className={getStatusColor()}>
                {getStatusLabel()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-3.5 w-3.5 text-gray-500" />
              <span>ความชื้น: {sensor.humidity || 0}%</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CloudRain className="h-3.5 w-3.5 text-gray-500" />
              <span>สถานะ: {sensor.is_raining === true ? 'ฝนตก' : sensor.is_raining === false ? 'ไม่ฝนตก' : 'ไม่ระบุ'}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>อัพเดต: {formatDate(sensor.inserted_at || sensor.created_at)}</span>
            </div>

            <div className="text-xs text-gray-400 mt-2 pt-2 border-t">
              พิกัด: {lat.toFixed(4)}, {lng.toFixed(4)}
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  );
};

export default RainSensorMarker;
