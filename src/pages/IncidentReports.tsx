import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, List, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncidentReportForm from '@/components/incident-reports/IncidentReportForm';
import IncidentReportsList from '@/components/incident-reports/IncidentReportsList';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageProvider';

const IncidentReports: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('list');
  const { t } = useLanguage();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
        {/* Header */}
        <header className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-800 dark:to-red-900 text-white p-4 shadow-lg">
          <div className="container mx-auto max-w-7xl flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white mr-3 hover:bg-white/10 rounded-full"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <img
                src="/dmind-premium-icon.png"
                alt="D-MIND Logo"
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-xl font-bold">{t('incidentReports.title')}</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-4 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                {t('incidentReports.tabList')}
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('incidentReports.tabNew')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <IncidentReportsList />
            </TabsContent>

            <TabsContent value="report" className="mt-6">
              <IncidentReportForm />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-slate-900 shadow-xl border-r border-red-100 dark:border-red-900">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>

          <div className="flex items-center mb-6">
            <img
              src="/dmind-premium-icon.png"
              alt="D-MIND Logo"
              className="h-8 w-8 mr-3"
            />
            <h1 className="text-xl font-bold text-red-700 dark:text-red-400">{t('incidentReports.title')}</h1>
          </div>

          <div className="space-y-3">
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setActiveTab('list')}
            >
              <List className="mr-2 h-4 w-4" />
              {t('incidentReports.tabList')}
            </Button>
            <Button
              variant={activeTab === 'report' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setActiveTab('report')}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('incidentReports.tabNew')}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-700 dark:text-red-400">{t('incidentReports.adviceTitle')}</span>
            </div>
            <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
              <li>• {t('incidentReports.advice1')}</li>
              <li>• {t('incidentReports.advice2')}</li>
              <li>• {t('incidentReports.advice3')}</li>
              <li>• {t('incidentReports.advice4')}</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {activeTab === 'list' ? t('incidentReports.listTitle') : t('incidentReports.newReportTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {activeTab === 'list'
              ? t('incidentReports.listDesc')
              : t('incidentReports.subtitle')
            }
          </p>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'list' ? <IncidentReportsList /> : <IncidentReportForm />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentReports;
