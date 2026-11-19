/**
 * ⚠️ ASUMSI TIM PENGEMBANG (PRD §9.1) — bukan dari dokumen klien.
 * Ubah angka acuan di sini saja; UI & rumus otomatis mengikuti.
 */
export const BASE_WEIGHTS = { T: 0.25, P: 0.3, K: 0.15, L: 0.15, R: 0.15 } as const

export const THRESHOLDS = { high: 70, mid: 50 } as const

export const T_REF = { txCount90: 60, txAmount90: 15_000_000 }

/** kg per bulan yang dianggap "penuh" (100 poin volume) per jenis usaha */
export const P_REF: Record<BusinessType, number> = {
  budidaya: 1000,
  tangkap: 600,
  garam: 2000,
  olahan: 300,
}

export const K_REF = { base: 40, perYear: 20, maxYears: 3 }
export const L_REF = { kusuka: 60, sku: 40 }
export const R_REF = { penaltyPerDefault: 15 }

export type BusinessType = 'budidaya' | 'tangkap' | 'garam' | 'olahan'

export const BUSINESS_LABEL: Record<BusinessType, string> = {
  budidaya: 'Budidaya',
  tangkap: 'Perikanan Tangkap',
  garam: 'Garam',
  olahan: 'Olahan Ikan',
}
