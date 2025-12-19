import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Smartphone, Shield, Bell, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DMindLaunchArticle = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Header / Hero */}
            <div className="relative h-[400px] w-full bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-90"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-4 text-white/70 hover:text-white hover:bg-white/10 w-fit"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> ย้อนกลับ
                    </Button>

                    <Badge className="w-fit mb-4 bg-blue-500/20 text-blue-200 border-blue-500/30 hover:bg-blue-500/30">
                        Official Launch
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        เตรียมพบกับ "D-MIND"<br />
                        <span className="text-blue-400">นวัตกรรมการเรียนรู้สู่แอปพลิเคชันเตือนภัยอัจฉริยะ</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        D-MIND ภูมิใจนำเสนอผลงานการพัฒนาแอปพลิเคชัน "เพื่อการศึกษา" ที่มุ่งเน้นการนำเทคโนโลยี AI และ IoT มาประยุกต์ใช้ในการเฝ้าระวังภัยพิบัติ
                    </p>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">

                    <div className="prose prose-lg max-w-none text-slate-600">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">จุดเริ่มต้นของ D-MIND</h3>
                        <p className="mb-8">
                            โปรเจกต์ D-MIND เกิดขึ้นจากความตั้งใจที่จะนำเทคโนโลยีสมัยใหม่เข้ามาช่วยแก้ปัญหาการเตือนภัยพิบัติ โดยเน้นการเรียนรู้และพัฒนา (Educational Purpose) เพื่อเป็นกรณีศึกษาสำหรับการสร้างระบบแจ้งเตือนที่มีประสิทธิภาพและเข้าถึงง่ายสำหรับทุกคน
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <Smartphone className="w-10 h-10 text-blue-600 mb-4" />
                                <h4 className="font-bold text-slate-800 mb-2">Android Application</h4>
                                <p className="text-sm">
                                    พร้อมเปิดให้ดาวน์โหลดเวอร์ชันทดสอบเร็วๆ นี้ ผ่าน Google Play Store และเว็บไซต์ D-MIND
                                </p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 opacity-75">
                                <div className="flex items-center gap-2 mb-4">
                                    <Smartphone className="w-10 h-10 text-slate-500" />
                                    <Badge variant="secondary">In Development</Badge>
                                </div>
                                <h4 className="font-bold text-slate-800 mb-2">iOS Application</h4>
                                <p className="text-sm">
                                    ขณะนี้ทีมงานกำลังเร่งพัฒนาเวอร์ชันสำหรับ iOS และมีกำหนดการปล่อยดาวน์โหลดในอนาคตอันใกล้
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-6">ฟีเจอร์เด่นที่จะมาพร้อมกับแอปพลิเคชัน</h3>

                        <div className="space-y-4 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800">Real-time Alerts</h5>
                                    <p className="text-sm">แจ้งเตือนภัยพิบัติทันทีที่เซนเซอร์ตรวจพบความผิดปกติ</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800">Customizable Notifications</h5>
                                    <p className="text-sm">เลือกรับการแจ้งเตือนเฉพาะพื้นที่ที่คุณสนใจ</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Shield className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800">Safety Guide</h5>
                                    <p className="text-sm">คู่มือการปฏิบัติตัวเมื่อเกิดเหตุฉุกเฉินภายในแอป</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">เตรียมตัวให้พร้อม!</h3>
                            <p className="text-blue-200 mb-6">
                                มาร่วมเป็นส่วนหนึ่งของการเรียนรู้เทคโนโลยีแห่งอนาคตไปกับเรา ติดตามข่าวสารการปล่อยดาวน์โหลดได้ที่หน้าเว็บไซต์นี้
                            </p>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                                onClick={() => navigate('/')}
                            >
                                กลับสู่หน้าหลัก
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DMindLaunchArticle;
