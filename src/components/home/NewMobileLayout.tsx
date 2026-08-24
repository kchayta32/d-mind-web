import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Phone,
  Star,
  BookOpen,
  Info,
  Moon,
  Sun,
  Globe,
  MapPin,
  CloudSun,
  AlertTriangle,
  FileText,
  Bot,
  Mail,
  HeartHandshake,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import NewsCarousel from './NewsCarousel';
import MapBanner from './MapBanner';
import AppDownloadSection from './AppDownloadSection';
import Footer from '@/components/layout/Footer';

const NewMobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const isEn = language === 'en';

  const quickActions = [
    { icon: <Home className="w-5 h-5" />, label: t('menu.home'), route: '/', id: 'home' },
    { icon: <CloudSun className="w-5 h-5" />, label: t('menu.disasterNews'), route: '/disaster-news', id: 'news' },
    { icon: <MapPin className="w-5 h-5" />, label: t('menu.map'), route: '/disaster-map', id: 'map' },
    { icon: <Phone className="w-5 h-5" />, label: t('menu.emergency'), route: '/contacts', id: 'emergency' },
    { icon: <Bot className="w-5 h-5" />, label: t('menu.assistant'), route: '/assistant', id: 'assistant' },
  ];

  const serviceCategories = [
    {
      title: isEn ? '🚨 Emergency & Response' : '🚨 บริการฉุกเฉิน & แจ้งเหตุ',
      items: [
        {
          id: 'emergency',
          title: t('menu.emergency'),
          desc: t('navCards.emergencyDesc'),
          icon: Phone,
          route: '/contacts',
          badge: isEn ? '24/7 Hotline' : 'สายด่วน 24 ชม.',
          gradient: 'from-red-500/15 via-red-500/5 to-transparent',
          iconBg: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20',
          accent: 'border-red-500/30'
        },
        {
          id: 'victim',
          title: t('menu.victim'),
          desc: t('navCards.victimDesc'),
          icon: HeartHandshake,
          route: '/victim-reports',
          badge: isEn ? 'SOS Tracking' : 'ติดตามผู้ประสบภัย',
          gradient: 'from-orange-500/15 via-orange-500/5 to-transparent',
          iconBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20',
          accent: 'border-orange-500/30'
        },
        {
          id: 'incident',
          title: t('menu.incident'),
          desc: t('navCards.incidentDesc'),
          icon: AlertTriangle,
          route: '/incident-reports',
          badge: isEn ? 'Live Report' : 'แจ้งเหตุทันที',
          gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
          iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
          accent: 'border-amber-500/30'
        },
      ]
    },
    {
      title: isEn ? '🛰️ Monitoring & Intelligence' : '🛰️ ศูนย์เฝ้าระวัง & ระบบอัจฉริยะ',
      items: [
        {
          id: 'news',
          title: t('menu.disasterNews'),
          desc: t('navCards.disasterNewsDesc'),
          icon: CloudSun,
          route: '/disaster-news',
          badge: isEn ? 'Live Weather' : 'พยากรณ์สด & ข่าว',
          gradient: 'from-sky-500/15 via-sky-500/5 to-transparent',
          iconBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20',
          accent: 'border-sky-500/30'
        },
        {
          id: 'map',
          title: t('menu.map'),
          desc: isEn ? 'Interactive 7-layer Web GIS map' : 'แผนที่ดาวเทียม & เรดาร์ฝนสด 7 ชั้นข้อมูล',
          icon: MapPin,
          route: '/disaster-map',
          badge: 'GISTDA & USGS',
          gradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
          iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
          accent: 'border-blue-500/30'
        },
        {
          id: 'assistant',
          title: t('menu.assistant'),
          desc: isEn ? '24/7 AI Medical & Disaster Assistant' : 'ผู้เชี่ยวชาญฉุกเฉิน & แพทย์ AI 24 ชม.',
          icon: Bot,
          route: '/assistant',
          badge: 'Dr.Mind AI',
          gradient: 'from-purple-500/15 via-purple-500/5 to-transparent',
          iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
          accent: 'border-purple-500/30'
        },
      ]
    },
    {
      title: isEn ? '📚 Knowledge & Support' : '📚 องค์ความรู้ & สนับสนุน',
      items: [
        {
          id: 'manual',
          title: t('menu.research'),
          desc: t('navCards.researchDesc'),
          icon: BookOpen,
          route: '/manual',
          badge: isEn ? 'Research Hub' : 'คู่มือ & วิจัย',
          gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
          iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          accent: 'border-emerald-500/30'
        },
        {
          id: 'survey',
          title: t('menu.survey'),
          desc: t('navCards.surveyDesc'),
          icon: Star,
          route: '/satisfaction-survey',
          badge: isEn ? 'Feedback' : 'แบบประเมิน',
          gradient: 'from-yellow-500/15 via-yellow-500/5 to-transparent',
          iconBg: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
          accent: 'border-yellow-500/30'
        },
        {
          id: 'contact',
          title: t('menu.contact'),
          desc: t('navCards.contactDesc'),
          icon: Mail,
          route: '/contactme',
          badge: isEn ? 'Super AI' : 'ทีมพัฒนา D-MIND',
          gradient: 'from-indigo-500/15 via-indigo-500/5 to-transparent',
          iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          accent: 'border-indigo-500/30'
        },
        {
          id: 'about',
          title: t('menu.about'),
          desc: t('navCards.aboutDesc'),
          icon: Info,
          href: 'https://d-mind.my.canva.site/',
          badge: isEn ? 'Canva Web' : 'รายละเอียดโครงการ',
          gradient: 'from-pink-500/15 via-pink-500/5 to-transparent',
          iconBg: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20',
          accent: 'border-pink-500/30'
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 transition-colors duration-300">
      {/* Mobile Top Header */}
      <header className="bg-card/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-40">
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <img
                  src="/dmind-premium-icon.png"
                  alt="D-MIND Logo"
                  className="h-8 w-8 drop-shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-foreground tracking-tight leading-tight flex items-center gap-1.5">
                  <span>D-MIND</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-semibold bg-primary/10 text-primary border-primary/20">
                    v2.0
                  </Badge>
                </h1>
                <p className="text-[10px] text-muted-foreground font-medium">Disaster Intelligence Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground/80 hover:text-foreground rounded-full hover:bg-muted"
                onClick={toggleTheme}
                title={t('theme.toggleTheme')}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 rounded-full border-border bg-background/50 hover:bg-muted text-xs font-semibold"
                onClick={toggleLanguage}
                title={t('menu.changeLanguage')}
              >
                <Globe className="h-3 w-3 mr-1 text-primary" />
                <span>{language.toUpperCase()}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner - NewsCarousel with Full Parity to PC */}
      <section className="w-full">
        <NewsCarousel />
      </section>

      {/* Live System & GIS Status Bar */}
      <div className="px-4 -mt-2 relative z-20">
        <div className="bg-card/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                <span>{isEn ? 'Live Monitoring Active' : 'ระบบเฝ้าระวังภัยพิบัติออนไลน์'}</span>
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {isEn ? '24/7 GISTDA Satellites & TMD Radars' : 'เชื่อมต่อดาวเทียม GISTDA & เรดาร์ TMD 24 ชม.'}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate('/disaster-map')}
            className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold shadow-sm flex-shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {isEn ? 'Map' : 'แผนที่'}
          </Button>
        </div>
      </div>

      {/* Main Content & Service Categories Grid */}
      <div className="px-4 py-6 space-y-6">
        {serviceCategories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-3">
            <h3 className="text-sm font-bold text-foreground px-1 flex items-center justify-between">
              <span>{cat.title}</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {cat.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer bg-gradient-to-r ${item.gradient} bg-card border-border/80 hover:border-primary/40 shadow-sm transition-all duration-200 active:scale-[0.98] rounded-2xl overflow-hidden`}
                    onClick={() => {
                      if (item.href) {
                        window.open(item.href, '_blank');
                      } else if (item.route) {
                        navigate(item.route);
                      }
                    }}
                  >
                    <CardContent className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs flex-shrink-0 ${item.iconBg}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                            {item.badge && (
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium bg-background/50 border-border text-muted-foreground flex-shrink-0">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{item.desc}</p>
                        </div>
                      </div>

                      <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground flex-shrink-0">
                        {item.href ? (
                          <ExternalLink className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Map Banner Section */}
      <div className="px-2">
        <MapBanner />
      </div>

      {/* App Download Section */}
      <div className="px-2">
        <AppDownloadSection />
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom Navigation Dock */}
      <nav className="fixed bottom-3 left-3 right-3 bg-card/90 dark:bg-slate-950/90 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-2xl z-40 p-1">
        <div className="grid grid-cols-5 items-center">
          {quickActions.map((action) => {
            const isActive = location.pathname === action.route;
            return (
              <button
                key={action.id}
                onClick={() => navigate(action.route)}
                className={`relative flex flex-col items-center justify-center py-2 transition-all duration-200 rounded-xl ${
                  isActive
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {action.icon}
                <span className="text-[9px] mt-0.5 line-clamp-1">{action.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default NewMobileLayout;

