export type AlertLevel = 'normal' | 'advisory' | 'watch' | 'warning' | 'critical';

export interface EarthquakeEvent {
  id: string;
  title: string;
  magnitude: number;
  depthKm: number;
  depth?: number; // Convenience alias
  latitude: number;
  longitude: number;
  time: number; // timestamp in ms
  epicenter: string;
  province?: string;
  country?: string;
  alertLevel: AlertLevel;
  pga: number; // Peak Ground Acceleration in cm/s^2 (Gal)
  mmi: number; // Modified Mercalli Intensity (1-12)
  status: 'automatic' | 'reviewed' | 'simulated';
  source: 'USGS' | 'TMD' | 'AI_ENGINE' | 'SIMULATOR';
  feltReports?: number;
  tsunamiRisk?: boolean;
}

export interface SeismicStation {
  id: string;
  name: string;
  code: string;
  province: string;
  lat: number;
  lng: number;
  elevationM: number;
  elevation?: number; // Convenience alias
  status: 'online' | 'triggered' | 'warning' | 'offline';
  pga: number;
  snr: number;
  lastPing: number;
  network: 'TMD_NATIONAL' | 'DMR_FAULT' | 'REGIONAL_NET' | string;
}

export interface WaveformSample {
  time: number; // in seconds or relative index
  z: number; // Vertical channel
  n: number; // North-South channel
  e: number; // East-West channel
  filtered: number; // Bandpass filtered component
  staLtaRatio: number; // Current STA/LTA ratio
  triggerValue?: number; // Convenience alias for staLtaRatio
  isTriggered: boolean;
}

export interface TriggerResult {
  triggered: boolean;
  pArrivalIndex: number;
  pArrivalTime: number;
  confidence: number; // 0 - 1.0 (e.g. 0.984)
  snr: number;
  estimatedMagnitude: number;
  estimatedPga: number;
  estimatedDistanceKm: number;
}

export interface EarlyWarningInfo {
  eventId: string;
  epicenterName: string;
  magnitude: number;
  depthKm: number;
  distanceKm: number;
  pWaveArrivalSec: number;
  sWaveArrivalSec: number;
  countdownSeconds: number;
  totalLeadTimeSec: number;
  intensityLevel: string; // e.g. "VI - แข็งแรงมาก (Very Strong)"
  expectedPga: number;
  recommendedAction: string;
  isUrgent: boolean;
  hasArrived: boolean;
}

export interface ActiveFault {
  id: string;
  name: string;
  thaiName: string;
  zone: string;
  province: string;
  maxMagnitude: number;
  slipRateMmYear: number;
  riskLevel: 'high' | 'moderate' | 'low';
  coordinates: [number, number][]; // [lat, lng][] polyline points
  description: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  locationName: string;
  lat: number;
  lng: number;
  magnitude: number;
  depthKm: number;
  faultId?: string;
  description: string;
  historicalContext?: string;
}

export interface EvacuationShelter {
  id: string;
  name: string;
  type: 'park' | 'stadium' | 'school' | 'open_ground';
  lat: number;
  lng: number;
  capacity: number;
  distanceKm: number;
  suppliesAvailable: boolean;
  address: string;
}

export interface NRCTInnovationMetric {
  metricName: string;
  value: string;
  target: string;
  status: 'passed' | 'exceptional';
  validationMethod: string;
}
