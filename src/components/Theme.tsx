import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import AudioManager from '../utils/AudioManager';

interface ThemeProps {
  onBack: () => void;
}

const Theme: React.FC<ThemeProps> = ({ onBack }) => {
  const audioManager = AudioManager.getInstance();

  const themes = [
    { 
      id: 'default', 
      name: 'Hijau Segar', 
      primary: '#10B981', 
      hover: '#059669', 
      soft: '#D1FAE5',
      secondary: '#F59E0B',
      secondaryHover: '#D97706'
    },
    { 
      id: 'blue', 
      name: 'Biru Langit', 
      primary: '#3B82F6', 
      hover: '#2563EB', 
      soft: '#DBEAFE',
      secondary: '#F59E0B', // Keep orange as accent or maybe swap? Let's keep consistent accent for now or maybe complement
      secondaryHover: '#D97706'
    },
    { 
      id: 'pink', 
      name: 'Merah Jambu', 
      primary: '#EC4899', 
      hover: '#DB2777', 
      soft: '#FCE7F3',
      secondary: '#8B5CF6', // Purple accent for pink
      secondaryHover: '#7C3AED'
    },
    { 
      id: 'purple', 
      name: 'Ungu Ceria', 
      primary: '#8B5CF6', 
      hover: '#7C3AED', 
      soft: '#EDE9FE',
      secondary: '#EC4899', // Pink accent for purple
      secondaryHover: '#DB2777'
    }
  ];

  const changeTheme = (theme: any) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-hover', theme.hover);
    root.style.setProperty('--primary-soft', theme.soft);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--secondary-hover', theme.secondaryHover);
    root.style.setProperty('--warning', theme.secondary); // Update warning/border too if we use it for border
    audioManager.playClick();
  };

  return (
    <div className="theme-page" style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      textAlign: 'center',
      background: 'var(--bg-card)',
      borderRadius: '2rem',
      maxWidth: '800px',
      margin: '2rem auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>🎨 Pilih Tema</h1>
      
      <div className="themes-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            onClick={() => changeTheme(theme)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: theme.primary,
              border: 'none',
              borderRadius: '1rem',
              padding: '2rem 1rem',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: theme.primary 
              }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{theme.name}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        className="btn-back"
        onClick={() => {
          audioManager.playClick();
          onBack();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '3rem',
          background: 'var(--warning)',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '999px',
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '3rem auto 0'
        }}
      >
        <ArrowLeft /> Kembali
      </motion.button>
    </div>
  );
};

export default Theme;
