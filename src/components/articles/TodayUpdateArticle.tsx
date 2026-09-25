import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronLeft,
  Satellite,
  Radio,
  Bell,
  Video,
  MapPin,
  Users,
  ShieldAlert,
  Calendar,
  User,
  Clock,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CloudRain,
  Layers,
  Activity,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

export const TodayUpdateArticle: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative pb-24 transition-colors duration-300">
      {/* Header / Hero */}
      <div className="relative min-h-[460px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center">
        {/* Decorative Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 opacity-95" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white hover:bg-white/10 w-fit mb-6 transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> {isEn ? 'Back' : 'ย้อนกลับ'}
          </Button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 font-semibold">
              {isEn ? 'Release Notes • September 2026' : 'บันทึกการอัปเดตระบบ • กันยายน 2569'}
            </Badge>
            <Badge variant="outline" className="text-cyan-300 border-cyan-400/40 bg-cyan-500/10">
              Copernicus Sentinel & GISTDA 2.0
            </Badge>
            <Badge variant="outline" className="text-indigo-300 border-indigo-400/40 bg-indigo-500/10">
              FCM Web Push & Crowdsourcing
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            {isEn ? (
              <>
                Today’s Major Upgrades:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300">
                  Sentinel-1/2 Satellite Flood Inspection, Ground Truth Crowdsourcing & 1-Minute Architecture Tour
                </span>
              </>
            ) : (
              <>
                สรุปการอัปเดตระบบ D-MIND วันนี้:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300">
                  ตรวจจับน้ำท่วมด้วยดาวเทียม Sentinel, ผสานพลังประชาชน Crowdsourcing และเปิดตัววิดีโอสถาปัตยกรรมระบบ
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
            {isEn
              ? 'A deep dive into our multi-layered disaster response engine: live radar backscatter flood mapping, real-time citizen verification, background web push alerts, and architectural transparency.'
              : 'รายงานเจาะลึก 5 การพัฒนาครั้งสำคัญของ D-MIND ในวันนี้: เชื่อมโยงคลื่นเรดาร์ทะลุเมฆจากดาวเทียม Copernicus Sentinel, ระบบรายงานน้ำท่วมแบบ Real-time โดยประชาชน, การแจ้งเตือน Web Push ผ่าน FCM VAPID ใหม่ และวิดีโออธิบายระบบ'}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-400" />
              <span>D-MIND Core Engineering Team</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>25 September 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10 space-y-12">
        
        {/* Quick Highlights Summary Card */}
        <Card className="border-sky-200 dark:border-sky-900 bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50 dark:from-slate-900/90 dark:to-slate-800/80 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>{isEn ? 'Key Highlights at a Glance' : 'สรุป 5 ฟังก์ชันและโครงสร้างที่อัปเดตใหม่วันนี้'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <Satellite className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">1. Sentinel Satellite Imagery</strong>
                  <span className="text-xs text-muted-foreground">เรดาร์ Sentinel-1 SAR ทะลุเมฆ + ภาพสีจริง 10m จาก Sentinel-2</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <Users className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">2. Citizen Crowdsourcing</strong>
                  <span className="text-xs text-muted-foreground">ประชาชนปักหมุดรายงานน้ำท่วมสด พร้อมยืนยัน Ground Truth อัตโนมัติ</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <CloudRain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">3. TMD Live Doppler Radar</strong>
                  <span className="text-xs text-muted-foreground">ซ้อนทับภาพเรดาร์ตรวจวัดกลุ่มฝนสดทุก 10 นาทีบนแผนที่น้ำท่วม</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <Bell className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">4. Firebase FCM Push Key</strong>
                  <span className="text-xs text-muted-foreground">อัปเกรด VAPID Web Push คีย์ใหม่ ยิงแจ้งเตือนด่วนแม้ปิดหน้าจอ</span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <Video className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">5. Video Tour & Interactive Architecture (GitDiagram)</strong>
                  <span className="text-xs text-muted-foreground">วิดีโอ 1 นาทีฉายบนหน้า Home แสดงสถาปัตยกรรมทั้งระบบเชื่อมโยง SeismoGuard & Gemini AI</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Sentinel Satellites */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                1. Copernicus Sentinel-1 C-SAR & Sentinel-2 Satellite Flood Detection
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ตรวจวัดพื้นที่น้ำท่วมขังด้วยเรดาร์อวกาศและภาพถ่ายดาวเทียมความละเอียดสูงแบบเปิดเสรี
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              ในการเฝ้าระวังอุทกภัย ปัญหาหลักของภาพถ่ายดาวเทียมทั่วไปคือ <strong className="text-foreground">เมฆฝนและหมอกควันบังผิวดิน</strong> ทำให้ไม่สามารถมองเห็นน้ำท่วมได้ในช่วงพายุฝนฟ้าคะนอง ในการอัปเดตครั้งนี้ D-MIND ได้เชื่อมต่อกับดาวเทียม <strong className="text-foreground">Copernicus Sentinel-1</strong> ซึ่งใช้เซนเซอร์ <strong className="text-foreground">C-Band Synthetic Aperture Radar (SAR)</strong> ที่สามารถส่งคลื่นวิทยุทะลุผ่านกลุ่มเมฆ พายุฝน และบันทึกข้อมูลได้ทั้งกลางวันและกลางคืน โดยวิเคราะห์จากค่าการสะท้อนกลับ (Water Backscatter) เมื่อผิวน้ำราบเรียบคลื่นจะสะท้อนออกไป ทำให้เกิดเป็นพื้นที่สีเข้มเด่นชัด
            </p>
            <p>
              นอกจากนี้ D-MIND ยังเชื่อมต่อกับ <strong className="text-foreground">GISTDA API 2.0 Gateway</strong> พร้อมอัปเกรด Production API Key ใหม่ เพื่อดึงชั้นข้อมูลพื้นที่น้ำท่วมขังรอบ 3 วันและ 7 วันล่าสุดกว่า <strong className="text-foreground">11,000 โซน</strong> ในรูปเวกเตอร์ MultiPolygon ความแม่นยำสูง พร้อมความสามารถคำนวณจำนวนประชากรที่เสี่ยงภัย สิ่งปลูกสร้าง และระยะทางของถนนที่ถูกน้ำท่วมขังแบบเรียลไทม์
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-card rounded-xl border border-border shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">เรดาร์ทะลุเมฆ (SAR)</span>
              <p className="text-xs text-muted-foreground">ตรวจวัดผิวน้ำได้ทุกสภาพอากาศ แม้ขณะเกิดพายุฝนตกหนักกลางดึก</p>
            </div>
            <div className="p-3.5 bg-card rounded-xl border border-border shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Sentinel-2 True Color</span>
              <p className="text-xs text-muted-foreground">ภาพถ่ายสีจริงความละเอียด 10 เมตรจาก EOX Cloudless Base Layer</p>
            </div>
            <div className="p-3.5 bg-card rounded-xl border border-border shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">High-Speed TMS Layer</span>
              <p className="text-xs text-muted-foreground">เรนเดอร์แผนที่ผ่าน Slippy Tile Map Service โหลดไว ไม่มีอาการกระตุก</p>
            </div>
          </div>
        </section>

        {/* Section 2: Crowdsourcing */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                2. Real-time Crowdsourcing & Satellite Ground Truth Verification
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ผสานข้อมูลประชาชนในพื้นที่ เสริมช่องว่างระหว่างรอบโคจรของดาวเทียม
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              เนื่องจากดาวเทียมโคจรกลับมาถ่ายซ้ำบริเวณเดิมทุก 3-5 วัน จึงอาจมีช่องว่างของข้อมูลในชั่วโมงเร่งด่วน D-MIND จึงได้เปิดตัวระบบ <strong className="text-foreground">Crowdsourced Flood Reporting</strong> ให้ประชาชนในพื้นที่ประสบภัยสามารถกดปุ่ม <strong className="text-foreground">"รายงานน้ำท่วมทันที"</strong> บนหน้าแผนที่ เพื่อระบุพิกัด GPS อัตโนมัติ เลือกระดับความสูงของน้ำท่วม (ข้อเท้า หัวเข่า เอว หรือมิดหลังคา) และแนบภาพถ่ายจุดเกิดเหตุ
            </p>
            <p>
              จุดเด่นสำคัญคืออัลกอริทึม <strong className="text-foreground">Cross-Reference Verification</strong>: ระบบจะนำพิกัดที่ประชาชนส่งเข้ามาเทียบเคียงกับเวกเตอร์ตรวจวัดของดาวเทียม Sentinel-1/2 โดยอัตโนมัติ หากรายงานอยู่ในรัศมี 5 กิโลเมตรจากขอบเขตน้ำท่วมของดาวเทียม ระบบจะประทับตรา <strong className="text-foreground">"🛰️ ยืนยันตรงกับภาพถ่ายดาวเทียม (Ground Truth Confirmed)"</strong> ทันที สร้างความน่าเชื่อถือสูงสุดให้แก่เจ้าหน้าที่กู้ภัยและชุมชน
            </p>
          </div>
        </section>

        {/* Section 3: Weather Radar */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                3. Live TMD Weather Radar Composite Overlay
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ซ้อนทับภาพเรดาร์ตรวจวัดกลุ่มฝนสดควบคู่กับแผนที่น้ำท่วมขัง
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              ผู้ใช้สามารถเปิดสวิตช์ <strong className="text-foreground">"ซ้อนทับเรดาร์น้ำฝนสด (TMD Radar)"</strong> เพื่อดูความเข้มข้นของกลุ่มเมฆฝน (dBZ) ที่อัปเดตทุก 10-15 นาที ร่วมกับชั้นข้อมูลน้ำท่วมขัง ช่วยให้เห็นว่ากลุ่มฝนกำลังเคลื่อนตัวเข้าสู่พื้นที่ที่มีน้ำท่วมขังอยู่แล้วหรือไม่ เพื่อเตรียมพร้อมอพยพได้อย่างทันท่วงที
            </p>
          </div>
        </section>

        {/* Section 4: FCM Notifications */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                4. Firebase Cloud Messaging (FCM) Web Push Upgrade
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                รองรับการแจ้งเตือนภัยพิบัติฉุกเฉินเบื้องหลังผ่าน VAPID Key ใหม่ล่าสุด
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              D-MIND ได้ปรับใช้ VAPID Public Key ชุดใหม่สำหรับ Firebase Web Push:
            </p>
            <div className="p-3 bg-slate-900 text-sky-300 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">
              BF2vUq0J_zMHeaSQrxDJIEnSpKMcrhqmJVd_m3ueWM9rwl2sZygWXXPqZlXbjPgh-uUssKGBDQxc_Dq8ar8K33k
            </div>
            <p>
              พร้อม Service Worker <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">firebase-messaging-sw.js</code> ที่รองรับการเด้งเตือนเหตุฉุกเฉินไปยังอุปกรณ์ของผู้ใช้ทั้ง Android, iOS (PWA), macOS และ Windows ได้แม้ผู้ใช้จะไม่ได้เปิดหน้าเว็บอยู่
            </p>
          </div>
        </section>

        {/* Section 5: Architecture Tour Video */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                5. Video Tour & System Architecture Transparency
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                เปิดตัววิดีโอแนะนำระบบ 1 นาทีบนหน้า Home จาก GitDiagram Spec
              </p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              เพื่อความโปร่งใสและเข้าใจง่ายต่อผู้ใช้งานและนักพัฒนา D-MIND ได้นำวิดีโอ <strong className="text-foreground">"Watch a one-minute video tour of d-mind-web"</strong> ที่สังเคราะห์จากแผนผังสถาปัตยกรรม <a href="https://gitdiagram.com/kchayta32/d-mind-web" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitDiagram</a> มาฝังไว้บนหน้าแรกของเว็บไซต์ โดยสรุปสถาปัตยกรรมหลักไว้ดังนี้:
            </p>
            <div className="p-4 bg-muted/50 rounded-xl border border-border text-xs sm:text-sm leading-relaxed">
              <em>"D-MIND is a Thailand-focused disaster management dashboard: people consult live hazard information, alerts and guidance, ask disaster questions, assess damage, and submit incident or victim reports for response. A separate SeismoGuard earthquake-warning application is included because the README identifies it as a major companion capability. The graph also shows scraping and the AI model API. Wiring for unsampled features is based on documented capabilities; uncertain implementation-level connections are omitted."</em>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black">
                {isEn ? 'Experience the Upgraded Platform Now' : 'ทดลองใช้งานระบบแผนที่และฟีเจอร์ใหม่ได้ทันที'}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg">
                {isEn
                  ? 'Access live Sentinel radar layers, view crowdsourced reports, or watch the 1-minute video tour on the homepage.'
                  : 'สำรวจชั้นข้อมูลดาวเทียม Sentinel, รายงานน้ำท่วมสด หรือรับชมวิดีโอแนะนำระบบบนหน้าแรกของ D-MIND'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => navigate('/disaster-map')}
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg rounded-xl text-xs sm:text-sm h-10 px-5"
              >
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{isEn ? 'Open Map' : 'เปิดแผนที่ดาวเทียม'}</span>
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold rounded-xl text-xs sm:text-sm h-10 px-4"
              >
                <span>{isEn ? 'Home & Tour' : 'หน้าหลัก & วิดีโอ'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default TodayUpdateArticle;
