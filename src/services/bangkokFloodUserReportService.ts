/**
 * Bangkok Flood Citizen Report Service
 * D-MIND Crowd-sourced Flood & Road Passability Telemetry
 * 
 * Supports localStorage persistence with real-time browser event dispatching
 * and transparent fallback/integration with Supabase if a backend table exists.
 * 
 * IMPORTANT: Starts with an empty report list ([]). No mock or dummy reports are preloaded.
 */

import { supabase } from '@/integrations/supabase/client';

export type WaterLevelCategory = 'ankle' | 'shin' | 'knee' | 'waist' | 'chest' | 'head' | 'custom';

export interface BangkokUserFloodReport {
  id: string;
  timestamp: string; // ISO 8601 string
  isFlooded: boolean;
  waterLevelDescription?: string;
  waterLevelCategory?: WaterLevelCategory;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  district?: string;
  notes?: string;
}

export interface WaterLevelPreset {
  id: WaterLevelCategory;
  label: string;
  approxCm: string;
  depthCm: number;
  icon: string;
  description: string;
}

export const WATER_LEVEL_PRESETS: WaterLevelPreset[] = [
  {
    id: 'ankle',
    label: 'ตาตุ่ม (~10 ซม.)',
    approxCm: '~10 ซม.',
    depthCm: 10,
    icon: '🦶',
    description: 'ระดับข้อเท้า/ตาตุ่ม รถเล็กผ่านได้ชะลอความเร็ว'
  },
  {
    id: 'shin',
    label: 'ครึ่งแข้ง / ขา (~20 ซม.)',
    approxCm: '~20 ซม.',
    depthCm: 20,
    icon: '🦵',
    description: 'ท่วมฟุตบาท/ครึ่งล้อรถ รถเล็กเริ่มผ่านลำบาก'
  },
  {
    id: 'knee',
    label: 'หัวเข่า (~35 ซม.)',
    approxCm: '~35 ซม.',
    depthCm: 35,
    icon: '🧎',
    description: 'ระดับหัวเข่า มิดล้อรถเก๋ง แนะนำหลีกเลี่ยง'
  },
  {
    id: 'waist',
    label: 'เอว (~70 ซม.)',
    approxCm: '~70 ซม.',
    depthCm: 70,
    icon: '🚶',
    description: 'ระดับเอว รถยนต์ทุกชนิดห้ามผ่าน'
  },
  {
    id: 'chest',
    label: 'อก (~100 ซม.)',
    approxCm: '~100 ซม.',
    depthCm: 100,
    icon: '🧍',
    description: 'ระดับหน้าอก วิกฤต สัญจรได้เฉพาะเรือ/รถยกสูงพิเศษ'
  },
  {
    id: 'head',
    label: 'มิดหัว (>150 ซม.)',
    approxCm: '>150 ซม.',
    depthCm: 150,
    icon: '🌊',
    description: 'ระดับมิดศีรษะ วิกฤตสูงสุด น้ำท่วมสูงรุนแรง'
  }
];

const LOCAL_STORAGE_KEY = 'bangkok_flood_user_reports_v1';
const REPORT_EVENT_KEY = 'bkk-flood-report-event';

/**
 * Safely read stored reports from localStorage.
 * Always defaults to empty array [] with NO mock data.
 */
export const getStoredReports = (): BangkokUserFloodReport[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('[BangkokFloodUserReportService] Failed to read from localStorage:', err);
    return [];
  }
};

/**
 * Save reports to localStorage and dispatch custom update event.
 */
const persistReportsLocally = (reports: BangkokUserFloodReport[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent(REPORT_EVENT_KEY, { detail: reports }));
  } catch (err) {
    console.warn('[BangkokFloodUserReportService] Failed to save to localStorage:', err);
  }
};

/**
 * Load citizen flood reports.
 * Queries Supabase if table exists, otherwise loads seamlessly from localStorage.
 * Result always falls back to localStorage.
 */
