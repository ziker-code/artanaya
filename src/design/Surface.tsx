import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { formatRupiah, shortHash } from '@/lib/format'
import { Icon, type IconName } from './Icon'

/** Kartu biasa: border, tanpa bayangan. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn('rounded-md border border-line bg-surface', className)} />
}

/** Satu kartu hero per layar: hijau tua, tekstur halus. */
export function HeroCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        'paper-grain relative overflow-hidden rounded-lg bg-kelp-900 p-5 text-paper',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 320 120"
        className="pointer-events-none absolute -right-10 -top-6 w-[260px] text-kelp-700/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {[0, 14, 28, 42, 56].map((y) => (
          <path key={y} d={`M0 ${30 + y} C 40 ${18 + y}, 80 ${42 + y}, 120 ${30 + y} S 200 ${18 + y}, 240 ${30 + y} S 300 ${42 + y}, 320 ${30 + y}`} />
        ))}
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
      {action}
    </div>
  )
}

type ListRowProps = {
  icon?: IconName
  iconTone?: 'kelp' | 'sun' | 'coral' | 'tide' | 'plain'
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  chevron?: boolean
}

const iconTones = {
  kelp: 'bg-kelp-100 text-kelp-700',
  sun: 'bg-sun-100 text-sun-600',
  coral: 'bg-coral-100 text-coral-700',
  tide: 'bg-tide-100 text-tide-600',
  plain: 'bg-paper-sunk text-ink',
}

export function ListRow({ icon, iconTone = 'plain', title, subtitle, trailing, onClick, chevron }: ListRowProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 py-3 text-left',
        onClick && '-mx-2 rounded-sm px-2 transition-colors hover:bg-paper-sunk',
      )}
    >
      {icon && (
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', iconTones[iconTone])}>
          <Icon name={icon} size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">{title}</span>
        {subtitle && <span className="block truncate text-sm text-ink-muted">{subtitle}</span>}
      </span>
      {trailing}
      {chevron && <Icon name="caret-right" className="shrink-0 text-ink-faint" />}
    </Tag>
  )
}

type TxRowProps = {
  title: string
  date: string
  amount: number
  direction: 'in' | 'out'
  hash?: string
}

/** Baris transaksi Dompetku / Ledger. Nominal rata kanan, angka tabular. */
export function TxRow({ title, date, amount, direction, hash }: TxRowProps) {
  const incoming = direction === 'in'
  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          incoming ? 'bg-kelp-100 text-kelp-700' : 'bg-coral-100 text-coral-700',
        )}
      >
        <Icon name={incoming ? 'arrow-down-left' : 'arrow-up-right'} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">{title}</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-ink-muted">
          <span>{date}</span>
          {hash && (
            <>
              <span aria-hidden>·</span>
              <code className="truncate font-mono text-xs text-tide-600">{shortHash(hash, 4, 4)}</code>
            </>
          )}
        </span>
      </span>
      <span className={cn('num shrink-0 text-[15px] font-bold', incoming ? 'text-kelp-700' : 'text-coral-700')}>
        {incoming ? '+' : '−'}
        {formatRupiah(amount)}
      </span>
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-line', className)} />
}
