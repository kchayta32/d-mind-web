
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealtimeAlertDisplay from '@/components/alerts/RealtimeAlertDisplay';
import AlertsList from '@/components/disaster-alerts/AlertsList';
import AlertFilters from '@/components/disaster-alerts/AlertFilters';
import { useSharedDisasterAlerts } from '@/hooks/useSharedDisasterAlerts';
import { useState } from 'react';
import { AlertsFilterState } from '@/components/disaster-alerts/types';

const Alerts = () => {
  const navigate = useNavigate();
  const { alerts, isLoading } = useSharedDisasterAlerts();
  const [filters, setFilters] = useState<AlertsFilterState>({
    types: [],
    severity: [],
    activeOnly: true
  });

  // Get unique types and severities from alerts
  const availableTypes = [...new Set(alerts.map(alert => alert.type))];
  const availableSeverities = [...new Set(alerts.map(alert => alert.severity))];

  // Update filters function
  const updateFilters = (newFilters: Partial<AlertsFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filter alerts based on current filters
  const filteredAlerts = alerts.filter(alert => {
    if (filters.activeOnly && !alert.is_active) return false;
    if (filters.types.length > 0 && !filters.types.includes(alert.type)) return false;
    if (filters.severity.length > 0 && !filters.severity.includes(alert.severity)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับหน้าหลัก
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">การแจ้งเตือนภัยพิบัติ</h1>
              <p className="text-gray-600">ติดตามการแจ้งเตือนและข้อมูลภัยพิบัติ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="realtime">การแจ้งเตือนแบบ Real-time</TabsTrigger>
            <TabsTrigger value="historical">ข้อมูลภัยพิบัติ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime" className="space-y-6">
            <RealtimeAlertDisplay />
          </TabsContent>
          
          <TabsContent value="historical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <AlertFilters 
                  filters={filters} 
                  updateFilters={updateFilters}
                  availableTypes={availableTypes}
                  availableSeverities={availableSeverities}
                />
              </div>
              <div className="lg:col-span-3">
                <AlertsList alerts={filteredAlerts} isLoading={isLoading} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Alerts;
