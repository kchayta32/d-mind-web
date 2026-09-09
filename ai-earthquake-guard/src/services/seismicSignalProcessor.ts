/**
 * SeismoGuard AI - Seismic Signal Processor
 * High-performance digital signal processing for earthquake early warning.
 *
 * Implements:
 * 1. 2nd-order Butterworth Bandpass Filter (0.5 Hz - 15 Hz) for seismic noise rejection.
 * 2. Characteristic Function CF(t) = y(t)^2 + C * (y'(t) - y(t-1))^2 (Allen 1978 & Earle/Shearer).
 * 3. Zero-latency Recursive STA/LTA (Short-Term Average / Long-Term Average) detector.
 * 4. P-wave onset picking, SNR estimation, and synthetic 3-component seismic waveform simulation.
 */

import { WaveformSample, TriggerResult } from '../types/seismic';

export interface FilterCoefficients {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
}

/**
 * 2nd-Order Butterworth Biquad Filter (Cascaded Highpass + Lowpass for 0.5 - 15 Hz bandpass)
 */
export class ButterworthBandpassFilter {
  private hpB0 = 0;
  private hpB1 = 0;
  private hpB2 = 0;
  private hpA1 = 0;
  private hpA2 = 0;

  private lpB0 = 0;
  private lpB1 = 0;
  private lpB2 = 0;
  private lpA1 = 0;
  private lpA2 = 0;

  // State variables for Highpass stage (Direct Form II Transposed)
  private hpD1 = 0;
  private hpD2 = 0;

  // State variables for Lowpass stage (Direct Form II Transposed)
  private lpD1 = 0;
  private lpD2 = 0;

  readonly sampleRate: number;
  readonly fLow: number;
  readonly fHigh: number;

  constructor(sampleRate = 50, fLow = 0.5, fHigh = 15.0) {
    this.sampleRate = sampleRate;
    this.fLow = fLow;
    this.fHigh = Math.min(fHigh, sampleRate * 0.45); // Below Nyquist
    this.computeCoefficients();
  }

  private computeCoefficients(): void {
    const fs = this.sampleRate;
    const q = 1 / Math.SQRT2; // Butterworth Q factor = 0.7071

    // 1. High-Pass Filter at fLow
    const omegaHP = Math.tan((Math.PI * this.fLow) / fs);
    const kHP = omegaHP;
    const normHP = 1 / (1 + kHP / q + kHP * kHP);
    this.hpB0 = 1 * normHP;
    this.hpB1 = -2 * normHP;
    this.hpB2 = 1 * normHP;
    this.hpA1 = 2 * (kHP * kHP - 1) * normHP;
    this.hpA2 = (1 - kHP / q + kHP * kHP) * normHP;

    // 2. Low-Pass Filter at fHigh
    const omegaLP = Math.tan((Math.PI * this.fHigh) / fs);
    const kLP = omegaLP;
    const normLP = 1 / (1 + kLP / q + kLP * kLP);
    this.lpB0 = kLP * kLP * normLP;
    this.lpB1 = 2 * this.lpB0;
    this.lpB2 = this.lpB0;
    this.lpA1 = 2 * (kLP * kLP - 1) * normLP;
    this.lpA2 = (1 - kLP / q + kLP * kLP) * normLP;
  }

  /**
   * Process a single sample through both Highpass and Lowpass stages (Zero-latency causal filter).
   */
  processSample(x: number): number {
    // Stage 1: Highpass
    const yHp = this.hpB0 * x + this.hpD1;
    this.hpD1 = this.hpB1 * x - this.hpA1 * yHp + this.hpD2;
    this.hpD2 = this.hpB2 * x - this.hpA2 * yHp;

    // Stage 2: Lowpass
    const yLp = this.lpB0 * yHp + this.lpD1;
    this.lpD1 = this.lpB1 * yHp - this.lpA1 * yLp + this.lpD2;
    this.lpD2 = this.lpB2 * yHp - this.lpA2 * yLp;

    return yLp;
  }

