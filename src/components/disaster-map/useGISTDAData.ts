
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface GISTDAHotspot {
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  properties: {
    confidence: number;
    scan: number;
    track: number;
    acq_date: string;
    acq_time: string;
    satellite: string;
    instrument: string;
    version: string;
    bright_t31: number;
    frp: number;
    daynight: string;
  };
  type: string;
}

export interface GISTDAData {
  type: string;
  features: GISTDAHotspot[];
}

export interface GISTDAStats {
  totalHotspots: number;
  modisCount: number;
  viirsCount: number;
  highConfidenceCount: number;
  averageConfidence: number;
  last24Hours: number;
}

const API_KEY = 'JMGZneff56qsmjWKbyYdYBUbTx8zHHOChXTD1Ogl8jmrEgnHbXiH3H5QvQwN3yg1';
const API_BASE_URL = 'https://api.disaster.gistda.or.th';

export const useGISTDAData = () => {
  const [hotspots, setHotspots] = useState<GISTDAHotspot[]>([]);
  const [stats, setStats] = useState<GISTDAStats>({
    totalHotspots: 0,
    modisCount: 0,
    viirsCount: 0,
    highConfidenceCount: 0,
    averageConfidence: 0,
    last24Hours: 0
  });

  // Fetch MODIS data
  const { data: modisData, isLoading: isLoadingModis, error: modisError } = useQuery({
    queryKey: ['gistda-modis'],
    queryFn: async () => {
      console.log('Fetching GISTDA MODIS data...');
      
      const response = await fetch(`${API_BASE_URL}/hotspot/modis/1day?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GISTDA MODIS data');
      }

      const data = await response.json();
      console.log('GISTDA MODIS data fetched:', data);
      return data as GISTDAData;
    },
    refetchInterval: 900000, // Refresh every 15 minutes
  });

  // Fetch VIIRS data
  const { data: viirsData, isLoading: isLoadingViirs, error: viirsError } = useQuery({
    queryKey: ['gistda-viirs'],
    queryFn: async () => {
      console.log('Fetching GISTDA VIIRS data...');
      
      const response = await fetch(`${API_BASE_URL}/hotspot/viirs/1day?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GISTDA VIIRS data');
      }

      const data = await response.json();
      console.log('GISTDA VIIRS data fetched:', data);
      return data as GISTDAData;
    },
    refetchInterval: 900000, // Refresh every 15 minutes
  });

  useEffect(() => {
    const combinedHotspots: GISTDAHotspot[] = [];
    
    if (modisData?.features) {
      combinedHotspots.push(...modisData.features.map(f => ({
        ...f,
        properties: { ...f.properties, instrument: 'MODIS' }
      })));
    }
    
    if (viirsData?.features) {
      combinedHotspots.push(...viirsData.features.map(f => ({
        ...f,
        properties: { ...f.properties, instrument: 'VIIRS' }
      })));
    }

    console.log('Combined hotspots:', combinedHotspots.length);
    setHotspots(combinedHotspots);

    // Calculate statistics
    const modisCount = modisData?.features?.length || 0;
    const viirsCount = viirsData?.features?.length || 0;
    const totalHotspots = combinedHotspots.length;
    
    const highConfidenceCount = combinedHotspots.filter(h => h.properties.confidence >= 80).length;
    const averageConfidence = totalHotspots > 0 
      ? combinedHotspots.reduce((sum, h) => sum + h.properties.confidence, 0) / totalHotspots 
      : 0;

    // Calculate last 24 hours (all data is already from 1 day)
    const last24Hours = totalHotspots;

    const newStats = {
      totalHotspots,
      modisCount,
      viirsCount,
      highConfidenceCount,
      averageConfidence: Math.round(averageConfidence),
      last24Hours
    };

    console.log('Calculated GISTDA stats:', newStats);
    setStats(newStats);
  }, [modisData, viirsData]);

  const isLoading = isLoadingModis || isLoadingViirs;
  const error = modisError || viirsError;

  const refetch = () => {
    // Trigger refetch for both queries would need to be implemented
    console.log('Refetching GISTDA data...');
  };

  console.log('useGISTDAData returning:', { 
    hotspots: hotspots.length, 
    stats, 
    isLoading, 
    error 
  });

  return {
    hotspots,
    stats,
    isLoading,
    error,
    refetch
  };
};
