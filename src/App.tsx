import { useState, useEffect } from 'react';
import './App.css';
import OpeningStory from './components/OpeningStory';
import GameMenu from './components/GameMenu';
import Game1 from './components/Game1';
import Game2 from './components/Game2';
import Game3 from './components/Game3';
import Game4 from './components/Game4';
import Game5 from './components/Game5';
import Reward from './components/Reward';
import AudioManager from './utils/AudioManager';
import { Toaster } from 'react-hot-toast';

type Page = 'opening' | 'menu' | 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'reward';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('opening');
  const [completedGames, setCompletedGames] = useState<Set<number>>(new Set());
  const audioManager = AudioManager.getInstance();

  // Stop audio saat pindah halaman
  useEffect(() => {
    audioManager.stopAll();
  }, [currentPage]);

  const games = [
    { id: 1, title: 'Wudu Seru', emoji: '💧', description: 'Belajar wudu dengan seru', completed: completedGames.has(1) },
    { id: 2, title: 'Jejak Huruf Hijaiyah', emoji: '🔤', description: 'Cari huruf hijaiyah', completed: completedGames.has(2) },
    { id: 3, title: 'Saatnya Berbagi', emoji: '🍎', description: 'Belajar berbagi', completed: completedGames.has(3) },
    { id: 4, title: 'Pakaian Ke Masjid', emoji: '👕', description: 'Pilih pakaian sopan', completed: completedGames.has(4) },
    { id: 5, title: 'Menyusun Gerakan Salat', emoji: '🕌', description: 'Susun gerakan salat', completed: completedGames.has(5) },
  ];

  const handleStart = () => setCurrentPage('menu');
  const handleSelectGame = (gameId: number) => {
    setCurrentPage(`game${gameId}` as Page);
  };
  const handleBack = () => setCurrentPage('menu');
  const handleComplete = (gameId: number) => {
    setCompletedGames(prev => new Set(prev).add(gameId));
    if (completedGames.size + 1 === games.length) {
      setCurrentPage('reward');
    } else {
      setCurrentPage('menu');
    }
  };
  const handlePlayAgain = () => {
    setCompletedGames(new Set());
    setCurrentPage('opening');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'opening':
        return <OpeningStory onStart={handleStart} onSettings={() => {}} onTheme={() => {}} />;
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
      <Toaster position="top-center" />
      {renderPage()}
    </div>
  );
}

export default App;
