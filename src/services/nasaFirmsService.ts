/**
 * NASA FIRMS (Fire Information for Resource Management System) Web-GIS Service
 * D-MIND Disaster Map - Global Near Real-Time (NRT) Thermal Anomalies & Wildfire Telemetry
 * 
 * Provides:
 * 1. Web-GIS Open WMS / WMTS Tile endpoints (NASA GIBS & NASA FIRMS)
 *    - VIIRS 375m (Suomi NPP, NOAA-20, NOAA-21) NRT (within 3 hours)
 *    - MODIS 1km (Terra & Aqua) NRT (within 3 hours)
 * 2. Thermal Anomalies (ความผิดปกติทางความร้อน) and Hotspots categorization
 * 3. Fire Radiative Power (FRP) metrics & color grading (Megawatts - MW)
 */

export type FirmsSatelliteSource = 'ALL' | 'VIIRS_375M' | 'MODIS_1KM';

export type FrpSeverityLevel = 'low' | 'moderate' | 'high' | 'extreme';

export interface FrpClassification {
  level: FrpSeverityLevel;
  minFrp: number;
  maxFrp: number | null;
  labelTh: string;
  labelEn: string;
  colorHex: string;
  bgClass: string;
  textClass: string;
  descriptionTh: string;
}

export const FRP_CLASSIFICATIONS: Record<FrpSeverityLevel, FrpClassification> = {
  extreme: {
    level: 'extreme',
    minFrp: 100,
    maxFrp: null,
    labelTh: 'วิกฤตจัด (ไฟยอดไม้/ลุกลามเร็ว)',
    labelEn: 'Extreme (Crown/Rapid Spread)',
    colorHex: '#7f1d1d', // Deep dark red / purple-red
    bgClass: 'bg-red-950 text-red-200 border-red-800',
    textClass: 'text-red-900 dark:text-red-300',
    descriptionTh: 'การแผ่พลังงานความร้อนมหาศาล สะท้อนการลุกไหม้รุนแรงในป่าทึบหรือไฟยอดไม้'
  },
  high: {
    level: 'high',
    minFrp: 50,
    maxFrp: 99.9,
    labelTh: 'รุนแรงสูง (High Intensity)',
    labelEn: 'High Intensity',
    colorHex: '#dc2626', // Bright red
    bgClass: 'bg-red-500 text-white border-red-600',
    textClass: 'text-red-600 dark:text-red-400',
    descriptionTh: 'ไฟป่าแผ่ความร้อนสูงอย่างต่อเนื่อง เสี่ยงลุกลามขยายวงกว้างตามทิศทางลม'
  },
  moderate: {
    level: 'moderate',
    minFrp: 20,
    maxFrp: 49.9,
    labelTh: 'ปานกลาง (Moderate)',
    labelEn: 'Moderate Intensity',
    colorHex: '#ea580c', // Orange
    bgClass: 'bg-orange-500 text-white border-orange-600',
    textClass: 'text-orange-600 dark:text-orange-400',
    descriptionTh: 'ตรวจพบความร้อนชัดเจนในพื้นที่เกษตรกรรมหรือป่าโปร่ง'
  },
  low: {
    level: 'low',
    minFrp: 0,
    maxFrp: 19.9,
    labelTh: 'ความร้อนเริ่มต้น/ไฟคุกรุ่น (Low)',
    labelEn: 'Low / Smoldering',
    colorHex: '#eab308', // Amber / Gold
    bgClass: 'bg-amber-400 text-slate-900 border-amber-500',
    textClass: 'text-amber-600 dark:text-amber-400',
    descriptionTh: 'ความร้อนเริ่มต้น ไฟผิวดิน หรือการคุกรุ่นหลังการดับไฟ'
  }
};

/**
 * Get FRP classification based on megawatts (MW)
 */
export const getFrpClassification = (frp: number): FrpClassification => {
  const val = Number(frp) || 0;
  if (val >= 100) return FRP_CLASSIFICATIONS.extreme;
  if (val >= 50) return FRP_CLASSIFICATIONS.high;
  if (val >= 20) return FRP_CLASSIFICATIONS.moderate;
  return FRP_CLASSIFICATIONS.low;
};

/**
 * NASA GIBS / FIRMS Web-GIS Configuration (Open & Free Services)
 */
export const NASA_FIRMS_WEB_GIS = {
  // NASA GIBS WMS Service (Global Web Mercator EPSG:3857)
  GIBS_WMS_BASE_URL: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi',
  
  // NASA GIBS WMTS Base URL
  GIBS_WMTS_BASE_URL: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best',

  // Open WMS Layers for Thermal Anomalies
  LAYERS: {
    // VIIRS Suomi-NPP 375m (Ultra-sharp resolution, 3-hour latency)
    VIIRS_SNPP_375M: 'VIIRS_SNPP_Thermal_Anomalies_375m_All',
    // VIIRS NOAA-20 375m
    VIIRS_NOAA20_375M: 'VIIRS_NOAA20_Thermal_Anomalies_375m_All',
    // MODIS Terra & Aqua Combined (1km resolution)
    MODIS_COMBINED_1KM: 'MODIS_Combined_Thermal_Anomalies_All',
    // True Color Backgrounds from Terra/Aqua
    MODIS_TRUE_COLOR: 'MODIS_Terra_CorrectedReflectance_TrueColor'
  },

  ATTRIBUTION: 'NASA FIRMS & GIBS &copy; EOSDIS &mdash; VIIRS 375m & MODIS NRT Thermal Anomalies'
};

/**
 * Formats Fire Radiative Power (FRP) with unit
 */
export const formatFrp = (frp: number): string => {
  const val = Number(frp) || 0;
  return `${val.toFixed(1)} MW`;
};

/**
 * Aggregates FRP statistics from an array of hotspots
 */
export const calculateHotspotFirmsStats = (hotspots: any[]) => {
  if (!hotspots || hotspots.length === 0) {
    return {
      totalHotspots: 0,
      totalFrpMw: 0,
      averageFrpMw: 0,
      maxFrpMw: 0,
      extremeCount: 0,
      highCount: 0,
      moderateCount: 0,
      lowCount: 0,
      viirsCount: 0,
      modisCount: 0,
      nrt3hCount: 0
    };
  }

  let totalFrp = 0;
  let maxFrp = 0;
  let extreme = 0;
  let high = 0;
  let moderate = 0;
  let low = 0;
  let viirs = 0;
  let modis = 0;

  hotspots.forEach(h => {
    const frp = Number(h.properties?.frp ?? h.FRP ?? 0);
    const instrument = String(h.properties?.instrument || h.SATELLITE || '').toUpperCase();
    
    totalFrp += frp;
    if (frp > maxFrp) maxFrp = frp;

    if (frp >= 100) extreme++;
    else if (frp >= 50) high++;
    else if (frp >= 20) moderate++;
    else low++;

    if (instrument.includes('MODIS')) {
      modis++;
    } else {
      viirs++;
    }
  });

  const total = hotspots.length;
  const avg = total > 0 ? totalFrp / total : 0;

  return {
    totalHotspots: total,
    totalFrpMw: Math.round(totalFrp),
    averageFrpMw: Number(avg.toFixed(1)),
    maxFrpMw: Number(maxFrp.toFixed(1)),
    extremeCount: extreme,
    highCount: high,
    moderateCount: moderate,
    lowCount: low,
    viirsCount: viirs,
    modisCount: modis,
    nrt3hCount: total // All NASA FIRMS active points represent near real-time detections
  };
};
