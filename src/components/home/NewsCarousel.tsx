import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Smartphone, Bell, Shield, CloudRain, Calculator, Map, Layers, Cpu, Radio, Sparkles, Waves, Flame, Activity, BarChart3, Camera, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const NewsCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const { t } = useLanguage();

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        // Auto-play
        const autoplay = setInterval(() => {
            if (emblaApi.canScrollNext()) {
                emblaApi.scrollNext();
            } else {
                emblaApi.scrollTo(0);
            }
        }, 8000);

        return () => clearInterval(autoplay);
    }, [emblaApi, onSelect]);

    const slides = [
        {
            id: 1,
            badge: t('newsCarousel.slide1Badge'),
            title: t('newsCarousel.slide1Title'),
            subtitle: t('newsCarousel.slide1Subtitle'),
            description: t('newsCarousel.slide1Desc'),
            bgImage: '/images/hero-background.png',
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base text-blue-100 p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-white text-xs sm:text-sm md:text-base">{t('newsCarousel.androidApp')}</p>
                                <p className="text-[11px] sm:text-xs opacity-80">{t('newsCarousel.androidSoon')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base text-blue-100 p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-white text-xs sm:text-sm md:text-base">{t('newsCarousel.iosApp')}</p>
                                <p className="text-[11px] sm:text-xs opacity-80">{t('newsCarousel.iosDev')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                        <Button onClick={() => navigate('/article/dmind-app-launch')} className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg transition-all hover:scale-105 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-4">
                            {t('newsCarousel.readMore')}
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            badge: t('newsCarousel.slide2Badge'),
            title: t('newsCarousel.slide2Title'),
            subtitle: t('newsCarousel.slide2Subtitle'),
            description: t('newsCarousel.slide2Desc'),
            bgImage: '/images/hero-background.png',
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-4">
                        <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <AlertTriangle className="w-5 h-5 text-red-400 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.bkkRoadStatus')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.bkkRoadStatusDesc')}</p>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Camera className="w-5 h-5 text-cyan-300 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.bkkCctvFeeds')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.bkkCctvFeedsDesc')}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Radio className="w-5 h-5 text-blue-300 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.sentinelTelemetry')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.sentinelTelemetryDesc')}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                        <Button onClick={() => navigate('/bangkok-flood')} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg shadow-blue-500/20 border border-white/20 transition-all hover:scale-105 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-4">
                            <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                            {t('newsCarousel.openBkkMap')}
                        </Button>
                        <Button onClick={() => navigate('/article/bangkok-flood-monitoring')} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold transition-all hover:scale-105 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3.5">
                            {t('newsCarousel.readMore')}
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5" />
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            badge: t('newsCarousel.slide3Badge'),
            title: t('newsCarousel.slide3Title'),
            subtitle: t('newsCarousel.slide3Subtitle'),
            description: t('newsCarousel.slide3Desc'),
            bgImage: '/images/hero-background.png',
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-4">
                        <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Cpu className="w-5 h-5 text-teal-400 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.nativeTech')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.nativeTechDesc')}</p>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Layers className="w-5 h-5 text-cyan-300 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.mapLayers')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.mapLayersDesc')}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Bell className="w-5 h-5 text-amber-300 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.fcmOffline')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.fcmOfflineDesc')}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                        <Button onClick={() => navigate('/article/mobile-app-development')} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold shadow-lg shadow-teal-500/20 border border-white/20 transition-all hover:scale-105 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-4">
                            {t('newsCarousel.readFullArticle')}
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            badge: t('newsCarousel.slide4Badge'),
            title: t('newsCarousel.slide4Title'),
            subtitle: t('newsCarousel.slide4Subtitle'),
            description: t('newsCarousel.slide4Desc'),
            bgImage: '/images/hero-background.png',
            content: (
                <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-4">
                        <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Waves className="w-5 h-5 text-cyan-400 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.gistdaSatellite')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.gistdaSatelliteDesc')}</p>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Radio className="w-5 h-5 text-blue-300 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.liveRadar')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.liveRadarDesc')}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <BarChart3 className="w-5 h-5 text-amber-300 mb-1.5" />
                            <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{t('newsCarousel.realtimeAnalytics')}</h4>
                            <p className="text-[10px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2">{t('newsCarousel.realtimeAnalyticsDesc')}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                        <Button onClick={() => navigate('/article/disaster-map-system-update')} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg shadow-blue-500/20 border border-white/20 transition-all hover:scale-105 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-4">
                            {t('newsCarousel.readFullArticle')}
                        </Button>
                        <Button onClick={() => navigate('/disaster-map')} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold transition-all hover:scale-105 rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3.5">
                            <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                            {t('newsCarousel.openMap')}
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="relative w-full overflow-hidden min-h-[440px] md:min-h-[580px] bg-slate-900 group">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-black opacity-95"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 h-full py-8 sm:py-12 md:py-16" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 px-4 sm:px-6 md:px-12 flex items-center justify-center h-full">
                            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">

                                {/* Text Content */}
                                <div className={cn(
                                    "space-y-3 sm:space-y-5 animate-in slide-in-from-left-8 fade-in duration-700 delay-100 fill-mode-both",
                                    index === selectedIndex ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                )}>
                                    <Badge variant="outline" className="text-blue-300 border-blue-400/50 px-3 py-0.5 text-xs bg-blue-500/15 backdrop-blur-md inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                        {slide.badge}
                                    </Badge>
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-2 sm:mb-3 drop-shadow-xl">
                                            {slide.title}
                                        </h1>
                                        <h2 className="text-sm sm:text-lg md:text-2xl text-blue-200 font-semibold mb-2 sm:mb-3">
                                            {slide.subtitle}
                                        </h2>
                                        <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
                                            {slide.description}
                                        </p>
                                    </div>
                                    {slide.content}
                                </div>

                                {/* Visual/Image Side */}
                                <div className={cn(
                                    "relative hidden md:block h-[380px] lg:h-[400px] animate-in zoom-in-50 fade-in duration-700 delay-200 fill-mode-both",
                                    index === selectedIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                )}>
                                    {/* Glassmorphic Card Container for Imagery */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl p-6 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                                        {/* Abstract tech visualization */}
                                        {slide.id === 1 ? (
                                            <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
                                                <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 animate-bounce mb-6">
                                                    <Smartphone className="w-12 h-12 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">D-MIND Application</h3>
                                                <p className="text-blue-200">Coming to Android</p>
                                            </div>
                                        ) : slide.id === 2 ? (
                                            <div className="relative w-full h-full p-4 flex flex-col justify-between">
                                                {/* Bangkok Flood & CCTV Live Visual Mockup */}
                                                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                                                        <span className="text-xs font-mono font-bold text-red-300">Bangkok Flood & CCTV</span>
                                                    </div>
                                                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px]">
                                                        LIVE 65 CCTVs
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 my-auto">
                                                    <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-center">
                                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mb-1"></span>
                                                        <p className="text-[11px] font-bold text-white leading-tight">แดง</p>
                                                        <p className="text-[9px] text-red-300">หลีกเลี่ยง</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center">
                                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mb-1"></span>
                                                        <p className="text-[11px] font-bold text-white leading-tight">ส้ม</p>
                                                        <p className="text-[9px] text-amber-300">ขับช้า ระวัง</p>
                                                    </div>
                                                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
                                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1"></span>
                                                        <p className="text-[11px] font-bold text-white leading-tight">เขียว</p>
                                                        <p className="text-[9px] text-emerald-300">สัญจรปกติ</p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-800/80 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                            <Camera className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xs font-semibold text-white">4 โซนทั่วกรุง</p>
                                                            <p className="text-[10px] text-slate-300">เหนือ • กลาง • ตะวันออก • ธนบุรี</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                                                        Sentinel-1 SAR
                                                    </span>
                                                </div>
                                            </div>
                                        ) : slide.id === 3 ? (
                                            <div className="relative w-full h-full p-4 flex flex-col justify-between">
                                                {/* Native Android v2.0 Tech Mockup Visual */}
                                                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping"></div>
                                                        <span className="text-xs font-mono font-bold text-teal-300">Android Native v2.0</span>
                                                    </div>
                                                    <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px]">
                                                        targetSdk 35
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 my-auto">
                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-teal-500/20 flex items-center gap-3">
                                                        <Layers className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">MapLibre GIS</p>
                                                            <p className="text-[10px] text-cyan-200">7 Data Layers</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-amber-500/20 flex items-center gap-3">
                                                        <Bell className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">FCM HTTP v1</p>
                                                            <p className="text-[10px] text-amber-200">3 Priority Channels</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-blue-500/20 flex items-center gap-3">
                                                        <Cpu className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">Kotlin 2.3</p>
                                                            <p className="text-[10px] text-blue-200">Jetpack Compose</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-emerald-500/20 flex items-center gap-3">
                                                        <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">Room 2.8</p>
                                                            <p className="text-[10px] text-emerald-200">100% Offline Ready</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 border border-teal-500/30 flex items-center justify-between text-xs">
                                                    <span className="text-white font-medium">Build & Test Status:</span>
                                                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                                                        <Sparkles className="w-3.5 h-3.5" /> All Tests Passed
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full p-4 flex flex-col justify-between">
                                                {/* Disaster Map Web GIS Mockup Visual */}
                                                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                                                        <span className="text-xs font-mono font-bold text-cyan-300">Web GIS Platform v2.0</span>
                                                    </div>
                                                    <Badge className="bg-blue-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                                                        GISTDA WMS Live
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 my-auto">
                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-blue-500/20 flex items-center gap-3">
                                                        <Waves className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">Sentinel-1 / SAR</p>
                                                            <p className="text-[10px] text-blue-200">Flood Inundation</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-red-500/20 flex items-center gap-3">
                                                        <Flame className="w-6 h-6 text-red-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">VIIRS 375m</p>
                                                            <p className="text-[10px] text-red-200">Thermal Hotspots</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-cyan-500/20 flex items-center gap-3">
                                                        <Radio className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">RainViewer Radar</p>
                                                            <p className="text-[10px] text-cyan-200">Animated Doppler</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 rounded-xl bg-slate-800/80 border border-purple-500/20 flex items-center gap-3">
                                                        <Activity className="w-6 h-6 text-purple-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white leading-tight">USGS Earthquakes</p>
                                                            <p className="text-[10px] text-purple-200">Real-time Feed</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-between text-xs">
                                                    <span className="text-white font-medium">GIS Multi-Feed Sync:</span>
                                                    <span className="font-bold text-cyan-300 flex items-center gap-1">
                                                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Operational & Synced
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons (visible on sm+) */}
            <button
                className="hidden sm:flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all md:opacity-0 group-hover:opacity-100 items-center justify-center"
                onClick={scrollPrev}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
                className="hidden sm:flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all md:opacity-0 group-hover:opacity-100 items-center justify-center"
                onClick={scrollNext}
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        aria-label={`Go to slide ${index + 1}`}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            index === selectedIndex ? "w-6 sm:w-8 bg-blue-500 shadow-sm shadow-blue-500/50" : "w-2 sm:w-3 bg-white/30 hover:bg-white/60"
                        )}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewsCarousel;
