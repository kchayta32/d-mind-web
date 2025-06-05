
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface GISTDAHotspot {
  id: string;
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    _id: string;
    acq_date: string;
    acq_time: string;
    amphoe: string;
    ap_tn: string;
    bright_t31?: number;
    bright_ti4?: number;
    bright_ti5?: number;
    brightness?: number;
    changwat: string;
    confidence: number | string;
    ct_tn: string;
    frp: number;
    hotspotid: string;
    instrument: string;
    latitude: number;
    longitude: number;
    lu_name: string;
    pv_tn: string;
    satellite: string;
    scan: number;
    tambol: string;
    tb_tn: string;
    th_date: string;
    th_time: string;
    track: number;
    version: string;
    village: string;
  };
}

export interface GISTDAData {
  type: string;
  features: GISTDAHotspot[];
  timeStamp: string;
  numberMatched: number;
  numberReturned: number;
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
const API_BASE_URL = 'https://disaster.gistda.or.th/api/1.0/documents/fire';

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

  // Fetch MODIS data with proper API key header
  const { data: modisData, isLoading: isLoadingModis, error: modisError } = useQuery({
    queryKey: ['gistda-modis'],
    queryFn: async () => {
      console.log('Fetching GISTDA MODIS data...');
      
      const response = await fetch(`${API_BASE_URL}/hotspot/modis/3days?limit=1000&offset=0`, {
        headers: {
          'accept': 'application/json',
          'API-Key': API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GISTDA MODIS data: ${response.status}`);
      }

      const data = await response.json();
      console.log('GISTDA MODIS data fetched:', data);
      return data as GISTDAData;
    },
    refetchInterval: 900000, // Refresh every 15 minutes
  });

  // Fetch VIIRS data with proper API key header
  const { data: viirsData, isLoading: isLoadingViirs, error: viirsError } = useQuery({
    queryKey: ['gistda-viirs'],
    queryFn: async () => {
      console.log('Fetching GISTDA VIIRS data...');
      
      const response = await fetch(`${API_BASE_URL}/hotspot/viirs/3days?limit=1000&offset=0`, {
        headers: {
          'accept': 'application/json',
          'API-Key': API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GISTDA VIIRS data: ${response.status}`);
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
    
    // Calculate high confidence count (handle both numeric and string confidence values)
    const highConfidenceCount = combinedHotspots.filter(h => {
      const confidence = h.properties.confidence;
      if (typeof confidence === 'number') {
        return confidence >= 80;
      } else if (typeof confidence === 'string') {
        return confidence === 'nominal' || confidence === 'high';
      }
      return false;
    }).length;
    
    // Calculate average confidence (only for numeric values)
    const numericConfidences = combinedHotspots
      .map(h => h.properties.confidence)
      .filter(c => typeof c === 'number') as number[];
    
    const averageConfidence = numericConfidences.length > 0 
      ? numericConfidences.reduce((sum, c) => sum + c, 0) / numericConfidences.length 
      : 0;

    // Calculate last 24 hours (all data is already from recent days)
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
