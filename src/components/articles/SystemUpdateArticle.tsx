import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Zap, Layout, Mail, Calculator, CloudSun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SystemUpdateArticle = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Header / Hero */}
            <div className="relative h-[400px] w-full bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-indigo-900 to-purple-900 opacity-90"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-4 text-white/70 hover:text-white hover:bg-white/10 w-fit"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> ย้อนกลับ
                    </Button>

                    <Badge className="w-fit mb-4 bg-indigo-500/30 text-indigo-100 border-indigo-400/30">
                        System Update v2.0
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        2 วันแห่งการเปลี่ยนแปลง!<br />
                        <span className="text-indigo-300">D-MIND ยกระดับสู่ความสมบูรณ์แบบ</span>
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-2xl">
                        ทีมพัฒนา D-MIND ขอรายงานความคืบหน้าครั้งสำคัญ! กับการปรับปรุงระบบขนานใหญ่เพื่อเสถียรภาพและความปลอดภัยสูงสุด
                    </p>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">

                    <div className="space-y-12">

                        {/* Section 1 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">1. ระบบแจ้งเตือนภัยแม้ออฟไลน์ (Background Alerts)</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    เราทำสำเร็จแล้ว! กับการพัฒนาระบบ Background Email Notifications โดยใช้เทคโนโลยี Server-Side (Supabase Edge Functions)
                                    ทำให้ D-MIND สามารถส่งอีเมลแจ้งเตือนภัยพิบัติหาคุณได้ทันทีที่เซนเซอร์ตรวจพบความเสี่ยง <strong className="text-green-600">"โดยที่คุณไม่จำเป็นต้องเปิดหน้าแอปค้างไว้"</strong>
                                </p>
                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-sm text-green-800">
                                    <Zap className="w-4 h-4 inline mr-2" />
                                    ก้าวสำคัญที่ทำให้ D-MIND เป็นที่พึ่งได้จริงตลอด 24 ชม.
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                                <Layout className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">2. พลิกโฉมหน้าตาใหม่ (UI Overhaul)</h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    เราเปลี่ยนมาใช้ดีไซน์ "Modern Blue-White Theme" ที่สะอาดตาและทันสมัยที่สุด
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
                                    <li><strong>Glassmorphism:</strong> เพิ่มมิติความสวยงามให้ดูพรีเมียม</li>
                                    <li><strong>Mobile-First:</strong> ปรับปุ่มกดและแผนที่ให้ใช้งานง่ายลื่นไหลบนมือถือ</li>
                                    <li><strong>Data Visualization:</strong> กราฟและแผนที่แสดงจุดเสี่ยง (Risk Zones) ดูเข้าใจง่ายขึ้นกว่าเดิม</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                                <Calculator className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">3. ฟีเจอร์ครบครันยิ่งขึ้น</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Calculator className="w-4 h-4 text-orange-500" /> All-in-One Calculators
                                        </h5>
                                        <p className="text-xs text-slate-500 mt-1">ฮับเครื่องมือคำนวณครบวงจร ทั้งการเงิน ดอกเบี้ย และสินเชื่อ</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2">
                                            <CloudSun className="w-4 h-4 text-yellow-500" /> Weather Insight
                                        </h5>
                                        <p className="text-xs text-slate-500 mt-1">การพยากรณ์อากาศที่แม่นยำพร้อม UI ที่อ่านค่าง่าย</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                        <p className="text-lg font-semibold text-slate-700 mb-2">
                            สถานะปัจจุบัน: ระบบหลัก (Core Features) พร้อมใช้งานกว่า 95%
                        </p>
                        <p className="text-slate-500 text-sm mb-6">
                            เรากำลังอยู่ในขั้นตอนสุดท้ายของการตรวจสอบความเรียบร้อย (Final Polish) ก่อนที่จะปล่อยเวอร์ชันทดสอบ
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            ดูหน้าแรก
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SystemUpdateArticle;
