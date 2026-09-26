/**
 * Bangkok CCTV Camera Service
 * Provides snapshot streaming, query filtering by zone/road/severity,
 * and real-time image refresh capabilities for Bangkok flood and traffic monitoring.
 */

import {
  BANGKOK_CCTV_CAMERAS,
  BangkokCctvCamera,
  BangkokCctvZone,
  CctvStatus,
  FloodSeverity,
  CctvAgency,
  ZONE_NAMES
} from '../data/bangkokCctvData';

// Re-export data and types for external consumer convenience
export type {
  BangkokCctvCamera,
  BangkokCctvZone,
  CctvStatus,
  FloodSeverity,
  CctvAgency
};
export { ZONE_NAMES };

// In-memory working copy to support live snapshot refreshing and status updates
let cctvStore: BangkokCctvCamera[] = JSON.parse(JSON.stringify(BANGKOK_CCTV_CAMERAS));

/**
 * Format current timestamp to "YYYY-MM-DD HH:mm:ss"
 */
function getFormattedCurrentTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Retrieve all Bangkok CCTV cameras (asynchronous Promise)
 */
export async function getAllBangkokCctv(): Promise<BangkokCctvCamera[]> {
  // Returns clone of current store
  return [...cctvStore];
}

/**
 * Retrieve all Bangkok CCTV cameras (synchronous accessor)
 */
export function getBangkokCctvList(): BangkokCctvCamera[] {
  return [...cctvStore];
}

/**
 * Find a single camera by ID
 */
export function getCctvById(cctvId: string): BangkokCctvCamera | undefined {
  return cctvStore.find((cam) => cam.id.toLowerCase() === cctvId.toLowerCase());
}

/**
 * Filter CCTV cameras by Zone ('north' | 'central' | 'east' | 'thonburi')
 */
export function getCctvByZone(zone: BangkokCctvZone | string): BangkokCctvCamera[] {
  const targetZone = zone.toLowerCase().trim();
  return cctvStore.filter((cam) => cam.zone.toLowerCase() === targetZone);
}

/**
 * Search CCTV cameras by road name, district, or landmark name
 */
export function searchCctvByRoad(roadName: string): BangkokCctvCamera[] {
  if (!roadName || !roadName.trim()) {
    return [...cctvStore];
  }
  const query = roadName.toLowerCase().trim();
  return cctvStore.filter(
    (cam) =>
      cam.road.toLowerCase().includes(query) ||
      cam.name.toLowerCase().includes(query) ||
      cam.district.toLowerCase().includes(query)
  );
}

/**
 * Filter CCTV cameras by flood severity ('normal' | 'warning' | 'critical')
 */
export function getCctvBySeverity(severity: FloodSeverity | string): BangkokCctvCamera[] {
  const target = severity.toLowerCase().trim();
  return cctvStore.filter((cam) => cam.floodSeverity.toLowerCase() === target);
}

/**
 * Filter CCTV cameras that are flood-prone (warning or critical)
 */
export function getFloodProneCctvs(): BangkokCctvCamera[] {
  return cctvStore.filter(
    (cam) => cam.floodSeverity === 'warning' || cam.floodSeverity === 'critical'
  );
}

/**
 * Filter CCTV cameras by operational status ('online' | 'maintenance')
 */
export function getCctvByStatus(status: CctvStatus | string): BangkokCctvCamera[] {
  const target = status.toLowerCase().trim();
  return cctvStore.filter((cam) => cam.status.toLowerCase() === target);
}

/**
 * Generate fresh timestamped snapshot image URL for a given camera ID
 * Appends cache-buster timestamp query and updates camera's lastImageTime.
 */
