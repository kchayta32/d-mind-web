
import React from 'react';
import { DisasterType } from './DisasterMap';
import { RainSensor } from './types';
import { GISTDAHotspot } from './useGISTDAData';
import { RainViewerData } from './useRainViewerData';

interface DebugInfoProps {
  selectedType: DisasterType;
  isLoading: boolean;
  rainSensors?: RainSensor[];
  filteredRainSensors?: RainSensor[];
  humidityFilter?: number;
  rainData?: RainViewerData | null;
  hotspots?: GISTDAHotspot[];
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  selectedType,
  isLoading,
  rainSensors = [],
  filteredRainSensors = [],
  humidityFilter = 0,
  rainData,
  hotspots = []
}) => {
  if (isLoading) return null;

  const renderHeavyRainDebug = () => {
    if (selectedType !== 'heavyrain') return null;
    
    return (
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-xs z-[1000]">
        <div>เซ็นเซอร์ทั้งหมด: {rainSensors.length}</div>
        <div>เซ็นเซอร์ที่แสดง: {filteredRainSensors.length}</div>
        <div>ตัวกรองความชื้น: {humidityFilter}%+</div>
        {rainData && (
          <>
            <div>เรดาร์ย้อนหลัง: {rainData.radar?.past?.length || 0} เฟรม</div>
            <div>พยากรณ์: {rainData.radar?.nowcast?.length || 0} เฟรม</div>
          </>
        )}
      </div>
    );
  };

  const renderWildfireDebug = () => {
    if (selectedType !== 'wildfire') return null;
    
    return (
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-xs z-[1000]">
        <div>จุดความร้อนทั้งหมด: {hotspots.length}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>MODIS</span>
          <div className="w-3 h-3 bg-red-500"></div>
          <span>VIIRS</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderHeavyRainDebug()}
      {renderWildfireDebug()}
    </>
  );
};
