import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, RotateCcw, Sparkles } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import confetti from 'canvas-confetti';

interface RewardProps {
  onPlayAgain: () => void;
}

const Reward: React.FC<RewardProps> = ({ onPlayAgain }) => {
  const [stars, setStars] = useState(0);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    // Play success sound
    audioManager.playCorrect();
    audioManager.speak('Alhamdulillah! Kamu hebat!');

    // Show stars one by one
    const interval = setInterval(() => {
      setStars(prev => {
        if (prev < 5) {
          audioManager.playClick();
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    // Trigger confetti after all stars appear
    const confettiTimeout = setTimeout(() => {
      fireConfetti();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(confettiTimeout);
    };
  }, []);

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handlePlayAgain = () => {
    audioManager.playClick();
    onPlayAgain();
  };

  return (
    <div className="reward-container">
      <motion.div 
        className="reward-content"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Trophy Icon */}
        <motion.div
          className="reward-trophy"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        >
          <Trophy size={80} className="trophy-icon-large" />
        </motion.div>

        {/* Title */}
        <motion.h2 
          className="reward-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          🎉 Alhamdulillah! 🎉
        </motion.h2>

        <motion.p 
          className="reward-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Kamu berhasil menyelesaikan permainan!
        </motion.p>

        {/* Stars Animation */}
        <div className="reward-stars">
          <AnimatePresence>
            {[...Array(5)].map((_, index) => (
              index < stars && (
                <motion.div
                  key={index}
                  className="reward-star"
                  initial={{ scale: 0, rotate: -180, y: -100 }}
                  animate={{ 
                    scale: [0, 1.3, 1],
                    rotate: 0,
                    y: 0
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    delay: index * 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Star 
                    size={60} 
                    fill="#fbbf24" 
                    color="#f59e0b"
                    className="star-icon"
                  />
                  <motion.div
                    className="star-sparkle"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.4
                    }}
                  >
                    <Sparkles size={30} />
                  </motion.div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Praise Message */}
        {stars >= 5 && (
          <motion.div
            className="praise-message"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.2, type: "spring" }}
          >
            <p className="praise-text">
              Kamu anak yang hebat! Terus belajar dan bermain ya! ✨
            </p>
          </motion.div>
        )}

        {/* Play Again Button */}
        {stars >= 5 && (
          <motion.button
            className="play-again-btn"
            onClick={handlePlayAgain}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
            <span>Main Lagi</span>
          </motion.button>
        )}

        {/* Floating Decorations */}
        <div className="floating-decorations">
          {['🎈', '🎊', '⭐', '🌟', '💫'].map((emoji, i) => (
            <motion.div
              key={i}
              className="floating-emoji"
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -200,
                x: Math.sin(i) * 50
              }}
              transition={{
                duration: 3,
                delay: 2 + i * 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reward;