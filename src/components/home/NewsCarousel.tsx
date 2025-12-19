import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Smartphone, Bell, Shield, CloudRain, Calculator, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const NewsCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

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
            badge: "News",
            title: 'เตรียมพบกับ "D-MIND"',
            subtitle: 'นวัตกรรมการเรียนรู้สู่แอปพลิเคชันเตือนภัยอัจฉริยะ',
            description: 'D-MIND ภูมิใจนำเสนอผลงานการพัฒนาแอปพลิเคชัน "เพื่อการศึกษา" (Educational Purpose) ที่มุ่งเน้นการนำเทคโนโลยี AI และ IoT มาประยุกต์ใช้ในการเฝ้าระวังภัยพิบัติ',
            bgImage: '/images/hero-background.png',
            content: (
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-sm md:text-base text-blue-100 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                            <Smartphone className="w-6 h-6 text-green-400" />
                            <div>
                                <p className="font-semibold text-white">Android Application</p>
                                <p className="opacity-80">พร้อมให้ดาวน์โหลดเร็วๆ นี้ (Coming Soon)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm md:text-base text-blue-100 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                            <Smartphone className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="font-semibold text-white">iOS Application</p>
                                <p className="opacity-80">อยู่ในระหว่างการพัฒนา (Coming Soon)</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => navigate('/article/dmind-app-launch')} className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg transition-all hover:scale-105">
                            อ่านรายละเอียดเพิ่มเติม
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            badge: "Update",
            title: '2 วันแห่งการเปลี่ยนแปลง!',
            subtitle: 'D-MIND ยกระดับสู่เวอร์ชันล่าสุด',
            description: 'พลิกโฉมหน้าตาใหม่ (UI Overhaul) ด้วยดีไซน์ "Modern Blue-White Theme" | ระบบแจ้งเตือนภัยแม้ออฟไลน์ (Background Email Notifications) | ฮับเครื่องมือคำนวณครบวงจร',
            bgImage: '/images/hero-background.png', // Fallback or distinct image
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Shield className="w-6 h-6 text-green-400 mb-2" />
                            <h4 className="font-bold text-white text-sm">Background Alerts</h4>
                            <p className="text-xs text-blue-100 mt-1">แจ้งเตือนผ่าน E-mail แม้ปิดแอป</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <Map className="w-6 h-6 text-blue-300 mb-2" />
                            <h4 className="font-bold text-white text-sm">Modern Map UI</h4>
                            <p className="text-xs text-blue-100 mt-1">จุดเสี่ยง Risk Zones ดูง่ายขึ้น</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                            <CloudRain className="w-6 h-6 text-yellow-300 mb-2" />
                            <h4 className="font-bold text-white text-sm">Weather & Tools</h4>
                            <p className="text-xs text-blue-100 mt-1">พยากรณ์อากาศ & เครื่องมือคำนวณ</p>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => navigate('/article/system-update-v2')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg border border-white/20 transition-all hover:scale-105">
                            อ่านรายละเอียดเพิ่มเติม
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="relative w-full overflow-hidden min-h-[550px] md:min-h-[600px] bg-slate-900 group">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-90"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 h-full py-12 md:py-20" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 px-4 md:px-12 flex items-center justify-center h-full">
                            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                                {/* Text Content */}
                                <div className={cn(
                                    "space-y-6 animate-in slide-in-from-left-8 fade-in duration-700 delay-100 fill-mode-both",
                                    index === selectedIndex ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                )}>
                                    <Badge variant="outline" className="text-blue-300 border-blue-400/50 px-4 py-1 text-sm bg-blue-500/10 backdrop-blur-md">
                                        {slide.badge}
                                    </Badge>
                                    <div>
                                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-xl">
                                            {slide.title}
                                        </h1>
                                        <h2 className="text-xl md:text-2xl text-blue-200 font-medium mb-4">
                                            {slide.subtitle}
                                        </h2>
                                        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl">
                                            {slide.description}
                                        </p>
                                    </div>
                                    {slide.content}
                                </div>

                                {/* Visual/Image Side */}
                                <div className={cn(
                                    "relative hidden md:block h-[400px] animate-in zoom-in-50 fade-in duration-700 delay-200 fill-mode-both",
                                    index === selectedIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                )}>
                                    {/* Glassmorphic Card Container for Imagery */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl p-6 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                                        {/* Abstract generic tech visualization if no specific image */}
                                        {slide.id === 1 ? (
                                            <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
                                                <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 animate-bounce mb-6">
                                                    <Smartphone className="w-12 h-12 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">D-MIND Application</h3>
                                                <p className="text-blue-200">Coming to Android</p>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full p-4">
                                                <div className="grid grid-cols-2 gap-4 h-full">
                                                    <div className="bg-slate-800/80 rounded-xl p-4 border border-white/5 flex flex-col justify-end group/card hover:bg-slate-800 transition-colors">
                                                        <Bell className="w-8 h-8 text-yellow-400 mb-2 group-hover/card:scale-110 transition-transform" />
                                                        <div className="h-2 w-12 bg-gray-600 rounded mb-2"></div>
                                                        <div className="h-2 w-20 bg-gray-600 rounded"></div>
                                                    </div>
                                                    <div className="bg-blue-600/20 rounded-xl p-4 border border-blue-500/30 flex flex-col justify-end group/card">
                                                        <div className="w-full h-16 bg-blue-500/20 rounded-lg mb-2 overflow-hidden relative">
                                                            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-blue-400/50"></div>
                                                        </div>
                                                        <div className="h-2 w-full bg-blue-400/30 rounded"></div>
                                                    </div>
                                                    <div className="col-span-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/20 flex items-center gap-4">
                                                        <Shield className="w-10 h-10 text-green-400" />
                                                        <div>
                                                            <h4 className="text-white font-bold">Safe & Secure</h4>
                                                            <p className="text-xs text-green-200">Offline Notifications Ready</p>
                                                        </div>
                                                    </div>
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

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all md:opacity-0 group-hover:opacity-100"
                onClick={scrollPrev}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all md:opacity-0 group-hover:opacity-100"
                onClick={scrollNext}
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-3 h-1.5 rounded-full transition-all duration-300",
                            index === selectedIndex ? "w-8 bg-blue-500" : "bg-white/30 hover:bg-white/50"
                        )}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewsCarousel;
