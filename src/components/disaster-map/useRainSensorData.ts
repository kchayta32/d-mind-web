
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RainSensor, RainSensorStats } from './types';

// Mock coordinates for rain sensors (in real app, these would be stored in database)
const mockCoordinates: Record<string, [number, number]> = {
  // Thailand coordinates spread across the country
  default: [13.7563, 100.5018], // Bangkok
};

const generateMockCoordinates = (id: string): [number, number] => {
  // Generate consistent coordinates based on sensor ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lat = 8 + (hash % 15); // Thailand latitude range roughly 8-23
  const lng = 97 + (hash % 8); // Thailand longitude range roughly 97-105
  return [lat + (hash % 100) / 1000, lng + (hash % 100) / 1000];
};

export const useRainSensorData = () => {
  const [sensors, setSensors] = useState<RainSensor[]>([]);
  const [stats, setStats] = useState<RainSensorStats>({
    total: 0,
    activeRaining: 0,
    averageHumidity: 0,
    maxHumidity: 0,
    last24Hours: 0
  });

  const { data: sensorData, isLoading, error, refetch } = useQuery({
    queryKey: ['rain-sensors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('from_rain_sensor')
        .select('*')
        .order('inserted_at', { ascending: false });

      if (error) {
        console.error('Error fetching rain sensor data:', error);
        throw error;
      }

      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (sensorData) {
      // Transform the data to include coordinates
      const transformedSensors: RainSensor[] = sensorData.map(sensor => ({
        ...sensor,
        coordinates: mockCoordinates[sensor.id] || generateMockCoordinates(sensor.id)
      }));

      setSensors(transformedSensors);

      // Calculate statistics
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const recentSensors = transformedSensors.filter(sensor => 
        new Date(sensor.inserted_at) >= last24Hours
      );

      const activeRaining = transformedSensors.filter(sensor => sensor.is_raining).length;
      const humidityValues = transformedSensors
        .filter(sensor => sensor.humidity !== null)
        .map(sensor => sensor.humidity);
      
      const averageHumidity = humidityValues.length > 0 
        ? humidityValues.reduce((sum, h) => sum + h, 0) / humidityValues.length 
        : 0;
      
      const maxHumidity = humidityValues.length > 0 
        ? Math.max(...humidityValues) 
        : 0;

      setStats({
        total: transformedSensors.length,
        activeRaining,
        averageHumidity: Math.round(averageHumidity),
        maxHumidity,
        last24Hours: recentSensors.length
      });
    }
  }, [sensorData]);

  return {
    sensors,
    stats,
    isLoading,
    error,
    refetch
  };
};
