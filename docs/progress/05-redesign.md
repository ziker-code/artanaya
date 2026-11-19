# Laporan Progres 05 — Rombak Desain Frontend (gaya referensi sage · hitam · lime)

- **Tanggal:** 20 Nov 2026, ±00.30 (tenggat 08.00)
- **Lingkup:** hanya tampilan frontend. Arsitektur, data, Supabase, skor, ledger **tidak diubah**.
- **Status:** Selesai di lokal. **Belum di-commit / di-push** (push = otomatis deploy ke situs live) — menunggu persetujuan.

## 1. Ringkasan
Seluruh UI dirombak mengikuti referensi fintech yang dikirim pemilik: latar hijau sage, kartu hero hitam dengan bintang lime, tombol bulat besar, ikon garis membulat, bottom nav pil hitam melayang dengan indikator lime yang bergeser, plus animasi di navigasi, kartu, daftar, angka, dan grafik.

## 2. Perubahan
| Bagian | Sebelum | Sesudah |
|---|---|---|
| Palet | Krem, hijau laut, kuning mustard | Sage `#D3E0CA`, hitam `#070806`, lime `#A6E465`, kartu putih kehijauan |
| Font | Plus Jakarta Sans + Instrument Serif | **Poppins** (Fontsource, self-hosted, OFL) |
| Ikon | Phosphor | **Iconsax** (`iconsax-react`, MIT) — varian Linear, Bold untuk tab aktif |
| Logo | Teks "ARTANAYA" | Logomark baru: lingkaran hitam, layar perahu & gelombang lime + wordmark "artanaya" (`src/design/Wordmark.tsx`, `public/logo.svg`, juga jadi favicon) |
| Kartu hero | Hijau tua bertekstur | Hitam, bintang lime berkelip, strip lime di kanan (seperti kartu VISA referensi) |
| Aksi cepat | Kotak berlabel | Lingkaran putih besar + label; satu lingkaran lime |
| Daftar transaksi | Kartu bergaris | Panel putih dengan ikon bulat hitam ("Recent Activity") |
| Bottom nav | Bar penuh berlabel | Pil hitam melayang; tab aktif = lingkaran lime + label, bergeser dengan animasi pegas |
| Tombol, input, chip, segmen | Sudut 10 px | Pil penuh (rounded-full) |
| Sampul proyek | Warna per jenis usaha | Hitam + garis gelombang lime + ikon jenis usaha di lingkaran lime |
| Toast | Kotak | Pil hitam turun dari atas dengan ikon lime |

## 3. Animasi
| Elemen | Efek | Teknik |
|---|---|---|
| Pindah halaman | Halaman utama naik-pudar; halaman detail geser dari kanan | CSS keyframe (tidak pernah menahan navigasi) |
| Bottom nav & segmen | Indikator lime bergeser antar-tab | Motion `layoutId` (spring) |
| Aksi cepat, kartu proyek, akun demo | Muncul berurutan | Komponen `Reveal` (stagger) |
| Saldo / total dana | Angka berhitung naik | Komponen `CountUp` |
| Grafik batang | Tumbuh dari bawah | CSS `grow` |
| Lingkaran skor, gauge | Busur terisi | transisi `stroke-dashoffset` |
| Tombol | Mengecil saat ditekan | utilitas `press` |
| Bintang di kartu hero | Berkelip pelan | CSS `shimmer-star` |
| Badge | Pop-in | CSS `pop` |
Semua animasi menghormati `prefers-reduced-motion`.

## 4. File yang berubah
`src/index.css` (token, font, keyframe), `src/design/*` (Icon, Button + `QuickAction`, Surface + `Panel`/`Sparkle`, Status, Charts, Nav, Field, Sheet, Wordmark + `LogoMark`, **baru** `Motion.tsx`), `src/app/RoleShell.tsx` (transisi halaman, ruang untuk nav melayang), `src/app/toast.tsx`, `src/features/**` (beranda tiga peran, splash, kelas kartu), `src/main.tsx` (styleguide di-lazy-load), `index.html` (favicon, theme-color), `public/logo.svg`, `package.json` (+iconsax-react, +@fontsource/poppins; −phosphor, −plus-jakarta-sans, −instrument-serif).

## 5. Verifikasi
- `npm test` 13/13 ✅ · `npx tsc -b` 0 error ✅ · `npm run build` ✅ · lint 0 error
- Browser (390 px): semua layar investor tanpa scroll horizontal; alur nelayan (ajukan → PRJ baru, lapor → cair tahap 2), investor (danai → blok tercatat), admin (verifikasi rantai utuh, radar tampil) ✅
- Data Supabase bersama di-reset ke seed setelah uji (versi 12, 7 proyek). Catatan: ada `PRJ-0035` dari pengujian di situs live yang ikut terhapus oleh reset ini.
- **Belum diverifikasi:** tampilan visual akhir di HP fisik (panel browser tersembunyi saat uji, sehingga sebagian tangkapan layar tidak bisa diambil).

## 6. Catatan & risiko
- Bundle JS 294 KB gzip (sebelumnya 240 KB). Penyebab utama: tiap ikon Iconsax membawa 6 varian gaya. Masih jalan baik di 4G; optimasi pasca-lomba: impor SVG ikon secara langsung.
- Bottom nav kini hanya menampilkan label untuk tab aktif (mengikuti referensi); tab lain punya `aria-label` + tooltip.
- **Deploy ke live sebelum 08.00 = risiko**: tampilan baru belum dicek di HP fisik. Opsi aman: deploy ke branch preview dulu.

## 7. Langkah berikutnya
1. Pemilik memutuskan: commit + push ke `main` (langsung live) atau ke branch preview dulu.
2. Cek di HP fisik.
