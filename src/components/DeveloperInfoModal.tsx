import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface DeveloperInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperInfoModal: React.FC<DeveloperInfoModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="feedback-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <motion.div
          className="developer-info-content"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '2rem',
            textAlign: 'center',
            maxWidth: '90%',
            width: '400px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
            border: '4px solid #8b5cf6' // Violet-500
          }}
          onClick={(e) => e.stopPropagation()}
        >
            
          <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#ede9fe', // Violet-100
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}
              >
                  <Info size={60} color="#8b5cf6" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ 
                    fontSize: '2rem', 
                    fontWeight: 800,
                    color: '#6d28d9', // Violet-700
                    marginBottom: '1rem'
                }}
              >
                Detail Pengembang
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ 
                    fontSize: '1.25rem', 
                    color: '#4b5563',
                    marginBottom: '2rem',
                    lineHeight: 1.6
                }}
              >
                <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Developer: Ahmad Attijani</p>
                <p style={{ marginBottom: '0.5rem' }}>(TK Kusuma Probolinggo)</p>
                <p>No. HP: 085211788020</p>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    width: '100%'
                }}
              >
                Tutup
              </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default DeveloperInfoModal;
