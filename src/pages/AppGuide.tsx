
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Map, Bot, Phone, BookOpen, Bell, Star, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLogo from '@/components/AppLogo';

const AppGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="container max-w-md mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white mr-3 hover:bg-blue-400/30 rounded-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <AppLogo size="md" className="mr-4" />
            <h1 className="text-xl font-bold">คู่มือการใช้งานแอพ</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-md mx-auto p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4 bg-white border border-blue-200">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
            >
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger 
              value="features"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
            >
              ฟีเจอร์
            </TabsTrigger>
            <TabsTrigger 
              value="tips"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
            >
              เคล็ดลับ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-blue-700 flex items-center">
                  <AppLogo size="sm" className="mr-2" />
                  ยินดีต้อนรับสู่ D-MIND
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-700 leading-relaxed mb-4">
                  D-MIND เป็นระบบติดตามภัยพิบัติและแจ้งเตือนอัจฉริยะ ที่ช่วยให้คุณติดตามสถานการณ์ภัยธรรมชาติ 
                  และได้รับความช่วยเหลือเมื่อเกิดเหตุฉุกเฉิน
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">จุดประสงค์หลัก:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>ติดตามภัยพิบัติแบบเรียลไทม์</li>
                    <li>แจ้งเตือนภัยล่วงหน้า</li>
                    <li>ให้คำแนะนำจากผู้เชี่ยวชาญ AI</li>
                    <li>เข้าถึงข้อมูลฉุกเฉินได้อย่างรวดเร็ว</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">วิธีเริ่มต้นใช้งาน</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-sm text-gray-700">เปิดแอพและดูการแจ้งเตือนภัยในหน้าหลัก</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-sm text-gray-700">ตรวจสอบแผนที่ภัยพิบัติเพื่อดูสถานการณ์รอบๆ</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-sm text-gray-700">ใช้ AI Assistant เพื่อขอคำปรึกษาเมื่อมีข้อสงสัย</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                    <p className="text-sm text-gray-700">บันทึกหมายเลขฉุกเฉินไว้ในโทรศัพท์</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="border-blue-200 shadow-md">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Map className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-700">แผนที่ภัยพิบัติ</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        แสดงตำแหน่งแผ่นดินไหว เซ็นเซอร์ฝน และภัยต่างๆ แบบเรียลไทม์
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Bot className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-purple-700">Dr.Mind ผู้เชี่ยวชาญ AI</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        ปรึกษาผู้เชี่ยวชาญด้านภัยธรรมชาติและแพทย์ฉุกเฉิน
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-700">คู่มือและบทความ</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        แนวทางปฏิบัติและบทความเตือนภัยล่าสุด
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <Phone className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-700">หมายเลขฉุกเฉิน</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        เข้าถึงหมายเลขโทรศัพท์ฉุกเฉินได้อย่างรวดเร็ว
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Bell className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-orange-700">การแจ้งเตือนภัย</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        รับการแจ้งเตือนภัยแบบเรียลไทม์พร้อมรายละเอียด
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-700">รายงานสถานะผู้ประสบภัย</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        รายงานสถานการณ์และขอความช่วยเหลือ
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card className="border-blue-200 shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">เคล็ดลับการใช้งาน</h3>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-medium text-yellow-800">💡 การใช้งานแผนที่</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      ใช้นิ้วหุบและขยายเพื่อซูมแผนที่ และแตะที่จุดต่างๆ เพื่อดูรายละเอียด
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-medium text-green-800">✅ การสื่อสารกับ AI</h4>
                    <p className="text-sm text-green-700 mt-1">
                      พิมพ์คำถามแบบชัดเจน เช่น "ควรทำอย่างไรเมื่อเกิดแผ่นดินไหว" จะได้คำตอบที่ตรงประเด็น
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-medium text-blue-800">📱 การแจ้งเตือน</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      เปิดการแจ้งเตือนในเบราว์เซอร์เพื่อรับข่าวสารภัยพิบัติทันที
                    </p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-medium text-red-800">🚨 ในกรณีฉุกเฉิน</h4>
                    <p className="text-sm text-red-700 mt-1">
                      หากสถานการณ์รุนแรง ให้โทรหมายเลขฉุกเฉิน 191 หรือ 1669 ทันที
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                    <h4 className="font-medium text-purple-800">⭐ ความคิดเห็น</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      ช่วยประเมินแอพเพื่อให้เราพัฒนาและปรับปรุงฟีเจอร์ให้ดียิ่งขึ้น
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">คำถามที่พบบ่อย</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800">Q: แอพใช้ข้อมูลจากแหล่งใด?</h4>
                    <p className="text-gray-600 mt-1">A: ใช้ข้อมูลจากกรมอุตุนิยมวิทยา และหน่วยงานราชการที่เกี่ยวข้อง</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Q: ใช้งานแอพได้โดยไม่ต้องสมัครสมาชิกหรือไม่?</h4>
                    <p className="text-gray-600 mt-1">A: ได้ครับ สามารถใช้งานฟีเจอร์ทั้งหมดได้ทันทีโดยไม่ต้องสมัครสมาชิก</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Q: AI จะตอบคำถามได้ทุกเรื่องหรือไม่?</h4>
                    <p className="text-gray-600 mt-1">A: AI เชี่ยวชาญด้านภัยธรรมชาติและการแพทย์ฉุกเฉินเป็นหลัก</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppGuide;
