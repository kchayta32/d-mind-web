import React, { useEffect, useMemo, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  Tooltip, 
  useMap,
  ZoomControl 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Waves, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Star, 
  Clock, 
  ExternalLink,
  Bot,
  Compass,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CafeVenue, 
  CafeCategory, 
  FloodRiskLevel, 
  SelectedDayFilter, 
  SelectedTimeFilter 
} from '@/types/cafeFlood';
import { BANGKOK_ROAD_SEGMENTS } from '@/data/bangkokRoadFloodData';
import { BangkokRoadSegment } from '@/types/bangkokFlood';
import { checkIsOpen } from '@/data/bangkokCafesData';
import { resolveDayOfWeek, resolveTargetTime } from './CafeCard';

export interface CafeFloodMapProps {
  venues: CafeVenue[];
  selectedVenue: CafeVenue | null;
  onSelectVenue: (venue: CafeVenue) => void;
  onOpenModal?: (venue: CafeVenue) => void;
  onAskTyphoon?: (venue: CafeVenue) => void;
  showFloodedRoads?: boolean;
  onToggleFloodedRoads?: (show: boolean) => void;
  filterDay?: SelectedDayFilter;
  filterTime?: SelectedTimeFilter;
  focusedVenue?: CafeVenue | null;
  className?: string;
}

// Bangkok Center Coordinate & Default Zoom
const BANGKOK_CENTER: [number, number] = [13.7563, 100.5230];
const DEFAULT_ZOOM = 12;

// Map Tile Styles
export type MapTileStyle = 'dark' | 'osm' | 'satellite' | 'google-hybrid';

const MAP_TILES: Record<MapTileStyle, { url: string; attribution: string; name: string }> = {
  dark: {
    name: 'แผนที่มืด (Jawg/Carto Dark)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
  },
  osm: {
    name: 'OpenStreetMap ปกติ',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    name: 'ภาพถ่ายดาวเทียม (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  'google-hybrid': {
    name: 'Google Maps Hybrid',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
  },
};

// Category SVG Icons and Colors
const CATEGORY_STYLES: Record<
  CafeCategory,
  { bg: string; border: string; glow: string; emoji: string; label: string }
> = {
  coffee: {
    bg: '#78350f', // warm amber-900
    border: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)',
    emoji: '☕',
    label: 'Coffee',
  },
  matcha: {
    bg: '#064e3b', // emerald-900
    border: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    emoji: '🍵',
    label: 'Matcha',
  },
  bar: {
    bg: '#581c87', // purple-900
    border: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.45)',
    emoji: '🍸',
    label: 'Bar',
  },
  bakery: {
    bg: '#881337', // rose-900
    border: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.45)',
    emoji: '🍰',
    label: 'Bakery',
  },
  coworking: {
    bg: '#0c4a6e', // sky-900
    border: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.45)',
    emoji: '💻',
    label: 'Coworking',
  },
  pet: {
    bg: '#7c2d12', // orange-900
    border: '#f97316',
    glow: 'rgba(249, 115, 22, 0.45)',
    emoji: '🐱',
    label: 'Pet',
  },
};

// Flood Safety Halo configuration
const FLOOD_HALOS: Record<
  FloodRiskLevel,
  { ringColor: string; shadowGlow: string; dotColor: string; label: string; pulseClass: string }
> = {
  safe: {
    ringColor: '#10b981', // emerald-500
    shadowGlow: '0 0 14px rgba(16, 185, 129, 0.75)',
    dotColor: '#34d399',
    label: 'ปลอดภัย',
    pulseClass: 'pulse-safe',
  },
  moderate: {
    ringColor: '#f59e0b', // amber-500
    shadowGlow: '0 0 14px rgba(245, 158, 11, 0.75)',
    dotColor: '#fbbf24',
    label: 'เฝ้าระวัง',
    pulseClass: 'pulse-moderate',
  },
  risk: {
    ringColor: '#ef4444', // red-500
    shadowGlow: '0 0 16px rgba(239, 68, 68, 0.85)',
    dotColor: '#f87171',
    label: 'พื้นที่เสี่ยง',
    pulseClass: 'pulse-risk',
  },
};

/**
 * Custom Leaflet HTML DivIcon Generator for Cafe Markers
 */
