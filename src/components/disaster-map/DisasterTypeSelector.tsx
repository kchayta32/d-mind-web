import React from 'react';
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
  Camera
} from 'lucide-react';
import { DisasterType } from './DisasterMap';

interface DisasterTypeSelectorProps {
  selectedType: DisasterType;
  onTypeChange: (type: DisasterType) => void;
}

const disasterTypes: Array<{
  type: DisasterType;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  activeColor: string;
  available: boolean;
  isCoreThesis?: boolean;
}> = [
  {
    type: 'flood',
    label: 'น้ำท่วม & ลุ่มน้ำ',
    sublabel: 'Sentinel-1 & GISTDA',
    icon: <Waves className="w-5 h-5 text-cyan-400" />,
    activeColor: 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-cyan-900/50',
    available: true,
    isCoreThesis: true
  },
  {
    type: 'earthquake',
    label: 'แผ่นดินไหว',
    sublabel: 'USGS & TMD Seismic',
    icon: <Activity className="w-5 h-5 text-red-400" />,
    activeColor: 'bg-gradient-to-br from-red-600 to-amber-700 text-white shadow-red-900/50',
    available: true,
    isCoreThesis: true
  },
  {
    type: 'wildfire',
    label: 'ไฟป่า & จุดความร้อน',
    sublabel: 'VIIRS 375m & GISTDA',
    icon: <Flame className="w-5 h-5 text-orange-400" />,
    activeColor: 'bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-orange-900/50',
    available: true,
    isCoreThesis: true
  },
  {
    type: 'storm',
    label: 'พายุหมุน & ลมแรง',
    sublabel: 'Doppler Radar & TMD',
    icon: <Navigation className="w-5 h-5 text-indigo-400 rotate-45" />,
    activeColor: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-900/50',
    available: true,
    isCoreThesis: true
  },
  {
    type: 'airpollution',
    label: 'คุณภาพอากาศ PM2.5',
    sublabel: 'Air4Thai & AQI Real-time',
    icon: <Wind className="w-5 h-5 text-teal-400" />,
    activeColor: 'bg-gradient-to-br from-teal-600 to-purple-700 text-white shadow-teal-900/50',
    available: true,
    isCoreThesis: true
  },
  {
    type: 'drought',
    label: 'ภัยแล้ง & ความชื้นดิน',
    sublabel: 'NASA SMAP & อ่างเก็บน้ำ',
    icon: <Sun className="w-5 h-5 text-amber-400" />,
    activeColor: 'bg-gradient-to-br from-amber-600 to-orange-800 text-white shadow-amber-900/50',
    available: true,
    isCoreThesis: true
  },
  {
    type: 'bkk_road_flood',
    label: 'น้ำท่วมถนน กทม.',
    sublabel: 'BMA & Sentinel C-SAR',
    icon: <Waves className="w-5 h-5 text-sky-400" />,
    activeColor: 'bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-sky-900/50',
    available: true
  },
  {
    type: 'heavyrain',
    label: 'เรดาร์ฝน RainViewer',
    sublabel: 'Doppler Loop สด',
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    activeColor: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-900/50',
    available: true
  },
  {
    type: 'openmeteorain',
    label: 'พยากรณ์อากาศ 35+ จุด',
    sublabel: 'Open-Meteo Open Data',
    icon: <CloudDrizzle className="w-5 h-5 text-indigo-400" />,
    activeColor: 'bg-gradient-to-br from-indigo-600 to-slate-800 text-white shadow-indigo-900/50',
    available: true
  }
];

const DisasterTypeSelector: React.FC<DisasterTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/80 p-2.5 sm:p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
          <span>แผนที่ 6 ภัยพิบัติหลักตามกรอบวิทยานิพนธ์</span>
          <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-800/80 shadow-xs">
            บทที่ 1 - 3 (Open Data สด)
          </span>
        </h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 2,
        }}
        className="w-full relative px-1"
      >
        <CarouselContent className="-ml-2 flex items-center">
          {disasterTypes.map(({ type, label, sublabel, icon, activeColor, available, isCoreThesis }) => {
            const isSelected = selectedType === type;
            return (
              <CarouselItem key={type} className="pl-2 basis-auto">
                <button
                  type="button"
                  onClick={() => available && onTypeChange(type)}
                  className={`
                    relative flex flex-col items-center justify-center min-w-[124px] sm:min-w-[136px] h-[78px] px-3 py-2 rounded-xl text-xs transition-all duration-200 outline-none
                    ${isSelected 
                      ? `${activeColor} shadow-lg ring-2 ring-cyan-400/50 ring-offset-1 ring-offset-slate-900 font-bold scale-[1.02]` 
                      : 'bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                    }
                  `}
                >
                  {isCoreThesis && !isSelected && (
                    <span className="absolute top-1 right-1.5 text-[8px] bg-cyan-950/60 text-cyan-300 px-1 py-0.2 rounded font-semibold border border-cyan-800/60">
                      หลัก
                    </span>
                  )}
                  <div className={`flex items-center justify-center mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {icon}
                  </div>
                  <span className="text-center font-bold text-xs leading-snug tracking-tight text-nowrap truncate max-w-[118px]">
                    {label}
                  </span>
                  <span className={`text-[10px] mt-0.5 leading-none font-medium ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                    {sublabel}
                  </span>
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-3 h-8 w-8 bg-white dark:bg-slate-800 shadow-md border-slate-200 hover:bg-slate-50" />
        <CarouselNext className="-right-3 h-8 w-8 bg-white dark:bg-slate-800 shadow-md border-slate-200 hover:bg-slate-50" />
      </Carousel>
    </div>
  );
};

export default DisasterTypeSelector;
