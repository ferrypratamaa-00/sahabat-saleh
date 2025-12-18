import React, { useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Trophy } from 'lucide-react';
import AudioManager from '../utils/AudioManager';

interface Game {
  id: number;
  title: string;
  emoji: string;
  description: string;
  completed: boolean;
}

interface GameMenuProps {
  games: Game[];
  onSelectGame: (gameId: number) => void;
  completedCount: number;
}

const GameMenu: React.FC<GameMenuProps> = memo(({ games, onSelectGame, completedCount }) => {
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    // Only speak once on mount
    audioManager.speak('Pilih petualanganmu di peta perjalanan ini!');
  }, []); // Empty dependency array ensures this only runs once

  const handleSelectGame = (gameId: number) => {
    audioManager.playClick();
    onSelectGame(gameId);
  };

  const progressPercentage = (completedCount / games.length) * 100;

  return (
    <div className="game-menu">
      {/* Header with Progress */}
      <motion.div 
        className="menu-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="menu-title">🗺️ Peta Petualangan</h2>
        
        <div className="progress-container">
          <div className="progress-header">
            <Trophy className="trophy-icon" size={24} />
            <span className="progress-text">
              Pencapaian: {completedCount}/{games.length} Misi
            </span>
          </div>
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Roadmap Container */}
      <div className="roadmap-container">
        {/* Winding Line */}
        <div className="roadmap-line" />

        <div className="roadmap-items-wrapper" style={{ position: 'relative', width: '100%', zIndex: 1 }}>
          {/* Game Nodes */}
          {games.map((game, index) => {
            const isUnlocked = index === 0 || games[index - 1].completed;
            return (
              <motion.div
                key={game.id}
                className="roadmap-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Connector Dot on the line */}
                <div className={`roadmap-connector ${game.completed ? 'completed' : ''} ${!game.completed && isUnlocked ? 'active' : ''}`}>
                  {game.completed ? <CheckCircle size={18} /> : <span>{index + 1}</span>}
                </div>

                {/* Game Card */}
                <div className="roadmap-card-wrapper">
                  <motion.div
                    className={`game-card ${game.completed ? 'completed' : ''}`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectGame(game.id)}
                  >
                     {/* Decoration */}
                     <div className="card-corner-decoration" />

                    {/* Completed Badge */}
                    {game.completed && (
                      <motion.div 
                        className="completed-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle size={20} />
                      </motion.div>
                    )}

                    {/* Emoji Icon */}
                    <motion.div 
                      className="game-emoji"
                      animate={!game.completed && isUnlocked ? {
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {game.emoji}
                    </motion.div>

                    <div className="game-info">
                      <h3 className="game-card-title">{game.title}</h3>
                      <p className="game-card-description">{game.description}</p>
                    </div>

                    <motion.button
                      className="play-button"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play size={18} fill="currentColor" />
                      <span>{game.completed ? 'Main Lagi' : 'Mulai'}</span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {completedCount === games.length && (
        <motion.div 
          className="completion-message"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Trophy size={40} className="trophy-large" />
          <h3>Alhamdulillah! Semua misi selesai! 🎉</h3>
          <p>Kamu hebat! Ayo main lagi!</p>
        </motion.div>
      )}
    </div>
  );
});

export default GameMenu;