import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

const BackgroundDecorations: React.FC = memo(() => {
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Client-side only calculation to avoid hydration mismatch if SSR (though this is SPA)
    const newStars = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: i * 0.2
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="background-decorations" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {/* Stars */}
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
          style={{
            position: 'absolute',
            fontSize: 'clamp(1rem, 2vw, 2rem)'
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Clouds & Decorative Emojis */}
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
        style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '4rem', opacity: 0.8 }} 
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
        style={{ position: 'absolute', top: '20%', right: '15%', fontSize: '3rem', opacity: 0.8 }} 
      >
        ⭐
      </motion.span>

      <motion.span
         className="float-emoji"
         animate={{ x: [-20, 20, -20] }}
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
         style={{ position: 'absolute', top: '60%', left: '5%', fontSize: '5rem', opacity: 0.6 }}
      >
        ☁️
      </motion.span>

      <motion.span
         className="float-emoji"
         animate={{ x: [20, -20, 20] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
         style={{ position: 'absolute', top: '40%', right: '5%', fontSize: '5rem', opacity: 0.6 }}
      >
         ☁️
      </motion.span>
       
       <motion.span
         className="float-emoji"
         animate={{ y: [-10, 10, -10] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
         style={{ position: 'absolute', bottom: '10%', left: '20%', fontSize: '4rem', opacity: 0.5 }}
      >
         ☁️
      </motion.span>
    </div>
  );
});

export default BackgroundDecorations;
