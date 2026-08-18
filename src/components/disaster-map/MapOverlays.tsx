import React from 'react';
import { DisasterType } from './DisasterMap';

interface MapOverlaysProps {
  selectedType: DisasterType;
  isLoading: boolean;
}

export const MapOverlays: React.FC<MapOverlaysProps> = ({ isLoading }) => {
  const renderLoading = () => {
    if (!isLoading) return null;
    
    return (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-[1000] pointer-events-none transition-all">
        <div className="bg-white/95 border border-blue-200/80 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-xs font-semibold text-gray-700">กำลังอัปเดตข้อมูลแผนที่สด...</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderLoading()}
    </>
  );
};