  /**
   * Filter an entire signal array.
   * If zeroPhase is true, applies forward and reverse filtering (filtfilt) to remove phase shift.
   */
  filter(data: number[], zeroPhase = false): number[] {
    if (data.length === 0) return [];
    this.reset();

    const forward = new Array<number>(data.length);
    for (let i = 0; i < data.length; i++) {
      forward[i] = this.processSample(data[i]);
    }

    if (!zeroPhase) {
      return forward;
    }

    // Reverse pass for zero-phase distortion
    this.reset();
    const backward = new Array<number>(data.length);
    for (let i = data.length - 1; i >= 0; i--) {
      backward[i] = this.processSample(forward[i]);
    }

    return backward;
  }

  /**
   * Reset filter internal delay state buffers.
   */
  reset(): void {
    this.hpD1 = 0;
    this.hpD2 = 0;
    this.lpD1 = 0;
    this.lpD2 = 0;
  }
}

/**
 * Options for STA/LTA Detector
 */
export interface StaLtaOptions {
  staDurationSec?: number; // Duration of STA window (default: 0.8s)
  ltaDurationSec?: number; // Duration of LTA window (default: 12.0s)
  thresholdOn?: number; // STA/LTA ratio to trigger (default: 3.5)
  thresholdOff?: number; // STA/LTA ratio to de-trigger (default: 1.5)
  weightC?: number; // Weighting factor for derivative in CF(t) (default: 3.0)
  sampleRate?: number; // Sampling frequency in Hz (default: 50 Hz)
}

/**
 * Recursive STA/LTA Detector (Allen 1978, 1982 & Earle and Shearer 1994)
 * Uses Characteristic Function: CF(t) = y(t)^2 + C * (y'(t) - y(t-1))^2
 * Provides O(1) recursive computation with zero memory allocations per sample.
 */
export class RecursiveStaLtaDetector {
  private sta = 0;
  private lta = 1e-4; // Small positive epsilon to avoid division by zero
  private prevY = 0;
  private prevYPrime = 0;
  private isTriggered = false;
  private triggerCount = 0;

  readonly alpha: number; // STA decay coefficient
  readonly beta: number; // LTA decay coefficient
  readonly weightC: number;
  readonly thresholdOn: number;
  readonly thresholdOff: number;
  readonly sampleRate: number;

  constructor(options: StaLtaOptions = {}) {
    const {
      staDurationSec = 0.8,
      ltaDurationSec = 12.0,
      thresholdOn = 3.5,
      thresholdOff = 1.5,
      weightC = 3.0,
      sampleRate = 50,
    } = options;

    this.sampleRate = sampleRate;
    this.weightC = weightC;
    this.thresholdOn = thresholdOn;
    this.thresholdOff = thresholdOff;

    const dt = 1.0 / sampleRate;
    // Exponential weighting factors: alpha = exp(-dt / T_sta), beta = exp(-dt / T_lta)
    this.alpha = Math.exp(-dt / staDurationSec);
    this.beta = Math.exp(-dt / ltaDurationSec);
  }

  /**
   * Characteristic Function (Allen 1978 formulation):
   * CF(t) = y(t)^2 + C * (y'(t) - y(t-1))^2
   * where y'(t) = (y(t) - y(t-1)) / dt
   */
  computeCharacteristicFunction(y: number): number {
    const dt = 1.0 / this.sampleRate;
    const yPrime = (y - this.prevY) / dt;
    // Difference between consecutive derivative and amplitude difference
    const diff = yPrime - this.prevY;
    const cf = y * y + this.weightC * (diff * diff);

    this.prevY = y;
    this.prevYPrime = yPrime;
    return cf;
  }

  /**
   * Ingest a new waveform sample and compute updated STA/LTA ratio in O(1) time.
   */
  process(y: number): { ratio: number; triggered: boolean; cf: number } {
    const cf = this.computeCharacteristicFunction(y);

    // Recursive updates
    this.sta = this.alpha * this.sta + (1.0 - this.alpha) * cf;
    this.lta = this.beta * this.lta + (1.0 - this.beta) * cf;

    const ratio = this.sta / Math.max(this.lta, 1e-6);

    if (!this.isTriggered && ratio >= this.thresholdOn) {
      this.isTriggered = true;
      this.triggerCount++;
    } else if (this.isTriggered && ratio <= this.thresholdOff) {
      this.isTriggered = false;
    }

    return { ratio, triggered: this.isTriggered, cf };
  }

