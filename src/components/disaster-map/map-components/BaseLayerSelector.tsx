import React, { useState } from 'react';
import { BaseMapLayerType } from '../types';
import { Button } from '@/components/ui/button';
import { Layers, Map, Moon, Sun, Mountain, Satellite } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BaseLayerSelectorProps {
  currentLayer: BaseMapLayerType;
  onLayerChange: (layer: BaseMapLayerType) => void;
}

const baseLayers: Array<{
  id: BaseMapLayerType;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'osm',
    label: 'OpenStreetMap',
    sublabel: 'แผนที่ถนนมาตรฐาน',
    icon: <Map className="w-4 h-4 text-blue-500" />
  },
  {
    id: 'satellite',
    label: 'ESRI World Imagery',
    sublabel: 'ภาพถ่ายดาวเทียมความละเอียดสูง',
    icon: <Satellite className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'dark',
    label: 'CartoDB Dark Matter',
    sublabel: 'แผนที่โทนมืด (กลางคืน)',
    icon: <Moon className="w-4 h-4 text-indigo-400" />
  },
  {
    id: 'light',
    label: 'CartoDB Positron',
    sublabel: 'แผนที่โทนสว่าง คลีน',
    icon: <Sun className="w-4 h-4 text-amber-500" />
  },
  {
    id: 'topo',
    label: 'OpenTopoMap',
    sublabel: 'แผนที่ภูมิประเทศและเส้นชั้นความสูง',
    icon: <Mountain className="w-4 h-4 text-orange-500" />
  }
];

export const BaseLayerSelector: React.FC<BaseLayerSelectorProps> = ({
  currentLayer,
  onLayerChange
}) => {
  const current = baseLayers.find(l => l.id === currentLayer) || baseLayers[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/95 backdrop-blur shadow-md hover:bg-white text-gray-800 border-gray-200 h-9 px-3 gap-1.5 font-medium text-xs rounded-md"
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">ชั้นแผนที่:</span>
          <span className="font-semibold text-blue-700">{current.label.split(' ')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl rounded-lg p-1">
        <DropdownMenuLabel className="text-xs text-gray-500 font-semibold px-2 py-1.5">
          เลือกชั้นแผนที่ฐาน (Base Map)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {baseLayers.map(layer => (
          <DropdownMenuItem
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer ${
              currentLayer === layer.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'
            }`}
          >
            <div className="mt-0.5">{layer.icon}</div>
            <div className="flex-1">
              <div className="text-xs font-semibold">{layer.label}</div>
              <div className="text-[11px] text-gray-500">{layer.sublabel}</div>
            </div>
            {currentLayer === layer.id && (
              <div className="w-2 h-2 rounded-full bg-blue-600 self-center"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
