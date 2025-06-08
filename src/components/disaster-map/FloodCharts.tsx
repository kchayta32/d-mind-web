
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FloodStats } from './hooks/useFloodData';
import { useOpenMeteoFloodData } from './hooks/useOpenMeteoFloodData';

interface FloodChartsProps {
  stats: FloodStats | null;
}

const FloodCharts: React.FC<FloodChartsProps> = ({ stats }) => {
  const { data: floodDataPoints, isLoading: isLoadingOpenMeteo } = useOpenMeteoFloodData();

  if (!stats && !floodDataPoints) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">กำลังโหลดข้อมูลน้ำท่วม...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Open-Meteo river discharge summary
  const riverDischargeData = floodDataPoints?.map(point => ({
    name: point.locationName.split(' ')[0], // Get river name only
    current: point.data.daily.river_discharge[7] || 0,
    max: Math.max(...point.data.daily.river_discharge) || 0,
    median: point.data.daily.river_discharge_median[7] || 0
  })) || [];

  // Chart 1: Current River Discharge (Open-Meteo)
  const currentDischargeData = riverDischargeData.slice(0, 6); // Show top 6 rivers

  // Chart 2: Recurrent Flood Frequency (existing GISTDA data)
  const frequencyChartData = stats?.recurrentFloods.byFrequency.map(item => ({
    frequency: `${item.frequency} ครั้ง`,
    count: item.count,
    area: item.totalArea
  })) || [];

  // Chart 3: Most Vulnerable Provinces (existing data)
  const provinceChartData = stats?.recurrentFloods.mostVulnerableProvinces.map(item => ({
    province: item.province,
    count: item.areaCount,
    area: item.totalArea
  })) || [];

  const chartConfig = {
    area: { label: 'พื้นที่ (ไร่)', color: '#3b82f6' },
    count: { label: 'จำนวนพื้นที่', color: '#06b6d4' },
    current: { label: 'ปัจจุบัน (m³/s)', color: '#2563eb' },
    max: { label: 'สูงสุด (m³/s)', color: '#dc2626' },
    median: { label: 'เฉลี่ย (m³/s)', color: '#16a34a' }
  };

  return (
    <div className="space-y-4">
      {/* Open-Meteo River Discharge */}
      {!isLoadingOpenMeteo && riverDischargeData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ข้อมูลการไหลของแม่น้ำ (Open-Meteo)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={currentDischargeData}>
                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis fontSize={10} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(2) : value,
                    name === 'current' ? 'ปัจจุบัน (m³/s)' : 
                    name === 'max' ? 'สูงสุด (m³/s)' : 
                    name === 'median' ? 'เฉลี่ย (m³/s)' : name
                  ]}
                />
                <Bar dataKey="current" fill="#2563eb" radius={[2, 2, 0, 0]} />
                <Bar dataKey="median" fill="#16a34a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Flood Frequency Analysis (GISTDA) */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">จำนวนน้ำท่วมซ้ำซาก (GISTDA)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={frequencyChartData}>
                <XAxis dataKey="frequency" fontSize={10} />
                <YAxis fontSize={10} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'count' ? 'จำนวนพื้นที่' : name === 'area' ? 'พื้นที่รวม (ไร่)' : name
                  ]}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Most Vulnerable Provinces */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">จังหวัดเสี่ยงน้ำท่วม (GISTDA)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={provinceChartData}>
                <XAxis dataKey="province" fontSize={10} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={10} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'count' ? 'จำนวนพื้นที่' : name === 'area' ? 'พื้นที่รวม (ไร่)' : name
                  ]}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Water Obstructions Summary */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">สิ่งกีดขวางทางน้ำ (GISTDA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{stats.waterObstructions.totalHyacinthAreas}</div>
                <div className="text-xs text-gray-600">พื้นที่ผักตบชวา</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{stats.waterObstructions.totalCoverage}</div>
                <div className="text-xs text-gray-600">ครอบคลุม (กม²)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{stats.waterObstructions.avgCoveragePercent}%</div>
                <div className="text-xs text-gray-600">เฉลี่ยครอบคลุม</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{stats.waterObstructions.criticalAreas}</div>
                <div className="text-xs text-gray-600">พื้นที่วิกฤต</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources */}
      <Card>
        <CardContent className="p-3">
          <div className="text-xs text-gray-500 space-y-1">
            <div><strong>แหล่งข้อมูล:</strong></div>
            <div>• ข้อมูลการไหลแม่น้ำ: Open-Meteo Flood API (GloFAS)</div>
            {stats && <div>• ข้อมูลน้ำท่วมซ้ำซาก: GISTDA Thailand</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloodCharts;
