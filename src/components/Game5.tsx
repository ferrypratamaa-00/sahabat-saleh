import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import FeedbackModal from './FeedbackModal';
// import toast from 'react-hot-toast';

interface Movement {
  id: string;
  name: string;
  emoji: string;
  image: string;
  order: number;
}

interface Game5Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game5: React.FC<Game5Props> = memo(({ onBack, onComplete }) => {
  const correctMovements: Movement[] = [
    { id: '1', name: 'Takbiratul Ihram', emoji: '🤲', image: '/images/game5/salat_takbir.png', order: 1 },
    { id: '2', name: 'Berdiri (Qiyam)', emoji: '🧍', image: '/images/game5/salat_berdiri.png', order: 2 },
    { id: '3', name: 'Ruku', emoji: '🙇', image: '/images/game5/salat_ruku.png', order: 3 },
    { id: '4', name: 'I\'tidal', emoji: '🧍', image: '/images/game5/salat_itidal.png', order: 4 },
    { id: '5', name: 'Sujud', emoji: '🙏', image: '/images/game5/salat_sujud.png', order: 5 },
    { id: '6', name: 'Duduk', emoji: '🧎', image: '/images/game5/salat_duduk.png', order: 6 },
  ];

  const [availableMovements, setAvailableMovements] = useState<Movement[]>(() => {
    return [...correctMovements].sort(() => Math.random() - 0.5);
  });
  const [sequence, setSequence] = useState<Movement[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string} | null>(null);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    audioManager.playInstruction('/audio/susun_gerakan.mp3');
  }, []);

  const handleDragStart = (movementId: string) => {
    setDraggedItem(movementId);
    audioManager.playClick();
  };

  const handleDropInSequence = (position: number) => {
    if (!draggedItem) return;

    const movement = availableMovements.find(m => m.id === draggedItem);
    if (!movement) return;

    // Remove from available
    setAvailableMovements(prev => prev.filter(m => m.id !== draggedItem));

    // Add to sequence at position
    const newSequence = [...sequence];
    newSequence.splice(position, 0, movement);
    setSequence(newSequence);

    audioManager.playClick();
    setDraggedItem(null);
  };

  const handleRemoveFromSequence = (movementId: string) => {
    const movement = sequence.find(m => m.id === movementId);
    if (!movement) return;

    // Remove from sequence
    setSequence(prev => prev.filter(m => m.id !== movementId));

    // Add back to available
    setAvailableMovements(prev => [...prev, movement]);

    audioManager.playClick();
  };

  const handleReset = () => {
    setAvailableMovements([...correctMovements].sort(() => Math.random() - 0.5));
    setSequence([]);
    audioManager.playClick();
    // toast('Ayo coba lagi!', { icon: '🔄' });
  };

  const handleCheck = () => {
    if (sequence.length !== correctMovements.length) {
      audioManager.playSound('/audio/belum_lengkap.mp3');
      setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Belum Lengkap',
          message: 'Susun semua gerakan ya!'
      });
      return;
    }

    // Check if order is correct
    const isCorrect = sequence.every((movement, index) => movement.order === correctMovements[index].order);

    if (isCorrect) {
      audioManager.playSound('/audio/bg_sound_win.wav', 0.3);
      setTimeout(() => {
        audioManager.playSound('/audio/urutan_benar.mp3');
      }, 1000);

      // toast.success('MasyaAllah! Sempurna! 🎉', { duration: 3000 });
      setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Sempurna!',
          message: 'Urutan salatmu benar! 🎉'
      });
      // setTimeout(onComplete, 4000);
    } else {
      audioManager.playSound('/audio/bg_sound_lose.wav', 0.2);
      audioManager.playSound('/audio/urutan_salah.mp3');
      setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Belum Tepat',
          message: 'Urutannya belum tepat. Coba lagi ya! 😊'
      });
      // toast.error('Urutannya belum tepat. Coba lagi ya! 😊', { duration: 2000 });
      
      setTimeout(() => {
        handleReset();
      }, 2000);
    }
  };

  const closeFeedback = () => {
    const title = feedback?.title;
    setFeedback(null);
    if (title === 'Sempurna!') {
        onComplete();
    }
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
        <h2 className="game-title">🕌 Menyusun Gerakan Salat</h2>
        
        <div className="game-instruction">
          <Sparkles className="inline-icon" size={24} />
          Seret gerakan ke urutan yang benar!
        </div>

        {/* Sequence Area */}
        <div className="sequence-area">
          <h3 className="sequence-title">Urutan Gerakan Salat:</h3>
          <div className="sequence-slots">
            <AnimatePresence>
              {sequence.length === 0 && (
                <motion.div
                  className="empty-sequence"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Seret gerakan ke sini
                </motion.div>
              )}
              {sequence.map((movement, index) => (
                <motion.div
                  key={movement.id}
                  className="sequence-item"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  onClick={() => handleRemoveFromSequence(movement.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="sequence-number">{index + 1}</div>
                  <div className="sequence-emoji">
                     <img src={movement.image} alt={movement.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  </div>
                  <div className="sequence-name">{movement.name}</div>
                  <div className="remove-hint">Klik untuk hapus</div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Drop zones between items */}
            {sequence.length < correctMovements.length && (
              <motion.div
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropInSequence(sequence.length)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                +
              </motion.div>
            )}
          </div>
        </div>

        {/* Available Movements */}
        <div className="available-movements">
          <h3 className="available-title">Gerakan yang Tersedia:</h3>
          <div className="movements-grid">
            {availableMovements.map((movement, index) => (
              <motion.div
                key={movement.id}
                className="movement-card"
                draggable
                onDragStart={() => handleDragStart(movement.id)}
                onDragEnd={() => setDraggedItem(null)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: 'grab' }}
              >
                <div className="movement-emoji">
                  <img src={movement.image} alt={movement.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
                <div className="movement-name">{movement.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {sequence.length > 0 && (
            <motion.button
              className="reset-btn"
              onClick={handleReset}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} /> Reset
            </motion.button>
          )}
          
          {sequence.length === correctMovements.length && (
            <motion.button
              className="check-btn"
              onClick={handleCheck}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} /> Cek Urutan
            </motion.button>
          )}
        </div>
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

export default Game5;