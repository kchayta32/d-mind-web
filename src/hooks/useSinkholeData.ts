import { useState, useEffect } from 'react';

export interface SinkholeData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  location: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  mainImage: string;
  additionalImages: string[];
  estimatedSize: string;
  cause: string;
  status: string;
}

export interface SinkholeStats {
  totalIncidents: number;
  highSeverity: number;
  averageSize: string;
  lastIncident: string;
  affectedAreas: number;
}

export const useSinkholeData = () => {
  const [sinkholes, setSinkholes] = useState<SinkholeData[]>([]);
  const [stats, setStats] = useState<SinkholeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSinkholeData = async () => {
      try {
        setIsLoading(true);
        
        // ข้อมูลจำลองจากเหตุการณ์จริงในดุสิต กทม.
        const mockData: SinkholeData[] = [
          {
            id: 'sinkhole-dusit-001',
            latitude: 13.7878,
            longitude: 100.5150,
            title: 'ถนนทรุดเขตดุสิต',
            location: 'ถนนสามเสน เขตดุสิต กรุงเทพมหานคร',
            date: '24 กันยายน 2568',
            severity: 'high',
            description: 'เกิดเหตุแผ่นดินยุบทำให้ถนนทรุดตัวลงเป็นหลุมขนาดใหญ่ คาดการณ์ว่าดินหายไปกว่าพันลูกบาศก์เมตร อาจเป็นผลจากการขุดเจาะใต้ดินหรือระบบท่อประปาเก่า',
            mainImage: '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png',
            additionalImages: [
              '/lovable-uploads/7799a9ff-3b81-4e41-9c7b-b6054d5e7b62.png',
              '/lovable-uploads/9b24d25c-901c-4aaf-98dd-78419a5984cd.png',
              '/lovable-uploads/9ee04c09-ef87-44e4-b06d-424087a59578.png'
            ],
            estimatedSize: '10 x 15 เมตร ลึก 8 เมตร',
            cause: 'การขุดเจาะใต้ดินและระบบสาธารณูปโภคเก่า',
            status: 'อยู่ระหว่างการซ่อมแซม'
          }
        ];

        const mockStats: SinkholeStats = {
          totalIncidents: mockData.length,
          highSeverity: mockData.filter(s => s.severity === 'high').length,
          averageSize: '12 x 8 เมตร',
          lastIncident: mockData[0]?.date || 'ไม่มีข้อมูล',
          affectedAreas: 1
        };

        // จำลองการ delay API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSinkholes(mockData);
        setStats(mockStats);
        setError(null);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลแผ่นดินยุบได้');
        console.error('Error fetching sinkhole data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSinkholeData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    // ในโปรเจ็คจริงจะเรียก API ใหม่
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    sinkholes,
    stats,
    isLoading,
    error,
    refetch
  };
};