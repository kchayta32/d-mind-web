import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { GISTDAHotspot, WildfireStats } from './useGISTDAData';
import { AlertTriangle, TreePine, MapPin } from 'lucide-react';
import WildfireTimeChart from './charts/WildfireTimeChart';
import WildfireRegionChart from './charts/WildfireRegionChart';

interface WildfireChartsProps {
  hotspots?: GISTDAHotspot[];
  stats?: WildfireStats | null;
}

const WildfireCharts: React.FC<WildfireChartsProps> = ({ hotspots = [], stats }) => {
  if (!stats || !stats.thailand) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            การประเมินพื้นที่เสี่ยงไฟป่า
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 text-center py-4">กำลังดึงข้อมูลสถิติจุดความร้อน...</p>
        </CardContent>
      </Card>
    );
  }

  // Risk level chart data
  const byRiskLevel = stats.thailand.byRiskLevel || [];
  const riskLevelData = byRiskLevel.map(item => ({
    name: item.level || 'ไม่ระบุ',
    count: item.count || 0,
    area: item.area || 0,
    color: item.level === 'เสี่ยงมากที่สุด' ? '#7f1d1d' :
           item.level === 'เสี่ยงสูง' ? '#dc2626' :
           item.level === 'เสี่ยงปานกลาง' ? '#ea580c' : '#f97316'
  }));

  const byProvince = stats.thailand.byProvince || [];
  const byCountry = stats.international?.byCountry || [];

  return (
    <div className="space-y-4">
      {/* Risk Assessment Overview */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            การประเมินพื้นที่เสี่ยงไฟป่า
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{(stats.thailand.totalRiskArea || 0).toLocaleString()}</div>
              <div className="text-xs text-gray-600">พื้นที่เสี่ยงรวม (ไร่)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{stats.thailand.totalHotspots || 0}</div>
              <div className="text-xs text-gray-600">จุดเกิดเหตุในไทย</div>
            </div>
          </div>
          
          {/* Risk Level Distribution */}
          {riskLevelData.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">การแจกแจงตามระดับความเสี่ยง:</div>
              {riskLevelData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.count} จุด</div>
                    <div className="text-gray-500">{item.area.toLocaleString()} ไร่</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Level Chart */}
      {riskLevelData.length > 0 && (
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <TreePine className="h-4 w-4 text-green-500" />
              สัดส่วนระดับความเสี่ยง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => {
                    const strName = typeof name === 'string' ? name : String(name || '');
                    const labelName = strName.includes('เสี่ยง') ? strName.split('เสี่ยง')[1] || strName : strName;
                    return `${labelName} ${((percent || 0) * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                  fontSize={9}
                >
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} จุด`, 'จำนวน']}
                  labelFormatter={(label) => `ระดับ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Provinces by Risk Area */}
      {byProvince.length > 0 && (
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              จังหวัดเสี่ยงสูง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {byProvince.slice(0, 5).map((province, index) => {
                const riskArea = hotspots
                  .filter(h => (h.properties?.changwat || h.province) === province.name)
                  .reduce((sum, h) => sum + (h.properties?.area_rai || 0), 0);
                
                return (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-800">{province.name}</span>
                    <div className="text-right">
                      <div className="text-red-600 font-semibold">{province.count} จุด</div>
                      <div className="text-gray-500">{riskArea.toLocaleString()} ไร่</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Distribution Chart */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800">การกระจายตามเวลา (7 วันล่าสุด)</CardTitle>
        </CardHeader>
        <CardContent>
          <WildfireTimeChart hotspots={hotspots} />
        </CardContent>
      </Card>

      {/* Regional Distribution Chart */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800">การกระจายตามภูมิภาค</CardTitle>
        </CardHeader>
        <CardContent>
          <WildfireRegionChart hotspots={hotspots} />
        </CardContent>
      </Card>

      {/* Thailand vs International Comparison */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800">เปรียบเทียบในประเทศและต่างประเทศ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{stats.thailand.totalHotspots || 0}</div>
              <div className="text-xs text-gray-600">ประเทศไทย</div>
              <div className="text-xs text-blue-600 mt-1">ความเชื่อมั่น: {stats.thailand.averageConfidence || 0}%</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{stats.international?.totalHotspots || 0}</div>
              <div className="text-xs text-gray-600">ต่างประเทศ</div>
              <div className="text-xs text-orange-600 mt-1">ความเชื่อมั่น: {stats.international?.averageConfidence || 0}%</div>
            </div>
          </div>
          
          {byCountry.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-gray-600 mb-2">ประเทศใกล้เคียง:</div>
              <div className="space-y-1">
                {byCountry.slice(0, 3).map((country, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span>{country.name}</span>
                    <span className="font-semibold">{country.count} จุด</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WildfireCharts;
