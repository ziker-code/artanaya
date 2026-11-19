import {
  BASE_WEIGHTS,
  K_REF,
  L_REF,
  P_REF,
  R_REF,
  T_REF,
  THRESHOLDS,
  type BusinessType,
} from './scoring.config'

export type SignalKey = keyof typeof BASE_WEIGHTS

export type SignalInput = {
  type: BusinessType
  /** T — transaksi Dompetku 90 hari; null = tidak ada data */
  tx: { count90: number; amount90: number } | null
  /** P — volume bulanan 6 bulan terakhir (kg) */
  volumes: number[] | null
  /** K — keanggotaan koperasi / KUB */
  membership: { member: boolean; years: number } | null
  /** L — dokumen legalitas */
  legal: { kusuka: boolean; sku: boolean } | null
  /** R — riwayat akad di ARTANAYA; null = nelayan baru */
  history: { total: number; onTime: number; defaulted: number } | null
}

export type Decision = 'tayang-tinggi' | 'tayang-sedang' | 'pembinaan' | 'verifikasi'

export type ScoreResult = {
  score: number
  signals: Record<SignalKey, number | null>
  weights: Record<SignalKey, number>
  /** true bila semua sinyal selain R tersedia */
  complete: boolean
  newcomer: boolean
  decision: Decision
}

const clamp = (n: number) => Math.max(0, Math.min(100, n))
const round = (n: number) => Math.round(n)

export function scoreT(tx: SignalInput['tx']) {
  if (!tx) return null
  return round(clamp(50 * Math.min(tx.count90 / T_REF.txCount90, 1) + 50 * Math.min(tx.amount90 / T_REF.txAmount90, 1)))
}

export function scoreP(volumes: SignalInput['volumes'], type: BusinessType) {
  if (!volumes || volumes.length === 0) return null
  const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length
  if (mean === 0) return 0
  const sd = Math.sqrt(volumes.reduce((a, v) => a + (v - mean) ** 2, 0) / volumes.length)
  const cv = sd / mean
  return round(clamp(60 * Math.min(mean / P_REF[type], 1) + 40 * Math.max(0, 1 - cv)))
}

export function scoreK(m: SignalInput['membership']) {
  if (!m) return null
  if (!m.member) return 0
  return round(clamp(K_REF.base + K_REF.perYear * Math.min(m.years, K_REF.maxYears)))
}

export function scoreL(l: SignalInput['legal']) {
  if (!l) return null
  return (l.kusuka ? L_REF.kusuka : 0) + (l.sku ? L_REF.sku : 0)
}

export function scoreR(h: SignalInput['history']) {
  if (!h || h.total === 0) return null
  return round(clamp((100 * h.onTime) / h.total - R_REF.penaltyPerDefault * h.defaulted))
}

/** S = Σ wᵢ·sinyalᵢ, bobot sinyal kosong dibagi proporsional ke sinyal yang ada. */
export function computeScore(input: SignalInput): ScoreResult {
  const signals: Record<SignalKey, number | null> = {
    T: scoreT(input.tx),
    P: scoreP(input.volumes, input.type),
    K: scoreK(input.membership),
    L: scoreL(input.legal),
    R: scoreR(input.history),
  }
  const keys = Object.keys(BASE_WEIGHTS) as SignalKey[]
  const available = keys.filter((k) => signals[k] !== null)
  const availWeight = available.reduce((a, k) => a + BASE_WEIGHTS[k], 0)
  const weights = Object.fromEntries(
    keys.map((k) => [k, signals[k] === null || availWeight === 0 ? 0 : BASE_WEIGHTS[k] / availWeight]),
  ) as Record<SignalKey, number>

  const score = round(available.reduce((a, k) => a + weights[k] * (signals[k] as number), 0))
  const complete = (['T', 'P', 'K', 'L'] as SignalKey[]).every((k) => signals[k] !== null)
  const newcomer = signals.R === null

  let decision: Decision
  if (!complete) decision = 'verifikasi'
  else if (score >= THRESHOLDS.high) decision = 'tayang-tinggi'
  else if (score >= THRESHOLDS.mid) decision = 'tayang-sedang'
  else decision = 'pembinaan'

  return { score, signals, weights, complete, newcomer, decision }
}

export const DECISION_COPY: Record<Decision, { title: string; body: string }> = {
  'tayang-tinggi': {
    title: 'Layak tayang — Skor Tinggi',
    body: 'Proyek direkomendasikan tampil di marketplace investor setelah berkas diverifikasi admin.',
  },
  'tayang-sedang': {
    title: 'Layak tayang — Skor Sedang',
    body: 'Proyek tampil dengan pendampingan Digital Facilitator selama berjalan.',
  },
  pembinaan: {
    title: 'Perlu pembinaan dulu',
    body: 'Fasilitator akan membantu melengkapi data dan memperkuat usaha sebelum diajukan ulang. Ini bukan penolakan.',
  },
  verifikasi: {
    title: 'Skor Awal — perlu verifikasi tambahan',
    body: 'Sebagian data belum ada, jadi bobotnya dibagi ke data lain. Lengkapi data untuk skor yang lebih akurat.',
  },
}

export const SIGNAL_NAME: Record<SignalKey, string> = {
  T: 'Transaksi Digital',
  P: 'Produktivitas',
  K: 'Kelembagaan',
  L: 'Legalitas',
  R: 'Riwayat Akad',
}
