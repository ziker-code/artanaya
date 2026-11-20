import type { ReactNode } from 'react'
import { Tabs as RTabs } from 'radix-ui'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'
import { IconButton } from './Button'

export function TopBar({ title, onBack, trailing, subtitle }: { title: string; subtitle?: string; onBack?: () => void; trailing?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 bg-paper/85 px-5 backdrop-blur-md">
      {onBack ? <IconButton icon="caret-left" label="Kembali" onClick={onBack} /> : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-semibold text-ink">{title}</h1>
        {subtitle && <p className="truncate text-2xs text-ink-muted">{subtitle}</p>}
      </div>
      {trailing}
    </header>
  )
}

export type NavItem = { key: string; label: string; icon: IconName }

/**
 * Bottom nav melayang: pil hitam, tab aktif = lingkaran lime yang bergeser (animasi layout).
 * Label tampil untuk tab aktif agar tetap jelas bagi pengguna baru.
 */
export function BottomNav({ items, active, onSelect }: { items: NavItem[]; active: string; onSelect: (key: string) => void }) {
  return (
    <nav aria-label="Navigasi utama" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] px-6 pb-[calc(14px+env(safe-area-inset-bottom))]">
      <ul className="pointer-events-auto mx-auto flex w-fit items-center gap-1 rounded-full bg-kelp-950 p-1.5 shadow-float">
        {items.map((it) => {
          const on = it.key === active
          return (
            <li key={it.key}>
              <button
                onClick={() => onSelect(it.key)}
                aria-current={on ? 'page' : undefined}
                aria-label={it.label}
                className={cn('press relative flex h-12 items-center justify-center rounded-full', on ? 'px-4 text-white' : 'w-12 text-white/75 hover:text-white')}
              >
                {on && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-sun-500" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="relative flex items-center gap-1.5">
                  <Icon name={it.icon} size={22} filled={on} />
                  {on && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} className="overflow-hidden whitespace-nowrap text-[13px] font-semibold">
                      {it.label}
                    </motion.span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Pemilih segmen: pil putih, segmen aktif lime (seperti Today / Weekly / Monthly). */
export function Segmented({ options, value, onChange, label }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <RTabs.Root value={value} onValueChange={onChange}>
      <RTabs.List aria-label={label} className="flex gap-2">
        {options.map((o) => (
          <RTabs.Trigger
            key={o.value}
            value={o.value}
            className="press relative h-11 flex-1 rounded-full bg-white px-4 text-sm font-medium text-ink data-[state=active]:font-semibold"
          >
            {o.value === value && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-full bg-sun-500" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{o.label}</span>
          </RTabs.Trigger>
        ))}
      </RTabs.List>
    </RTabs.Root>
  )
}

/** Chip filter yang bisa di-scroll horizontal. */
export function ChipRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" role="radiogroup">
      {options.map((o) => {
        const on = o === value
        return (
          <button
            key={o}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={cn('press h-10 shrink-0 rounded-full px-4 text-sm font-medium', on ? 'bg-kelp-950 text-white' : 'bg-white text-ink hover:bg-surface')}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
