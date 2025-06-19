
import React from 'react';
import { Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts';
import { useNavigate } from 'react-router-dom';

const MobileHeader = () => {
  const { relevantAlerts } = useRealtimeAlerts();
  const navigate = useNavigate();
  
  const activeAlerts = relevantAlerts.filter(alert => alert.is_active);
  const highSeverityAlerts = activeAlerts.filter(alert => alert.severity_level >= 4);

  return (
    <header className="bg-white shadow-lg">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-guardian-purple" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-guardian-purple">D-Mind</span>
              </h1>
              <p className="text-xs text-gray-600">ระบบจัดการภัยพิบัติ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/alerts')}
              className="relative"
            >
              <Bell className={`h-5 w-5 ${highSeverityAlerts.length > 0 ? 'text-red-500' : 'text-gray-500'}`} />
              {activeAlerts.length > 0 && (
                <Badge 
                  variant={highSeverityAlerts.length > 0 ? "destructive" : "secondary"}
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {activeAlerts.length > 9 ? '9+' : activeAlerts.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">ระบบทำงานปกติ</span>
            </div>
            <div className="text-gray-500">
              {activeAlerts.length > 0 ? (
                <span className="text-orange-600 font-medium">
                  {activeAlerts.length} การแจ้งเตือนใหม่
                </span>
              ) : (
                'ไม่มีการแจ้งเตือน'
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
