
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisasterAlerts } from '@/components/disaster-alerts/useDisasterAlerts';
import AlertFilters from '@/components/disaster-alerts/AlertFilters';
import AlertsList from '@/components/disaster-alerts/AlertsList';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';

const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const { 
    alerts, 
    isLoading, 
    filters, 
    updateFilters, 
    refetch, 
    alertTypes, 
    severityLevels 
  } = useDisasterAlerts();

  return (
    <div className="min-h-screen bg-guardian-light-bg">
      {/* Header */}
      <header className="bg-guardian-purple text-white p-4">
        <div className="container mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white mr-2" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">การแจ้งเตือนภัยพิบัติอื่นๆ</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 max-w-3xl">
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
        </div>
        
        <AlertFilters
          filters={filters}
          updateFilters={updateFilters}
          availableTypes={alertTypes}
          availableSeverities={severityLevels}
        />
        
        <AlertsList
          alerts={alerts}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Alerts;
