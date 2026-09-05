import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ChevronLeft,
    Layers,
    Database,
    GitCommit,
    Share2,
    ExternalLink,
    Download,
    Maximize2,
    Shield,
    Radio,
    Flame,
    Cpu,
    Activity,
    Server,
    Sparkles,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Info,
    ArrowRight,
    HelpCircle,
    ZoomIn,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

interface DiagramItem {
    id: string;
    sectionNumber: string;
    titleTh: string;
    titleEn: string;
    categoryTh: string;
    categoryEn: string;
    descriptionTh: string;
    descriptionEn: string;
    htmlPath: string;
    svgPath: string;
    badge: string;
    color: string;
    icon: React.ReactNode;
    keyHighlights: { labelTh: string; labelEn: string; descTh: string; descEn: string }[];
    techSpecs: { label: string; value: string }[];
}

const DMindDiagramsArticle: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    // Active Section / Tab
    const [activeTab, setActiveTab] = useState<'all' | 'arch' | 'er' | 'sankey' | 'schema'>('all');
    // Active Sankey Sub-tab
    const [activeSankey, setActiveSankey] = useState<number>(0);
    // View mode per diagram (SVG or Embedded HTML)
    const [viewModes, setViewModes] = useState<Record<string, 'svg' | 'html'>>({});
    // Modal state for fullscreen inspection
    const [modalDiagram, setModalDiagram] = useState<DiagramItem | null>(null);

    const toggleViewMode = (id: string, mode: 'svg' | 'html') => {
        setViewModes(prev => ({ ...prev, [id]: mode }));
    };

    // Sankey diagrams list (4 items as requested)
    const sankeyDiagrams: DiagramItem[] = [
        {
            id: 'sankey-wildfire',
            sectionNumber: '3.1',
            titleTh: 'การคัดกรองจุดความร้อนดาวเทียมสู่มาตรการดับไฟป่า',
            titleEn: 'Satellite Hotspot Filtration & Response Pipeline',
            categoryTh: 'อนาคต D-MIND Roadmap · ไฟป่า & ดาวเทียม',
            categoryEn: 'Future Roadmap · Wildfire Satellite',
            descriptionTh: 'แผนภาพการไหล (Sankey) แสดงการคัดกรองข้อมูลจุดความร้อนจากดาวเทียม 1,200 จุด/วัน ผ่านการจำแนกประเภทการใช้ประโยชน์ที่ดิน และกระจายสู่งานปฏิบัติการดับไฟป่าภาคพื้นดินอย่างแม่นยำ',
            descriptionEn: 'Sankey flow tracking 1,200 daily satellite thermal hotspots from VIIRS sensors, filtering through land classification, and prioritizing direct forest patrol dispatch.',
            htmlPath: '/diagrams/sankey-wildfire-response.html',
            svgPath: '/diagrams/sankey-wildfire-response.svg',
            badge: 'Sankey Flow #1',
            color: 'orange',
            icon: <Flame className="w-5 h-5 text-orange-500" />,
            keyHighlights: [
                {
                    labelTh: 'เซนเซอร์ดาวเทียมต้นทาง',
                    labelEn: 'Satellite Sensors',
                    descTh: 'VIIRS Suomi-NPP (720 จุด, 60%) และ NOAA-20 VIIRS (480 จุด, 40%) รวม 1,200 จุด/วัน',
                    descEn: 'VIIRS Suomi-NPP (720 pts, 60%) & NOAA-20 VIIRS (480 pts, 40%) aggregating 1,200 hotspots/day.'
                },
                {
                    labelTh: 'การคัดแยกประเภทพื้นที่',
                    labelEn: 'Land Classification',
                    descTh: 'ป่าอนุรักษ์/ป่าสงวน 640 จุด (53.3%), พื้นที่เกษตร 440 จุด (36.7%), ชุมชนและแนวกันชน 120 จุด (10.0%)',
                    descEn: 'Conservation & Reserve Forest 640 (53.3%), Agriculture 440 (36.7%), Community Buffer 120 (10.0%).'
                },
                {
                    labelTh: 'มาตรการตอบสนองเร่งด่วน',
                    labelEn: 'Priority Action Routing',
                    descTh: 'จุดความร้อนในป่าสงวนกว่า 81% (520 จุด) ถูกส่งต่อชุดดับไฟป่าภาคพื้นดินทันทีเพื่อสกัดไฟลุกลาม',
                    descEn: 'Over 81% of forest hotspots (520 spots) routed to rapid ground patrol teams instantly.'
                }
            ],
            techSpecs: [
                { label: 'Throughput', value: '1,200 Hotspots / Day' },
                { label: 'Sensors', value: 'VIIRS 375m (SNPP / NOAA-20)' },
                { label: 'Primary Response', value: 'Ground Patrol (50.0%)' },
                { label: 'Target Action', value: 'Zero-Delay Dispatch' }
            ]
        },
        {
            id: 'sankey-telemetry',
            sectionNumber: '3.2',
            titleTh: 'ปริมาณข้อมูลโทรมาตรและการกระจายงานในระบบ',
            titleEn: 'Data Ingestion & Workload Consumption Throughput',
            categoryTh: 'ปริมาณงานระบบ · Data Throughput',
            categoryEn: 'Workload & Telemetry Pipeline',
            descriptionTh: 'แผนภาพแสดงปริมาณข้อมูลโทรมาตร 10,000 req/s จากสถานีตรวจวัด IoT, APIs ภายนอก และการแจ้งเหตุประชาชน ไหลผ่าน In-Memory Cache สู่ชั้นแผนที่สด และ AI ผู้ช่วยเสียง',
            descriptionEn: 'Sankey diagram showing 10,000 req/s telemetry ingestion stream flowing across memory caching and persistence to serve MapLibre GIS, Dr.Mind voice AI, and analytics.',
            htmlPath: '/diagrams/sankey-telemetry-ingestion.html',
            svgPath: '/diagrams/sankey-telemetry-ingestion.svg',
            badge: 'Sankey Flow #2',
            color: 'blue',
            icon: <Activity className="w-5 h-5 text-blue-500" />,
            keyHighlights: [
                {
                    labelTh: 'แหล่งข้อมูลต้นทาง (10,000 req/s)',
                    labelEn: 'Ingestion Sources',
                    descTh: 'สถานี IoT ESP32 (5,000 req/s, 50%), TMD/GISTDA APIs (3,500 req/s, 35%), รายงานประชาชน (1,500 req/s, 15%)',
                    descEn: 'IoT Stations 5,000 req/s (50%), External APIs 3,500 req/s (35%), Citizen Reports 1,500 req/s (15%).'
                },
                {
                    labelTh: 'การประมวลผลและการจัดเก็บ',
                    labelEn: 'Processing & Storage',
                    descTh: 'In-Memory Cache บน Ktor Gateway 6,500 req/s (65%) เพื่อความเร็ว และ Supabase PostgreSQL 3,500 req/s (35%) เพื่อความคงทน',
                    descEn: 'In-Memory Cache on Ktor Gateway 6,500 req/s (65%) for sub-10ms response, PostgreSQL 3,500 req/s.'
                },
                {
                    labelTh: 'ภาระงานของผู้บริโภคข้อมูล',
                    labelEn: 'Consumer Workloads',
                    descTh: 'แผนที่สด MapLibre 6,000 req/s (60%), ผู้ช่วยเสียง Dr.Mind AI 2,500 req/s (25%), แดชบอร์ดสรุปผล 1,500 req/s (15%)',
                    descEn: 'Live MapLibre GIS layers 6,000 req/s (60%), Dr.Mind Voice AI 2,500 req/s, Analytics 1,500 req/s.'
                }
            ],
            techSpecs: [
                { label: 'Total Ingest', value: '10,000 req / sec' },
                { label: 'In-Memory Cache', value: '65.0% (Ktor Gateway)' },
                { label: 'Map GIS Consumption', value: '60.0% (MapLibre)' },
                { label: 'Database Storage', value: 'PostgreSQL + Timescale' }
            ]
        },
        {
            id: 'sankey-alert',
            sectionNumber: '3.3',
            titleTh: 'ประสิทธิภาพการกระจายข้อความแจ้งเตือนภัยพิบัติ',
            titleEn: 'Disaster Alert Delivery & Outcome Flow',
            categoryTh: 'ระบบแจ้งเตือน · Notification Pipeline',
            categoryEn: 'Push Delivery & Outcome',
            descriptionTh: 'แผนภาพการกระจายข้อความแจ้งเตือนภัยพิบัติ 10,000 ข้อความ ผ่านช่องทาง FCM High-Priority, In-App Alert และ Cell Broadcast โดยมีอัตราการรับทราบและตอบสนองทันทีสูงถึง 85%',
            descriptionEn: 'Quantifies the transmission of 10,000 emergency disaster alerts via high-priority FCM push notifications, achieving an immediate citizen acknowledgement rate of 85.0%.',
            htmlPath: '/diagrams/sankey-alert-delivery.html',
            svgPath: '/diagrams/sankey-alert-delivery.svg',
            badge: 'Sankey Flow #3',
            color: 'emerald',
            icon: <Shield className="w-5 h-5 text-emerald-500" />,
            keyHighlights: [
                {
                    labelTh: 'ประเภทภัยพิบัติ',
                    labelEn: 'Disaster Sources',
                    descTh: 'อุทกภัย/ดินถล่ม 4,500 ข้อความ (45%), ไฟป่า/จุดความร้อน 3,500 ข้อความ (35%), มลพิษฝุ่น PM2.5 2,000 ข้อความ (20%)',
                    descEn: 'Flood & Landslide 4,500 (45%), Wildfire 3,500 (35%), PM2.5 Pollution 2,000 (20%).'
                },
                {
                    labelTh: 'ช่องทางการส่งสัญญาณ',
                    labelEn: 'Delivery Channels',
                    descTh: 'FCM High-Priority Full-Screen 5,500 ข้อความ (55%), In-App Alerts 2,500 ข้อความ (25%), Emergency SMS/Broadcast 2,000 (20%)',
                    descEn: 'FCM High-Priority Push (Full-screen) 5,500 (55%), In-App Alerts 2,500 (25%), SMS/Broadcast 2,000 (20%).'
                },
                {
                    labelTh: 'ผลลัพธ์การตอบสนอง',
                    labelEn: 'Delivery Outcome',
                    descTh: 'ประชาชนรับทราบและตอบสนองทันที 8,500 ข้อความ (85.0%) โดยมีเพียง 15.0% ที่หมดเวลาหรือยังไม่ได้เปิดอ่าน',
                    descEn: '8,500 alerts (85.0%) successfully acknowledged and responded immediately by citizens.'
                }
            ],
            techSpecs: [
                { label: 'Total Alerts Dispatched', value: '10,000 Messages' },
                { label: 'FCM High-Priority', value: '55.0% (Full-Screen Intent)' },
                { label: 'Success Outcome', value: '85.0% Acknowledged' },
                { label: 'DND Bypass Support', value: 'Yes (Level 4-5 Alert)' }
            ]
        },
        {
            id: 'sankey-sos',
            sectionNumber: '3.4',
            titleTh: 'การไหลของเหตุฉุกเฉินและคำขอความช่วยเหลือ',
            titleEn: 'Emergency SOS & Incident Triage Pipeline',
            categoryTh: 'อนาคต D-MIND Roadmap · กู้ภัยฉุกเฉิน',
            categoryEn: 'Future Roadmap · SOS Triage',
            descriptionTh: 'แผนภาพการคัดแยกเหตุฉุกเฉิน 1,200 เคส จากปุ่ม SOS, รายงานประชาชน และเซนเซอร์ เข้าสู่ระบบ Triage 3 ระดับ (Red/Orange/Green) และส่งต่อชุดกู้ภัย EMS ได้ทันท่วงที 100%',
            descriptionEn: 'Visualizing 1,200 emergency SOS requests classified into 3-tier severity triage, routing 100% of Code Red life-threatening incidents to direct EMS & rescue dispatch.',
            htmlPath: '/diagrams/sankey-emergency-sos-triage.html',
            svgPath: '/diagrams/sankey-emergency-sos-triage.svg',
            badge: 'Sankey Flow #4',
            color: 'rose',
            icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
            keyHighlights: [
                {
                    labelTh: 'ช่องทางส่งคำขอความช่วยเหลือ',
                    labelEn: 'Incident Intake',
                    descTh: 'ปุ่มฉุกเฉิน SOS บนมือถือ 480 เคส (40%), รายงานเหตุการณ์ประชาชน 440 เคส (36.7%), เซนเซอร์อัตโนมัติ 280 เคส (23.3%)',
                    descEn: 'Mobile SOS button 480 cases (40%), Citizen reports 440 (36.7%), IoT sensor triggers 280 (23.3%).'
                },
                {
                    labelTh: 'การคัดแยกระดับความเร่งด่วน',
                    labelEn: 'Emergency Triage',
                    descTh: 'Code Red ระดับวิกฤต 400 เคส (33.3%), Code Orange เฝ้าระวังด่วน 520 เคส (43.3%), Code Green ข้อมูลทั่วไป 280 เคส (23.3%)',
                    descEn: 'Code Red Critical 400 cases (33.3%), Code Orange 520 cases (43.3%), Code Green 280 cases (23.3%).'
                },
                {
                    labelTh: 'การสั่งการกู้ภัยอัตโนมัติ',
                    labelEn: 'Rescue Dispatch',
                    descTh: 'สั่งการชุดกู้ภัย & EMS ฉุกเฉิน 760 เคส (63.3%) โดยเคส Code Red ทั้งหมด 100% (400 เคส) ได้รับการสั่งการทันที',
                    descEn: '100% of Code Red emergencies (400 cases) trigger immediate automated first-responder dispatch.'
                }
            ],
            techSpecs: [
                { label: 'Total Incidents', value: '1,200 Cases' },
                { label: 'Code Red Critical', value: '33.3% (400 Cases)' },
                { label: 'Emergency Dispatch', value: '760 Cases (63.3%)' },
                { label: 'Code Red Response Rate', value: '100% Direct EMS' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-28">
            {/* Top Hero Section */}
            <div className="relative min-h-[460px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center border-b border-slate-800">
                {/* Visual Backdrop Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 opacity-95"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

                <div className="container mx-auto px-4 py-12 relative z-10 max-w-6xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-white/80 hover:text-white hover:bg-white/10 w-fit mb-6 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> {isEn ? 'Back' : 'ย้อนกลับ'}
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 font-semibold">
                            {isEn ? 'System Architecture & Engineering' : 'สถาปัตยกรรมระบบ & วิศวกรรม'}
                        </Badge>
                        <Badge variant="outline" className="text-teal-300 border-teal-400/40 bg-teal-500/10">
                            7 System Diagrams
                        </Badge>
                        <Badge variant="outline" className="text-purple-300 border-purple-400/40 bg-purple-500/10">
                            Verified Vector SVG & Standalone HTML
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                        {isEn ? (
                            <>
                                D-MIND System Architecture<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-300">
                                    Complete Vector & Data Model Diagrams
                                </span>
                            </>
                        ) : (
                            <>
                                แผนภาพสถาปัตยกรรมระบบ D-MIND<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-300">
                                    ไดอะแกรมระบบ IoT, ฐานข้อมูล และกระบวนการประมวลผล
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                        {isEn
                            ? 'Comprehensive technical blueprint and architecture diagrams of the D-MIND Mobile App & IoT ecosystem, featuring Multi-tier IoT Architecture, Telemetry ER Model, 4 Dynamic Sankey Data Pipelines, and Physical Database Schema under strict complexity budget.'
                            : 'เอกสารและแผนภาพแสดงสถาปัตยกรรมทางเทคนิคของระบบ D-MIND Mobile App และเครือข่ายสถานีตรวจวัด IoT ครอบคลุมไดอะแกรมสถาปัตยกรรมฮาร์ดแวร์-คลาวด์, แบบจำลองข้อมูล ER โทรมาตร, แผนภาพการไหล Sankey 4 หัวข้อสำคัญ และโครงสร้างฐานข้อมูลกายภาพ 5 ตารางหลัก'}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400 pt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? 'D-MIND Core Architecture Team' : 'ทีมสถาปัตยกรรมระบบ D-MIND'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? 'September 2026' : 'กันยายน 2026'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? '10 min deep read' : 'เวลาอ่าน 10 นาที'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{isEn ? 'Complexity Budget Compliant' : 'ผ่านเกณฑ์ Complexity Budget'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Filter Bar */}
            <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border py-3 shadow-sm">
                <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Button
                            size="sm"
                            variant={activeTab === 'all' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('all')}
                            className="text-xs rounded-xl h-8 px-3"
                        >
                            {isEn ? 'All 4 Sections' : 'แสดงทั้งหมด (4 หมวด)'}
                        </Button>
                        <Button
                            size="sm"
                            variant={activeTab === 'arch' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('arch')}
                            className="text-xs rounded-xl h-8 px-3"
                        >
                            <Cpu className="w-3.5 h-3.5 mr-1 text-blue-500" />
                            1. IoT Architecture
                        </Button>
                        <Button
                            size="sm"
                            variant={activeTab === 'er' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('er')}
                            className="text-xs rounded-xl h-8 px-3"
                        >
                            <Database className="w-3.5 h-3.5 mr-1 text-teal-500" />
                            2. IoT Station ER
                        </Button>
                        <Button
                            size="sm"
                            variant={activeTab === 'sankey' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('sankey')}
                            className="text-xs rounded-xl h-8 px-3"
                        >
                            <TrendingUp className="w-3.5 h-3.5 mr-1 text-orange-500" />
                            3. Sankey Flows (4)
                        </Button>
                        <Button
                            size="sm"
                            variant={activeTab === 'schema' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('schema')}
                            className="text-xs rounded-xl h-8 px-3"
                        >
                            <Layers className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                            4. DB Schema
                        </Button>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Vector SVG Live</span>
                    </div>
                </div>
            </div>

            {/* Main Content Body */}
            <div className="container mx-auto px-4 pt-10 max-w-6xl space-y-16">

                {/* ========================================================================= */}
                {/* SECTION 1: Architecture Diagram */}
                {/* ========================================================================= */}
                {(activeTab === 'all' || activeTab === 'arch') && (
                    <section id="section-arch" className="scroll-mt-20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                                1
                            </div>
                            <div>
                                <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-400/40 bg-blue-500/10 mb-1">
                                    Components + Connections
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                                    {isEn
                                        ? '1. IoT Station & Edge Gateway Architecture'
                                        : '1. สถาปัตยกรรมระบบ IoT ของโปรเจค (Components + Connections)'}
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-4xl">
                            {isEn
                                ? 'Multi-tier topology: 4-sensor field station aggregates water level, particulate matter, weather, and seismic tilt, streaming telemetry over MQTT to a Raspberry Pi 4 edge gateway for autonomous anomaly alerting and Supabase cloud ingestion.'
                                : 'สถาปัตยกรรมแบบหลายชั้น (Multi-tier Topology) ครอบคลุมเซนเซอร์ภาคสนาม 4 ชนิด เชื่อมต่อไปยังไมโครคอนโทรลเลอร์ ESP32 ส่งข้อมูลผ่าน MQTT สู่เกตเวย์ Raspberry Pi 4 Model B ซึ่งรัน Mosquitto และ FastAPI ประมวลผลแจ้งเตือนเหตุผิดปกติอัตโนมัติระดับ Edge ก่อนซิงก์ข้อมูลขึ้น Supabase Cloud'}
                        </p>

                        {/* Diagram Container Box */}
                        <Card className="border-border bg-card shadow-lg overflow-hidden rounded-2xl mb-6">
                            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-mono font-semibold text-foreground">
                                        architecture_diagram.svg · 1040 x 540 viewBox
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg flex text-xs">
                                        <button
                                            onClick={() => toggleViewMode('arch', 'svg')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${viewModes['arch'] !== 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Vector SVG
                                        </button>
                                        <button
                                            onClick={() => toggleViewMode('arch', 'html')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${viewModes['arch'] === 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Standalone HTML
                                        </button>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7 gap-1"
                                        onClick={() => window.open('/diagrams/architecture_diagram.html', '_blank')}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        {isEn ? 'Open Tab' : 'เปิดแท็บใหม่'}
                                    </Button>
                                    <a
                                        href="/diagrams/architecture_diagram.svg"
                                        download="architecture_diagram.svg"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-border rounded-lg bg-card hover:bg-muted text-foreground transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        SVG
                                    </a>
                                </div>
                            </div>

                            <CardContent className="p-2 sm:p-6 bg-white dark:bg-slate-950 flex items-center justify-center min-h-[360px] overflow-x-auto">
                                {viewModes['arch'] === 'html' ? (
                                    <iframe
                                        src="/diagrams/architecture_diagram.html"
                                        title="Architecture Diagram"
                                        className="w-full h-[580px] border-0 rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full max-w-5xl overflow-x-auto">
                                        <img
                                            src="/diagrams/architecture_diagram.svg"
                                            alt="D-MIND IoT Station Architecture"
                                            className="w-full h-auto min-w-[700px] object-contain rounded-lg transition-transform hover:scale-[1.01]"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Technical Breakdown Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">FIELD TELEMETRY</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Radio className="w-4 h-4 text-teal-500" />
                                        Multi-Probe Sampling
                                    </h4>
                                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                                        <li><strong>AJ-SR04M:</strong> ตรวจวัดระดับน้ำท่วมแบบอัลตราโซนิก (0–200 cm)</li>
                                        <li><strong>PMS5003:</strong> เลเซอร์ตรวจวัดฝุ่นควัน (PM1.0, PM2.5, PM10)</li>
                                        <li><strong>BME280:</strong> อุณหภูมิ ความชื้น ความกดอากาศ (I2C: 0x76)</li>
                                        <li><strong>GY-521:</strong> ตรวจจับการสั่นสะเทือนและความเอียง (I2C: 0x68)</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">EDGE COMPUTING & ALERT</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-blue-500" />
                                        Autonomous Hazard Evaluation
                                    </h4>
                                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                                        <li><strong>Flood Critical:</strong> ระดับน้ำ &ge; 140 cm (เตือนภัยล่วงหน้าที่ 100 cm)</li>
                                        <li><strong>Hazardous PM2.5:</strong> ฝุ่น &ge; 75.0 &micro;g/m&sup3; (เฝ้าระวังที่ 37.5)</li>
                                        <li><strong>Seismic & Impact:</strong> ตรวจวัดแรงกระชาก |Total G - 1.0| &ge; 0.45g</li>
                                        <li><strong>Structural Tilt:</strong> ตรวจมุมเอียง &ge; 35&deg; เตือนดินถล่มฉับพลัน</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">SECURITY & STORAGE</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-purple-500" />
                                        Cryptographic Cloud Sync
                                    </h4>
                                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                                        <li><strong>API Security:</strong> ตรวจสอบสิทธิ์ด้วย SHA-256 (<code>dmind_live_*</code>)</li>
                                        <li><strong>Rate Limiting:</strong> ควบคุมความถี่จำกัด 120 RPM ป้องกัน Flooding</li>
                                        <li><strong>Postgres Ingest:</strong> ส่งเข้า <code>sensor_logs</code> และแยกตารางด้วย Trigger</li>
                                        <li><strong>Fallback Ready:</strong> มีเส้นทางส่งข้อมูลสำรองตรงสู่ Supabase REST API</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* ========================================================================= */}
                {/* SECTION 2: ER / Data Model */}
                {/* ========================================================================= */}
                {(activeTab === 'all' || activeTab === 'er') && (
                    <section id="section-er" className="scroll-mt-20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-500/20">
                                2
                            </div>
                            <div>
                                <Badge variant="outline" className="text-teal-600 dark:text-teal-400 border-teal-400/40 bg-teal-500/10 mb-1">
                                    Entities + Fields + Triggers
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                                    {isEn
                                        ? '2. IoT Station & Telemetry Subsystem ER Model'
                                        : '2. ER / Data Model ของ IoT Station & Telemetry Subsystem'}
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-4xl">
                            {isEn
                                ? 'Entity-Relationship model detailing the central master telemetry stream (sensor_logs), automated domain partitioning triggers, real-time alert threshold engine, and API key cryptographic authentication.'
                                : 'แบบจำลองข้อมูลความสัมพันธ์ระดับเอนทิตี (ER Data Model) ของระบบรับข้อมูลโทรมาตร มีตารางแกนกลาง sensor_logs รองรับข้อมูล Time-series ผสานรวม PostgreSQL Triggers (sync_sensor_logs) กระจายข้อมูลอัตโนมัติลงตารางย่อย 4 ประเภท และเชื่อมโยงสู่ disaster_alerts'}
                        </p>

                        <Card className="border-border bg-card shadow-lg overflow-hidden rounded-2xl mb-6">
                            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                                    <span className="text-xs font-mono font-semibold text-foreground">
                                        iot_station_er_diagram.svg · 1200 x 900 viewBox
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg flex text-xs">
                                        <button
                                            onClick={() => toggleViewMode('er', 'svg')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${viewModes['er'] !== 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Vector SVG
                                        </button>
                                        <button
                                            onClick={() => toggleViewMode('er', 'html')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${viewModes['er'] === 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Standalone HTML
                                        </button>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7 gap-1"
                                        onClick={() => window.open('/diagrams/iot_station_er_diagram.html', '_blank')}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        {isEn ? 'Open Tab' : 'เปิดแท็บใหม่'}
                                    </Button>
                                    <a
                                        href="/diagrams/iot_station_er_diagram.svg"
                                        download="iot_station_er_diagram.svg"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-border rounded-lg bg-card hover:bg-muted text-foreground transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        SVG
                                    </a>
                                </div>
                            </div>

                            <CardContent className="p-2 sm:p-6 bg-white dark:bg-slate-950 flex items-center justify-center min-h-[440px] overflow-x-auto">
                                {viewModes['er'] === 'html' ? (
                                    <iframe
                                        src="/diagrams/iot_station_er_diagram.html"
                                        title="IoT Station ER Diagram"
                                        className="w-full h-[640px] border-0 rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full max-w-5xl overflow-x-auto">
                                        <img
                                            src="/diagrams/iot_station_er_diagram.svg"
                                            alt="D-MIND IoT Station ER Diagram"
                                            className="w-full h-auto min-w-[760px] object-contain rounded-lg transition-transform hover:scale-[1.01]"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Architecture Notes & Table Schema Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">CENTRAL HUB</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Database className="w-4 h-4 text-teal-500" />
                                        sensor_logs Master Hub
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        เก็บ Payload ดิบแบบรวมศูนย์จากเซนเซอร์ทุกตัว มี B-Tree Index บน <code>timestamp DESC</code> และเชื่อมโยง Realtime Replication เพื่อให้แอปพลิเคชันมือถือดึงค่าล่าสุดผ่าน View <code>v_latest_sensor_reading</code> ได้ในเสี้ยววินาที
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">TRIGGER AUTOMATION</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <GitCommit className="w-4 h-4 text-blue-500" />
                                        sync_sensor_logs() Trigger
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        เมื่อมีข้อมูลเข้า ทริกเกอร์ PostgreSQL จะคำนวณระดับเตือนภัยอัตโนมัติ: แยกค่าน้ำเข้า <code>water_level_logs</code> พร้อม Flag (Warning/Critical), แปลงค่าฝุ่นเข้า <code>pm_logs</code> ตามเกณฑ์ AQI, และตรวจความเร่งเข้า <code>motion_logs</code>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">AUTH & ALERTS</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-indigo-500" />
                                        api_keys & disaster_alerts
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        ตาราง <code>api_keys</code> ยืนยันความปลอดภัยของสถานีฮาร์ดแวร์ด้วย SHA-256 พร้อมกำหนดโควตา ขณะที่ตาราง <code>disaster_alerts</code> ผูกโยงเหตุการณ์ผิดปกติเพื่อส่งต่อให้ Ktor Backend กระจายข้อความ Push ต่อไป
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* ========================================================================= */}
                {/* SECTION 3: Sankey Diagrams (4 Flows) */}
                {/* ========================================================================= */}
                {(activeTab === 'all' || activeTab === 'sankey') && (
                    <section id="section-sankey" className="scroll-mt-20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-orange-500/20">
                                3
                            </div>
                            <div>
                                <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-400/40 bg-orange-500/10 mb-1">
                                    Quantities that Split + Merge (4 Pipelines)
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                                    {isEn
                                        ? '3. Sankey Dynamic Pipelines (Split & Merge Analysis)'
                                        : '3. แผนภาพ Sankey แสดงการไหลและการกระจายข้อมูล (4 หัวข้อ)'}
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-4xl">
                            {isEn
                                ? 'Sankey diagrams illustrate the quantitative flows, splits, and consolidations of critical system data streams across 4 vital dimensions of disaster management and technological evolution.'
                                : 'แผนภาพ Sankey แสดงปริมาณข้อมูลและการกระจายตัวของกระบวนการทำงานในระบบ D-MIND ทั้งด้านการรับข้อมูลโทรมาตร, การกระจายการแจ้งเตือนภัย, ตลอดจนโร้ดแม็พการต่อยอดในอนาคตด้านการดับไฟป่าและการคัดกรองคำขอความช่วยเหลือ SOS'}
                        </p>

                        {/* Sankey Selector Sub-tabs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
                            {sankeyDiagrams.map((diag, index) => {
                                const isSelected = activeSankey === index;
                                return (
                                    <button
                                        key={diag.id}
                                        onClick={() => setActiveSankey(index)}
                                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${isSelected ? 'bg-card border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'bg-muted/40 border-border hover:bg-muted'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-xs font-mono font-bold text-muted-foreground">{diag.sectionNumber}</span>
                                            <Badge variant="outline" className="text-[10px] py-0 px-2">
                                                {diag.badge}
                                            </Badge>
                                        </div>
                                        <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 mb-1">
                                            {isEn ? diag.titleEn : diag.titleTh}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                                            {isEn ? diag.categoryEn : diag.categoryTh}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Sankey Display */}
                        {(() => {
                            const diag = sankeyDiagrams[activeSankey];
                            return (
                                <div className="space-y-6">
                                    <Card className="border-border bg-card shadow-lg overflow-hidden rounded-2xl">
                                        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                                                <span className="text-xs font-mono font-semibold text-foreground">
                                                    {diag.sectionNumber} {isEn ? diag.titleEn : diag.titleTh} · 1000 x 560 viewBox
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg flex text-xs">
                                                    <button
                                                        onClick={() => toggleViewMode(diag.id, 'svg')}
                                                        className={`px-2.5 py-1 rounded-md transition-all ${viewModes[diag.id] !== 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        Vector SVG
                                                    </button>
                                                    <button
                                                        onClick={() => toggleViewMode(diag.id, 'html')}
                                                        className={`px-2.5 py-1 rounded-md transition-all ${viewModes[diag.id] === 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        Standalone HTML
                                                    </button>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs h-7 gap-1"
                                                    onClick={() => window.open(diag.htmlPath, '_blank')}
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    {isEn ? 'Open Tab' : 'เปิดแท็บใหม่'}
                                                </Button>
                                                <a
                                                    href={diag.svgPath}
                                                    download={`${diag.id}.svg`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-border rounded-lg bg-card hover:bg-muted text-foreground transition-colors"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    SVG
                                                </a>
                                            </div>
                                        </div>

                                        <CardContent className="p-2 sm:p-6 bg-white dark:bg-slate-950 flex items-center justify-center min-h-[380px] overflow-x-auto">
                                            {viewModes[diag.id] === 'html' ? (
                                                <iframe
                                                    src={diag.htmlPath}
                                                    title={diag.titleEn}
                                                    className="w-full h-[520px] border-0 rounded-xl"
                                                />
                                            ) : (
                                                <div className="w-full max-w-5xl overflow-x-auto">
                                                    <img
                                                        src={diag.svgPath}
                                                        alt={diag.titleTh}
                                                        className="w-full h-auto min-w-[720px] object-contain rounded-lg transition-transform hover:scale-[1.01]"
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Highlights & Tech Specs */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <Card className="lg:col-span-2 border-border bg-card shadow-sm">
                                            <CardContent className="p-5">
                                                <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                                    {isEn ? 'Detailed Pipeline Breakdown' : 'การวิเคราะห์การไหลของข้อมูลในระบบ'}
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {diag.keyHighlights.map((hl, i) => (
                                                        <div key={i} className="p-3 rounded-xl bg-muted/40 border border-border">
                                                            <p className="font-bold text-foreground text-xs mb-1">
                                                                {isEn ? hl.labelEn : hl.labelTh}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                {isEn ? hl.descEn : hl.descTh}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-border bg-card shadow-sm">
                                            <CardContent className="p-5">
                                                <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4 text-blue-500" />
                                                    {isEn ? 'Throughput & Metrics' : 'ตัวเลขสถิติทางเทคนิค'}
                                                </h4>
                                                <div className="space-y-2">
                                                    {diag.techSpecs.map((spec, i) => (
                                                        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                                                            <span className="text-muted-foreground">{spec.label}</span>
                                                            <span className="font-mono font-semibold text-foreground">{spec.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            );
                        })()}
                    </section>
                )}

                {/* ========================================================================= */}
                {/* SECTION 4: Database Schema (Complexity Budget) */}
                {/* ========================================================================= */}
                {(activeTab === 'all' || activeTab === 'schema') && (
                    <section id="section-schema" className="scroll-mt-20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20">
                                4
                            </div>
                            <div>
                                <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-400/40 bg-indigo-500/10 mb-1">
                                    Complexity Budget: 5 Tables · &le;8 Cols · &le;6 FKs
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                                    {isEn
                                        ? '4. D-MIND Mobile App Database Schema & Foreign Keys'
                                        : '4. Database Schema ของ 5 ตารางหลักที่สำคัญที่สุดของระบบโมบายล์แอป'}
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-4xl">
                            {isEn
                                ? 'Physical PostgreSQL schema diagram following the Complexity Budget (max 5 tables, max 8 columns/table, max 6 FK lines), showcasing core mobile app operations: Auth Identity, Realtime Alerts, FCM Push Deliveries, Incident Reporting, and AI Damage Assessment.'
                                : 'แบบจำลองโครงสร้างฐานข้อมูลกายภาพ (Physical Database Schema) ครอบคลุม 5 ตารางหลักที่สำคัญที่สุดของระบบ D-MIND Mobile App backend โดยออกแบบให้สอดคล้องตามเกณฑ์ Complexity Budget (ไม่เกิน 5 ตาราง, ไม่เกิน 8 คอลัมน์ต่อตาราง, ไม่เกิน 6 เส้นเชื่อมโยง Foreign Key) เพื่อความชัดเจนในการสื่อสารสถาปัตยกรรม'}
                        </p>

                        <Card className="border-border bg-card shadow-lg overflow-hidden rounded-2xl mb-6">
                            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                                    <span className="text-xs font-mono font-semibold text-foreground">
                                        dmind_db_schema.svg · 1160 x 720 viewBox
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg flex text-xs">
                                        <button
                                            onClick={() => toggleViewMode('schema', 'svg')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${viewModes['schema'] !== 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Vector SVG
                                        </button>
                                        <button
                                            onClick={() => toggleViewMode('schema', 'html')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${viewModes['schema'] === 'html' ? 'bg-card shadow-xs font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Standalone HTML
                                        </button>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7 gap-1"
                                        onClick={() => window.open('/diagrams/dmind_db_schema.html', '_blank')}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        {isEn ? 'Open Tab' : 'เปิดแท็บใหม่'}
                                    </Button>
                                    <a
                                        href="/diagrams/dmind_db_schema.svg"
                                        download="dmind_db_schema.svg"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-border rounded-lg bg-card hover:bg-muted text-foreground transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        SVG
                                    </a>
                                </div>
                            </div>

                            <CardContent className="p-2 sm:p-6 bg-white dark:bg-slate-950 flex items-center justify-center min-h-[460px] overflow-x-auto">
                                {viewModes['schema'] === 'html' ? (
                                    <iframe
                                        src="/diagrams/dmind_db_schema.html"
                                        title="Database Schema Diagram"
                                        className="w-full h-[660px] border-0 rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full max-w-5xl overflow-x-auto">
                                        <img
                                            src="/diagrams/dmind_db_schema.svg"
                                            alt="D-MIND Mobile App Database Schema"
                                            className="w-full h-auto min-w-[760px] object-contain rounded-lg transition-transform hover:scale-[1.01]"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Table Summaries & Foreign Key Explanations */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">CORE ALERT SUBSYSTEM</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                        Alerting & FCM Dispatch
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                        <code>public.realtime_alerts</code> เป็นตารางหลักเก็บประกาศเตือนภัยพร้อมพิกัดและรัศมี <code>radius_km</code> เชื่อมต่อแบบ 1-to-Many สู่ <code>alert_deliveries</code> เพื่อติดตามการส่ง Push รายบุคคล
                                    </p>
                                    <div className="p-2 rounded bg-muted text-[11px] font-mono text-muted-foreground">
                                        FK: alert_deliveries.alert_id &rarr; realtime_alerts.id (CASCADE)
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">CITIZEN & AI INTEGRATION</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-teal-500" />
                                        Incident & AI Assessment
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                        <code>public.incident_reports</code> บันทึกการแจ้งเหตุจากประชาชน พร้อมสถานะ <code>is_verified</code> เชื่อมต่อไปยัง <code>damage_assessments</code> ที่ประมวลผลความเสียหายด้วยโมเดล AI
                                    </p>
                                    <div className="p-2 rounded bg-muted text-[11px] font-mono text-muted-foreground">
                                        FK: damage_assessments.incident_id &rarr; incident_reports.id (CASCADE)
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm">
                                <CardContent className="p-5">
                                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">SECURITY & IDENTITY</p>
                                    <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-indigo-500" />
                                        Identity & Schema Isolation
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                        แยกความปลอดภัยของผู้ใช้งานไว้ใน <code>auth.users</code> ของ Supabase พร้อมเปิดใช้งาน Row Level Security (RLS) เพื่อป้องกันการเข้าถึงข้อมูลข้ามบุคคล
                                    </p>
                                    <div className="p-2 rounded bg-muted text-[11px] font-mono text-muted-foreground">
                                        FK: realtime_alerts.created_by &rarr; auth.users.id (SET NULL)
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Complexity Budget Table */}
                        <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
                            <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                {isEn ? 'Complexity Budget Verification Checklist' : 'ตารางตรวจสอบความสอดคล้องตามเกณฑ์ Complexity Budget'}
                            </h4>
                            <table className="w-full text-left text-xs">
                                <thead className="bg-muted text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="p-2.5">ตาราง (Physical Table)</th>
                                        <th className="p-2.5">บทบาทในระบบ</th>
                                        <th className="p-2.5 text-center">จำนวนคอลัมน์ (Budget: &le;8)</th>
                                        <th className="p-2.5">Foreign Key Constraints</th>
                                        <th className="p-2.5 text-right">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border font-mono">
                                    <tr>
                                        <td className="p-2.5 font-bold text-foreground">auth.users</td>
                                        <td className="p-2.5 font-sans text-muted-foreground">ตารางอัตลักษณ์ผู้ใช้และการยืนยันตัวตน</td>
                                        <td className="p-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">6 cols</td>
                                        <td className="p-2.5 font-sans text-muted-foreground">- (Primary Root Identity)</td>
                                        <td className="p-2.5 text-right"><Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">PASSED</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-foreground">public.realtime_alerts</td>
                                        <td className="p-2.5 font-sans text-muted-foreground">ประกาศเตือนภัยศูนย์กลางและพิกัดภูมิศาสตร์</td>
                                        <td className="p-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">7 cols</td>
                                        <td className="p-2.5 text-muted-foreground">created_by &rarr; auth.users.id</td>
                                        <td className="p-2.5 text-right"><Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">PASSED</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-foreground">public.alert_deliveries</td>
                                        <td className="p-2.5 font-sans text-muted-foreground">การส่งมอบการแจ้งเตือน Push Notification FCM</td>
                                        <td className="p-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">6 cols</td>
                                        <td className="p-2.5 text-muted-foreground">alert_id, user_id (CASCADE)</td>
                                        <td className="p-2.5 text-right"><Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">PASSED</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-foreground">public.incident_reports</td>
                                        <td className="p-2.5 font-sans text-muted-foreground">รายงานเหตุฉุกเฉินและคำขอความช่วยเหลือจากประชาชน</td>
                                        <td className="p-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">7 cols</td>
                                        <td className="p-2.5 text-muted-foreground">Indexed by status & coordinates</td>
                                        <td className="p-2.5 text-right"><Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">PASSED</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="p-2.5 font-bold text-foreground">public.damage_assessments</td>
                                        <td className="p-2.5 font-sans text-muted-foreground">การประเมินความเสียหายเชิงลึกด้วยแบบจำลอง AI</td>
                                        <td className="p-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">7 cols</td>
                                        <td className="p-2.5 text-muted-foreground">incident_id &rarr; incident_reports.id</td>
                                        <td className="p-2.5 text-right"><Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">PASSED</Badge></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Footer Navigation CTA */}
                <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-foreground">ศึกษาเพิ่มเติมเกี่ยวกับ D-MIND</h4>
                        <p className="text-xs text-muted-foreground">อ่านบทความรายงานความก้าวหน้า Native Android 2.0 และระบบแผนที่ดาวเทียม GIS</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/article/mobile-app-development')}
                            className="text-xs h-9"
                        >
                            {isEn ? 'Mobile App Report' : 'อ่านบทความ Mobile v2.0'}
                        </Button>
                        <Button
                            onClick={() => navigate('/disaster-map')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
                        >
                            {isEn ? 'Open Disaster Map' : 'เปิดแผนที่ภัยพิบัติ GIS'}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DMindDiagramsArticle;
