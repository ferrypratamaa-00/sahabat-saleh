import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Info } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import DeveloperInfoModal from './DeveloperInfoModal';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const audioManager = AudioManager.getInstance();
  const [isAudioEnabled, setIsAudioEnabled] = useState(audioManager.isAudioEnabled());
  const [showDevInfo, setShowDevInfo] = useState(false);

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    audioManager.setEnabled(newState);
    if (newState) {
      audioManager.playClick();
    }
  };

  return (
    <div className="settings-page" style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      textAlign: 'center',
      background: 'var(--bg-card)',
      borderRadius: '2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>⚙️ Pengaturan</h1>
      
      <div className="settings-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <motion.button
          className="setting-item"
          onClick={toggleAudio}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: isAudioEnabled ? 'var(--primary)' : 'var(--text-disabled)',
            padding: '1.5rem 3rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '1.5rem',
            width: '100%',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          {isAudioEnabled ? <Volume2 size={32} /> : <VolumeX size={32} />}
          <span>{isAudioEnabled ? 'Suara: NYALA' : 'Suara: MATI'}</span>
        </motion.button>

        <motion.button
          className="setting-item"
          onClick={() => {
            audioManager.playClick();
            setShowDevInfo(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: '#8b5cf6', // Violet-500
            padding: '1.5rem 3rem',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '1.5rem',
            width: '100%',
            justifyContent: 'center',
            color: 'white'
          }}
        >
          <Info size={32} />
          <span>Info Pengembang</span>
        </motion.button>
      </div>

      <DeveloperInfoModal isOpen={showDevInfo} onClose={() => setShowDevInfo(false)} />

      <motion.button
        className="btn-back"
        onClick={() => {
          audioManager.playClick();
          onBack();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '3rem',
          background: 'var(--warning)',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '999px',
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '3rem auto 0'
        }}
      >
        <ArrowLeft /> Kembali
      </motion.button>
    </div>
  );
};

export default Settings;
