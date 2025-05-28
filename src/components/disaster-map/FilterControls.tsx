
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Settings } from 'lucide-react';
import { DisasterType } from './DisasterMap';

interface FilterControlsProps {
  magnitudeFilter: number;
  onMagnitudeChange: (value: number) => void;
  humidityFilter: number;
  onHumidityChange: (value: number) => void;
  selectedType: DisasterType;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  magnitudeFilter,
  onMagnitudeChange,
  humidityFilter,
  onHumidityChange,
  selectedType
}) => {
  const renderFilters = () => {
    switch (selectedType) {
      case 'earthquake':
        return (
          <div>
            <Label className="text-sm font-medium">
              ระดับความรุนแรง (Magnitude): {magnitudeFilter}+
            </Label>
            <Slider 
              value={[magnitudeFilter]} 
              min={0}
              max={9}
              step={0.1}
              onValueChange={(value) => onMagnitudeChange(value[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>9</span>
            </div>
          </div>
        );

      case 'heavyrain':
        return (
          <div>
            <Label className="text-sm font-medium">
              ความชื้นขั้นต่ำ: {humidityFilter}%
            </Label>
            <Slider 
              value={[humidityFilter]} 
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => onHumidityChange(value[0])}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            ตัวกรองจะเปิดให้บริการเร็วๆ นี้
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          ตัวกรอง
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderFilters()}
      </CardContent>
    </Card>
  );
};
