export interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  depth: number;
  time: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  place?: string;
  url?: string;
  isSignificant?: boolean;
  tsunamiAlert?: boolean;
  source?: 'USGS' | 'EMSC' | 'GDACS';
  feltReports?: number;
  alertColor?: 'green' | 'yellow' | 'orange' | 'red';
  distanceFromUser?: number;
}

export interface EarthquakeStats {
  total: number;
  major: number;
  averageMagnitude: number;
  maxMagnitude: number;
  averageDepth: number;
  last24Hours: number;
  significantCount: number;
  tsunamiAlertsCount?: number;
  sourceBreakdown?: {
    usgs: number;
    emsc: number;
    gdacs: number;
  };
}

export interface RainSensor {
  id: number;
  coordinates?: [number, number];
  latitude?: number;
  longitude?: number;
  humidity?: number;
  is_raining?: boolean;
  inserted_at?: string;
  created_at?: string;
}

export interface RainSensorStats {
  total: number;
  activeRaining: number;
  averageHumidity: number;
  maxHumidity: number;
  last24Hours: number;
}

export interface RainViewerStats {
  lastUpdated: string;
  totalFrames: number;
  pastFrames: number;
  futureFrames: number;
}

export interface AirPollutionData {
  id: string;
  lat: number;
  lng: number;
  pm25?: number;
  pm10?: number;
  o3?: number;
  co?: number;
  no2?: number;
  so2?: number;
  aod443?: number;
  ssa443?: number;
  no2trop?: number;
  o3total?: number;
  uvai?: number;
  usAqi?: number;
  europeanAqi?: number;
  uvIndex?: number;
  dust?: number;
  timestamp: string;
  stationName?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  source?: 'Open-Meteo' | 'GISTDA' | 'PCD';
  aqiLevel?: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  hourlyPm25?: number[];
  hourlyTimes?: string[];
}

export interface AirPollutionStats {
  totalStations: number;
  averagePM25: number;
  maxPM25: number;
  unhealthyStations: number;
  last24Hours: number;
  averageAqi?: number;
  maxAqi?: number;
  aqiDistribution?: {
    good: number;
    moderate: number;
    unhealthySensitive: number;
    unhealthy: number;
    veryUnhealthy: number;
    hazardous: number;
  };
}

export interface OpenMeteoRainStats {
  totalStations: number;
  activeRainStations: number;
  maxRainfall: number;
  avgTemperature: number;
  lastUpdated: string;
}

// Storm & Tropical Cyclone Types
export interface StormTrackPoint {
  latitude: number;
  longitude: number;
  time: string;
  windSpeedKmH?: number;
  pressureHPa?: number;
}

export interface StormData {
  id: string;
  name: string;
  category: 'Depression' | 'Tropical Storm' | 'Cat 1' | 'Cat 2' | 'Cat 3' | 'Cat 4' | 'Cat 5' | 'Unknown';
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  windSpeedKmH: number;
  windSpeedKnots?: number;
  pressureHPa: number;
  movementSpeedKmH?: number;
  movementDirection?: string;
  alertLevel: 'Green' | 'Orange' | 'Red';
  affectedCountries?: string[];
  affectedPopulation?: number;
  updatedAt: string;
  source: 'NASA EONET' | 'GDACS' | 'JTWC';
  trackHistory?: StormTrackPoint[];
  description?: string;
  link?: string;
}

export interface StormStats {
  totalActiveStorms: number;
  maxWindSpeedKmH: number;
  severeStormsCount: number; // Cat 3+
  tropicalStormsCount: number;
  mostSevereStorm?: string;
  alertBreakdown: {
    red: number;
    orange: number;
    green: number;
  };
  lastUpdated: string;
}

// Volcano Types
export interface VolcanoData {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  status: 'Erupting' | 'Warning' | 'Unrest' | 'Normal';
  alertLevel: 'Green' | 'Yellow' | 'Orange' | 'Red';
  lastEruptionDate?: string;
  source: 'NASA EONET' | 'GDACS' | 'Smithsonian';
  description?: string;
  link?: string;
}

export interface VolcanoStats {
  totalActiveVolcanoes: number;
  eruptingCount: number;
  warningCount: number;
  regionalCount: number; // In Asia-Pacific Ring of Fire
  lastUpdated: string;
}

// API Health / Status types
export interface ApiSourceStatus {
  name: string;
  category: string;
  isFree: boolean;
  status: 'online' | 'loading' | 'error';
  latencyMs?: number;
  lastUpdated?: string;
  itemCount?: number;
  url: string;
}

export type BaseMapLayerType = 'osm' | 'satellite' | 'dark' | 'light' | 'topo';
