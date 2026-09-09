import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Zap, 
  Sliders, 
  Compass, 
  Layers, 
  Activity, 
  Award, 
  Info, 
  CheckCircle,
  AlertOctagon,
  Flame,
  Clock
} from 'lucide-react';
import { SimulationScenario } from '../../types/seismic';
import { audioAlertSystem } from '../../services/audioAlertSystem';

export interface EarthquakeSimulatorProps {
  onStartSimulation?: (scenario: SimulationScenario, leadTimeSec: number, expectedPga: number, mmiString: string) => void;
  onInjectPWave?: () => void;
  onInjectSWave?: () => void;
  onReset?: () => void;
  className?: string;
}

interface FaultPreset {
  id: string;
  name: string;
  thaiName: string;
  locationName: string;
  magnitude: number;
  depthKm: number;
  distanceKm: number;
  soilAmplification: number; // 1.0 (rock) to 3.5 (Bangkok soft clay)
  description: string;
  historicalContext: string;
}

const PRESET_SCENARIOS: FaultPreset[] = [
  {
    id: 'mae-tha',
    name: 'Mae Tha Fault (Chiang Mai)',
    thaiName: 'กลุ่มรอยเลื่อนแม่ทา (เชียงใหม่ - ลำพูน)',
    locationName: 'อ.แม่ทา จ.ลำพูน (ห่างเมืองเชียงใหม่ 38 กม.)',
    magnitude: 5.8,
    depthKm: 10,
    distanceKm: 38,
    soilAmplification: 1.4,
    description: 'แผ่นดินไหวตื้นใกล้เมืองหลักภาคเหนือ ระยะเวลารวมเตือนภัยสั้นมาก ต้องการระบบ AI สกัดฟีเจอร์ใน 3 วินาทีแรก',
    historicalContext: 'รอยเลื่อนมีพลังใกล้ตัวเมืองเชียงใหม่ เคยเกิดแผ่นดินไหวขนาดปานกลางสั่นไหวถึงศูนย์ราชการ',
  },
  {
    id: 'sagaing',
    name: 'Sagaing Fault (Myanmar-Thai Border)',
    thaiName: 'รอยเลื่อนสะกาย (รอยต่อพม่า-ไทย)',
    locationName: 'แนวรอยเลื่อนแนวราบสะกาย พม่า-ภาคเหนือ',
    magnitude: 7.2,
    depthKm: 18,
    distanceKm: 320,
    soilAmplification: 1.6,
    description: 'รอยเลื่อนแปรสัณฐานแผ่นทวีปขนาดใหญ่ แรงสั่นสะเทือนกระจายกว้างขวางครอบคลุมทั้งภาคเหนือและภาคกลาง',
    historicalContext: 'รอยเลื่อนที่มีพลังระดับภูมิภาค เคยเกิดแผ่นดินไหวใหญ่เกิน M7.0 หลายครั้งในประวัติศาสตร์',
  },
  {
    id: 'andaman',
    name: 'Andaman Subduction Megaquake',
    thaiName: 'มหาพิบัติแผ่นดินไหวมุดตัวหมู่เกาะอันดามัน',
    locationName: 'ร่องลึกก้นสมุทรอันดามัน (แนวรอยต่อแผ่นเปลือกโลก)',
    magnitude: 8.4,
    depthKm: 30,
    distanceKm: 580,
    soilAmplification: 2.2,
    description: 'แผ่นดินไหวขนาดยักษ์ (Megathrust) ก่อให้เกิดคลื่นคาบยาว (Long-period ground motion) สะเทือนอาคารสูงกรุงเทพฯ',
    historicalContext: 'คล้ายเหตุการณ์ปี 2547 คลื่นไหวสะเทือนคาบยาวทำให้ตึกสูงทั่วกรุงเทพฯ โยกไกวอย่างรุนแรง',
  },
  {
    id: 'si-sawat',
    name: 'Si Sawat Fault (Kanchanaburi)',
    thaiName: 'กลุ่มรอยเลื่อนศรีสวัสดิ์ (กาญจนบุรี)',
    locationName: 'อ.ศรีสวัสดิ์ ใกล้อ่างเก็บน้ำเขื่อนศรีนครินทร์',
    magnitude: 4.9,
    depthKm: 8,
    distanceKm: 140,
    soilAmplification: 1.2,
    description: 'จุดเฝ้าระวังพิเศษด้านความมั่นคงปลอดภัยเขื่อนกักเก็บน้ำขนาดใหญ่และโครงสร้างชลประทาน',
    historicalContext: 'เคยเกิดแผ่นดินไหวขนาด 5.9 ในปี 2526 ส่งผลให้เขื่อนศรีนครินทร์ติดตั้งระบบแผ่นดินไหวเข้มงวด',
  },
  {
    id: 'bkk-basin',
    name: 'Bangkok Basin Soft Clay Amplification',
    thaiName: 'แอ่งดินอ่อนกรุงเทพฯ ขยายสัญญาณคลื่นสะเทือน',
    locationName: 'ชั้นดินเหนียวอ่อนกรุงเทพฯ (Bangkok Marine Clay Basin)',
    magnitude: 6.8,
    depthKm: 25,
    distanceKm: 280,
    soilAmplification: 3.4,
    description: 'ปรากฏการณ์เรโซแนนซ์ขยายความรุนแรงคลื่น 3.4 เท่า จากชั้นดินเหนียวอ่อนทะเล ก่อให้เกิดความเสียหายต่อตึกสูง',
    historicalContext: 'งานวิจัย วช. และจุฬาฯ พบว่าชั้นดินกรุงเทพฯ ขยายคลื่นแผ่นดินไหวระยะไกลได้สูงกว่าพื้นที่หินแข็ง 3-4 เท่า',
  },
];

