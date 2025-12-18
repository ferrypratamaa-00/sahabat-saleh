import React, { useEffect } from 'react';
import AudioManager from '../utils/AudioManager';

interface SafeAudioProps {
  src?: string;
  text?: string; // for TTS
  autoPlay?: boolean;
  volume?: number;
}

const SafeAudio: React.FC<SafeAudioProps> = ({ 
  src, 
  text, 
  autoPlay = true,
  volume = 1
}) => {
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    if (autoPlay) {
      if (text) {
        audioManager.speak(text);
      } else if (src) {
        audioManager.playSound(src, volume);
      }
    }

    // Cleanup saat unmount
    return () => {
      // Audio manager akan handle cleanup
    };
  }, [text, src, autoPlay, volume]);

  return null; // No need to render anything
};

export default SafeAudio;