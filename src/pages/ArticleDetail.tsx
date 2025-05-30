import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id === 'earthquake-3countries') {
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
                backgroundImage: `url('/lovable-uploads/9b24d25c-901c-4aaf-98dd-78419a5984cd.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย
                  </h1>
                  <p className="text-sm opacity-90 text-gray-300">จาก bangkokbiznews.com</p>
                  <p className="text-sm opacity-90">30 พฤษภาคม 2568</p>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <blockquote className="text-lg italic text-blue-800 leading-relaxed">
                  จับตาแผ่นดินไหวเกิดใหม่ 3 ประเทศ "เมียนมา-ลาว-ไทย" แรงสุดวันนี้ รู้สึกแรงสั่นสะเทือนที่เชียงราย โดยแผ่นดินไหวเมียนมา มีขนาดสูงสุดถึง 3.9 - ลาวเจอเขย่า 2 ครั้งซ้อน
                </blockquote>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  เกาะติดเหตุการณ์แผ่นดินไหวล่าสุด จับตา"แผ่นดินไหว"เกิดใหม่ 3 ประเทศ "เมียนมา-ลาว-ไทย" แรงสุดวันนี้ รู้สึกแรงสั่นสะเทือนที่เชียงราย โดยแผ่นดินไหวเมียนมามีขนาดสูงสุดถึง 3.9 ส่วนลาวเจอแผ่นดินไหวเขย่า 2 ครั้งซ้อน และไทยแผ่นดินไหวแม่สรวย ขนาด 1.4 มีความลึกใต้ดิน 3 กิโลเมตร
                </p>

                <p className="text-lg leading-relaxed">
                  เมื่อวันที่ 13 พฤษภาคม 2568 กองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา เผยข้อมูลล่าสุดการเกิดแผ่นดินไหวใน 3 ประเทศเพื่อนบ้านอย่างต่อเนื่อง โดยมีรายละเอียดดังนี้
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  เมียนมาศูนย์กลางแผ่นดินไหวแรงสุด 3.9 แมกนิจูด
                </h2>

                <p className="text-lg leading-relaxed">
                  ประเทศเมียนมากลายเป็นจุดที่มีการเกิดแผ่นดินไหวมากที่สุด โดยมีรายงานถึงหลายครั้ง และมีขนาดความรุนแรงที่แตกต่างกันไป ดังนี้
                </p>

                <div className="bg-yellow-50 p-6 rounded-lg my-6">
                  <h3 className="text-xl font-semibold text-yellow-800 mb-4">แผ่นดินไหว 3.8 เขย่าเมียนมาช่วงเช้า</h3>
                  <p className="text-gray-700">
                    วันที่ 13 เวลา 06:21:57 น. ตามเวลาประเทศไทย เกิดแผ่นดินไหวขนาด 3.8 ที่จุดศูนย์กลางละติจูด 21.819 องศาเหนือ ลองจิจูด 96.416 องศาตะวันออก ลึกลงไปใต้ผิวดินประมาณ 10 กิโลเมตร
                  </p>
                </div>

                <p className="text-lg leading-relaxed">
                  ก่อนหน้านี้ยังมีการเกิดแผ่นดินไหวในเมียนมาอีกหลายครั้ง ได้แก่ เวลา 03:10:19 น. ขนาด 1.5, เวลา 02:53:48 น. ขนาด 2.9, เวลา 02:49:00 น. ขนาด 2.8, เวลา 01:24:28 น. ขนาด 3.9 (ซึ่งเป็นแผ่นดินไหวที่มีขนาดใหญ่ที่สุดในรายงานนี้) และเวลา 00:20:28 น. ขนาด 2.5
                </p>

                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/sBrIpy7QcMrQjg0Y9BHJ.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/jQpFQClsD132CUoumCDK.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  แผ่นดินไหวลาว 2 ครั้งซ้อน ขนาด 1.9 และ 1.5
                </h2>

                <p className="text-lg leading-relaxed">
                  ประเทศลาวเองก็มีการบันทึกการเกิดแผ่นดินไหวถึง 2 ครั้งในช่วงเช้า โดยมีรายละเอียดดังนี้
                </p>

                <div className="bg-orange-50 p-6 rounded-lg my-6">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4">เช้ามืดสั่นสะเทือน แผ่นดินไหว 1.9 ที่ลาว</h3>
                  <p className="text-gray-700 mb-3">
                    เมื่อเวลา 03:23:50 น. เกิดแผ่นดินไหวขนาด 1.9 ที่ละติจูด 20.383 องศาเหนือ ลองจิจูด 100.788 องศาตะวันออก ลึก 7 กิโลเมตร ทางทิศตะวันออกเฉียงเหนือของ อ.เวียงแก่น จ.เชียงราย ประมาณ 42 กิโลเมตร
                  </p>
                  <h4 className="text-lg font-semibold text-orange-700 mb-2">อีกระลอก แผ่นดินไหว 1.5 ที่ลาวช่วงใกล้เคียง</h4>
                  <p className="text-gray-700">
                    ถัดมาเมื่อเวลา 01:47:21 น. เกิดแผ่นดินไหวขนาด 1.5 ที่ละติจูด 20.488 องศาเหนือ ลองจิจูด 100.139 องศาตะวันออก ลึก 1 กิโลเมตร ซึ่งอยู่ทางทิศตะวันตกเฉียงเหนือของ ต.ริมโขง อ.เชียงของ จ.เชียงราย ประมาณ 26 กิโลเมตร
                  </p>
                </div>

                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/OgV11p9nrmaGB14G47Jp.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/xtZP9aoikjWwTF7J2Bln.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  ไทยก็รู้สึก แผ่นดินไหวเชียงรายล่าสุด ขนาด 1.4
                </h2>

                <p className="text-lg leading-relaxed">
                  สำหรับ ประเทศไทย มีรายงานการเกิดแผ่นดินไหวที่จังหวัดเชียงราย โดยประชาชนในพื้นที่อาจรู้สึกถึงแรงสั่นสะเทือนได้
                </p>

                <div className="bg-red-50 p-6 rounded-lg my-6">
                  <h3 className="text-xl font-semibold text-red-800 mb-4">เชียงรายไหวแผ่นดินไหวแม่สรวย ขนาด 1.4</h3>
                  <p className="text-gray-700">
                    เวลา 02:42:21 น. เกิดแผ่นดินไหวขนาด 1.4 ที่ตำบลศรีถ้อย อำเภอแม่สรวย จังหวัดเชียงราย โดยมีความลึกใต้ดิน 3 กิโลเมตร
                  </p>
                </div>

                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/GDJZb4NRTDU2DKv43iKI.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/c1ydHiNg5PgkEYNRmGtn.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  สรุปสถานการณ์แผ่นดินไหว 3 ประเทศล่าสุด
                </h2>

                <p className="text-lg leading-relaxed">
                  โดยรวมแล้ว ในวันนี้ (13 พฤษภาคม 2568) มีรายงานการเกิดแผ่นดินไหวหลายครั้งในประเทศเมียนมา ซึ่งเป็นประเทศที่มีการเกิดแผ่นดินไหวมากที่สุด
                </p>

                <p className="text-lg leading-relaxed">
                  รองลงมาคือประเทศลาว และมีการรับรู้ถึงแรงสั่นสะเทือนในประเทศไทยที่จังหวัดเชียงราย โดยแผ่นดินไหวที่มีขนาดรุนแรงที่สุดในวันนี้คือขนาด 3.9 ที่เกิดขึ้นในประเทศเมียนมา
                </p>

                <p className="text-lg leading-relaxed">
                  อย่างไรก็ตาม แผ่นดินไหวที่มีขนาดเล็กนั้นโดยทั่วไปแล้วจะไม่ก่อให้เกิดความเสียหาย
                </p>

                <div className="my-8">
                  <img 
                    src="https://image.bangkokbiznews.com/uploads/images/contents/w1024/2025/05/aTb4bWsBF4VzaqFsM9gU.webp?x-image-process=style/lg-webp" 
                    alt="แผ่นดินไหวเกิดใหม่ 3 ประเทศ เมียนมา ลาว ไทย แรงสุด สะเทือนเชียงราย" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg my-6">
                  <p className="text-sm text-gray-600">
                    <strong>อ้างอิง-ภาพ:</strong> 
                    <a href="https://earthquake.tmd.go.th/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                      กองเฝ้าระวังแผ่นดินไหว
                    </a>
                    <span className="mx-2">,</span>
                    <a href="https://www.tmd.go.th/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      กรมอุตุนิยมวิทยา
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (id === 'disaster-20years') {
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

                <div className="my-8">
                  <img 
                    src="https://files.wp.thaipbs.or.th/theactive/2024/12/Data-Serie_Disaster_SQ_FB-01_0-1024x1024.jpg" 
                    alt="ข้อมูลสถิติภัยพิบัติไทย" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

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

                <div className="my-8">
                  <img 
                    src="https://files.wp.thaipbs.or.th/theactive/2024/12/Data-Serie_Disaster_SQ_FB-02_0-1024x1024.jpg" 
                    alt="สถิติภัยพิบัติประเทศไทย" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  'อุทกภัย' สร้างความเสียหายมูลค่าสูงกว่าภัยอื่น
                </h2>

                <p className="text-lg leading-relaxed">
                  น้ำท่วมเป็นภัยพิบัติที่คนไทยต้องเจอทุกปี ใน 20 ปีนี้มีผู้เสียชีวิตจากอุทกภัย 2,663 คน บาดเจ็บ 3,297 คน เศรษฐกิจเสียหายเกือบ 7.65 หมื่นล้านบาท แต่ละปีมีผู้ได้รับผลกระทบเฉลี่ยปีละเกือบ 4.5 ล้านคน 1.4 ล้านครัวเรือน ความเสียหายเฉลี่ยปีละเกือบ 4.8 พันล้านบาท
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

                <div className="my-8">
                  <img 
                    src="https://files.wp.thaipbs.or.th/theactive/2024/12/Data-Serie_Disaster-03_1-1024x1024.jpg" 
                    alt="แผนภูมิแสดงสถิติภัยพิบัติ" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบบทความ</h1>
        <Button onClick={() => navigate('/manual')}>กลับสู่คู่มือฉุกเฉิน</Button>
      </div>
    </div>
  );
};

export default ArticleDetail;
