import { cn } from '@/lib/cn'

/**
 * Logo resmi ARTANAYA dari klien (public/brand/*).
 * - LogoMark: emblem saja (A, kapal, gelombang, ikan, grafik) di dalam lingkaran putih.
 * - LogoFull: emblem + tulisan ARTANAYA + slogan.
 */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white', className)}
    >
      <img
        src={size > 72 ? '/brand/logo-mark.png' : '/brand/logo-mark-128.png'}
        alt=""
        width={size}
        height={size}
        className="size-full object-contain"
        draggable={false}
      />
    </span>
  )
}

export function LogoFull({ className }: { className?: string }) {
  return <img src="/brand/logo-full.png" alt="ARTANAYA — Bersama Nelayan, Menuju Masa Depan Berkelanjutan" className={cn('h-auto w-full object-contain', className)} draggable={false} />
}

export function Wordmark({ tone = 'ink', className, size = 36 }: { tone?: 'ink' | 'paper'; className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className={cn('text-[22px] font-semibold tracking-tight', tone === 'ink' ? 'text-ink' : 'text-white')}>ARTANAYA</span>
    </span>
  )
}
