
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisasterAlerts } from '@/components/disaster-alerts/useDisasterAlerts';
import AlertFilters from '@/components/disaster-alerts/AlertFilters';
import AlertsList from '@/components/disaster-alerts/AlertsList';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageProvider';

const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const {
    alerts,
    isLoading,
    filters,
    updateFilters,
    refetch,
    alertTypes,
    severityLevels
  } = useDisasterAlerts();

  if (isMobile) {
    // Mobile layout
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md sticky top-0 z-40">
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
                className="h-8 w-8 mr-3 drop-shadow-sm"
              />
              <h1 className="text-xl font-bold">{t('alerts.title')}</h1>
            </div>
          </div>
        </header>

        {/* Main Content - Responsive Layout */}
        <main className="container mx-auto p-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="mb-4 flex justify-end lg:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-card hover:bg-muted border-border text-foreground"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('alerts.refresh')}
                </Button>
              </div>

              <AlertFilters
                filters={filters}
                updateFilters={updateFilters}
                availableTypes={alertTypes}
                availableSeverities={severityLevels}
              />
            </div>

            {/* Alerts List */}
            <div className="lg:col-span-3">
              <AlertsList
                alerts={alerts}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-80 bg-card shadow-xl border-r border-border">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4 text-foreground hover:bg-muted"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>

          <div className="flex items-center mb-6">
            <img
              src="/dmind-premium-icon.png"
              alt="D-MIND Logo"
              className="h-8 w-8 mr-3 drop-shadow-sm"
            />
            <h1 className="text-xl font-bold text-foreground">{t('alerts.title')}</h1>
          </div>

          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-card hover:bg-muted border-border text-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('alerts.refresh')}
            </Button>
          </div>

          <AlertFilters
            filters={filters}
            updateFilters={updateFilters}
            availableTypes={alertTypes}
            availableSeverities={severityLevels}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-card shadow-sm border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">{t('alerts.title')}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{t('alerts.subtitle')}</p>
        </header>

        <div className="flex-1 p-6">
          <div className="bg-card rounded-2xl shadow-sm border border-border h-full overflow-hidden">
            <div className="p-6 overflow-auto">
              <AlertsList
                alerts={alerts}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;

