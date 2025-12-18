// AudioManager untuk kontrol audio global dan mencegah audio berulang
class AudioManager {
  private static instance: AudioManager;
  private audioElements: HTMLAudioElement[] = [];
  private isEnabled: boolean = true;
  private audioContext: AudioContext | null = null;

  private constructor() {
    // Cleanup saat page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.stopAll());
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Initialize AudioContext lazily (must be after user interaction)
  private getContext(): AudioContext | null {
    if (!this.isEnabled || typeof window === 'undefined') return null;
    
    if (!this.audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    
    return this.audioContext;
  }

  // Play a simple synthesized tone
  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch (e) {
      console.warn('Tone playback failed', e);
    }
  }

  playClick() {
    // High pitched "blip"
    this.playTone(800, 'sine', 0.1);
  }

  playCorrect() {
    // Joyful ascending arpeggio (C Major)
    this.playTone(523.25, 'sine', 0.1, 0);    // C5
    this.playTone(659.25, 'sine', 0.1, 0.1);  // E5
    this.playTone(783.99, 'sine', 0.2, 0.2);  // G5
  }

  playWrong() {
    // Gentle descending wobble
    this.playTone(400, 'triangle', 0.15, 0);
    this.playTone(300, 'triangle', 0.2, 0.1);
  }

  // Stop semua audio dan speech
  stopAll(): void {
    // Stop speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    // Stop semua audio elements
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.audioElements = [];
    
    // Suspend context if playing nothing (optional optimization)
  }

  // Play text-to-speech
  speak(text: string, lang: string = 'id-ID'): void {
    if (!this.isEnabled || !('speechSynthesis' in window)) return;

    // Stop audio sebelumnya
    this.stopAll();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Sedikit lebih lambat untuk anak-anak
      utterance.pitch = 1.1; // Sedikit lebih tinggi, lebih ceria
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  }

  // Play audio file
  playSound(src: string, volume: number = 1): void {
    if (!this.isEnabled) return;

    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.onended = () => {
        this.audioElements = this.audioElements.filter(a => a !== audio);
      };
      audio.onerror = () => {
        // Fallback or silence
        this.audioElements = this.audioElements.filter(a => a !== audio);
      };
      
      this.audioElements.push(audio);
      audio.play().catch(() => {});
    } catch (error) {
      // Ignore errors
    }
  }

  // Play background music dengan loop
  playBackgroundMusic(src: string, volume: number = 0.3): HTMLAudioElement | null {
    if (!this.isEnabled) return null;

    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.loop = true;
      audio.onerror = () => {};
      
      this.audioElements.push(audio);
      audio.play().catch(() => {});
      return audio;
    } catch (error) {
      return null;
    }
  }

  // Toggle audio on/off
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
}

export default AudioManager;
