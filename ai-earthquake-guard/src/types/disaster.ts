/**
 * Natural Disaster Filter & Incident Types for SeismoGuard AI
 * Supports single-select filtering across multiple geophysical and meteorological hazards.
 */

export type DisasterType = 
  | 'earthquake'
  | 'tsunami'
  | 'flood'
  | 'landslide'
  | 'storm'
  | 'wildfire'
  | 'volcano';

export type DisasterSeverity = 'critical' | 'warning' | 'watch' | 'normal';

export interface DisasterMetric {
  label: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface DisasterIncident {
  id: string;
  type: DisasterType;
  title: string;
  titleTh: string;
  location: string;
  province: string;
  latitude: number;
  longitude: number;
  severity: DisasterSeverity;
  metrics: DisasterMetric[];
  timestamp: number;
  source: string;
  status: string;
  description: string;
  radiusKm?: number;
  pathCoordinates?: [number, number][]; // e.g. for storm tracks or river flows
}

export interface DisasterFilterOption {
  id: DisasterType;
  label: string;
  labelEn: string;
  badge: string;
  color: string;
  count: number;
  sourceAgency: string;
  description: string;
}
