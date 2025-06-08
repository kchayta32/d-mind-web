
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenMeteoFloodData } from '../hooks/useOpenMeteoFloodData';
import { format, parseISO } from 'date-fns';

interface FloodTimeSeriesChartProps {
  data: OpenMeteoFloodData;
  locationName: string;
}

export const FloodTimeSeriesChart: React.FC<FloodTimeSeriesChartProps> = ({ data, locationName }) => {
  const chartData = data.daily.time.map((time, index) => ({
    date: time,
    discharge: data.daily.river_discharge[index],
    median: data.daily.river_discharge_median[index],
    max: data.daily.river_discharge_max[index],
    formattedDate: format(parseISO(time), 'dd/MM')
  }));

  const currentDate = new Date().toISOString().split('T')[0];
  const currentIndex = data.daily.time.findIndex(time => time.startsWith(currentDate));

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm text-blue-700">{locationName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate" 
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              fontSize={10}
              label={{ value: 'm³/s', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              labelFormatter={(value, payload) => {
                const item = payload?.[0]?.payload;
                return item ? format(parseISO(item.date), 'dd MMM yyyy') : value;
              }}
              formatter={(value: number) => [value?.toFixed(2), '']}
            />
            <Legend fontSize={10} />
            <Line 
              type="monotone" 
              dataKey="discharge" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="การไหล"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="median" 
              stroke="#16a34a" 
              strokeWidth={1}
              strokeDasharray="5 5"
              name="เฉลี่ย"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="max" 
              stroke="#dc2626" 
              strokeWidth={1}
              name="สูงสุด"
              dot={false}
            />
            {/* Current date indicator */}
            {currentIndex >= 0 && (
              <Line 
                type="monotone" 
                dataKey={() => null}
                stroke="#f59e0b" 
                strokeWidth={2}
                name="วันนี้"
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>7 วันย้อนหลัง</span>
            <span>ปัจจุบัน</span>
            <span>7 เดือนข้างหน้า</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
