# Laporan Progres 06 — Revisi Fitur (profil, notifikasi, forum, foto, WhatsApp)

- **Tanggal:** 20 Nov 2026, ±01.45 (tenggat 08.00)
- **Branch:** `revisi-fitur` (preview Vercel) — belum digabung ke `main`
- **Status:** Selesai di lokal, teruji di browser. Verifikasi biometrik sengaja **ditunda** (diputuskan di akhir).

## 1. Permintaan & hasil
| Permintaan | Hasil |
|---|---|
| Foto profil: foto 2 → nelayan, foto 1 → investor | `public/avatars/davin.webp`, `public/avatars/li-chiang.png`; tampil di halaman awal, beranda, profil, data diri |
| Nama nelayan **Davin**, investor **Li Chiang** | Diganti di seed, ledger, investasi, splash. Sapaan "Pak Davin" |
| Notifikasi nelayan / investor / admin | Halaman `/:peran/notifikasi`, lonceng dengan angka belum dibaca. Isi diturunkan dari data nyata: tahap siap cair, laporan, jatuh tempo, dana masuk, proyek tayang (nelayan); proyek baru, bagi hasil, investasi, keamanan (investor); antrean, radar, blok ledger (admin); balasan forum (semua) |
| Ajukan pencairan tidak bisa diklik | Tombol selalu aktif. Bila tahap belum terbuka, muncul status tiap tahap + tombol "Kirim Laporan Progres" + "Minta Bantuan Fasilitator" |
| Profil: data diri, keamanan, pengaturan | 3 halaman baru untuk semua peran: **Data diri** (edit nama, HP, email, alamat, KUSUKA, KUB — tersimpan & tersinkron), **Keamanan** (verifikasi 2 langkah, peringatan login, kunci mandiri untuk investor, perangkat aktif, keluarkan perangkat lain, aktivitas keamanan), **Pengaturan** (notifikasi WA & aplikasi, sembunyikan saldo — kartu utama jadi "Rp ••••••", bahasa, reset data demo, info versi) |
| Biometrik disisakan | Baris "Verifikasi biometrik — Segera hadir" (tidak bisa diklik) di Profil & Keamanan |
| Foto proyek sesuai judul | 10 foto Unsplash (bebas komersial), dicek satu per satu: rumput laut (perahu di kebun rumput laut), kapal tuna (bongkar muat tuna), jaring & mesin perahu (perahu bermesin + jaring), garam (petani garam), abon tenggiri (ikan di daun pisang), keramba kerapu (keramba jaring apung). Proyek baru memakai foto sesuai jenis usaha. Sumber: `docs/kredit-foto.md` |
| Forum: komentar & buat thread | Tombol "Mulai Diskusi Baru" (topik, judul, isi), halaman diskusi dengan komentar, tombol suka; tersimpan di Supabase & muncul di perangkat lain |
| Admin: notifikasi + profil | Sama seperti peran lain |
| Semua WhatsApp → 0858-9430-2193 dengan pesan otomatis, tidak terkirim sendiri | Helper `src/lib/wa.ts` (wa.me + teks terisi). Titik: Bantuan (chat, laporan, pembinaan), Profil "Bantuan via WhatsApp", sheet lapor progres "Kirim Foto via Fasilitator", proyek dirujuk "Hubungi Fasilitator", pencairan "Minta Bantuan Fasilitator", admin "Rujuk ke Fasilitator", radar "Hubungi lewat fasilitator" |

## 2. Perubahan teknis (arsitektur tetap)
- `src/data/types.ts`: `User.photo/email/prefs`, `UserPrefs`, `ForumThread`, `ForumComment`
- `src/data/seed.ts`: nama baru, `FACILITATOR_WA`, 3 thread forum awal, `SEED_VERSION = 2`
- `src/data/store.ts`: aksi `updateProfile`, `updatePrefs`, `markNotifsRead`, `createThread`, `addComment`, `toggleLike`; state `forum`, `notifRead`, `seedVersion`
- `src/data/sync.ts`: field baru ikut tersinkron; data server dengan versi seed lama otomatis diganti seed baru
- Baru: `src/features/notifications.tsx`, `src/features/profile/Profile.tsx`, `src/lib/wa.ts`, `public/projects/*.jpg`, `public/avatars/*`
- `src/features/shared.tsx`: `projectPhoto()`, sampul proyek berfoto, `Avatar` mendukung foto
- Ikon baru `send` (Iconsax Send2)

## 3. Verifikasi (browser lokal, terhubung Supabase)
- Halaman awal: nama & foto baru, status "Tersambung Supabase" ✅
- Nelayan: "Pak Davin" + foto; lonceng "5 belum dibaca" → halaman notifikasi; pencairan → sheet status tahap; simpan data diri; verifikasi 2 langkah; sembunyikan saldo → "Rp ••••••" ✅
- WhatsApp: 4 tombol nelayan & rujukan admin membuka `wa.me/6285894302193?text=…` dengan pesan sesuai konteks ✅
- Investor: foto proyek sesuai, lonceng 11, buat thread → halaman diskusi → komentar "1 komentar" → thread muncul paling atas ✅
- Admin: notifikasi (pengajuan & radar), halaman pengaturan ✅
- `npm test` 13/13, `tsc` 0 error, `npm run build` ✅
- Data Supabase di-reset ke seed v2 setelah uji.
- **Belum diverifikasi:** tampilan di HP fisik.

## 4. Catatan
- Notifikasi "dibaca" disimpan per pengguna dan ikut tersinkron.
- Situs live (versi lama) yang masih terbuka di perangkat lain bisa menulis data tanpa forum; saat versi baru dibuka, data otomatis diganti seed v2.

## 5. Langkah berikutnya
1. Pemilik cek preview branch `revisi-fitur` di HP.
2. Bila oke → gabung ke `main` (live) → tekan Reset data demo.
3. Keputusan akhir: verifikasi biometrik.
