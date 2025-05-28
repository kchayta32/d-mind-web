
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, AlertTriangle, Clock, Droplets, Gauge } from 'lucide-react';
import { EarthquakeStats, RainSensorStats } from './types';
import { DisasterType } from './DisasterMap';

interface StatisticsPanelProps {
  stats: EarthquakeStats | RainSensorStats | null;
  isLoading: boolean;
  disasterType: DisasterType;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ 
  stats, 
  isLoading,
  disasterType 
}) => {
  const renderEarthquakeStats = (earthquakeStats: EarthquakeStats) => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{earthquakeStats.total}</p>
            <p className="text-xs text-gray-500">รวมทั้งหมด</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <div>
            <p className="text-2xl font-bold">{earthquakeStats.last24Hours}</p>
            <p className="text-xs text-gray-500">24 ชม. ที่แล้ว</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ค่าเฉลี่ย:</span>
          <Badge variant="outline">
            {earthquakeStats.averageMagnitude.toFixed(1)}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">สูงสุด:</span>
          <Badge variant="outline" className="text-red-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            {earthquakeStats.maxMagnitude.toFixed(1)}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">รุนแรง:</span>
          <Badge variant={earthquakeStats.significantCount > 0 ? "destructive" : "secondary"}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {earthquakeStats.significantCount}
          </Badge>
        </div>
      </div>
    </>
  );

  const renderRainSensorStats = (rainStats: RainSensorStats) => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{rainStats.total}</p>
            <p className="text-xs text-gray-500">เซ็นเซอร์ทั้งหมด</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <div>
            <p className="text-2xl font-bold">{rainStats.last24Hours}</p>
            <p className="text-xs text-gray-500">24 ชม. ที่แล้ว</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">กำลังฝนตก:</span>
          <Badge variant={rainStats.activeRaining > 0 ? "destructive" : "secondary"}>
            <Droplets className="h-3 w-3 mr-1" />
            {rainStats.activeRaining}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ความชื้นเฉลี่ย:</span>
          <Badge variant="outline">
            <Gauge className="h-3 w-3 mr-1" />
            {rainStats.averageHumidity}%
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ความชื้นสูงสุด:</span>
          <Badge variant="outline" className="text-blue-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            {rainStats.maxHumidity}%
          </Badge>
        </div>
      </div>
    </>
  );

  const renderComingSoonStats = () => (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">🚧</div>
      <p className="text-gray-500">สถิติจะเปิดให้บริการเร็วๆ นี้</p>
    </div>
  );

  const getTitle = () => {
    switch (disasterType) {
      case 'earthquake':
        return 'สถิติแผ่นดินไหว';
      case 'heavyrain':
        return 'สถิติเซ็นเซอร์ฝน';
      case 'flood':
        return 'สถิติน้ำท่วม';
      case 'wildfire':
        return 'สถิติไฟป่า';
      case 'storm':
        return 'สถิติพายุ';
      default:
        return 'สถิติ';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : stats ? (
          disasterType === 'earthquake' 
            ? renderEarthquakeStats(stats as EarthquakeStats)
            : disasterType === 'heavyrain'
            ? renderRainSensorStats(stats as RainSensorStats)
            : renderComingSoonStats()
        ) : (
          renderComingSoonStats()
        )}
      </CardContent>
    </Card>
  );
};
