import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import OpeningStory from './components/OpeningStory';
import GameMenu from './components/GameMenu';
import Game1 from './components/Game1';
import Game2 from './components/Game2';
import Game3 from './components/Game3';
import Game4 from './components/Game4';
import Game5 from './components/Game5';
import Reward from './components/Reward';
import Settings from './components/Settings';
import Theme from './components/Theme';
import AudioManager from './utils/AudioManager';
import { Toaster } from 'react-hot-toast';
import BackgroundDecorations from './components/BackgroundDecorations';

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

  const handleStart = useCallback(() => setCurrentPage('menu'), []);
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
  };

  return (
    <div className="app">
      <BackgroundDecorations />
      <Toaster position="top-center" />
      {renderPage()}
    </div>
  );
}

export default React.memo(App);