  reset(): void {
    this.sta = 0;
    this.lta = 1e-4;
    this.prevY = 0;
    this.prevYPrime = 0;
    this.isTriggered = false;
    this.triggerCount = 0;
  }

  getTriggerStatus(): boolean {
    return this.isTriggered;
  }

  getTriggerCount(): number {
    return this.triggerCount;
  }
}

/**
 * Process a waveform array using Butterworth bandpass and recursive STA/LTA detector.
 */
export function calculateStaLta(
  rawSamples: number[],
  sampleRate = 50,
  options: StaLtaOptions = {}
): {
  filtered: number[];
  ratios: number[];
  triggerIndices: number[];
} {
  const filter = new ButterworthBandpassFilter(sampleRate, 0.5, 15.0);
  const filtered = filter.filter(rawSamples, false);
  const detector = new RecursiveStaLtaDetector({ sampleRate, ...options });

  const ratios = new Array<number>(rawSamples.length);
  const triggerIndices: number[] = [];

  let wasTriggered = false;
  for (let i = 0; i < filtered.length; i++) {
    const { ratio, triggered } = detector.process(filtered[i]);
    ratios[i] = ratio;

    if (triggered && !wasTriggered) {
      triggerIndices.push(i);
    }
    wasTriggered = triggered;
  }

  return { filtered, ratios, triggerIndices };
}

/**
 * Detect P-Wave Arrival with confidence and SNR calculation.
 */
export function detectPWaveArrival(
  samples: WaveformSample[] | number[],
  sampleRate = 50,
  options: StaLtaOptions = {}
): TriggerResult {
  const values = typeof samples[0] === 'number'
    ? (samples as number[])
    : (samples as WaveformSample[]).map((s) => s.z);

  if (values.length < sampleRate * 2) {
    return {
      triggered: false,
      pArrivalIndex: -1,
      pArrivalTime: 0,
      confidence: 0,
      snr: 0,
      estimatedMagnitude: 0,
      estimatedPga: 0,
      estimatedDistanceKm: 0,
    };
  }

  const { filtered, ratios, triggerIndices } = calculateStaLta(values, sampleRate, options);

  if (triggerIndices.length === 0) {
    return {
      triggered: false,
      pArrivalIndex: -1,
      pArrivalTime: 0,
      confidence: 0,
      snr: 1.0,
      estimatedMagnitude: 0,
      estimatedPga: 0,
      estimatedDistanceKm: 0,
    };
  }

  const pIdx = triggerIndices[0];
  const pTime = pIdx / sampleRate;

  // Compute Signal-to-Noise Ratio (pre-trigger window vs post-trigger 2s window)
  const preWindow = Math.max(0, pIdx - sampleRate * 4);
  const noiseSlice = filtered.slice(preWindow, pIdx);
  const postWindow = Math.min(filtered.length, pIdx + sampleRate * 2);
  const signalSlice = filtered.slice(pIdx, postWindow);

  const noiseRms = computeRms(noiseSlice) || 1e-4;
  const signalRms = computeRms(signalSlice);
  const snr = Math.max(1.0, signalRms / noiseRms);
  const peakRatio = Math.max(...ratios.slice(pIdx, postWindow), 3.5);

  // Confidence based on SNR and trigger sharpness (0.70 - 0.99)
  const confidence = Math.min(0.99, Math.max(0.65, 0.6 + 0.1 * Math.log10(snr) + (peakRatio > 6 ? 0.15 : 0.05)));

  // Estimate preliminary PGA from early envelope peak in Gal (cm/s^2)
  const pga = Math.max(...signalSlice.map((v) => Math.abs(v)));
  // Preliminary magnitude from empirical PGA and assumed average distance
  const estimatedMagnitude = Math.min(8.5, Math.max(2.5, 2.0 + 1.25 * Math.log10(pga * 10 + 1)));

  return {
    triggered: true,
    pArrivalIndex: pIdx,
    pArrivalTime: pTime,
    confidence: Math.round(confidence * 1000) / 1000,
    snr: Math.round(snr * 10) / 10,
    estimatedMagnitude: Math.round(estimatedMagnitude * 10) / 10,
    estimatedPga: Math.round(pga * 100) / 100,
    estimatedDistanceKm: Math.round((pTime * 6.0) * 10) / 10,
  };
}

