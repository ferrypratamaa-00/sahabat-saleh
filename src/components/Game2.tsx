import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import toast from 'react-hot-toast';

const letters = [
  { arabic: 'ا', name: 'ALIF', sound: 'Alif', audio: '/audio/wudu/huruf_alif.mp3' },
  { arabic: 'ب', name: 'BA', sound: 'Ba', audio: '/audio/wudu/huruf_ba.mp3' },
  { arabic: 'ت', name: 'TA', sound: 'Ta', audio: '/audio/wudu/huruf_ta.mp3' },
  { arabic: 'ث', name: 'TSA', sound: 'Tsa', audio: '/audio/wudu/huruf_tsa.mp3' },
  { arabic: 'ج', name: 'JIM', sound: 'Jim', audio: '/audio/wudu/huruf_jim.mp3' },
  { arabic: 'ح', name: 'HA', sound: 'Ha', audio: '/audio/wudu/huruf_ha.mp3' },
  { arabic: 'خ', name: 'KHA', sound: 'Kha', audio: '/audio/wudu/huruf_kha.mp3' },
  { arabic: 'د', name: 'DAL', sound: 'Dal', audio: '/audio/wudu/huruf_dal.mp3' },
  { arabic: 'ذ', name: 'DZAL', sound: 'Dzal', audio: '/audio/wudu/huruf_dzal.mp3' },
  { arabic: 'ر', name: 'RA', sound: 'Ra', audio: '/audio/wudu/huruf_ra.mp3' },
];

interface Game2Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game2: React.FC<Game2Props> = memo(({ onBack, onComplete }) => {
  const [targetLetter, setTargetLetter] = useState(letters[0]);
  const [options, setOptions] = useState<typeof letters>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const audioManager = AudioManager.getInstance();
  const totalRounds = 5;

  useEffect(() => {
    generateOptions();
  }, [round]);

  useEffect(() => {
    // Play sound saat huruf baru muncul
    if (targetLetter) {
      setTimeout(() => {
        // "Cari huruf..." + [Huruf]
        audioManager.stopAll();
        audioManager.playSound('/audio/wudu/cari_huruf.mp3');
        setTimeout(() => {
          audioManager.playSound(targetLetter.audio);
        }, 1000);
      }, 500);
    }
  }, [targetLetter]);

  const generateOptions = () => {
    const randomTarget = letters[Math.floor(Math.random() * letters.length)];
    setTargetLetter(randomTarget);
    
    const wrongs = letters
      .filter(l => l.arabic !== randomTarget.arabic)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setOptions([randomTarget, ...wrongs].sort(() => 0.5 - Math.random()));
  };

  const playLetterSound = () => {
    audioManager.stopAll();
    audioManager.playSound(targetLetter.audio);
  };

  const handleSelect = (letter: typeof letters[0]) => {
    audioManager.stopAll();

    if (letter.arabic === targetLetter.arabic) {
      audioManager.playSound('/audio/wudu/benar.mp3'); // Or specific "Benar, ini huruf..."
      // Optionally play specific feedback: "MasyaAllah! Benar, ini huruf [Nama]" 
      // But we just use generic generic positive + letter name for simplicity or just "Benar"
      
      setTimeout(() => {
         audioManager.playSound(letter.audio);
      }, 1000);

      toast.success(`Benar! Huruf ${letter.name}`, { icon: '✨', duration: 2000 });
      setScore(score + 1);
      setShowResult(true);

      setTimeout(() => {
        setShowResult(false);
        if (round + 1 < totalRounds) {
          setRound(round + 1);
        } else {
          audioManager.playSound('/audio/wudu/game2_selesai.mp3');
          toast.success('Hebat! Kamu menyelesaikan semua level!', { icon: '🏆', duration: 3000 });
          setTimeout(onComplete, 3000);
        }
      }, 2000);
    } else {
      audioManager.playSound('/audio/wudu/coba_dengarkan_lagi.mp3');
      toast('Belum tepat, coba lagi! 🎧', { icon: '🤔', duration: 1500 });
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
            <span>Level {round + 1}/{totalRounds}</span>
            <span>Skor: {score} 🌟</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((round + 1) / totalRounds) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={round}
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
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playLetterSound}
              style={{
                fontSize: 'clamp(5rem, 15vw, 8rem)',
                cursor: 'pointer',
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                margin: '1rem 0'
              }}
            >
              {showResult ? '✨' : targetLetter.arabic}
            </motion.div>

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
              key={`${round}-${index}`}
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
    </div>
  );
});

export default Game2;