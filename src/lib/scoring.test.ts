import { describe, expect, it } from 'vitest'
import { computeScore, scoreK, scoreL, scoreP, scoreT, type SignalInput } from './scoring'
import { buildChain, verifyChain } from './ledger'

const rudi: SignalInput = {
  type: 'budidaya',
  tx: { count90: 41, amount90: 9_400_000 },
  volumes: [820, 940, 760, 1020, 1180, 1140],
  membership: { member: true, years: 2 },
  legal: { kusuka: true, sku: true },
  history: null,
}

describe('sinyal', () => {
  it('T dibatasi 100', () => expect(scoreT({ count90: 999, amount90: 1e12 })).toBe(100))
  it('K bukan anggota = 0', () => expect(scoreK({ member: false, years: 5 })).toBe(0))
  it('K maksimal 3 tahun', () => expect(scoreK({ member: true, years: 10 })).toBe(100))
  it('L KUSUKA saja = 60', () => expect(scoreL({ kusuka: true, sku: false })).toBe(60))
  it('P volume stabil & penuh = 100', () => expect(scoreP([1000, 1000, 1000], 'budidaya')).toBe(100))
  it('P tanpa data = null', () => expect(scoreP([], 'tangkap')).toBeNull())
})

describe('computeScore', () => {
  it('nelayan baru: bobot R dibagi proporsional, total bobot = 1', () => {
    const r = computeScore(rudi)
    expect(r.newcomer).toBe(true)
    expect(r.weights.R).toBe(0)
    const sum = Object.values(r.weights).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 6)
    expect(r.weights.P).toBeCloseTo(0.3 / 0.85, 6)
    expect(r.complete).toBe(true)
  })

  it('Pak Rudi masuk Skor Tinggi', () => {
    const r = computeScore(rudi)
    expect(r.score).toBeGreaterThanOrEqual(70)
    expect(r.decision).toBe('tayang-tinggi')
  })

  it('skor < 50 → pembinaan, bukan ditolak', () => {
    const r = computeScore({ ...rudi, tx: { count90: 3, amount90: 300_000 }, volumes: [80, 20, 150, 40, 10, 60], membership: { member: false, years: 0 }, legal: { kusuka: false, sku: false } })
    expect(r.score).toBeLessThan(50)
    expect(r.decision).toBe('pembinaan')
  })

  it('data selain R kosong → Skor Awal (verifikasi)', () => {
    const r = computeScore({ ...rudi, tx: null })
    expect(r.complete).toBe(false)
    expect(r.decision).toBe('verifikasi')
    expect(r.weights.T).toBe(0)
  })

  it('riwayat akad dihitung bila ada', () => {
    const r = computeScore({ ...rudi, history: { total: 2, onTime: 2, defaulted: 0 } })
    expect(r.signals.R).toBe(100)
    expect(r.weights.R).toBeCloseTo(0.15, 6)
  })
})

describe('ledger hash chain', () => {
  const base = { projectId: 'PRJ-1', from: 'a', to: 'b', memo: 'x', ts: '2026-11-01T00:00:00Z' }
  it('rantai utuh lolos verifikasi', async () => {
    const chain = await buildChain([
      { ...base, type: 'investasi', amount: 500_000 },
      { ...base, type: 'pencairan', amount: 20_000_000 },
    ])
    expect(await verifyChain(chain)).toEqual({ ok: true, checked: 2 })
  })
  it('nominal diubah → rantai putus di blok itu', async () => {
    const chain = await buildChain([
      { ...base, type: 'investasi', amount: 500_000 },
      { ...base, type: 'pencairan', amount: 20_000_000 },
      { ...base, type: 'setoran', amount: 1_000_000 },
    ])
    chain[1] = { ...chain[1], amount: 90_000_000 }
    const v = await verifyChain(chain)
    expect(v.ok).toBe(false)
    if (!v.ok) expect(v.brokenAt).toBe(2)
  })
})
