import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sun, Leaf, Droplets, Map, Info } from 'lucide-react';
import { DroughtMapProtocol } from '@/services/gistdaService';

interface DroughtFiltersProps {
  droughtLayers: string[];
  onDroughtLayersChange: (layers: string[]) => void;
  droughtMapMode?: DroughtMapProtocol;
  onDroughtMapModeChange?: (value: DroughtMapProtocol) => void;
}

export const DroughtFilters: React.FC<DroughtFiltersProps> = ({
  droughtLayers = ['dri'],
  onDroughtLayersChange,
  droughtMapMode = 'wmts',
  onDroughtMapModeChange
}) => {
  const handleDroughtLayerToggle = (layer: string, checked: boolean) => {
    if (checked) {
      onDroughtLayersChange([...droughtLayers, layer]);
    } else {
      onDroughtLayersChange(droughtLayers.filter(l => l !== layer));
    }
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Map Protocol Selector */}
      {onDroughtMapModeChange && (
        <div>
          <Label htmlFor="drought-map-protocol" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-amber-500" />
            <span>โหมดการเรนเดอร์แผนที่ (Maps API)</span>
          </Label>
          <Select value={droughtMapMode} onValueChange={(val) => onDroughtMapModeChange(val as DroughtMapProtocol)}>
            <SelectTrigger id="drought-map-protocol" className="w-full mt-1.5 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="เลือกรูปแบบแผนที่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wmts" className="text-xs">WMTS (Web Map Tile Service - แนะนำ)</SelectItem>
              <SelectItem value="tms" className="text-xs">TMS (Tile Map Service - Slippy Tiles)</SelectItem>
              <SelectItem value="wms" className="text-xs">WMS (Web Map Service - มาตรฐาน OGC)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 2. DRIPlus Layer (พื้นที่เสี่ยงภัยแล้ง) */}
      <div className="flex items-center justify-between p-2.5 bg-amber-50/60 dark:bg-slate-800/60 rounded-lg border border-amber-100 dark:border-slate-700">
        <div className="space-y-0.5">
          <Label htmlFor="drought-dri" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>พื้นที่เสี่ยงภัยแล้ง (DRIPlus) 7 วัน</span>
          </Label>
          <p className="text-[10px] text-slate-500">ดัชนีชี้วัดความเสี่ยงภัยแล้งเชิงบูรณาการจาก GISTDA</p>
        </div>
        <Switch
          id="drought-dri"
          checked={droughtLayers.includes('dri')}
          onCheckedChange={(checked) => handleDroughtLayerToggle('dri', checked)}
        />
      </div>

      {/* 3. NDWI Layer (ความชื้นพืชพรรณ) */}
      <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 dark:bg-slate-800/60 rounded-lg border border-emerald-100 dark:border-slate-700">
        <div className="space-y-0.5">
          <Label htmlFor="drought-ndwi" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>ความชื้นพืชพรรณ (NDWI) 7 วัน</span>
          </Label>
          <p className="text-[10px] text-slate-500">ดัชนีความแตกต่างของปริมาณน้ำในใบพืชและดิน</p>
        </div>
        <Switch
          id="drought-ndwi"
          checked={droughtLayers.includes('ndwi')}
          onCheckedChange={(checked) => handleDroughtLayerToggle('ndwi', checked)}
        />
      </div>

      {/* 4. SMAP Layer (ความชื้นในดิน) */}
      <div className="flex items-center justify-between p-2.5 bg-blue-50/60 dark:bg-slate-800/60 rounded-lg border border-blue-100 dark:border-slate-700">
        <div className="space-y-0.5">
          <Label htmlFor="drought-smap" className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>ความชื้นในดิน (SMAP) 7 วัน</span>
          </Label>
          <p className="text-[10px] text-slate-500">ปริมาณน้ำในดินชั้นบนและดินชั้นลึกจากดาวเทียม</p>
        </div>
        <Switch
          id="drought-smap"
          checked={droughtLayers.includes('smap')}
          onCheckedChange={(checked) => handleDroughtLayerToggle('smap', checked)}
        />
      </div>

      <div className="text-[11px] text-slate-500 p-2 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-700 flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <span>ข้อมูลภัยแล้งอัปเดตราย 7 วันล่าสุด เชื่อมต่อผ่าน GISTDA 2.0 Maps API พร้อมข้อมูลความชื้นดินลึกแบบ Real-time</span>
      </div>
    </div>
  );
};

export default DroughtFilters;
