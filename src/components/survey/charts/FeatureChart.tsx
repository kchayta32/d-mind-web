
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface FeatureData {
  feature: string;
  score: number;
}

interface FeatureChartProps {
  data: FeatureData[];
}

export const FeatureChart: React.FC<FeatureChartProps> = ({ data }) => {
  // สีที่สวยงามแบบ gradient
  const getBarColor = (score: number) => {
    if (score >= 4.0) return '#10b981'; // emerald-500
    if (score >= 3.5) return '#3b82f6'; // blue-500
    if (score >= 3.0) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm">
            <span className="text-blue-600 font-semibold">คะแนน: {payload[0].value.toFixed(1)}</span>
            <span className="text-gray-500 ml-2">/5.0</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: string) => {
    // ตัดชื่อให้สั้นลงเพื่อให้แสดงได้ดีบนมือถือ
    if (tickItem.length > 12) {
      return tickItem.substring(0, 10) + '...';
    }
    return tickItem;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 10,
            bottom: 60,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis 
            dataKey="feature" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: '#64748b',
              angle: -45,
              textAnchor: 'end',
              height: 60
            }}
            tickFormatter={formatXAxisLabel}
            interval={0}
          />
          <YAxis 
            domain={[0, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="score" 
            radius={[4, 4, 0, 0]}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.score)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
