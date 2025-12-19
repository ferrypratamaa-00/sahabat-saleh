import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number; // Close automatically after N ms
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  type, 
  title, 
  message, 
  onClose,
  autoCloseDelay
}) => {
  
  useEffect(() => {
    if (isOpen && type === 'success') {
      const end = Date.now() + 1000;
      const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    if (isOpen && autoCloseDelay) {
        const timer = setTimeout(onClose, autoCloseDelay);
        return () => clearTimeout(timer);
    }
  }, [isOpen, type, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="feedback-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <motion.div
          className={`feedback-content ${type}`}
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '2rem',
            textAlign: 'center',
            maxWidth: '90%',
            width: '400px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
            border: `4px solid ${
                type === 'success' ? '#4ade80' : 
                type === 'error' ? '#ef4444' : '#3b82f6'
            }`
          }}
          onClick={(e) => e.stopPropagation()}
        >
            
          {/* Background Decorations */}
          {type === 'success' && (
            <>
               <motion.div 
                 animate={{ y: [0, -20, 0] }} 
                 transition={{ duration: 2, repeat: Infinity }}
                 style={{ position: 'absolute', top: 10, left: 10, fontSize: '2rem', zIndex: 0 }}
                >
                  🎈
               </motion.div>
                <motion.div 
                 animate={{ y: [0, -30, 0] }} 
                 transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                 style={{ position: 'absolute', top: 20, right: 10, fontSize: '2rem', zIndex: 0 }}
                >
                  🎈
               </motion.div>
            </>
          )}

          <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: type === 'success' ? [0, 15, -15, 0] : 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: type === 'success' ? '#dcfce7' : type === 'error' ? '#fee2e2' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}
              >
                  {type === 'success' ? (
                      <Check size={60} color="#22c55e" strokeWidth={3} />
                  ) : type === 'error' ? (
                      <X size={60} color="#ef4444" strokeWidth={3} />
                  ) : (
                      <Star size={60} color="#3b82f6" fill="#3b82f6" />
                  )}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ 
                    fontSize: '2rem', 
                    fontWeight: 800,
                    color: type === 'success' ? '#15803d' : type === 'error' ? '#b91c1c' : '#1e40af',
                    marginBottom: '0.5rem'
                }}
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ 
                    fontSize: '1.2rem', 
                    color: '#4b5563',
                    marginBottom: '2rem',
                    lineHeight: 1.5
                }}
              >
                {message}
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                    background: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    width: '100%'
                }}
              >
                {type === 'success' ? 'Lanjut! 🚀' : 'Coba Lagi 💪'}
              </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default FeedbackModal;
