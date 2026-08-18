
import React from 'react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import LocationBasedAlerts from '@/components/notifications/LocationBasedAlerts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-full w-10 h-10 p-0 border-border bg-card hover:bg-muted text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t('settings.notificationsTitle')}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {t('settings.notificationsDesc')}
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
          <p className="text-primary font-medium text-sm">
            {t('settings.appNotice')}
          </p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-3 bg-muted border border-border">
            <TabsTrigger value="settings" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs font-semibold">{t('settings.generalTab')}</TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs font-semibold">{t('settings.locationTab')}</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs font-semibold">{t('settings.historyTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="location">
            <LocationBasedAlerts />
          </TabsContent>

          <TabsContent value="history">
            <NotificationHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationSettings;

