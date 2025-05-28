
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { RainSensor } from './types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Calendar, Gauge } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface RainSensorMarkerProps {
  sensor: RainSensor;
}

const RainSensorMarker: React.FC<RainSensorMarkerProps> = ({ sensor }) => {
  // Create custom icon based on rain status
  const createRainIcon = (isRaining: boolean, humidity: number) => {
    const color = isRaining ? '#3b82f6' : humidity > 80 ? '#eab308' : '#10b981';
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p', { locale: th });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusLabel = () => {
    if (sensor.is_raining) return 'กำลังฝนตก';
    if (sensor.humidity > 80) return 'ความชื้นสูง';
    return 'ปกติ';
  };

  const getStatusColor = () => {
    if (sensor.is_raining) return 'bg-blue-100 text-blue-800';
    if (sensor.humidity > 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Marker
      position={sensor.coordinates || [0, 0]}
      icon={createRainIcon(sensor.is_raining, sensor.humidity || 0)}
    >
      <Popup maxWidth={300}>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                เซ็นเซอร์ฝน
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
              <Droplets className="h-3.5 w-3.5 text-gray-500" />
              <span>สถานะ: {sensor.is_raining ? 'ฝนตก' : 'ไม่ฝนตก'}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>อัพเดต: {formatDate(sensor.inserted_at)}</span>
            </div>

            <div className="text-xs text-gray-400 mt-2 pt-2 border-t">
              ID: {sensor.id}
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  );
};

export default RainSensorMarker;
