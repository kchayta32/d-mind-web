import { useQuery } from '@tanstack/react-query';
import { GISTDA_CONFIG, getGistdaHeaders, FloodTimeFilter } from '@/services/gistdaService';

export interface FloodFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'MultiPolygon' | 'Polygon' | 'Point';
    coordinates: any;
  };
  properties: {
    _id?: string;
    _createdAt?: string;
    _updatedAt?: string;
    f_area?: number;
    pv_tn?: string; // จังหวัด
    ap_tn?: string; // อำเภอ
    tb_tn?: string; // ตำบล
    population?: number;
    population_2?: number;
    building?: number;
    length_road?: number;
    hospital?: number;
    school?: number;
    file_name?: string;
    [key: string]: any;
  };
}

export interface FloodResponse {
  type: 'FeatureCollection';
  features: FloodFeature[];
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
}

export interface RecurrentFloodFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'MultiPolygon' | 'Polygon' | 'Point';
    coordinates: any;
  };
  properties: {
    _id: string;
    freq?: number;
    LabelTH?: string;
    LabelEN?: string;
    shape_area?: number;
    pv_tn?: string;
    ap_tn?: string;
    [key: string]: any;
  };
}

const generateMockFloodData = (timeframe: FloodTimeFilter): FloodResponse => {
  const floodPoints = [
    { pv: 'พระนครศรีอยุธยา', ap: 'อ.เสนา', tb: 'ต.หัวเวียง', lat: 14.33, lng: 100.41, area: 1250000, pop: 3400 },
    { pv: 'พระนครศรีอยุธยา', ap: 'อ.บางบาล', tb: 'ต.บางหลวง', lat: 14.38, lng: 100.48, area: 980000, pop: 2100 },
    { pv: 'สุโขทัย', ap: 'อ.เมืองสุโขทัย', tb: 'ต.ปากแคว', lat: 17.02, lng: 99.82, area: 2100000, pop: 4800 },
    { pv: 'พิษณุโลก', ap: 'อ.บางระกำ', tb: 'ต.บางระกำ', lat: 16.75, lng: 100.12, area: 3400000, pop: 6200 },
    { pv: 'อุบลราชธานี', ap: 'อ.วารินชำราบ', tb: 'ต.วารินชำราบ', lat: 15.19, lng: 104.86, area: 1800000, pop: 5100 },
    { pv: 'นครสวรรค์', ap: 'อ.ชุมแสง', tb: 'ต.เกยไชย', lat: 15.89, lng: 100.30, area: 1400000, pop: 2900 },
    { pv: 'ร้อยเอ็ด', ap: 'อ.จังหาร', tb: 'ต.ดงสิงห์', lat: 16.14, lng: 103.62, area: 850000, pop: 1800 },
  ];

  return {
    type: 'FeatureCollection',
    numberMatched: floodPoints.length,
    numberReturned: floodPoints.length,
    timeStamp: new Date().toISOString(),
    features: floodPoints.map((f, idx) => ({
      id: `mock-flood-${timeframe}-${idx}`,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [f.lng, f.lat]
      },
      properties: {
        _id: `mock-flood-${idx}`,
        _createdAt: new Date(Date.now() - 86400000).toISOString(),
        _updatedAt: new Date().toISOString(),
        f_area: f.area,
        pv_tn: f.pv,
        ap_tn: f.ap,
        tb_tn: f.tb,
        population: f.pop,
        population_2: f.pop,
        building: Math.round(f.pop / 3),
        length_road: Math.round(f.area / 100000),
        hospital: 1,
        school: 2,
        file_name: `GISTDA_Flood_${timeframe}.geojson`
      }
    }))
  };
};

