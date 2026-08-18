import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenMeteoFloodData } from '../hooks/useOpenMeteoFloodData';

interface FloodTimeSeriesChartProps {
  data: OpenMeteoFloodData;
  locationName: string;
}

export const FloodTimeSeriesChart: React.FC<FloodTimeSeriesChartProps> = ({ data, locationName }) => {
  const times = data?.daily?.time || [];
  const discharges = data?.daily?.river_discharge || [];
  const medians = data?.daily?.river_discharge_median || [];
  const maxs = data?.daily?.river_discharge_max || [];

  const chartData = times.map((time, index) => {
    let formattedDate = time;
    try {
      const d = new Date(time);
      if (!isNaN(d.getTime())) {
        formattedDate = `${d.getDate()}/${d.getMonth() + 1}`;
      }
    } catch {
      formattedDate = time;
    }

    return {
      date: time,
      discharge: discharges[index] ?? 0,
      median: medians[index] ?? 0,
      max: maxs[index] ?? 0,
      formattedDate
    };
  });

  const currentDate = new Date().toISOString().split('T')[0];
  const currentIndex = times.findIndex(time => typeof time === 'string' && time.startsWith(currentDate));

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-1 pt-2">
        <CardTitle className="text-xs font-bold text-blue-700">{locationName}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate" 
              fontSize={9}
              interval="preserveStartEnd"
            />
            <YAxis 
              fontSize={9}
              unit=" m³/s"
            />
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toFixed(2)} m³/s`, '']}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item?.date || label;
              }}
              contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="discharge" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="การไหลจริง/พยากรณ์"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="median" 
              stroke="#16a34a" 
              strokeWidth={1}
              strokeDasharray="4 4"
              name="ค่ามัธยฐาน"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="max" 
              stroke="#dc2626" 
              strokeWidth={1}
              name="สูงสุดประวัติศาสตร์"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
