import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { 
  Activity, 
  CloudRain, 
  Flame, 
  Wind, 
  Sun, 
  Waves, 
  Navigation, 
  CloudDrizzle, 
  Mountain, 
  FlameKindling,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  Filter
} from 'lucide-react';
import { DisasterType } from './DisasterMap';
import { Button } from '@/components/ui/button';

interface DisasterTypeSelectorProps {
  selectedType: DisasterType;
  onTypeChange: (type: DisasterType) => void;
  onOpenTyphoonModal?: () => void;
  isFullMapMode?: boolean;
  onToggleFullMapMode?: () => void;
}

type CategoryFilter = 'all' | 'core' | 'live_radar';

const disasterTypes: Array<{
  type: DisasterType;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  activeColor: string;
  glowColor: string;
  available: boolean;
  category: 'core' | 'live_radar';
  isCoreThesis?: boolean;
}> = [
  {
    type: 'flood',
    label: 'น้ำท่วม & ลุ่มน้ำ',
    sublabel: 'Sentinel-1 & GISTDA',
    icon: <Waves className="w-4 h-4 text-cyan-400" />,
    activeColor: 'bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white',
    glowColor: 'shadow-cyan-500/30',
    available: true,
    category: 'core',
    isCoreThesis: true
  },
  {
    type: 'earthquake',
    label: 'แผ่นดินไหว',
    sublabel: 'USGS & TMD Seismic',
    icon: <Activity className="w-4 h-4 text-red-400" />,
    activeColor: 'bg-gradient-to-br from-red-600 via-rose-600 to-amber-700 text-white',
    glowColor: 'shadow-red-500/30',
    available: true,
    category: 'core',
    isCoreThesis: true
  },
  {
    type: 'wildfire',
    label: 'ไฟป่า & จุดความร้อน',
    sublabel: 'NASA FIRMS & VIIRS/MODIS',
    icon: <Flame className="w-4 h-4 text-orange-400" />,
    activeColor: 'bg-gradient-to-br from-orange-600 via-amber-600 to-red-700 text-white',
    glowColor: 'shadow-orange-500/30',
    available: true,
    category: 'core',
    isCoreThesis: true
  },
  {
    type: 'storm',
    label: 'พายุหมุน & ลมแรง',
    sublabel: 'Doppler Radar & TMD',
    icon: <Navigation className="w-4 h-4 text-indigo-400 rotate-45" />,
    activeColor: 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-800 text-white',
    glowColor: 'shadow-indigo-500/30',
    available: true,
    category: 'core',
    isCoreThesis: true
  },
  {
    type: 'airpollution',
    label: 'คุณภาพอากาศ PM2.5',
    sublabel: 'Air4Thai & AQI สด',
    icon: <Wind className="w-4 h-4 text-teal-400" />,
    activeColor: 'bg-gradient-to-br from-teal-600 via-emerald-600 to-purple-800 text-white',
    glowColor: 'shadow-teal-500/30',
    available: true,
    category: 'core',
    isCoreThesis: true
  },
  {
    type: 'drought',
    label: 'ภัยแล้ง & ความชื้นดิน',
    sublabel: 'NASA SMAP & สสน.',
    icon: <Sun className="w-4 h-4 text-amber-400" />,
    activeColor: 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 text-white',
    glowColor: 'shadow-amber-500/30',
    available: true,
    category: 'core',
    isCoreThesis: true
  },
  {
    type: 'bkk_road_flood',
    label: 'น้ำท่วมถนน กทม.',
    sublabel: 'BMA & Sentinel SAR',
    icon: <Waves className="w-4 h-4 text-sky-400" />,
    activeColor: 'bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-800 text-white',
    glowColor: 'shadow-sky-500/30',
    available: true,
    category: 'live_radar'
  },
  {
    type: 'heavyrain',
    label: 'เรดาร์ฝน RainViewer',
    sublabel: 'Doppler Loop เรียลไทม์',
    icon: <CloudRain className="w-4 h-4 text-blue-400" />,
    activeColor: 'bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 text-white',
    glowColor: 'shadow-blue-500/30',
    available: true,
    category: 'live_radar'
  },
  {
    type: 'openmeteorain',
    label: 'พยากรณ์อากาศ 35+ จุด',
    sublabel: 'Open-Meteo Open Data',
    icon: <CloudDrizzle className="w-4 h-4 text-indigo-400" />,
    activeColor: 'bg-gradient-to-br from-indigo-600 via-slate-700 to-slate-900 text-white',
    glowColor: 'shadow-indigo-500/30',
    available: true,
    category: 'live_radar'
  },
  {
    type: 'volcano',
    label: 'ภูเขาไฟปะทุ',
    sublabel: 'NASA EONET Alerts',
    icon: <FlameKindling className="w-4 h-4 text-rose-400" />,
    activeColor: 'bg-gradient-to-br from-rose-600 via-red-700 to-stone-900 text-white',
    glowColor: 'shadow-rose-500/30',
    available: true,
    category: 'live_radar'
  },
  {
    type: 'sinkhole',
    label: 'หลุมยุบ & ดินทรุด',
    sublabel: 'ธรณีวิทยา & Geo Feeds',
    icon: <Mountain className="w-4 h-4 text-stone-400" />,
    activeColor: 'bg-gradient-to-br from-stone-600 via-neutral-700 to-slate-900 text-white',
    glowColor: 'shadow-stone-500/30',
    available: true,
    category: 'live_radar'
  }
];

