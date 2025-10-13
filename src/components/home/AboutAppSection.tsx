import React from 'react';
import { Button } from '@/components/ui/button';

const AboutAppSection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* About D-MIND */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              About<br />D-MIND
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              ทุกครั้งที่เกิดภัยพิบัติ ไม่ว่าจะเป็นน้ำท่วม ดินถล่ม หรือไฟป่า เรามักต้องเผชิญกับปัญหาเดียวกัน นั่นคือ "การรู้ช้า" ข้อมูลที่กระจัดกระจาย การแจ้งเตือนที่ไม่ทันท่วงที และการเข้าถึงข้อมูลที่ซับซ้อน นำมาซึ่งความสูญเสียที่ควรจะหลีกเลี่ยงได้
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              D-MIND (ดี-มายด์) ถูกสร้างขึ้นเพื่อทำลายวงจรนี้ เราไม่ใช่แค่แอปพลิเคชัน แต่คือ 'สมองดิจิทัลเพื่อการรับมือภัยพิบัติ' ที่ทลายกำแพงข้อมูลทั้งหมด แล้วรวบรวมไว้ในที่เดียว เพื่อให้คุณเข้าถึงข้อมูลที่จำเป็นได้อย่างรวดเร็วและแม่นยำที่สุด
            </p>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-48 h-48 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why D-MIND */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-20 text-foreground">Why D-MIND</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-primary mb-4">01</div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                เราทลายกำแพงข้อมูลที่กระจัดกระจาย
              </h3>
              <p className="text-muted-foreground">
                D-MIND เชื่อมต่อข้อมูลภัยพิบัติจากทุกแหล่งที่น่าเชื่อถือไว้ในหน้าจอเดียว คุณจึงเห็นภาพรวมสถานการณ์จริงได้ทันที
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-primary mb-4">02</div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                ถามได้ทันทีด้วย AI Assistant
              </h3>
              <p className="text-muted-foreground">
                สงสัยเกี่ยวกับสถานการณ์? แค่ถามผู้ช่วย AI ของเรา รับคำตอบที่แม่นยำและเข้าใจง่ายได้ทันที ตลอด 24 ชั่วโมง เหมือนมีผู้เชี่ยวชาญอยู่ข้างกาย
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-primary mb-4">03</div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                แจ้งเตือนอย่างชาญฉลาด
              </h3>
              <p className="text-muted-foreground">
                ยุติการ "รู้ช้า" ด้วยระบบวิเคราะห์และแจ้งเตือนภัยแบบใหม่ ช่วยให้คุณมีเวลาเตรียมพร้อมรับมือกับสถานการณ์ได้อย่างทันท่วงที
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-32">
          <h2 className="text-5xl font-bold text-center mb-16 text-foreground">Reviews</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 mb-4 flex items-center justify-center text-2xl text-white">
                👤
              </div>
              <h4 className="font-bold text-lg mb-2 text-card-foreground">สมชาย มั่นคง</h4>
              <p className="text-muted-foreground">
                แอปนี้เปลี่ยนวิธีการรับมือหน้าฝนของครอบครัวเราไปเลย จากที่เคยกังวลและต้องคอยเช็กข่าวหลายๆ ที่ ตอนนี้แค่ถาม AI ใน D-MIND ก็รู้ทันทีว่าพื้นที่เราปลอดภัยไหม สบายใจขึ้นเยอะครับ
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 mb-4 flex items-center justify-center text-2xl text-white">
                👤
              </div>
              <h4 className="font-bold text-lg mb-2 text-card-foreground">อารีรัตน์ วงศ์พัฒนา</h4>
              <p className="text-muted-foreground">
                ในฐานะผู้นำชุมชน D-MIND คือเครื่องมือที่จำเป็นมาก การเห็นภาพรวมของสถานการณ์แบบเรียลไทม์และข้อมูลสถิติที่ชัดเจน ช่วยให้เราวางแผนแจ้งเตือนและช่วยเหลือลูกบ้านได้เร็วและมีประสิทธิภาพกว่าเดิมหลายเท่า
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 mb-4 flex items-center justify-center text-2xl text-white">
                👤
              </div>
              <h4 className="font-bold text-lg mb-2 text-card-foreground">ดร. พิพัฒน์ เจริญกิจ</h4>
              <p className="text-muted-foreground">
                น่าทึ่งมากที่สามารถรวมข้อมูลภัยพิบัติที่ซับซ้อนมาไว้ในที่เดียวได้สำเร็จ ฟีเจอร์ AI Assistant ช่วยให้การเข้าถึงและวิเคราะห์ข้อมูลเชิงลึกทำได้ง่ายและรวดเร็ว เป็นก้าวสำคัญของวงการจัดการภัยพิบัติในไทยเลย
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAppSection;