export function refreshCctvSnapshot(cctvId: string): string {
  const cam = cctvStore.find((c) => c.id.toLowerCase() === cctvId.toLowerCase());
  const timestamp = Date.now();
  const formattedTime = getFormattedCurrentTime();

  if (!cam) {
    // Return a fallback fresh URL if camera ID was not found
    return `https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=640&q=80&t=${timestamp}`;
  }

  // Strip previous &t= timestamp if exists
  const baseUrl = cam.snapshotUrl.replace(/&t=\d+/g, '').replace(/\?t=\d+/g, '');
  const separator = baseUrl.includes('?') ? '&' : '?';
  const freshUrl = `${baseUrl}${separator}t=${timestamp}`;

  // Update in-memory camera state
  cam.snapshotUrl = freshUrl;
  cam.lastImageTime = formattedTime;

  return freshUrl;
}

/**
 * Multi-criteria filter options
 */
export interface CctvFilterOptions {
  zone?: BangkokCctvZone | 'all';
  severity?: FloodSeverity | 'all';
  status?: CctvStatus | 'all';
  agency?: CctvAgency | 'all';
  district?: string;
  searchTerm?: string;
}

/**
 * Filter cameras with combined criteria
 */
export function filterBangkokCctv(options: CctvFilterOptions): BangkokCctvCamera[] {
  return cctvStore.filter((cam) => {
    if (options.zone && options.zone !== 'all' && cam.zone !== options.zone) {
      return false;
    }
    if (options.severity && options.severity !== 'all' && cam.floodSeverity !== options.severity) {
      return false;
    }
    if (options.status && options.status !== 'all' && cam.status !== options.status) {
      return false;
    }
    if (options.agency && options.agency !== 'all' && cam.agency !== options.agency) {
      return false;
    }
    if (options.district && !cam.district.toLowerCase().includes(options.district.toLowerCase())) {
      return false;
    }
    if (options.searchTerm && options.searchTerm.trim()) {
      const q = options.searchTerm.toLowerCase().trim();
      const match =
        cam.name.toLowerCase().includes(q) ||
        cam.road.toLowerCase().includes(q) ||
        cam.district.toLowerCase().includes(q) ||
        cam.facingDirection.toLowerCase().includes(q) ||
        (cam.description && cam.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

/**
 * Summary statistics of Bangkok CCTV network
 */
export interface CctvStatistics {
  totalCameras: number;
  onlineCount: number;
  maintenanceCount: number;
  criticalFloodCount: number;
  warningFloodCount: number;
  normalFloodCount: number;
  byZone: Record<BangkokCctvZone, number>;
  byAgency: Record<string, number>;
}

/**
 * Calculate aggregate statistics across the network
 */
export function getCctvStatistics(): CctvStatistics {
  const stats: CctvStatistics = {
    totalCameras: cctvStore.length,
    onlineCount: 0,
    maintenanceCount: 0,
    criticalFloodCount: 0,
    warningFloodCount: 0,
    normalFloodCount: 0,
    byZone: {
      north: 0,
      central: 0,
      east: 0,
      thonburi: 0
    },
    byAgency: {}
  };

  for (const cam of cctvStore) {
    if (cam.status === 'online') stats.onlineCount++;
    if (cam.status === 'maintenance') stats.maintenanceCount++;

    if (cam.floodSeverity === 'critical') stats.criticalFloodCount++;
    else if (cam.floodSeverity === 'warning') stats.warningFloodCount++;
    else stats.normalFloodCount++;

    if (stats.byZone[cam.zone] !== undefined) {
      stats.byZone[cam.zone]++;
    }

    stats.byAgency[cam.agency] = (stats.byAgency[cam.agency] || 0) + 1;
  }

  return stats;
}

/**
 * Update flood severity and water level for a specific camera in memory
 */
export function updateCctvFloodSeverity(
  cctvId: string,
  severity: FloodSeverity,
  waterLevelCm?: number
): boolean {
  const cam = cctvStore.find((c) => c.id.toLowerCase() === cctvId.toLowerCase());
  if (!cam) return false;
  cam.floodSeverity = severity;
  if (waterLevelCm !== undefined) {
    cam.waterLevelCm = waterLevelCm;
  }
  cam.lastImageTime = getFormattedCurrentTime();
  return true;
}

/**
 * Reset store to original dataset
 */
export function resetCctvData(): void {
  cctvStore = JSON.parse(JSON.stringify(BANGKOK_CCTV_CAMERAS));
}
