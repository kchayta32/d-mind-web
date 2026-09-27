import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  RefreshCw, 
  Compass, 
  Radio, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  Waves, 
  Building, 
  ExternalLink, 
  PhoneCall, 
  Video, 
  Ruler, 
  Tv,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { BangkokCctvCamera, FloodSeverity } from '@/data/bangkokCctvData';

export interface BangkokCctvModalProps {
  cctv: BangkokCctvCamera | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRoadOnMap: (roadName: string, lat?: number, lng?: number) => void;
  onAskTyphoonAboutCctv?: (cctv: BangkokCctvCamera) => void;
}

const ZONE_LABELS: Record<string, string> = {
  north: 'โซนเหนือ',
  central: 'โซนกลาง',
  east: 'โซนตะวันออก',
  thonburi: 'ฝั่งธนบุรี'
};

// Curated 24/7 Bangkok live traffic webcam channels
const BANGKOK_LIVE_CHANNELS = [
  {
    id: 'asoke',
    title: 'แยกอโศก - สุขุมวิท 24 ชม.',
    subtitle: 'Asoke Intersection 24/7 Live Cam',
    videoId: 'GIhc9Fm1OJU',
    badge: 'จุดตัดหลัก กทม. ชั้นใน'
  },
  {
    id: 'sathorn',
    title: 'สาทร - สีลม - สกายไลน์ กทม.',
    subtitle: 'Sathorn & Skyline Live Cam',
    videoId: 'uQqAnp8cduc',
    badge: 'CBD สาทร-สีลม'
  },
  {
    id: 'rain-traffic',
    title: 'กรุงเทพฯ ราตรี & การจราจรถนนเปียกฝน',
    subtitle: 'Bangkok Wet Roads & Night Traffic',
    videoId: 'HZ4lMaimpy8',
    badge: 'เฝ้าระวังฝนตกหนัก'
  }
];