function createCafeMarkerIcon(venue: CafeVenue, isSelected = false, isOpen = true): L.DivIcon {
  const cat = CATEGORY_STYLES[venue.category] || CATEGORY_STYLES.coffee;
  const halo = FLOOD_HALOS[venue.floodRisk] || FLOOD_HALOS.safe;

  const size = isSelected ? 44 : 36;
  const anchor = size / 2;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: ${size}px; height: ${size}px;">
      <!-- Glowing halo ring based on flood safety status -->
      <div 
        class="absolute inset-0 rounded-full transition-all duration-300"
        style="
          box-shadow: ${halo.shadowGlow};
          border: 2px solid ${halo.ringColor};
          ${isSelected ? 'transform: scale(1.22); ring: 3px solid #ffffff;' : ''}
          opacity: 0.95;
        "
      ></div>

      <!-- Main Icon Circle Container -->
      <div 
        class="relative flex items-center justify-center rounded-full text-white font-bold transition-transform duration-200 group-hover:scale-110"
        style="
          width: ${size - 4}px;
          height: ${size - 4}px;
          background: ${cat.bg};
          border: 1.5px solid ${cat.border};
          font-size: ${isSelected ? '18px' : '15px'};
          line-height: 1;
        "
      >
        <span>${cat.emoji}</span>
      </div>

      <!-- Live Open/Closed indicator mini pill -->
      <div 
        class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 shadow-sm"
        style="background-color: ${isOpen ? '#10b981' : '#f43f5e'};"
        title="${isOpen ? 'เปิดให้บริการ' : 'ปิดทำการ'}"
      ></div>

      <!-- Flood safety small bottom dot badge -->
      <div 
        class="absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-slate-950 shadow-sm"
        style="background-color: ${halo.dotColor};"
        title="${halo.label}"
      ></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'cafe-flood-custom-marker',
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    popupAnchor: [0, -anchor - 6],
  });
}

/**
 * Child controller component inside MapContainer to manipulate view smoothly
 */
