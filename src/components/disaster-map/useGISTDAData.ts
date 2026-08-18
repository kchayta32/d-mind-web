import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface GISTDAHotspot {
  LATITUDE: number;
  LONGITUDE: number;
  BRIGHTNESS: number;
  SCAN: number;
  TRACK: number;
  ACQ_DATE: string;
  ACQ_TIME: string;
  SATELLITE: string;
  CONFIDENCE: number;
  VERSION: string;
  BRIGHT_T31: number;
  FRP: number;
  DAYNIGHT: string;
  TYPE: number;
  province?: string;
  country?: string;
  geometry?: {
    coordinates: [number, number];
    type: string;
  };
  properties?: {
    confidence: number | string;
    instrument: string;
    frp: number;
    satellite: string;
    pv_tn: string;
    ap_tn: string;
    th_date: string;
    th_time: string;
    village: string;
    lu_name: string;
    acq_date: string;
    changwat?: string;
    tambon?: string;
    area_rai?: number;
    risk_level?: 'low' | 'medium' | 'high' | 'very_high';
    amphoe?: string;
    lu_hp_name?: string;
    tb_tn?: string;
    bright_ti4?: number;
    bright_ti5?: number;
    scan?: number;
    track?: number;
    utm_zone?: string;
    re_royin?: string;
    f_alarm?: number;
  };
  id?: string;
  type?: string;
}

export interface GISTDAData {
  features?: GISTDAHotspot[];
  numberMatched?: number;
  numberReturned?: number;
  timeStamp?: string;
}

export interface GISTDAStats {
  totalHotspots: number;
  modisCount: number;
  viirsCount: number;
  highConfidenceCount: number;
  averageConfidence: number;
  last24Hours: number;
  last7Days: number;
}

export interface WildfireStats {
  totalHotspots: number;
  last24Hours: number;
  highConfidence: number;
  averageConfidence: number;
  topProvinces: Array<{ name: string; count: number }>;
  regionalData: Array<{ region: string; count: number; averageConfidence: number }>;
  timeDistribution: Array<{ time: string; count: number }>;
  thailand: {
    totalHotspots: number;
    byProvince: Array<{ name: string; count: number }>;
    averageConfidence: number;
    totalRiskArea: number;
    byRiskLevel: Array<{ level: string; count: number; area: number }>;
  };
  international: {
    totalHotspots: number;
    byCountry: Array<{ name: string; count: number }>;
    averageConfidence: number;
  };
}

// Time filter options in days
type TimeFilter = '1day' | '3days' | '7days' | '30days' | 'all';

const API_KEY = 'wFaHcoOyzK53pVqspkI9Mvobjm5vWzHVOwGOjzW4f2nAAvsVf8CETklHpX1peaDF';
const API_BASE_URL = 'https://api-gateway.gistda.or.th/api/2.0/resources/features';

