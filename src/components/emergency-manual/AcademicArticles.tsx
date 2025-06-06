
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AcademicArticle {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  category: string;
  abstract: string;
  doi?: string;
  url?: string;
}

const AcademicArticles: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const academicArticles: AcademicArticle[] = [
    {
      id: 'pm25-so2-cognitive-2567',
      title: 'งานวิจัยใน Scientific Reports: ผลกระทบของ PM2.5 และ SO₂ ต่อการเสื่อมด้านการรับรู้',
      authors: 'Researchers from Scientific Reports',
      year: 2567,
      journal: 'Scientific Reports',
      category: 'มลพิษอากาศและสุขภาพ',
      abstract: 'งานวิจัยใน Scientific Reports (ส.ค. 2024) พบว่าการสัมผัส PM2.5 และ SO₂ มีความสัมพันธ์อย่างมีนัยสำคัญกับการเสื่อมด้านการรับรู้ (OR 1.49 สำหรับ PM2.5; OR 1.39 สำหรับ SO₂)',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39179784/'
    },
    {
      id: 'himawari-ssa-algorithm-2567',
      title: 'Retrieval of hourly aerosol single scattering albedo over land using geostationary satellite data',
      authors: 'Xingxing Jiang, Yong Xue, Gerrit de Leeuw, Chunlin Jin, Sheng Zhang, Yuxin Sun, Shuhui Wu',
      year: 2567,
      journal: 'Nature',
      category: 'ดาวเทียมและการตรวจวัด',
      abstract: 'งาน Nature (พ.ย. 2024) พัฒนาอัลกอริทึมใหม่ "ASL" ใช้ข้อมูลจากดาวเทียม Himawari‑8 เพื่อวัด SSA ที่ความถี่ 443 nm ด้วยความแม่นยำสูง. The single scattering albedo (SSA) of aerosol particles is one of the key variables that determine aerosol radiative forcing. An Algorithm for the retrieval of Single scattering albedo over Land (ASL) is proposed for application to full-disk data from the advanced Himawari imager (AHI) sensor.',
      url: 'https://www.nature.com/articles/s41612-024-00690-6'
    },
    {
      id: 'saudi-arabia-seasonal-2567',
      title: 'การกระจายตลอดปีและแนวโน้มการเปลี่ยนแปลงตามฤดูกาลในซาอุดิอาระเบีย',
      authors: 'Research Team in Saudi Arabia',
      year: 2567,
      journal: 'Air Quality, Atmosphere & Health',
      category: 'ภูมิอากาศและสิ่งแวดล้อม',
      abstract: 'งานวิจัยในซาอุดิอาระเบีย (2024) พบว่ามีการกระจายตลอดปีและมีแนวโน้มเปลี่ยนแปลงตามฤดูกาลและปัจจัยภูมิอากาศ เช่น อุณหภูมิ ลม และชั้นโอโซนในบรรยากาศ',
      url: 'https://link.springer.com/article/10.1007/s11869-023-01423-z'
    },
    {
      id: 'so2-health-epilepsy-2567',
      title: 'SO₂ และความเสี่ยงต่อสุขภาพและโรคลมชัก',
      authors: 'Health Research Team',
      year: 2567,
      journal: 'Environmental Health Perspectives',
      category: 'สุขภาพและมลพิษ',
      abstract: 'แม้ว่าจะถูกกล่าวถึงน้อยในงานวิจัยล่าสุด แต่ SO₂ ยังคงเป็นส่วนหนึ่งของการประเมินด้านสุขภาพ เช่น พบว่ามีส่วนเชื่อมโยงกับความเสี่ยงกับการลดลงด้านความคิด รวมถึงโรคลมชัก (ตามบทความใน PM และสุขภาพ)',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39179784/'
    }
  ];

  const years = ['2560', '2561', '2562', '2563', '2564', '2565', '2566', '2567', '2568'];

  const filteredArticles = selectedYear === 'all' 
    ? academicArticles 
    : academicArticles.filter(article => article.year.toString() === selectedYear);

  return (
    <div className="space-y-4">
      {/* Year Filter */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-gray-700">กรองตามปี:</label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="เลือกปี" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกปี</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>พ.ศ. {year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-2 text-blue-700">
                {article.title}
              </h2>
              
              <div className="mb-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>ผู้เขียน:</strong> {article.authors}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>วารสาร:</strong> {article.journal} ({article.year})
                </p>
                {article.url && (
                  <p className="text-sm text-gray-600">
                    <strong>URL:</strong> <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{article.url}</a>
                  </p>
                )}
              </div>
              
              <div className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mb-3">
                {article.category}
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>บทคัดย่อ:</strong> {article.abstract}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          ไม่พบบทความในปีที่เลือก
        </div>
      )}
    </div>
  );
};

export default AcademicArticles;
