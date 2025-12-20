import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import './App.css';
import OpeningStory from './components/OpeningStory';
import GameMenu from './components/GameMenu';
import Reward from './components/Reward';
import Settings from './components/Settings';
import Theme from './components/Theme';
import AudioManager from './utils/AudioManager';
import { Toaster } from 'react-hot-toast';
import { Volume } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load game components
const Game1 = lazy(() => import('./components/Game1'));
const Game2 = lazy(() => import('./components/Game2'));
const Game3 = lazy(() => import('./components/Game3'));
const Game4 = lazy(() => import('./components/Game4'));
const Game5 = lazy(() => import('./components/Game5'));

type Page = 'opening' | 'menu' | 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'reward' | 'settings' | 'theme';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('opening');
  const [completedGames, setCompletedGames] = useState<Set<number>>(new Set());
  const audioManager = AudioManager.getInstance();

  // Stop audio saat pindah halaman
  useEffect(() => {
    // We might want to keep background audio? But for now stop speech.
    audioManager.stopAll();
  }, [currentPage]);

  const games = [
    { id: 1, title: 'Wudu Seru', emoji: '💧', image: '/images/game1/wudu_muka.png', description: 'Belajar wudu dengan seru', completed: completedGames.has(1) },
    { id: 2, title: 'Jejak Huruf', emoji: '🔤', image: '/images/game2/blackboard_bg.png', description: 'Cari huruf hijaiyah', completed: completedGames.has(2) },
    { id: 3, title: 'Berbagi', emoji: '🍎', image: '/images/game3/item_basket.png', description: 'Belajar berbagi', completed: completedGames.has(3) },
    { id: 4, title: 'Pakaian', emoji: '👕', image: '/images/game4/clothes_koko.png', description: 'Pilih pakaian sopan', completed: completedGames.has(4) },
    { id: 5, title: 'Salat', emoji: '🕌', image: '/images/game5/salat_takbir.png', description: 'Susun gerakan salat', completed: completedGames.has(5) },
  ];

  const handleStart = useCallback(() => {
    setCurrentPage('menu');
    audioManager.playBackgroundMusic('/audio/bg_music.mp3', 0.2);
  }, []);

  const handleSettings = useCallback(() => setCurrentPage('settings'), []);

  const handleSelectGame = useCallback((gameId: number) => {
    setCurrentPage(`game${gameId}` as Page);
  }, []);

  const handleBack = useCallback(() => setCurrentPage('menu'), []);

  const handleComplete = useCallback((gameId: number) => {
    setCompletedGames(prev => {
      const newSet = new Set(prev);
      newSet.add(gameId);
      if (newSet.size === games.length) {
         setTimeout(() => setCurrentPage('reward'), 0);
      } else {
         setTimeout(() => setCurrentPage('menu'), 0);
      }
      return newSet;
    });
  }, [games.length]);

  const handlePlayAgain = useCallback(() => {
    setCompletedGames(new Set());
    setCurrentPage('opening');
  }, []);

  const renderPage = () => {
    return (
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem', color: 'var(--primary)' }}>
          Loading... ⌛
        </div>
      }>
        {(() => {
          switch (currentPage) {
            case 'opening':
              return <OpeningStory onStart={handleStart} onSettings={handleSettings} />;
            case 'settings':
              return <Settings onBack={() => setCurrentPage('opening')} />;
            case 'theme':
              return <Theme onBack={() => setCurrentPage('opening')} />;
            case 'menu':
              return <GameMenu games={games} onSelectGame={handleSelectGame} completedCount={completedGames.size} />;
            case 'game1':
              return <Game1 onBack={handleBack} onComplete={() => handleComplete(1)} />;
            case 'game2':
              return <Game2 onBack={handleBack} onComplete={() => handleComplete(2)} />;
            case 'game3':
              return <Game3 onBack={handleBack} onComplete={() => handleComplete(3)} />;
            case 'game4':
              return <Game4 onBack={handleBack} onComplete={() => handleComplete(4)} />;
            case 'game5':
              return <Game5 onBack={handleBack} onComplete={() => handleComplete(5)} />;
            case 'reward':
              return <Reward onPlayAgain={handlePlayAgain} />;
            default:
              return <div>Page not found</div>;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="app">
      {/* <BackgroundDecorations /> - Temporarily disabled for debugging */}
      
      {/* Global Replay Instruction Button (Except Opening) */}
      {currentPage !== 'opening' && (
        <motion.button
          // className="btn-global-replay"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => audioManager.replayInstruction()}
          style={{
            position: 'fixed',
            top: 'clamp(1rem, 3vw, 1.5rem)',
            right: 'clamp(1rem, 3vw, 1.5rem)',
            background: 'white',
            border: '2px solid var(--primary)',
            borderRadius: '50%',
            width: 'clamp(2.5rem, 5vw, 3rem)',
            height: 'clamp(2.5rem, 5vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Volume size={24} stroke="var(--primary)" />
        </motion.button>
      )}

      <Toaster position="top-center" />
      {renderPage()}
    </div>
  );
}

export default React.memo(App);
