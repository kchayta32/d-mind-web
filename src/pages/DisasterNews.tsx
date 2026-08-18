import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Waves, Flame, CloudSun, MapPin, 
  RefreshCw, Search, Filter, AlertTriangle, 
  ExternalLink, Clock, ShieldAlert, BarChart3, 
  CheckCircle2, X, Activity, Droplets, Wind
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageProvider';

interface DisasterItem {
  id: string;
  title: string;
  category_id: 'natural' | 'hazard' | 'forecast';
  category_label: string;
  category_icon: string;
  disaster_type?: string;
  hazard_type?: string;
  forecast_type?: string;
  description?: string;
  summary?: string;
  detail?: string;
  location_name?: string;
  province?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  magnitude?: number;
  depth_km?: number;
  severity_level?: string;
  warning_level?: string;
  status?: string;
  source_name: string;
  source_url?: string;
  image_url?: string;
  event_time?: string;
  incident_time?: string;
  created_at: string;
  temperature_max?: number;
  temperature_min?: number;
  rainfall_probability?: string;
  metadata?: any;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80";

const DisasterNews: React.FC = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [items, setItems] = useState<DisasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'natural' | 'hazard' | 'forecast' | 'map' | 'stats'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<DisasterItem | null>(null);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const allItems: DisasterItem[] = [];