export const EarthquakeSimulator: React.FC<EarthquakeSimulatorProps> = ({
  onStartSimulation,
  onInjectPWave,
  onInjectSWave,
  onReset,
  className = '',
}) => {
  // Selected preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mae-tha');

  // Physics parameter sliders
  const [magnitude, setMagnitude] = useState<number>(5.8);
  const [depthKm, setDepthKm] = useState<number>(10);
  const [distanceKm, setDistanceKm] = useState<number>(38);
  const [vpVelocity, setVpVelocity] = useState<number>(6.0); // km/s (typical continental crust P-wave)
  const [vsVelocity, setVsVelocity] = useState<number>(3.5); // km/s (typical crust S-wave)
  const [soilFactor, setSoilFactor] = useState<number>(1.4);

  // Simulation run state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentCountdown, setCurrentCountdown] = useState<number>(0);
  const [simPhase, setSimPhase] = useState<'idle' | 'p_propagating' | 'p_arrived' | 's_arrived'>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle Preset selection
  const handleSelectPreset = (preset: FaultPreset) => {
    setSelectedPresetId(preset.id);
    setMagnitude(preset.magnitude);
    setDepthKm(preset.depthKm);
    setDistanceKm(preset.distanceKm);
    setSoilFactor(preset.soilAmplification);
  };

  // --- SEISMIC WAVE PHYSICS CALCULATIONS ---
  // 1. Hypocentral Distance R = sqrt(D^2 + H^2)
  const hypocentralDistance = useMemo(() => {
    return Math.sqrt(distanceKm * distanceKm + depthKm * depthKm);
  }, [distanceKm, depthKm]);

  // 2. Travel times: tp = R / Vp, ts = R / Vs
  const travelTimeP = useMemo(() => {
    return hypocentralDistance / (vpVelocity || 6.0);
  }, [hypocentralDistance, vpVelocity]);

  const travelTimeS = useMemo(() => {
    return hypocentralDistance / (vsVelocity || 3.5);
  }, [hypocentralDistance, vsVelocity]);

  // 3. Golden Lead Time: Warning time between P-wave pick and S-wave arrival at target station
  // Assumes AI Edge detector picks P-wave in 3 seconds after arrival
  const leadTimeSec = useMemo(() => {
    const rawDiff = travelTimeS - travelTimeP;
    return Math.max(1, Math.round((rawDiff) * 10) / 10);
  }, [travelTimeS, travelTimeP]);

  // 4. Ground Motion Prediction Equation (GMPE) estimate for PGA (Gal)
  // Joyner-Boore / Campbell simplified formulation adjusted for Thailand active faults
  const calculatedPga = useMemo(() => {
    // ln(PGA) = 0.8 * M - 1.1 * ln(R + 5) - 0.003 * R + constant
    const r = Math.max(5, hypocentralDistance);
    const lnPga = -0.6 + 0.95 * magnitude - 1.15 * Math.log(r + 8);
    const rawPga = Math.exp(lnPga) * 980; // in Gal
    const amplifiedPga = rawPga * soilFactor;
    return Math.max(0.5, Math.round(amplifiedPga * 10) / 10);
  }, [hypocentralDistance, magnitude, soilFactor]);

  // 5. Modified Mercalli Intensity (MMI) Mapping
  const mmiLevel = useMemo(() => {
    const p = calculatedPga;
    if (p < 1.4) return { roman: 'I - II', text: 'เบามาก ไม่รู้สึก (Micro)', color: 'text-slate-400' };
    if (p < 5.0) return { roman: 'III', text: 'รู้สึกได้เฉพาะคนอยู่นิ่ง (Weak)', color: 'text-cyan-400' };
    if (p < 15.0) return { roman: 'IV', text: 'รู้สึกปานกลาง ถ้วยชามกระทบกัน (Light)', color: 'text-emerald-400' };
    if (p < 40.0) return { roman: 'V', text: 'รู้สึกเกือบทั่วไป ของแกว่งไกว (Moderate)', color: 'text-yellow-400' };
    if (p < 90.0) return { roman: 'VI', text: 'รุนแรง ข้าวของตกหล่น ผนังแตกร้าวเล็กน้อย (Strong)', color: 'text-amber-400' };
    if (p < 200.0) return { roman: 'VII', text: 'รุนแรงมาก อาคารไม่แข็งแรงชำรุด (Very Strong)', color: 'text-rose-400' };
    if (p < 450.0) return { roman: 'VIII', text: 'รุนแรงเป็นพิเศษ อาคารแตกร้าวพังทลาย (Severe)', color: 'text-rose-500' };
    return { roman: 'IX - X', text: 'วิกฤตพินาศ อาคารพังทลายเป็นบริเวณกว้าง (Violent)', color: 'text-rose-600' };
  }, [calculatedPga]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // START SIMULATION HANDLER
  const handleStartSimulation = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimPhase('p_propagating');
    setCurrentCountdown(leadTimeSec);

    const activePreset = PRESET_SCENARIOS.find(p => p.id === selectedPresetId);
    const scenarioData: SimulationScenario = {
      id: selectedPresetId,
      name: activePreset?.name || 'Custom Simulation',
      locationName: activePreset?.locationName || `พิกัดจำลองระยะ ${distanceKm} กม.`,
      lat: 18.7883,
      lng: 98.9853,
      magnitude,
      depthKm,
      description: activePreset?.description || 'สถานการณ์จำลองเพื่อทดสอบสมรรถนะปัญญาประดิษฐ์ตรวจจับคลื่น P-wave',
    };

    // Trigger parent callback
    if (onStartSimulation) {
      onStartSimulation(scenarioData, leadTimeSec, calculatedPga, `MMI ${mmiLevel.roman} (${mmiLevel.text})`);
    }

    // Play P-wave acoustic alert
    audioAlertSystem.playPWaveChirp();

    // Voice announcement
    audioAlertSystem.speakEmergencyWarning(leadTimeSec, 'bilingual');

    // Countdown interval (every 100ms for smooth display)
    const startTime = Date.now();
    const durationMs = leadTimeSec * 1000;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingSec = Math.max(0, (durationMs - elapsed) / 1000);
      setCurrentCountdown(Math.round(remainingSec * 10) / 10);

      if (remainingSec <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setSimPhase('s_arrived');
        setIsSimulating(false);
        // S-wave impacts
        audioAlertSystem.playSWaveRumble();
        if (onInjectSWave) onInjectSWave();
      }
    }, 100);
  };

  // RESET HANDLER
  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSimulating(false);
    setSimPhase('idle');
    setCurrentCountdown(0);
    audioAlertSystem.stopSiren();
    audioAlertSystem.stopSpeech();
    if (onReset) onReset();
  };

  return (
    <div className={`bg-seismic-card border border-seismic-border rounded-xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-6 ${className}`}>
      {/* Bench Header with NRCT Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-seismic-border/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Earthquake Simulation Bench
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold">
                <Award className="w-3.5 h-3.5" /> แท่นทดสอบสำหรับกรรมการ วช.
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ระบบจำลองการแพร่กระจายคลื่นไหวสะเทือน คำนวณเวลาทอง (Golden Seconds) และอัตราขยายคลื่นตามหลักธรณีฟิสิกส์
            </p>
          </div>
        </div>

        {/* Live Simulation Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {isSimulating ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse font-bold">
              <AlertOctagon className="w-4 h-4" />
              <span>SIMULATING: {currentCountdown.toFixed(1)}s TO IMPACT</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>BENCH READY</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Scenarios (Thailand Fault Lines & Bangkok Soil Basin) */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>ชุดสถานการณ์จำลองมาตรฐานประเทศไทย (NRCT Standard Scenarios):</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-100 line-clamp-1">
                      {preset.thaiName}
                    </span>
                    <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      M{preset.magnitude.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <span>ลึก: {preset.depthKm}km</span>
                  <span>ระยะ: {preset.distanceKm}km</span>
                  <span className={preset.soilAmplification > 2 ? 'text-amber-400 font-bold' : ''}>
                    ขยายดิน: {preset.soilAmplification}x
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sliders Grid (Physics Parameters) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        
        {/* Slider 1: Magnitude (M3.0 - M9.0) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">ขนาดแมกนิจูด (Magnitude Mw)</span>
            <span className="text-rose-400 font-bold text-sm">M {magnitude.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="9.0"
            step="0.1"
            value={magnitude}
            onChange={(e) => {
              setMagnitude(parseFloat(e.target.value));
              setSelectedPresetId('custom');
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>M 3.0 (เบา)</span>
            <span>M 6.0 (รุนแรง)</span>
            <span>M 9.0 (มหาพิบัติ)</span>
          </div>
        </div>

        {/* Slider 2: Hypocentral Depth (5km - 150km) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">ความลึกโฟกัส (Focal Depth)</span>
            <span className="text-amber-400 font-bold text-sm">{depthKm} km</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={depthKm}
            onChange={(e) => {
              setDepthKm(parseInt(e.target.value));
              setSelectedPresetId('custom');
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>5 km (ตื้นมาก อันตรายสูง)</span>
            <span>150 km (ลึก)</span>
          </div>
        </div>

        {/* Slider 3: Epicentral Distance (10km - 600km) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">ระยะห่างสถานี (Epicentral Dist.)</span>
            <span className="text-cyan-400 font-bold text-sm">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="10"
            max="600"
            step="5"
            value={distanceKm}
            onChange={(e) => {
              setDistanceKm(parseInt(e.target.value));
              setSelectedPresetId('custom');
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>10 km (ประชิดตัว)</span>
            <span>600 km (ข้ามภูมิภาค)</span>
          </div>
        </div>

        {/* Slider 4: P-Wave Velocity Vp (5.0 - 7.5 km/s) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">ความเร็วคลื่น P (Vp Velocity)</span>
            <span className="text-cyan-400 font-bold">{vpVelocity.toFixed(1)} km/s</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="7.5"
            step="0.1"
            value={vpVelocity}
            onChange={(e) => setVpVelocity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-500 block">มาตรฐานเปลือกโลกทวีปเอเชียตะวันออกเฉียงใต้ ~6.0 km/s</span>
        </div>

        {/* Slider 5: S-Wave Velocity Vs (3.0 - 4.5 km/s) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">ความเร็วคลื่น S (Vs Velocity)</span>
            <span className="text-rose-400 font-bold">{vsVelocity.toFixed(1)} km/s</span>
          </div>
          <input
            type="range"
            min="2.8"
            max="4.5"
            step="0.1"
            value={vsVelocity}
            onChange={(e) => setVsVelocity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <span className="text-[10px] text-slate-500 block">อัตราส่วน Vp/Vs สอดคล้องทฤษฎีปัวซง ~1.73</span>
        </div>

        {/* Slider 6: Soft Soil Amplification Factor (1.0x - 3.5x) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">อัตราขยายชั้นดินอ่อน (Soil Amp.)</span>
            <span className="text-amber-400 font-bold">{soilFactor.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.5"
            step="0.1"
            value={soilFactor}
            onChange={(e) => setSoilFactor(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-500 block">1.0x (หินแข็ง) ถึง 3.4x (แอ่งดินเหนียวกรุงเทพฯ)</span>
        </div>

      </div>

      {/* Physics Theoretical Output (Calculated Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Metric 1: Hypocentral Distance */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 block uppercase">HYPOCENTER (R)</span>
          <span className="text-base sm:text-lg font-bold text-slate-100">
            {hypocentralDistance.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">R = √(D² + H²)</span>
        </div>

        {/* Metric 2: Golden Lead Time */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 font-mono">
          <span className="text-[10px] text-cyan-400 block uppercase font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> GOLDEN SECONDS
          </span>
          <span className="text-lg sm:text-xl font-black text-cyan-300">
            {leadTimeSec} <span className="text-xs font-normal text-slate-400">วินาที</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Δt = (R/Vs) - (R/Vp)</span>
        </div>

        {/* Metric 3: Predicted PGA */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 font-mono">
          <span className="text-[10px] text-rose-400 block uppercase font-bold flex items-center gap-1">
            <Activity className="w-3 h-3" /> PREDICTED PGA
          </span>
          <span className="text-base sm:text-lg font-black text-rose-300">
            {calculatedPga} <span className="text-xs font-normal text-slate-400">Gal</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">GMPE (Peak Accel)</span>
        </div>

        {/* Metric 4: MMI Intensity */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 block uppercase">MMI INTENSITY</span>
          <span className={`text-base sm:text-lg font-black ${mmiLevel.color}`}>
            {mmiLevel.roman}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{mmiLevel.text}</span>
        </div>

      </div>

      {/* Control Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Main Simulation Launch */}
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`px-5 py-3 rounded-xl font-bold text-sm tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
              isSimulating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/20'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isSimulating ? 'กำลังจำลองสถานการณ์...' : 'เริ่มจำลองสถานการณ์ฉุกเฉิน'}</span>
          </button>

          {/* Quick Impulse Injection for Seismogram */}
          <button
            onClick={() => {
              if (onInjectPWave) onInjectPWave();
              audioAlertSystem.playPWaveChirp();
            }}
            className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>ฉีดคลื่น P-Wave ทันที</span>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2 border border-slate-700 transition-colors active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>รีเซ็ตระบบ</span>
        </button>
      </div>

      {/* Theoretical Grounding & NRCT Research Note */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-semibold block mb-0.5">
            หลักการทางธรณีฟิสิกส์รองรับโดย วช. (Geophysical Scientific Formulation):
          </span>
          คลื่นปฐมภูมิ (P-Wave) เป็นคลื่นอัดตามยาวที่มีความเร็วสูง (~6 km/s) แต่ก่อความเสียหายน้อย ขณะที่คลื่นทุติยภูมิ (S-Wave) มีความเร็วต่ำกว่า (~3.5 km/s) แต่เป็นคลื่นเฉือนตามขวางที่มีแอมพลิจูดสูงและทำลายสิ่งปลูกสร้าง ความต่างของเวลาแพร่กระจาย (Δt) คือ "เวลาทองคำ" ที่ SeismoGuard AI นำมาคำนวณและแจ้งเตือนภัยล่วงหน้าได้แบบแม่นยำสูง
        </div>
      </div>

    </div>
  );
};

export default EarthquakeSimulator;
