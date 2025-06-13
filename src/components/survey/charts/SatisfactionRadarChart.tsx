
import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface RadarData {
  category: string;
  score: number;
  fullMark: number;
}

interface SatisfactionRadarChartProps {
  data: RadarData[];
}

export const SatisfactionRadarChart: React.FC<SatisfactionRadarChartProps> = ({ data }) => {
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

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2 mx-4">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          data={data}
          margin={{
            top: 20,
            right: 80,
            bottom: 20,
            left: 80,
          }}
        >
          <PolarGrid 
            stroke="#e2e8f0"
            gridType="polygon"
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ 
              fontSize: 12, 
              fill: '#64748b',
              textAnchor: 'middle'
            }}
            className="text-sm"
          />
          <PolarRadiusAxis 
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name="คะแนนประเมิน"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
