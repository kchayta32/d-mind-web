import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import VictimReportForm from '@/components/victim-reports/VictimReportForm';
import VictimReportsList from '@/components/victim-reports/VictimReportsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageProvider';

const VictimReports: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  if (isMobile) {
    // Mobile layout
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white p-4 shadow-lg">
          <div className="container max-w-7xl mx-auto flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white mr-3 hover:bg-white/10 rounded-full"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">{t('common.back')}</span>
            </Button>
            <div className="flex items-center">
              <img
                src="/dmind-premium-icon.png"
                alt="D-MIND Logo"
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-xl font-bold">{t('victimReports.title')}</h1>
            </div>
          </div>
        </header>

        {/* Main Content - Responsive Layout */}
        <main className="container max-w-7xl mx-auto p-4">
          <Tabs defaultValue="report" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 max-w-md mx-auto lg:max-w-none">
              <TabsTrigger
                value="report"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                {t('victimReports.tabReport')}
              </TabsTrigger>
              <TabsTrigger
                value="view"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                {t('victimReports.tabView')}
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TabsContent value="report" className="space-y-4 lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-blue-200 dark:border-slate-700 p-4">
                  <h2 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400">{t('victimReports.myStatus')}</h2>
                  <VictimReportForm />
                </div>
              </TabsContent>

              <TabsContent value="view" className="lg:col-span-2">
                <VictimReportsList />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-slate-900 shadow-xl border-r border-blue-100 dark:border-slate-800">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('victimReports.backToHome')}
          </Button>

          <div className="flex items-center mb-6">
            <img
              src="/dmind-premium-icon.png"
              alt="D-MIND Logo"
              className="h-8 w-8 mr-3"
            />
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">{t('victimReports.title')}</h1>
          </div>

          <div className="bg-blue-50 dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400">{t('victimReports.newReportTitle')}</h2>
            <VictimReportForm />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{t('victimReports.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('victimReports.subtitle')}</p>
        </header>

        <div className="flex-1 p-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 h-full">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t('victimReports.listTitle')}</h3>
            </div>
            <div className="p-6 overflow-auto">
              <VictimReportsList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VictimReports;
