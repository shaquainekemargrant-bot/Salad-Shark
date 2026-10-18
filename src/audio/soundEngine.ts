/**
 * Veggie Shark: Frenzy Munch!
 * High-performance Web Audio API Procedural Sound Engine & Dynamic BGM Synthesizer
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = true;
  private sfxVolume: number = 0.8;
  private bgmVolume: number = 0.55;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private currentTempoBpm: number = 132;
  private currentStep: number = 0;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.bgmGain = this.ctx.createGain();

      this.sfxGain.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
      this.bgmGain.gain.value = this.bgmEnabled ? this.bgmVolume : 0;
      this.masterGain.gain.value = this.isMuted ? 0 : 1;

      this.sfxGain.connect(this.masterGain);
      this.bgmGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlockAudio() {
    this.initCtx();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(enabled ? this.bgmVolume : 0, this.ctx.currentTime);
    }
  }

  public getBgmEnabled() {
    return this.bgmEnabled;
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  public getSfxEnabled() {
    return this.sfxEnabled;
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && this.ctx && this.bgmEnabled) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public getBgmVolume() {
    return this.bgmVolume;
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx && this.sfxEnabled) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public getSfxVolume() {
    return this.sfxVolume;
  }


  // --- SOUND EFFECTS ---

  /**
   * Randomized Crunchy Veggie Munch
   */
  public playVeggieMunch(type: 'lettuce' | 'tomato' | 'broccoli' | 'carrot' | 'avocado' | 'default' = 'default') {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // White noise generator for the crisp "crunch"
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    const noiseGain = this.ctx.createGain();

    if (type === 'lettuce') {
      // Crisp light leaf crunch
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(2200, t);
      noiseGain.gain.setValueAtTime(0.4, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + Math.random() * 80, t);
      osc.frequency.exponentialRampToValueAtTime(750, t + 0.06);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
    } else if (type === 'tomato') {
      // Juicy squish
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, t);
      noiseFilter.Q.setValueAtTime(3, t);
      noiseGain.gain.setValueAtTime(0.35, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.08);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    } else if (type === 'broccoli') {
      // Deep solid wood-crunch
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, t);
      noiseGain.gain.setValueAtTime(0.45, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 40, t);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.05);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
    } else if (type === 'avocado') {
      // Golden shimmering chomp!
      this.playPowerUp();
      return;
    } else {
      // Default hearty chomp
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1500, t);
      noiseGain.gain.setValueAtTime(0.3, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

      osc.type = 'square';
      osc.frequency.setValueAtTime(380 + Math.random() * 100, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.05);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
    }

    // Connect noise crunch
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    // Connect tonal chomp
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, t);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.1);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Disgusted "BLEGH!" Raw Meat Hit Sound
   */
  public playMeatHit() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;

    // 1. Comic downward slide buzz
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const distortion = this.ctx.createWaveShaper();

    // Simple soft clipping curve
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (3 + 10) * x * 20 * (Math.PI / 180) / (Math.PI + 10 * Math.abs(x));
    }
    distortion.curve = curve;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.38);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.42);

    // 2. Meat splat noise
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 15);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(600, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(150, t + 0.15);

    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.16);
  }

  /**
   * Ascending Combo Fanfare Sparkle
   */
  public playComboMultiplier(comboLevel: number) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const baseNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    const t = this.ctx.currentTime;

    const count = Math.min(4, Math.max(2, Math.floor(comboLevel / 3) + 2));
    for (let i = 0; i < count; i++) {
      const noteIdx = (Math.min(comboLevel, 10) + i) % baseNotes.length;
      const freq = baseNotes[noteIdx];
      const noteTime = t + i * 0.055;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.15);
    }
  }

  /**
   * Shark Leap / Splash Whoosh Sound
   */
  public playSharkLeap() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.14);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(3200, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  /**
   * Shield Deflect / Energy Bounce Sound
   */
  public playShieldDeflect() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(1760, t + 0.06);
    osc1.frequency.exponentialRampToValueAtTime(440, t + 0.22);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, t);
    osc2.frequency.exponentialRampToValueAtTime(2640, t + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(660, t + 0.22);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.24);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  /**
   * Distinct Power-Up Pickup Chimes
   */
  public playPowerUpPickup(type: 'magnet' | 'shield' | 'multiplier') {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;

    if (type === 'magnet') {
      // Electric buzzing zips
      [330, 440, 660, 880].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.1);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.11);
      });
    } else if (type === 'shield') {
      // Protective resonant chime
      [523.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.24, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.28);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } else {
      // Score Multiplier 2X fanfare
      [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.035;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.22, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.2);
      });
    }
  }

  /**
   * Power Up / Golden Avocado Frenzy Sound
   */
  public playPowerUp() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.18);
    });
  }

  /**
   * Game Over Sad Comic Brass Trombone Stinger
   */
  public playGameOver() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const notes = [370, 349.23, 329.63, 311.13]; // Descending chromatic sad trombone

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.22;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);
      if (idx === notes.length - 1) {
        // Last note slides down with vibrato
        osc.frequency.linearRampToValueAtTime(freq * 0.85, noteTime + 0.6);
      }

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + (idx === notes.length - 1 ? 0.65 : 0.2));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + (idx === notes.length - 1 ? 0.7 : 0.21));
    });
  }

  /**
   * Quick Crisp UI Button Click
   */
  public playButtonClick() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.035);
  }

  /**
   * Triumphant Level-Up Jingle
   */
  public playLevelUp() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5 E5 G5 C6 E6 G6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });
  }

  /**
   * Deep Rumble + Dimensional Realm Transition Chime
   */
  public playMapTransition() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    // Low sub rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, t);
    subOsc.frequency.exponentialRampToValueAtTime(40, t + 0.8);
    subGain.gain.setValueAtTime(0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.85);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(t);
    subOsc.stop(t + 0.9);

    // High sparkling sweep
    [440, 659.25, 880, 1318.51, 1760].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + 0.15 + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }

  /**
   * Theatrical Cutscene Unboxing Fanfare
   */
  public playSkinUnlockCutscene() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    // Rapid drumroll / riser
    for (let i = 0; i < 10; i++) {
      const drumTime = t + i * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120 + i * 15, drumTime);
      osc.frequency.exponentialRampToValueAtTime(45, drumTime + 0.04);
      gain.gain.setValueAtTime(0.2 + (i / 10) * 0.15, drumTime);
      gain.gain.exponentialRampToValueAtTime(0.01, drumTime + 0.045);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(drumTime);
      osc.stop(drumTime + 0.05);
    }

    // Grand Triumphant Chord (C Major / G Major fanfare)
    const chordTime = t + 0.5;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, chordTime);
      gain.gain.setValueAtTime(0.25, chordTime);
      gain.gain.exponentialRampToValueAtTime(0.01, chordTime + 0.9);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(chordTime);
      osc.stop(chordTime + 0.95);
    });
  }

  /**
   * Active Ability Trigger Sound
   */
  public playAbilityTrigger(skinId: string) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    if (skinId === 'carnivore_megalodon') {
      // Ferocious predatory roar & slash
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.linearRampToValueAtTime(320, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.45);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.48);
    } else if (skinId === 'lettuce_frenzy') {
      // Swirling salad vortex whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(1100, t + 0.25);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.5);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.52);
    } else if (skinId === 'royal_king') {
      // Midas touch sparkling transmuting chime
      [880, 1108.73, 1318.51, 1760, 2217.46].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = t + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.25, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    } else {
      // Fast bubble surge dash
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.22);
    }
  }

  /**
   * Golden Coin Ping
   */
  public playCoinPickup() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.06); // E6
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Secret Code Redeem Jackpot Fanfare
   */
  public playCodeRedeemSuccess() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880, 1174.66, 1479.98]; // D Major arpeggio
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  /**
   * Carnivore Chomping Meat (Satisfying Crunch)
   */
  public playCarnivoreChomp() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted || !this.sfxEnabled) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.06);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Carnivore Disgusted by Greens (Negative sound)
   */
  public playCarnivoreVeggieHurt() {
    this.playMeatHit();
  }

  // --- UPBEAT FRENETIC DYNAMIC BGM SYNTHESIZER ---

  public startBgm() {
    this.initCtx();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.currentStep = 0;
    this.scheduleBgmLoop();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      window.clearTimeout(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public setDynamicTempo(speedMultiplier: number) {
    // Accelerates from 132 BPM to 185 BPM as game progresses
    const targetBpm = Math.min(195, 132 + Math.max(0, speedMultiplier - 1) * 35);
    this.currentTempoBpm = targetBpm;
  }

  private scheduleBgmLoop() {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    const stepDuration = (60 / this.currentTempoBpm) / 4; // 16th notes
    const t = this.ctx.currentTime;

    // Frenetic arcade music patterns (16 step bar sequence in key of G Major / E minor)
    // Melody notes (Hz)
    const melodyNotes = [
      659.25, 0, 783.99, 880, 0, 783.99, 659.25, 0,
      987.77, 880, 783.99, 0, 659.25, 783.99, 880, 987.77,
      1046.5, 0, 987.77, 880, 783.99, 0, 659.25, 0,
      587.33, 659.25, 783.99, 880, 987.77, 1174.66, 1318.51, 0
    ];

    // Bassline notes (Hz)
    const bassNotes = [
      164.81, 164.81, 0, 164.81, 196.00, 0, 196.00, 0,
      220.00, 220.00, 0, 220.00, 246.94, 0, 196.00, 164.81,
      130.81, 130.81, 0, 130.81, 146.83, 0, 146.83, 0,
      164.81, 164.81, 0, 164.81, 196.00, 220.00, 246.94, 0
    ];

    const currentMelodyFreq = melodyNotes[this.currentStep % melodyNotes.length];
    const currentBassFreq = bassNotes[this.currentStep % bassNotes.length];
    const stepInMeasure = this.currentStep % 16;

    if (!this.isMuted) {
      // 1. Synthesize Bass
      if (currentBassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFilter = this.ctx.createBiquadFilter();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(currentBassFreq, t);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(450, t);
        bassFilter.frequency.exponentialRampToValueAtTime(180, t + stepDuration * 0.9);

        bassGain.gain.setValueAtTime(0.2, t);
        bassGain.gain.exponentialRampToValueAtTime(0.01, t + stepDuration * 0.95);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(t);
        bassOsc.stop(t + stepDuration);
      }

      // 2. Synthesize Lead Melody
      if (currentMelodyFreq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        const leadFilter = this.ctx.createBiquadFilter();

        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(currentMelodyFreq, t);

        leadFilter.type = 'bandpass';
        leadFilter.frequency.setValueAtTime(1400, t);
        leadFilter.Q.setValueAtTime(1.5, t);

        leadGain.gain.setValueAtTime(0.12, t);
        leadGain.gain.exponentialRampToValueAtTime(0.01, t + stepDuration * 0.85);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(this.bgmGain);

        leadOsc.start(t);
        leadOsc.stop(t + stepDuration);
      }

      // 3. Synthesize Drums (Kick on 0, 4, 8, 12 / Snare on 4, 12 / Hi-hat on every odd 16th)
      if (stepInMeasure === 0 || stepInMeasure === 8) {
        // Punchy Kick
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, t);
        kickOsc.frequency.exponentialRampToValueAtTime(38, t + 0.08);

        kickGain.gain.setValueAtTime(0.35, t);
        kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGain);
        kickOsc.start(t);
        kickOsc.stop(t + 0.1);
      } else if (stepInMeasure === 4 || stepInMeasure === 12) {
        // Snappy Snare
        const snareNoise = this.ctx.createBufferSource();
        const bSize = this.ctx.sampleRate * 0.06;
        const b = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < bSize; i++) d[i] = Math.random() * 2 - 1;
        snareNoise.buffer = b;

        const snareFilter = this.ctx.createBiquadFilter();
        snareFilter.type = 'highpass';
        snareFilter.frequency.setValueAtTime(1000, t);

        const snareGain = this.ctx.createGain();
        snareGain.gain.setValueAtTime(0.22, t);
        snareGain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

        snareNoise.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(this.bgmGain);
        snareNoise.start(t);
        snareNoise.stop(t + 0.07);
      }

      // Hi-hat tick
      if (stepInMeasure % 2 === 1) {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        const hatFilter = this.ctx.createBiquadFilter();

        hatOsc.type = 'sawtooth';
        hatOsc.frequency.setValueAtTime(8000, t);

        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(6000, t);

        hatGain.gain.setValueAtTime(0.06, t);
        hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        hatOsc.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.bgmGain);

        hatOsc.start(t);
        hatOsc.stop(t + 0.03);
      }
    }

    this.currentStep = (this.currentStep + 1) % 32;

    this.bgmIntervalId = window.setTimeout(() => {
      this.scheduleBgmLoop();
    }, stepDuration * 1000);
  }
}

export const soundEngine = new SoundEngine();
