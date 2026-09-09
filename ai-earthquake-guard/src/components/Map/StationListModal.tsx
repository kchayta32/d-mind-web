import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Radio, 
  MapPin, 
  Activity, 
  Signal, 
  Mountain, 
  Crosshair, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Flame,
  WifiOff
} from 'lucide-react';
import { SeismicStation } from '../../types/seismic';

export interface StationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: SeismicStation[];
  onSelectStation: (station: SeismicStation) => void;
  selectedStationId?: string | null;
}

export const StationListModal: React.FC<StationListModalProps> = ({
  isOpen,
  onClose,
  stations,
  onSelectStation,
  selectedStationId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState<'ALL' | 'TMD_NATIONAL' | 'DMR_FAULT' | 'REGIONAL_NET'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'online' | 'warning' | 'triggered' | 'offline'>('ALL');

  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.province.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesNetwork = networkFilter === 'ALL' || s.network === networkFilter;
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

      return matchesSearch && matchesNetwork && matchesStatus;
    });
  }, [stations, searchQuery, networkFilter, statusFilter]);

  // Network stats
  const stats = useMemo(() => {
    const online = stations.filter(s => s.status === 'online').length;
    const warning = stations.filter(s => s.status === 'warning').length;
    const triggered = stations.filter(s => s.status === 'triggered').length;
    const offline = stations.filter(s => s.status === 'offline').length;
    return { online, warning, triggered, offline, total: stations.length };
  }, [stations]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="station-modal-title"
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 id="station-modal-title" className="text-base font-bold text-slate-100 flex items-center gap-2">
                เครือข่ายสถานีตรวจวัดคลื่นไหวสะเทือน
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {filteredStations.length}/{stations.length} สถานี
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Seismic Accelerograph & Broadband Sensor Telemetry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 text-xs font-mono">
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'online' ? 'ALL' : 'online')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
              statusFilter === 'online' 
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              Online
            </span>
            <span className="font-bold text-emerald-400">{stats.online}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'triggered' ? 'ALL' : 'triggered')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
              statusFilter === 'triggered' 
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-300 ring-1 ring-rose-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/40 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Triggered
            </span>
            <span className="font-bold text-rose-400">{stats.triggered}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'warning' ? 'ALL' : 'warning')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
              statusFilter === 'warning' 
                ? 'bg-amber-950/50 border-amber-500/80 text-amber-300 ring-1 ring-amber-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              Warning
            </span>
            <span className="font-bold text-amber-400">{stats.warning}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'offline' ? 'ALL' : 'offline')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
              statusFilter === 'offline' 
                ? 'bg-slate-800 border-slate-600 text-slate-200 ring-1 ring-slate-500' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              Offline
            </span>
            <span className="font-bold text-slate-400">{stats.offline}</span>
          </button>
        </div>

        {/* Search & Network Filter Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อสถานี, รหัสสถานี (เช่น CHM, BKK), หรือจังหวัด..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-mono">
            <span className="text-slate-500 text-[11px] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> เครือข่าย:
            </span>
            {(['ALL', 'TMD_NATIONAL', 'DMR_FAULT', 'REGIONAL_NET'] as const).map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setNetworkFilter(net)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  networkFilter === net
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {net === 'ALL' ? 'ทั้งหมด' : net.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Station Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredStations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Radio className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
              <p className="text-sm">ไม่พบสถานีที่ตรงกับเงื่อนไขการค้นหา</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setNetworkFilter('ALL'); setStatusFilter('ALL'); }}
                className="mt-3 text-xs text-cyan-400 hover:underline"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredStations.map((station) => {
                const isSelected = selectedStationId === station.id;
                
                let statusBadge = {
                  bg: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300',
                  dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
                  label: 'Online'
                };
                if (station.status === 'triggered') {
                  statusBadge = {
                    bg: 'bg-rose-950/80 border-rose-500/70 text-rose-300',
                    dot: 'bg-rose-500 animate-ping',
                    label: 'Triggered P-Wave'
                  };
                } else if (station.status === 'warning') {
                  statusBadge = {
                    bg: 'bg-amber-950/60 border-amber-500/50 text-amber-300',
                    dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
                    label: 'Anomaly Warning'
                  };
                } else if (station.status === 'offline') {
                  statusBadge = {
                    bg: 'bg-slate-800/80 border-slate-700 text-slate-400',
                    dot: 'bg-slate-500',
                    label: 'Offline'
                  };
                }

                return (
                  <div
                    key={station.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-800/90 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500' 
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div>
                      {/* Top row: Code, Network, Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-800/80 tracking-wider">
                            {station.code}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {station.network}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusBadge.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                          <span>{statusBadge.label}</span>
                        </div>
                      </div>

                      {/* Station Name & Province */}
                      <h3 className="text-xs font-semibold text-slate-100 mb-1 leading-snug">
                        {station.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>จ.{station.province}</span>
                        <span className="text-slate-600">•</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {station.lat.toFixed(4)}°N, {station.lng.toFixed(4)}°E
                        </span>
                      </div>

                      {/* Metrics: PGA, SNR, Elevation */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 font-mono text-[10px] mb-3">
                        <div>
                          <span className="text-slate-500 block">PGA (Gal)</span>
                          <span className={`font-bold text-xs ${station.pga > 0.05 ? 'text-rose-400' : 'text-slate-200'}`}>
                            {station.pga.toFixed(4)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">SNR</span>
                          <span className="font-bold text-xs text-emerald-400">
                            {station.snr.toFixed(1)} dB
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Elevation</span>
                          <span className="font-bold text-xs text-slate-300">
                            {station.elevationM} m
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStation(station);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                      <span>เล็งพิกัดบนแผนที่ (Inspect on Map)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Telemetry Link: TMD Telemetry v2.4 Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationListModal;
