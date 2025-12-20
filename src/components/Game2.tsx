import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import FeedbackModal from './FeedbackModal';
// import toast from 'react-hot-toast';

const letters = [
  { arabic: 'ا', name: 'ALIF', sound: 'Alif', audio: '/audio/huruf_alif.mp3' },
  { arabic: 'ب', name: 'BA', sound: 'Ba', audio: '/audio/huruf_ba.mp3' },
  { arabic: 'ت', name: 'TA', sound: 'Ta', audio: '/audio/huruf_ta.mp3' },
  { arabic: 'ث', name: 'TSA', sound: 'Tsa', audio: '/audio/huruf_tsa.mp3' },
  { arabic: 'ج', name: 'JIM', sound: 'Jim', audio: '/audio/huruf_jim.mp3' },
  { arabic: 'ح', name: 'HA', sound: 'Ha', audio: '/audio/huruf_ha.mp3' },
  { arabic: 'خ', name: 'KHA', sound: 'Kha', audio: '/audio/huruf_kha.mp3' },
  { arabic: 'د', name: 'DAL', sound: 'Dal', audio: '/audio/huruf_dal.mp3' },
  { arabic: 'ذ', name: 'DZAL', sound: 'Dzal', audio: '/audio/huruf_dzal.mp3' },
  { arabic: 'ر', name: 'RA', sound: 'Ra', audio: '/audio/huruf_ra.mp3' },
];

interface Game2Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game2: React.FC<Game2Props> = memo(({ onBack, onComplete }) => {
  const [queue, setQueue] = useState<typeof letters>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<typeof letters>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string} | null>(null);
  const audioManager = AudioManager.getInstance();
  const totalRounds = 5;

  // Initialize Game: Shuffle Queue
  useEffect(() => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, totalRounds);
    setQueue(shuffled);
    setCurrentQuestionIndex(0);
  }, []);

  // Setup Round whenever index or queue changes
  useEffect(() => {
    if (queue.length > 0 && currentQuestionIndex < queue.length) {
      const target = queue[currentQuestionIndex];
      generateOptions(target);
      playQuestionAudio(target);
    }
  }, [queue, currentQuestionIndex]);

  const playQuestionAudio = (target: typeof letters[0]) => {
      audioManager.stopAll();
      // "Cari huruf..." 
      // Delay slightly to allow UI to settle? Not strictly needed but good for flow
      setTimeout(() => {
        audioManager.playInstruction('/audio/cari_huruf.mp3');
        setTimeout(() => {
          audioManager.playSound(target.audio);
        }, 1200); // Wait for instruction to finish roughly
      }, 500);
  };

  const generateOptions = (target: typeof letters[0]) => {
    const wrongs = letters
      .filter(l => l.arabic !== target.arabic)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setOptions([target, ...wrongs].sort(() => 0.5 - Math.random()));
  };

  const playLetterSound = () => {
    if (queue.length > 0 && currentQuestionIndex < queue.length) {
        const target = queue[currentQuestionIndex];
        audioManager.stopAll();
        audioManager.playSound(target.audio);
    }
  };

  const handleSelect = (letter: typeof letters[0]) => {
    const target = queue[currentQuestionIndex];
    audioManager.stopAll();

    if (letter.arabic === target.arabic) {
      audioManager.playSound('/audio/benar.mp3'); 
      
      setTimeout(() => {
         audioManager.playSound(letter.audio);
      }, 1000);

      setScore(score + 1);
      setShowResult(true);

      setTimeout(() => {
        setShowResult(false);
        if (currentQuestionIndex + 1 < totalRounds) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          audioManager.playSound('/audio/game2_selesai.mp3');
          setFeedback({
              isOpen: true,
              type: 'success',
              title: 'Hebat!',
              message: 'Kamu menyelesaikan semua level!'
          });
        }
      }, 2000);
    } else {
      audioManager.playSound('/audio/coba_dengarkan_lagi.mp3');
      setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Belum Tepat',
          message: 'Coba dengarkan lagi ya! 🎧'
      });
    }
  };

  const closeFeedback = () => {
      const title = feedback?.title;
      setFeedback(null);
      if (title === 'Hebat!') {
          onComplete();
      }
  };

  return (
    <div className="game2">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} /> Kembali
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>🔤 Jejak Huruf Hijaiyah</h2>
        
        <div className="progress-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Level {currentQuestionIndex + 1}/{totalRounds}</span>
            <span>Skor: {score} 🌟</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / totalRounds) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'var(--secondary-soft)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              borderRadius: 'clamp(1rem, 3vw, 1.5rem)',
              margin: '2rem auto',
              maxWidth: '500px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
              fontWeight: 700, 
              color: 'var(--text-title)',
              marginBottom: '1rem'
            }}>
              Dengarkan dan cari huruf:
            </p>
            
            <motion.button
              onClick={playLetterSound}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '1rem auto',
                background: 'var(--info)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <Volume2 size={20} /> Dengar Lagi
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <div className="options">
          {options.map((letter, index) => (
            <motion.div
              key={`${currentQuestionIndex}-${index}`}
              className="option-item"
              onClick={() => !showResult && handleSelect(letter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                fontWeight: 'bold',
                cursor: showResult ? 'default' : 'pointer',
                pointerEvents: showResult ? 'none' : 'auto'
              }}
            >
              {letter.arabic}
              <div style={{ 
                fontSize: 'clamp(0.875rem, 2vw, 1rem)', 
                marginTop: '0.5rem',
                color: 'var(--text-muted)'
              }}>
                {letter.name}
              </div>
            </motion.div>
          ))}
        </div>

        {showResult && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="feedback-message success"
          >
            MasyaAllah! Benar! 🌟
          </motion.div>
        )}
      </motion.div>
      
      {feedback && (
          <FeedbackModal
            isOpen={feedback.isOpen}
            type={feedback.type}
            title={feedback.title}
            message={feedback.message}
            onClose={closeFeedback}
            autoCloseDelay={feedback.type === 'error' ? 2000 : undefined} 
          />
      )}
    </div>
  );
});

export default Game2;