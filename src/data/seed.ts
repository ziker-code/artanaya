import { computeScore, type SignalInput } from '@/lib/scoring'
import { buildChain, type LedgerPayload } from '@/lib/ledger'
import type { FraudAlert, Investment, Project, SecurityEvent, Stage, User } from './types'

const DAY = 86_400_000
export const daysFromNow = (n: number) => new Date(Date.now() + n * DAY).toISOString()
const ago = (n: number) => daysFromNow(-n)

export const DEMO = { nelayan: 'u-rudi', investor: 'u-dedi', admin: 'u-admin' } as const

export const users: User[] = [
  {
    id: 'u-rudi',
    role: 'nelayan',
    name: 'Rudi Hartono',
    initials: 'RH',
    location: 'Desa Gerupuk, Lombok Tengah',
    phone: '0812-3740-1186',
    kusuka: '5202 1408 7731 0042',
    kub: 'KUB Sagara Gerupuk',
    facilitator: { name: 'Dimas Pratama', phone: '6281234567890', org: 'Karang Taruna Gerupuk' },
    joinedAt: ago(140),
  },
  { id: 'u-dedi', role: 'investor', name: 'Dedi Saputra', initials: 'DS', location: 'Bogor, Jawa Barat', phone: '0813-1192-5520', joinedAt: ago(96) },
  { id: 'u-admin', role: 'admin', name: 'Admin Utama', initials: 'AU', location: 'Kantor ARTANAYA', phone: '-', joinedAt: ago(400) },
  { id: 'u-siti', role: 'nelayan', name: 'Siti Rahmawati', initials: 'SR', location: 'Pacitan, Jawa Timur', phone: '-', joinedAt: ago(220) },
  { id: 'u-yohanes', role: 'nelayan', name: 'Yohanes Lado', initials: 'YL', location: 'Semau, Kupang', phone: '-', joinedAt: ago(80) },
  { id: 'u-made', role: 'nelayan', name: 'I Made Sukarta', initials: 'MS', location: 'Kusamba, Klungkung', phone: '-', joinedAt: ago(300) },
  { id: 'u-nur', role: 'nelayan', name: 'Nurhayati', initials: 'NH', location: 'Galesong, Takalar', phone: '-', joinedAt: ago(60) },
  { id: 'u-asep', role: 'nelayan', name: 'Asep Saepudin', initials: 'AS', location: 'Pelabuhanratu, Sukabumi', phone: '-', joinedAt: ago(30) },
  { id: 'u-laode', role: 'nelayan', name: 'La Ode Hamid', initials: 'LH', location: 'Wangi-Wangi, Wakatobi', phone: '-', joinedAt: ago(20) },
]

const otherInvestors = ['Rina Maharani', 'Fajar Nugroho', 'Ayu Lestari', 'Bagas Wicaksono', 'Putri Anggraini', 'Hendra Gunawan', 'Wulan Sari', 'Ikhsan Maulana', 'Citra Dewi', 'Rizky Ramadhan']

export function makeStages(target: number, labels = ['Bibit & tali', 'Perawatan', 'Panen & pengeringan']): Stage[] {
  const parts = labels.length === 3 ? [0.42, 0.33, 0.25] : labels.map(() => 1 / labels.length)
  let acc = 0
  return labels.map((label, i) => {
    const amount = i === labels.length - 1 ? target - acc : Math.round((target * parts[i]) / 1_000_000) * 1_000_000
    acc += amount
    return { n: i + 1, label, amount, status: 'locked' }
  })
}

type SeedProject = Omit<Project, 'score' | 'stages'> & { stages?: Stage[] }

function sig(s: Partial<SignalInput> & Pick<SignalInput, 'type'>): SignalInput {
  return { tx: null, volumes: null, membership: null, legal: null, history: null, ...s }
}

