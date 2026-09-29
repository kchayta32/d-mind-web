import React, { useState } from 'react';
import DisasterTypeSelector from './DisasterTypeSelector';
import { LocationSearch } from './LocationSearch';
import { DisasterMapContent } from './DisasterMapContent';
import { SelectedLocation } from './types';

export type DisasterType = 
  | 'earthquake' 
  | 'heavyrain' 
  | 'openmeteorain' 
  | 'wildfire' 
  | 'airpollution' 
  | 'drought' 
  | 'flood' 
  | 'bkk_road_flood'
  | 'storm' 
  | 'volcano' 
  | 'sinkhole';

const DisasterMap: React.FC = () => {
  const [selectedType, setSelectedType] = useState<DisasterType>('earthquake');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const handleLocationSelect = (lat: number, lon: number, name: string, locationData?: SelectedLocation) => {
    if (locationData) {
      setSelectedLocation(locationData);
    } else {
      setSelectedLocation({
        name,
        displayName: name,
        lat,
        lon
      });
    }
  };

  const handleClearSelectedLocation = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Top Selector & Location Search Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <DisasterTypeSelector 
            selectedType={selectedType} 
            onTypeChange={setSelectedType}
          />
        </div>
        <div className="flex items-center justify-end self-end xl:self-center flex-shrink-0">
          <LocationSearch 
            onLocationSelect={handleLocationSelect}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      
      {/* Main Map & Statistics Content */}
      <DisasterMapContent
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onLocationSelect={handleLocationSelect}
        selectedLocation={selectedLocation}
        onClearSelectedLocation={handleClearSelectedLocation}
      />
    </div>
  );
};

export default DisasterMap;
