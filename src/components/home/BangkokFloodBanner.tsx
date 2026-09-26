import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Map,
    ArrowRight,
    Camera,
    AlertTriangle,
    Waves,
    Compass,
    Sparkles,
    Radio,
    BookOpen,
    Eye,
    ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

const BangkokFloodBanner: React.FC = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const isEn = language === 'en';

    return (
        <section className="w-full bg-gradient-to-b from-card/80 via-card to-card/60 py-12 border-b border-border relative overflow-hidden group transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 opacity-60 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="bg-gradient-to-br from-card via-card to-card/95 border border-cyan-500/30 dark:border-cyan-500/20 rounded-3xl p-6 md:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 transition-all duration-500 hover:shadow-cyan-500/10 hover:border-cyan-500/40">

                    {/* Left: Text & Action Content */}
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/30 shadow-xs mb-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>{t('bangkokFloodBanner.badge')}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                            {t('bangkokFloodBanner.title')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-300">
                                {t('bangkokFloodBanner.highlight')}
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            {t('bangkokFloodBanner.description')}
                        </p>

                        {/* 4 Feature Micro-Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-xl mx-auto lg:mx-0">
                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                </div>
                                <p className="text-xs font-bold text-foreground">3 รหัสสีสัญจร</p>
                                <p className="text-[10px] text-muted-foreground">แดง • ส้ม • เขียว</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <Camera className="w-4 h-4 text-cyan-500 mb-1" />
                                <p className="text-xs font-bold text-foreground">65 กล้อง CCTV</p>
                                <p className="text-[10px] text-muted-foreground">ภาพสด 4 โซนทั่วกรุง</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <Radio className="w-4 h-4 text-blue-500 mb-1" />
                                <p className="text-xs font-bold text-foreground">Sentinel-1 SAR</p>
                                <p className="text-[10px] text-muted-foreground">เรดาร์ทะลุเมฆฝน</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-left">
                                <Waves className="w-4 h-4 text-indigo-500 mb-1" />
                                <p className="text-xs font-bold text-foreground">โทรมาตร กทม.</p>
                                <p className="text-[10px] text-muted-foreground">ระดับคลอง & สถานีสูบ</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start pt-3 w-full sm:w-auto">
                            <Button
                                size="lg"
                                onClick={() => navigate('/bangkok-flood')}
                                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white shadow-lg shadow-cyan-500/25 group/btn font-bold rounded-xl"
                            >
                                <Waves className="mr-2 h-5 w-5 animate-pulse" />
                                <span>{t('bangkokFloodBanner.openMap')}</span>
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/article/bangkok-flood-monitoring')}
                                className="w-full sm:w-auto border-border text-foreground hover:bg-muted font-semibold rounded-xl"
                            >
                                <BookOpen className="mr-2 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                <span>{t('bangkokFloodBanner.readArticle')}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Interactive Visual Card Mockup */}
                    <div className="w-full lg:w-[440px] flex-shrink-0">
                        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-5 text-slate-100 space-y-4">

                            {/* Header Bar */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                                    <span className="text-xs font-mono font-bold text-slate-200">
                                        BKK LIVE SURVEILLANCE
                                    </span>
                                </div>
                                <Badge className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] px-2 py-0.5">
                                    65 CCTV CAMERAS
                                </Badge>
                            </div>

                            {/* Zone Selector Pills Mockup */}
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-semibold text-slate-400">
                                    {isEn ? 'Operational Zones Filter:' : 'ตัวกรอง 4 โซนพื้นที่:'}
                                </p>
                                <div className="grid grid-cols-2 gap-1.5 text-xs">
                                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                                        <span className="text-slate-300 font-medium">โซนเหนือ (North)</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    </div>
                                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                                        <span className="text-slate-300 font-medium">โซนกลาง (Central)</span>
                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                    </div>
                                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                                        <span className="text-slate-300 font-medium">โซนตะวันออก (East)</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    </div>
                                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                                        <span className="text-slate-300 font-medium">ฝั่งธนบุรี (Thonburi)</span>
                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                    </div>
                                </div>
                            </div>

                            {/* 3-Tier Status Stats Bar */}
                            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                                    {isEn ? 'Passability Breakdown (39 Arteries)' : 'สรุปสถานะสัญจร 39 เส้นทางเสี่ยง'}
                                </p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                                        <p className="text-base font-extrabold text-emerald-400">31</p>
                                        <p className="text-[10px] text-emerald-200">🟢 สัญจรปกติ</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30">
                                        <p className="text-base font-extrabold text-amber-400">6</p>
                                        <p className="text-[10px] text-amber-200">🟠 ขับช้า ระวัง</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/30">
                                        <p className="text-base font-extrabold text-red-400">2</p>
                                        <p className="text-[10px] text-red-200">🔴 หลีกเลี่ยง</p>
                                    </div>
                                </div>
                            </div>

                            {/* Live CCTV Mockup Card */}
                            <div className="p-3 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-800/50 border border-cyan-500/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 border border-cyan-400/30">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <span>กล้อง CCTV สด #BKK-02</span>
                                            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800">
                                                Live 30s
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-slate-300">
                                            แยกอโศก-สุขุมวิท • ระดับน้ำ 12 ซม. (สัญจรชะลอตัว)
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/bangkok-flood')}
                                    className="h-8 px-2.5 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg flex-shrink-0"
                                >
                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                    {isEn ? 'View' : 'ดูสด'}
                                </Button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BangkokFloodBanner;
