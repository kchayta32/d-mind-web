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
import { FirmsSatelliteSource } from '@/services/nasaFirmsService';

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
  showFirmsLayer?: boolean;
  onShowFirmsLayerChange?: (value: boolean) => void;
  firmsSatellite?: FirmsSatelliteSource;
  onFirmsSatelliteChange?: (value: FirmsSatelliteSource) => void;
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
  // Rain Radar on Flood & Sentinel Satellite Props
  showRainRadarOnFlood?: boolean;
  onShowRainRadarOnFloodChange?: (show: boolean) => void;
  showSentinel2TrueColor?: boolean;
  onShowSentinel2TrueColorChange?: (show: boolean) => void;
  showSentinel1Sar?: boolean;
  onShowSentinel1SarChange?: (show: boolean) => void;
  onOpenCrowdsourceModal?: () => void;
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
  showFirmsLayer = true,
  onShowFirmsLayerChange,
  firmsSatellite = 'ALL',
  onFirmsSatelliteChange,
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
  showRainRadarOnFlood = true,
  onShowRainRadarOnFloodChange,
  showSentinel2TrueColor = false,
  onShowSentinel2TrueColorChange,
  showSentinel1Sar = false,
  onShowSentinel1SarChange,
  onOpenCrowdsourceModal
}) => {
  return (
    <Card className="shadow-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ตัวกรองข้อมูล
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            showFirmsLayer={showFirmsLayer}
            onShowFirmsLayerChange={onShowFirmsLayerChange}
            firmsSatellite={firmsSatellite}
            onFirmsSatelliteChange={onFirmsSatelliteChange}
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
            showRainRadar={showRainRadarOnFlood}
            onShowRainRadarChange={onShowRainRadarOnFloodChange}
            showSentinel2TrueColor={showSentinel2TrueColor}
            onShowSentinel2TrueColorChange={onShowSentinel2TrueColorChange}
            showSentinel1Sar={showSentinel1Sar}
            onShowSentinel1SarChange={onShowSentinel1SarChange}
            onOpenCrowdsourceModal={onOpenCrowdsourceModal}
          />
        )}

        {selectedType === 'storm' && (
          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-lg border border-purple-200 dark:border-purple-800/40">
            <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">ข้อมูลพายุ Real-time:</span>
            แสดงตำแหน่งพายุหมุนเขตร้อนที่กำลังดำเนินอยู่จากดาวเทียม NASA EONET และระบบเตือนภัยสากล GDACS
          </div>
        )}

        {selectedType === 'volcano' && (
          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/40">
            <span className="font-bold text-rose-900 dark:text-rose-300 block mb-1">ข้อมูลภูเขาไฟ Real-time:</span>
            แสดงจุดตรวจจับการปะทุของภูเขาไฟทั่วโลกและในแนววงแหวนไฟ (Ring of Fire)
          </div>
        )}

        {selectedType === 'openmeteorain' && (
          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800/40">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">พยากรณ์สภาพอากาศรายชั่วโมง:</span>
            คลิกที่หมุดแต่ละจังหวัดเพื่อดูพยากรณ์ฝน, อุณหภูมิ, ความชื้น, และความเร็วลมรายวัน
          </div>
        )}

        {selectedType === 'sinkhole' && (
          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-stone-50 dark:bg-stone-900/40 p-2.5 rounded-lg border border-stone-200 dark:border-stone-800">
            <span className="font-bold text-stone-900 dark:text-stone-300 block mb-1">ฐานข้อมูลแผ่นดินทรุดและดินถล่ม:</span>
            รายงานเหตุการณ์จริงในไทยและต่างประเทศ พร้อมรูปภาพและสาเหตุ
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterControls;
