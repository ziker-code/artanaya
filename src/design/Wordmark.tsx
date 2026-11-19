import { cn } from '@/lib/cn'

/**
 * Wordmark SEMENTARA sampai file logo dari klien masuk (PRD §6.6).
 * Hanya teks, sengaja tanpa simbol karangan.
 */
export function Wordmark({ tone = 'ink', className }: { tone?: 'ink' | 'paper'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-[0.18em] font-sans text-[22px] font-extrabold uppercase tracking-[0.18em]',
        tone === 'ink' ? 'text-kelp-900' : 'text-paper',
        className,
      )}
    >
      Artanaya
      <span aria-hidden className="inline-block size-[0.28em] translate-y-[-0.05em] rounded-full bg-sun-500" />
    </span>
  )
}
