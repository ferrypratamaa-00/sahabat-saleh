import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Hand, Smile, Wind, Sparkles, ArrowLeft, CheckCircle, ArrowRight, User, Ear, Footprints } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import FeedbackModal from './FeedbackModal';

const steps = [
  { name: 'Niat', emoji: '🤲', image: '/images/game1/wudu_niat.png', icon: Sparkles, sound: 'Niat untuk wudu', color: '#e0f2fe', audio: '/audio/niat_wudu.mp3' },
  { name: 'Mencuci Tangan', emoji: '👐', image: '/images/game1/wudu_tangan.png', icon: Hand, sound: 'Cuci tangan kanan dan kiri tiga kali', color: '#dbeafe', audio: '/audio/cuci_tangan.mp3' },
  { name: 'Berkumur', emoji: '😊', image: '/images/game1/wudu_kumur.png', icon: Smile, sound: 'Berkumur tiga kali', color: '#e0e7ff', audio: '/audio/berkumur.mp3' },
  { name: 'Istinsyaq', emoji: '👃', image: '/images/game1/wudu_hidung.png', icon: Wind, sound: 'Hirup air ke hidung tiga kali', color: '#f0f9ff', audio: '/audio/istinsyaq.mp3' },
  { name: 'Mencuci Muka', emoji: '😌', image: '/images/game1/wudu_muka.png', icon: Droplet, sound: 'Cuci muka tiga kali', color: '#e0f2fe', audio: '/audio/cuci_muka.mp3' },
  { name: 'Mencuci Tangan ke Siku', emoji: '💪', image: '/images/game1/wudu_siku.png', icon: Hand, sound: 'Cuci tangan sampai siku tiga kali', color: '#dbeafe', audio: '/audio/cuci_siku.mp3' },
  { name: 'Mengusap Kepala', emoji: '💆', image: '/images/game1/wudu_kepala.png', icon: User, sound: 'Usap sebagian kepala', color: '#e0e7ff', audio: '/audio/usap_kepala.mp3' },
  { name: 'Mengusap Telinga', emoji: '👂', image: '/images/game1/wudu_telinga.png', icon: Ear, sound: 'Usap kedua telinga', color: '#f0f9ff', audio: '/audio/usap_telinga.mp3' },
  { name: 'Mencuci Kaki', emoji: '🦶', image: '/images/game1/wudu_kaki.png', icon: Footprints, sound: 'Cuci kaki sampai mata kaki tiga kali', color: '#e0f2fe', audio: '/audio/cuci_kaki.mp3' },
  { name: 'Selesai!', emoji: '✨', image: '/images/game1/wudu_selesai.png', icon: Sparkles, sound: 'Alhamdulillah, wudu kamu sudah sempurna', color: '#dcfce7', audio: '/audio/wudu_selesai.mp3' },
];

interface Game1Props {
  onBack: () => void;
  onComplete: () => void;
}

