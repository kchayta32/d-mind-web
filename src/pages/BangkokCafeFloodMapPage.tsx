import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import { CafeFloodMap } from '@/components/cafe-flood/CafeFloodMap';
import { CafeCard, resolveDayOfWeek, resolveTargetTime } from '@/components/cafe-flood/CafeCard';
import { CafeDetailModal } from '@/components/cafe-flood/CafeDetailModal';
import { CafeTyphoonChat } from '@/components/cafe-flood/CafeTyphoonChat';
import { 
  BANGKOK_CAFES_DATA, 
  checkIsOpen 
} from '@/data/bangkokCafesData';
import { fetchOverpassCafes } from '@/services/cafeOverpassService';
import { 
  CafeVenue, 
  CafeCategory, 
  Category, 
  VenueZone, 
  BangkokZone, 
  SelectedDayFilter, 
  SelectedTimeFilter, 
  FilterState, 
  DayOfWeek 
} from '@/types/cafeFlood';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Coffee, 
  Sparkles, 
  Search, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Bot, 
  Waves, 
  Clock, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  CloudRain, 
  Zap, 
  Compass, 
  ExternalLink,
  List,
  Map as MapIcon,
  ChevronRight,
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';

export const BangkokCafeFloodMapPage: React.FC = () => {
  // ----------------------------------------------------
  // Filter States
  // ----------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedZone, setSelectedZone] = useState<BangkokZone>('all');
  const [selectedDay, setSelectedDay] = useState<SelectedDayFilter>('today');
  const [selectedTime, setSelectedTime] = useState<SelectedTimeFilter>('live');
  const [customTimeInput, setCustomTimeInput] = useState<string>('14:00');
  const [isCustomTimeActive, setIsCustomTimeActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toggles
  const [floodSafeOnly, setFloodSafeOnly] = useState<boolean>(false);
  const [workFriendlyOnly, setWorkFriendlyOnly] = useState<boolean>(false);
  const [enableOverpassScraping, setEnableOverpassScraping] = useState<boolean>(false);
  const [showFloodedRoads, setShowFloodedRoads] = useState<boolean>(true);

  // Overpass scraping data state
  const [allVenues, setAllVenues] = useState<CafeVenue[]>(BANGKOK_CAFES_DATA);
  const [isScrapingLoading, setIsScrapingLoading] = useState<boolean>(false);

  // Active / Selected Entities
  const [selectedVenue, setSelectedVenue] = useState<CafeVenue | null>(null);
  const [focusedVenue, setFocusedVenue] = useState<CafeVenue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Desktop / Mobile UI Tab View States
  // Desktop Sidebar tab: 'list' | 'chat'
  const [desktopSidebarTab, setDesktopSidebarTab] = useState<'list' | 'chat'>('list');
  // Mobile active view: 'map' | 'list' | 'chat'
  const [mobileView, setMobileView] = useState<'map' | 'list' | 'chat'>('map');

  // Initial prompt for Typhoon chat when triggered from card/modal
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  // ----------------------------------------------------
  // Live Overpass Web Scraping Effect
  // ----------------------------------------------------
  useEffect(() => {
    if (!enableOverpassScraping) {
      setAllVenues(BANGKOK_CAFES_DATA);
      return;
    }

    let isMounted = true;
    setIsScrapingLoading(true);

    fetchOverpassCafes(searchQuery, selectedCategory)
      .then((scrapedData) => {
        if (isMounted) {
          setAllVenues(scrapedData);
          setIsScrapingLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[CafePage] Overpass live scraping fallback:', err);
        if (isMounted) {
          setAllVenues(BANGKOK_CAFES_DATA);
          setIsScrapingLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [enableOverpassScraping, selectedCategory, searchQuery]);

  // ----------------------------------------------------
  // Filtering & Sorting Venues
  // ----------------------------------------------------
  const activeDayOfWeek = useMemo(() => resolveDayOfWeek(selectedDay), [selectedDay]);
  const activeTimeTarget = useMemo(() => {
    if (isCustomTimeActive) {
      return customTimeInput;
    }
    return resolveTargetTime(selectedTime);
  }, [isCustomTimeActive, customTimeInput, selectedTime]);

  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      // Category filter
      if (selectedCategory !== 'all' && venue.category !== selectedCategory) {
        return false;
      }

      // Zone filter
      if (selectedZone !== 'all' && venue.zone !== selectedZone) {
        return false;
      }

      // Flood safe only filter
      if (floodSafeOnly && venue.floodRisk !== 'safe') {
        return false;
      }

      // Work friendly filter (wifi + plugs)
      if (workFriendlyOnly && (!venue.hasWifi || !venue.hasPlugs)) {
        return false;
      }

      // Search query filter (name, en name, district, address, tags)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesNameEn = venue.nameEn.toLowerCase().includes(q);
        const matchesDistrict = venue.district.toLowerCase().includes(q);
        const matchesTags = venue.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAddress = venue.address.toLowerCase().includes(q);

        if (!matchesName && !matchesNameEn && !matchesDistrict && !matchesTags && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [
    allVenues,
    selectedCategory,
    selectedZone,
    floodSafeOnly,
    workFriendlyOnly,
    searchQuery,
  ]);

  // Stats Counters
  const stats = useMemo(() => {
    const total = filteredVenues.length;
    const safeCount = filteredVenues.filter((v) => v.floodRisk === 'safe').length;
    const moderateCount = filteredVenues.filter((v) => v.floodRisk === 'moderate').length;
    const riskCount = filteredVenues.filter((v) => v.floodRisk === 'risk').length;
    const currentlyOpenCount = filteredVenues.filter((v) =>
      checkIsOpen(v, activeDayOfWeek, activeTimeTarget)
    ).length;

    return { total, safeCount, moderateCount, riskCount, currentlyOpenCount };
  }, [filteredVenues, activeDayOfWeek, activeTimeTarget]);

  // Construct FilterState object for Typhoon AI
  const currentFilterState: FilterState = useMemo(() => {
    return {
      category: selectedCategory,
      zone: selectedZone,
      selectedDay,
      selectedTime: isCustomTimeActive ? customTimeInput : selectedTime,
      floodSafeOnly,
      searchQuery,
      workFriendlyOnly,
    };
  }, [
    selectedCategory,
    selectedZone,
    selectedDay,
    isCustomTimeActive,
    customTimeInput,
    selectedTime,
    floodSafeOnly,
    searchQuery,
    workFriendlyOnly,
  ]);

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  const handleOpenDetailModal = useCallback((venue: CafeVenue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  }, []);

  const handleFocusOnMap = useCallback((venue: CafeVenue) => {
    setSelectedVenue(venue);
    setFocusedVenue(venue);
    // On mobile, switch to map view
    setMobileView('map');
  }, []);

  const handleAskTyphoon = useCallback((venue: CafeVenue) => {
    setSelectedVenue(venue);
    setChatInitialPrompt(
      `ขอคำแนะนำแบบเจาะลึกเกี่ยวกับร้าน "${venue.name}" (${venue.district}) หน่อยครับ ทั้งความปลอดภัยจากน้ำท่วม เมนูแนะนำ และบรรยากาศการนั่งทำงาน`
    );
    setDesktopSidebarTab('chat');
    setMobileView('chat');
  }, []);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedZone('all');
    setSelectedDay('today');
    setSelectedTime('live');
    setIsCustomTimeActive(false);
    setSearchQuery('');
    setFloodSafeOnly(false);
    setWorkFriendlyOnly(false);
    setEnableOverpassScraping(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 pt-20 pb-12 space-y-4">
        {/* ==================================================== */}
        {/* 1. HERO / HEADER BANNER */}
        {/* ==================================================== */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 dark:border-slate-800 bg-gradient-to-br from-amber-50/80 via-white to-amber-100/50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-5 sm:p-7 shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            {/* Top Status & Weather Warning Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 text-xs px-3 py-1 font-semibold flex items-center gap-1.5 backdrop-blur-md"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>DMind Lifestyle & Flood Intelligence</span>
              </Badge>

              <Badge
                variant="outline"
                className="bg-cyan-50 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/50 text-xs px-3 py-1 font-semibold flex items-center gap-1.5 backdrop-blur-md animate-pulse"
              >
                <CloudRain className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>🌧️ สัปดาห์มรสุมฝนตกหนัก เฝ้าระวังพิเศษ กทม.</span>
              </Badge>

              <Badge
                variant="outline"
                className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1 font-mono"
              >
                Typhoon AI v2.5 Online
              </Badge>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 dark:from-amber-200 dark:via-white dark:to-amber-400 tracking-tight">
                ☕ Bangkok Cafe & Bar Flood Radar
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                เรดาร์ค้นหาร้านกาแฟ มัทฉะ บาร์ และที่นั่งทำงาน ที่เปิดให้บริการ ปลอดภัยจากน้ำท่วม กทม. ชั้นใน นอก ฝั่งธนฯ และปริมณฑล พร้อมระบบวิเคราะห์ความเสี่ยงเส้นทางและผู้ช่วย AI บาริสต้า
              </p>
            </div>

            {/* Live Stats Counters Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-xs">
                <span>แสดง:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-bold">{stats.total}</strong>
                <span>แห่ง</span>
              </span>

              <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ปลอดภัย:</span>
                <strong className="font-bold">{stats.safeCount}</strong>
              </span>

              <span className="bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center gap-1.5 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>เฝ้าระวัง:</span>
                <strong className="font-bold">{stats.moderateCount}</strong>
              </span>

              <span className="bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 px-3 py-1 rounded-xl border border-rose-200 dark:border-rose-800/40 flex items-center gap-1.5 shadow-xs">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>จุดเสี่ยง:</span>
                <strong className="font-bold">{stats.riskCount}</strong>
              </span>

              <span className="bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800/40 flex items-center gap-1.5 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>เปิดบริการตอนนี้:</span>
                <strong className="font-bold">{stats.currentlyOpenCount}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 2. SEARCH & FILTER CONTROLS BAR */}
        {/* ==================================================== */}
        <section className="bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 backdrop-blur-md shadow-lg">
          {/* Search Input & Reset Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="ค้นหาชื่อร้าน, เมนู, ย่าน (เช่น อารีย์, ทองหล่อ, BTS พญาไท, Drip, Matcha)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-10"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="h-10 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl text-xs flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>ล้างตัวกรอง</span>
            </Button>
          </div>

          {/* Category Selector Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium px-1">
              <span>หมวดหมู่สถานที่ (Category):</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'ทั้งหมด (All)' },
                { id: 'coffee', label: '☕ Specialty Coffee' },
                { id: 'matcha', label: '🍵 Matcha & Tea' },
                { id: 'bar', label: '🍸 Bar & Speakeasy' },
                { id: 'bakery', label: '🍰 Bakery & Dessert' },
                { id: 'coworking', label: '💻 Coworking' },
                { id: 'pet', label: '🐱 Pet Friendly' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zone Selector Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium px-1">
              <span>โซนพื้นที่ (Metropolitan Zone):</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'ทุกโซน (All Zones)' },
                { id: 'inner', label: '🏙️ กทม. ชั้นใน (Siam, Sukhumvit, Ari)' },
                { id: 'outer', label: '🌳 กทม. ชั้นนอก (Bang Na, Chatuchak)' },
                { id: 'thonburi', label: '🛶 ฝั่งธนบุรี (Charoen Nakhon, Talat Phlu)' },
                { id: 'perimeter', label: '🚗 ปริมณฑล (Nonthaburi, Samut Prakan)' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id as BangkokZone)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedZone === zone.id
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20 scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day & Time Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-200 dark:border-slate-800/80">
            {/* Day Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>วันเปิดให้บริการ:</span>
              </span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'today', label: 'วันนี้' },
                  { id: 'tomorrow', label: 'พรุ่งนี้' },
                  { id: 'mon', label: 'จ.' },
                  { id: 'tue', label: 'อ.' },
                  { id: 'wed', label: 'พ.' },
                  { id: 'thu', label: 'พฤ.' },
                  { id: 'fri', label: 'ศ.' },
                  { id: 'sat', label: 'ส.' },
                  { id: 'sun', label: 'อา.' },
                ].map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id as SelectedDayFilter)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedDay === day.id
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500 font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>ช่วงเวลาที่ต้องการไป:</span>
              </span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'live', label: '⚡ ตอนนี้เลย (Live)' },
                  { id: 'morning', label: 'เช้า (07-11น.)' },
                  { id: 'afternoon', label: 'บ่าย (12-17น.)' },
                  { id: 'evening', label: 'เย็น (18-21น.)' },
                  { id: 'night', label: 'ดึก (21-02น.)' },
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => {
                      setSelectedTime(period.id as SelectedTimeFilter);
                      setIsCustomTimeActive(false);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      !isCustomTimeActive && selectedTime === period.id
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500 font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}

                {/* Custom Time Option */}
                <input
                  type="time"
                  value={customTimeInput}
                  onChange={(e) => {
                    setCustomTimeInput(e.target.value);
                    setIsCustomTimeActive(true);
                  }}
                  className={`text-xs bg-slate-50 dark:bg-slate-950 border px-2 py-1 rounded-lg text-slate-800 dark:text-slate-200 ${
                    isCustomTimeActive
                      ? 'border-emerald-500 ring-1 ring-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  title="ระบุเวลาเฉพาะเจาะจง"
                />
              </div>
            </div>
          </div>

          {/* Toggle Switches Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Flood Safe Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={floodSafeOnly}
                  onCheckedChange={setFloodSafeOnly}
                />
                <span className={`font-medium ${floodSafeOnly ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                  🛡️ เฉพาะร้านที่ปลอดภัยจากน้ำท่วมเท่านั้น (Flood Safe Only)
                </span>
              </label>

              {/* Work Friendly Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={workFriendlyOnly}
                  onCheckedChange={setWorkFriendlyOnly}
                />
                <span className={`font-medium ${workFriendlyOnly ? 'text-sky-700 dark:text-sky-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                  ⚡ มีปลั๊ก & Wi-Fi พร้อมนั่งทำงาน
                </span>
              </label>
            </div>

            {/* Live Overpass OSM Scraping Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5">
              <Switch
                checked={enableOverpassScraping}
                onCheckedChange={setEnableOverpassScraping}
              />
              <div className="flex items-center gap-1.5">
                <span className={`font-medium ${enableOverpassScraping ? 'text-cyan-700 dark:text-cyan-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                  🌐 ดึงข้อมูล OSM สด (Overpass Turbo Scraping)
                </span>
                {isScrapingLoading && (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 animate-spin" />
                )}
              </div>
            </label>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 3. SPLIT WORKSPACE / TAB LAYOUT (MAP & SIDEBAR) */}
        {/* ==================================================== */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
          {/* Main Map (Left Column: 7 cols on Desktop) */}
          <div
            className={`lg:col-span-7 flex flex-col h-[520px] lg:h-[720px] ${
              mobileView !== 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <CafeFloodMap
              venues={filteredVenues}
              selectedVenue={selectedVenue}
              onSelectVenue={(venue) => {
                setSelectedVenue(venue);
                handleOpenDetailModal(venue);
              }}
              onOpenModal={handleOpenDetailModal}
              onAskTyphoon={handleAskTyphoon}
              showFloodedRoads={showFloodedRoads}
              onToggleFloodedRoads={setShowFloodedRoads}
              filterDay={selectedDay}
              filterTime={isCustomTimeActive ? customTimeInput : selectedTime}
              focusedVenue={focusedVenue}
              className="flex-1"
            />
          </div>

          {/* Sidebar Area (Right Column: 5 cols on Desktop) */}
          <div
            className={`lg:col-span-5 flex flex-col h-[560px] lg:h-[720px] bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl ${
              mobileView === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Desktop Tabs Header (Venues List vs Typhoon AI Chat) */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setDesktopSidebarTab('list');
                    setMobileView('list');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    (mobileView === 'list' || desktopSidebarTab === 'list') && mobileView !== 'chat'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>รายชื่อร้าน ({filteredVenues.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDesktopSidebarTab('chat');
                    setMobileView('chat');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    mobileView === 'chat' || (desktopSidebarTab === 'chat' && mobileView !== 'list')
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-300" />
                  <span>Typhoon AI Chat</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                {stats.currentlyOpenCount} เปิดตอนนี้
              </span>
            </div>

            {/* Sidebar Body: Either Venues List or Typhoon AI Chat */}
            <div className="flex-1 overflow-hidden relative">
              {/* TAB 1: VENUES LIST */}
              {((desktopSidebarTab === 'list' && mobileView !== 'chat') || mobileView === 'list') && (
                <div className="h-full overflow-y-auto p-3.5 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                  {filteredVenues.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                        <Coffee className="w-6 h-6 text-amber-400/80" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-200">
                          ไม่พบร้านค้าที่ตรงกับตัวกรอง
                        </h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                          ลองปรับเปลี่ยนหมวดหมู่ โซน หรือปิดตัวกรองน้ำท่วมเพื่อดูสถานที่เพิ่มเติม
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleResetFilters}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl text-xs"
                      >
                        ล้างตัวกรองทั้งหมด
                      </Button>
                    </div>
                  ) : (
                    filteredVenues.map((venue) => (
                      <CafeCard
                        key={venue.id}
                        venue={venue}
                        selectedDay={selectedDay}
                        selectedTime={isCustomTimeActive ? customTimeInput : selectedTime}
                        isSelected={selectedVenue?.id === venue.id}
                        onSelect={(v) => {
                          setSelectedVenue(v);
                          setFocusedVenue(v);
                        }}
                        onFocusMap={handleFocusOnMap}
                        onAskTyphoon={handleAskTyphoon}
                        onOpenDetails={handleOpenDetailModal}
                      />
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: TYPHOON AI CONCIERGE CHAT */}
              {((desktopSidebarTab === 'chat' && mobileView !== 'list') || mobileView === 'chat') && (
                <div className="h-full">
                  <CafeTyphoonChat
                    venuesContext={filteredVenues}
                    selectedVenue={selectedVenue}
                    filterState={currentFilterState}
                    onSelectVenue={(v) => {
                      setSelectedVenue(v);
                      handleOpenDetailModal(v);
                    }}
                    initialQuery={chatInitialPrompt}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 4. MOBILE FLOATING BOTTOM NAVIGATION BAR */}
        {/* ==================================================== */}
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-[9990] flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 shadow-2xl rounded-full p-1.5 flex items-center gap-1 backdrop-blur-lg pointer-events-auto">
            <button
              type="button"
              onClick={() => setMobileView('map')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                mobileView === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>แผนที่</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileView('list')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                mobileView === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>ร้านค้า ({filteredVenues.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileView('chat')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                mobileView === 'chat'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-300" />
              <span>AI Typhoon</span>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 5. CAFE DETAIL MODAL */}
        {/* ==================================================== */}
        <CafeDetailModal
          venue={selectedVenue}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDay={selectedDay}
          selectedTime={isCustomTimeActive ? customTimeInput : selectedTime}
          onAskTyphoon={handleAskTyphoon}
          onFocusMap={handleFocusOnMap}
        />
      </main>
    </div>
  );
};

export default BangkokCafeFloodMapPage;
