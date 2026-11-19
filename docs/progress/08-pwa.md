# Laporan Progres 08 — PWA (bisa di-install di HP)

- **Tanggal:** 20 Nov 2026, ±02.30 (tenggat 08.00)
- **Branch:** `revisi-fitur` (preview) — bersama revisi 06 & 07
- **Status:** Selesai di build; pemasangan perlu dicek di Chrome HP setelah deploy

## 1. Yang dipasang
| Bagian | Isi |
|---|---|
| `vite-plugin-pwa` | Manifest + service worker (Workbox), update otomatis setiap deploy (`registerType: autoUpdate`) |
| Manifest | Nama "ARTANAYA — Modal Syariah Pesisir", `display: standalone` (layar penuh tanpa bar browser), orientasi potret, warna tema hitam, latar sage, pintasan "Nelayan" & "Investor" |
| Ikon | Dibuat dari `public/logo.svg` dengan `@vite-pwa/assets-generator`: 64, 192, 512, maskable 512 (latar hitam), apple-touch 180, favicon.ico |
| Offline | 36 file tampilan (JS, CSS, HTML, ikon, foto profil & proyek, font Poppins latin; ±2,8 MB) disimpan di HP → aplikasi tetap terbuka saat sinyal lemah. Data Supabase **tidak** di-cache (selalu terbaru; aplikasi punya mode lokal bila offline) |
| iPhone | Meta `apple-mobile-web-app-*` + apple-touch-icon |
| Tombol "Pasang aplikasi ARTANAYA" | Di layar Masuk & Profil → Pengaturan. Android/Chrome: memunculkan dialog install asli. iPhone / browser lain: panduan langkah (Bagikan → Tambah ke Layar Utama). Tersembunyi bila sudah terpasang |
| `vercel.json` | `sw.js` tanpa cache, manifest dengan content-type benar |

## 2. Verifikasi
- `npm run build` → "PWA v2.0.0 · precache 36 entries · dist/sw.js" ✅
- Server produksi lokal: manifest terbaca (standalone, 4 ikon, start `/`) ✅; `sw.js` & `registerSW.js` tersaji ✅; kartu "Pasang aplikasi" tampil ✅
- **Belum diverifikasi:** registrasi service worker & dialog install — panel browser bawaan tidak mengizinkan service worker. Cek di Chrome Android pada URL preview/live: menu ⋮ → "Instal aplikasi".

## 3. Opsi APK (bila dibutuhkan)
PWA yang sama bisa dibungkus jadi APK gratis lewat PWABuilder (pwabuilder.com → masukkan URL live → Android → unduh paket). Tidak perlu kode tambahan.
