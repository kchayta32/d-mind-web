import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, ChevronDown, Calendar, FileText } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
  downloads?: {
    pdf?: string;
    readcube?: string;
    epub?: string;
    xml?: string;
  };
}

const AcademicArticles: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const academicArticles: AcademicArticle[] = [
    // New articles from user request
    {
      id: 'frontiers-water-2022',
      title: 'การจัดการทรัพยากรน้ำและการป้องกันน้ำท่วม',
      authors: 'Frontiers in Water Research Team',
      year: 2565,
      journal: 'Frontiers in Water',
      category: 'การจัดการน้ำและน้ำท่วม',
      abstract: 'งานวิจัยในวารสาร Frontiers in Water ที่ศึกษาเกี่ยวกับการจัดการทรัพยากรน้ำและระบบป้องกันน้ำท่วมในพื้นที่เสี่ยง พร้อมแนวทางการปรับตัวต่อการเปลี่ยนแปลงสภาพภูมิอากาศ',
      url: 'https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2022.786040/full',
      downloads: {
        pdf: 'https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2022.786040/pdf',
        readcube: 'http://www.readcube.com/articles/10.3389/frwa.2022.786040',
        epub: 'https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2022.786040/epub',
        xml: 'https://www.frontiersin.org/journals/water/articles/10.3389/frwa.2022.786040/xml/nlm'
      }
    },
    {
      id: 'aiot-earthquake-warning-2025',
      title: 'An AIoT System for Earthquake Early Warning on Resource Constrained Devices',
      authors: 'Marco Esposito, Alberto Belli, Laura Falaschetti, Lorenzo Palma',
      year: 2568,
      journal: 'IEEE Internet of Things Journal',
      category: 'ระบบเตือนภัยแผ่นดินไหว',
      abstract: 'ระบบ AIoT สำหรับการเตือนภัยแผ่นดินไหวล่วงหน้าบนอุปกรณ์ที่มีทรัพยากรจำกัด งานวิจัยนี้พัฒนาระบบที่สามารถทำงานบนอุปกรณ์ IoT ขนาดเล็กเพื่อให้การเตือนภัยแผ่นดินไหวที่รวดเร็วและแม่นยำ โดยใช้เทคโนโลยี AI และ IoT ร่วมกัน',
      url: 'https://www.researchgate.net/publication/387870802_An_AIoT_System_for_Earthquake_Early_Warning_on_Resource_Constrained_Devices',
      doi: '10.1109/JIOT.2025.3527750'
    },
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
      abstract: 'งาน Nature (พ.ย. 2024) พัฒนาอัลกอริทึมใหม่ "ASL" ใช้ข้อมูลจากดาวเทียม Himawari‑8 เพื่อวัด SSA ที่ความถี่ 443 nm ด้วยความแม่นยำสูง.',
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
      abstract: 'แม้ว่าจะถูกกล่าวถึงน้อยในงานวิจัยล่าสุด แต่ SO₂ ยังคงเป็นส่วนหนึ่งของการประเมินด้านสุขภาพ เช่น พบว่ามีส่วนเชื่อมโยงกับความเสี่ยงกับการลดลงด้านความคิด รวมถึงโรคลมชัก',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39179784/'
    },
    {
      id: 'bmc-neurology-epilepsy-2568',
      title: 'งานใน BMC Neurology: ผลกระทบของหลายมลพิษต่อโรคลมชัก',
      authors: 'BMC Neurology Research Team',
      year: 2568,
      journal: 'BMC Neurology',
      category: 'สุขภาพและมลพิษ',
      abstract: 'งานใน BMC Neurology (เม.ย. 2025) ศึกษาผลกระทบของหลายมลพิษ (PM2.5, NO₂, SO₂, O₃) ต่อโรคลมชัก ชี้ว่ามลพิษในอากาศอาจเพิ่มความเสี่ยงต่อการเป็นโรคลมชัก',
      url: 'https://pubmed.ncbi.nlm.nih.gov/40169939/'
    },
    {
      id: 'aeronet-aod-ssa-2568',
      title: 'งานวิจัยโดย AERONET: วิเคราะห์ข้อมูล AOD และ SSA',
      authors: 'AERONET Research Team',
      year: 2568,
      journal: 'Atmospheric Chemistry and Physics',
      category: 'ดาวเทียมและการตรวจวัด',
      abstract: 'งานวิจัยโดย AERONET (เม.ย. 2025) วิเคราะห์ข้อมูล AOD และ SSA จากระดับ 2/1.5 โดยครอบคลุมสถานี 172 แห่ง ชี้ให้เห็นแนวโน้มของอนุภาคในชั้นบรรยากาศตั้งแต่ปี 2000 ขึ้นไป',
      url: 'https://acp.copernicus.org/articles/25/4617/2025/'
    },
    {
      id: 'nasa-modis-aod-pm25-2568',
      title: 'งานนำเสนอของ NASA: แนวโน้ม AOD จาก MODIS และ PM2.5',
      authors: 'NASA Research Team',
      year: 2568,
      journal: 'NASA Technical Reports',
      category: 'ดาวเทียมและการตรวจวัด',
      abstract: 'งานนำเสนอของ NASA (ม.ค. 2025) แสดงว่าแนวโน้ม AOD จาก MODIS สามารถใช้เป็นตัวแทนแนวโน้ม PM2.5 ได้ในเมืองเขตร้อนหลายแห่ง',
      url: 'https://ntrs.nasa.gov/api/citations/20240016373/downloads/toth_ams_2025_talk_new.pdf'
    },
    {
      id: 'tropomi-ml-no2-o3-2568',
      title: 'โมเดล ML เพื่อประมาณค่า NO₂ และ O₃ จากข้อมูล TROPOMI',
      authors: 'Machine Learning Research Team',
      year: 2568,
      journal: 'Remote Sensing of Environment',
      category: 'ดาวเทียมและการตรวจวัด',
      abstract: 'งานวิจัยเดือนที่ผ่านมา (ม.ค. 2025) พัฒนาโมเดล ML เพื่อประมาณค่า NO₂ และ O₃ ระดับพื้นผิวจากข้อมูล TROPOMI โดยใช้ความละเอียดเชิงพื้นที่สูงในเอเชียตะวันออก',
      url: 'https://www.researchgate.net/publication/353289763_Estimation_of_surface-level_NO2_and_O3_concentrations_using_TROPOMI_data_and_machine_learning_over_East_Asia'
    },
    {
      id: 'kaohsiung-climate-air-quality-2568',
      title: 'การวิเคราะห์ปัจจัยภูมิอากาศต่อคุณภาพอากาศในเมืองท่า Kaohsiung',
      authors: 'Kaohsiung Environmental Research Team',
      year: 2568,
      journal: 'Science of The Total Environment',
      category: 'ภูมิอากาศและสิ่งแวดล้อม',
      abstract: 'งานวิจัยวิเคราะห์ว่า ตัวแปรเช่นอุณหภูมิ ความชื้น ลม เปลี่ยนแปลงคุณภาพอากาศและ AQI อย่างไรในเมืองท่า Kaohsiung โดยพบว่าปรากฏแนวโน้มแตกต่างกันในแต่ละฤดูกาล',
      url: 'https://www.sciencedirect.com/science/article/pii/S240584402500074X'
    }
  ];

  const years = ['2560', '2561', '2562', '2563', '2564', '2565', '2566', '2567', '2568'];

  const filteredArticles = selectedYear === 'all'
    ? academicArticles
    : academicArticles.filter(article => article.year.toString() === selectedYear);

  const handleDownload = (url: string, filename: string) => {
    window.open(url, '_blank');
  };

  const DownloadButton: React.FC<{ article: AcademicArticle }> = ({ article }) => {
    if (!article.downloads && !article.url) return null;

    if (article.downloads) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 h-8">
              <Download className="w-3 h-3" />
              <span className="text-xs">Download</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {article.downloads.pdf && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.pdf!, 'article.pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
            )}
            {article.downloads.readcube && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.readcube!, 'readcube')}>
                <Download className="w-4 h-4 mr-2" />
                ReadCube
              </DropdownMenuItem>
            )}
            {article.downloads.epub && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.epub!, 'article.epub')}>
                <Download className="w-4 h-4 mr-2" />
                EPUB
              </DropdownMenuItem>
            )}
            {article.downloads.xml && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.xml!, 'article.xml')}>
                <Download className="w-4 h-4 mr-2" />
                XML (NLM)
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDownload(article.url!, 'article')}
        className="flex items-center gap-2 h-8"
      >
        <Download className="w-3 h-3" />
        <span className="text-xs">View</span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Year Filter - Compact Horizontal Scroll */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 shrink-0 text-sm font-medium text-muted-foreground mr-2">
          <Calendar className="w-4 h-4" />
          <span>ปีที่พิมพ์:</span>
        </div>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2">
            <Button
              variant={selectedYear === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedYear('all')}
              className="rounded-full h-8 px-4"
            >
              ทั้งหมด
            </Button>
            {years.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className="rounded-full h-8 px-4"
              >
                {year}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow group border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 mr-4">
                  <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {article.journal} ({article.year})
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <DownloadButton article={article} />
              </div>

              <div className="mb-3">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">ผู้เขียน:</span> {article.authors}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
                {article.abstract}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-white/50 rounded-lg border border-dashed border-gray-300">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">ไม่พบบทความในปี {selectedYear}</p>
        </div>
      )}
    </div>
  );
};

export default AcademicArticles;
