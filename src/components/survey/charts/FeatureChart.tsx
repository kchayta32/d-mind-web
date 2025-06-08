
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureChartProps {
  data: Array<{
    feature: string;
    score: number;
  }>;
}

export const FeatureChart: React.FC<FeatureChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="horizontal"
        margin={{
          top: 20,
          right: 30,
          left: 40,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 5]} />
        <YAxis dataKey="feature" type="category" width={80} />
        <Tooltip 
          formatter={(value: number) => [`${value}/5`, 'คะแนน']}
        />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
