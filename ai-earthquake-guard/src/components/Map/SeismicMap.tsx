import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  EarthquakeEvent, 
  SeismicStation, 
  ActiveFault 
} from '../../types/seismic';
import { THAI_ACTIVE_FAULTS, THAI_SEISMIC_STATIONS } from '../../services/thaiFaultData';
import MapLegend from './MapLegend';
import StationListModal from './StationListModal';
import { 
  Layers, 
  Radio, 
  Activity, 
  MapPin, 
  Crosshair, 
  RotateCcw, 
  Play, 
  Pause, 
  FastForward, 
  ShieldAlert, 
  Compass, 
  Maximize2, 
  Flame, 
  Waves,
  Eye,
  EyeOff,
  Globe,
  Sliders,
  AlertTriangle
} from 'lucide-react';

// Wave propagation velocities (average continental crust speeds)
const P_WAVE_VELOCITY_KM_S = 6.0; // Primary Wave velocity (~6.0 km/s)
const S_WAVE_VELOCITY_KM_S = 3.5; // Secondary Wave velocity (~3.5 km/s)

// Default geographic centers
const THAILAND_CENTER: [number, number] = [15.8700, 100.9925];
const DEFAULT_ZOOM = 6;

// Geodesic distance calculation via Haversine formula (returns km)
function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format Roman Numerals for Modified Mercalli Intensity
function formatMMI(mmi: number): string {
  const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const rounded = Math.min(12, Math.max(1, Math.round(mmi)));
  return romanNumerals[rounded] || `${rounded}`;
}

export interface UserLocation {
  lat: number;
  lng: number;
  name?: string;
}

