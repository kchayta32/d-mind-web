
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinOff } from 'lucide-react';

interface LocationControlsProps {
  showUserLocation: boolean;
  onToggleLocation: (show: boolean) => void;
}

export const LocationControls: React.FC<LocationControlsProps> = ({
  showUserLocation,
  onToggleLocation
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">ตำแหน่งของฉัน</span>
        </div>
        
        <Button
          onClick={() => onToggleLocation(!showUserLocation)}
          variant={showUserLocation ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          {showUserLocation ? (
            <>
              <MapPinOff className="w-4 h-4 mr-2" />
              ซ่อนตำแหน่ง
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              แสดงตำแหน่ง
            </>
          )}
        </Button>
        
        {showUserLocation && (
          <p className="text-xs text-gray-500 mt-2">
            กำลังติดตามตำแหน่งของคุณ
          </p>
        )}
      </div>
    </div>
  );
};
