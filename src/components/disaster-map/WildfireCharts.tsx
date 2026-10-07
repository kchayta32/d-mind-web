import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { GISTDAHotspot, WildfireStats } from './useGISTDAData';
import { AlertTriangle, TreePine, MapPin, Zap, Flame, Satellite, Clock } from 'lucide-react';
import { calculateHotspotFirmsStats } from '@/services/nasaFirmsService';
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
  const firmsStats = calculateHotspotFirmsStats(hotspots);

  return (
    <div className="space-y-4">
      {/* 0. NASA FIRMS Fire Radiative Power (FRP) & Thermal Anomalies Card */}
      <Card className="bg-gradient-to-br from-orange-50/80 via-white to-red-50/80 dark:from-slate-900 dark:to-orange-950/40 shadow-sm border border-orange-200 dark:border-orange-900/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600 animate-pulse" />
              <span>NASA FIRMS: กำลังความร้อน (FRP)</span>
            </CardTitle>
            <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800 px-1.5 py-0.5 rounded font-mono font-bold">
              MODIS & VIIRS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            ตรวจวัดค่า Fire Radiative Power (FRP) ความร้อนที่ปล่อยจากกองไฟโดยตรง (เมกะวัตต์ - MW)
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/90 dark:bg-slate-800/80 p-2 rounded-xl border border-orange-100 dark:border-slate-700">
              <div className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400">
                {firmsStats.totalFrpMw.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">พลังงานรวม (MW)</div>
            </div>
            <div className="bg-white/90 dark:bg-slate-800/80 p-2 rounded-xl border border-red-100 dark:border-slate-700">
              <div className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">
                {firmsStats.maxFrpMw}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">สูงสุด (Peak MW)</div>
            </div>
            <div className="bg-white/90 dark:bg-slate-800/80 p-2 rounded-xl border border-amber-100 dark:border-slate-700">
              <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                {firmsStats.averageFrpMw}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">เฉลี่ยต่อจุด (MW)</div>
            </div>
          </div>

          {/* FRP Severity Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>การจำแนกตามระดับพลังงานความร้อน (FRP):</span>
              <span className="text-[10px] text-slate-400">NRT &le; 3h</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-950/10 dark:bg-red-950/30 border border-red-900/20">
                <span className="text-red-900 dark:text-red-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#7f1d1d]"></span>
                  &ge; 100 MW (วิกฤต)
                </span>
                <span className="font-bold text-red-900 dark:text-red-300">{firmsStats.extremeCount} จุด</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/50">
                <span className="text-red-700 dark:text-red-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
                  50 - 99 MW (สูง)
                </span>
                <span className="font-bold text-red-700 dark:text-red-400">{firmsStats.highCount} จุด</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50">
                <span className="text-orange-700 dark:text-orange-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
                  20 - 49 MW (กลาง)
                </span>
                <span className="font-bold text-orange-700 dark:text-orange-400">{firmsStats.moderateCount} จุด</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50">
                <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#eab308]"></span>
                  &lt; 20 MW (ต่ำ)
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{firmsStats.lowCount} จุด</span>
              </div>
            </div>
          </div>

          {/* Sensor breakdown: VIIRS 375m vs MODIS 1km */}
          <div className="pt-2 border-t border-orange-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5 text-blue-500" />
              <span>VIIRS 375m: <b>{firmsStats.viirsCount} จุด</b></span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>MODIS 1km: <b>{firmsStats.modisCount} จุด</b></span>
            </span>
          </div>
        </CardContent>
      </Card>

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
