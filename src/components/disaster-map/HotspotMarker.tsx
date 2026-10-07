import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GISTDAHotspot } from './useGISTDAData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Satellite, MapPin, AlertTriangle, TreePine, Zap, Clock, ShieldAlert } from 'lucide-react';
import { getFrpClassification, formatFrp } from '@/services/nasaFirmsService';

interface HotspotMarkerProps {
  hotspot: GISTDAHotspot;
}

/**
 * Creates dynamic Leaflet DivIcon with FRP-graded thermal anomaly colors and pulse animation
 */
const createHotspotIcon = (frp: number, instrument: string) => {
  const isModis = instrument.toUpperCase().includes('MODIS');
  const frpInfo = getFrpClassification(frp);
  const color = frpInfo.colorHex;

  // Icon sizing based on Fire Radiative Power (MW)
  const size = frp >= 100 ? 16 : 
               frp >= 50 ? 13 : 
               frp >= 20 ? 11 : 9;
  
  const isHighIntensity = frp >= 50;
  const pulseHtml = isHighIntensity ? `
    <div style="
      position: absolute;
      width: ${size * 2.2}px;
      height: ${size * 2.2}px;
      top: -${size * 0.6}px;
      left: -${size * 0.6}px;
      border-radius: 50%;
      background-color: ${color};
      opacity: 0.4;
      animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
    "></div>
  ` : '';

  // Shape: VIIRS 375m (rounded square 375m pixel) vs MODIS (circle 1km pixel)
  const borderRadius = isModis ? '50%' : '3px';

  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        ${pulseHtml}
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: ${borderRadius};
          background-color: ${color};
          border: 1.5px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.55);
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

  const props: Partial<NonNullable<GISTDAHotspot['properties']>> = hotspot.properties || {};
  const instrument = props.instrument || hotspot.SATELLITE || 'VIIRS 375m';
  const province = props.changwat || props.pv_tn || hotspot.province || 'ไม่ระบุ';
  const amphoe = props.ap_tn || props.amphoe || 'ไม่ระบุ';
  const tambon = props.tambon || props.tb_tn || 'ไม่ระบุ';
  const village = props.village && props.village !== 'Unknown' ? props.village : null;
  const landUse = props.lu_name || props.lu_hp_name || 'พื้นที่เกษตร / ป่าไม้';
  const frp = Number(props.frp ?? hotspot.FRP ?? 0);
  const brightness = Number(props.bright_ti4 ?? hotspot.BRIGHTNESS ?? 0);
  const confidence = props.confidence ?? hotspot.CONFIDENCE ?? 75;
  const areaRai = props.area_rai || Math.max(1, Math.round(frp / 8));

  const frpClassification = getFrpClassification(frp);
  const isModis = instrument.toUpperCase().includes('MODIS');

  return (
    <Marker
      position={[latitude, longitude]}
      icon={createHotspotIcon(frp, instrument)}
    >
      <Popup maxWidth={340} className="hotspot-popup">
        <Card className="border-0 shadow-none p-0 text-slate-800">
          <CardHeader className="p-3 pb-2 border-b bg-gradient-to-r from-orange-50 via-amber-50 to-red-50">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xs font-extrabold flex items-center gap-1.5 text-slate-900">
                <Flame className="h-4 w-4 text-orange-600 flex-shrink-0 animate-pulse" />
                <span>ความผิดปกติทางความร้อน (Thermal Anomaly)</span>
              </CardTitle>
              <Badge className="text-[9px] px-1.5 py-0.2 bg-orange-600 text-white font-mono font-bold">
                NASA FIRMS
              </Badge>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="font-semibold text-slate-700">
                {isModis ? 'ดาวเทียม MODIS 1km' : 'ดาวเทียม VIIRS 375m NRT'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                Real-Time ≤ 3 ชม.
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-3 space-y-2.5 text-xs">
            {/* Prominent Fire Radiative Power (FRP) Metrics Card */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 p-2.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-orange-900 font-bold flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-orange-600" />
                  <span>Fire Radiative Power (FRP)</span>
                </div>
                <Badge className={`text-[10px] px-1.5 py-0.2 font-bold ${frpClassification.bgClass}`}>
                  {frpClassification.labelTh}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {frp.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-orange-700 ml-1">MW (เมกะวัตต์)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {getConfidenceLabel(confidence)}
                </span>
              </div>

              <p className="text-[10.5px] text-slate-600 border-t border-orange-200/60 pt-1 leading-snug">
                {frpClassification.descriptionTh}
              </p>
            </div>

            {/* Thermal Sensor Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-slate-500 text-[10px] block">อุณหภูมิความสว่าง (Brightness)</span>
                <span className="font-bold text-slate-800">
                  {brightness > 0 ? `${brightness.toFixed(1)} K` : 'ไม่ระบุ'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">พื้นที่คาดการณ์ความเสียหาย</span>
                <span className="font-bold text-slate-800">
                  ~{areaRai.toLocaleString()} ไร่
                </span>
              </div>
            </div>

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

            {/* Satellite & Detection Timestamp */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t">
              <span className="flex items-center gap-1">
                <Satellite className="h-3 w-3 text-blue-500" />
                {hotspot.properties?.satellite || hotspot.SATELLITE || 'NASA Suomi NPP / NOAA-20 / MODIS'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                {formatDateTime(hotspot.properties?.th_date || hotspot.ACQ_DATE, hotspot.properties?.th_time || hotspot.ACQ_TIME)}
              </span>
            </div>

            {/* Coordinates */}
            <div className="text-[10px] text-slate-400 text-right">
              พิกัดตรวจจับ: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  );
};

export default HotspotMarker;
