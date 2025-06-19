
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComprehensiveStats {
  totalIncidents: number;
  mostAffectedProvince: string;
  mostCommonDisaster: string;
  recentTrend: 'increasing' | 'decreasing' | 'stable';
  severityDistribution: { [key: number]: number };
  provinceRanking: { province: string; count: number }[];
  disasterTypeDistribution: { type: string; count: number; percentage: number }[];
  monthlyTrends: { month: string; count: number }[];
  criticalAreas: { province: string; severity: number; lastIncident: string }[];
}

interface ComprehensiveStatsPanelProps {
  stats: ComprehensiveStats | null;
  isLoading: boolean;
}

const ComprehensiveStatsPanel: React.FC<ComprehensiveStatsPanelProps> = ({
  stats,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-gray-500">
          ไม่มีข้อมูลสถิติ
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityLabel = (level: number) => {
    switch (level) {
      case 1: return 'ต่ำ';
      case 2: return 'ปานกลาง';
      case 3: return 'สูง';
      case 4: return 'วิกฤต';
      case 5: return 'ฉุกเฉินสุด';
      default: return 'ไม่ระบุ';
    }
  };

  const getSeverityColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      case 5: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {/* Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">ภาพรวม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">เหตุการณ์ทั้งหมด:</span>
              <span className="font-semibold">{stats.totalIncidents.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">จังหวัดเสี่ยงสุด:</span>
              <span className="font-semibold">{stats.mostAffectedProvince}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ภัยที่พบมากสุด:</span>
              <span className="font-semibold">{stats.mostCommonDisaster}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">แนวโน้ม:</span>
              <div className={`flex items-center space-x-1 ${getTrendColor(stats.recentTrend)}`}>
                {getTrendIcon(stats.recentTrend)}
                <span className="font-semibold capitalize">{stats.recentTrend}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disaster Type Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">การกระจายตามประเภทภัย</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.disasterTypeDistribution.slice(0, 5).map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{item.type}</span>
                <span className="font-semibold">{item.count} ({item.percentage}%)</span>
              </div>
              <Progress value={item.percentage} className="h-1" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Affected Provinces */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">จังหวัดที่ได้รับผลกระทบ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.provinceRanking.slice(0, 5).map((item, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                  {index + 1}
                </Badge>
                <span className="text-gray-600">{item.province}</span>
              </div>
              <span className="font-semibold">{item.count} เหตุการณ์</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">การกระจายตามความรุนแรง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(stats.severityDistribution)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, count]) => (
              <div key={level} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(parseInt(level))}`}></div>
                  <span className="text-gray-600">ระดับ {level} - {getSeverityLabel(parseInt(level))}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Critical Areas */}
      {stats.criticalAreas.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>พื้นที่วิกฤต</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.criticalAreas.map((area, index) => (
              <div key={index} className="p-2 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <div className="font-semibold text-red-700">{area.province}</div>
                    <div className="text-gray-600">ระดับความรุนแรง: {area.severity}</div>
                  </div>
                  <div className="text-right text-gray-500">
                    <div>เหตุการณ์ล่าสุด</div>
                    <div>{new Date(area.lastIncident).toLocaleDateString('th-TH')}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveStatsPanel;
