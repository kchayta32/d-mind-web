import React, { useMemo } from 'react';
import { 
  Coffee, 
  Sparkles, 
  MapPin, 
  ExternalLink, 
  Bot, 
  Wifi, 
  Zap, 
  Car, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Star, 
  Navigation,
  Wind
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CafeVenue, 
  CafeCategory, 
  DayOfWeek, 
  SelectedDayFilter, 
  SelectedTimeFilter 
} from '@/types/cafeFlood';
import { checkIsOpen } from '@/data/bangkokCafesData';

export interface CafeCardProps {
  venue: CafeVenue;
  selectedDay?: SelectedDayFilter;
  selectedTime?: SelectedTimeFilter;
  isSelected?: boolean;
  onSelect?: (venue: CafeVenue) => void;
  onFocusMap?: (venue: CafeVenue) => void;
  onAskTyphoon?: (venue: CafeVenue) => void;
  onOpenDetails?: (venue: CafeVenue) => void;
}

// Convert SelectedDayFilter ('today' | 'tomorrow' | DayOfWeek) to exact DayOfWeek
export function resolveDayOfWeek(filterDay: SelectedDayFilter = 'today'): DayOfWeek {
  const dayNames: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...

  if (filterDay === 'today') {
    return dayNames[currentDayIndex];
  }
  if (filterDay === 'tomorrow') {
    return dayNames[(currentDayIndex + 1) % 7];
  }
  return filterDay;
}

