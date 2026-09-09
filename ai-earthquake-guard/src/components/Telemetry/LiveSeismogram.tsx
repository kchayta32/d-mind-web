import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RefreshCw, Activity, Zap, Maximize2, ShieldAlert } from 'lucide-react';
import { WaveformSample, TriggerResult } from '../../types/seismic';

interface LiveSeismogramProps {
  stationCode?: string;
  stationName?: string;
  samplingRate?: number;
  initialGain?: number;
  isExternalTrigger?: boolean;
  pWaveArrived?: boolean;
  sWaveArrived?: boolean;
  pgaValue?: number;
  onTriggerDetected?: (result: TriggerResult) => void;
  className?: string;
}

export const LiveSeismogram: React.FC<LiveSeismogramProps> = ({
  stationCode = 'CHMO-01',
  stationName = 'สถานีเฝ้าระวังดอยสุเทพ เชียงใหม่ (Chiang Mai National Station)',
  samplingRate = 100,
  initialGain = 1.0,
  isExternalTrigger = false,
  pWaveArrived = false,
  sWaveArrived = false,
  pgaValue = 0,
  onTriggerDetected,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // User UI controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [gain, setGain] = useState<number>(initialGain);
  const [activeChannel, setActiveChannel] = useState<'all' | 'Z' | 'N' | 'E'>('all');
  const [staLtaThreshold, setStaLtaThreshold] = useState<number>(3.5);
  const [currentStaLta, setCurrentStaLta] = useState<number>(1.12);
  const [peakPga, setPeakPga] = useState<number>(0);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const [pPickIndex, setPPickIndex] = useState<number | null>(null);
  const [sPickIndex, setSPickIndex] = useState<number | null>(null);

  // Internal waveform buffer (rolling window of 800 samples)
  const bufferSize = 800;
  const samplesRef = useRef<WaveformSample[]>([]);
  const internalTriggerRef = useRef<{ isTriggered: boolean; pIdx: number | null; sIdx: number | null }>({
    isTriggered: false,
    pIdx: null,
    sIdx: null,
  });

  // Seismic physics simulation state for continuous synthesis
  const simPhaseRef = useRef<{
    timeSec: number;
    baselineZ: number;
    baselineN: number;
    baselineE: number;
    pWaveBurst: number;
    sWaveBurst: number;
    codaDecay: number;
  }>({
    timeSec: 0,
    baselineZ: 0,
    baselineN: 0,
    baselineE: 0,
    pWaveBurst: 0,
    sWaveBurst: 0,
    codaDecay: 0,
  });

  // Initialize buffer with realistic baseline microtremor
  useEffect(() => {
    const initialSamples: WaveformSample[] = [];
    for (let i = 0; i < bufferSize; i++) {
      initialSamples.push({
        time: i / samplingRate,
        z: (Math.random() - 0.5) * 0.015,
        n: (Math.random() - 0.5) * 0.012,
        e: (Math.random() - 0.5) * 0.012,
        filtered: 0,
        staLtaRatio: 1.0 + (Math.random() - 0.5) * 0.15,
        isTriggered: false,
      });
    }
    samplesRef.current = initialSamples;
  }, [samplingRate]);

  // Handle external trigger updates
  useEffect(() => {
    if (isExternalTrigger) {
      setIsTriggered(true);
      internalTriggerRef.current.isTriggered = true;
    } else {
      setIsTriggered(false);
      internalTriggerRef.current.isTriggered = false;
      setPPickIndex(null);
      setSPickIndex(null);
      internalTriggerRef.current.pIdx = null;
      internalTriggerRef.current.sIdx = null;
    }
  }, [isExternalTrigger]);

  useEffect(() => {
    if (pWaveArrived) {
      simPhaseRef.current.pWaveBurst = 1.0;
      const curIdx = samplesRef.current.length - 1;
      setPPickIndex(curIdx);
      internalTriggerRef.current.pIdx = curIdx;
    }
  }, [pWaveArrived]);

  useEffect(() => {
    if (sWaveArrived) {
      simPhaseRef.current.sWaveBurst = 2.4;
      const curIdx = samplesRef.current.length - 1;
      setSPickIndex(curIdx);
      internalTriggerRef.current.sIdx = curIdx;
    }
  }, [sWaveArrived]);

  // Manual burst trigger for demonstration
  const injectSyntheticBurst = useCallback(() => {
    simPhaseRef.current.pWaveBurst = 0.85;
    setTimeout(() => {
      simPhaseRef.current.sWaveBurst = 2.2;
    }, 2500); // S-wave follows 2.5s later
  }, []);

  // Reset waveform
  const handleReset = useCallback(() => {
    const initialSamples: WaveformSample[] = [];
    for (let i = 0; i < bufferSize; i++) {
      initialSamples.push({
        time: i / samplingRate,
        z: (Math.random() - 0.5) * 0.015,
        n: (Math.random() - 0.5) * 0.012,
        e: (Math.random() - 0.5) * 0.012,
        filtered: 0,
        staLtaRatio: 1.0 + (Math.random() - 0.5) * 0.1,
        isTriggered: false,
      });
    }
    samplesRef.current = initialSamples;
    setPeakPga(0);
    setIsTriggered(false);
    setPPickIndex(null);
    setSPickIndex(null);
    internalTriggerRef.current = { isTriggered: false, pIdx: null, sIdx: null };
    simPhaseRef.current = {
      timeSec: 0,
      baselineZ: 0,
      baselineN: 0,
      baselineE: 0,
      pWaveBurst: 0,
      sWaveBurst: 0,
      codaDecay: 0,
    };
  }, [samplingRate]);

  // Main 60fps render and synthesis loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI scaling
    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isRunning) {
        // Synthesize new samples (simulate at 100 Hz / ~2 samples per frame at 60fps)
        const samplesToGen = Math.max(1, Math.round(dt * samplingRate));
        const sim = simPhaseRef.current;

        for (let s = 0; s < samplesToGen; s++) {
          sim.timeSec += 1 / samplingRate;
          const t = sim.timeSec;

          // Background cultural microseismic noise (0.5 - 3.0 Hz ambient drift)
          const ambientZ = Math.sin(t * 3.2) * 0.008 + Math.cos(t * 7.8) * 0.004 + (Math.random() - 0.5) * 0.01;
          const ambientN = Math.cos(t * 2.8) * 0.007 + Math.sin(t * 6.5) * 0.005 + (Math.random() - 0.5) * 0.01;
          const ambientE = Math.sin(t * 2.5 + 1.2) * 0.007 + (Math.random() - 0.5) * 0.01;

          // P-Wave burst synthesis: sharp high frequency (8-14 Hz), predominantly Vertical (Z)
          let pValZ = 0, pValN = 0, pValE = 0;
          if (sim.pWaveBurst > 0.01) {
            pValZ = Math.sin(t * 65) * 0.28 * sim.pWaveBurst;
            pValN = Math.sin(t * 58 + 0.5) * 0.12 * sim.pWaveBurst;
            pValE = Math.cos(t * 62 + 0.2) * 0.12 * sim.pWaveBurst;
            sim.pWaveBurst *= 0.988; // Slow exponential decay
          }

          // S-Wave burst synthesis: massive amplitude, lower frequency shear wave (1.5 - 4 Hz), dominant horizontal (N, E)
          let sValZ = 0, sValN = 0, sValE = 0;
          if (sim.sWaveBurst > 0.01) {
            sValZ = Math.sin(t * 18) * 0.35 * sim.sWaveBurst;
            sValN = Math.sin(t * 14 + 1.1) * 0.85 * sim.sWaveBurst;
            sValE = Math.cos(t * 15 + 0.4) * 0.78 * sim.sWaveBurst;
            sim.sWaveBurst *= 0.992; // Coda decay
          }

          const rawZ = ambientZ + pValZ + sValZ;
          const rawN = ambientN + pValN + sValN;
          const rawE = ambientE + pValE + sValE;

          // Calculate running STA / LTA
          // Short-Term Average (STA: 0.8 sec ~ 80 samples)
          // Long-Term Average (LTA: 8.0 sec ~ 800 samples)
          const buffer = samplesRef.current;
          let staSum = 0;
          let ltaSum = 0;
          const len = buffer.length;
          const staWindow = Math.min(len, 60);
          for (let i = len - staWindow; i < len; i++) {
            staSum += Math.abs(buffer[i]?.z || 0);
          }
          for (let i = 0; i < len; i++) {
            ltaSum += Math.abs(buffer[i]?.z || 0);
          }
          const sta = (staSum / (staWindow || 1)) + Math.abs(rawZ) * 0.1;
          const lta = (ltaSum / (len || 1)) + 0.005; // Prevent div by zero
          const ratio = Math.max(0.5, Math.min(15, sta / lta));

          // Trigger condition
          let triggerFlag = ratio >= staLtaThreshold;
          if (triggerFlag && !internalTriggerRef.current.isTriggered) {
            internalTriggerRef.current.isTriggered = true;
            setIsTriggered(true);
            internalTriggerRef.current.pIdx = buffer.length;
            setPPickIndex(buffer.length);

            if (onTriggerDetected) {
              onTriggerDetected({
                triggered: true,
                pArrivalIndex: buffer.length,
                pArrivalTime: Date.now(),
                confidence: 0.984,
                snr: ratio * 2.8,
                estimatedMagnitude: 5.6,
                estimatedPga: Math.max(Math.abs(rawZ), Math.abs(rawN), Math.abs(rawE)) * 980,
                estimatedDistanceKm: 42,
              });
            }
          }

          // Shift pick indices when buffer slides
          if (internalTriggerRef.current.pIdx !== null) {
            internalTriggerRef.current.pIdx -= 1;
            if (internalTriggerRef.current.pIdx < 0) {
              internalTriggerRef.current.pIdx = null;
              setPPickIndex(null);
            }
          }
          if (internalTriggerRef.current.sIdx !== null) {
            internalTriggerRef.current.sIdx -= 1;
            if (internalTriggerRef.current.sIdx < 0) {
              internalTriggerRef.current.sIdx = null;
              setSPickIndex(null);
            }
          }

          // Push new sample and maintain fixed length
          buffer.shift();
          buffer.push({
            time: t,
            z: rawZ,
            n: rawN,
            e: rawE,
            filtered: rawZ,
            staLtaRatio: ratio,
            isTriggered: triggerFlag,
          });

          // Calculate current peak PGA in Gal (cm/s^2)
          const instantPga = Math.max(Math.abs(rawZ), Math.abs(rawN), Math.abs(rawE)) * 980; // 1g = 980 Gal
          if (instantPga > peakPga) {
            setPeakPga(Math.round(instantPga * 10) / 10);
          }
          setCurrentStaLta(Math.round(ratio * 100) / 100);
        }
      }

      // --- RENDERING CANVAS ---
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Background Grid & Radar styling
      ctx.fillStyle = '#0a0e17';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.lineWidth = 1;

      // Vertical time grid (every 80px)
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Calculate channel slot heights
      const numChannels = activeChannel === 'all' ? 3 : 1;
      const staPanelHeight = 44; // Bottom panel for STA/LTA indicator
      const traceAreaHeight = height - staPanelHeight - 20;
      const channelHeight = traceAreaHeight / numChannels;

      const channelsToRender = activeChannel === 'all'
        ? [
            { id: 'Z', label: 'CH-1 (Z: ดิ่ง)', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
            { id: 'N', label: 'CH-2 (N: เหนือ-ใต้)', color: '#818cf8', glow: 'rgba(129, 140, 248, 0.4)' },
            { id: 'E', label: 'CH-3 (E: ตะวันออก-ตก)', color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
          ]
        : [
            {
              id: activeChannel,
              label: `CH (${activeChannel})`,
              color: activeChannel === 'Z' ? '#06b6d4' : activeChannel === 'N' ? '#818cf8' : '#34d399',
              glow: 'rgba(6, 182, 212, 0.4)',
            },
          ];

      const buffer = samplesRef.current;
      const stepX = width / (bufferSize - 1);

      // Render each seismic channel
      channelsToRender.forEach((ch, chIdx) => {
        const centerY = chIdx * channelHeight + channelHeight / 2 + 10;

        // Baseline reference line
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Channel Label & Status
        ctx.fillStyle = ch.color;
        ctx.font = '600 11px "Fira Code", monospace';
        ctx.fillText(ch.label, 12, centerY - channelHeight * 0.38);

        // Amplitude limits (+/- indicator)
        ctx.fillStyle = '#64748b';
        ctx.font = '9px "Fira Code", monospace';
        ctx.fillText('+0.5g', width - 42, centerY - channelHeight * 0.35);
        ctx.fillText('-0.5g', width - 42, centerY + channelHeight * 0.35);

        // Draw Waveform Trace
        ctx.save();
        ctx.shadowColor = ch.glow;
        ctx.shadowBlur = isTriggered ? 8 : 2;
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();

        for (let i = 0; i < buffer.length; i++) {
          const sample = buffer[i];
          const x = i * stepX;
          const val = ch.id === 'Z' ? sample.z : ch.id === 'N' ? sample.n : sample.e;
          // Scale to pixels with gain factor
          const y = centerY - val * (channelHeight * 0.42) * gain;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // 2. Render P-Wave Pick Marker (Cyan)
      const pIdx = internalTriggerRef.current.pIdx ?? pPickIndex;
      if (pIdx !== null && pIdx >= 0 && pIdx < buffer.length) {
        const px = pIdx * stepX;
        ctx.save();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, traceAreaHeight);
        ctx.stroke();

        // Label Badge
        ctx.setLineDash([]);
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(px - 36, 12, 72, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('P-ARRIVAL', px, 24);
        ctx.restore();
      }

      // 3. Render S-Wave Pick Marker (Crimson)
      const sIdx = internalTriggerRef.current.sIdx ?? sPickIndex;
      if (sIdx !== null && sIdx >= 0 && sIdx < buffer.length) {
        const sx = sIdx * stepX;
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, traceAreaHeight);
        ctx.stroke();

        // Label Badge
        ctx.setLineDash([]);
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(sx - 42, 34, 84, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('S-DESTRUCT', sx, 46);
        ctx.restore();
      }

      // 4. STA/LTA Ratio Bottom Indicator & Dynamic Threshold
      const staY = height - staPanelHeight;
      // Background strip
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, staY, width, staPanelHeight);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(0, staY, width, staPanelHeight);

      // Draw STA/LTA curve across time
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < buffer.length; i++) {
        const x = i * stepX;
        const ratioVal = buffer[i].staLtaRatio;
        // Map ratio [0 to 10] to staPanelHeight
        const mappedY = (staY + staPanelHeight - 4) - (ratioVal / 8) * (staPanelHeight - 12);
        if (i === 0) ctx.moveTo(x, mappedY);
        else ctx.lineTo(x, mappedY);
      }
      ctx.stroke();

      // Draw Threshold Line (Red Dotted)
      const threshY = (staY + staPanelHeight - 4) - (staLtaThreshold / 8) * (staPanelHeight - 12);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, threshY);
      ctx.lineTo(width, threshY);
      ctx.stroke();
      ctx.setLineDash([]);

      // STA/LTA labels
      ctx.font = '600 10px "Fira Code", monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'left';
      ctx.fillText(`STA/LTA RATIO: ${currentStaLta.toFixed(2)}`, 14, staY + 16);

      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'right';
      ctx.fillText(`TRIG THRESHOLD: ${staLtaThreshold.toFixed(1)}`, width - 14, staY + 16);

      // Loop animation
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [isRunning, gain, activeChannel, staLtaThreshold, currentStaLta, peakPga, isTriggered, pPickIndex, sPickIndex, samplingRate, onTriggerDetected]);

  return (
    <div className={`bg-seismic-card border border-seismic-border rounded-xl p-4 flex flex-col shadow-2xl overflow-hidden ${className}`}>
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-seismic-border/70 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isTriggered ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-cyan-500/10 text-cyan-400'}`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-100 tracking-wider">
                {stationCode}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {samplingRate} SPS / 24-bit ADC
              </span>
              {isTriggered && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold animate-pulse flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> P-TRIGGER DETECTED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px] sm:max-w-md">
              {stationName}
            </p>
          </div>
        </div>

        {/* Live Metrics Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">CURRENT PGA</span>
            <span className={`font-bold text-sm ${pgaValue > 10 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {(pgaValue || peakPga).toFixed(1)} <span className="text-[10px] font-normal text-slate-400">Gal</span>
            </span>
          </div>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">STA/LTA RATIO</span>
            <span className={`font-bold text-sm ${currentStaLta >= staLtaThreshold ? 'text-amber-400' : 'text-emerald-400'}`}>
              {currentStaLta.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Seismogram Canvas Container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] bg-[#0a0e17] rounded-lg border border-slate-800/80 overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Channel Indicator Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[11px] font-mono text-slate-300">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>REAL-TIME 3-AXIS VELOCITY SENSOR</span>
        </div>
      </div>

      {/* Bottom Control Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-seismic-border/70 text-xs font-mono">
        {/* Channel Filters */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveChannel('all')}
            className={`px-2.5 py-1 rounded transition-colors ${activeChannel === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            3-AXIS (ALL)
          </button>
          <button
            onClick={() => setActiveChannel('Z')}
            className={`px-2.5 py-1 rounded transition-colors ${activeChannel === 'Z' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Z (ดิ่ง)
          </button>
          <button
            onClick={() => setActiveChannel('N')}
            className={`px-2.5 py-1 rounded transition-colors ${activeChannel === 'N' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            N (เหนือ-ใต้)
          </button>
          <button
            onClick={() => setActiveChannel('E')}
            className={`px-2.5 py-1 rounded transition-colors ${activeChannel === 'E' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            E (ออก-ตก)
          </button>
        </div>

        {/* Gain / Sensitivity Multiplier */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">GAIN:</span>
          {[0.5, 1.0, 2.0, 4.0].map((g) => (
            <button
              key={g}
              onClick={() => setGain(g)}
              className={`px-2 py-1 rounded text-[11px] border ${gain === g ? 'bg-slate-700 border-cyan-500 text-cyan-300 font-bold' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              {g}x
            </button>
          ))}
        </div>

        {/* Play / Pause & Synthetic Injection */}
        <div className="flex items-center gap-2">
          <button
            onClick={injectSyntheticBurst}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all active:scale-95"
            title="จำลองคลื่นไหวสะเทือนฉับพลัน (Simulate Impulse)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>ฉีดคลื่นทดสอบ</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${isRunning ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-emerald-600 text-white border-emerald-500 font-bold'}`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'หยุดชั่วคราว' : 'อ่านสด'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="รีเซ็ตเส้นกราฟ"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSeismogram;
