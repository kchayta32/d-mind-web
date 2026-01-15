import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ExternalLink, Share2, Bookmark, Wind, Thermometer, CloudRain } from 'lucide-react';

const ColdWeatherArticle: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50">
            {/* Premium Header with Glassmorphism */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
                <div className="container max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-cyan-100/50 transition-all duration-300"
                                onClick={() => navigate('/manual')}
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-700" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30"></div>
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
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-100/50">
                                <Share2 className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-100/50">
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
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/10 mb-8">
                        <div
                            className="h-[400px] md:h-[500px] bg-cover bg-center relative"
                            style={{
                                backgroundImage: `url('/lovable-uploads/weather_warning_cold.png')`,
                            }}
                        >
                            {/* Elegant Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                            {/* Content on Image */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-4 py-1.5 bg-cyan-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                        เตือนภัย
                                    </span>
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20">
                                        สภาพอากาศ
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                                    สภาพอากาศแปรปรวน "หนาวเย็นลง" เตือน 22-26 ธ.ค. อุณหภูมิลดฮวบ
                                </h1>
                                <div className="flex items-center gap-4 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>22 ธันวาคม 2025 - 10:00 น.</span>
                                    </div>
                                    <span className="text-white/50">•</span>
                                    <span>ข่าวสด ONLINE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Body with Glass Card */}
                    <div className="relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-8 md:p-12">
                            {/* Lead Paragraph */}
                            <p className="text-lg md:text-xl leading-relaxed text-slate-700 font-light mb-10 border-l-4 border-cyan-500 pl-6 py-2">
                                กรมอุตุนิยมวิทยาประกาศเตือนมวลอากาศเย็นระลอกใหม่จากประเทศจีนแผ่ปกคลุมประเทศไทยตอนบน ส่งผลให้อุณหภูมิลดลงฉับพลัน พร้อมลมแรงในช่วงวันที่ 22-26 ธันวาคมนี้
                            </p>

                            <div className="prose prose-lg prose-slate max-w-none">

                                {/* Stats Cards */}
                                <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                        <Thermometer className="h-8 w-8 mb-4 opacity-90" />
                                        <div className="text-4xl font-bold mb-1">2-4°C</div>
                                        <div className="text-sm opacity-90">อุณหภูมิลดลง</div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                        <Wind className="h-8 w-8 mb-4 text-cyan-600" />
                                        <div className="text-4xl font-bold text-slate-800 mb-1">ลมแรง</div>
                                        <div className="text-sm text-slate-500">ภาคตะวันออกเฉียงเหนือ</div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                        <CloudRain className="h-8 w-8 mb-4 text-blue-600" />
                                        <div className="text-4xl font-bold text-slate-800 mb-1">ฝนตกหนัก</div>
                                        <div className="text-sm text-slate-500">ภาคใต้ตอนล่าง</div>
                                    </div>
                                </div>

                                {/* Section 1 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></span>
                                        รายละเอียดสภาพอากาศ
                                    </h2>
                                    <p className="text-base leading-relaxed text-slate-600 mb-4">
                                        บริเวณความกดอากาศสูงหรือมวลอากาศเย็นกำลังปานกลางจากประเทศจีนจะแผ่ลงมาปกคลุมภาคตะวันออกเฉียงเหนือและทะเลจีนใต้ ประกอบกับมีลมตะวันออกพัดนำความชื้นจากทะเลจีนใต้และอ่าวไทยเข้ามาปกคลุมประเทศไทยตอนบน
                                    </p>
                                    <p className="text-base leading-relaxed text-slate-600">
                                        ลักษณะเช่นนี้จะทำให้ประเทศไทยตอนบนมีฝนฟ้าคะนองเกิดขึ้นบางแห่งในระยะแรก หลังจากนั้นอุณหภูมิจะลดลง โดยภาคตะวันออกเฉียงเหนืออุณหภูมิจะลดลง 2-4 องศาเซลเซียส ส่วนภาคเหนือ ภาคกลาง และภาคตะวันออก อุณหภูมิจะลดลง 1-3 องศาเซลเซียส กับมีลมแรง
                                    </p>
                                </div>

                                {/* Section 2 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-700 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></span>
                                        ผลกระทบภาคใต้
                                    </h2>
                                    <p className="text-base leading-relaxed text-slate-600">
                                        สำหรับมรสุมตะวันออกเฉียงเหนือที่พัดปกคลุมอ่าวไทยและภาคใต้จะมีกำลังแรงขึ้น ทำให้ภาคใต้ตอนล่างมีฝนตกหนักบางแห่ง ขอให้ประชาชนในบริเวณดังกล่าวระวังอันตรายจากฝนตกหนักและฝนที่ตกสะสม ซึ่งอาจทำให้เกิดน้ำท่วมฉับพลันและน้ำป่าไหลหลากได้
                                    </p>
                                </div>

                                {/* Warning Box */}
                                <div className="my-8 p-6 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4 items-start">
                                    <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
                                        <Thermometer className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-orange-800 mb-2">ข้อแนะนำสำหรับประชาชน</h4>
                                        <p className="text-sm text-orange-700">
                                            ขอให้ประชาชนบริเวณประเทศไทยตอนบนดูแลรักษาสุขภาพเนื่องจากสภาพอากาศที่เปลี่ยนแปลง และระมัดระวังในการสัญจรผ่านบริเวณที่มีหมอกไว้ด้วย ส่วนชาวเรือบริเวณอ่าวไทยควรเดินเรือด้วยความระมัดระวังและหลีกเลี่ยงการเดินเรือในบริเวณที่มีฝนฟ้าคะนอง
                                        </p>
                                    </div>
                                </div>

                                {/* Source Citation */}
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">ขอบคุณข้อมูลจาก</p>
                                            <a
                                                href="https://www.khaosod.co.th/breaking-news/news_10069507"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors group"
                                            >
                                                <span className="underline underline-offset-4 decoration-cyan-200 group-hover:decoration-cyan-400">ข่าวสด ONLINE</span>
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="rounded-full border-cyan-200 text-cyan-600 hover:bg-cyan-50"
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

export default ColdWeatherArticle;