// Memoized Step Card for Test Mode
const WuduStepCard = memo(({ step, index, isCompleted, onClick }: { step: typeof steps[0], index: number, isCompleted: boolean, onClick: (index: number) => void }) => {
  return (
    <motion.div
      className={`wudu-step ${isCompleted ? 'completed' : ''}`}
      onClick={() => onClick(index)}
      whileHover={!isCompleted ? { scale: 1.05 } : {}}
      whileTap={!isCompleted ? { scale: 0.95 } : {}}
      style={{
        background: isCompleted ? step.color : 'white',
        opacity: isCompleted ? 0.6 : 1,
        cursor: isCompleted ? 'default' : 'pointer',
        pointerEvents: isCompleted ? 'none' : 'auto'
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        <img 
          src={step.image} 
          alt={step.name}
          style={{ width: '80px', height: '80px', objectFit: 'contain' }}
        />
      </div>
      <h4 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', margin: '0.5rem 0' }}>
        {step.name}
      </h4>
      {isCompleted && (
        <div style={{ marginTop: '0.5rem', color: 'var(--success)' }}>
          <CheckCircle size={32} fill="white" />
        </div>
      )}
    </motion.div>
  );
});

const Game1: React.FC<Game1Props> = memo(({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shuffledSteps, setShuffledSteps] = useState<typeof steps>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameMode, setGameMode] = useState<'learn' | 'test'>('learn');
  const [feedback, setFeedback] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string} | null>(null);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    // Shuffle steps untuk test mode
    const shuffled = [...steps].slice(0, -1).sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
  }, []);

  useEffect(() => {
    if (gameMode === 'learn' && currentStep < steps.length) {
      audioManager.stopAll();
      audioManager.playInstruction(steps[currentStep].audio);
    }
  }, [currentStep, gameMode]);

  const handleLearnNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setFeedback({
        isOpen: true,
        type: 'success',
        title: 'Hebat!',
        message: 'Kamu sudah belajar semua langkah wudu! Sekarang coba urutkan!'
      });
    }
  }, [currentStep]);

  const handleStepClick = useCallback((index: number) => {
    // Need access to latest state, but useCallback with deps might re-create.
    // However, since we need `userSequence` and `shuffledSteps` (which is stable-ish), 
    // real memoization benefit comes if we pass index and handle logic parent side or refer via refs.
    // For simplicity with correct logic, we keep it simple but memoize the child component.
    // Actually, to make `WuduStepCard` memo work, `handleStepClick` ref shouldn't change.
    // But it depends on `userSequence`. So the function reference WILL change.
    // But `WuduStepCard` of *other* unclicked items won't re-render if we passed `isCompleted` as prop only?
    // Wait, if `handleStepClick` changes, ALL children re-render.
    // Optimization: Pass `index` to the handler wrapper?
    // We'll proceed with direct implementation for now as `userSequence` changes are necessary updates.
    
    // We can't easily avoid re-creating this function without refs, but the key is that
    // only the clicked item changes visual state mostly.
    
    // Let's rely on React's fast diffing but keep separate component to reduce DOM complexity per item.
    
    // To truly fix `handleStepClick` dep:
    setUserSequence(prevSequence => {
        const correctIndex = prevSequence.length;
        // checking shuffledSteps needs it in scope. It's stable.
        const clickedStep = shuffledSteps[index];
        const correctStep = steps[correctIndex];

        audioManager.stopAll();

        if (clickedStep.name === correctStep.name) {
            audioManager.playSound('/audio/benar.mp3');
            audioManager.playSound(clickedStep.audio);

            const newSequence = [...prevSequence, index];
            
            if (newSequence.length === steps.length - 1) {
                setTimeout(() => {
                // audioManager.stopAll(); // Don't stop BGM? stopAll stops everything.
                // We need to keep BGM running. stopAll kills BGM? 
                // Let's check AudioManager. stopAll() does stop all sources.
                // But playBackgroundMusic will restart if called? Or we should avoid stopAll here?
                // The prompt says "bg music yang perlu diputar sepanjang game dan terus diulang ulang".
                // So stopAll() is DANGEROUS now.
                // I should change stopAll() usage or make it safer.
                // For now, let's assume I need to fix stopAll later or accept it stops BGM.
                // Actually, if I remove stopAll(), other sounds might overlap.
                // But typically only one SFX plays.
                // Let's remove stopAll() here to keep BGM, but stop other SFX if needed?
                // Or modify stopAll to spare BGM.
                // I'll modify Game1 to NOT call stopAll() blindly, or assume stopAll() kills BGM.
                // Better: Update AudioManager to have stopSFX() vs stopAll().
                // But for this step, let's just use the new sounds and maybe I'll patch AudioManager next.
                // If I don't fix stopAll, BGM dies.
                // I'll assume I will fix AudioManager's stopAll to exclude BGM or add stopSFX.
                
                audioManager.playSound('/audio/bg_sound_win.wav', 0.3);
                setFeedback({
                    isOpen: true,
                    type: 'success',
                    title: 'Sempurna!',
                    message: 'Kamu menguasai urutan wudu!'
                });
                }, 2000);
            }
            return newSequence;
        } else {
            audioManager.playSound('/audio/bg_sound_lose.wav', 0.2);
            setFeedback({
                isOpen: true,
                type: 'error',
                title: 'Ups!',
                message: 'Coba ingat-ingat lagi urutannya ya!'
            });
            return prevSequence;
        }
    });

  }, [shuffledSteps]); // Removed userSequence dependency by using functional update


  
  // Re-implementing simple closeFeedback for clarity, optimization here is negligible compared to lists.
  const handleCloseFeedback = () => {
      const mode = gameMode;
      const title = feedback?.title;

      setFeedback(null);

      if (title === 'Hebat!' || (mode === 'learn' && currentStep >= steps.length - 1)) {
          setGameMode('test');
          setCurrentStep(0);
      } else if (title === 'Sempurna!') {
          onComplete();
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
            <div style={{ marginBottom: '1rem' }}>
               <img 
                 src={steps[currentStep].image} 
                 alt={steps[currentStep].name}
                 style={{ width: '200px', height: 'auto', objectFit: 'contain' }}
               />
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
            {currentStep < steps.length - 1 ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Lanjut <ArrowRight size={20} />
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Selesai Belajar! <CheckCircle size={20} />
              </span>
            )}
          </motion.button>
        </motion.div>

        {feedback && (
          <FeedbackModal
            isOpen={feedback.isOpen}
            type={feedback.type}
            title={feedback.title}
            message={feedback.message}
            onClose={handleCloseFeedback}
          />
        )}
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
              <WuduStepCard 
                key={index} 
                step={step} 
                index={index} 
                isCompleted={isCompleted} 
                onClick={handleStepClick}
              />
            );
          })}
        </div>
      </motion.div>
      
      {feedback && (
          <FeedbackModal
            isOpen={feedback.isOpen}
            type={feedback.type}
            title={feedback.title}
            message={feedback.message}
            onClose={handleCloseFeedback}
          />
      )}
    </div>
  );
});

export default Game1;