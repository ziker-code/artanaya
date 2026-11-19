import type { ReactNode } from 'react'
import { Tabs as RTabs } from 'radix-ui'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'
import { IconButton } from './Button'

export function TopBar({ title, onBack, trailing, subtitle }: { title: string; subtitle?: string; onBack?: () => void; trailing?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-1 bg-paper/90 px-2 backdrop-blur-md">
      {onBack ? <IconButton icon="caret-left" label="Kembali" onClick={onBack} /> : <span className="w-3" />}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-bold text-ink">{title}</h1>
        {subtitle && <p className="truncate text-2xs text-ink-muted">{subtitle}</p>}
      </div>
      {trailing}
    </header>
  )
}

export type NavItem = { key: string; label: string; icon: IconName }

/** Bottom nav: ikon Fill + titik kuning untuk tab aktif. Label selalu tampil. */
export function BottomNav({ items, active, onSelect }: { items: NavItem[]; active: string; onSelect: (key: string) => void }) {
  return (
    <nav aria-label="Navigasi utama" className="sticky bottom-0 z-20 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="flex">
        {items.map((it) => {
          const on = it.key === active
          return (
            <li key={it.key} className="flex-1">
              <button
                onClick={() => onSelect(it.key)}
                aria-current={on ? 'page' : undefined}
                className={cn('flex h-16 w-full flex-col items-center justify-center gap-0.5 transition-colors', on ? 'text-kelp-900' : 'text-ink-muted hover:text-ink')}
              >
                <Icon name={it.icon} size={24} filled={on} />
                <span className={cn('text-[11px] leading-4', on ? 'font-bold' : 'font-medium')}>{it.label}</span>
                <span className={cn('size-1 rounded-full', on ? 'bg-sun-500' : 'bg-transparent')} />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Segmented control untuk filter/tab ringan. */
export function Segmented({ options, value, onChange, label }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <RTabs.Root value={value} onValueChange={onChange}>
      <RTabs.List aria-label={label} className="flex gap-1 rounded-sm bg-paper-sunk p-1">
        {options.map((o) => (
          <RTabs.Trigger
            key={o.value}
            value={o.value}
            className="h-9 flex-1 rounded-[7px] px-3 text-sm font-semibold text-ink-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-[0_1px_2px_rgb(15_42_33/0.12)]"
          >
            {o.label}
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
            className={cn(
              'h-9 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors',
              on ? 'border-kelp-900 bg-kelp-900 text-paper' : 'border-line bg-surface text-ink hover:bg-paper-sunk',
            )}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
