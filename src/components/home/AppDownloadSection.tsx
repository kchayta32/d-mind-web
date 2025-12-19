import React from 'react';
import { Download, Smartphone, CheckCircle, ExternalLink, Bell, CloudRain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AppDownloadSection = () => {
    return (
        <section id="download-section" className="py-20 relative overflow-hidden bg-white">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-12 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
                                Available Soon
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                พก D-MIND<br />
                                <span className="text-blue-600">ไปกับคุณทุกที่</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                เตรียมพบกับแอปพลิเคชัน D-MIND บน Android ที่จะช่วยเตือนภัยคุณได้รวดเร็วยิ่งขึ้น พร้อมฟีเจอร์ที่ออกแบบมาเพื่อการใช้งานบนมือถือโดยเฉพาะ
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Real-time Notifications</p>
                                    <p className="text-sm text-slate-500">แจ้งเตือนทันทีเมื่อมีเหตุ</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Mobile Optimized</p>
                                    <p className="text-sm text-slate-500">ใช้งานง่าย ลื่นไหล</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                            <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl flex items-center gap-3 group transition-all hover:-translate-y-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 group-hover:opacity-90 transition-opacity" />
                            </Button>

                            <Button variant="outline" className="h-14 px-8 border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 rounded-xl flex items-center gap-3 bg-white transition-all hover:-translate-y-1">
                                <Download className="w-5 h-5" />
                                <div className="text-left leading-tight">
                                    <span className="block text-[10px] font-bold uppercase tracking-wider">Download APK</span>
                                    <span className="block text-sm font-bold">Direct Link</span>
                                </div>
                            </Button>
                        </div>

                        <p className="text-xs text-slate-400">
                            *Requires Android 8.0 or later.
                        </p>
                    </div>

                    {/* Right Visual / Mockup */}
                    <div className="flex-1 relative w-full max-w-md lg:max-w-full flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Phone Frame Mockup - Simplified CSS */}
                            <div className="relative z-10 w-[280px] h-[580px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/50">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                                <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative group">
                                    {/* Fake App UI */}
                                    <div className="absolute top-0 w-full h-full bg-slate-50 flex flex-col">
                                        <div className="h-40 bg-blue-600 rounded-b-[3rem] shadow-lg flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">D-MIND</span>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="h-24 bg-white rounded-2xl shadow-sm p-4 animate-pulse">
                                                <div className="h-3 w-1/2 bg-slate-200 rounded mb-2"></div>
                                                <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                            </div>
                                            <div className="h-24 bg-red-50 rounded-2xl shadow-sm border border-red-100 p-4">
                                                <div className="flex items-center gap-2 text-red-500 font-bold mb-1">
                                                    <Bell className="w-4 h-4" /> Alert
                                                </div>
                                                <div className="h-2 w-full bg-red-100 rounded"></div>
                                            </div>
                                        </div>
                                        {/* Touch interaction overlay */}
                                        <div className="absolute bottom-0 w-full p-4 bg-white/80 backdrop-blur-sm border-t">
                                            <div className="flex justify-around text-slate-400">
                                                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                                                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <Card className="absolute top-1/2 -right-12 lg:-right-24 -translate-y-1/2 w-48 bg-white/90 backdrop-blur transform rotate-6 animate-in slide-in-from-right-8 duration-1000 shadow-xl border-0 z-20 hidden sm:block">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <CloudRain className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Weather</p>
                                        <p className="text-xs text-slate-500">Precise Data</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="absolute bottom-20 -left-12 lg:-left-20 w-48 bg-white/90 backdrop-blur transform -rotate-3 animate-in slide-in-from-left-8 duration-1000 delay-300 shadow-xl border-0 z-20 hidden sm:block">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Safety</p>
                                        <p className="text-xs text-slate-500">Status: Safe</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
