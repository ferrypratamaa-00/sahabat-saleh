import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import toast from 'react-hot-toast';

const letters = [
  { arabic: 'ا', name: 'ALIF', sound: 'Alif' },
  { arabic: 'ب', name: 'BA', sound: 'Ba' },
  { arabic: 'ت', name: 'TA', sound: 'Ta' },
  { arabic: 'ث', name: 'TSA', sound: 'Tsa' },
  { arabic: 'ج', name: 'JIM', sound: 'Jim' },
  { arabic: 'ح', name: 'HA', sound: 'Ha' },
  { arabic: 'خ', name: 'KHA', sound: 'Kha' },
  { arabic: 'د', name: 'DAL', sound: 'Dal' },
  { arabic: 'ذ', name: 'DZAL', sound: 'Dzal' },
  { arabic: 'ر', name: 'RA', sound: 'Ra' },
];

interface Game2Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game2: React.FC<Game2Props> = ({ onBack, onComplete }) => {
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
        audioManager.speak(`Cari huruf ${targetLetter.name}`);
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
    audioManager.speak(`Huruf ${targetLetter.name}`);
  };

  const handleSelect = (letter: typeof letters[0]) => {
    if (letter.arabic === targetLetter.arabic) {
      audioManager.speak(`MasyaAllah! Benar, ini huruf ${letter.name}`);
      toast.success(`Benar! Huruf ${letter.name}`, { icon: '✨', duration: 2000 });
      setScore(score + 1);
      setShowResult(true);

      setTimeout(() => {
        setShowResult(false);
        if (round + 1 < totalRounds) {
          setRound(round + 1);
        } else {
          audioManager.speak(`Alhamdulillah! Kamu berhasil menemukan ${score + 1} huruf dengan benar!`);
          toast.success('Hebat! Kamu menyelesaikan semua level!', { icon: '🏆', duration: 3000 });
          setTimeout(onComplete, 2000);
        }
      }, 2000);
    } else {
      audioManager.speak('Hmm, coba dengarkan lagi ya');
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
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
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
              color: '#d97706',
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
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
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
                color: '#737373'
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
};

export default Game2;