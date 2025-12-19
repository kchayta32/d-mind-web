
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EarthquakeThreeCountriesArticle: React.FC = () => {
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
              src="/dmind-premium-icon.png"
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
                <p className="text-sm opacity-90">จาก bangkokbiznews.com</p>
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

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">แผ่นดินไหว 3.8 เขย่าเมียนมาช่วงเช้า</h3>
                <p className="text-gray-700">
                  วันที่ 13 เวลา 06:21:57 น. ตามเวลาประเทศไทย เกิดแผ่นดินไหวขนาด 3.8 ที่จุดศูนย์กลางละติจูด 21.819 องศาเหนือ ลองจิจูด 96.416 องศาตะวันออก ลึกลงไปใต้ผิวดินประมาณ 10 กิโลเมตร
                </p>
              </div>

              <p className="text-lg leading-relaxed">
                ก่อนหน้านี้ยังมีการเกิดแผ่นดินไหวในเมียนมาอีกหลายครั้ง ได้แก่ เวลา 03:10:19 น. ขนาด 1.5, เวลา 02:53:48 น. ขนาด 2.9, เวลา 02:49:00 น. ขนาด 2.8, เวลา 01:24:28 น. ขนาด 3.9 (ซึ่งเป็นแผ่นดินไหวที่มีขนาดใหญ่ที่สุดในรายงานนี้) และเวลา 00:20:28 น. ขนาด 2.5
              </p>

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
};

export default EarthquakeThreeCountriesArticle;
