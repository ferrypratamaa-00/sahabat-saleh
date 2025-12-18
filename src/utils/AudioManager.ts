// AudioManager untuk kontrol audio global dan mencegah audio berulang
class AudioManager {
  playClick() {
    throw new Error('Method not implemented.');
  }
  playWrong() {
    throw new Error('Method not implemented.');
  }
  playCorrect() {
    throw new Error('Method not implemented.');
  }
  private static instance: AudioManager;
  private audioElements: HTMLAudioElement[] = [];
  private isEnabled: boolean = true;

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

  // Stop semua audio dan speech
  stopAll(): void {
    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    // Stop semua audio elements
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.audioElements = [];
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
        console.warn('Audio load failed:', src);
        this.audioElements = this.audioElements.filter(a => a !== audio);
      };
      
      this.audioElements.push(audio);
      audio.play().catch(err => console.warn('Audio play failed:', err));
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // Play background music dengan loop
  playBackgroundMusic(src: string, volume: number = 0.3): HTMLAudioElement | null {
    if (!this.isEnabled) return null;

    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.loop = true;
      audio.onerror = () => console.warn('Background music load failed:', src);
      
      this.audioElements.push(audio);
      audio.play().catch(err => console.warn('Background music play failed:', err));
      return audio;
    } catch (error) {
      console.warn('Background music setup failed:', error);
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
