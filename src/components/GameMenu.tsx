import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Trophy, Star } from 'lucide-react';
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

const GameMenu: React.FC<GameMenuProps> = ({ games, onSelectGame, completedCount }) => {
  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    audioManager.speak('Pilih game yang ingin dimainkan!');
  }, []);

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
        <h2 className="menu-title">🎮 Pilih Petualangan</h2>
        
        <div className="progress-container">
          <div className="progress-header">
            <Trophy className="trophy-icon" size={24} />
            <span className="progress-text">
              Game Selesai: {completedCount}/{games.length}
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
          <div className="stars-earned">
            {[...Array(games.length)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: i < completedCount ? 1 : 0.5,
                  rotate: 0,
                  opacity: i < completedCount ? 1 : 0.3
                }}
                transition={{ delay: i * 0.1 }}
              >
                <Star 
                  size={28} 
                  fill={i < completedCount ? "#fbbf24" : "none"}
                  color="#fbbf24"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.div 
        className="games-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            className={`game-card ${game.completed ? 'completed' : ''}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)"
            }}
            onClick={() => handleSelectGame(game.id)}
          >
            {/* Completed Badge */}
            {game.completed && (
              <motion.div 
                className="completed-badge"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={24} />
              </motion.div>
            )}

            {/* Game Emoji */}
            <motion.div 
              className="game-emoji"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {game.emoji}
            </motion.div>

            {/* Game Info */}
            <div className="game-info">
              <h3 className="game-card-title">{game.title}</h3>
              <p className="game-card-description">{game.description}</p>
            </div>

            {/* Play Button */}
            <motion.button
              className="play-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectGame(game.id);
              }}
            >
              <Play size={18} />
              <span>{game.completed ? 'Main Lagi' : 'Mulai Bermain'}</span>
            </motion.button>

            {/* Decorative corner */}
            <div className="card-corner-decoration"></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Completion Message */}
      {completedCount === games.length && (
        <motion.div 
          className="completion-message"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Trophy size={40} className="trophy-large" />
          <h3>Alhamdulillah! Semua game sudah selesai! 🎉</h3>
          <p>Kamu hebat! Coba main lagi untuk lebih mahir!</p>
        </motion.div>
      )}
    </div>
  );
};

export default GameMenu;