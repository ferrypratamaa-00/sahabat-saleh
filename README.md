# 🕌 Petualangan Si Saleh & Si Salihah

Game edukatif interaktif untuk anak 4-6 tahun belajar wudu, huruf hijaiyah, berbagi, dan salat!

## ✨ Fitur Utama

- **🎮 5 Game Interaktif & Challenging**
  - **Wudu Seru**: Urutan langkah-langkah wudu yang benar
  - **Jejak Huruf Hijaiyah**: Memory game dengan audio puzzle
  - **Saatnya Berbagi**: Drag & drop apel untuk berbagi
  - **Pakaian Ke Masjid**: Pilih pakaian yang sopan dengan multiple selection
  - **Menyusun Gerakan Salat**: Drag & drop urutan gerakan salat yang benar

- **🎨 Design Soft & Menarik**
  - Warna-warna pastel yang soft dan eye-friendly untuk anak
  - Animasi smooth dan engaging
  - Responsive design (mobile, tablet, desktop)

- **📱 PWA (Progressive Web App)**
  - Bisa diakses offline
  - Bisa di-install di home screen
  - Cepat dan smooth seperti native app

- **🔊 Audio Interaktif**
  - Text-to-Speech untuk panduan
  - Sound effects untuk feedback
  - Audio control yang smart (tidak loop tanpa perlu)

- **⭐ Gamification**
  - Progress tracking
  - Star rewards dengan animasi
  - Confetti celebration saat selesai

## 🚀 Quick Start

### Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Build untuk Production
\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📋 Requirements

- Node.js 16+
- Modern browser dengan support untuk:
  - Web Audio API
  - Service Workers
  - LocalStorage

## 🎯 Deployment

### Untuk Vercel
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Untuk Firebase Hosting
\`\`\`bash
npm install -g firebase-tools
firebase init
firebase deploy
\`\`\`

### Untuk Netlify
\`\`\`bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
\`\`\`

## 🔧 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Framer Motion** - Animations
- **Vite** - Build Tool
- **Canvas Confetti** - Celebration Effects
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📦 PWA Features

- ✅ Manifest.json untuk install ke home screen
- ✅ Service Worker untuk offline capability
- ✅ Meta tags untuk mobile optimization
- ✅ Viewport optimization

## 🎮 Game Rules

### Game 1: Wudu Seru
- Klik tombol untuk belajar urutan wudu
- Ikuti urutan yang benar
- Setiap step ditunjukkan dengan visual dan audio

### Game 2: Jejak Huruf Hijaiyah
- Dengarkan bunyi huruf
- Cari huruf yang sesuai
- Mini game memory berbasis audio

### Game 3: Saatnya Berbagi
- Seret apel dari keranjang ke orang yang membutuhkan
- Setiap orang membutuhkan jumlah berbeda
- Drop zone interaktif

### Game 4: Pakaian Ke Masjid
- Pilih pakaian yang sopan untuk ke masjid
- Minimal 3 pilihan harus benar
- Feedback visual untuk pilihan

### Game 5: Menyusun Gerakan Salat
- Seret gerakan salat ke urutan yang benar
- 6 gerakan total
- Verifikasi urutan dengan tombol "Cek Urutan"

## 📱 Mobile Optimization

- Viewport yang optimal untuk mobile
- Touch-friendly buttons dan interactions
- Fullscreen PWA mode
- Safe area support untuk notch/island

## 🐛 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support

Untuk bug reports atau feature requests, silakan buat issue di repository ini.

## 📄 License

MIT License - feel free to use for personal and commercial projects!

---

**Dibuat dengan ❤️ untuk anak-anak Muslim Indonesia** 🇮🇩
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
