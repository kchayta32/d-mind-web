
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AirPollutionData, AirPollutionStats } from './types';

// Mock data structure since the air pollution API needs further investigation
const generateMockAirData = (): AirPollutionData[] => {
  const stations: AirPollutionData[] = [];
  
  // Generate some mock air pollution stations around Thailand
  const locations = [
    { lat: 13.7563, lng: 100.5018, name: 'กรุงเทพมหานคร' },
    { lat: 18.7883, lng: 98.9853, name: 'เชียงใหม่' },
    { lat: 15.2469, lng: 104.8670, name: 'ขอนแก่น' },
    { lat: 7.8804, lng: 98.3923, name: 'ภูเก็ต' },
    { lat: 12.6868, lng: 101.2228, name: 'ชลบุรี' }
  ];
  
  locations.forEach((location, index) => {
    const pm25 = Math.random() * 150; // Random PM2.5 value
    
    stations.push({
      id: `station-${index + 1}`,
      lat: location.lat + (Math.random() - 0.5) * 0.1,
      lng: location.lng + (Math.random() - 0.5) * 0.1,
      pm25: pm25,
      aod443: Math.random() * 2,
      ssa443: Math.random(),
      no2trop: Math.random() * 100,
      so2: Math.random() * 50,
      o3total: Math.random() * 300,
      uvai: Math.random() * 5,
      timestamp: new Date().toISOString()
    });
  });
  
  return stations;
};

export const useAirPollutionData = () => {
  const [stations, setStations] = useState<AirPollutionData[]>([]);
  const [stats, setStats] = useState<AirPollutionStats>({
    totalStations: 0,
    averagePM25: 0,
    maxPM25: 0,
    unhealthyStations: 0,
    last24Hours: 0
  });

  // For now, use mock data as the air pollution API needs further investigation
  const { data, isLoading, error } = useQuery({
    queryKey: ['air-pollution'],
    queryFn: async () => {
      console.log('Generating mock air pollution data...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return generateMockAirData();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  useEffect(() => {
    if (data) {
      console.log('Air pollution data updated:', data);
      setStations(data);

      // Calculate statistics
      const totalStations = data.length;
      const pm25Values = data.map(station => station.pm25 || 0).filter(pm25 => pm25 > 0);
      const averagePM25 = pm25Values.length > 0 
        ? pm25Values.reduce((sum, pm25) => sum + pm25, 0) / pm25Values.length 
        : 0;
      const maxPM25 = pm25Values.length > 0 ? Math.max(...pm25Values) : 0;
      const unhealthyStations = data.filter(station => (station.pm25 || 0) > 75).length;

      const newStats = {
        totalStations,
        averagePM25: Math.round(averagePM25),
        maxPM25: Math.round(maxPM25),
        unhealthyStations,
        last24Hours: totalStations // All data is current
      };

      console.log('Calculated air pollution stats:', newStats);
      setStats(newStats);
    }
  }, [data]);

  const refetch = () => {
    console.log('Refetching air pollution data...');
  };

  console.log('useAirPollutionData returning:', { 
    stations: stations.length, 
    stats, 
    isLoading, 
    error 
  });

  return {
    stations,
    stats,
    isLoading,
    error,
    refetch
  };
};
