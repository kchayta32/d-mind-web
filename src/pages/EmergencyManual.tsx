import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  BookOpen,
  AlertTriangle,
  FileText,
  GraduationCap,
  Waves,
  Flame,
  Wind,
  HeartPulse,
  PhoneCall,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmergencyArticles from '@/components/emergency-manual/EmergencyArticles';
import AcademicArticles from '@/components/emergency-manual/AcademicArticles';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPanel from '@/components/admin/AdminPanel';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useLanguage } from '@/contexts/LanguageProvider';

const EmergencyManual: React.FC = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAuthenticated, login, logout } = useAdminAuth();
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const handleBackFromLogin = () => {
    setShowAdminLogin(false);
  };

  // Admin Login View
  if (showAdminLogin && !isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-md">
          <AdminLogin onLogin={login} onBack={handleBackFromLogin} />
        </div>
      </MainLayout>
    );
  }

  // Admin Panel View
  if (isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">ระบบจัดการบทความ (Admin)</h1>
            <Button variant="outline" onClick={logout}>{t('common.close')}</Button>
          </div>
          <AdminPanel onLogout={logout} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Hero Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-10 mb-10 text-white shadow-2xl border border-blue-500/20">
            {/* Background lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-cyan-400/30">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEn ? 'D-MIND Knowledge & Research Hub' : 'ศูนย์ความรู้และคู่มือภัยพิบัติ D-MIND'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                  {t('manual.title')}
                </h1>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  {t('manual.subtitle')}
                </p>

                {/* Quick Stat Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="bg-white/10 text-cyan-200 border-white/20 text-xs py-1">
                    ✨ 4 บทความแบนเนอร์เด่น
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-blue-200 border-white/20 text-xs py-1">
                    📚 16 บทความเตือนภัย
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-emerald-200 border-white/20 text-xs py-1">
                    🔬 8 งานวิจัยวิชาการ
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-amber-200 border-white/20 text-xs py-1">
                    🚨 6 คู่มือรับมือภัย
                  </Badge>
                </div>
              </div>

              {/* Admin Button */}
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 self-start md:self-center font-medium shadow-md"
                onClick={() => setShowAdminLogin(true)}
              >
                <Shield className="h-4 w-4 mr-2 text-cyan-400" />
                {t('manual.adminLogin')}
              </Button>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <Tabs defaultValue="articles" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-start md:justify-center mb-8 overflow-x-auto pb-2 no-scrollbar">
              <TabsList className="inline-flex h-auto p-1.5 bg-card border border-border shadow-md rounded-full gap-1.5 min-w-max">
                <TabsTrigger
                  value="articles"
                  className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('manual.articles')}</span>
                  <span className="ml-1 text-[11px] px-2 py-0.2 rounded-full bg-white/20">16</span>
                </TabsTrigger>

                <TabsTrigger
                  value="guidelines"
                  className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t('manual.guidelines')}</span>
                  <span className="ml-1 text-[11px] px-2 py-0.2 rounded-full bg-white/20">6</span>
                </TabsTrigger>

                <TabsTrigger
                  value="academic"
                  className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{t('manual.academic')}</span>
                  <span className="ml-1 text-[11px] px-2 py-0.2 rounded-full bg-white/20">8</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: Alert Articles & Banners (Default & Primary Focus) */}
            <TabsContent value="articles" className="animate-in fade-in-50 slide-in-from-bottom-3 duration-500 focus-visible:outline-none">
              <EmergencyArticles />
            </TabsContent>

            {/* TAB 2: Emergency Response Guidelines */}
            <TabsContent value="guidelines" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-3 duration-500 focus-visible:outline-none">

              {/* Guidelines Intro */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    {isEn ? 'Emergency Survival & Action Guidelines' : 'คู่มือขั้นตอนการเอาชีวิตรอดและรับมือเหตุฉุกเฉิน'}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {t('manual.guidelineSubtitle')}
                  </p>
                </div>
              </div>

              {/* 6 Disaster Response Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Flood */}
                <Card className="card-hover border-t-4 border-t-blue-500 overflow-hidden bg-card border-border shadow-sm">
                  <CardHeader className="bg-blue-500/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-lg">
                      <Waves className="w-5 h-5" />
                      {isEn ? 'Flood & Inundation' : '🌊 อุทกภัย & น้ำท่วมฉับพลัน'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2.5 text-muted-foreground list-none text-xs sm:text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>ก่อนน้ำท่วม:</strong> ยกของขึ้นที่สูง ตัดไฟชั้นล่าง เตรียมน้ำดื่มและถุงยังชีพ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>ระหว่างน้ำท่วม:</strong> ห้ามเดินหรือขับรถลุยน้ำเชี่ยว หลีกเลี่ยงปลั๊กไฟและเสาไฟ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>หลังน้ำท่วม:</strong> ตรวจสอบระบบไฟฟ้าก่อนเปิดเบรกเกอร์ ระวังสัตว์มีพิษในบ้าน</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 2. Earthquake */}
                <Card className="card-hover border-t-4 border-t-amber-500 overflow-hidden bg-card border-border shadow-sm">
                  <CardHeader className="bg-amber-500/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-lg">
                      <AlertTriangle className="w-5 h-5" />
                      {isEn ? 'Earthquake & Tremor' : '🏚️ แผ่นดินไหว & อาคารถล่ม'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2.5 text-muted-foreground list-none text-xs sm:text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>หลักสากล:</strong> "หมอบ - ป้อง - เกาะ" ใต้โต๊ะหรือโครงสร้างที่แข็งแรง</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>หากอยู่ในอาคาร:</strong> อยู่ให้ห่างจากหน้าต่างกระจก <strong>ห้ามใช้ลิฟต์เด็ดขาด</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>หากอยู่กลางแจ้ง:</strong> หลบเข้าสู่พื้นที่โล่ง ห่างจากเสาไฟ ป้ายโฆษณา และตึกสูง</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 3. Fire */}
                <Card className="card-hover border-t-4 border-t-red-500 overflow-hidden bg-card border-border shadow-sm">
                  <CardHeader className="bg-red-500/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-lg">
                      <Flame className="w-5 h-5" />
                      {isEn ? 'Fire & Smoke Inhalation' : '🔥 อัคคีภัย & เพลิงไหม้'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2.5 text-muted-foreground list-none text-xs sm:text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>การหนีควันไฟ:</strong> ก้มตัวต่ำ ใช้ผ้าชุบน้ำปิดจมูก ควันลอยขึ้นด้านบน</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>การเปิดประตู:</strong> ใช้หลังมือสัมผัสลูกบิด หากร้อนห้ามเปิดเด็ดขาด</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span><strong>ไฟติดตัว:</strong> หยุด - ทิ้งตัวลงนอน - กลิ้งไปกับพื้นเพื่อดับไฟ</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 4. PM2.5 Air Pollution */}
                <Card className="card-hover border-t-4 border-t-purple-500 overflow-hidden bg-card border-border shadow-sm">
                  <CardHeader className="bg-purple-500/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-lg">
                      <Wind className="w-5 h-5" />
                      {isEn ? 'PM2.5 Air Pollution Crisis' : '🌫️ วิกฤตฝุ่นพิษ PM2.5'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2.5 text-muted-foreground list-none text-xs sm:text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <span><strong>การสวมหน้ากาก:</strong> สวมหน้ากาก N95 ที่แนบสนิทกับใบหน้าเมื่อออกนอกอาคาร</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <span><strong>ห้องปลอดฝุ่น (Clean Room):</strong> ปิดประตูหน้าต่าง ใช้เครื่องฟอกอากาศ HEPA</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <span><strong>กลุ่มเสี่ยง:</strong> เด็กเล็ก ผู้สูงอายุ หญิงตั้งครรภ์ และผู้ป่วยทางเดินหายใจต้องระวังเป็นพิเศษ</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 5. Storm & Lightning */}
                <Card className="card-hover border-t-4 border-t-indigo-500 overflow-hidden bg-card border-border shadow-sm">
                  <CardHeader className="bg-indigo-500/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-lg">
                      <Wind className="w-5 h-5" />
                      {isEn ? 'Storms & Lightning' : '⚡ วาตภัย & พายุฝนฟ้าคะนอง'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2.5 text-muted-foreground list-none text-xs sm:text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span><strong>ป้องกันฟ้าผ่า:</strong> หลบในอาคารที่มิดชิด ห้ามอยู่ใต้ต้นไม้ใหญ่หรือที่โล่งแจ้ง</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span><strong>อุปกรณ์ไฟฟ้า:</strong> ถอดปลั๊กเครื่องใช้ไฟฟ้าทุกชนิดเพื่อป้องกันไฟฟ้ากระชาก</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span><strong>ลมกระโชกแรง:</strong> อยู่ห่างจากผนังกระจกและระเบียง ระวังป้ายโฆษณาหักโค่น</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* 6. First Aid & CPR */}
                <Card className="card-hover border-t-4 border-t-emerald-500 overflow-hidden bg-card border-border shadow-sm">
                  <CardHeader className="bg-emerald-500/10 pb-3">
                    <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-lg">
                      <HeartPulse className="w-5 h-5" />
                      {isEn ? 'First Aid & CPR' : '🏥 การปฐมพยาบาลเบื้องต้น'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2.5 text-muted-foreground list-none text-xs sm:text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>หมดสติไม่หายใจ:</strong> โทร 1669 ทันที และเริ่มทำ CPR กดหน้าอก 100-120 ครั้ง/นาที</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>การห้ามเลือด:</strong> ใช้ผ้าสะอาดกดทับบาดแผลโดยตรง ยกอวัยวะให้สูงกว่าระดับหัวใจ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>แผลไฟไหม้/น้ำร้อนลวก:</strong> ล้างด้วยน้ำสะอาดอุณหภูมิห้อง 10-15 นาที ห้ามใช้น้ำแข็ง</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

              </div>

              {/* Emergency Hotline Quick Dial Bar */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border border-red-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <PhoneCall className="w-5 h-5 text-red-500 animate-bounce" />
                      {t('manual.hotlineHelp')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      กดเพื่อโทรออกไปยังหน่วยงานฉุกเฉินได้ทันทีตลอด 24 ชั่วโมง
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <a
                    href="tel:191"
                    className="p-3 bg-card rounded-xl border border-border shadow-sm hover:border-red-500/50 hover:bg-muted text-center transition-all group"
                  >
                    <div className="text-lg font-black text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">191</div>
                    <div className="text-[11px] text-muted-foreground">ตำรวจ / แจ้งเหตุด่วน</div>
                  </a>

                  <a
                    href="tel:1669"
                    className="p-3 bg-card rounded-xl border border-border shadow-sm hover:border-red-500/50 hover:bg-muted text-center transition-all group"
                  >
                    <div className="text-lg font-black text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">1669</div>
                    <div className="text-[11px] text-muted-foreground">แพทย์ฉุกเฉิน / กู้ชีพ</div>
                  </a>

                  <a
                    href="tel:1784"
                    className="p-3 bg-card rounded-xl border border-border shadow-sm hover:border-red-500/50 hover:bg-muted text-center transition-all group"
                  >
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">1784</div>
                    <div className="text-[11px] text-muted-foreground">สายด่วน ปภ.</div>
                  </a>

                  <a
                    href="tel:199"
                    className="p-3 bg-card rounded-xl border border-border shadow-sm hover:border-red-500/50 hover:bg-muted text-center transition-all group"
                  >
                    <div className="text-lg font-black text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">199</div>
                    <div className="text-[11px] text-muted-foreground">ดับเพลิง & กู้ภัย</div>
                  </a>

                  <a
                    href="tel:1182"
                    className="p-3 bg-card rounded-xl border border-border shadow-sm hover:border-blue-500/50 hover:bg-muted text-center transition-all group col-span-2 sm:col-span-1"
                  >
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">1182</div>
                    <div className="text-[11px] text-muted-foreground">กรมอุตุนิยมวิทยา</div>
                  </a>
                </div>
              </div>

            </TabsContent>

            {/* TAB 3: Academic Articles & Research */}
            <TabsContent value="academic" className="animate-in fade-in-50 slide-in-from-bottom-3 duration-500 focus-visible:outline-none">
              <AcademicArticles />
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencyManual;
