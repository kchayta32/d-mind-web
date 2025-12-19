
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PM25CleanAirActArticle: React.FC = () => {
    const navigate = useNavigate();

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
                            backgroundImage: `url('/lovable-uploads/20251219_1.webp')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                            <div className="p-6 text-white">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                    PM2.5 ทำป่วย จี้รัฐบาลใหม่ 60 วันแรก เร่งคืน 'กองทุนอากาศสะอาด' สู่ร่างกฎหมาย
                                </h1>
                                <p className="text-sm opacity-90">19 ธันวาคม 2025 โดย bangkokbiznews.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div className="p-6 space-y-6">
                        <div className="prose max-w-none text-gray-800">
                            <p className="text-lg leading-relaxed mb-6 font-medium">
                                ผู้เชี่ยวชาญเรียกร้องให้รัฐบาลใหม่เร่งนำร่าง พ.ร.บ. อากาศสะอาด กลับมาพิจารณาภายใน 60 วัน โดยต้องคง "กองทุนอากาศสะอาด" และมาตรการทางเศรษฐศาสตร์ไว้ เพื่อเป็นกลไกสำคัญในการแก้ไขปัญหามลพิษทางอากาศอย่างยั่งยืน
                            </p>

                            <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">
                                วิกฤติมลพิษ ต้นทุนทางสังคมที่บิดเบือน
                            </h2>
                            <p className="text-lg leading-relaxed mb-6">
                                ปัญหามลพิษทางอากาศ โดยเฉพาะ PM2.5 ได้สร้างต้นทุนทางสังคมมหาศาล ทั้งด้านสุขภาพและเศรษฐกิจ การมีกฎหมายอากาศสะอาดที่บังคับใช้ได้อย่างมีประสิทธิภาพจึงเป็นเรื่องเร่งด่วน การใช้มาตรการทางเศรษฐศาสตร์ เช่น ภาษีสิ่งแวดล้อม หรือค่าธรรมเนียมการปล่อยมลพิษ จะช่วยปรับเปลี่ยนพฤติกรรมและนำเงินเข้าสู่กองทุนเพื่อใช้ในการแก้ปัญหา
                            </p>

                            <div className="my-8 rounded-lg overflow-hidden shadow-md">
                                <img
                                    src="/lovable-uploads/20251219_1.webp"
                                    alt="PM2.5 Crisis"
                                    className="w-full object-cover"
                                />
                                <p className="text-sm text-gray-500 p-2 text-center bg-gray-50">ภาพประกอบ: ปัญหามลพิษทางอากาศ (Bangkok Biz News)</p>
                            </div>

                            <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">
                                ใกล้ถึงจุด ‘ธารน้ำแข็ง’ หายหมดโลก
                            </h2>
                            <p className="text-lg leading-relaxed mb-6">
                                ความสูญเสียทางธรรมชาติจากฝีมือมนุษย์กำลังทวีความรุนแรงขึ้น การเปลี่ยนแปลงสภาพภูมิอากาศและมลพิษทางอากาศเป็นเรื่องที่เชื่อมโยงกัน การจัดการคุณภาพอากาศจึงมีผลโดยตรงต่อการลดภาวะโลกร้อนด้วย
                            </p>

                            <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">
                                สิทธิในการได้สูดอากาศสะอาด
                            </h2>
                            <p className="text-lg leading-relaxed mb-6">
                                อากาศสะอาดควรเป็นสิทธิพื้นฐานของประชาชนทุกคน รัฐบาลมีหน้าที่ในการคุ้มครองสิทธินี้ การผลักดัน พ.ร.บ. อากาศสะอาด จึงไม่ใช่แค่เรื่องของกฎหมาย แต่เป็นเรื่องของคุณภาพชีวิตและความยุติธรรมทางสังคม
                            </p>

                            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mt-8">
                                <h3 className="text-xl font-bold text-blue-800 mb-2">ข้อเรียกร้องสำคัญ</h3>
                                <ul className="list-disc list-inside space-y-2 text-blue-900">
                                    <li>นำร่าง พ.ร.บ. อากาศสะอาด กลับมาพิจารณาภายใน 60 วัน</li>
                                    <li>คงไว้ซึ่ง "กองทุนอากาศสะอาด"</li>
                                    <li>ใช้มาตรการทางเศรษฐศาสตร์เพื่อจัดการมลพิษ</li>
                                    <li>สร้างกลไกการบริหารจัดการที่โปร่งใสและตรวจสอบได้</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg my-8 border border-gray-100">
                                <p className="text-sm text-gray-600">
                                    <strong>แหล่งอ้างอิง:</strong>
                                    <a href="https://www.bangkokbiznews.com/sustainability/1212840" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                                        Bangkok Biz News - PM2.5 ทำป่วย จี้รัฐบาลใหม่ 60 วันแรก เร่งคืน 'กองทุนอากาศสะอาด' สู่ร่างกฎหมาย
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

export default PM25CleanAirActArticle;
