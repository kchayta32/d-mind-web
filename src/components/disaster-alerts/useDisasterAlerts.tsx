
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
    earthquakeMagnitude: [0],
    rainIntensity: [0],
    floodLevel: [0]
  });

  const fetchAlerts = async (): Promise<DisasterAlert[]> => {
    let query = supabase
      .from('disaster_alerts')
      .select('*')
      .order('start_time', { ascending: false });

    // Apply basic filters
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

    let filteredData = data as DisasterAlert[];

    // Apply advanced filters
    if (filters.earthquakeMagnitude && filters.earthquakeMagnitude[0] > 0) {
      filteredData = filteredData.filter(alert => 
        alert.type === 'earthquake' && 
        alert.magnitude && 
        alert.magnitude >= filters.earthquakeMagnitude![0]
      );
    }

    if (filters.rainIntensity && filters.rainIntensity[0] > 0) {
      filteredData = filteredData.filter(alert => 
        alert.type === 'heavyrain' && 
        alert.rain_intensity && 
        alert.rain_intensity >= filters.rainIntensity![0]
      );
    }

    if (filters.floodLevel && filters.floodLevel[0] > 0) {
      filteredData = filteredData.filter(alert => 
        alert.type === 'flood' && 
        alert.flood_level && 
        alert.flood_level >= filters.floodLevel![0]
      );
    }

    return filteredData;
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
