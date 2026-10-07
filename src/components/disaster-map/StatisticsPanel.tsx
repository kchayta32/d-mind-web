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
      <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">สถิติข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">กำลังเชื่อมต่อ API และดึงข้อมูล Real-time...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">สถิติข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">ไม่มีข้อมูลสถิติ</p>
        </CardContent>
      </Card>
    );
  }

  const renderEarthquakeStats = (earthquakeStats: EarthquakeStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800/40">
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{earthquakeStats.total}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">แผ่นดินไหวทั้งหมด</div>
        </div>
        <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{earthquakeStats.major}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ขนาดใหญ่ (6.0+)</div>
        </div>
        <div className="text-center bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{earthquakeStats.averageMagnitude}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ขนาดเฉลี่ย (Mag)</div>
        </div>
        <div className="text-center bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{earthquakeStats.last24Hours}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">24 ชม. ล่าสุด</div>
        </div>
      </div>

      {earthquakeStats.sourceBreakdown && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">ข้อมูลรวมจาก Open Feeds:</div>
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
        <div className="text-center bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-800/40">
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{stormStats.totalActiveStorms}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">พายุที่กำลังเคลื่อนตัว</div>
        </div>
        <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{stormStats.maxWindSpeedKmH}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ความเร็วลมสูงสุด (km/h)</div>
        </div>
        <div className="text-center bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-800/40">
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{stormStats.severeStormsCount}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ระดับไต้ฝุ่น/รุนแรง</div>
        </div>
        <div className="text-center bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stormStats.tropicalStormsCount}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">พายุโซนร้อน/ดีเปรสชัน</div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-2 text-[11px] text-slate-700 dark:text-slate-300">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">ระดับการเตือนภัย:</span>
          <div className="flex gap-1.5">
            <span className="text-red-600 dark:text-red-400 font-bold">แดง: {stormStats.alertBreakdown.red}</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">ส้ม: {stormStats.alertBreakdown.orange}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">เขียว: {stormStats.alertBreakdown.green}</span>
          </div>
        </div>
        {stormStats.mostSevereStorm && (
          <div className="text-[11px] text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 p-1.5 rounded">
            พายุรุนแรงสูงสุด: <span className="font-bold text-purple-700 dark:text-purple-300">{stormStats.mostSevereStorm}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderVolcanoStats = (volcanoStats: VolcanoStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200 dark:border-rose-800/40">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{volcanoStats.totalActiveVolcanoes}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ภูเขาไฟตรวจพบ</div>
        </div>
        <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{volcanoStats.eruptingCount}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">กำลังปะทุต่อเนื่อง</div>
        </div>
        <div className="text-center bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-800/40">
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{volcanoStats.warningCount}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">เฝ้าระวัง / ผิดปกติ</div>
        </div>
        <div className="text-center bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/40">
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{volcanoStats.regionalCount}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ภูมิภาคเอเชีย-แปซิฟิก</div>
        </div>
      </div>
      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium border-t border-slate-200 dark:border-slate-800 pt-2">
        แหล่งข้อมูล: NASA EONET & Smithsonian Global Volcanism
      </div>
    </div>
  );

  const renderRainSensorStats = (rainStats: StatisticsWithRainViewer) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{rainStats.total}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">เซ็นเซอร์ฝนทั้งหมด</div>
        </div>
        <div className="text-center bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{rainStats.activeRaining}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">กำลังตกฝน</div>
        </div>
        <div className="text-center bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-800/40">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{rainStats.averageHumidity}%</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ความชื้นเฉลี่ย</div>
        </div>
        <div className="text-center bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800/40">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{rainStats.maxHumidity}%</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ความชื้นสูงสุด</div>
        </div>
      </div>
      {rainStats.rainViewer && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 p-2 rounded text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">เรดาร์ฝน RainViewer Animation:</div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
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
        <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{(wildfireStats.totalHotspots || 0).toLocaleString()}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">จุดความร้อน VIIRS ทั้งหมด</div>
        </div>
        <div className="text-center bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800/40">
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{(wildfireStats.highConfidence || 0).toLocaleString()}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ความเชื่อมั่นสูง (80%+)</div>
        </div>
        <div className="text-center bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{(wildfireStats.thailand?.totalHotspots || 0).toLocaleString()}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ในประเทศไทย</div>
        </div>
        <div className="text-center bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-800/40">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{(wildfireStats.international?.totalHotspots || 0).toLocaleString()}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ประเทศเพื่อนบ้าน</div>
        </div>
      </div>
      
      {/* Risk Area & GISTDA Data Info */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-1 text-xs">
        <div className="flex justify-between text-slate-800 dark:text-slate-200 font-medium">
          <span>พื้นที่เสี่ยงรวมในไทย:</span>
          <span className="font-bold text-red-600 dark:text-red-400">{(wildfireStats.thailand?.totalRiskArea || 0).toLocaleString()} ไร่</span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
          <span>ความเชื่อมั่นเฉลี่ย:</span>
          <span className="font-bold text-orange-600 dark:text-orange-400">{wildfireStats.averageConfidence || 0}%</span>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span>แหล่งข้อมูล: GISTDA API 2.0</span>
          <span>VIIRS • Burn Scar • Burn Freq</span>
        </div>
      </div>
    </div>
  );

  const renderAirPollutionStats = (airStats: AirPollutionStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-teal-50 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-200 dark:border-teal-800/40">
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">{airStats.totalStations}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">สถานีตรวจวัดทั่วไทย</div>
        </div>
        <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{airStats.unhealthyStations}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">เกินเกณฑ์มาตรฐาน</div>
        </div>
        <div className="text-center bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-800/40">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{airStats.averagePM25}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">PM2.5 เฉลี่ย (µg/m³)</div>
        </div>
        <div className="text-center bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800/40">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{airStats.maxPM25}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">PM2.5 สูงสุด (µg/m³)</div>
        </div>
      </div>

      {airStats.aqiDistribution && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-2 text-[11px] space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200">การกระจายตัวของคุณภาพอากาศ:</div>
          <div className="grid grid-cols-3 gap-1 text-center font-medium">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 py-0.5 rounded">ดี: {airStats.aqiDistribution.good}</div>
            <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 py-0.5 rounded">ปานกลาง: {airStats.aqiDistribution.moderate}</div>
            <div className="bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/40 py-0.5 rounded">มีผลกระทบ: {airStats.aqiDistribution.unhealthy + airStats.aqiDistribution.veryUnhealthy}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDroughtStats = (droughtStats: DroughtStats) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-800/40">
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{droughtStats.nationalAverage.toFixed(1)}%</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ดัชนีความเสี่ยงเฉลี่ย</div>
        </div>
        <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{droughtStats.highRiskProvinces}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">จังหวัดเสี่ยงสูง</div>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">5 จังหวัดเสี่ยงสูงสุด (วิเคราะห์ความชื้นดิน):</div>
        <div className="space-y-1">
          {droughtStats.topProvinces.slice(0, 5).map((province, index) => (
            <div key={index} className="flex justify-between text-xs p-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{province.province}</span>
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
        <div className="text-center bg-cyan-50 dark:bg-cyan-950/30 p-2 rounded-lg border border-cyan-200 dark:border-cyan-800/40">
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">16</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">สถานีลุ่มน้ำหลัก (GloFAS)</div>
        </div>
        <div className="text-center bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{floodStats.currentFloods?.totalArea ? Math.round(floodStats.currentFloods.totalArea / 1000000) : 0}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ล้าน ตร.ม. (ดาวเทียม)</div>
        </div>
        <div className="text-center bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">30 วัน</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">พยากรณ์น้ำหลากล่วงหน้า</div>
        </div>
        <div className="text-center bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800/40">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{floodStats.waterObstructions?.totalHyacinthAreas || 0}</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">จุดสิ่งกีดขวางทางน้ำ</div>
        </div>
      </div>
    </div>
  );

  const renderOpenMeteoRainStats = (openMeteoStats: OpenMeteoRainStats) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/40">
        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{openMeteoStats.totalStations}</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">สถานีตรวจวัดสภาพอากาศ</div>
      </div>
      <div className="text-center bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{openMeteoStats.activeRainStations}</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">จุดที่กำลังมีฝนตก</div>
      </div>
      <div className="text-center bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-800/40">
        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{openMeteoStats.maxRainfall.toFixed(1)} mm</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ปริมาณฝนสูงสุด</div>
      </div>
      <div className="text-center bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg border border-orange-200 dark:border-orange-800/40">
        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{openMeteoStats.avgTemperature.toFixed(1)}°C</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">อุณหภูมิเฉลี่ย</div>
      </div>
    </div>
  );

  const renderSinkholeStats = (sinkholeStats: SinkholeStats) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center bg-stone-50 dark:bg-stone-900/40 p-2 rounded-lg border border-stone-200 dark:border-stone-800">
        <div className="text-2xl font-black text-stone-800 dark:text-stone-200">{sinkholeStats.totalIncidents}</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">เหตุการณ์ทั้งหมด</div>
      </div>
      <div className="text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-800/40">
        <div className="text-2xl font-black text-red-600 dark:text-red-400">{sinkholeStats.highSeverity}</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ระดับร้ายแรง</div>
      </div>
      <div className="text-center bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200 dark:border-purple-800/40">
        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{sinkholeStats.averageSize}</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">ขนาดเฉลี่ย</div>
      </div>
      <div className="text-center bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{sinkholeStats.affectedAreas}</div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">พื้นที่ได้รับผลกระทบ</div>
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
        return <p className="text-xs font-medium text-slate-600 dark:text-slate-400">ไม่รองรับการแสดงสถิติสำหรับประเภทนี้</p>;
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center justify-between text-slate-900 dark:text-slate-100">
          <span>{getTitle()}</span>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-mono font-bold">
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
