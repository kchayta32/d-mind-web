import { useQuery } from '@tanstack/react-query';
import { GISTDAData } from '../useGISTDAData';
import { GISTDA_CONFIG, getGistdaHeaders, getGistdaFeatureUrl } from '@/services/gistdaService';

const fetchViirsData = async (endpoint: string, periodName: string): Promise<GISTDAData> => {
  console.log(`Fetching GISTDA VIIRS ${periodName} data (${endpoint})...`);
  const url = getGistdaFeatureUrl(endpoint, 1000, 0, true);

  try {
    const response = await fetch(url, {
      headers: getGistdaHeaders(GISTDA_CONFIG.PRIMARY_API_KEY)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data as GISTDAData;
    }

    // Try backup key
    const backupResponse = await fetch(url, {
      headers: getGistdaHeaders(GISTDA_CONFIG.BACKUP_API_KEY)
    });

    if (backupResponse.ok) {
      const data = await backupResponse.json();
      return data as GISTDAData;
    }

    throw new Error(`GISTDA VIIRS ${periodName} fetch failed: ${response.status}`);
  } catch (error) {
    console.warn(`Error fetching VIIRS ${periodName}:`, error);
    throw error;
  }
};

export const useViirs1DayData = () => {
  return useQuery({
    queryKey: ['gistda-viirs-1day'],
    queryFn: () => fetchViirsData(GISTDA_CONFIG.ENDPOINTS.FEATURES.VIIRS_1DAY, '1 day'),
    refetchInterval: 900000,
    staleTime: 300000,
  });
};

export const useViirs3DaysData = () => {
  return useQuery({
    queryKey: ['gistda-viirs-3days'],
    queryFn: () => fetchViirsData(GISTDA_CONFIG.ENDPOINTS.FEATURES.VIIRS_3DAYS, '3 days'),
    refetchInterval: 900000,
    staleTime: 300000,
  });
};

export const useViirs7DaysData = () => {
  return useQuery({
    queryKey: ['gistda-viirs-7days'],
    queryFn: () => fetchViirsData(GISTDA_CONFIG.ENDPOINTS.FEATURES.VIIRS_7DAYS, '7 days'),
    refetchInterval: 900000,
    staleTime: 300000,
  });
};

export const useViirs30DaysData = () => {
  return useQuery({
    queryKey: ['gistda-viirs-30days'],
    queryFn: () => fetchViirsData(GISTDA_CONFIG.ENDPOINTS.FEATURES.VIIRS_30DAYS, '30 days'),
    refetchInterval: 900000,
    staleTime: 300000,
  });
};
