import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BookOpen, AlertTriangle, FileText, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmergencyArticles from '@/components/emergency-manual/EmergencyArticles';
import AcademicArticles from '@/components/emergency-manual/AcademicArticles';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPanel from '@/components/admin/AdminPanel';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useLanguage } from '@/contexts/LanguageProvider';

const EmergencyManual: React.FC = () => {
  const [activeTab, setActiveTab] = useState('guidelines');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAuthenticated, login, logout } = useAdminAuth();
  const { t } = useLanguage();

  const handleBackFromLogin = () => {
    setShowAdminLogin(false);
  };

  // Admin Login View
  if (showAdminLogin && !isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-md">
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
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                {t('manual.title')}
              </h1>
              <p className="text-muted-foreground mt-2">{t('manual.subtitle')}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary self-start md:self-center"
              onClick={() => setShowAdminLogin(true)}
            >
              <Shield className="h-4 w-4 mr-2" />
              {t('manual.adminLogin')}
            </Button>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="guidelines" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-start md:justify-center mb-8 overflow-x-auto pb-2 no-scrollbar">
              <TabsList className="inline-flex h-auto p-1 bg-card border shadow-sm rounded-full gap-1 min-w-max">
                <TabsTrigger value="guidelines" className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t('manual.guidelines')}
                </TabsTrigger>
                <TabsTrigger value="articles" className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('manual.articles')}
                </TabsTrigger>
                <TabsTrigger value="academic" className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {t('manual.academic')}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guidelines" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Flood */}
                <Card className="card-hover border-t-4 border-t-blue-500 group overflow-hidden bg-card">
                  <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      🌊 {t('manual.flood')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-muted-foreground list-none text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-blue-400 rounded-full shrink-0" />
                        เคลื่อนย้ายไปยังพื้นที่สูงทันที
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-blue-400 rounded-full shrink-0" />
                        ห้ามเดินหรือขับรถผ่านน้ำไหลเชี่ยว
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-blue-400 rounded-full shrink-0" />
                        ตัดกระแสไฟฟ้าภายในบ้าน
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-blue-400 rounded-full shrink-0" />
                        เตรียมถุงยังชีพและยาที่จำเป็น
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Card 2: Earthquake */}
                <Card className="card-hover border-t-4 border-t-amber-500 group overflow-hidden bg-card">
                  <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
                    <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      🏚️ {t('manual.earthquake')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-muted-foreground list-none text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-amber-400 rounded-full shrink-0" />
                        <strong>"หมอบ ป้อง เกาะ"</strong> เพื่อป้องกันตัว
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-amber-400 rounded-full shrink-0" />
                        อยู่ให้ห่างจากกระจกและเฟอร์นิเจอร์
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-amber-400 rounded-full shrink-0" />
                        ถ้าอยู่ข้างนอก ให้ห่างจากอาคาร
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-amber-400 rounded-full shrink-0" />
                        งดใช้ลิฟต์โดยเด็ดขาด
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Card 3: Fire */}
                <Card className="card-hover border-t-4 border-t-red-500 group overflow-hidden bg-card">
                  <CardHeader className="bg-red-50 dark:bg-red-950/30">
                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      🔥 {t('manual.fire')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 text-muted-foreground list-none text-sm leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-red-400 rounded-full shrink-0" />
                        ใช้ผ้าชุบน้ำปิดจมูกเพื่อกันควัน
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-red-400 rounded-full shrink-0" />
                        ก้มตัวต่ำเมื่อเคลื่อนที่ผ่านควัน
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-red-400 rounded-full shrink-0" />
                        ห้ามใช้ลิฟต์ขณะเกิดเพลิงไหม้
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-red-400 rounded-full shrink-0" />
                        โทร 199 หรือสถานีดับเพลิงทันที
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="articles" className="animate-in slide-in-from-bottom-4 duration-500">
              <EmergencyArticles />
            </TabsContent>

            <TabsContent value="academic" className="animate-in slide-in-from-bottom-4 duration-500">
              <AcademicArticles />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencyManual;
