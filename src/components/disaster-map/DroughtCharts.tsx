import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DroughtStats } from './hooks/useDroughtData';

interface DroughtChartsProps {
  stats: DroughtStats | null;
}

const DroughtCharts: React.FC<DroughtChartsProps> = ({ stats }) => {
  const pieData = [
    { name: 'ตะวันออกเฉียงเหนือ', value: 46.7, color: '#f59e0b' },
    { name: 'ตะวันออก', value: 41.6, color: '#eab308' },
    { name: 'เหนือ', value: 41.4, color: '#84cc16' },
    { name: 'ตะวันตก', value: 40.7, color: '#22c55e' },
    { name: 'กลาง', value: 38.7, color: '#10b981' },
    { name: 'ใต้', value: 37.1, color: '#06b6d4' }
  ];

  const nationalAvg = stats?.nationalAverage ?? 41.2;
  const topProvinces = stats?.topProvinces || [];

  return (
    <div className="space-y-4">
      {/* National Average */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">ค่าเฉลี่ยพื้นที่เสี่ยงภัยแล้งทั่วประเทศ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {Number(nationalAvg).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              วิเคราะห์จากความชื้นในดิน 4 ระดับความลึก
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Distribution */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">จำแนกค่าเฉลี่ยพื้นที่เสี่ยงภัยแล้งตามภูมิภาค (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'เสี่ยงภัยแล้ง']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Provinces */}
      {topProvinces.length > 0 && (
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">5 จังหวัดเสี่ยงภัยแล้งสูงสุด (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topProvinces.slice(0, 5).map((province, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">{index + 1}.</span>
                    <span>{province.province}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: province.color || '#ea580c' }}
                    >
                      {province.percentage}
                    </div>
                    <span className="text-xs text-gray-500">เสี่ยงสูง</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DroughtCharts;
