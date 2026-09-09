import React from 'react';
import { 
  Map as MapIcon, 
  Activity, 
  Zap, 
  LifeBuoy, 
  Award,
  Layers
} from 'lucide-react';

import { DisasterType } from '../types/disaster';
import { getDisasterLabel } from '../services/naturalDisastersData';

export type ActiveTab = 'map' | 'telemetry' | 'simulator' | 'evacuation' | 'nrct';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isTriggered?: boolean;
  selectedDisaster?: DisasterType;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  isTriggered = false,
  selectedDisaster = 'earthquake'
}) => {
  const isNonEarthquake = selectedDisaster !== 'earthquake';

  const navItems = [
    {
      id: 'map' as ActiveTab,
      label: isNonEarthquake ? `แผนที่ (${getDisasterLabel(selectedDisaster)})` : 'แผนที่วิกฤต GIS',
      sublabel: 'Tactical Map',
      icon: MapIcon,
      badge: isTriggered ? 'ALERT' : isNonEarthquake ? getDisasterLabel(selectedDisaster) : undefined,
    },
    {
      id: 'telemetry' as ActiveTab,
      label: 'คลื่นไหวสะเทือน 3 แกน',
      sublabel: 'Live Seismogram',
      icon: Activity,
      badge: undefined,
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'จำลองการเกิดแผ่นดินไหว',
      sublabel: 'NRCT Drill Simulator',
      icon: Zap,
      badge: 'TEST BENCH',
    },
    {
      id: 'evacuation' as ActiveTab,
      label: 'จุดปลอดภัย & แผนเผชิญเหตุ',
      sublabel: 'Evacuation & Shelters',
      icon: LifeBuoy,
      badge: undefined,
    },
    {
      id: 'nrct' as ActiveTab,
      label: 'บทคัดย่อนวัตกรรม วช.',
      sublabel: 'Innovation Showcase',
      icon: Award,
      badge: 'AWARD',
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation (Top sub-bar) */}
      <nav className="hidden md:block bg-slate-900/90 border-b border-slate-800 px-4 py-2 sticky top-[57px] z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                      item.badge === 'ALERT'
                        ? 'bg-rose-500/30 text-rose-300 animate-pulse'
                        : item.badge === 'AWARD'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden xl:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI CORE ENGINE ONLINE (320ms LATENCY)</span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Thumb ergonomic) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0e17]/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1 shadow-2xl safe-area-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg relative min-w-[58px] transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label={item.label}
              >
                <div className={`relative p-1 rounded-lg ${isActive ? 'bg-cyan-500/15' : ''}`}>
                  <Icon className="w-5 h-5" />
                  {item.badge === 'ALERT' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight font-medium mt-0.5 truncate max-w-[64px]">
                  {item.id === 'map' ? 'แผนที่' : 
                   item.id === 'telemetry' ? 'คลื่น ZNE' : 
                   item.id === 'simulator' ? 'จำลอง' : 
                   item.id === 'evacuation' ? 'อพยพ' : 'วช. นวัตกรรม'}
                </span>
                {isActive && (
                  <span className="absolute bottom-0.5 w-6 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
