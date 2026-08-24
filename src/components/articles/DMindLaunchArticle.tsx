import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Smartphone, Shield, Bell, CheckCircle2, Sparkles, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

const DMindLaunchArticle: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const isEn = language === 'en';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative pb-24 transition-colors duration-300">
            {/* Header / Hero */}
            <div className="relative min-h-[420px] w-full bg-slate-900 overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 opacity-95"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-80 h-80 bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-white/80 hover:text-white hover:bg-white/10 w-fit mb-6 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> {isEn ? 'Back' : 'ย้อนกลับ'}
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 font-semibold">
                            {isEn ? 'App Launch News' : 'ข่าวเปิดตัวแอปพลิเคชัน'}
                        </Badge>
                        <Badge variant="outline" className="text-green-300 border-green-400/40 bg-green-500/10">
                            Android & iOS Coming Soon
                        </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        {isEn ? (
                            <>
                                Get Ready for "D-MIND"<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                                    Learning Innovation to Intelligent Warning Application
                                </span>
                            </>
                        ) : (
                            <>
                                เตรียมพบกับ "D-MIND"<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                                    นวัตกรรมการเรียนรู้สู่แอปพลิเคชันเตือนภัยอัจฉริยะ
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                        {isEn
                            ? 'D-MIND proudly presents an educational mobile application focused on applying AI & IoT technologies for disaster preparedness, real-time warning, and community resilience.'
                            : 'D-MIND ภูมิใจนำเสนอผลงานการพัฒนาแอปพลิเคชัน "เพื่อการศึกษา" ที่มุ่งเน้นการนำเทคโนโลยี AI และ IoT มาประยุกต์ใช้ในการเฝ้าระวังภัยพิบัติ'}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? 'D-MIND Education Team' : 'ทีมพัฒนา D-MIND Education'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>10 มีนาคม 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span>{isEn ? '4 min read' : 'เวลาอ่าน 4 นาที'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl">
                <div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 border border-border">

                    {/* Section 1: Overview */}
                    <div className="space-y-4 mb-10">
                        <h3 className="text-2xl font-bold text-foreground">
                            {isEn ? 'The Genesis of D-MIND' : 'จุดเริ่มต้นของ D-MIND'}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {isEn
                                ? 'The D-MIND initiative originated from the vision to harness cutting-edge space technology, cloud AI, and edge IoT sensors to solve disaster response challenges in Thailand. Built with an educational foundation, D-MIND bridges public accessibility and enterprise-grade disaster monitoring.'
                                : 'โปรเจกต์ D-MIND เกิดขึ้นจากความตั้งใจที่จะนำเทคโนโลยีสมัยใหม่เข้ามาช่วยแก้ปัญหาการเตือนภัยพิบัติ โดยเน้นการเรียนรู้และพัฒนา (Educational Purpose) เพื่อเป็นกรณีศึกษาสำหรับการสร้างระบบแจ้งเตือนที่มีประสิทธิภาพและเข้าถึงง่ายสำหรับทุกคน'}
                        </p>
                    </div>

                    {/* App Platform Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                                    Target SDK 35
                                </Badge>
                            </div>
                            <h4 className="font-bold text-foreground text-lg mb-2">Android Application</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {isEn
                                    ? 'Native Kotlin & Jetpack Compose build ready for initial rollout on Google Play and direct APK distribution.'
                                    : 'พร้อมเปิดให้ดาวน์โหลดเวอร์ชันทดสอบเร็วๆ นี้ พัฒนาด้วย Native Kotlin & Jetpack Compose เต็มประสิทธิภาพ'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-slate-500/10 to-indigo-500/10 p-6 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-md">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <Badge variant="secondary">In Development</Badge>
                            </div>
                            <h4 className="font-bold text-foreground text-lg mb-2">iOS Application</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {isEn
                                    ? 'SwiftUI version is actively in the engineering pipeline for future Apple App Store deployment.'
                                    : 'ขณะนี้ทีมงานกำลังเร่งพัฒนาเวอร์ชันสำหรับ iOS และมีกำหนดการปล่อยดาวน์โหลดในอนาคตอันใกล้'}
                            </p>
                        </div>
                    </div>

                    {/* Key Features List */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-foreground mb-6">
                            {isEn ? 'Core Innovations Included' : 'ฟีเจอร์เด่นที่จะมาพร้อมกับแอปพลิเคชัน'}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold text-foreground mb-1">Real-time Alerts</h5>
                                <p className="text-xs text-muted-foreground">แจ้งเตือนภัยพิบัติทันทีที่เซนเซอร์ตรวจพบความผิดปกติ</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold text-foreground mb-1">Customizable Notifications</h5>
                                <p className="text-xs text-muted-foreground">เลือกรับการแจ้งเตือนเฉพาะรัศมีและพื้นที่ที่คุณสนใจ</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold text-foreground mb-1">Safety & Manuals</h5>
                                <p className="text-xs text-muted-foreground">คู่มือการปฏิบัติตัวและเบอร์โทรฉุกเฉินแม้ขณะออฟไลน์</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Box */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8 text-center border border-slate-800 shadow-xl">
                        <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-bounce" />
                        <h3 className="text-2xl font-bold mb-2">
                            {isEn ? 'Join the Innovation Journey' : 'เตรียมตัวให้พร้อมสู่ยุคใหม่ของการเตือนภัย!'}
                        </h3>
                        <p className="text-blue-200 text-sm max-w-lg mx-auto mb-6">
                            {isEn
                                ? 'Follow our latest developments and test the interactive disaster dashboard right from your browser.'
                                : 'มาร่วมเป็นส่วนหนึ่งของการเรียนรู้เทคโนโลยีแห่งอนาคตไปกับเรา ติดตามข่าวสารและการอัปเดตได้ที่นี่'}
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                onClick={() => navigate('/manual')}
                                variant="outline"
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                                {isEn ? 'Browse Articles' : 'ดูบทความทั้งหมด'}
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold"
                                onClick={() => navigate('/')}
                            >
                                {isEn ? 'Back to Home' : 'กลับสู่หน้าหลัก'}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DMindLaunchArticle;
