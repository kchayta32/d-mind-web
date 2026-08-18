import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, RefreshCw, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Server, ShieldCheck } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ApiStatusBadgeProps {
  onRefreshAll?: () => void;
  isLoading?: boolean;
}

interface ApiEndpointInfo {
  name: string;
  provider: string;
  category: string;
  status: 'online' | 'warning';
  cost: 'ฟรี 100% (Open API)';
  description: string;
}

const openApis: ApiEndpointInfo[] = [
  {
    name: 'USGS Earthquake API',
    provider: 'U.S. Geological Survey',
    category: 'แผ่นดินไหว',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'ข้อมูลแผ่นดินไหวแบบเรียลไทม์ทั่วโลก พร้อมประเมินความลึกและสึนามิ'
  },
  {
    name: 'NASA EONET v3',
    provider: 'NASA Earth Observatory',
    category: 'พายุ / ไฟป่า / ภูเขาไฟ',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'ติดตามเหตุการณ์ภัยธรรมชาติที่กำลังดำเนินอยู่จากดาวเทียม NASA'
  },
  {
    name: 'Open-Meteo Air Quality',
    provider: 'Open-Meteo / CAMS',
    category: 'มลพิษอากาศ / PM2.5',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'PM2.5, PM10, AQI, UV, ก๊าซโอโซน และก๊าซพิษ 35+ สถานีทั่วประเทศ'
  },
  {
    name: 'Open-Meteo GloFAS River Flood',
    provider: 'Open-Meteo / Copernicus GloFAS',
    category: 'น้ำท่วม & ลุ่มน้ำ',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'อัตราการไหลของน้ำในแม่น้ำสายสำคัญ พยากรณ์ล่วงหน้า 30 วัน'
  },
  {
    name: 'Open-Meteo Weather API',
    provider: 'Open-Meteo / ECMWF / DWD',
    category: 'สภาพอากาศ & ปริมาณฝน',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'ฝนตกหนัก, อุณหภูมิ, แรงลม, พยากรณ์รายชั่วโมงทั่วไทย'
  },
  {
    name: 'RainViewer Radar Tile API',
    provider: 'RainViewer Global Radar',
    category: 'เรดาร์ฝน & เมฆดาวเทียม',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'ภาพเรดาร์ตรวจฝนจริงและภาพถ่ายดาวเทียมอินฟราเรด Animation'
  },
  {
    name: 'GDACS Disaster Alerts',
    provider: 'UN / European Commission',
    category: 'พายุหมุน & ภัยพิบัติสากล',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'ระบบแจ้งเตือนและประสานงานภัยพิบัติระดับโลก (Tropical Cyclones, Floods, Droughts)'
  },
  {
    name: 'EMSC Seismic Portal',
    provider: 'European-Med Seismological Centre',
    category: 'แผ่นดินไหวฉุกเฉิน',
    status: 'online',
    cost: 'ฟรี 100% (Open API)',
    description: 'ศูนย์ตรวจจับคลื่นไหวสะเทือนและรายงานความรู้สึกสั่นสะเทือนแบบ Real-time'
  }
];

export const ApiStatusBadge: React.FC<ApiStatusBadgeProps> = ({ onRefreshAll, isLoading }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/95 backdrop-blur shadow-md hover:bg-white text-gray-800 border-gray-200 h-9 px-3 gap-1.5 font-medium text-xs rounded-md"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="hidden sm:inline">แหล่งข้อมูล API:</span>
          <span className="font-semibold text-emerald-700">{openApis.length} แหล่งฟรีเปิดใช้</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 sm:w-96 bg-white shadow-2xl rounded-xl p-3 text-gray-800 border border-gray-200">
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-sm text-gray-900">สถานะการเชื่อมต่อ Open APIs</h4>
          </div>
          {onRefreshAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshAll}
              disabled={isLoading}
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-800 gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              รีเฟรชข้อมูล
            </Button>
          )}
        </div>

        <p className="text-[11px] text-gray-500 mb-2">
          ระบบดึงข้อมูล Real-time จาก API สาธารณะระดับโลกที่เปิดให้บริการฟรีโดยตรง
        </p>

        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {openApis.map((api, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100/80 transition text-xs border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{api.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-mono">
                  Online
                </Badge>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">{api.description}</div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                <span>{api.provider}</span>
                <span className="text-blue-600 font-medium">{api.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 pt-2 border-t flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> ไม่ต้องใช้ API Key แบบเสียเงิน
          </span>
          <span className="text-gray-400">อัปเดตอัตโนมัติ</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};
