import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GISTDAHotspot } from '../useGISTDAData';

interface WildfireTimeChartProps {
  hotspots: GISTDAHotspot[];
}

const normalizeDateStr = (rawDate?: string): string => {
  if (!rawDate) return '';
  const cleaned = String(rawDate).trim().replace(/\//g, '-');
  if (cleaned.includes('T')) return cleaned.split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
  try {
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {
    // fallback
  }
  return cleaned.substring(0, 10);
};

export const WildfireTimeChart: React.FC<WildfireTimeChartProps> = ({ hotspots }) => {
  // Generate time-based data for the last 7 days
  const generateTimeData = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      
      const dayHotspots = hotspots.filter(h => {
        const rawDate = h.properties?.acq_date || h.properties?.th_date || h.ACQ_DATE;
        return normalizeDateStr(rawDate) === targetDateStr;
      });

      let modisCount = 0;
      let viirsCount = 0;

      dayHotspots.forEach(h => {
        const inst = String(h.properties?.instrument || h.SATELLITE || 'VIIRS').toUpperCase();
        if (inst.includes('MODIS') || inst.includes('TERRA') || inst.includes('AQUA')) {
          modisCount++;
        } else {
          viirsCount++;
        }
      });
      
      days.push({
        date: targetDate.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }),
        fullDate: targetDateStr,
        total: dayHotspots.length,
        modis: modisCount,
        viirs: viirsCount
      });
    }
    return days;
  };

  const timeData = generateTimeData();

  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" fontSize={10} tickLine={false} stroke="#94a3b8" />
        <YAxis fontSize={10} tickLine={false} stroke="#94a3b8" allowDecimals={false} />
        <Tooltip 
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            fontSize: '11px',
            backgroundColor: '#ffffff'
          }}
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()} จุด`,
            name === 'modis' ? 'ดาวเทียม MODIS' : name === 'viirs' ? 'ดาวเทียม VIIRS' : name
          ]}
          labelFormatter={(label, payload) => {
            const item = payload?.[0]?.payload;
            return item ? `${label} (รวม ${item.total.toLocaleString()} จุด)` : label;
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={28} 
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', paddingBottom: '4px' }}
          formatter={(value) => value === 'modis' ? 'MODIS (Terra/Aqua)' : 'VIIRS (Suomi/NOAA)'}
        />
        <Bar dataKey="viirs" stackId="a" fill="#ea580c" radius={[0, 0, 0, 0]} name="viirs" />
        <Bar dataKey="modis" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} name="modis" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WildfireTimeChart;
