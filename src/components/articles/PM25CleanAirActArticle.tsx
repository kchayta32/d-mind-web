import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ExternalLink, Share2, Bookmark } from 'lucide-react';

const PM25CleanAirActArticle: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            {/* Premium Header with Glassmorphism */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
                <div className="container max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-blue-100/50 transition-all duration-300"
                                onClick={() => navigate('/manual')}
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-700" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30"></div>
                                    <img
                                        src="/dmind-premium-icon.png"
                                        alt="D-MIND Logo"
                                        className="relative h-9 w-9 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">บทความเตือนภัย</h1>
                                    <p className="text-xs text-slate-500">D-MIND Emergency Alert System</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-100/50">
                                <Share2 className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-100/50">
                                <Bookmark className="h-4 w-4 text-slate-600" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <main className="container max-w-5xl mx-auto px-4 py-8">
                <article className="relative">
                    {/* Hero Image Section */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 mb-8">
                        <div
                            className="h-[400px] md:h-[500px] bg-cover bg-center relative"
                            style={{
                                backgroundImage: `url('/lovable-uploads/20251219_1.webp')`,
                            }}
                        >
                            {/* Elegant Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                            {/* Content on Image */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-4 py-1.5 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                        สิ่งแวดล้อม
                                    </span>
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20">
                                        PM2.5
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                                    PM2.5 ทำป่วย จี้รัฐบาลใหม่ 60 วันแรก เร่งคืน 'กองทุนอากาศสะอาด' สู่ร่างกฎหมาย
                                </h1>
                                <div className="flex items-center gap-4 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>19 ธันวาคม 2025</span>
                                    </div>
                                    <span className="text-white/50">•</span>
                                    <span>bangkokbiznews.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Body with Glass Card */}
                    <div className="relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-8 md:p-12">
                            {/* Lead Paragraph */}
                            <p className="text-xl md:text-2xl leading-relaxed text-slate-700 font-light mb-10 border-l-4 border-blue-500 pl-6 py-2">
                                ผู้เชี่ยวชาญเรียกร้องให้รัฐบาลใหม่เร่งนำร่าง พ.ร.บ. อากาศสะอาด กลับมาพิจารณาภายใน 60 วัน โดยต้องคง "กองทุนอากาศสะอาด" และมาตรการทางเศรษฐศาสตร์ไว้
                            </p>

                            <div className="prose prose-lg prose-slate max-w-none">
                                {/* Section 1 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                                        วิกฤติมลพิษ ต้นทุนทางสังคมที่บิดเบือน
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-600">
                                        ปัญหามลพิษทางอากาศ โดยเฉพาะ PM2.5 ได้สร้างต้นทุนทางสังคมมหาศาล ทั้งด้านสุขภาพและเศรษฐกิจ การมีกฎหมายอากาศสะอาดที่บังคับใช้ได้อย่างมีประสิทธิภาพจึงเป็นเรื่องเร่งด่วน การใช้มาตรการทางเศรษฐศาสตร์ เช่น ภาษีสิ่งแวดล้อม หรือค่าธรรมเนียมการปล่อยมลพิษ จะช่วยปรับเปลี่ยนพฤติกรรมและนำเงินเข้าสู่กองทุนเพื่อใช้ในการแก้ปัญหา
                                    </p>
                                </div>

                                {/* Image with Caption */}
                                <div className="my-12 -mx-4 md:-mx-8">
                                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                        <img
                                            src="/lovable-uploads/20251219_1.webp"
                                            alt="PM2.5 Crisis"
                                            className="w-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <p className="text-sm text-white/90 text-center">ภาพประกอบ: ปัญหามลพิษทางอากาศ (Bangkok Biz News)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                                        ใกล้ถึงจุด 'ธารน้ำแข็ง' หายหมดโลก
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-600">
                                        ความสูญเสียทางธรรมชาติจากฝีมือมนุษย์กำลังทวีความรุนแรงขึ้น การเปลี่ยนแปลงสภาพภูมิอากาศและมลพิษทางอากาศเป็นเรื่องที่เชื่อมโยงกัน การจัดการคุณภาพอากาศจึงมีผลโดยตรงต่อการลดภาวะโลกร้อนด้วย
                                    </p>
                                </div>

                                {/* Section 3 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                                        สิทธิในการได้สูดอากาศสะอาด
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-600">
                                        อากาศสะอาดควรเป็นสิทธิพื้นฐานของประชาชนทุกคน รัฐบาลมีหน้าที่ในการคุ้มครองสิทธินี้ การผลักดัน พ.ร.บ. อากาศสะอาด จึงไม่ใช่แค่เรื่องของกฎหมาย แต่เป็นเรื่องของคุณภาพชีวิตและความยุติธรรมทางสังคม
                                    </p>
                                </div>

                                {/* Key Points Card */}
                                <div className="my-12 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-10"></div>
                                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100/50">
                                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">✓</span>
                                            ข้อเรียกร้องสำคัญ
                                        </h3>
                                        <ul className="space-y-4">
                                            {[
                                                'นำร่าง พ.ร.บ. อากาศสะอาด กลับมาพิจารณาภายใน 60 วัน',
                                                'คงไว้ซึ่ง "กองทุนอากาศสะอาด"',
                                                'ใช้มาตรการทางเศรษฐศาสตร์เพื่อจัดการมลพิษ',
                                                'สร้างกลไกการบริหารจัดการที่โปร่งใสและตรวจสอบได้'
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <span className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    </span>
                                                    <span className="text-slate-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Source Citation */}
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">แหล่งอ้างอิง</p>
                                            <a
                                                href="https://www.bangkokbiznews.com/sustainability/1212840"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                                            >
                                                <span className="underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-400">Bangkok Biz News</span>
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                            onClick={() => navigate('/manual')}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            กลับไปหน้ารวมบทความ
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default PM25CleanAirActArticle;
