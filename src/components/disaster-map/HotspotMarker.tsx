import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GISTDAHotspot } from './useGISTDAData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Gauge, Satellite, MapPin, AlertTriangle, TreePine } from 'lucide-react';

interface HotspotMarkerProps {
  hotspot: GISTDAHotspot;
}

const createHotspotIcon = (riskLevel: string, instrument: string) => {
  const isModis = instrument.toUpperCase().includes('MODIS');
  
  // High-visibility fire colors
  const riskColors: Record<string, string> = {
    'very_high': '#dc2626', // Deep bright red
    'high': '#ea580c',      // Orange red
    'medium': '#f59e0b',    // Amber
    'low': '#eab308'        // Yellow
  };

  const color = riskColors[riskLevel] || '#ea580c';
  const size = riskLevel === 'very_high' ? 14 : 
               riskLevel === 'high' ? 12 : 
               riskLevel === 'medium' ? 10 : 8;
  
  const isHighRisk = riskLevel === 'very_high' || riskLevel === 'high';
  const pulseHtml = isHighRisk ? `
    <div style="
      position: absolute;
      width: ${size * 2}px;
      height: ${size * 2}px;
      top: -${size / 2}px;
      left: -${size / 2}px;
      border-radius: 50%;
      background-color: ${color};
      opacity: 0.35;
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    "></div>
  ` : '';

  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        ${pulseHtml}
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: ${isModis ? '50%' : '3px'};
          background-color: ${color};
          border: 1.5px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
          position: relative;
          z-index: 2;
        "></div>
      </div>
    `,
    className: 'custom-hotspot-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

const formatDateTime = (date?: string, time?: string) => {
  if (!date) return 'ไม่ระบุ';
  try {
    const dateTimeString = `${date} ${time || ''}`.trim();
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return d.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return `${date} ${time || ''}`.trim() || 'ไม่ระบุ';
  }
};

const getRiskLevelColor = (riskLevel: string) => {
  const colors: Record<string, string> = {
    'very_high': 'bg-red-500 text-white',
    'high': 'bg-orange-500 text-white',
    'medium': 'bg-amber-500 text-white',
    'low': 'bg-yellow-500 text-slate-900'
  };
  return colors[riskLevel] || 'bg-slate-100 text-slate-800';
};

const getRiskLevelLabel = (riskLevel: string) => {
  const labels: Record<string, string> = {
    'very_high': 'เสี่ยงวิกฤต',
    'high': 'เสี่ยงสูง', 
    'medium': 'เสี่ยงปานกลาง',
    'low': 'เสี่ยงต่ำ'
  };
  return labels[riskLevel] || 'ตรวจพบความร้อน';
};

const getConfidenceColor = (confidence: number | string) => {
  if (typeof confidence === 'number') {
    if (confidence >= 80) return 'bg-red-100 text-red-800 border-red-200';
    if (confidence >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  } else {
    if (confidence === 'nominal' || confidence === 'high') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }
};

const getConfidenceLabel = (confidence: number | string) => {
  if (typeof confidence === 'number') {
    return `ความเชื่อมั่น ${confidence}%`;
  } else {
    if (confidence === 'high') return 'ความเชื่อมั่นสูง';
    if (confidence === 'nominal') return 'ความเชื่อมั่นปกติ';
    return 'ความเชื่อมั่นต่ำ';
  }
};

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot }) => {
  // Determine coordinates with strict type safety
  let latitude: number | null = null;
  let longitude: number | null = null;

  if (hotspot.geometry?.coordinates && Array.isArray(hotspot.geometry.coordinates) && hotspot.geometry.coordinates.length >= 2) {
    longitude = Number(hotspot.geometry.coordinates[0]);
    latitude = Number(hotspot.geometry.coordinates[1]);
  } else if (typeof hotspot.LATITUDE === 'number' && typeof hotspot.LONGITUDE === 'number') {
    latitude = hotspot.LATITUDE;
    longitude = hotspot.LONGITUDE;
  } else if (hotspot.LATITUDE !== undefined && hotspot.LONGITUDE !== undefined) {
    latitude = Number(hotspot.LATITUDE);
    longitude = Number(hotspot.LONGITUDE);
  }

  if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  const props = hotspot.properties || {};
  const instrument = props.instrument || hotspot.SATELLITE || 'VIIRS';
  const riskLevel = props.risk_level || 'medium';
  const province = props.changwat || props.pv_tn || hotspot.province || 'ไม่ระบุ';
  const amphoe = props.ap_tn || props.amphoe || 'ไม่ระบุ';
  const tambon = props.tambon || props.tb_tn || 'ไม่ระบุ';
  const village = props.village && props.village !== 'Unknown' ? props.village : null;
  const landUse = props.lu_name || props.lu_hp_name || 'พื้นที่เกษตร / ป่าไม้';
  const frp = Number(props.frp ?? hotspot.FRP ?? 0);
  const brightness = Number(props.bright_ti4 ?? hotspot.BRIGHTNESS ?? 0);
  const confidence = props.confidence ?? hotspot.CONFIDENCE ?? 75;
  const areaRai = props.area_rai || Math.max(1, Math.round(frp / 8));

  return (
    <Marker
      position={[latitude, longitude]}
      icon={createHotspotIcon(riskLevel, instrument)}
    >
      <Popup maxWidth={330} className="hotspot-popup">
        <Card className="border-0 shadow-none p-0 text-slate-800">
          <CardHeader className="p-2.5 pb-2 border-b">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-900">
                <Flame className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <span>จุดความร้อน {instrument}</span>
              </CardTitle>
              <div className="flex items-center gap-1">
                <Badge className={`text-[10px] px-1.5 py-0.5 ${getRiskLevelColor(riskLevel)}`}>
                  {getRiskLevelLabel(riskLevel)}
                </Badge>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0.5 ${getConfidenceColor(confidence)}`}>
                  {getConfidenceLabel(confidence)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2.5 space-y-2.5 text-xs">
            {/* Location Information */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <MapPin className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                <span>{province} {amphoe !== 'ไม่ระบุ' ? `> ${amphoe}` : ''} {tambon !== 'ไม่ระบุ' ? `> ${tambon}` : ''}</span>
              </div>
              {village && (
                <div className="text-[11px] text-slate-600 pl-5">
                  หมู่บ้าน: {village}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-600 pt-0.5">
                <TreePine className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span>ลักษณะพื้นที่: <strong className="text-slate-800">{landUse}</strong></span>
              </div>
            </div>

            {/* Thermal & Sensor Details */}
            <div className="grid grid-cols-2 gap-2 bg-orange-50/70 border border-orange-100 p-2 rounded-lg">
              <div>
                <div className="text-[10px] text-orange-700 flex items-center gap-1">
                  <Flame className="h-3 w-3" /> กำลังการแผ่ความร้อน (FRP)
                </div>
                <div className="font-bold text-slate-900 text-sm">{frp.toFixed(1)} MW</div>
              </div>
              <div>
                <div className="text-[10px] text-orange-700 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> พื้นที่เสี่ยงโดยประมาณ
                </div>
                <div className="font-bold text-slate-900 text-sm">~{areaRai.toLocaleString()} ไร่</div>
              </div>
              {brightness > 0 && (
                <div className="col-span-2 text-[11px] text-slate-600 flex items-center justify-between border-t border-orange-200/50 pt-1 mt-0.5">
                  <span>อุณหภูมิความสว่าง (Brightness):</span>
                  <span className="font-semibold text-slate-800">{brightness.toFixed(1)} K</span>
                </div>
              )}
            </div>

            {/* Satellite & Timestamp */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t">
              <span className="flex items-center gap-1">
                <Satellite className="h-3 w-3 text-blue-500" />
                {hotspot.properties?.satellite || hotspot.SATELLITE || 'Suomi NPP / NOAA'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                {formatDateTime(hotspot.properties?.th_date || hotspot.ACQ_DATE, hotspot.properties?.th_time || hotspot.ACQ_TIME)}
              </span>
            </div>

            {/* Coordinates */}
            <div className="text-[10px] text-slate-400 text-right">
              พิกัด: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  );
};

export default HotspotMarker;