export const DisasterTypeSelector: React.FC<DisasterTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  onOpenTyphoonModal,
  isFullMapMode = false,
  onToggleFullMapMode
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredDisasters = disasterTypes.filter(d => {
    if (activeCategory === 'core') return d.category === 'core';
    if (activeCategory === 'live_radar') return d.category === 'live_radar';
    return true;
  });

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200/90 dark:border-slate-700/80 p-2.5 sm:p-3 w-full transition-all">
      {/* Top Header Row with Category Tabs + Typhoon AI Action + Full Map Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Left: Category Segmented Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            ทั้งหมด (11)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('core')}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'core'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>6 ภัยหลัก (วิทยานิพนธ์)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('live_radar')}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all ${
              activeCategory === 'live_radar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            เรดาร์ & กทม.
          </button>
        </div>

        {/* Right: Typhoon AI Quick Action & View Mode Toggles */}
        <div className="flex items-center gap-1.5">
          {onOpenTyphoonModal && (
            <button
              type="button"
              onClick={onOpenTyphoonModal}
              className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="เปิดการวิเคราะห์สถานการณ์อัจฉริยะด้วย Typhoon AI"
            >
              <div className="relative">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-200" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              <span>Typhoon AI วิเคราะห์ด่วน</span>
              <span className="hidden sm:inline text-[9px] bg-black/25 px-1.5 py-0.2 rounded font-mono font-medium text-cyan-200">
                v2.5
              </span>
            </button>
          )}

          {onToggleFullMapMode && (
            <button
              type="button"
              onClick={onToggleFullMapMode}
              className={`p-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1 ${
                isFullMapMode
                  ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-600/30 dark:text-blue-300 dark:border-blue-500/50'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:text-white dark:hover:bg-slate-700'
              }`}
              title={isFullMapMode ? 'กลับสู่โหมดหน้าต่างคู่ (Split Analytics)' : 'ขยายแผนที่เต็มจอ (Full Map Focus)'}
            >
              {isFullMapMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px] font-bold">
                {isFullMapMode ? 'หน้าต่างคู่' : 'แผนที่เต็มจอ'}
              </span>
            </button>
          )}
        </div>
      </div>
      
      {/* Horizontal Carousel of Disaster Types */}
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 3,
        }}
        className="w-full relative px-1"
      >
        <CarouselContent className="-ml-2 flex items-center">
          {filteredDisasters.map(({ type, label, sublabel, icon, activeColor, glowColor, available, isCoreThesis }) => {
            const isSelected = selectedType === type;
            return (
              <CarouselItem key={type} className="pl-2 basis-auto">
                <button
                  type="button"
                  onClick={() => available && onTypeChange(type)}
                  className={`
                    relative flex flex-col items-center justify-center min-w-[120px] sm:min-w-[134px] h-[72px] px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 outline-none
                    ${isSelected 
                      ? `${activeColor} shadow-lg ${glowColor} ring-2 ring-cyan-400/60 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 font-bold scale-[1.02]` 
                      : 'bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:border-slate-700/80 text-slate-800 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white hover:border-blue-300 dark:hover:border-slate-600 shadow-2xs'
                    }
                  `}
                >
                  {isCoreThesis && !isSelected && (
                    <span className="absolute top-1 right-1.5 text-[8px] bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 px-1 py-0.2 rounded font-bold border border-cyan-300 dark:border-cyan-800/60">
                      หลัก
                    </span>
                  )}
                  <div className={`flex items-center justify-center mb-0.5 ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {icon}
                  </div>
                  <span className={`text-center font-extrabold text-xs leading-tight tracking-tight text-nowrap truncate max-w-[114px] ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                    {label}
                  </span>
                  <span className={`text-[9.5px] mt-0.5 leading-none font-semibold truncate max-w-[114px] ${isSelected ? 'text-white/95' : 'text-slate-600 dark:text-slate-400'}`}>
                    {sublabel}
                  </span>
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-2.5 h-7 w-7 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md" />
        <CarouselNext className="-right-2.5 h-7 w-7 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md" />
      </Carousel>
    </div>
  );
};

export default DisasterTypeSelector;
