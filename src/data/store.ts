import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { computeScore, type SignalInput } from '@/lib/scoring'
import { makeBlock, type LedgerPayload } from '@/lib/ledger'
import type { BusinessType } from '@/lib/scoring.config'
import { buildSeed, daysFromNow, makeStages, SEED_VERSION } from './seed'
import type { ForumThread, FraudAlert, Investment, LedgerBlock, Project, SecurityEvent, User, UserPrefs } from './types'

/**
 * Adapter data LOKAL (PRD §16.1): seluruh state disimpan di localStorage browser
 * dan disinkronkan antar-tab. Adapter Supabase menggantikan lapisan persist ini.
 */
type Data = {
  users: User[]
  projects: Project[]
  investments: Investment[]
  alerts: FraudAlert[]
  securityEvents: SecurityEvent[]
  ledger: LedgerBlock[]
  forum: ForumThread[]
  /** id notifikasi yang sudah dibaca, per pengguna */
  notifRead: Record<string, string[]>
  seedVersion: number
}

type State = Data & {
  ready: boolean
  sessionUserId: string | null
  selfLocked: boolean
  tamper: { block: number; amount: number } | null
  init: () => Promise<void>
  login: (userId: string) => void
  logout: () => void
  resetDemo: () => Promise<void>
  submitProject: (input: NewProjectInput) => Promise<Project>
  reviewProject: (id: string, action: 'publish' | 'coach', note: string) => void
  invest: (projectId: string, amount: number) => Promise<LedgerBlock>
  disburse: (projectId: string, stageN: number) => Promise<LedgerBlock>
  reportProgress: (projectId: string, stageN: number, report: string) => void
  payProfitShare: (projectId: string) => Promise<LedgerBlock>
  resolveAlert: (id: string, status: 'actioned' | 'dismissed', resolution: string) => void
  setSelfLock: (v: boolean) => void
  tamperLedger: () => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone' | 'location' | 'email' | 'kusuka' | 'kub'>>) => void
  updatePrefs: (patch: Partial<UserPrefs>) => void
  markNotifsRead: (ids: string[]) => void
  createThread: (t: { title: string; body: string; tag: string }) => ForumThread
  addComment: (threadId: string, body: string) => void
  toggleLike: (threadId: string) => void
}

export const DEFAULT_PREFS: UserPrefs = { notifWhatsapp: true, notifPush: true, loginAlert: true, twoStep: false, hideBalance: false }
const ROLE_LABEL = { nelayan: 'Nelayan', investor: 'Investor', admin: 'Admin' } as const

export type NewProjectInput = {
  title: string
  type: BusinessType
  target: number
  tenorMonths: number
  plan: string
  signals: SignalInput
}

const empty: Data = { users: [], projects: [], investments: [], alerts: [], securityEvents: [], ledger: [], forum: [], notifRead: {}, seedVersion: 0 }

let queue: Promise<unknown> = Promise.resolve()
/** Penulisan ledger berurutan supaya nomor blok & prevHash tidak tabrakan. */
function appendLedger(get: () => State, set: (p: Partial<State>) => void, payload: LedgerPayload) {
  const job = queue.then(async () => {
    const block = await makeBlock(get().ledger.at(-1), payload)
    set({ ledger: [...get().ledger, block] })
    return block
  })
  queue = job.catch(() => undefined)
  return job
}

const now = () => new Date().toISOString()

