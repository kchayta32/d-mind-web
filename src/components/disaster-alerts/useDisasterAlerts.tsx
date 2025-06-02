
import { useState } from 'react';
import { AlertsFilterState } from './types';
import { useSharedDisasterAlerts } from '@/hooks/useSharedDisasterAlerts';

// Thailand's approximate center coordinates
const THAILAND_CENTER: [number, number] = [100.5018, 13.7563]; // [longitude, latitude]

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

export const useDisasterAlerts = () => {
  const [filters, setFilters] = useState<AlertsFilterState>({
    types: [],
    severity: [],
    activeOnly: true,
    earthquakeMagnitude: [0],
    rainIntensity: [0],
    floodLevel: [0],
    earthquakeDistance: [0]
  });

  const { alerts: allAlerts, isLoading, error, refetch } = useSharedDisasterAlerts();

  // Apply filters
  let filteredAlerts = allAlerts;

  if (filters.activeOnly) {
    filteredAlerts = filteredAlerts.filter(alert => alert.is_active);
  }

  if (filters.types.length > 0) {
    filteredAlerts = filteredAlerts.filter(alert => filters.types.includes(alert.type));
  }

  if (filters.severity.length > 0) {
    filteredAlerts = filteredAlerts.filter(alert => filters.severity.includes(alert.severity));
  }

  // Apply advanced filters
  if (filters.earthquakeMagnitude && filters.earthquakeMagnitude[0] > 0) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.type === 'earthquake' && 
      alert.magnitude && 
      alert.magnitude >= filters.earthquakeMagnitude![0]
    );
  }

  if (filters.rainIntensity && filters.rainIntensity[0] > 0) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.type === 'heavyrain' && 
      alert.rain_intensity && 
      alert.rain_intensity >= filters.rainIntensity![0]
    );
  }

  if (filters.floodLevel && filters.floodLevel[0] > 0) {
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.type === 'flood' && 
      alert.flood_level && 
      alert.flood_level >= filters.floodLevel![0]
    );
  }

  // Apply earthquake distance filter
  if (filters.earthquakeDistance && filters.earthquakeDistance[0] > 0) {
    filteredAlerts = filteredAlerts.filter(alert => {
      if (alert.type !== 'earthquake' || !alert.coordinates) return true;
      
      const distance = calculateDistance(THAILAND_CENTER, alert.coordinates);
      const maxDistance = filters.earthquakeDistance![0];
      
      return distance <= maxDistance;
    });
  }

  const alertTypes = [...new Set(allAlerts.map(alert => alert.type))];
  const severityLevels = [...new Set(allAlerts.map(alert => alert.severity))];

  const updateFilters = (newFilters: Partial<AlertsFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    alerts: filteredAlerts,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch,
    alertTypes,
    severityLevels
  };
};
