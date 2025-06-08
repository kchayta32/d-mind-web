
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface OpenMeteoFloodData {
  daily: {
    time: string[];
    river_discharge: number[];
    river_discharge_median: number[];
    river_discharge_max: number[];
  };
  daily_units: {
    time: string;
    river_discharge: string;
    river_discharge_median: string;
    river_discharge_max: string;
  };
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
}

export interface FloodDataPoint {
  lat: number;
  lon: number;
  data: OpenMeteoFloodData;
  locationName: string;
}

// Major river locations in Thailand
const THAILAND_RIVER_POINTS = [
  { lat: 13.7563, lon: 100.5018, name: 'แม่น้ำเจ้าพระยา (กรุงเทพฯ)' },
  { lat: 14.3532, lon: 100.5648, name: 'แม่น้ำเจ้าพระยา (อยุธยา)' },
  { lat: 15.8700, lon: 100.9925, name: 'แม่น้ำน่าน (อุตรดิตถ์)' },
  { lat: 17.3969, lon: 99.1325, name: 'แม่น้ำปิง (เชียงใหม่)' },
  { lat: 16.4322, lon: 102.8236, name: 'แม่น้ำโขง (หนองคาย)' },
  { lat: 15.1168, lon: 103.6085, name: 'แม่น้ำมูล (ร้อยเอ็ด)' },
  { lat: 14.9799, lon: 103.1029, name: 'แม่น้ำชี (ขอนแก่น)' },
  { lat: 12.6091, lon: 101.0828, name: 'แม่น้ำบางปะกง (ชลบุรี)' },
];

async function fetchFloodDataForLocation(lat: number, lon: number): Promise<OpenMeteoFloodData> {
  const params = {
    latitude: lat,
    longitude: lon,
    daily: 'river_discharge,river_discharge_median,river_discharge_max',
    past_days: 7,
    forecast_days: 210, // ~7 months
    timeformat: 'iso8601'
  };

  const url = 'https://api.open-meteo.com/v1/flood';
  const response = await axios.get(url, { params });
  return response.data;
}

export const useOpenMeteoFloodData = () => {
  return useQuery({
    queryKey: ['open-meteo-flood-data'],
    queryFn: async (): Promise<FloodDataPoint[]> => {
      console.log('Fetching Open-Meteo flood data for Thailand river points...');
      
      const promises = THAILAND_RIVER_POINTS.map(async (point) => {
        try {
          const data = await fetchFloodDataForLocation(point.lat, point.lon);
          return {
            lat: point.lat,
            lon: point.lon,
            data,
            locationName: point.name
          };
        } catch (error) {
          console.error(`Error fetching flood data for ${point.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      return results.filter((result): result is FloodDataPoint => result !== null);
    },
    refetchInterval: 3600000, // 1 hour
    staleTime: 1800000, // 30 minutes
  });
};

export const useFloodDataForPoint = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['flood-data-point', lat, lon],
    queryFn: () => fetchFloodDataForLocation(lat, lon),
    enabled: !!(lat && lon),
    refetchInterval: 3600000,
  });
};
