import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Camera, 
  Droplets, 
  Layers, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon,
  Eye,
  Activity,
  Radio,
  Satellite
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BANGKOK_ROAD_SEGMENTS, 
  BANGKOK_CANAL_STATIONS, 
  SENTINEL_FLOOD_INDICATORS 
} from '@/data/bangkokRoadFloodData';
import { 
  BANGKOK_CCTV_CAMERAS,
  BangkokCctvCamera,
  BangkokCctvZone
} from '@/data/bangkokCctvData';
import { BangkokZone, FloodSeverity, BangkokRoadSegment, BangkokCanalStation } from '@/types/bangkokFlood';

// Export types for consumer components
export type { BangkokZone, FloodSeverity, BangkokRoadSegment, BangkokCanalStation, BangkokCctvCamera };
export type BangkokSeverity = 'all' | FloodSeverity;

const JAWG_ACCESS_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_JAWG_ACCESS_TOKEN) || 'FTtoH6pBTHEDddbaGWyVP2EDCUBCVIdUP92MVIcbIx5H6jYNdDQca7404lHLL3Dc';

// Map base layer types
export type BaseMapStyle = 'osm' | 'google-hybrid' | 'satellite' | 'dark' | 'matrix';

export const BASE_MAP_URLS: Record<BaseMapStyle, { url: string; attribution: string; subdomains?: string[] }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    subdomains: ['a', 'b', 'c']
  },
  'google-hybrid': {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Hybrid',
    subdomains: ['0', '1', '2', '3']
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Sentinel/Maxar/DigitalGlobe',
    subdomains: ['a', 'b', 'c']
  },
  dark: {
    url: `https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=${JAWG_ACCESS_TOKEN}`,
    attribution: '&copy; <a href="https://www.jawg.io" target="_blank">Jawg</a>Maps &copy; OpenStreetMap',
    subdomains: ['a', 'b', 'c', 'd']
  },
  matrix: {
    url: `https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}.png?access-token=${JAWG_ACCESS_TOKEN}`,
    attribution: '&copy; <a href="https://www.jawg.io" target="_blank">Jawg</a>Maps &copy; OpenStreetMap',
    subdomains: ['a', 'b', 'c', 'd']
  }
};