/** Sesi login disimpan per-tab (sessionStorage) supaya tab Nelayan & tab Admin bisa berdampingan. */
const SESSION_KEY = 'artanaya-session'
function readSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}
function writeSession(v: string | null) {
  try {
    if (v) sessionStorage.setItem(SESSION_KEY, v)
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* mode privat: sesi hanya di memori */
  }
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...empty,
      ready: false,
      sessionUserId: readSession(),
      selfLocked: false,
      tamper: null,

      init: async () => {
        if (get().ready && get().projects.length && get().seedVersion === SEED_VERSION) return
        const seed = await buildSeed()
        set({ ...seed, notifRead: {}, ready: true })
      },

      login: (userId) => {
        writeSession(userId)
        set({ sessionUserId: userId })
      },
      logout: () => {
        writeSession(null)
        set({ sessionUserId: null })
      },

      resetDemo: async () => {
        const seed = await buildSeed()
        set({ ...seed, notifRead: {}, ready: true, selfLocked: false, tamper: null })
      },

      submitProject: async (input) => {
        const me = get().sessionUserId!
        const owner = get().users.find((u) => u.id === me)!
        const nextNo = Math.max(...get().projects.map((p) => Number(p.id.slice(4)))) + 1
        const score = computeScore(input.signals)
        const project: Project = {
          id: `PRJ-${String(nextNo).padStart(4, '0')}`,
          ownerId: me,
          title: input.title,
          type: input.type,
          location: owner.location,
          summary: input.plan.slice(0, 120),
          plan: input.plan,
          target: input.target,
          raised: 0,
          investorShare: 0.4,
          tenorMonths: input.tenorMonths,
          expectedReturnPct: 15,
          status: 'review',
          signals: input.signals,
          score,
          stages: makeStages(input.target),
          createdAt: now(),
        }
        set({ projects: [project, ...get().projects] })
        return project
      },

      reviewProject: (id, action, note) =>
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, status: action === 'publish' ? 'live' : 'coaching', reviewedAt: now(), reviewNote: note } : p,
          ),
        }),

      invest: async (projectId, amount) => {
        if (get().selfLocked) throw new Error('Akun sedang dikunci mandiri. Buka kunci di Radar Ancaman.')
        const me = get().users.find((u) => u.id === get().sessionUserId)!
        const project = get().projects.find((p) => p.id === projectId)!
        if (project.status !== 'live') throw new Error('Proyek ini tidak sedang menggalang dana.')
        const room = project.target - project.raised
        if (amount < 50_000) throw new Error('Minimal investasi Rp50.000.')
        if (amount > room) throw new Error('Nominal melebihi sisa kebutuhan dana.')
        const block = await appendLedger(get, set, {
          type: 'investasi',
          projectId,
          amount,
          from: me.name,
          to: projectId,
          memo: 'Penyertaan dana akad mudharabah',
          ts: now(),
        })
        const raised = project.raised + amount
        const full = raised >= project.target
        set({
          investments: [...get().investments, { id: `${projectId}-${block.block}`, projectId, investorId: me.id, investorName: me.name, amount, createdAt: block.ts, hash: block.hash }],
          projects: get().projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  raised,
                  status: full ? 'running' : p.status,
                  stages: full ? p.stages.map((s, i) => (i === 0 ? { ...s, status: 'available' } : s)) : p.stages,
                  nextDue: full ? { date: daysFromNow(30), amount: Math.round((p.target * p.expectedReturnPct) / 100 / 12 / 10_000) * 10_000 } : p.nextDue,
                }
              : p,
          ),
        })
        if (amount >= 10_000_000) {
          set({
            alerts: [
              {
                id: `AL-${block.block}`,
                kind: 'velocity',
                severity: 'sedang',
                title: 'Pendanaan besar dari akun ritel',
                detail: `Transfer ${amount.toLocaleString('id-ID')} rupiah dalam satu transaksi, di atas pola biasa akun ini.`,
                subject: `${me.name} · ${projectId}`,
                createdAt: block.ts,
                status: 'open',
              },
              ...get().alerts,
            ],
          })
        }
        set({
          securityEvents: [
            { id: `SE-${block.block}`, userId: me.id, title: `Transfer pendanaan ${amount.toLocaleString('id-ID')}`, detail: `${projectId} · tercatat di blok #${block.block}`, createdAt: block.ts, outcome: 'aman' },
            ...get().securityEvents,
          ],
        })
        return block
      },

      disburse: async (projectId, stageN) => {
        const p = get().projects.find((x) => x.id === projectId)!
        const stage = p.stages.find((s) => s.n === stageN)!
        // Aturan akad: hanya tahap berstatus "available" yang bisa dicairkan.
        if (stage.status !== 'available') throw new Error('Tahap ini belum terbuka. Kirim laporan progres tahap sebelumnya.')
        const owner = get().users.find((u) => u.id === p.ownerId)!
        const block = await appendLedger(get, set, {
          type: 'pencairan',
          projectId,
          amount: stage.amount,
          from: `Escrow ${projectId}`,
          to: owner.name,
          memo: `Pencairan tahap ${stageN} — ${stage.label}`,
          ts: now(),
        })
        set({
          projects: get().projects.map((x) =>
            x.id === projectId ? { ...x, stages: x.stages.map((s) => (s.n === stageN ? { ...s, status: 'disbursed', disbursedAt: block.ts } : s)) } : x,
          ),
        })
        return block
      },

      reportProgress: (projectId, stageN, report) =>
        set({
          projects: get().projects.map((x) =>
            x.id === projectId
              ? {
                  ...x,
                  stages: x.stages.map((s) => {
                    if (s.n === stageN) return { ...s, status: 'reported', reportedAt: now(), report }
                    if (s.n === stageN + 1 && s.status === 'locked') return { ...s, status: 'available' }
                    return s
                  }),
                }
              : x,
          ),
        }),

      payProfitShare: async (projectId) => {
        const p = get().projects.find((x) => x.id === projectId)!
        if (!p.nextDue) throw new Error('Belum ada jadwal setoran.')
        const owner = get().users.find((u) => u.id === p.ownerId)!
        const amount = p.nextDue.amount
        const month = new Date().toLocaleDateString('id-ID', { month: 'long' })
        const block = await appendLedger(get, set, { type: 'setoran', projectId, amount, from: owner.name, to: `Escrow ${projectId}`, memo: `Setoran bagi hasil ${month}`, ts: now() })
        await appendLedger(get, set, { type: 'distribusi', projectId, amount, from: `Escrow ${projectId}`, to: `Investor ${projectId} (proporsional)`, memo: `Distribusi bagi hasil ${month} ke investor`, ts: now() })
        set({
          projects: get().projects.map((x) => (x.id === projectId ? { ...x, nextDue: { date: daysFromNow(30), amount } } : x)),
        })
        return block
      },

      resolveAlert: (id, status, resolution) =>
        set({ alerts: get().alerts.map((a) => (a.id === id ? { ...a, status, resolution } : a)) }),

      setSelfLock: (v) => {
        const me = get().sessionUserId
        set({
          selfLocked: v,
          securityEvents: [
            { id: `SE-lock-${Date.now()}`, userId: me ?? '', title: v ? 'Kunci mandiri diaktifkan' : 'Kunci mandiri dibuka', detail: v ? 'Semua transfer keluar ditahan' : 'Transfer kembali normal', createdAt: now(), outcome: v ? 'ditinjau' : 'aman' },
            ...get().securityEvents,
          ],
        })
      },

      /** Mode demo juri: ubah nominal satu blok TANPA menghitung ulang hash; panggil lagi untuk memulihkan. */
      tamperLedger: () => {
        const chain = get().ledger
        const t = get().tamper
        if (t) {
          set({ ledger: chain.map((b) => (b.block === t.block ? { ...b, amount: t.amount } : b)), tamper: null })
          return
        }
        if (chain.length < 3) return
        const target = chain[Math.floor(chain.length / 2)]
        set({
          ledger: chain.map((b) => (b.block === target.block ? { ...b, amount: b.amount * 10 } : b)),
          tamper: { block: target.block, amount: target.amount },
        })
      },

      updateProfile: (patch) => {
        const id = get().sessionUserId
        set({ users: get().users.map((u) => (u.id === id ? { ...u, ...patch, initials: initialsOf(patch.name ?? u.name) } : u)) })
      },

      updatePrefs: (patch) => {
        const id = get().sessionUserId
        set({ users: get().users.map((u) => (u.id === id ? { ...u, prefs: { ...DEFAULT_PREFS, ...u.prefs, ...patch } } : u)) })
      },

      markNotifsRead: (ids) => {
        const id = get().sessionUserId
        if (!id) return
        const prev = get().notifRead[id] ?? []
        const next = Array.from(new Set([...prev, ...ids]))
        if (next.length === prev.length) return
        set({ notifRead: { ...get().notifRead, [id]: next } })
      },

      createThread: ({ title, body, tag }) => {
        const me = get().users.find((u) => u.id === get().sessionUserId)!
        const t: ForumThread = { id: `TH-${Date.now()}`, authorId: me.id, authorName: me.name, authorRole: ROLE_LABEL[me.role], tag, title, body, createdAt: now(), likes: [], comments: [] }
        set({ forum: [t, ...get().forum] })
        return t
      },

      addComment: (threadId, body) => {
        const me = get().users.find((u) => u.id === get().sessionUserId)!
        const c = { id: `C-${Date.now()}`, authorId: me.id, authorName: me.name, authorRole: ROLE_LABEL[me.role], body, createdAt: now() }
        set({ forum: get().forum.map((t) => (t.id === threadId ? { ...t, comments: [...t.comments, c] } : t)) })
      },

      toggleLike: (threadId) => {
        const me = get().sessionUserId!
        set({ forum: get().forum.map((t) => (t.id === threadId ? { ...t, likes: t.likes.includes(me) ? t.likes.filter((x) => x !== me) : [...t.likes, me] } : t)) })
      },
    }),
    {
      name: 'artanaya-demo-v2',
      partialize: (s) => ({
        users: s.users,
        projects: s.projects,
        investments: s.investments,
        alerts: s.alerts,
        securityEvents: s.securityEvents,
        ledger: s.ledger,
        forum: s.forum,
        notifRead: s.notifRead,
        seedVersion: s.seedVersion,
        ready: s.ready,
        selfLocked: s.selfLocked,
        tamper: s.tamper,
      }),
    },
  ),
)

