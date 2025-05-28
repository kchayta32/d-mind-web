
export interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  time: number; // timestamp
  coordinates: [number, number]; // [latitude, longitude]
  isSignificant?: boolean; // Whether this earthquake is considered significant
}

export interface EarthquakeStats {
  total: number;
  averageMagnitude: number;
  maxMagnitude: number;
  last24Hours: number;
  significantCount: number;
}

export interface RainSensor {
  id: string;
  humidity: number;
  is_raining: boolean;
  inserted_at: string;
  coordinates?: [number, number]; // We'll need to add coordinates for mapping
}

export interface RainSensorStats {
  total: number;
  activeRaining: number;
  averageHumidity: number;
  maxHumidity: number;
  last24Hours: number;
}