const seedProjects: SeedProject[] = [
  {
    id: 'PRJ-0021',
    ownerId: 'u-rudi',
    title: 'Budidaya Rumput Laut Sagara',
    type: 'budidaya',
    location: 'Desa Gerupuk, Lombok Tengah',
    summary: 'Perluasan 40 tali bentang Eucheuma cottonii untuk pasokan kering ke pengepul Mataram.',
    plan: 'Membeli 2.000 ikat bibit, tali PE, dan pelampung; menambah para-para pengeringan agar mutu kering naik.',
    target: 48_000_000,
    raised: 48_000_000,
    investorShare: 0.4,
    tenorMonths: 8,
    expectedReturnPct: 16,
    status: 'running',
    signals: sig({ type: 'budidaya', tx: { count90: 41, amount90: 9_400_000 }, volumes: [820, 940, 760, 1020, 1180, 1140], membership: { member: true, years: 2 }, legal: { kusuka: true, sku: true } }),
    nextDue: { date: daysFromNow(26), amount: 1_250_000 },
    createdAt: ago(75),
    reviewedAt: ago(72),
  },
  {
    id: 'PRJ-0024',
    ownerId: 'u-siti',
    title: 'Peremajaan Kapal Tuna 10 GT',
    type: 'tangkap',
    location: 'Pelabuhan Tamperan, Pacitan',
    summary: 'Ganti mesin dan perbaiki lambung kapal agar bisa melaut 18 hari per bulan.',
    plan: 'Mesin diesel 30 PK, pengecatan anti-fouling, cool box 1 ton.',
    target: 120_000_000,
    raised: 64_800_000,
    investorShare: 0.4,
    tenorMonths: 12,
    expectedReturnPct: 14,
    status: 'live',
    signals: sig({ type: 'tangkap', tx: { count90: 58, amount90: 21_000_000 }, volumes: [520, 610, 450, 580, 640, 600], membership: { member: true, years: 4 }, legal: { kusuka: true, sku: true }, history: { total: 1, onTime: 1, defaulted: 0 } }),
    createdAt: ago(18),
    reviewedAt: ago(16),
  },
  {
    id: 'PRJ-0027',
    ownerId: 'u-yohanes',
    title: 'Rumput Laut Ekspor Semau',
    type: 'budidaya',
    location: 'Pulau Semau, Kupang',
    summary: 'Budidaya long-line untuk kontrak ekspor kering asin ke Surabaya.',
    plan: 'Bibit kultur jaringan, perahu jukung kecil, dan terpal pengeringan.',
    target: 50_000_000,
    raised: 15_500_000,
    investorShare: 0.4,
    tenorMonths: 6,
    expectedReturnPct: 17,
    status: 'live',
    signals: sig({ type: 'budidaya', tx: { count90: 30, amount90: 6_200_000 }, volumes: [600, 720, 680, 900, 840, 910], membership: { member: true, years: 1 }, legal: { kusuka: true, sku: true } }),
    createdAt: ago(9),
    reviewedAt: ago(8),
  },
  {
    id: 'PRJ-0029',
    ownerId: 'u-made',
    title: 'Garam Palung Kusamba',
    type: 'garam',
    location: 'Pantai Kusamba, Klungkung',
    summary: 'Tambah 12 palung kayu untuk garam tradisional bersertifikat indikasi geografis.',
    plan: 'Palung kayu kelapa, alat siram, gudang penyimpanan kecil.',
    target: 30_000_000,
    raised: 24_600_000,
    investorShare: 0.35,
    tenorMonths: 6,
    expectedReturnPct: 13,
    status: 'live',
    signals: sig({ type: 'garam', tx: { count90: 22, amount90: 4_100_000 }, volumes: [900, 1400, 2100, 2300, 1200, 700], membership: { member: true, years: 1 }, legal: { kusuka: true, sku: false } }),
    createdAt: ago(21),
    reviewedAt: ago(19),
  },
  {
    id: 'PRJ-0031',
    ownerId: 'u-nur',
    title: 'Abon & Bakso Tenggiri Galesong',
    type: 'olahan',
    location: 'Galesong, Takalar',
    summary: 'Kelompok ibu pesisir mengolah tenggiri jadi abon kemasan untuk toko oleh-oleh Makassar.',
    plan: 'Spinner abon, sealer, freezer, dan izin PIRT.',
    target: 25_000_000,
    raised: 3_000_000,
    investorShare: 0.4,
    tenorMonths: 6,
    expectedReturnPct: 15,
    status: 'live',
    signals: sig({ type: 'olahan', tx: { count90: 64, amount90: 13_800_000 }, volumes: [240, 260, 280, 300, 290, 310], membership: { member: true, years: 1 }, legal: { kusuka: true, sku: true } }),
    createdAt: ago(3),
    reviewedAt: ago(2),
  },
  {
    id: 'PRJ-0033',
    ownerId: 'u-asep',
    title: 'Jaring & Mesin Perahu Pelabuhanratu',
    type: 'tangkap',
    location: 'Pelabuhanratu, Sukabumi',
    summary: 'Ganti jaring gillnet dan mesin tempel 15 PK untuk perahu 3 GT.',
    plan: 'Jaring gillnet 40 pis, mesin tempel 15 PK, GPS fish finder.',
    target: 35_000_000,
    raised: 0,
    investorShare: 0.4,
    tenorMonths: 9,
    expectedReturnPct: 15,
    status: 'review',
    signals: sig({ type: 'tangkap', tx: { count90: 36, amount90: 8_800_000 }, volumes: [380, 410, 300, 450, 470, 430], membership: { member: true, years: 2 }, legal: { kusuka: true, sku: true } }),
    createdAt: ago(1),
  },
  {
    id: 'PRJ-0034',
    ownerId: 'u-laode',
    title: 'Keramba Kerapu Wangi-Wangi',
    type: 'budidaya',
    location: 'Wangi-Wangi, Wakatobi',
    summary: 'Empat lubang keramba jaring apung untuk kerapu cantang.',
    plan: 'Rangka HDPE, jaring, benih kerapu 2.000 ekor, pakan 3 bulan.',
    target: 60_000_000,
    raised: 0,
    investorShare: 0.4,
    tenorMonths: 10,
    expectedReturnPct: 18,
    status: 'review',
    signals: sig({ type: 'budidaya', tx: { count90: 6, amount90: 900_000 }, volumes: [120, 40, 260, 90, 30, 150], membership: { member: false, years: 0 }, legal: { kusuka: true, sku: false } }),
    createdAt: ago(0.4),
  },
]

