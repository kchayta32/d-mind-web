
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NaturalDisastersArticle: React.FC = () => {
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
              backgroundImage: `url('/lovable-uploads/aa72c068-2cf3-4b36-be9e-a7eb6351cb9d.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  ภัยพิบัติทางธรรมชาติ ภัยจากธรรมชาติที่สร้างความสูญเสียเกินกว่าที่จะจินตนาการได้
                </h1>
                <p className="text-sm opacity-90 text-gray-300">จาก bunhcr.org</p>
                <p className="text-sm opacity-90">30 พฤษภาคม 2568</p>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <blockquote className="text-lg italic text-blue-800 leading-relaxed">
                ภัยพิบัติทางธรรมชาติ ภัยที่ไม่สามารถคาดการณ์ได้ ทำความรู้จักว่าภัยพิบัติธรรมชาติสามารถทำให้เกิดการพลัดถิ่นและลี้ภัยของผู้คนนับล้านได้อย่างไร?
              </blockquote>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                ภัยพิบัติทางธรรมชาติ หมายถึง ภัยที่เกิดจากธรรมชาติ ซึ่งไม่สามารถควบคุมได้ ภัยพิบัติทางธรรมชาติ เป็นปรากฎการณ์ที่สร้างความสูญเสียทั้งชีวิตและทรัพย์สิน สร้างความเสียหายต่อบ้านเรือน ตลอดจนวิถีชีวิต ความเป็นอยู่ และยังส่งผลให้ผู้คนนับล้านทั่วโลกต้องไร้ที่อยู่อาศัย ต้องพลัดถิ่น
              </p>

              <p className="text-lg leading-relaxed">
                ภัยพิบัติทางธรรมชาติ ที่เกิดขึ้นบนโลกมีมากมายหลายประเภท และสร้างความเสียหายแต่ละพื้นที่แตกต่างกันไป ไม่ว่าจะเป็น ภัยพิบัติทางพื้นดิน ภัยพิบัติทางพื้นน้ำ ภัยพิบัติทางสภาพอากาศ และภัยพิบัติอันเกิดจากไฟ
              </p>

              <div className="bg-gray-50 p-4 rounded-lg my-6">
                <p className="text-sm text-gray-600">
                  <strong>ขอบคุณข้อมูลจาก:</strong> กองเฝ้าระวังแผ่นดินไหว กรมอุตุนิยมวิทยา
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                ประเภทของภัยพิบัติทางธรรมชาติ
              </h2>

              <p className="text-lg leading-relaxed">
                ภัยพิบัติทางธรรมชาติมีกี่ประเภท เป็นคำถามที่จะช่วยให้เราเห็นภาพชัดขึ้นว่าภัยพิบัติทางธรรมชาติต่าง ๆ ส่งผลให้เกิดการพลัดถิ่นครั้งใหญ่ได้อย่างไร เพราะภัยพิบัติทางธรรมชาติแต่ละประเภทก่อให้เกิดความเสียหายที่แตกต่างกันไป โดยภัยพิบัติทางธรรมชาติประกอบไปด้วย 4 ประเภทหลัก ๆ ดังต่อไปนี้
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-xl font-semibold text-red-800 mb-3">ธรณีพิบัติภัย</h3>
                  <p className="text-gray-700">ภัยพิบัติทางธรรมชาติที่เกิดจากพื้นดิน เช่น แผ่นดินไหว ภูเขาไฟระเบิด และดินถล่ม</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">อุทกภัย</h3>
                  <p className="text-gray-700">ภัยพิบัติทางธรรมชาติที่เกิดจากน้ำ เช่น น้ำท่วม น้ำป่าไหลหลาก และคลื่นสึนามิ</p>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-xl font-semibold text-yellow-800 mb-3">วาตภัย</h3>
                  <p className="text-gray-700">ภัยพิบัติทางอากาศ เช่น พายุประเภทต่าง ๆ</p>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-3">อัคคีภัย</h3>
                  <p className="text-gray-700">ภัยพิบัติทางธรรมชาติที่เกิดจากไฟ เช่น ไฟป่า ทั้งนี้การเกิดไฟป่าในบางครั้งก็อาจเกิดจากมนุษย์ได้เช่นกัน</p>
                </div>
              </div>

              <p className="text-lg leading-relaxed">
                นอกจากนี้ยังมีภัยแล้ง ภัยที่เกิดในพื้นที่แห้งแล้ง ฝนไม่ตกมาอย่างต่อเนื่องยาวนานหรือในพื้นที่ที่ไม่สามารถกักเก็บน้ำได้ ส่งผลให้ไม่สามารถเพาะปลูกได้ ขาดแคลนน้ำ และอาหาร ไม่สามารถอยู่อาศัยได้
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                ภัยพิบัติทางธรรมชาติที่เกิดขึ้นในพื้นที่ต่างๆ ทั่วโลก
              </h2>

              <p className="text-lg leading-relaxed">
                ภัยพิบัติทางธรรมชาตินอกจากสร้างความสูญเสียและสร้างความเสียหายต่อสิ่งปลูกสร้าง ทรัพย์สิน รวมไปถึงร่างกายและจิตใจของผู้ที่ได้รับผลกระทบ ยังสามารถส่งผลให้เกิดการพลัดถิ่นและการลี้ภัยในหลายภูมิภาคทั่วโลก
              </p>

              <p className="text-lg leading-relaxed">
                ครอบครัวจำนวนมากต้องหนีเอาชีวิตรอดจากภัยพิบัติทางธรรมชาติ หรือปรากฎการณ์ที่เกิดจากวิกฤตการณ์เปลี่ยนแปลงสภาพภูมิอากาศ (Climate Change) แสวงหาที่พักพิงที่ปลอดภัยและเริ่มต้นชีวิตใหม่อีกครั้ง
              </p>

              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">
                ภัยพิบัติที่ทำให้เกิดการพลัดถิ่นครั้งใหญ่ 5 ประเภท
              </h3>

              <div className="space-y-6">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">1. แผ่นดินไหว</h4>
                  <p className="text-gray-700">ภัยพิบัติทางธรรมชาติที่เป็นที่รู้จักกันดีคือ แผ่นดินไหว ในช่วงหลายปีที่ผ่านมามีเหตุแผ่นดินไหวเกิดขึ้นหลายครั้งในหลายพื้นที่ทั่วโลก เหตุการณ์ใหญ่ล่าสุด เช่น ในประเทศทูร์เคียและซีเรีย และแผ่นดินไหวในประเทศอัฟกานิสถาน</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">2. พายุ ลมมรสุม</h4>
                  <p className="text-gray-700">ภัยพิบัติทางธรรมชาติ จากลมมีสาเหตุและความรุนแรงแตกต่างกันไป ที่พักพิงของผู้ลี้ภัยในหลายพื้นที่ต้องพบเจอกับพายุ หรือลมมรสุมเป็นประจำทุกปี เช่น มรสุมในประเทศบังคลาเทศ ไซโคลนโมคา ในเมียนมา หรือไซโคลนอิดาอี ในแอฟริกา</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">3. น้ำท่วม</h4>
                  <p className="text-gray-700">ภัยพิบัติทางธรรมชาติอย่าง อุทกภัย หรือน้ำท่วมเป็นอีกหนึ่งภัยพิบัติที่เกิดขึ้นบ่อยครั้งในหลายพื้นที่ และส่งผลกระทบต่อคนจำนวนมากในคราวเดียว เช่น อุทกภัยในประเทศปากีสถาน บังคลาเทศ หรืออุทกภัยที่เกิดขึ้นหลังจากเขื่อนแตกในประเทศลิเบีย</p>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">4. ภัยแล้ง</h4>
                  <p className="text-gray-700">วิกฤตภัยแล้งเป็นอีกหนึ่งภัยพิบัติทางธรรมชาติที่พบได้มากในแถบทวีปแอฟริกา เช่น ในพื้นที่คาบสมุทรโซมาเลีย ซึ่งครอบคลุมพื้นที่ประเทศเอริเทรีย จิบูตี เอธิโอเปีย และโซมาเลีย ในพื้นที่นี้ฝนไม่ตกตามฤดูกาลต่อเนื่องนานหลายปี</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">5. การเปลี่ยนแปลงสภาพภูมิอากาศ</h4>
                  <p className="text-gray-700">ในสถานการณ์ปัจจุบันเราต้องเผชิญสภาพอากาศที่แปรปรวนรุนแรง ส่งผลกระทบต่อเนื่องเกิดเป็นภัยพิบัติทางธรรมชาติ ในรูปแบบต่าง ๆ ที่เป็นหนึ่งในสาเหตุให้ผู้คนจำนวนมากต้องกลายเป็นผู้ลี้ภัย หรือผู้พลัดถิ่น</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                การช่วยเหลือในภาวะฉุกเฉิน
              </h2>

              <p className="text-lg leading-relaxed">
                องค์กรช่วยเหลือระหว่างประเทศทำงานอยู่ในพื้นที่หลายประเทศทั่วโลก พร้อมให้ความช่วยเหลือฉุกเฉินเมื่อเกิดวิกฤตที่ทำให้เกิดการพลัดถิ่นครั้งใหญ่ รวมถึงในภัยพิบัติทางธรรมชาติ
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">ความช่วยเหลือฉุกเฉิน</h4>
                  <p className="text-gray-700">มอบความช่วยเหลือขั้นพื้นฐานและปัจจัยสี่ เช่น ที่พักพิง อาหาร น้ำสะอาด สิ่งของบรรเทาทุกข์ และการรักษาพยาบาล</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">การพัฒนาที่พักพิง</h4>
                  <p className="text-gray-700">เข้าไปช่วยพัฒนาและสร้างที่พักพิงที่แข็งแรงให้แก่ผู้ประสบภัยจากภัยพิบัติทางธรรมชาติ</p>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">การดูแลสุขภาพ</h4>
                  <p className="text-gray-700">ส่งมอบความช่วยเหลือด้านการรักษาพยาบาล และการเยียวยาจิตใจ</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">การดูแลเด็กและครอบครัว</h4>
                  <p className="text-gray-700">การทำงานเพื่อดูแลเด็ก และครอบครัวที่เสี่ยงป่วยด้วยโรคขาดสารอาหาร</p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">สิ่งสำคัญที่ต้องจำ</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>ภัยพิบัติทางธรรมชาติไม่สามารถคาดการณ์ได้แน่นอน</li>
                  <li>การเตรียมความพร้อมและแผนฉุกเฉินมีความสำคัญมาก</li>
                  <li>การช่วยเหลือทันทีในช่วงแรกสามารถช่วยชีวิตได้</li>
                  <li>การฟื้นฟูและสร้างชุมชนใหม่ต้องใช้เวลาและความร่วมมือ</li>
                  <li>การเปลี่ยนแปลงสภาพภูมิอากาศทำให้ภัยพิบัติรุนแรงขึ้น</li>
                </ul>
              </div>

              <p className="text-lg leading-relaxed">
                วิกฤตที่ผู้ลี้ภัย ผู้พลัดถิ่นต้องเผชิญจากภัยพิบัติทางธรรมชาติสร้างความสูญเสียทั้งทางร่างกายและจิตใจ การเตรียมความพร้อมและการมีระบบเตือนภัยที่ดีสามารถช่วยลดความสูญเสียได้อย่างมีนัยสำคัญ
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NaturalDisastersArticle;
