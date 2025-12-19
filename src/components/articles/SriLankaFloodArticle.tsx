import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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

    // Coordinates for Sri Lanka (Approximate center or specific affected area)
    // Colombo: 6.9271° N, 79.8612° E
    // Dambulla/Central area often affected: 7.8731° N, 80.7718° E
    const position: [number, number] = [7.8731, 80.7718];

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
                            src="/dmind-premium-icon.png"
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
                            backgroundImage: `url('/lovable-uploads/2025121_1.webp')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                            <div className="p-6 text-white">
                                <h1 className="text-3xl font-bold mb-2">
                                    ศรีลังกาเผชิญมหาอุทกภัย "ที่ท้าทายที่สุด" ในประวัติศาสตร์ประเทศ เสียชีวิตแล้วทะลุ 300 ราย
                                </h1>
                                <p className="text-sm opacity-90">1 ธันวาคม 2025</p>
                                <p className="text-sm opacity-90">จาก BBC NEWS ไทย</p>
                            </div>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div className="p-6 space-y-6">
                        <div className="prose max-w-none">
                            <p className="text-lg leading-relaxed">
                                ศรีลังกากำลังเผชิญกับวิกฤตอุทกภัยครั้งใหญ่ที่สุดในประวัติศาสตร์ของประเทศ
                                โดยยอดผู้เสียชีวิตล่าสุดพุ่งสูงทะลุ 300 รายแล้ว ขณะที่ประชาชนนับล้านคนได้รับผลกระทบจากภัยพิบัติในครั้งนี้
                                รัฐบาลศรีลังกาประกาศว่าเป็นสถานการณ์ที่ "ท้าทายที่สุด" ที่ประเทศเคยเผชิญมา
                            </p>

                            <div className="my-8 h-[400px] w-full rounded-lg overflow-hidden shadow-md border border-gray-200 z-0">
                                <MapContainer center={position} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={position}>
                                        <Popup>
                                            พื้นที่ประสบภัยพิบัติอุทกภัยรุนแรง <br /> ประเทศศรีลังกา
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                                <p className="text-sm text-gray-500 mt-2 text-center">แผนที่แสดงพื้นที่ประสบภัยในประเทศศรีลังกา</p>
                            </div>

                            <p className="text-lg leading-relaxed">
                                ฝนที่ตกลงมาอย่างหนักต่อเนื่องในช่วงหลายวันที่ผ่านมา ส่งผลให้เกิดน้ำท่วมฉับพลันและดินถล่มในหลายพื้นที่
                                บ้านเรือน ถนนหนทาง และพื้นที่เกษตรกรรมได้รับความเสียหายอย่างหนัก
                                หน่วยงานกู้ภัยและกองทัพต่างเร่งระดมกำลังเข้าช่วยเหลือผู้ประสบภัยในพื้นที่ที่ยากต่อการเข้าถึง
                            </p>

                            <p className="text-lg leading-relaxed">
                                สถานการณ์ดังกล่าวยังคงน่าเป็นห่วง เนื่องจากพยากรณ์อากาศระบุว่าจะมีฝนตกลงมาเพิ่มอีกในระยะนี้
                                ซึ่งอาจซ้ำเติมสถานการณ์ให้เลวร้ายลงไปอีก นานาชาติต่างแสดงความห่วงใยและเริ่มส่งความช่วยเหลือเข้าสู่ศรีลังกาแล้ว
                            </p>

                            <div className="bg-blue-50 p-6 rounded-lg my-6">
                                <p className="text-sm text-gray-600">
                                    <strong>อ่านข่าวต้นฉบับ:</strong>
                                    <a href="https://www.bbc.com/thai/articles/c79x8gyd9xdo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                                        BBC NEWS ไทย
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default SriLankaFloodArticle;
