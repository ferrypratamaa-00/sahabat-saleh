Siap 👍
# 🧪 SAHABAT SALEH

## ✅ PRODUCTION PWA CHECKLIST

**Game Edukatif Anak 4–6 Tahun (React + Vite)**

Checklist ini dipakai **SETELAH fitur selesai**, sebelum:

* publish
* demo ke stakeholder
* rilis ke orang tua / sekolah

---

## 1️⃣ BUILD & DEPLOY CHECKLIST

* [ ] `npm run build` **tanpa error**
* [ ] Folder `dist/` terbentuk sempurna
* [ ] Tidak ada warning critical di console
* [ ] Ukuran bundle wajar (< 5–8 MB ideal)

👉 Analogi: ini seperti **cek mesin mobil sebelum jalan jauh**

---

## 2️⃣ PWA CORE CHECKLIST (WAJIB)

### Manifest

* [ ] `manifest.json` valid
* [ ] `name` & `short_name` benar
* [ ] `display: standalone`
* [ ] `start_url: "/"`

### Icon

* [ ] `icon-192.png` ada
* [ ] `icon-512.png` ada
* [ ] Icon muncul saat install

---

## 3️⃣ SERVICE WORKER CHECKLIST

### Registrasi

* [ ] Service Worker ter-register
* [ ] Tidak ada error saat install
* [ ] Tidak blocking UI

### Cache

* [ ] HTML ter-cache
* [ ] JS bundle ter-cache
* [ ] CSS ter-cache
* [ ] Image ter-cache
* [ ] Audio ter-cache

### Update

* [ ] Cache lama terhapus saat versi berubah
* [ ] App tetap jalan saat update

👉 **Prinsip:** cache first, bukan network first

---

## 4️⃣ OFFLINE MODE CHECKLIST (SUPER PENTING)

Lakukan **manual test**:

* [ ] Buka app (online)
* [ ] Aktifkan airplane mode
* [ ] Reload app
* [ ] App tetap terbuka
* [ ] Semua game bisa dimainkan
* [ ] Audio masih bisa diputar
* [ ] Tidak ada blank screen

Jika **1 item gagal → belum production ready**

---

## 5️⃣ ASSET SAFETY CHECKLIST

### Image

* [ ] Image hilang → fallback placeholder
* [ ] Tidak ada broken image icon
* [ ] Tidak crash component

### Audio

* [ ] Audio gagal load → silent
* [ ] Tidak freeze UI
* [ ] Game tetap bisa lanjut

👉 Analogi: **ban serep**, bukan berhenti total

---

## 6️⃣ UX ANAK (CHILD-FIRST CHECKLIST)

* [ ] Semua teks **besar & jelas**
* [ ] Kontras warna tinggi
* [ ] Tombol minimal 48px
* [ ] Tidak ada teks panjang
* [ ] Bisa dimainkan tanpa membaca

---

## 7️⃣ PSIKOLOGI ANAK CHECKLIST

* [ ] Tidak ada kata “Salah!”
* [ ] Tidak ada bunyi mengejutkan
* [ ] Feedback selalu positif
* [ ] Salah → ajakan lembut
* [ ] Benar → pujian

👉 Anak harus **merasa aman, bukan diuji**

---

## 8️⃣ INTERAKSI & ANIMASI CHECKLIST

* [ ] Semua klik ada respon
* [ ] Animasi ringan (scale / glow)
* [ ] Tidak ada delay panjang
* [ ] Tidak bikin pusing (no flashing)

---

## 9️⃣ NAVIGASI CHECKLIST

* [ ] Tombol **Kembali** ada di semua game
* [ ] Kembali tidak reset seluruh app
* [ ] State reset aman saat keluar game
* [ ] Tidak ada dead-end screen

---

## 🔟 RANDOMIZATION CHECKLIST

Pastikan game **tidak monoton**:

* [ ] Wudu step visual tetap konsisten
* [ ] Hijaiyah random urutan
* [ ] Berbagi random:

  * jumlah apel
  * jumlah penerima
* [ ] Pakaian random
* [ ] Urutan salat diacak

---

## 1️⃣1️⃣ PERFORMANCE CHECKLIST

* [ ] First load < 3 detik
* [ ] Offline load < 1 detik
* [ ] Tidak ada lag saat klik
* [ ] Audio tidak delay

---

## 1️⃣2️⃣ SECURITY & CHILD SAFETY

* [ ] Tidak ada API call eksternal
* [ ] Tidak ada analytics
* [ ] Tidak ada tracking
* [ ] Tidak minta permission aneh
* [ ] Aman dimainkan offline

---

## 1️⃣3️⃣ INSTALL EXPERIENCE CHECKLIST

### Mobile

* [ ] Bisa “Add to Home Screen”
* [ ] Launch fullscreen
* [ ] Tidak ada address bar

### Desktop

* [ ] Bisa install dari browser
* [ ] Icon muncul di app list

---

## 1️⃣4️⃣ FINAL ACCEPTANCE TEST (WAJIB)

Simulasi nyata:

* [ ] Anak bisa klik tanpa instruksi
* [ ] Anak tertarik > 5 menit
* [ ] Tidak frustasi
* [ ] Mau mengulang main

Jika anak **minta main lagi** → LULUS 🎉

---

## 🧠 RINGKASAN (Pareto 20%)

* **Offline aman**
* **Tidak crash walau asset kosong**
* **Respon instan + audio**
* **Psikologis anak terjaga**
* **Installable PWA**
