import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface EarthquakeFiltersProps {
  magnitudeFilter: number;
  onMagnitudeChange: (value: number) => void;
}

export const EarthquakeFilters: React.FC<EarthquakeFiltersProps> = ({
  magnitudeFilter,
  onMagnitudeChange
}) => {
  const presets = [
    { label: 'ทั้งหมด', val: 0 },
    { label: 'M 2.5+', val: 2.5 },
    { label: 'M 4.5+', val: 4.5 },
    { label: 'M 6.0+ (ใหญ่)', val: 6.0 }
  ];

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="magnitude-filter" className="text-xs font-semibold text-gray-700">
            กรองขนาดแผ่นดินไหวขั้นต่ำ:
          </Label>
          <span className="text-xs font-bold text-orange-600 font-mono">
            {magnitudeFilter === 0 ? 'ทั้งหมด' : `M ${magnitudeFilter.toFixed(1)}+`}
          </span>
        </div>
        <Slider
          id="magnitude-filter"
          min={0}
          max={7.5}
          step={0.5}
          value={[magnitudeFilter]}
          onValueChange={(value) => onMagnitudeChange(value[0])}
          className="w-full mt-2"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {presets.map(p => (
          <Button
            key={p.label}
            variant={magnitudeFilter === p.val ? 'default' : 'outline'}
            size="sm"
            onClick={() => onMagnitudeChange(p.val)}
            className={`h-6 px-2 text-[10px] ${magnitudeFilter === p.val ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
