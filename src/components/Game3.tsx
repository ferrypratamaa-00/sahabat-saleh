import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import FeedbackModal from './FeedbackModal';
// import toast from 'react-hot-toast';

interface Recipient {
  id: string;
  name: string;
  emoji: string;
  image: string;
  need: number;
  received: number;
  message: string;
  audio: string;
}

interface Game3Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game3: React.FC<Game3Props> = memo(({ onBack, onComplete }) => {
  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    // Initialize game with random recipients
    const numRecipients = Math.floor(Math.random() * 2) + 2; // 2-3 recipients
    const allRecipients = [
      { name: 'Adik Kecil', emoji: '👶', image: '/images/game3/recipient_baby.png', message: 'Terima kasih kakak!', audio: '/audio/terima_kasih_kakak.mp3' },
      { name: 'Teman', emoji: '👧', image: '/images/game3/recipient_friend.png', message: 'Barakallah!', audio: '/audio/barakallah.mp3' },
      { name: 'Nenek', emoji: '👵', image: '/images/game3/recipient_grandma.png', message: 'MasyaAllah!', audio: '/audio/masyaallah.mp3' },
      { name: 'Kucing', emoji: '🐱', image: '/images/game3/recipient_cat.png', message: 'Meow~', audio: '/audio/meow.mp3' },
    ];

    return allRecipients
      .sort(() => Math.random() - 0.5)
      .slice(0, numRecipients)
      .map((r, idx) => ({
        id: `recipient-${idx}`,
        ...r,
        need: Math.floor(Math.random() * 3) + 2, // 2-4 apples each
        received: 0,
      }));
  });

  const [apples, setApples] = useState<Array<{ id: string; x: number; y: number }>>(() => {
    // Create apples based on recipients
    const totalApples = recipients.reduce((sum, r) => sum + r.need, 0);
    return Array.from({ length: totalApples }, (_, i) => ({
      id: `apple-${i}`,
      x: Math.random() * 60,
      y: Math.random() * 60,
    }));
  });

  const [draggedApple, setDraggedApple] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<{isOpen: boolean, type: 'success' | 'error' | 'info', title: string, message: string} | null>(null);
  const audioManager = AudioManager.getInstance();
  const basketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioManager.playInstruction('/audio/ayo_berbagi.mp3');
  }, []);

  const handleDragStart = (appleId: string) => {
    setDraggedApple(appleId);
    audioManager.playClick();
  };

  const handleDrop = (recipientId: string) => {
    if (!draggedApple) return;

    const recipient = recipients.find(r => r.id === recipientId);
    if (!recipient || recipient.received >= recipient.need) {
      audioManager.playSound('/audio/sudah_cukup.mp3');
      // toast.error('Sudah cukup ya!', { icon: '😊' });
      setFeedback({
          isOpen: true,
          type: 'info', // Or Keep it subtle? User asked for big X for wrong. This is "Info".
          title: 'Sudah Cukup',
          message: 'Dia sudah punya cukup apel! 😊'
      });
      setDraggedApple(null);
      return;
    }

    // Remove apple from basket
    setApples(prev => prev.filter(a => a.id !== draggedApple));
    
    // Update recipient
    const newRecipients = recipients.map(r => 
      r.id === recipientId ? { ...r, received: r.received + 1 } : r
    );
    setRecipients(newRecipients);

    audioManager.playCorrect();
    // audioManager.playSound('/audio/nambah_apel.mp3'); // Optional effect if we had a coin sound

    const updatedRecipient = newRecipients.find(r => r.id === recipientId);
    if (updatedRecipient && updatedRecipient.received === updatedRecipient.need) {
      // toast.success(updatedRecipient.message, { 
      //   icon: updatedRecipient.emoji,
      //   duration: 2000 
      // });
      // Play specific thank you audio
      audioManager.stopAll();
      audioManager.playSound(updatedRecipient.audio);
    }

    // Check if all complete
    if (newRecipients.every(r => r.received === r.need)) {
      setTimeout(() => {
        setIsComplete(true);
        audioManager.stopAll(true); // Stop instructions/BGM? No, keep BGM. Stop instructions.
        // Actually, update stopAll usage to default (false) which keeps BGM.
        audioManager.stopAll(); 
        
        audioManager.playSound('/audio/bg_sound_win.wav', 0.3);
        audioManager.playSound('/audio/masyaallah_berbagi.mp3');
        // toast.success('Sempurna! Berbagi itu indah! 🎉', { duration: 3000 });
        setFeedback({
            isOpen: true,
            type: 'success',
            title: 'Sempurna!',
            message: 'Berbagi itu indah! 🎉'
        });
      }, 1000);
    }

    setDraggedApple(null);
  };

  return (
    <div className="game-container">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} /> Kembali
      </button>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="game-content"
      >
        <h2 className="game-title">🍎 Saatnya Berbagi</h2>
        
        <div className="game-instruction">
          <Heart className="inline-icon" size={24} />
          Seret apel dari keranjang ke yang membutuhkan!
        </div>

        {/* Basket with apples */}
        <motion.div 
          ref={basketRef}
          className="apple-basket"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="basket-label">🧺 Keranjang Apel</div>
          <div className="basket-content">
            <AnimatePresence>
              {apples.map((apple) => (
                <motion.div
                  key={apple.id}
                  className="draggable-apple"
                  draggable
                  onDragStart={() => handleDragStart(apple.id)}
                  onDragEnd={() => setDraggedApple(null)}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0, x: apple.x, y: apple.y }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ cursor: 'grab' }}
                >
                  <img src="/images/game3/item_apple.png" alt="Apel" style={{ width: '40px', height: '40px' }} />
                </motion.div>
              ))}
            </AnimatePresence>
            {apples.length === 0 && (
              <div className="basket-empty">Kosong!</div>
            )}
          </div>
        </motion.div>

        {/* Recipients */}
        <div className="recipients-grid">
          {recipients.map((recipient, index) => {
            const isComplete = recipient.received >= recipient.need;
            const progress = (recipient.received / recipient.need) * 100;

            return (
              <motion.div
                key={recipient.id}
                className={`recipient-card ${isComplete ? 'complete' : ''} ${draggedApple ? 'drop-zone' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(recipient.id)}
              >
                <div className="recipient-emoji">
                  <img src={recipient.image} alt={recipient.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
                <h4 className="recipient-name">{recipient.name}</h4>
                <div className="recipient-need">
                  Butuh: {recipient.need} apel
                </div>

                {/* Progress bar */}
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>

                {/* Received apples */}
                <div className="received-apples">
                  {Array.from({ length: recipient.received }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <img src="/images/game3/item_apple.png" alt="Apel" style={{ width: '20px', height: '20px' }} />
                    </motion.span>
                  ))}
                </div>

                {isComplete && (
                  <motion.div 
                    className="complete-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Sparkles size={20} /> Lengkap!
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {isComplete && (
          <motion.div 
            className="game-complete"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Sparkles size={48} className="sparkle-icon" />
            <h3>MasyaAllah! Berbagi itu indah! 🎉</h3>
          </motion.div>
        )}
      </motion.div>

       {feedback && (
          <FeedbackModal
            isOpen={feedback.isOpen}
            type={feedback.type}
            title={feedback.title}
            message={feedback.message}
            onClose={() => {
                const title = feedback?.title;
                setFeedback(null);
                if (title === 'Sempurna!') {
                    onComplete();
                }
            }}
          />
      )}
    </div>
  );
});

export default Game3;