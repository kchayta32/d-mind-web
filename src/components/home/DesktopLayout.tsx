
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  BookOpen, 
  Phone, 
  FileText, 
  Bell,
  MessageSquare,
  Shield
} from 'lucide-react';
import RealtimeAlertsSection from './RealtimeAlertsSection';
import QuickAlertSettings from './QuickAlertSettings';
import DisasterMap from '@/components/DisasterMap';

interface DesktopLayoutProps {
  onAssistantClick: () => void;
  onManualClick: () => void;
  onContactsClick: () => void;
  onAlertsClick: () => void;
  onVictimReportsClick: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  onAssistantClick,
  onManualClick,
  onContactsClick,
  onAlertsClick,
  onVictimReportsClick
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-guardian-purple" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-guardian-purple">D-Mind</span>
                </h1>
                <p className="text-sm text-gray-600">ระบบจัดการภัยพิบัติอัจฉริยะ</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={onAlertsClick} variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                การแจ้งเตือน
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Alerts & Settings */}
          <div className="space-y-6">
            <RealtimeAlertsSection />
            <QuickAlertSettings />
          </div>

          {/* Middle Column - Map */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>แผนที่ภัยพิบัติแบบเรียลไทม์</CardTitle>
                <CardDescription>
                  ติดตามสถานการณ์ภัยพิบัติทั่วประเทศไทย
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <DisasterMap />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Services */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">บริการหลัก</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onAssistantClick}>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">AI ผู้ช่วย</h3>
                <p className="text-sm text-gray-600">ปรึกษาเรื่องภัยพิบัติและการป้องกัน</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onManualClick}>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">คู่มือฉุกเฉิน</h3>
                <p className="text-sm text-gray-600">วิธีปฏิบัติตัวในสถานการณ์ฉุกเฉิน</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onContactsClick}>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold mb-2">เบอร์ฉุกเฉิน</h3>
                <p className="text-sm text-gray-600">หมายเลขติดต่อหน่วยงานสำคัญ</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onVictimReportsClick}>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold mb-2">รายงานผู้ประสบภัย</h3>
                <p className="text-sm text-gray-600">แจ้งเหตุการณ์และขอความช่วยเหลือ</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* LINE Integration */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">ติดต่อผ่าน LINE Official</h3>
                    <p className="text-sm text-green-700">รับข้อมูลและการแจ้งเตือนผ่าน LINE @dmind</p>
                  </div>
                </div>
                <Button 
                  onClick={() => window.open('https://line.me/R/ti/p/@307rcire', '_blank')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  เพิ่มเพื่อน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;
