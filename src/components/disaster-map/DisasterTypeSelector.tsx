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
  FlameKindling
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
}> = [
  {
    type: 'earthquake',
    label: 'แผ่นดินไหว',
    sublabel: 'USGS / EMSC',
    icon: <Activity className="w-5 h-5" />,
    activeColor: 'bg-orange-600 hover:bg-orange-700 text-white',
    available: true
  },
  {
    type: 'storm',
    label: 'พายุหมุนเขตร้อน',
    sublabel: 'NASA / GDACS',
    icon: <Navigation className="w-5 h-5 rotate-45" />,
    activeColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    available: true
  },
  {
    type: 'heavyrain',
    label: 'เรดาร์ฝน RainViewer',
    sublabel: 'Radar & Satellite',
    icon: <CloudRain className="w-5 h-5" />,
    activeColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    available: true
  },
  {
    type: 'openmeteorain',
    label: 'พยากรณ์สภาพอากาศ',
    sublabel: 'Open-Meteo 35+ จุด',
    icon: <CloudDrizzle className="w-5 h-5" />,
    activeColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    available: true
  },
  {
    type: 'wildfire',
    label: 'ไฟป่า & จุดความร้อน',
    sublabel: 'NASA / GISTDA',
    icon: <Flame className="w-5 h-5" />,
    activeColor: 'bg-red-600 hover:bg-red-700 text-white',
    available: true
  },
  {
    type: 'airpollution',
    label: 'คุณภาพอากาศ PM2.5',
    sublabel: 'Open-Meteo Air',
    icon: <Wind className="w-5 h-5" />,
    activeColor: 'bg-teal-600 hover:bg-teal-700 text-white',
    available: true
  },
  {
    type: 'flood',
    label: 'น้ำท่วม & ลุ่มน้ำ',
    sublabel: 'GloFAS / GDACS',
    icon: <Waves className="w-5 h-5" />,
    activeColor: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    available: true
  },
  {
    type: 'drought',
    label: 'ภัยแล้ง & ความชื้นดิน',
    sublabel: 'Soil Moisture API',
    icon: <Sun className="w-5 h-5" />,
    activeColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    available: true
  },
  {
    type: 'volcano',
    label: 'ภูเขาไฟ & สึนามิ',
    sublabel: 'NASA EONET',
    icon: <FlameKindling className="w-5 h-5" />,
    activeColor: 'bg-rose-600 hover:bg-rose-700 text-white',
    available: true
  },
  {
    type: 'sinkhole',
    label: 'แผ่นดินยุบ / ดินทรุด',
    sublabel: 'Geo Incidents',
    icon: <Mountain className="w-5 h-5" />,
    activeColor: 'bg-stone-600 hover:bg-stone-700 text-white',
    available: true
  }
];

const DisasterTypeSelector: React.FC<DisasterTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-2.5 sm:p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>หมวดหมู่ภัยพิบัติ & สภาพแวดล้อม</span>
          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800">
            Open Data Real-time
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
          {disasterTypes.map(({ type, label, sublabel, icon, activeColor, available }) => {
            const isSelected = selectedType === type;
            return (
              <CarouselItem key={type} className="pl-2 basis-auto">
                <button
                  type="button"
                  onClick={() => available && onTypeChange(type)}
                  className={`
                    flex flex-col items-center justify-center min-w-[120px] sm:min-w-[130px] h-[78px] px-3 py-2 rounded-xl text-xs transition-all duration-200 outline-none
                    ${isSelected 
                      ? `${activeColor} shadow-md ring-2 ring-blue-500/50 ring-offset-1 font-bold scale-[1.02]` 
                      : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:shadow-sm'
                    }
                  `}
                >
                  <div className={`flex items-center justify-center mb-1 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {icon}
                  </div>
                  <span className="text-center font-bold text-xs leading-snug tracking-tight text-nowrap truncate max-w-[115px]">
                    {label}
                  </span>
                  <span className={`text-[10px] mt-0.5 leading-none font-medium ${isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
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
