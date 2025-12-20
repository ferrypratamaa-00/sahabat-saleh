const fs = require('fs');
const https = require('https');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/audio');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const phrases = {
    'niat.mp3': 'Niat bermimpi wudu',
    'niat_wudu.mp3': 'Niat untuk wudu',
    'cuci_tangan.mp3': 'Cuci tangan kanan dan kiri tiga kali',
    'berkumur.mp3': 'Berkumur tiga kali',
    'istinsyaq.mp3': 'Hirup air ke hidung tiga kali',
    'cuci_muka.mp3': 'Cuci muka tiga kali',
    'wudu_selesai.mp3': 'Alhamdulillah, wudu kamu sudah sempurna',
    'cuci_siku.mp3': 'Cuci tangan sampai siku tiga kali',
    'usap_kepala.mp3': 'Usap sebagian kepala',
    'usap_telinga.mp3': 'Usap kedua telinga',
    'cuci_kaki.mp3': 'Cuci kaki sampai mata kaki tiga kali',

    // Game 2 (Hijaiyah)
    'cari_huruf.mp3': 'Cari huruf',
    'huruf_alif.mp3': 'Alif',
    'huruf_ba.mp3': 'Ba',
    'huruf_ta.mp3': 'Ta',
    'huruf_tsa.mp3': 'Tsa',
    'huruf_jim.mp3': 'Jim',
    'huruf_ha.mp3': 'Ha',
    'huruf_kha.mp3': 'Kha',
    'huruf_dal.mp3': 'Dal',
    'huruf_dzal.mp3': 'Dzal',
    'huruf_ra.mp3': 'Ra',
    'benar_huruf_ini.mp3': 'MasyaAllah! Benar, ini huruf',
    'coba_dengarkan_lagi.mp3': 'Hmm, coba dengarkan lagi ya',
    'game2_selesai.mp3': 'Alhamdulillah! Kamu berhasil menemukan semua huruf dengan benar!',

    // Game 3 (Berbagi)
    'ayo_berbagi.mp3': 'Ayo berbagi apel kepada yang membutuhkan!',
    'terima_kasih_kakak.mp3': 'Terima kasih kakak!',
    'barakallah.mp3': 'Barakallah!',
    'masyaallah.mp3': 'MasyaAllah!',
    'meow.mp3': 'Meow~',
    'sudah_cukup.mp3': 'Sudah cukup ya!',
    'masyaallah_berbagi.mp3': 'MasyaAllah! Kamu sudah berbagi dengan semua orang!',
    'nambah_apel.mp3': 'Satu apel untukmu',

    // Game 4 (Pakaian)
    'pilih_pakaian.mp3': 'Pilih pakaian yang sopan untuk ke masjid!',
    'pilih_pakaian_dulu.mp3': 'Pilih pakaian dulu ya!',
    'kurang_tepat.mp3': 'Ada yang kurang tepat. Coba lagi ya!',
    'pilihan_sempurna.mp3': 'MasyaAllah! Pilihanmu sempurna!',
    'pilih_lebih_banyak.mp3': 'Bagus! Tapi coba pilih lebih banyak lagi!',

    // Game 5 (Salat)
    'susun_gerakan.mp3': 'Susun gerakan salat dengan urutan yang benar!',
    'belum_lengkap.mp3': 'Belum lengkap! Susun semua gerakan ya!',
    'urutan_benar.mp3': 'Alhamdulillah! Urutan salatmu benar!',
    'urutan_salah.mp3': 'Urutannya belum tepat. Coba lagi ya!',

    // Opening Story
    'opening_welcome.mp3': 'Selamat datang di petualangan Si Saleh dan Si Salihah!',

    // Game Menu
    'menu_instruction.mp3': 'Pilih petualanganmu di peta perjalanan ini!',

    // Reward
    'reward_success.mp3': 'Alhamdulillah! Kamu hebat!',

    // Feedback General
    'benar.mp3': 'Benar sekali',
    'salah.mp3': 'Hmm, coba lagi ya',
    'game_selesai.mp3': 'Alhamdulillah! Kamu berhasil mengurutkan langkah wudu dengan benar!',
    'hebat.mp3': 'MasyaAllah, Hebat!'
};

const downloadTTS = (filename, text) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(text)}`;
    const filePath = path.join(OUTPUT_DIR, filename);

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download ${text}: ${res.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(filePath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { });
            reject(err);
        });
    });
};

async function main() {
    console.log('Downloading audio files...');
    for (const [filename, text] of Object.entries(phrases)) {
        try {
            await downloadTTS(filename, text);
        } catch (err) {
            console.error(err.message);
        }
        // Polite delay
        await new Promise(r => setTimeout(r, 200));
    }
    console.log('Done!');
}

main();