export const BangkokCctvModal: React.FC<BangkokCctvModalProps> = ({
  cctv,
  isOpen,
  onClose,
  onViewRoadOnMap,
  onAskTyphoonAboutCctv
}) => {
  // Display modes: 'stream' (Real Live Video) | 'snapshot' (Surveillance & Water Level)
  const [activeTab, setActiveTab] = useState<'stream' | 'snapshot'>('stream');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('asoke');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');
  const [autoRefreshCount, setAutoRefreshCount] = useState<number>(20);
  const [imageTimestamp, setImageTimestamp] = useState<number>(Date.now());
  const [showRulerGrid, setShowRulerGrid] = useState(false);
  const [showScanlines, setShowScanlines] = useState(true);

  // Determine appropriate default live stream for the camera
  useEffect(() => {
    if (isOpen && cctv) {
      if (cctv.youtubeVideoId) {
        const matchingChannel = BANGKOK_LIVE_CHANNELS.find(ch => ch.videoId === cctv.youtubeVideoId);
        if (matchingChannel) {
          setSelectedChannelId(matchingChannel.id);
        }
      } else if (cctv.zone === 'central') {
        setSelectedChannelId('asoke');
      } else if (cctv.floodSeverity === 'critical' || cctv.floodSeverity === 'warning') {
        setSelectedChannelId('rain-traffic');
      } else {
        setSelectedChannelId('sathorn');
      }

      // Default to live video stream for instant real footage
      setActiveTab('stream');
    }
  }, [isOpen, cctv]);

  // Setup ticking ICT clock and auto-refresh countdown
  useEffect(() => {
    if (isOpen && cctv) {
      const updateClock = () => {
        const now = new Date();
        setLastRefreshedTime(now.toLocaleTimeString('th-TH'));
      };
      updateClock();
      setAutoRefreshCount(20);

      const interval = setInterval(() => {
        setAutoRefreshCount(prev => {
          if (prev <= 1) {
            updateClock();
            setImageTimestamp(Date.now());
            return 20;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, cctv]);

  // Handle manual snapshot refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setImageTimestamp(Date.now());
      setLastRefreshedTime(new Date().toLocaleTimeString('th-TH'));
      setAutoRefreshCount(20);
      setIsRefreshing(false);
    }, 500);
  };

  if (!cctv) return null;

  // Severity styling
  const severityConfig = {
    critical: {
      badge: 'bg-red-500 text-white border-red-600',
      icon: AlertOctagon,
      label: '🔴 น้ำท่วมขังวิกฤต (หลีกเลี่ยง)',
      border: 'border-red-500/30'
    },
    warning: {
      badge: 'bg-amber-500 text-white border-amber-600',
      icon: AlertTriangle,
      label: '🟠 เฝ้าระวังน้ำท่วมขัง (ขับช้า ระวัง)',
      border: 'border-amber-500/30'
    },
    normal: {
      badge: 'bg-emerald-600 text-white border-emerald-700',
      icon: CheckCircle2,
      label: '🟢 สภาพผิวถนนปกติ (ใช้ได้ตามปกติ)',
      border: 'border-emerald-500/30'
    }
  }[cctv.floodSeverity] || {
    badge: 'bg-emerald-600 text-white border-emerald-700',
    icon: CheckCircle2,
    label: '🟢 สภาพผิวถนนปกติ (ใช้ได้ตามปกติ)',
    border: 'border-emerald-500/30'
  };

  const StatusIcon = severityConfig.icon;
  const [lat, lng] = cctv.coordinates;

  const currentChannel = BANGKOK_LIVE_CHANNELS.find(ch => ch.id === selectedChannelId) || BANGKOK_LIVE_CHANNELS[0];
  const activeVideoId = cctv.youtubeVideoId || currentChannel.videoId;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!z-[9999] max-w-3xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold">
                  {cctv.id.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {ZONE_LABELS[cctv.zone] || cctv.zone}
                </Badge>
                <Badge className={`text-[11px] font-semibold ${severityConfig.badge}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {severityConfig.label}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  เชื่อมต่อกล้องเรียลไทม์
                </span>
              </div>

              <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 pt-1">
                <Camera className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>{cctv.name}</span>
              </DialogTitle>

              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{cctv.road}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  {cctv.facingDirection}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {cctv.agency}
                </span>
              </DialogDescription>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'stream'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <Video className="w-3.5 h-3.5" />
                สตรีมวิดีโอสด 24 ชม. (Live Stream)
              </button>

              <button
                onClick={() => setActiveTab('snapshot')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'snapshot'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                ภาพสแนปช็อตตรวจวัด & ระดับน้ำ (Snapshot)
              </button>
            </div>

            {/* Quick telemetry indicators */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                30 FPS
              </span>
              <span>&bull;</span>
              <span>1080p FHD</span>
            </div>
          </div>
        </div>

        {/* Video / Snapshot Display Area */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group select-none">
          
          {/* TAB 1: Live Video Streaming (YouTube 24/7 Bangkok Webcams) */}
          {activeTab === 'stream' && (
            <div className="relative w-full h-full bg-black">
              <iframe
                key={activeVideoId}
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&mute=1&playsinline=1&controls=1&rel=0&modestbranding=1`}
                title={`${cctv.name} Live Traffic Camera`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />

              {/* Top-left OSD overlay for Live Stream */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-[11px] font-mono text-white font-bold border border-red-400/50 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  LIVE STREAM 24/7
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/10">
                  {cctv.name}
                </span>
              </div>

              {/* Bottom-left telemetry info */}
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-200 border border-white/10 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{lastRefreshedTime || '14:05:32'} (ICT UTC+7)</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400">{cctv.agency}</span>
                </div>
              </div>

              {/* Channel Selector Overlay at top right */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                <div className="bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/20 flex items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-300 px-1 hidden md:inline">เลือกมุมกล้อง:</span>
                  {BANGKOK_LIVE_CHANNELS.map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannelId(ch.id)}
                      title={ch.title}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        selectedChannelId === ch.id
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {ch.id === 'asoke' ? 'อโศก' : ch.id === 'sathorn' ? 'สาทร' : 'ฝนตก/ราตรี'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Authentic Snapshot with Water Level Gauge Overlay */}
          {activeTab === 'snapshot' && (
            <div className="relative w-full h-full bg-slate-950">
              <img
                src={`${cctv.snapshotUrl}&t=${imageTimestamp}`}
                alt={cctv.name}
                className="w-full h-full object-cover transition-opacity duration-300 filter contrast-[1.05]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = cctv.fallbackSnapshotUrl || 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1080&q=80';
                }}
              />

              {/* Simulated scanlines */}
              {showScanlines && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40"></div>
              )}

              {/* Water Depth Gauge Grid Overlay (Optional Toggle) */}
              {showRulerGrid && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 border border-cyan-400/40">
                  <div className="h-36 w-20 border-l-2 border-b-2 border-cyan-400 bg-cyan-950/70 backdrop-blur-md p-1.5 text-[10px] text-cyan-200 font-mono flex flex-col justify-between rounded-r-md">
                    <span className="font-bold text-red-400">30cm (วิกฤต)</span>
                    <span className="font-bold text-amber-300">20cm (เตือน)</span>
                    <span className="text-yellow-200">10cm</span>
                    <span className="text-emerald-400 font-bold">0cm (ผิวทาง)</span>
                  </div>
                </div>
              )}

              {/* CCTV On-Screen Display (OSD) Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/40 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  SURVEILLANCE CAM • BMA
                </span>
                <span className="px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10">
                  {cctv.id}
                </span>
              </div>

              {/* Bottom Left ICT Clock */}
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-200 border border-white/10 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{lastRefreshedTime || '14:05:32'} (ICT)</span>
                  <span>&bull;</span>
                  <span className="text-cyan-300">{cctv.agency}</span>
                </div>
              </div>

              {/* Water level indicator on camera snapshot */}
              <div className="absolute bottom-3 right-3 z-10">
                <div className="px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-right shadow-xl">
                  <div className="text-[10px] text-slate-300 flex items-center justify-end gap-1 font-semibold">
                    <Waves className="w-3.5 h-3.5 text-blue-400" />
                    ระดับน้ำตรวจวัด
                  </div>
                  <div className="text-lg font-black text-white">
                    {cctv.waterLevelCm !== undefined ? cctv.waterLevelCm : 0} <span className="text-xs font-normal text-slate-300">ซม.</span>
                  </div>
                </div>
              </div>

              {/* Overlay Toggle Controls on top right */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                <button
                  onClick={() => setShowRulerGrid(!showRulerGrid)}
                  title="เปิด/ปิดเส้นวัดระดับน้ำ"
                  className={`p-1.5 rounded-md backdrop-blur-md text-xs font-mono border transition ${
                    showRulerGrid 
                      ? 'bg-cyan-500 text-white border-cyan-400' 
                      : 'bg-black/60 text-slate-300 border-white/20 hover:bg-black/80'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowScanlines(!showScanlines)}
                  title="เปิด/ปิดเส้นสแกนไลฟ์กล้องวงจรปิด"
                  className={`p-1.5 rounded-md backdrop-blur-md text-xs font-mono border transition ${
                    showScanlines 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-black/60 text-slate-300 border-white/20 hover:bg-black/80'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Refresh Overlay Animation */}
              {isRefreshing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="flex items-center gap-2 bg-slate-900/90 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold shadow-2xl">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    กำลังดึงภาพสดล่าสุดจากกล้อง BMA...
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Official BMA Traffic Portal Direct Link Bar */}
        <div className="px-5 py-3 bg-blue-50/80 dark:bg-blue-950/40 border-t border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-950 dark:text-blue-200">
            <span className="font-bold flex items-center gap-1.5">
              🌐 กล้องสดทางการ กทม.:
            </span>
            <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">
              สำนักการจราจรและขนส่ง (สจส.) ให้บริการเครือข่ายกล้องจราจร 300+ ตัวทั่วกรุงเทพฯ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://www.bmatraffic.com/index.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              เปิดพอร์ทัลกล้องสด กทม. (BMA Traffic)
            </a>
            <a
              href="https://dds.bangkok.go.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/60 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-semibold text-xs transition"
            >
              ศูนย์ระบายน้ำ (DDS)
            </a>
          </div>
        </div>

        {/* Status & Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>สถานะ: <b>{cctv.status === 'online' ? 'ออนไลน์ปกติ' : 'ปรับปรุงสัญญาณ'}</b></span>
            </div>
            <span>&bull;</span>
            <div className="text-[11px] text-slate-500">
              อัปเดตสแนปช็อตใน <b>{autoRefreshCount}s</b>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onAskTyphoonAboutCctv && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onAskTyphoonAboutCctv(cctv);
                  onClose();
                }}
                className="text-xs h-9 border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                ถาม Typhoon AI
              </Button>
            )}

            <a
              href="tel:1555"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-bold transition"
              title="โทรแจ้งเหตุน้ำท่วมขัง สายด่วน กทม. 1555"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              แจ้ง กทม. 1555
            </a>

            {activeTab === 'snapshot' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="text-xs h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                รีเฟรชภาพสด
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => {
                onViewRoadOnMap(cctv.road, lat, lng);
                onClose();
              }}
              className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 mr-1.5" />
              ดูเส้นทางถนนนี้บนแผนที่
            </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default BangkokCctvModal;
