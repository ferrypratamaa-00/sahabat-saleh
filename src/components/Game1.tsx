import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Hand, Smile, Wind, Sparkles, ArrowLeft } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import toast from 'react-hot-toast';

const steps = [
  { name: 'Niat', emoji: '🤲', icon: Sparkles, sound: 'Niat untuk wudu', color: '#e0f2fe' },
  { name: 'Mencuci Tangan', emoji: '👐', icon: Hand, sound: 'Cuci tangan kanan dan kiri tiga kali', color: '#dbeafe' },
  { name: 'Berkumur', emoji: '😊', icon: Smile, sound: 'Berkumur tiga kali', color: '#e0e7ff' },
  { name: 'Istinsyaq', emoji: '👃', icon: Wind, sound: 'Hirup air ke hidung tiga kali', color: '#f0f9ff' },
  { name: 'Mencuci Muka', emoji: '😌', icon: Droplet, sound: 'Cuci muka tiga kali', color: '#e0f2fe' },
  { name: 'Selesai!', emoji: '✨', icon: Sparkles, sound: 'Alhamdulillah, wudu kamu sudah sempurna', color: '#dcfce7' },
];

interface Game1Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game1: React.FC<Game1Props> = memo(({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shuffledSteps, setShuffledSteps] = useState<typeof steps>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameMode, setGameMode] = useState<'learn' | 'test'>('learn');
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    // Shuffle steps untuk test mode
    const shuffled = [...steps].slice(0, -1).sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
  }, []);

  useEffect(() => {
    if (gameMode === 'learn' && currentStep < steps.length) {
      audioManager.speak(steps[currentStep].sound);
    }
  }, [currentStep, gameMode]);

  const handleLearnNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('Kamu sudah belajar semua langkah wudu! Sekarang coba urutkan!', {
        duration: 3000,
        icon: '🎉'
      });
      setTimeout(() => {
        setGameMode('test');
        setCurrentStep(0);
      }, 2000);
    }
  };

  const handleStepClick = (index: number) => {
    const correctIndex = userSequence.length;
    const clickedStep = shuffledSteps[index];
    const correctStep = steps[correctIndex];

    if (clickedStep.name === correctStep.name) {
      audioManager.speak('Benar! ' + clickedStep.sound);
      toast.success('MasyaAllah! Benar!', { icon: '✅', duration: 1500 });
      
      const newSequence = [...userSequence, index];
      setUserSequence(newSequence);

      if (newSequence.length === steps.length - 1) {
        setTimeout(() => {
          audioManager.speak('Alhamdulillah! Kamu berhasil mengurutkan langkah wudu dengan benar!');
          toast.success('Sempurna! Kamu menguasai urutan wudu!', { icon: '🌟', duration: 3000 });
          setTimeout(onComplete, 2000);
        }, 1000);
      }
    } else {
      audioManager.speak('Hmm, coba lagi ya');
      toast('Ups! Coba ingat-ingat lagi urutannya ya', { icon: '🤔', duration: 2000 });
    }
  };

  if (gameMode === 'learn') {
    return (
      <div className="game1">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Kembali
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>💧 Belajar Wudu</h2>
          <div className="step-counter">
            Langkah {currentStep + 1} dari {steps.length}
          </div>
          
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: steps[currentStep].color,
              padding: '2rem',
              borderRadius: '1.5rem',
              margin: '2rem auto',
              maxWidth: '400px'
            }}
          >
            <div style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', marginBottom: '1rem' }}>
              {steps[currentStep].emoji}
            </div>
            <h3 style={{ color: 'var(--text-title)', marginBottom: '1rem' }}>
              {steps[currentStep].name}
            </h3>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              {steps[currentStep].sound}
            </p>
          </motion.div>

          <motion.button
            onClick={handleLearnNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
          >
            {currentStep < steps.length - 1 ? 'Lanjut ➡️' : 'Selesai Belajar! 🎯'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="game1">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} /> Kembali
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>💧 Urutkan Langkah Wudu</h2>
        <div className="feedback-message info">
          Klik langkah-langkah sesuai urutan yang benar!
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(userSequence.length / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
            {userSequence.length} dari {steps.length - 1} langkah
          </p>
        </div>

        <div className="wudu-steps">
          {shuffledSteps.map((step, index) => {
            const isCompleted = userSequence.includes(index);
            
            return (
              <motion.div
                key={index}
                className={`wudu-step ${isCompleted ? 'completed' : ''}`}
                onClick={() => !isCompleted && handleStepClick(index)}
                whileHover={!isCompleted ? { scale: 1.05 } : {}}
                whileTap={!isCompleted ? { scale: 0.95 } : {}}
                style={{
                  background: isCompleted ? step.color : 'white',
                  opacity: isCompleted ? 0.6 : 1,
                  cursor: isCompleted ? 'default' : 'pointer',
                  pointerEvents: isCompleted ? 'none' : 'auto'
                }}
              >
                <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '0.5rem' }}>
                  {step.emoji}
                </div>
                <h4 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', margin: '0.5rem 0' }}>
                  {step.name}
                </h4>
                {isCompleted && (
                  <div style={{ fontSize: '2rem' }}>✅</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
});

export default Game1;