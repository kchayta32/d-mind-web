import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ChevronLeft,
    Smartphone,
    Shield,
    Bell,
    CheckCircle,
    Layers,
    Cpu,
    WifiOff,
    Database,
    MapPin,
    Activity,
    CloudRain,
    Bot,
    Zap,
    Calendar,
    User,
    Clock,
    Server,
    Radio,
    Flame,
    Waves,
    TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const DMindMobileArticle: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative pb-24 transition-colors duration-300">
            {/* Header / Hero */}
            <div className="relative min-h-[440px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center">
                {/* Background gradient & decorative tech grid */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 opacity-95"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

                <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-white/80 hover:text-white hover:bg-white/10 w-fit mb-6 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> {isEn ? 'Back' : 'ย้อนกลับ'}
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3 py-1 font-semibold">
                            {isEn ? 'Mobile Engineering' : 'วิศวกรรมโมบายล์แอป'}
                        </Badge>
                        <Badge variant="outline" className="text-blue-300 border-blue-400/40 bg-blue-500/10">
                            Android Native v2.0
                        </Badge>
                        <Badge variant="outline" className="text-amber-300 border-amber-400/40 bg-amber-500/10">
                            Kotlin & Jetpack Compose
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        {isEn ? (
                            <>
                                D-MIND Native Android v2.0<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400">
                                    Intelligent Disaster Warning Architecture
                                </span>
                            </>
                        ) : (
                            <>
                                รายงานความก้าวหน้า D-MIND Mobile App<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400">
                                    ยกระดับสู่ Native Android 2.0 ด้วยสถาปัตยกรรม 5 ชั้น
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                        {isEn
                            ? 'Comprehensive report on the migration from hybrid prototype to 100% native Kotlin & Jetpack Compose, featuring 5-tier architecture, 7-layer disaster map, 3-level FCM push notifications, and full offline reliability.'
                            : 'สรุปการพัฒนาแอปพลิเคชันมือถือ D-MIND แบบ Native 100% พัฒนาด้วย Kotlin และ Jetpack Compose พร้อมสถาปัตยกรรม 5 ชั้น แผนที่ภัยพิบัติ 7 ชั้นข้อมูล ระบบแจ้งเตือน FCM 3 ระดับ และการทำงานออฟไลน์เต็มรูปแบบ'}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-teal-400" />
                            <span>{isEn ? 'D-MIND Mobile Core Team' : 'ทีมพัฒนา D-MIND'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-teal-400" />
                            <span>28 พฤษภาคม 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-teal-400" />
                            <span>{isEn ? '7 min read' : 'เวลาอ่าน 7 นาที'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
                <div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-10 md:p-14 border border-border">

                    {/* Executive Summary Card */}
                    <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/30 rounded-2xl p-6 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-500/30">
                                <Smartphone className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                    {isEn ? 'Executive Summary' : 'สรุปความก้าวหน้าสำคัญ'}
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/30">
                                        Build Verified
                                    </span>
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'D-MIND has completed the transformation of its mobile application into a standalone 100% native Android workspace (app ID: com.dmind.app, Version 2.0.0, targetSdk 35). The app removes all web runtimes (React/Vite/Capacitor) in favor of high-performance Kotlin, Jetpack Compose, Material 3, and dedicated Ktor 3.4.3 backend service layer.'
                                        : 'โครงการ D-MIND ได้พัฒนาแอปพลิเคชันมือถือเสร็จสมบูรณ์สู่สถานะ Standalone Native Android (App ID: com.dmind.app, Version 2.0.0, targetSdk 35) โดยตัดการพึ่งพา Web runtime เดิม (React/Vite/Capacitor) และพัฒนาด้วยภาษา Kotlin, Jetpack Compose และ Material 3 พร้อม Ktor Backend Module เพื่อประสิทธิภาพสูงสุดในการเตือนภัยแบบเรียลไทม์'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: 5-Tier Architecture */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                                1
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? '5-Tier Software Architecture' : 'สถาปัตยกรรมซอฟต์แวร์ 5 ชั้น (5-Tier Architecture)'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Modular, maintainable, and high-performance design' : 'การออกแบบแยกส่วนตามมาตรฐานวิศวกรรมซอฟต์แวร์'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-teal-600 dark:text-teal-400 font-bold">
                                        <Layers className="w-5 h-5" />
                                        <h4>1. Presentation Layer (ส่วนติดต่อผู้ใช้)</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Built with Kotlin + Jetpack Compose & Material 3. Entry point at MainActivity.kt with DMindApp.kt controlling bottom navigation (Home, Map, Emergency, Manual, Settings) and full-screen dashboards.'
                                            : 'พัฒนาด้วย Jetpack Compose บนภาษา Kotlin ร่วมกับ Material 3 มี MainActivity.kt และ DMindApp.kt เป็นแกนกลาง ควบคุม 5 เมนูหลัก พร้อม Dark/Light theme อัตโนมัติ'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400 font-bold">
                                        <Cpu className="w-5 h-5" />
                                        <h4>2. Business Logic Layer (ตรรกะทางธุรกิจ)</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Clean Architecture with ViewModels, UseCases, Repositories, and Kotlin Coroutines for asynchronous processing and non-blocking background data sync.'
                                            : 'จัดการสถานะด้วย ViewModel, UseCases และ Repositories พร้อม Kotlin Coroutines สำหรับการประมวลผลข้อมูลแบบ Asynchronous โดยไม่กระทบความลื่นไหลของ UI'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400 font-bold">
                                        <Server className="w-5 h-5" />
                                        <h4>3. Service Layer (บริการแม่ข่ายกลาง)</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Kotlin/JVM + Ktor 3.4.3 backend gateway module handling secure API proxying, FCM HTTP v1 push notifications, SOS queueing, and sensitive key management.'
                                            : 'โมดูล backend สร้างด้วย Kotlin/JVM + Ktor 3.4.3 ทำหน้าที่เป็น API Gateway กลางสำหรับ FCM HTTP v1, การรับ SOS, การ Proxy สภาพอากาศ และการจัดการ API Key อย่างปลอดภัย'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                        <Database className="w-5 h-5" />
                                        <h4>4. Data Layer (การจัดการข้อมูล & แคช)</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Dual data pipeline: Custom Supabase REST Client (via HttpURLConnection without bloated SDK) for remote tables/Edge Functions + Local Room 2.8.4 & SQLite for 100% offline persistence.'
                                            : 'เชื่อมต่อ Supabase ผ่าน Custom REST Client (HttpURLConnection ประหยัดทรัพยากร) ควบคู่กับ Room Database 2.8.4 และ SQLite AlertsCacheDAO สำหรับแคชออฟไลน์'}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-border bg-card/60 shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-2 text-purple-600 dark:text-purple-400 font-bold">
                                    <Radio className="w-5 h-5" />
                                    <h4>5. Communication & External Integration Layer (การเชื่อมต่อแหล่งข้อมูลภายนอก)</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'Seamlessly aggregates real-time data from GISTDA, TMD, USGS, Open-Meteo, OpenStreetMap/Nominatim, ThaiLLM (Typhoon), and Firebase Cloud Messaging (FCM).'
                                        : 'เชื่อมต่อและดึงข้อมูลแบบ Real-time จากหลากหลายหน่วยงานระดับประเทศและระดับโลก ได้แก่ GISTDA, กรมอุตุนิยมวิทยา (TMD), สำนักสำรวจธรณีวิทยาสหรัฐฯ (USGS), Open-Meteo, OpenStreetMap/Nominatim, ThaiLLM และ Firebase Cloud Messaging'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section 2: Interactive Disaster Map with 7 Layers */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'Interactive Map & 7 Disaster Layers' : 'แผนที่ภัยพิบัติแบบโต้ตอบ 7 ชั้นข้อมูล'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'MapLibre Native Android SDK + Multi-source GeoJSON & WMS' : 'ขับเคลื่อนด้วย MapLibre Android SDK แสดงผลศูนย์กลางประเทศไทย'}
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {isEn
                                ? 'The new native disaster map features an interactive floating header, segmented control to switch between D-MIND IoT Stations and Regional Disasters, a vertical toolstack (locate, zoom, layers), Nominatim search, and a gesture-driven bottom sheet displaying live statistics and historical charts (1d, 3d, 7d, 30d).'
                                : 'หน้าจอแผนที่ถูกยกเครื่องใหม่เป็น Native Dashboard เต็มจอ มี Floating Header, Segmented Control สลับระหว่าง "สถานีตรวจวัด D-MIND" กับ "ภัยต่างๆ", แผงเครื่องมือด้านซ้าย และ Bottom Sheet โค้งมนพร้อมตัวกรองช่วงเวลา (1 วัน, 3 วัน, 7 วัน, 30 วัน) และกราฟสถิติ'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-border">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                                    <Flame className="w-4 h-4 text-orange-500" /> 1. ไฟป่า & จุดความร้อน (VIIRS)
                                </div>
                                <p className="text-xs text-muted-foreground">GISTDA VIIRS 1day แสดงตำแหน่งจุดความร้อนจากดาวเทียม</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-border">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                                    <Waves className="w-4 h-4 text-blue-500" /> 2. พื้นที่น้ำท่วม & น้ำท่วมซ้ำซาก
                                </div>
                                <p className="text-xs text-muted-foreground">GISTDA Flood & Flood-Frequency WMS / GeoJSON Layers</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-border">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                                    <Activity className="w-4 h-4 text-red-500" /> 3. แผ่นดินไหวทั่วโลก (USGS)
                                </div>
                                <p className="text-xs text-muted-foreground">USGS all_week Real-time Feed พร้อมระดับแมกนิจูด</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-border">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                                    <Zap className="w-4 h-4 text-emerald-500" /> 4. ผักตบชวาขวางทางน้ำ
                                </div>
                                <p className="text-xs text-muted-foreground">GISTDA water_hyacinth ตรวจจับการแพร่กระจายในลำน้ำ</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-border">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                                    <CloudRain className="w-4 h-4 text-cyan-500" /> 5. ดัชนีความแห้งแล้ง (DRI / NDWI / SMAP)
                                </div>
                                <p className="text-xs text-muted-foreground">ดัชนีภัยแล้งสะสม ดัชนีพืชพรรณ และความชื้นผิวดินระดับตื้น</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-border">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-1">
                                    <TrendingUp className="w-4 h-4 text-indigo-500" /> 6-7. แม่น้ำ & ความชื้นในดิน Heatmap
                                </div>
                                <p className="text-xs text-muted-foreground">Open-Meteo Flood (การไหลของน้ำ) & Land (Soil Moisture 0-7 cm)</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: 3-Tier Intelligent Notification & Reliability */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg">
                                3
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? '3-Level Notification & Offline Reliability' : 'ระบบแจ้งเตือนอัจฉริยะ 3 ระดับ & ความทนทานต่อสภาวะออฟไลน์'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'FCM HTTP v1, Geofence Hazard Polygons & WorkManager' : 'Firebase Cloud Messaging + Background Geofence + WorkManager SOS Queue'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                    🚨
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-900 dark:text-red-200 text-base">
                                        {isEn ? 'Emergency Channel (Level 4–5 Severity)' : 'ช่องทางฉุกเฉินสูงสุด (Emergency Alerts - ระดับ 4 ถึง 5)'}
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                        {isEn
                                            ? 'Triggered for life-threatening events with maximum priority sound, persistent vibration, Do-Not-Disturb (DND) bypass, and USE_FULL_SCREEN_INTENT to wake the device and display critical warnings on the lock screen.'
                                            : 'สำหรับภัยพิบัติร้ายแรง แจ้งเตือนด้วยเสียงระดับสูงสุด ระบบสั่นต่อเนื่อง ทะลุโหมดห้ามรบกวน (DND Bypass) และเปิดหน้าจอแจ้งเตือนฉุกเฉินเต็มจอ (Full-Screen Intent) แม้ขณะล็อกหน้าจอ'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                    ⚠️
                                </div>
                                <div>
                                    <h4 className="font-bold text-amber-900 dark:text-amber-200 text-base">
                                        {isEn ? 'Important Channel (Level 3 Severity)' : 'ช่องทางสำคัญ (Important Alerts - ระดับ 3)'}
                                    </h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                        {isEn
                                            ? 'High-priority notifications with distinct audio tone to advise readiness and evacuation awareness.'
                                            : 'แจ้งเตือนพร้อมเสียงเตือนเฉพาะ สำหรับเหตุการณ์สำคัญที่ต้องเฝ้าระวังหรือเตรียมพร้อมรับมือ'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                    ℹ️
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-200 text-base">
                                        {isEn ? 'General Channel (Level 1–2 Severity)' : 'ช่องทางทั่วไป (General Alerts - ระดับ 1 ถึง 2)'}
                                    </h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                        {isEn
                                            ? 'Silent and informative updates for regular weather forecasts and status changes.'
                                            : 'แจ้งเตือนแบบเงียบ สำหรับข้อมูลพยากรณ์อากาศและสถานะการทำงานทั่วไปของระบบ'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-card border border-border">
                                <h5 className="font-bold text-foreground flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-teal-500" /> Geofencing Hazard Detection
                                </h5>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'BackgroundLocationService monitors coordinates using Google Fused Location and executes point-in-polygon checks against local danger zones.'
                                        : 'บริการ BackgroundLocationService ทำงานเบื้องหลังเพื่อตรวจจับพิกัดกับขอบเขตพื้นที่เสี่ยง (Danger Zones) ด้วยอัลกอริทึม Point-in-Polygon'}
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border">
                                <h5 className="font-bold text-foreground flex items-center gap-2 mb-2">
                                    <WifiOff className="w-5 h-5 text-emerald-500" /> WorkManager Offline SOS Queue
                                </h5>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'When internet is down during disaster, SOS requests are queued in local SQLite/Room DB. SOSQueueWorker automatically retries with exponential backoff once connectivity is restored.'
                                        : 'กรณีไม่มีสัญญาณอินเทอร์เน็ต คำขอ SOS จะถูกบันทึกลง SQLite/Room ภายในเครื่อง และส่งออกอัตโนมัติผ่าน SOSQueueWorker ทันทีที่เชื่อมต่อเครือข่ายได้'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: IoT Hardware & Dr.Mind AI */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                                4
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'IoT Sensor Station & Dr.Mind AI' : 'สถานีเซนเซอร์ IoT ภาคสนาม & ผู้ช่วยปัญญาประดิษฐ์ Dr.Mind'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Hardware integration with MQTT/FastAPI + ThaiLLM Typhoon Model' : 'บูรณาการฮาร์ดแวร์วัดจริงผสานกับโมเดลภาษาขนาดใหญ่เพื่อการกู้ภัย'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-3 text-purple-600 dark:text-purple-400 font-bold">
                                        <Radio className="w-6 h-6" />
                                        <h4 className="text-lg">IoT Station Sensor Grid</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        สถานีตรวจวัด D-MIND ติดตั้งเซนเซอร์ภาคสนาม 4 ชนิดหลัก:
                                    </p>
                                    <ul className="text-xs space-y-2 text-muted-foreground list-disc list-inside">
                                        <li><strong>GY-521:</strong> ตรวจวัดการสั่นสะเทือนและความเอียงของผิวดิน (ดินถล่ม/แผ่นดินไหว)</li>
                                        <li><strong>BME280:</strong> ตรวจวัดอุณหภูมิ ความชื้นสัมพัทธ์ และความกดอากาศ</li>
                                        <li><strong>AJ-SR04T:</strong> เซนเซอร์อัลตราโซนิกกันน้ำ ตรวจวัดระดับน้ำท่วมแบบเรียลไทม์</li>
                                        <li><strong>PMS5003:</strong> ตรวจวัดค่าความเข้มข้นของฝุ่นละออง PM2.5 / PM10</li>
                                    </ul>
                                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                                        ส่งข้อมูลผ่านโพรโทคอล MQTT สู่ Raspberry Pi และแปลงเป็น API Endpoint ผ่าน FastAPI
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-3 text-teal-600 dark:text-teal-400 font-bold">
                                        <Bot className="w-6 h-6" />
                                        <h4 className="text-lg">Dr.Mind AI Disaster Assistant</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        ผู้ช่วยอัจฉริยะประจำตัวสำหรับให้คำแนะนำฉุกเฉิน:
                                    </p>
                                    <ul className="text-xs space-y-2 text-muted-foreground list-disc list-inside">
                                        <li>เชื่อมต่อ Supabase Edge Function <code>ai-chat</code></li>
                                        <li>ขับเคลื่อนด้วยโมเดลภาษา <strong>ThaiLLM (Typhoon)</strong> เชี่ยวชาญภาษาไทย</li>
                                        <li>ตอบคำถามคู่มือการเอาตัวรอด การปฐมพยาบาลเบื้องต้น และขั้นตอนการอพยพ</li>
                                        <li>มีระบบ Fallback Local Knowledge ในกรณีที่ไม่มีการเชื่อมต่อเครือข่าย</li>
                                    </ul>
                                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                                        ออกแบบ System Prompt ให้เข้าใจสถานการณ์ฉุกเฉินและให้คำตอบที่กระชับ ถูกต้องตามหลักการแพทย์
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Section 5: Tech Stack & Verification */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                                5
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'Technical Specifications & Test Verification' : 'ตารางสรุปเทคโนโลยี & ผลการทดสอบ'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Certified build and unit test results' : 'ข้อมูลเทคโนโลยีและผลการรันชุดทดสอบความถูกต้อง'}
                                </p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-2xl border border-border mb-6">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="p-3.5 pl-4">องค์ประกอบ (Component)</th>
                                        <th className="p-3.5">เทคโนโลยี / เวอร์ชัน</th>
                                        <th className="p-3.5 pr-4">หน้าที่ในระบบ (Role)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">Programming Language</td>
                                        <td className="p-3.5 text-teal-600 dark:text-teal-400 font-mono">Kotlin 2.3.21 / JDK 21</td>
                                        <td className="p-3.5 text-muted-foreground">ภาษาหลักในการพัฒนา Native Android App</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">UI Framework</td>
                                        <td className="p-3.5 text-blue-600 dark:text-blue-400 font-mono">Jetpack Compose + Material 3</td>
                                        <td className="p-3.5 text-muted-foreground">สร้างอินเตอร์เฟสแบบ Declarative สวยงาม ลื่นไหล</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">Target Platform</td>
                                        <td className="p-3.5 font-mono">targetSdk 35, minSdk 23</td>
                                        <td className="p-3.5 text-muted-foreground">รองรับอุปกรณ์ Android กว่า 95% ในท้องตลาด</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">GIS & Map Engine</td>
                                        <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-mono">MapLibre SDK 11.8.0</td>
                                        <td className="p-3.5 text-muted-foreground">แสดงผลแผนที่เวกเตอร์/ราสเตอร์และชั้นข้อมูลดาวเทียม</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">Backend Gateway</td>
                                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-mono">Ktor 3.4.3 (Kotlin/JVM)</td>
                                        <td className="p-3.5 text-muted-foreground">API Gateway สำหรับ FCM, Weather Proxy และ SOS</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">Local Database</td>
                                        <td className="p-3.5 text-amber-600 dark:text-amber-400 font-mono">Room 2.8.4 + SQLite</td>
                                        <td className="p-3.5 text-muted-foreground">จัดเก็บข้อมูลและจัดการแคชสำหรับโหมดออฟไลน์</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 pl-4 font-semibold text-foreground">Push Notifications</td>
                                        <td className="p-3.5 font-mono">Firebase Messaging 24.1.0 (FCM v1)</td>
                                        <td className="p-3.5 text-muted-foreground">รับส่งการแจ้งเตือนภัยฉุกเฉินแบบ Data Payload</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Test Verification Badges */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6">
                            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                {isEn ? 'Automated Test Verification Passed' : 'ผลการตรวจสอบการคอมไพล์และทดสอบ (Build & Test Passed)'}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                                    <span>:app:assembleDebug</span>
                                    <Badge className="bg-green-500 text-slate-950 font-bold">PASSED</Badge>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                                    <span>:app:testDebugUnitTest</span>
                                    <Badge className="bg-green-500 text-slate-950 font-bold">PASSED</Badge>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                                    <span>:backend:test</span>
                                    <Badge className="bg-green-500 text-slate-950 font-bold">PASSED</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Back to Home CTA */}
                    <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-foreground">พร้อมสัมผัสประสบการณ์ D-MIND</h4>
                            <p className="text-xs text-muted-foreground">ติดตามการอัปเดตเวอร์ชันพร้อมใช้งานอย่างเป็นทางการได้ที่นี่</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/disaster-map')}
                            >
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                ดูแผนที่ภัยพิบัติ
                            </Button>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                onClick={() => navigate('/')}
                            >
                                กลับสู่หน้าหลัก
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DMindMobileArticle;
