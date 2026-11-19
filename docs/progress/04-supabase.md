# Laporan Progres 04 — Sambungan Supabase (data bersama real-time)

- **Tanggal:** 19 Nov 2026, ±23.30 (tenggat 20 Nov 08.00)
- **Fase PRD:** Rencana Kilat §16, Blok 7 (P1: adapter Supabase)
- **Status:** Selesai — aktif di lokal **dan** di https://artanaya.vercel.app

## 0. Pembaruan produksi (19 Nov 2026, 23.4x)
- Env var `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` diisi pemilik di Vercel, lalu redeploy.
- Situs live menampilkan "Tersambung Supabase · data bersama real-time". ✅
- Uji real-time produksi: halaman Tinjau Admin terbuka, perangkat lain mengubah judul PRJ-0033 → muncul tanpa reload. ✅
- Data produksi di-reset ke seed (versi 6, 7 proyek, tanpa sisa data uji). ✅
- Push GitHub sempat gagal karena DNS laptop; berhasil setelah DNS pulih (`16c6122`).

## 1. Ringkasan
Aplikasi sekarang menyimpan data demo di Supabase dan menyinkronkannya real-time ke semua perangkat. Tanpa env var atau saat Supabase tidak terjangkau, aplikasi otomatis kembali ke mode lokal.

## 2. Yang dikerjakan
- [x] `supabase/migrations/001_demo_state.sql` — tabel `demo_state`, RLS (anon hanya boleh baris `main`), publikasi Realtime. Dijalankan pemilik di SQL Editor.
- [x] `src/data/remote.ts` — klien Supabase: muat, simpan (upsert), langganan Realtime
- [x] `src/data/sync.ts` — jembatan store ↔ Supabase: unggah seed bila tabel kosong, simpan tiap aksi (debounce 250 ms + nomor versi), terapkan perubahan dari perangkat lain, fallback lokal
- [x] Indikator status di halaman awal: "Tersambung Supabase · data bersama real-time" / "Mode lokal"
- [x] `.env.example`; kunci asli di `.env.local` (tidak masuk git)

## 3. Verifikasi
| Uji | Hasil |
|---|---|
| REST `demo_state` dengan publishable key | HTTP 200 — tabel & RLS OK |
| Buka aplikasi pertama kali → seed terunggah | ✅ baris `main` versi 1 |
| Status di halaman awal | ✅ "Tersambung Supabase" |
| Perangkat lain (skrip Node via REST) menandai peringatan AL-301 & AL-298 selagi halaman Radar terbuka | ✅ muncul di layar **tanpa reload** |
| Reset data demo dari aplikasi → tertulis ke Supabase | ✅ versi 4, semua peringatan kembali "open" |
| `npm run build`, `npm run lint` | ✅ 0 error |

**Belum diverifikasi:** situs Vercel dengan Supabase (menunggu env var), dua HP fisik.

## 4. Keputusan & penyimpangan dari PRD
| Keputusan | Alasan |
|---|---|
| Satu dokumen JSON (`demo_state.data`), bukan tabel per entitas + RLS per peran seperti PRD §8.3 | Tenggat beberapa jam; skema per-tabel dijadwalkan pasca-lomba |
| Akun demo tanpa Supabase Auth | Juri bisa langsung mencoba; tidak ada data pribadi asli |
| Hash chain tetap dihitung & diverifikasi di browser; proteksi append-only di server belum ada | Sama dengan di atas — dicatat jujur |
| Penulisan bersamaan dari dua perangkat: yang terakhir menang | Cukup untuk demo; risiko kecil |

## 5. Risiko
- Siapa pun yang memegang publishable key bisa mengubah data demo (memang publik di bundle). Tombol **Reset data demo** memulihkannya.
- Supabase Free di-pause setelah ±7 hari tanpa aktivitas — aman untuk besok; setelah lomba perlu dibuka lagi dari dashboard.
- Bundle naik ke 240 KB gzip karena klien Supabase. Belum di-lazy-load.

## 6. Langkah untuk pemilik (wajib agar situs live tersambung)
Vercel → proyek **artanaya** → Settings → Environment Variables (centang Production & Preview):
- `VITE_SUPABASE_URL` = `https://gcsvouudjfznnrxlnqth.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = publishable key
Lalu Deployments → ⋯ → **Redeploy**.

## 7. Langkah berikutnya
1. Uji situs live setelah redeploy (status hijau + sinkron HP ↔ laptop).
2. Opsional sebelum 08.00: verifikasi wajah (liveness), lazy-load bundle.
