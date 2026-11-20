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
  budidaya: 'bg-kelp-950',
  tangkap: 'bg-kelp-950',
  garam: 'bg-kelp-950',
  olahan: 'bg-kelp-950',
}

const PROJECT_PHOTO: Record<string, string> = {
  'PRJ-0021': 'rumput-laut-sagara',
  'PRJ-0027': 'rumput-laut-semau',
  'PRJ-0024': 'kapal-tuna',
  'PRJ-0033': 'jaring-mesin-perahu',
  'PRJ-0029': 'garam',
  'PRJ-0031': 'abon-tenggiri',
  'PRJ-0034': 'keramba-kerapu',
}
const TYPE_PHOTO: Record<BusinessType, string> = {
  budidaya: 'rumput-laut-sagara',
  tangkap: 'tangkap-umum',
  garam: 'garam-umum',
  olahan: 'olahan-umum',
}

/** Foto proyek: sesuai proyek bila ada, jika tidak sesuai jenis usaha (sumber: docs/kredit-foto.md). */
export function projectPhoto(id: string, type: BusinessType) {
  return `/projects/${PROJECT_PHOTO[id] ?? TYPE_PHOTO[type]}.jpg`
}

/** Sampul proyek: foto lapangan + gradasi gelap agar teks tetap terbaca. */
export function ProjectCover({ type, id, className, children }: { type: BusinessType; id: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('relative overflow-hidden bg-kelp-950 text-white', TYPE_BG[type], className)}>
      <img src={projectPhoto(id, type)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover animate-[fade_.5s_ease-out_both]" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/55" />
      <span className="absolute bottom-3 right-3 flex size-11 items-center justify-center rounded-full bg-sun-500 text-white">
        <Icon name={TYPE_ICON[type]} size={22} />
      </span>
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
    <button onClick={onOpen} className="block w-full overflow-hidden press rounded-md bg-surface text-left hover:shadow-soft">
      <ProjectCover type={p.type} id={p.id} className="m-2 h-36 rounded-[22px] px-4 pt-3">
        <span className="inline-flex h-7 items-center gap-1 rounded-full bg-black/40 px-3 text-2xs font-medium backdrop-blur-sm">
          <Icon name={TYPE_ICON[p.type]} size={16} /> {BUSINESS_LABEL[p.type]}
        </span>
      </ProjectCover>
      <div className="px-4 pb-4 pt-2">
        <div className="mb-3 flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-snug text-ink">{p.title}</p>
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
          <span className="num rounded-full bg-sun-500 px-2.5 py-0.5 text-2xs font-semibold text-white">±{p.expectedReturnPct}%/thn</span>
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

export function Avatar({ initials, photo, tone = 'sun', size = 48 }: { initials: string; photo?: string; tone?: 'sun' | 'kelp'; size?: number }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover object-[50%_22%] ring-2 ring-white"
      />
    )
  }
  return (
    <span style={{ width: size, height: size }} className={cn('flex shrink-0 items-center justify-center rounded-full text-sm font-bold', tone === 'sun' ? 'bg-sun-500 text-white' : 'bg-kelp-700 text-white')}>
      {initials}
    </span>
  )
}
