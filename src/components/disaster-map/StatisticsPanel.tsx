import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  EarthquakeStats, 
  RainSensorStats, 
  AirPollutionStats,
  RainViewerStats,
  OpenMeteoRainStats,
  StormStats,
  VolcanoStats
} from './types';
import { WildfireStats } from './useGISTDAData';
import { DroughtStats } from './hooks/useDroughtData';
import { FloodStats } from './hooks/useFloodData';
import { SinkholeStats } from '../../hooks/useSinkholeData';
import { DisasterType } from './DisasterMap';

interface StatisticsWithRainViewer extends RainSensorStats {
  rainViewer?: RainViewerStats;
}

interface StatisticsPanelProps {
  stats: EarthquakeStats | StatisticsWithRainViewer | WildfireStats | AirPollutionStats | DroughtStats | FloodStats | OpenMeteoRainStats | StormStats | VolcanoStats | SinkholeStats | null;
  isLoading: boolean;
  disasterType: DisasterType;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, isLoading, disasterType }) => {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">สถิติข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-xs text-gray-600">กำลังเชื่อมต่อ API และดึงข้อมูล Real-time...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">สถิติข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-600">ไม่มีข้อมูลสถิติ</p>
        </CardContent>
      </Card>
    );
  }

  const renderEarthquakeStats = (earthquakeStats: EarthquakeStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-orange-50 p-2 rounded-lg border border-orange-100">
          <div className="text-2xl font-bold text-orange-600">{earthquakeStats.total}</div>
          <div className="text-xs text-gray-600">แผ่นดินไหวทั้งหมด</div>
        </div>
        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{earthquakeStats.major}</div>
          <div className="text-xs text-gray-600">ขนาดใหญ่ (6.0+)</div>
        </div>
        <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="text-lg font-semibold text-blue-600">{earthquakeStats.averageMagnitude}</div>
          <div className="text-xs text-gray-600">ขนาดเฉลี่ย (Mag)</div>
        </div>
        <div className="text-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
          <div className="text-lg font-semibold text-emerald-600">{earthquakeStats.last24Hours}</div>
          <div className="text-xs text-gray-600">24 ชม. ล่าสุด</div>
        </div>
      </div>

      {earthquakeStats.sourceBreakdown && (
        <div className="border-t pt-2 text-[11px] text-gray-500">
          <div className="font-semibold text-gray-700 mb-1">ข้อมูลรวมจาก Open Feeds:</div>
          <div className="flex justify-between">
            <span>USGS: {earthquakeStats.sourceBreakdown.usgs}</span>
            <span>EMSC: {earthquakeStats.sourceBreakdown.emsc}</span>
            <span>GDACS: {earthquakeStats.sourceBreakdown.gdacs}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderStormStats = (stormStats: StormStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-purple-50 p-2 rounded-lg border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stormStats.totalActiveStorms}</div>
          <div className="text-xs text-gray-600">พายุที่กำลังเคลื่อนตัว</div>
        </div>
        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{stormStats.maxWindSpeedKmH}</div>
          <div className="text-xs text-gray-600">ความเร็วลมสูงสุด (km/h)</div>
        </div>
        <div className="text-center bg-amber-50 p-2 rounded-lg border border-amber-100">
          <div className="text-lg font-semibold text-amber-600">{stormStats.severeStormsCount}</div>
          <div className="text-xs text-gray-600">ระดับไต้ฝุ่น/รุนแรง</div>
        </div>
        <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="text-lg font-semibold text-blue-600">{stormStats.tropicalStormsCount}</div>
          <div className="text-xs text-gray-600">พายุโซนร้อน/ดีเปรสชัน</div>
        </div>
      </div>

      <div className="border-t pt-2 text-[11px] text-gray-600">
        <div className="flex justify-between items-center mb-1">
          <span>ระดับการเตือนภัย:</span>
          <div className="flex gap-1.5">
            <span className="text-red-600 font-bold">แดง: {stormStats.alertBreakdown.red}</span>
            <span className="text-orange-600 font-bold">ส้ม: {stormStats.alertBreakdown.orange}</span>
            <span className="text-emerald-600 font-bold">เขียว: {stormStats.alertBreakdown.green}</span>
          </div>
        </div>
        {stormStats.mostSevereStorm && (
          <div className="text-[11px] text-gray-700 bg-gray-50 p-1.5 rounded">
            พายุรุนแรงสูงสุด: <span className="font-bold text-purple-700">{stormStats.mostSevereStorm}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderVolcanoStats = (volcanoStats: VolcanoStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-rose-50 p-2 rounded-lg border border-rose-100">
          <div className="text-2xl font-bold text-rose-600">{volcanoStats.totalActiveVolcanoes}</div>
          <div className="text-xs text-gray-600">ภูเขาไฟตรวจพบ</div>
        </div>
        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{volcanoStats.eruptingCount}</div>
          <div className="text-xs text-gray-600">กำลังปะทุต่อเนื่อง</div>
        </div>
        <div className="text-center bg-amber-50 p-2 rounded-lg border border-amber-100">
          <div className="text-lg font-semibold text-amber-600">{volcanoStats.warningCount}</div>
          <div className="text-xs text-gray-600">เฝ้าระวัง / ผิดปกติ</div>
        </div>
        <div className="text-center bg-indigo-50 p-2 rounded-lg border border-indigo-100">
          <div className="text-lg font-semibold text-indigo-600">{volcanoStats.regionalCount}</div>
          <div className="text-xs text-gray-600">ภูมิภาคเอเชีย-แปซิฟิก</div>
        </div>
      </div>
      <div className="text-[11px] text-gray-500 border-t pt-2">
        แหล่งข้อมูล: NASA EONET & Smithsonian Global Volcanism
      </div>
    </div>
  );

  const renderRainSensorStats = (rainStats: StatisticsWithRainViewer) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{rainStats.total}</div>
          <div className="text-xs text-gray-600">เซ็นเซอร์ฝนทั้งหมด</div>
        </div>
        <div className="text-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-600">{rainStats.activeRaining}</div>
          <div className="text-xs text-gray-600">กำลังตกฝน</div>
        </div>
        <div className="text-center bg-purple-50 p-2 rounded-lg border border-purple-100">
          <div className="text-lg font-semibold text-purple-600">{rainStats.averageHumidity}%</div>
          <div className="text-xs text-gray-600">ความชื้นเฉลี่ย</div>
        </div>
        <div className="text-center bg-orange-50 p-2 rounded-lg border border-orange-100">
          <div className="text-lg font-semibold text-orange-600">{rainStats.maxHumidity}%</div>
          <div className="text-xs text-gray-600">ความชื้นสูงสุด</div>
        </div>
      </div>
      {rainStats.rainViewer && (
        <div className="border-t pt-2 bg-gray-50 p-2 rounded text-xs">
          <div className="font-semibold text-gray-700 mb-1">เรดาร์ฝน RainViewer Animation:</div>
          <div className="flex justify-between text-gray-600">
            <span>ย้อนหลัง: {rainStats.rainViewer.pastFrames} เฟรม</span>
            <span>พยากรณ์: {rainStats.rainViewer.futureFrames} เฟรม</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderWildfireStats = (wildfireStats: WildfireStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{(wildfireStats.totalHotspots || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600">จุดความร้อน VIIRS ทั้งหมด</div>
        </div>
        <div className="text-center bg-orange-50 p-2 rounded-lg border border-orange-100">
          <div className="text-2xl font-bold text-orange-600">{(wildfireStats.highConfidence || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600">ความเชื่อมั่นสูง (80%+)</div>
        </div>
        <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="text-lg font-semibold text-blue-600">{(wildfireStats.thailand?.totalHotspots || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600">ในประเทศไทย</div>
        </div>
        <div className="text-center bg-purple-50 p-2 rounded-lg border border-purple-100">
          <div className="text-lg font-semibold text-purple-600">{(wildfireStats.international?.totalHotspots || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600">ประเทศเพื่อนบ้าน</div>
        </div>
      </div>
      
      {/* Risk Area & GISTDA Data Info */}
      <div className="border-t pt-2 space-y-1 text-xs">
        <div className="flex justify-between text-gray-700">
          <span>พื้นที่เสี่ยงรวมในไทย:</span>
          <span className="font-bold text-red-600">{(wildfireStats.thailand?.totalRiskArea || 0).toLocaleString()} ไร่</span>
        </div>
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>ความเชื่อมั่นเฉลี่ย:</span>
          <span className="font-semibold text-orange-600">{wildfireStats.averageConfidence || 0}%</span>
        </div>
        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>แหล่งข้อมูล: GISTDA API 2.0</span>
          <span>VIIRS • Burn Scar • Burn Freq</span>
        </div>
      </div>
    </div>
  );

  const renderAirPollutionStats = (airStats: AirPollutionStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-teal-50 p-2 rounded-lg border border-teal-100">
          <div className="text-2xl font-bold text-teal-600">{airStats.totalStations}</div>
          <div className="text-xs text-gray-600">สถานีตรวจวัดทั่วไทย</div>
        </div>
        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{airStats.unhealthyStations}</div>
          <div className="text-xs text-gray-600">เกินเกณฑ์มาตรฐาน</div>
        </div>
        <div className="text-center bg-purple-50 p-2 rounded-lg border border-purple-100">
          <div className="text-lg font-semibold text-purple-600">{airStats.averagePM25}</div>
          <div className="text-xs text-gray-600">PM2.5 เฉลี่ย (µg/m³)</div>
        </div>
        <div className="text-center bg-orange-50 p-2 rounded-lg border border-orange-100">
          <div className="text-lg font-semibold text-orange-600">{airStats.maxPM25}</div>
          <div className="text-xs text-gray-600">PM2.5 สูงสุด (µg/m³)</div>
        </div>
      </div>

      {airStats.aqiDistribution && (
        <div className="border-t pt-2 text-[11px] space-y-1">
          <div className="font-semibold text-gray-700">การกระจายตัวของคุณภาพอากาศ:</div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-emerald-50 text-emerald-700 py-0.5 rounded">ดี: {airStats.aqiDistribution.good}</div>
            <div className="bg-amber-50 text-amber-700 py-0.5 rounded">ปานกลาง: {airStats.aqiDistribution.moderate}</div>
            <div className="bg-red-50 text-red-700 py-0.5 rounded">มีผลกระทบ: {airStats.aqiDistribution.unhealthy + airStats.aqiDistribution.veryUnhealthy}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDroughtStats = (droughtStats: DroughtStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-amber-50 p-2 rounded-lg border border-amber-100">
          <div className="text-2xl font-bold text-amber-600">{droughtStats.nationalAverage.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">ดัชนีความเสี่ยงเฉลี่ย</div>
        </div>
        <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{droughtStats.highRiskProvinces}</div>
          <div className="text-xs text-gray-600">จังหวัดเสี่ยงสูง</div>
        </div>
      </div>
      <div className="border-t pt-2">
        <div className="text-xs text-gray-600 mb-1">5 จังหวัดเสี่ยงสูงสุด (วิเคราะห์ความชื้นดิน):</div>
        <div className="space-y-1">
          {droughtStats.topProvinces.slice(0, 5).map((province, index) => (
            <div key={index} className="flex justify-between text-xs p-1 bg-gray-50 rounded">
              <span className="font-medium text-gray-800">{province.province}</span>
              <span className="font-bold" style={{ color: province.color }}>{province.percentage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFloodStats = (floodStats: any) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-cyan-50 p-2 rounded-lg border border-cyan-100">
          <div className="text-2xl font-bold text-cyan-600">16</div>
          <div className="text-xs text-gray-600">สถานีลุ่มน้ำหลัก (GloFAS)</div>
        </div>
        <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{floodStats.currentFloods?.totalArea ? Math.round(floodStats.currentFloods.totalArea / 1000000) : 0}</div>
          <div className="text-xs text-gray-600">ล้าน ตร.ม. (ดาวเทียม)</div>
        </div>
        <div className="text-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
          <div className="text-lg font-semibold text-emerald-600">30 วัน</div>
          <div className="text-xs text-gray-600">พยากรณ์น้ำหลากล่วงหน้า</div>
        </div>
        <div className="text-center bg-orange-50 p-2 rounded-lg border border-orange-100">
          <div className="text-lg font-semibold text-orange-600">{floodStats.waterObstructions?.totalHyacinthAreas || 0}</div>
          <div className="text-xs text-gray-600">จุดสิ่งกีดขวางทางน้ำ</div>
        </div>
      </div>
    </div>
  );

  const renderOpenMeteoRainStats = (openMeteoStats: OpenMeteoRainStats) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center bg-indigo-50 p-2 rounded-lg border border-indigo-100">
        <div className="text-2xl font-bold text-indigo-600">{openMeteoStats.totalStations}</div>
        <div className="text-xs text-gray-600">สถานีตรวจวัดสภาพอากาศ</div>
      </div>
      <div className="text-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
        <div className="text-2xl font-bold text-emerald-600">{openMeteoStats.activeRainStations}</div>
        <div className="text-xs text-gray-600">จุดที่กำลังมีฝนตก</div>
      </div>
      <div className="text-center bg-purple-50 p-2 rounded-lg border border-purple-100">
        <div className="text-lg font-semibold text-purple-600">{openMeteoStats.maxRainfall.toFixed(1)} mm</div>
        <div className="text-xs text-gray-600">ปริมาณฝนสูงสุด</div>
      </div>
      <div className="text-center bg-orange-50 p-2 rounded-lg border border-orange-100">
        <div className="text-lg font-semibold text-orange-600">{openMeteoStats.avgTemperature.toFixed(1)}°C</div>
        <div className="text-xs text-gray-600">อุณหภูมิเฉลี่ย</div>
      </div>
    </div>
  );

  const renderSinkholeStats = (sinkholeStats: SinkholeStats) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center bg-stone-50 p-2 rounded-lg border border-stone-200">
        <div className="text-2xl font-bold text-stone-700">{sinkholeStats.totalIncidents}</div>
        <div className="text-xs text-gray-600">เหตุการณ์ทั้งหมด</div>
      </div>
      <div className="text-center bg-red-50 p-2 rounded-lg border border-red-100">
        <div className="text-2xl font-bold text-red-600">{sinkholeStats.highSeverity}</div>
        <div className="text-xs text-gray-600">ระดับร้ายแรง</div>
      </div>
      <div className="text-center bg-purple-50 p-2 rounded-lg border border-purple-100">
        <div className="text-lg font-semibold text-purple-600">{sinkholeStats.averageSize}</div>
        <div className="text-xs text-gray-600">ขนาดเฉลี่ย</div>
      </div>
      <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-100">
        <div className="text-lg font-semibold text-blue-600">{sinkholeStats.affectedAreas}</div>
        <div className="text-xs text-gray-600">พื้นที่ได้รับผลกระทบ</div>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (disasterType) {
      case 'earthquake': return 'สถิติแผ่นดินไหว (USGS & EMSC)';
      case 'storm': return 'สถิติพายุหมุนเขตร้อน (NASA & GDACS)';
      case 'volcano': return 'สถิติภูเขาไฟระเบิด (NASA EONET)';
      case 'heavyrain': return 'สถิติเซ็นเซอร์ & เรดาร์ฝน';
      case 'openmeteorain': return 'สถิติสภาพอากาศ (Open-Meteo)';
      case 'wildfire': return 'สถิติจุดความร้อน & ไฟป่า (GISTDA VIIRS 2.0)';
      case 'airpollution': return 'สถิติคุณภาพอากาศ & PM2.5';
      case 'drought': return 'สถิติภัยแล้ง & ความชื้น (GISTDA DRIPlus / SMAP)';
      case 'flood': return 'สถิติน้ำท่วม & ลุ่มน้ำ (GISTDA 2.0 & GloFAS)';
      case 'sinkhole': return 'สถิติแผ่นดินยุบ / ดินทรุด';
      default: return 'สถิติข้อมูล';
    }
  };

  const renderStats = () => {
    switch (disasterType) {
      case 'earthquake':
        return renderEarthquakeStats(stats as EarthquakeStats);
      case 'storm':
        return renderStormStats(stats as StormStats);
      case 'volcano':
        return renderVolcanoStats(stats as VolcanoStats);
      case 'heavyrain':
        return renderRainSensorStats(stats as StatisticsWithRainViewer);
      case 'openmeteorain':
        return renderOpenMeteoRainStats(stats as OpenMeteoRainStats);
      case 'wildfire':
        return renderWildfireStats(stats as WildfireStats);
      case 'airpollution':
        return renderAirPollutionStats(stats as AirPollutionStats);
      case 'drought':
        return renderDroughtStats(stats as DroughtStats);
      case 'flood':
        return renderFloodStats(stats);
      case 'sinkhole':
        return renderSinkholeStats(stats as SinkholeStats);
      default:
        return <p className="text-xs text-gray-600">ไม่รองรับการแสดงสถิติสำหรับประเภทนี้</p>;
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>{getTitle()}</span>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-mono">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderStats()}
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
