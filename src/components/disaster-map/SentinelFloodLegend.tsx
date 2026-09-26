import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Satellite, ChevronDown, ChevronUp, GripVertical, RotateCcw } from 'lucide-react';

interface SentinelFloodLegendProps {
  isRadarActive?: boolean;
}

export const SentinelFloodLegend: React.FC<SentinelFloodLegendProps> = ({ isRadarActive = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [customPos, setCustomPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const dragDataRef = useRef<{
    startX: number;
    startY: number;
    initLeft: number;
    initTop: number;
  } | null>(null);

  // Handle pointer down on the drag handle
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    e.stopPropagation();

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const currentLeft = customPos ? customPos.x : rect.left;
    const currentTop = customPos ? customPos.y : rect.top;

    dragDataRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initLeft: currentLeft,
      initTop: currentTop,
    };

    setIsDragging(true);
    setCustomPos({ x: currentLeft, y: currentTop });

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is not supported
    }
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragDataRef.current || !cardRef.current) return;
    e.preventDefault();

    const dx = e.clientX - dragDataRef.current.startX;
    const dy = e.clientY - dragDataRef.current.startY;

    const cardRect = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRect.width || 250;
    const cardHeight = cardRect.height || 160;

    const padding = 12;
    const minX = padding;
    const maxX = Math.max(padding, window.innerWidth - cardWidth - padding);
    const minY = padding;
    const maxY = Math.max(padding, window.innerHeight - cardHeight - padding);

    const targetX = dragDataRef.current.initLeft + dx;
    const targetY = dragDataRef.current.initTop + dy;

    const clampedX = Math.max(minX, Math.min(maxX, targetX));
    const clampedY = Math.max(minY, Math.min(maxY, targetY));

    setCustomPos({ x: clampedX, y: clampedY });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragDataRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove, { passive: false });
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Keep within screen bounds on window resize
  useEffect(() => {
    const handleWindowResize = () => {
      if (!customPos || !cardRef.current) return;
      const cardRect = cardRef.current.getBoundingClientRect();
      const cardWidth = cardRect.width || 250;
      const cardHeight = cardRect.height || 160;

      const padding = 12;
      const maxX = Math.max(padding, window.innerWidth - cardWidth - padding);
      const maxY = Math.max(padding, window.innerHeight - cardHeight - padding);

      if (customPos.x > maxX || customPos.y > maxY) {
        setCustomPos({
          x: Math.min(customPos.x, maxX),
          y: Math.min(customPos.y, maxY),
        });
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [customPos]);

  // Style positioning:
  // When customPos is set, use fixed positioning.
  // Otherwise, use absolute positioning with bottom-[275px] when radar is active to clear the RainViewer player!
  const containerStyle: React.CSSProperties = customPos
    ? {
        position: 'fixed',
        left: `${customPos.x}px`,
        top: `${customPos.y}px`,
        zIndex: 1000,
        touchAction: 'none',
      }
    : {};

  const defaultClasses = `absolute z-[1000] left-4 transition-all duration-300 ${
    isRadarActive ? 'bottom-[275px]' : 'bottom-6'
  }`;

  return (
    <div
      ref={cardRef}
      style={containerStyle}
      className={`${customPos ? '' : defaultClasses} bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl p-2.5 text-xs text-slate-700 dark:text-slate-200 w-[250px] transition-shadow ${
        isDragging ? 'shadow-2xl ring-2 ring-sky-500/60 cursor-grabbing select-none' : ''
      }`}
    >
      {/* Header with Grip Button, Title, and Collapse Icon */}
      <div className="flex items-center justify-between gap-1 select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Drag Handle ::: Button */}
          <div
            role="button"
            tabIndex={0}
            aria-label="คลิกค้างเพื่อย้ายการ์ด"
            title="คลิกค้างเพื่อย้ายการ์ด (Drag to move)"
            onPointerDown={handlePointerDown}
            className={`flex items-center justify-center px-1.5 py-0.5 rounded cursor-grab active:cursor-grabbing transition-colors select-none ${
              isDragging
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GripVertical className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] font-black tracking-tighter select-none">:::</span>
          </div>

          {/* Title & Satellite Icon (Clickable to toggle open/close) */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 cursor-pointer font-bold text-sky-800 dark:text-sky-300 truncate"
            title="คลิกเพื่อย่อ/ขยาย"
          >
            <Satellite className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
            <span className="text-[11px] truncate">สัญลักษณ์ดาวเทียม Sentinel</span>
          </div>
        </div>

        {/* Right actions: Reset position (if moved) + Chevron collapse toggle */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {customPos && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCustomPos(null);
              }}
              title="รีเซ็ตตำแหน่งกลับที่เดิม"
              className="p-1 rounded text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title={isOpen ? 'ย่อการ์ด' : 'ขยายการ์ด'}
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Legend Items Content */}
      {isOpen && (
        <div className="mt-2 space-y-1.5 text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-800 leading-tight">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-sky-500/70 border border-sky-600 flex-shrink-0" />
            <span>พื้นที่น้ำท่วมสด (Sentinel-1 SAR / GISTDA)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/60 border border-amber-600 flex-shrink-0" />
            <span>พื้นที่น้ำท่วมซ้ำซาก (สถิติดาวเทียมย้อนหลัง)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex-shrink-0" />
            <span>จุดยืนยันน้ำท่วมจริงโดยประชาชน (Ground Truth)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white flex-shrink-0" />
            <span>สถานีแม่น้ำตรวจวัดอัตราไหล (GloFAS)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentinelFloodLegend;
