import { useState, type ReactNode } from 'react'
import {
  Badge,
  BarChart,
  BottomNav,
  BottomSheet,
  Button,
  Card,
  ChipRow,
  Divider,
  EmptyState,
  Gauge,
  HeroCard,
  Icon,
  IconButton,
  iconNames,
  ListRow,
  MoneyInput,
  Notice,
  ProgressBar,
  ScoreBadge,
  ScoreBreakdown,
  ScoreDial,
  SectionHeader,
  Segmented,
  Skeleton,
  Stepper,
  TextField,
  TxRow,
  Wordmark,
} from '@/design'
import { formatRupiah } from '@/lib/format'

const swatches: { name: string; hex: string; use: string; dark?: boolean }[] = [
  { name: 'paper', hex: '#F4EFE4', use: 'Latar aplikasi' },
  { name: 'paper-sunk', hex: '#EAE3D3', use: 'Input, area tenggelam' },
  { name: 'surface', hex: '#FBF8F2', use: 'Kartu' },
  { name: 'line', hex: '#DCD4C3', use: 'Garis & border' },
  { name: 'ink', hex: '#1C211E', use: 'Teks utama', dark: true },
  { name: 'ink-muted', hex: '#5C625D', use: 'Teks sekunder', dark: true },
  { name: 'kelp-900', hex: '#0F2A21', use: 'Kartu hero, tombol sekunder', dark: true },
  { name: 'kelp-700', hex: '#1B4334', use: 'Warna utama, skor tinggi', dark: true },
  { name: 'kelp-200', hex: '#C9D8CB', use: 'Batang grafik' },
  { name: 'sun-500', hex: '#E3AE3F', use: 'Aksi utama (CTA)' },
  { name: 'sun-100', hex: '#F7E8C4', use: 'Pengingat jatuh tempo' },
  { name: 'coral-600', hex: '#B9492F', use: 'Bahaya, dana keluar', dark: true },
  { name: 'tide-600', hex: '#2C6A6E', use: 'Info, tautan, hash', dark: true },
]

function Block({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-line pt-8">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {note && <p className="mt-1 max-w-[60ch] text-sm text-ink-muted">{note}</p>}
      </div>
      {children}
    </section>
  )
}

