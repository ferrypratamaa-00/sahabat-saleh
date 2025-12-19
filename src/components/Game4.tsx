import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import FeedbackModal from './FeedbackModal';
// import toast from 'react-hot-toast';

interface ClothingItem {
  id: string;
  name: string;
  emoji: string;
  image: string;
  isCorrect: boolean;
  description: string;
}

interface Game4Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game4: React.FC<Game4Props> = memo(({ onBack, onComplete }) => {
  const [clothingOptions] = useState<ClothingItem[]>(() => {
    // Define items locally inside the initializer or use the static list but accessed safely
     const allClothing: ClothingItem[] = [
      { id: '1', name: 'Baju Koko', emoji: '👔', image: '/images/game4/clothes_koko.png', isCorrect: true, description: 'Baju yang sopan!' },
      { id: '2', name: 'Gamis', emoji: '🧕', image: '/images/game4/clothes_gamis.png', isCorrect: true, description: 'Pakaian syar\'i!' },
      { id: '3', name: 'Peci', emoji: '🧢', image: '/images/game4/clothes_peci.png', isCorrect: true, description: 'Tutup kepala!' },
      { id: '4', name: 'Hijab', emoji: '🧕', image: '/images/game4/clothes_hijab.png', isCorrect: true, description: 'Cantik dan sopan!' },
      { id: '5', name: 'Sarung', emoji: '👘', image: '/images/game4/clothes_sarung.png', isCorrect: true, description: 'Pakaian ke masjid!' },
      { id: '6', name: 'Kaos Santai', emoji: '👕', image: '/images/game4/clothes_tshirt.png', isCorrect: false, description: 'Kurang sopan' },
      { id: '7', name: 'Celana Pendek', emoji: '🩳', image: '/images/game4/clothes_shorts.png', isCorrect: false, description: 'Terlalu pendek' },
      { id: '8', name: 'Baju Renang', emoji: '🩱', image: '/images/game4/clothes_swimsuit.png', isCorrect: false, description: 'Untuk berenang' },
    ];

    const correctItems = allClothing.filter(c => c.isCorrect).sort(() => Math.random() - 0.5).slice(0, 4);
    const wrongItems = allClothing.filter(c => !c.isCorrect).sort(() => Math.random() - 0.5).slice(0, 2);
    
    return [...correctItems, ...wrongItems].sort(() => Math.random() - 0.5);
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{isOpen: boolean, type: 'success' | 'error', title: string, message: string} | null>(null);
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    audioManager.playInstruction('/audio/pilih_pakaian.mp3');
  }, []);

  const handleSelectClothing = (item: ClothingItem) => {
    if (showResult) return;
    
    audioManager.playClick();
    
    if (selectedItems.includes(item.id)) {
      // Deselect
      setSelectedItems(prev => prev.filter(id => id !== item.id));
    } else {
      // Select
      setSelectedItems(prev => [...prev, item.id]);
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      audioManager.playSound('/audio/pilih_pakaian_dulu.mp3');
      setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Belum Memilih',
          message: 'Pilih pakaian dulu ya!'
      });
      return;
    }

    setShowResult(true);
    audioManager.playClick();

    const correctSelected = selectedItems.filter(id => {
      const item = clothingOptions.find(c => c.id === id);
      return item?.isCorrect;
    });

    const wrongSelected = selectedItems.filter(id => {
      const item = clothingOptions.find(c => c.id === id);
      return !item?.isCorrect;
    });

    if (wrongSelected.length > 0) {
      audioManager.playSound('/audio/kurang_tepat.mp3');
      setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Kurang Tepat',
          message: 'Ada yang kurang tepat. Coba lagi ya!'
      });
      
      setTimeout(() => {
        setSelectedItems([]);
        setShowResult(false);
      }, 2000);
    } else if (correctSelected.length >= 3) {
      audioManager.playCorrect();
      setTimeout(() => {
         audioManager.playSound('/audio/pilihan_sempurna.mp3');
      }, 500);
      
      // toast.success('Sempurna! Pakaianmu sangat sopan! 🎉', { duration: 3000 });
      setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Sempurna!',
          message: 'Pakaianmu sangat sopan! 🎉'
      });
      
      // setTimeout(() => {
      //   onComplete();
      // }, 4000);
    } else {
      audioManager.playSound('/audio/pilih_lebih_banyak.mp3');
      setFeedback({
          isOpen: true,
          type: 'error', 
          title: 'Ayo Tambah',
          message: 'Pilih lebih banyak laki lagi ya! 😊'
      });
      setShowResult(false);
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
        <h2 className="game-title">👕 Pakaian ke Masjid</h2>
        
        <div className="game-instruction">
          <Sparkles className="inline-icon" size={24} />
          Pilih pakaian yang sopan untuk ke masjid! (Minimal 3)
        </div>

        <div className="selected-count">
          Dipilih: {selectedItems.length}
        </div>

        <div className="clothing-grid">
          {clothingOptions.map((item, index) => {
            const isSelected = selectedItems.includes(item.id);
            const showFeedback = showResult && isSelected;

            return (
              <motion.div
                key={item.id}
                className={`clothing-item ${isSelected ? 'selected' : ''} ${
                  showFeedback ? (item.isCorrect ? 'correct' : 'wrong') : ''
                }`}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleSelectClothing(item)}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="clothing-emoji">
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
                <div className="clothing-name">{item.name}</div>
                
                {isSelected && !showResult && (
                  <motion.div 
                    className="selection-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}

                {showFeedback && (
                  <motion.div 
                    className="feedback-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {item.isCorrect ? '✅' : '❌'}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {!showResult && selectedItems.length > 0 && (
          <motion.button
            className="submit-btn"
            onClick={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle size={20} /> Cek Pilihan
          </motion.button>
        )}
      </motion.div>
      {feedback && (
          <FeedbackModal
            isOpen={feedback.isOpen}
            type={feedback.type}
            title={feedback.title}
            message={feedback.message}
            onClose={closeFeedback}
            autoCloseDelay={feedback.type === 'error' ? 2500 : undefined}
          />
      )}
    </div>
  );
});

export default Game4;