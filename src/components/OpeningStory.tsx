import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Volume2 
  // Palette 
} from 'lucide-react';
import AudioManager from '../utils/AudioManager';

interface OpeningStoryProps {
  onStart: () => void;
  onSettings: () => void;
  // onTheme: () => void;
}

const OpeningStory: React.FC<OpeningStoryProps> = memo(({ onStart, onSettings, 
  // onTheme
 }) => {
  const [showStars, setShowStars] = useState(false);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    setShowStars(true);
    // Play welcome speech with cartoon voice immediate
    audioManager.speak("Selamat datang di Petualangan Sahabat Saleh");
  }, []);

  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const newStars = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: i * 0.2
    }));
    setStars(newStars);
  }, []);

  const handleStart = () => {
    audioManager.playClick();
    onStart();
  };

  const handleSettings = () => {
    audioManager.playClick();
    onSettings();
  };

  // const handleTheme = () => {
  //   audioManager.playClick();
  //   onTheme();
  // };

  return (
    <div className="opening-story">
      {/* Animated stars background */}
      {showStars && (
        <div className="stars-container">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="star"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: star.x,
                y: star.y
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        className="opening-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.h1 
          className="opening-title"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
        >
          <img src="/images/game5/masjid.png" alt="Masjid" style={{ width: 'clamp(40px, 8vw, 60px)', height: 'auto' }} />
          <span>Petualangan Sahabat Saleh</span>
        </motion.h1>

        {/* Story text */}
        <motion.div
          className="opening-story-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="story-paragraph">
            Hai Sahabat Saleh, mari kita belajar menjadi anak yang baik.
            Ayo bantu mereka belajar tentang wudu, huruf hijaiyah, berbagi, dan salat!
          </p>
        </motion.div>

        {/* Characters */}
        <motion.div 
          className="characters-container"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <motion.img
            src="/images/opening/character_boy.png"
            alt="Saleh"
            className="character-img"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ width: 'clamp(100px, 30vw, 150px)', height: 'auto', margin: '0 0.5rem' }} 
          />
          <motion.img 
            src="/images/opening/character_girl.png"
            alt="Salihah"
            className="character-img"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ width: 'clamp(100px, 30vw, 150px)', height: 'auto', margin: '0 0.5rem' }}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="opening-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Replay Audio Button (helpful if auto-play blocked) */}
          <motion.button
             className="btn-replay-audio"
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 1 }}
             onClick={() => audioManager.speak("Selamat datang di Petualangan Sahabat Saleh")}
             style={{
               position: 'absolute',
               top: '1rem',
               right: '1rem',
               background: 'rgba(255, 255, 255, 0.8)',
               border: 'none',
               borderRadius: '50%',
               width: '3rem',
               height: '3rem',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               cursor: 'pointer',
               boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
               zIndex: 50
             }}
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
          >
             <Volume2 size={24} color="var(--primary)" />
          </motion.button>

          <motion.button
            className="btn-start"
            onClick={handleStart}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={24} />
            <span>Mulai Bermain</span>
          </motion.button>

          <div className="secondary-buttons">
            <motion.button
              className="btn-secondary"
              onClick={handleSettings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} />
              <span>Pengaturan</span>
            </motion.button>

            {/* <motion.button
              className="btn-secondary"
              onClick={handleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Palette size={20} />
              <span>Tema</span>
            </motion.button> */}
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="decorative-elements"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.span
            className="float-emoji"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '15%', left: '10%', fontSize: '4rem' }} // Positioned
          >
            🌙
          </motion.span>
          <motion.span
            className="float-emoji"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{ top: '20%', right: '15%', fontSize: '3rem' }} // Positioned
          >
            ⭐
          </motion.span>
          <motion.span
             className="float-emoji"
             animate={{ x: [-20, 20, -20] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             style={{ top: '60%', left: '5%', fontSize: '5rem', opacity: 0.8 }}
          >
            ☁️
          </motion.span>
          <motion.span
             className="float-emoji"
             animate={{ x: [20, -20, 20] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             style={{ top: '40%', right: '5%', fontSize: '5rem', opacity: 0.8 }}
          >
             ☁️
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default OpeningStory;