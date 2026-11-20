import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { formatRupiah, shortHash } from '@/lib/format'
import { Icon, type IconName } from './Icon'

/** Kartu putih membulat besar, tanpa garis tepi. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn('rounded-md bg-surface', className)} />
}

/** Bintang empat sudut khas referensi. */
export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
    </svg>
  )
}

/** Kartu hero hitam dengan bintang lime + strip lime di sisi kanan (seperti kartu VISA). */
export function HeroCard({ className, children, side, ...rest }: HTMLAttributes<HTMLDivElement> & { side?: ReactNode }) {
  return (
    <div
      {...rest}
      data-hero
      className={cn('relative flex overflow-hidden rounded-lg bg-kelp-950 text-white shadow-float animate-[rise_.55s_var(--ease-out-soft)_both]', className)}
    >
      <Sparkle className="pointer-events-none absolute left-[52%] top-6 size-5 text-sun-500 animate-[shimmer-star_3.2s_ease-in-out_infinite]" />
      <Sparkle className="pointer-events-none absolute left-[60%] top-[58%] size-2.5 text-sun-500/70 animate-[shimmer-star_2.6s_ease-in-out_.6s_infinite]" />
      <Sparkle className="pointer-events-none absolute left-[78%] top-[38%] size-3 text-white/40 animate-[shimmer-star_3.6s_ease-in-out_1.1s_infinite]" />
      <div className="relative min-w-0 flex-1 p-5">{children}</div>
      {side !== undefined && <div className="relative my-3 mr-3 flex w-14 shrink-0 items-center justify-center rounded-[22px] bg-sun-500 text-kelp-950">{side}</div>}
    </div>
  )
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h2>
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
  kelp: 'bg-kelp-950 text-sun-500',
  sun: 'bg-sun-500 text-kelp-950',
  coral: 'bg-coral-100 text-coral-700',
  tide: 'bg-kelp-950 text-white',
  plain: 'bg-kelp-950 text-white',
}

export function ListRow({ icon, iconTone = 'plain', title, subtitle, trailing, onClick, chevron }: ListRowProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={cn('flex w-full items-center gap-3 py-3 text-left', onClick && 'press -mx-2 rounded-[18px] px-2 hover:bg-paper-sunk/60')}>
      {icon && (
        <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-full', iconTones[iconTone])}>
          <Icon name={icon} size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">{title}</span>
        {subtitle && <span className="block truncate text-2xs text-ink-muted">{subtitle}</span>}
      </span>
      {trailing}
      {chevron && <Icon name="caret-right" size={18} className="shrink-0 text-ink-faint" />}
    </Tag>
  )
}

type TxRowProps = { title: string; date: string; amount: number; direction: 'in' | 'out'; hash?: string }

/** Baris transaksi gaya "Recent Activity": ikon hitam bulat, nominal tebal di kanan. */
export function TxRow({ title, date, amount, direction, hash }: TxRowProps) {
  const incoming = direction === 'in'
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-kelp-950 text-white">
        <Icon name={incoming ? 'arrow-down-left' : 'arrow-up-right'} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">{title}</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-2xs text-ink-muted">
          <span>{date}</span>
          {hash && (
            <>
              <span aria-hidden>·</span>
              <code className="truncate font-mono text-[11px] text-ink-faint">{shortHash(hash, 4, 4)}</code>
            </>
          )}
        </span>
      </span>
      <span className={cn('num shrink-0 text-[15px] font-semibold', incoming ? 'text-ink' : 'text-ink')}>
        {incoming ? '+' : '−'} {formatRupiah(amount)}
      </span>
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-paper-sunk', className)} />
}

/** Wadah daftar putih dengan "tab" kecil di tengah atas (seperti panel Recent Activity). */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('relative rounded-lg bg-surface px-4 pb-2 pt-3', className)}>
      <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-full bg-surface" />
      {children}
    </div>
  )
}
