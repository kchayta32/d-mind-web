
export interface Earthquake {
  id: string;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number;
  time: string;
  location?: string;
  coordinates: [number, number];
}

export interface EarthquakeStats {
  total: number;
  last24Hours: number;
  averageMagnitude: number;
  maxMagnitude: number;
  averageDepth: number;
}

export interface RainSensor {
  id: number;
  humidity: number | null;
  is_raining: boolean | null;
  created_at: string | null;
  inserted_at?: string | null;
  coordinates: [number, number];
}

export interface RainSensorStats {
  total: number;
  activeRaining: number;
  averageHumidity: number;
  maxHumidity: number;
  last24Hours: number;
}
