# Laporan Progres 02 — Kerangka Data & Seluruh Layar P0 (Blok 2–5)

- **Tanggal:** 19 Nov 2026, ±23.05 WITA/WIB (tenggat: 20 Nov 08.00)
- **Fase PRD:** Rencana Kilat §16, Blok 2, 3, 4, 5
- **Status:** Selesai untuk adapter data lokal. Supabase & deploy belum (menunggu kredensial)

## 1. Ringkasan
Aplikasi sudah bisa didemokan ujung ke ujung untuk tiga peran dengan data tersimpan di browser dan tersinkron antar-tab. Seluruh **alur emas** (PRD §16.2) sudah diuji di browser dan berjalan.

## 2. Alur emas yang sudah diuji (di browser, dua tab)
1. Pak Rudi mengajukan "Perluasan Para-Para Pengeringan" → skor **84, Skor Tinggi, Nelayan Baru** → `PRJ-0035` terkirim.
2. Tab Admin: antrean bertambah jadi 3 → buka `PRJ-0035` → **Verifikasi & Tayangkan**.
3. Tab Nelayan otomatis berubah status jadi "Menggalang dana" (sinkron antar-tab).
4. Investor Dedi mendanai **Rp500.000** → tercatat di **blok #77** dengan hash SHA-256.
5. Pak Rudi mengirim laporan progres tahap 1 → tahap 2 terbuka → **cair Rp16 jt (blok #78)** → saldo Dompetku Rp36 jt.
6. Setor bagi hasil → blok #79 (setoran) + #80 (distribusi ke investor).
7. Admin **Verifikasi Rantai** → "Rantai utuh, 80 blok". **Simulasikan manipulasi** → "Rantai putus di blok #41". Pulihkan → utuh lagi.
8. Radar Penipuan admin & Radar Ancaman investor tampil dengan data.

## 3. Layar yang selesai
| Kode | Layar | File |
|---|---|---|
| U-01 | Splash + 3 akun demo + reset data | `features/Splash.tsx` |
| N-01 | Beranda Nelayan | `features/nelayan/NelayanHome.tsx` |
| N-02–N-05 | Ajukan proyek 4 langkah + skor langsung berubah saat data diubah | `features/nelayan/SubmitProject.tsx` |
| N-06 | Proyek Saya + detail, pencairan bertahap, lapor progres | `features/nelayan/MyProjects.tsx` |
| N-07/N-08 | Dompetku, ajukan pencairan, setor bagi hasil | `features/nelayan/Wallet.tsx` |
| N-09/N-10 | Bantuan (WA fasilitator, FAQ akad) & Profil | `features/nelayan/HelpProfile.tsx` |
| I-01 | Beranda Investor + cari + filter | `features/investor/InvestorHome.tsx` |
| I-02/I-03 | Prospektus + alur investasi (min Rp50.000) + bukti hash | `features/investor/Prospectus.tsx` |
| I-04 | Portofolio + grafik | `features/investor/Portfolio.tsx` |
| I-05 | Radar Ancaman + kunci mandiri | `features/investor/SecurityRadar.tsx` |
| I-06 | Forum Bahari (statis) | `features/investor/Community.tsx` |
| A-02 | Beranda Admin | `features/admin/AdminHome.tsx` |
| A-03/A-04 | Tinjau pengajuan + detail + keputusan | `features/admin/Review.tsx` |
| A-06 | Ledger + Verifikasi Rantai + mode demo juri | `features/admin/Ledger.tsx` |
| A-07 | Radar Penipuan + tindak lanjut | `features/admin/FraudRadar.tsx` |

Belum dikerjakan (P1/P2): U-03–U-05 (KYC + liveness kamera), A-05 antrean KYC, I-07 Ruang Konsultasi, layar Fasilitator, sidebar admin desktop, PWA.

## 4. Logika inti
| File | Isi |
|---|---|
| `src/lib/scoring.ts` + `scoring.config.ts` | Rumus Lampiran 7, redistribusi bobot, normalisasi asumsi (PRD §9.1), Tabel Keputusan |
| `src/lib/ledger.ts` | Hash chain SHA-256, `verifyChain()` |
| `src/lib/scoring.test.ts` | 13 unit test (skor, cold-start, pembinaan, Skor Awal, deteksi manipulasi ledger) |
| `src/data/seed.ts` | 9 pengguna, 7 proyek di 7 lokasi pesisir, ±76 investasi, 3 peringatan radar, riwayat ledger |
| `src/data/store.ts` | Adapter lokal (zustand + localStorage), aturan akad (pencairan hanya tahap terbuka, laporan membuka tahap berikutnya), bagi hasil proporsional, peringatan otomatis untuk investasi ≥ Rp10 jt |

## 5. Keputusan yang diambil
| Keputusan | Alasan |
|---|---|
| Sesi login per-tab (`sessionStorage`), data bersama (`localStorage`) | Supaya tab Nelayan & tab Admin bisa dibuka berdampingan saat demo |
| Admin tetap memverifikasi meski skor ≥ 70 (rekomendasi sistem ditampilkan) | Human-in-the-loop; tercatat di PRD §15 |
| Sampul proyek = ilustrasi garis gelombang per jenis usaha, bukan foto stok | Anti "AI slop", ringan, konsisten |
| Tombol "Mode demo juri" di Ledger | Membuktikan ke juri bahwa manipulasi data terdeteksi |
| `vercel.json` dengan rewrite SPA | Rute seperti `/admin/ledger` tidak 404 saat dibuka langsung |

## 6. Verifikasi
- `npm test` → 13/13 lolos.
- `npx tsc -b` → 0 error. `npm run lint` → 0 error, 4 peringatan fast-refresh (tidak berdampak).
- `npm run build` → sukses; JS **183 KB gzip** (sedikit di atas target 180 KB, karena styleguide ikut dibundel).
- Browser: alur emas di atas, 2 tab, console tanpa error.
- **Belum diverifikasi:** HP fisik, Lighthouse, deploy Vercel, Supabase.

## 7. Masalah & risiko
- Data hanya di browser: juri yang membuka di HP berbeda melihat data seed masing-masing (bukan data bersama). Diatasi bila Supabase dipasang.
- Jika juri mengacak data: tombol **Reset data demo** di splash.

## 8. Langkah berikutnya
1. **Deploy ke Vercel** (prioritas — link harus ada sebelum 08.00).
2. Adapter Supabase (bila kredensial masuk dan waktu cukup).
3. P1: KYC + liveness, lazy-load untuk bundle.

## 9. Cara menjalankan
```powershell
npm install
npm run dev
```
Buka http://localhost:5173 → pilih akun demo.
