
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  BookOpen, 
  Phone, 
  FileText, 
  Bell,
  MessageSquare 
} from 'lucide-react';
import RealtimeAlertsSection from './RealtimeAlertsSection';
import QuickAlertSettings from './QuickAlertSettings';
import DisasterMap from '@/components/DisasterMap';

interface MobileMainContentProps {
  onAssistantClick: () => void;
  onManualClick: () => void;
  onContactsClick: () => void;
  onAlertsClick: () => void;
  onVictimReportsClick: () => void;
  onLineClick: () => void;
}

const MobileMainContent: React.FC<MobileMainContentProps> = ({
  onAssistantClick,
  onManualClick,
  onContactsClick,
  onAlertsClick,
  onVictimReportsClick,
  onLineClick
}) => {
  return (
    <main className="flex-1 p-4 pb-20 overflow-y-auto">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            ยินดีต้อนรับสู่ <span className="text-guardian-purple">D-Mind</span>
          </h1>
          <p className="text-gray-600 text-sm">
            ระบบจัดการภัยพิบัติอัจฉริยะของประเทศไทย
          </p>
        </div>

        {/* Real-time Alerts Section */}
        <RealtimeAlertsSection />

        {/* Quick Alert Settings */}
        <QuickAlertSettings />

        {/* Disaster Map Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">แผนที่ภัยพิบัติ</CardTitle>
            <CardDescription>
              ติดตามสถานการณ์ภัยพิบัติแบบเรียลไทม์
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg overflow-hidden">
              <DisasterMap />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onAssistantClick}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm">AI ผู้ช่วย</span>
          </Button>

          <Button
            onClick={onAlertsClick}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2 border-orange-200 hover:bg-orange-50"
          >
            <Bell className="h-6 w-6 text-orange-500" />
            <span className="text-sm text-orange-700">การแจ้งเตือน</span>
          </Button>

          <Button
            onClick={onManualClick}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-sm">คู่มือฉุกเฉิน</span>
          </Button>

          <Button
            onClick={onContactsClick}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Phone className="h-6 w-6" />
            <span className="text-sm">เบอร์ฉุกเฉิน</span>
          </Button>
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={onVictimReportsClick}
            variant="outline"
            className="h-16 flex items-center justify-start gap-3 px-4"
          >
            <FileText className="h-5 w-5 text-red-500" />
            <div className="text-left">
              <div className="font-medium text-sm">รายงานผู้ประสบภัย</div>
              <div className="text-xs text-gray-500">แจ้งเหตุการณ์และขอความช่วยเหลือ</div>
            </div>
          </Button>

          <Button
            onClick={onLineClick}
            variant="outline"
            className="h-16 flex items-center justify-start gap-3 px-4 border-green-200 hover:bg-green-50"
          >
            <MessageSquare className="h-5 w-5 text-green-500" />
            <div className="text-left">
              <div className="font-medium text-sm text-green-700">LINE Official</div>
              <div className="text-xs text-green-600">ติดต่อผ่าน LINE @dmind</div>
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default MobileMainContent;
