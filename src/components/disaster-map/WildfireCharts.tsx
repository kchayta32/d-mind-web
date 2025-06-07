
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GISTDAHotspot, WildfireStats } from './useGISTDAData';
import { AlertTriangle, TreePine, MapPin } from 'lucide-react';
import WildfireTimeChart from './charts/WildfireTimeChart';
import WildfireRegionChart from './charts/WildfireRegionChart';

interface WildfireChartsProps {
  hotspots: GISTDAHotspot[];
  stats: WildfireStats;
}

const WildfireCharts: React.FC<WildfireChartsProps> = ({ hotspots, stats }) => {
  // Risk level chart data
  const riskLevelData = stats.thailand.byRiskLevel.map(item => ({
    name: item.level,
    count: item.count,
    area: item.area,
    color: item.level === 'เสี่ยงมากที่สุด' ? '#7f1d1d' :
           item.level === 'เสี่ยงสูง' ? '#dc2626' :
           item.level === 'เสี่ยงปานกลาง' ? '#ea580c' : '#f97316'
  }));

  const RISK_COLORS = ['#7f1d1d', '#dc2626', '#ea580c', '#f97316'];

  return (
    <div className="space-y-4">
      {/* Risk Assessment Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            การประเมินพื้นที่เสี่ยงไฟป่า
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.thailand.totalRiskArea.toLocaleString()}</div>
              <div className="text-xs text-gray-600">พื้นที่เสี่ยงรวม (ไร่)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{stats.thailand.totalHotspots}</div>
              <div className="text-xs text-gray-600">จุดเกิดเหตุในไทย</div>
            </div>
          </div>
          
          {/* Risk Level Distribution */}
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
        </CardContent>
      </Card>

      {/* Risk Level Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
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
                label={({ name, percent }) => `${name.split('เสี่ยง')[1]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={8}
              >
                {riskLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} จุด`, 'จำนวน']}
                labelFormatter={(label) => `ระดับ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Provinces by Risk Area */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            จังหวัดเสี่ยงสูง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.thailand.byProvince.slice(0, 5).map((province, index) => {
              const riskArea = hotspots
                .filter(h => h.properties?.changwat === province.name)
                .reduce((sum, h) => sum + (h.properties?.area_rai || 0), 0);
              
              return (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="font-medium">{province.name}</span>
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

      {/* Time Distribution Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">การกระจายตามเวลา (7 วันล่าสุด)</CardTitle>
        </CardHeader>
        <CardContent>
          <WildfireTimeChart hotspots={hotspots} />
        </CardContent>
      </Card>

      {/* Regional Distribution Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">การกระจายตามภูมิภาค</CardTitle>
        </CardHeader>
        <CardContent>
          <WildfireRegionChart hotspots={hotspots} />
        </CardContent>
      </Card>

      {/* Thailand vs International Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">เปรียบเทียบในประเทศและต่างประเทศ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{stats.thailand.totalHotspots}</div>
              <div className="text-xs text-gray-600">ประเทศไทย</div>
              <div className="text-xs text-blue-600 mt-1">ค่าเฉลี่ย: {stats.thailand.averageConfidence}%</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{stats.international.totalHotspots}</div>
              <div className="text-xs text-gray-600">ต่างประเทศ</div>
              <div className="text-xs text-orange-600 mt-1">ค่าเฉลี่ย: {stats.international.averageConfidence}%</div>
            </div>
          </div>
          
          {stats.international.byCountry.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-gray-600 mb-2">ประเทศใกล้เคียง:</div>
              <div className="space-y-1">
                {stats.international.byCountry.slice(0, 3).map((country, index) => (
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
