import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    Map,
    Camera,
    AlertTriangle,
    ShieldCheck,
    Navigation,
    Layers,
    Radio,
    Clock,
    Calendar,
    User,
    ArrowRight,
    CheckCircle2,
    Eye,
    Compass,
    Waves,
    Car,
    PhoneCall,
    Search,
    Satellite
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const BangkokRoadFloodArticle: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative pb-24 transition-colors duration-300">
            {/* Header / Hero Section */}
            <div className="relative min-h-[460px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center">
                {/* Background Gradients & Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 opacity-95"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/25 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-white/80 hover:text-white hover:bg-white/10 w-fit mb-6 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> {isEn ? 'Back' : 'ย้อนกลับ'}
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                            {isEn ? 'New Feature • Bangkok Live' : 'ฟีเจอร์ใหม่ • เฝ้าระวัง กทม. สด'}
                        </Badge>
                        <Badge variant="outline" className="text-cyan-300 border-cyan-400/40 bg-cyan-500/10">
                            {isEn ? 'Sentinel-1 SAR & BMA Open Data' : 'ดาวเทียม Sentinel-1 & Open Data กทม.'}
                        </Badge>
                        <Badge variant="outline" className="text-emerald-300 border-emerald-400/40 bg-emerald-500/10">
                            {isEn ? '65 Live CCTV Cameras' : 'กล้องวงจรปิดสด 65 จุด'}
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        {isEn ? (
                            <>
                                Bangkok Road Flood & 65 Live CCTV Monitoring:<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                                    Real-time Urban Flood Intelligence & 4-Zone Road Passability
                                </span>
                            </>
                        ) : (
                            <>
                                เปิดตัวแผนที่น้ำท่วมขังถนน & กล้อง CCTV กทม. เรียลไทม์:<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                                    เฝ้าระวังน้ำท่วมผิวจราจร 39 สายหลัก 4 โซน พร้อมภาพสด 65 จุดตรวจ
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                        {isEn
                            ? 'D-MIND introduces our specialized Bangkok Road Flood Surveillance System. Track road-by-road inundation depths with intuitive 3-tier passability colors (Red/Orange/Green), inspect 65 live CCTV cameras across 4 zones, and leverage Sentinel-1 SAR satellite microwave detection for safer urban commuting.'
                            : 'D-MIND ภูมิใจเปิดตัวระบบเฝ้าระวังน้ำท่วมขังถนนทั่วกรุงเทพมหานครแบบเรียลไทม์ ตรวจสอบระดับน้ำท่วมผิวจราจรรายสาย พร้อมรหัสสีสัญจร 3 ระดับ (แดง=หลีกเลี่ยง, ส้ม=ขับช้า, เขียว=ปกติ) ดูกล้องวงจรปิดสด 65 จุด และผสานข้อมูลดาวเทียม Sentinel-1 SAR เพื่อการเดินทางที่ปลอดภัยไร้กังวล'}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? 'D-MIND GIS & Urban Resilience Team' : 'ทีมพัฒนา D-MIND GIS & Urban Resilience'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>26 กันยายน 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? '8 min read' : 'เวลาอ่าน 8 นาที'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Action Bar */}
            <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-5xl">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-blue-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center flex-shrink-0 text-cyan-300">
                            <Map className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm sm:text-base">
                                {isEn ? 'Try the Interactive Bangkok Flood Map Now' : 'ทดลองใช้งานแผนที่น้ำท่วมถนน กทม. ได้ทันที'}
                            </h4>
                            <p className="text-xs text-blue-200">
                                {isEn
                                    ? 'Filter by 4 zones or search any major road in Bangkok with instant status'
                                    : 'ค้นหาชื่อถนน หรือเลือกโซน เพื่อดูรหัสสีสัญจรและภาพกล้องสดได้ทันที'}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/bangkok-flood')}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg hover:shadow-cyan-500/25 transition-all w-full sm:w-auto flex-shrink-0"
                    >
                        <Compass className="w-4 h-4 mr-2" />
                        {isEn ? 'Launch Bangkok Flood Map' : 'เปิดแผนที่น้ำท่วม กทม.'}
                    </Button>
                </div>
            </div>

            {/* Article Content Body */}
            <div className="container mx-auto px-4 mt-8 relative z-20 max-w-5xl">
                <div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 border border-border space-y-12">

                    {/* Section 1: Introduction & Bangkok Context */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                                1
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {isEn
                                    ? 'The Bangkok Urban Flood Challenge & Solution Overview'
                                    : 'วิกฤตน้ำท่วมขังรอการระบายในกรุงเทพฯ และแนวคิดการพัฒนาระบบ'}
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4 text-base sm:text-lg">
                            {isEn
                                ? 'Bangkok, built upon the low-lying Chao Phraya delta, faces chronic urban flood risks exacerbated by torrential convective thunderstorms, high river tides, and land subsidence. When rainfall intensity exceeds 60–100 mm/hour, surface drainage systems often reach maximum capacity, causing prolonged street ponding on critical arterial highways.'
                                : 'กรุงเทพมหานคร ตั้งอยู่บนพื้นที่ราบลุ่มปากแม่น้ำเจ้าพระยา ซึ่งมีความลาดชันต่ำและได้รับอิทธิพลจากน้ำทะเลหนุน การทรุดตัวของชั้นดิน รวมถึงฝนตกหนักแบบฟ้าผ่าแลบ (Convective Storms) ที่มีปริมาณน้ำฝนเกิน 60–100 มิลลิเมตรต่อชั่วโมง ส่งผลให้ระบบท่อระบายน้ำไม่สามารถระบายน้ำลงสู่คลองสายหลักได้ทัน ก่อให้เกิดปัญหาน้ำท่วมขังบนผิวจราจร (Urban Surface Inundation) สร้างความเสียหายต่อทรัพย์สิน ยานพาหนะ และทำให้การจราจรเป็นอัมพาต'}
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            {isEn
                                ? 'To protect citizens, commuters, and emergency responders, the D-MIND engineering team has integrated heterogeneous open data sources—including BMA canal telemetry, street-level CCTV cameras, and European Space Agency Copernicus Sentinel-1 SAR satellites—into a single high-performance map interface.'
                                : 'เพื่อแก้ปัญหาและยกระดับการเตือนภัยให้ประชาชน ทีมพัฒนา D-MIND จึงได้สร้างระบบศูนย์กลางรวบรวมข้อมูลสถานการณ์น้ำท่วมถนนแบบเปิด (Open Data Integration) ผสานรวมข้อมูลโทรมาตรระดับน้ำคลอง, กล้องวงจรปิด CCTV ถ่ายทอดสด, รายงานสถานีสูบน้ำของสำนักการระบายน้ำ กทม. และภาพถ่ายดาวเทียมเรดาร์ Sentinel-1 SAR จากสหภาพยุโรป นำเสนอผ่านแผนที่ความคมชัดสูงที่ทุกคนเปิดดูได้ง่ายผ่านเบราว์เซอร์'}
                        </p>

                        {/* Highlight stat cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center">
                                <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">39</p>
                                <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">
                                    {isEn ? 'Monitored Roads' : 'ถนนสายหลักที่เฝ้าระวัง'}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {isEn ? 'Key flood-risk arteries' : 'จุดเสี่ยงน้ำท่วมซ้ำซาก'}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                                <p className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">65</p>
                                <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">
                                    {isEn ? 'Live CCTVs' : 'กล้องวงจรปิดสด'}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {isEn ? 'Auto-refresh snapshots' : 'อัปเดตทุก 30 วินาที'}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                                <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">4</p>
                                <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">
                                    {isEn ? 'Bangkok Zones' : 'โซนพื้นที่ครอบคลุม'}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {isEn ? 'North, Central, East, Thonburi' : 'เหนือ, กลาง, ตะวันออก, ธนบุรี'}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
                                <p className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">3</p>
                                <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">
                                    {isEn ? 'Passability Tiers' : 'รหัสสีประเมินสัญจร'}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {isEn ? 'Red • Orange • Green' : 'แดง • ส้ม • เขียว'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: 3-Tier Status Color Codes */}
                    <div className="border-t border-border pt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {isEn
                                    ? '3-Tier Color Passability Standards'
                                    : 'มาตรฐานรหัสสีสถานะการสัญจร 3 ระดับ (แดง-ส้ม-เขียว)'}
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            {isEn
                                ? 'To enable quick split-second driving decisions during heavy downpours, D-MIND classifies every monitored road into 3 strict passability tiers calibrated against real vehicle water-fording thresholds:'
                                : 'เพื่อความสะดวกและรวดเร็วในการตัดสินใจของผู้ขับขี่ในชั่วโมงเร่งด่วน D-MIND ได้กำหนดมาตรฐานรหัสสี 3 ระดับ โดยอ้างอิงจากเกณฑ์ความสูงของน้ำและขีดจำกัดการลุยน้ำของยานพาหนะประเภทต่าง ๆ:'}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* RED TIER */}
                            <div className="rounded-2xl p-5 border bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="font-mono text-xs uppercase tracking-wider text-red-600 dark:text-red-400 font-bold">
                                        Critical / Avoid
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
                                    🔴 {isEn ? 'Red: Critical - Avoid!' : 'สีแดง: หลีกเลี่ยง (วิกฤต)'}
                                </h3>
                                <p className="text-xs text-red-900/80 dark:text-red-200/80 leading-relaxed mb-4">
                                    {isEn
                                        ? 'Inundation depth exceeds 30–50 cm. Severe risk to all passenger vehicles, sedans, and city cars. Engine air intake ingestion hazard. Emergency & heavy high-clearance trucks only.'
                                        : 'ระดับน้ำท่วมขังสูงเกิน 30–50 เซนติเมตร ท่วมมิดดุมล้อหรือเกินระดับท่อไอเสีย รถยนต์ส่วนบุคคล รถเก๋ง และรถจักรยานยนต์ห้ามผ่านโดยเด็ดขาด เสี่ยงเครื่องยนต์ดับและน้ำเข้าห้องโดยสาร'}
                                </p>
                                <div className="bg-red-500/10 rounded-xl p-3 text-[11px] text-red-800 dark:text-red-300 font-medium space-y-1">
                                    <p>⚠️ <strong>คำแนะนำ:</strong> กลับรถหรือใช้เส้นทางเลี่ยงทันที</p>
                                    <p>🚗 <strong>ยานพาหนะ:</strong> รถบรรทุกยกสูงเท่านั้นที่ผ่านได้</p>
                                </div>
                            </div>

                            {/* ORANGE TIER */}
                            <div className="rounded-2xl p-5 border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500"></div>
                                    <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                                        Caution / Slow Down
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300 mb-2">
                                    🟠 {isEn ? 'Orange: Caution - Drive Slow' : 'สีส้ม: ขับช้า ระวัง'}
                                </h3>
                                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed mb-4">
                                    {isEn
                                        ? 'Inundation depth between 15–30 cm. High water in curb lanes (Lane 1–2). Low sedans must stay in middle/right lane. Slow speed required to prevent bow wave engine wash.'
                                        : 'ระดับน้ำท่วมขัง 15–30 เซนติเมตร ท่วมเสมอขอบทางเท้า เลนซ้ายสุดมีน้ำขังสูง รถเก๋งและอีโคคาร์ต้องขับด้วยความระมัดระวัง ใช้เลนกลางหรือเลนขวา ปิดแอร์ และชะลอความเร็วเพื่อไม่ให้เกิดคลื่นน้ำ'}
                                </p>
                                <div className="bg-amber-500/10 rounded-xl p-3 text-[11px] text-amber-800 dark:text-amber-300 font-medium space-y-1">
                                    <p>⚠️ <strong>คำแนะนำ:</strong> ชิดเลนขวา ปิดระบบปรับอากาศ</p>
                                    <p>🚗 <strong>ยานพาหนะ:</strong> รถยกสูง/SUV ผ่านได้ รถเก๋งใช้ความระมัดระวัง</p>
                                </div>
                            </div>

                            {/* GREEN TIER */}
                            <div className="rounded-2xl p-5 border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                                    <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                                        Normal / Clear
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                                    🟢 {isEn ? 'Green: Normal Passability' : 'สีเขียว: ใช้ได้ตามปกติ'}
                                </h3>
                                <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed mb-4">
                                    {isEn
                                        ? 'Dry road or minimal surface dampness (< 10 cm). Normal vehicular traffic flow. No hazard to sedans or two-wheelers. Safe and recommended route.'
                                        : 'ผิวจราจรแห้งหรือมีน้ำขังเล็กน้อยไม่เกิน 10 เซนติเมตร ไม่ส่งผลกระทบต่อการขับขี่ ยานพาหนะทุกประเภทสัญจรได้คล่องตัวและปลอดภัยตามปกติ เป็นเส้นทางแนะนำ'}
                                </p>
                                <div className="bg-emerald-500/10 rounded-xl p-3 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium space-y-1">
                                    <p>✅ <strong>คำแนะนำ:</strong> เส้นทางปลอดภัย แนะนำให้ใช้งาน</p>
                                    <p>🚗 <strong>ยานพาหนะ:</strong> ทุกประเภทสัญจรได้ตามปกติ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: 4 Zones & Smart Search Filter */}
                    <div className="border-t border-border pt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg">
                                3
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {isEn
                                    ? '4 Bangkok Geographic Zones & Smart Street Filtering'
                                    : 'แบ่งพื้นที่ 4 โซนทั่วกรุง & ตัวกรองค้นหาชื่อถนนอัจฉริยะ'}
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            {isEn
                                ? 'Bangkok’s expansive 1,568 km² footprint has been partitioned into 4 practical operational zones. Commuters can instantly toggle zones or type partial road names in English or Thai to instantly view passability and pinpoint surrounding flood sensors.'
                                : 'เพื่อความสะดวกในการค้นหาและบริหารจัดการพื้นที่กว่า 1,568 ตารางกิโลเมตร D-MIND ได้จัดกลุ่มเส้นทางคมนาคมออกเป็น 4 โซนหลัก ผู้ใช้สามารถคลิกเลือกดูเฉพาะโซนที่ตนเองเดินทาง หรือพิมพ์ค้นหาชื่อถนนได้ทันทีทั้งภาษาไทยและอังกฤษ:'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                                <div className="flex items-center gap-2 mb-2 font-bold text-blue-600 dark:text-blue-400">
                                    <Navigation className="w-4 h-4" />
                                    <span>{isEn ? '1. North Zone (โซนเหนือ)' : '1. โซนเหนือ (North Zone)'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    {isEn
                                        ? 'Encompasses Bang Khen, Chatuchak, Don Mueang, Lak Si, Sai Mai. Key arteries: Vibhavadi Rangsit, Phahonyothin, Chaeng Watthana, Ngamwongwan, Lat Phrao.'
                                        : 'ครอบคลุมเขตบางเขน, จตุจักร, ดอนเมือง, หลักสี่, สายไหม ถนนสายสำคัญ: ถนนวิภาวดีรังสิต, พหลโยธิน, แจ้งวัฒนะ, งามวงศ์วาน, ลาดพร้าว (หน้าศาลอาญา, ห้าแยกลาดพร้าว)'}
                                </p>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    10 Major Arteries • 18 CCTVs
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                                <div className="flex items-center gap-2 mb-2 font-bold text-indigo-600 dark:text-indigo-400">
                                    <Navigation className="w-4 h-4" />
                                    <span>{isEn ? '2. Central Zone (โซนกลาง)' : '2. โซนกลาง (Central Zone)'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    {isEn
                                        ? 'The urban core: Pathum Wan, Bang Rak, Sathon, Din Daeng, Phaya Thai, Huai Khwang. Key arteries: Sukhumvit, Rama IV, Ratchadapisek, Phrom Phong, Silom, Asok.'
                                        : 'ศูนย์กลางธุรกิจและเศรษฐกิจ: ปทุมวัน, บางรัก, สาทร, ดินแดง, พญาไท, ห้วยขวาง ถนนสายสำคัญ: สุขุมวิท (อโศก, พร้อมพงษ์, พระโขนง), พระราม 4, รัชดาภิเษก, สาทร, พระราม 9'}
                                </p>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    11 Major Arteries • 20 CCTVs
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                                <div className="flex items-center gap-2 mb-2 font-bold text-amber-600 dark:text-amber-400">
                                    <Navigation className="w-4 h-4" />
                                    <span>{isEn ? '3. East Zone (โซนตะวันออก)' : '3. โซนตะวันออก (East Zone)'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    {isEn
                                        ? 'Expanding eastern corridor: Bang Na, Prawet, Saphan Sung, Min Buri, Khlong Sam Wa. Key arteries: Srinagarindra, Phatthanakan, Ramkhamhaeng, Udom Suk, On Nut, Bang Na-Trat.'
                                        : 'แนวระบายน้ำฝั่งตะวันออก: บางนา, ประเวศ, สะพานสูง, มีนบุรี, คลองสามวา ถนนสายสำคัญ: ศรีนครินทร์ (แยกลำสาลี, แยกพัฒนาการ), รามคำแหง, อุดมสุข, อ่อนนุช, บางนา-ตราด'}
                                </p>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    9 Major Arteries • 14 CCTVs
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                                <div className="flex items-center gap-2 mb-2 font-bold text-teal-600 dark:text-teal-400">
                                    <Navigation className="w-4 h-4" />
                                    <span>{isEn ? '4. Thonburi Zone (ฝั่งธนบุรี)' : '4. ฝั่งธนบุรี (Thonburi Zone)'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    {isEn
                                        ? 'West bank of Chao Phraya: Thon Buri, Bangkok Yai, Phasi Charoen, Bang Khae, Chom Thong, Bang Bon. Key arteries: Phet Kasem, Charan Sanitwong, Somdet Phra Chao Tak Sin, Borommaratchachonnani.'
                                        : 'ฝั่งตะวันตกของแม่น้ำเจ้าพระยา: ธนบุรี, บางกอกใหญ่, ภาษีเจริญ, บางแค, จอมทอง, บางบอน ถนนสายสำคัญ: เพชรเกษม (แยกบางแค), จรัญสนิทวงศ์, สมเด็จพระเจ้าตากสิน, บรมราชชนนี, ราชพฤกษ์'}
                                </p>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                    9 Major Arteries • 13 CCTVs
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: 65 Live CCTV Camera Network */}
                    <div className="border-t border-border pt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                                4
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {isEn
                                    ? '65 Live CCTV Cameras with Auto-Refresh & Water Gauge Telemetry'
                                    : 'โครงข่ายกล้องวงจรปิด CCTV 65 จุด พร้อมภาพถ่ายทอดสดและโทรมาตรระดับน้ำ'}
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            {isEn
                                ? 'Visual ground truth is crucial for assessing road conditions. D-MIND links directly with open BMA and traffic department feeds, presenting 65 active CCTV vantage points at high-risk intersections and underpasses.'
                                : 'การมองเห็นสภาพจริงบนท้องถนนด้วยตาตนเอง (Ground Truth Verification) คือสิ่งสำคัญที่สุดในการประเมินสถานการณ์ ระบบ D-MIND จึงได้เชื่อมโยงกล้อง CCTV ตรวจวัดน้ำท่วมและจราจรจำนวน 65 จุดทั่วกรุงเทพฯ เพื่อให้ผู้ใช้งานสามารถคลิกดูภาพสดของผิวจราจรได้ทันที'}
                        </p>

                        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-cyan-400" />
                                    <span className="font-bold text-sm">CCTV Feeds Features & Specs</span>
                                </div>
                                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                                    Auto-Refresh 30s
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                                    <Eye className="w-4 h-4 text-cyan-300 mb-1" />
                                    <p className="font-semibold text-white">Live Snapshots & Fallbacks</p>
                                    <p className="text-slate-400 mt-0.5">ภาพสดอัปเดตแบบอัตโนมัติ พร้อมระบบสำรองภาพกรณีกล้องปลายทางขัดข้อง</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                                    <Waves className="w-4 h-4 text-blue-300 mb-1" />
                                    <p className="font-semibold text-white">Canal Water Gauges</p>
                                    <p className="text-slate-400 mt-0.5">โทรมาตรระดับน้ำคลอง 28 สายหลัก เทียบกับระดับสันเขื่อนและระดับวิกฤต</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                                    <Radio className="w-4 h-4 text-amber-300 mb-1" />
                                    <p className="font-semibold text-white">Pumping Stations Status</p>
                                    <p className="text-slate-400 mt-0.5">สถานะการเดินเครื่องสถานีสูบน้ำและอุโมงค์ยักษ์ระบายน้ำ กทม.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Sentinel-1 SAR & Satellite Remote Sensing */}
                    <div className="border-t border-border pt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                                5
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {isEn
                                    ? 'Copernicus Sentinel-1 SAR Satellite Radar Integration'
                                    : 'ขุมพลังภาพถ่ายดาวเทียมเรดาร์ Copernicus Sentinel-1 SAR'}
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            {isEn
                                ? 'Optical satellite sensors cannot penetrate dense storm cloud covers. That is why D-MIND incorporates Sentinel-1 C-band Synthetic Aperture Radar (SAR). Radar microwaves effortlessly pierce torrential clouds and monsoon darkness, detecting standing water via specular microwave surface reflection.'
                                : 'ในระหว่างที่เกิดพายุฝนฟ้าคะนองรุนแรง ดาวเทียมภาพถ่ายทางแสงทั่วไป (Optical Satellites) จะไม่สามารถมองเห็นพื้นผิวดินได้เนื่องจากมีเมฆหนาทึบบดบัง D-MIND จึงได้ผสานรวมข้อมูลจากดาวเทียมเรดาร์ Copernicus Sentinel-1 C-band Synthetic Aperture Radar (SAR) ของสหภาพยุโรป ซึ่งคลื่นเรดาร์ไมโครเวฟสามารถทะลุผ่านกลุ่มเมฆและหมอกฝนได้ตลอด 24 ชั่วโมงทั้งกลางวันและกลางคืน เพื่อตรวจจับพื้นที่น้ำท่วมขังบนผิวดินได้อย่างแม่นยำ'}
                        </p>

                        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-blue-950/80 text-white border border-indigo-500/30 flex flex-col sm:flex-row items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-cyan-300 border border-indigo-400/30">
                                <Satellite className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base sm:text-lg mb-1">
                                    {isEn ? 'All-Weather 24/7 Flood Inundation Layer' : 'ชั้นข้อมูลน้ำท่วมทะลุเมฆ 24 ชั่วโมง'}
                                </h3>
                                <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                                    {isEn
                                        ? 'By cross-referencing Sentinel-1 SAR inundation extents with high-resolution road vectors and BMA canal telemetry, D-MIND provides a multi-layered verification barrier against false alarms and missed flood detections.'
                                        : 'เมื่อนำข้อมูลพื้นที่น้ำท่วมจากดาวเทียม Sentinel-1 มาซ้อนทับกับเส้นทางถนนเวกเตอร์และระดับน้ำคลองแบบเรียลไทม์ ทำให้ระบบสามารถตรวจจับและยืนยันการเกิดน้ำท่วมขังได้อย่างแม่นยำ ป้องกันการแจ้งเตือนผิดพลาด (False Positives) ได้อย่างมีประสิทธิภาพ'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Actionable Road Safety & Emergency Hotlines */}
                    <div className="border-t border-border pt-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                                6
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {isEn
                                    ? 'Safe Driving Guidelines in Floods & Emergency Hotlines'
                                    : 'แนวทางการขับขี่ปลอดภัยเมื่อเจอน้ำท่วม & สายด่วนฉุกเฉิน กทม.'}
                            </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            {isEn
                                ? 'When unexpectedly encountering standing water during your commute, follow these proven safety protocols:'
                                : 'หากจำเป็นต้องขับรถในระหว่างที่มีน้ำท่วมขังบนผิวจราจร ควรปฏิบัติตามคำแนะนำด้านความปลอดภัยดังต่อไปนี้:'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>ปิดแอร์ทันที:</strong> พัดลมแอร์หน้ารถอาจพัดน้ำกระจายเข้าห้องเครื่องหรือกรองอากาศ</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>ใช้เกียร์ต่ำสม่ำเสมอ:</strong> เกียร์ L หรือ เกียร์ 1-2 รักษารอบเครื่องยนต์ประมาณ 1,500-2,000 RPM</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>ห้ามเร่งเครื่องกระชาก:</strong> การเร่งเครื่องแรงจะทำให้เกิดคลื่นน้ำซัดย้อนเข้าท่อไอเสีย</span>
                                </div>
                            </div>
                            <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>เว้นระยะห่างคันหน้า 2-3 เท่า:</strong> ประสิทธิภาพของเบรกจะลดลงเมื่อผ้าเบรกเปียกน้ำ</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>เหยียบเบรกย้ำ ๆ หลังพ้นน้ำ:</strong> เพื่อรีดน้ำออกจากจานเบรกและผ้าเบรกให้แห้งสนิท</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>หากเครื่องดับ ห้ามสตาร์ทซ้ำเด็ดขาด:</strong> เสี่ยงน้ำเข้าห้องเผาไหม้และก้านสูบคด</span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Hotlines Box */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-3">
                                <PhoneCall className="w-4 h-4" />
                                <span>{isEn ? 'Emergency Flood Assistance & Hotlines' : 'เบอร์โทรและสายด่วนช่วยเหลือเหตุน้ำท่วม กทม.'}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="p-2.5 bg-background/80 rounded-xl border border-border">
                                    <p className="font-bold text-foreground">ศูนย์ควบคุมน้ำท่วม กทม.</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm mt-0.5">02-248-5115</p>
                                    <p className="text-[10px] text-muted-foreground">รับแจ้งน้ำท่วมขัง 24 ชม.</p>
                                </div>
                                <div className="p-2.5 bg-background/80 rounded-xl border border-border">
                                    <p className="font-bold text-foreground">สายด่วน กทม.</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm mt-0.5">1555</p>
                                    <p className="text-[10px] text-muted-foreground">เรื่องร้องเรียน & ฉุกเฉิน</p>
                                </div>
                                <div className="p-2.5 bg-background/80 rounded-xl border border-border">
                                    <p className="font-bold text-foreground">ตำรวจจราจร (บก.จร.)</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm mt-0.5">1197</p>
                                    <p className="text-[10px] text-muted-foreground">สอบถามเส้นทางน้ำท่วม</p>
                                </div>
                                <div className="p-2.5 bg-background/80 rounded-xl border border-border">
                                    <p className="font-bold text-foreground">หน่วยแพทย์ฉุกเฉิน</p>
                                    <p className="text-red-600 dark:text-red-400 font-mono font-bold text-sm mt-0.5">1669</p>
                                    <p className="text-[10px] text-muted-foreground">เจ็บป่วยฉุกเฉิน กู้ชีพ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA Buttons */}
                    <div className="border-t border-border pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/manual')}
                            className="rounded-xl w-full sm:w-auto text-sm"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1.5" />
                            {isEn ? 'All Articles & Manuals' : 'ดูบทความทั้งหมดในศูนย์คู่มือ'}
                        </Button>

                        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/disaster-map')}
                                className="rounded-xl text-sm flex-1 sm:flex-none"
                            >
                                <Layers className="w-4 h-4 mr-1.5" />
                                {isEn ? 'National Disaster Map' : 'แผนที่ภาพรวมประเทศ'}
                            </Button>
                            <Button
                                onClick={() => navigate('/bangkok-flood')}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg shadow-blue-500/20 rounded-xl text-sm flex-1 sm:flex-none"
                            >
                                <Compass className="w-4 h-4 mr-1.5" />
                                {isEn ? 'Open Bangkok Flood Map' : 'เปิดแผนที่น้ำท่วมถนน กทม.'}
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BangkokRoadFloodArticle;