export interface SeismicMapProps {
  activeEvent?: EarthquakeEvent | null;
  events?: EarthquakeEvent[];
  stations?: SeismicStation[];
  faults?: ActiveFault[];
  userLocation?: UserLocation | null;
  onSelectEvent?: (event: EarthquakeEvent) => void;
  onSelectStation?: (station: SeismicStation) => void;
  isSimulating?: boolean;
  simulationElapsedSec?: number;
  className?: string;
  height?: string | number;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const SeismicMap: React.FC<SeismicMapProps> = ({
  activeEvent,
  events = [],
  stations = THAI_SEISMIC_STATIONS,
  faults = THAI_ACTIVE_FAULTS,
  userLocation = { lat: 13.7563, lng: 100.5018, name: 'กรุงเทพมหานคร (Bangkok Command)' },
  onSelectEvent,
  onSelectStation,
  isSimulating = false,
  simulationElapsedSec,
  className = '',
  height = '100%',
  initialCenter = THAILAND_CENTER,
  initialZoom = DEFAULT_ZOOM
}) => {
  // Container ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Layer groups refs
  const baseTilesRef = useRef<{ dark: L.TileLayer; satellite: L.TileLayer } | null>(null);
  const faultLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const stationLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const eventLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const waveLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Wave circles refs
  const pWaveCircleRef = useRef<L.Circle | null>(null);
  const sWaveCircleRef = useRef<L.Circle | null>(null);
  const feltCircleRef = useRef<L.Circle | null>(null);

  // UI Layer Toggle States
  const [activeTile, setActiveTile] = useState<'dark' | 'satellite'>('dark');
  const [showFaults, setShowFaults] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showWavefronts, setShowWavefronts] = useState<boolean>(true);
  const [showUserVector, setShowUserVector] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState<boolean>(false);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  // Internal Wave Animation State (used when external simulationElapsedSec is not supplied)
  const [internalElapsedSec, setInternalElapsedSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimestampRef = useRef<number | null>(null);

  // Determine current active elapsed seconds for wavefronts
  const currentElapsedSec = simulationElapsedSec !== undefined 
    ? simulationElapsedSec 
    : internalElapsedSec;

  // Max simulation time in seconds before looping or capping (e.g. 120s covers 720km)
  const MAX_SIM_SECONDS = 120;

  // -------------------------------------------------------------
  // Internal animation loop for continuous wavefront expansion
  // -------------------------------------------------------------
  useEffect(() => {
    if (simulationElapsedSec !== undefined) {
      // Externally driven
      return;
    }

    if (!isPlaying || !activeEvent || !showWavefronts) {
      lastTickTimestampRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (lastTickTimestampRef.current === null) {
        lastTickTimestampRef.current = time;
      }
      const deltaSec = (time - lastTickTimestampRef.current) / 1000;
      lastTickTimestampRef.current = time;

      setInternalElapsedSec((prev) => {
        const next = prev + deltaSec * playbackSpeed;
        if (next >= MAX_SIM_SECONDS) {
          return 0; // Reset loop for continuous tactical radar effect
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, activeEvent, showWavefronts, simulationElapsedSec]);

  // Reset internal clock when activeEvent changes
  useEffect(() => {
    setInternalElapsedSec(0);
  }, [activeEvent?.id]);

  // -------------------------------------------------------------
  // 1. Initialize Leaflet Map
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Tactical CartoDB Dark Matter tile layer
    const darkTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 4
    });

    // High-resolution Satellite layer
    const satelliteTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      maxZoom: 18,
      minZoom: 4
    });

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      layers: [darkTile],
      zoomControl: false,
      attributionControl: false
    });

    // Custom tactical zoom control on bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution on bottom-left with tactical styling
    L.control.attribution({ position: 'bottomleft', prefix: 'SeismoGuard AI Map Engine' }).addTo(map);

    // Initialize layer groups
    const faultLayer = L.layerGroup().addTo(map);
    const stationLayer = L.layerGroup().addTo(map);
    const eventLayer = L.layerGroup().addTo(map);
    const waveLayer = L.layerGroup().addTo(map);
    const userLayer = L.layerGroup().addTo(map);

    baseTilesRef.current = { dark: darkTile, satellite: satelliteTile };
    faultLayerGroupRef.current = faultLayer;
    stationLayerGroupRef.current = stationLayer;
    eventLayerGroupRef.current = eventLayer;
    waveLayerGroupRef.current = waveLayer;
    userLayerGroupRef.current = userLayer;
    mapRef.current = map;

    // ResizeObserver for automatic map invalidateSize on container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // -------------------------------------------------------------
  // 2. Base Tile Switching
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const baseTiles = baseTilesRef.current;
    if (!map || !baseTiles) return;

    if (activeTile === 'dark') {
      if (map.hasLayer(baseTiles.satellite)) map.removeLayer(baseTiles.satellite);
      if (!map.hasLayer(baseTiles.dark)) map.addLayer(baseTiles.dark);
    } else {
      if (map.hasLayer(baseTiles.dark)) map.removeLayer(baseTiles.dark);
      if (!map.hasLayer(baseTiles.satellite)) map.addLayer(baseTiles.satellite);
    }
  }, [activeTile]);

  // -------------------------------------------------------------
  // 3. Render Thailand Active Fault Zones (Glowing Polylines)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const faultLayer = faultLayerGroupRef.current;
    if (!map || !faultLayer) return;

    faultLayer.clearLayers();

    if (!showFaults) return;

    faults.forEach((fault) => {
      const isHighRisk = fault.riskLevel === 'high';
      const isModerate = fault.riskLevel === 'moderate';

      const glowColor = isHighRisk ? '#f43f5e' : isModerate ? '#f59e0b' : '#10b981';
      const coreColor = isHighRisk ? '#ef4444' : isModerate ? '#fbbf24' : '#34d399';

      // Outer glow polyline (thick, semi-transparent)
      const glowPolyline = L.polyline(fault.coordinates, {
        color: glowColor,
        weight: isHighRisk ? 8 : 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Inner bright polyline (sharp)
      const corePolyline = L.polyline(fault.coordinates, {
        color: coreColor,
        weight: isHighRisk ? 3 : 2.2,
        opacity: 0.95,
        dashArray: isModerate ? '6, 6' : undefined,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Interactive popup with geological telemetry
      const popupContent = `
        <div class="p-2.5 font-sans min-w-[240px] text-slate-100">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span class="font-mono text-xs font-bold text-amber-400 tracking-wider">ACTIVE FAULT ZONE</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
              isHighRisk 
                ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                : isModerate 
                ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }">
              ${fault.riskLevel} Risk
            </span>
          </div>
          <h4 class="text-sm font-bold text-slate-100 mb-0.5">${fault.thaiName}</h4>
          <p class="text-xs text-slate-400 font-mono mb-2">${fault.name}</p>
          
          <div class="grid grid-cols-2 gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-[11px] font-mono mb-2">
            <div>
              <span class="text-slate-500 block text-[10px]">ศักยภาพสูงสุด</span>
              <span class="font-bold text-rose-400">M ${fault.maxMagnitude.toFixed(1)}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">อัตราการเลื่อนตัว</span>
              <span class="font-bold text-amber-400">${fault.slipRateMmYear} mm/ปี</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-300 mb-1">
            <span class="text-slate-500 font-mono">พื้นที่พาดผ่าน:</span> ${fault.province} (${fault.zone})
          </div>
          <p class="text-[10px] text-slate-400 line-clamp-3 leading-relaxed mt-1 bg-slate-900/50 p-1.5 rounded border border-slate-800/50">
            ${fault.description}
          </p>
        </div>
      `;

      glowPolyline.bindPopup(popupContent);
      corePolyline.bindPopup(popupContent);

      // Add to group
      faultLayer.addLayer(glowPolyline);
      faultLayer.addLayer(corePolyline);
    });
  }, [faults, showFaults]);

  // -------------------------------------------------------------
  // 4. Render Regional Seismic Stations
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const stationLayer = stationLayerGroupRef.current;
    if (!map || !stationLayer) return;

    stationLayer.clearLayers();

    if (!showStations) return;

    // Calculate dynamic P-Wavefront arrival on stations during simulation
    const epicenterLat = activeEvent?.latitude;
    const epicenterLng = activeEvent?.longitude;
    const pWaveRadiusKm = currentElapsedSec * P_WAVE_VELOCITY_KM_S;

    stations.forEach((station) => {
      // Determine if station has received P-wave from active epicenter
      let dynamicStatus = station.status;
      if (activeEvent && showWavefronts && currentElapsedSec > 0 && epicenterLat && epicenterLng) {
        const distKm = calculateHaversineDistanceKm(epicenterLat, epicenterLng, station.lat, station.lng);
        if (distKm <= pWaveRadiusKm) {
          dynamicStatus = 'triggered';
        }
      }

      // Visual color styling
      let ringClass = 'border-emerald-400 bg-emerald-500/20 text-emerald-400';
      let dotColor = '#10b981';
      let pulseAnim = '';

      if (dynamicStatus === 'triggered') {
        ringClass = 'border-rose-500 bg-rose-500/30 text-rose-400';
        dotColor = '#f43f5e';
        pulseAnim = 'animate-ping';
      } else if (dynamicStatus === 'warning') {
        ringClass = 'border-amber-400 bg-amber-500/20 text-amber-400';
        dotColor = '#f59e0b';
        pulseAnim = 'animate-pulse';
      } else if (dynamicStatus === 'offline') {
        ringClass = 'border-slate-600 bg-slate-800/40 text-slate-500';
        dotColor = '#64748b';
      }

      // Custom Leaflet DivIcon for tactical sensor
      const stationIcon = L.divIcon({
        className: 'custom-station-icon',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
            ${dynamicStatus === 'triggered' ? `<div class="absolute inset-0 rounded-full bg-rose-500/40 animate-ping"></div>` : ''}
            <div class="w-6 h-6 rounded-full border ${ringClass} flex items-center justify-center backdrop-blur-sm shadow-lg transition-transform group-hover:scale-125">
              <span class="w-2 h-2 rounded-full" style="background-color: ${dotColor}; box-shadow: 0 0 8px ${dotColor};"></span>
            </div>
            <div class="absolute -bottom-4 px-1 py-0.2 bg-slate-950/90 border border-slate-700/80 rounded text-[9px] font-mono font-bold text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              ${station.code}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([station.lat, station.lng], { icon: stationIcon });

      const popupContent = `
        <div class="p-2.5 font-sans min-w-[250px] text-slate-100">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-sm font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">${station.code}</span>
              <span class="text-[10px] font-mono text-slate-400">${station.network}</span>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
              dynamicStatus === 'triggered'
                ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                : dynamicStatus === 'warning'
                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
            }">
              ● ${dynamicStatus}
            </span>
          </div>

          <h4 class="text-xs font-bold text-slate-100 mb-1">${station.name}</h4>
          <p class="text-[11px] text-slate-400 mb-3">จังหวัด: <span class="text-slate-200 font-semibold">${station.province}</span> (ระดับความสูง ${station.elevationM} ม.)</p>

          <div class="grid grid-cols-2 gap-2 bg-slate-950/90 p-2 rounded-lg border border-slate-800 font-mono text-xs mb-3">
            <div>
              <span class="text-slate-500 block text-[10px]">Real-time PGA</span>
              <span class="font-bold ${station.pga > 0.05 ? 'text-rose-400' : 'text-slate-200'}">
                ${station.pga.toFixed(4)} Gal
              </span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Signal-to-Noise (SNR)</span>
              <span class="font-bold text-emerald-400">${station.snr.toFixed(1)} dB</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-850 pt-2">
            <span>Lat: ${station.lat.toFixed(4)}°N</span>
            <span>Lng: ${station.lng.toFixed(4)}°E</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedStationId(station.id);
        if (onSelectStation) {
          onSelectStation(station);
        }
      });

      stationLayer.addLayer(marker);
    });
  }, [stations, showStations, activeEvent, currentElapsedSec, showWavefronts, onSelectStation]);

  // -------------------------------------------------------------
  // 5. Render All Earthquake Events (Historical & Epicenters)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const eventLayer = eventLayerGroupRef.current;
    if (!map || !eventLayer) return;

    eventLayer.clearLayers();

    // Render list of background / recent events
    events.forEach((evt) => {
      // If this event is the currently active one, skip here since it's highlighted specially below
      if (activeEvent && activeEvent.id === evt.id) return;

      const isHighMag = evt.magnitude >= 6.0;
      const isMedMag = evt.magnitude >= 4.5;
      const markerColor = isHighMag ? '#ef4444' : isMedMag ? '#f59e0b' : '#06b6d4';

      const eventIcon = L.divIcon({
        className: 'custom-event-icon',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 24px; height: 24px;">
            <div class="w-4 h-4 rounded-full border border-white/80 shadow-md flex items-center justify-center" style="background-color: ${markerColor};">
              <span class="text-[8px] font-bold text-white font-mono">${evt.magnitude.toFixed(1)}</span>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([evt.latitude, evt.longitude], { icon: eventIcon });

      const popupContent = `
        <div class="p-2 font-sans min-w-[220px] text-slate-100">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span class="font-mono text-xs font-bold text-rose-400">M ${evt.magnitude.toFixed(1)}</span>
            <span class="text-[10px] font-mono text-slate-400 uppercase">${evt.source}</span>
          </div>
          <h4 class="text-xs font-bold text-slate-100 mb-1">${evt.title}</h4>
          <div class="text-[11px] text-slate-300 mb-1 font-mono">
            <span>ความลึก: ${evt.depthKm} km</span> | <span>MMI: ${formatMMI(evt.mmi)}</span>
          </div>
          <div class="text-[10px] text-slate-500 font-mono">
            ${new Date(evt.time).toLocaleString('th-TH')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectEvent) onSelectEvent(evt);
      });

      eventLayer.addLayer(marker);
    });

    // Render Active Event with pulsating beacon effect
    if (activeEvent) {
      const isCritical = activeEvent.alertLevel === 'critical' || activeEvent.magnitude >= 6.0;
      const beaconColor = isCritical ? '#ef4444' : '#f59e0b';

      const activeIcon = L.divIcon({
        className: 'custom-active-epicenter-icon',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer" style="width: 56px; height: 56px;">
            <!-- Outer beacon radar pulses -->
            <div class="beacon-ring w-14 h-14 bg-rose-500/30 border-2 border-rose-500"></div>
            <div class="beacon-ring w-14 h-14 bg-rose-500/20 border border-rose-400" style="animation-delay: 0.8s;"></div>
            
            <!-- Central glowing core with magnitude badge -->
            <div class="relative z-10 w-9 h-9 rounded-full bg-slate-950 border-2 border-white flex flex-col items-center justify-center text-white" style="box-shadow: 0 0 20px ${beaconColor};">
              <span class="text-[8px] font-mono text-rose-400 font-bold leading-none">EPICENTER</span>
              <span class="text-[11px] font-mono font-black text-white leading-none">M${activeEvent.magnitude.toFixed(1)}</span>
            </div>
          </div>
        `,
        iconSize: [56, 56],
        iconAnchor: [28, 28],
        popupAnchor: [0, -30]
      });

      const activeMarker = L.marker([activeEvent.latitude, activeEvent.longitude], { 
        icon: activeIcon,
        zIndexOffset: 1000
      });

      const popupContent = `
        <div class="p-3 font-sans min-w-[280px] text-slate-100">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-rose-600 font-mono text-xs font-black text-white shadow-[0_0_10px_#ef4444]">
                M ${activeEvent.magnitude.toFixed(1)}
              </span>
              <span class="text-xs font-mono font-bold text-slate-300">EPICENTER TELEMETRY</span>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
              activeEvent.alertLevel === 'critical'
                ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                : 'bg-amber-950 text-amber-300 border border-amber-700'
            }">
              ${activeEvent.alertLevel}
            </span>
          </div>

          <h3 class="text-sm font-bold text-slate-100 mb-1 leading-snug">${activeEvent.title}</h3>
          <p class="text-xs text-cyan-400 font-mono mb-2">จุดศูนย์กลาง: ${activeEvent.epicenter} ${activeEvent.province ? `(${activeEvent.province})` : ''}</p>

          <div class="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-xs mb-2">
            <div>
              <span class="text-slate-500 block text-[10px]">ความลึก (Depth)</span>
              <span class="font-bold text-slate-200">${activeEvent.depthKm} km</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Peak Accel (PGA)</span>
              <span class="font-bold text-rose-400">${activeEvent.pga.toFixed(3)} Gal</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">Intensity (MMI)</span>
              <span class="font-bold text-amber-400">${formatMMI(activeEvent.mmi)}</span>
            </div>
          </div>

          ${activeEvent.tsunamiRisk ? `
            <div class="p-2 mb-2 bg-rose-950/70 border border-rose-500 rounded text-[11px] text-rose-200 flex items-center gap-1.5 animate-pulse">
              <span class="font-bold">⚠️ แจ้งเตือนสึนามิ:</span> มีความเสี่ยงต่อแนวชายฝั่งอันดามัน
            </div>
          ` : ''}

          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <span>แหล่งข้อมูล: ${activeEvent.source} (${activeEvent.status})</span>
            <span>${new Date(activeEvent.time).toLocaleTimeString('th-TH')}</span>
          </div>
        </div>
      `;

      activeMarker.bindPopup(popupContent);
      activeMarker.on('click', () => {
        if (onSelectEvent) onSelectEvent(activeEvent);
      });

      eventLayer.addLayer(activeMarker);
    }
  }, [events, activeEvent, onSelectEvent]);

  // -------------------------------------------------------------
  // 6. Real-Time Animated Shockwave Rings (P-Wave, S-Wave, Felt)
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const waveLayer = waveLayerGroupRef.current;
    if (!map || !waveLayer) return;

    // If no active event or wave toggle turned off, clear layers
    if (!activeEvent || !showWavefronts) {
      waveLayer.clearLayers();
      pWaveCircleRef.current = null;
      sWaveCircleRef.current = null;
      feltCircleRef.current = null;
      return;
    }

    const center: [number, number] = [activeEvent.latitude, activeEvent.longitude];

    // Radii calculations in meters
    // P-Wave expands at ~6.0 km/s -> radius in meters = seconds * 6000
    const pRadiusMeters = Math.max(10, currentElapsedSec * P_WAVE_VELOCITY_KM_S * 1000);
    // S-Wave expands at ~3.5 km/s -> radius in meters = seconds * 3500
    const sRadiusMeters = Math.max(10, currentElapsedSec * S_WAVE_VELOCITY_KM_S * 1000);

    // Empirical Felt Intensity Boundary Radius (MMI II+)
    // Rfelt approx 10^(0.43 * M + 0.3) in km
    const feltRadiusKm = Math.min(800, Math.max(40, Math.pow(10, 0.43 * activeEvent.magnitude + 0.3)));
    const feltRadiusMeters = feltRadiusKm * 1000;

    // Outer Felt Boundary Circle (static boundary for given event)
    if (!feltCircleRef.current) {
      const feltCircle = L.circle(center, {
        radius: feltRadiusMeters,
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '8, 8',
        fillColor: '#f59e0b',
        fillOpacity: 0.04,
        interactive: false
      });
      feltCircleRef.current = feltCircle;
      waveLayer.addLayer(feltCircle);
    } else {
      feltCircleRef.current.setLatLng(center);
      feltCircleRef.current.setRadius(feltRadiusMeters);
    }

    // P-Wave Circle (Cyan / Blue Expanding Wavefront)
    if (!pWaveCircleRef.current) {
      const pCircle = L.circle(center, {
        radius: pRadiusMeters,
        color: '#00f2fe',
        weight: 2.5,
        dashArray: '5, 5',
        fillColor: '#06b6d4',
        fillOpacity: 0.08,
        interactive: false
      });
      pWaveCircleRef.current = pCircle;
      waveLayer.addLayer(pCircle);
    } else {
      pWaveCircleRef.current.setLatLng(center);
      pWaveCircleRef.current.setRadius(pRadiusMeters);
    }

    // S-Wave Circle (Destructive Crimson / Red Expanding Wavefront)
    if (!sWaveCircleRef.current) {
      const sCircle = L.circle(center, {
        radius: sRadiusMeters,
        color: '#f43f5e',
        weight: 3.5,
        fillColor: '#e11d48',
        fillOpacity: 0.18,
        interactive: false
      });
      sWaveCircleRef.current = sCircle;
      waveLayer.addLayer(sCircle);
    } else {
      sWaveCircleRef.current.setLatLng(center);
      sWaveCircleRef.current.setRadius(sRadiusMeters);
    }
  }, [activeEvent, showWavefronts, currentElapsedSec]);

  // -------------------------------------------------------------
  // 7. User Location Marker & Warning Radius & Geodesic Vector
  // -------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const userLayer = userLayerGroupRef.current;
    if (!map || !userLayer) return;

    userLayer.clearLayers();

    if (!userLocation) return;

    const userLatLng: [number, number] = [userLocation.lat, userLocation.lng];

    // Tactical User Marker
    const userIcon = L.divIcon({
      className: 'custom-user-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
          <div class="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"></div>
          <div class="w-7 h-7 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_15px_#00f2fe] flex items-center justify-center text-cyan-300">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="22" y1="12" x2="18" y2="12"></line>
              <line x1="6" y1="12" x2="2" y2="12"></line>
              <line x1="12" y1="6" x2="12" y2="2"></line>
              <line x1="12" y1="22" x2="12" y2="18"></line>
            </svg>
          </div>
          <div class="absolute -bottom-5 px-1.5 py-0.5 bg-slate-950/90 border border-cyan-500/60 rounded text-[9px] font-mono font-bold text-cyan-300 pointer-events-none whitespace-nowrap shadow-lg">
            USER POS
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -20]
    });

    const userMarker = L.marker(userLatLng, { icon: userIcon });

    // Distance & Countdown calculations if activeEvent exists
    let distanceKm = 0;
    let pArrivalSec = 0;
    let sArrivalSec = 0;
    let sCountdownRemaining = 0;
    let isSArrived = false;

    if (activeEvent) {
      distanceKm = calculateHaversineDistanceKm(
        activeEvent.latitude,
        activeEvent.longitude,
        userLocation.lat,
        userLocation.lng
      );
      pArrivalSec = distanceKm / P_WAVE_VELOCITY_KM_S;
      sArrivalSec = distanceKm / S_WAVE_VELOCITY_KM_S;
      sCountdownRemaining = Math.max(0, sArrivalSec - currentElapsedSec);
      isSArrived = currentElapsedSec >= sArrivalSec;
    }

    const popupContent = `
      <div class="p-2.5 font-sans min-w-[240px] text-slate-100">
        <div class="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
          <span class="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            USER TELEMETRY
          </span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            GPS FIX
          </span>
        </div>

        <h4 class="text-xs font-bold text-slate-100 mb-1">${userLocation.name || 'ตำแหน่งผู้ใช้งาน'}</h4>
        <div class="text-[11px] font-mono text-slate-400 mb-2">
          ${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E
        </div>

        ${activeEvent ? `
          <div class="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 text-[10px]">ระยะห่างจากศูนย์กลาง:</span>
              <span class="font-bold text-cyan-300">${distanceKm.toFixed(1)} km</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 text-[10px]">P-Wave Arrival:</span>
              <span class="text-cyan-400 font-bold">${pArrivalSec.toFixed(1)} วินาที</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 text-[10px]">S-Wave Arrival:</span>
              <span class="text-rose-400 font-bold">${sArrivalSec.toFixed(1)} วินาที</span>
            </div>
            <div class="pt-1.5 border-t border-slate-800 flex items-center justify-between">
              <span class="text-[11px] font-bold ${isSArrived ? 'text-rose-400' : 'text-amber-400'}">
                ${isSArrived ? '⚠️ คลื่นทำลายล้างมาถึงแล้ว' : 'เวลาก่อนคลื่น S-Wave ถึง:'}
              </span>
              <span class="text-sm font-black ${isSArrived ? 'text-rose-500' : 'text-amber-300'}">
                ${isSArrived ? 'IMPACT' : `${sCountdownRemaining.toFixed(1)}s`}
              </span>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    userMarker.bindPopup(popupContent);
    userLayer.addLayer(userMarker);

    // Geodesic Vector Line connecting User and Epicenter
    if (activeEvent && showUserVector) {
      const vectorLine = L.polyline([
        [activeEvent.latitude, activeEvent.longitude],
        [userLocation.lat, userLocation.lng]
      ], {
        color: '#00f2fe',
        weight: 1.5,
        dashArray: '6, 6',
        opacity: 0.75
      });

      // Midpoint tooltip showing distance
      const midLat = (activeEvent.latitude + userLocation.lat) / 2;
      const midLng = (activeEvent.longitude + userLocation.lng) / 2;
      
      const distanceLabelMarker = L.marker([midLat, midLng], {
        icon: L.divIcon({
          className: 'custom-dist-label',
          html: `
            <div class="px-2 py-0.5 rounded-full bg-slate-950/95 border border-cyan-500/70 text-[10px] font-mono font-bold text-cyan-300 shadow-xl whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2">
              ↔ ${distanceKm.toFixed(1)} km (${sArrivalSec.toFixed(0)}s Lead)
            </div>
          `,
          iconSize: [0, 0]
        }),
        interactive: false
      });

      userLayer.addLayer(vectorLine);
      userLayer.addLayer(distanceLabelMarker);
    }
  }, [userLocation, activeEvent, showUserVector, currentElapsedSec]);

  // -------------------------------------------------------------
  // Camera Control Actions
  // -------------------------------------------------------------
  const handleCenterThailand = useCallback(() => {
    mapRef.current?.flyTo(THAILAND_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
  }, []);

  const handleCenterEpicenter = useCallback(() => {
    if (activeEvent && mapRef.current) {
      mapRef.current.flyTo([activeEvent.latitude, activeEvent.longitude], 8, { duration: 1.2 });
    }
  }, [activeEvent]);

  const handleCenterUser = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 9, { duration: 1.2 });
    }
  }, [userLocation]);

  // Center on a station when chosen from modal
  const handleSelectStationFromModal = useCallback((station: SeismicStation) => {
    setSelectedStationId(station.id);
    if (mapRef.current) {
      mapRef.current.flyTo([station.lat, station.lng], 10, { duration: 1.2 });
    }
    if (onSelectStation) {
      onSelectStation(station);
    }
  }, [onSelectStation]);

  // Distance & Countdown banner values
  const userImpactTelemetry = useMemo(() => {
    if (!activeEvent || !userLocation) return null;
    const distanceKm = calculateHaversineDistanceKm(
      activeEvent.latitude,
      activeEvent.longitude,
      userLocation.lat,
      userLocation.lng
    );
    const sArrivalSec = distanceKm / S_WAVE_VELOCITY_KM_S;
    const pArrivalSec = distanceKm / P_WAVE_VELOCITY_KM_S;
    const sRemaining = Math.max(0, sArrivalSec - currentElapsedSec);
    const hasSArrived = currentElapsedSec >= sArrivalSec;
    const hasPArrived = currentElapsedSec >= pArrivalSec;

    return {
      distanceKm,
      sArrivalSec,
      pArrivalSec,
      sRemaining,
      hasSArrived,
      hasPArrived
    };
  }, [activeEvent, userLocation, currentElapsedSec]);

  return (
    <div 
      className={`relative w-full overflow-hidden bg-[#0a0e17] rounded-2xl border border-slate-800 shadow-2xl flex flex-col ${className}`}
      style={{ height }}
    >
      {/* -------------------------------------------------------------
          Map Canvas Element
      ------------------------------------------------------------- */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[420px] flex-1 z-0 cursor-crosshair"
      />

      {/* -------------------------------------------------------------
          Top Navigation HUD Bar: Status & Layer Controls
      ------------------------------------------------------------- */}
      <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none flex flex-wrap items-start justify-between gap-2">
        {/* Left Side: Telemetry Pill & Impact Banner */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Tactical Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="font-bold text-slate-100 tracking-wider">SEISMOGUARD GIS</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-semibold hidden sm:inline">
              {activeTile === 'dark' ? 'CARTO DARK TACTICAL' : 'SATELLITE HIGH-RES'}
            </span>
          </div>

          {/* Active Earthquake Alert & Countdown Pill (if event exists) */}
          {activeEvent && userImpactTelemetry && (
            <div className={`px-3.5 py-2 rounded-xl backdrop-blur-md border shadow-2xl transition-all max-w-sm sm:max-w-md ${
              userImpactTelemetry.hasSArrived
                ? 'bg-rose-950/90 border-rose-500/80 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-slate-900/95 border-amber-500/70 text-slate-100'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  แผ่นดินไหวขนาด M{activeEvent.magnitude.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  ระยะ {userImpactTelemetry.distanceKm.toFixed(0)} km
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-slate-300 font-sans truncate">
                  {activeEvent.epicenter}
                </span>

                <div className="flex items-center gap-1.5 font-mono font-black shrink-0">
                  <span className="text-[10px] text-slate-400 font-normal">S-Wave:</span>
                  <span className={`text-sm ${
                    userImpactTelemetry.hasSArrived 
                      ? 'text-rose-400 font-bold' 
                      : userImpactTelemetry.sRemaining <= 10 
                      ? 'text-rose-400 animate-ping' 
                      : 'text-amber-400'
                  }`}>
                    {userImpactTelemetry.hasSArrived 
                      ? 'กระทบแล้ว' 
                      : `-${userImpactTelemetry.sRemaining.toFixed(1)}s`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tactical Controls Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/90 shadow-2xl pointer-events-auto">
          {/* Tile Switcher: Dark vs Satellite */}
          <button
            type="button"
            onClick={() => setActiveTile(activeTile === 'dark' ? 'satellite' : 'dark')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTile === 'satellite'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_#00f2fe]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="สลับโหมดแผนที่ ดาวเทียม / โหมดมืด (Toggle Satellite / Dark Mode)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{activeTile === 'dark' ? 'Dark' : 'Sat'}</span>
          </button>

          {/* Fault Lines Toggle */}
          <button
            type="button"
            onClick={() => setShowFaults(!showFaults)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              showFaults
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title="เปิด/ปิด เส้นรอยเลื่อนมีพลังในประเทศไทย (Active Faults)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">รอยเลื่อน</span>
          </button>

          {/* Seismic Stations Toggle */}
          <button
            type="button"
            onClick={() => setShowStations(!showStations)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              showStations
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title="เปิด/ปิด จุดสถานีตรวจวัดแผ่นดินไหว (Seismic Stations)"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">สถานี</span>
          </button>

          {/* Wave Propagation Toggle */}
          <button
            type="button"
            onClick={() => setShowWavefronts(!showWavefronts)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              showWavefronts
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title="เปิด/ปิด คลื่นกระจายตัว P-Wave และ S-Wave (Shockwave Propagation)"
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">คลื่นไหว</span>
          </button>

          {/* Geodesic User Vector Toggle */}
          <button
            type="button"
            onClick={() => setShowUserVector(!showUserVector)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              showUserVector
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title="เปิด/ปิด เส้นระยะห่างตำแหน่งของคุณกับศูนย์กลาง (User Distance Vector)"
          >
            <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">พิกัดผู้ใช้</span>
          </button>

          <div className="w-[1px] h-5 bg-slate-800 my-auto mx-0.5" />

          {/* Station List Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsStationModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="ดูรายชื่อสถานีทั้งหมด (Station Network Telemetry)"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">เครือข่ายสถานี</span>
          </button>

          {/* Recenter Actions */}
          <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={handleCenterThailand}
              className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="กลับสู่มุมมองทั้งประเทศไทย (Center Thailand)"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            {activeEvent && (
              <button
                type="button"
                onClick={handleCenterEpicenter}
                className="p-1.5 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 transition-colors"
                title="เล็งจุดศูนย์กลางแผ่นดินไหว (Center Epicenter)"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
            )}
            {userLocation && (
              <button
                type="button"
                onClick={handleCenterUser}
                className="p-1.5 rounded text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/50 transition-colors"
                title="เล็งตำแหน่งผู้ใช้งาน (Center User)"
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Bottom Left: Floating Collapsible Cartographic Legend
      ------------------------------------------------------------- */}
      <div className="absolute bottom-6 left-3 z-[1000] pointer-events-none">
        <MapLegend 
          className="pointer-events-auto"
          defaultExpanded={showLegend}
        />
      </div>

      {/* -------------------------------------------------------------
          Bottom Center HUD: Shockwave Simulation Player Control Bar
      ------------------------------------------------------------- */}
      {activeEvent && showWavefronts && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-semibold text-[11px]">WAVEFRONT ENGINE</span>
          </div>

          <div className="w-[1px] h-4 bg-slate-800" />

          {/* Time elapsed display */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px]">T-ELAPSED:</span>
            <span className="font-bold text-cyan-300 text-sm w-12 text-right">
              {currentElapsedSec.toFixed(1)}s
            </span>
          </div>

          {/* Radii metric pills */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
              P-Wave: {(currentElapsedSec * P_WAVE_VELOCITY_KM_S).toFixed(0)} km
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80">
              S-Wave: {(currentElapsedSec * S_WAVE_VELOCITY_KM_S).toFixed(0)} km
            </span>
          </div>

          {/* Simulation controls (only shown when not externally controlled) */}
          {simulationElapsedSec === undefined && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={isPlaying ? 'หยุดชั่วคราว (Pause)' : 'เล่นต่อ (Play)'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <button
                type="button"
                onClick={() => setInternalElapsedSec(0)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="เริ่มจำลองคลื่นใหม่จากวินาที 0 (Reset Wavefronts)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-400 transition-colors"
                title="ความเร็วการแพร่กระจายคลื่น (Simulation Speed Multiplier)"
              >
                {playbackSpeed}x
              </button>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          Station Telemetry Modal
      ------------------------------------------------------------- */}
      <StationListModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        stations={stations}
        onSelectStation={handleSelectStationFromModal}
        selectedStationId={selectedStationId}
      />
    </div>
  );
};

export default SeismicMap;
