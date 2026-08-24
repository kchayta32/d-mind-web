import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ChevronLeft,
    MapPin,
    Radio,
    Flame,
    Waves,
    Activity,
    CloudRain,
    Layers,
    Shield,
    Calendar,
    User,
    Clock,
    Compass,
    BarChart3,
    Wind,
    SunMedium,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const DisasterMapUpdateArticle: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative pb-24 transition-colors duration-300">
            {/* Header / Hero */}
            <div className="relative min-h-[460px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center">
                {/* Background gradient & decorative GIS grid */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 opacity-95"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
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
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 font-semibold">
                            {isEn ? 'Web GIS & Remote Sensing' : 'ระบบแผนที่และโทรสัมผัส Web GIS'}
                        </Badge>
                        <Badge variant="outline" className="text-cyan-300 border-cyan-400/40 bg-cyan-500/10">
                            Disaster Map v2.0
                        </Badge>
                        <Badge variant="outline" className="text-amber-300 border-amber-400/40 bg-amber-500/10">
                            GISTDA & Live Radar Integration
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        {isEn ? (
                            <>
                                D-MIND Disaster Map Platform Upgrade<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
                                    GISTDA Satellite Data, Live Rain Radar & Multi-Hazard Intelligence
                                </span>
                            </>
                        ) : (
                            <>
                                อัปเดตใหญ่ระบบแผนที่ภัยพิบัติ D-MIND Web<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
                                    เชื่อมโยงดาวเทียม GISTDA, เรดาร์ฝนสด และระบบวิเคราะห์เชิงพื้นที่ครบวงจร
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                        {isEn
                            ? 'Comprehensive report on the major Web Disaster Map upgrade (August 2026): Integrating GISTDA WMS satellite layers, RainViewer animated rain radar player, USGS earthquake tracking, typhoon trajectory forecasts, and dynamic time-series analytical dashboards.'
                            : 'รายงานสรุปความก้าวหน้าการพัฒนาระบบแผนที่ภัยพิบัติอัจฉริยะ D-MIND บนเว็บไซค์: ผสานรวมชั้นข้อมูลดาวเทียม GISTDA WMS/WFS, เครื่องเล่นเรดาร์ฝนสด RainViewer, เฝ้าระวังแผ่นดินไหว USGS, พายุหมุนเขตร้อน และแดชบอร์ดสถิติเชิงพื้นที่แบบ Real-time'}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? 'D-MIND GIS & Engineering Team' : 'ทีมพัฒนา D-MIND GIS & Engineering'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>18 สิงหาคม 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? '6 min read' : 'เวลาอ่าน 6 นาที'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
                <div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-10 md:p-14 border border-border">

                    {/* Quick CTA to Map */}
                    <div className="bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <Compass className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                                    {isEn ? 'Live Interactive Disaster Map' : 'ระบบแผนที่ภัยพิบัติพร้อมใช้งานสด'}
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30">
                                        Active & Live
                                    </span>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isEn
                                        ? 'Explore 7+ layers of remote sensing satellite data, real-time weather radars, and hazard analytics.'
                                        : 'ทดลองใช้งานชั้นข้อมูลดาวเทียม 7+ เลเยอร์, เรดาร์กลุ่มฝนสด และสถิติแนวโน้มภัยพิบัติได้ทันที'}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate('/disaster-map')}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/20 flex-shrink-0"
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            {isEn ? 'Open Disaster Map' : 'เข้าสู่หน้าแผนที่ภัยพิบัติ'}
                        </Button>
                    </div>

                    {/* Section 1: GISTDA Satellite Integration */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                                1
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'GISTDA Satellite Remote Sensing Integration' : 'การเชื่อมโยงข้อมูลดาวเทียมสำรวจโลก GISTDA (WMS / WFS)'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Direct feed from Sentinel-1, Radarsat-2, and Suomi NPP / NOAA-20' : 'ดึงข้อมูลสดตรงจากดาวเทียมสำรวจทรัพยากรระดับสากล'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-border bg-card shadow-sm hover:border-cyan-500/40 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400 font-bold">
                                        <Waves className="w-5 h-5" />
                                        <h4>{isEn ? 'Flood Extent Inundation (GISTDA WMS)' : 'พื้นที่น้ำท่วมขัง (Flood Inundation)'}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Overlays high-resolution SAR satellite imagery (Sentinel-1 / Radarsat-2) through GISTDA WMS service, penetrating cloud covers to accurately map flooded basins and inundated residential areas.'
                                            : 'แสดงผลพื้นที่น้ำท่วมขังด้วยภาพถ่ายเรดาร์ SAR จากดาวเทียม Sentinel-1 และ Radarsat-2 ผ่าน GISTDA WMS ทะลุเมฆฝนเพื่อระบุพื้นที่น้ำท่วมขังในลุ่มน้ำและเขตชุมชนได้อย่างแม่นยำ'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm hover:border-red-500/40 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-red-600 dark:text-red-400 font-bold">
                                        <Flame className="w-5 h-5" />
                                        <h4>{isEn ? 'VIIRS 375m & MODIS Hotspots' : 'จุดความร้อนไฟป่า (VIIRS 375m & MODIS)'}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Real-time thermal anomaly detection with 375m spatial resolution from VIIRS sensor, classified by detection confidence (Low, Nominal, High) and land use type (Forest, Agriculture, Community).'
                                            : 'ตรวจจับความผิดปกติทางความร้อนด้วยความละเอียด 375 เมตรจากเซนเซอร์ VIIRS จำแนกระดับความเชื่อมั่น (Low, Nominal, High) และการใช้ประโยชน์ที่ดิน (ป่าสงวน, พื้นที่เกษตร, ชุมชน)'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm hover:border-amber-500/40 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-amber-600 dark:text-amber-400 font-bold">
                                        <SunMedium className="w-5 h-5" />
                                        <h4>{isEn ? 'Burn Scar & Fire Severity Area' : 'รอยไหม้สะสม (Burn Scar Areas)'}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Spatial calculation of cumulative burnt scar areas, enabling disaster management authorities to evaluate forest destruction, ecological impact, and airborne particulate emission risk.'
                                            : 'แสดงข้อมูลรอยไหม้สะสมและพื้นที่ถูกไฟเผาไหม้ ช่วยให้เจ้าหน้าที่และประชาชนประเมินความเสียหายของผืนป่าและแนวโน้มการเกิดมลพิษฝุ่นควัน'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm hover:border-emerald-500/40 transition-colors">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                        <Layers className="w-5 h-5" />
                                        <h4>{isEn ? 'Drought & Soil Moisture Index' : 'ดัชนีภัยแล้งและความชื้นในดิน'}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {isEn
                                            ? 'Multi-spectral satellite vegetation health index (NDVI / VCI) and soil moisture monitoring to assess agricultural drought vulnerability across all 77 provinces.'
                                            : 'ติดตามดัชนีสุขภาพพืชพรรณ (NDVI/VCI) และความชื้นในผิวดินจากดาวเทียม เพื่อเตือนภัยและรับมือภัยแล้งภาคการเกษตรทั่วทั้ง 77 จังหวัด'}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Section 2: Live Radar & Weather Engine */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'Live Rain Radar & Meteorological Player' : 'เรดาร์ตรวจจับกลุ่มฝนสดและระบบจำลองสภาพอากาศ'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Smooth radar animation player powered by RainViewer & Open-Meteo' : 'เครื่องเล่นเรดาร์สภาพอากาศสดแบบเคลื่อนไหวและพยากรณ์ล่วงหน้า'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl mb-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                                        <h3 className="font-bold text-lg text-white">RainViewer Live Doppler Radar Engine</h3>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {isEn
                                            ? 'Real-time weather radar composite with animated time scrubbing across past 2 hours and 30-min nowcast.'
                                            : 'ผสานรวมโครงข่ายเรดาร์ตรวจอากาศ Doppler แสดงการเคลื่อนตัวของกลุ่มฝนย้อนหลัง 2 ชั่วโมง พร้อมคาดการณ์ล่วงหน้า 30 นาที'}
                                    </p>
                                </div>
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                                    10-Min Frame Interval
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="p-3 bg-slate-800/80 rounded-xl border border-white/5">
                                    <CloudRain className="w-6 h-6 text-cyan-400 mb-2" />
                                    <h4 className="font-bold text-sm text-white">{isEn ? 'Precipitation Intensity' : 'ความเข้มของกลุ่มฝน'}</h4>
                                    <p className="text-xs text-slate-300 mt-1">{isEn ? 'Calibrated dBZ scale for light drizzle to severe thunderstorms.' : 'สเกลสี dBZ มาตรฐาน ระบุตั้งแต่ฝนโปรยจนถึงพายุฝนฟ้าคะนองรุนแรง'}</p>
                                </div>

                                <div className="p-3 bg-slate-800/80 rounded-xl border border-white/5">
                                    <Clock className="w-6 h-6 text-blue-400 mb-2" />
                                    <h4 className="font-bold text-sm text-white">{isEn ? 'Radar Player Controls' : 'ปุ่มควบคุมและไทม์ไลน์'}</h4>
                                    <p className="text-xs text-slate-300 mt-1">{isEn ? 'Play/Pause, speed adjustment, and scrubbing through radar timestamps.' : 'ปุ่มเล่น/หยุดชั่วคราว ปรับความเร็ว และเลื่อนดูประวัติเรดาร์ตามเวลาจริง'}</p>
                                </div>

                                <div className="p-3 bg-slate-800/80 rounded-xl border border-white/5">
                                    <Wind className="w-6 h-6 text-indigo-400 mb-2" />
                                    <h4 className="font-bold text-sm text-white">{isEn ? 'Open-Meteo Integration' : 'เซนเซอร์สภาพอากาศ Open-Meteo'}</h4>
                                    <p className="text-xs text-slate-300 mt-1">{isEn ? 'Point rainfall sensors, wind vectors, and hourly precipitation forecast.' : 'จุดตรวจวัดปริมาณน้ำฝน ทิศทางลม และการพยากรณ์สภาพอากาศรายชั่วโมง'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Multi-Hazard Global Feeds */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                                3
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'Global & Regional Multi-Hazard Surveillance' : 'ระบบเฝ้าระวังภัยพิบัติพหุภัยระดับภูมิภาคและสากล'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Earthquakes, typhoons, volcanic activity, and air quality index' : 'ติดตามแผ่นดินไหว เส้นทางพายุ ภูเขาไฟปะทุ และคุณภาพอากาศ'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-base text-foreground mb-1">
                                    {isEn ? 'USGS & TMD Earthquakes' : 'แผ่นดินไหว USGS & TMD'}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'Real-time seismic feeds with magnitude color coding, focal depth, exact distance calculation from current user location, and tsunami risk indicators.'
                                        : 'รายงานแผ่นดินไหว Real-time แสดงขนาดแมกนิจูด ระดับความลึก คำนวณระยะห่างจากพิกัดของผู้ใช้งาน และแจ้งเตือนความเสี่ยงสึนามิ'}
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                                    <Wind className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-base text-foreground mb-1">
                                    {isEn ? 'Typhoon & Storm Tracking' : 'เส้นทางพายุหมุนเขตร้อน'}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'Dynamic storm tracks showing past paths, central barometric pressure, sustained wind speed categories, and forecasted cone of uncertainty.'
                                        : 'แสดงเส้นทางการเคลื่อนตัวของพายุ ความกดอากาศที่จุดศูนย์กลาง ความเร็วลมสูงสุดใกล้ศูนย์กลาง และกรวยคาดการณ์ทิศทางล่วงหน้า'}
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-base text-foreground mb-1">
                                    {isEn ? 'Air Quality & PM2.5 Grid' : 'คุณภาพอากาศ & หมุด PM2.5'}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'Ground sensor network streaming PM2.5, PM10, AQI index values, health advisories, and historical pollution trend graphs.'
                                        : 'สถานีตรวจวัดคุณภาพอากาศภาคพื้นดิน แสดงค่า PM2.5, PM10, ดัชนี AQI พร้อมคำแนะนำด้านสุขภาพและกราฟเปรียบเทียบย้อนหลัง'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Analytics & Performance */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                                4
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {isEn ? 'Real-Time Analytics & High-Performance GIS Engine' : 'แดชบอร์ดสถิติอัจฉริยะ & ประสิทธิภาพ Web GIS ขั้นสูง'}
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isEn ? 'Clustered rendering, multi-parameter filters, and automated service health monitoring' : 'ประมวลผลหมุดหมื่นจุดอย่างลื่นไหล กรองละเอียดรายจังหวัด พร้อมระบบเช็คสถานะ API'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border">
                                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                                    <BarChart3 className="w-5 h-5" />
                                    <h4>{isEn ? 'Time Series & Regional Charts' : 'กราฟอนุกรมเวลา & สถิติรายพื้นที่'}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'Interactive charts visualizing flood hydrographs, hotspot progression trends, and 24-hour regional risk summaries.'
                                        : 'แผนภูมิเชิงโต้ตอบแสดงกราฟระดับน้ำย้อนหลัง แนวโน้มการเพิ่มขึ้นของจุดความร้อนไฟป่า และสรุปพื้นที่เสี่ยงภัยราย 24 ชั่วโมง'}
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border">
                                <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400 font-bold">
                                    <Zap className="w-5 h-5" />
                                    <h4>{isEn ? 'Clustered Performance & Base Layers' : 'Marker Clustering & ปรับเปลี่ยนแผนที่ฐาน'}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {isEn
                                        ? 'Optimized Leaflet clustering rendering over 10,000+ thermal hotspots effortlessly with instant switching between OSM, Satellite, Dark Canvas, and Topographic base maps.'
                                        : 'เทคโนโลยี Marker Clustering ช่วยให้แสดงผลหมุดความร้อนกว่าหมื่นจุดได้อย่างลื่นไหล พร้อมสลับแผนที่ฐานได้ตามต้องการ (OpenStreetMap, ภาพถ่ายดาวเทียม, Dark Mode, ภูมิประเทศ)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">
                            {isEn ? 'D-MIND Disaster Management Platform © 2026' : 'แพลตฟอร์มจัดการและเตือนภัยพิบัติ D-MIND © 2026'}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/')}
                                className="font-semibold"
                            >
                                {isEn ? 'Back to Home' : 'กลับสู่หน้าหลัก'}
                            </Button>
                            <Button
                                onClick={() => navigate('/disaster-map')}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg"
                            >
                                <MapPin className="w-4 h-4 mr-2" />
                                {isEn ? 'Open Disaster Map' : 'เปิดแผนที่ภัยพิบัติ'}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DisasterMapUpdateArticle;
