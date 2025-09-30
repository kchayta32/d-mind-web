import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Calendar, Clock } from 'lucide-react';

interface SinkholeNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  time: string;
  summary: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

const SinkholeNews: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<SinkholeNewsItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Handle body scroll lock
  React.useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSheetOpen) {
        closeSheet();
      }
    };

    if (isSheetOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSheetOpen]);

  const openSheet = (news: SinkholeNewsItem) => {
    setSelectedNews(news);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedNews(null);
  };

  // Sample news data - ปกติจะดึงจาก API
  const newsItems: SinkholeNewsItem[] = [
    {
      id: '1',
      title: 'ถนนทรุด ปริศนาหลุมกว้าง คาดดินหายไปกว่าพันคิว โอกาสเกิดได้ทั่ว กทม.',
      source: 'ไทยรัฐออนไลน์',
      date: '24 ก.ย. 2568',
      time: '13:47 น.',
      summary: 'เกิดเหตุแผ่นดินยุบในพื้นที่เขตดุสิต กรุงเทพมหานคร ทำให้ถนนทรุดตัวลงเป็นหลุมขนาดใหญ่',
      location: 'เขตดุสิต กทม.',
      severity: 'high'
    }
  ];


  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'ร้ายแรง';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'เล็กน้อย';
      default: return 'ไม่ระบุ';
    }
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-amber-800 flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            ข่าวแผ่นดินยุบ/ดินทรุด
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            ข่าวล่าสุด 1 เดือนที่ผ่านมา
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {newsItems.map((news) => (
            <div key={news.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(news.severity)}`}>
                  {getSeverityText(news.severity)}
                </span>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {news.date}
                  <Clock className="w-3 h-3" />
                  {news.time}
                </div>
              </div>
              
              <h4 className="font-medium text-sm mb-2 line-clamp-2">
                {news.title}
              </h4>
              
              <p className="text-xs text-muted-foreground mb-2">
                {news.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600">
                  📍 {news.location}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => openSheet(news)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  อ่านต่อ
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                จาก {news.source}
              </div>
            </div>
          ))}
          
          {newsItems.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">ไม่มีข่าวใหม่ในช่วงนี้</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Sheet */}
      {isSheetOpen && selectedNews && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/25 z-40" 
            onClick={closeSheet}
          />
          
          {/* Sheet Panel */}
          <div className="fixed right-0 top-0 w-[92vw] sm:w-[520px] max-w-[560px] h-screen overflow-y-auto rounded-l-2xl bg-white z-50">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-amber-800 flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                ข่าวแผ่นดินยุบ
              </h2>
              <button
                onClick={closeSheet}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="ปิด"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* News Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">แหล่งที่มา:</span>
                  <p className="text-gray-600 mt-1">{selectedNews.source}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">วันที่:</span>
                  <p className="text-gray-600 mt-1">{selectedNews.date} {selectedNews.time}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">สถานที่:</span>
                  <p className="text-gray-600 mt-1">{selectedNews.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">ระดับความรุนแรง:</span>
                  <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full border ${getSeverityColor(selectedNews.severity)}`}>
                    {getSeverityText(selectedNews.severity)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {selectedNews.title}
                </h3>
              </div>

              {/* Summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2">สรุปข่าว</h4>
                <p className="text-gray-700 leading-relaxed">{selectedNews.summary}</p>
              </div>

              {/* Full Article */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">ข่าวเต็ม</h4>
                      <p className="text-blue-100 text-sm">รายละเอียดครบถ้วนจากแหล่งข่าว</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Hero Image */}
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6ri8FQEf2ABO7YOgvbrCXI0TedcKKvG0BJ59Xxem1FJEvS8PSQE.webp"
                      alt="ถนนทรุดบริเวณสามเสน"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Article Title */}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      ถนนทรุด ปริศนาหลุมกว้าง คาดดินหายไปกว่าพันคิว โอกาสเกิดได้ทั่ว กทม.
                    </h1>
                  </div>

                  {/* Lead Paragraph */}
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <p className="text-gray-800 leading-relaxed font-medium">
                      ถนนทรุด ปริศนาหลุมกว้าง คาดดินหายไปกว่าพันคิว ปมสงสัยการขนดินก่อสร้างจนเป็นโพรงขนาดใหญ่ ชี้มีโอกาสเกิดได้ทั่ว กทม.
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      เหตุการณ์ถนนยุบบริเวณสามเสน เกิดขึ้นเมื่อเช้า 24 ก.ย. 68 เบื้องต้นคาดว่ามาจากการก่อสร้างรถไฟฟ้าใต้ดิน ที่เป็นอุโมงค์อยู่ด้านใต้ของถนน เบื้องต้นมีอาคารรอบข้างเสียหาย และรถยนต์บางคันตกลงไปในหลุม เจ้าหน้าที่ได้ทำการปิดช่องทางการจราจรแล้ว
                    </p>

                    {/* Image 2 */}
                    <div className="my-6 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src="https://static.thairath.co.th/media/Dtbezn3nNUxytg04avhPZEtJhxuUFDiGRQbuTNrJz5CuYq.webp"
                        alt="บริเวณที่เกิดเหตุ"
                        className="w-full h-auto"
                      />
                    </div>

                    <p>
                      <strong className="text-gray-900">รศ.ดร.วัชรินทร์ กาสลัก นายกวิศวกรรมสถานแห่งประเทศไทย (วสท.)</strong> ในพระบรมราชูปถัมภ์ วิเคราะห์ว่า ถนนทรุด ย่านสามเสน ด้านหน้าโรงพยาบาลวชิระ หลายคนวิเคราะห์ว่าเกิดจากปัญหาการก่อสร้างที่มีโพรงลึก เนื่องจากพื้นที่ตรงนั้นมีน้ำใต้ดิน แต่ยังหาข้อพิสูจน์ไม่ได้ว่ามันมีปัญหาดินก่อนหรือหลัง ที่น่าสงสัยคือ ดินบริเวณนั้นหายไปจากจุดนั้นได้อย่างไร หากประเมินคาดว่าดินจะหายไปกว่า 10,000 คิว
                    </p>

                    <p>
                      แต่ยังไม่รู้ว่าเริ่มต้นนั้นหายไปเท่าไหร่ การที่ดินบริเวณนั้นหายไปมากขนาดนั้น ทำไมไม่มีใครทราบในระหว่างการก่อสร้าง เพราะปกติเหตุการณ์ที่เกิดขึ้นดินจะไหลเข้าไปในอุโมงค์ แต่ก็เลยแปลกใจว่าทำไมไม่มีใครรู้ หรือไม่มีใครสังเกตเลยหรือไม่
                    </p>

                    {/* Image 3 */}
                    <div className="my-6 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src="https://static.thairath.co.th/media/Dtbezn3nNUxytg04avhPZEtJhxuUFDiGGbrVntguRihAQE.webp"
                        alt="การตรวจสอบพื้นที่"
                        className="w-full h-auto"
                      />
                    </div>

                    <p>
                      ส่วนพื้นที่หลุมที่มีความลึกคาดว่า มีความลึกไปถึงด้านหลังของอุโมงค์รถไฟฟ้า ประมาณ 15 ถึง 16 เมตร จึงเป็นไปได้ว่าระดับการไหลของดินอยู่ที่ระดับของอุโมงค์ โดยเฉพาะอุโมงค์ที่เป็นรอยต่อของสถานี คาดว่าดินจะไหลไปในบริเวณนั้น
                    </p>

                    <p>
                      ดังนั้นดินส่วนที่อยู่ต่ำกว่าอุโมงค์ จะไม่ไหลทรุดลงไปอีก ลักษณะนี้เห็นได้ชัดว่าดินที่ไหลยุบมาจากข้างบนอุโมงค์รถไฟฟ้า บริเวณที่เป็นหลุมยุบคาดว่าสักพักหนึ่งคงจะหยุดการทรุดตัว เพราะว่าดินที่อยู่ต่ำกว่าอุโมงค์จะไหลเข้ามาในอุโมงค์ไม่ได้แล้ว
                    </p>

                    <p>
                      ขณะเดียวกันถ้าดินไหลเข้าไปเต็มอุโมงค์ที่เป็นช่องว่าง มันก็จะบล็อกไม่ให้ดินไหลเข้าไปในอุโมงค์อีก หลุมยุบบนถนนในกรุงเทพฯ ทุกแห่งยังสามารถเกิดขึ้นได้ อยู่ที่การก่อสร้างมีความรอบคอบ และเฝ้าระวังดินที่จะทรุดตัวไปในอุโมงค์หรือไม่
                    </p>

                    {/* Warning Box */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg my-6">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold text-amber-900 mb-2">คำเตือนและมาตรการป้องกัน</h3>
                          <p className="text-amber-800 leading-relaxed">
                            การป้องกันในการก่อสร้างควรมีเครื่องมือวัด เพื่อดูว่าในระหว่างสร้างมีดินเคลื่อนตัวเข้ามาในอุโมงค์หรือไม่ หรือว่าในระหว่างก่อสร้างเราควรนับดินที่ขนออกไปจากอุโมงค์ว่ามีจำนวนกี่คิว ถ้ามากเกินไปก็ควรสันนิษฐานว่า มันมีดินจากส่วนอื่นไหลมาเติม
                          </p>
                        </div>
                      </div>
                    </div>

                    <p>
                      เพราะอย่างกรณีที่เกิดขึ้น ดินที่เป็นหลุมยุบหายไปถึงประมาณ 10,000 คิว มันเป็นไปไม่ได้ในการก่อสร้าง ปกติดินเหนียวของกรุงเทพฯ ถ้าไม่มีโพรง ดินก็ไม่สามารถยุบตัวได้ แต่กรณีที่ดินยุบตัวลง เพราะว่ามีอุโมงค์ให้ดินไหลไปได้
                    </p>

                    {/* Image 4 */}
                    <div className="my-6 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src="https://static.thairath.co.th/media/Dtbezn3nNUxytg04avhPZEtJhxuUFDiGMOY7kvBuFzsiiJ.webp"
                        alt="มาตรการความปลอดภัย"
                        className="w-full h-auto"
                      />
                    </div>

                    <p>
                      ดังนั้น เวลาก่อสร้างจึงต้องควบคุมคุณภาพ ความสงสัยของผมคาดว่าไม่น่าจะเกิดการยุบตัวได้ในคืนเดียว แต่ดินจำนวนมากน่าจะไหลมาก่อนหน้านี้แล้ว
                    </p>

                    {/* Safety Notice */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg my-6">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <h3 className="font-semibold text-red-900 mb-2">ข้อควรระวังสำหรับอาคารในพื้นที่</h3>
                          <p className="text-red-800 leading-relaxed">
                            สิ่งที่ต้องระวังโดยเฉพาะตึกในบริเวณดังกล่าว เบื้องต้นควรย้ายออกมาให้ไกลมากที่สุด เพราะตัวอย่างสถานีตำรวจในพื้นที่เห็นว่าเสาเข็มด้านใต้พื้นหายไปบางเสา เหตุการณ์นี้สะท้อนว่าคนที่ทำงานก่อสร้าง โดยเฉพาะการขุดหลุมใต้ดินควรมีความระมัดระวัง และป้องกันการไหลของดิน เพราะเรื่องของน้ำใต้ดินเป็นส่วนที่มีผลกระทบต่อดินรอบข้างมาก เพราะเมื่อเกิดความเสียหายจะสร้างความสูญเสียมหาศาล สร้างผลกระทบไปทั่วบริเวณ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Source Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        <span>แหล่งที่มา: {selectedNews.source}</span>
                      </div>
                      <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                        อัปเดตล่าสุด
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SinkholeNews;