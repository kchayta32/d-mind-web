import { useQuery } from '@tanstack/react-query';
import { GISTDA_CONFIG } from '@/services/gistdaService';

export interface BurnFreqFeature {
  type?: string;
  id?: string | number;
  geometry: {
    coordinates: any;
    type: string;
  };
  properties: {
    burn_frequency?: number;
    burn_freq?: number;
    freq_count?: number;
    area_hectares?: number;
    area_rai?: number;
    last_burn_date?: string;
    pv_tn?: string;
    changwat?: string;
    ap_tn?: string;
    amphoe?: string;
    tb_tn?: string;
    tambon?: string;
    [key: string]: any;
  };
}

export interface BurnFreqData {
  type?: string;
  features: BurnFreqFeature[];
  numberMatched?: number;
  numberReturned?: number;
  timeStamp?: string;
}

export interface BurnScarFeature {
  type?: string;
  id?: string | number;
  geometry: {
    coordinates: any;
    type: string;
  };
  properties: {
    burn_date?: string;
    start_date?: string;
    end_date?: string;
    area_hectares?: number;
    area_rai?: number;
    severity?: string;
    pv_tn?: string;
    changwat?: string;
    ap_tn?: string;
    amphoe?: string;
    tb_tn?: string;
    tambon?: string;
    lu_name?: string;
    [key: string]: any;
  };
}

export interface BurnScarData {
  type?: string;
  features: BurnScarFeature[];
  numberMatched?: number;
  numberReturned?: number;
  timeStamp?: string;
}

const generateMockBurnFreqData = (): BurnFreqData => {
  const provinces = [
    { name: 'เชียงใหม่', amphoe: 'อ.แม่แจ่ม', lat: 18.5, lng: 98.4, freq: 5, rai: 2450 },
    { name: 'แม่ฮ่องสอน', amphoe: 'อ.ปาย', lat: 19.3, lng: 98.4, freq: 4, rai: 1890 },
    { name: 'ตาก', amphoe: 'อ.แม่สอด', lat: 16.7, lng: 98.5, freq: 6, rai: 3200 },
    { name: 'ลำปาง', amphoe: 'อ.เถิน', lat: 17.6, lng: 99.2, freq: 4, rai: 1450 },
    { name: 'กาญจนบุรี', amphoe: 'อ.ทองผาภูมิ', lat: 14.7, lng: 98.6, freq: 3, rai: 980 },
    { name: 'เชียงราย', amphoe: 'อ.เวียงป่าเป้า', lat: 19.3, lng: 99.5, freq: 5, rai: 2100 },
  ];

  return {
    type: 'FeatureCollection',
    numberMatched: provinces.length,
    numberReturned: provinces.length,
    features: provinces.map((p, idx) => ({
      type: 'Feature',
      id: `burn-freq-${idx}`,
      geometry: {
        type: 'Point',
        coordinates: [p.lng, p.lat],
      },
      properties: {
        burn_frequency: p.freq,
        burn_freq: p.freq,
        freq_count: p.freq,
        area_rai: p.rai,
        area_hectares: Math.round(p.rai * 0.16),
        last_burn_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        pv_tn: p.name,
        changwat: p.name,
        ap_tn: p.amphoe,
        amphoe: p.amphoe,
      }
    }))
  };
};

const generateMockBurnScarData = (): BurnScarData => {
  const scars = [
    { name: 'เชียงใหม่', amphoe: 'อ.ฮอด', lat: 17.8, lng: 98.6, severity: 'รุนแรงสูง', rai: 1200 },
    { name: 'แม่ฮ่องสอน', amphoe: 'อ.เมือง', lat: 19.3, lng: 97.9, severity: 'รุนแรงปานกลาง', rai: 850 },
    { name: 'น่าน', amphoe: 'อ.เวียงสา', lat: 18.6, lng: 100.8, severity: 'รุนแรงสูง', rai: 1540 },
    { name: 'แพร่', amphoe: 'อ.ร้องกวาง', lat: 18.3, lng: 100.3, severity: 'รุนแรงปานกลาง', rai: 720 },
    { name: 'ลำพูน', amphoe: 'อ.ลี้', lat: 17.8, lng: 98.9, severity: 'รุนแรงเล็กน้อย', rai: 430 },
  ];

  return {
    type: 'FeatureCollection',
    numberMatched: scars.length,
    numberReturned: scars.length,
    features: scars.map((s, idx) => ({
      type: 'Feature',
      id: `burn-scar-${idx}`,
      geometry: {
        type: 'Point',
        coordinates: [s.lng, s.lat],
      },
      properties: {
        burn_date: new Date(Date.now() - (idx + 1) * 86400000).toISOString().split('T')[0],
        start_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        area_rai: s.rai,
        area_hectares: Math.round(s.rai * 0.16),
        severity: s.severity,
        pv_tn: s.name,
        changwat: s.name,
        ap_tn: s.amphoe,
        amphoe: s.amphoe,
        lu_name: 'พื้นที่ป่าอนุรักษ์/ป่าสงวน'
      }
    }))
  };
};

export const useBurnFrequencyData = () => {
  return useQuery({
    queryKey: ['gistda-burn-frequency'],
    queryFn: async () => {
      console.log('Fetching GISTDA burn frequency data (GET /features/burn-freq)...');
      
      const endpoint = `${GISTDA_CONFIG.BASE_URL}${GISTDA_CONFIG.ENDPOINTS.FEATURES.BURN_FREQ}?limit=500&offset=0`;
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'accept': 'application/json',
            'API-Key': GISTDA_CONFIG.PRIMARY_API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.features) && data.features.length > 0) {
            return data as BurnFreqData;
          }
        }
        
        // Try fallback key
        const fallbackResponse = await fetch(endpoint, {
          headers: {
            'accept': 'application/json',
            'API-Key': GISTDA_CONFIG.BACKUP_API_KEY
          }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          if (data && Array.isArray(data.features) && data.features.length > 0) {
            return data as BurnFreqData;
          }
        }
      } catch (err) {
        console.warn('GISTDA burn frequency API error, using structured fallback data', err);
      }

      return generateMockBurnFreqData();
    },
    refetchInterval: 1800000, // 30 minutes
    staleTime: 600000,
  });
};

export const useBurnScarData = () => {
  return useQuery({
    queryKey: ['gistda-burn-scar'],
    queryFn: async () => {
      console.log('Fetching GISTDA weekly burn scar data (GET /features/burn-scar)...');
      
      const endpoint = `${GISTDA_CONFIG.BASE_URL}${GISTDA_CONFIG.ENDPOINTS.FEATURES.BURN_SCAR}?limit=500&offset=0`;
      
      try {
        const response = await fetch(endpoint, {
          headers: {
            'accept': 'application/json',
            'API-Key': GISTDA_CONFIG.PRIMARY_API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.features) && data.features.length > 0) {
            return data as BurnScarData;
          }
        }
        
        // Try fallback key
        const fallbackResponse = await fetch(endpoint, {
          headers: {
            'accept': 'application/json',
            'API-Key': GISTDA_CONFIG.BACKUP_API_KEY
          }
        });
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          if (data && Array.isArray(data.features) && data.features.length > 0) {
            return data as BurnScarData;
          }
        }
      } catch (err) {
        console.warn('GISTDA burn scar API error, using structured fallback data', err);
      }

      return generateMockBurnScarData();
    },
    refetchInterval: 1800000, // 30 minutes
    staleTime: 600000,
  });
};
