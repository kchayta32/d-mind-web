
import React from 'react';
import { AlertsFilterState } from './types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: AlertsFilterState;
  updateFilters: (filters: Partial<AlertsFilterState>) => void;
  selectedTypes: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  updateFilters,
  selectedTypes
}) => {
  // Check if earthquake is selected
  const hasEarthquake = selectedTypes.includes('earthquake');
  const hasHeavyRain = selectedTypes.includes('heavyrain');
  const hasFlood = selectedTypes.includes('flood');
  const hasWildfire = selectedTypes.includes('wildfire');
  const hasStorm = selectedTypes.includes('storm');

  // Show advanced filters only if specific types are selected
  const showAdvancedFilters = hasEarthquake || hasHeavyRain || hasFlood;

  if (!showAdvancedFilters) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          ตัวกรองขั้นสูง
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earthquake Magnitude Filter */}
        {hasEarthquake && (
          <div>
            <Label className="text-sm font-medium">
              ระดับความรุนแรงแผ่นดินไหว (Magnitude): {filters.earthquakeMagnitude?.[0] || 0}+
            </Label>
            <Slider 
              value={filters.earthquakeMagnitude || [0]} 
              min={0}
              max={9}
              step={0.1}
              onValueChange={(value) => updateFilters({ earthquakeMagnitude: value })}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>9</span>
            </div>
          </div>
        )}

        {/* Heavy Rain Intensity Filter */}
        {hasHeavyRain && (
          <div>
            <Label className="text-sm font-medium">
              ความรุนแรงฝนตกหนัก: {filters.rainIntensity?.[0] || 0}%
            </Label>
            <Slider 
              value={filters.rainIntensity || [0]} 
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => updateFilters({ rainIntensity: value })}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Flood Water Level Filter */}
        {hasFlood && (
          <div>
            <Label className="text-sm font-medium">
              ระดับน้ำท่วม: {filters.floodLevel?.[0] || 0} เมตร
            </Label>
            <Slider 
              value={filters.floodLevel || [0]} 
              min={0}
              max={10}
              step={0.1}
              onValueChange={(value) => updateFilters({ floodLevel: value })}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 ม.</span>
              <span>10+ ม.</span>
            </div>
          </div>
        )}

        {/* Coming Soon for Wildfire and Storm */}
        {(hasWildfire || hasStorm) && (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <Badge variant="outline" className="text-gray-600">
              🚧 ตัวกรองขั้นสูงสำหรับ{hasWildfire ? 'ไฟป่า' : ''}
              {hasWildfire && hasStorm ? ' และ ' : ''}
              {hasStorm ? 'พายุ' : ''} จะเปิดให้บริการเร็วๆ นี้
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