const stageLabels: Record<string, string[]> = {
  'PRJ-0021': ['Bibit & tali', 'Perawatan', 'Panen & pengeringan'],
  'PRJ-0024': ['Mesin', 'Lambung & cat', 'Cool box'],
  'PRJ-0027': ['Bibit', 'Perahu & terpal', 'Panen'],
  'PRJ-0029': ['Palung', 'Alat siram', 'Gudang'],
  'PRJ-0031': ['Peralatan', 'Izin PIRT', 'Bahan baku'],
  'PRJ-0033': ['Mesin tempel', 'Jaring', 'Fish finder'],
  'PRJ-0034': ['Rangka keramba', 'Benih', 'Pakan'],
}

export const projects: Project[] = seedProjects.map((p) => {
  const stages = makeStages(p.target, stageLabels[p.id])
  if (p.id === 'PRJ-0021') {
    stages[0] = { ...stages[0], status: 'disbursed', disbursedAt: ago(60) }
  }
  return { ...p, stages, score: computeScore(p.signals) }
})

/** Membagi `total` ke beberapa investor dengan nominal kelipatan Rp50.000. */
function spread(projectId: string, total: number, startDaysAgo: number, includeDedi?: number): Investment[] {
  const out: Investment[] = []
  let left = total
  let i = 0
  if (includeDedi) {
    out.push({ id: `${projectId}-dedi`, projectId, investorId: 'u-dedi', investorName: 'Dedi Saputra', amount: includeDedi, createdAt: ago(startDaysAgo - 1) })
    left -= includeDedi
  }
  while (left > 0) {
    const chunk = Math.min(left, [2_500_000, 1_000_000, 5_000_000, 500_000, 3_000_000, 1_500_000][i % 6])
    out.push({
      id: `${projectId}-${i}`,
      projectId,
      investorId: `x-${i % otherInvestors.length}`,
      investorName: otherInvestors[i % otherInvestors.length],
      amount: chunk,
      createdAt: ago(startDaysAgo - (i % Math.max(1, startDaysAgo))),
    })
    left -= chunk
    i++
  }
  return out
}

