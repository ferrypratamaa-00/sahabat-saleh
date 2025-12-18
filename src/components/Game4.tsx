import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import toast from 'react-hot-toast';

interface ClothingItem {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
  description: string;
}

interface Game4Props {
  onBack: () => void;
  onComplete: () => void;
}

const Game4: React.FC<Game4Props> = ({ onBack, onComplete }) => {
  const [clothingOptions, setClothingOptions] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const audioManager = AudioManager.getInstance();

  const allClothing: ClothingItem[] = [
    { id: '1', name: 'Baju Koko', emoji: '👔', isCorrect: true, description: 'Baju yang sopan!' },
    { id: '2', name: 'Gamis', emoji: '🧕', isCorrect: true, description: 'Pakaian syar\'i!' },
    { id: '3', name: 'Peci', emoji: '🧢', isCorrect: true, description: 'Tutup kepala!' },
    { id: '4', name: 'Hijab', emoji: '🧕', isCorrect: true, description: 'Cantik dan sopan!' },
    { id: '5', name: 'Sarung', emoji: '👘', isCorrect: true, description: 'Pakaian ke masjid!' },
    { id: '6', name: 'Kaos Santai', emoji: '👕', isCorrect: false, description: 'Kurang sopan' },
    { id: '7', name: 'Celana Pendek', emoji: '🩳', isCorrect: false, description: 'Terlalu pendek' },
    { id: '8', name: 'Baju Renang', emoji: '🩱', isCorrect: false, description: 'Untuk berenang' },
  ];

  useEffect(() => {
    // Randomly select 6 items (4 correct, 2 wrong)
    const correctItems = allClothing.filter(c => c.isCorrect).sort(() => Math.random() - 0.5).slice(0, 4);
    const wrongItems = allClothing.filter(c => !c.isCorrect).sort(() => Math.random() - 0.5).slice(0, 2);
    
    const selected = [...correctItems, ...wrongItems].sort(() => Math.random() - 0.5);
    setClothingOptions(selected);
    
    audioManager.speak('Pilih pakaian yang sopan untuk ke masjid!');
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
      toast.error('Pilih pakaian dulu ya!', { icon: '👕' });
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
      audioManager.playWrong();
      toast.error('Ada yang kurang tepat. Coba lagi ya!', { 
        icon: '😊',
        duration: 2000 
      });
      
      setTimeout(() => {
        setSelectedItems([]);
        setShowResult(false);
      }, 2000);
    } else if (correctSelected.length >= 3) {
      audioManager.playCorrect();
      audioManager.speak('MasyaAllah! Pilihanmu sempurna!');
      toast.success('Sempurna! Pakaianmu sangat sopan! 🎉', { duration: 3000 });
      
      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      audioManager.speak('Bagus! Tapi coba pilih lebih banyak lagi!');
      toast('Bagus! Pilih lebih banyak lagi ya! 😊', { 
        icon: '👍',
        duration: 2000 
      });
      setShowResult(false);
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
                <div className="clothing-emoji">{item.emoji}</div>
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
    </div>
  );
};

export default Game4;