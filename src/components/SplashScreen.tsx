import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AudioManager from '../utils/AudioManager';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [hasInteraction, setHasInteraction] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioManager = AudioManager.getInstance();

  const handleStart = () => {
    setHasInteraction(true);
    // Initialize AudioContext on user gesture
    audioManager.playClick();
    audioManager.playBackgroundMusic('/audio/bg_splash.wav', 0.7);
  };

  useEffect(() => {
    if (!hasInteraction) return;

    // Simulate loading process
    const duration = 2500; // Adjusted to match audio length approx 2.5s
    const interval = 30;
    const steps = duration / interval;
    
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Small delay at 100% before finishing
        setTimeout(() => {
          onFinish();
        }, 500);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [hasInteraction, onFinish]);

  if (!hasInteraction) {
    return (
        <div className="splash-screen" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={handleStart}
        >
             <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: 1 
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ textAlign: 'center' }}
            >
                 <h1 style={{ 
                    fontSize: 'clamp(2rem, 5vw, 4rem)', 
                    color: '#F97316', 
                    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                    marginBottom: '2rem'
                 }}>
                     Klik untuk Memulai
                 </h1>
                 <div style={{ fontSize: '3rem' }}>👆</div>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="splash-screen" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', // Soft orange gradient
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ marginBottom: '2rem', textAlign: 'center' }}
      >
        <h1 style={{ 
          fontSize: 'clamp(3rem, 6vw, 5rem)', 
          color: '#F97316', 
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive', // Fallback to fun font
          textShadow: '3px 3px 0px #FDBA74',
          marginBottom: '0.5rem'
        }}>
          Sahabat Saleh
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#EA580C' }}>Belajar & Bermain Bersama</p>
      </motion.div>

      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '3rem',
        alignItems: 'flex-end'
      }}>
        <motion.img 
          src="/images/opening/character_boy.png" 
          alt="Boy Character" 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ height: 'clamp(150px, 30vh, 250px)', objectFit: 'contain' }}
        />
        <motion.img 
          src="/images/opening/character_girl.png" 
          alt="Girl Character" 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ height: 'clamp(150px, 30vh, 250px)', objectFit: 'contain' }}
        />
      </div>

      <div style={{ width: '80%', maxWidth: '300px' }}>
        <div style={{ 
          height: '10px', 
          background: '#FED7AA', 
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <motion.div 
            style={{ 
              height: '100%', 
              background: '#F97316',
              width: `${progress}%`
            }}
          />
        </div>
        <div style={{ 
          textAlign: 'center', 
          marginTop: '0.5rem', 
          color: '#EA580C',
          fontWeight: 'bold' 
        }}>
          Memuat... {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
