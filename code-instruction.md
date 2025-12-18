# 🕌 SAHABAT SALEH

## SUPER FINAL PROMPT (REFERENCE-BASED, CHILD PSYCHOLOGY FIRST)

**React + Vite | Interactive Educational Game for Kids (4–6)**

---

## 0️⃣ PERAN AI / COPILOT (WAJIB & MUTLAK)

Kamu bertindak sebagai:

> **Senior Frontend Engineer + Child Educational Game Designer**

Kamu WAJIB:

* Mengikuti **SEMUA instruksi ini secara literal**
* Meniru **FLOW, UX, dan INTERAKSI** dari reference gambar
* Tidak menambah asumsi sendiri
* Mengutamakan **keamanan psikologis anak**

Target:

> Game **interaktif, cerah, bersuara, animatif**, dan **tidak pernah error meski aset belum lengkap**

---

## 1️⃣ FILOSOFI DESAIN (PENTING)

Game ini **BUKAN quiz**, tapi:

* Bermain sambil belajar
* Eksplorasi
* Reward positif

### Prinsip Psikologis Anak:

* ✅ Warna cerah
* ✅ Teks besar
* ✅ Respon instan (suara + animasi)
* ❌ Tidak ada hukuman
* ❌ Tidak ada kata “salah” keras

---

## 2️⃣ FLOW APLIKASI (HARUS PERSIS)

```
Opening Story
   ↓
Menu Utama
   ↓
Daftar Game
   ↓
Mini Game
   ↓
Kembali ke Daftar
   ↓
Reward Akhir
```

---

## 3️⃣ STRUKTUR HALAMAN (WAJIB ADA)

### 📖 A. OPENING STORY (HALAMAN PERTAMA)

Checklist:

* [ ] Judul besar: **Petualangan Si Saleh & Si Salihah**
* [ ] Cerita pendek (1–2 kalimat):

  > “Hari ini Si Saleh dan Si Salihah ingin belajar menjadi anak yang baik…”
* [ ] Ilustrasi karakter (SafeImage)
* [ ] Tombol besar:

  * **Mulai Bermain**
  * **Pengaturan**
  * **Tema**

Behavior:

* Klik **Mulai Bermain** → Daftar Game
* Tidak ada auto-start

---

## 4️⃣ MENU / DAFTAR GAME

(REFERENCE: GAMBAR PERTAMA)

Checklist:

* [ ] Tampilan card (GameCard)
* [ ] Judul game + ikon emoji
* [ ] Deskripsi singkat
* [ ] Tombol **Mulai Bermain**
* [ ] Progress: `Game Selesai: X/5`
* [ ] Layout 2 kolom (desktop)

❗ Tidak langsung masuk game tanpa klik

---

## 5️⃣ GLOBAL RULE (BERLAKU UNTUK SEMUA GAME)

### Wajib:

* [ ] Tombol **Kembali** di kiri atas
* [ ] Suara saat klik
* [ ] Animasi hover / tap
* [ ] Teks besar & berwarna
* [ ] Respon instan

### Asset Safety:

* [ ] Image error → placeholder
* [ ] Audio error → silent
* [ ] Tidak crash

---

## 6️⃣ SAFE COMPONENTS (HARUS ADA)

### `SafeImage.jsx`

Checklist:

* [ ] `onError` fallback
* [ ] Default placeholder
* [ ] Tidak throw error

### `SafeAudio.jsx`

Checklist:

* [ ] `try/catch`
* [ ] Auto play optional
* [ ] Silent fail
* [ ] Bisa dipanggil berkali-kali

---

## 7️⃣ MINI GAME DETAIL (REFERENCE-BASED)

---

### 💧 GAME 1: WUDU SERU

(REFERENCE: GAMBAR KEDUA)

Checklist:

