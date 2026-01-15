import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ExternalLink, Share2, Bookmark, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const SriLankaFloodArticle: React.FC = () => {
    const navigate = useNavigate();
    const position: [number, number] = [7.8731, 80.7718];

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
                                backgroundImage: `url('/lovable-uploads/2025121_1.webp')`,
                            }}
                        >
                            {/* Elegant Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                            {/* Content on Image */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-4 py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                        ภัยพิบัติ
                                    </span>
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20">
                                        อุทกภัย
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                                    ศรีลังกาเผชิญมหาอุทกภัย "ที่ท้าทายที่สุด" ในประวัติศาสตร์ประเทศ เสียชีวิตแล้วทะลุ 300 ราย
                                </h1>
                                <div className="flex items-center gap-4 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>1 ธันวาคม 2025</span>
                                    </div>
                                    <span className="text-white/50">•</span>
                                    <span>BBC NEWS ไทย</span>
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
                            <p className="text-xl md:text-2xl leading-relaxed text-slate-700 font-light mb-10 border-l-4 border-red-500 pl-6 py-2">
                                ศรีลังกากำลังเผชิญกับวิกฤตอุทกภัยครั้งใหญ่ที่สุดในประวัติศาสตร์ของประเทศ
                                โดยยอดผู้เสียชีวิตล่าสุดพุ่งสูงทะลุ 300 รายแล้ว ขณะที่ประชาชนนับล้านคนได้รับผลกระทบจากภัยพิบัติในครั้งนี้
                            </p>

                            <div className="prose prose-lg prose-slate max-w-none">
                                {/* Interactive Map Section */}
                                <div className="my-12 -mx-4 md:-mx-8">
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-4 px-4 md:px-8">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                            <h3 className="text-lg font-semibold text-slate-800">พื้นที่ประสบภัย</h3>
                                        </div>
                                        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                                            <MapContainer center={position} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />
                                                <Marker position={position}>
                                                    <Popup>
                                                        <div className="text-center">
                                                            <p className="font-semibold">ศรีลังกา</p>
                                                            <p className="text-sm text-gray-600">พื้นที่ประสบอุทกภัยรุนแรง</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-3 text-center">แผนที่แสดงพื้นที่ประสบภัยในประเทศศรีลังกา</p>
                                    </div>
                                </div>

                                {/* Section 1 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></span>
                                        สถานการณ์วิกฤต
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-600 mb-6">
                                        รัฐบาลศรีลังกาประกาศว่าเป็นสถานการณ์ที่ "ท้าทายที่สุด" ที่ประเทศเคยเผชิญมา
                                        ฝนที่ตกลงมาอย่างหนักต่อเนื่องในช่วงหลายวันที่ผ่านมา ส่งผลให้เกิดน้ำท่วมฉับพลันและดินถล่มในหลายพื้นที่
                                        บ้านเรือน ถนนหนทาง และพื้นที่เกษตรกรรมได้รับความเสียหายอย่างหนัก
                                    </p>
                                </div>

                                {/* Stats Card */}
                                <div className="my-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { value: '300+', label: 'ผู้เสียชีวิต', color: 'from-red-500 to-red-600' },
                                        { value: '1M+', label: 'ผู้ได้รับผลกระทบ', color: 'from-orange-500 to-orange-600' },
                                        { value: '24', label: 'จังหวัดที่ประสบภัย', color: 'from-blue-500 to-blue-600' },
                                        { value: '∞', label: 'ความเสียหาย', color: 'from-slate-500 to-slate-600' },
                                    ].map((stat, index) => (
                                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
                                            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-slate-500">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Section 2 */}
                                <div className="mb-12">
                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                                        การให้ความช่วยเหลือ
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-600">
                                        หน่วยงานกู้ภัยและกองทัพต่างเร่งระดมกำลังเข้าช่วยเหลือผู้ประสบภัยในพื้นที่ที่ยากต่อการเข้าถึง
                                        สถานการณ์ดังกล่าวยังคงน่าเป็นห่วง เนื่องจากพยากรณ์อากาศระบุว่าจะมีฝนตกลงมาเพิ่มอีกในระยะนี้
                                        ซึ่งอาจซ้ำเติมสถานการณ์ให้เลวร้ายลงไปอีก นานาชาติต่างแสดงความห่วงใยและเริ่มส่งความช่วยเหลือเข้าสู่ศรีลังกาแล้ว
                                    </p>
                                </div>

                                {/* Source Citation */}
                                <div className="mt-12 pt-8 border-t border-slate-200">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">แหล่งอ้างอิง</p>
                                            <a
                                                href="https://www.bbc.com/thai/articles/c79x8gyd9xdo"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                                            >
                                                <span className="underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-400">BBC NEWS ไทย</span>
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

export default SriLankaFloodArticle;
