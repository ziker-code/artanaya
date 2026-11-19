import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type BadgeTone = 'kelp' | 'sun' | 'coral' | 'tide' | 'neutral' | 'onDark'

const badgeTones: Record<BadgeTone, string> = {
  kelp: 'bg-kelp-100 text-kelp-700',
  sun: 'bg-sun-100 text-[#7a5410]',
  coral: 'bg-coral-100 text-coral-700',
  tide: 'bg-tide-100 text-tide-600',
  neutral: 'bg-paper-sunk text-ink-muted',
  onDark: 'bg-white/12 text-paper',
}

export function Badge({ tone = 'neutral', icon, children }: { tone?: BadgeTone; icon?: IconName; children: ReactNode }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-2xs font-semibold', badgeTones[tone])}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  )
}

export type ScoreLevel = 'high' | 'mid' | 'low' | 'initial'

export function scoreLevel(score: number, complete = true): ScoreLevel {
  if (!complete) return 'initial'
  if (score >= 70) return 'high'
  if (score >= 50) return 'mid'
  return 'low'
}

const scoreMeta: Record<ScoreLevel, { label: string; tone: BadgeTone; ring: string }> = {
  high: { label: 'Skor Tinggi', tone: 'kelp', ring: 'text-kelp-700' },
  mid: { label: 'Skor Sedang', tone: 'sun', ring: 'text-sun-500' },
  low: { label: 'Perlu Pembinaan', tone: 'coral', ring: 'text-coral-600' },
  initial: { label: 'Skor Awal', tone: 'tide', ring: 'text-tide-600' },
}

export function ScoreBadge({ score, complete = true }: { score: number; complete?: boolean }) {
  const meta = scoreMeta[scoreLevel(score, complete)]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

/** Lingkaran skor kecil untuk kartu proyek. */
export function ScoreDial({ score, complete = true, size = 56 }: { score: number; complete?: boolean; size?: number }) {
  const meta = scoreMeta[scoreLevel(score, complete)]
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Skor ${score} dari 100, ${meta.label}`}>
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="5" className="stroke-paper-sunk" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          stroke="currentColor"
          className={meta.ring}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <span className="num absolute inset-0 flex items-center justify-center text-base font-bold text-ink">{score}</span>
    </div>
  )
}

export function ProgressBar({ value, tone = 'sun', onDark }: { value: number; tone?: 'sun' | 'kelp'; onDark?: boolean }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 w-full overflow-hidden rounded-full', onDark ? 'bg-white/15' : 'bg-paper-sunk')}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out-soft', tone === 'sun' ? 'bg-sun-500' : 'bg-kelp-700')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-start gap-2" aria-label="Langkah">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="flex flex-1 flex-col gap-2" aria-current={active ? 'step' : undefined}>
            <span className={cn('h-1 rounded-full', done || active ? 'bg-kelp-700' : 'bg-line')} />
            <span className={cn('text-2xs font-semibold', active ? 'text-ink' : 'text-ink-muted')}>
              {i + 1}. {s}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function Notice({ tone = 'sun', icon = 'calendar', title, children }: { tone?: 'sun' | 'tide' | 'coral'; icon?: IconName; title: ReactNode; children?: ReactNode }) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-md p-4',
        tone === 'sun' && 'bg-sun-100 text-[#5c3f0a]',
        tone === 'tide' && 'bg-tide-100 text-tide-600',
        tone === 'coral' && 'bg-coral-100 text-coral-700',
      )}
    >
      <Icon name={icon} size={24} className="shrink-0" />
      <div className="min-w-0 text-sm">
        <p className="font-bold">{title}</p>
        {children && <div className="mt-0.5 opacity-90">{children}</div>}
      </div>
    </div>
  )
}

export function DisclaimerBar() {
  return (
    <p className="px-5 py-2 text-center text-2xs text-ink-faint">
      Prototipe lomba — bukan layanan urun dana berizin OJK. Seluruh data dan transaksi adalah simulasi.
    </p>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-sm bg-paper-sunk', className)} />
}

export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-paper-sunk text-ink-muted">
        <Icon name={icon} size={24} />
      </span>
      <p className="font-bold text-ink">{title}</p>
      {body && <p className="max-w-[28ch] text-sm text-ink-muted">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