export function Styleguide() {
  const [money, setMoney] = useState(50_000_000)
  const [seg, setSeg] = useState('forum')
  const [chip, setChip] = useState('Semua')
  const [sheet, setSheet] = useState(false)

  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-8 lg:grid-cols-[1fr_400px] lg:px-10">
      <main className="flex min-w-0 flex-col gap-10">
        <header className="flex flex-col gap-3">
          <Wordmark />
          <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">
            Sistem desain{' '}
            <em className="font-serif text-[1.1em] font-normal italic text-kelp-700">buku catatan nelayan</em>
          </h1>
          <p className="max-w-[60ch] text-ink-muted">
            Kertas krem, tinta hijau laut, stempel kuning. Halaman ini adalah gerbang persetujuan Fase 1: semua layar
            dibangun hanya dari token dan komponen di bawah.
          </p>
        </header>

        <Block id="warna" title="Warna" note="13 token. Tidak ada gradien, ungu, atau neon. Kontras teks minimal WCAG AA.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {swatches.map((s) => (
              <div key={s.name} className="overflow-hidden rounded-md border border-line bg-surface">
                <div className="flex h-20 items-end p-3" style={{ background: s.hex }}>
                  <span className={`num text-2xs font-semibold ${s.dark ? 'text-paper' : 'text-ink'}`}>{s.hex}</span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold">{s.name}</p>
                  <p className="text-2xs text-ink-muted">{s.use}</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block id="tipografi" title="Tipografi" note="Plus Jakarta Sans (Tokotype, Jakarta) untuk UI. Instrument Serif miring hanya untuk satu kalimat insight per layar.">
          <Card className="flex flex-col gap-4 p-6">
            <p className="num text-[44px] font-extrabold leading-none tracking-tight">{formatRupiah(32_400_000)}</p>
            <p className="text-[28px] font-bold tracking-tight">Ajukan modal usaha</p>
            <p className="text-[22px] font-bold">Riwayat pencairan</p>
            <p className="text-lg font-semibold">Budidaya Rumput Laut Sagara</p>
            <p className="max-w-[52ch] text-base">
              Body 16px untuk Nelayan. Kalimat pendek, kata kerja di depan, tanpa istilah teknis tanpa penjelasan.
            </p>
            <p className="text-sm text-ink-muted">Teks sekunder 14px — tanggal, keterangan, lokasi.</p>
            <p className="font-serif text-2xl italic text-kelp-700">“Hasil panen bulan ini 18% lebih tinggi dari rata-rata Bapak.”</p>
          </Card>
        </Block>

        <Block id="tombol" title="Tombol" note="Tinggi 48px (target jempol). Kuning = satu aksi utama per layar.">
          <div className="flex flex-wrap items-center gap-3">
            <Button icon="plus">Ajukan Proyek</Button>
            <Button variant="secondary">Tinjau Berkas</Button>
            <Button variant="ghost" icon="whatsapp">
              Hubungi Fasilitator
            </Button>
            <Button variant="danger" icon="lock">
              Kunci Akun
            </Button>
            <Button variant="quiet" iconRight="caret-right">
              Lihat semua
            </Button>
            <Button loading>Memproses</Button>
            <Button disabled>Nonaktif</Button>
            <Button size="sm" variant="secondary">
              Kecil
            </Button>
            <IconButton icon="bell" label="Notifikasi" tone="soft" badge />
          </div>
        </Block>

        <Block id="input" title="Input">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nama lengkap" placeholder="Rudi Hartono" defaultValue="Rudi Hartono" />
            <TextField label="Nomor KUSUKA" icon="identification-card" placeholder="3201 xxxx xxxx" hint="16 digit, tertera di Kartu Pelaku Usaha." />
            <TextField label="Nomor HP / WhatsApp" placeholder="0812 xxxx xxxx" error="Nomor belum lengkap" defaultValue="0812" />
            <MoneyInput label="Berapa dana yang dibutuhkan?" value={money} onChange={setMoney} hint="Minimal Rp5.000.000, kelipatan Rp1.000.000." />
          </div>
        </Block>

        <Block id="status" title="Badge, skor & progres" note="Skor < 50 tidak pernah berlabel “Ditolak”, tetapi “Perlu Pembinaan”.">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <ScoreBadge score={81} />
              <ScoreBadge score={62} />
              <ScoreBadge score={41} />
              <ScoreBadge score={58} complete={false} />
              <Badge tone="tide" icon="info">
                Nelayan Baru
              </Badge>
              <Badge tone="neutral">Draf</Badge>
              <Badge tone="kelp" icon="verified">
                Terverifikasi
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <ScoreDial score={81} />
              <ScoreDial score={62} />
              <ScoreDial score={41} />
              <div className="min-w-[220px] flex-1">
                <ProgressBar value={68} />
                <p className="mt-1 text-2xs text-ink-muted">68% dana terkumpul</p>
              </div>
            </div>
            <Stepper steps={['Data diri', 'Wajah', 'Selesai']} current={1} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Notice title="Setor bagi hasil 15 Sep 2026">Rp1.250.000 untuk 14 investor</Notice>
              <Notice tone="tide" icon="info" title="Ambang acuan bersifat asumsi">
                Lihat cara kerja skor
              </Notice>
              <Notice tone="coral" icon="warning" title="Lokasi tidak sesuai">
                Login dari Medan, akun terdaftar di Lombok
              </Notice>
            </div>
          </div>
        </Block>

        <Block id="grafik" title="Grafik & skor AI">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm text-ink-muted">Volume panen 6 bulan</p>
              <p className="num mb-4 text-2xl font-bold">1.140 kg</p>
              <BarChart
                data={[
                  { label: 'Mei', value: 820 },
                  { label: 'Jun', value: 940 },
                  { label: 'Jul', value: 610 },
                  { label: 'Agu', value: 1020 },
                  { label: 'Sep', value: 1180 },
                  { label: 'Okt', value: 1140 },
                ]}
                highlight={5}
              />
            </Card>
            <Card className="flex items-center justify-center p-5">
              <Gauge value={86} label="Skor keamanan akun" caption="2 aktivitas ditinjau minggu ini" />
            </Card>
            <Card className="p-5 md:col-span-2">
              <ScoreBreakdown
                rows={[
                  { key: 'T', name: 'Transaksi Digital', score: 72, weight: 0.294, note: '41 transaksi Dompetku dalam 90 hari' },
                  { key: 'P', name: 'Produktivitas', score: 81, weight: 0.353, note: 'Rata-rata 1.140 kg/bulan, cukup stabil' },
                  { key: 'K', name: 'Kelembagaan', score: 80, weight: 0.176, note: 'Anggota KUB Sagara sejak 2024' },
                  { key: 'L', name: 'Legalitas', score: 100, weight: 0.176, note: 'KUSUKA & SKU lengkap' },
                  { key: 'R', name: 'Riwayat Akad', score: null, weight: 0, note: 'Nelayan baru — bobot dibagi ke sinyal lain' },
                ]}
              />
            </Card>
          </div>
        </Block>

        <Block id="navigasi" title="Navigasi & pemilih">
          <div className="flex max-w-[420px] flex-col gap-4">
            <Segmented
              label="Jenis konten"
              value={seg}
              onChange={setSeg}
              options={[
                { value: 'forum', label: 'Forum Komunitas' },
                { value: 'artikel', label: 'Artikel Edukasi' },
              ]}
            />
            <ChipRow options={['Semua', 'Budidaya', 'Tangkap', 'Olahan Ikan', 'Garam']} value={chip} onChange={setChip} />
            <Button variant="ghost" onClick={() => setSheet(true)}>
              Buka bottom sheet
            </Button>
          </div>
        </Block>

        <Block id="ikon" title="Ikon" note="Phosphor Regular, satu ketebalan. Fill hanya untuk tab aktif. Ganti dengan SVG Anda lewat src/design/Icon.tsx.">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-8">
            {iconNames.map((n) => (
              <div key={n} className="flex flex-col items-center gap-1.5 rounded-sm border border-line bg-surface px-1 py-3">
                <Icon name={n} size={24} />
                <span className="w-full truncate text-center text-[10px] text-ink-muted">{n}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block id="state" title="State kosong & memuat">
          <div className="grid gap-4 sm:grid-cols-2">
            <EmptyState icon="folder" title="Belum ada proyek" body="Ajukan proyek pertama Bapak, prosesnya sekitar 10 menit." action={<Button size="sm" icon="plus">Ajukan Proyek</Button>} />
            <Card className="flex flex-col gap-3 p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </Card>
          </div>
        </Block>
      </main>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-sm font-semibold text-ink-muted">Contoh komposisi — Beranda Nelayan (N-01)</p>
        <PhonePreview />
      </aside>

      <BottomSheet open={sheet} onOpenChange={setSheet} title="Ajukan pencairan tahap 2" description="Dana dicairkan setelah laporan progres tahap 1 diterima.">
        <div className="flex flex-col gap-4">
          <Card className="divide-y divide-line px-4">
            <div className="flex justify-between py-3 text-sm">
              <span className="text-ink-muted">Nominal</span>
              <span className="num font-bold">{formatRupiah(20_000_000)}</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-ink-muted">Rekening tujuan</span>
              <span className="font-semibold">BRI ••• 4821</span>
            </div>
          </Card>
          <Button block onClick={() => setSheet(false)}>
            Ajukan Pencairan
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}

function PhonePreview() {
  const [tab, setTab] = useState('home')
  return (
    <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[36px] border-[6px] border-kelp-950 bg-paper shadow-float">
      <div className="flex h-[760px] flex-col">
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-ink-muted">Selamat pagi,</p>
              <p className="text-[22px] font-bold leading-tight">Pak Rudi</p>
            </div>
            <IconButton icon="bell" label="Notifikasi" tone="soft" badge />
          </div>

          <HeroCard>
            <div className="mb-4 flex items-center justify-between">
              <Badge tone="onDark" icon="plant">
                Proyek aktif
              </Badge>
              <span className="num text-2xs text-kelp-300">PRJ-0021</span>
            </div>
            <p className="text-lg font-semibold leading-snug">Budidaya Rumput Laut Sagara</p>
            <p className="mb-4 text-sm text-kelp-300">Desa Gerupuk, Lombok Tengah</p>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="num text-[28px] font-extrabold tracking-tight">{formatRupiah(32_400_000)}</span>
              <span className="num text-sm font-semibold text-sun-300">68%</span>
            </div>
            <ProgressBar value={68} onDark />
            <p className="mt-2 text-2xs text-kelp-300">terkumpul dari target Rp48.000.000 · 14 investor</p>
          </HeroCard>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(
              [
                ['plus', 'Ajukan Proyek'],
                ['chart-bar', 'Data Hasil'],
                ['upload', 'Lapor Progres'],
              ] as const
            ).map(([icon, label]) => (
              <button key={label} className="flex flex-col items-center gap-2 rounded-md border border-line bg-surface px-2 py-4 transition-colors hover:bg-paper-sunk">
                <span className="flex size-10 items-center justify-center rounded-full bg-kelp-100 text-kelp-700">
                  <Icon name={icon} size={20} />
                </span>
                <span className="text-2xs font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Notice title="Setor bagi hasil 15 Sep 2026">Rp1.250.000 · nisbah 40% untuk investor</Notice>
          </div>

          <div className="mt-6">
            <SectionHeader title="Dompetku" action={<Button size="sm" variant="quiet" iconRight="caret-right">Semua</Button>} />
            <Card className="px-4">
              <TxRow title="Pencairan tahap 1" date="02 Agu 2026" amount={20_000_000} direction="in" hash="0x3f9a51be08c714" />
              <Divider />
              <TxRow title="Setor bagi hasil Juli" date="15 Agu 2026" amount={1_250_000} direction="out" hash="0x8b02ac9e11d0f3" />
            </Card>
          </div>

          <div className="mt-6">
            <SectionHeader title="Bantuan" />
            <Card className="px-4">
              <ListRow icon="whatsapp" iconTone="kelp" title="Hubungi fasilitator" subtitle="Dimas · Karang Taruna Gerupuk" chevron onClick={() => {}} />
            </Card>
          </div>

          <p className="mt-6 text-center font-serif text-lg italic text-kelp-700">
            “Panen Oktober 18% di atas rata-rata Bapak.”
          </p>
        </div>
        <BottomNav
          active={tab}
          onSelect={setTab}
          items={[
            { key: 'home', label: 'Beranda', icon: 'home' },
            { key: 'proyek', label: 'Proyek Saya', icon: 'folder' },
            { key: 'dompet', label: 'Dompetku', icon: 'wallet' },
            { key: 'bantuan', label: 'Bantuan', icon: 'help' },
            { key: 'profil', label: 'Profil', icon: 'user' },
          ]}
        />
      </div>
    </div>
  )
}
