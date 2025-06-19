
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DisasterStatistic {
  id: string;
  disaster_type: string;
  province: string;
  date: string;
  count: number;
  severity_level: number;
  affected_area: number;
  metadata: any;
}

interface ComprehensiveStats {
  totalIncidents: number;
  mostAffectedProvince: string;
  mostCommonDisaster: string;
  recentTrend: 'increasing' | 'decreasing' | 'stable';
  severityDistribution: { [key: number]: number };
  provinceRanking: { province: string; count: number }[];
  disasterTypeDistribution: { type: string; count: number; percentage: number }[];
  monthlyTrends: { month: string; count: number }[];
  criticalAreas: { province: string; severity: number; lastIncident: string }[];
}

export const useEnhancedDisasterStatistics = (dateRange: string = '30days') => {
  const [statistics, setStatistics] = useState<DisasterStatistic[]>([]);
  const [comprehensiveStats, setComprehensiveStats] = useState<ComprehensiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const { data, error } = await supabase
        .from('disaster_statistics')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading statistics:', error);
        return;
      }

      setStatistics(data || []);
      
      if (data && data.length > 0) {
        const totalIncidents = data.reduce((sum, stat) => sum + stat.count, 0);
        
        // Province statistics
        const provinceStats = data.reduce((acc: Record<string, number>, stat) => {
          acc[stat.province] = (acc[stat.province] || 0) + stat.count;
          return acc;
        }, {});
        
        const provinceRanking = Object.entries(provinceStats)
          .map(([province, count]) => ({ province, count }))
          .sort((a, b) => b.count - a.count);
          
        const mostAffectedProvince = provinceRanking[0]?.province || '';

        // Disaster type distribution
        const disasterStats = data.reduce((acc: Record<string, number>, stat) => {
          acc[stat.disaster_type] = (acc[stat.disaster_type] || 0) + stat.count;
          return acc;
        }, {});
        
        const disasterTypeDistribution = Object.entries(disasterStats)
          .map(([type, count]) => ({
            type,
            count,
            percentage: Math.round((count / totalIncidents) * 100)
          }))
          .sort((a, b) => b.count - a.count);
          
        const mostCommonDisaster = disasterTypeDistribution[0]?.type || '';

        // Severity distribution
        const severityDistribution = data.reduce((acc: Record<number, number>, stat) => {
          acc[stat.severity_level] = (acc[stat.severity_level] || 0) + stat.count;
          return acc;
        }, {});

        // Monthly trends
        const monthlyData = data.reduce((acc: Record<string, number>, stat) => {
          const month = new Date(stat.date).toLocaleDateString('th-TH', { 
            year: 'numeric', 
            month: 'short' 
          });
          acc[month] = (acc[month] || 0) + stat.count;
          return acc;
        }, {});
        
        const monthlyTrends = Object.entries(monthlyData)
          .map(([month, count]) => ({ month, count }))
          .sort();

        // Critical areas (high severity recent incidents)
        const criticalAreas = data
          .filter(stat => stat.severity_level >= 3)
          .reduce((acc: Record<string, any>, stat) => {
            if (!acc[stat.province] || new Date(stat.date) > new Date(acc[stat.province].lastIncident)) {
              acc[stat.province] = {
                province: stat.province,
                severity: stat.severity_level,
                lastIncident: stat.date
              };
            }
            return acc;
          }, {});

        // Trend calculation
        const recentData = data.slice(0, Math.floor(data.length / 2));
        const olderData = data.slice(Math.floor(data.length / 2));
        const recentAvg = recentData.reduce((sum, stat) => sum + stat.count, 0) / (recentData.length || 1);
        const olderAvg = olderData.reduce((sum, stat) => sum + stat.count, 0) / (olderData.length || 1);
        
        let recentTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (recentData.length > 0 && olderData.length > 0) {
          if (recentAvg > olderAvg * 1.1) recentTrend = 'increasing';
          else if (recentAvg < olderAvg * 0.9) recentTrend = 'decreasing';
        }

        setComprehensiveStats({
          totalIncidents,
          mostAffectedProvince,
          mostCommonDisaster,
          recentTrend,
          severityDistribution,
          provinceRanking: provinceRanking.slice(0, 10),
          disasterTypeDistribution,
          monthlyTrends,
          criticalAreas: Object.values(criticalAreas).slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error in loadStatistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  return {
    statistics,
    comprehensiveStats,
    isLoading,
    loadStatistics
  };
};