// Sinkron antar-tab: buka tab Nelayan & tab Admin berdampingan saat demo.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'artanaya-demo-v2') void useStore.persist.rehydrate()
  })
}

/* ---------- selector bantu ---------- */

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? parts[0]?.[1] ?? '')).toUpperCase()
}

export const useMe = () => useStore((s) => s.users.find((u) => u.id === s.sessionUserId) ?? null)

export function investorReturns(state: Pick<Data, 'ledger' | 'investments' | 'projects'>, investorId: string) {
  let total = 0
  for (const b of state.ledger) {
    if (b.type !== 'distribusi') continue
    const mine = state.investments.filter((i) => i.projectId === b.projectId && i.investorId === investorId).reduce((a, i) => a + i.amount, 0)
    if (!mine) continue
    const all = state.investments.filter((i) => i.projectId === b.projectId && i.createdAt <= b.ts).reduce((a, i) => a + i.amount, 0)
    if (all) total += (b.amount * mine) / all
  }
  return Math.round(total)
}

export function walletOf(ledger: LedgerBlock[], ownerName: string) {
  const txs = ledger.filter((b) => (b.type === 'pencairan' && b.to === ownerName) || (b.type === 'setoran' && b.from === ownerName))
  const received = txs.filter((b) => b.type === 'pencairan').reduce((a, b) => a + b.amount, 0)
  const paid = txs.filter((b) => b.type === 'setoran').reduce((a, b) => a + b.amount, 0)
  return { txs: [...txs].reverse(), received, paid, balance: received - paid }
}
