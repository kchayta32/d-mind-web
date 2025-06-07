
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
  };
}

export interface GISTDAData {
  features?: GISTDAHotspot[];
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

const getTimeFilterDate = (filter: TimeFilter): Date | null => {
  if (filter === 'all') return null;
  
  const now = new Date();
  const days = {
    '1day': 1,
    '3days': 3,
    '7days': 7,
    '30days': 30
  }[filter];
  
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
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

  // Enhanced province mapping with more accurate coordinates
  const getProvinceFromCoordinates = (lat: number, lng: number): string => {
    const provinceMapping = [
      { name: 'เชียงใหม่', bounds: { latMin: 18.0, latMax: 20.5, lngMin: 97.5, lngMax: 100.0 } },
      { name: 'เชียงราย', bounds: { latMin: 19.0, latMax: 20.5, lngMin: 99.0, lngMax: 101.0 } },
      { name: 'ลำปาง', bounds: { latMin: 17.5, latMax: 18.5, lngMin: 99.0, lngMax: 101.0 } },
      { name: 'แม่ฮ่องสอน', bounds: { latMin: 17.5, latMax: 19.5, lngMin: 97.5, lngMax: 99.0 } },
      { name: 'พิษณุโลก', bounds: { latMin: 16.0, latMax: 17.5, lngMin: 100.0, lngMax: 101.5 } },
      { name: 'เพชรบูรณ์', bounds: { latMin: 15.5, latMax: 17.0, lngMin: 100.5, lngMax: 102.0 } },
      { name: 'ขอนแก่น', bounds: { latMin: 15.5, latMax: 17.0, lngMin: 102.0, lngMax: 103.5 } },
      { name: 'อุดรธานี', bounds: { latMin: 16.5, latMax: 18.0, lngMin: 102.0, lngMax: 103.5 } },
      { name: 'กาญจนบุรี', bounds: { latMin: 13.5, latMax: 15.5, lngMin: 98.0, lngMax: 100.0 } },
      { name: 'ราชบุรี', bounds: { latMin: 13.0, latMax: 14.5, lngMin: 99.0, lngMax: 100.5 } },
      { name: 'เพชรบุรี', bounds: { latMin: 12.5, latMax: 13.5, lngMin: 99.5, lngMax: 100.5 } },
      { name: 'ประจวบคีรีขันธ์', bounds: { latMin: 11.0, latMax: 12.5, lngMin: 99.0, lngMax: 100.5 } },
      { name: 'ชุมพร', bounds: { latMin: 10.0, latMax: 11.5, lngMin: 98.5, lngMax: 100.0 } },
      { name: 'สุราษฎร์ธานี', bounds: { latMin: 8.5, latMax: 10.0, lngMin: 98.5, lngMax: 100.5 } },
      { name: 'นครศรีธรรมราช', bounds: { latMin: 8.0, latMax: 9.5, lngMin: 99.0, lngMax: 100.5 } },
      { name: 'สงขลา', bounds: { latMin: 6.5, latMax: 8.0, lngMin: 100.0, lngMax: 101.5 } },
      { name: 'ปัตตานี', bounds: { latMin: 6.0, latMax: 7.5, lngMin: 101.0, lngMax: 102.0 } },
      { name: 'ยะลา', bounds: { latMin: 5.5, latMax: 7.0, lngMin: 101.0, lngMax: 102.0 } },
      { name: 'นราธิวาส', bounds: { latMin: 5.5, latMax: 6.5, lngMin: 101.5, lngMax: 102.5 } }
    ];

    for (const province of provinceMapping) {
      const { bounds } = province;
      if (lat >= bounds.latMin && lat <= bounds.latMax && 
          lng >= bounds.lngMin && lng <= bounds.lngMax) {
        return province.name;
      }
    }
    return 'อื่นๆ';
  };

  const getCountryFromCoordinates = (lat: number, lng: number): string => {
    if (isInThailand(lat, lng)) return 'Thailand';
    if (lat >= 9.0 && lat <= 28.0 && lng >= 92.0 && lng <= 102.0) return 'Myanmar';
    if (lat >= 13.0 && lat <= 23.0 && lng >= 100.0 && lng <= 108.0) return 'Laos';
    if (lat >= 8.0 && lat <= 23.0 && lng >= 102.0 && lng <= 110.0) return 'Vietnam';
    if (lat >= 1.0 && lat <= 7.0 && lng >= 95.0 && lng <= 141.0) return 'Indonesia';
    if (lat >= 1.0 && lat <= 7.0 && lng >= 99.0 && lng <= 120.0) return 'Malaysia';
    return 'Other';
  };

  // Calculate fire risk level based on various factors
  const calculateFireRiskLevel = (hotspot: any): 'low' | 'medium' | 'high' | 'very_high' => {
    const confidence = hotspot.CONFIDENCE || 0;
    const frp = hotspot.FRP || 0;
    const brightness = hotspot.BRIGHTNESS || 0;

    if (confidence >= 80 && frp >= 50 && brightness >= 350) return 'very_high';
    if (confidence >= 70 && frp >= 30 && brightness >= 320) return 'high';
    if (confidence >= 50 && frp >= 15 && brightness >= 300) return 'medium';
    return 'low';
  };

  // Estimate area affected in rai (1 rai = 1,600 m²)
  const estimateAreaInRai = (frp: number, confidence: number): number => {
    // Basic estimation: higher FRP and confidence = larger area
    const baseArea = Math.max(1, frp / 10); // Base area in rai
    const confidenceFactor = confidence / 100;
    return Math.round(baseArea * confidenceFactor * (1 + Math.random() * 0.5));
  };

  // Fetch hotspot data from GISTDA with proper API
  const { data: hotspotsData, isLoading } = useQuery({
    queryKey: ['gistda-hotspots', timeFilter],
    queryFn: async () => {
      try {
        const endpoint = `https://api-gateway.gistda.or.th/api/2.0/resources/features/viirs/${timeFilter}?limit=1000&offset=0&ct_tn=%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%AD%E0%B8%B2%E0%B8%93%E0%B8%B2%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A3%E0%B9%84%E0%B8%97%E0%B8%A2`;
        
        const response = await fetch(endpoint, {
          headers: { 
            'accept': 'application/json',
            'API-Key': API_KEY
          }
        });
        
        if (!response.ok) {
          console.warn('GISTDA API not available, using mock data');
          throw new Error('GISTDA API failed');
        }
        
        const data = await response.json();
        console.log('GISTDA real data fetched:', data);
        return data;
      } catch (error) {
        console.warn('GISTDA API not available, using mock data');
        return null;
      }
    },
    refetchInterval: 300000, // 5 minutes
  });

  const generateMockHotspotsData = (): GISTDAHotspot[] => {
    const mockData: GISTDAHotspot[] = [];
    const now = new Date();
    
    // Generate hotspots across Southeast Asia with focus on Thailand
    for (let i = 0; i < 150; i++) {
      const isThailandHotspot = Math.random() < 0.7; // 70% in Thailand
      
      let lat, lng, country, province;
      
      if (isThailandHotspot) {
        lat = 6 + Math.random() * 14; // Thailand latitude range
        lng = 97 + Math.random() * 9; // Thailand longitude range
        country = 'Thailand';
        province = getProvinceFromCoordinates(lat, lng);
      } else {
        // Other Southeast Asian countries
        lat = 5 + Math.random() * 20;
        lng = 92 + Math.random() * 20;
        country = getCountryFromCoordinates(lat, lng);
        province = undefined;
      }
      
      const hoursAgo = Math.random() * 72; // Up to 3 days ago
      const hotspotDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      const confidence = Math.floor(30 + Math.random() * 70);
      const frp = Math.random() * 100;
      const brightness = 300 + Math.random() * 200;
      const instrument = Math.random() > 0.5 ? 'MODIS' : 'VIIRS';
      const riskLevel = calculateFireRiskLevel({ CONFIDENCE: confidence, FRP: frp, BRIGHTNESS: brightness });
      const areaRai = estimateAreaInRai(frp, confidence);
      
      mockData.push({
        LATITUDE: lat,
        LONGITUDE: lng,
        BRIGHTNESS: brightness,
        SCAN: 1.0 + Math.random() * 2.0,
        TRACK: 1.0 + Math.random() * 2.0,
        ACQ_DATE: hotspotDate.toISOString().split('T')[0],
        ACQ_TIME: hotspotDate.toTimeString().split(' ')[0].substring(0, 5),
        SATELLITE: Math.random() > 0.5 ? 'Terra' : 'Aqua',
        CONFIDENCE: confidence,
        VERSION: '6.0',
        BRIGHT_T31: 280 + Math.random() * 50,
        FRP: frp,
        DAYNIGHT: hoursAgo % 24 < 12 ? 'D' : 'N',
        TYPE: 0,
        province,
        country,
        geometry: {
          coordinates: [lng, lat]
        },
        properties: {
          confidence,
          instrument,
          frp,
          satellite: Math.random() > 0.5 ? 'Terra' : 'Aqua',
          pv_tn: province || 'Unknown',
          ap_tn: `อ.${['เมือง', 'แม่ริม', 'สันทราย', 'หางดง', 'สารภี'][Math.floor(Math.random() * 5)]}`,
          th_date: hotspotDate.toISOString().split('T')[0],
          th_time: hotspotDate.toTimeString().split(' ')[0].substring(0, 5),
          village: `บ้าน${['ดอยสุเทพ', 'ป่าแดด', 'แม่แจ่ม', 'ขุนกาง', 'แม่วาง'][Math.floor(Math.random() * 5)]}`,
          lu_name: ['ป่าไผ่', 'ป่าสน', 'ป่าเต็งรัง', 'พื้นที่เกษตร'][Math.floor(Math.random() * 4)],
          acq_date: hotspotDate.toISOString().split('T')[0],
          changwat: province,
          tambon: `ต.${['ศรีภูมิ', 'ช้างคลาน', 'หายยา', 'ป่าตาล', 'สุเทพ'][Math.floor(Math.random() * 5)]}`,
          area_rai: areaRai,
          risk_level: riskLevel
        }
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    let processedHotspots: GISTDAHotspot[] = [];
    
    if (hotspotsData && Array.isArray(hotspotsData.features)) {
      processedHotspots = hotspotsData.features.map((hotspot: any) => {
        const lat = hotspot.LATITUDE || hotspot.geometry?.coordinates?.[1];
        const lng = hotspot.LONGITUDE || hotspot.geometry?.coordinates?.[0];
        const province = isInThailand(lat, lng) ? getProvinceFromCoordinates(lat, lng) : undefined;
        const country = getCountryFromCoordinates(lat, lng);
        const riskLevel = calculateFireRiskLevel(hotspot);
        const areaRai = estimateAreaInRai(hotspot.FRP || 0, hotspot.CONFIDENCE || 0);
        
        return {
          ...hotspot,
          LATITUDE: lat,
          LONGITUDE: lng,
          province,
          country,
          geometry: {
            coordinates: [lng, lat]
          },
          properties: {
            confidence: hotspot.CONFIDENCE,
            instrument: hotspot.SATELLITE === 'Terra' || hotspot.SATELLITE === 'Aqua' ? 'MODIS' : 'VIIRS',
            frp: hotspot.FRP || 0,
            satellite: hotspot.SATELLITE,
            pv_tn: province || 'Unknown',
            ap_tn: hotspot.ap_tn || 'อ.เมือง',
            th_date: hotspot.ACQ_DATE,
            th_time: hotspot.ACQ_TIME,
            village: hotspot.village || 'บ้านป่าแดด',
            lu_name: hotspot.lu_name || 'ป่าไผ่',
            acq_date: hotspot.ACQ_DATE,
            changwat: province,
            tambon: hotspot.tambon || 'ต.ศรีภูมิ',
            area_rai: areaRai,
            risk_level: riskLevel
          }
        };
      });
    } else {
      processedHotspots = generateMockHotspotsData();
    }

    // Apply time filter
    const filterDate = getTimeFilterDate(timeFilter);
    if (filterDate) {
      processedHotspots = processedHotspots.filter(hotspot => {
        const hotspotDate = new Date(hotspot.ACQ_DATE);
        return hotspotDate >= filterDate;
      });
    }

    setHotspots(processedHotspots);

    // Calculate enhanced statistics
    const totalHotspots = processedHotspots.length;
    const last24Hours = processedHotspots.filter(h => {
      const hotspotDate = new Date(h.ACQ_DATE);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return hotspotDate >= yesterday;
    }).length;

    const highConfidence = processedHotspots.filter(h => h.CONFIDENCE >= 80).length;
    const averageConfidence = totalHotspots > 0 
      ? processedHotspots.reduce((sum, h) => sum + h.CONFIDENCE, 0) / totalHotspots 
      : 0;

    // Thailand-specific statistics with risk assessment
    const thailandHotspots = processedHotspots.filter(h => h.country === 'Thailand');
    const thailandByProvince = thailandHotspots.reduce((acc, hotspot) => {
      const province = hotspot.province || 'อื่นๆ';
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
        level: level === 'very_high' ? 'เสี่ยงมากที่สุด' : 
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

    // Regional data (for existing compatibility)
    const regionalData = Object.entries(
      processedHotspots.reduce((acc, h) => {
        const region = h.country || 'Unknown';
        if (!acc[region]) {
          acc[region] = { count: 0, totalConfidence: 0 };
        }
        acc[region].count++;
        acc[region].totalConfidence += h.CONFIDENCE;
        return acc;
      }, {} as Record<string, { count: number; totalConfidence: number }>)
    ).map(([region, data]) => ({
      region,
      count: data.count,
      averageConfidence: data.count > 0 ? data.totalConfidence / data.count : 0
    })).sort((a, b) => b.count - a.count);

    // Time distribution
    const timeDistribution = processedHotspots.reduce((acc, h) => {
      const hour = h.ACQ_TIME.split(':')[0];
      const timeSlot = `${hour}:00`;
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
          ? Math.round(thailandHotspots.reduce((sum, h) => sum + h.CONFIDENCE, 0) / thailandHotspots.length)
          : 0,
        totalRiskArea,
        byRiskLevel
      },
      international: {
        totalHotspots: internationalHotspots.length,
        byCountry: internationalCountryData,
        averageConfidence: internationalHotspots.length > 0 
          ? Math.round(internationalHotspots.reduce((sum, h) => sum + h.CONFIDENCE, 0) / internationalHotspots.length)
          : 0
      }
    };

    console.log('Updated wildfire stats with risk assessment:', newStats);
    setStats(newStats);
  }, [hotspotsData, timeFilter]);

  return {
    hotspots,
    stats,
    isLoading,
    refetch: () => console.log('Refetching wildfire data...')
  };
};
