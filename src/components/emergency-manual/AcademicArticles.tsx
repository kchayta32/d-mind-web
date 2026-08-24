import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, ChevronDown, Calendar, FileText, Search, ExternalLink, BookOpen, GraduationCap, X, CheckCircle2 } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageProvider';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { language } = useLanguage();
  const isEn = language === 'en';

  const academicArticles = useMemo<AcademicArticle[]>(() => [
    {
      id: 'frontiers-water-2022',
      title: 'การจัดการทรัพยากรน้ำและการป้องกันน้ำท่วมเชิงพื้นที่',
      authors: 'Frontiers in Water Research Team',
      year: 2565,
      journal: 'Frontiers in Water',
      category: 'การจัดการน้ำและน้ำท่วม',
      abstract: 'งานวิจัยในวารสาร Frontiers in Water ศึกษาเกี่ยวกับการจัดการทรัพยากรน้ำและระบบป้องกันน้ำท่วมในพื้นที่เสี่ยง พร้อมแนวทางการปรับตัวต่อการเปลี่ยนแปลงสภาพภูมิอากาศเชิงพื้นที่',
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
      abstract: 'งาน Nature (พ.ย. 2024) พัฒนาอัลกอริทึมใหม่ "ASL" ใช้ข้อมูลจากดาวเทียม Himawari‑8 เพื่อวัด SSA ที่ความถี่ 443 nm ด้วยความแม่นยำสูง',
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
      abstract: 'งานวิจัยประเมินผลกระทบด้านสุขภาพจากก๊าซซัลเฟอร์ไดออกไซด์ (SO₂) พบว่ามีส่วนเชื่อมโยงกับความเสี่ยงการลดลงด้านความคิดและโรคทางระบบประสาท',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39179784/'
    },
    {
      id: 'bmc-neurology-epilepsy-2568',
      title: 'งานใน BMC Neurology: ผลกระทบของหลายมลพิษต่อโรคลมชัก',
      authors: 'BMC Neurology Research Group',
      year: 2568,
      journal: 'BMC Neurology',
      category: 'สุขภาพและมลพิษ',
      abstract: 'การวิเคราะห์มลพิษร่วมทางอากาศ (PM2.5, PM10, NO2, O3) ต่ออัตราการกำเริบของอาการทางระบบประสาท',
      url: 'https://bmcneurol.biomedcentral.com/'
    },
    {
      id: 'pm25-lung-inflammation-2566',
      title: 'กลไกระดับเซลล์ของการอักเสบในระบบทางเดินหายใจจากฝุ่น PM2.5',
      authors: 'ศูนย์วิจัยพิษวิทยาสิ่งแวดล้อม',
      year: 2566,
      journal: 'Journal of Environmental Sciences',
      category: 'มลพิษอากาศและสุขภาพ',
      abstract: 'ศึกษาเส้นทางการกระตุ้นภูมิคุ้มกันและการหลั่งสารไซโตไคน์ที่ก่อการอักเสบในปอดเมื่อสัมผัสฝุ่นละอองขนาดเล็ก PM2.5 แบบเฉียบพลันและเรื้อรัง',
      url: 'https://sciencedirect.com'
    }
  ], []);

  const categories = useMemo(() => {
    const cats = [...new Set(academicArticles.map(a => a.category))];
    return ['all', ...cats];
  }, [academicArticles]);

  const years = useMemo(() => {
    const yList = [...new Set(academicArticles.map(a => a.year.toString()))].sort((a, b) => b.localeCompare(a));
    return ['all', ...yList];
  }, [academicArticles]);

  const filteredArticles = useMemo(() => {
    return academicArticles.filter(article => {
      // Year
      if (selectedYear !== 'all' && article.year.toString() !== selectedYear) return false;
      // Category
      if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchAuthor = article.authors.toLowerCase().includes(q);
        const matchJournal = article.journal.toLowerCase().includes(q);
        const matchAbstract = article.abstract.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchJournal && !matchAbstract) return false;
      }
      return true;
    });
  }, [academicArticles, selectedYear, selectedCategory, searchQuery]);

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const DownloadButton: React.FC<{ article: AcademicArticle }> = ({ article }) => {
    if (!article.downloads && !article.url) return null;

    if (article.downloads) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 h-8 text-xs font-semibold rounded-lg bg-card border-border hover:bg-muted">
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>{isEn ? 'Download' : 'ดาวน์โหลด'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 bg-popover border-border shadow-xl">
            {article.downloads.pdf && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.pdf!)} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2 text-red-500" />
                <span>PDF Document</span>
              </DropdownMenuItem>
            )}
            {article.downloads.readcube && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.readcube!)} className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2 text-blue-500" />
                <span>ReadCube</span>
              </DropdownMenuItem>
            )}
            {article.downloads.epub && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.epub!)} className="cursor-pointer">
                <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                <span>EPUB Format</span>
              </DropdownMenuItem>
            )}
            {article.downloads.xml && (
              <DropdownMenuItem onClick={() => handleDownload(article.downloads!.xml!)} className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2 text-amber-500" />
                <span>XML (NLM)</span>
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
        onClick={() => handleDownload(article.url!)}
        className="flex items-center gap-1.5 h-8 text-xs font-semibold rounded-lg bg-card border-border hover:bg-muted"
      >
        <ExternalLink className="w-3.5 h-3.5 text-primary" />
        <span>{isEn ? 'View Journal' : 'เปิดอ่านวารสาร'}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isEn ? 'Search academic papers, journals or authors...' : 'ค้นหางานวิจัย, วารสาร หรือผู้เขียน...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9 bg-card border-border rounded-xl h-11 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-muted-foreground font-medium">
            {filteredArticles.length} {isEn ? 'Papers found' : 'ผลงานวิจัย'}
          </span>
        </div>
      </div>

      {/* Year Filter Buttons */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-muted-foreground mr-1">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{isEn ? 'Year:' : 'ปีที่พิมพ์:'}</span>
        </div>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2">
            {years.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className={`rounded-full h-8 px-3.5 text-xs font-medium ${
                  selectedYear === year ? 'shadow-sm' : 'bg-card border-border hover:bg-muted'
                }`}
              >
                {year === 'all' ? (isEn ? 'All Years' : 'ทุกปี') : year}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full h-8 px-3.5 text-xs font-medium shrink-0 ${
              selectedCategory === cat ? 'shadow-sm' : 'bg-card border-border hover:bg-muted'
            }`}
          >
            {cat === 'all' ? (isEn ? 'All Topics' : 'ทุกหัวข้อ') : cat}
          </Button>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card border-l-4 border-l-primary group"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[11px] font-semibold">
                      {article.journal} ({article.year})
                    </Badge>
                    <Badge variant="secondary" className="text-[11px]">
                      {article.category}
                    </Badge>
                    {article.doi && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        DOI: {article.doi}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <DownloadButton article={article} />
                </div>
              </div>

              <div className="mb-3 text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="font-semibold text-foreground">{isEn ? 'Authors:' : 'คณะผู้จัดทำ:'}</span>
                <span>{article.authors}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                <p className="line-clamp-3 group-hover:line-clamp-none transition-all">
                  <span className="font-semibold text-foreground mr-1">{isEn ? 'Abstract:' : 'บทคัดย่อ:'}</span>
                  {article.abstract}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <Card className="border-border bg-card p-8 text-center">
          <GraduationCap className="w-10 h-10 text-muted-foreground/60 mx-auto mb-2" />
          <h4 className="text-base font-bold text-foreground mb-1">
            {isEn ? 'No research papers found' : 'ไม่พบงานวิจัยที่ตรงกับเงื่อนไข'}
          </h4>
          <p className="text-xs text-muted-foreground">
            ลองปรับเปลี่ยนปีที่พิมพ์ หรือคำค้นหาใหม่อีกครั้ง
          </p>
        </Card>
      )}

    </div>
  );
};

export default AcademicArticles;