      // 1. Fetch natural_disasters
      const { data: naturalData } = await supabase
        .from('natural_disasters' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (naturalData && Array.isArray(naturalData)) {
        naturalData.forEach((row: any) => {
          allItems.push({
            ...row,
            category_id: 'natural',
            category_label: 'ภัยธรรมชาติ',
            category_icon: '🌊',
            image_url: row.image_url || DEFAULT_IMAGE,
          });
        });
      }

      // 2. Fetch disaster_hazards
      const { data: hazardData } = await supabase
        .from('disaster_hazards' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (hazardData && Array.isArray(hazardData)) {
        hazardData.forEach((row: any) => {
          allItems.push({
            ...row,
            category_id: 'hazard',
            category_label: 'ภัยพิบัติฉุกเฉิน',
            category_icon: '🔥',
            image_url: row.image_url || DEFAULT_IMAGE,
          });
        });
      }

      // 3. Fetch weather_forecasts
      const { data: forecastData } = await supabase
        .from('weather_forecasts' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (forecastData && Array.isArray(forecastData)) {
        forecastData.forEach((row: any) => {
          allItems.push({
            ...row,
            category_id: 'forecast',
            category_label: 'พยากรณ์อากาศ',
            category_icon: '🌦️',
            image_url: row.image_url || DEFAULT_IMAGE,
          });
        });
      }

      // If Supabase tables are empty or being initialized, fallback to static / public dataset
      if (allItems.length === 0) {
        // Fetch from local cache API or public endpoint
        try {
          const res = await fetch('/news_web_data.json');
          if (res.ok) {
            const fallback = await res.json();
            allItems.push(...fallback);
          }
        } catch {
          // Ignore
        }
      }

      // Sort by newest
      allItems.sort((a, b) => {
        const timeA = new Date(a.event_time || a.incident_time || a.created_at).getTime();
        const timeB = new Date(b.event_time || b.incident_time || b.created_at).getTime();
        return timeB - timeA;
      });

      setItems(allItems);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching disaster news:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลข่าวสารได้ในขณะนี้',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (activeTab !== 'all' && activeTab !== 'map' && activeTab !== 'stats' && item.category_id !== activeTab) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all') {
        const sev = (item.severity_level || item.warning_level || '').toLowerCase();
        if (selectedSeverity === 'critical' && !sev.includes('วิกฤต') && !sev.includes('รุนแรง') && !sev.includes('ฉุกเฉิน')) return false;
        if (selectedSeverity === 'warning' && !sev.includes('เตือน')) return false;
        if (selectedSeverity === 'watch' && !sev.includes('เฝ้าระวัง') && !sev.includes('ปกติ')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = (item.description || item.summary || item.detail || '').toLowerCase().includes(q);
        const locMatch = (item.province || item.location_name || '').toLowerCase().includes(q);
        const srcMatch = (item.source_name || '').toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !locMatch && !srcMatch) return false;
      }

      return true;
    });
  }, [items, activeTab, selectedSeverity, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const naturalCount = items.filter(i => i.category_id === 'natural').length;
    const hazardCount = items.filter(i => i.category_id === 'hazard').length;
    const forecastCount = items.filter(i => i.category_id === 'forecast').length;
    const urgentCount = items.filter(i => {
      const s = (i.severity_level || i.warning_level || '').toLowerCase();
      return s.includes('วิกฤต') || s.includes('รุนแรง') || (i.magnitude && i.magnitude >= 5.0);
    }).length;

    return { total: items.length, natural: naturalCount, hazard: hazardCount, forecast: forecastCount, urgent: urgentCount };
  }, [items]);

  // Urgent alerts for top ticker
  const urgentAlerts = useMemo(() => {
    return items.filter(i => {
      const s = (i.severity_level || i.warning_level || '').toLowerCase();
      return s.includes('วิกฤต') || s.includes('รุนแรง') || (i.magnitude && i.magnitude >= 5.0);
    }).slice(0, 5);
  }, [items]);

  const handleRefresh = async () => {
    setIsScraping(true);
    toast({
      title: 'กำลังรีเฟรชข้อมูล',
      description: 'กำลังตรวจสอบข้อมูลล่าสุดจาก TMD, Air4Thai, และ USGS...',
    });
    await fetchData();
    setIsScraping(false);
    toast({
      title: 'อัปเดตเรียบร้อย',
      description: 'ดึงข้อมูลสถานการณ์ล่าสุดสำเร็จแล้ว',
    });
  };

  const getSeverityBadge = (item: DisasterItem) => {
    const sev = item.severity_level || item.warning_level || 'เฝ้าระวัง';
    if (sev.includes('วิกฤต') || sev.includes('รุนแรง') || sev.includes('ฉุกเฉิน')) {
      return <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium">🔴 {sev}</Badge>;
    }
    if (sev.includes('เตือน')) {
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium">🟡 {sev}</Badge>;
    }
    return <Badge className="bg-sky-500 hover:bg-sky-600 text-white font-medium">🔵 {sev}</Badge>;
  };

  return (
    <MainLayout className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white border-b border-sky-800/40 py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> {t('disasterNews.badge')}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                {t('disasterNews.title')}
              </h1>
              <p className="text-sky-200/80 text-sm md:text-base mt-2 max-w-2xl">
                {t('disasterNews.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isScraping}
                className="bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 gap-2 font-semibold"
              >
                <RefreshCw className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
                {isScraping ? t('disasterNews.refreshing') : t('disasterNews.refresh')}
              </Button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-slate-900/80 border-sky-800/40 backdrop-blur-sm cursor-pointer hover:border-sky-500/50 transition-all text-white" onClick={() => setActiveTab('all')}>
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">{t('disasterNews.totalData')}</div>
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-sky-800/40 backdrop-blur-sm cursor-pointer hover:border-sky-500/50 transition-all text-white" onClick={() => setActiveTab('natural')}>
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">{t('disasterNews.naturalDisasters')}</div>
                  <div className="text-2xl font-bold text-sky-300">{stats.natural}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-sky-800/40 backdrop-blur-sm cursor-pointer hover:border-sky-500/50 transition-all text-white" onClick={() => setActiveTab('hazard')}>
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">{t('disasterNews.emergencyHazards')}</div>
                  <div className="text-2xl font-bold text-amber-300">{stats.hazard}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-sky-800/40 backdrop-blur-sm cursor-pointer hover:border-sky-500/50 transition-all text-white" onClick={() => setActiveTab('forecast')}>
              <CardContent className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">{t('disasterNews.weatherForecast')}</div>
                  <div className="text-2xl font-bold text-cyan-300">{stats.forecast}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Urgent Alert Banner */}
      {urgentAlerts.length > 0 && (
        <div className="bg-red-500/10 border-y border-red-500/30 px-4 py-2.5">
          <div className="container mx-auto max-w-6xl flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" /> Urgent Alert
            </span>
            <div className="overflow-hidden whitespace-nowrap text-red-600 dark:text-red-300 text-ellipsis font-medium">
              {urgentAlerts.map(a => `⚠️ ${a.title} (${a.source_name})`).join('  •  ')}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-border pb-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            className={activeTab === 'all' ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'text-muted-foreground hover:text-foreground'}
            onClick={() => setActiveTab('all')}
          >
            <Globe className="w-4 h-4 mr-2" /> {t('disasterNews.tabAll')}
          </Button>

          <Button
            variant={activeTab === 'natural' ? 'default' : 'ghost'}
            className={activeTab === 'natural' ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'text-muted-foreground hover:text-foreground'}
            onClick={() => setActiveTab('natural')}
          >
            <Waves className="w-4 h-4 mr-2" /> {t('disasterNews.tabNatural')}
          </Button>

          <Button
            variant={activeTab === 'hazard' ? 'default' : 'ghost'}
            className={activeTab === 'hazard' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-muted-foreground hover:text-foreground'}
            onClick={() => setActiveTab('hazard')}
          >
            <Flame className="w-4 h-4 mr-2" /> {t('disasterNews.tabHazard')}
          </Button>

          <Button
            variant={activeTab === 'forecast' ? 'default' : 'ghost'}
            className={activeTab === 'forecast' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'text-muted-foreground hover:text-foreground'}
            onClick={() => setActiveTab('forecast')}
          >
            <CloudSun className="w-4 h-4 mr-2" /> {t('disasterNews.tabForecast')}
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('disasterNews.searchPlaceholder')}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2.5 outline-none focus:border-sky-500 w-full sm:w-48 shadow-sm"
            >
              <option value="all">{t('disasterNews.allSeverities')}</option>
              <option value="critical">🔴 {t('disasterNews.severityHigh')}</option>
              <option value="warning">🟡 {t('disasterNews.severityMedium')}</option>
              <option value="watch">🔵 {t('disasterNews.severityLow')}</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span>{t('disasterNews.title')}</span>
            <Badge variant="secondary" className="bg-muted text-primary">
              {filteredItems.length}
            </Badge>
          </h2>
          <span className="text-xs text-muted-foreground">
            {lastUpdated.toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US')}
          </span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="text-muted-foreground text-sm mt-4">{t('common.loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 bg-card border border-border rounded-2xl p-8 shadow-sm">
            <Wind className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground">{t('disasterNews.noDataFound')}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {t('common.noData')}
            </p>
          </div>
        )}

        {/* News Cards Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
              >
                <Card 
                  className="bg-card border-border hover:border-sky-500/50 transition-all overflow-hidden flex flex-col h-full group cursor-pointer shadow-md hover:shadow-lg card-hover"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <img 
                      src={item.image_url || DEFAULT_IMAGE} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-white/20 text-xs">
                        {item.category_icon} {item.category_label}
                      </Badge>
                      {getSeverityBadge(item)}
                    </div>
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-500" />
                        {item.province || item.location_name || (language === 'th' ? 'ประเทศไทย' : 'Thailand')}
                      </span>
                      {item.magnitude && (
                        <span className="text-amber-500 font-semibold">
                          M {item.magnitude}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed mb-4 flex-1">
                      {item.summary || item.description || item.detail}
                    </p>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[180px] font-medium text-foreground">
                        {item.source_name}
                      </span>
                      <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {t('disasterNews.viewDetails')} &rarr;
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border text-card-foreground rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-muted text-foreground flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-56 w-full bg-muted">
                <img 
                  src={selectedItem.image_url || DEFAULT_IMAGE} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center gap-2">
                  <Badge className="bg-sky-600 text-white font-medium">
                    {selectedItem.category_icon} {selectedItem.category_label}
                  </Badge>
                  {getSeverityBadge(selectedItem)}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {selectedItem.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-500" /> {selectedItem.province || selectedItem.location_name || (language === 'th' ? 'ประเทศไทย' : 'Thailand')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-muted-foreground" /> {t('disasterNews.source')}: {selectedItem.source_name}
                  </span>
                </div>

                <div className="text-foreground text-sm leading-relaxed space-y-4 mb-6 whitespace-pre-line">
                  {selectedItem.detail || selectedItem.description || selectedItem.summary}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-muted/40 p-4 rounded-xl border border-border text-xs mb-6">
                  {selectedItem.magnitude && (
                    <div>
                      <span className="text-muted-foreground block">{t('disasterNews.magnitude')}</span>
                      <span className="text-amber-500 font-bold text-sm">M {selectedItem.magnitude}</span>
                    </div>
                  )}
                  {selectedItem.depth_km && (
                    <div>
                      <span className="text-muted-foreground block">{t('disasterNews.depth')}</span>
                      <span className="text-foreground font-semibold">{selectedItem.depth_km} km</span>
                    </div>
                  )}
                  {selectedItem.temperature_max && (
                    <div>
                      <span className="text-muted-foreground block">{t('disasterNews.temperature')}</span>
                      <span className="text-red-500 font-semibold">{selectedItem.temperature_max} °C</span>
                    </div>
                  )}
                  {selectedItem.rainfall_probability && (
                    <div>
                      <span className="text-muted-foreground block">{t('disasterNews.rainProb')}</span>
                      <span className="text-sky-500 font-semibold">{selectedItem.rainfall_probability}</span>
                    </div>
                  )}
                  {selectedItem.latitude && selectedItem.longitude && (
                    <div>
                      <span className="text-muted-foreground block">{t('disasterNews.location')}</span>
                      <span className="text-foreground">{selectedItem.latitude.toFixed(2)}, {selectedItem.longitude.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3">
                  {selectedItem.source_url && (
                    <Button 
                      onClick={() => window.open(selectedItem.source_url, '_blank')}
                      className="bg-sky-600 hover:bg-sky-700 text-white gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> {t('disasterNews.source')}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedItem(null)} className="border-border text-foreground hover:bg-muted">
                    {t('disasterNews.close')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default DisasterNews;
