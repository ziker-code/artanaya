import { cn } from '@/lib/cn'

/**
 * Logo ARTANAYA v2: lingkaran hitam + layar perahu & gelombang lime, wordmark huruf kecil.
 * File SVG yang sama ada di public/logo.svg (favicon & ikon PWA).
 */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#070806" />
      <path d="M25 9.5 25 29h11.5C35 21 31 14 25 9.5Z" fill="#a6e465" />
      <path d="M22.5 14 22.5 29H14c1.6-6 4.6-11 8.5-15Z" fill="#a6e465" opacity=".55" />
      <path d="M10 33.5c2.3 0 3.4-1.6 5.6-1.6s3.4 1.6 5.6 1.6 3.4-1.6 5.6-1.6 3.4 1.6 5.6 1.6 3.4-1.6 5.6-1.6" fill="none" stroke="#a6e465" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 38.5c1.7 0 2.6-1.1 4.2-1.1s2.5 1.1 4.2 1.1 2.6-1.1 4.2-1.1 2.5 1.1 4.2 1.1" fill="none" stroke="#ffffff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ tone = 'ink', className, size = 36 }: { tone?: 'ink' | 'paper'; className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className={cn('text-[22px] font-semibold lowercase tracking-tight', tone === 'ink' ? 'text-ink' : 'text-white')}>artanaya</span>
    </span>
  )
}
