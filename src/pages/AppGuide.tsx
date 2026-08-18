
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Map, Bot, Phone, BookOpen, Bell, Star, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLogo from '@/components/AppLogo';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const AppGuide: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="container max-w-lg mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white mr-3 hover:bg-white/10 rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <AppLogo size="md" className="mr-3" />
            <h1 className="text-xl font-bold">{t('appGuide.title')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-lg mx-auto p-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-muted border border-border">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold"
            >
              {t('appGuide.tabOverview')}
            </TabsTrigger>
            <TabsTrigger 
              value="features"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold"
            >
              {t('appGuide.tabFeatures')}
            </TabsTrigger>
            <TabsTrigger 
              value="tips"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold"
            >
              {t('appGuide.tabTips')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="bg-muted/40 border-b border-border">
                <CardTitle className="text-primary flex items-center text-lg">
                  <AppLogo size="sm" className="mr-2" />
                  {t('appGuide.welcomeTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t('appGuide.welcomeDesc')}
                </p>
                <div className="bg-primary/5 border border-primary/15 p-3.5 rounded-xl">
                  <h3 className="font-semibold text-primary mb-2 text-sm">{t('appGuide.corePurposes')}:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                    <li>{t('appGuide.purpose1')}</li>
                    <li>{t('appGuide.purpose2')}</li>
                    <li>{t('appGuide.purpose3')}</li>
                    <li>{t('appGuide.purpose4')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground mb-3 text-sm">{t('appGuide.gettingStarted')}</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <p className="text-xs text-muted-foreground">{t('appGuide.step1')}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <p className="text-xs text-muted-foreground">{t('appGuide.step2')}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <p className="text-xs text-muted-foreground">{t('appGuide.step3')}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">4</div>
                    <p className="text-xs text-muted-foreground">{t('appGuide.step4')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <Map className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-600 dark:text-green-400 text-sm">{t('nav.disasterMap')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('appGuide.featMapDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <Bot className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-purple-600 dark:text-purple-400 text-sm">{t('nav.drMindAi')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('appGuide.featAiDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{t('appGuide.featGuideTitle')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('appGuide.featGuideDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <Phone className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-600 dark:text-red-400 text-sm">{t('nav.emergencyContacts')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('appGuide.featContactsDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Bell className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-600 dark:text-amber-400 text-sm">{t('nav.alerts')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('appGuide.featAlertsDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <MessageSquare className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-600 dark:text-red-400 text-sm">{t('nav.victimReport')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('appGuide.featVictimDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground mb-3 text-sm">{t('appGuide.tipsHeader')}</h3>
                <div className="space-y-3">
                  <div className="bg-amber-500/10 p-3 rounded-xl border-l-4 border-amber-500">
                    <h4 className="font-medium text-amber-600 dark:text-amber-400 text-xs">💡 {t('appGuide.tip1Title')}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('appGuide.tip1Desc')}
                    </p>
                  </div>

                  <div className="bg-green-500/10 p-3 rounded-xl border-l-4 border-green-500">
                    <h4 className="font-medium text-green-600 dark:text-green-400 text-xs">✅ {t('appGuide.tip2Title')}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('appGuide.tip2Desc')}
                    </p>
                  </div>

                  <div className="bg-blue-500/10 p-3 rounded-xl border-l-4 border-primary">
                    <h4 className="font-medium text-primary text-xs">📱 {t('appGuide.tip3Title')}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('appGuide.tip3Desc')}
                    </p>
                  </div>

                  <div className="bg-red-500/10 p-3 rounded-xl border-l-4 border-red-500">
                    <h4 className="font-medium text-red-600 dark:text-red-400 text-xs">🚨 {t('appGuide.tip4Title')}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('appGuide.tip4Desc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground mb-3 text-sm">{t('appGuide.faqHeader')}</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-foreground">Q: {t('appGuide.faq1Q')}</h4>
                    <p className="text-muted-foreground mt-1">A: {t('appGuide.faq1A')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Q: {t('appGuide.faq2Q')}</h4>
                    <p className="text-muted-foreground mt-1">A: {t('appGuide.faq2A')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Q: {t('appGuide.faq3Q')}</h4>
                    <p className="text-muted-foreground mt-1">A: {t('appGuide.faq3A')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppGuide;

