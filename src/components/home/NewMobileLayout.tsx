import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageProvider';

const NewMobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const quickActions = [
    { icon: <Home className="w-5 h-5" />, label: t('menu.home'), route: '/', id: 'home' },
    { icon: <CloudSun className="w-5 h-5" />, label: t('menu.disasterNews'), route: '/disaster-news', id: 'news' },
    { icon: <MapPin className="w-5 h-5" />, label: t('menu.map'), route: '/disaster-map', id: 'map' },
    { icon: <Phone className="w-5 h-5" />, label: t('menu.emergency'), route: '/contacts', id: 'emergency' },
    { icon: <BookOpen className="w-5 h-5" />, label: t('menu.research'), route: '/manual', id: 'manual' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 transition-colors duration-300">
      {/* Mobile Header */}
      <header className="bg-card/90 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="/dmind-premium-icon.png"
                alt="D-MIND Logo"
                className="h-9 w-9 drop-shadow-sm"
              />
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight">D-MIND</h1>
                <p className="text-[11px] text-muted-foreground">Disaster Monitor</p>
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

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-primary to-indigo-700 px-5 py-8 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium mb-3 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {t('hero.subtitle')}
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          {t('hero.welcome')}
        </h2>
        <p className="text-blue-100 text-sm mb-5 leading-relaxed">
          {t('hero.description')}
        </p>
        <div className="flex gap-2.5">
          <Button
            className="flex-1 bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg shadow-blue-900/20"
            onClick={() => navigate('/disaster-map')}
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            {t('hero.exploreMap')}
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold"
            onClick={() => navigate('/disaster-news')}
          >
            <CloudSun className="w-4 h-4 mr-1.5" />
            {t('menu.disasterNews')}
          </Button>
        </div>
      </div>

      {/* Main Content & Service Cards */}
      <div className="px-4 py-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {t('navCards.mainMenu')}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t('navCards.selectService')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/contacts')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.emergency')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.emergencyDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/disaster-news')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-sky-500/10 text-sky-600 dark:text-sky-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <CloudSun className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.disasterNews')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.disasterNewsDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/victim-reports')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.victim')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.victimDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/incident-reports')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.incident')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.incidentDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/satisfaction-survey')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.survey')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.surveyDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/manual')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.research')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.researchDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => navigate('/contactme')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.contact')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.contactDesc')}</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer card-hover bg-card border-border/80 shadow-sm"
            onClick={() => window.open('https://d-mind.my.canva.site/', '_blank')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">{t('menu.about')}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('navCards.aboutDesc')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg z-40">
        <div className="grid grid-cols-5 py-1">
          {quickActions.map((action) => {
            const isActive = location.pathname === action.route;
            return (
              <button
                key={action.id}
                onClick={() => navigate(action.route)}
                className={`flex flex-col items-center justify-center py-2 transition-colors ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {action.icon}
                <span className="text-[10px] mt-1 line-clamp-1">{action.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default NewMobileLayout;

