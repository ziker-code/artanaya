import { useState, type ReactNode } from 'react'
import { Badge, Icon, ProgressBar, ScoreDial, type IconName } from '@/design'
import type { Project, ProjectStatus } from '@/data/types'
import { BUSINESS_LABEL, type BusinessType } from '@/lib/scoring.config'
import { formatRupiah } from '@/lib/format'
import { cn } from '@/lib/cn'
import { toast } from '@/app/toast'

export const TYPE_ICON: Record<BusinessType, IconName> = {
  budidaya: 'plant',
  tangkap: 'fish',
  garam: 'drop',
  olahan: 'cooking-pot',
}

const TYPE_BG: Record<BusinessType, string> = {
  budidaya: 'bg-kelp-700',
  tangkap: 'bg-tide-600',
  garam: 'bg-[#8a6a3b]',
  olahan: 'bg-coral-700',
}

/** Sampul proyek bergaya ilustrasi garis — pengganti foto stok. */
export function ProjectCover({ type, id, className, children }: { type: BusinessType; id: string; className?: string; children?: ReactNode }) {
  const seed = Number(id.replace(/\D/g, '')) || 1
  return (
    <div className={cn('paper-grain relative overflow-hidden text-white', TYPE_BG[type], className)}>
      <svg aria-hidden viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 size-full text-white/18" fill="none" stroke="currentColor" strokeWidth="1.4">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 40 + i * 18 + (seed % 7)
          const a = 10 + ((seed * (i + 3)) % 14)
          return <path key={i} d={`M-10 ${y} C 60 ${y - a}, 120 ${y + a}, 200 ${y} S 340 ${y - a}, 410 ${y}`} />
        })}
      </svg>
      <Icon name={TYPE_ICON[type]} size={32} className="absolute bottom-3 right-4 text-white/35" />
      <div className="relative">{children}</div>
    </div>
  )
}

export const STATUS_META: Record<ProjectStatus, { label: string; tone: 'neutral' | 'kelp' | 'sun' | 'coral' | 'tide' }> = {
  review: { label: 'Menunggu verifikasi', tone: 'sun' },
  coaching: { label: 'Perlu pembinaan', tone: 'coral' },
  live: { label: 'Menggalang dana', tone: 'tide' },
  running: { label: 'Berjalan', tone: 'kelp' },
  done: { label: 'Selesai', tone: 'neutral' },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const m = STATUS_META[status]
  return <Badge tone={m.tone}>{m.label}</Badge>
}

export function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const pct = (p.raised / p.target) * 100
  return (
    <button onClick={onOpen} className="block w-full overflow-hidden rounded-md border border-line bg-surface text-left transition-colors hover:border-kelp-300">
      <ProjectCover type={p.type} id={p.id} className="h-28 px-4 pt-3">
        <span className="inline-flex h-6 items-center gap-1 rounded-full bg-black/25 px-2.5 text-2xs font-semibold backdrop-blur-sm">
          <Icon name={TYPE_ICON[p.type]} size={16} /> {BUSINESS_LABEL[p.type]}
        </span>
      </ProjectCover>
      <div className="p-4">
        <div className="mb-3 flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold leading-snug text-ink">{p.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted">
              <Icon name="map-pin" size={16} /> <span className="truncate">{p.location}</span>
            </p>
          </div>
          <ScoreDial score={p.score.score} complete={p.score.complete} size={52} />
        </div>
        <ProgressBar value={pct} />
        <div className="mt-2 flex items-baseline justify-between text-sm">
          <span>
            <b className="num text-ink">{formatRupiah(p.raised)}</b>
            <span className="text-ink-muted"> / {formatRupiah(p.target)}</span>
          </span>
          <span className="num font-semibold text-kelp-700">±{p.expectedReturnPct}%/thn</span>
        </div>
      </div>
    </button>
  )
}

export function KV({ k, v, strong }: { k: ReactNode; v: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <span className="text-ink-muted">{k}</span>
      <span className={cn('text-right text-ink', strong ? 'num font-bold' : 'font-semibold')}>{v}</span>
    </div>
  )
}

/** Jalankan aksi async dengan state loading + toast error. */
export function useAction<A extends unknown[], R>(fn: (...a: A) => Promise<R>) {
  const [busy, setBusy] = useState(false)
  const run = async (...a: A): Promise<R | undefined> => {
    setBusy(true)
    try {
      return await fn(...a)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Terjadi kesalahan')
      return undefined
    } finally {
      setBusy(false)
    }
  }
  return [run, busy] as const
}

export function PageHeader({ eyebrow, title, trailing }: { eyebrow?: string; title: string; trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-5 pb-2 pt-6">
      <div className="min-w-0 flex-1">
        {eyebrow && <p className="text-sm text-ink-muted">{eyebrow}</p>}
        <h1 className="truncate text-[24px] font-bold leading-tight tracking-tight text-ink">{title}</h1>
      </div>
      {trailing}
    </div>
  )
}

export function Avatar({ initials, tone = 'sun' }: { initials: string; tone?: 'sun' | 'kelp' }) {
  return (
    <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold', tone === 'sun' ? 'bg-sun-500 text-kelp-950' : 'bg-kelp-700 text-paper')}>
      {initials}
    </span>
  )
}