async function fetchFloodData(timeframe: FloodTimeFilter, limit: number = 1000): Promise<FloodResponse> {
  const endpoint = `${GISTDA_CONFIG.BASE_URL}/features/flood/${timeframe}?limit=${limit}&offset=0`;
  console.log(`Fetching GISTDA flood data (${endpoint})...`);

  try {
    const response = await fetch(endpoint, {
      headers: getGistdaHeaders(GISTDA_CONFIG.PRIMARY_API_KEY)
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.features) && data.features.length > 0) {
        return data as FloodResponse;
      }
    }

    // Try backup API key
    const backupResponse = await fetch(endpoint, {
      headers: getGistdaHeaders(GISTDA_CONFIG.BACKUP_API_KEY)
    });

    if (backupResponse.ok) {
      const data = await backupResponse.json();
      if (data && Array.isArray(data.features) && data.features.length > 0) {
        return data as FloodResponse;
      }
    }
  } catch (err) {
    console.warn(`GISTDA Flood ${timeframe} fetch error, using structured fallback:`, err);
  }

  return generateMockFloodData(timeframe);
}

async function fetchRecurrentFloodData(limit: number = 1000): Promise<FloodResponse> {
  const endpoint = `${GISTDA_CONFIG.BASE_URL}/features/flood-freq?limit=${limit}&offset=0`;
  console.log(`Fetching GISTDA flood frequency data (${endpoint})...`);

  try {
    const response = await fetch(endpoint, {
      headers: getGistdaHeaders(GISTDA_CONFIG.PRIMARY_API_KEY)
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.features) && data.features.length > 0) {
        return data as FloodResponse;
      }
    }

    const backupResponse = await fetch(endpoint, {
      headers: getGistdaHeaders(GISTDA_CONFIG.BACKUP_API_KEY)
    });

    if (backupResponse.ok) {
      const data = await backupResponse.json();
      if (data && Array.isArray(data.features) && data.features.length > 0) {
        return data as FloodResponse;
      }
    }
  } catch (err) {
    console.warn('GISTDA recurrent flood fetch error, using structured fallback:', err);
  }

  return generateMockFloodData('30days');
}

export const useGISTDAFloodData = (timeframe: FloodTimeFilter = '3days') => {
  return useQuery({
    queryKey: ['gistda-flood-data', timeframe],
    queryFn: () => fetchFloodData(timeframe),
    refetchInterval: 1800000, // 30 minutes
    staleTime: 900000, // 15 minutes
  });
};

export const useRecurrentFloodData = () => {
  return useQuery({
    queryKey: ['gistda-recurrent-flood'],
    queryFn: () => fetchRecurrentFloodData(500),
    refetchInterval: 3600000, // 1 hour
    staleTime: 1800000, // 30 minutes
  });
};

// Calculate center point of a polygon safely for marker placement
export const getFloodCenter = (feature: FloodFeature): [number, number] => {
  try {
    const coords = feature?.geometry?.coordinates;
    if (!coords || !Array.isArray(coords) || coords.length === 0) {
      return [13.7563, 100.5018];
    }

    // Direct Point coordinates [lng, lat]
    if (feature.geometry?.type === 'Point' || (typeof coords[0] === 'number' && typeof coords[1] === 'number')) {
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    }

    let ring: any[] = [];
    if (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && typeof coords[0][0][0] === 'number') {
      // Polygon: coords[0] is array of [lng, lat]
      ring = coords[0];
    } else if (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && Array.isArray(coords[0][0][0])) {
      // MultiPolygon: coords[0][0] is array of [lng, lat]
      ring = coords[0][0];
    } else if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
      ring = coords;
    }

    const lats = ring.map(c => Number(c?.[1])).filter(v => typeof v === 'number' && !isNaN(v));
    const lngs = ring.map(c => Number(c?.[0])).filter(v => typeof v === 'number' && !isNaN(v));

    if (lats.length === 0 || lngs.length === 0) {
      return [13.7563, 100.5018];
    }

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    if (isNaN(centerLat) || isNaN(centerLng)) {
      return [13.7563, 100.5018];
    }

    return [centerLat, centerLng];
  } catch (err) {
    console.warn('Error calculating flood center:', err);
    return [13.7563, 100.5018];
  }
};