const parseHotspotDate = (rawDate?: string, rawTime?: string): Date => {
  if (!rawDate) return new Date();
  const cleanedDate = String(rawDate).trim().replace(/\//g, '-');
  const cleanedTime = String(rawTime || '00:00:00').trim();
  try {
    const d = new Date(`${cleanedDate}T${cleanedTime.length === 5 ? cleanedTime + ':00' : cleanedTime}`);
    if (!isNaN(d.getTime())) return d;
    const d2 = new Date(cleanedDate);
    if (!isNaN(d2.getTime())) return d2;
  } catch {
    // fallback
  }
  return new Date();
};

export const useGISTDAData = (timeFilter: TimeFilter = '3days') => {
  const [hotspots, setHotspots] = useState<GISTDAHotspot[]>([]);
  const [stats, setStats] = useState<WildfireStats>({
    totalHotspots: 0,
    last24Hours: 0,
    highConfidence: 0,
    averageConfidence: 0,
    topProvinces: [],
    regionalData: [],
    timeDistribution: [],
    thailand: {
      totalHotspots: 0,
      byProvince: [],
      averageConfidence: 0,
      totalRiskArea: 0,
      byRiskLevel: []
    },
    international: {
      totalHotspots: 0,
      byCountry: [],
      averageConfidence: 0
    }
  });

  // Thailand provinces bounds for filtering
  const isInThailand = (lat: number, lng: number): boolean => {
    return lat >= 5.5 && lat <= 20.5 && lng >= 97.0 && lng <= 106.0;
  };

  const getCountryFromCoordinates = (lat: number, lng: number): string => {
    if (isInThailand(lat, lng)) return 'Thailand';
    if (lat >= 9.0 && lat <= 28.0 && lng >= 92.0 && lng <= 102.0) return 'Myanmar';
    if (lat >= 13.0 && lat <= 23.0 && lng >= 100.0 && lng <= 108.0) return 'Laos';
    if (lat >= 8.0 && lat <= 23.0 && lng >= 102.0 && lng <= 110.0) return 'Vietnam';
    if (lat >= 10.0 && lat <= 15.0 && lng >= 102.0 && lng <= 108.0) return 'Cambodia';
    if (lat >= 1.0 && lat <= 7.0 && lng >= 95.0 && lng <= 141.0) return 'Indonesia';
    if (lat >= 1.0 && lat <= 7.0 && lng >= 99.0 && lng <= 120.0) return 'Malaysia';
    return 'Other';
  };

  // Calculate fire risk level based on various factors
  const calculateFireRiskLevel = (hotspot: any): 'low' | 'medium' | 'high' | 'very_high' => {
    const confidence = hotspot.properties?.confidence || hotspot.CONFIDENCE;
    const frp = hotspot.properties?.frp || hotspot.FRP || 0;
    const brightness = hotspot.properties?.bright_ti4 || hotspot.BRIGHTNESS || 0;
    const fAlarm = hotspot.properties?.f_alarm || 0;

    if (fAlarm === 1) return 'very_high';

    let confidenceScore = 0;
    if (typeof confidence === 'number') {
      confidenceScore = confidence;
    } else if (confidence === 'nominal' || confidence === 'high') {
      confidenceScore = 85;
    } else {
      confidenceScore = 40;
    }

    if (confidenceScore >= 80 && frp >= 50 && brightness >= 350) return 'very_high';
    if (confidenceScore >= 70 && frp >= 30 && brightness >= 320) return 'high';
    if (confidenceScore >= 50 && frp >= 15 && brightness >= 300) return 'medium';
    return 'low';
  };

  // Estimate area affected in rai (1 rai = 1,600 m²)
  const estimateAreaInRai = (frp: number, confidence: number | string): number => {
    const numericConfidence = typeof confidence === 'number' ? confidence : 
                             (confidence === 'nominal' || confidence === 'high') ? 85 : 40;
    
    const baseArea = Math.max(1, frp / 8);
    const confidenceFactor = numericConfidence / 100;
    return Math.round(baseArea * confidenceFactor);
  };

  // Fetch hotspot data from GISTDA with fallback
  const { data: hotspotsData, isLoading, refetch } = useQuery({
    queryKey: ['gistda-viirs-hotspots', timeFilter],
    queryFn: async () => {
      try {
        const limit = 1000;
        const countryParam = encodeURIComponent('ราชอาณาจักรไทย');
        
        let endpoint = '';
        if (timeFilter === 'all') {
          endpoint = `${API_BASE_URL}/viirs/30days?limit=${limit}&offset=0&ct_tn=${countryParam}`;
        } else {
          endpoint = `${API_BASE_URL}/viirs/${timeFilter}?limit=${limit}&offset=0&ct_tn=${countryParam}`;
        }
        
        const response = await fetch(endpoint, {
          headers: { 
            'accept': 'application/json',
            'API-Key': API_KEY
          }
        });
        
        if (!response.ok) {
          console.warn(`GISTDA API returned ${response.status}, using generated sample data`);
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.warn('GISTDA API network error, using fallback data');
        return null;
      }
    },
    refetchInterval: 300000, // 5 minutes
    staleTime: 120000
  });

  const generateMockHotspotsData = (): GISTDAHotspot[] => {
    const mockData: GISTDAHotspot[] = [];
    const now = new Date();
    
    const provincesList = [
      { name: 'เชียงใหม่', amphoe: 'อ.แม่แจ่ม', tambon: 'ต.ช่างเคิ่ง', lat: 18.5, lng: 98.4 },
      { name: 'เชียงราย', amphoe: 'อ.แม่สาย', tambon: 'ต.เวียงพางคำ', lat: 20.4, lng: 99.8 },
      { name: 'ลำปาง', amphoe: 'อ.เถิน', tambon: 'ต.ล้อมแรด', lat: 17.6, lng: 99.2 },
      { name: 'แม่ฮ่องสอน', amphoe: 'อ.ปาย', tambon: 'ต.เวียงใต้', lat: 19.3, lng: 98.4 },
      { name: 'กาญจนบุรี', amphoe: 'อ.ทองผาภูมิ', tambon: 'ต.ท่าขนุน', lat: 14.7, lng: 98.6 },
      { name: 'ตาก', amphoe: 'อ.แม่สอด', tambon: 'ต.แม่ปะ', lat: 16.7, lng: 98.5 },
      { name: 'นครราชสีมา', amphoe: 'อ.ปากช่อง', tambon: 'ต.หมูสี', lat: 14.6, lng: 101.4 },
      { name: 'ขอนแก่น', amphoe: 'อ.ชุมแพ', tambon: 'ต.โนนหัน', lat: 16.5, lng: 102.1 },
      { name: 'สุราษฎร์ธานี', amphoe: 'อ.บ้านตาขุน', tambon: 'ต.เขาพัง', lat: 8.9, lng: 98.8 }
    ];

    for (let i = 0; i < 80; i++) {
      const isThailandHotspot = Math.random() < 0.75;
      let lat: number, lng: number, country: string, province: string, amphoe: string, tambon: string;
      
      if (isThailandHotspot) {
        const pInfo = provincesList[Math.floor(Math.random() * provincesList.length)];
        province = pInfo.name;
        amphoe = pInfo.amphoe;
        tambon = pInfo.tambon;
        lat = pInfo.lat + (Math.random() - 0.5) * 0.4;
        lng = pInfo.lng + (Math.random() - 0.5) * 0.4;
        country = 'Thailand';
      } else {
        lat = 10 + Math.random() * 12;
        lng = 95 + Math.random() * 12;
        country = getCountryFromCoordinates(lat, lng);
        province = 'ไม่ระบุ';
        amphoe = 'ไม่ระบุ';
        tambon = 'ไม่ระบุ';
      }
      
      const hoursAgo = Math.random() * 48;
      const hotspotDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      const confidence = Math.floor(65 + Math.random() * 34);
      const frp = Math.round((10 + Math.random() * 85) * 10) / 10;
      const brightness = Math.round(310 + Math.random() * 80);
      const instrument = Math.random() > 0.3 ? 'VIIRS' : 'MODIS';
      const riskLevel = calculateFireRiskLevel({ properties: { confidence, frp }, BRIGHTNESS: brightness });
      const areaRai = estimateAreaInRai(frp, confidence);
      
      const dateStr = hotspotDate.toISOString().split('T')[0];
      const timeStr = hotspotDate.toTimeString().split(' ')[0].substring(0, 5);

      mockData.push({
        LATITUDE: lat,
        LONGITUDE: lng,
        BRIGHTNESS: brightness,
        SCAN: 1.0,
        TRACK: 1.0,
        ACQ_DATE: dateStr,
        ACQ_TIME: timeStr,
        SATELLITE: instrument === 'MODIS' ? 'Aqua' : 'Suomi NPP',
        CONFIDENCE: confidence,
        VERSION: '2.0',
        BRIGHT_T31: 290,
        FRP: frp,
        DAYNIGHT: hoursAgo % 24 < 12 ? 'D' : 'N',
        TYPE: 0,
        province,
        country,
        geometry: {
          coordinates: [lng, lat],
          type: 'Point'
        },
        properties: {
          confidence,
          instrument,
          frp,
          satellite: instrument === 'MODIS' ? 'Aqua' : 'Suomi NPP',
          pv_tn: province,
          ap_tn: amphoe,
          th_date: dateStr,
          th_time: timeStr,
          village: isThailandHotspot ? `หมู่บ้านใกล้เคียง ${tambon}` : '',
          lu_name: ['พื้นที่ป่าสงวน', 'พื้นที่ป่าอนุรักษ์', 'พื้นที่เกษตรกรรม', 'ป่าเต็งรัง/ป่าเบญจพรรณ'][Math.floor(Math.random() * 4)],
          acq_date: dateStr,
          changwat: province,
          tambon,
          area_rai: areaRai,
          risk_level: riskLevel
        }
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    let processedHotspots: GISTDAHotspot[] = [];
    
    if (hotspotsData && Array.isArray(hotspotsData.features) && hotspotsData.features.length > 0) {
      processedHotspots = hotspotsData.features.map((feature: any) => {
        const geometry = feature.geometry || {};
        const properties = feature.properties || {};
        
        const lat = Number(geometry.coordinates?.[1] ?? properties.latitude ?? feature.LATITUDE);
        const lng = Number(geometry.coordinates?.[0] ?? properties.longitude ?? feature.LONGITUDE);
        const country = getCountryFromCoordinates(lat, lng);
        const riskLevel = calculateFireRiskLevel({ properties, BRIGHTNESS: properties.bright_ti4 });
        const frpVal = Number(properties.frp ?? feature.FRP ?? 0);
        const confVal = properties.confidence ?? feature.CONFIDENCE ?? 75;
        const areaRai = estimateAreaInRai(frpVal, confVal);
        const prov = properties.pv_tn || properties.changwat || feature.province || (country === 'Thailand' ? 'ไม่ระบุ' : country);
        
        return {
          ...feature,
          LATITUDE: lat,
          LONGITUDE: lng,
          BRIGHTNESS: properties.bright_ti4 || properties.brightness || feature.BRIGHTNESS || 300,
          SCAN: properties.scan || feature.SCAN || 1.0,
          TRACK: properties.track || feature.TRACK || 1.0,
          ACQ_DATE: properties.acq_date || properties.th_date || feature.ACQ_DATE || new Date().toISOString().split('T')[0],
          ACQ_TIME: properties.acq_time || properties.th_time || feature.ACQ_TIME || '00:00',
          SATELLITE: properties.satellite || feature.SATELLITE || 'Suomi NPP',
          CONFIDENCE: typeof confVal === 'string' ? 
                     (confVal === 'nominal' || confVal === 'high' ? 85 : 40) : 
                     Number(confVal) || 50,
          VERSION: '2.0NRT',
          BRIGHT_T31: properties.bright_ti5 || 280,
          FRP: frpVal,
          DAYNIGHT: properties.daynight || 'D',
          TYPE: 0,
          province: prov,
          country,
          geometry: {
            coordinates: [lng, lat],
            type: 'Point'
          },
          properties: {
            ...properties,
            changwat: prov,
            pv_tn: prov,
            tambon: properties.tb_tn || properties.tambol || properties.tambon,
            amphoe: properties.amphoe || properties.ap_tn,
            area_rai: areaRai,
            risk_level: riskLevel,
            village: properties.village
          }
        };
      });
    } else {
      processedHotspots = generateMockHotspotsData();
    }

    setHotspots(processedHotspots);

    // Calculate enhanced statistics
    const totalHotspots = processedHotspots.length;
    const nowTs = Date.now();
    const oneDayAgo = nowTs - 24 * 60 * 60 * 1000;

    const last24Hours = processedHotspots.filter(h => {
      const hDate = parseHotspotDate(h.ACQ_DATE || h.properties?.acq_date, h.ACQ_TIME || h.properties?.acq_time);
      return hDate.getTime() >= oneDayAgo;
    }).length;

    const highConfidence = processedHotspots.filter(h => {
      const conf = h.properties?.confidence ?? h.CONFIDENCE;
      if (typeof conf === 'number') return conf >= 80;
      return conf === 'nominal' || conf === 'high';
    }).length;

    const averageConfidence = totalHotspots > 0 
      ? processedHotspots.reduce((sum, h) => {
          const conf = h.properties?.confidence ?? h.CONFIDENCE;
          const numConf = typeof conf === 'number' ? conf : 
                         (conf === 'nominal' || conf === 'high') ? 85 : 40;
          return sum + numConf;
        }, 0) / totalHotspots 
      : 0;

    // Thailand-specific statistics
    const thailandHotspots = processedHotspots.filter(h => h.country === 'Thailand');
    const thailandByProvince = thailandHotspots.reduce((acc, hotspot) => {
      const province = hotspot.properties?.changwat || hotspot.properties?.pv_tn || hotspot.province || 'ไม่ระบุ';
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const thailandProvinceData = Object.entries(thailandByProvince)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Risk level statistics
    const riskLevelCounts = thailandHotspots.reduce((acc, hotspot) => {
      const level = hotspot.properties?.risk_level || 'low';
      acc[level] = (acc[level] || { count: 0, area: 0 });
      acc[level].count++;
      acc[level].area += hotspot.properties?.area_rai || 0;
      return acc;
    }, {} as Record<string, { count: number; area: number }>);

    const byRiskLevel = Object.entries(riskLevelCounts)
      .map(([level, data]) => ({
        level: level === 'very_high' ? 'เสี่ยงวิกฤต' : 
               level === 'high' ? 'เสี่ยงสูง' :
               level === 'medium' ? 'เสี่ยงปานกลาง' : 'เสี่ยงต่ำ',
        count: data.count,
        area: data.area
      }))
      .sort((a, b) => b.count - a.count);

    const totalRiskArea = thailandHotspots.reduce((sum, h) => sum + (h.properties?.area_rai || 0), 0);

    // International statistics
    const internationalHotspots = processedHotspots.filter(h => h.country !== 'Thailand');
    const internationalByCountry = internationalHotspots.reduce((acc, hotspot) => {
      const country = hotspot.country || 'Other';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const internationalCountryData = Object.entries(internationalByCountry)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Regional data
    const regionalData = Object.entries(
      processedHotspots.reduce((acc, h) => {
        const region = h.country || 'Unknown';
        if (!acc[region]) {
          acc[region] = { count: 0, totalConfidence: 0 };
        }
        acc[region].count++;
        const conf = h.properties?.confidence ?? h.CONFIDENCE;
        const numConf = typeof conf === 'number' ? conf : 
                       (conf === 'nominal' || conf === 'high') ? 85 : 40;
        acc[region].totalConfidence += numConf;
        return acc;
      }, {} as Record<string, { count: number; totalConfidence: number }>)
    ).map(([region, data]) => ({
      region,
      count: data.count,
      averageConfidence: data.count > 0 ? Math.round(data.totalConfidence / data.count) : 0
    })).sort((a, b) => b.count - a.count);

    // Time distribution
    const timeDistribution = processedHotspots.reduce((acc, h) => {
      const time = String(h.ACQ_TIME || h.properties?.th_time || '00:00');
      const hour = (time.includes(':') ? time.split(':')[0] : time.substring(0, 2)) || '00';
      const timeSlot = `${hour.padStart(2, '0')}:00`;
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timeData = Object.entries(timeDistribution)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));

    const newStats: WildfireStats = {
      totalHotspots,
      last24Hours,
      highConfidence,
      averageConfidence: Math.round(averageConfidence),
      topProvinces: thailandProvinceData.slice(0, 5),
      regionalData,
      timeDistribution: timeData,
      thailand: {
        totalHotspots: thailandHotspots.length,
        byProvince: thailandProvinceData,
        averageConfidence: thailandHotspots.length > 0 
          ? Math.round(thailandHotspots.reduce((sum, h) => {
              const conf = h.properties?.confidence ?? h.CONFIDENCE;
              const numConf = typeof conf === 'number' ? conf : 
                             (conf === 'nominal' || conf === 'high') ? 85 : 40;
              return sum + numConf;
            }, 0) / thailandHotspots.length)
          : 0,
        totalRiskArea,
        byRiskLevel
      },
      international: {
        totalHotspots: internationalHotspots.length,
        byCountry: internationalCountryData,
        averageConfidence: internationalHotspots.length > 0 
          ? Math.round(internationalHotspots.reduce((sum, h) => {
              const conf = h.properties?.confidence ?? h.CONFIDENCE;
              const numConf = typeof conf === 'number' ? conf : 
                             (conf === 'nominal' || conf === 'high') ? 85 : 40;
              return sum + numConf;
            }, 0) / internationalHotspots.length)
          : 0
      }
    };

    setStats(newStats);
  }, [hotspotsData, timeFilter]);

  return {
    hotspots,
    stats,
    isLoading,
    refetch
  };
};