* [ ] Judul besar
* [ ] Step counter: `Langkah X dari 6`
* [ ] Nama langkah **warna hijau besar**
* [ ] Tiap langkah punya:

  * Gambar (tangan, mulut, hidung, dll)
  * Suara saat diklik
  * Animasi (scale / glow)

Behavior:

* Klik benar → suara sukses + animasi
* Klik salah → suara lembut
* Tidak reset progress

---

### 🔤 GAME 2: JEJAK HURUF HIJAIYAH

(REFERENCE: GAMBAR KETIGA)

Checklist:

* [ ] Teks besar: **Cari huruf: ALIF**
* [ ] Warna kontras
* [ ] Audio menyebut huruf
* [ ] 3–4 pilihan huruf
* [ ] Pilihan diacak setiap ronde

Behavior:

* Benar → “MasyaAllah!”
* Salah → “Coba lagi ya”
* Tidak ada skor keras

---

### 🍎 GAME 3: SAATNYA BERBAGI

(REFERENCE: GAMBAR KEEMPAT)

Checklist:

* [ ] Jumlah apel **random**
* [ ] Jumlah penerima **random**
* [ ] Tiap penerima punya kebutuhan berbeda
* [ ] Klik apel → berkurang
* [ ] Suara tiap klik

Behavior:

* Jika cukup → selesai
* Visual anak & hewan lucu
* Edukasi berbagi tanpa tekanan

---

### 👕 GAME 4: PAKAIAN KE MASJID

(REFERENCE: GAMBAR KELIMA)

Checklist:

* [ ] Pilihan pakaian **acak**
* [ ] Ada:

  * Baju Muslim
  * Gamis
  * Hijab
  * Pakaian tidak sopan
* [ ] Gambar besar & jelas
* [ ] Audio saat pilih

Behavior:

* Pilihan benar → animasi + suara
* Pilihan salah → lembut & disable

---

### 🕌 GAME 5: MENYUSUN GERAKAN SALAT

(REFERENCE: GAMBAR KEENAM)

Checklist:

* [ ] Gambar tiap gerakan
* [ ] Urutan diacak
* [ ] Drag / tap to place
* [ ] Slot langkah 1–3
* [ ] Warna hijau saat benar

Behavior:

* Benar → pujian
* Salah → bisa ulang tanpa reset

---

## 8️⃣ ANIMASI (WAJIB ADA)

* [ ] Scale on click
* [ ] Fade in
* [ ] Glow hijau saat benar
* [ ] Shake ringan saat salah

⚠️ Gunakan **CSS animation sederhana**

---

## 9️⃣ AUDIO FEEDBACK (GLOBAL)

Checklist:

* [ ] Klik
* [ ] Benar
* [ ] Salah
* [ ] Pujian
* [ ] Background music (loop, pelan)

---

## 🔟 REWARD AKHIR

Checklist:

* [ ] Bintang muncul satu-satu
* [ ] Suara “Alhamdulillah”
* [ ] Tombol **Main Lagi**
* [ ] Tidak reload page

---

## 1️⃣1️⃣ ROBUSTNESS CHECKLIST (WAJIB LOLOS)

* [ ] Asset kosong → aman
* [ ] Offline → tetap jalan
* [ ] State reset aman
* [ ] Tidak ada console error

---

# 📦 PWA + OFFLINE (FINAL EXTENSION)

## Checklist:

* [ ] `manifest.json`
* [ ] `sw.js`
* [ ] Cache First
* [ ] Semua asset lokal
* [ ] Installable
* [ ] Offline playable

Service Worker:

* Jangan fail install
* Jangan block UI
* Silent fallback

---

## 🔚 FINAL VALIDATION CHECKLIST

* [ ] Anak bisa klik tanpa baca
* [ ] Warna cerah & ramah
* [ ] Selalu ada respon
* [ ] Tidak ada tekanan psikologis
* [ ] Fun & engaging

---

## 🧠 FILOSOFI PENUTUP

> Anak belajar paling cepat
> saat mereka **merasa aman, senang, dan dihargai**.

---
