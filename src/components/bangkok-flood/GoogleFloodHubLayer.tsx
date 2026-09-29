import React from 'react';
import { Marker, Tooltip, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  FloodHubGaugeStation, 
  FloodInundationPolygon,
  FloodHubSeverity,
  GOOGLE_FLOOD_HUB_STATIONS,
  FLOOD_INUNDATION_POLYGONS,
  BANGKOK_PROVINCE_BORDER,
  getSeverityColor
} from '@/services/googleFloodHubService';

interface GoogleFloodHubLayerProps {
  stations?: FloodHubGaugeStation[];
  polygons?: FloodInundationPolygon[];
  selectedStationId?: string | null;
  onSelectStation?: (station: FloodHubGaugeStation) => void;
  showInundationPolygons?: boolean;
  showBangkokBoundary?: boolean;
  showHazardZones?: boolean;
}

// Custom DivIcon matching Google Flood Hub circular nodes (Image 1 & 2)
const createFloodHubGaugeIcon = (severity: FloodHubSeverity, isSelected: boolean) => {
  const colorMap: Record<FloodHubSeverity, { dot: string; ring: string; ping: string }> = {
    extreme: {
      dot: 'bg-purple-600 border-white',
      ring: 'bg-purple-900/60 ring-2 ring-purple-400',
      ping: 'bg-purple-500'
    },
    danger: {
      dot: 'bg-rose-500 border-white',
      ring: 'bg-rose-900/60 ring-2 ring-rose-400',
      ping: 'bg-rose-500'
    },
    warning: {
      dot: 'bg-amber-500 border-white',
      ring: 'bg-amber-900/60 ring-2 ring-amber-400',
      ping: 'bg-amber-500'
    },
    normal: {
      dot: 'bg-emerald-500 border-white',
      ring: 'bg-emerald-900/60 ring-2 ring-emerald-400',
      ping: 'bg-emerald-500'
    }
  };

  const c = colorMap[severity] || colorMap.normal;
  const size = isSelected ? 38 : 30;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125">
      <!-- Outer Ring -->
      <div class="flex items-center justify-center rounded-full ${c.ring} ${isSelected ? 'w-10 h-10 ring-4 ring-cyan-300 shadow-2xl scale-110' : 'w-7 h-7 shadow-lg'}">
        <!-- Inner Core Dot -->
        <div class="w-3.5 h-3.5 rounded-full ${c.dot} border-2 shadow-sm"></div>
      </div>
      <!-- Pulse Effect on High Risk -->
      ${severity === 'extreme' || severity === 'danger' ? `
        <span class="absolute inline-flex h-full w-full rounded-full ${c.ping} opacity-40 animate-ping"></span>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'google-flood-hub-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const GoogleFloodHubLayer: React.FC<GoogleFloodHubLayerProps> = ({
  stations = GOOGLE_FLOOD_HUB_STATIONS,
  polygons = FLOOD_INUNDATION_POLYGONS,
  selectedStationId,
  onSelectStation,
  showInundationPolygons = true,
  showBangkokBoundary = true,
  showHazardZones = true
}) => {
  return (
    <>
      {/* 1. Bangkok Province Boundary (Matching Image 3) */}
      {showBangkokBoundary && (
        <Polyline
          positions={BANGKOK_PROVINCE_BORDER}
          pathOptions={{
            color: '#0f172a',
            weight: 3.5,
            opacity: 0.9,
            dashArray: '6, 6',
            lineCap: 'round',
            lineJoin: 'round'
          }}
        >
          <Tooltip sticky direction="top" className="leaflet-dark-tooltip">
            <div className="font-sans text-xs p-1">
              <span className="font-bold text-sky-300">🏛️ ขอบเขตกรุงเทพมหานคร (Bangkok Boundary)</span>
              <div className="text-[10px] text-slate-300">พื้นที่บริหารจัดการน้ำและคันกั้นน้ำ กทม.</div>
            </div>
          </Tooltip>
        </Polyline>
      )}

      {/* 2. Granular Inundation Polygons (Purple/Blue Patches matching Image 2) & Hazard Risk Zones (Image 1) */}
      {polygons.map((poly) => {
        const isHazard = poly.type === 'hazard_risk';
        if (isHazard && !showHazardZones) return null;
        if (!isHazard && !showInundationPolygons) return null;

        const pathStyle = isHazard
          ? {
              color: '#f43f5e',
              weight: 2,
              opacity: 0.8,
              fillColor: '#fda4af',
              fillOpacity: 0.22,
              dashArray: '5, 5'
            }
          : {
              // Deep purple/blue inundation patches matching Image 2
              color: '#9333ea',
              weight: 2,
              opacity: 0.9,
              fillColor: '#581c87',
              fillOpacity: 0.65
            };

        return (
          <Polygon
            key={poly.id}
            positions={poly.coordinates}
            pathOptions={pathStyle}
          >
            <Tooltip sticky direction="top" className="leaflet-dark-tooltip">
              <div className="font-sans text-xs p-1 space-y-1">
                <div className="font-bold text-purple-300 flex items-center gap-1">
                  <span>{isHazard ? '⚠️ โซนเฝ้าระวังมวลน้ำหลาก' : '🌊 พื้นที่น้ำท่วมขัง (Inundated)'}</span>
                </div>
                <div className="text-[11px] text-white font-semibold">{poly.name}</div>
                <div className="text-[10px] text-slate-300">ขนาดพื้นที่: ~{poly.affectedAreaKm2} ตร.กม.</div>
                <div className="text-[10px] text-slate-400">{poly.descriptionTh}</div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}

      {/* 3. Circular Flood Hub Gauge Markers (Matching Image 1 & 2) */}
      {stations.map((station) => {
        const isSelected = selectedStationId === station.id;
        const icon = createFloodHubGaugeIcon(station.severity, isSelected);

        return (
          <Marker
            key={station.id}
            position={station.coordinates}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSelectStation) {
                  onSelectStation(station);
                }
              }
            }}
          >
            <Tooltip direction="top" offset={[0, -16]} className="leaflet-dark-tooltip">
              <div className="font-sans text-xs p-1 min-w-[210px] space-y-1">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="font-bold text-white">{station.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    station.severity === 'extreme' ? 'bg-purple-900/80 text-purple-200' :
                    station.severity === 'danger' ? 'bg-rose-900/80 text-rose-200' :
                    station.severity === 'warning' ? 'bg-amber-900/80 text-amber-200' :
                    'bg-emerald-900/80 text-emerald-200'
                  }`}>
                    {station.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 space-y-0.5">
                  <div className="text-slate-300">{station.nameTh}</div>
                  <div>อัตราการไหล: <b className="text-cyan-300 font-extrabold">{station.currentDischargeM3s} m³/s</b></div>
                  <div className="text-slate-400">เกณฑ์ Danger: {station.thresholds.danger} m³/s | Extreme: {station.thresholds.extreme} m³/s</div>
                  <div className="text-[10px] text-sky-400 pt-0.5 font-semibold flex items-center justify-between">
                    <span>Google Flood Hub</span>
                    <span>คลิกเพื่อดูกราฟ 7 วัน &rarr;</span>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};
