# PRD Frontend — ARTANAYA

> Status: **DRAF v0.1, belum disepakati.** Jangan mulai eksekusi sebelum bagian [§14 Keputusan Terbuka](#14-keputusan-terbuka-wajib-disepakati) dijawab.
> Tanggal: 19 Nov 2026 · Dokumen ini hanya mencakup **frontend**. Backend dibahas sebatas kontrak data yang dibutuhkan frontend.

---

## 1. Ringkasan Produk

ARTANAYA adalah platform *Securities Crowdfunding* (SCF) syariah yang mempertemukan **nelayan/pembudidaya pesisir** (pihak yang butuh modal) dengan **investor ritel** (pemodal, minimal Rp50.000 per proyek) melalui akad **mudharabah**. Empat pilar fitur:

| Pilar | Wujud di frontend |
|---|---|
| AI Alternative Credit Scoring | Kalkulasi & tampilan skor 0–100 dari 5 sinyal (T, P, K, L, R), badge skor, rincian per sinyal yang bisa dibaca orang awam |
| Blockchain Smart Contract | Ledger transaksi (pencairan bertahap, distribusi bagi hasil) dengan hash, status, tautan ke block explorer |
| AI Cyber Threat & Fraud Detection | Radar ancaman (investor), Radar penipuan (admin), self-lock akun |
| Verifikasi biometrik (Zero Trust) | Alur KYC: data diri → cek liveness wajah → selesai |
| *Pendukung:* Digital Facilitator (Gen Z, Karang Taruna) | Bantuan pendaftaran via WhatsApp, rujukan pembinaan untuk skor < 50 |

### 1.1 Sifat proyek (penting untuk ekspektasi)

**Proyek ini prototipe untuk lomba** (dikonfirmasi 19 Nov 2026). Targetnya: **semua alur benar-benar berfungsi dan terlihat meyakinkan saat didemokan**, bukan platform SCF berizin. Fitur "AI" cukup sederhana asalkan bekerja dengan baik. Konsekuensinya:

- Skor AI = **rumus berbobot yang transparan** (sesuai Lampiran 7), bukan model ML terlatih. Ini justru cocok dengan klaim "dapat dijelaskan".
- Biometrik = **deteksi liveness di perangkat** (kedip/menoleh) untuk demo, bukan e-KYC tersertifikasi Dukcapil.
- Blockchain = **ledger simulasi** berbasis hash chain yang bisa diverifikasi (§9.3), bukan jaringan blockchain nyata.
- Fraud radar = **aturan (rule-based) + data peristiwa simulasi**.
- Pembayaran = **simulasi**. Tidak ada uang yang berpindah.
- Seluruh layar memuat penanda kecil "Prototipe — bukan layanan berizin OJK" (teks final disepakati dengan klien).

---

## 2. Tujuan & Non-Tujuan

**Tujuan**
1. Membangun ulang seluruh layar di Lampiran 8 dengan identitas visual yang konsisten dan tidak terasa "AI slop".
2. Mempertahankan **alur & urutan layar** di dokumen klien, supaya proposal yang sudah dikirim tetap sesuai dengan aplikasinya.
3. Bisa dipakai nyaman oleh nelayan: HP Android kelas bawah, sinyal 3G/4G, layar terkena matahari, literasi digital beragam.
4. 100% teknologi gratis (lihat §8).

**Non-tujuan (v1)**
- Aplikasi native Android/iOS (cukup PWA yang bisa di-"Install").
- Integrasi pembayaran nyata, Dukcapil, KUSUKA KKP, atau API WhatsApp Business.
- Model ML sungguhan.
- Multi-bahasa (v1 hanya Bahasa Indonesia).

---

## 3. Persona & Peran

| Peran | Siapa | Perangkat utama | Kebutuhan inti |
|---|---|---|---|
| **Nelayan** | "Pak Rudi", 35–55 th, pembudidaya rumput laut / nelayan tangkap | Android murah, layar 5,5–6,5", sering di luar ruangan | Ajukan modal tanpa agunan, tahu kapan setor bagi hasil, cairkan dana |
| **Investor** | "Dedi", 22–40 th, investor ritel pemula | Android/iPhone menengah | Pilih proyek yang bisa dipercaya, pantau portofolio & keamanan akun |
| **Admin Pengelola** | Staf operasional platform | Laptop **dan** HP | Verifikasi KYC, tinjau pengajuan, awasi ledger & radar penipuan |
| **Digital Facilitator** | Anggota Karang Taruna, Gen Z | Android | Mendampingi nelayan input data, menindaklanjuti skor < 50 — *tidak ada mockup, lihat §14* |

---

## 4. Audit Desain Klien: Apa yang Membuatnya "AI Slop"

Yang **dipertahankan**: struktur informasi, nama menu (Dompetku, Forum Bahari, Radar Ancaman, dsb.), urutan alur, konten data.

Yang **diganti**, beserta alasannya:

| Masalah di mockup | Kenapa terasa slop | Pengganti |
|---|---|---|
| Logo perisai/gelombang generik dalam kotak gradien teal | Pola logo default generator AI, tidak punya cerita | Logo baru dari klien/Anda sendiri (spesifikasi §6.6) |
| Tiga peran punya tema berbeda (navy gelap, teal, putih) tanpa sistem | Terlihat seperti tiga aplikasi berbeda | Satu sistem warna; peran dibedakan lewat konten & aksen kecil, bukan tema |
| Semua kartu: radius sama, bayangan sama, badge di pojok kanan atas | Ritme visual datar, tidak ada hierarki | Hierarki tegas: 1 kartu "hero" per layar, sisanya daftar datar tanpa bayangan |
| Badge di mana-mana ("System Online", "Polygon Network Active", "Skor Tinggi", "Terverifikasi") | Hiasan "teknologi" yang tidak membantu keputusan | Badge hanya untuk status yang memicu tindakan |
| Ikon campur gaya (outline, filled, emoji-like), ukuran tidak konsisten | Tanda paling jelas dari aset hasil tempel | Satu keluarga ikon, satu ketebalan (§6.5) |
| Teks abu-abu kecil di atas latar gelap | Kontras gagal, tidak terbaca di bawah matahari | Kontras minimal WCAG AA, body teks nelayan ≥ 16px |
| Copy setengah Inggris ("Ambil Tindakan", "Self-Lock", "Credential Proof") | Terasa terjemahan mesin | Bahasa Indonesia lugas; istilah teknis diberi penjelasan singkat |
| Foto stok bawah laut dengan penyelam | Tidak relevan dengan nelayan rumput laut | Foto lapangan asli (prioritas) atau foto bebas lisensi yang relevan |

---

## 5. Arah Visual (berdasarkan referensi "Finora")

Yang diambil dari referensi: **latar krem hangat, hijau tua sebagai warna utama, kuning mustard sebagai aksen tindakan, angka besar sebagai pusat perhatian, grafik batang lembut, sudut membulat besar tetapi tidak berlebihan, sentuhan serif miring untuk kalimat "insight".**

Yang **tidak** diambil: wajah orang di avatar stok, label dan layout satu-satu (supaya tidak menjiplak UI kit berbayar).

Metafora desain ARTANAYA: **"buku catatan nelayan"** — kertas krem, tinta hijau laut tua, stempel kuning. Hangat, dapat dipercaya, tidak "crypto-neon".

---

## 6. Design System

### 6.1 Token warna (draf, disetujui di Fase 1)

| Token | Hex | Pemakaian |
|---|---|---|
| `paper` | `#F4EFE4` | Latar aplikasi |
| `paper-sunk` | `#EAE3D3` | Latar input, area tenggelam |
| `surface` | `#FBF8F2` | Kartu |
| `ink` | `#1C211E` | Teks utama |
| `ink-muted` | `#5C625D` | Teks sekunder (tetap ≥ 4.5:1 di atas `paper`) |
| `line` | `#DCD4C3` | Garis pemisah, border |
| `kelp-900` | `#0F2A21` | Kartu hero, header gelap |
| `kelp-700` | `#1B4334` | Warna utama, tombol sekunder |
| `kelp-200` | `#C9D8CB` | Batang grafik, latar badge netral |
| `sun-500` | `#E3AE3F` | Tombol aksi utama (CTA), highlight angka |
| `sun-100` | `#F7E8C4` | Latar pengingat/jatuh tempo |
| `coral-600` | `#B9492F` | Bahaya, ancaman, nominal keluar |
| `tide-600` | `#2C6A6E` | Info, tautan |
| `score-high/mid/low` | turunan kelp / sun / coral | Badge skor (S ≥ 70 / 50–69 / < 50) |

Aturan: **tidak ada gradien** kecuali satu tekstur halus di kartu hero. **Tidak ada ungu, tidak ada neon.** Mode gelap tidak termasuk v1 (lihat §14).

### 6.2 Tipografi (Google Fonts, lisensi OFL, gratis untuk komersial)

| Peran | Font | Catatan |
|---|---|---|
| UI & body | **Plus Jakarta Sans** | Dibuat oleh studio tipografi Jakarta (Tokotype); cocok dengan cerita lokal |
| Aksen editorial | **Instrument Serif** (italic) | Hanya untuk kalimat insight/sapaan, maks. 1 per layar |
| Angka | Plus Jakarta Sans dengan `font-variant-numeric: tabular-nums` | Nominal Rupiah rata kanan & sejajar |

Skala (mobile): 12 / 14 / 16 / 18 / 22 / 28 / 36 / 44px. Body minimum **16px untuk peran Nelayan**, 14px untuk Admin.

### 6.3 Ruang, radius, bayangan

- Grid jarak 4px; padding layar 20px; jarak antarbagian 28px.
- Radius: 10 (input, chip), 16 (kartu), 24 (kartu hero), penuh (pill/badge). Hanya empat nilai.
- Bayangan: **satu** level saja, untuk elemen melayang (bottom sheet, nav). Kartu biasa pakai border `line`, bukan bayangan.

### 6.4 Komponen inti

`Button` (primary-sun, secondary-kelp, ghost, danger) · `IconButton` · `TextField` · `MoneyInput` (stepper ±, format Rp) · `OtpInput` · `Stepper` (langkah 1-2-3) · `Card` / `HeroCard` · `ListRow` · `Badge` · `ScoreBadge` · `ScoreBreakdown` · `ProgressBar` · `Gauge` (skor keamanan) · `BarChart` mini · `TxRow` (baris transaksi + hash) · `Tabs` · `SegmentedControl` · `BottomNav` · `TopBar` · `BottomSheet` · `Toast` · `EmptyState` · `Skeleton` · `CameraLiveness` · `DisclaimerBar`.

Setiap komponen wajib punya state: default, hover/pressed, focus (ring terlihat), disabled, loading; daftar & halaman wajib punya **loading, kosong, error**.

### 6.5 Ikon (Anda unduh sendiri)

**Rekomendasi: [Phosphor Icons](https://phosphoricons.com)** — lisensi MIT, punya ikon kelautan (`Boat`, `Fish`, `Anchor`, `Waves`, `Plant`), tersedia dalam beberapa ketebalan.

Aturan pemakaian:
- Satu keluarga saja. Ketebalan **Regular** untuk semua; **Fill** hanya untuk tab bottom-nav yang aktif.
- Ukuran: 20px (dalam teks/list), 24px (nav, tombol). Warna mengikuti `currentColor`.
- Ikon selalu disertai label teks untuk peran Nelayan.
- Ikon domain yang tidak tersedia (rumput laut, keramba, jaring) dibuat custom 24×24 dengan stroke 1.5px agar senada, atau diambil dari [Tabler Icons](https://tabler.io/icons) (MIT) dan disesuaikan.

Format serah terima: SVG per file, tanpa `width/height` tetap, `stroke="currentColor"`, disimpan di `src/assets/icons/` dengan nama `kebab-case` sesuai tabel di **Lampiran A**.

Alternatif bila tidak suka Phosphor: Iconoir (MIT) atau Tabler (MIT). **Hindari Lucide** dan emoji sebagai ikon — dua-duanya ciri khas tampilan template AI.

### 6.6 Logo & aset merek (Anda/klien siapkan)

Kebutuhan file:
| File | Format | Ukuran |
|---|---|---|
| Logo lengkap (mark + wordmark) | SVG | horizontal & vertikal |
| Mark saja | SVG | harus tetap terbaca di 24px |
| Versi satu warna | SVG | untuk latar gelap & terang |
| Favicon | SVG + PNG | 32×32 |
| Ikon PWA | PNG | 192, 512, dan 512 *maskable* (area aman 80%) |
| Apple touch icon | PNG | 180×180 |

Arahan agar tidak generik: hindari perisai, gembok, sirkuit, dan gradien; mulailah dari bentuk yang punya cerita (simpul tali jangkar, perahu jukung, gelombang + timbangan bagi hasil). Selama logo belum ada, saya pakai **wordmark teks sementara** — bukan logo karangan saya.

### 6.7 Foto & ilustrasi

Prioritas: foto lapangan asli dari klien (nelayan/budidaya yang benar-benar didampingi). Cadangan: Unsplash/Pexels (lisensi gratis untuk komersial), dikompres ke WebP ≤ 120 KB. Tidak memakai ilustrasi 3D/AI generik.

### 6.8 Gaya bahasa (copywriting)

- Sapaan Nelayan: "Bapak/Ibu", kalimat pendek, kata kerja di depan: "Ajukan modal", "Setor bagi hasil".
- Istilah syariah/teknis diberi penjelasan sekali dengan tombol "Apa ini?": *mudharabah*, *nisbah*, *smart contract*.
- Angka: `Rp32.400.000` (format `id-ID`), tanggal `15 Sep 2026`.
- Hindari: "Revolusioner", "Next-gen", "Powered by AI" sebagai hiasan.

---

## 7. Inventaris Layar & Alur

Kode layar dipakai di laporan progres. Semua mobile-first (lebar desain 390px). Admin juga responsif ke desktop (≥ 1024px: bottom-nav berubah menjadi sidebar).

### 7.1 Umum
| Kode | Layar | Catatan |
|---|---|---|
| U-01 | Splash / pemilihan peran | Masuk sebagai Nelayan / Investor; Admin lewat URL `/admin` |
| U-02 | Masuk (email + kata sandi / Google / akun demo) | Nomor HP & KUSUKA tetap diisi di U-03 sebagai data profil |
| U-03 | Verifikasi akun langkah 1 — Data diri | Field berbeda per peran |
| U-04 | Verifikasi langkah 2 — Biometrik (kamera, liveness) | Fallback: "Tidak punya kamera? Minta bantuan fasilitator" |
| U-05 | Verifikasi langkah 3 — Selesai / menunggu | |

### 7.2 Nelayan — bottom nav: Beranda · Proyek Saya · Dompetku · Bantuan · Profil
| Kode | Layar | Isi utama |
|---|---|---|
| N-01 | Beranda | Sapaan, kartu hero proyek aktif (terkumpul vs target, %), akses cepat (Ajukan Proyek, Data Hasil, Lapor Progres), pengingat setoran bagi hasil |
| N-02 | Ajukan proyek — jenis usaha | Budidaya, Tangkap, Garam, Olahan Ikan (konfirmasi daftar ke klien) |
| N-03 | Ajukan proyek — kebutuhan dana & rencana | `MoneyInput`, rencana penggunaan dana, unggah foto |
| N-04 | Ajukan proyek — data sinyal | Volume tangkapan 6 bulan, keanggotaan koperasi/KUB, dokumen KUSUKA/SKU |
| N-05 | Hasil skor AI | Skor S, badge, rincian 5 sinyal dalam bahasa awam, tindakan sesuai Tabel Keputusan (§9) |
| N-06 | Proyek Saya (daftar + detail) | Status: draf, ditinjau, tayang, didanai, berjalan, selesai, perlu pembinaan |
| N-07 | Dompetku | Saldo dana diterima, tombol Ajukan Pencairan, jatuh tempo bagi hasil, riwayat pencairan & setoran |
| N-08 | Ajukan pencairan / Setor bagi hasil | Bottom sheet + konfirmasi; tercatat sebagai transaksi ledger |
| N-09 | Bantuan | FAQ, hubungi fasilitator (wa.me), panduan akad |
| N-10 | Profil | Data usaha, riwayat proyek, dokumen legalitas (KUSUKA), pengaturan & keluar |

### 7.3 Investor — bottom nav: Beranda · Ajukan/Investasi* · Komunitas · Radar · Profil
\*Label tab kedua di mockup tidak terbaca jelas, dikonfirmasi ke klien.

| Kode | Layar | Isi utama |
|---|---|---|
| I-01 | Beranda | Ringkasan portofolio, pencarian, filter (Semua, Perikanan Tangkap, Budidaya, …), kartu proyek (foto, lokasi, skor, progres, estimasi bagi hasil) |
| I-02 | Prospektus proyek | Skor AI + rincian, nisbah bagi hasil, jadwal pencairan bertahap, profil nelayan, risiko, dokumen akad |
| I-03 | Alur investasi | Nominal (min Rp50.000), ringkasan akad mudharabah, persetujuan, pembayaran simulasi, bukti (hash transaksi) |
| I-04 | Portofolio | Daftar investasi, status, bagi hasil diterima, grafik batang bulanan |
| I-05 | Radar Ancaman | Skor keamanan (gauge), status transaksi aman, kunci mandiri (self-lock), aktivitas terpantau (login perangkat baru, transfer) |
| I-06 | Forum Bahari | Tab Forum Komunitas / Artikel Edukasi, filter topik, buat diskusi |
| I-07 | Ruang Konsultasi | Panduan akad + tanya-jawab (lihat §14 soal AI chat) |
| I-08 | Profil | Ringkasan (proyek didanai, total investasi, skor keamanan), portofolio & bukti kredensial, pusat keamanan, pengaturan |

### 7.4 Admin — bottom nav (mobile) / sidebar (desktop): Beranda · Tinjau · Ledger · Radar AI · Profil
| Kode | Layar | Isi utama |
|---|---|---|
| A-01 | Masuk admin | ID/email + kode akses + OTP |
| A-02 | Beranda | Total dana kelolaan, proyek aktif, audit radar, Tugas Hari Ini (pengajuan & antrean KYC), log sistem terbaru |
| A-03 | Tinjau pengajuan (daftar) | Kode proyek, nama, pengaju, target, status |
| A-04 | Detail pengajuan | Rincian skor, dokumen, keputusan: Tayangkan / Rujuk ke Fasilitator / Minta Data |
| A-05 | Antrean KYC | Foto KTP/selfie simulasi, hasil liveness, setujui/tolak |
| A-06 | Smart Contract Ledger | Ringkasan rantai (jumlah blok, blok terakhir), log transaksi (hash, jenis, proyek, nominal), tombol Verifikasi Rantai, detail transaksi |
| A-07 | Radar AI Fraud | Daftar peringatan (geofencing tidak sesuai, liveness gagal, dll.) dengan tingkat keparahan; aksi: Tindak Lanjuti / Abaikan + alasan |
| A-08 | Profil & pengaturan | Pengaturan sistem (ambang skor, bobot — hanya baca di v1), log keamanan akses, keluar |

### 7.5 Fasilitator (usulan, tergantung keputusan §14)
| F-01 | Daftar nelayan dampingan | F-02 | Bantu input data hasil tangkapan | F-03 | Tugas pembinaan (proyek skor < 50) |

---

## 8. Tech Stack (semua gratis)

### 8.1 Frontend

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Build & framework | **Vite + React + TypeScript (strict)** | Aplikasi di balik login, tidak butuh SEO → SPA lebih ringan & cepat daripada Next.js, deploy statis gratis di mana saja |
| Styling | **Tailwind CSS v4** dengan token dari §6 | Token jadi satu sumber kebenaran; tidak memakai tema bawaan |
| Komponen dasar | **Radix UI Primitives** (headless) | Aksesibilitas dialog/tabs/switch sudah benar, tampilan 100% milik kita. *Tidak memakai shadcn/ui apa adanya* karena tampilannya sangat dikenali sebagai template |
| Routing | **React Router** (mode data) | Route per peran + guard |
| Data server | **TanStack Query** | Cache, loading/error state konsisten |
| State lokal | **Zustand** | Sesi, peran, preferensi |
| Form & validasi | **React Hook Form + Zod** | Skema Zod dipakai ulang untuk mock & backend |
| Animasi | **Motion** (dulu Framer Motion), dipakai hemat | Transisi bottom sheet & angka; hormati `prefers-reduced-motion` |
| Grafik | **Komponen SVG buatan sendiri** (bar, gauge, progress) | Hanya 3–4 jenis grafik; lebih ringan & lebih khas daripada library chart |
| Klien backend | **@supabase/supabase-js** | Auth, query, storage, realtime |
| Mock (khusus test) | **MSW** | Hanya untuk unit/E2E test, bukan untuk aplikasi |
| PWA | **vite-plugin-pwa** | Bisa di-install, aset di-cache untuk sinyal lemah |
| Liveness wajah | **MediaPipe Face Landmarker** (lazy-load) | Gratis, berjalan di perangkat, gambar wajah tidak dikirim ke server |
| Blockchain | **Ledger simulasi** (disepakati) | Lihat §9.3; tanpa library blockchain |
| Format | `Intl.NumberFormat('id-ID')`, **dayjs** locale `id` | |
| Kualitas | ESLint, Prettier, **Vitest + Testing Library**, **Playwright** (alur utama) | |

### 8.2 Infrastruktur gratis

| Layanan | Pilihan | Batas gratis yang perlu diketahui* |
|---|---|---|
| Kode | GitHub (repo privat) | — |
| CI | GitHub Actions | Kuota menit gratis untuk repo privat terbatas, cukup untuk lint/test/build |
| Hosting frontend | **Vercel (Hobby)** | Gratis, deploy otomatis dari GitHub, preview URL per branch; subdomain gratis `*.vercel.app`. Cadangan: Cloudflare Pages |
| Backend | **Supabase Free** (disepakati) | Postgres, Auth, Storage, Edge Functions; **proyek di-pause bila tidak aktif ~1 minggu** → dicegah dengan GitHub Actions terjadwal yang melakukan query ringan tiap 3 hari |
| Analitik | Cloudflare Web Analytics | Tanpa cookie |
| Error monitoring | Sentry (paket Developer gratis) | Kuota event/bulan terbatas |
| WhatsApp | Tautan `wa.me` | Bukan API; hanya membuka chat |

\*Angka & syarat berubah sewaktu-waktu; dicek ulang saat setup dan dicatat di laporan Fase 1.

**Catatan penting soal "gratis":**
- **Vercel Hobby dipakai** karena ini prototipe lomba, bukan layanan yang dijual. Sebaiknya akun Vercel/GitHub atas nama tim/klien, supaya saat serah terima tidak perlu pindah akun.
- **Domain kustom (`artanaya.id`, dll.) tidak gratis.** Tanpa beli domain, alamatnya `artanaya.vercel.app` (bila nama masih tersedia).
- Paket gratis tidak memberi jaminan uptime (SLA). Untuk demo/lomba cukup.

### 8.3 Pemakaian Supabase oleh frontend

| Kebutuhan | Cara |
|---|---|
| Login | Email + kata sandi dan **Google OAuth** (keduanya gratis). OTP via SMS **tidak** dipakai karena butuh penyedia SMS berbayar; layar OTP di mockup diganti verifikasi email/kode demo |
| Login demo | Tombol "Masuk sebagai akun demo" per peran (Nelayan, Investor, Admin) di layar U-01, supaya juri bisa mencoba tanpa mendaftar |
| Data | Tabel: `profiles` (peran), `projects`, `score_signals`, `investments`, `ledger_tx`, `wallet_tx`, `kyc_requests`, `fraud_alerts`, `forum_posts`, `articles` |
| Hak akses | **Row Level Security** per peran: nelayan hanya melihat proyeknya sendiri, investor melihat proyek yang tayang & investasinya, admin melihat semua |
| Dokumen | Supabase Storage (bucket privat) untuk KUSUKA/SKU dan foto proyek. **Foto wajah biometrik tidak diunggah**, hanya hasil cek (lulus/gagal, waktu) |
| Real-time | Supabase Realtime untuk antrean admin & radar: pengajuan baru langsung muncul di layar admin saat demo |
| Skor | Rumus tetap di `lib/scoring.ts`, juga disimpan sebagai fungsi Postgres agar hasilnya sama di kedua sisi |
| Data contoh | Skrip seed: 8–12 proyek, nama & lokasi pesisir Indonesia yang realistis, riwayat transaksi 6 bulan |
| Tipe data | Tipe TypeScript dihasilkan dari skema (`supabase gen types`) |
| Cadangan demo | Mode baca-saja dengan data seed yang dibundel, aktif otomatis bila Supabase tidak terjangkau |

### 8.4 Struktur folder (rencana)

```
src/
  app/            # router, provider, guard per peran
  design/         # token, font, komponen inti (§6.4)
  features/
    auth/ onboarding/ scoring/ projects/ wallet/
    invest/ portfolio/ security-radar/ forum/
    admin-review/ ledger/ fraud-radar/ kyc/
  mocks/          # handler MSW untuk test + data cadangan demo
supabase/
  migrations/     # skema + RLS
  seed.sql        # data contoh realistis (nama, lokasi pesisir Indonesia)
  lib/            # format rupiah, tanggal, rumus skor
  assets/icons/   # SVG dari Anda (Lampiran A)
docs/
  PRD.md
  progress/       # laporan per fase
```

---

## 9. Logika Bisnis yang Ditampilkan Frontend

### 9.1 Rumus skor (Lampiran 7)

`S = 0,25·T + 0,30·P + 0,15·K + 0,15·L + 0,15·R` — setiap sinyal bernilai 0–100, S bernilai 0–100.

| Sinyal | Nama | Sumber data |
|---|---|---|
| T | Transaksi Digital | Frekuensi & nominal transaksi Dompetku 90 hari |
| P | Produktivitas | Rata-rata & stabilitas volume tangkapan 6 bulan |
| K | Kelembagaan | Status & lama keanggotaan koperasi/KUB |
| L | Legalitas | Kelengkapan KUSUKA & SKU |
| R | Riwayat Akad | Penyelesaian mudharabah sebelumnya di ARTANAYA |

**Cold-start** (R tidak tersedia): bobot R dibagi proporsional ke empat sinyal lain → T 0,294 · P 0,353 · K 0,176 · L 0,176. ✅ Disepakati (menggantikan "R = 0" di tabel Lampiran 7). Nelayan baru diberi label info **"Nelayan Baru"**, bukan "Skor Awal".

**Aturan umum redistribusi:** sinyal yang datanya tidak ada dikeluarkan dari rumus, bobotnya dibagi proporsional ke sinyal yang ada. Bila yang hilang selain R → label "Skor Awal – Perlu Verifikasi Tambahan" (skenario 4).

**Normalisasi sinyal ke 0–100** — ⚠️ *asumsi tim pengembang, bukan dari dokumen klien.* Di layar rincian skor ditampilkan catatan kecil "Ambang acuan bersifat asumsi prototipe". Semua angka acuan disimpan di satu file konfigurasi (`lib/scoring.config.ts`) supaya mudah diubah.

| Sinyal | Rumus (dibatasi 0–100) | Alasan |
|---|---|---|
| **T** Transaksi Digital | `50·min(f/60, 1) + 50·min(n/Rp15.000.000, 1)` · f = jumlah transaksi Dompetku 90 hari, n = total nominal 90 hari | ±5 transaksi/minggu & omzet ±Rp5 juta/bulan dianggap aktivitas usaha mikro yang sehat |
| **P** Produktivitas | `60·min(v/acuan, 1) + 40·max(0, 1 − CV)` · v = rata-rata volume bulanan 6 bulan, CV = koefisien variasi volume (stabilitas) | Acuan per jenis usaha: rumput laut kering 1.000 kg/bln · ikan tangkap 600 kg/bln · garam 2.000 kg/bln · olahan ikan 300 kg/bln. Musim paceklik wajar, jadi stabilitas berbobot lebih kecil |
| **K** Kelembagaan | Bukan anggota = 0 · anggota aktif = `40 + 20·min(tahun, 3)` | Sudah bergabung = sinyal kuat; lama keanggotaan menambah kepercayaan, maksimal 3 tahun |
| **L** Legalitas | KUSUKA terverifikasi = 60 · SKU = 40 (dijumlah) | KUSUKA dokumen inti sektor kelautan, SKU pelengkap |
| **R** Riwayat Akad | `100 · (akad lunas tepat waktu / total akad)` − 15 per akad yang macet | Tidak tersedia untuk nelayan baru → redistribusi |

Contoh perhitungan untuk data seed: Pak Rudi (budidaya, nelayan baru) — T 72, P 81, K 80, L 100 → S = 0,294·72 + 0,353·81 + 0,176·80 + 0,176·100 ≈ **81 → Skor Tinggi**.

### 9.2 Tabel keputusan

| # | Skor | Data | Tampilan & tindakan |
|---|---|---|---|
| 1 | S ≥ 70 | Lengkap | Tayang di marketplace, badge "Skor Tinggi" |
| 2 | 50 ≤ S < 70 | Lengkap | Tayang, badge "Skor Sedang" + rekomendasi pendampingan fasilitator |
| 3 | S < 50 | Lengkap | Tidak tayang; status **"Perlu Pembinaan"** (bukan "Ditolak"), dirujuk ke fasilitator |
| 4 | Berapa pun | Tidak lengkap | Bobot didistribusikan ulang; badge "Skor Awal – Perlu Verifikasi Tambahan" |

Prinsip copy dari dokumen klien dijaga: skor rendah **tidak pernah** dibahasakan sebagai penolakan.

Di v1 rumus dijalankan di modul `lib/scoring.ts` (murni, teruji unit test) supaya bisa dipindah ke backend tanpa mengubah UI.

### 9.3 Ledger smart contract (simulasi)

Dibuat sebagai **hash chain** di tabel `ledger_tx`, sehingga sifat "tidak bisa diubah diam-diam" tetap benar-benar bekerja, bukan sekadar tampilan:

- Setiap transaksi (investasi masuk, pencairan tahap N, setoran bagi hasil, distribusi bagi hasil) menyimpan: nomor blok berurutan, waktu, jenis, proyek, nominal, `prev_hash`, dan `hash = SHA-256(prev_hash + isi transaksi)`.
- Penulisan hanya lewat fungsi Postgres; baris tidak bisa di-UPDATE/DELETE (dicegah trigger + RLS).
- **Tombol "Verifikasi Rantai"** di layar Ledger (A-06) dan bukti transaksi investor menghitung ulang seluruh hash di browser. Bila ada data yang diubah lewat database, rantai tampil **putus** di baris tersebut. Ini bisa didemokan ke juri.
- "Aturan akad" dijalankan sebagai fungsi Postgres: pencairan tahap berikutnya hanya bisa diajukan bila laporan progres tahap sebelumnya sudah ada; bagi hasil dibagi otomatis sesuai nisbah dan porsi tiap investor.
- Label di UI: "Ledger Smart Contract (simulasi)". Tidak menyebut jaringan Polygon atau jaringan nyata lain.

---

## 10. Kebutuhan Non-Fungsional (target terukur)

| Aspek | Target | Cara ukur |
|---|---|---|
| LCP | ≤ 2,5 dtk di Android kelas menengah, 4G lambat | Lighthouse mobile + WebPageTest |
| INP | ≤ 200 ms | Web Vitals di produksi |
| CLS | ≤ 0,1 | Lighthouse |
| JS awal | ≤ 180 KB (gzip) per peran; kamera/MediaPipe di-lazy-load | `vite build` + analisis bundle |
| Aksesibilitas | Lighthouse a11y ≥ 95; kontras AA; target sentuh ≥ 44px (Nelayan 48px); fokus keyboard terlihat | Lighthouse + axe + cek manual |
| Offline | Shell aplikasi & data terakhir tetap tampil tanpa sinyal; aksi tulis menampilkan pesan jelas | Uji mode pesawat |
| Browser | Chrome Android 2 versi terakhir, Safari iOS 16+, Chrome/Edge desktop | Playwright |
| Keamanan frontend | Tidak ada rahasia di bundle; data biometrik tidak meninggalkan perangkat; sesi kedaluwarsa | Review + skrip scan |

Target uptime tidak ditetapkan karena paket gratis tidak punya SLA (lihat §8.2).

---

## 11. Rencana Kerja (Fase)

Setiap fase berakhir dengan: (1) link preview yang bisa dibuka, (2) **laporan progres** `docs/progress/NN-nama-fase.md`, (3) persetujuan Anda sebelum fase berikutnya.

| Fase | Isi | Keluaran | Gerbang persetujuan |
|---|---|---|---|
| **0** | Penyusunan & kesepakatan PRD | PRD v1.0 disetujui | Semua poin §14 terjawab |
| **1** | Fondasi: setup repo, token, font, komponen inti, halaman `/styleguide` | Styleguide hidup di preview | Anda setuju tampilan warna/tipografi/komponen — **ini titik paling penting untuk "anti AI slop"** |
| **2** | Kerangka aplikasi + Supabase: skema, RLS, seed, auth (email, Google, akun demo), routing per peran, bottom nav/sidebar, onboarding (U-01…U-05), workflow keep-alive | Bisa masuk sebagai 3 peran dengan data sungguhan | Alur masuk OK |
| **3** | Alur Nelayan (N-01…N-10) + modul skor | Alur pengajuan → skor → dompet | Demo alur nelayan |
| **4** | Alur Investor (I-01…I-08) | Telusur → investasi → portofolio → radar | Demo alur investor |
| **5** | Alur Admin (A-01…A-08), responsif desktop | Tinjau, ledger, radar fraud | Demo alur admin |
| **6** | (opsional) Fasilitator F-01…F-03 | | |
| **7** | QA: a11y, performa, uji perangkat murah, Playwright, PWA, deploy final | Laporan QA + URL produksi | Serah terima |

Estimasi durasi tidak saya tetapkan dulu — tergantung tenggat klien dan apakah backend masuk lingkup (§14).

### 11.1 Definisi "selesai" per layar
- Sesuai token & komponen (tidak ada warna/ukuran "liar").
- State loading, kosong, error ada.
- Lolos cek kontras & navigasi keyboard.
- Teks final Bahasa Indonesia, tanpa lorem ipsum.
- Berjalan di lebar 360px tanpa scroll horizontal.

---

## 12. Workflow Kolaborasi & Dokumentasi

1. **Sepakat dulu, baru kerja.** Saya tidak menulis kode untuk sebuah fase sebelum Anda menyetujui rencananya.
2. **Laporan progres wajib** setiap selesai eksekusi, di `docs/progress/`, memakai template `docs/progress/_TEMPLATE.md`: apa yang dikerjakan, file yang berubah, keputusan yang diambil, yang belum selesai/belum terverifikasi, langkah berikutnya.
3. **Log keputusan** dicatat di bagian bawah PRD ini (§15) agar konteks tidak hilang antar sesi.
4. PRD diberi nomor versi; perubahan lingkup = versi baru + catatan perubahan.
5. Git: satu branch per fase, commit kecil dengan pesan jelas.

---

## 13. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Supabase gratis pause saat tidak aktif | Demo gagal saat dibuka juri/klien | Ping terjadwal via GitHub Actions + mode cadangan baca-saja dengan data seed |
| Juri mengubah/merusak data demo | Tampilan demo berantakan | Akun demo terpisah per peran + tombol admin "Reset data demo" yang menjalankan ulang seed |
| Klaim "AI" & "blockchain" terdengar lebih besar dari kenyataan | Kredibilitas di depan penilai | Halaman "Cara kerja skor" yang jujur & transparan — jadi nilai jual, bukan kelemahan |
| Liveness di HP murah lambat | Nelayan gagal verifikasi | Lazy-load, batas waktu, jalur bantuan fasilitator |
| Logo/ikon dari Anda datang terlambat | Fase 1 tertahan | Wordmark & ikon placeholder netral, diganti tanpa mengubah kode (komponen `Icon` berbasis nama) |
| Pertanyaan regulasi SCF/OJK | Salah klaim legal | Disclaimer prototipe; tidak ada teks yang mengklaim berizin |

---

## 14. Keputusan Terbuka (wajib disepakati)

1. ~~**Lingkup backend.**~~ ✅ Disepakati: **Supabase** (lihat §8.3).
2. ~~**Blockchain.**~~ ✅ Disepakati: **simulasi** berbasis hash chain (lihat §9.3).
3. **Peran Digital Facilitator.** Dibuatkan layar (F-01…F-03) atau cukup disebut sebagai kontak bantuan?
4. **Ruang Konsultasi AI.** Usulan setelah konfirmasi "AI sederhana": asisten berbasis pencocokan kata kunci + FAQ terstruktur (jawaban cepat, tidak butuh API, tidak pernah gagal saat demo). Chatbot LLM hanya jika diminta.
5. ~~**Nilai R nelayan baru.**~~ ✅ Disepakati: redistribusi bobot (§9.1).
6. ~~**Normalisasi sinyal.**~~ ✅ Disepakati: asumsi tim, ditandai di UI (§9.1).
7. **Daftar jenis usaha** di N-02 dan **label tab kedua investor** — tolong konfirmasi teks aslinya (di mockup kurang terbaca).
8. ~~**Tenggat waktu.**~~ ✅ **Besok, 20 Nov 2026** → lingkup dipangkas, lihat §16.
9. **Mode gelap**: tidak termasuk v1 — setuju?
10. **Foto lapangan asli** dari klien tersedia?

---

## 15. Log Keputusan

| Tanggal | Keputusan | Oleh |
|---|---|---|
| 19 Nov 2026 | Draf PRD v0.1 dibuat | — |
| 19 Nov 2026 | Proyek = prototipe lomba; harus fungsional & bagus, "AI" cukup sederhana | Pemilik proyek |
| 19 Nov 2026 | Hosting frontend: Vercel Hobby (menggantikan Cloudflare Pages) | Pemilik proyek |
| 19 Nov 2026 | Backend: Supabase Free; login email + Google + akun demo (tanpa OTP SMS) | Pemilik proyek |
| 19 Nov 2026 | Blockchain: ledger simulasi (hash chain SHA-256 di Postgres + verifikasi di browser) | Pemilik proyek |
| 19 Nov 2026 | Nilai R nelayan baru: redistribusi bobot; label "Nelayan Baru" | Pemilik proyek |
| 19 Nov 2026 | Normalisasi sinyal: asumsi tim (§9.1), ditandai di UI | Pemilik proyek |
| 19 Nov 2026 | Tenggat lomba 20 Nov 2026 → berlaku Rencana Kilat §16 | Pemilik proyek |
| 19 Nov 2026 | Jam tenggat: **20 Nov 2026 pukul 08.00**. Akun Supabase/Vercel/GitHub sudah disiapkan pemilik | Pemilik proyek |
| 19 Nov 2026 | Alur pengajuan: sistem menghitung skor & rekomendasi sesuai Tabel Keputusan, admin memverifikasi berkas lalu menayangkan (human-in-the-loop) | Tim pengembang |

---

## 16. Rencana Kilat — Tenggat 20 Nov 2026

Tenggat besok membuat rencana 8 fase di §11 **tidak realistis**. §11 tetap disimpan sebagai rencana lanjutan setelah lomba; untuk besok berlaku rencana ini.

### 16.1 Prinsip
1. **Satu cerita demo yang mulus** lebih bernilai daripada 31 layar setengah jadi.
2. Kualitas visual (§5–6) **tidak** dipangkas, yang dipangkas adalah jumlah layar.
3. Lapisan data dibuat dengan *adapter*: **adapter lokal (browser)** dikerjakan duluan supaya pembangunan layar tidak menunggu akun Supabase; **adapter Supabase** dipasang begitu kredensial proyek tersedia. Bila Supabase belum siap sampai batas waktu, aplikasi tetap jalan dengan adapter lokal.
4. Ikon memakai paket **`@phosphor-icons/react`** (ikon yang sama dengan Lampiran A, lisensi MIT) supaya tidak menunggu unduhan manual; bisa diganti SVG Anda kapan saja lewat komponen `Icon`.
5. Logo: wordmark teks "ARTANAYA" sampai file logo Anda masuk.

### 16.2 Cerita demo (alur emas)
> Pak Rudi (nelayan) mengajukan modal budidaya rumput laut → sistem menghitung skor 81 "Skor Tinggi" → Admin meninjau & menayangkan → Dedi (investor) mendanai Rp500.000 → transaksi tercatat di ledger & lolos "Verifikasi Rantai" → Admin melihat peringatan di Radar Fraud → Pak Rudi melihat dana masuk di Dompetku.

### 16.3 Prioritas layar
| Prioritas | Layar |
|---|---|
| **P0 — wajib** | Design token & komponen inti · U-01 (splash + akun demo per peran) · N-01, N-02–N-05, N-07 · I-01, I-02, I-03, I-05 · A-02, A-03, A-04, A-06, A-07 |
| **P1 — bila waktu cukup** | U-03–U-05 (KYC + liveness; cadangan: simulasi cek wajah) · N-06, N-10 · I-04, I-08 · A-05, A-08 · adapter Supabase |
| **P2 — setelah lomba** | Forum Bahari (I-06), Ruang Konsultasi (I-07, sementara FAQ statis), layar Fasilitator (F-01–F-03, sementara hanya tombol WhatsApp), PWA/offline, Playwright, uji performa formal |

### 16.4 Urutan kerja
| Blok | Pekerjaan | Laporan |
|---|---|---|
| 1 | Setup Vite + TS + Tailwind, token, font, komponen inti, halaman `/styleguide` | `01-fondasi.md` → **Anda cek tampilan sebentar** |
| 2 | Kerangka peran, splash & akun demo, adapter data lokal + data seed, modul skor (+ unit test) | `02-kerangka-data.md` |
| 3 | Layar P0 Nelayan | `03-nelayan.md` |
| 4 | Layar P0 Admin + ledger hash chain + radar fraud | `04-admin.md` |
| 5 | Layar P0 Investor | `05-investor.md` |
| 6 | Deploy Vercel, uji alur emas di HP, perbaikan | `06-deploy.md` |
| 7 | P1 sesuai sisa waktu, termasuk Supabase | `07-tambahan.md` |

### 16.5 Yang dibutuhkan dari Anda
- **Jam pasti tenggat** besok.
- Untuk Supabase: buat proyek gratis di supabase.com, lalu berikan **Project URL** dan **anon public key** (kunci publik, aman untuk frontend). **Jangan kirim `service_role` key.**
- Akun Vercel & GitHub (untuk deploy di Blok 6).
- Logo & ikon custom bila sudah ada (opsional).

---

## Lampiran A — Inventaris Ikon (untuk diunduh)

Nama mengikuti Phosphor; simpan sebagai `src/assets/icons/<nama-file>.svg`.

| Nama file | Phosphor | Dipakai di |
|---|---|---|
| `home` | House | Bottom nav semua peran |
| `folder` | FolderSimple | Proyek Saya |
| `wallet` | Wallet | Dompetku |
| `help` | Question | Bantuan |
| `user` | User | Profil |
| `chats` | ChatsCircle | Komunitas / Forum |
| `radar` | Radar | Radar Ancaman / Radar AI |
| `clipboard-check` | ClipboardText | Tinjau (admin) |
| `link` | LinkSimple | Ledger |
| `plus` / `minus` | Plus / Minus | Ajukan proyek, MoneyInput |
| `plant` | Plant | Budidaya |
| `fish` | Fish | Tangkap |
| `boat` | Boat | Peremajaan kapal |
| `cooking-pot` | CookingPot | Olahan ikan |
| `drop` | Drop | Garam |
| `upload` | UploadSimple | Lapor progres, unggah dokumen |
| `chart-bar` | ChartBar | Data hasil |
| `calendar` | CalendarDots | Jatuh tempo |
| `arrow-down-left` / `arrow-up-right` | ArrowDownLeft / ArrowUpRight | Dana masuk / keluar |
| `identification-card` | IdentificationCard | KUSUKA, KYC |
| `scan-face` | ScanSmiley | Biometrik |
| `shield-check` | ShieldCheck | Status aman |
| `lock` | LockSimple | Self-lock |
| `map-pin` | MapPin | Lokasi, geofencing |
| `warning` | WarningCircle | Peringatan |
| `bell` | Bell | Notifikasi |
| `magnifying-glass` | MagnifyingGlass | Pencarian |
| `caret-left` / `caret-right` | CaretLeft / CaretRight | Navigasi |
| `whatsapp` | WhatsappLogo | Bantuan via WA |
| `google` | GoogleLogo | Masuk dengan Google |
| `sign-out` | SignOut | Keluar |
| `gear` | GearSix | Pengaturan |
| `file-text` | FileText | Dokumen, akad |
| `copy` | Copy | Salin hash |
| `seaweed` | *(custom/Tabler)* | Rumput laut |

Daftar ini final setelah Fase 1; ikon tambahan dicatat di laporan progres.
