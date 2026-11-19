# Laporan Progres 00 — Penyusunan Draf PRD

- **Tanggal:** 19 Nov 2026
- **Fase PRD:** 0
- **Versi PRD acuan:** v0.1 (draf)
- **Status:** Sebagian — menunggu kesepakatan

## 1. Ringkasan
Draf PRD frontend ARTANAYA sudah ditulis berdasarkan dokumen proposal klien (Lampiran 7 & 8) dan referensi UI "Finora". Belum ada kode. Eksekusi menunggu jawaban 10 keputusan terbuka di PRD §14.

## 2. Yang dikerjakan
- [x] Membaca 11 halaman dokumen klien + 1 referensi UI
- [x] Audit "AI slop" pada mockup klien (PRD §4)
- [x] Arah visual, token warna, tipografi, aturan ikon & spesifikasi logo (PRD §5–6)
- [x] Inventaris 31 layar untuk 3 peran + 3 usulan layar fasilitator (PRD §7)
- [x] Tech stack frontend & infrastruktur gratis (PRD §8)
- [x] Logika skor & tabel keputusan (PRD §9)
- [x] Target non-fungsional terukur (PRD §10)
- [x] Rencana 8 fase dengan gerbang persetujuan (PRD §11)
- [x] Template laporan progres
- [ ] Kesepakatan PRD (menunggu Anda)

## 4. File yang dibuat
| File | Perubahan |
|---|---|
| `docs/PRD.md` | Baru — draf v0.1 |
| `docs/progress/_TEMPLATE.md` | Baru — template laporan |
| `docs/progress/00-penyusunan-prd.md` | Baru — laporan ini |

## 5. Keputusan yang diusulkan (belum disetujui)
| Usulan | Alasan |
|---|---|
| Vite + React SPA, bukan Next.js | Tidak butuh SEO, lebih ringan untuk HP murah |
| Cloudflare Pages, bukan Vercel Hobby | Vercel Hobby hanya untuk non-komersial |
| Radix headless, bukan shadcn/ui bawaan | Hindari tampilan template yang dikenali |
| Phosphor Icons, bukan Lucide | Konsistensi & tidak terlihat seperti template AI |
| Plus Jakarta Sans + Instrument Serif | Gratis (OFL), cerita lokal, sesuai referensi |

## 6. Temuan pada dokumen klien
- Lampiran 7: R = 0 untuk nelayan baru vs. redistribusi bobot — saling bertentangan (PRD §14 no. 5).
- Normalisasi tiap sinyal ke 0–100 belum didefinisikan (PRD §14 no. 6).
- Peran Digital Facilitator disebut tetapi tidak punya mockup.

## 7. Pembaruan (19 Nov 2026)
- Dikonfirmasi: proyek adalah **prototipe lomba**; harus fungsional & bagus, AI cukup sederhana.
- Hosting diganti ke **Vercel Hobby** (PRD §8.2, §15).
- Usulan Ruang Konsultasi: FAQ + pencocokan kata kunci, tanpa LLM (PRD §14 no. 4).
- Backend disepakati **Supabase** (PRD §8.3 baru): login email + Google + akun demo per peran, RLS per peran, Realtime untuk layar admin, seed data, ping keep-alive, mode cadangan baca-saja. OTP SMS dihapus dari lingkup (berbayar).
- Blockchain disepakati **simulasi** (PRD §9.3 baru): hash chain SHA-256 di tabel `ledger_tx`, tidak bisa diubah/dihapus, tombol "Verifikasi Rantai" di browser, aturan akad sebagai fungsi Postgres. viem & Polygon dihapus dari stack.
- Nilai R: redistribusi bobot disetujui; normalisasi sinyal memakai asumsi tim (PRD §9.1, contoh: Pak Rudi skor ≈ 81).
- **Tenggat lomba 20 Nov 2026.** Ditambahkan PRD §16 Rencana Kilat: alur demo emas, prioritas P0/P1/P2, 7 blok kerja, adapter data lokal duluan lalu Supabase.
- Masih terbuka: layar Fasilitator (sementara masuk P2), jam tenggat, kredensial Supabase.

## 8. Langkah berikutnya
1. Anda menjawab PRD §14.
2. PRD dinaikkan ke v1.0 + dicatat di Log Keputusan.
3. Mulai Fase 1 (fondasi & `/styleguide`).
