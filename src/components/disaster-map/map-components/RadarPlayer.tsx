import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RainViewerData } from '../useRainViewerData';
import { Play, Pause, SkipBack, SkipForward, CloudRain, Satellite, Eye, EyeOff, FastForward } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RadarPlayerProps {
  rainData: RainViewerData | null;
  showOverlay: boolean;
  onToggleOverlay: (show: boolean) => void;
  overlayType: 'radar' | 'satellite';
  onOverlayTypeChange: (type: 'radar' | 'satellite') => void;
  timeType: 'past' | 'future';
  onTimeTypeChange: (type: 'past' | 'future') => void;
  currentFrameIndex: number;
  onFrameIndexChange: (index: number) => void;
}

export const RadarPlayer: React.FC<RadarPlayerProps> = ({
  rainData,
  showOverlay,
  onToggleOverlay,
  overlayType,
  onOverlayTypeChange,
  timeType,
  onTimeTypeChange,
  currentFrameIndex,
  onFrameIndexChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per frame
  const timerRef = useRef<any>(null);

  const frames = overlayType === 'satellite'
    ? (rainData?.satellite?.infrared || [])
    : timeType === 'past'
      ? (rainData?.radar?.past || [])
      : (rainData?.radar?.nowcast || []);

  const totalFrames = frames.length;

  useEffect(() => {
    if (isPlaying && totalFrames > 0) {
      timerRef.current = setInterval(() => {
        onFrameIndexChange((prev) => (prev + 1 >= totalFrames ? 0 : prev + 1));
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalFrames, playbackSpeed, onFrameIndexChange]);

  if (!rainData) return null;

  const currentFrame = frames[currentFrameIndex] || frames[frames.length - 1];
  const frameTime = currentFrame ? new Date(currentFrame.time * 1000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  const toggleSpeed = () => {
    setPlaybackSpeed(prev => (prev === 1000 ? 500 : prev === 500 ? 1500 : 1000));
  };

  return (
    <div className="bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-lg p-3 w-72 sm:w-80 space-y-2.5 text-xs text-gray-800">
      {/* Header with Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-gray-900">
          <CloudRain className="w-4 h-4 text-blue-600" />
          <span>เรดาร์ฝน RainViewer</span>
        </div>
        <Button
          variant={showOverlay ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleOverlay(!showOverlay)}
          className={`h-7 px-2.5 text-[11px] gap-1 ${showOverlay ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {showOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {showOverlay ? 'แสดงเรดาร์' : 'ซ่อนเรดาร์'}
        </Button>
      </div>

      {showOverlay && (
        <>
          {/* Layer Mode Switcher: Radar vs Satellite */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => { onOverlayTypeChange('radar'); onFrameIndexChange(0); }}
              className={`flex-1 py-1 px-2 rounded text-center font-medium transition ${
                overlayType === 'radar' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              เรดาร์ตรวจฝน
            </button>
            <button
              onClick={() => { onOverlayTypeChange('satellite'); onFrameIndexChange(0); }}
              className={`flex-1 py-1 px-2 rounded text-center font-medium transition ${
                overlayType === 'satellite' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ดาวเทียมเมฆ (IR)
            </button>
          </div>

          {overlayType === 'radar' && (
            <div className="flex items-center justify-between text-[11px] text-gray-600">
              <span>ช่วงเวลา:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => { onTimeTypeChange('past'); onFrameIndexChange(0); }}
                  className={`px-2 py-0.5 rounded ${timeType === 'past' ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100'}`}
                >
                  ย้อนหลัง ({rainData.radar?.past?.length || 0})
                </button>
                <button
                  onClick={() => { onTimeTypeChange('future'); onFrameIndexChange(0); }}
                  className={`px-2 py-0.5 rounded ${timeType === 'future' ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100'}`}
                >
                  พยากรณ์ล่วงหน้า ({rainData.radar?.nowcast?.length || 0})
                </button>
              </div>
            </div>
          )}

          {/* Time Scrubber & Frame Info */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500">เฟรมที่ {currentFrameIndex + 1}/{totalFrames || 1}</span>
              <Badge variant="outline" className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border-blue-200">
                {frameTime} น.
              </Badge>
            </div>
            <Slider
              value={[currentFrameIndex]}
              max={Math.max(0, totalFrames - 1)}
              step={1}
              onValueChange={(val) => onFrameIndexChange(val[0])}
              className="py-1 cursor-pointer"
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFrameIndexChange(Math.max(0, currentFrameIndex - 1))}
                className="h-7 w-7 p-0"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={isPlaying ? 'destructive' : 'default'}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`h-7 px-3 text-xs gap-1 ${!isPlaying ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'หยุด' : 'เล่น'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFrameIndexChange(Math.min(totalFrames - 1, currentFrameIndex + 1))}
                className="h-7 w-7 p-0"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSpeed}
              className="h-7 px-2 text-[11px] text-gray-600 gap-1"
            >
              <FastForward className="w-3 h-3" />
              {playbackSpeed === 500 ? '2x' : playbackSpeed === 1500 ? '0.5x' : '1x'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
