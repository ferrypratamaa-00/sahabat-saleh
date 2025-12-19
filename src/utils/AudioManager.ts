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
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      } catch {
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
    if (!this.isEnabled) return;

    // Stop audio sebelumnya
    this.stopAll();

    // Try Google TTS first, UNLESS chipmunk style is requested (Web Speech API handles pitch better)
    if (this.voiceStyle === 'chipmunk') {
      this.speakFallback(text, lang);
      return;
    }

    this.playGoogleTTS(text, lang).catch(() => {
      // Fallback to Web Speech API
      this.speakFallback(text, lang);
    });
  }

  private async playGoogleTTS(text: string, lang: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use Google Translate TTS API (unofficial but widely used)
        const encodedText = encodeURIComponent(text);
        // Map common language codes slightly if needed, but 'id' is standard
        const targetLang = lang.split('-')[0]; 
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedText}`;
        
        const audio = new Audio(url);
        audio.volume = 1;

        // Apply chipmunk effect if enabled
        if (this.voiceStyle === 'chipmunk') {
          const rate = 1.3;
          audio.playbackRate = rate;
          
          if ('preservesPitch' in audio) {
            (audio as unknown as { preservesPitch: boolean }).preservesPitch = false;
          } else if ('mozPreservesPitch' in audio) {
            (audio as unknown as { mozPreservesPitch: boolean }).mozPreservesPitch = false;
          } else if ('webkitPreservesPitch' in audio) {
            (audio as unknown as { webkitPreservesPitch: boolean }).webkitPreservesPitch = false;
          }
        }
        
        audio.oncanplaythrough = () => {
          this.audioElements.push(audio);
          audio.play().catch(reject);
          resolve(); 
        };

        audio.onended = () => {
          this.audioElements = this.audioElements.filter(a => a !== audio);
        };

        audio.onerror = (e) => {
          this.audioElements = this.audioElements.filter(a => a !== audio);
          reject(e);
        };
        
        // Trigger load
        audio.load();
      } catch (e) {
        reject(e);
      }
    });
  }

  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private speakFallback(text: string, lang: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // Cancel previous
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance; // Keep reference to prevent GC

      utterance.lang = lang;
      utterance.rate = 1.1;
      utterance.pitch = 1.5; // Higher pitch for cartoon/chipmunk effect
      
      utterance.onend = () => {
        this.currentUtterance = null;
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.currentUtterance = null;
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  }

  private voiceStyle: 'normal' | 'chipmunk' = 'chipmunk';

  setVoiceStyle(style: 'normal' | 'chipmunk') {
    this.voiceStyle = style;
  }

  // Play audio file
  playSound(src: string, volume: number = 1): void {
    if (!this.isEnabled) return;

    try {
      const audio = new Audio(src);
      audio.volume = volume;

      // Apply chipmunk effect if enabled
      if (this.voiceStyle === 'chipmunk') {
        const rate = 1.3; // Lebih kartun lagi (sedikit di bawah 1.35)
        audio.playbackRate = rate;
        
        // Critically, we MUST disable pitch preservation to get the "chipmunk" effect (high pitch)
        // when speeding up. If preservesPitch is true (default), it just speaks faster but same pitch.
        if ('preservesPitch' in audio) {
          (audio as unknown as { preservesPitch: boolean }).preservesPitch = false;
        } else if ('mozPreservesPitch' in audio) {
          (audio as unknown as { mozPreservesPitch: boolean }).mozPreservesPitch = false;
        } else if ('webkitPreservesPitch' in audio) {
          (audio as unknown as { webkitPreservesPitch: boolean }).webkitPreservesPitch = false;
        }
      }

      audio.onended = () => {
        this.audioElements = this.audioElements.filter(a => a !== audio);
      };
      audio.onerror = () => {
        this.audioElements = this.audioElements.filter(a => a !== audio);
      };
      
      this.audioElements.push(audio);
      audio.play().catch(() => {});
    } catch {
      // Ignore
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
    } catch {
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
