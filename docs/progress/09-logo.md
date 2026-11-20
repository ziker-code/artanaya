# Laporan Progres 09 — Ganti Logo Resmi

- **Tanggal:** 20 Nov 2026
- **Branch:** `ganti-logo` (preview)
- **Status:** Selesai di lokal

## Yang dikerjakan
- Logo resmi dari klien (emblem A + kapal + gelombang + ikan + grafik, tulisan ARTANAYA, slogan "Bersama Nelayan, Menuju Masa Depan Berkelanjutan") diolah dengan `sharp`:
  - `public/brand/logo-full.png` — logo lengkap, latar putih dirapikan (600 px)
  - `public/brand/logo-mark.png` (512) & `logo-mark-128.png` — emblem saja, persegi
- `LogoMark` kini menampilkan emblem di lingkaran putih (layar Masuk/Daftar, Wordmark). Tersedia juga `LogoFull`.
- Favicon, apple-touch-icon, ikon PWA 64/192/512 & maskable dibuat ulang dari emblem (latar putih).
- Logo lama (`public/logo.svg`, layar perahu lime) dihapus.

## Verifikasi
- Layar Masuk menampilkan emblem baru (512×512 termuat) ✅; favicon & apple-touch-icon mengarah ke file baru ✅
- `tsc` 0 error, build + PWA precache ✅
