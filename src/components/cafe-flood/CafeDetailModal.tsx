import React, { useMemo, useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Globe, 
  Instagram, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Navigation, 
  Bot, 
  Star, 
  Wifi, 
  Zap, 
  Wind, 
  Car, 
  Droplets, 
  Compass, 
  Sparkles,
  ExternalLink,
  Waves
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CafeVenue, 
  CafeCategory, 
  DayOfWeek, 
  SelectedDayFilter, 
  SelectedTimeFilter 
} from '@/types/cafeFlood';
import { BANGKOK_ROAD_SEGMENTS } from '@/data/bangkokRoadFloodData';
import { checkIsOpen, calculateFloodSafetyScore } from '@/data/bangkokCafesData';
import { resolveDayOfWeek, resolveTargetTime } from './CafeCard';
import { getQuickTyphoonRecommendation } from '@/services/typhoonCafeService';

export interface CafeDetailModalProps {
  venue: CafeVenue | null;
  isOpen: boolean;
  onClose: () => void;
  selectedDay?: SelectedDayFilter;
  selectedTime?: SelectedTimeFilter;
  onAskTyphoon?: (venue: CafeVenue) => void;
  onFocusMap?: (venue: CafeVenue) => void;
}

const DAY_LABELS: Record<DayOfWeek, { th: string; en: string }> = {
  mon: { th: 'วันจันทร์', en: 'Monday' },
  tue: { th: 'วันอังคาร', en: 'Tuesday' },
  wed: { th: 'วันพุธ', en: 'Wednesday' },
  thu: { th: 'วันพฤหัสบดี', en: 'Thursday' },
  fri: { th: 'วันศุกร์', en: 'Friday' },
  sat: { th: 'วันเสาร์', en: 'Saturday' },
  sun: { th: 'วันอาทิตย์', en: 'Sunday' },
};