/**
 * Root Mean Square (RMS) helper
 */
export function computeRms(data: number[]): number {
  if (data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  return Math.sqrt(sum / data.length);
}

/**
 * Generate synthetic 3-component seismic waveform with realistic P-wave, S-wave, and coda decay.
 * Perfect for real-time testing, demonstration, and algorithm validation.
 */
export function generateSyntheticWaveform(
  durationSec = 30,
  sampleRate = 50,
  options: {
    magnitude?: number;
    distanceKm?: number;
    pArrivalSec?: number;
    noiseLevel?: number;
  } = {}
): WaveformSample[] {
  const {
    magnitude = 5.6,
    distanceKm = 45,
    pArrivalSec = 5.0,
    noiseLevel = 0.08,
  } = options;

  const totalSamples = Math.floor(durationSec * sampleRate);
  const sArrivalSec = pArrivalSec + distanceKm * (1 / 3.5 - 1 / 6.0); // S - P delay
  const sArrivalIndex = Math.floor(sArrivalSec * sampleRate);
  const pArrivalIndex = Math.floor(pArrivalSec * sampleRate);

  // Peak amplitudes scaled by magnitude and distance attenuation
  const ampP = Math.pow(10, 0.5 * magnitude - 2.5) / Math.sqrt(distanceKm / 10);
  const ampS = ampP * 4.2; // S-wave is typically 3-5x larger than P-wave

  const samples: WaveformSample[] = [];
  const filter = new ButterworthBandpassFilter(sampleRate, 0.5, 15.0);
  const detector = new RecursiveStaLtaDetector({ sampleRate, thresholdOn: 3.5 });

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Ambient background seismic microtremor (filtered pink/brownian noise)
    const noiseZ = (Math.random() - 0.5) * noiseLevel;
    const noiseN = (Math.random() - 0.5) * noiseLevel;
    const noiseE = (Math.random() - 0.5) * noiseLevel;

    let sigZ = noiseZ;
    let sigN = noiseN;
    let sigE = noiseE;

    // P-Wave Arrival (dominates vertical Z component, high frequency ~ 6-8 Hz)
    if (i >= pArrivalIndex) {
      const dtP = t - pArrivalSec;
      const decayP = Math.exp(-0.35 * dtP);
      const freqP = 6.5;
      const pPulse = ampP * Math.sin(2 * Math.PI * freqP * dtP) * decayP;
      sigZ += pPulse * 1.0;
      sigN += pPulse * 0.25;
      sigE += pPulse * 0.2;
    }

    // S-Wave Arrival (dominates horizontal N and E components, lower frequency ~ 2-3 Hz)
    if (i >= sArrivalIndex) {
      const dtS = t - sArrivalSec;
      const decayS = Math.exp(-0.18 * dtS);
      const freqS = 2.4;
      const sPulse = ampS * Math.sin(2 * Math.PI * freqS * dtS) * decayS;
      sigZ += sPulse * 0.35;
      sigN += sPulse * 1.0;
      sigE += sPulse * 0.85;
    }

    // Pass Z component through filter & STA/LTA
    const filtered = filter.processSample(sigZ);
    const { ratio, triggered } = detector.process(filtered);

    samples.push({
      time: Math.round(t * 100) / 100,
      z: Math.round(sigZ * 1000) / 1000,
      n: Math.round(sigN * 1000) / 1000,
      e: Math.round(sigE * 1000) / 1000,
      filtered: Math.round(filtered * 1000) / 1000,
      staLtaRatio: Math.round(ratio * 100) / 100,
      triggerValue: Math.round(ratio * 100) / 100,
      isTriggered: triggered,
    });
  }

  return samples;
}
