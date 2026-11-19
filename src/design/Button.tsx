import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  primary: 'bg-sun-500 text-kelp-950 hover:bg-sun-600 active:bg-sun-600',
  secondary: 'bg-kelp-900 text-paper hover:bg-kelp-800 active:bg-kelp-950',
  ghost: 'bg-transparent text-ink border border-line hover:bg-paper-sunk',
  danger: 'bg-coral-600 text-white hover:bg-coral-700',
  quiet: 'bg-transparent text-kelp-700 hover:bg-kelp-100 px-3',
}

const sizes: Record<Size, string> = {
  md: 'h-12 px-5 text-[15px] gap-2 rounded-sm',
  sm: 'h-10 px-4 text-sm gap-1.5 rounded-sm',
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

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block,
  loading,
  disabled,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex select-none items-center justify-center font-semibold transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
    >
      {loading ? <Spinner /> : icon && <Icon name={icon} size={size === 'md' ? 20 : 16} />}
      <span>{children}</span>
      {iconRight && !loading && <Icon name={iconRight} size={size === 'md' ? 20 : 16} />}
    </button>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  )
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  label: string
  tone?: 'plain' | 'onDark' | 'soft'
  badge?: boolean
}

export function IconButton({ icon, label, tone = 'plain', badge, className, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex size-11 items-center justify-center rounded-full transition-colors',
        tone === 'plain' && 'text-ink hover:bg-paper-sunk',
        tone === 'soft' && 'bg-surface text-ink border border-line hover:bg-paper-sunk',
        tone === 'onDark' && 'text-paper hover:bg-white/10',
        className,
      )}
    >
      <Icon name={icon} size={24} />
      {badge && (
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-coral-600 ring-2 ring-paper" />
      )}
    </button>
  )
}
