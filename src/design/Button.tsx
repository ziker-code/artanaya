import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  primary: 'bg-sun-500 text-white hover:bg-sun-600',
  secondary: 'bg-kelp-900 text-white hover:bg-kelp-800',
  ghost: 'bg-white text-ink hover:bg-paper-sunk',
  danger: 'bg-coral-600 text-white hover:bg-coral-700',
  quiet: 'bg-transparent text-ink hover:bg-white/60 px-3',
}

const sizes: Record<Size, string> = {
  md: 'h-13 px-6 text-[15px] gap-2',
  sm: 'h-10 px-4 text-sm gap-1.5',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconRight?: IconName
  block?: boolean
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', icon, iconRight, block, loading, disabled, className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'press inline-flex select-none items-center justify-center rounded-full font-semibold',
        'disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
    >
      {loading ? <Spinner /> : icon && <Icon name={icon} size={size === 'md' ? 20 : 18} />}
      <span>{children}</span>
      {iconRight && !loading && <Icon name={iconRight} size={size === 'md' ? 20 : 16} />}
    </button>
  )
}

function Spinner() {
  return <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  label: string
  tone?: 'plain' | 'onDark' | 'soft' | 'lime' | 'dark'
  badge?: boolean
}

/** Tombol ikon bulat — putih di atas sage, seperti lonceng di referensi. */
export function IconButton({ icon, label, tone = 'soft', badge, className, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={cn(
        'press relative inline-flex size-12 shrink-0 items-center justify-center rounded-full',
        tone === 'plain' && 'text-ink hover:bg-white/60',
        tone === 'soft' && 'bg-white text-ink shadow-soft hover:bg-surface',
        tone === 'lime' && 'bg-sun-500 text-white',
        tone === 'dark' && 'bg-kelp-900 text-white',
        tone === 'onDark' && 'bg-white/10 text-white hover:bg-white/20',
        className,
      )}
    >
      <Icon name={icon} size={22} />
      {badge && <span className="absolute right-3 top-3 size-2 rounded-full bg-sun-500 ring-2 ring-white" />}
    </button>
  )
}

/** Aksi cepat: lingkaran besar + label di bawah (Send / Bill / Mobile / More di referensi). */
export function QuickAction({ icon, label, onClick, accent }: { icon: IconName; label: string; onClick?: () => void; accent?: boolean }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2">
      <span
        className={cn(
          'press flex size-[60px] items-center justify-center rounded-full transition-colors',
          accent ? 'bg-sun-500 text-white' : 'bg-white text-ink shadow-soft group-hover:bg-surface',
        )}
      >
        <Icon name={icon} size={24} />
      </span>
      <span className="text-2xs font-medium text-ink">{label}</span>
    </button>
  )
}
