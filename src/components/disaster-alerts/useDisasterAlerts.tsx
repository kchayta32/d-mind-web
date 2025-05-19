
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DisasterAlert, AlertsFilterState } from './types';
import { toast } from '@/components/ui/use-toast';

export const useDisasterAlerts = () => {
  const [filters, setFilters] = useState<AlertsFilterState>({
    types: [],
    severity: [],
    activeOnly: true,
  });

  const fetchAlerts = async (): Promise<DisasterAlert[]> => {
    let query = supabase
      .from('disaster_alerts')
      .select('*')
      .order('start_time', { ascending: false });

    // Apply filters
    if (filters.activeOnly) {
      query = query.eq('is_active', true);
    }

    if (filters.types.length > 0) {
      query = query.in('type', filters.types);
    }

    if (filters.severity.length > 0) {
      query = query.in('severity', filters.severity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching disaster alerts:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการเตือนภัยได้",
        variant: "destructive",
      });
      return [];
    }

    return data as DisasterAlert[];
  };

  const { data: alerts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['disaster-alerts', filters],
    queryFn: fetchAlerts,
    refetchInterval: 60000, // Refresh data every minute
  });

  const alertTypes = [...new Set(alerts.map(alert => alert.type))];
  const severityLevels = [...new Set(alerts.map(alert => alert.severity))];

  const updateFilters = (newFilters: Partial<AlertsFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    alerts,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch,
    alertTypes,
    severityLevels
  };
};