// Convert SelectedTimeFilter ('live' | 'morning' | 'afternoon' | 'evening' | 'night' | HH:mm) to HH:mm
export function resolveTargetTime(filterTime: SelectedTimeFilter = 'live'): string {
  if (filterTime === 'live') {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  if (filterTime === 'morning') return '09:30';
  if (filterTime === 'afternoon') return '14:30';
  if (filterTime === 'evening') return '19:30';
  if (filterTime === 'night') return '22:30';
  return filterTime;
}

export const CafeCard: React.FC<CafeCardProps> = ({
  venue,
  selectedDay = 'today',
  selectedTime = 'live',
  isSelected = false,
  onSelect,
  onFocusMap,
  onAskTyphoon,
  onOpenDetails,
}) => {
  // Check if open for selected day & time
  const isOpen = useMemo(() => {
    const day = resolveDayOfWeek(selectedDay);
    const time = resolveTargetTime(selectedTime);
    return checkIsOpen(venue, day, time);
  }, [venue, selectedDay, selectedTime]);

  // Category Configuration
  const categoryConfig: Record<
    CafeCategory,
    { label: string; icon: React.ReactNode; badgeClass: string }
  > = {
    coffee: {
      label: '☕ Specialty Coffee',
      icon: <Coffee className="w-3.5 h-3.5" />,
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    matcha: {
      label: '🍵 Matcha & Tea',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    bar: {
      label: '🍸 Bar & Speakeasy',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    bakery: {
      label: '🍰 Bakery & Dessert',
      icon: <Sparkles className="w-3.5 h-3.5 text-rose-400" />,
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    },
    coworking: {
      label: '💻 Coworking Space',
      icon: <Zap className="w-3.5 h-3.5 text-sky-400" />,
      badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    },
    pet: {
      label: '🐱 Pet Friendly',
      icon: <Sparkles className="w-3.5 h-3.5 text-orange-400" />,
      badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    },
  };

  const currentCategory = categoryConfig[venue.category] || categoryConfig.coffee;

  // Flood Safety Badge Config
  const floodSafetyBadge = useMemo(() => {
    switch (venue.floodRisk) {
      case 'safe':
        return {
          label: 'ปลอดภัยจากน้ำท่วม',
          subtext: 'Flood Safe / High Ground',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50',
          dotClass: 'bg-emerald-400',
        };
      case 'moderate':
        return {
          label: 'เฝ้าระวังน้ำขังผิวถนน',
          subtext: 'Nearby Waterlog Risk',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-950/50',
          dotClass: 'bg-amber-400',
        };
      case 'risk':
        return {
          label: 'พื้นที่เสี่ยงน้ำท่วม',
          subtext: 'Flood Risk Zone',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />,
          badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-rose-950/50',
          dotClass: 'bg-rose-400',
        };
    }
  }, [venue.floodRisk]);

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(venue);
    } else if (onSelect) {
      onSelect(venue);
    }
  };

  const openGoogleMapsDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFocusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFocusMap) {
      onFocusMap(venue);
    } else if (onSelect) {
      onSelect(venue);
    }
  };

  const handleTyphoonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAskTyphoon) {
      onAskTyphoon(venue);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md bg-white dark:bg-slate-900/85 hover:bg-slate-50/90 dark:hover:bg-slate-900/95 shadow-md hover:shadow-xl ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-amber-500/20 shadow-xl scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.008]'
      }`}
    >
      {/* Top Media & Floating Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
        <img
          src={venue.coverImage || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
          loading="lazy"
          onError={(e) => {
            // Fallback image if remote url fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          {/* Category Badge */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full text-xs shadow-md backdrop-blur-md ${currentCategory.badgeClass}`}
          >
            {currentCategory.label}
          </Badge>

          {/* Open / Closed Status Tag */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-md ${
              isOpen
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span>{isOpen ? 'เปิดให้บริการ (Open)' : 'ปิดให้บริการ (Closed)'}</span>
          </Badge>
        </div>

        {/* Flood Safety Badge (Bottom of Image) */}
        <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-between">
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border shadow-sm backdrop-blur-md ${floodSafetyBadge.badgeClass}`}
          >
            {floodSafetyBadge.icon}
            <span className="font-semibold">{floodSafetyBadge.label}</span>
          </Badge>

          <span className="bg-slate-950/80 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold border border-slate-800 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {venue.rating.toFixed(1)}
            <span className="text-slate-400 font-normal ml-0.5">{venue.priceLevel}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Venue Title & District */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
              {venue.name}
            </h3>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 shrink-0 font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700/60">
              {venue.district}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {venue.nameEn}
          </p>
        </div>

        {/* Flood Note */}
        <p className="text-xs text-slate-700 dark:text-slate-300/90 bg-amber-500/10 dark:bg-slate-950/60 border border-amber-500/20 dark:border-slate-800/80 rounded-lg p-2 leading-relaxed flex items-start gap-1.5">
          <span className="text-amber-500 shrink-0 mt-0.5">ℹ️</span>
          <span className="line-clamp-2">{venue.floodNote}</span>
        </p>

        {/* Opening Hours & Schedule */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="truncate">{venue.openingHoursText}</span>
        </div>

        {/* Amenities Icons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span
            title={venue.hasWifi ? 'มีอินเทอร์เน็ต Wi-Fi ความเร็วสูง' : 'ไม่มี Wi-Fi'}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md ${
              venue.hasWifi
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40 font-medium'
                : 'text-slate-400 bg-slate-100 dark:bg-slate-800/30 opacity-60'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span>Wi-Fi</span>
          </span>

          <span
            title={venue.hasPlugs ? 'มีปลั๊กไฟสำหรับทำงาน' : 'ไม่มีปลั๊กไฟ'}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md ${
              venue.hasPlugs
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-medium'
                : 'text-slate-400 bg-slate-100 dark:bg-slate-800/30 opacity-60'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>ปลั๊ก</span>
          </span>

          <span
            title={venue.indoorSeating ? 'มีที่นั่งในร่ม / ห้องแอร์' : 'ที่นั่งกลางแจ้ง'}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md ${
              venue.indoorSeating
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-medium'
                : 'text-slate-400 bg-slate-100 dark:bg-slate-800/30 opacity-60'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>ห้องแอร์</span>
          </span>

          <span
            title={venue.hasParking ? 'มีที่จอดรถ' : 'ไม่มีที่จอดรถ'}
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md ${
              venue.hasParking
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 font-medium'
                : 'text-slate-400 bg-slate-100 dark:bg-slate-800/30 opacity-60'
            }`}
          >
            <Car className="w-3 h-3" />
            <span>ที่จอด</span>
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Focus Map */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFocusClick}
            className="h-8 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 px-2 flex items-center justify-center gap-1 rounded-lg transition-all"
            title="ขยับแผนที่โฟกัสร้านนี้"
          >
            <MapPin className="w-3 h-3 text-amber-500" />
            <span>ดูบนแผนที่</span>
          </Button>

          {/* Typhoon AI Consultation */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTyphoonClick}
            className="h-8 text-[11px] font-semibold bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/80 dark:to-blue-950/80 hover:from-cyan-500/20 hover:to-blue-500/20 dark:hover:from-cyan-900 dark:hover:to-blue-900 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700/50 px-2 flex items-center justify-center gap-1 rounded-lg transition-all shadow-sm"
            title="ขอคำแนะนำและข้อมูลน้ำท่วมจาก Typhoon AI"
          >
            <Bot className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>ถาม AI</span>
          </Button>

          {/* Google Maps Directions */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openGoogleMapsDirections}
            className="h-8 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 px-2 flex items-center justify-center gap-1 rounded-lg transition-all"
            title="เปิดเส้นทางใน Google Maps"
          >
            <Navigation className="w-3 h-3 text-blue-500" />
            <span>นำทาง</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
