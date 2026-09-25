import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Waves, 
  Droplets, 
  Flame, 
  Wind, 
  Mountain, 
  AlertTriangle,
  ChevronDown, 
  X,
  Filter,
  Radio
} from 'lucide-react';
import { DisasterType, DisasterFilterOption } from '../../types/disaster';
import { DISASTER_FILTER_OPTIONS } from '../../services/naturalDisastersData';

const DISASTER_ICONS: Record<DisasterType, React.ComponentType<{ className?: string }>> = {
  earthquake: Activity,
  tsunami: Waves,
  flood: Droplets,
  landslide: Mountain,
  storm: Wind,
  wildfire: Flame,
  volcano: AlertTriangle,
};

export interface DisasterFilterSubmenuProps {
  selectedDisaster: DisasterType;
  onSelectDisaster: (disaster: DisasterType) => void;
  className?: string;
  earthquakeCount?: number;
}

export const DisasterFilterSubmenu: React.FC<DisasterFilterSubmenuProps> = ({
  selectedDisaster,
  onSelectDisaster,
  className = '',
  earthquakeCount = 14,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getDisasterIcon = (type: DisasterType, classNameStr = 'w-4 h-4') => {
    const Icon = DISASTER_ICONS[type] || Activity;
    return <Icon className={classNameStr} />;
  };

  const currentOption = DISASTER_FILTER_OPTIONS.find((opt) => opt.id === selectedDisaster) 
    || DISASTER_FILTER_OPTIONS[0];

  const handleSelect = (disasterId: DisasterType) => {
    // Single-select restriction: cannot select multiple at once
    onSelectDisaster(disasterId);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shadow-lg active:scale-95 border cursor-pointer select-none ${
          selectedDisaster === 'earthquake'
            ? 'bg-slate-900/90 text-cyan-300 border-cyan-500/50 hover:bg-slate-800'
            : 'bg-slate-900/95 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
        }`}
        title="เมนูย่อยเลือกประเภทภัยธรรมชาติ (Single Select)"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <span 
            className="p-1 rounded-md text-white shadow-sm flex items-center justify-center"
            style={{ backgroundColor: currentOption.color }}
          >
            {getDisasterIcon(selectedDisaster, 'w-3.5 h-3.5')}
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-400 font-sans leading-none">
              ตัวกรองภัยธรรมชาติ
            </span>
            <span className="font-bold text-xs truncate max-w-[120px] sm:max-w-[160px]">
              {currentOption.label}
            </span>
          </div>
        </div>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`} 
        />
      </button>

      {/* Submenu Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0b101c]/95 backdrop-blur-xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[2500] p-3 text-slate-100 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 font-mono tracking-wide">
                  ตัวกรองประเภทภัยธรรมชาติ
                </h4>
                <p className="text-[10px] text-cyan-400/90 font-sans">
                  เลือกดูได้ทีละ 1 ประเภท (Single Selection)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="ปิดเมนู (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Disaster Options List (Mutually Exclusive Radio Group) */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {DISASTER_FILTER_OPTIONS.map((option) => {
              const isSelected = selectedDisaster === option.id;
              const displayCount = option.id === 'earthquake' ? earthquakeCount : option.count;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  role="menuitemradio"
                  aria-checked={isSelected}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2.5 cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Radio Button Indicator */}
                    <div className="pt-0.5">
                      <div 
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_8px_#06b6d4]' 
                            : 'border-slate-600 bg-slate-950 group-hover:border-slate-500'
                        }`}
                      >
                        {isSelected && (
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: option.color }} 
                          />
                        )}
                      </div>
                    </div>

                    {/* Icon & Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span 
                          className="p-1 rounded-md text-white shrink-0"
                          style={{ backgroundColor: option.color }}
                        >
                          {getDisasterIcon(option.id, 'w-3 h-3')}
                        </span>
                        <span className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {option.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({option.labelEn})
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-snug mt-1 line-clamp-2">
                        {option.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono">
                        <span className="text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                          {option.sourceAgency}
                        </span>
                        <span className="text-cyan-400 font-semibold">
                          {displayCount} จุดเฝ้าระวัง
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side status indicator */}
                  {isSelected && (
                    <div className="shrink-0 pt-0.5">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        ACTIVE
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Submenu Footer Hint */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-sans">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>เลเยอร์และแผงรายงานจะสลับตามภัยที่เลือก</span>
            </span>
            <span className="font-mono text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
              SINGLE-SELECT
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterFilterSubmenu;