export const loadReports = async (): Promise<BangkokUserFloodReport[]> => {
  const localReports = getStoredReports();

  try {
    // Attempt to load from Supabase if table exists
    const { data, error } = await (supabase as any)
      .from('bangkok_flood_reports')
      .select('*')
      .order('timestamp', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      // Merge remote data with local, remote takes precedence on id
      const combinedMap = new Map<string, BangkokUserFloodReport>();
      localReports.forEach(r => combinedMap.set(r.id, r));
      data.forEach((r: any) => {
        combinedMap.set(r.id, {
          id: r.id,
          timestamp: r.timestamp || r.created_at,
          isFlooded: Boolean(r.is_flooded ?? r.isFlooded),
          waterLevelDescription: r.water_level_description || r.waterLevelDescription,
          waterLevelCategory: r.water_level_category || r.waterLevelCategory,
          locationName: r.location_name || r.locationName || 'กรุงเทพมหานคร',
          coordinates: Array.isArray(r.coordinates) ? r.coordinates : [Number(r.lat || 13.7563), Number(r.lng || 100.5018)],
          district: r.district,
          notes: r.notes
        });
      });
      const merged = Array.from(combinedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      persistReportsLocally(merged);
      return merged;
    }
  } catch (err) {
    // Supabase table does not exist or network unavailable - transparent fallback
  }

  return localReports;
};

/**
 * Add a new citizen flood report.
 * Saves to localStorage immediately, and attempts to sync to Supabase in background.
 */
export const addReport = async (
  reportInput: Omit<BangkokUserFloodReport, 'id' | 'timestamp'> & {
    id?: string;
    timestamp?: string;
  }
): Promise<BangkokUserFloodReport> => {
  const newReport: BangkokUserFloodReport = {
    id: reportInput.id || `bkk-rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: reportInput.timestamp || new Date().toISOString(),
    isFlooded: reportInput.isFlooded,
    waterLevelDescription: reportInput.waterLevelDescription || '',
    waterLevelCategory: reportInput.waterLevelCategory || (reportInput.isFlooded ? 'custom' : undefined),
    locationName: reportInput.locationName.trim(),
    coordinates: reportInput.coordinates,
    district: reportInput.district?.trim() || undefined,
    notes: reportInput.notes?.trim() || undefined
  };

  // 1. Immediately prepend to local reports
  const currentReports = getStoredReports();
  const updatedReports = [newReport, ...currentReports.filter(r => r.id !== newReport.id)];
  persistReportsLocally(updatedReports);

  // 2. Attempt remote sync if table exists (non-blocking)
  try {
    await (supabase as any).from('bangkok_flood_reports').insert([
      {
        id: newReport.id,
        timestamp: newReport.timestamp,
        is_flooded: newReport.isFlooded,
        water_level_description: newReport.waterLevelDescription,
        water_level_category: newReport.waterLevelCategory,
        location_name: newReport.locationName,
        coordinates: newReport.coordinates,
        district: newReport.district,
        notes: newReport.notes
      }
    ]);
  } catch (err) {
    // Supabase insert optional fallback; report is already saved locally
  }

  return newReport;
};

/**
 * Remove a report by id.
 */
export const removeReport = async (reportId: string): Promise<boolean> => {
  const current = getStoredReports();
  const filtered = current.filter(r => r.id !== reportId);
  persistReportsLocally(filtered);

  try {
    await (supabase as any).from('bangkok_flood_reports').delete().eq('id', reportId);
  } catch (err) {
    // Fallback
  }
  return true;
};

/**
 * Clear all local user reports.
 */
export const clearReports = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(REPORT_EVENT_KEY, { detail: [] }));
  } catch (err) {
    console.warn('[BangkokFloodUserReportService] Failed to clear localStorage:', err);
  }
};

/**
 * Subscribe to report changes across tabs and windows.
 */
export const subscribeToReports = (
  callback: (reports: BangkokUserFloodReport[]) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (event: Event) => {
    const customEvt = event as CustomEvent<BangkokUserFloodReport[]>;
    if (customEvt.detail) {
      callback(customEvt.detail);
    } else {
      callback(getStoredReports());
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_KEY) {
      callback(getStoredReports());
    }
  };

  window.addEventListener(REPORT_EVENT_KEY, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(REPORT_EVENT_KEY, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};

export const bangkokFloodUserReportService = {
  loadReports,
  getStoredReports,
  addReport,
  removeReport,
  clearReports,
  subscribeToReports,
  WATER_LEVEL_PRESETS
};

export default bangkokFloodUserReportService;
