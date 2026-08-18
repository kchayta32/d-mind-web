import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DisasterType } from './DisasterMap';
import { EarthquakeFilters } from './filter-components/EarthquakeFilters';
import { HeavyRainFilters } from './filter-components/HeavyRainFilters';
import { WildfireFilters } from './filter-components/WildfireFilters';
import { AirPollutionFilters } from './filter-components/AirPollutionFilters';
import { DroughtFilters } from './filter-components/DroughtFilters';
import { FloodFilters } from './filter-components/FloodFilters';
import { SlidersHorizontal } from 'lucide-react';
import { WildfireMapProtocol, FloodMapProtocol, DroughtMapProtocol } from '@/services/gistdaService';

interface FilterControlsProps {
  selectedType: DisasterType;
  magnitudeFilter: number;
  onMagnitudeChange: (value: number) => void;
  humidityFilter: number;
  onHumidityChange: (value: number) => void;
  rainTimeFilter: string;
  onRainTimeFilterChange: (value: string) => void;
  pm25Filter: number;
  onPm25Change: (value: number) => void;
  wildfireTimeFilter: string;
  onWildfireTimeFilterChange: (value: string) => void;
  showBurnFreq: boolean;
  onShowBurnFreqChange: (value: boolean) => void;
  showBurnScar?: boolean;
  onShowBurnScarChange?: (value: boolean) => void;
  wildfireMapMode?: WildfireMapProtocol;
  onWildfireMapModeChange?: (value: WildfireMapProtocol) => void;
  droughtLayers: string[];
  onDroughtLayersChange: (layers: string[]) => void;
  droughtMapMode?: DroughtMapProtocol;
  onDroughtMapModeChange?: (value: DroughtMapProtocol) => void;
  floodTimeFilter: string;
  onFloodTimeFilterChange: (value: string) => void;
  showFloodFrequency: boolean;
  onShowFloodFrequencyChange: (show: boolean) => void;
  showWaterHyacinth?: boolean;
  onShowWaterHyacinthChange?: (show: boolean) => void;
  floodMapMode?: FloodMapProtocol;
  onFloodMapModeChange?: (value: FloodMapProtocol) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  selectedType,
  magnitudeFilter,
  onMagnitudeChange,
  humidityFilter,
  onHumidityChange,
  rainTimeFilter,
  onRainTimeFilterChange,
  pm25Filter,
  onPm25Change,
  wildfireTimeFilter,
  onWildfireTimeFilterChange,
  showBurnFreq,
  onShowBurnFreqChange,
  showBurnScar = false,
  onShowBurnScarChange,
  wildfireMapMode = 'wmts',
  onWildfireMapModeChange,
  droughtLayers,
  onDroughtLayersChange,
  droughtMapMode = 'wmts',
  onDroughtMapModeChange,
  floodTimeFilter,
  onFloodTimeFilterChange,
  showFloodFrequency,
  onShowFloodFrequencyChange,
  showWaterHyacinth = false,
  onShowWaterHyacinthChange,
  floodMapMode = 'wmts',
  onFloodMapModeChange,
}) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800 text-sm font-bold flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          ตัวกรองข้อมูลและการแสดงผล
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedType === 'earthquake' && (
          <EarthquakeFilters
            magnitudeFilter={magnitudeFilter}
            onMagnitudeChange={onMagnitudeChange}
          />
        )}
        
        {selectedType === 'heavyrain' && (
          <HeavyRainFilters
            humidityFilter={humidityFilter}
            onHumidityChange={onHumidityChange}
            timeFilter={rainTimeFilter}
            onTimeFilterChange={onRainTimeFilterChange}
          />
        )}

        {selectedType === 'wildfire' && (
          <WildfireFilters
            wildfireTimeFilter={wildfireTimeFilter}
            onWildfireTimeFilterChange={onWildfireTimeFilterChange}
            showBurnFreq={showBurnFreq}
            onShowBurnFreqChange={onShowBurnFreqChange}
            showBurnScar={showBurnScar}
            onShowBurnScarChange={onShowBurnScarChange}
            wildfireMapMode={wildfireMapMode}
            onWildfireMapModeChange={onWildfireMapModeChange}
          />
        )}

        {selectedType === 'airpollution' && (
          <AirPollutionFilters
            pm25Filter={pm25Filter}
            onPm25Change={onPm25Change}
          />
        )}

        {selectedType === 'drought' && (
          <DroughtFilters
            droughtLayers={droughtLayers}
            onDroughtLayersChange={onDroughtLayersChange}
            droughtMapMode={droughtMapMode}
            onDroughtMapModeChange={onDroughtMapModeChange}
          />
        )}

        {selectedType === 'flood' && (
          <FloodFilters
            floodTimeFilter={floodTimeFilter}
            onFloodTimeFilterChange={onFloodTimeFilterChange}
            showFloodFrequency={showFloodFrequency}
            onShowFloodFrequencyChange={onShowFloodFrequencyChange}
            showWaterHyacinth={showWaterHyacinth}
            onShowWaterHyacinthChange={onShowWaterHyacinthChange}
            floodMapMode={floodMapMode}
            onFloodMapModeChange={onFloodMapModeChange}
          />
        )}

        {selectedType === 'storm' && (
          <div className="text-xs text-gray-600 bg-purple-50 p-2.5 rounded-lg border border-purple-100">
            <span className="font-semibold text-purple-900 block mb-1">ข้อมูลพายุ Real-time:</span>
            แสดงตำแหน่งพายุหมุนเขตร้อนที่กำลังดำเนินอยู่จากดาวเทียม NASA EONET และระบบเตือนภัยสากล GDACS
          </div>
        )}

        {selectedType === 'volcano' && (
          <div className="text-xs text-gray-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
            <span className="font-semibold text-rose-900 block mb-1">ข้อมูลภูเขาไฟ Real-time:</span>
            แสดงจุดตรวจจับการปะทุของภูเขาไฟทั่วโลกและในแนววงแหวนไฟ (Ring of Fire)
          </div>
        )}

        {selectedType === 'openmeteorain' && (
          <div className="text-xs text-gray-600 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
            <span className="font-semibold text-indigo-900 block mb-1">พยากรณ์สภาพอากาศรายชั่วโมง:</span>
            คลิกที่หมุดแต่ละจังหวัดเพื่อดูพยากรณ์ฝน, อุณหภูมิ, ความชื้น, และความเร็วลมรายวัน
          </div>
        )}

        {selectedType === 'sinkhole' && (
          <div className="text-xs text-gray-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            <span className="font-semibold text-stone-900 block mb-1">ฐานข้อมูลแผ่นดินทรุดและดินถล่ม:</span>
            รายงานเหตุการณ์จริงในไทยและต่างประเทศ พร้อมรูปภาพและสาเหตุ
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterControls;
