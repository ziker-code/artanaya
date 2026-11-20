# Laporan Progres 10 — Palet "Pesisir" dari Warna Logo

- **Tanggal:** 20 Nov 2026
- **Branch:** `tema-logo` (preview)
- **Status:** Selesai di lokal

## Latar
Masukan: palet sage-hitam-lime bertabrakan dengan logo resmi (biru-hijau-putih). Tiga pilihan palet (A Samudra, B Pesisir, C Gradasi Logo) diambil dari piksel logo dan dibandingkan berdampingan di halaman `/tema` memakai aplikasi asli. Pemilik memilih **B · Pesisir**.

## Perubahan
| Token | Sebelum | Sesudah |
|---|---|---|
| Latar (`paper`) | sage `#D3E0CA` | putih kehijauan `#ECF6F4` |
| Kartu (`surface`) | `#F7FAF3` | putih `#FFFFFF` |
| Warna utama (`kelp-950`: kartu hero, nav, ikon bulat, header login) | hitam `#070806` | teal logo `#126565` |
| Aksen / tombol utama (`sun-500`) | lime `#A6E465` | cyan logo `#1C92C2` |
| Hijau sekunder (`kelp-500`) | olive | hijau logo `#2E9078` |
| Info (`tide-600`) | — | biru logo `#1E62A0` |
| Teks utama | hitam | teal sangat gelap `#0B2C2F` |

- Teks di atas aksen cyan diganti **putih** (22 tempat + tab aktif nav) agar kontras terjaga.
- Bayangan diberi rona teal; warna luar bingkai desktop, `theme-color`, dan warna manifest PWA ikut diganti.
- Kode pratinjau tema (`/tema`, `themes.ts`) dihapus setelah palet dipilih.

## Verifikasi
- Beranda Nelayan & Investor dicek di 390 px: kartu teal, aksen cyan, latar putih kehijauan, foto & logo serasi ✅
- `npm test` 13/13, build + PWA ✅