const MapViewController: React.FC<{
  targetVenue: CafeVenue | null;
  onResetTrigger?: number;
}> = ({ targetVenue, onResetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (targetVenue) {
      map.flyTo([targetVenue.lat, targetVenue.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [targetVenue, map]);

  useEffect(() => {
    if (onResetTrigger && onResetTrigger > 0) {
      map.flyTo(BANGKOK_CENTER, DEFAULT_ZOOM, {
        duration: 1.0,
      });
    }
  }, [onResetTrigger, map]);

  return null;
};

export const CafeFloodMap: React.FC<CafeFloodMapProps> = ({
  venues,
  selectedVenue,
  onSelectVenue,
  onOpenModal,
  onAskTyphoon,
  showFloodedRoads = true,
  onToggleFloodedRoads,
  filterDay = 'today',
  filterTime = 'live',
  focusedVenue,
  className = '',
}) => {
  const [tileStyle, setTileStyle] = useState<MapTileStyle>('dark');
  const [resetCount, setResetCount] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeDay = useMemo(() => resolveDayOfWeek(filterDay), [filterDay]);
  const activeTime = useMemo(() => resolveTargetTime(filterTime), [filterTime]);

  // Filter flooded roads from BANGKOK_ROAD_SEGMENTS (critical & warning)
  const floodedRoads = useMemo(() => {
    return BANGKOK_ROAD_SEGMENTS.filter(
      (road) => road.status === 'critical' || road.status === 'warning'
    );
  }, []);

  const handleResetView = () => {
    setResetCount((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('cafe-flood-map-wrapper');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      id="cafe-flood-map-wrapper"
      className={`relative isolate w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col ${className}`}
    >
      {/* Top Map Floating Toolbar */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badges: Venue Count & Legend */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Badge
            variant="outline"
            className="bg-slate-900/90 text-slate-100 border-slate-700/80 backdrop-blur-md px-3 py-1.5 text-xs font-semibold shadow-lg flex items-center gap-1.5"
          >
            <span>📍 แสดง {venues.length} จุด</span>
          </Badge>

          {/* Flooded Road Layer Toggle Button */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleFloodedRoads?.(!showFloodedRoads)}
            className={`h-8 text-xs font-medium rounded-full px-3 backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 ${
              showFloodedRoads
                ? 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-500/60 text-cyan-200'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-400'
            }`}
          >
            <Waves className={`w-3.5 h-3.5 ${showFloodedRoads ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>ถนนน้ำท่วม กทม. ({floodedRoads.length})</span>
            <span
              className={`w-2 h-2 rounded-full ${
                showFloodedRoads ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
          </Button>
        </div>

        {/* Right Controls: Style selector, Reset, Fullscreen */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Map Base Tile Switcher */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 flex items-center backdrop-blur-md shadow-lg">
            {(['dark', 'osm', 'satellite'] as MapTileStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setTileStyle(style)}
                className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-colors ${
                  tileStyle === style
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {style === 'dark' ? 'Dark' : style === 'osm' ? 'OSM' : 'Sat'}
              </button>
            ))}
          </div>

          {/* Reset Map View */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleResetView}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 backdrop-blur-md shadow-lg"
            title="รีเซ็ตมุมมองแผนที่ กทม."
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </Button>

          {/* Toggle Fullscreen */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 backdrop-blur-md shadow-lg"
            title="ขยายเต็มจอ"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-slate-200" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Floating Bottom Left Legend */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 bg-slate-950/90 border border-slate-800/90 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-md shadow-xl pointer-events-auto">
        <span className="font-semibold text-slate-400">สถานะน้ำท่วม:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
          <span>ปลอดภัย</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
          <span>เฝ้าระวัง</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
          <span>พื้นที่เสี่ยง</span>
        </span>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={BANGKOK_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#020617' }}
      >
        {/* Bottom-right zoom control avoids top bar collision */}
        <ZoomControl position="bottomright" />

        <TileLayer
          url={MAP_TILES[tileStyle].url}
          attribution={MAP_TILES[tileStyle].attribution}
          maxZoom={19}
        />

        {/* Camera and View Controller */}
        <MapViewController
          targetVenue={focusedVenue || selectedVenue}
          onResetTrigger={resetCount}
        />

        {/* Flooded Road Polylines Layer */}
        {showFloodedRoads &&
          floodedRoads.map((road) => {
            const isCritical = road.status === 'critical';
            const color = isCritical ? '#ef4444' : '#f59e0b';

            return (
              <Polyline
                key={road.id}
                positions={road.coordinates}
                pathOptions={{
                  color,
                  weight: isCritical ? 6 : 5,
                  opacity: 0.85,
                  dashArray: isCritical ? '6, 6' : undefined,
                }}
              >
                <Tooltip sticky className="leaflet-dark-tooltip">
                  <div className="p-1.5 space-y-1.5 text-xs min-w-[210px]">
                    <p className="font-bold text-white flex items-center gap-1.5 text-sm drop-shadow-sm">
                      <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{road.name}</span>
                    </p>
                    <p className="text-xs text-slate-200 flex items-center gap-1">
                      <span>ระดับน้ำ:</span>
                      <strong className="text-cyan-300 font-extrabold text-sm">{road.waterLevelCm} ซม.</strong>
                      <span className="text-slate-400">({road.district})</span>
                    </p>
                    <p
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        road.passable.smallCar 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {road.passable.smallCar
                        ? '⚠️ รถเล็กผ่านได้ด้วยความระมัดระวัง'
                        : '⛔ รถเล็กและมอเตอร์ไซค์ห้ามผ่าน'}
                    </p>
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

        {/* Cafe Venue Markers */}
        {venues.map((venue) => {
          const isSelected = selectedVenue?.id === venue.id;
          const isOpen = checkIsOpen(venue, activeDay, activeTime);
          const icon = createCafeMarkerIcon(venue, isSelected, isOpen);

          return (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectVenue(venue),
              }}
            >
              <Popup className="leaflet-dark-popup" maxWidth={280}>
                <div className="p-1.5 text-slate-100 space-y-2">
                  {/* Popup Header */}
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[11px] mb-0.5">
                      <span className="font-bold text-amber-400 tracking-wide">
                        {venue.category.toUpperCase()} • {venue.zone.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-200 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                        {venue.rating.toFixed(1)}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">
                      {venue.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {venue.nameEn}
                    </p>
                  </div>

                  {/* Flood Status and Hours */}
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        venue.floodRisk === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : venue.floodRisk === 'moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {venue.floodRisk === 'safe' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      {venue.floodRisk === 'moderate' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {venue.floodRisk === 'risk' && <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />}
                      <span>
                        {venue.floodRisk === 'safe'
                          ? 'ปลอดภัยจากน้ำท่วม'
                          : venue.floodRisk === 'moderate'
                          ? 'เฝ้าระวังน้ำขังผิวถนน'
                          : 'พื้นที่เสี่ยงน้ำท่วม'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{venue.openingHoursText}</span>
                    </div>
                  </div>

                  {/* Popup Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onOpenModal?.(venue)}
                      className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg px-2"
                    >
                      ดูข้อมูลร้าน
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="h-7 text-xs border-slate-300 dark:border-slate-700 rounded-lg px-2 flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3 text-blue-500" />
                      <span>นำทาง</span>
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CafeFloodMap;
