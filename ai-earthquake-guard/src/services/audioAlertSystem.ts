/**
 * SeismoGuard AI - Emergency Audio Alert System
 * 
 * Features:
 * 1. Web Audio API Dual-Oscillator Acoustic Siren (resonant sweep tones 850Hz - 1050Hz + pulsed LFO).
 * 2. Web Speech API Voice Synthesizer for urgent bilingual evacuation announcements (TH/EN).
 * 3. Smooth volume ramping, safety limiter, and mute controls.
 * 4. P-wave chirp, S-wave impact rumble, and all-clear chime generators.
 */

export type SirenUrgency = 'advisory' | 'warning' | 'critical';

class AudioAlertSystem {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.85; // 0.0 - 1.0
  private isSirenActive: boolean = false;
  
  // Web Audio Nodes for Siren
  private masterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private biquadFilter: BiquadFilterNode | null = null;
  
  // Web Speech API
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Check Speech Synthesis
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      
      // Load mute preference from storage if exists
      try {
        const storedMute = localStorage.getItem('seismoguard_audio_muted');
        if (storedMute !== null) {
          this.isMuted = storedMute === 'true';
        }
        const storedVol = localStorage.getItem('seismoguard_audio_volume');
        if (storedVol !== null) {
          this.volume = Math.max(0, Math.min(1, parseFloat(storedVol) || 0.85));
        }
      } catch (e) {
        // LocalStorage might be restricted
      }
    }
  }

  /**
   * Initializes or resumes AudioContext upon user gesture
   */
  public async initAudioContext(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;

    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      return this.audioCtx;
    } catch (err) {
      console.warn('[AudioAlertSystem] Could not initialize Web Audio Context:', err);
      return null;
    }
  }

  /**
   * Mute / Unmute toggle
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('seismoguard_audio_muted', String(muted));
    } catch (e) {}

    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.volume, now + 0.05);
    }

    if (muted) {
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Master Volume setter (0.0 to 1.0)
   */
  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('seismoguard_audio_volume', String(this.volume));
    } catch (e) {}

    if (this.masterGain && this.audioCtx && !this.isMuted) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Starts Dual-Oscillator Resonant Siren (Emergency Sweep 850Hz - 1050Hz + pulsed LFO)
   */
  public async startSiren(urgency: SirenUrgency = 'critical'): Promise<void> {
    if (this.isSirenActive) return;
    const ctx = await this.initAudioContext();
    if (!ctx) return;

    this.isSirenActive = true;
    const now = ctx.currentTime;

    // Master Gain for Siren
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, now);
    // Smooth ramp up to avoid sudden clicking
    const targetGain = this.isMuted ? 0 : this.volume * 0.7;
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);

    // Resonant Biquad Filter
    this.biquadFilter = ctx.createBiquadFilter();
    this.biquadFilter.type = 'bandpass';
    this.biquadFilter.frequency.setValueAtTime(950, now);
    this.biquadFilter.Q.setValueAtTime(3.5, now);

    // Primary Oscillator: Resonant Sawtooth for piercing harmonic content
    this.osc1 = ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(850, now);

    // Secondary Oscillator: Sine tone slightly detuned for acoustic beating
    this.osc2 = ctx.createOscillator();
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(854, now);

    // Frequency sweep modulator (LFO 1: Warble between 850Hz and 1050Hz)
    const sweepLfo = ctx.createOscillator();
    sweepLfo.type = 'sine';
    // Frequency of warble depends on urgency
    sweepLfo.frequency.setValueAtTime(urgency === 'critical' ? 3.8 : 2.2, now);

    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(100, now); // Sweep +/- 100Hz around 950Hz (850 - 1050Hz)
    sweepLfo.connect(sweepGain);
    sweepGain.connect(this.osc1.frequency);
    sweepGain.connect(this.osc2.frequency);
    sweepGain.connect(this.biquadFilter.frequency);

    // Amplitude Modulation LFO: Pulsed Staccato burst for critical sirens
    this.lfoOsc = ctx.createOscillator();
    this.lfoOsc.type = 'square';
    this.lfoOsc.frequency.setValueAtTime(urgency === 'critical' ? 6.0 : 4.0, now);

    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.setValueAtTime(0.5, now);
    this.lfoOsc.connect(this.lfoGain.gain);

    // Signal Routing
    this.osc1.connect(this.biquadFilter);
    this.osc2.connect(this.biquadFilter);
    this.biquadFilter.connect(this.lfoGain);
    this.lfoGain.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);

    // Start oscillators
    this.osc1.start(now);
    this.osc2.start(now);
    sweepLfo.start(now);
    this.lfoOsc.start(now);
  }

  /**
   * Stops the siren gracefully with a 150ms ramp down
   */
  public stopSiren(): void {
    if (!this.isSirenActive || !this.audioCtx) {
      this.isSirenActive = false;
      return;
    }

    try {
      const now = this.audioCtx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      }

      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.lfoOsc?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.lfoOsc?.disconnect();
          this.lfoGain?.disconnect();
          this.biquadFilter?.disconnect();
          this.masterGain?.disconnect();
        } catch (e) {}
        this.isSirenActive = false;
      }, 160);
    } catch (e) {
      this.isSirenActive = false;
    }
  }

  public getIsSirenActive(): boolean {
    return this.isSirenActive;
  }

  /**
   * Subtle high-frequency double acoustic ping when P-Wave arrives
   */
  public async playPWaveChirp(): Promise<void> {
    if (this.isMuted) return;
    const ctx = await this.initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Deep low-frequency seismic ground rumble when S-Wave impacts
   */
  public async playSWaveRumble(): Promise<void> {
    if (this.isMuted) return;
    const ctx = await this.initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink / Brown noise generation for seismic rumble
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.2;
      data[i] = (b0 + b1 + b2) * 0.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, now);
    filter.frequency.exponentialRampToValueAtTime(45, now + 1.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.8, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 1.5);
  }

  /**
   * Calm triple chime for Drill Complete / All-Clear
   */
  public async playAllClear(): Promise<void> {
    if (this.isMuted) return;
    const ctx = await this.initAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(this.volume * 0.35, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.85);
    });
  }

  /**
   * Alias for speakEmergencyWarning
   */
  public announceEmergency(
    leadSeconds: number,
    lang: 'th' | 'en' | 'bilingual' = 'bilingual'
  ): Promise<void> {
    return this.speakEmergencyWarning(leadSeconds, lang);
  }

  /**
   * Web Speech API - Speak urgent bilingual emergency announcement
   */
  public speakEmergencyWarning(
    leadSeconds: number,
    lang: 'th' | 'en' | 'bilingual' = 'bilingual'
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.isMuted || !this.synth) {
        resolve();
        return;
      }

      this.stopSpeech();

      const roundedSec = Math.max(1, Math.round(leadSeconds));
      const thaiText = `คำเตือนแผ่นดินไหวระดับวิกฤต! คลื่นทำลายล้างจะถึงในอีก ${roundedSec} วินาที หมอบ กำบัง ยึด!`;
      const engText = `Critical Earthquake Warning! S-wave arriving in ${roundedSec} seconds. Drop, Cover, Hold On!`;

      const voices = this.synth.getVoices();
      const thVoice = voices.find(v => v.lang.startsWith('th')) || null;
      const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || true)) || null;

      const queue: SpeechSynthesisUtterance[] = [];

      if (lang === 'th' || lang === 'bilingual') {
        const uTh = new SpeechSynthesisUtterance(thaiText);
        uTh.lang = 'th-TH';
        uTh.rate = 1.08; // Crisp, urgent pace
        uTh.pitch = 1.05;
        uTh.volume = this.volume;
        if (thVoice) uTh.voice = thVoice;
        queue.push(uTh);
      }

      if (lang === 'en' || lang === 'bilingual') {
        const uEn = new SpeechSynthesisUtterance(engText);
        uEn.lang = 'en-US';
        uEn.rate = 1.15; // Fast tactical delivery
        uEn.pitch = 1.08;
        uEn.volume = this.volume;
        if (enVoice) uEn.voice = enVoice;
        queue.push(uEn);
      }

      if (queue.length === 0) {
        resolve();
        return;
      }

      this.isSpeaking = true;

      // Handle chain
      queue.forEach((utt, index) => {
        if (index === queue.length - 1) {
          utt.onend = () => {
            this.isSpeaking = false;
            resolve();
          };
          utt.onerror = () => {
            this.isSpeaking = false;
            resolve();
          };
        }
        this.synth?.speak(utt);
      });
    });
  }

  /**
   * Quick countdown voice announcement (e.g., "10", "5", "Impact")
   */
  public speakCountdownTick(num: number): void {
    if (this.isMuted || !this.synth) return;
    this.synth.cancel();

    const u = new SpeechSynthesisUtterance(String(num));
    u.lang = 'en-US';
    u.rate = 1.35;
    u.pitch = 1.15;
    u.volume = this.volume;
    this.synth.speak(u);
  }

  /**
   * Stops all active speech synthesis
   */
  public stopSpeech(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
  }

  /**
   * Plays a 3-second siren & speech demonstration test
   */
  public async testSiren(): Promise<void> {
    await this.startSiren('warning');
    await this.playPWaveChirp();

    setTimeout(async () => {
      this.stopSiren();
      await this.speakEmergencyWarning(15, 'th');
    }, 2800);
  }
}

// Export singleton instance
export const audioAlertSystem = new AudioAlertSystem();
export default audioAlertSystem;
