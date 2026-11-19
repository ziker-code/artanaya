# Laporan Progres 07 — Layar Masuk & Daftar

- **Tanggal:** 20 Nov 2026, ±02.10 (tenggat 08.00)
- **Branch:** `revisi-fitur` (preview) — bersama revisi 06, belum digabung ke `main`
- **Status:** Selesai di lokal, teruji

## 1. Ringkasan
Halaman awal diganti layar **Masuk** dan ditambah layar **Daftar** dengan tata letak mengikuti referensi: kepala gelap dengan bentuk "tetesan" yang meleleh ke latar terang, judul di tengah, sapaan, input bergaris bawah ber-ikon, "Ingat saya" & "Lupa kata sandi?", tombol penuh, dan tautan pindah Masuk/Daftar. Warna tetap palet aplikasi (hitam, sage, lime). Akun demo tetap ada dan sekali ketuk langsung masuk.

## 2. Detail
| Bagian | Isi |
|---|---|
| Layar Masuk (`/`) | Logo, judul "Masuk", tetesan beranimasi pelan, "Selamat datang kembali!", input nama/HP/email + kata sandi (tombol tampil/sembunyi), Ingat saya, Lupa kata sandi?, Masuk, "Belum punya akun? Daftar" |
| Login form | Akun uji: `davin`, `lichiang`, `admin` (juga nama lengkap / nomor HP / email akun) dengan kata sandi `artanaya`. Salah sandi / akun → pesan error |
| Lupa kata sandi | Bottom sheet → WhatsApp 0858-9430-2193 dengan pesan terisi |
| Akun demo | 3 kartu (foto Davin, foto Li Chiang, ikon Admin) → langsung masuk; status Supabase + Reset data demo tetap ada |
| Layar Daftar (`/daftar`) | "Hai, selamat datang!", pilih Investor/Nelayan, nama, HP/email, lokasi, kata sandi + ulangi, validasi; akun baru tersimpan & tersinkron lalu langsung masuk ke beranda perannya |

## 3. File
- Baru: `src/features/auth/Auth.tsx`
- `src/data/store.ts`: `registerUser`, `loginWithPassword`, `DEMO_PASSWORD`
- `src/design/Icon.tsx`: ikon `eye`, `eye-slash`
- `src/index.css`: keyframe `drip`
- `src/main.tsx`: rute `/` → Masuk, `/daftar` → Daftar
- Dihapus: `src/features/Splash.tsx` (diganti layar Masuk)

## 4. Verifikasi
- Masuk dengan `davin` + sandi salah → "Kata sandi salah." ✅; sandi `artanaya` → `/nelayan` ✅
- Daftar kosong → 3 pesan validasi ✅; isi lengkap (investor) → akun baru, masuk `/investor` dengan nama baru ✅
- Akun demo tampil: Davin, Li Chiang, Admin Utama ✅
- `npm test` 13/13, `tsc` 0 error, build ✅
- Data bersama di-reset setelah uji (akun uji "Budi" terhapus) ✅
- **Prototipe:** kata sandi tidak disimpan/di-hash di server (tanpa Supabase Auth); hanya simulasi alur.

## 5. Soal "jadi aplikasi"
Rekomendasi: **PWA** (bisa di-install ke layar utama HP, layar penuh tanpa bar browser, ikon sendiri, tetap terbuka saat sinyal lemah) — gratis, satu kode, update otomatis lewat Vercel. Bila perlu file **APK**, PWA yang sama bisa dibungkus gratis dengan PWABuilder (Trusted Web Activity). Menunggu keputusan pemilik.
