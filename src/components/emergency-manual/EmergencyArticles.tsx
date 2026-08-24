import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Smartphone,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  LayoutGrid,
  List,
  Waves,
  Flame,
  CloudRain,
  Shield,
  Activity,
  Wind,
  X
} from 'lucide-react';
import { ImprovedArticleTimeline } from './ImprovedArticleTimeline';
import { useLanguage } from '@/contexts/LanguageProvider';

export interface EmergencyArticleItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  created_at: string;
  category: 'banner' | 'flood' | 'air' | 'earthquake' | 'general';
  categoryLabel: string;
  readTime: string;
  isBanner?: boolean;
  bannerBadge?: string;
  icon?: React.ReactNode;
}

const EmergencyArticles: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const articles = useMemo<EmergencyArticleItem[]>(() => [
    // Banner 4: Disaster Map Platform Upgrade
    {
      id: 'disaster-map-system-update',
      title: isEn
        ? 'D-MIND Disaster Map Platform Upgrade: GISTDA Satellite Data, Live Radar & Real-Time GIS'
        : 'อัปเดตใหญ่ระบบแผนที่ภัยพิบัติ D-MIND Web: ผสานรวมดาวเทียม GISTDA, เรดาร์ฝนสด และสถิติเชิงพื้นที่ Real-time',
      subtitle: isEn ? 'D-MIND GIS & Engineering Team' : 'จาก ทีมพัฒนา D-MIND GIS & Engineering',
      description: isEn
        ? 'Comprehensive report on the major Web Disaster Map upgrade (August 2026): Integrating GISTDA WMS satellite layers, RainViewer animated rain radar player, USGS earthquake tracking, and dynamic time-series analytical dashboards.'
        : 'สรุปการพัฒนาระบบแผนที่ภัยพิบัติบนเว็บไซค์: เพิ่มชั้นข้อมูลดาวเทียม GISTDA WMS/WFS (น้ำท่วมขัง/จุดความร้อน VIIRS/รอยไหม้), เรดาร์ตรวจจับกลุ่มฝนสด RainViewer, เฝ้าระวังแผ่นดินไหว USGS และกราฟวิเคราะห์แนวโน้มครบวงจร',
      image: '/dmind-premium-icon.png',
      created_at: '2026-08-18',
      category: 'banner',
      categoryLabel: isEn ? 'Disaster Map GIS' : 'แผนที่ภัยพิบัติ GIS',
      readTime: isEn ? '6 min read' : '6 นาที',
      isBanner: true,
      bannerBadge: isEn ? 'Banner #4 • Disaster Map v2.0' : 'แบนเนอร์ที่ 4 • แผนที่ภัยพิบัติ v2.0',
      icon: <Waves className="w-5 h-5 text-cyan-400" />
    },
    // Banner 3: Mobile Native Android v2.0
    {
      id: 'mobile-app-development',
      title: isEn
        ? 'D-MIND Mobile App Progress: Full Migration to Native Android 2.0 with 5-Tier Architecture'
        : 'รายงานความก้าวหน้า D-MIND Mobile App: ยกระดับสู่ Native Android 2.0 สถาปัตยกรรม 5 ชั้น',
      subtitle: isEn ? 'D-MIND Mobile Core Team' : 'จาก ทีมพัฒนา D-MIND Mobile Core',
      description: isEn
        ? 'Milestone report on the migration to 100% native Kotlin & Jetpack Compose, featuring 5-tier architecture, 7-layer disaster map, 3-level FCM push notifications, and full offline reliability.'
        : 'สรุปการพัฒนาแอปพลิเคชันมือถือ D-MIND แบบ Native 100% พัฒนาด้วย Kotlin และ Jetpack Compose พร้อมสถาปัตยกรรม 5 ชั้น แผนที่ 7 ชั้นข้อมูล และระบบแจ้งเตือน FCM 3 ระดับ',
      image: '/dmind-premium-icon.png',
      created_at: '2026-05-28',
      category: 'banner',
      categoryLabel: isEn ? 'Mobile Engineering' : 'วิศวกรรมโมบายล์',
      readTime: isEn ? '7 min read' : '7 นาที',
      isBanner: true,
      bannerBadge: isEn ? 'Banner #3 • Mobile v2.0' : 'แบนเนอร์ที่ 3 • Mobile v2.0',
      icon: <Smartphone className="w-5 h-5 text-teal-400" />
    },
    // Banner 2: System Update v2.0
    {
      id: 'system-update-v2',
      title: isEn
        ? '2 Days of Transformation! D-MIND UI Overhaul & Offline Background Alerts'
        : '2 วันแห่งการเปลี่ยนแปลง! D-MIND ยกระดับสู่เวอร์ชันล่าสุด (UI Overhaul & Background Alerts)',
      subtitle: isEn ? 'D-MIND Core Systems Team' : 'จาก ทีมพัฒนาระบบ D-MIND',
      description: isEn
        ? 'Major upgrade with Modern Blue-White theme redesign, offline background email alerts, and an integrated meteorological tools and forecasting hub.'
        : 'พลิกโฉมหน้าตาใหม่ (UI Overhaul) ด้วยดีไซน์ Modern Blue-White Theme ระบบแจ้งเตือนภัยแม้ออฟไลน์ผ่าน E-mail และฮับเครื่องมือคำนวณและพยากรณ์อากาศครบวงจร',
      image: '/dmind-premium-icon.png',
      created_at: '2026-04-15',
      category: 'banner',
      categoryLabel: isEn ? 'System Update' : 'อัปเดตระบบ',
      readTime: isEn ? '5 min read' : '5 นาที',
      isBanner: true,
      bannerBadge: isEn ? 'Banner #2 • System Update' : 'แบนเนอร์ที่ 2 • อัปเดตระบบ',
      icon: <Sparkles className="w-5 h-5 text-blue-400" />
    },
    // Banner 1: D-MIND Launch
    {
      id: 'dmind-app-launch',
      title: isEn
        ? 'Get Ready for "D-MIND": Learning Innovation to Intelligent Warning Application'
        : 'เตรียมพบกับ "D-MIND" นวัตกรรมการเรียนรู้สู่แอปพลิเคชันเตือนภัยอัจฉริยะ',
      subtitle: isEn ? 'D-MIND Education Team' : 'จาก ทีมพัฒนา D-MIND Education',
      description: isEn
        ? 'D-MIND proudly presents an educational application focused on applying AI & IoT technologies for disaster preparedness and intelligent surveillance.'
        : 'D-MIND ภูมิใจนำเสนอผลงานการพัฒนาแอปพลิเคชันเพื่อการศึกษา ที่มุ่งเน้นการนำเทคโนโลยี AI และ IoT มาประยุกต์ใช้ในการเฝ้าระวังและรับมือภัยพิบัติอย่างมีประสิทธิภาพ',
      image: '/dmind-premium-icon.png',
      created_at: '2026-03-10',
      category: 'banner',
      categoryLabel: isEn ? 'App Launch' : 'เปิดตัวแอปพลิเคชัน',
      readTime: isEn ? '4 min read' : '4 นาที',
      isBanner: true,
      bannerBadge: isEn ? 'Banner #1 • App Launch' : 'แบนเนอร์ที่ 1 • เปิดตัวแอป',
      icon: <Smartphone className="w-5 h-5 text-green-400" />
    },
    // Article 5
    {
      id: 'pm25-clean-air-act-2025',
      title: "PM2.5 ทำป่วย จี้รัฐบาลใหม่ 60 วันแรก เร่งคืน 'กองทุนอากาศสะอาด' สู่ร่างกฎหมาย",
      subtitle: 'จาก bangkokbiznews.com',
      description: 'ผู้เชี่ยวชาญเรียกร้องให้รัฐบาลใหม่เร่งนำร่าง พ.ร.บ. อากาศสะอาด กลับมาพิจารณาภายใน 60 วัน โดยต้องคง "กองทุนอากาศสะอาด" และมาตรการทางเศรษฐศาสตร์ไว้',
      image: '/lovable-uploads/20251219_1.webp',
      created_at: '2025-12-19',
      category: 'air',
      categoryLabel: isEn ? 'PM2.5 & Policy' : 'ฝุ่น PM2.5 & นโยบาย',
      readTime: isEn ? '5 min read' : '5 นาที'
    },
    // Article 6
    {
      id: 'weather-warning-cold-2025',
      title: 'สภาพอากาศแปรปรวน "หนาวเย็นลง" เตือน 22-26 ธ.ค. อุณหภูมิลดฮวบ',
      subtitle: 'จาก ข่าวสด ONLINE',
      description: 'กรมอุตุนิยมวิทยาประกาศเตือนมวลอากาศเย็นระลอกใหม่จากประเทศจีนแผ่ปกคลุมประเทศไทยตอนบน ส่งผลให้อุณหภูมิลดลงฉับพลัน พร้อมลมแรงในช่วงวันที่ 22-26 ธันวาคมนี้',
      image: '/lovable-uploads/weather_warning_cold.png',
      created_at: '2025-12-22',
      category: 'flood',
      categoryLabel: isEn ? 'Climate & Weather' : 'สภาพอากาศ & ฤดูกาล',
      readTime: isEn ? '3 min read' : '3 นาที'
    },
    // Article 7
    {
      id: 'sri-lanka-flood-2025',
      title: 'ศรีลังกาเผชิญมหาอุทกภัย "ที่ท้าทายที่สุด" ในประวัติศาสตร์ประเทศ เสียชีวิตแล้วทะลุ 300 ราย',
      subtitle: 'จาก BBC NEWS ไทย',
      description: 'ศรีลังกากำลังเผชิญกับวิกฤตอุทกภัยครั้งใหญ่ที่สุดในประวัติศาสตร์ของประเทศ โดยยอดผู้เสียชีวิตล่าสุดพุ่งสูงทะลุ 300 รายแล้ว',
      image: '/lovable-uploads/2025121_1.webp',
      created_at: '2025-12-01',
      category: 'flood',
      categoryLabel: isEn ? 'Flood Crisis' : 'มหาอุทกภัยสากล',
      readTime: isEn ? '4 min read' : '4 นาที'
    },
    // Article 8
    {
      id: 'air-quality-index',
      title: 'คู่มือดัชนีคุณภาพอากาศ (Air Quality Index - AQI)',
      subtitle: 'จาก airtw.moenv.gov.tw',
      description: 'ดัชนีคุณภาพอากาศและตัวบ่งชี้มลพิษทางอากาศ เกณฑ์การวัดค่า และคำแนะนำการปฏิบัติตนตามระดับสีแจ้งเตือน',
      image: '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png',
      created_at: '2025-05-15',
      category: 'air',
      categoryLabel: isEn ? 'AQI Guide' : 'คู่มือดัชนี AQI',
      readTime: isEn ? '4 min read' : '4 นาที'
    },
    // Article 9
    {
      id: 'uv-aerosol-index',
      title: 'UV Aerosol Index: การติดตามอนุภาคแขวนลอยในชั้นบรรยากาศ',
      subtitle: 'จาก earthdata.nasa.gov',
      description: 'ดัชนี UV Aerosol สำหรับติดตามอนุภาคฝุ่นควันและละอองลอยในชั้นบรรยากาศจากภาพถ่ายดาวเทียม NASA',
      image: '/lovable-uploads/7799a9ff-3b81-4e41-9c7b-b6054d5e7b62.png',
      created_at: '2025-06-15',
      category: 'air',
      categoryLabel: isEn ? 'Satellite & Aerosol' : 'ดาวเทียม & ละอองลอย',
      readTime: isEn ? '5 min read' : '5 นาที'
    },
    // Article 10
    {
      id: 'air-pollution-control-program',
      title: 'Air Pollution Control Program: โครงการควบคุมมลพิษอากาศ',
      subtitle: 'จาก air.moenv.gov.tw',
      description: 'โครงการควบคุมมลพิษอากาศและมาตรการจัดการคุณภาพอากาศเชิงบูรณาการเพื่อลดผลกระทบต่อสิ่งแวดล้อม',
      image: '/lovable-uploads/9b24d25c-901c-4aaf-98dd-78419a5984cd.png',
      created_at: '2025-05-10',
      category: 'air',
      categoryLabel: isEn ? 'Air Quality Control' : 'การควบคุมมลพิษ',
      readTime: isEn ? '4 min read' : '4 นาที'
    },
    // Article 11
    {
      id: 'weather-forecast-july-2025',
      title: 'พยากรณ์อากาศและสภาพภูมิอากาศเชิงพื้นที่',
      subtitle: 'จาก กรมอุตุนิยมวิทยา',
      description: 'การพยากรณ์อากาศและสภาพภูมิอากาศ วิเคราะห์แนวโน้มหย่อมความกดอากาศต่ำและปริมาณฝนสะสม',
      image: '/lovable-uploads/9ee04c09-ef87-44e4-b06d-424087a59578.png',
      created_at: '2025-06-05',
      category: 'flood',
      categoryLabel: isEn ? 'Weather Forecast' : 'พยากรณ์อากาศ',
      readTime: isEn ? '3 min read' : '3 นาที'
    },
    // Article 12
    {
      id: 'natural-disasters',
      title: 'ภัยธรรมชาติในประเทศไทย: สถิติและรูปแบบความเสี่ยง',
      subtitle: 'จาก กรมป้องกันและบรรเทาสาธารณภัย',
      description: 'ข้อมูลสถิติภัยธรรมชาติที่เกิดขึ้นในประเทศไทย แนวทางแผนเผชิญเหตุและการบรรเทาสาธารณภัยเชิงรุก',
      image: '/lovable-uploads/aa72c068-2cf3-4b36-be9e-a7eb6351cb9d.png',
      created_at: '2025-05-12',
      category: 'general',
      categoryLabel: isEn ? 'Disaster Statistics' : 'สถิติภัยธรรมชาติ',
      readTime: isEn ? '4 min read' : '4 นาที'
    },
    // Article 13
    {
      id: 'earthquake-3countries',
      title: 'แผ่นดินไหวในภูมิภาคเอเชียตะวันออกเฉียงใต้ (ไทย-เมียนมาร์-ลาว)',
      subtitle: 'จาก USGS และ TMD',
      description: 'ข้อมูลแนวรอยเลื่อนที่มีพลัง แผ่นดินไหวในไทย เมียนมาร์ และลาว พร้อมการคำนวณคลื่นไหวสะเทือน',
      image: '/dmind-premium-icon.png',
      created_at: '2025-05-25',
      category: 'earthquake',
      categoryLabel: isEn ? 'Seismic Activity' : 'รอยเลื่อน & แผ่นดินไหว',
      readTime: isEn ? '5 min read' : '5 นาที'
    },
    // Article 14
    {
      id: 'disaster-20years',
      title: 'สถิติและแนวโน้มภัยพิบัติ 20 ปีที่ผ่านมา ในยุคโลกเดือด',
      subtitle: 'จาก องค์การบรรเทาทุกข์แห่งชาติ',
      description: 'สถิติและแนวโน้มของภัยพิบัติในช่วง 20 ปีที่ผ่านมา ผลกระทบของการเปลี่ยนแปลงสภาพภูมิอากาศโลก',
      image: '/lovable-uploads/bc9cca0f-39cd-462c-a13b-c60172f3fd2e.png',
      created_at: '2025-05-01',
      category: 'general',
      categoryLabel: isEn ? '20-Year Climate Data' : 'ข้อมูลย้อนหลัง 20 ปี',
      readTime: isEn ? '6 min read' : '6 นาที'
    },
    // Article 15
    {
      id: 'pm25-vs-pm10',
      title: 'PM2.5 vs PM10: ความแตกต่าง ขนาดอนุภาค และผลกระทบสุขภาพ',
      subtitle: 'จาก กรมควบคุมมลพิษ',
      description: 'เปรียบเทียบคุณสมบัติ ขนาดอนุภาค ช่องทางการเข้าสู่ระบบทางเดินหายใจ และผลกระทบระยะยาวของ PM2.5 และ PM10',
      image: '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png',
      created_at: '2025-05-10',
      category: 'air',
      categoryLabel: isEn ? 'Health & Particles' : 'อนุภาค & สุขภาพ',
      readTime: isEn ? '4 min read' : '4 นาที'
    },
    // Article 16
    {
      id: 'earthquake-response-guide',
      title: '20 ปี ไทยสูญเสียจาก \'ภัยพิบัติ\' แค่ไหน ในวันที่โลกกำลังเผชิญกับความรุนแรงจาก \'โลกรวน\'',
      subtitle: 'จาก thairath.co.th',
      description: 'วิธีรับมือแผ่นดินไหว ควรทำอย่างไร มีข้อห้ามอะไรบ้าง บทเรียนจากภัยพิบัติใหญ่ในอดีต',
      image: 'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa5K33t0GHlpONycxjrqHvHm6kPoArPPyVyaiSbN7K5XZ3mw0omYY.jpg',
      created_at: '2025-06-10',
      category: 'earthquake',
      categoryLabel: isEn ? 'Earthquake Survival' : 'การเอาตัวรอดจากแผ่นดินไหว',
      readTime: isEn ? '5 min read' : '5 นาที'
    }
  ], [isEn]);

  // Banner articles subset
  const bannerArticles = useMemo(() => {
    return articles.filter(a => a.isBanner);
  }, [articles]);

  // Categories list
  const categories = [
    { id: 'all', label: t('manual.allCategories'), icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'banner', label: t('manual.catBanners'), icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'flood', label: t('manual.catFlood'), icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'air', label: t('manual.catAir'), icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'earthquake', label: t('manual.catEarthquake'), icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'banner' && !article.isBanner) return false;
        if (selectedCategory !== 'banner' && article.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchSubtitle = article.subtitle.toLowerCase().includes(q);
        const matchDesc = article.description.toLowerCase().includes(q);
        const matchCat = article.categoryLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchSubtitle && !matchDesc && !matchCat) return false;
      }

      // Date range filter
      if (dateRange) {
        const articleDate = new Date(article.created_at);
        if (articleDate < dateRange.start || articleDate > dateRange.end) return false;
      }

      return true;
    });
  }, [articles, selectedCategory, searchQuery, dateRange]);

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleShowAllDates = () => {
    setDateRange(null);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateRange(null);
  };

  return (
    <div className="space-y-10">

      {/* SECTION 1: Featured Banner Articles Carousel/Grid */}
      <div className="bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-slate-950 p-6 md:p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
                  {isEn ? 'Home Page Banners' : 'บทความเด่นจากแบนเนอร์หน้าหลัก'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                {t('manual.featuredArticles')}
              </h2>
            </div>
            <Badge className="w-fit bg-white/10 text-blue-200 border-white/20 text-xs px-3 py-1">
              {bannerArticles.length} {isEn ? 'Banners Active' : 'แบนเนอร์ทั้งหมด'}
            </Badge>
          </div>

          {/* Grid of 4 Banner Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerArticles.map((article) => (
              <Card
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-slate-900/80 hover:bg-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
              >
                <div className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div>
                    {/* Card Top Meta */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge className="bg-gradient-to-r from-blue-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[11px] font-semibold flex items-center gap-1.5">
                        {article.icon}
                        <span>{article.bannerBadge}</span>
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                      {article.title}
                    </h3>

                    {/* Subtitle & Description */}
                    <p className="text-xs text-slate-400 font-medium mb-2">{article.subtitle}</p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(article.created_at).toLocaleDateString(isEn ? 'en-US' : 'th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t('manual.readArticle')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Search, Category Filters & Timeline */}
      <div className="space-y-4 pt-2">
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('manual.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 bg-card border-border rounded-xl shadow-sm focus-visible:ring-primary h-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-muted-foreground font-medium">
              {filteredArticles.length} {isEn ? 'Articles' : 'บทความ'}
            </span>
            <div className="flex items-center p-1 bg-muted rounded-xl border border-border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2.5 rounded-lg"
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2.5 rounded-lg"
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full h-9 px-4 text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'shadow-md shadow-primary/20'
                  : 'bg-card hover:bg-muted border-border'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </Button>
          ))}
        </div>

        {/* Timeline Filter */}
        <ImprovedArticleTimeline
          onDateRangeChange={handleDateRangeChange}
          onShowAll={handleShowAllDates}
          articles={articles}
        />
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'all' || dateRange) && (
        <div className="flex items-center justify-between p-3 bg-muted/60 rounded-xl border border-border text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-primary" /> ตัวกรองที่ใช้งาน:
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                ค้นหา: "{searchQuery}"
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                หมวดหมู่: {categories.find(c => c.id === selectedCategory)?.label}
              </Badge>
            )}
            {dateRange && (
              <Badge variant="secondary" className="gap-1">
                ช่วงเวลาที่เลือก
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="h-7 text-xs text-primary hover:text-primary/80"
          >
            {t('manual.resetFilter')}
          </Button>
        </div>
      )}

      {/* SECTION 3: Main Articles Feed */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border-border/80 bg-card overflow-hidden group flex flex-col justify-between"
              onClick={() => handleArticleClick(article.id)}
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Image / Banner Header */}
                <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-900">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    onError={(e) => {
                      // Fallback image handler
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex gap-2">
                    {article.isBanner ? (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold border-0 shadow-md flex items-center gap-1 text-xs">
                        <Sparkles className="w-3 h-3" /> แบนเนอร์เด่น
                      </Badge>
                    ) : (
                      <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-xs">
                        {article.categoryLabel}
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="text-[11px] bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-300" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1.5">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mb-2">{article.subtitle}</p>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {new Date(article.created_at).toLocaleDateString(isEn ? 'en-US' : 'th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="font-semibold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {t('manual.readArticle')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="grid gap-3.5">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 border-border bg-card overflow-hidden group"
              onClick={() => handleArticleClick(article.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch">
                  <div className="w-full sm:w-44 h-36 sm:h-auto shrink-0 overflow-hidden relative bg-slate-900">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.isBanner && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold border-0">
                        ✨ แบนเนอร์
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <Badge variant="outline" className="text-[11px] font-medium border-primary/30 text-primary">
                          {article.categoryLabel}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3 text-primary" />
                          {new Date(article.created_at).toLocaleDateString(isEn ? 'en-US' : 'th-TH', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit'
                          })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {article.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-border text-xs">
                      <span className="text-muted-foreground">{article.subtitle}</span>
                      <span className="font-semibold text-primary flex items-center gap-1">
                        {t('manual.readArticle')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-1">
                {t('manual.noArticlesFound')}
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                ลองปรับคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นหาบทความที่คุณต้องการ
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="rounded-full px-6"
            >
              {t('manual.resetFilter')}
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default EmergencyArticles;
