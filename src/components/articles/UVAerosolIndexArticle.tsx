
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Globe } from 'lucide-react';
import AppLogo from '@/components/AppLogo';

const UVAerosolIndexArticle: React.FC = () => {
  const [language, setLanguage] = useState<'TH' | 'EN'>('EN');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'TH' : 'EN');
  };

  const content = {
    EN: {
      title: "UV Aerosol Index",
      source: "from earthdata.nasa.gov",
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-4">UV Aerosol Index</h1>
          
          <p className="text-gray-700 leading-relaxed">
            UV aerosol index data from NASA give researchers the ability to peer into the atmosphere to track plumes of ash, smoke, dust, and other particles.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Aerosol index (AI) is a measurement related to Aerosol Optical Depth (AOD) that indicates an increased concentration of tiny particles called aerosols suspended in the atmosphere. In general, a lower AI value indicates clearer skies due to a lower concentration of aerosols.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Aerosol index is an ideal metric for tracking the evolution of episodic aerosol plumes from dust outbreaks, volcanic ash, significant fire events, and biomass burning. Those plumes can harm human and ecosystem health, disrupt the work of important industries, and pose significant hazards to transportation.
          </p>

          <p className="text-gray-700 leading-relaxed">
            The calculation of the aerosol index is based on wavelength-dependent changes in Rayleigh scattering in the ultraviolet (UV) spectral range, where ozone absorption is very small. The aerosol index is derived from normalized radiances using two wavelength pairs at 340 and 378.5 nanometers.
          </p>

          <p className="text-gray-700 leading-relaxed">
            UV aerosol index can be calculated even if clouds are present, enabling daily global coverage. Instruments aboard NASA's Earth-observing satellites provide worldwide aerosol index data, including near real-time data.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8">Learn How to Use UV Aerosol Index Data</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Access a range of webinars, tutorials, data recipes, and data stories to enhance your knowledge of Earth Observation data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src="https://earthdata.nasa.gov/s3fs-public/styles/hds_generic_card/public/2021-09/OMPS_AI_comparison_th.png" 
                  alt="OMPS Product" 
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-2">OMPS Product Provides a Better View of High-Aerosol Events</h3>
                <p className="text-sm text-gray-600">
                  The PyroCumuloNimbus product for the Ozone Mapping and Profiler Suite (OMPS) makes it easier to track and analyze high concentrations of aerosols from wildfires and similar events.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src="https://earthdata.nasa.gov/s3fs-public/styles/hds_generic_card/public/2023-08/peterson_data_chat_th.JPG" 
                  alt="Dr. David Peterson" 
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-2">Data User: Dr. David Peterson</h3>
                <p className="text-sm text-gray-600">
                  For meteorologist David Peterson, Ozone Mapping and Profiler Suite (OMPS) data are crucial for studying pyrocumulonimbus events.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src="https://earthdata.nasa.gov/s3fs-public/styles/hds_generic_card/public/2025-01/saharan-dust-th.jpg" 
                  alt="Saharan Dust Event" 
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-2">A Clearer View of the Haze – Using NASA GES DISC Data Tools</h3>
                <p className="text-sm text-gray-600">
                  Explore how GES DISC tools and data products can augment ongoing vital research on the dynamics of dust transport in Earth's atmosphere.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Discover and Visualize UV Aerosol Index Data</h3>
              <p className="text-gray-700 mb-4">
                NASA data help us understand Earth's changing systems in more detail than ever before, and visualizations bring these data to life, making Earth science concepts accessible, beautiful, and impactful.
              </p>
              <p className="text-gray-700 mb-6">
                Data visualization is a powerful tool for analysis, trend and pattern recognition, and communication. Our resources help you find world-class data visualizations to complement and enhance your research.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <a href="#" className="flex items-center gap-2">
                    UV Index Aerosol Data and Tools
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="#" className="flex items-center gap-2">
                    UV Aerosol Index Data Catalog
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <img 
                src="https://earthdata.nasa.gov/s3fs-public/styles/crop_square/public/2024-12/smoke-plume-data-vis.jpg" 
                alt="Canadian Fires Aerosol Smoke Plume" 
                className="w-full rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-2">
                The base true-color corrected reflectance images were acquired by the Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the joint NASA/NOAA Suomi National Polar-orbiting Partnership (Suomi NPP) platform.
              </p>
            </div>
          </div>
        </div>
      )
    },
    TH: {
      title: "ดัชนี UV Aerosol",
      source: "จาก earthdata.nasa.gov",
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-4">ดัชนี UV Aerosol</h1>
          
          <p className="text-gray-700 leading-relaxed">
            ข้อมูลดัชนี UV aerosol จาก NASA ช่วยให้นักวิจัยสามารถมองเข้าไปในชั้นบรรยากาศเพื่อติดตามกลุ่มเมฆของเถ้า ควัน ฝุ่น และอนุภาคอื่นๆ
          </p>

          <p className="text-gray-700 leading-relaxed">
            ดัชนี Aerosol (AI) เป็นการวัดที่เกี่ยวข้องกับ Aerosol Optical Depth (AOD) ที่แสดงถึงความเข้มข้นที่เพิ่มขึ้นของอนุภาคเล็กๆ ที่เรียกว่า aerosols ที่แขวนลอยอยู่ในบรรยากาศ โดยทั่วไป ค่า AI ที่ต่ำกว่าแสดงถึงท้องฟ้าที่แจ่มใสขึ้นเนื่องจากความเข้มข้นของ aerosols ที่ต่ำกว่า
          </p>

          <p className="text-gray-700 leading-relaxed">
            ดัชนี Aerosol เป็นตัวชี้วัดที่เหมาะสำหรับการติดตามวิวัฒนาการของกลุ่มเมฆ aerosol ที่เกิดขึ้นเป็นช่วงๆ จากการระบาดของฝุ่น เถ้าภูเขาไฟ เหตุการณ์ไฟไหม้ที่สำคัญ และการเผาไหม้ชีวมวล กลุ่มเมฆเหล่านี้สามารถทำอันตรายต่อสุขภาพของมนุษย์และระบบนิเวศ รบกวนการทำงานของอุตสาหกรรมสำคัญ และก่อให้เกิดอันตรายอย่างมากต่อการขนส่ง
          </p>

          <p className="text-gray-700 leading-relaxed">
            การคำนวณดัชนี aerosol อิงจากการเปลี่ยนแปลงที่ขึ้นอยู่กับความยาวคลื่นในการกระเจิงแสงแรเลห์ในช่วงสเปกตรัมอัลตราไวโอเลต (UV) ซึ่งการดูดซับโอโซนมีค่าน้อยมาก ดัชนี aerosol ได้มาจากการแผ่รังสีที่ปรับมาตรฐานแล้วโดยใช้คู่ความยาวคลื่นสองคู่ที่ 340 และ 378.5 นาโนเมตร
          </p>

          <p className="text-gray-700 leading-relaxed">
            ดัชนี UV aerosol สามารถคำนวณได้แม้ว่าจะมีเมฆปรากฏขึ้น ทำให้สามารถครอบคลุมทั่วโลกได้ทุกวัน เครื่องมือบนดาวเทียมสำรวจโลกของ NASA ให้ข้อมูลดัชนี aerosol ทั่วโลก รวมถึงข้อมูลแบบเรียลไทม์
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8">เรียนรู้วิธีใช้ข้อมูล UV Aerosol Index</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            เข้าถึงเว็บินาร์ บทเรียน สูตรข้อมูล และเรื่องราวข้อมูลที่หลากหลายเพื่อเพิ่มพูนความรู้เกี่ยวกับข้อมูลการสำรวจโลก
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src="https://earthdata.nasa.gov/s3fs-public/styles/hds_generic_card/public/2021-09/OMPS_AI_comparison_th.png" 
                  alt="ผลิตภัณฑ์ OMPS" 
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-2">ผลิตภัณฑ์ OMPS ให้มุมมองที่ดีกว่าของเหตุการณ์ Aerosol สูง</h3>
                <p className="text-sm text-gray-600">
                  ผลิตภัณฑ์ PyroCumuloNimbus สำหรับ Ozone Mapping and Profiler Suite (OMPS) ทำให้ง่ายขึ้นในการติดตามและวิเคราะห์ความเข้มข้นสูงของ aerosols จากไฟป่าและเหตุการณ์คล้ายคลึงกัน
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src="https://earthdata.nasa.gov/s3fs-public/styles/hds_generic_card/public/2023-08/peterson_data_chat_th.JPG" 
                  alt="ดร. เดวิด ปีเตอร์สัน" 
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-2">ผู้ใช้ข้อมูล: ดร. เดวิด ปีเตอร์สัน</h3>
                <p className="text-sm text-gray-600">
                  สำหรับนักอุตุนิยมวิทยา เดวิด ปีเตอร์สัน ข้อมูล Ozone Mapping and Profiler Suite (OMPS) มีความสำคัญอย่างยิ่งสำหรับการศึกษาเหตุการณ์ pyrocumulonimbus
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src="https://earthdata.nasa.gov/s3fs-public/styles/hds_generic_card/public/2025-01/saharan-dust-th.jpg" 
                  alt="เหตุการณ์ฝุ่นซาฮารา" 
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold mb-2">มุมมองที่ชัดเจนยิ่งขึ้นของหมอกควัน – การใช้เครื่องมือข้อมูล NASA GES DISC</h3>
                <p className="text-sm text-gray-600">
                  สำรวจวิธีที่เครื่องมือและผลิตภัณฑ์ข้อมูล GES DISC สามารถเสริมงานวิจัยที่สำคัญต่อเนื่องเกี่ยวกับพลวัตของการขนส่งฝุ่นในชั้นบรรยากาศของโลก
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ค้นหาและแสดงภาพข้อมูล UV Aerosol Index</h3>
              <p className="text-gray-700 mb-4">
                ข้อมูล NASA ช่วยให้เราเข้าใจระบบที่เปลี่ยนแปลงของโลกได้อย่างละเอียดมากกว่าที่เคย และการแสดงภาพช่วยให้ข้อมูลเหล่านี้มีชีวิตชีวา ทำให้แนวคิดวิทยาศาสตร์โลกสามารถเข้าถึงได้ สวยงาม และส่งผลกระทบ
              </p>
              <p className="text-gray-700 mb-6">
                การแสดงภาพข้อมูลเป็นเครื่องมือที่ทรงพลังสำหรับการวิเคราะห์ การจดจำแนวโน้มและรูปแบบ และการสื่อสาร ทรัพยากรของเราช่วยให้คุณค้นหาการแสดงภาพข้อมูลระดับโลกเพื่อเสริมและเพิ่มประสิทธิภาพการวิจัยของคุณ
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <a href="#" className="flex items-center gap-2">
                    ข้อมูลและเครื่องมือ UV Index Aerosol
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="#" className="flex items-center gap-2">
                    แคตตาล็อกข้อมูล UV Aerosol Index
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <img 
                src="https://earthdata.nasa.gov/s3fs-public/styles/crop_square/public/2024-12/smoke-plume-data-vis.jpg" 
                alt="กลุ่มควันไฟป่าแคนาดา" 
                className="w-full rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-2">
                ภาพสีจริงที่ถูกแก้ไขแล้วได้มาจาก Visible Infrared Imaging Radiometer Suite (VIIRS) บนแพลตฟอร์ม NASA/NOAA Suomi National Polar-orbiting Partnership (Suomi NPP) ร่วมกัน
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white mr-3 hover:bg-blue-400/30 rounded-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <AppLogo size="md" className="mr-4" />
            <h1 className="text-xl font-bold">{content[language].title}</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:bg-blue-400/30 rounded-full flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {language}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-blue-700 mb-2">{content[language].title}</h1>
              <p className="text-sm text-gray-500">{content[language].source}</p>
            </div>

            {content[language].content}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UVAerosolIndexArticle;
