import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Zap, Layout, Mail, Calculator, CloudSun, Calendar, User, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const SystemUpdateArticle: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative pb-24 transition-colors duration-300">
            {/* Header / Hero */}
            <div className="relative min-h-[420px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 opacity-95"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-white/80 hover:text-white hover:bg-white/10 w-fit mb-6 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> {isEn ? 'Back' : 'ย้อนกลับ'}
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 font-semibold">
                            {isEn ? 'Core Infrastructure' : 'โครงสร้างระบบหลัก'}
                        </Badge>
                        <Badge variant="outline" className="text-purple-300 border-purple-400/40 bg-purple-500/10">
                            System Update v2.0
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        {isEn ? (
                            <>
                                2 Days of Transformation!<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                                    D-MIND Upgrades to Latest Version & UI Overhaul
                                </span>
                            </>
                        ) : (
                            <>
                                2 วันแห่งการเปลี่ยนแปลง!<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                                    D-MIND ยกระดับสู่เวอร์ชันล่าสุด พร้อมปรับโฉม UI & Background Alerts
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                        {isEn
                            ? 'Major progress report: Complete overhaul of visual interface, offline background notifications via Edge Functions, and an expanded calculation and weather hub.'
                            : 'ทีมพัฒนา D-MIND ขอรายงานความคืบหน้าครั้งสำคัญ กับการปรับปรุงระบบขนานใหญ่เพื่อเสถียรภาพและความปลอดภัยสูงสุด'}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-400" />
                            <span>{isEn ? 'D-MIND Core Systems Team' : 'ทีมพัฒนาระบบ D-MIND'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <span>15 เมษายน 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <span>{isEn ? '5 min read' : 'เวลาอ่าน 5 นาที'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
                <div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 border border-border">

                    <div className="space-y-12">

                        {/* Section 1: Background Alerts */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30 text-white">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                    {isEn ? '1. Offline Background Alerts via Edge Functions' : '1. ระบบแจ้งเตือนภัยแม้ออฟไลน์ (Background Alerts)'}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {isEn
                                        ? 'Successfully engineered Server-Side Edge Functions for automated email notifications, dispatching instant emergency advisories the moment critical thresholds are breached—without requiring the app to be actively open in your browser.'
                                        : 'เราทำสำเร็จแล้ว! กับการพัฒนาระบบ Background Email Notifications โดยใช้เทคโนโลยี Server-Side (Supabase Edge Functions) ทำให้ D-MIND สามารถส่งอีเมลแจ้งเตือนภัยพิบัติหาคุณได้ทันทีที่เซนเซอร์ตรวจพบความเสี่ยง "โดยที่คุณไม่จำเป็นต้องเปิดหน้าแอปค้างไว้"'}
                                </p>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>ก้าวสำคัญที่ทำให้ D-MIND เป็นที่พึ่งได้จริงตลอด 24 ชม.</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: UI Overhaul */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 text-white">
                                <Layout className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                    {isEn ? '2. Visual Overhaul (Modern Blue-White Theme)' : '2. พลิกโฉมหน้าตาใหม่ (UI Overhaul)'}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {isEn
                                        ? 'Refined design system featuring Glassmorphism, seamless responsive touch targets, and modernized risk zone data visualization.'
                                        : 'เราเปลี่ยนมาใช้ดีไซน์ "Modern Blue-White Theme" ที่สะอาดตาและทันสมัยที่สุด'}
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground list-none">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span><strong>Glassmorphism:</strong> มิติความลึกที่สวยงามและรองรับทั้ง Dark & Light Mode</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span><strong>Mobile-First:</strong> ปรับปรุงปุ่มสัมผัสและแผนที่ให้ลื่นไหลบนทุกขนาดหน้าจอ</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span><strong>Data Visualization:</strong> แสดงจุดเสี่ยงภัย (Risk Zones) ชัดเจนและอ่านค่าง่าย</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3: Tools & Hub */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30 text-white">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                    {isEn ? '3. Comprehensive Disaster & Weather Tools Hub' : '3. ฟีเจอร์ครบครันยิ่งขึ้น'}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                                        <h5 className="font-bold text-foreground flex items-center gap-2 mb-1">
                                            <Calculator className="w-4 h-4 text-orange-500" /> All-in-One Calculators
                                        </h5>
                                        <p className="text-xs text-muted-foreground">ฮับเครื่องมือคำนวณครบวงจร ทั้งการประเมินความเสียหายและวิเคราะห์สถิติ</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                                        <h5 className="font-bold text-foreground flex items-center gap-2 mb-1">
                                            <CloudSun className="w-4 h-4 text-amber-500" /> Weather & Satellite Insight
                                        </h5>
                                        <p className="text-xs text-muted-foreground">การพยากรณ์อากาศที่แม่นยำพร้อมเรดาร์กลุ่มฝนสด</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Status Card */}
                    <div className="mt-14 pt-8 border-t border-border text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>สถานะปัจจุบัน: ฟีเจอร์หลักพร้อมใช้งานสมบูรณ์แบบ</span>
                        </div>
                        <div>
                            <Button
                                onClick={() => navigate('/manual')}
                                variant="outline"
                                className="mr-3"
                            >
                                {isEn ? 'Browse Manuals' : 'ดูคู่มือทั้งหมด'}
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
                                onClick={() => navigate('/')}
                            >
                                {isEn ? 'Back to Home' : 'กลับสู่หน้าหลัก'}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SystemUpdateArticle;
