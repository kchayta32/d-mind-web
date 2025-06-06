
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Globe } from 'lucide-react';
import AppLogo from '@/components/AppLogo';

const AirQualityIndexArticle: React.FC = () => {
  const [language, setLanguage] = useState<'TH' | 'EN'>('EN');
  const [activeTab, setActiveTab] = useState<'PM25' | 'PM10' | 'SO2' | 'NOX' | 'CO' | 'O3'>('PM25');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'TH' : 'EN');
  };

  const pollutantData = {
    PM25: {
      EN: {
        title: 'PM₂.₅',
        description: 'Construction site, transboundary, industry, open burning or Traffic caused pollution(surface aeolian dust or motor vehicle pollution)'
      },
      TH: {
        title: 'PM₂.₅',
        description: 'มลพิษจากการก่อสร้าง อุตสาหกรรม การเผาไหม้ หรือการจราจร (ฝุ่นละอองจากพื้นผิวหรือยานพาหนะ)'
      }
    },
    PM10: {
      EN: {
        title: 'PM₁₀',
        description: 'Construction site, transboundary, industry, open burning or Traffic caused pollution(surface aeolian dust or motor vehicle pollution)'
      },
      TH: {
        title: 'PM₁₀',
        description: 'มลพิษจากการก่อสร้าง อุตสาหกรรม การเผาไหม้ หรือการจราจร (ฝุ่นละอองจากพื้นผิวหรือยานพาหนะ)'
      }
    },
    SO2: {
      EN: {
        title: 'SO₂',
        description: 'Volcanic gas or sulfufric burning in fossil fuel'
      },
      TH: {
        title: 'SO₂',
        description: 'ก๊าซจากภูเขาไฟหรือการเผาไหม้เชื้อเพลิงฟอสซิลที่มีกำมะถัน'
      }
    },
    NOX: {
      EN: {
        title: 'NOₓ',
        description: 'Nitrogen Oxide is formed during the process of nitride combustion. Nitride is the product of nitrogen oxide photochemical reaction.'
      },
      TH: {
        title: 'NOₓ',
        description: 'ไนโตรเจนออกไซด์เกิดขึ้นจากกระบวนการเผาไหม้ เป็นผลิตภัณฑ์จากปฏิกิริยาเคมีแสงของไนโตรเจนออกไซด์'
      }
    },
    CO: {
      EN: {
        title: 'CO',
        description: 'Forest fire, methane nitridation, biological activity or incomplete combustion of fuel.'
      },
      TH: {
        title: 'CO',
        description: 'จากไฟป่า การเผาไหม้มีเทนที่ไม่สมบูรณ์ กิจกรรมทางชีวภาพ หรือการเผาไหม้เชื้อเพลิงที่ไม่สมบูรณ์'
      }
    },
    O3: {
      EN: {
        title: 'O₃',
        description: 'Secondary pollutants from nitrogen oxide, reactive hydrocarbons, or photochemical reaction.'
      },
      TH: {
        title: 'O₃',
        description: 'สารมลพิษทุติยภูมิจากไนโตรเจนออกไซด์ สารไฮโดรคาร์บอนที่ว่องไว หรือปฏิกิริยาเคมีแสง'
      }
    }
  };

  const content = {
    EN: {
      title: "Air Quality Index",
      source: "from airtw.moenv.gov.tw",
      content: (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Air Quality Index</h1>
            <h2 className="text-2xl font-semibold mb-4">The definition of air pollution indicators</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Air quality index based on monitoring data will be on the same day in the air ozone(O₃), fine particulate matter(PM₂.₅), particulate matter(PM₁₀), carbon monoxide(CO), sulfur dioxide(SO₂) and II Nitric oxide(NO₂) such as the concentration of value, its impact on human health, were converted into different pollutants The vice-value targets, indicators, deputy to the day of the maximum value of the stations on the day of the air quality index (AQI).
            </p>

            <ul className="space-y-2 mb-8">
              <li><a href="#tg1" className="text-blue-600 hover:underline font-semibold">Introduction to air pollutants</a></li>
              <li><a href="#tg2" className="text-blue-600 hover:underline font-semibold">Daily air quality indicator <span className="text-sm">(Daily AQI)</span></a></li>
              <li><a href="#tg3" className="text-blue-600 hover:underline font-semibold">Real-time air quality indicator <span className="text-sm">(real-time AQI)</span></a></li>
              <li><a href="#tg4" className="text-blue-600 hover:underline font-semibold">AQI value and impact on health</a></li>
            </ul>
          </div>

          <div id="tg1">
            <h3 className="text-xl font-semibold mb-4">Introduction to air pollutants</h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(pollutantData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`px-4 py-2 rounded-lg border ${
                      activeTab === key 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pollutantData[key as keyof typeof pollutantData].EN.title}
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">● {pollutantData[activeTab].EN.title}</h4>
                <p className="text-gray-700">{pollutantData[activeTab].EN.description}</p>
              </div>
            </div>
          </div>

          <div id="tg2">
            <h3 className="text-xl font-semibold mb-4">Daily air quality indicator (Daily AQI)</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Concentrations of ozone (O₃), fine particulate matter (PM₂.₅), particulate matter (PM₁₀), carbon monoxide (CO), sulfur dioxide (SO₂) and nitrogen dioxide (NO₂) in a day are converted into their corresponding sub-indicators based on their impacts on human health. The largest value of the sub-indicators is the AQI of the monitoring station on the day.
            </p>

            <div className="overflow-x-auto">
              <h4 className="text-lg font-semibold mb-4 text-center">Air Quality Index (AQI)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div>
                    <div className="font-semibold">Good</div>
                    <div className="text-sm">0-50</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-100 rounded-lg">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <div>
                    <div className="font-semibold">Moderate</div>
                    <div className="text-sm">51-100</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-100 rounded-lg">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <div>
                    <div className="font-semibold">Unhealthy for Sensitive Groups</div>
                    <div className="text-sm">101-150</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <div>
                    <div className="font-semibold">Unhealthy</div>
                    <div className="text-sm">151-200</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <div>
                    <div className="font-semibold">Very Unhealthy</div>
                    <div className="text-sm">201-300</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-200 rounded-lg">
                  <div className="w-4 h-4 bg-red-900 rounded"></div>
                  <div>
                    <div className="font-semibold">Hazardous</div>
                    <div className="text-sm">301-500</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Notes:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Areas are generally required to report the AQI based on 8-hour ozone values. However, there are a small number of areas where an AQI based on 1-hour ozone values would be more precautionary.</li>
                  <li>8-hour O₃ values do not define higher AQI values (≥ 301). AQI values of 301 or higher are calculated with 1-hour O₃ concentrations.</li>
                  <li>1-hour SO₂ values do not define higher AQI values (≥ 200). AQI values of 200 or greater are calculated with 24-hour SO₂ concentrations.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )
    },
    TH: {
      title: "ดัชนีคุณภาพอากาศ",
      source: "จาก airtw.moenv.gov.tw",
      content: (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">ดัชนีคุณภาพอากาศ</h1>
            <h2 className="text-2xl font-semibold mb-4">คำนิยามของตัวบ่งชี้มลพิษทางอากาศ</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              ดัชนีคุณภาพอากาศจากข้อมูลการตรวจวัดจะอิงจากค่าความเข้มข้นของโอโซน (O₃), ฝุ่นละอองขนาดเล็ก (PM₂.₅), ฝุ่นละออง (PM₁₀), คาร์บอนมอนอกไซด์ (CO), ซัลเฟอร์ไดออกไซด์ (SO₂) และไนโตรเจนไดออกไซด์ (NO₂) ในวันเดียวกัน โดยแปลงผลกระทบต่อสุขภาพมนุษย์เป็นค่าตัวบ่งชี้ย่อยต่างๆ และใช้ค่าสูงสุดเป็นดัชนีคุณภาพอากาศ (AQI) ของสถานีในวันนั้น
            </p>

            <ul className="space-y-2 mb-8">
              <li><a href="#tg1" className="text-blue-600 hover:underline font-semibold">ข้อมูลสารมลพิษทางอากาศ</a></li>
              <li><a href="#tg2" className="text-blue-600 hover:underline font-semibold">ตัวบ่งชี้คุณภาพอากาศรายวัน <span className="text-sm">(Daily AQI)</span></a></li>
              <li><a href="#tg3" className="text-blue-600 hover:underline font-semibold">ตัวบ่งชี้คุณภาพอากาศแบบเรียลไทม์ <span className="text-sm">(real-time AQI)</span></a></li>
              <li><a href="#tg4" className="text-blue-600 hover:underline font-semibold">ค่า AQI และผลกระทบต่อสุขภาพ</a></li>
            </ul>
          </div>

          <div id="tg1">
            <h3 className="text-xl font-semibold mb-4">ข้อมูลสารมลพิษทางอากาศ</h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(pollutantData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`px-4 py-2 rounded-lg border ${
                      activeTab === key 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pollutantData[key as keyof typeof pollutantData].TH.title}
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">● {pollutantData[activeTab].TH.title}</h4>
                <p className="text-gray-700">{pollutantData[activeTab].TH.description}</p>
              </div>
            </div>
          </div>

          <div id="tg2">
            <h3 className="text-xl font-semibold mb-4">ตัวบ่งชี้คุณภาพอากาศรายวัน (Daily AQI)</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              ค่าความเข้มข้นของโอโซน (O₃), ฝุ่นละอองขนาดเล็ก (PM₂.₅), ฝุ่นละออง (PM₁₀), คาร์บอนมอนอกไซด์ (CO), ซัลเฟอร์ไดออกไซด์ (SO₂) และไนโตรเจนไดออกไซด์ (NO₂) ในหนึ่งวันจะถูกแปลงเป็นตัวบ่งชี้ย่อยที่สอดคล้องกันตามผลกระทบต่อสุขภาพมนุษย์ ค่าสูงสุดของตัวบ่งชี้ย่อยคือ AQI ของสถานีตรวจวัดในวันนั้น
            </p>

            <div className="overflow-x-auto">
              <h4 className="text-lg font-semibold mb-4 text-center">ดัชนีคุณภาพอากาศ (AQI)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div>
                    <div className="font-semibold">ดี</div>
                    <div className="text-sm">0-50</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-100 rounded-lg">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <div>
                    <div className="font-semibold">ปานกลาง</div>
                    <div className="text-sm">51-100</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-100 rounded-lg">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <div>
                    <div className="font-semibold">ไม่ดีต่อกลุ่มเสี่ยง</div>
                    <div className="text-sm">101-150</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <div>
                    <div className="font-semibold">ไม่ดีต่อสุขภาพ</div>
                    <div className="text-sm">151-200</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <div>
                    <div className="font-semibold">อันตรายมาก</div>
                    <div className="text-sm">201-300</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-200 rounded-lg">
                  <div className="w-4 h-4 bg-red-900 rounded"></div>
                  <div>
                    <div className="font-semibold">อันตรายอย่างมาก</div>
                    <div className="text-sm">301-500</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>หมายเหตุ:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>พื้นที่ส่วนใหญ่จำเป็นต้องรายงาน AQI ตามค่าโอโซน 8 ชั่วโมง อย่างไรก็ตาม มีพื้นที่เล็กๆ จำนวนหนึ่งที่ AQI ตามค่าโอโซน 1 ชั่วโมงจะระมัดระวังมากกว่า</li>
                  <li>ค่าโอโซน 8 ชั่วโมงไม่กำหนดค่า AQI ที่สูงกว่า (≥ 301) ค่า AQI 301 หรือสูงกว่าคำนวณด้วยความเข้มข้นโอโซน 1 ชั่วโมง</li>
                  <li>ค่า SO₂ 1 ชั่วโมงไม่กำหนดค่า AQI ที่สูงกว่า (≥ 200) ค่า AQI 200 หรือสูงกว่าคำนวณด้วยความเข้มข้น SO₂ 24 ชั่วโมง</li>
                </ol>
              </div>
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

export default AirQualityIndexArticle;
