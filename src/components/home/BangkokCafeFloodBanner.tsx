import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Coffee,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Clock,
    MapPin,
    Bot,
    Compass,
    CloudRain
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

export const BangkokCafeFloodBanner: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <section className="w-full bg-gradient-to-b from-card/60 via-card to-card/90 py-12 border-b border-border relative overflow-hidden group transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl translate-y-1/2 opacity-60 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="bg-gradient-to-br from-card via-card to-card/95 border border-amber-500/30 dark:border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 transition-all duration-500 hover:shadow-amber-500/10 hover:border-amber-500/40">

                    {/* Left: Text & Action Content */}
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/30 shadow-xs mb-1">
                            <CloudRain className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
                            <span>{isEn ? 'Monsoon Season Radar • BMR' : 'เรดาร์ฝ่าฝนมรสุม • กทม. & ปริมณฑล'}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Typhoon AI</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                            {isEn ? 'Bangkok Cafe & Bar ' : 'เรดาร์คาเฟ่ & บาร์ '}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-600 dark:from-amber-400 dark:via-orange-300 dark:to-emerald-400">
                                {isEn ? 'Flood-Safe Radar' : 'เปิดให้บริการ & ปลอดน้ำท่วม'}
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            {isEn
                                ? 'Search 60+ specialty coffee shops, authentic matcha teahouses, bars, and work-friendly spaces open on your selected day and time. Correlated with real-time Bangkok street flood risks & Typhoon AI concierge.'
                                : 'ค้นหาร้านกาแฟ Specialty, มัทฉะแท้, ค็อกเทลบาร์ และ Co-working space กว่า 60 แห่ง ที่เปิดให้บริการตามวันเวลาที่คุณเลือก พร้อมวิเคราะห์ความปลอดภัยจากน้ำท่วมถนน กทม. ชั้นใน นอก ฝั่งธนฯ และปริมณฑล ด้วยพลัง Typhoon AI'}
                        </p>

                        {/* 4 Feature Micro-Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-xl mx-auto lg:mx-0">
                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-bold text-foreground">
                                        {isEn ? 'Open/Close Filter' : 'เช็กเวลาเปิด-ปิด'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    {isEn ? 'Live or by day & hour' : 'ตรวจเวลาสด หรือระบุวันเวลา'}
                                </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-xs font-bold text-foreground">
                                        {isEn ? 'Flood Safe Zones' : 'คัดกรองน้ำท่วม'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    {isEn ? 'High ground & safe roads' : 'พื้นที่ดอน น้ำไม่ท่วมขัง'}
                                </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Bot className="w-3.5 h-3.5 text-purple-500" />
                                    <span className="text-xs font-bold text-foreground">Typhoon AI</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    {isEn ? 'Smart Barista advice' : 'บาริสต้า AI แนะนำตามสภาพฝน'}
                                </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Compass className="w-3.5 h-3.5 text-cyan-500" />
                                    <span className="text-xs font-bold text-foreground">
                                        {isEn ? '4 BMR Zones' : '4 โซนรอบเมือง'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug">
                                    {isEn ? 'Inner, Outer, Thonburi' : 'ชั้นใน นอก ธนบุรี ปริมณฑล'}
                                </p>
                            </div>
                        </div>

                        {/* Call-to-action buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all flex items-center gap-2 group/btn"
                                onClick={() => navigate('/cafe-flood-map')}
                            >
                                <Coffee className="w-5 h-5 text-amber-200" />
                                <span>{isEn ? 'Open Cafe & Bar Radar' : 'เปิดเรดาร์คาเฟ่ & บาร์'}</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-xl border-border hover:bg-muted font-medium text-foreground text-sm"
                                onClick={() => navigate('/bangkok-flood')}
                            >
                                <MapPin className="w-4 h-4 mr-1.5 text-cyan-500" />
                                <span>{isEn ? 'Bangkok Road Flood & CCTV' : 'ตรวจน้ำท่วมถนน กทม.'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Visual Interactive Card Preview */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-card p-4 shadow-lg space-y-3">
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                                        <Coffee className="w-4 h-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Specialty & Teahouse</p>
                                        <p className="text-[10px] text-muted-foreground">กรุงเทพฯ & ปริมณฑล</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
                                    เปิดบริการสด
                                </Badge>
                            </div>

                            {/* Sample venue previews */}
                            <div className="space-y-2 text-left">
                                <div className="p-2 rounded-lg bg-muted/30 border border-border/50 text-xs flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-foreground">🍵 MTCH (Ari)</p>
                                        <p className="text-[10px] text-muted-foreground">เปิด 09:00 - 18:00 • ปลอดภัยจากน้ำท่วม</p>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                </div>
                                <div className="p-2 rounded-lg bg-muted/30 border border-border/50 text-xs flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-foreground">☕ Factory Coffee (Phaya Thai)</p>
                                        <p className="text-[10px] text-muted-foreground">เปิด 08:00 - 16:30 • ปลอดภัยจากน้ำท่วม</p>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                </div>
                                <div className="p-2 rounded-lg bg-muted/30 border border-border/50 text-xs flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-foreground">🍸 Teens of Thailand (Chinatown)</p>
                                        <p className="text-[10px] text-muted-foreground">เปิด 18:00 - 01:00 • เฝ้าระวังซอยนานา</p>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-500/10 font-medium"
                                onClick={() => navigate('/cafe-flood-map')}
                            >
                                {isEn ? 'Explore all 60+ venues on map' : 'ดูร้านทั้งหมดบนแผนที่เรดาร์'} →
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BangkokCafeFloodBanner;
