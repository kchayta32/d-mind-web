import React, { useState } from 'react';
import { Wind, ChevronDown, ChevronUp } from 'lucide-react';

export const AqiScaleLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const aqiBands = [
    { label: 'วิกฤต', range: '301+', color: 'bg-purple-700', text: 'text-purple-300' },
    { label: 'อันตราย', range: '201-300', color: 'bg-red-600', text: 'text-red-300' },
    { label: 'มีผลต่อสุขภาพ', range: '151-200', color: 'bg-orange-500', text: 'text-orange-300' },
    { label: 'เริ่มมีผล', range: '101-150', color: 'bg-amber-400', text: 'text-amber-300' },
    { label: 'ปานกลาง', range: '51-100', color: 'bg-yellow-400', text: 'text-yellow-300' },
    { label: 'ดีมาก', range: '0-50', color: 'bg-emerald-500', text: 'text-emerald-300' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white rounded-xl shadow-2xl p-2.5 transition-all w-36 sm:w-40 z-[1000]">
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Wind className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>ดัชนี AQI</span>
        </div>
        <button className="text-slate-400 hover:text-white transition">
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Gradient Bar preview always visible */}
      <div className="mt-2 flex h-2 rounded-full overflow-hidden shadow-inner">
        <div className="flex-1 bg-emerald-500" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-amber-400" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-purple-700" />
      </div>

      <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 px-0.5">
        <span>0 ดี</span>
        <span>100</span>
        <span>300+ วิกฤต</span>
      </div>

      {/* Expanded list view */}
      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-700/80 space-y-1.5 text-[10px] animate-in fade-in slide-in-from-top-1">
          {aqiBands.map((band, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${band.color} shadow-xs`} />
                <span className="font-medium text-slate-200">{band.label}</span>
              </div>
              <span className={`font-mono text-[9px] ${band.text}`}>{band.range}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