export const investments: Investment[] = [
  ...spread('PRJ-0021', 48_000_000, 70, 2_000_000),
  ...spread('PRJ-0024', 64_800_000, 15, 1_500_000),
  ...spread('PRJ-0027', 15_500_000, 7),
  ...spread('PRJ-0029', 24_600_000, 18, 500_000),
  ...spread('PRJ-0031', 3_000_000, 2),
].sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export const alerts: FraudAlert[] = [
  {
    id: 'AL-301',
    kind: 'geofence',
    severity: 'tinggi',
    title: 'Lokasi login tidak sesuai',
    detail: 'Akun nelayan terdaftar di Pelabuhanratu, tetapi login & pengajuan dikirim dari Medan (1.800 km).',
    subject: 'Asep Saepudin · PRJ-0033',
    createdAt: ago(0.2),
    status: 'open',
  },
  {
    id: 'AL-298',
    kind: 'liveness',
    severity: 'sedang',
    title: 'Cek keaktifan wajah gagal 3×',
    detail: 'Pola pantulan menyerupai foto di layar HP. Pendaftaran ditahan sampai verifikasi ulang.',
    subject: 'Pendaftar baru · NL-0412',
    createdAt: ago(0.6),
    status: 'open',
  },
  {
    id: 'AL-295',
    kind: 'device',
    severity: 'rendah',
    title: 'Ganti nomor HP & perangkat dalam 24 jam',
    detail: 'Nomor WhatsApp dan perangkat berganti sebelum pencairan tahap 2 diajukan.',
    subject: 'Investor · INV-1180',
    createdAt: ago(1.5),
    status: 'open',
  },
]

export const securityEvents: SecurityEvent[] = [
  { id: 'SE-3', userId: 'u-dedi', title: 'Login perangkat baru', detail: 'Chrome · Android 14 · Bogor', createdAt: ago(0.3), outcome: 'aman' },
  { id: 'SE-2', userId: 'u-dedi', title: 'Percobaan login dari IP luar negeri', detail: '3 kali salah sandi · Frankfurt, DE', createdAt: ago(2), outcome: 'diblokir' },
  { id: 'SE-1', userId: 'u-dedi', title: 'Tautan “hadiah investasi” di WhatsApp', detail: 'Domain artanaya-bonus.xyz dikenali sebagai phishing', createdAt: ago(5), outcome: 'diblokir' },
]

/** Riwayat ledger awal: semua investasi seed + pencairan & bagi hasil PRJ-0021. */
export function ledgerPayloads(): LedgerPayload[] {
  const p: LedgerPayload[] = investments.map((iv) => ({
    type: 'investasi',
    projectId: iv.projectId,
    amount: iv.amount,
    from: iv.investorName,
    to: iv.projectId,
    memo: 'Penyertaan dana akad mudharabah',
    ts: iv.createdAt,
  }))
  p.push({ type: 'pencairan', projectId: 'PRJ-0021', amount: 20_000_000, from: 'Escrow PRJ-0021', to: 'Rudi Hartono', memo: 'Pencairan tahap 1 — Bibit & tali', ts: ago(60) })
  p.push({ type: 'setoran', projectId: 'PRJ-0021', amount: 1_250_000, from: 'Rudi Hartono', to: 'Escrow PRJ-0021', memo: 'Setoran bagi hasil Oktober', ts: ago(4) })
  p.push({ type: 'distribusi', projectId: 'PRJ-0021', amount: 1_250_000, from: 'Escrow PRJ-0021', to: 'Investor PRJ-0021 (proporsional)', memo: 'Distribusi bagi hasil Oktober ke investor', ts: ago(4) })
  return p.sort((a, b) => a.ts.localeCompare(b.ts))
}

export async function buildSeed() {
  const ledger = await buildChain(ledgerPayloads())
  const hashByInvestment = new Map<string, string>()
  investments.forEach((iv) => {
    const b = ledger.find((l) => l.type === 'investasi' && l.ts === iv.createdAt && l.amount === iv.amount && l.from === iv.investorName)
    if (b) hashByInvestment.set(iv.id, b.hash)
  })
  return {
    users,
    projects,
    investments: investments.map((iv) => ({ ...iv, hash: hashByInvestment.get(iv.id) })),
    alerts,
    securityEvents,
    ledger,
  }
}
