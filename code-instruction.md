# 🕌 SAHABAT SALEH

## MVP FULL PROJECT GENERATION PROMPT

**Game Edukatif PAI Anak Usia 4–6 Tahun**
**Vite + React | Mini Games | Audio-Visual First**

---

## 0. PERAN AI / COPILOT (WAJIB DIIKUTI)

Kamu bertindak sebagai:

> **Senior Frontend Engineer + Educational Game Designer (Early Childhood)**

Tugas kamu:

* Menghasilkan **SELURUH SOURCE CODE MVP**
* Mengikuti **dokumen ini secara literal**
* Tidak menambah asumsi di luar instruksi
* Menghasilkan kode yang:

  * stabil
  * readable
  * mudah dikembangkan

---

## 1. TUJUAN MVP

Membangun **game edukatif digital bernama *Sahabat Saleh*** dengan karakter ramah anak, berisi mini-games singkat untuk pengenalan:

* Ibadah dasar
* Akhlak terpuji
* Adab sehari-hari

Target:

* Anak usia **4–6 tahun**
* Durasi bermain **5–10 menit**
* **Tanpa teks panjang**
* **Audio & visual dominan**

---

## 2. PRINSIP DESAIN (HARD RULE)

### 2.1 Prinsip Edukasi Anak

* ❌ Tidak ada hukuman
* ❌ Tidak ada “salah / gagal”
* ✅ Feedback lembut
* ✅ Dorongan positif

### 2.2 Prinsip UX

* Tap / click besar
* Drag sederhana
* Tidak butuh skill baca

### 2.3 Prinsip Teknis

* Kode **modular**
* Tidak hardcode asset
* Semua mini-game **isolated**
* Mudah replace asset (image/audio)

---

## 3. TECH STACK (FIX – JANGAN DIUBAH)

* React (Vite)
* JavaScript (bukan TypeScript)
* CSS biasa
* React Hooks:

  * `useState`
  * `useEffect`
  * `useRef`
* HTML5 Audio API

❌ Redux
❌ UI framework
❌ Canvas / Phaser
❌ Library berat

---

## 4. STRUKTUR FOLDER (WAJIB SAMA)

```txt
src/
├── assets/
│   ├── images/
│   │   ├── character.png
│   │   ├── mosque.png
│   │   ├── star.png
│   │   └── placeholder.png
│   └── audio/
│       ├── bg-music.mp3
│       ├── success.mp3
│       ├── try-again.mp3
│       └── click.mp3
│
├── components/
│   ├── AudioPlayer.tsx
│   ├── Button.tsx
│   ├── GameCard.tsx
│   └── ProgressStars.tsx
│
├── games/
│   ├── WuduGame.tsx
│   ├── HijaiyahGame.tsx
│   ├── SharingGame.tsx
│   ├── DressGame.tsx
│   └── PrayerOrderGame.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── GameHub.tsx
│   └── Reward.tsx
│
├── data/
│   └── gamesConfig.js
│
├── styles/
│   └── global.css
│
├── App.tsx
└── main.tsx
```

---

## 5. APLIKASI FLOW (TIDAK BOLEH BERUBAH)

```
Home
 ↓
GameHub
 ↓
Mini Game (berurutan)
 ↓
Reward
```

---

## 6. GAME CONFIGURATION (SINGLE SOURCE OF TRUTH)

### `gamesConfig.js`

```js
export const games = [
  {
    id: "wudu",
    title: "Wudu Seru",
    component: "WuduGame",
    duration: 120
  },
  {
    id: "hijaiyah",
    title: "Jejak Hijaiyah",
    component: "HijaiyahGame",
    duration: 150
  },
  {
    id: "sharing",
    title: "Saatnya Berbagi",
    component: "SharingGame",
    duration: 90
  },
  {
    id: "dress",
    title: "Ke Masjid",
    component: "DressGame",
    duration: 120
  },
  {
    id: "prayer",
    title: "Gerakan Salat",
    component: "PrayerOrderGame",
    duration: 150
  }
];
```

GameHub HARUS:

* membaca config ini
* render game dinamis
* urutan mengikuti array

---

## 7. GLOBAL AUDIO SYSTEM

### `AudioPlayer.tsx`

Fungsi:

* memainkan audio
* reusable
* aman jika audio gagal load

Requirement:

* props:

  * `src`
  * `autoPlay`
  * `loop`
* gunakan `useRef`
* tidak crash
* silent error

---

## 8. HOME PAGE (`Home.tsx`)

Isi:

* Judul: **Sahabat Saleh**
* Gambar karakter
* Tombol besar **Mulai Bermain**

Behavior:

* Klik tombol → masuk GameHub
* Background music mulai pelan (loop)

---

## 9. GAME HUB (`GameHub.tsx`)

### State Wajib

* `currentGameIndex`
* `completedGames`

### Responsibility

* Render mini-game aktif
* Kirim callback `onFinish()`
* Tampilkan progress ⭐

### Logic

* Setelah `onFinish` dipanggil:

  * tambah progress
  * lanjut ke game berikutnya
* Jika semua selesai → Reward page

---

## 10. MINI-GAME CONTRACT (WAJIB)

SEMUA mini-game HARUS:

* Menerima prop:

  ```js
  onFinish: () => void
  ```
* Tidak mengatur routing
* Tidak mengakses global state
* Mengatur logic internal sendiri

---

## 11. MINI-GAME DETAIL

### 11.1 WuduGame

**Konsep**
Klik urutan wudu.

```js
const steps = ["tangan", "mulut", "wajah", "kepala"];
```

Behavior:

* benar → success audio + animasi
* salah → try-again audio
* tidak reset

---

### 11.2 HijaiyahGame

**Konsep**
Pilih huruf yang disebut.

Behavior:

* tampil 3–4 huruf
* audio menyebut target
* klik benar → lanjut
* tanpa penalti

---

### 11.3 SharingGame

**Konsep**
Drag apel ke yang membutuhkan.

Behavior:

* HTML5 drag & drop
* minimal 2 apel
* setelah cukup → finish

---

### 11.4 DressGame

**Konsep**
Pilih pakaian ke masjid.

Behavior:

* pakaian benar → clickable
* pakaian salah → disabled
* feedback audio

---

### 11.5 PrayerOrderGame

**Konsep**
Susun urutan salat.

Order benar:

```
Berdiri → Rukuk → Sujud
```

Behavior:

* drag reorder
* jika urutan benar → finish

---

## 12. REWARD PAGE (`Reward.tsx`)

Isi:

* Bintang ⭐ muncul satu-satu
* Gambar Ka'bah
* Audio pujian
* Tombol **Main Lagi**

---

## 13. STYLE GUIDELINE (WAJIB)

* Font besar
* Kontras tinggi
* Button ≥ 48px
* Tidak ada teks panjang
* Ramah sentuhan

---

## 14. LARANGAN KERAS

❌ alert()
❌ error merah
❌ istilah teknis
❌ console.log berlebihan
❌ skor / ranking

---

## 15. EXPECTED RESULT

* `bun run dev` → langsung jalan
* Semua mini-game playable
* Asset dummy bisa diganti tanpa ubah logic
* Struktur rapi
* Siap jadi PWA / mobile

---

## 16. FILOSOFI PRODUK

> Anak belajar **bukan karena disuruh**,
> tapi karena **bermain itu menyenangkan**.

---

## 🔥 END OF MVP PROMPT

**Ikuti dokumen ini secara literal. Jangan improvisasi.**