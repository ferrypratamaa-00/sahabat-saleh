import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Palette } from 'lucide-react';
import AudioManager from '../utils/AudioManager';

interface OpeningStoryProps {
  onStart: () => void;
  onSettings: () => void;
  onTheme: () => void;
}

const OpeningStory: React.FC<OpeningStoryProps> = ({ onStart, onSettings, onTheme }) => {
  const [showStars, setShowStars] = useState(false);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    setShowStars(true);
    audioManager.speak('Selamat datang di petualangan Si Saleh dan Si Salihah!');
  }, []);

  const handleStart = () => {
    audioManager.playClick();
    onStart();
  };

  const handleSettings = () => {
    audioManager.playClick();
    onSettings();
  };

  const handleTheme = () => {
    audioManager.playClick();
    onTheme();
  };

  return (
    <div className="opening-story">
      {/* Animated stars background */}
      {showStars && (
        <div className="stars-container">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
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
        >
          🕌 Petualangan Si Saleh & Si Salihah 🌙
        </motion.h1>

        {/* Story text */}
        <motion.div
          className="opening-story-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="story-paragraph">
            Hari ini Si Saleh dan Si Salihah ingin belajar menjadi anak yang baik.
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
          <motion.div 
            className="character"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            👦
          </motion.div>
          <motion.div 
            className="character"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            👧
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="opening-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
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

            <motion.button
              className="btn-secondary"
              onClick={handleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Palette size={20} />
              <span>Tema</span>
            </motion.button>
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
          >
            📚
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
          >
            ⭐
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OpeningStory;