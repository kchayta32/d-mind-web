
import React from 'react';
import { useRealtimeAlerts } from '@/hooks/useRealtimeAlerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Bell,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const RealtimeAlertsSection = () => {
  const { relevantAlerts, isLoading } = useRealtimeAlerts();
  const navigate = useNavigate();

  const getSeverityConfig = (level: number) => {
    const configs = {
      1: { color: 'bg-green-100 text-green-800 border-green-200', label: 'ต่ำ' },
      2: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'ปานกลาง' },
      3: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'สูง' },
      4: { color: 'bg-red-100 text-red-800 border-red-200', label: 'รุนแรง' },
      5: { color: 'bg-red-200 text-red-900 border-red-300', label: 'วิกฤต' }
    };
    return configs[level as keyof typeof configs] || configs[1];
  };

  const getAlertTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      earthquake: '🌍',
      flood: '🌊',
      wildfire: '🔥',
      storm: '🌪️',
      heavyrain: '🌧️',
      drought: '☀️',
      airpollution: '💨'
    };
    return emojis[type] || '⚠️';
  };

  const getAlertTypeName = (type: string) => {
    const names: Record<string, string> = {
      earthquake: 'แผ่นดินไหว',
      flood: 'น้ำท่วม',
      wildfire: 'ไฟป่า',
      storm: 'พายุ',
      heavyrain: 'ฝนตกหนัก',
      drought: 'ภัยแล้ง',
      airpollution: 'มลพิษอากาศ'
    };
    return names[type] || type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            การแจ้งเตือนล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestAlerts = relevantAlerts.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          การแจ้งเตือนล่าสุด
        </CardTitle>
        <CardDescription>
          การแจ้งเตือนภัยพิบัติในพื้นที่ของคุณ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {latestAlerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>ไม่มีการแจ้งเตือนในขณะนี้</p>
            <p className="text-sm">ทุกอย่างปกติดี</p>
          </div>
        ) : (
          <>
            {latestAlerts.map(alert => {
              const severityConfig = getSeverityConfig(alert.severity_level);
              
              return (
                <Alert key={alert.id} className={`${severityConfig.color} cursor-pointer hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-lg" role="img" aria-label={alert.alert_type}>
                        {getAlertTypeEmoji(alert.alert_type)}
                      </span>
                      <div className="flex-1">
                        <AlertTitle className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3" />
                          {alert.title}
                          <Badge variant="outline" className="text-xs">
                            {severityConfig.label}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-1">
                          <div className="text-xs">
                            <div className="font-medium">{getAlertTypeName(alert.alert_type)}</div>
                            <div className="mt-1 text-gray-600">{alert.message}</div>
                            <div className="flex items-center gap-2 mt-1 text-gray-500">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(alert.created_at), { 
                                addSuffix: true, 
                                locale: th 
                              })}
                              <MapPin className="h-3 w-3 ml-2" />
                              {alert.coordinates.lat.toFixed(2)}, {alert.coordinates.lng.toFixed(2)}
                            </div>
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                  </div>
                </Alert>
              );
            })}
            
            {relevantAlerts.length > 3 && (
              <button
                onClick={() => navigate('/alerts')}
                className="w-full flex items-center justify-center gap-2 p-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ดูการแจ้งเตือนทั้งหมด ({relevantAlerts.length} รายการ)
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeAlertsSection;
