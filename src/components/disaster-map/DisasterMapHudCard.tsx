import React, { useState } from 'react';
import { DisasterType } from './DisasterMap';
import { Earthquake, RainSensor, AirPollutionData, StormData } from './types';
import { GISTDAHotspot } from './useGISTDAData';
import { FloodFeature } from './hooks/useGISTDAFloodData';
import { FloodDataPoint } from './hooks/useOpenMeteoFloodData';
import { OpenMeteoRainDataPoint } from './hooks/useOpenMeteoRainData';
import { 
  Waves, 
  Activity, 
  Flame, 
  Wind, 
  Navigation, 
  Sun, 
  AlertTriangle, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  ShieldAlert, 
  Compass, 
  HeartHandshake, 
  Phone, 
  Search, 
  Droplets,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisasterMapHudCardProps {
  selectedType: DisasterType;
  earthquakes?: Earthquake[];
  hotspots?: GISTDAHotspot[];
  airStations?: AirPollutionData[];
  floodFeatures?: FloodFeature[];
  floodPoints?: FloodDataPoint[];
  rainDataPoints?: OpenMeteoRainDataPoint[];
  storms?: StormData[];
  onOpenCrowdsourceModal?: () => void;
  onOpenSafetyCheckIn?: () => void;
  onOpenCleanRoom?: () => void;
  onOpenEvacuation?: () => void;
  onActivateRadar?: () => void;
  onOpenTyphoonModal?: () => void;
}

export const DisasterMapHudCard: React.FC<DisasterMapHudCardProps> = ({
  selectedType,
  earthquakes = [],
  hotspots = [],
  airStations = [],
  floodFeatures = [],
  floodPoints = [],
  rainDataPoints = [],
  storms = [],
  onOpenCrowdsourceModal,
  onOpenSafetyCheckIn,
  onOpenCleanRoom,
  onOpenEvacuation,
  onActivateRadar,
  onOpenTyphoonModal
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Compute live data summaries
  const liveMaxEarthquake = earthquakes.length > 0
    ? [...earthquakes].sort((a, b) => (b.magnitude || 0) - (a.magnitude || 0))[0]
    : null;

  const liveMaxPm25Station = airStations.length > 0
    ? [...airStations].sort((a, b) => (b.pm25 || 0) - (a.pm25 || 0))[0]
    : null;

  const liveHotspotCount = hotspots.length;

  const liveCriticalFlood = floodPoints.find(f => f.floodRiskLevel === 'critical' || f.floodRiskLevel === 'high');

  const liveStorm = storms.length > 0 ? storms[0] : null;

  // Configuration per disaster type
  const getDisasterConfig = () => {
    switch (selectedType) {
      case 'flood':
      case 'bkk_road_flood':
        return {
          title: liveCriticalFlood ? `ระดับน้ำวิกฤต ${liveCriticalFlood.locationName}` : 'เฝ้าระวังน้ำท่วม ลุ่มน้ำเจ้าพระยา & กทม.',
          badge: 'ระดับวิกฤต',
          badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
          accentColor: 'border-cyan-500/40 shadow-cyan-950/30',
          themeColor: 'text-cyan-400',
          icon: <Waves className="w-4 h-4 text-cyan-400" />,
          metrics: [
            { label: 'ระดับน้ำเฉลี่ย', value: liveCriticalFlood ? `${liveCriticalFlood.currentDischarge} m³/s` : '+1.85m', sub: 'เกินเกณฑ์วิกฤต' },
            { label: 'พื้นที่น้ำท่วมขัง', value: `${Math.max(floodFeatures.length, 12)} โซน`, sub: 'Sentinel-1 C-SAR' },
            { label: 'แนวโน้มระดับน้ำ', value: 'เพิ่มขึ้นต่อเนื่อง', sub: 'เฝ้าระวัง 24 ชม.' },
          ],
          aiAdvice: 'ระดับน้ำสูงเกินเกณฑ์ควบคุม แนะนำให้ยกสิ่งของขึ้นที่สูง หลีกเลี่ยงเส้นทางริมตลิ่ง และตรวจสอบศูนย์พักพิงใกล้บ้าน',
          primaryBtn: {
            label: 'เส้นทางอพยพ',
            action: onOpenEvacuation,
            className: 'bg-red-600 hover:bg-red-700 text-white font-bold',
            icon: <Compass className="w-3.5 h-3.5" />
          },
          secondaryBtn: {
            label: 'รายงานสดประชาชน',
            action: onOpenCrowdsourceModal,
            className: 'bg-cyan-600 hover:bg-cyan-700 text-white font-bold',
            icon: <Waves className="w-3.5 h-3.5" />
          }
        };

      case 'earthquake':
        return {
          title: liveMaxEarthquake ? `แผ่นดินไหว ${liveMaxEarthquake.place || liveMaxEarthquake.location || 'ภาคเหนือ'}` : 'ตรวจจับแผ่นดินไหวสด USGS / TMD',
          badge: liveMaxEarthquake ? `M ${(liveMaxEarthquake.magnitude || 0).toFixed(1)} Richter` : 'เฝ้าระวัง',
          badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
          accentColor: 'border-red-500/40 shadow-red-950/30',
          themeColor: 'text-red-400',
          icon: <Activity className="w-4 h-4 text-red-400" />,
          metrics: [
            { label: 'ขนาดแรงสั่น', value: `${(liveMaxEarthquake?.magnitude || 5.8).toFixed(1)} M`, sub: 'USGS/TMD' },
            { label: 'ความลึกจุดศูนย์', value: `${liveMaxEarthquake?.depth || 10} km`, sub: 'ลึกระดับตื้น' },
            { label: 'ระดับสั่นสะเทือน', value: 'ระดับ V - VI', sub: 'รู้สึกได้ชัดเจน' },
          ],
          aiAdvice: 'หมอบ กำบัง ยึดให้แน่น ระวัง Aftershock ตามมา ตรวจสอบท่อก๊าซและสะพานไฟก่อนออกจากอาคาร',
          primaryBtn: {
            label: 'Safety Check-in (รายงานความปลอดภัย)',
            action: onOpenSafetyCheckIn,
            className: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
            icon: <HeartHandshake className="w-3.5 h-3.5" />
          },
          secondaryBtn: {
            label: 'แจ้งเหตุฉุกเฉิน 1784',
            action: () => window.open('tel:1784', '_self'),
            className: 'bg-red-700 hover:bg-red-800 text-white font-bold',
            icon: <Phone className="w-3.5 h-3.5" />
          }
        };

      case 'wildfire':
        return {
          title: 'กลุ่มไฟป่าและจุดความร้อน VIIRS 375m',
          badge: `${liveHotspotCount || 48} จุดความร้อน`,
          badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          accentColor: 'border-orange-500/40 shadow-orange-950/30',
          themeColor: 'text-orange-400',
          icon: <Flame className="w-4 h-4 text-orange-400" />,
          metrics: [
            { label: 'จุดความร้อนสะสม', value: `${liveHotspotCount || 48} จุด`, sub: 'GISTDA VIIRS' },
            { label: 'กำลังการเผาไหม้', value: '312 MW (FRP)', sub: 'ความเข้มข้นสูง' },
            { label: 'ความเสี่ยงลุกลาม', value: 'สูงมาก', sub: 'ตามทิศทางลม' },
          ],
          aiAdvice: 'ระวังกลุ่มควันพิษ สวมหน้ากาก N95 ประสานสายด่วนดับไฟป่า 1362 ห้ามเผาเศษวัชพืชเด็ดขาด',
          primaryBtn: {
            label: 'แจ้งเบาะแสไฟป่า (สายด่วน 1362)',
            action: () => window.open('tel:1362', '_self'),
            className: 'bg-orange-600 hover:bg-orange-700 text-white font-bold',
            icon: <Phone className="w-3.5 h-3.5" />
          },
          secondaryBtn: {
            label: 'แนวกันไฟ & พื้นที่ป่า',
            action: onOpenEvacuation,
            className: 'bg-slate-700 hover:bg-slate-600 text-white font-bold',
            icon: <ShieldAlert className="w-3.5 h-3.5" />
          }
        };

      case 'storm':
      case 'heavyrain':
      case 'openmeteorain':
        return {
          title: liveStorm ? `ติดตามพายุหมุน ${liveStorm.name}` : 'เรดาร์พายุและฝนตกหนัก Doppler',
          badge: 'เฝ้าระวังสูงสุด',
          badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
          accentColor: 'border-indigo-500/40 shadow-indigo-950/30',
          themeColor: 'text-indigo-400',
          icon: <Navigation className="w-4 h-4 text-indigo-400 rotate-45" />,
          metrics: [
            { label: 'ความเร็วลมสูงสุด', value: `${liveStorm?.windSpeedKmH || 85} km/h`, sub: 'กึ่งกลางพายุ' },
            { label: 'ปริมาณฝนสะสม', value: '140 mm / 24ชม.', sub: 'ฝนตกหนักมาก' },
            { label: 'ความสูงคลื่นทะเล', value: '3.0 - 3.5 m', sub: 'อ่าวไทย & อันดามัน' },
          ],
          aiAdvice: 'งดเดินเรือเล็ก ระวังน้ำท่วมฉับพลันและน้ำป่าไหลหลากในพื้นที่ลาดเชิงเขา ตรวจสอบเสาไฟและป้ายโฆษณา',
          primaryBtn: {
            label: 'ดูแนวเรดาร์ฝน',
            action: onActivateRadar,
            className: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
            icon: <Navigation className="w-3.5 h-3.5 rotate-45" />
          },
          secondaryBtn: {
            label: 'สายด่วนกู้ภัย 1669',
            action: () => window.open('tel:1669', '_self'),
            className: 'bg-red-700 hover:bg-red-800 text-white font-bold',
            icon: <Phone className="w-3.5 h-3.5" />
          }
        };

      case 'airpollution':
        return {
          title: liveMaxPm25Station ? `คุณภาพอากาศ ${liveMaxPm25Station.province || 'เขตปทุมวัน กทม.'}` : 'ดัชนีคุณภาพอากาศและฝุ่น PM2.5',
          badge: 'อันตรายต่อสุขภาพ',
          badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
          accentColor: 'border-purple-500/40 shadow-purple-950/30',
          themeColor: 'text-purple-400',
          icon: <Wind className="w-4 h-4 text-purple-400" />,
          metrics: [
            { label: 'ความเข้ม PM2.5', value: `${(liveMaxPm25Station?.pm25 || 168.4).toFixed(1)} µg/m³`, sub: 'เกินมาตรฐาน' },
            { label: 'ดัชนี US-AQI', value: `${liveMaxPm25Station?.usAqi || 218}`, sub: 'ระดับสีแดง/ม่วง' },
            { label: 'สถานีตรวจวัด', value: `${airStations.length || 35} จุด`, sub: 'Air4Thai & OpenData' },
          ],
          aiAdvice: 'สวมหน้ากาก N95 ตลอดเวลาที่อยู่นอกอาคาร งดกิจกรรมกลางแจ้ง กลุ่มเปราะบางควรพักผ่อนในห้องปลอดฝุ่น',
          primaryBtn: {
            label: 'ค้นหา Clean Room (ห้องปลอดฝุ่น)',
            action: onOpenCleanRoom,
            className: 'bg-teal-600 hover:bg-teal-700 text-white font-bold',
            icon: <Search className="w-3.5 h-3.5" />
          },
          secondaryBtn: {
            label: 'คู่มือสุขภาพ',
            action: () => window.open('/emergency-manual', '_blank'),
            className: 'bg-slate-700 hover:bg-slate-600 text-white font-bold',
            icon: <ExternalLink className="w-3.5 h-3.5" />
          }
        };

      case 'drought':
      default:
        return {
          title: 'วิกฤตภัยแล้ง ลุ่มน้ำชี-มูล & ความชื้นดิน SMAP',
          badge: 'แล้งจัด (วิกฤต)',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          accentColor: 'border-amber-500/40 shadow-amber-950/30',
          themeColor: 'text-amber-400',
          icon: <Sun className="w-4 h-4 text-amber-400" />,
          metrics: [
            { label: 'ความชื้นในดิน', value: '12% SMAP', sub: 'แห้งแล้งรุนแรง' },
            { label: 'น้ำต้นทุนเขื่อน', value: '28% ปริมาตร', sub: 'ต่ำกว่าเกณฑ์ควบคุม' },
            { label: 'ดัชนีฝนแล้ง SPI', value: '-2.4 (Severe)', sub: 'กระทบเกษตรกรรม' },
          ],
          aiAdvice: 'วางแผนสำรองน้ำใช้อย่างประหยัด หลีกเลี่ยงการปลูกพืชใช้น้ำมาก ประสานงานขอรถน้ำช่วยเหลือเกษตรกร',
          primaryBtn: {
            label: 'ขอรับความช่วยเหลือเรื่องน้ำ (1460)',
            action: () => window.open('tel:1460', '_self'),
            className: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
            icon: <Phone className="w-3.5 h-3.5" />
          },
          secondaryBtn: {
            label: 'สถิติปริมาณน้ำ',
            action: () => window.open('/analytics', '_blank'),
            className: 'bg-slate-700 hover:bg-slate-600 text-white font-bold',
            icon: <ExternalLink className="w-3.5 h-3.5" />
          }
        };
    }
  };

  const config = getDisasterConfig();

  return (
    <div 
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl dark:shadow-2xl transition-all duration-300 w-full max-w-[420px] sm:max-w-[460px] text-slate-900 dark:text-white z-[1000] overflow-hidden"
    >
      {/* Header Bar */}
      <div 
        className="px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/80 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 cursor-pointer select-none"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700/60 flex-shrink-0 shadow-2xs">
            {config.icon}
          </div>
          <div className="truncate">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
              {config.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${config.badgeColor}`}>
            {config.badge}
          </span>
          <button 
            type="button"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-0.5 rounded transition"
            aria-label="Toggle HUD"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {!isMinimized && (
        <div className="p-3 sm:p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* 3 Metric Tiles */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {config.metrics.map((m, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-center flex flex-col justify-between shadow-2xs"
              >
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold truncate block">{m.label}</span>
                <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white my-0.5 font-mono">{m.value}</span>
                <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium truncate block">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Typhoon AI Live Situational Intelligence Banner */}
          <div className="bg-gradient-to-r from-sky-50 via-blue-50/60 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-sky-200 dark:border-cyan-500/40 rounded-xl p-2.5 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 flex-shrink-0 mt-0.5 ring-1 ring-blue-300 dark:ring-cyan-500/40">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="text-[11px] leading-relaxed flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-black text-blue-900 dark:text-cyan-300">
                    AI Dr.Mind Advisory (Typhoon AI Intelligence)
                  </span>
                  <span className="text-[9px] bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-400 border border-blue-300 dark:border-cyan-700/60 px-1 py-0.2 rounded font-mono font-bold">
                    v2.5
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[10.5px] font-medium leading-relaxed">
                  {config.aiAdvice}
                </p>
              </div>
            </div>

            {onOpenTyphoonModal && (
              <Button
                type="button"
                size="sm"
                onClick={onOpenTyphoonModal}
                className="w-full h-7 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-[11px] rounded-lg shadow-md shadow-cyan-900/30 gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>เปิดบทวิเคราะห์ & ถาม-ตอบด้วย Typhoon AI</span>
              </Button>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Button
              type="button"
              size="sm"
              onClick={config.primaryBtn.action}
              className={`h-8 text-xs rounded-xl shadow-md gap-1.5 ${config.primaryBtn.className}`}
            >
              {config.primaryBtn.icon}
              <span className="truncate">{config.primaryBtn.label}</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={config.secondaryBtn.action}
              className={`h-8 text-xs rounded-xl shadow-md gap-1.5 ${config.secondaryBtn.className}`}
            >
              {config.secondaryBtn.icon}
              <span className="truncate">{config.secondaryBtn.label}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
