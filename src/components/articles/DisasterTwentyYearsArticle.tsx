
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DisasterTwentyYearsArticle: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="container max-w-4xl mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white mr-3 hover:bg-blue-400/30 rounded-full"
            onClick={() => navigate('/manual')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
              alt="D-MIND Logo" 
              className="h-8 w-8 mr-3"
            />
            <div>
              <h1 className="text-xl font-bold">บทความเตือนภัย</h1>
              <p className="text-sm opacity-90">D-MIND Emergency Alert System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="container max-w-4xl mx-auto p-4">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with background image */}
          <div 
            className="h-64 bg-cover bg-center bg-gray-300 relative"
            style={{
              backgroundImage: `url('/lovable-uploads/9ee04c09-ef87-44e4-b06d-424087a59578.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  20 ปี ไทยสูญเสียจาก 'ภัยพิบัติ' แค่ไหน ในวันที่โลกกำลังเผชิญกับความรุนแรงจาก 'โลกรวน'
                </h1>
                <p className="text-sm opacity-90">29 พฤษภาคม 2025</p>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-6 space-y-6">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                เหตุการณ์สึนามิเมื่อปี 2547 ส่งผลให้มีผู้เสียชีวิตและสูญหายกว่า 8,000 คน สร้างความเสียหายทางเศรษฐกิจ 1.22 หมื่นล้านบาท แม้ความสูญเสียในครั้งนั้นจะดูรุนแรงและหนักกว่าอุบัติภัยอื่น ๆ แต่ก็เป็นเพียงแค่บางส่วนของความสูญเสียเท่านั้น
              </p>

              <p className="text-lg leading-relaxed">
                ตลอด 20 ปีที่ผ่านมาไทยต้องเผชิญกับความสูญเสียจาก 'ภัยพิบัติ' ต่าง ๆ อย่างต่อเนื่องจนมีผู้เสียชีวิตกว่า 10,000 คน และ สร้างความเสียหายทางเศรษฐกิจสูงถึง 2.2 ล้านล้านบาท
              </p>

              <p className="text-lg leading-relaxed">
                โดยเฉพาะ 'อุทกภัย' ที่รุนแรงและยาวนานขึ้น ส่งผลกระทบกับชาวบ้านเฉลี่ยปีละ 4.5 ล้านคน สร้างความเสียหายกว่า 4.8 พันล้านบาท หรือ 'ภัยแล้ง' ที่กระทบกับประชาชนเฉลี่ยปีละ 8.4 ล้านคน สร้างความเสียหายเฉลี่ยปีละ 1,000 ล้านบาท
              </p>

              <p className="text-lg leading-relaxed">
                ที่สำคัญความเสียหายจาก 'ภัยพิบัติ' ยังมีแนวโน้มเพิ่มขึ้นอย่างต่อเนื่อง ในขณะที่มาตรการรับมือ ไปจนถึงนโยบายป้องกัน ลดความสูญเสียยังมีช่องว่าง และอุปสรรค ทำให้สถานการณ์ในหลายพื้นที่ยังต้องเผชิญกับความสูญเสียซ้ำซาก ท่ามกลางความกังขาในเรื่องชุดข้อมูล องค์ความรู้ที่มีในปัจจุบันเท่าทันกับอุบัติภัยใหม่ ๆ ที่เกิดขึ้นในยุคการเปลี่ยนแปลงสภาพภูมิอากาศมากน้อยแค่ไหน
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                ความสูญเสียจากภัยพิบัติที่ถูกลืมเลือน ไม่มีใครระลึกถึง
              </h2>

              <p className="text-lg leading-relaxed">
                นอกจากความสูญเสียครั้งใหญ่ในเหตุการณ์สึนามิที่ซัด 6 จังหวัดภาคใต้ เมื่อวันที่ 26 ธันวาคม 2547 ผู้เสียชีวิตและสูญหายกว่า 8,345 คน บาดเจ็บ 8,457 คน เสียหาย 1.61 พันล้านดอลลาร์สหรัฐ หรือเกือบ 5.57 หมื่นล้านบาท ที่มีผู้จัดงานระลึกถึงทุกปีแล้ว ยังมีอีกหลายความสูญเสียจากภัยพิบัติ ที่ถูกลืมเลือนไม่มีใครระลึกถึง
              </p>

              <p className="text-lg leading-relaxed">
                หากนับตั้งแต่ปี 2547 ถึงกันยายน 2567 มีภัยพิบัติทางธรรมชาติของไทยที่ CRED บันทึกไว้ 95 เหตุการณ์ โดย 67% เป็นภัยน้ำท่วม-น้ำแล้ง
              </p>

              <p className="text-lg leading-relaxed">
                ทำให้มีผู้เสียชีวิต 10,549 คน บาดเจ็บ 8,685 คน มีผู้ได้รับผลกระทบกว่า 68 ล้านคน สร้างความเสียหายต่อเศรษฐกิจไทยไปแล้วไม่น้อยกว่า 6.57 หมื่นล้านดอลลาร์สหรัฐ หรือราว 2.2 ล้านล้านบาท* (จากรายงานมูลค่าความเสียหายทางเศรษฐกิจ 32 เหตุการณ์) ซึ่งเหตุน้ำท่วมปี 2554 มีมูลค่าความเสียหายทางเศรษฐกิจมากที่สุดถึง 5.4 หมื่นล้านดอลลาร์สหรัฐ หรือ 1.87 ล้านล้านบาท
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                'อุทกภัย' สร้างความเสียหายมูลค่าสูงกว่าภัยอื่น
              </h2>

              <p className="text-lg leading-relaxed">
                น้ำท่วมเป็นภัยพิบัติที่คนไทยต้องเจอทุกปี ใน 20 ปีนี้มีผู้เสียชีวิตจากอุทกภัย 2,663 คน บาดเจ็บ 3,297 คน เสียหาย 1.61 พันล้านดอลลาร์สหรัฐ แต่ละปีมีผู้ได้รับผลกระทบเฉลี่ยปีละเกือบ 4.5 ล้านคน 1.4 ล้านครัวเรือน ความเสียหายเฉลี่ยปีละเกือบ 4.8 พันล้านบาท
              </p>

              <div className="bg-blue-50 p-6 rounded-lg my-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">เหตุการณ์ 'อุทกภัย' รุนแรง</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>ปี 2549:</strong> เป็นปีที่มีน้ำท่วมหนักหลายช่วงรวมกระทบ 47 จังหวัด เดือดร้อนกว่า 5 ล้านคน 1.4 ล้านครัวเรือน มีผู้เสียชีวิต 314 คน มูลค่าความเสียหาย 6.95 พันล้านบาท</li>
                  <li><strong>ปี 2554:</strong> มหาอุทกภัยกระทบ 74 จังหวัด มีผู้เสียชีวิต 1,026 คน กระทบ 16 ล้านคน 5.2 ล้านครัวเรือน พื้นที่น้ำท่วม 31.45 ล้านไร่</li>
                  <li><strong>ปี 2565:</strong> เป็นปีที่ฝนมากกว่าปกติถึง 23% มากที่สุดในรอบ 40 ปี และมากกว่าปี 2554 ส่งผลให้มีพื้นที่ถูกน้ำท่วมมากถึง 12 ล้านไร่</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                'ภัยแล้ง' กระทบ 8.4 ล้านคนต่อปี
              </h2>

              <p className="text-lg leading-relaxed">
                ภัยแล้งเป็นภัยที่ส่งผลกระทบในวงกว้างมากที่สุด มีผู้ได้รับผลกระทบจำนวนมากกว่าภัยอื่น ๆ และยังไปสู่การพังทลายของผิวดิน ฝุ่นละออง พายุฝุ่น น้ำเค็มรุกล้ำ และโอกาสเกิดไฟป่าสูงขึ้น
              </p>

              <p className="text-lg leading-relaxed">
                20 ปีที่ผ่านมา ภัยแล้งสร้างความเสียหายแก่ประชาชนเฉลี่ยปีละ 8.4 ล้านคน 2.3 ล้านครัวเรือน แม้จะไม่มีข้อมูลมูลค่าความเสียหายในปี 2561, 2564, 2565, 2566 แต่ 16 ปีรวมกันเสียหาย 1.7 หมื่นล้านบาท เฉลี่ยปีละ 1 พันล้านบาท
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                แผ่นดินไหวเกิดถี่ขึ้น ใน 20 ปี เกิดเหตุกว่า 11,000 เหตุการณ์
              </h2>

              <p className="text-lg leading-relaxed">
                ไทยยังไม่ปลอดภัยจากแผ่นดินไหวเพราะยังเป็นภัยที่ท้าทายต่อการศึกษาและไม่อาจพยากรณ์ล่วงหน้าได้ ข้อมูลจากกองเฝ้าระวังแผ่นดินไหวปี 2547-2566 รายงานว่ามีการเกิดแผ่นดินไหวบริเวณประเทศไทยและพื้นที่ใกล้เคียงรวม 11,486 เหตุการณ์ โดยปี 2565 เกิดเหตุมากที่สุดถึง 2,363 เหตุการณ์
              </p>

              <div className="bg-yellow-50 p-6 rounded-lg my-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">เหตุแผ่นดินไหวรุนแรง</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>ปี 2547:</strong> แผ่นดินไหวบริเวณเกาะสุมาตรา อินโดนีเซีย ขนาด 9.1 เกิดสึนามิ 6 จังหวัดของไทย มีผู้เสียชีวิตและสูญหาย 8,345 คน</li>
                  <li><strong>ปี 2557:</strong> แผ่นดินไหวที่ อ.แม่ลาว จ.เชียงราย ขนาด 6.3 บ้านเรือนเสียหาย 11,173 หลัง มีผู้เสียชีวิต 1 คน บาดเจ็บ 107 คน</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                สถานการณ์โลกและข้อเรียนรู้
              </h2>

              <p className="text-lg leading-relaxed">
                ตลอด 20 ปีที่ผ่านมา ทั้งสถานการณ์โลกและประเทศไทยต่างเผชิญภัยที่มากขึ้น รุนแรงขึ้น แม้เบื้องต้นด้วยการเตรียมพร้อมรับมือของมนุษย์อาจสามารถทำให้ความสูญเสียลดน้อยลงได้ แต่ก็ยังสามารถลดความสูญเสียและหาทางป้องกันได้มีประสิทธิภาพมากกว่านี้ นี่จึงเป็นช่วงเวลาที่เราต้องกลับมาให้ความสำคัญต่อระบบบริหารจัดการภัยพิบัติอย่างจริงจังอีกครั้ง
              </p>

              <div className="bg-gray-50 p-6 rounded-lg my-6">
                <p className="text-sm text-gray-600">
                  <strong>แหล่งอ้างอิง:</strong> 
                  <a href="https://theactive.thaipbs.or.th/data/20years-disaster-loss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                    https://theactive.thaipbs.or.th/data/20years-disaster-loss
                  </a>
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default DisasterTwentyYearsArticle;
