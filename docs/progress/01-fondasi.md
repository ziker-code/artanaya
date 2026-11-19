# Laporan Progres 01 — Fondasi & Styleguide

- **Tanggal:** 19 Nov 2026
- **Fase PRD:** Rencana Kilat §16, Blok 1
- **Versi PRD acuan:** v0.1 + keputusan di §15
- **Status:** Selesai — menunggu Anda mengecek tampilan `/styleguide`

## 1. Ringkasan
Proyek Vite + React + TypeScript sudah berdiri di root folder, lengkap dengan token desain (§6), font, ikon, 25+ komponen inti, dan halaman `/styleguide` yang memuat contoh komposisi Beranda Nelayan (N-01). Build, type check, dan lint lolos; tidak ada error di console.

## 2. Yang dikerjakan
- [x] Izin otomatis proyek (`.claude/settings.json`) untuk npm/npx/node/git/supabase/vercel dan edit file di proyek
- [x] Scaffold Vite (React 19, TypeScript 7, Vite 8, oxlint)
- [x] Tailwind v4 dengan palet **dikunci** ke token ARTANAYA (`--color-*: initial`, warna bawaan Tailwind dimatikan)
- [x] Font self-hosted via Fontsource (Plus Jakarta Sans Variable, Instrument Serif) — tidak bergantung Google Fonts saat demo
- [x] Komponen `Icon` berbasis nama (Phosphor), siap diganti SVG Anda
- [x] Komponen inti & halaman `/styleguide`
- [x] Cek tampilan desktop & lebar 375px (tidak ada scroll horizontal)
- [ ] Logo asli (masih wordmark teks sementara)

## 3. Komponen yang tersedia (`src/design/`)
| File | Komponen |
|---|---|
| `Icon.tsx` | `Icon` + registry 43 nama ikon |
| `Button.tsx` | `Button` (primary/secondary/ghost/danger/quiet, loading, disabled), `IconButton` |
| `Field.tsx` | `TextField` (hint, error, ikon), `MoneyInput` (stepper ± besar) |
| `Surface.tsx` | `Card`, `HeroCard` (motif gelombang + tekstur), `SectionHeader`, `ListRow`, `TxRow` (nominal + hash), `Divider` |
| `Status.tsx` | `Badge`, `ScoreBadge`, `ScoreDial`, `scoreLevel()`, `ProgressBar`, `Stepper`, `Notice`, `DisclaimerBar`, `Skeleton`, `EmptyState` |
| `Charts.tsx` | `BarChart`, `Gauge`, `ScoreBreakdown` (SVG buatan sendiri, tanpa library chart) |
| `Nav.tsx` | `TopBar`, `BottomNav` (ikon fill + titik kuning), `Segmented` (Radix Tabs), `ChipRow` |
| `Sheet.tsx` | `BottomSheet` (Radix Dialog, aksesibel) |
| `Wordmark.tsx` | Wordmark teks sementara |

## 4. File yang dibuat / diubah
| File | Perubahan |
|---|---|
| `.claude/settings.json` | Baru — izin otomatis proyek |
| `.claude/launch.json` | Baru — konfigurasi dev server untuk preview |
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.gitignore`, `index.html` | Scaffold + alias `@/`, strict TS, Tailwind plugin |
| `src/index.css` | Token desain, font, utilitas `num` & `paper-grain`, animasi sheet |
| `src/design/*` | Komponen inti |
| `src/lib/cn.ts`, `src/lib/format.ts` | Gabung class; format Rupiah, tanggal `id-ID`, hash pendek |
| `src/pages/Styleguide.tsx` | Halaman styleguide + pratinjau HP |
| `src/main.tsx` | Router (sementara semua rute → `/styleguide`) |

## 5. Keputusan yang diambil
| Keputusan | Alasan | Disetujui oleh |
|---|---|---|
| Palet Tailwind bawaan dimatikan | Mencegah warna "liar" seperti `blue-500` masuk ke layar | Mengikuti PRD §6.1 |
| Font self-hosted (Fontsource), bukan link Google Fonts | Tetap tampil saat sinyal lemah / offline ketika demo | Teknis |
| Ikon `radar` memakai `CrosshairSimple` | Phosphor tidak punya ikon Radar | Teknis — bisa diganti |
| Paket `radix-ui` (gabungan) | Satu dependensi untuk Dialog & Tabs | Teknis |
| TxRow memendekkan hash jadi `0x3f…c714` | Tidak terpotong di layar 360px | Teknis |

## 6. Verifikasi
- `npm run build` → sukses (1,2 dtk). JS 157 KB gzip, CSS 9 KB gzip.
- `npx tsc -b` → 0 error.
- `npm run lint` → 0 error, 2 peringatan fast-refresh (tidak berdampak ke produksi).
- Browser: console bersih; lebar 375px tanpa scroll horizontal; tampilan desktop dicek lewat screenshot.
- **Belum diverifikasi:** HP Android fisik, Lighthouse, kontras diukur dengan alat (baru dipilih manual sesuai AA).

## 7. Masalah & risiko baru
- Bundle 157 KB gzip masih memuat seluruh styleguide; nanti dipecah per peran (lazy route) agar di bawah target 180 KB per peran.
- Proyek belum di-`git init`/commit — menunggu Anda (sesuai aturan: commit hanya bila diminta).

## 8. Langkah berikutnya
1. **Anda cek `/styleguide`** (warna, font, komponen, contoh Beranda Nelayan). Koreksi apa pun saya terapkan sebelum lanjut.
2. Blok 2: kerangka peran, splash + akun demo, adapter data lokal + seed, modul skor + unit test.
3. Mohon siapkan: jam tenggat, Project URL + anon key Supabase, akun Vercel/GitHub.

## 9. Cara menjalankan
```powershell
npm install
npm run dev
```
Buka http://localhost:5173/styleguide