const DAY_ORDER: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const CafeDetailModal: React.FC<CafeDetailModalProps> = ({
  venue,
  isOpen,
  onClose,
  selectedDay = 'today',
  selectedTime = 'live',
  onAskTyphoon,
  onFocusMap,
}) => {
  const [typhoonOpinion, setTyphoonOpinion] = useState<string>('');
  const [loadingOpinion, setLoadingOpinion] = useState<boolean>(false);

  // Active target day of week
  const activeDayOfWeek = useMemo(() => resolveDayOfWeek(selectedDay), [selectedDay]);
  const activeTargetTime = useMemo(() => resolveTargetTime(selectedTime), [selectedTime]);

  // Is venue currently open
  const isOpenNow = useMemo(() => {
    if (!venue) return false;
    return checkIsOpen(venue, activeDayOfWeek, activeTargetTime);
  }, [venue, activeDayOfWeek, activeTargetTime]);

  // Calculate nearest flooded road proximity from real BANGKOK_ROAD_SEGMENTS
  const roadProximity = useMemo(() => {
    if (!venue) return null;

    let nearestRoad = null;
    let minDistanceKm = 999;
    let nearbyFloodedCount = 0;

    for (const road of BANGKOK_ROAD_SEGMENTS) {
      if (road.status === 'normal') continue;

      for (const [rLat, rLng] of road.coordinates) {
        // Approximate distance calculation in km for Bangkok latitude (~13.7 deg)
        const dLat = (rLat - venue.lat) * 111.0;
        const dLng = (rLng - venue.lng) * 111.0 * Math.cos((venue.lat * Math.PI) / 180.0);
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        if (dist <= 3.0) {
          nearbyFloodedCount++;
        }
        if (dist < minDistanceKm) {
          minDistanceKm = dist;
          nearestRoad = road;
        }
      }
    }

    const safetyEval = calculateFloodSafetyScore(venue, nearbyFloodedCount);

    return {
      nearestRoad,
      minDistanceKm: minDistanceKm < 999 ? minDistanceKm : null,
      nearbyFloodedCount,
      safetyEval,
    };
  }, [venue]);

  // Fetch quick Typhoon opinion when venue changes
  useEffect(() => {
    if (!venue || !isOpen) return;

    let isMounted = true;
    setLoadingOpinion(true);
    setTyphoonOpinion('');

    getQuickTyphoonRecommendation(
      venue.category,
      venue.zone,
      venue.floodRisk !== 'safe' || (roadProximity?.nearbyFloodedCount || 0) > 0
    )
      .then((res) => {
        if (isMounted) {
          setTyphoonOpinion(res);
          setLoadingOpinion(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTyphoonOpinion(
            `☕ **${venue.name}**: เป็นหนึ่งในหมุดหมายยอดนิยมย่าน ${venue.district} ตรวจสอบให้มั่นใจว่าเส้นทางรอบตัวร้านแห้งสนิทก่อนเดินทางครับ!`
          );
          setLoadingOpinion(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [venue?.id, isOpen, venue?.category, venue?.zone, venue?.floodRisk, roadProximity?.nearbyFloodedCount]);

  if (!venue) return null;

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const floodStatusMap = {
    safe: {
      label: 'ปลอดภัยจากน้ำท่วม (Flood Safe / High Ground)',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    moderate: {
      label: 'เฝ้าระวังน้ำขังผิวถนน (Nearby Waterlog Risk)',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    risk: {
      label: 'พื้นที่เสี่ยงน้ำท่วม (Flood Risk Zone)',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
    },
  };

  const statusInfo = floodStatusMap[venue.floodRisk];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-slate-800 bg-slate-950 text-slate-100 shadow-2xl rounded-2xl scrollbar-thin scrollbar-thumb-slate-800">
        <DialogHeader className="sr-only">
          <DialogTitle>{venue.name}</DialogTitle>
          <DialogDescription>{venue.nameEn} - รายละเอียดร้านและข้อมูลความปลอดภัยจากน้ำท่วม</DialogDescription>
        </DialogHeader>

        {/* Hero Image Banner */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={venue.coverImage || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'}
            alt={venue.name}
            className="w-full h-full object-cover filter brightness-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <Badge
              variant="outline"
              className="bg-slate-900/80 text-amber-300 border-amber-500/40 text-xs px-3 py-1 font-semibold backdrop-blur-md"
            >
              {venue.category.toUpperCase()} • {venue.zone.toUpperCase()}
            </Badge>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Floating Info on Image */}
          <div className="absolute bottom-4 inset-x-4 z-10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {venue.rating.toFixed(1)} ({venue.priceLevel})
              </span>
              <span className="text-xs text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700/60 backdrop-blur-md">
                📍 {venue.district}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {venue.name}
            </h2>
            <p className="text-sm text-slate-300 font-medium">
              {venue.nameEn}
            </p>
          </div>
        </div>

        {/* Modal Content Sections */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Section 1: Flood Safety Assessment */}
          <div className={`p-4 rounded-xl border ${statusInfo.badgeBg} space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusInfo.icon}
                <span className="font-bold text-sm sm:text-base">
                  {statusInfo.label}
                </span>
              </div>
              <Badge variant="outline" className="bg-slate-950/80 text-xs font-mono font-bold text-slate-200 border-slate-700">
                Safety Score: {roadProximity?.safetyEval?.score || 85}/100
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {venue.floodNote}
            </p>

            {roadProximity?.nearestRoad && (
              <div className="pt-2 mt-2 border-t border-slate-700/40 text-xs text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ถนนเสี่ยงน้ำท่วมใกล้เคียง: <strong>{roadProximity.nearestRoad.name}</strong></span>
                </span>
                <span className="text-slate-400">
                  {roadProximity.minDistanceKm !== null ? `~${roadProximity.minDistanceKm.toFixed(1)} กม.` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Typhoon AI Opinion Card */}
          <div className="p-4 rounded-xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>ความเห็นจาก Typhoon AI บาริสต้า</span>
                <span className="text-[10px] text-cyan-400/80 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-700/50">
                  typhoon-v2.5
                </span>
              </div>
              {onAskTyphoon && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAskTyphoon(venue)}
                  className="h-7 text-xs bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-200 border-cyan-700/50 px-2.5 rounded-lg"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                  คุยต่อ
                </Button>
              )}
            </div>

            {loadingOpinion ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>กำลังขอความคิดเห็นและวิเคราะห์น้ำท่วมจาก Typhoon AI...</span>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {typhoonOpinion}
              </div>
            )}
          </div>

          {/* Section 3: Open Status & Full Weekly Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-200">
                  ตารางเวลาเปิด-ปิดประจำสัปดาห์ (Weekly Schedule)
                </h4>
              </div>
              <Badge
                variant="outline"
                className={`text-xs font-semibold px-2.5 py-0.5 ${
                  isOpenNow
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                }`}
              >
                {isOpenNow ? '🟢 เปิดให้บริการตอนนี้' : '🔴 ปิดทำการตอนนี้'}
              </Badge>
            </div>

            {/* Schedule Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/50">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-slate-800/60">
                  {DAY_ORDER.map((dayKey) => {
                    const isSelectedDay = dayKey === activeDayOfWeek;
                    const slots = venue.schedule?.[dayKey] || [];
                    const isClosed = slots.length === 0 || slots.every((s) => s.isClosed);

                    let hoursDisplay = 'ปิดทำการ (Closed)';
                    if (!isClosed) {
                      hoursDisplay = slots.map((s) => `${s.open} - ${s.close}`).join(', ');
                    }

                    return (
                      <tr
                        key={dayKey}
                        className={`transition-colors ${
                          isSelectedDay
                            ? 'bg-amber-500/15 font-semibold text-amber-200'
                            : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3 w-1/3 flex items-center gap-1.5">
                          {isSelectedDay && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                          <span>{DAY_LABELS[dayKey].th}</span>
                          <span className="text-[10px] text-slate-400">({DAY_LABELS[dayKey].en.slice(0, 3)})</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {isClosed ? (
                            <span className="text-rose-400/90 font-medium">ปิดทำการ</span>
                          ) : (
                            <span className={isSelectedDay ? 'text-amber-300' : 'text-slate-200'}>
                              {hoursDisplay}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Amenities & Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-200">สิ่งอำนวยความสะดวก</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                  venue.hasWifi
                    ? 'border-sky-500/30 bg-sky-950/30 text-sky-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500'
                }`}
              >
                <Wifi className="w-4 h-4 text-sky-400" />
                <span>{venue.hasWifi ? 'มี Wi-Fi ฟรี' : 'ไม่มี Wi-Fi'}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                  venue.hasPlugs
                    ? 'border-amber-500/30 bg-amber-950/30 text-amber-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{venue.hasPlugs ? 'มีปลั๊กไฟ' : 'ไม่มีปลั๊กไฟ'}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                  venue.indoorSeating
                    ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500'
                }`}
              >
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>{venue.indoorSeating ? 'มีที่นั่งในร่ม/แอร์' : 'กลางแจ้ง'}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                  venue.hasParking
                    ? 'border-purple-500/30 bg-purple-950/30 text-purple-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500'
                }`}
              >
                <Car className="w-4 h-4 text-purple-400" />
                <span>{venue.hasParking ? 'มีที่จอดรถ' : 'ไม่มีที่จอดรถ'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Address & Contact Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-sm font-bold text-slate-200">ข้อมูลติดต่อและที่ตั้ง</h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{venue.address}</span>
              </div>

              {venue.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`tel:${venue.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-emerald-400 hover:underline font-mono"
                  >
                    {venue.phone}
                  </a>
                </div>
              )}

              {venue.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-rose-400 shrink-0" />
                  <a
                    href={`https://instagram.com/${venue.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-300 hover:underline flex items-center gap-1"
                  >
                    <span>{venue.instagram}</span>
                    <ExternalLink className="w-3 h-3 text-rose-400" />
                  </a>
                </div>
              )}

              {venue.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{venue.website}</span>
                    <ExternalLink className="w-3 h-3 text-sky-400 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {venue.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons in Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-slate-800">
            <Button
              type="button"
              onClick={openGoogleMaps}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold h-10 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            >
              <Navigation className="w-4 h-4" />
              <span>เปิดเส้นทางใน Google Maps</span>
            </Button>

            {onFocusMap && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onFocusMap(venue);
                  onClose();
                }}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 h-10 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>โฟกัสบนแผนที่</span>
              </Button>
            )}

            {onAskTyphoon && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onAskTyphoon(venue);
                  onClose();
                }}
                className="w-full sm:w-auto bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-200 border-cyan-700/50 h-10 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>ถาม Typhoon AI</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CafeDetailModal;
