import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ImprovedArticleTimeline } from './ImprovedArticleTimeline';

const EmergencyArticles: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const articles = [
    {
      id: 'pm25-clean-air-act-2025',
      title: "PM2.5 ทำป่วย จี้รัฐบาลใหม่ 60 วันแรก เร่งคืน 'กองทุนอากาศสะอาด' สู่ร่างกฎหมาย",
      subtitle: 'จาก bangkokbiznews.com',
      description: 'ผู้เชี่ยวชาญเรียกร้องให้รัฐบาลใหม่เร่งนำร่าง พ.ร.บ. อากาศสะอาด กลับมาพิจารณาภายใน 60 วัน โดยต้องคง "กองทุนอากาศสะอาด" และมาตรการทางเศรษฐศาสตร์ไว้',
      image: '/lovable-uploads/20251219_1.webp',
      created_at: '2025-12-19'
    },
    {
      id: 'weather-warning-cold-2025',
      title: 'สภาพอากาศแปรปรวน "หนาวเย็นลง" เตือน 22-26 ธ.ค. อุณหภูมิลดฮวบ',
      subtitle: 'จาก ข่าวสด ONLINE',
      description: 'กรมอุตุนิยมวิทยาประกาศเตือนมวลอากาศเย็นระลอกใหม่จากประเทศจีนแผ่ปกคลุมประเทศไทยตอนบน ส่งผลให้อุณหภูมิลดลงฉับพลัน พร้อมลมแรงในช่วงวันที่ 22-26 ธันวาคมนี้',
      image: '/lovable-uploads/weather_warning_cold.png',
      created_at: '2025-12-22'
    },
    {
      id: 'sri-lanka-flood-2025',
      title: 'ศรีลังกาเผชิญมหาอุทกภัย "ที่ท้าทายที่สุด" ในประวัติศาสตร์ประเทศ เสียชีวิตแล้วทะลุ 300 ราย',
      subtitle: 'จาก BBC NEWS ไทย',
      description: 'ศรีลังกากำลังเผชิญกับวิกฤตอุทกภัยครั้งใหญ่ที่สุดในประวัติศาสตร์ของประเทศ โดยยอดผู้เสียชีวิตล่าสุดพุ่งสูงทะลุ 300 รายแล้ว',
      image: '/lovable-uploads/2025121_1.webp',
      created_at: '2025-12-01'
    },
    {
      id: 'air-quality-index',
      title: 'Air Quality Index',
      subtitle: 'จาก airtw.moenv.gov.tw',
      description: 'ดัชนีคุณภาพอากาศและตัวบ่งชี้มลพิษทางอากาศ',
      image: '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png',
      created_at: '2025-05-15'
    },
    {
      id: 'uv-aerosol-index',
      title: 'UV Aerosol Index',
      subtitle: 'จาก earthdata.nasa.gov',
      description: 'ดัชนี UV Aerosol สำหรับติดตามอนุภาคในชั้นบรรยากาศ',
      image: '/lovable-uploads/7799a9ff-3b81-4e41-9c7b-b6054d5e7b62.png',
      created_at: '2025-06-15'
    },
    {
      id: 'air-pollution-control-program',
      title: 'Air Pollution Control Program',
      subtitle: 'จาก air.moenv.gov.tw',
      description: 'โครงการควบคุมมลพิษอากาศและมาตรการจัดการคุณภาพอากาศ',
      image: '/lovable-uploads/9b24d25c-901c-4aaf-98dd-78419a5984cd.png',
      created_at: '2025-05-10'
    },
    {
      id: 'weather-forecast-july-2025',
      title: 'พยากรณ์อากาศ กรกฎาคม 2568',
      subtitle: 'จาก กรมอุตุนิยมวิทยา',
      description: 'การพยากรณ์อากาศและสภาพภูมิอากาศในเดือนกรกฎาคม 2568',
      image: '/lovable-uploads/9ee04c09-ef87-44e4-b06d-424087a59578.png',
      created_at: '2025-6-05'
    },
    {
      id: 'natural-disasters',
      title: 'ภัยธรรมชาติในประเทศไทย',
      subtitle: 'จาก กรมป้องกันและบรรเทาสาธารณภัย',
      description: 'ข้อมูลเกี่ยวกับภัยธรรมชาติที่เกิดขึ้นในประเทศไทย',
      image: '/lovable-uploads/aa72c068-2cf3-4b36-be9e-a7eb6351cb9d.png',
      created_at: '2025-05-12'
    },
    {
      id: 'earthquake-3countries',
      title: 'แผ่นดินไหวในภูมิภาคเอเชียตะวันออกเฉียงใต้',
      subtitle: 'จาก USGS และ TMD',
      description: 'ข้อมูลแผ่นดินไหวในไทย เมียนมาร์ และลาว',
      image: '/dmind-premium-icon.png',
      created_at: '2025-05-25'
    },
    {
      id: 'disaster-20years',
      title: 'ภัยพิบัติ 20 ปีที่ผ่านมา',
      subtitle: 'จาก องค์การบรรเทาทุกข์แห่งชาติ',
      description: 'สถิติและแนวโน้มของภัยพิบัติในช่วง 20 ปีที่ผ่านมา',
      image: '/lovable-uploads/bc9cca0f-39cd-462c-a13b-c60172f3fd2e.png',
      created_at: '2025-05-01'
    },
    {
      id: 'pm25-vs-pm10',
      title: 'PM2.5 vs PM10: ความแตกต่างและผลกระทบ',
      subtitle: 'จาก กรมควบคุมมลพิษ',
      description: 'เปรียบเทียบคุณสมบัติและผลกระทบของ PM2.5 และ PM10',
      image: '/lovable-uploads/70e87fa1-9284-4474-bda5-04c19250a4d5.png',
      created_at: '2025-05-10'
    },
    {
      id: 'earthquake-response-guide',
      title: '20 ปี ไทยสูญเสียจาก \'ภัยพิบัติ\' แค่ไหน ในวันที่โลกกำลังเผชิญกับความรุนแรงจาก \'โลกรวน\'',
      subtitle: 'จาก thairath.co.th',
      description: 'วิธีรับมือแผ่นดินไหว ควรทำอย่างไร มีข้อห้ามอะไรบ้าง',
      image: 'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa5K33t0GHlpONycxjrqHvHm6kPoArPPyVyaiSbN7K5XZ3mw0omYY.jpg',
      created_at: '2025-06-10'
    }
  ];

  const filteredArticles = useMemo(() => {
    if (!dateRange) return articles;

    return articles.filter(article => {
      const articleDate = new Date(article.created_at);
      return articleDate >= dateRange.start && articleDate <= dateRange.end;
    });
  }, [dateRange]);

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleShowAll = () => {
    setDateRange(null);
  };

  return (
    <div className="space-y-6">
      <ImprovedArticleTimeline
        onDateRangeChange={handleDateRangeChange}
        onShowAll={handleShowAll}
        articles={articles}
      />

      <div className="grid gap-4">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-primary/20 overflow-hidden group"
            onClick={() => handleArticleClick(article.id)}
          >
            <CardContent className="p-0">
              <div className="flex gap-0 md:gap-4 flex-col md:flex-row">
                <div className="w-full md:w-32 h-48 md:h-auto overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                      {new Date(article.created_at).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{article.subtitle}</p>
                  <p className="text-sm line-clamp-2">{article.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">ไม่พบบทความในช่วงเวลาที่เลือก</p>
            <p className="text-sm text-muted-foreground mt-2">ลองเลือกช่วงเวลาอื่นหรือแสดงบทความทั้งหมด</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyArticles;
