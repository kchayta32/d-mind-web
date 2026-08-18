import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VolcanoData, VolcanoStats } from '../types';
import { FlameKindling, Mountain, AlertCircle } from 'lucide-react';

interface VolcanoChartsProps {
  volcanoes: VolcanoData[];
  stats: VolcanoStats | null;
}

export const VolcanoCharts: React.FC<VolcanoChartsProps> = ({ volcanoes, stats }) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FlameKindling className="w-4 h-4 text-rose-600" />
            การปะทุของภูเขาไฟทั่วโลก ({volcanoes.length} แห่ง)
          </span>
          <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700">
            NASA EONET
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-red-50 p-2 rounded-lg border border-red-100">
            <div className="text-lg font-bold text-red-600">{stats?.eruptingCount || 0}</div>
            <div className="text-gray-600 text-[11px]">กำลังปะทุต่อเนื่อง</div>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
            <div className="text-lg font-bold text-amber-600">{stats?.regionalCount || 0}</div>
            <div className="text-gray-600 text-[11px]">วงแหวนไฟเอเชีย-แปซิฟิก</div>
          </div>
        </div>

        {/* Volcano list */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {volcanoes.map((volcano) => (
            <div key={volcano.id} className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-start justify-between text-xs">
              <div>
                <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-stone-600" />
                  <span>{volcano.name}</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {volcano.country} {volcano.elevationMeters ? `| สูง ${volcano.elevationMeters.toLocaleString()} ม.` : ''}
                </div>
              </div>
              <Badge
                variant={volcano.status === 'Erupting' ? 'destructive' : 'secondary'}
                className="text-[10px] py-0 px-1.5"
              >
                {volcano.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
