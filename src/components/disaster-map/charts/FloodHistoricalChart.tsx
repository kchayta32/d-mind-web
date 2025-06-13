
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface FloodHistoricalData {
  year: string;
  area: number;
}

interface FloodHistoricalChartProps {
  data: FloodHistoricalData[];
}

const chartConfig = {
  area: {
    label: "พื้นที่น้ำท่วม (ล้านไร่)",
  },
};

// Historical flood data from 2554-2566 (2011-2023) based on the chart image
const historicalFloodData: FloodHistoricalData[] = [
  { year: '2554', area: 30 },
  { year: '2555', area: 5 },
  { year: '2556', area: 11 },
  { year: '2557', area: 0.5 },
  { year: '2558', area: 0.2 },
  { year: '2559', area: 0.1 },
  { year: '2560', area: 0.3 },
  { year: '2561', area: 18 },
  { year: '2562', area: 2 },
  { year: '2563', area: 4.5 },
  { year: '2564', area: 1.5 },
  { year: '2565', area: 9 },
  { year: '2566', area: 13 },
];

export const FloodHistoricalChart: React.FC<FloodHistoricalChartProps> = ({ 
  data = historicalFloodData 
}) => {
  return (
    <div className="w-full h-80">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          สถิติย้อนหลัง (2554-2566)
        </h3>
        <p className="text-xs text-gray-600">
          พื้นที่น้ำท่วมแต่ละปี (หน่วย: ล้านไร่)
        </p>
      </div>
      
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 36]}
              ticks={[0, 6, 12, 18, 24, 30, 36]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              label={{ 
                value: 'ล้านไร่', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '10px', fill: '#6b7280' }
              }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number) => [
                `${value} ล้านไร่`,
                'พื้นที่น้ำท่วม'
              ]}
              labelFormatter={(label) => `ปี ${label}`}
            />
            <Bar 
              dataKey="area" 
              fill="#3b82f6"
              radius={[2, 2, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
