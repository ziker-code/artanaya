# Laporan Progres 03 — Git & Deploy

- **Tanggal:** 19–20 Nov 2026 (tenggat 20 Nov 08.00)
- **Fase PRD:** Rencana Kilat §16, Blok 6
- **Status:** Selesai — aplikasi live di **https://artanaya.vercel.app**

## 1. Ringkasan
Kode ada di GitHub `ziker-code/artanaya` (cabang `main`) dan sudah di-deploy ke Vercel lewat import dashboard oleh pemilik. Setiap push ke `main` akan men-deploy ulang otomatis. Alur emas sudah diuji langsung di URL produksi.

## 2. Yang dikerjakan
- [x] `git init -b main`, cek staging (tidak ada rahasia; `node_modules` & `dist` diabaikan)
- [x] Commit pertama `d6a62d8` (58 file), push ke `https://github.com/ziker-code/artanaya`
- [x] `vercel.json` (framework Vite, output `dist`, rewrite SPA)
- [x] Import repo di dashboard Vercel (oleh pemilik)
- [x] Uji alur emas di produksi

## 3. Verifikasi di produksi (https://artanaya.vercel.app)
| Uji | Hasil |
|---|---|
| Splash & 3 akun demo tampil | ✅ |
| Nelayan ajukan proyek → `PRJ-0035`, skor dihitung | ✅ |
| Buka langsung `/admin/tinjau/PRJ-0035` (deep link, uji rewrite SPA) | ✅ tidak 404 |
| Admin Verifikasi & Tayangkan | ✅ "PRJ-0035 tayang di marketplace investor" |
| Investor danai Rp500.000 | ✅ tercatat blok #77 |
| Ledger: Verifikasi Rantai | ✅ "Rantai utuh, 77 blok" |
| Mode demo juri: manipulasi → verifikasi | ✅ "Rantai putus di blok #39" |
| Pulihkan → verifikasi | ✅ utuh lagi |

**Belum diverifikasi:** HP Android fisik, Lighthouse di produksi.

## 4. Catatan untuk demo
- Data tersimpan di browser masing-masing perangkat (adapter lokal). Juri di HP berbeda melihat data seed sendiri.
- Untuk demo dua peran sekaligus: buka dua tab di browser yang sama.
- Tombol **Reset data demo** di halaman awal mengembalikan data ke kondisi seed.

## 5. Langkah berikutnya
1. Adapter Supabase (butuh Project URL + anon key) agar data bersama antar-perangkat.
2. P1: verifikasi KTP + liveness kamera, lazy-load bundle.