// Custom Marker Icon Creators using pure HTML/CSS L.divIcon
const createCctvIcon = (severity: FloodSeverity, isSelected = false) => {
  const colorMap = {
    critical: { bg: 'bg-red-500', ring: 'ring-red-400', badge: 'bg-red-600', pulse: 'animate-ping bg-red-400' },
    warning: { bg: 'bg-amber-500', ring: 'ring-amber-400', badge: 'bg-amber-600', pulse: 'animate-ping bg-amber-400' },
    normal: { bg: 'bg-emerald-500', ring: 'ring-emerald-400', badge: 'bg-emerald-600', pulse: 'hidden' }
  };
  const theme = colorMap[severity] || colorMap.normal;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      ${severity !== 'normal' ? `<span class="absolute inline-flex h-9 w-9 rounded-full opacity-60 ${theme.pulse}"></span>` : ''}
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${theme.bg} text-white shadow-xl ring-2 ${theme.ring} ${isSelected ? 'scale-125 ring-4 ring-white' : 'transition-transform hover:scale-115'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      </div>
      <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${theme.badge}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bangkok-cctv-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const createWaterStationIcon = (status: 'critical' | 'warning' | 'normal', isSelected = false) => {
  const statusColors = {
    critical: 'bg-blue-600 text-white border-red-500 ring-red-400',
    warning: 'bg-cyan-600 text-white border-amber-500 ring-amber-400',
    normal: 'bg-teal-600 text-white border-emerald-500 ring-emerald-400'
  };

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      <div class="flex items-center justify-center w-8 h-8 rounded-xl shadow-lg border-2 ${statusColors[status] || statusColors.normal} ${isSelected ? 'scale-125 ring-4 ring-white' : 'transition-transform hover:scale-110'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <div class="absolute -top-1 -right-1 flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'bangkok-water-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

// Map View Controller Helper to handle flyTo / auto-centering
const MapController: React.FC<{
  centerTarget: [number, number] | null;
  zoomTarget?: number;
}> = ({ centerTarget, zoomTarget }) => {
  const map = useMap();

  useEffect(() => {
    if (centerTarget) {
      map.flyTo(centerTarget, zoomTarget || 14, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [centerTarget, zoomTarget, map]);

  return null;
};

// Convert Sentinel Indicators to GeoJSON features
const getSentinelGeoJson = (): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = SENTINEL_FLOOD_INDICATORS.map(ind => {
    const [cLat, cLng] = ind.centerCoordinates;
    const delta = Math.sqrt(ind.waterExtentSqKm) * 0.008;
    return {
      type: 'Feature',
      properties: {
        id: ind.id,
        name: ind.corridorName,
        satellite: ind.satellite,
        extentSqKm: ind.waterExtentSqKm,
        riskLevel: ind.riskLevel,
        confidence: ind.confidence,
        summary: ind.summaryTh
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [cLng - delta, cLat - delta],
          [cLng + delta, cLat - delta * 0.8],
          [cLng + delta * 1.2, cLat + delta],
          [cLng - delta * 0.9, cLat + delta * 1.1],
          [cLng - delta, cLat - delta]
        ]]
      }
    };
  });

  return {
    type: 'FeatureCollection',
    features
  };
};

export interface BangkokFloodMapProps {
  roads?: BangkokRoadSegment[];
  cctvs?: BangkokCctvCamera[];
  waterStations?: BangkokCanalStation[];
  selectedRoadId?: string | null;
  selectedCctvId?: string | null;
  showCctvLayer?: boolean;
  showCanalPumpsLayer?: boolean;
  showSentinelSarLayer?: boolean;
  onSelectRoad?: (road: BangkokRoadSegment) => void;
  onSelectCctv?: (cctv: BangkokCctvCamera) => void;
  onSelectStation?: (station: BangkokCanalStation) => void;
  focusTarget?: [number, number] | null;
  focusZoom?: number;
  className?: string;
}

export const BangkokFloodMap: React.FC<BangkokFloodMapProps> = ({
  roads = BANGKOK_ROAD_SEGMENTS,
  cctvs = BANGKOK_CCTV_CAMERAS,
  waterStations = BANGKOK_CANAL_STATIONS,
  selectedRoadId,
  selectedCctvId,
  showCctvLayer = true,
  showCanalPumpsLayer = true,
  showSentinelSarLayer = true,
  onSelectRoad,
  onSelectCctv,
  onSelectStation,
  focusTarget,
  focusZoom = 14,
  className = ''
}) => {
  const [baseMap, setBaseMap] = useState<BaseMapStyle>('osm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Center on Bangkok
  const bangkokCenter: [number, number] = [13.7563, 100.5018];
  const defaultZoom = 11;

  // Memoized Sentinel GeoJSON polygons
  const sentinelGeoJson = useMemo(() => getSentinelGeoJson(), []);

  // Handle Map Reset
  const handleResetView = () => {
    setResetKey(prev => prev + 1);
  };

  // Polyline style generator: Red #ef4444, weight 6; Orange #f97316, weight 5; Green #22c55e, weight 4
  const getRoadPolylineStyle = (road: BangkokRoadSegment, isSelected: boolean) => {
    if (isSelected) {
      return {
        color: '#3b82f6',
        weight: 9,
        opacity: 1,
        dashArray: undefined
      };
    }

    switch (road.status) {
      case 'critical':
        return {
          color: '#ef4444',
          weight: 6,
          opacity: 0.95
        };
      case 'warning':
        return {
          color: '#f97316',
          weight: 5,
          opacity: 0.90
        };
      case 'normal':
      default:
        return {
          color: '#22c55e',
          weight: 4,
          opacity: 0.85
        };
    }
  };

  return (
    <div className={`relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' : ''} ${className}`}>
      
      {/* Top Floating Map Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs">
        <span className="font-semibold px-2 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">แผนที่ฐาน:</span>
        </span>
        <button
          onClick={() => setBaseMap('osm')}
          className={`px-2.5 py-1 rounded-lg font-medium transition ${baseMap === 'osm' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          มาตรฐาน (OSM)
        </button>
        <button
          onClick={() => setBaseMap('google-hybrid')}
          className={`px-2.5 py-1 rounded-lg font-medium transition ${baseMap === 'google-hybrid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Google ไฮบริด
        </button>
        <button
          onClick={() => setBaseMap('satellite')}
          className={`px-2.5 py-1 rounded-lg font-medium transition ${baseMap === 'satellite' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          ดาวเทียม (Esri)
        </button>
        <button
          onClick={() => setBaseMap('dark')}
          className={`px-2.5 py-1 rounded-lg font-medium transition ${baseMap === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Jawg โหมดมืด
        </button>
        <button
          onClick={() => setBaseMap('matrix')}
          className={`px-2.5 py-1 rounded-lg font-medium transition ${baseMap === 'matrix' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Jawg เมทริกซ์
        </button>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleResetView}
          className="h-8 px-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200"
          title="รีเซ็ตมุมมอง กทม."
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          รีเซ็ต กทม.
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="h-8 px-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
          title={isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มจอ'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-xs space-y-2 pointer-events-auto max-w-[340px]">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
          <span>คำอธิบายสัญลักษณ์ถนน & จุดเฝ้าระวัง</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">เรียลไทม์ กทม.</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-red-500 shadow-sm"></span>
            <span className="text-red-700 dark:text-red-400 font-medium">🔴 วิกฤต/เลี่ยง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-orange-500 shadow-sm"></span>
            <span className="text-orange-700 dark:text-orange-400 font-medium">🟠 ขับช้า/ระวัง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-emerald-500 shadow-sm"></span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">🟢 ปกติ/ใช้ได้</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Camera className="w-3 h-3 text-blue-500" />
            กล้อง CCTV สำนักการจราจร ({cctvs.length})
          </span>
          <span className="flex items-center gap-1">
            <Waves className="w-3 h-3 text-cyan-500" />
            สถานีสูบน้ำ/คลอง ({waterStations.length})
          </span>
        </div>
        {showSentinelSarLayer && (
          <div className="flex items-center gap-1.5 text-[10px] text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 p-1.5 rounded-lg border border-sky-200 dark:border-sky-800">
            <Activity className="w-3.5 h-3.5 flex-shrink-0 animate-pulse text-sky-500" />
            <span>ชั้นดาวเทียม Sentinel-1 SAR ตรวจจับผิวน้ำท่วมขัง</span>
          </div>
        )}
      </div>

      {/* Main Leaflet Map */}
      <MapContainer
        key={`map-container-${resetKey}`}
        center={bangkokCenter}
        zoom={defaultZoom}
        minZoom={9}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Dynamic FlyTo controller */}
        <MapController centerTarget={focusTarget || null} zoomTarget={focusZoom} />

        {/* Base Tile Layer */}
        <TileLayer
          key={baseMap}
          url={BASE_MAP_URLS[baseMap].url}
          attribution={BASE_MAP_URLS[baseMap].attribution}
          subdomains={BASE_MAP_URLS[baseMap].subdomains || ['a', 'b', 'c']}
          maxZoom={19}
        />

        {/* Sentinel-1 SAR Flood Inundation Layer */}
        {showSentinelSarLayer && (
          <>
            <TileLayer
              key="sentinel1-sar-water-tiles"
              url="https://tiles.maps.eox.at/wmts/1.0.0/hydrography_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.png"
              opacity={0.45}
              attribution="&copy; Copernicus Sentinel-1 C-SAR Hydrography"
              maxZoom={18}
            />

            <GeoJSON
              key="sentinel1-sar-geojson"
              data={sentinelGeoJson}
              style={(feature) => {
                const risk = feature?.properties?.riskLevel;
                const color = risk === 'critical' ? '#ef4444' : risk === 'warning' ? '#f97316' : '#0284c7';
                return {
                  color,
                  weight: 2,
                  opacity: 0.85,
                  fillColor: color,
                  fillOpacity: 0.25,
                  dashArray: '4, 4'
                };
              }}
              onEachFeature={(feature, layer) => {
                const props = feature.properties || {};
                layer.bindTooltip(`
                  <div class="p-1 font-sans text-xs">
                    <div class="font-bold text-sky-800 dark:text-sky-300">🛰️ ${props.name}</div>
                    <div class="text-[11px] text-slate-600 dark:text-slate-300">ดาวเทียม: ${props.satellite} (ความเชื่อมั่น: ${props.confidence})</div>
                    <div class="text-[11px] font-semibold text-blue-600">พื้นที่ตรวจพบน้ำขัง: ~${props.extentSqKm} ตร.กม.</div>
                    <div class="text-[10px] text-slate-500 mt-1">${props.summary}</div>
                  </div>
                `, { sticky: true });
              }}
            />
          </>
        )}

        {/* Road Segments as Polylines */}
        {roads.map(road => {
          const isSelected = selectedRoadId === road.id;
          const style = getRoadPolylineStyle(road, isSelected);

          return (
            <Polyline
              key={road.id}
              positions={road.coordinates}
              pathOptions={style}
              eventHandlers={{
                click: () => {
                  if (onSelectRoad) onSelectRoad(road);
                }
              }}
            >
              <Tooltip sticky direction="top">
                <div className="font-sans text-xs min-w-[210px] p-0.5">
                  <div className="flex items-center justify-between gap-2 border-b pb-1 mb-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{road.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      road.status === 'critical' ? 'bg-red-100 text-red-700' :
                      road.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {road.status === 'critical' ? '🔴 วิกฤต' : road.status === 'warning' ? '🟠 ระวัง' : '🟢 ปกติ'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                    <div>ระดับน้ำ: <b className="text-blue-600 font-bold">{road.waterLevelCm} ซม.</b></div>
                    <div className="truncate">ผลกระทบ: ท่วม {road.lanesAffected} เลน</div>
                    <div className="text-[10px] text-slate-500 pt-0.5 flex items-center justify-between">
                      <span>เขต{road.district}</span>
                      <span className="text-blue-600 font-medium">คลิกดูรายงาน &rarr;</span>
                    </div>
                  </div>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Bangkok CCTV Cameras */}
        {showCctvLayer && cctvs.map(cctv => {
          const isSelected = selectedCctvId === cctv.id;
          const icon = createCctvIcon(cctv.floodSeverity, isSelected);

          return (
            <Marker
              key={cctv.id}
              position={cctv.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectCctv) onSelectCctv(cctv);
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -12]}>
                <div className="font-sans text-xs p-1 min-w-[190px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 mb-0.5">
                    <Camera className="w-3.5 h-3.5 text-blue-500" />
                    <span>{cctv.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    ถนน: {cctv.road}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ทิศทาง: {cctv.facingDirection}
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-blue-600 font-semibold">
                      {cctv.waterLevelCm ? `ระดับน้ำ ${cctv.waterLevelCm} ซม.` : 'พร้อมใช้งาน'}
                    </span>
                    <span className="text-indigo-600 font-medium">คลิกดูภาพสด &rarr;</span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Canal Water Gauges & Pumping Stations */}
        {showCanalPumpsLayer && waterStations.map(station => {
          const icon = createWaterStationIcon(station.status);

          return (
            <Marker
              key={station.id}
              position={station.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectStation) onSelectStation(station);
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -12]}>
                <div className="font-sans text-xs p-1 min-w-[210px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 mb-0.5">
                    <Waves className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{station.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                    <div>ระดับน้ำ: <b className="text-cyan-600 font-bold">{station.waterLevelMsl > 0 ? `+${station.waterLevelMsl}` : station.waterLevelMsl} ม.รทก.</b> (วิกฤต: +{station.criticalLevelMsl})</div>
                    <div>เครื่องสูบน้ำ: <b>{station.pumpsRunning}/{station.totalPumps} เครื่อง</b> ({station.flowRateM3s} ลบ.ม./วินาที)</div>
                    <div className="text-[10px] text-slate-400 pt-0.5">
                      สถานะ: {station.status === 'critical' ? '🔴 สูบระบายเต็มกำลัง' : station.status === 'warning' ? '🟠 เฝ้าระวัง' : '🟢 ปกติ'}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
};

export default BangkokFloodMap;
