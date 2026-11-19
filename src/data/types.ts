import type { ScoreResult, SignalInput } from '@/lib/scoring'
import type { BusinessType } from '@/lib/scoring.config'
import type { LedgerBlock } from '@/lib/ledger'

export type Role = 'nelayan' | 'investor' | 'admin'

export type User = {
  id: string
  role: Role
  name: string
  initials: string
  location: string
  phone: string
  kusuka?: string
  kub?: string
  facilitator?: { name: string; phone: string; org: string }
  photo?: string
  email?: string
  prefs?: UserPrefs
  joinedAt: string
}

export type UserPrefs = {
  notifWhatsapp: boolean
  notifPush: boolean
  loginAlert: boolean
  twoStep: boolean
  hideBalance: boolean
}

export type ForumComment = { id: string; authorId: string; authorName: string; authorRole: string; body: string; createdAt: string }

export type ForumThread = {
  id: string
  authorId: string
  authorName: string
  authorRole: string
  tag: string
  title: string
  body: string
  createdAt: string
  likes: string[]
  comments: ForumComment[]
}

export type ProjectStatus = 'review' | 'coaching' | 'live' | 'running' | 'done'

export type StageStatus = 'locked' | 'available' | 'disbursed' | 'reported'

export type Stage = {
  n: number
  label: string
  amount: number
  status: StageStatus
  disbursedAt?: string
  reportedAt?: string
  report?: string
}

export type Project = {
  id: string
  ownerId: string
  title: string
  type: BusinessType
  location: string
  summary: string
  plan: string
  target: number
  raised: number
  investorShare: number // nisbah untuk investor, mis. 0.4
  tenorMonths: number
  expectedReturnPct: number // estimasi bagi hasil per tahun untuk investor
  status: ProjectStatus
  signals: SignalInput
  score: ScoreResult
  stages: Stage[]
  nextDue?: { date: string; amount: number }
  createdAt: string
  reviewedAt?: string
  reviewNote?: string
}

export type Investment = {
  id: string
  projectId: string
  investorId: string
  investorName: string
  amount: number
  createdAt: string
  hash?: string
}

export type AlertKind = 'geofence' | 'liveness' | 'device' | 'velocity'

export type FraudAlert = {
  id: string
  kind: AlertKind
  severity: 'tinggi' | 'sedang' | 'rendah'
  title: string
  detail: string
  subject: string
  createdAt: string
  status: 'open' | 'actioned' | 'dismissed'
  resolution?: string
}

export type SecurityEvent = {
  id: string
  userId: string
  title: string
  detail: string
  createdAt: string
  outcome: 'aman' | 'diblokir' | 'ditinjau'
}

export type { LedgerBlock }
