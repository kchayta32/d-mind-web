import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GISTDAHotspot } from '../useGISTDAData';

interface WildfireRegionChartProps {
  hotspots: GISTDAHotspot[];
}

const REGION_MAP: Record<string, string[]> = {
  'ภาคเหนือ': ['เชียงใหม่', 'เชียงราย', 'น่าน', 'พะเยา', 'แพร่', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน', 'อุตรดิตถ์'],
  'ภาคตะวันออกเฉียงเหนือ': ['นครราชสีมา', 'ขอนแก่น', 'อุดรธานี', 'อุบลราชธานี', 'บุรีรัมย์', 'สุรินทร์', 'ร้อยเอ็ด', 'สกลนคร', 'กาฬสินธุ์', 'มหาสารคาม', 'ชัยภูมิ', 'มุกดาหาร', 'ยโสธร', 'หนองคาย', 'หนองบัวลำภู', 'เลย', 'นครพนม', 'บึงกาฬ', 'ศรีสะเกษ', 'อำนาจเจริญ'],
  'ภาคกลาง': ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร', 'สมุทรสงคราม', 'นครปฐม', 'พระนครศรีอยุธยา', 'อ่างทอง', 'ลพบุรี', 'สิงห์บุรี', 'ชัยนาท', 'สระบุรี', 'นครนายก', 'พิษณุโลก', 'สุโขทัย', 'เพชรบูรณ์', 'พิจิตร', 'กำแพงเพชร', 'นครสวรรค์', 'อุทัยธานี'],
  'ภาคตะวันตก': ['กาญจนบุรี', 'ตาก', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'ราชบุรี'],
  'ภาคตะวันออก': ['ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'สระแก้ว'],
  'ภาคใต้': ['นครศรีธรรมราช', 'สุราษฎร์ธานี', 'สงขลา', 'ภูเก็ต', 'กระบี่', 'พังงา', 'ตรัง', 'พัทลุง', 'ชุมพร', 'ระนอง', 'สตูล', 'ปัตตานี', 'ยะลา', 'นราธิวาส']
};

const getRegionFromProvince = (provinceName: string): string => {
  if (!provinceName || provinceName === 'ไม่ระบุ') return 'อื่นๆ / รอบบ้าน';
  for (const [region, provinces] of Object.entries(REGION_MAP)) {
    if (provinces.some(p => provinceName.includes(p))) {
      return region;
    }
  }
  return 'อื่นๆ / ประเทศเพื่อนบ้าน';
};

const REGION_COLORS: Record<string, string> = {
  'ภาคเหนือ': '#dc2626',            // Red (Highest fire prone)
  'ภาคตะวันออกเฉียงเหนือ': '#ea580c', // Orange
  'ภาคตะวันตก': '#d97706',          // Amber
  'ภาคกลาง': '#f59e0b',             // Yellow orange
  'ภาคตะวันออก': '#059669',         // Emerald
  'ภาคใต้': '#0284c7',              // Sky blue
  'อื่นๆ / รอบบ้าน': '#64748b',
  'อื่นๆ / ประเทศเพื่อนบ้าน': '#64748b'
};

export const WildfireRegionChart: React.FC<WildfireRegionChartProps> = ({ hotspots }) => {
  const generateRegionData = () => {
    const regionCounts: Record<string, number> = {};
    
    hotspots.forEach(hotspot => {
      const province = hotspot.properties?.changwat || hotspot.properties?.pv_tn || hotspot.province || '';
      const region = getRegionFromProvince(province);
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    return Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);
  };

  const regionData = generateRegionData();
  const total = regionData.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-500">
        ไม่พบข้อมูลจุดความร้อนในขณะนี้
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie
          data={regionData}
          cx="50%"
          cy="46%"
          innerRadius={42}
          outerRadius={68}
          paddingAngle={3}
          dataKey="count"
          nameKey="region"
        >
          {regionData.map((entry) => (
            <Cell 
              key={`cell-${entry.region}`} 
              fill={REGION_COLORS[entry.region] || '#ea580c'} 
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            fontSize: '11px',
            backgroundColor: '#ffffff'
          }}
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()} จุด (${((Number(value) / (total || 1)) * 100).toFixed(1)}%)`,
            name
          ]}
        />
        <Legend 
          verticalAlign="bottom" 
          height={32} 
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '10.5px', paddingTop: '4px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WildfireRegionChart;
