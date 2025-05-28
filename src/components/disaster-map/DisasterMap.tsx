
import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import MapView from './MapView';
import FilterControls from './FilterControls';
import StatisticsPanel from './StatisticsPanel';
import DisasterTypeSelector from './DisasterTypeSelector';
import { useEarthquakeData } from './useEarthquakeData';

const DisasterMap: React.FC = () => {
  const [selectedDisasterType, setSelectedDisasterType] = useState<string>('earthquake');
  
  const {
    filteredEarthquakes,
    magnitudeFilter,
    setMagnitudeFilter,
    timeFilter,
    setTimeFilter,
    refreshing,
    error,
    fetchEarthquakeData,
    statistics
  } = useEarthquakeData();

  // Handle manual refresh button click
  const handleRefresh = () => {
    fetchEarthquakeData();
  };

  // Show coming soon message for non-earthquake types
  const isComingSoon = selectedDisasterType !== 'earthquake';

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">Disaster Map</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing || isComingSoon}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        {/* Disaster Type Selector */}
        <DisasterTypeSelector 
          selectedType={selectedDisasterType}
          onTypeChange={setSelectedDisasterType}
        />

        {isComingSoon ? (
          // Coming Soon View
          <div className="h-64 sm:h-72 md:h-80 w-full flex items-center justify-center bg-gray-50 border-b">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">
                ข้อมูล{selectedDisasterType === 'heavyrain' ? 'ฝนตกหนัก' : 
                      selectedDisasterType === 'flood' ? 'น้ำท่วม' : 
                      selectedDisasterType === 'wildfire' ? 'ไฟป่า' : 'พายุ'} จะเปิดให้บริการเร็วๆ นี้
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Panel */}
            <StatisticsPanel stats={statistics} />
            
            {/* Map View */}
            <div className="relative h-64 sm:h-72 md:h-80 w-full border-b">
              <MapView 
                error={error}
                filteredEarthquakes={filteredEarthquakes}
                handleRefresh={handleRefresh}
              />
            </div>

            {/* Filter Controls - only show for earthquake */}
            <FilterControls
              magnitudeFilter={magnitudeFilter}
              setMagnitudeFilter={setMagnitudeFilter}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              filteredCount={filteredEarthquakes.length}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DisasterMap;
